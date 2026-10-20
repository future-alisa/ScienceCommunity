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

class ChannelServiceImplTest {
    ChannelMapper channels = mock(ChannelMapper.class);
    ChannelUserMapper members = mock(ChannelUserMapper.class);
    ChannelMessageMapper messages = mock(ChannelMessageMapper.class);
    ManagementMapper management = mock(ManagementMapper.class);
    CommunityAccessService access = mock(CommunityAccessService.class);
    ChannelServiceImpl service = new ChannelServiceImpl();
    @BeforeEach void setup() {
        ReflectionTestUtils.setField(service, "channelMapper", channels);
        ReflectionTestUtils.setField(service, "members", members);
        ReflectionTestUtils.setField(service, "messages", messages);
        ReflectionTestUtils.setField(service, "management", management);
        ReflectionTestUtils.setField(service, "access", access);
        var member = new CommunityUser(); member.setCommunityUserId("creator");
        when(access.requireMember("community")).thenReturn(member);
    }
    Channel channel(String id) {
        var row = new Channel(); row.setChannelId(id); row.setChannelName(" Topic "); row.setChannelCommunityId("community"); row.setChannelDescription("Description"); return row;
    }
    @Test void creationAutomaticallyAddsCreator() {
        var row = channel(""); service.upsert(row);
        assertFalse(row.getChannelId().isBlank()); assertEquals("Topic", row.getChannelName());
        verify(members).insert(argThat(member -> "creator".equals(member.getCommunityUserId()) && row.getChannelId().equals(member.getChannelId())));
    }
    @Test void ordinaryMembersCannotCreateChannels() {
        doThrow(new ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN)).when(access).requireManager("community");
        assertThrows(ResponseStatusException.class, () -> service.upsert(channel("")));
        verify(channels, never()).insert(any());
    }
    @Test void editKeepsChannelIdAndDoesNotDuplicateCreator() {
        when(channels.selectByPrimaryKey("existing")).thenReturn(channel("existing"));
        var edited = channel("existing"); service.upsert(edited);
        verify(channels).updateByPrimaryKey(edited); verify(members, never()).insert(any());
    }
    @Test void cannotMoveChannelToAnotherCommunity() {
        var old = channel("existing"); old.setChannelCommunityId("other");
        when(channels.selectByPrimaryKey("existing")).thenReturn(old);
        assertThrows(ResponseStatusException.class, () -> service.upsert(channel("existing")));
        verify(channels, never()).updateByPrimaryKey(any());
    }
    @Test void deletionCleansMessagesAndMembershipsBeforeChannel() {
        when(channels.selectByPrimaryKey("existing")).thenReturn(channel("existing"));
        service.delete("existing");
        var order = inOrder(management, messages, channels);
        order.verify(management).deleteChannelMembers("existing"); order.verify(messages).deleteChannel("existing"); order.verify(channels).deleteByPrimaryKey("existing");
    }
    @Test void oversizeDescriptionIsRejected() {
        var row = channel(""); row.setChannelDescription("a".repeat(256));
        assertThrows(ResponseStatusException.class, () -> service.upsert(row)); verify(channels, never()).insert(any());
    }
}
