package com.alisa.controller;

import java.util.List;
import java.util.UUID;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.nacos.api.model.v2.Result;
import com.alisa.Util.JwtUtil;
import com.alisa.model.Community;
import com.alisa.model.CommunityUser;
import com.alisa.service.CommunityService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("api/community/")
public class CommunityController {
    @Autowired
    private CommunityService communityService;

    @PostMapping("save")
    public Result<String> create(@RequestBody Community community, HttpServletRequest request) {
        var userId = getUserId(request);
        if (community.getCommunityId() == "") {
            String uuid = UUID.randomUUID().toString().replace("-", "");
            community.setCommunityId(uuid);
            CommunityUser cu = new CommunityUser();
            cu.setCommunityId(community.getCommunityId());
            cu.setUserId(userId);
            communityService.Create(cu);
        }
        boolean res = communityService.Create(community);

        return Result.success(String.valueOf(res));
    }

    private String getUserId(HttpServletRequest request) {
        var token = request.getHeader("Authorization").substring(7);
        var userId = JwtUtil.extractClaim(token, new Function<Claims, String>() {
            @Override
            public String apply(Claims claims) {
                return (String) claims.get("userId"); // 假设自定义声明为 userId
            }
        });
        return userId;
    }

    @DeleteMapping("delete")
    public Result<String> delete(String id) {
        boolean res = communityService.Delete(id);
        return Result.success(String.valueOf(res));
    }

    @GetMapping("get")
    public ResponseEntity<List<Community>> get(HttpServletRequest request) {
        List<Community> communities = communityService.Get();
        return ResponseEntity.ok(communities);
    }

    @GetMapping("getByUser")
    public ResponseEntity<List<Community>> getByUser(HttpServletRequest request) {
        var userId = getUserId(request);
        List<Community> communities = communityService.Get(userId);
        return ResponseEntity.ok(communities);
    }
}
