package com.hariventures.mervi.shared.event;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeOnboardedEvent implements Serializable {
    private String employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private BigDecimal salary;
    private String tenantId;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
