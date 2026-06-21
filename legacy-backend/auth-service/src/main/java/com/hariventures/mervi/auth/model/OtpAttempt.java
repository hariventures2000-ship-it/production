package com.hariventures.mervi.auth.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Document(collection = "otp_attempts")
@CompoundIndexes({
    @CompoundIndex(name = "tenant_identifier_purpose_idx", def = "{'tenantId': 1, 'identifier': 1, 'purpose': 1}", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpAttempt extends TenantAwareEntity {

    @Field("identifier")
    private String identifier; // email or phone

    @Field("purpose")
    private String purpose;    // LOGIN, RESET_PASSWORD, etc.

    @Field("otpHash")
    private String otpHash;

    @Builder.Default
    @Field("attempts")
    private int attempts = 0;

    @Field("lockedUntil")
    private Instant lockedUntil;

    @Indexed(expireAfterSeconds = 0)
    @Field("expiresAt")
    private Instant expiresAt;
}
