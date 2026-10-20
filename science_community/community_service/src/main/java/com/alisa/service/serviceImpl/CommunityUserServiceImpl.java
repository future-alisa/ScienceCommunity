package com.alisa.service.serviceImpl;

import com.alisa.dto.CommunityUserFilter;
import com.alisa.mapper.CommunityUserMapper;
import com.alisa.mapper.ManagementMapper;
import com.alisa.model.CommunityUser;
import com.alisa.service.CommunityAccessService;
import com.alisa.service.CommunityUserService;
import com.alisa.util.UUIDTool;
import com.alisa.vo.CommunityUserVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(isolation = org.springframework.transaction.annotation.Isolation.READ_COMMITTED)
public class CommunityUserServiceImpl implements CommunityUserService {
    @Autowired private CommunityUserMapper members;
    @Autowired private ManagementMapper management;
    @Autowired private CommunityAccessService access;

    @Override public int join(String communityId) {
        access.lock(communityId);
        if (access.membership(communityId) != null) return 0;
        var member = new CommunityUser();
        member.setCommunityUserId(UUIDTool.getUUID());
        member.setCommunityId(communityId);
        member.setUserId(access.userId());
        member.setCommunityRoleId(access.roleId("member"));
        return members.insert(member);
    }

    @Override public List<CommunityUser> getAll() { return access.memberships(); }
    @Override public List<CommunityUserVo> getAllByCommunityId(String communityId) {
        access.requireMember(communityId);
        return members.selectCommunityUser(communityId);
    }
    @Override public CommunityUser getById(String id) {
        var member = find(id);
        access.requireMember(member.getCommunityId());
        return member;
    }
    private CommunityUser find(String id) {
        var member = members.selectByPrimaryKey(id);
        if (member == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "成员不存在");
        return member;
    }
    @Override public int create(CommunityUser model) { return upsert(model); }
    @Override public int update(CommunityUser model) { return upsert(model); }
    @Override public int upsert(CommunityUser model) {
        access.lock(model.getCommunityId());
        access.requireManager(model.getCommunityId());
        var actor = access.requireMember(model.getCommunityId());
        String role = management.roleName(model.getCommunityRoleId());
        if (!"member".equals(role) && !"admin".equals(role))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "只能设置成员或管理员角色");
        if (model.getUserId() == null || management.findUsers(model.getUserId()).stream().noneMatch(model.getUserId()::equals))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "用户不存在");
        boolean creating = model.getCommunityUserId() == null || model.getCommunityUserId().isBlank();
        if (!creating) {
            var old = find(model.getCommunityUserId());
            if (!Objects.equals(old.getCommunityId(), model.getCommunityId()) || !Objects.equals(old.getUserId(), model.getUserId()))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "不能移动成员或更换成员用户");
            if ("owner".equals(access.role(old))) throw new ResponseStatusException(HttpStatus.CONFLICT, "不能修改社区拥有者");
            if (!"owner".equals(access.role(actor)) && ("admin".equals(access.role(old)) || "admin".equals(role)))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "只有拥有者可以管理管理员");
            return members.updateByPrimaryKey(model);
        }
        if ("admin".equals(role) && !"owner".equals(access.role(actor)))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "只有拥有者可以设置管理员");
        var filter = new CommunityUserFilter();
        filter.createCriteria().andCommunityIdEqualTo(model.getCommunityId()).andUserIdEqualTo(model.getUserId());
        if (members.countByExample(filter) > 0) throw new ResponseStatusException(HttpStatus.CONFLICT, "用户已经加入该社区");
        model.setCommunityUserId(UUIDTool.getUUID());
        return members.insert(model);
    }
    @Override public int delete(String id) {
        var target = find(id);
        access.lock(target.getCommunityId());
        target = find(id);
        var actor = access.requireMember(target.getCommunityId());
        if ("owner".equals(access.role(target))) throw new ResponseStatusException(HttpStatus.CONFLICT, "拥有者不能被移除或直接退出");
        boolean self = Objects.equals(actor.getUserId(), target.getUserId());
        if (!self) {
            access.requireManager(target.getCommunityId());
            if ("admin".equals(access.role(target)) && !"owner".equals(access.role(actor)))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "只有拥有者可以移除管理员");
        }
        management.deleteMemberChannels(id);
        return members.deleteByPrimaryKey(id);
    }
    @Override public int batchUpsert(List<CommunityUser> list) {
        if (list == null || list.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "成员列表不能为空");
        return list.stream().mapToInt(this::upsert).sum();
    }
    @Override public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "请选择成员");
        return ids.stream().mapToInt(this::delete).sum();
    }
}
