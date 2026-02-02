package com.alisa.controller;

import com.alisa.model.Document;
import com.alisa.model.UserContext;
import com.alisa.service.DocumentService;
import com.alisa.util.Result;
import com.alisa.util.UUIDTool;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/document")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/getAll")
    public Result<List<Document>> getAll() {
        var data = documentService.getAll();
        return new Result<List<Document>>(data);
    }

    @GetMapping("/{id}")
    public Result<Document> getById(@PathVariable String id) {
        var data = documentService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Document document) {
        var userContext = UserContext.get();
        document.setDocumentAuthorId(userContext.getUserId());
        document.setDocumentId(UUIDTool.getUUID());
        var count = documentService.upsert(document);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<Document> list) {
        var count = documentService.batchUpsert(list);
        return new Result<Integer>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = documentService.batchDelete(ids);
        return new Result<Integer>(count);
    }
}