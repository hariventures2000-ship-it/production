package com.hariventures.mervi.hr.model;

import com.hariventures.mervi.shared.enums.Department;
import com.hariventures.mervi.shared.enums.Role;
import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

/**
 * Employee document — the core HR entity.
 * Links to a User (auth-service) via userId.
 */
@Document(collection = "employees")
@CompoundIndexes({
    @CompoundIndex(name = "tenant_user_idx", def = "{'tenantId': 1, 'userId': 1}", unique = true),
    @CompoundIndex(name = "tenant_empid_idx", def = "{'tenantId': 1, 'employeeId': 1}", unique = true),
    @CompoundIndex(name = "tenant_dept_idx", def = "{'tenantId': 1, 'department': 1}"),
    @CompoundIndex(name = "tenant_manager_idx", def = "{'tenantId': 1, 'managerId': 1}")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee extends TenantAwareEntity {

    /** Reference to auth-service User._id */
    @Field("userId")
    private String userId;

    /** Human-readable employee ID, e.g. HV-EMP-0042 */
    @Field("employeeId")
    private String employeeId;

    @Field("firstName")
    private String firstName;

    @Field("lastName")
    private String lastName;

    @Field("email")
    private String email;

    @Field("phone")
    private String phone;

    @Field("avatarUrl")
    private String avatarUrl;

    // ─── Organizational ─────────────────────────────────────────────────
    @Field("role")
    private Role role;

    @Field("subRole")
    private String subRole;

    @Field("department")
    private Department department;

    @Field("teamId")
    private String teamId;

    @Field("managerId")
    private String managerId;

    @Field("designation")
    private String designation;

    // ─── Compensation ───────────────────────────────────────────────────
    @Field("salary")
    private BigDecimal salary;

    @Field("currency")
    @Builder.Default
    private String currency = "INR";

    // ─── Leave ──────────────────────────────────────────────────────────
    @Field("leaveBalance")
    private Map<String, Integer> leaveBalance; // e.g. { "CASUAL": 12, "SICK": 6, "EARNED": 15 }

    // ─── Performance ────────────────────────────────────────────────────
    @Field("performanceScore")
    private Double performanceScore;

    // ─── Dates ──────────────────────────────────────────────────────────
    @Field("dateOfJoining")
    private LocalDate dateOfJoining;

    @Field("dateOfBirth")
    private LocalDate dateOfBirth;

    @Field("probationEndDate")
    private LocalDate probationEndDate;

    // ─── Status ─────────────────────────────────────────────────────────
    @Field("status")
    @Builder.Default
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    @Field("terminationDate")
    private Instant terminationDate;

    @Field("terminationReason")
    private String terminationReason;

    public enum EmployeeStatus {
        ACTIVE, ON_NOTICE, PROBATION, TERMINATED, ON_LEAVE
    }
}
