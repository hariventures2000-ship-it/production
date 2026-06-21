package com.hariventures.mervi.shared.tenant;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

/**
 * Base class for all tenant-scoped MongoDB documents.
 * Every collection in the platform (except tenant_db.tenants itself)
 * must extend this class to enforce tenant isolation.
 */
@Getter
@Setter
public abstract class TenantAwareEntity {

    @Id
    private String id;

    @NotBlank
    @Indexed
    @Field("tenantId")
    private String tenantId;

    @NotBlank
    @Indexed
    @Field("organizationId")
    private String organizationId;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    /**
     * Auto-populates tenantId and organizationId from TenantContext
     * if not already set. Call this before saving.
     */
    public void ensureTenantContext() {
        if (this.tenantId == null || this.tenantId.isBlank()) {
            this.tenantId = TenantContext.getTenantId();
        }
        if (this.organizationId == null || this.organizationId.isBlank()) {
            this.organizationId = this.tenantId;
        }
    }
}
