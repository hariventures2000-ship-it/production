package com.hariventures.mervi.client.repository;

import com.hariventures.mervi.client.model.ProjectDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectDocumentRepository extends MongoRepository<ProjectDocument, String> {
    List<ProjectDocument> findByProjectIdAndTenantId(String projectId, String tenantId);
}
