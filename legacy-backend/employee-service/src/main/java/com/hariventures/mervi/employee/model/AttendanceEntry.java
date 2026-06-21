package com.hariventures.mervi.employee.model;

import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.time.LocalDate;

/**
 * AttendanceRecord for employee-service — maps to same collection as hr-service.
 */
@Document(collection = "attendance_records")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceEntry extends TenantAwareEntity {

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
    private String status;

    @Field("location")
    private String location;

    @Field("ipAddress")
    private String ipAddress;

    @Field("notes")
    private String notes;
}
