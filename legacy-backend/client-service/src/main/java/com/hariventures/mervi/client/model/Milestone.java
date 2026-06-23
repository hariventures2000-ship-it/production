package com.hariventures.mervi.client.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Document(collection = "milestones")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Milestone extends TenantAwareEntity {

    @Indexed
    @Field("projectId")
    private String projectId;

    @Field("title")
    private String title;

    @Field("description")
    private String description;

    @Field("status")
    @Builder.Default
    private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED

    @Field("targetDate")
    private Instant targetDate;

    @Field("completedDate")
    private Instant completedDate;
}
