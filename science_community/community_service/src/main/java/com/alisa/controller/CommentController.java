package com.alisa.controller;

import com.alisa.model.Comment;
import com.alisa.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/getAll")
    public List<Comment> getAll() {
        return commentService.getAll();
    }

    @GetMapping("/{id}")
    public Comment getById(@PathVariable String id) {
        return commentService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody Comment comment) {
        commentService.upsert(comment);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Comment> list) {
        commentService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        commentService.batchDelete(ids);
    }
}