package com.hariventures.mervi.auth.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

/**
 * Session document — tracks active refresh token sessions.
 */
@Document(collection = "sessions")
@CompoundIndexes({
    @CompoundIndex(name = "tenant_session_idx", def = "{'tenantId': 1, 'sessionId': 1}", unique = true),
    @CompoundIndex(name = "tenant_user_idx", def = "{'tenantId': 1, 'userId': 1}")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Session extends TenantAwareEntity {

    @Field("userId")
    private String userId;

    @Indexed(unique = true)
    @Field("sessionId")
    private String sessionId;

    @Field("refreshTokenHash")
    private String refreshTokenHash;

    @Field("ipAddress")
    private String ipAddress;

    @Field("userAgent")
    private String userAgent;

    @Field("deviceFingerprint")
    private String deviceFingerprint;

    @Indexed(expireAfterSeconds = 0)
    @Field("expiresAt")
    private Instant expiresAt;

    @Builder.Default
    @Field("isRevoked")
    private boolean isRevoked = false;

    @Field("revokedAt")
    private Instant revokedAt;

    @Field("revokedReason")
    private String revokedReason;

    @Field("lastUsedAt")
    private Instant lastUsedAt;
}
