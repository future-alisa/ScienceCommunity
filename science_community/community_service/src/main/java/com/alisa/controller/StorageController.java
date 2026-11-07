package com.alisa.controller;

import com.alisa.service.ObjectStorageService;
import com.alisa.util.Result;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/storage")
public class StorageController {
    private final ObjectStorageService storage;
    public StorageController(ObjectStorageService storage) { this.storage = storage; }
    @PostMapping("/read-urls")
    public Result<Map<String, String>> readUrls(@RequestBody java.util.List<String> urls) {
        return new Result<>(storage.readUrls(urls));
    }
    @GetMapping("/read-url")
    public Result<Map<String, String>> readUrl(@RequestParam("url") String url) {
        return new Result<>(storage.readUrl(url));
    }
    @PostMapping(consumes = "multipart/form-data")
    public Result<Map<String, Object>> upload(@RequestParam("file") MultipartFile file,
        @RequestParam(value = "communityId", required = false) String communityId,
        @RequestParam(value = "purpose", defaultValue = "attachment") String purpose) {
        return new Result<>(storage.upload(file, communityId, purpose));
    }
}
