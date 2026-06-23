package com.hariventures.mervi.client.model;

import com.hariventures.mervi.shared.enums.ProjectStatus;
import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Document(collection = "projects")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project extends TenantAwareEntity {

    @Field("name")
    private String name;

    @Field("description")
    private String description;

    @Indexed
    @Field("clientId")
    private String clientId; // The client user ID (userId)

    @Field("status")
    @Builder.Default
    private ProjectStatus status = ProjectStatus.PLANNING;

    @Field("currentPhase")
    private String currentPhase;

    @Field("completionPercentage")
    private int completionPercentage;

    @Field("estimatedEndDate")
    private Instant estimatedEndDate;

    @Field("startDate")
    private Instant startDate;
}
