package com.hariventures.mervi.client.repository;

import com.hariventures.mervi.client.model.ClientProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientProfileRepository extends MongoRepository<ClientProfile, String> {
    Optional<ClientProfile> findByUserIdAndTenantId(String userId, String tenantId);
}
