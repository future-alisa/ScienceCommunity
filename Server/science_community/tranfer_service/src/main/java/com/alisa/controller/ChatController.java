package com.alisa.controller;

import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Controller;

import com.alisa.dto.ChatMessage;
import com.alisa.service.ChatService;
import com.alisa.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class ChatController {
    Map<String, Set<String>> channelMembers = new ConcurrentHashMap<>();
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;
    @Autowired
    private SimpUserRegistry simpUserRegistry;
    @Autowired
    private ChatService chatService;
    @Autowired
    private UserService userService;

    // 加入频道
    @MessageMapping("/channel/{channelId}/join")
    public void joinChannel(@DestinationVariable String channelId, @Payload ChatMessage message, Principal principal) {
        channelMembers.computeIfAbsent(channelId, k -> ConcurrentHashMap.newKeySet())
                .add(principal.getName());

        // 通知频道有新成员加入（可选）
        messagingTemplate.convertAndSend(
                "/topic/channel/" + channelId + "/notifications", message);
    }

    // 离开频道
    @MessageMapping("/channel/{channelId}/leave")
    public void leaveChannel(@DestinationVariable String channelId, @Payload ChatMessage message, Principal principal) {
        Set<String> members = channelMembers.get(channelId);
        if (members != null) {
            members.remove(principal.getName());

            // 通知频道有成员离开（可选）
            messagingTemplate.convertAndSend(
                    "/topic/channel/" + channelId + "/notifications",
                    message);
        }
    }

    // 发送频道消息
    @MessageMapping("/channel/{channelId}/send")
    public void sendToChannel(
            @DestinationVariable String channelId,
            @Payload ChatMessage message,
            Principal principal) throws AccessDeniedException {

        Set<String> members = channelMembers.get(channelId);
        if (members == null || !members.contains(principal.getName())) {
            throw new AccessDeniedException("Not a member of this channel");
        }

        // 设置发送者信息
        message.setSender(principal.getName());

        // 向频道所有成员（除发送者外）发送消息
        members.stream()
                .filter(member -> !member.equals(principal.getName()))
                .forEach(member -> {
                    messagingTemplate.convertAndSendToUser(
                            member,
                            "/queue/channel/" + channelId,
                            message);
                });
    }

    // 处理群聊消息
    @MessageMapping("/chat.sendMessage")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // 1. 保存消息到历史记录
        chatService.saveMessage(chatMessage);

        // 2. 获取当前会话ID（用于排除自己）
        String sessionId = headerAccessor.getSessionId();
        String sender = chatMessage.getSender();

        // 3. 发送给所有订阅了/topic/public的用户，排除发送者
        log.info("用户 {} 发送群消息，当前在线用户数: {}",
                sender,
                simpUserRegistry.getUserCount());

        // 3. 构建 header，标记消息来自哪个 sessionId
        // 3. 遍历所有会话（含多设备登录），逐个发给 /topic/public，排除当前 sessionId
        simpUserRegistry.getUsers().forEach(user -> {
            user.getSessions().forEach(session -> {
                if (!session.getId().equals(sessionId)) {
                    SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.create();
                    accessor.setSessionId(session.getId());
                    accessor.setLeaveMutable(true);

                    messagingTemplate.convertAndSend(
                            "/topic/public",
                            chatMessage,
                            accessor.getMessageHeaders());
                }
            });
        });

        return chatMessage;
    }

    // 处理用户加入群聊
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor) {
        // 将用户名添加到WebSocket会话中
        var sessionId = headerAccessor.getSessionId();
        userService.addUser(sessionId, chatMessage.getSender());
        log.info("当前用户数量：{}", userService.getOnlineUsers().size());
        return chatMessage;
    }

    @MessageMapping("/chat.removeUser")
    @SendTo("/topic/public")
    public ChatMessage removeUser(@Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor) {
        userService.removeUser(headerAccessor.getSessionId());
        log.debug("当前用户数量：{}", userService.getOnlineUsers().size());
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