package com.alisa.controller;

import com.alisa.model.UserContext;
import com.alisa.util.Result;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController
public class OAuthProfileController {
    @GetMapping("/auth/profile")
    public Result<Map<String, String>> profile() {
        var user = UserContext.get();
        if (user == null || user.getUserId() == null || user.getUserId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "请先登录");
        }
        return new Result<>(Map.of("username", user.getUsername(), "userId", user.getUserId(), "email", ""));
    }
}
