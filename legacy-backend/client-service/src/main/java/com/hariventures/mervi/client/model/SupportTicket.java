package com.hariventures.mervi.client.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "support_tickets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicket extends TenantAwareEntity {

    @Indexed(unique = true)
    @Field("ticketNumber")
    private String ticketNumber; // e.g. TKT-0001

    @Field("subject")
    private String subject;

    @Field("description")
    private String description;

    @Field("status")
    @Builder.Default
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    @Field("priority")
    @Builder.Default
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @Indexed
    @Field("clientId")
    private String clientId; // Client user ID (userId)

    @Field("assignedTo")
    private String assignedTo; // Reference to agent/lead username/ID
}
