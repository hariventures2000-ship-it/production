package com.hariventures.mervi.employee.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.time.LocalDate;

/**
 * LeaveRequestEntry — employee-service's view of leave_requests collection.
 */
@Document(collection = "leave_requests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestEntry extends TenantAwareEntity {

    @Field("employeeId")
    private String employeeId;

    @Field("employeeName")
    private String employeeName;

    @Field("leaveType")
    private String leaveType;

    @Field("startDate")
    private LocalDate startDate;

    @Field("endDate")
    private LocalDate endDate;

    @Field("totalDays")
    private int totalDays;

    @Field("reason")
    private String reason;

    @Field("status")
    private String status;

    @Field("approvedBy")
    private String approvedBy;

    @Field("approverName")
    private String approverName;

    @Field("approvedAt")
    private Instant approvedAt;

    @Field("rejectionReason")
    private String rejectionReason;
}
