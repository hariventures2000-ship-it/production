package com.hariventures.mervi.hr.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.time.LocalDate;

@Document(collection = "leave_requests")
@CompoundIndexes({
    @CompoundIndex(name = "tenant_employee_idx", def = "{'tenantId': 1, 'employeeId': 1}"),
    @CompoundIndex(name = "tenant_status_idx", def = "{'tenantId': 1, 'status': 1}")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest extends TenantAwareEntity {

    @Field("employeeId")
    private String employeeId;

    @Field("employeeName")
    private String employeeName;

    @Field("leaveType")
    private LeaveType leaveType;

    @Field("startDate")
    private LocalDate startDate;

    @Field("endDate")
    private LocalDate endDate;

    @Field("totalDays")
    private int totalDays;

    @Field("reason")
    private String reason;

    @Field("status")
    @Builder.Default
    private LeaveStatus status = LeaveStatus.PENDING;

    @Field("approvedBy")
    private String approvedBy;

    @Field("approverName")
    private String approverName;

    @Field("approvedAt")
    private Instant approvedAt;

    @Field("rejectionReason")
    private String rejectionReason;

    public enum LeaveType {
        CASUAL, SICK, EARNED, MATERNITY, PATERNITY, COMPENSATORY, UNPAID
    }

    public enum LeaveStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }
}
