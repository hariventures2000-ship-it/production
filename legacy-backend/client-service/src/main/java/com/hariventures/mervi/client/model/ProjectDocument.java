package com.hariventures.mervi.client.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "project_documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDocument extends TenantAwareEntity {

    @Indexed
    @Field("projectId")
    private String projectId;

    @Field("name")
    private String name;

    @Field("type")
    private String type; // CONTRACT, PROPOSAL, REPORT, DESIGN, INVOICE, SPECIFICATION

    @Field("sizeBytes")
    private long sizeBytes;

    @Field("fileUrl")
    private String fileUrl;
}
