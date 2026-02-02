package com.alisa.controller;

import com.alisa.model.Case;
import com.alisa.service.CaseService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/case")
public class CaseController {

    @Autowired
    private CaseService caseService;

    @GetMapping("/getAll")
    public Result<List<Case>> getAll() {
        var data = caseService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<Case> getById(@PathVariable String id) {
        var data = caseService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Case caseDto) {
        var count = caseService.upsert(caseDto);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<Case> list) {
        var count = caseService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = caseService.batchDelete(ids);
        return new Result<>(count);
    }
}