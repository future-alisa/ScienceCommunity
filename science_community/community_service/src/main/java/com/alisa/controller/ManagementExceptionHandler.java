package com.alisa.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestControllerAdvice(assignableTypes = {StorageController.class, CommunityUserController.class, ChannelUserController.class, DocumentController.class, CommunityController.class, ChannelController.class, ChannelDiscussionController.class})
@org.springframework.core.annotation.Order(org.springframework.core.Ordered.HIGHEST_PRECEDENCE)
public class ManagementExceptionHandler {
    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> uploadTooLarge() {
        return ResponseEntity.status(413).body(Map.of("code", 413, "message", "附件不能超过20MB"));
    }
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handle(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode()).body(Map.of(
            "code", error.getStatusCode().value(), "message", error.getReason() == null ? "操作失败" : error.getReason()));
    }
}
