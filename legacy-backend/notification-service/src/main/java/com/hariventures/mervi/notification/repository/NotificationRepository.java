package com.hariventures.mervi.notification.repository;

import com.hariventures.mervi.notification.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByTenantIdOrderByCreatedAtDesc(String tenantId);
    List<Notification> findByTenantIdAndTargetRoleOrderByCreatedAtDesc(String tenantId, String targetRole);
    Optional<Notification> findByTenantIdAndId(String tenantId, String id);
}
