package com.alisa.service.serviceImpl;

import com.alisa.mapper.CommunityMapper;
import com.alisa.model.Community;
import com.alisa.service.CommunityService;
import com.alisa.vo.CommunityVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@org.springframework.transaction.annotation.Transactional
public class CommunityServiceImpl implements CommunityService {

    @Autowired private com.alisa.service.CommunityAccessService access;
    @Autowired private com.alisa.mapper.CommunityUserMapper members;
    @Autowired private com.alisa.mapper.ChannelMapper channels;
    @Autowired private com.alisa.mapper.DocumentMapper documents;
    @Autowired private com.alisa.mapper.ManagementMapper management;

    @Autowired
    private CommunityMapper communityMapper;

    @Override
    public List<Community> getAll() {
        return communityMapper.selectByExample(null);
    }

    @Override
    public List<Community> getAllByUser(String userId) {
        return communityMapper.selectByUser(userId);
    }

    @Override
    public Community getById(String id) {
        return communityMapper.selectByPrimaryKey(id);
    }

    @Override
    public int create(Community model) {
        return upsert(model);
    }

    @Override
    public int update(Community model) {
        return upsert(model);
    }

    @Override
    public int updateCover(String communityId, String url) {
        access.lock(communityId);
        access.requireManager(communityId);
        if (url == null || url.length() > 255) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "无效的封面地址");
        if (!url.isEmpty()) {
            try {
                var parsed = java.net.URI.create(url);
                if (!java.util.Set.of("http", "https").contains(parsed.getScheme()) || parsed.getHost() == null || parsed.getUserInfo() != null)
                    throw new IllegalArgumentException();
            } catch (IllegalArgumentException invalid) { throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "无效的封面地址"); }
        }
        var patch = new Community();
        patch.setCommunityId(communityId);
        patch.setCommunityImageUrl(url);
        return communityMapper.updateByPrimaryKeySelective(patch);
    }

    @Override
    public int delete(String id) {
        access.lock(id);
        var owner = access.requireMember(id);
        if (!"owner".equals(access.role(owner))) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "只有拥有者可以删除社区");
        var channelFilter = new com.alisa.dto.ChannelFilter();
        channelFilter.createCriteria().andChannelCommunityIdEqualTo(id);
        var documentFilter = new com.alisa.dto.DocumentFilter();
        documentFilter.createCriteria().andDocumentCommunityIdEqualTo(id);
        var memberFilter = new com.alisa.dto.CommunityUserFilter();
        memberFilter.createCriteria().andCommunityIdEqualTo(id);
        if (channels.countByExample(channelFilter) > 0 || documents.countByExample(documentFilter) > 0 || members.countByExample(memberFilter) > 1)
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT, "请先清理社区的频道、文档和其他成员");
        management.deleteMemberChannels(owner.getCommunityUserId());
        management.deleteCommunityTags(id);
        members.deleteByPrimaryKey(owner.getCommunityUserId());
        return communityMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int upsert(Community model) {
        String userId = access.userId();
        if (model.getCommunityId() == null || model.getCommunityId().isBlank()) model.setCommunityId(com.alisa.util.UUIDTool.getUUID());
        if (communityMapper.selectByPrimaryKey(model.getCommunityId()) != null) {
            access.lock(model.getCommunityId());
            access.requireManager(model.getCommunityId());
            return communityMapper.updateByPrimaryKey(model);
        }
        int count = communityMapper.insert(model);
        var owner = new com.alisa.model.CommunityUser();
        owner.setCommunityUserId(com.alisa.util.UUIDTool.getUUID());
        owner.setCommunityId(model.getCommunityId());
        owner.setUserId(userId);
        owner.setCommunityRoleId(access.roleId("owner"));
        members.insert(owner);
        return count;
    }

    @Override
    public int batchUpsert(List<Community> list) {
        return list.stream().mapToInt(this::upsert).sum();
    }

    @Override
    public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "请选择社区");
        return ids.stream().mapToInt(this::delete).sum();
    }

    @Override
    public List<CommunityVo> getAllWithTag(String tagName) {
        return communityMapper.selectCommunityWithTag(tagName);
    }
}
