package com.alisa.service;

import com.alisa.dto.ChannelUserFilter;
import com.alisa.mapper.*;
import com.alisa.model.*;
import com.alisa.util.UUIDTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@Service
@Transactional(isolation = org.springframework.transaction.annotation.Isolation.READ_COMMITTED)
public class ChannelDiscussionService {
    @Autowired private ChannelMapper channels;
    @Autowired private ChannelUserMapper members;
    @Autowired private ChannelMessageMapper messages;
    @Autowired private ManagementMapper management;
    @Autowired private CommunityAccessService access;

    public record ChannelAccess(String userId, boolean joined, boolean canManage, int memberCount) {}
    public record History(List<ChannelMessage> messages, boolean hasMore) {}

    private Channel channel(String id) {
        var channel = channels.selectByPrimaryKey(id);
        if (channel == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "频道不存在或已被删除");
        return channel;
    }
    private ChannelUserFilter memberFilter(String channelId, String memberId) {
        var filter = new ChannelUserFilter();
        filter.createCriteria().andChannelIdEqualTo(channelId).andCommunityUserIdEqualTo(memberId);
        return filter;
    }
    private CommunityUser requireParticipant(String channelId) {
        var channel = channel(channelId);
        var member = access.requireMember(channel.getChannelCommunityId());
        if (members.countByExample(memberFilter(channelId, member.getCommunityUserId())) == 0)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "请先加入该频道");
        return member;
    }
    public ChannelAccess getAccess(String channelId) {
        var channel = channel(channelId);
        var member = access.requireMember(channel.getChannelCommunityId());
        var filter = new ChannelUserFilter();
        filter.createCriteria().andChannelIdEqualTo(channelId);
        return new ChannelAccess(access.userId(), members.countByExample(memberFilter(channelId, member.getCommunityUserId())) > 0,
            access.isManager(channel.getChannelCommunityId()), (int) members.countByExample(filter));
    }
    public int join(String channelId) {
        var channel = channel(channelId);
        access.lock(channel.getChannelCommunityId());
        channel(channelId);
        var member = access.requireMember(channel.getChannelCommunityId());
        if (members.countByExample(memberFilter(channelId, member.getCommunityUserId())) > 0) return 0;
        var row = new ChannelUser();
        row.setChannelUserId(UUIDTool.getUUID()); row.setChannelId(channelId); row.setCommunityUserId(member.getCommunityUserId());
        return members.insert(row);
    }
    public int leave(String channelId) {
        var channel = channel(channelId);
        access.lock(channel.getChannelCommunityId());
        var member = access.requireMember(channel.getChannelCommunityId());
        return members.deleteByExample(memberFilter(channelId, member.getCommunityUserId()));
    }
    public History history(String channelId, Long before, Long after) {
        // Serializes authorization with membership changes so revocations cannot race a read.
        var channel = channel(channelId);
        access.lock(channel.getChannelCommunityId());
        requireParticipant(channelId);
        if ((before != null && before <= 0) || (after != null && after < 0) || (before != null && after != null))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "无效的消息游标");
        var rows = new ArrayList<>(messages.history(channelId, before, after, 51));
        boolean more = rows.size() > 50;
        if (more) rows.remove(rows.size() - 1);
        if (after == null) Collections.reverse(rows);
        return new History(rows, more);
    }
    public ChannelMessage send(String channelId, String content, String clientMessageId) {
        if (content == null || content.isBlank() || content.length() > 4000)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "消息不能为空，且不能超过4000个字符");
        if (clientMessageId == null || !clientMessageId.matches("[a-zA-Z0-9_-]{1,64}"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "无效的消息请求 ID");
        var channel = channel(channelId);
        access.lock(channel.getChannelCommunityId());
        requireParticipant(channelId);
        String userId = access.userId();
        var existing = messages.findRequest(channelId, userId, clientMessageId);
        if (existing != null) {
            if (!Objects.equals(existing.getContent(), content.trim()))
                throw new ResponseStatusException(HttpStatus.CONFLICT, "此消息请求 ID 已用于其他内容");
            return existing;
        }
        var message = new ChannelMessage();
        message.setMessageId(UUIDTool.getUUID()); message.setChannelId(channelId); message.setSenderId(userId);
        message.setSenderName(Objects.toString(management.userName(userId), "社区成员"));
        message.setClientMessageId(clientMessageId); message.setContent(content.trim()); message.setCreatedAt(new Date());
        messages.insert(message);
        return message;
    }
}
