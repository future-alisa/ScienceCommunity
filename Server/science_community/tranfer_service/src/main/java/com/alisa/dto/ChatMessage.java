package com.alisa.dto;

import lombok.Data;

@Data
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private String receiver; // 用于私聊
    private String groupId; // 用于群聊

    public enum MessageType {
        CHAT, JOIN, LEAVE, PRIVATE
    }
}