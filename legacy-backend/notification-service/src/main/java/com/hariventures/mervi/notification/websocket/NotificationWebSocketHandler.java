package com.hariventures.mervi.notification.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hariventures.mervi.notification.model.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@Slf4j
public class NotificationWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Track active WebSocket sessions
    private final Set<WebSocketSession> activeSessions = new CopyOnWriteArraySet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Map<String, String> queryParams = parseQuery(session.getUri().getQuery());
        String tenantId = queryParams.get("tenantId");
        String userId = queryParams.get("userId");
        String role = queryParams.get("role");

        // Put them in attributes for filtering during broadcasts
        if (tenantId != null) session.getAttributes().put("tenantId", tenantId);
        if (userId != null) session.getAttributes().put("userId", userId);
        if (role != null) session.getAttributes().put("role", role);

        activeSessions.add(session);
        log.info("WebSocket connection established. Session: {}, Tenant: {}, User: {}, Role: {}. Active count: {}",
                session.getId(), tenantId, userId, role, activeSessions.size());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        activeSessions.remove(session);
        log.info("WebSocket connection closed. Session: {}. Active count: {}", session.getId(), activeSessions.size());
    }

    public void broadcast(Notification notification) {
        String json;
        try {
            json = objectMapper.writeValueAsString(notification);
        } catch (Exception e) {
            log.error("Failed to serialize notification", e);
            return;
        }

        TextMessage message = new TextMessage(json);
        int dispatchedCount = 0;

        for (WebSocketSession session : activeSessions) {
            if (session.isOpen()) {
                String sessionTenantId = (String) session.getAttributes().get("tenantId");
                String sessionRole = (String) session.getAttributes().get("role");

                // Filter rules:
                // 1. If notification targetRole is ROLE_SUPER_ADMIN, it doesn't need to match tenantId (Super Admins are cross-tenant)
                // 2. Otherwise, tenantId must match
                // 3. targetRole must match sessionRole (if targetRole is specified)
                boolean tenantMatches = "ROLE_SUPER_ADMIN".equalsIgnoreCase(notification.getTargetRole()) || 
                        (notification.getTenantId() != null && notification.getTenantId().equals(sessionTenantId));
                
                boolean roleMatches = notification.getTargetRole() == null || 
                        notification.getTargetRole().equalsIgnoreCase(sessionRole);

                if (tenantMatches && roleMatches) {
                    try {
                        session.sendMessage(message);
                        dispatchedCount++;
                    } catch (IOException e) {
                        log.error("Failed to send WebSocket message to session {}", session.getId(), e);
                    }
                }
            }
        }
        log.info("Broadcasted notification type {} to {} sessions (out of {} active)", 
                notification.getType(), dispatchedCount, activeSessions.size());
    }

    private Map<String, String> parseQuery(String query) {
        Map<String, String> params = new HashMap<>();
        if (query != null && !query.isBlank()) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    try {
                        String key = URLDecoder.decode(keyValue[0], StandardCharsets.UTF_8);
                        String value = URLDecoder.decode(keyValue[1], StandardCharsets.UTF_8);
                        params.put(key, value);
                    } catch (Exception e) {
                        log.warn("Failed to decode query param: {}", pair, e);
                    }
                }
            }
        }
        return params;
    }
}
