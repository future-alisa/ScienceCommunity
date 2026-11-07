package com.alisa.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Legacy relation tables are retained for audit only; all content uses /document. */
@RestController
@RequestMapping({"/basis", "/case", "/post"})
public class LegacyDocumentController {
    @RequestMapping({"", "/**"})
    public ResponseEntity<Map<String, Object>> retired() {
        return ResponseEntity.status(410).body(Map.of("code", 410, "message", "资料已统一为文档，请使用 /document 接口，通过 documentCategoryId 区分理论资料、案例与文章"));
    }
}
