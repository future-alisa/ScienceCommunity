package com.alisa.controller;

import com.alisa.model.Post;
import com.alisa.service.PostService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping("/getAll")
    public Result<List<Post>> getAll() {
        var data = postService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<Post> getById(@PathVariable String id) {
        var data = postService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Post post) {
        var count = postService.upsert(post);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<Post> list) {
        var count = postService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = postService.batchDelete(ids);
        return new Result<>(count);
    }
}