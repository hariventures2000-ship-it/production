package com.hariventures.mervi.analytics.consumer;

import com.hariventures.mervi.analytics.model.OrganizationAnalytics;
import com.hariventures.mervi.analytics.repository.OrganizationAnalyticsRepository;
import com.hariventures.mervi.shared.event.EmployeeOnboardedEvent;
import com.hariventures.mervi.shared.event.InvoicePaidEvent;
import com.hariventures.mervi.shared.event.ProjectCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AnalyticsEventConsumer {

    private final OrganizationAnalyticsRepository repository;

    @KafkaListener(topics = "EMPLOYEE_ONBOARDED", groupId = "mervi-analytics-service")
    public void handleEmployeeOnboarded(EmployeeOnboardedEvent event) {
        log.info("Received EMPLOYEE_ONBOARDED event for employee {} in tenant {}", event.getEmployeeId(), event.getTenantId());
        
        OrganizationAnalytics analytics = repository.findByTenantId(event.getTenantId())
                .orElseGet(() -> {
                    OrganizationAnalytics a = OrganizationAnalytics.builder().build();
                    a.initializeDefaults();
                    a.setTenantId(event.getTenantId());
                    a.setOrganizationId(event.getTenantId());
                    return a;
                });

        analytics.setWorkforceCount(analytics.getWorkforceCount() + 1);

        Map<String, Integer> statusCounts = analytics.getProjectStatusCounts();
        statusCounts.put("Development", statusCounts.getOrDefault("Development", 0) + 1);
        analytics.setProjectStatusCounts(statusCounts);

        repository.save(analytics);
    }

    @KafkaListener(topics = "PROJECT_COMPLETED", groupId = "mervi-analytics-service")
    public void handleProjectCompleted(ProjectCompletedEvent event) {
        log.info("Received PROJECT_COMPLETED event for project {} in tenant {}", event.getProjectId(), event.getTenantId());

        OrganizationAnalytics analytics = repository.findByTenantId(event.getTenantId())
                .orElseGet(() -> {
                    OrganizationAnalytics a = OrganizationAnalytics.builder().build();
                    a.initializeDefaults();
                    a.setTenantId(event.getTenantId());
                    a.setOrganizationId(event.getTenantId());
                    return a;
                });

        analytics.setActiveProjectsCount(Math.max(0, analytics.getActiveProjectsCount() - 1));
        
        Map<String, Integer> statusCounts = analytics.getProjectStatusCounts();
        statusCounts.put("Completed", statusCounts.getOrDefault("Completed", 0) + 1);
        if (statusCounts.containsKey("Development")) {
            statusCounts.put("Development", Math.max(0, statusCounts.get("Development") - 1));
        }
        analytics.setProjectStatusCounts(statusCounts);

        repository.save(analytics);
    }

    @KafkaListener(topics = "INVOICE_PAID", groupId = "mervi-analytics-service")
    public void handleInvoicePaid(InvoicePaidEvent event) {
        log.info("Received INVOICE_PAID event for invoice {} in tenant {}", event.getInvoiceId(), event.getTenantId());

        OrganizationAnalytics analytics = repository.findByTenantId(event.getTenantId())
                .orElseGet(() -> {
                    OrganizationAnalytics a = OrganizationAnalytics.builder().build();
                    a.initializeDefaults();
                    a.setTenantId(event.getTenantId());
                    a.setOrganizationId(event.getTenantId());
                    return a;
                });

        BigDecimal amount = event.getAmount();
        if (amount != null) {
            analytics.setSpentBudget(analytics.getSpentBudget().add(amount));
        }

        repository.save(analytics);
    }
}
