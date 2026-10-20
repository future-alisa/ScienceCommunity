package com.alisa.service;

import com.alisa.mapper.*;
import com.alisa.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ChannelDiscussionServiceTest {
    ChannelMapper channels = mock(ChannelMapper.class);
    ChannelUserMapper members = mock(ChannelUserMapper.class);
    ChannelMessageMapper messages = mock(ChannelMessageMapper.class);
    ManagementMapper management = mock(ManagementMapper.class);
    CommunityAccessService access = mock(CommunityAccessService.class);
    ChannelDiscussionService service = new ChannelDiscussionService();
    @BeforeEach void setup() {
        ReflectionTestUtils.setField(service, "channels", channels);
        ReflectionTestUtils.setField(service, "members", members);
        ReflectionTestUtils.setField(service, "messages", messages);
        ReflectionTestUtils.setField(service, "management", management);
        ReflectionTestUtils.setField(service, "access", access);
        var channel = new Channel(); channel.setChannelId("channel"); channel.setChannelCommunityId("community");
        when(channels.selectByPrimaryKey("channel")).thenReturn(channel);
        var member = new CommunityUser(); member.setCommunityUserId("member"); member.setUserId("authenticated-user");
        when(access.requireMember("community")).thenReturn(member);
        when(access.userId()).thenReturn("authenticated-user");
        when(members.countByExample(any())).thenReturn(1L);
    }
    ChannelMessage row(long id) { var row = new ChannelMessage(); row.setSequenceId(id); return row; }
    @Test void revokedMemberCannotReadHistory() {
        when(members.countByExample(any())).thenReturn(0L);
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.history("channel", null, null)).getStatusCode().value());
        verifyNoInteractions(messages);
    }
    @Test void revokedMemberCannotSend() {
        when(members.countByExample(any())).thenReturn(0L);
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.send("channel", "hello", "request-1")).getStatusCode().value());
        verify(messages, never()).insert(any());
    }
    @Test void nonCommunityMemberCannotJoin() {
        doThrow(new ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN)).when(access).requireMember("community");
        assertThrows(ResponseStatusException.class, () -> service.join("channel"));
        verify(members, never()).insert(any());
    }
    @Test void joiningTwiceDoesNotCreateDuplicateMembership() {
        assertEquals(0, service.join("channel")); verify(members, never()).insert(any());
    }
    @Test void newJoinUsesCurrentCommunityMembership() {
        when(members.countByExample(any())).thenReturn(0L);
        service.join("channel");
        var captured = org.mockito.ArgumentCaptor.forClass(ChannelUser.class);
        verify(members).insert(captured.capture());
        assertEquals("member", captured.getValue().getCommunityUserId());
        assertEquals("channel", captured.getValue().getChannelId());
        assertNotNull(captured.getValue().getChannelUserId());
    }
    @Test void leaveOnlyDeletesCurrentUsersChannelMembership() {
        service.leave("channel");
        verify(members).deleteByExample(argThat(filter -> filter.getOredCriteria().get(0).getAllCriteria().stream()
            .anyMatch(criterion -> "community_user_id =".equals(criterion.getCondition()) && "member".equals(criterion.getValue()))));
    }
    @Test void latestHistoryReturnsChronologicalMessagesAndHasMore() {
        var source = new ArrayList<ChannelMessage>();
        for (long i = 100; i >= 50; i--) source.add(row(i));
        when(messages.history("channel", null, null, 51)).thenReturn(source);
        var result = service.history("channel", null, null);
        assertTrue(result.hasMore()); assertEquals(50, result.messages().size());
        assertEquals(51L, result.messages().get(0).getSequenceId());
        assertEquals(100L, result.messages().get(49).getSequenceId());
    }
    @Test void incrementalHistoryPreservesAscendingOrderAndDoesNotSkipNextPage() {
        var source = new ArrayList<ChannelMessage>();
        for (long i = 101; i <= 151; i++) source.add(row(i));
        when(messages.history("channel", null, 100L, 51)).thenReturn(source);
        var result = service.history("channel", null, 100L);
        assertTrue(result.hasMore()); assertEquals(101L, result.messages().get(0).getSequenceId());
        assertEquals(150L, result.messages().get(49).getSequenceId());
    }
    @Test void invalidHistoryCursorIsRejected() {
        assertThrows(ResponseStatusException.class, () -> service.history("channel", 1L, 2L));
        assertThrows(ResponseStatusException.class, () -> service.history("channel", 0L, null));
        assertThrows(ResponseStatusException.class, () -> service.history("channel", null, -1L));
        verify(messages, never()).history(any(), any(), any(), anyInt());
    }
    @Test void sendTakesIdentityFromAuthenticatedUserAndAssignsServerId() {
        when(management.userName("authenticated-user")).thenReturn("Alice");
        when(messages.insert(any())).thenAnswer(call -> { call.getArgument(0, ChannelMessage.class).setSequenceId(10L); return 1; });
        var sent = service.send("channel", "  hello  ", "request-1");
        assertEquals("authenticated-user", sent.getSenderId()); assertEquals("Alice", sent.getSenderName());
        assertEquals("hello", sent.getContent()); assertEquals(10L, sent.getSequenceId());
        assertNotNull(sent.getCreatedAt()); assertNotNull(sent.getMessageId());
    }
    @Test void retryReturnsOriginalMessageWithoutInsertingAgain() {
        var original = row(12); original.setContent("hello");
        when(messages.findRequest("channel", "authenticated-user", "request-1")).thenReturn(original);
        assertSame(original, service.send("channel", "hello", "request-1"));
        verify(messages, never()).insert(any());
    }
    @Test void sameRequestIdCannotBeReusedForDifferentContent() {
        var original = row(12); original.setContent("hello");
        when(messages.findRequest("channel", "authenticated-user", "request-1")).thenReturn(original);
        assertEquals(409, assertThrows(ResponseStatusException.class, () -> service.send("channel", "different", "request-1")).getStatusCode().value());
        verify(messages, never()).insert(any());
    }
    @Test void emptyOversizeAndInvalidRequestIdMessagesAreRejected() {
        assertThrows(ResponseStatusException.class, () -> service.send("channel", " ", "id"));
        assertThrows(ResponseStatusException.class, () -> service.send("channel", "a".repeat(4001), "id"));
        assertThrows(ResponseStatusException.class, () -> service.send("channel", "hello", "bad/id"));
        verifyNoInteractions(messages);
    }
    @Test void deletedChannelCannotBeRead() {
        when(channels.selectByPrimaryKey("channel")).thenReturn(null);
        assertEquals(404, assertThrows(ResponseStatusException.class, () -> service.history("channel", null, null)).getStatusCode().value());
        verifyNoInteractions(messages);
    }
}
