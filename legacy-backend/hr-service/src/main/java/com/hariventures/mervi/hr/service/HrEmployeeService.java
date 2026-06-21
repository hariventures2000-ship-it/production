package com.hariventures.mervi.hr.service;

import com.hariventures.mervi.hr.model.Employee;
import com.hariventures.mervi.hr.repository.EmployeeRepository;
import com.hariventures.mervi.shared.enums.Department;
import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class HrEmployeeService {

    private final EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findByTenantId(TenantContext.getTenantId());
    }

    public Employee getEmployeeById(String id) {
        return employeeRepository.findByTenantIdAndId(TenantContext.getTenantId(), id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
    }

    public Employee getEmployeeByUserId(String userId) {
        return employeeRepository.findByTenantIdAndUserId(TenantContext.getTenantId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));
    }

    public List<Employee> getEmployeesByDepartment(Department department) {
        return employeeRepository.findByTenantIdAndDepartment(TenantContext.getTenantId(), department);
    }

    public List<Employee> getEmployeesByManager(String managerId) {
        return employeeRepository.findByTenantIdAndManagerId(TenantContext.getTenantId(), managerId);
    }

    public Employee onboardEmployee(Employee employee) {
        String tenantId = TenantContext.getTenantId();

        if (employeeRepository.existsByTenantIdAndEmail(tenantId, employee.getEmail())) {
            throw new IllegalArgumentException("Employee with this email already exists in the organization");
        }

        // Generate employee ID
        long count = employeeRepository.countByTenantId(tenantId);
        employee.setEmployeeId(String.format("EMP-%04d", count + 1));

        // Set defaults
        employee.ensureTenantContext();
        employee.setStatus(Employee.EmployeeStatus.PROBATION);
        employee.setDateOfJoining(LocalDate.now());
        employee.setProbationEndDate(LocalDate.now().plusMonths(3));

        // Initialize default leave balance
        if (employee.getLeaveBalance() == null) {
            Map<String, Integer> defaultLeaves = new HashMap<>();
            defaultLeaves.put("CASUAL", 12);
            defaultLeaves.put("SICK", 6);
            defaultLeaves.put("EARNED", 15);
            employee.setLeaveBalance(defaultLeaves);
        }

        log.info("Onboarding employee {} in tenant {}", employee.getEmail(), tenantId);

        // TODO: Publish EMPLOYEE_ONBOARDED event to Kafka

        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(String id, Employee updates) {
        Employee existing = getEmployeeById(id);

        if (updates.getDesignation() != null) existing.setDesignation(updates.getDesignation());
        if (updates.getDepartment() != null) existing.setDepartment(updates.getDepartment());
        if (updates.getManagerId() != null) existing.setManagerId(updates.getManagerId());
        if (updates.getTeamId() != null) existing.setTeamId(updates.getTeamId());
        if (updates.getSalary() != null) existing.setSalary(updates.getSalary());
        if (updates.getPhone() != null) existing.setPhone(updates.getPhone());
        if (updates.getSubRole() != null) existing.setSubRole(updates.getSubRole());

        return employeeRepository.save(existing);
    }

    public Employee terminateEmployee(String id, String reason) {
        Employee employee = getEmployeeById(id);
        employee.setStatus(Employee.EmployeeStatus.TERMINATED);
        employee.setTerminationDate(java.time.Instant.now());
        employee.setTerminationReason(reason);

        log.info("Terminating employee {} in tenant {}", employee.getEmployeeId(), TenantContext.getTenantId());

        // TODO: Publish EMPLOYEE_TERMINATED event to Kafka

        return employeeRepository.save(employee);
    }

    public Map<String, Long> getDashboardStats() {
        String tenantId = TenantContext.getTenantId();
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalEmployees", employeeRepository.countByTenantId(tenantId));
        stats.put("activeEmployees", employeeRepository.countByTenantIdAndStatus(tenantId, Employee.EmployeeStatus.ACTIVE));
        stats.put("onProbation", employeeRepository.countByTenantIdAndStatus(tenantId, Employee.EmployeeStatus.PROBATION));
        stats.put("onNotice", employeeRepository.countByTenantIdAndStatus(tenantId, Employee.EmployeeStatus.ON_NOTICE));
        return stats;
    }
}
