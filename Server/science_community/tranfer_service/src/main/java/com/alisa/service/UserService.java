package com.alisa.service;

import org.springframework.stereotype.Service;

import com.alisa.dto.User;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {
    // 存储在线用户 (实际项目中应该使用Redis等分布式缓存)
    private final Map<String, User> onlineUsers = new ConcurrentHashMap<>();

    public void addUser(String id, String name) {
        User user = new User();
        user.setSessionId(id);
        user.setUsername(name);
        onlineUsers.put(id, user);
    }

    public void removeUser(String username) {
        onlineUsers.remove(username);
    }

    public List<User> getOnlineUsers() {
        var temp = onlineUsers.values();
        return new ArrayList<>(temp);
    }

    public List<String> getUserGroups(String username) {
        // 实际项目中应该从数据库查询用户所属的群组
        return Collections.emptyList();
    }
}