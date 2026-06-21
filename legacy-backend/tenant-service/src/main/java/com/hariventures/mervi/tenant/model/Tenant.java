package com.hariventures.mervi.tenant.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Document(collection = "tenants")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tenant {

    @Id
    private String id;

    @Indexed(unique = true)
    @Field("slug")
    private String slug;

    @Field("name")
    private String name;

    @Indexed(unique = true, sparse = true)
    @Field("domain")
    private String domain;

    @Field("plan")
    private String plan; // FREE, STARTER, PRO, ENTERPRISE

    @Field("status")
    private String status; // ACTIVE, SUSPENDED, TRIAL

    @Field("maxUsers")
    private int maxUsers;

    @Field("billingEmail")
    private String billingEmail;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
