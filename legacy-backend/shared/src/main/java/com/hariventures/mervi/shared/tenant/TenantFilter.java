package com.hariventures.mervi.shared.tenant;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Extracts tenant context from incoming request headers (set by API Gateway).
 * Must run AFTER authentication but the gateway injects these headers.
 *
 * Headers read:
 *   X-Tenant-Id   — The tenant (organization) identifier
 *   X-User-Id     — The authenticated user's ID
 *   X-User-Role   — The authenticated user's role
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class TenantFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(TenantFilter.class);

    public static final String TENANT_HEADER = "X-Tenant-Id";
    public static final String USER_ID_HEADER = "X-User-Id";
    public static final String USER_ROLE_HEADER = "X-User-Role";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String tenantId = request.getHeader(TENANT_HEADER);
            String userId = request.getHeader(USER_ID_HEADER);
            String role = request.getHeader(USER_ROLE_HEADER);

            if (tenantId != null && !tenantId.isBlank()) {
                TenantContext.setTenantId(tenantId.trim());
            }
            if (userId != null && !userId.isBlank()) {
                TenantContext.setUserId(userId.trim());
            }
            if (role != null && !role.isBlank()) {
                TenantContext.setRole(role.trim());
            }

            log.debug("Tenant context set — tenant={}, user={}, role={}", tenantId, userId, role);

            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
