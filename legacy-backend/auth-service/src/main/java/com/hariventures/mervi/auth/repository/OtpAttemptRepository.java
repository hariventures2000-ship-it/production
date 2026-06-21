package com.hariventures.mervi.auth.repository;

import com.hariventures.mervi.auth.model.OtpAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpAttemptRepository extends MongoRepository<OtpAttempt, String> {

    Optional<OtpAttempt> findByTenantIdAndIdentifierAndPurpose(String tenantId, String identifier, String purpose);

    void deleteByTenantIdAndIdentifierAndPurpose(String tenantId, String identifier, String purpose);
}
