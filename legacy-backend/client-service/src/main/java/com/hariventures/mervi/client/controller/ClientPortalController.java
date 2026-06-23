package com.hariventures.mervi.client.controller;

import com.hariventures.mervi.client.model.Milestone;
import com.hariventures.mervi.client.model.Project;
import com.hariventures.mervi.client.model.ProjectDocument;
import com.hariventures.mervi.client.model.ProjectUpdate;
import com.hariventures.mervi.client.service.ClientPortalService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ClientPortalController {

    private final ClientPortalService clientPortalService;

    @GetMapping("/client-portal/projects")
    public ApiResponse<List<Project>> getProjects() {
        return ApiResponse.ok(clientPortalService.getProjects());
    }

    @GetMapping("/client-portal/projects/{projectId}")
    public ApiResponse<Project> getProject(@PathVariable String projectId) {
        return ApiResponse.ok(clientPortalService.getProject(projectId));
    }

    @GetMapping("/client-portal/projects/{projectId}/milestones")
    public ApiResponse<List<Milestone>> getMilestones(@PathVariable String projectId) {
        return ApiResponse.ok(clientPortalService.getMilestones(projectId));
    }

    @GetMapping("/client-portal/projects/{projectId}/updates")
    public ApiResponse<List<ProjectUpdate>> getUpdates(@PathVariable String projectId) {
        return ApiResponse.ok(clientPortalService.getUpdates(projectId));
    }

    @GetMapping("/client-portal/projects/{projectId}/documents")
    public ApiResponse<List<ProjectDocument>> getDocuments(@PathVariable String projectId) {
        return ApiResponse.ok(clientPortalService.getDocuments(projectId));
    }

    @GetMapping("/client-portal/projects/{projectId}/documents/{docId}/download")
    public ApiResponse<Map<String, String>> getDocumentDownloadUrl(
            @PathVariable String projectId, @PathVariable String docId) {
        ProjectDocument doc = clientPortalService.getDocument(projectId, docId);
        
        Map<String, String> response = new HashMap<>();
        response.put("name", doc.getName());
        // Path to download actual file
        response.put("url", "/api/v1/client-portal/projects/" + projectId + "/documents/" + docId + "/download/file");
        
        return ApiResponse.ok(response);
    }

    @GetMapping("/client-portal/projects/{projectId}/documents/{docId}/download/file")
    public ResponseEntity<byte[]> downloadDocumentFile(
            @PathVariable String projectId, @PathVariable String docId) {
        ProjectDocument doc = clientPortalService.getDocument(projectId, docId);
        
        // Simple dummy PDF/text file stream representation
        String dummyContent = "%PDF-1.4\n%... Dummy Document File content for " + doc.getName() + " ...";
        byte[] contentBytes = dummyContent.getBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(contentBytes);
    }

    @PostMapping("/ai-assistant/query")
    public ApiResponse<Map<String, Object>> queryAiAssistant(@RequestBody Map<String, String> request) {
        String query = request.getOrDefault("query", "");
        log.info("AI assistant query received: {}", query);

        Map<String, Object> response = new HashMap<>();
        response.put("answer", "Hello! I am the Mervi AI Assistant. Since the Generative AI Integration is scheduled for Phase 6, this is a simulated response. You asked: \"" + query + "\". I can confirm that your deliverables are on track and designs are ready for review!");
        response.put("sources", List.of("Hari_Ventures_Project_Charter.pdf", "UI_UX_Design_Specifications.pdf"));

        return ApiResponse.ok(response);
    }
}
