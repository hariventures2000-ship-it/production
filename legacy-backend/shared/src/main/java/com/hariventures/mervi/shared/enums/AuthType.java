package com.hariventures.mervi.shared.enums;

/**
 * Authentication type — determines the login flow.
 * CLIENT uses email + OTP.
 * INTERNAL uses username + password + MFA (TOTP).
 * PLATFORM is for Super Admin accounts.
 */
public enum AuthType {
    CLIENT,
    INTERNAL,
    PLATFORM
}
