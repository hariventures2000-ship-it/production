package com.hariventures.mervi.client.repository;

import com.hariventures.mervi.client.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByClientIdAndTenantId(String clientId, String tenantId);
}
