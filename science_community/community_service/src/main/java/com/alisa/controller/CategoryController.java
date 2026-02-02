package com.alisa.controller;

import com.alisa.model.Category;
import com.alisa.service.CategoryService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/getAll")
    public Result<List<Category>> getAll() {
        var data = categoryService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<Category> getById(@PathVariable String id) {
        var data = categoryService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Category category) {
        var count = categoryService.upsert(category);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<Category> list) {
        var count = categoryService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = categoryService.batchDelete(ids);
        return new Result<>(count);
    }
}