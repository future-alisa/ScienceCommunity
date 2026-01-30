package com.alisa.controller;

import com.alisa.model.Tag;
import com.alisa.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tag")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping("/getAll")
    public List<Tag> getAll() {
        return tagService.getAll();
    }

    @GetMapping("/{id}")
    public Tag getById(@PathVariable String id) {
        return tagService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody Tag tag) {
        tagService.upsert(tag);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Tag> list) {
        tagService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        tagService.batchDelete(ids);
    }
}