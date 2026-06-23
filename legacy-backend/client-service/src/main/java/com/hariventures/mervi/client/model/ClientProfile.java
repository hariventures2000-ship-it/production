package com.hariventures.mervi.client.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "client_profiles")
@CompoundIndexes({
    @CompoundIndex(name = "tenant_user_idx", def = "{'tenantId': 1, 'userId': 1}", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientProfile extends TenantAwareEntity {

    @Field("userId")
    private String userId; // Reference to auth_db.users._id

    @Field("companyName")
    private String companyName;

    @Field("contactEmail")
    private String contactEmail;

    @Field("contactPhone")
    private String contactPhone;

    @Field("address")
    private String address;

    @Field("website")
    private String website;

    @Field("industry")
    private String industry;

    @Field("status")
    @Builder.Default
    private String status = "ACTIVE";
}
