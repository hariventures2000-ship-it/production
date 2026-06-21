package com.hariventures.mervi.employee.repository;

import com.hariventures.mervi.employee.model.EmployeeView;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeSelfRepository extends MongoRepository<EmployeeView, String> {

    Optional<EmployeeView> findByTenantIdAndUserId(String tenantId, String userId);

    Optional<EmployeeView> findByTenantIdAndId(String tenantId, String id);
}
