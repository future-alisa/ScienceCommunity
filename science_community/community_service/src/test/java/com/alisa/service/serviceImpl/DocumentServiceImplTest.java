package com.alisa.service.serviceImpl;

import com.alisa.mapper.*;
import com.alisa.model.*;
import com.alisa.service.CommunityAccessService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import java.util.Date;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DocumentServiceImplTest {
    DocumentMapper documents = mock(DocumentMapper.class);
    CategoryMapper categories = mock(CategoryMapper.class);
    ManagementMapper management = mock(ManagementMapper.class);
    CommunityAccessService access = mock(CommunityAccessService.class);
    DocumentServiceImpl service = new DocumentServiceImpl();
    @BeforeEach void setup() {
        ReflectionTestUtils.setField(service, "documents", documents);
        ReflectionTestUtils.setField(service, "categories", categories);
        ReflectionTestUtils.setField(service, "management", management);
        ReflectionTestUtils.setField(service, "access", access);
        ReflectionTestUtils.setField(service, "json", new ObjectMapper());
        when(categories.selectByPrimaryKey("category")).thenReturn(new Category());
        when(access.userId()).thenReturn("author");
    }
    Document document(String id) {
        var model = new Document();
        model.setDocumentId(id); model.setDocumentCommunityId("community");
        model.setDocumentCategoryId("category"); model.setDocumentAuthorId("author");
        model.setDocumentName(" Title "); model.setDocumentCreateDate(new Date(1000));
        model.setDocumentContent("[{\"type\":\"paragraph\",\"children\":[{\"text\":\"Content\"}]}]");
        return model;
    }
    @Test void editKeepsIdentityAuthorAndCreationTimeAndWritesContent() {
        var old = document("existing"); var edited = document("existing");
        edited.setDocumentAuthorId("forged"); edited.setDocumentCreateDate(new Date());
        when(documents.selectByPrimaryKey("existing")).thenReturn(old);
        service.upsert(edited);
        assertEquals("existing", edited.getDocumentId());
        assertEquals("author", edited.getDocumentAuthorId());
        assertEquals(old.getDocumentCreateDate(), edited.getDocumentCreateDate());
        assertEquals("Title", edited.getDocumentName());
        verify(documents).updateByPrimaryKeyWithBLOBs(edited);
        verify(documents, never()).insert(any());
    }
    @Test void createUsesAuthenticatedAuthorAndNewId() {
        var model = document(""); model.setDocumentAuthorId("forged");
        service.upsert(model);
        assertFalse(model.getDocumentId().isBlank()); assertEquals("author", model.getDocumentAuthorId());
        verify(documents).insert(model);
    }
    @Test void ordinaryMemberCannotEditAnotherAuthorsDocument() {
        var old = document("existing"); old.setDocumentAuthorId("someone-else");
        when(documents.selectByPrimaryKey("existing")).thenReturn(old);
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.upsert(document("existing"))).getStatusCode().value());
        verify(documents, never()).updateByPrimaryKeyWithBLOBs(any());
    }
    @Test void managerCanEditWithoutTakingAuthorship() {
        var old = document("existing"); old.setDocumentAuthorId("other");
        when(documents.selectByPrimaryKey("existing")).thenReturn(old);
        when(access.isManager("community")).thenReturn(true);
        var edited = document("existing"); service.upsert(edited);
        assertEquals("other", edited.getDocumentAuthorId());
    }
    @Test void documentCannotMoveAcrossCommunities() {
        var old = document("existing"); old.setDocumentCommunityId("other-community");
        when(documents.selectByPrimaryKey("existing")).thenReturn(old);
        assertThrows(ResponseStatusException.class, () -> service.upsert(document("existing")));
        verify(documents, never()).updateByPrimaryKeyWithBLOBs(any());
    }
    @Test void invalidContentAndMissingCategoryDoNotWrite() {
        var model = document(""); model.setDocumentContent("{}");
        assertThrows(ResponseStatusException.class, () -> service.upsert(model));
        model.setDocumentContent("[]"); assertThrows(ResponseStatusException.class, () -> service.upsert(model));
        final var invalid = document(""); invalid.setDocumentCategoryId("missing");
        assertThrows(ResponseStatusException.class, () -> service.upsert(invalid));
        verify(documents, never()).insert(any());
    }
    @Test void deleteChecksPermissionAndClearsTagRelations() {
        when(documents.selectByPrimaryKey("existing")).thenReturn(document("existing"));
        service.delete("existing");
        var order = inOrder(management, documents);
        order.verify(management).deleteDocumentTags("existing");
        order.verify(documents).deleteByPrimaryKey("existing");
    }
    @Test void emptyMembershipDoesNotReturnGlobalDocuments() {
        when(access.memberships()).thenReturn(List.of());
        assertTrue(service.getAll().isEmpty()); verify(documents, never()).selectByExample(any());
    }
    @Test void nonMemberCannotReadDocument() {
        when(documents.selectByPrimaryKey("existing")).thenReturn(document("existing"));
        doThrow(new ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN)).when(access).requireMember("community");
        assertThrows(ResponseStatusException.class, () -> service.getById("existing"));
    }
}
