package com.alisa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alisa.dto.User;
import com.alisa.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/online")
    public List<User> getOnlineUsers() {
        return userService.getOnlineUsers();
    }

    @GetMapping("/groups/{username}")
    public List<String> getUserGroups(@PathVariable String username) {
        return userService.getUserGroups(username);
    }
}
