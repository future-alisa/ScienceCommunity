package com.alisa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import com.alisa.dto.ChatMessage;
import com.alisa.service.ChatService;
import com.alisa.service.UserService;

@Controller
public class ChatController {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private ChatService chatService;
    @Autowired
    private UserService userService;

    // 处理群聊消息
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        chatService.saveMessage(chatMessage);
        return chatMessage;
    }

    // 处理用户加入群聊
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor) {
        // 将用户名添加到WebSocket会话中
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        userService.addUser(chatMessage.getSender());
        return chatMessage;
    }

    // 处理私聊消息
    @MessageMapping("/chat.private")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        chatService.saveMessage(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiver(),
                "/queue/private",
                chatMessage);
    }

    // 处理创建群组
    @MessageMapping("/group.create")
    public void createGroup(@Payload ChatMessage chatMessage) {
        String groupId = chatService.createGroup(chatMessage.getGroupId(), chatMessage.getSender());
        messagingTemplate.convertAndSend("/topic/group." + groupId, chatMessage);
    }

    // 处理加入群组
    @MessageMapping("/group.join")
    public void joinGroup(@Payload ChatMessage chatMessage) {
        chatService.joinGroup(chatMessage.getGroupId(), chatMessage.getSender());
        messagingTemplate.convertAndSend("/topic/group." + chatMessage.getGroupId(), chatMessage);
    }
}