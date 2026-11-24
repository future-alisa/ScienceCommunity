package com.alisa.service;

import com.alisa.mapper.DocumentMapper;
import com.alisa.mapper.DocumentProposalMapper;
import com.alisa.mapper.DocumentProposalMapper.Snapshot;
import com.alisa.mapper.DocumentProposalMapper.Summary;
import com.alisa.model.CommunityUser;
import com.alisa.model.Document;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DocumentProposalServiceTest {
    private static final String BASE = "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"原文\"}]}]";
    private static final String CHANGE = "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"修正公式\"}]}]";
    private final DocumentMapper documents = mock(DocumentMapper.class);
    private final DocumentProposalMapper proposals = mock(DocumentProposalMapper.class);
    private final DocumentService publisher = mock(DocumentService.class);
    private final CommunityAccessService access = mock(CommunityAccessService.class);
    private final DocumentProposalService service = new DocumentProposalService(documents, proposals, publisher, access, new ObjectMapper());
    private final Document document = new Document();

    @BeforeEach void setup() {
        document.setDocumentId("document");
        document.setDocumentCommunityId("community");
        document.setDocumentAuthorId("maintainer");
        document.setDocumentContent(BASE);
        when(documents.selectByPrimaryKey("document")).thenReturn(document);
        when(proposals.license("document")).thenReturn("开放许可，见原稿");
        when(proposals.base("change")).thenReturn(BASE);
        when(proposals.proposed("change")).thenReturn(CHANGE);
    }

    private void viewer(String user) {
        when(access.optionalUserId()).thenReturn(user);
        when(access.userId()).thenReturn(user);
        when(access.membership("community")).thenReturn(new CommunityUser());
    }

    private void status(String status, int revision) {
        when(proposals.find("change")).thenReturn(new Summary("change", "document", "教材", "community",
            "contributor", status, revision, "修正公式", "", null));
        when(proposals.snapshot("change")).thenReturn(new Snapshot("change", "document", "教材", "community",
            "contributor", status, revision, "修正公式", "", null, BASE, CHANGE));
    }

    @Test void forksOnlyWithOpenContributionsAndReusesCurrentPrivateCopy() {
        viewer("contributor");
        when(proposals.active("document", "contributor")).thenReturn("change");
        assertEquals("change", service.fork("document"));
        verify(access).requireMember("community");
        verify(proposals, never()).create(any(), any(), any(), any());
        when(proposals.license("document")).thenReturn(null);
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.fork("document")).getStatusCode().value());
        verifyNoInteractions(publisher);
    }

    @Test void saveAndSubmitDoNotChangePublishedDocument() {
        viewer("contributor");
        status("draft", 0);
        service.save("change", new DocumentProposalService.Draft(0, CHANGE, "修正公式", true));
        verify(proposals).save("change", CHANGE, "修正公式", "submitted");
        verifyNoInteractions(publisher);
        assertEquals(BASE, document.getDocumentContent());
    }

    @Test void onlyAuthorSeesUnsubmittedOrReturnedCopy() {
        viewer("maintainer");
        for (String state : new String[]{"draft", "returned"}) {
            status(state, 0);
            assertEquals(404, assertThrows(ResponseStatusException.class, () -> service.detail("change")).getStatusCode().value());
        }
        viewer("contributor");
        assertTrue(service.detail("change").canEdit());
    }

    @Test void authorizedMaintainerCanMergeCurrentVersionViaExistingDocumentSave() {
        viewer("maintainer");
        status("submitted", 3);
        service.review("change", new DocumentProposalService.Review(3, "merge", "已对照原稿"));
        var order = inOrder(access, publisher, proposals);
        order.verify(access).lock("community");
        order.verify(publisher).upsert(document);
        order.verify(proposals).decide("change", "merged", "已对照原稿", "maintainer");
        assertEquals(CHANGE, document.getDocumentContent());
        assertEquals("maintainer", document.getDocumentAuthorId());
    }

    @Test void staleBaseAndStaleProposalRevisionAreRejected() {
        viewer("maintainer");
        status("submitted", 3);
        assertEquals(409, assertThrows(ResponseStatusException.class,
            () -> service.review("change", new DocumentProposalService.Review(2, "merge", ""))).getStatusCode().value());
        document.setDocumentContent(CHANGE);
        assertEquals(409, assertThrows(ResponseStatusException.class,
            () -> service.review("change", new DocumentProposalService.Review(3, "merge", ""))).getStatusCode().value());
        verifyNoInteractions(publisher);
        verify(proposals, never()).decide(any(), any(), any(), any());
    }

    @Test void authorCannotReviewOwnProposalEvenIfPromotedToAdmin() {
        viewer("contributor");
        when(access.isManager("community")).thenReturn(true);
        status("submitted", 3);
        assertEquals(403, assertThrows(ResponseStatusException.class,
            () -> service.review("change", new DocumentProposalService.Review(3, "merge", ""))).getStatusCode().value());
        verifyNoInteractions(publisher);
    }

    @Test void proposalsMapperBindsSnapshotAndFiltersPrivateDraftsInSql() {
        var config = new Configuration();
        config.addMapper(DocumentProposalMapper.class);
        String namespace = DocumentProposalMapper.class.getName();
        var list = config.getMappedStatement(namespace + ".list").getBoundSql(Map.of("id", "document", "viewer", "", "reviewer", false));
        assertTrue(list.getSql().contains("p.status in ('submitted','closed')"));
        assertEquals(3, list.getParameterMappings().size());
        var detail = config.getMappedStatement(namespace + ".snapshot").getBoundSql("change");
        assertTrue(detail.getSql().contains("p.base_content as baseContent"));
    }
}
