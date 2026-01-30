package com.alisa.controller;

import com.alisa.model.Case;
import com.alisa.service.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/case")
public class CaseController {

    @Autowired
    private CaseService caseService;

    @GetMapping("/getAll")
    public List<Case> getAll() {
        return caseService.getAll();
    }

    @GetMapping("/{id}")
    public Case getById(@PathVariable String id) {
        return caseService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody Case caseDto) {
        caseService.upsert(caseDto);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Case> list) {
        caseService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        caseService.batchDelete(ids);
    }
}