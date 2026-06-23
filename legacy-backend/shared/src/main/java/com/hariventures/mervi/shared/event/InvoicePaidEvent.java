package com.hariventures.mervi.shared.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoicePaidEvent implements Serializable {
    private String invoiceId;
    private String invoiceNumber;
    private BigDecimal amount;
    private String projectId;
    private String tenantId;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
