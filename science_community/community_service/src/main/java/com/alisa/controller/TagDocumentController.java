package com.alisa.controller;

import com.alisa.model.TagDocument;
import com.alisa.service.TagDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tagdocument")
public class TagDocumentController {

    @Autowired
    private TagDocumentService tagdocumentService;

    @GetMapping("/getAll")
    public List<TagDocument> getAll() {
        return tagdocumentService.getAll();
    }

    @GetMapping("/{id}")
    public TagDocument getById(@PathVariable String id) {
        return tagdocumentService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody TagDocument tagdocument) {
        tagdocumentService.upsert(tagdocument);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<TagDocument> list) {
        tagdocumentService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        tagdocumentService.batchDelete(ids);
    }
}