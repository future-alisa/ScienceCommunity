package com.alisa.controller;

import com.alisa.model.Document;
import com.alisa.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/document")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/getAll")
    public List<Document> getAll() {
        return documentService.getAll();
    }

    @GetMapping("/{id}")
    public Document getById(@PathVariable String id) {
        return documentService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody Document document) {
        documentService.upsert(document);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Document> list) {
        documentService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        documentService.batchDelete(ids);
    }
}