package com.hariventures.mervi.auth.repository;

import com.hariventures.mervi.auth.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Note: queries will be tenant-isolated in services by passing TenantContext.getTenantId()
    
    Optional<User> findByTenantIdAndEmail(String tenantId, String email);
    
    Optional<User> findByTenantIdAndUsername(String tenantId, String username);
    
    boolean existsByTenantIdAndEmail(String tenantId, String email);
    
    boolean existsByTenantIdAndUsername(String tenantId, String username);

    Optional<User> findByIdAndTenantId(String id, String tenantId);
}
