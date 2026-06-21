package com.hariventures.mervi.hr.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.time.LocalDate;

@Document(collection = "attendance_records")
@CompoundIndexes({
    @CompoundIndex(name = "tenant_employee_date_idx", def = "{'tenantId': 1, 'employeeId': 1, 'date': 1}", unique = true),
    @CompoundIndex(name = "tenant_date_idx", def = "{'tenantId': 1, 'date': 1}")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecord extends TenantAwareEntity {

    @Field("employeeId")
    private String employeeId;

    @Field("employeeName")
    private String employeeName;

    @Field("date")
    private LocalDate date;

    @Field("checkIn")
    private Instant checkIn;

    @Field("checkOut")
    private Instant checkOut;

    @Field("hoursWorked")
    private Double hoursWorked;

    @Field("status")
    @Builder.Default
    private AttendanceStatus status = AttendanceStatus.PRESENT;

    @Field("location")
    private String location;

    @Field("ipAddress")
    private String ipAddress;

    @Field("notes")
    private String notes;

    public enum AttendanceStatus {
        PRESENT, ABSENT, HALF_DAY, ON_LEAVE, HOLIDAY, WEEKEND, WORK_FROM_HOME
    }
}
