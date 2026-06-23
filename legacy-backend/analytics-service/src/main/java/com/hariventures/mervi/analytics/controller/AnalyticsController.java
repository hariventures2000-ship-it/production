package com.hariventures.mervi.analytics.controller;

import com.hariventures.mervi.analytics.consumer.AnalyticsEventConsumer;
import com.hariventures.mervi.analytics.model.OrganizationAnalytics;
import com.hariventures.mervi.analytics.service.AnalyticsService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import com.hariventures.mervi.shared.event.EmployeeOnboardedEvent;
import com.hariventures.mervi.shared.event.InvoicePaidEvent;
import com.hariventures.mervi.shared.event.ProjectCompletedEvent;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AnalyticsEventConsumer eventConsumer;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @GetMapping("/md")
    public ApiResponse<OrganizationAnalytics> getMdAnalytics() {
        log.info("Fetching Managing Director analytics dashboard for tenant: {}", TenantContext.getTenantId());
        return ApiResponse.ok(analyticsService.getMdAnalytics());
    }

    @GetMapping("/superadmin")
    public ApiResponse<Map<String, Object>> getSuperAdminAnalytics() {
        log.info("Fetching Super Admin analytics dashboard statistics");
        return ApiResponse.ok(analyticsService.getSuperAdminAnalytics());
    }

    @PostMapping("/test-trigger/employee-onboarded")
    public ApiResponse<String> triggerEmployeeOnboarded(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) BigDecimal salary) {
        
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
                .salary(salary != null ? salary : new BigDecimal("75000"))
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
                "Employee onboarded event simulated. Kafka published: " + kafkaSuccess + ". Employee ID: " + employeeId
        );
    }

    @PostMapping("/test-trigger/project-completed")
    public ApiResponse<String> triggerProjectCompleted(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String projectName) {
        
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null || tenantId.isBlank()) {
            tenantId = "tenant_test";
        }

        String actualProjectId = projectId != null ? projectId : UUID.randomUUID().toString().substring(0, 8);
        String actualProjectName = projectName != null ? projectName : "Project Alpha " + actualProjectId;
        
        ProjectCompletedEvent event = ProjectCompletedEvent.builder()
                .projectId(actualProjectId)
                .projectName(actualProjectName)
                .clientId("CLIENT-1001")
                .budget(new BigDecimal("500000"))
                .tenantId(tenantId)
                .timestamp(Instant.now())
                .build();

        boolean kafkaSuccess = false;
        try {
            kafkaTemplate.send("PROJECT_COMPLETED", actualProjectId, event);
            log.info("Test-triggered: Published PROJECT_COMPLETED to Kafka for {}", actualProjectId);
            kafkaSuccess = true;
        } catch (Exception e) {
            log.warn("Kafka offline. Invoking consumer handler directly for local bypass. Error: {}", e.getMessage());
            eventConsumer.handleProjectCompleted(event);
        }

        return ApiResponse.ok(
                "Project completed event simulated. Kafka published: " + kafkaSuccess + ". Project: " + actualProjectName
        );
    }

    @PostMapping("/test-trigger/invoice-paid")
    public ApiResponse<String> triggerInvoicePaid(
            @RequestParam(required = false) String invoiceId,
            @RequestParam(required = false) BigDecimal amount) {

        String tenantId = TenantContext.getTenantId();
        if (tenantId == null || tenantId.isBlank()) {
            tenantId = "tenant_test";
        }

        String actualInvoiceId = invoiceId != null ? invoiceId : "INV-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        BigDecimal actualAmount = amount != null ? amount : new BigDecimal("125000");

        InvoicePaidEvent event = InvoicePaidEvent.builder()
                .invoiceId(actualInvoiceId)
                .invoiceNumber(actualInvoiceId)
                .amount(actualAmount)
                .projectId(UUID.randomUUID().toString().substring(0, 8))
                .tenantId(tenantId)
                .timestamp(Instant.now())
                .build();

        boolean kafkaSuccess = false;
        try {
            kafkaTemplate.send("INVOICE_PAID", actualInvoiceId, event);
            log.info("Test-triggered: Published INVOICE_PAID to Kafka for {}", actualInvoiceId);
            kafkaSuccess = true;
        } catch (Exception e) {
            log.warn("Kafka offline. Invoking consumer handler directly for local bypass. Error: {}", e.getMessage());
            eventConsumer.handleInvoicePaid(event);
        }

        return ApiResponse.ok(
                "Invoice paid event simulated. Kafka published: " + kafkaSuccess + ". Invoice: " + actualInvoiceId + ", Amount: " + actualAmount
        );
    }
}
