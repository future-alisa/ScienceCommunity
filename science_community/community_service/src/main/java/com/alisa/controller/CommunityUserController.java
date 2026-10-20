package com.alisa.controller;

import com.alisa.model.CommunityUser;
import com.alisa.service.CommunityUserService;
import com.alisa.util.Result;
import com.alisa.vo.CommunityUserVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/communityuser")
public class CommunityUserController {

    @Autowired
    private CommunityUserService communityuserService;

    @Autowired private com.alisa.service.CommunityAccessService access;
    @Autowired private com.alisa.mapper.ManagementMapper management;

    @GetMapping("/access")
    public Result<java.util.Map<String, String>> access(@RequestParam String communityId) {
        var member = access.membership(communityId);
        return new Result<>(java.util.Map.of("userId", access.userId(), "membershipId", member == null ? "" : member.getCommunityUserId(),
            "role", member == null ? "" : java.util.Objects.toString(access.role(member), "")));
    }

    @GetMapping("/roles")
    public Result<java.util.List<java.util.Map<String, String>>> roles() {
        access.userId();
        return new Result<>(management.roles());
    }

    public record AddMember(String communityId, String identity, String roleId) {}

    public record JoinCommunity(String communityId) {}

    @PostMapping("/join")
    public Result<Integer> join(@RequestBody JoinCommunity request) {
        return new Result<>(communityuserService.join(request.communityId()));
    }

    @PostMapping("/add")
    public Result<Integer> add(@RequestBody AddMember request) {
        access.requireManager(request.communityId());
        if (request.identity() == null || request.identity().isBlank())
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "请输入用户名、邮箱或用户 ID");
        var users = management.findUsers(request.identity().trim());
        if (users.size() != 1) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "找不到唯一匹配的用户");
        var member = new CommunityUser();
        member.setCommunityId(request.communityId());
        member.setUserId(users.get(0));
        member.setCommunityRoleId(request.roleId() == null ? access.roleId("member") : request.roleId());
        return new Result<>(communityuserService.upsert(member));
    }

    @DeleteMapping("/{id}")
    public Result<Integer> remove(@PathVariable String id) {
        return new Result<>(communityuserService.delete(id));
    }

    @GetMapping("/getAll")
    public Result<List<CommunityUser>> getAll() {
        var data = communityuserService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/getAllByCommunityId")
    public Result<List<CommunityUserVo>> getAllByCommunityId(String communityId) {
        var data = communityuserService.getAllByCommunityId(communityId);
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<CommunityUser> getById(@PathVariable String id) {
        var data = communityuserService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody CommunityUser communityuser) {
        var count = communityuserService.upsert(communityuser);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<CommunityUser> list) {
        var count = communityuserService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = communityuserService.batchDelete(ids);
        return new Result<>(count);
    }
}
