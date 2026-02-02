package com.alisa.controller;

import com.alisa.model.Tag;
import com.alisa.service.TagService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tag")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping("/getAll")
    public Result<List<Tag>> getAll() {
        var data = tagService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<Tag> getById(@PathVariable String id) {
        var data = tagService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Tag tag) {
        var count = tagService.upsert(tag);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<Tag> list) {
        var count = tagService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = tagService.batchDelete(ids);
        return new Result<>(count);
    }
}