package com.alisa.controller;

import com.alisa.model.Community;
import com.alisa.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public void upsert(@RequestBody Community community) {
        communityService.upsert(community);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Community> list) {
        communityService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        communityService.batchDelete(ids);
    }
}