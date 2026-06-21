package com.hariventures.mervi.gateway.filter;

import com.hariventures.mervi.shared.security.SecurityConstants;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class TenantResolutionFilter extends AbstractGatewayFilterFactory<TenantResolutionFilter.Config> {

    public TenantResolutionFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // Usually, tenantId is extracted by JwtAuthenticationFilter and set as a header.
            // If the endpoint is public (like login), we might need to resolve tenant from domain/slug.
            
            String path = exchange.getRequest().getURI().getPath();
            
            // Allow Super Admin portal to hit /api/v1/auth without tenant context initially
            if (path.startsWith("/api/v1/auth/internal/login")) {
                return chain.filter(exchange);
            }

            // For client login, we expect a tenant header or slug
            if (path.startsWith("/api/v1/auth/client/login")) {
                // Resolution logic: check for X-Tenant-Id header first
                String tenantId = exchange.getRequest().getHeaders().getFirst(SecurityConstants.TENANT_HEADER);
                if (tenantId == null || tenantId.isEmpty()) {
                    // Extract from origin/domain or a custom header
                    String origin = exchange.getRequest().getHeaders().getOrigin();
                    // In a real implementation, you'd call a cached Tenant resolution service
                    // For now, we reject if missing
                    exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
                    return exchange.getResponse().setComplete();
                }
            }

            return chain.filter(exchange);
        };
    }

    public static class Config {
    }
}
