package com.alisa.controller;

import com.alisa.model.TagCommunity;
import com.alisa.service.TagCommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tagcommunity")
public class TagCommunityController {

    @Autowired
    private TagCommunityService tagcommunityService;

    @GetMapping("/getAll")
    public List<TagCommunity> getAll() {
        return tagcommunityService.getAll();
    }

    @GetMapping("/{id}")
    public TagCommunity getById(@PathVariable String id) {
        return tagcommunityService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody TagCommunity tagcommunity) {
        tagcommunityService.upsert(tagcommunity);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<TagCommunity> list) {
        tagcommunityService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        tagcommunityService.batchDelete(ids);
    }
}