package com.hariventures.mervi.hr.repository;

import com.hariventures.mervi.hr.model.LeaveRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveRequestRepository extends MongoRepository<LeaveRequest, String> {

    List<LeaveRequest> findByTenantIdAndStatus(String tenantId, LeaveRequest.LeaveStatus status);

    List<LeaveRequest> findByTenantIdAndEmployeeId(String tenantId, String employeeId);

    List<LeaveRequest> findByTenantIdAndEmployeeIdAndStatus(
            String tenantId, String employeeId, LeaveRequest.LeaveStatus status);

    Optional<LeaveRequest> findByTenantIdAndId(String tenantId, String id);

    long countByTenantIdAndStatus(String tenantId, LeaveRequest.LeaveStatus status);
}
