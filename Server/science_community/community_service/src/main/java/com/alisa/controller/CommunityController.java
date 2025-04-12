package com.alisa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.nacos.api.model.v2.Result;
import com.alisa.model.Community;
import com.alisa.service.CommunityService;

@RestController
@RequestMapping("/community")
public class CommunityController {
    @Autowired
    private CommunityService communityService;

    @PostMapping("create")
    public Result<String> create(@RequestBody Community community) {
        boolean res = communityService.Create(community);
        return Result.success(String.valueOf(res));
    }

    @DeleteMapping("delete")
    public Result<String> delete(String id) {
        boolean res = communityService.Delete(id);
        return Result.success(String.valueOf(res));
    }
}
