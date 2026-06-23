package com.hariventures.mervi.client.repository;

import com.hariventures.mervi.client.model.ProjectUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectUpdateRepository extends MongoRepository<ProjectUpdate, String> {
    List<ProjectUpdate> findByProjectIdAndTenantId(String projectId, String tenantId);
}
