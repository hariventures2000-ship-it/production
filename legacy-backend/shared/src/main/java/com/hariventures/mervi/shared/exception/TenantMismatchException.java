package com.hariventures.mervi.shared.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a request attempts to access data belonging to a different tenant.
 * This is a critical security exception.
 */
public class TenantMismatchException extends BaseException {
    public TenantMismatchException() {
        super("Access denied: tenant context mismatch", HttpStatus.FORBIDDEN, "TENANT_MISMATCH");
    }

    public TenantMismatchException(String requestedTenant, String actualTenant) {
        super(String.format("Tenant mismatch: requested=%s, actual=%s", requestedTenant, actualTenant),
              HttpStatus.FORBIDDEN, "TENANT_MISMATCH");
    }
}
