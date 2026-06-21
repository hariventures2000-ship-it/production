package com.hariventures.mervi.auth.service;

import com.hariventures.mervi.auth.model.Session;
import com.hariventures.mervi.auth.repository.SessionRepository;
import com.hariventures.mervi.shared.exception.UnauthorizedException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;

    public Session createSession(String userId, String refreshTokenHash, String ipAddress, String userAgent, long expirySeconds) {
        Session session = Session.builder()
                .userId(userId)
                .sessionId(UUID.randomUUID().toString())
                .refreshTokenHash(refreshTokenHash)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .expiresAt(Instant.now().plusSeconds(expirySeconds))
                .build();
        
        session.ensureTenantContext();
        return sessionRepository.save(session);
    }

    public void revokeSession(String sessionId, String userId) {
        Session session = sessionRepository.findByTenantIdAndSessionId(TenantContext.getTenantId(), sessionId)
                .orElseThrow(() -> new UnauthorizedException("Session not found"));
        
        if (!session.getUserId().equals(userId)) {
            throw new UnauthorizedException("Session belongs to another user");
        }

        session.setRevoked(true);
        session.setRevokedAt(Instant.now());
        session.setRevokedReason("User requested logout");
        sessionRepository.save(session);
    }

    public void revokeAllUserSessions(String userId) {
        sessionRepository.deleteByTenantIdAndUserId(TenantContext.getTenantId(), userId);
    }
}
