package com.hariventures.mervi.auth.repository;

import com.hariventures.mervi.auth.model.Session;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends MongoRepository<Session, String> {

    Optional<Session> findByTenantIdAndSessionId(String tenantId, String sessionId);
    
    List<Session> findByTenantIdAndUserIdAndIsRevokedFalse(String tenantId, String userId);

    void deleteByTenantIdAndUserId(String tenantId, String userId);
}
