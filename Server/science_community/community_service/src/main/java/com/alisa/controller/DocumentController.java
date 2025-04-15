package com.alisa.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alisa.model.Document;
import com.alisa.service.DocumentService;

@RestController
@RequestMapping("api/document/")
public class DocumentController {
    @Autowired
    private DocumentService documentService;

    @PostMapping("save")
    public ResponseEntity<String> save(@RequestBody Document document) {
         if (document.getDocumentId() == "") {
            String uuid = UUID.randomUUID().toString().replace("-", "");
            document.setDocumentId(uuid);
        }
        boolean res = documentService.Save(document);
        return ResponseEntity.ok(String.valueOf(res));
    }

    @DeleteMapping("delete")
    public ResponseEntity<String> delete(String id) {
        boolean res = documentService.Delete(id);
        return ResponseEntity.ok(String.valueOf(res));
    }

    @GetMapping("get")
    public ResponseEntity<List<Document>> Get(String type) {
        var data=documentService.Get(type);
        return ResponseEntity.ok(data);
    }

    @GetMapping("getById")
    public ResponseEntity<Document> GetById(String id) {
        var data=documentService.GetById(id);
        return ResponseEntity.ok(data);
    }
}
