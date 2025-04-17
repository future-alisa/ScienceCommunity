package com.alisa.component;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.alisa.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class WebSocketEventListener {

    @Autowired
    private UserService connectedUserService;

    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        // 关键：从 nativeHeaders 里取 username
        List<String> usernames = headerAccessor.getNativeHeader("username");
        if (usernames != null && !usernames.isEmpty()) {
            String username = usernames.get(0);
            connectedUserService.addUser(sessionId, username);
            log.info("会话连接成功：用户名：{},会话ID：{}", username, sessionId);
        }

    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        connectedUserService.removeUser(sessionId);
        log.info("会话断开连接：会话ID：{}", sessionId);
    }
}