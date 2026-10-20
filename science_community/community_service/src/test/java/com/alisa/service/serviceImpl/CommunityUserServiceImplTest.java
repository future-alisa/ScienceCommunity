package com.alisa.service.serviceImpl;

import com.alisa.mapper.*;
import com.alisa.model.*;
import com.alisa.service.CommunityAccessService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommunityUserServiceImplTest {
    CommunityUserMapper members = mock(CommunityUserMapper.class);
    ManagementMapper management = mock(ManagementMapper.class);
    CommunityAccessService access = mock(CommunityAccessService.class);
    CommunityUserServiceImpl service = new CommunityUserServiceImpl();
    CommunityUser actor;
    @BeforeEach void setup() {
        ReflectionTestUtils.setField(service, "members", members);
        ReflectionTestUtils.setField(service, "management", management);
        ReflectionTestUtils.setField(service, "access", access);
        actor = member("actor", "actor-user", "owner-role");
        when(access.requireMember("community")).thenReturn(actor);
        when(access.role(actor)).thenReturn("owner");
        when(management.roleName("member-role")).thenReturn("member");
        when(management.roleName("admin-role")).thenReturn("admin");
        when(management.findUsers("target-user")).thenReturn(List.of("target-user"));
    }
    CommunityUser member(String id, String userId, String role) {
        var model = new CommunityUser(); model.setCommunityUserId(id); model.setCommunityId("community");
        model.setUserId(userId); model.setCommunityRoleId(role); return model;
    }
    @Test void ownerCannotBeDeletedEvenByOwner() {
        when(members.selectByPrimaryKey("actor")).thenReturn(actor);
        assertThrows(ResponseStatusException.class, () -> service.delete("actor"));
        verify(members, never()).deleteByPrimaryKey(any());
    }
    @Test void adminCannotPromoteAnotherAdmin() {
        when(access.role(actor)).thenReturn("admin");
        assertThrows(ResponseStatusException.class, () -> service.upsert(member("", "target-user", "admin-role")));
        verify(members, never()).insert(any());
    }
    @Test void duplicateMembershipIsRejected() {
        when(members.countByExample(any())).thenReturn(1L);
        assertEquals(409, assertThrows(ResponseStatusException.class, () -> service.upsert(member("", "target-user", "member-role"))).getStatusCode().value());
        verify(members, never()).insert(any());
    }
    @Test void removalAlsoCleansChannelMemberships() {
        var target = member("target", "target-user", "member-role");
        when(members.selectByPrimaryKey("target")).thenReturn(target);
        when(access.role(target)).thenReturn("member"); service.delete("target");
        var order = inOrder(management, members);
        order.verify(management).deleteMemberChannels("target");
        order.verify(members).deleteByPrimaryKey("target");
    }
    @Test void ordinaryMemberCannotRemoveOtherMember() {
        var target = member("target", "target-user", "member-role");
        when(members.selectByPrimaryKey("target")).thenReturn(target);
        when(access.role(target)).thenReturn("member"); when(access.role(actor)).thenReturn("member");
        doThrow(new ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN)).when(access).requireManager("community");
        assertThrows(ResponseStatusException.class, () -> service.delete("target"));
        verify(members, never()).deleteByPrimaryKey(any());
    }
    @Test void joinAlwaysAssignsDefaultMemberRole() {
        when(access.userId()).thenReturn("self"); when(access.roleId("member")).thenReturn("member-role");
        service.join("community");
        var captor = org.mockito.ArgumentCaptor.forClass(CommunityUser.class);
        verify(members).insert(captor.capture());
        assertEquals("member-role", captor.getValue().getCommunityRoleId());
        assertEquals("self", captor.getValue().getUserId());
    }
    @Test void repeatedJoinIsIdempotent() {
        when(access.membership("community")).thenReturn(actor);
        assertEquals(0, service.join("community")); verify(members, never()).insert(any());
    }
}
