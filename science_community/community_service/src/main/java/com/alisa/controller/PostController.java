package com.alisa.controller;

import com.alisa.model.Post;
import com.alisa.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping("/getAll")
    public List<Post> getAll() {
        return postService.getAll();
    }

    @GetMapping("/{id}")
    public Post getById(@PathVariable String id) {
        return postService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody Post post) {
        postService.upsert(post);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Post> list) {
        postService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        postService.batchDelete(ids);
    }
}