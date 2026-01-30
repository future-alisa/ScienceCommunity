package com.alisa.controller;

import com.alisa.model.Basis;
import com.alisa.service.BasisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/basis")
public class BasisController {

    @Autowired
    private BasisService basisService;

    @GetMapping("/getAll")
    public List<Basis> getAll() {
        return basisService.getAll();
    }

    @GetMapping("/{id}")
    public Basis getById(@PathVariable String id) {
        return basisService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody Basis basis) {
        basisService.upsert(basis);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Basis> list) {
        basisService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        basisService.batchDelete(ids);
    }
}