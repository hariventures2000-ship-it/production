package com.hariventures.mervi.shared.security;

import com.hariventures.mervi.shared.enums.AuthType;
import com.hariventures.mervi.shared.enums.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

/**
 * JWT token provider — generates and validates access/refresh tokens.
 * All tokens include tenantId for multi-tenant isolation.
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final SecretKey accessKey;
    private final SecretKey refreshKey;
    private final SecretKey routeSessionKey;
    private final Duration accessExpiry;
    private final Duration refreshExpiry;

    public JwtTokenProvider(
            @Value("${mervi.jwt.access-secret}") String accessSecret,
            @Value("${mervi.jwt.refresh-secret}") String refreshSecret,
            @Value("${mervi.jwt.route-session-secret}") String routeSessionSecret,
            @Value("${mervi.jwt.access-expiry:15m}") Duration accessExpiry,
            @Value("${mervi.jwt.refresh-expiry:7d}") Duration refreshExpiry) {
        this.accessKey = Keys.hmacShaKeyFor(padKey(accessSecret));
        this.refreshKey = Keys.hmacShaKeyFor(padKey(refreshSecret));
        this.routeSessionKey = Keys.hmacShaKeyFor(padKey(routeSessionSecret));
        this.accessExpiry = accessExpiry;
        this.refreshExpiry = refreshExpiry;
    }

    // ─── Token Generation ───────────────────────────────────────────────

    public String generateAccessToken(String userId, Role role, AuthType authType,
                                       String tenantId, int tokenVersion) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(userId)
                .claim(SecurityConstants.CLAIM_ROLE, role.name())
                .claim(SecurityConstants.CLAIM_AUTH_TYPE, authType.name())
                .claim(SecurityConstants.CLAIM_TENANT_ID, tenantId)
                .claim(SecurityConstants.CLAIM_TOKEN_VERSION, tokenVersion)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessExpiry)))
                .signWith(accessKey)
                .compact();
    }

    public String generateRefreshToken(String userId, String sessionId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(userId)
                .claim("sessionId", sessionId)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(refreshExpiry)))
                .signWith(refreshKey)
                .compact();
    }

    public String generateRouteSessionToken(String userId, Role role, AuthType authType,
                                             String tenantId, int tokenVersion) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(userId)
                .claim(SecurityConstants.CLAIM_ROLE, role.name())
                .claim(SecurityConstants.CLAIM_AUTH_TYPE, authType.name())
                .claim(SecurityConstants.CLAIM_TENANT_ID, tenantId)
                .claim(SecurityConstants.CLAIM_TOKEN_VERSION, tokenVersion)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(300))) // 5 minutes
                .signWith(routeSessionKey)
                .compact();
    }

    public String generateTempToken(String userId, String purpose, Duration expiry) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(userId)
                .claim("purpose", purpose)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expiry)))
                .signWith(accessKey)
                .compact();
    }

    // ─── Token Validation ───────────────────────────────────────────────

    public Claims validateAccessToken(String token) {
        return parseToken(token, accessKey);
    }

    public Claims validateRefreshToken(String token) {
        return parseToken(token, refreshKey);
    }

    public Claims validateRouteSessionToken(String token) {
        return parseToken(token, routeSessionKey);
    }

    public Claims validateTempToken(String token, String expectedPurpose) {
        Claims claims = parseToken(token, accessKey);
        String purpose = claims.get("purpose", String.class);
        if (!expectedPurpose.equals(purpose)) {
            throw new JwtException("Invalid token purpose: expected=" + expectedPurpose + ", actual=" + purpose);
        }
        return claims;
    }

    // ─── Helpers ────────────────────────────────────────────────────────

    private Claims parseToken(String token, SecretKey key) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private byte[] padKey(String secret) {
        // Ensure key is at least 256 bits (32 bytes) for HS256
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length >= 32) return keyBytes;
        byte[] padded = new byte[32];
        System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
        return padded;
    }

    public long getAccessExpirySeconds() {
        return accessExpiry.toSeconds();
    }
}
