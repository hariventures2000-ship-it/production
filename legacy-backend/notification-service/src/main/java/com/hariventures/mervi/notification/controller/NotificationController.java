package com.hariventures.mervi.notification.controller;

import com.hariventures.mervi.notification.consumer.NotificationEventConsumer;
import com.hariventures.mervi.notification.model.Notification;
import com.hariventures.mervi.notification.repository.NotificationRepository;
import com.hariventures.mervi.shared.dto.ApiResponse;
import com.hariventures.mervi.shared.event.EmployeeOnboardedEvent;
import com.hariventures.mervi.shared.event.InvoicePaidEvent;
import com.hariventures.mervi.shared.event.ProjectCompletedEvent;
import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationRepository repository;
    private final NotificationEventConsumer eventConsumer;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @GetMapping
    public ApiResponse<List<Notification>> getNotifications() {
        String tenantId = TenantContext.getTenantId();
        String role = TenantContext.getRole();
        log.info("Fetching notifications for tenant: {}, role: {}", tenantId, role);
        
        List<Notification> notifications;
        if (role != null && !role.isBlank()) {
            notifications = repository.findByTenantIdAndTargetRoleOrderByCreatedAtDesc(tenantId, role);
        } else {
            notifications = repository.findByTenantIdOrderByCreatedAtDesc(tenantId);
        }
        return ApiResponse.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ApiResponse<Notification> markAsRead(@PathVariable String id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Marking notification {} as read for tenant {}", id, tenantId);
        
        Notification notification = repository.findByTenantIdAndId(tenantId, id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        
        notification.setRead(true);
        return ApiResponse.ok(repository.save(notification));
    }

    @PostMapping("/test-trigger/employee-onboarded")
    public ApiResponse<String> triggerEmployeeOnboarded(
            @RequestParam(required = false) String department) {
        
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null || tenantId.isBlank()) {
            tenantId = "tenant_test";
        }
        
        String employeeId = "EMP-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        EmployeeOnboardedEvent event = EmployeeOnboardedEvent.builder()
                .employeeId(employeeId)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe." + employeeId.toLowerCase() + "@mervi.com")
                .department(department != null ? department : "Engineering")
                .salary(new BigDecimal("75000"))
                .tenantId(tenantId)
                .timestamp(Instant.now())
                .build();

        boolean kafkaSuccess = false;
        try {
            kafkaTemplate.send("EMPLOYEE_ONBOARDED", employeeId, event);
            log.info("Test-triggered: Published EMPLOYEE_ONBOARDED to Kafka for {}", employeeId);
            kafkaSuccess = true;
        } catch (Exception e) {
            log.warn("Kafka offline. Invoking consumer handler directly for local bypass. Error: {}", e.getMessage());
            eventConsumer.handleEmployeeOnboarded(event);
        }

        return ApiResponse.ok(
                "Notification simulated. Kafka published: " + kafkaSuccess + ". Employee ID: " + employeeId
        );
    }

    @PostMapping("/test-trigger/project-completed")
    public ApiResponse<String> triggerProjectCompleted(
            @RequestParam(required = false) String projectName) {
        
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null || tenantId.isBlank()) {
            tenantId = "tenant_test";
        }

        String projectId = UUID.randomUUID().toString().substring(0, 8);
        String actualProjectName = projectName != null ? projectName : "Project Alpha " + projectId;
        
        ProjectCompletedEvent event = ProjectCompletedEvent.builder()
                .projectId(projectId)
                .projectName(actualProjectName)
                .clientId("CLIENT-1001")
                .budget(new BigDecimal("500000"))
                .tenantId(tenantId)
                .timestamp(Instant.now())
                .build();

        boolean kafkaSuccess = false;
        try {
            kafkaTemplate.send("PROJECT_COMPLETED", projectId, event);
            log.info("Test-triggered: Published PROJECT_COMPLETED to Kafka for {}", projectId);
            kafkaSuccess = true;
        } catch (Exception e) {
            log.warn("Kafka offline. Invoking consumer handler directly for local bypass. Error: {}", e.getMessage());
            eventConsumer.handleProjectCompleted(event);
        }

        return ApiResponse.ok(
                "Notification simulated. Kafka published: " + kafkaSuccess + ". Project: " + actualProjectName
        );
    }

    @PostMapping("/test-trigger/invoice-paid")
    public ApiResponse<String> triggerInvoicePaid(
            @RequestParam(required = false) BigDecimal amount) {

        String tenantId = TenantContext.getTenantId();
        if (tenantId == null || tenantId.isBlank()) {
            tenantId = "tenant_test";
        }

        String invoiceId = "INV-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        BigDecimal actualAmount = amount != null ? amount : new BigDecimal("125000");

        InvoicePaidEvent event = InvoicePaidEvent.builder()
                .invoiceId(invoiceId)
                .invoiceNumber(invoiceId)
                .amount(actualAmount)
                .projectId(UUID.randomUUID().toString().substring(0, 8))
                .tenantId(tenantId)
                .timestamp(Instant.now())
                .build();

        boolean kafkaSuccess = false;
        try {
            kafkaTemplate.send("INVOICE_PAID", invoiceId, event);
            log.info("Test-triggered: Published INVOICE_PAID to Kafka for {}", invoiceId);
            kafkaSuccess = true;
        } catch (Exception e) {
            log.warn("Kafka offline. Invoking consumer handler directly for local bypass. Error: {}", e.getMessage());
            eventConsumer.handleInvoicePaid(event);
        }

        return ApiResponse.ok(
                "Notification simulated. Kafka published: " + kafkaSuccess + ". Invoice: " + invoiceId + ", Amount: " + actualAmount
        );
    }
}
