package com.hariventures.mervi.auth.model;

import com.hariventures.mervi.shared.enums.AuthType;
import com.hariventures.mervi.shared.enums.Role;
import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;

/**
 * User document — stored in auth_db.users.
 * Extends TenantAwareEntity for multi-tenant isolation.
 */
@Document(collection = "users")
@CompoundIndexes({
    @CompoundIndex(name = "tenant_email_idx", def = "{'tenantId': 1, 'email': 1}", unique = true, sparse = true),
    @CompoundIndex(name = "tenant_username_idx", def = "{'tenantId': 1, 'username': 1}", unique = true, sparse = true),
    @CompoundIndex(name = "tenant_role_idx", def = "{'tenantId': 1, 'role': 1}"),
    @CompoundIndex(name = "authtype_active_idx", def = "{'authType': 1, 'isActive': 1}")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends TenantAwareEntity {

    // ─── Identity ───────────────────────────────────────────────────────
    @Field("role")
    private Role role;

    @Field("authType")
    private AuthType authType;

    @Field("firstName")
    private String firstName;

    @Field("lastName")
    private String lastName;

    @Field("avatar")
    private String avatar;

    @Field("phone")
    private String phone;

    @Builder.Default
    @Field("isActive")
    private boolean isActive = true;

    // ─── Client Auth Fields (email + OTP) ───────────────────────────────
    @Indexed(sparse = true)
    @Field("email")
    private String email;

    @Field("passwordHash")
    private String passwordHash;

    @Builder.Default
    @Field("isEmailVerified")
    private boolean isEmailVerified = false;

    @Field("emailVerifyToken")
    private String emailVerifyToken;

    @Field("emailVerifyExpiry")
    private Instant emailVerifyExpiry;

    @Builder.Default
    @Field("isFirstLogin")
    private boolean isFirstLogin = false;

    // ─── Internal Auth Fields (username + password + MFA) ───────────────
    @Indexed(sparse = true)
    @Field("username")
    private String username;

    @Field("internalPasswordHash")
    private String internalPasswordHash;

    @Builder.Default
    @Field("mfaEnabled")
    private boolean mfaEnabled = false;

    @Field("mfaSecret")
    private String mfaSecret;

    @Field("mfaBackupCodes")
    private List<String> mfaBackupCodes;

    @Field("mfaEnabledAt")
    private Instant mfaEnabledAt;

    // ─── Security ───────────────────────────────────────────────────────
    @Field("lastLoginAt")
    private Instant lastLoginAt;

    @Builder.Default
    @Field("failedLoginAttempts")
    private int failedLoginAttempts = 0;

    @Field("lockoutUntil")
    private Instant lockoutUntil;

    @Field("lastFailedLoginAt")
    private Instant lastFailedLoginAt;

    @Field("lastPasswordChangeAt")
    private Instant lastPasswordChangeAt;

    @Builder.Default
    @Field("tokenVersion")
    private int tokenVersion = 0;

    @Field("passwordResetToken")
    private String passwordResetToken;

    @Field("passwordResetExpiry")
    private Instant passwordResetExpiry;

    // ─── Helpers ────────────────────────────────────────────────────────
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public boolean isLockedOut() {
        return lockoutUntil != null && lockoutUntil.isAfter(Instant.now());
    }
}
