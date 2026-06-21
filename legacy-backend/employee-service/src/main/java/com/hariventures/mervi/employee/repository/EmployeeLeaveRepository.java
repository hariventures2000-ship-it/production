package com.hariventures.mervi.employee.repository;

import com.hariventures.mervi.employee.model.LeaveRequestEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeLeaveRepository extends MongoRepository<LeaveRequestEntry, String> {

    List<LeaveRequestEntry> findByTenantIdAndEmployeeId(String tenantId, String employeeId);

    List<LeaveRequestEntry> findByTenantIdAndEmployeeIdAndStatus(
            String tenantId, String employeeId, String status);

    Optional<LeaveRequestEntry> findByTenantIdAndId(String tenantId, String id);
}
