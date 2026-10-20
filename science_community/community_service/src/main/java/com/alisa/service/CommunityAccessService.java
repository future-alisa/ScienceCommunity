package com.alisa.service;

import com.alisa.dto.CommunityUserFilter;
import com.alisa.mapper.CommunityUserMapper;
import com.alisa.mapper.ManagementMapper;
import com.alisa.model.CommunityUser;
import com.alisa.model.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CommunityAccessService {
    @Autowired private CommunityUserMapper members;
    @Autowired private ManagementMapper management;

    public String userId() {
        var context = UserContext.get();
        if (context == null || context.getUserId() == null || context.getUserId().isBlank())
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "请先登录");
        return context.getUserId();
    }

    public List<CommunityUser> memberships() {
        var filter = new CommunityUserFilter();
        filter.createCriteria().andUserIdEqualTo(userId());
        return members.selectByExample(filter);
    }

    public CommunityUser membership(String communityId) {
        if (communityId == null || communityId.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "请选择社区");
        var filter = new CommunityUserFilter();
        filter.createCriteria().andCommunityIdEqualTo(communityId).andUserIdEqualTo(userId());
        return members.selectByExample(filter).stream().findFirst().orElse(null);
    }

    public CommunityUser requireMember(String communityId) {
        var member = membership(communityId);
        if (member == null) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "请先加入该社区");
        return member;
    }

    public String role(CommunityUser member) {
        return member == null ? "" : management.roleName(member.getCommunityRoleId());
    }

    public boolean isManager(String communityId) {
        String role = role(membership(communityId));
        return "owner".equals(role) || "admin".equals(role);
    }

    public void requireManager(String communityId) {
        if (!isManager(communityId)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "需要社区管理员权限");
    }

    public void lock(String communityId) {
        userId();
        if (communityId == null || communityId.isBlank() || management.lockCommunity(communityId) == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "社区不存在");
    }

    public String roleId(String name) {
        String id = management.roleId(name);
        if (id == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "社区角色未配置");
        return id;
    }
}
