package com.alisa.service.serviceImpl;

import com.alisa.dto.DocumentFilter;
import com.alisa.mapper.DocumentMapper;
import com.alisa.mapper.CategoryMapper;
import com.alisa.mapper.ManagementMapper;
import com.alisa.model.Document;
import com.alisa.service.DocumentService;
import com.alisa.service.CommunityAccessService;
import com.alisa.util.UUIDTool;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(isolation = org.springframework.transaction.annotation.Isolation.READ_COMMITTED)
public class DocumentServiceImpl implements DocumentService {
    @Autowired private DocumentMapper documents;
    @Autowired private CategoryMapper categories;
    @Autowired private ManagementMapper management;
    @Autowired private CommunityAccessService access;
    @Autowired private ObjectMapper json;

    @Override public List<Document> getAll() {
        var memberships = access.memberships();
        if (memberships.isEmpty()) return List.of();
        var filter = new DocumentFilter();
        memberships.forEach(member -> filter.or().andDocumentCommunityIdEqualTo(member.getCommunityId()));
        filter.setOrderByClause("document_update_date desc, document_id asc");
        return documents.selectByExample(filter);
    }
    @Override public List<Document> getAllByComunityId(String communityId, String typeId) {
        access.requireMember(communityId);
        var filter = new DocumentFilter();
        var criteria = filter.createCriteria().andDocumentCommunityIdEqualTo(communityId);
        if (typeId != null && !typeId.isBlank()) criteria.andDocumentCategoryIdEqualTo(typeId);
        filter.setOrderByClause("document_update_date desc, document_id asc");
        return documents.selectByExample(filter);
    }
    private Document find(String id) {
        var document = documents.selectByPrimaryKey(id);
        if (document == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "文档不存在或已被删除");
        return document;
    }
    @Override public Document getById(String id) {
        var document = find(id);
        access.requireMember(document.getDocumentCommunityId());
        return document;
    }
    @Override public int create(Document model) { return upsert(model); }
    @Override public int update(Document model) { return upsert(model); }
    @Override public int upsert(Document model) {
        if (model.getDocumentName() == null || model.getDocumentName().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "请输入文档标题");
        model.setDocumentName(model.getDocumentName().trim());
        if (model.getDocumentName().length() > 100)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "文档标题不能超过100个字符");
        if (model.getDocumentDescription() != null && model.getDocumentDescription().length() > 255)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "摘要不能超过255个字符");
        if (model.getDocumentThumbnailUrl() != null && model.getDocumentThumbnailUrl().length() > 255)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "封面地址过长");
        if (model.getDocumentCategoryId() == null || categories.selectByPrimaryKey(model.getDocumentCategoryId()) == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "请选择有效的资料分类");
        try {
            var tree = json.readTree(model.getDocumentContent());
            if (tree == null || !tree.isArray() || tree.isEmpty()) throw new IllegalArgumentException();
            for (var node : tree) if (!node.has("children") || !validSlateNode(node, 0)) throw new IllegalArgumentException();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "文档内容必须为非空的富文本数组");
        }
        boolean creating = model.getDocumentId() == null || model.getDocumentId().isBlank();
        access.lock(model.getDocumentCommunityId());
        access.requireMember(model.getDocumentCommunityId());
        if (creating) {
            model.setDocumentId(UUIDTool.getUUID());
            model.setDocumentAuthorId(access.userId());
            model.setDocumentCreateDate(new Date());
        } else {
            var old = find(model.getDocumentId());
            if (!Objects.equals(old.getDocumentCommunityId(), model.getDocumentCommunityId()))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "不能将文档移动到其他社区");
            requireEditor(old);
            model.setDocumentAuthorId(old.getDocumentAuthorId());
            model.setDocumentCreateDate(old.getDocumentCreateDate());
        }
        model.setDocumentUpdateDate(new Date());
        // updateByPrimaryKey omits the content BLOB. Use the full-content statement.
        return creating ? documents.insert(model) : documents.updateByPrimaryKeyWithBLOBs(model);
    }
    private void requireEditor(Document document) {
        access.requireMember(document.getDocumentCommunityId());
        if (!Objects.equals(access.userId(), document.getDocumentAuthorId()) && !access.isManager(document.getDocumentCommunityId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "只有作者或社区管理员可以修改、删除文档");
    }

    private boolean validSlateNode(com.fasterxml.jackson.databind.JsonNode node, int depth) {
        if (depth > 100 || !node.isObject()) return false;
        if (node.has("text")) return node.get("text").isTextual();
        if (!node.has("type") || !node.get("type").isTextual() || !node.has("children") || !node.get("children").isArray() || node.get("children").isEmpty()) return false;
        for (var child : node.get("children")) if (!validSlateNode(child, depth + 1)) return false;
        return true;
    }
    @Override public int delete(String id) {
        var document = find(id);
        access.lock(document.getDocumentCommunityId());
        document = find(id);
        requireEditor(document);
        management.deleteDocumentTags(id);
        management.deleteDocumentBasis(id);
        management.deleteDocumentCases(id);
        management.deleteDocumentPosts(id);
        return documents.deleteByPrimaryKey(id);
    }
    @Override public int batchUpsert(List<Document> list) {
        if (list == null || list.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "文档列表不能为空");
        return list.stream().mapToInt(this::upsert).sum();
    }
    @Override public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "请选择文档");
        return ids.stream().mapToInt(this::delete).sum();
    }
}
