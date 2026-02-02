package com.alisa.controller;

import com.alisa.model.Comment;
import com.alisa.service.CommentService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/getAll")
    public Result<List<Comment>> getAll() {
        var data = commentService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<Comment> getById(@PathVariable String id) {
        var data = commentService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Comment comment) {
        var count = commentService.upsert(comment);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<Comment> list) {
        var count = commentService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = commentService.batchDelete(ids);
        return new Result<>(count);
    }
}