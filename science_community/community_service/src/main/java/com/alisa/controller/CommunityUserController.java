package com.alisa.controller;

import com.alisa.model.CommunityUser;
import com.alisa.service.CommunityUserService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/communityuser")
public class CommunityUserController {

    @Autowired
    private CommunityUserService communityuserService;

    @GetMapping("/getAll")
    public Result<List<CommunityUser>> getAll() {
        var data = communityuserService.getAll();
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