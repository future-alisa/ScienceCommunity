package com.alisa.service;

import org.springframework.stereotype.Service;

import com.alisa.dto.ChatMessage;
import com.alisa.dto.Group;

import jakarta.annotation.PostConstruct;

import java.util.*;

@Service
public class ChatService {
    // 存储消息历史 (实际项目中应该使用数据库)
    private final Map<String, List<ChatMessage>> messageHistory = new HashMap<>();

    // 存储群组信息
    private final Map<String, Group> groups = new HashMap<>();
    // 默认公共群组ID常量
    public static final String DEFAULT_PUBLIC_GROUP_ID = "default-public-group";
    public static final String DEFAULT_PUBLIC_GROUP_NAME = "公共聊天室";

    // 初始化时创建默认群组
    @PostConstruct
    public void init() {
        createDefaultPublicGroup();
    }

    // 创建默认公共群组
    private void createDefaultPublicGroup() {
        Group publicGroup = new Group();
        publicGroup.setGroupId(DEFAULT_PUBLIC_GROUP_ID);
        publicGroup.setGroupName(DEFAULT_PUBLIC_GROUP_NAME);
        groups.put(DEFAULT_PUBLIC_GROUP_ID, publicGroup);
    }

    public void saveMessage(ChatMessage message) {
        if (message == null || message.getSender() == null || message.getReceiver() == null) {
            throw new IllegalArgumentException("消息或用户信息不完整");
        }

        String key = message.getTo() != null ? "group_" + message.getTo()
                : "private_" + getPrivateChatKey(message.getSender(), message.getReceiver());

        messageHistory.computeIfAbsent(key, k -> new ArrayList<>()).add(message);
    }

    public String createGroup(String groupName, String creator) {
        String groupId = UUID.randomUUID().toString();
        Group group = new Group();
        group.setGroupId(groupId);
        group.setGroupName(groupName);
        group.getMembers().add(creator);
        groups.put(groupId, group);
        return groupId;
    }

    public void joinGroup(String groupId, String username) {
        Group group = groups.get(groupId);
        if (group != null) {
            group.getMembers().add(username);
        }
    }

    public List<ChatMessage> getMessageHistory(String key) {
        return messageHistory.getOrDefault(key, Collections.emptyList());
    }

    private String getPrivateChatKey(String user1, String user2) {
        if (user1 == null || user2 == null) {
            throw new IllegalArgumentException("用户名不能为null");
        }
        return user1.compareTo(user2) < 0 ? user1 + "_" + user2 : user2 + "_" + user1;
    }
}