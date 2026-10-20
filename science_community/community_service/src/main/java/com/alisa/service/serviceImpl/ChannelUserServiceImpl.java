package com.alisa.service.serviceImpl;

import com.alisa.dto.ChannelUserFilter;
import com.alisa.mapper.ChannelUserMapper;
import com.alisa.mapper.ChannelMapper;
import com.alisa.mapper.CommunityUserMapper;
import com.alisa.model.ChannelUser;
import com.alisa.service.ChannelUserService;
import com.alisa.service.CommunityAccessService;
import com.alisa.util.UUIDTool;
import com.alisa.vo.ChannelUserVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(isolation = org.springframework.transaction.annotation.Isolation.READ_COMMITTED)
public class ChannelUserServiceImpl implements ChannelUserService {
    @Autowired private ChannelUserMapper members;
    @Autowired private ChannelMapper channels;
    @Autowired private CommunityUserMapper communityMembers;
    @Autowired private CommunityAccessService access;

    private String community(String channelId) {
        var channel = channels.selectByPrimaryKey(channelId);
        if (channel == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "频道不存在");
        return channel.getChannelCommunityId();
    }
    @Override public List<ChannelUser> getAll() {
        var own = access.memberships();
        if (own.isEmpty()) return List.of();
        var filter = new ChannelUserFilter();
        own.forEach(member -> filter.or().andCommunityUserIdEqualTo(member.getCommunityUserId()));
        return members.selectByExample(filter);
    }
    @Override public List<ChannelUserVo> getAllByChannelId(String channelId) {
        access.requireMember(community(channelId));
        return members.selectByChannelId(channelId);
    }
    private ChannelUser find(String id) {
        var member = members.selectByPrimaryKey(id);
        if (member == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "频道成员不存在");
        return member;
    }
    @Override public ChannelUser getById(String id) {
        var member = find(id);
        access.requireMember(community(member.getChannelId()));
        return member;
    }
    @Override public int create(ChannelUser model) { return upsert(model); }
    @Override public int update(ChannelUser model) { return upsert(model); }
    @Override public int upsert(ChannelUser model) {
        String communityId = community(model.getChannelId());
        access.lock(communityId);
        community(model.getChannelId());
        access.requireManager(communityId);
        var communityMember = communityMembers.selectByPrimaryKey(model.getCommunityUserId());
        if (communityMember == null || !Objects.equals(communityId, communityMember.getCommunityId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "只能添加本社区成员");
        if (model.getChannelUserId() != null && !model.getChannelUserId().isBlank()) {
            var old = find(model.getChannelUserId());
            if (!Objects.equals(old.getChannelId(), model.getChannelId()) || !Objects.equals(old.getCommunityUserId(), model.getCommunityUserId()))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "不能移动频道成员");
            return 0;
        }
        var filter = new ChannelUserFilter();
        filter.createCriteria().andChannelIdEqualTo(model.getChannelId()).andCommunityUserIdEqualTo(model.getCommunityUserId());
        if (members.countByExample(filter) > 0) throw new ResponseStatusException(HttpStatus.CONFLICT, "该成员已加入频道");
        model.setChannelUserId(UUIDTool.getUUID());
        return members.insert(model);
    }
    @Override public int delete(String id) {
        var member = find(id);
        String communityId = community(member.getChannelId());
        access.lock(communityId);
        access.requireManager(communityId);
        return members.deleteByPrimaryKey(id);
    }
    @Override public int batchUpsert(List<ChannelUser> list) {
        if (list == null || list.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "成员列表不能为空");
        return list.stream().mapToInt(this::upsert).sum();
    }
    @Override public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "请选择成员");
        return ids.stream().mapToInt(this::delete).sum();
    }
}
