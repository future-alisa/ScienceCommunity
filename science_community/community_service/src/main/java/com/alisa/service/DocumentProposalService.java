package com.alisa.service;

import com.alisa.mapper.DocumentMapper;
import com.alisa.mapper.DocumentProposalMapper;
import com.alisa.mapper.DocumentProposalMapper.Summary;
import com.alisa.model.Document;
import com.alisa.util.UUIDTool;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
@Transactional(isolation = Isolation.READ_COMMITTED)
public class DocumentProposalService {
    public record Contribution(String license, boolean canManage, boolean canPropose) {}
    public record Detail(Summary proposal, String baseContent, String proposedContent, boolean canEdit,
                         boolean canReview, boolean outdated) {}
    public record Draft(Integer revision, String content, String summary, boolean submit) {}
    public record Review(Integer revision, String action, String note) {}

    private final DocumentMapper documents;
    private final DocumentProposalMapper proposals;
    private final DocumentService documentService;
    private final CommunityAccessService access;
    private final ObjectMapper json;

    public DocumentProposalService(DocumentMapper documents, DocumentProposalMapper proposals, DocumentService documentService,
                                   CommunityAccessService access, ObjectMapper json) {
        this.documents = documents;
        this.proposals = proposals;
        this.documentService = documentService;
        this.access = access;
        this.json = json;
    }

    public Contribution contribution(String id) {
        var document = document(id);
        String viewer = access.optionalUserId();
        String license = proposals.license(id);
        return new Contribution(license, maintainer(document, viewer),
            license != null && !viewer.isBlank() && access.membership(document.getDocumentCommunityId()) != null);
    }

    public Contribution setLicense(String id, String license) {
        var document = lockedDocument(id);
        requireMaintainer(document, access.userId());
        String note = checkedText(license, 255, "授权说明");
        if (note.isEmpty()) proposals.disable(id); else proposals.setLicense(id, note);
        return contribution(id);
    }

    public List<Summary> list(String id) {
        var document = document(id);
        String viewer = access.optionalUserId();
        return proposals.list(id, viewer, maintainer(document, viewer));
    }

    public List<Summary> mine() {
        return proposals.mine(access.userId());
    }

    public String fork(String documentId) {
        var document = lockedDocument(documentId);
        access.requireMember(document.getDocumentCommunityId());
        requireOpen(documentId);
        String viewer = access.userId();
        String previous = proposals.active(documentId, viewer);
        if (previous != null && Objects.equals(proposals.base(previous), document.getDocumentContent())) return previous;
        String id = UUIDTool.getUUID();
        proposals.create(id, documentId, viewer, document.getDocumentContent());
        return id;
    }

    public Detail detail(String id) {
        var snapshot = proposals.snapshot(id);
        if (snapshot == null) throw failure(HttpStatus.NOT_FOUND, "修改提案不存在");
        var row = snapshot.header();
        var document = document(row.documentId());
        String viewer = access.optionalUserId();
        boolean owns = row.proposerId().equals(viewer);
        boolean reviewer = maintainer(document, viewer) && !owns;
        if (!owns && !"merged".equals(row.status()) && !(reviewer && List.of("submitted", "closed").contains(row.status())))
            throw failure(HttpStatus.NOT_FOUND, "修改提案不存在");
        String base = snapshot.baseContent();
        boolean open = proposals.license(row.documentId()) != null;
        return new Detail(row, base, snapshot.proposedContent(),
            owns && editable(row) && open && access.membership(row.communityId()) != null,
            reviewer && "submitted".equals(row.status()), !Objects.equals(base, document.getDocumentContent()));
    }

    public Detail save(String id, Draft change) {
        var document = lockedDocument(proposal(id).documentId());
        var row = proposal(id);
        access.requireMember(document.getDocumentCommunityId());
        if (!row.proposerId().equals(access.userId())) throw failure(HttpStatus.FORBIDDEN, "只有提案作者可以修改副本");
        requireOpen(row.documentId());
        requireRevision(row, change.revision());
        if (!editable(row)) throw failure(HttpStatus.CONFLICT, "只有草稿或退回的提案可以修改");
        String content = DocumentContentCodec.normalize(change.content(), json);
        String summary = checkedText(change.summary(), 255, "修改说明");
        if (change.submit()) {
            if (summary.isEmpty()) throw failure(HttpStatus.BAD_REQUEST, "请填写修改说明");
            String base = DocumentContentCodec.normalize(proposals.base(id), json);
            if (base.equals(content)) throw failure(HttpStatus.BAD_REQUEST, "正文没有修改");
            requireCurrentBase(row, document);
        }
        proposals.save(id, content, summary, change.submit() ? "submitted" : row.status());
        return detail(id);
    }

    public Detail review(String id, Review decision) {
        var document = lockedDocument(proposal(id).documentId());
        var row = proposal(id);
        String reviewer = access.userId();
        requireMaintainer(document, reviewer);
        if (row.proposerId().equals(reviewer)) throw failure(HttpStatus.FORBIDDEN, "请由另一位维护者审阅此提案");
        requireRevision(row, decision.revision());
        if (!"submitted".equals(row.status())) throw failure(HttpStatus.CONFLICT, "此提案已处理或尚未提交");
        String note = checkedText(decision.note(), 500, "审阅意见");
        String status;
        switch (Objects.toString(decision.action(), "")) {
            case "merge" -> {
                requireOpen(row.documentId());
                requireCurrentBase(row, document);
                document.setDocumentContent(proposals.proposed(id));
                documentService.upsert(document);
                status = "merged";
            }
            case "return" -> {
                if (note.isEmpty()) throw failure(HttpStatus.BAD_REQUEST, "请说明需要修改的内容");
                status = "returned";
            }
            case "close" -> status = "closed";
            default -> throw failure(HttpStatus.BAD_REQUEST, "无效的审阅操作");
        }
        String base = proposals.base(id);
        String proposed = proposals.proposed(id);
        proposals.decide(id, status, note, reviewer);
        return new Detail(proposal(id), base, proposed, false, false, !Objects.equals(base, document.getDocumentContent()));
    }

    private void requireCurrentBase(Summary row, Document current) {
        if (!Objects.equals(proposals.base(row.id()), current.getDocumentContent()))
            throw failure(HttpStatus.CONFLICT, "原文已更新，请从最新原文创建新副本并迁移修改");
    }

    private void requireRevision(Summary row, Integer revision) {
        if (revision == null || revision != row.revision())
            throw failure(HttpStatus.CONFLICT, "提案已更新，请刷新后继续");
    }

    private void requireOpen(String documentId) {
        if (proposals.license(documentId) == null) throw failure(HttpStatus.FORBIDDEN, "此文档暂未开放贡献");
    }

    private boolean editable(Summary row) {
        return "draft".equals(row.status()) || "returned".equals(row.status());
    }

    private boolean maintainer(Document document, String viewer) {
        return !viewer.isBlank() && access.membership(document.getDocumentCommunityId()) != null
            && (viewer.equals(document.getDocumentAuthorId()) || access.isManager(document.getDocumentCommunityId()));
    }

    private void requireMaintainer(Document document, String viewer) {
        if (!maintainer(document, viewer)) throw failure(HttpStatus.FORBIDDEN, "只有文档作者或社区管理员可以执行此操作");
    }

    private Document lockedDocument(String id) {
        var document = document(id);
        access.lock(document.getDocumentCommunityId());
        return document(id);
    }

    private Document document(String id) {
        var document = documents.selectByPrimaryKey(id);
        if (document == null) throw failure(HttpStatus.NOT_FOUND, "文档不存在");
        return document;
    }

    private Summary proposal(String id) {
        var row = proposals.find(id);
        if (row == null) throw failure(HttpStatus.NOT_FOUND, "修改提案不存在");
        return row;
    }

    private String checkedText(String value, int limit, String label) {
        String text = Objects.toString(value, "").strip();
        if (text.length() > limit) throw failure(HttpStatus.BAD_REQUEST, label + "不能超过 " + limit + " 个字符");
        return text;
    }

    private ResponseStatusException failure(HttpStatus status, String message) {
        return new ResponseStatusException(status, message);
    }
}
