package com.alisa.controller;

import com.alisa.model.TagCommunity;
import com.alisa.service.TagCommunityService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tagcommunity")
public class TagCommunityController {

    @Autowired
    private TagCommunityService tagcommunityService;

    @GetMapping("/getAll")
    public Result<List<TagCommunity>> getAll() {
        var data = tagcommunityService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<TagCommunity> getById(@PathVariable String id) {
        var data = tagcommunityService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody TagCommunity tagcommunity) {
        var count = tagcommunityService.upsert(tagcommunity);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<TagCommunity> list) {
        var count = tagcommunityService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = tagcommunityService.batchDelete(ids);
        return new Result<>(count);
    }
}