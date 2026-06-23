package com.hariventures.mervi.client.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "invoices")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice extends TenantAwareEntity {

    @Indexed
    @Field("projectId")
    private String projectId;

    @Indexed(unique = true)
    @Field("invoiceNumber")
    private String invoiceNumber; // e.g. INV-2026-001

    @Field("title")
    private String title;

    @Field("description")
    private String description;

    @Field("amount")
    private BigDecimal amount;

    @Field("currency")
    @Builder.Default
    private String currency = "INR";

    @Field("status")
    @Builder.Default
    private String status = "PENDING"; // PENDING, PAID, OVERDUE

    @Field("dueDate")
    private Instant dueDate;

    @Field("paidAt")
    private Instant paidAt;
}
