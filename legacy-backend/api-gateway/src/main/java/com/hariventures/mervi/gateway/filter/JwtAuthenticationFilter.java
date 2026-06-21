package com.hariventures.mervi.gateway.filter;

import com.hariventures.mervi.shared.security.SecurityConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    private final SecretKey accessKey;

    public JwtAuthenticationFilter(@Value("${mervi.jwt.access-secret}") String accessSecret) {
        super(Config.class);
        this.accessKey = Keys.hmacShaKeyFor(padKey(accessSecret));
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            if (!request.getHeaders().containsKey(SecurityConstants.AUTH_HEADER)) {
                return onError(exchange, "Missing Authorization header", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst(SecurityConstants.AUTH_HEADER);
            if (authHeader == null || !authHeader.startsWith(SecurityConstants.BEARER_PREFIX)) {
                return onError(exchange, "Invalid Authorization header", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(SecurityConstants.BEARER_PREFIX.length());

            try {
                Claims claims = Jwts.parser()
                        .verifyWith(accessKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                // Mutate the request to append Headers for downstream services
                ServerHttpRequest mutatedRequest = request.mutate()
                        .header(SecurityConstants.USER_ID_HEADER, claims.getSubject())
                        .header(SecurityConstants.USER_ROLE_HEADER, claims.get(SecurityConstants.CLAIM_ROLE, String.class))
                        .header(SecurityConstants.TENANT_HEADER, claims.get(SecurityConstants.CLAIM_TENANT_ID, String.class))
                        .build();

                return chain.filter(exchange.mutate().request(mutatedRequest).build());

            } catch (Exception e) {
                return onError(exchange, "Invalid JWT token", HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }

    private byte[] padKey(String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length >= 32) return keyBytes;
        byte[] padded = new byte[32];
        System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
        return padded;
    }

    public static class Config {
        // Configuration properties
    }
}
