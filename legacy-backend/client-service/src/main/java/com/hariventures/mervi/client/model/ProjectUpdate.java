package com.hariventures.mervi.client.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "project_updates")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectUpdate extends TenantAwareEntity {

    @Indexed
    @Field("projectId")
    private String projectId;

    @Field("title")
    private String title;

    @Field("description")
    private String description;
}
