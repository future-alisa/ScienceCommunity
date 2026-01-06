package com.alisa.controller;

import com.alisa.model.Community;
import com.alisa.service.CommunityService;
import com.alisa.util.JwtUtil;
import com.alisa.util.Result;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.function.Function;

@RestController
@RequestMapping("/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @GetMapping("/getAll")
    public List<Community> getAll() {
        return communityService.getAll();
    }

    @GetMapping("/{id}")
    public Community getById(@PathVariable String id) {
        return communityService.getById(id);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Community community) {
        int result = communityService.upsert(community);
        return new Result<>(result);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Community> list) {
        communityService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        communityService.batchDelete(ids);
    }

    @GetMapping("getByUser")
    public ResponseEntity<List<Community>> getByUser(HttpServletRequest request) {
        var userId = getUserId(request);
        List<Community> communities = communityService.getAll();
        return ResponseEntity.ok(communities);
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
}