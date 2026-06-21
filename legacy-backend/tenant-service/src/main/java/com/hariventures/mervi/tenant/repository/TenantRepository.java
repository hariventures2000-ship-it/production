package com.hariventures.mervi.tenant.repository;

import com.hariventures.mervi.tenant.model.Tenant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends MongoRepository<Tenant, String> {

    Optional<Tenant> findBySlug(String slug);
    
    Optional<Tenant> findByDomain(String domain);

    boolean existsBySlug(String slug);
}
