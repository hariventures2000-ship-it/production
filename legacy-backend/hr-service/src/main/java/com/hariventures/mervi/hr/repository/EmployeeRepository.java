package com.hariventures.mervi.hr.repository;

import com.hariventures.mervi.hr.model.Employee;
import com.hariventures.mervi.shared.enums.Department;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {

    List<Employee> findByTenantId(String tenantId);

    Optional<Employee> findByTenantIdAndId(String tenantId, String id);

    Optional<Employee> findByTenantIdAndUserId(String tenantId, String userId);

    Optional<Employee> findByTenantIdAndEmployeeId(String tenantId, String employeeId);

    List<Employee> findByTenantIdAndDepartment(String tenantId, Department department);

    List<Employee> findByTenantIdAndManagerId(String tenantId, String managerId);

    List<Employee> findByTenantIdAndStatus(String tenantId, Employee.EmployeeStatus status);

    long countByTenantId(String tenantId);

    long countByTenantIdAndStatus(String tenantId, Employee.EmployeeStatus status);

    boolean existsByTenantIdAndEmail(String tenantId, String email);
}
