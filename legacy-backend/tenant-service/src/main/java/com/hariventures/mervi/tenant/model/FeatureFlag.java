package com.hariventures.mervi.tenant.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Map;

@Document(collection = "feature_flags")
@CompoundIndexes({
    @CompoundIndex(name = "tenant_feature_idx", def = "{'tenantId': 1, 'featureKey': 1}", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeatureFlag extends TenantAwareEntity {

    @Field("featureKey")
    private String featureKey;

    @Builder.Default
    @Field("enabled")
    private boolean enabled = false;

    @Field("config")
    private Map<String, Object> config;

    @Field("updatedBy")
    private String updatedBy;
}
