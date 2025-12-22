package com.alisa.controller;

import com.alisa.model.Base;
import com.alisa.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/base")
public class BaseController {

    @Autowired
    private BaseService baseService;

    @GetMapping("/getAll")
    public List<Base> getAll() {
        return baseService.getAll();
    }

    @GetMapping("/{id}")
    public Base getById(@PathVariable String id) {
        return baseService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody Base base) {
        baseService.upsert(base);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Base> list) {
        baseService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        baseService.batchDelete(ids);
    }
}