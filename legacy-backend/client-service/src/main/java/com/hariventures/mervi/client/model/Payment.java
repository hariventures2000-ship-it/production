package com.hariventures.mervi.client.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "payments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends TenantAwareEntity {

    @Indexed
    @Field("invoiceId")
    private String invoiceId;

    @Indexed(unique = true)
    @Field("paymentNumber")
    private String paymentNumber; // e.g. PMT-2026-001

    @Field("amount")
    private BigDecimal amount;

    @Field("currency")
    @Builder.Default
    private String currency = "INR";

    @Field("status")
    @Builder.Default
    private String status = "PENDING"; // SUCCESS, FAILED, PENDING

    @Field("paidAt")
    private Instant paidAt;

    @Field("receiptUrl")
    private String receiptUrl;

    @Field("razorpayOrderId")
    private String razorpayOrderId;

    @Field("razorpayPaymentId")
    private String razorpayPaymentId;
}
