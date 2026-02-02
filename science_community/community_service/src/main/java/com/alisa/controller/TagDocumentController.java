package com.alisa.controller;

import com.alisa.model.TagDocument;
import com.alisa.service.TagDocumentService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tagdocument")
public class TagDocumentController {

    @Autowired
    private TagDocumentService tagdocumentService;

    @GetMapping("/getAll")
    public Result<List<TagDocument>> getAll() {
        var data = tagdocumentService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<TagDocument> getById(@PathVariable String id) {
        var data = tagdocumentService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody TagDocument tagdocument) {
        var count = tagdocumentService.upsert(tagdocument);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<TagDocument> list) {
        var count = tagdocumentService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = tagdocumentService.batchDelete(ids);
        return new Result<>(count);
    }
}