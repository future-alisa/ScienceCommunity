package com.alisa.service.serviceImpl;

import com.alisa.dto.ChannelFilter;
import com.alisa.mapper.ChannelMapper;
import com.alisa.model.Channel;
import com.alisa.service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@org.springframework.transaction.annotation.Transactional(isolation = org.springframework.transaction.annotation.Isolation.READ_COMMITTED)
public class ChannelServiceImpl implements ChannelService {

    @Autowired private com.alisa.service.CommunityAccessService access;
    @Autowired private com.alisa.mapper.ManagementMapper management;
    @Autowired private com.alisa.mapper.ChannelUserMapper members;
    @Autowired private com.alisa.mapper.ChannelMessageMapper messages;

    @Autowired
    private ChannelMapper channelMapper;

    @Override
    public List<Channel> getAll() {
        var own = access.memberships();
        if (own.isEmpty()) return List.of();
        var filter = new ChannelFilter();
        own.forEach(member -> filter.or().andChannelCommunityIdEqualTo(member.getCommunityId()));
        return channelMapper.selectByExample(filter);
    }

    @Override
    public List<Channel> getAllByCommunityId(String communityId) {
        access.requireMember(communityId);
        ChannelFilter filter = new ChannelFilter();
        filter.createCriteria().andChannelCommunityIdEqualTo(communityId);
        return channelMapper.selectByExample(filter);
    }

    @Override
    public Channel getById(String id) {
        var channel = channelMapper.selectByPrimaryKey(id);
        if (channel == null) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "频道不存在或已被删除");
        access.requireMember(channel.getChannelCommunityId());
        return channel;
    }

    @Override
    public int create(Channel model) {
        return upsert(model);
    }

    @Override
    public int update(Channel model) {
        return upsert(model);
    }

    @Override
    public int delete(String id) {
        var channel = channelMapper.selectByPrimaryKey(id);
        if (channel == null) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "频道不存在");
        access.lock(channel.getChannelCommunityId());
        access.requireManager(channel.getChannelCommunityId());
        management.deleteChannelMembers(id);
        messages.deleteChannel(id);
        return channelMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int upsert(Channel model) {
        access.lock(model.getChannelCommunityId());
        access.requireManager(model.getChannelCommunityId());
        if (model.getChannelName() == null || model.getChannelName().isBlank())
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "请输入频道名称");
        model.setChannelName(model.getChannelName().trim());
        if (model.getChannelName().length() > 255 || (model.getChannelDescription() != null && model.getChannelDescription().length() > 255))
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "频道名称和简介不能超过255个字符");
        var old = model.getChannelId() == null ? null : channelMapper.selectByPrimaryKey(model.getChannelId());
        if (old != null) {
            if (!java.util.Objects.equals(old.getChannelCommunityId(), model.getChannelCommunityId()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "不能移动频道到其他社区");
            return channelMapper.updateByPrimaryKey(model);
        }
        if (model.getChannelId() == null || model.getChannelId().isBlank()) model.setChannelId(com.alisa.util.UUIDTool.getUUID());
        int count = channelMapper.insert(model);
        var creator = access.requireMember(model.getChannelCommunityId());
        var participant = new com.alisa.model.ChannelUser();
        participant.setChannelUserId(com.alisa.util.UUIDTool.getUUID());
        participant.setChannelId(model.getChannelId());
        participant.setCommunityUserId(creator.getCommunityUserId());
        members.insert(participant);
        return count;
    }

    @Override
    public int batchUpsert(List<Channel> list) {
        if (list == null || list.isEmpty()) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "频道列表不能为空");
        return list.stream().mapToInt(this::upsert).sum();
    }

    @Override
    public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "请选择频道");
        return ids.stream().mapToInt(this::delete).sum();
    }
}
