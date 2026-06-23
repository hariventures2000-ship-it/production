package com.hariventures.mervi.client.service;

import com.hariventures.mervi.client.model.Milestone;
import com.hariventures.mervi.client.model.Project;
import com.hariventures.mervi.client.model.ProjectDocument;
import com.hariventures.mervi.client.model.ProjectUpdate;
import com.hariventures.mervi.client.repository.MilestoneRepository;
import com.hariventures.mervi.client.repository.ProjectDocumentRepository;
import com.hariventures.mervi.client.repository.ProjectRepository;
import com.hariventures.mervi.client.repository.ProjectUpdateRepository;
import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientPortalService {

    private final DataSeeder dataSeeder;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;
    private final ProjectUpdateRepository projectUpdateRepository;
    private final ProjectDocumentRepository projectDocumentRepository;

    public List<Project> getProjects() {
        dataSeeder.seedIfNeeded();
        String userId = TenantContext.getUserId();
        String tenantId = TenantContext.getTenantId();
        return projectRepository.findByClientIdAndTenantId(userId, tenantId);
    }

    public Project getProject(String projectId) {
        dataSeeder.seedIfNeeded();
        String userId = TenantContext.getUserId();
        String tenantId = TenantContext.getTenantId();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        // Strict isolation check
        if (!project.getClientId().equals(userId) || !project.getTenantId().equals(tenantId)) {
            log.warn("Access denied for user {} to project {}", userId, projectId);
            throw new ResourceNotFoundException("Project", "id", projectId);
        }

        return project;
    }

    public List<Milestone> getMilestones(String projectId) {
        // Verify project ownership first
        getProject(projectId);
        String tenantId = TenantContext.getTenantId();
        return milestoneRepository.findByProjectIdAndTenantId(projectId, tenantId);
    }

    public List<ProjectUpdate> getUpdates(String projectId) {
        // Verify project ownership first
        getProject(projectId);
        String tenantId = TenantContext.getTenantId();
        return projectUpdateRepository.findByProjectIdAndTenantId(projectId, tenantId);
    }

    public List<ProjectDocument> getDocuments(String projectId) {
        // Verify project ownership first
        getProject(projectId);
        String tenantId = TenantContext.getTenantId();
        return projectDocumentRepository.findByProjectIdAndTenantId(projectId, tenantId);
    }

    public ProjectDocument getDocument(String projectId, String documentId) {
        // Verify project ownership first
        getProject(projectId);
        String tenantId = TenantContext.getTenantId();

        ProjectDocument doc = projectDocumentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", documentId));

        if (!doc.getProjectId().equals(projectId) || !doc.getTenantId().equals(tenantId)) {
            throw new ResourceNotFoundException("Document", "id", documentId);
        }

        return doc;
    }
}
