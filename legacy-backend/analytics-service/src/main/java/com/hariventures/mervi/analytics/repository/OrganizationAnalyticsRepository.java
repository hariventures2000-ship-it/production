package com.hariventures.mervi.analytics.repository;

import com.hariventures.mervi.analytics.model.OrganizationAnalytics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationAnalyticsRepository extends MongoRepository<OrganizationAnalytics, String> {
    Optional<OrganizationAnalytics> findByTenantId(String tenantId);
}
