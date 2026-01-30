package com.alisa.controller;

import com.alisa.model.Category;
import com.alisa.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/getAll")
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable String id) {
        return categoryService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody Category category) {
        categoryService.upsert(category);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Category> list) {
        categoryService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        categoryService.batchDelete(ids);
    }
}