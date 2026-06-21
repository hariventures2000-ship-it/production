package com.hariventures.mervi.employee.model;

import com.hariventures.mervi.shared.enums.Department;
import com.hariventures.mervi.shared.enums.Role;
import com.hariventures.mervi.shared.tenant.TenantAwareEntity;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

/**
 * Read-only view of the Employee document for the employee-service.
 * Maps to the same 'employees' collection as hr-service.
 */
@Document(collection = "employees")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeView extends TenantAwareEntity {

    @Field("userId")
    private String userId;

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

    @Field("role")
    private Role role;

    @Field("subRole")
    private String subRole;

    @Field("department")
    private Department department;

    @Field("designation")
    private String designation;

    @Field("managerId")
    private String managerId;

    @Field("teamId")
    private String teamId;

    @Field("salary")
    private BigDecimal salary;

    @Field("leaveBalance")
    private Map<String, Integer> leaveBalance;

    @Field("dateOfJoining")
    private LocalDate dateOfJoining;

    @Field("status")
    private String status;
}
