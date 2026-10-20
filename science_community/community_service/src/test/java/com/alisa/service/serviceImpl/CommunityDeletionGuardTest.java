package com.alisa.service.serviceImpl;

import com.alisa.mapper.*;
import com.alisa.model.*;
import com.alisa.service.CommunityAccessService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommunityDeletionGuardTest {
    CommunityMapper communities = mock(CommunityMapper.class);
    CommunityUserMapper members = mock(CommunityUserMapper.class);
    ChannelMapper channels = mock(ChannelMapper.class);
    DocumentMapper documents = mock(DocumentMapper.class);
    ManagementMapper management = mock(ManagementMapper.class);
    CommunityAccessService access = mock(CommunityAccessService.class);
    CommunityServiceImpl service = new CommunityServiceImpl();
    @BeforeEach void setup() {
        ReflectionTestUtils.setField(service, "communityMapper", communities);
        ReflectionTestUtils.setField(service, "members", members);
        ReflectionTestUtils.setField(service, "channels", channels);
        ReflectionTestUtils.setField(service, "documents", documents);
        ReflectionTestUtils.setField(service, "management", management);
        ReflectionTestUtils.setField(service, "access", access);
        var owner = new CommunityUser(); owner.setCommunityUserId("owner");
        when(access.requireMember("community")).thenReturn(owner);
        when(access.role(owner)).thenReturn("owner");
    }
    @Test void nonOwnerCannotDeleteParentToBypassChannelAuthorization() {
        when(access.role(any())).thenReturn("member");
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.batchDelete(java.util.List.of("community"))).getStatusCode().value());
        verify(communities, never()).deleteByPrimaryKey(any());
        verify(communities, never()).batchDelete(any());
    }
    @Test void communityWithChannelsCannotBeDeletedAndRecreatedWithNewOwner() {
        when(channels.countByExample(any())).thenReturn(1L);
        assertEquals(409, assertThrows(ResponseStatusException.class, () -> service.delete("community")).getStatusCode().value());
        verify(communities, never()).deleteByPrimaryKey(any());
    }
    @Test void emptyCommunityDeletionCleansOwnerRelationship() {
        service.delete("community");
        verify(members).deleteByPrimaryKey("owner"); verify(management).deleteCommunityTags("community");
        verify(communities).deleteByPrimaryKey("community");
    }
}
