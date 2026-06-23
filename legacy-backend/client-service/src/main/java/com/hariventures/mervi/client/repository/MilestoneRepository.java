package com.hariventures.mervi.client.repository;

import com.hariventures.mervi.client.model.Milestone;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MilestoneRepository extends MongoRepository<Milestone, String> {
    List<Milestone> findByProjectIdAndTenantId(String projectId, String tenantId);
}
