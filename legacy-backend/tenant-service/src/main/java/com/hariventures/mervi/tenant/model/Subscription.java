package com.hariventures.mervi.tenant.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "subscriptions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subscription extends TenantAwareEntity {

    @Field("plan")
    private String plan;

    @Field("startDate")
    private Instant startDate;

    @Field("endDate")
    private Instant endDate;

    @Field("amount")
    private BigDecimal amount;

    @Field("currency")
    private String currency;

    @Field("status")
    private String status; // ACTIVE, CANCELLED, PAST_DUE

    @Field("paymentGateway")
    private String paymentGateway; // STRIPE, RAZORPAY

    @Field("gatewaySubscriptionId")
    private String gatewaySubscriptionId;
}
