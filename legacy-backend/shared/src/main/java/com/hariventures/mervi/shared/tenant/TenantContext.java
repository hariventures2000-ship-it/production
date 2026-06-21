package com.hariventures.mervi.shared.tenant;

/**
 * ThreadLocal holder for the current tenant ID.
 * Populated by TenantFilter on every incoming request.
 * Cleared after request completes to prevent memory leaks.
 *
 * Usage in services:
 *   String tenantId = TenantContext.getTenantId();
 */
public final class TenantContext {

    /** Sentinel value for platform-level (Super Admin) requests */
    public static final String PLATFORM_TENANT = "PLATFORM";

    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_ROLE = new ThreadLocal<>();

    private TenantContext() {
        // Utility class
    }

    // ─── Tenant ─────────────────────────────────────────────────────────

    public static void setTenantId(String tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static String getTenantId() {
        return CURRENT_TENANT.get();
    }

    public static boolean isPlatformRequest() {
        return PLATFORM_TENANT.equals(CURRENT_TENANT.get());
    }

    // ─── User ───────────────────────────────────────────────────────────

    public static void setUserId(String userId) {
        CURRENT_USER_ID.set(userId);
    }

    public static String getUserId() {
        return CURRENT_USER_ID.get();
    }

    // ─── Role ───────────────────────────────────────────────────────────

    public static void setRole(String role) {
        CURRENT_ROLE.set(role);
    }

    public static String getRole() {
        return CURRENT_ROLE.get();
    }

    // ─── Cleanup ────────────────────────────────────────────────────────

    public static void clear() {
        CURRENT_TENANT.remove();
        CURRENT_USER_ID.remove();
        CURRENT_ROLE.remove();
    }
}
