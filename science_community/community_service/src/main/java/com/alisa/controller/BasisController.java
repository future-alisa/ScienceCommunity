package com.alisa.controller;

import com.alisa.model.Basis;
import com.alisa.service.BasisService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/basis")
public class BasisController {

    @Autowired
    private BasisService basisService;

    @GetMapping("/getAll")
    public Result<List<Basis>> getAll() {
        var data = basisService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<Basis> getById(@PathVariable String id) {
        var data = basisService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Basis basis) {
        var count = basisService.upsert(basis);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<Basis> list) {
        var count = basisService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = basisService.batchDelete(ids);
        return new Result<>(count);
    }
}