package com.alisa.controller;

import com.alisa.model.Community;
import com.alisa.service.CommunityService;
import com.alisa.util.Result;
import com.alisa.vo.CommunityVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @GetMapping("/getAll")
    public Result<List<Community>> getAll() {
        var data = communityService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/getAllByTag/{tagName}")
    public Result<List<CommunityVo>> getAllWithTag(@PathVariable String tagName) {
        var data = communityService.getAllWithTag(tagName);
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<Community> getById(@PathVariable String id) {
        var data = communityService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Community community) {
        var count = communityService.upsert(community);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<Community> list) {
        var count = communityService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = communityService.batchDelete(ids);
        return new Result<>(count);
    }
}