package com.hariventures.mervi.gateway.filter;

import com.hariventures.mervi.shared.enums.Role;
import com.hariventures.mervi.shared.security.SecurityConstants;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class RbacAuthorizationFilter extends AbstractGatewayFilterFactory<RbacAuthorizationFilter.Config> {

    public RbacAuthorizationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String roleStr = exchange.getRequest().getHeaders().getFirst(SecurityConstants.USER_ROLE_HEADER);
            if (roleStr == null || roleStr.isEmpty()) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }

            try {
                Role role = Role.valueOf(roleStr);
                String path = exchange.getRequest().getURI().getPath();

                // RBAC Rules Matrix
                if (path.startsWith("/api/v1/tenants") && role != Role.SUPER_ADMIN) {
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }

                // HR Service — restricted to HR, CEO, MANAGING_DIRECTOR, SUPER_ADMIN
                if (path.startsWith("/api/v1/hr")) {
                    if (role != Role.HR && role != Role.CEO && role != Role.MANAGING_DIRECTOR && role != Role.SUPER_ADMIN) {
                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                        return exchange.getResponse().setComplete();
                    }
                }

                // Employee Service — accessible by EMPLOYEE, HR, TEAM_LEAD, CEO, MD, SUPER_ADMIN
                if (path.startsWith("/api/v1/employee")) {
                    if (role == Role.CLIENT) {
                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                        return exchange.getResponse().setComplete();
                    }
                }
                
                // Allow request
                return chain.filter(exchange);

            } catch (IllegalArgumentException e) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
        };
    }

    public static class Config {
    }
}
