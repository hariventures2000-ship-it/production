package com.hariventures.mervi.shared.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectCompletedEvent implements Serializable {
    private String projectId;
    private String projectName;
    private String clientId;
    private BigDecimal budget;
    private String tenantId;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
