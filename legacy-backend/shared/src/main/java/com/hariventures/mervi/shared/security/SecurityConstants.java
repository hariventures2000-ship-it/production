package com.hariventures.mervi.shared.security;

/**
 * Security constants shared across all Mervi services.
 */
public final class SecurityConstants {

    private SecurityConstants() {}

    // ─── Header Names ───────────────────────────────────────────────────
    public static final String AUTH_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String TENANT_HEADER = "X-Tenant-Id";
    public static final String USER_ID_HEADER = "X-User-Id";
    public static final String USER_ROLE_HEADER = "X-User-Role";
    public static final String CSRF_HEADER = "X-CSRF-Token";
    public static final String REQUEST_ID_HEADER = "X-Request-Id";
    public static final String CORRELATION_ID_HEADER = "X-Correlation-Id";

    // ─── JWT Claim Keys ─────────────────────────────────────────────────
    public static final String CLAIM_ROLE = "role";
    public static final String CLAIM_AUTH_TYPE = "authType";
    public static final String CLAIM_TENANT_ID = "tenantId";
    public static final String CLAIM_ORGANIZATION_ID = "organizationId";
    public static final String CLAIM_TOKEN_VERSION = "tokenVersion";
    public static final String CLAIM_IS_FIRST_LOGIN = "isFirstLogin";

    // ─── Cookie Names ───────────────────────────────────────────────────
    public static final String REFRESH_TOKEN_COOKIE = "refreshToken";
    public static final String ROUTE_SESSION_COOKIE = "routeSessionToken";
    public static final String OTP_TEMP_COOKIE = "otpTempToken";
    public static final String MFA_TEMP_COOKIE = "mfaTempToken";
    public static final String CSRF_COOKIE = "csrfToken";

    // ─── Defaults ───────────────────────────────────────────────────────
    public static final int ACCESS_TOKEN_EXPIRY_MINUTES = 15;
    public static final int REFRESH_TOKEN_EXPIRY_DAYS = 7;
    public static final int OTP_EXPIRY_MINUTES = 5;
    public static final int MFA_TEMP_EXPIRY_MINUTES = 10;
    public static final int BCRYPT_ROUNDS = 12;
}
