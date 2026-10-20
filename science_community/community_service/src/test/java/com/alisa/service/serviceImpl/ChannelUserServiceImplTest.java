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

class ChannelUserServiceImplTest {
    ChannelUserMapper members = mock(ChannelUserMapper.class);
    ChannelMapper channels = mock(ChannelMapper.class);
    CommunityUserMapper communityMembers = mock(CommunityUserMapper.class);
    CommunityAccessService access = mock(CommunityAccessService.class);
    ChannelUserServiceImpl service = new ChannelUserServiceImpl();
    @BeforeEach void setup() {
        ReflectionTestUtils.setField(service, "members", members);
        ReflectionTestUtils.setField(service, "channels", channels);
        ReflectionTestUtils.setField(service, "communityMembers", communityMembers);
        ReflectionTestUtils.setField(service, "access", access);
        var channel = new Channel(); channel.setChannelCommunityId("community");
        when(channels.selectByPrimaryKey("channel")).thenReturn(channel);
    }
    ChannelUser request() {
        var request = new ChannelUser(); request.setChannelId("channel"); request.setCommunityUserId("member"); return request;
    }
    @Test void rejectsMemberFromAnotherCommunity() {
        var member = new CommunityUser(); member.setCommunityId("other-community");
        when(communityMembers.selectByPrimaryKey("member")).thenReturn(member);
        assertEquals(400, assertThrows(ResponseStatusException.class, () -> service.upsert(request())).getStatusCode().value());
        verify(members, never()).insert(any());
    }
    @Test void duplicateChannelMembershipIsRejectedUsingCorrectColumn() {
        var member = new CommunityUser(); member.setCommunityId("community");
        when(communityMembers.selectByPrimaryKey("member")).thenReturn(member);
        when(members.countByExample(any())).thenAnswer(invocation -> {
            var filter = invocation.getArgument(0, com.alisa.dto.ChannelUserFilter.class);
            assertTrue(filter.getOredCriteria().get(0).getAllCriteria().stream().anyMatch(criterion -> "community_user_id =".equals(criterion.getCondition())));
            return 1L;
        });
        assertEquals(409, assertThrows(ResponseStatusException.class, () -> service.upsert(request())).getStatusCode().value());
        verify(members, never()).insert(any());
    }
    @Test void ordinaryMemberCannotAddChannelMember() {
        doThrow(new ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN)).when(access).requireManager("community");
        assertThrows(ResponseStatusException.class, () -> service.upsert(request()));
        verify(members, never()).insert(any());
    }
}
