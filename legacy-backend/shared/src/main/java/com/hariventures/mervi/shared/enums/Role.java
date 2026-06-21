package com.hariventures.mervi.shared.enums;

/**
 * Platform-wide role definitions.
 * SUPER_ADMIN is platform-level (Hari Ventures).
 * All other roles exist within a tenant organization.
 */
public enum Role {
    SUPER_ADMIN,
    CEO,
    MANAGING_DIRECTOR,
    HR,
    TEAM_LEAD,
    EMPLOYEE,
    CLIENT;

    public boolean isPlatformLevel() {
        return this == SUPER_ADMIN;
    }

    public boolean isManagement() {
        return this == CEO || this == MANAGING_DIRECTOR;
    }

    public boolean isInternal() {
        return this != CLIENT && this != SUPER_ADMIN;
    }
}
