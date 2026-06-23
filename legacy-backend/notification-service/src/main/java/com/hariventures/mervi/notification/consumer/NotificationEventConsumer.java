package com.hariventures.mervi.notification.consumer;

import com.hariventures.mervi.notification.model.Notification;
import com.hariventures.mervi.notification.repository.NotificationRepository;
import com.hariventures.mervi.notification.websocket.NotificationWebSocketHandler;
import com.hariventures.mervi.shared.event.EmployeeOnboardedEvent;
import com.hariventures.mervi.shared.event.InvoicePaidEvent;
import com.hariventures.mervi.shared.event.ProjectCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventConsumer {

    private final NotificationRepository repository;
    private final NotificationWebSocketHandler webSocketHandler;

    @KafkaListener(topics = "EMPLOYEE_ONBOARDED", groupId = "mervi-notification-service")
    public void handleEmployeeOnboarded(EmployeeOnboardedEvent event) {
        log.info("Notification Service: Received EMPLOYEE_ONBOARDED event for employee {} in tenant {}", 
                event.getEmployeeId(), event.getTenantId());
        
        Notification notification = Notification.builder()
                .title("New Employee Onboarded")
                .message(String.format("Employee %s %s (%s) has been onboarded into the %s department.",
                        event.getFirstName(), event.getLastName(), event.getEmployeeId(), event.getDepartment()))
                .type("EMPLOYEE_ONBOARDED")
                .targetRole("ROLE_MANAGING_DIRECTOR")
                .isRead(false)
                .build();
        
        notification.setCreatedAt(Instant.now());
        notification.setTenantId(event.getTenantId());
        notification.setOrganizationId(event.getTenantId());
        
        repository.save(notification);
        webSocketHandler.broadcast(notification);
    }

    @KafkaListener(topics = "PROJECT_COMPLETED", groupId = "mervi-notification-service")
    public void handleProjectCompleted(ProjectCompletedEvent event) {
        log.info("Notification Service: Received PROJECT_COMPLETED event for project {} in tenant {}", 
                event.getProjectId(), event.getTenantId());

        Notification notification = Notification.builder()
                .title("Project Completed")
                .message(String.format("Project '%s' has been successfully completed.", event.getProjectName()))
                .type("PROJECT_COMPLETED")
                .targetRole("ROLE_MANAGING_DIRECTOR")
                .isRead(false)
                .build();
        
        notification.setCreatedAt(Instant.now());
        notification.setTenantId(event.getTenantId());
        notification.setOrganizationId(event.getTenantId());

        repository.save(notification);
        webSocketHandler.broadcast(notification);
    }

    @KafkaListener(topics = "INVOICE_PAID", groupId = "mervi-notification-service")
    public void handleInvoicePaid(InvoicePaidEvent event) {
        log.info("Notification Service: Received INVOICE_PAID event for invoice {} in tenant {}", 
                event.getInvoiceId(), event.getTenantId());

        Notification notification = Notification.builder()
                .title("Client Invoice Paid")
                .message(String.format("Invoice %s has been paid. Amount: ₹%s", 
                        event.getInvoiceNumber(), event.getAmount().toString()))
                .type("INVOICE_PAID")
                .targetRole("ROLE_MANAGING_DIRECTOR")
                .isRead(false)
                .build();
        
        notification.setCreatedAt(Instant.now());
        notification.setTenantId(event.getTenantId());
        notification.setOrganizationId(event.getTenantId());

        repository.save(notification);
        webSocketHandler.broadcast(notification);
    }
}
