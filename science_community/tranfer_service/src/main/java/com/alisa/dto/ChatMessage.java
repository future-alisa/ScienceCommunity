package com.alisa.dto;

import lombok.Data;

@Data
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private String receiver;
    private String from;
    private String to;

    public enum MessageType {
        CHANNEL, JOIN, LEAVE, PRIVATE, PUBLIC
    }
}