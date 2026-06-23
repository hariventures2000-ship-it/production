package com.hariventures.mervi.notification.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Document(collection = "notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends TenantAwareEntity {

    @Field("title")
    private String title;

    @Field("message")
    private String message;

    @Field("type")
    private String type; // e.g. EMPLOYEE_ONBOARDED, PROJECT_COMPLETED, INVOICE_PAID, SYSTEM

    @Field("targetRole")
    private String targetRole; // e.g. ROLE_SUPER_ADMIN, ROLE_MANAGING_DIRECTOR, ROLE_EMPLOYEE, ROLE_CLIENT

    @Field("isRead")
    @Builder.Default
    private boolean isRead = false;
}
