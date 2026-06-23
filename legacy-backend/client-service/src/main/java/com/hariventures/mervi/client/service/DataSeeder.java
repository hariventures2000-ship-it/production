package com.hariventures.mervi.client.service;

import com.hariventures.mervi.client.model.*;
import com.hariventures.mervi.client.repository.*;
import com.hariventures.mervi.shared.enums.ProjectStatus;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final ClientProfileRepository clientProfileRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;
    private final ProjectUpdateRepository projectUpdateRepository;
    private final ProjectDocumentRepository projectDocumentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final SupportTicketRepository supportTicketRepository;

    public void seedIfNeeded() {
        String userId = TenantContext.getUserId();
        String tenantId = TenantContext.getTenantId();

        if (userId == null || tenantId == null) {
            log.warn("Cannot seed data: userId or tenantId is null in TenantContext");
            return;
        }

        // Check if projects already exist for this client
        List<Project> existingProjects = projectRepository.findByClientIdAndTenantId(userId, tenantId);
        if (!existingProjects.isEmpty()) {
            return;
        }

        log.info("Seeding data for client user: {}, tenant: {}", userId, tenantId);

        // 1. Create ClientProfile
        ClientProfile profile = ClientProfile.builder()
                .userId(userId)
                .companyName("Hari Ventures")
                .contactEmail("client@hariventures.com")
                .contactPhone("+1 (555) 019-2834")
                .address("100 Innovation Way, Suite 400, Tech City")
                .website("https://hariventures.com")
                .industry("Venture Capital")
                .status("ACTIVE")
                .build();
        profile.ensureTenantContext();
        clientProfileRepository.save(profile);

        // 2. Create Project 1: Website Redesign
        Project project1 = Project.builder()
                .name("Enterprise Website Redesign")
                .description("Complete overhaul of the Hari Ventures website, migrating to a modern tech stack with responsive design and improved performance.")
                .clientId(userId)
                .status(ProjectStatus.IN_PROGRESS)
                .currentPhase("Phase 2: Design & UI Implementation")
                .completionPercentage(45)
                .startDate(Instant.now().minus(30, ChronoUnit.DAYS))
                .estimatedEndDate(Instant.now().plus(60, ChronoUnit.DAYS))
                .build();
        project1.ensureTenantContext();
        projectRepository.save(project1);

        // Project 1 Milestones
        Milestone m1_1 = Milestone.builder()
                .projectId(project1.getId())
                .title("Requirement Gathering & Wireframing")
                .description("Initial discovery phase to freeze requirements and UX layouts.")
                .status("COMPLETED")
                .targetDate(Instant.now().minus(20, ChronoUnit.DAYS))
                .completedDate(Instant.now().minus(22, ChronoUnit.DAYS))
                .build();
        m1_1.ensureTenantContext();
        milestoneRepository.save(m1_1);

        Milestone m1_2 = Milestone.builder()
                .projectId(project1.getId())
                .title("UI/UX Design Sign-off")
                .description("Approval of Figma mockups for high-fidelity designs.")
                .status("IN_PROGRESS")
                .targetDate(Instant.now().plus(10, ChronoUnit.DAYS))
                .build();
        m1_2.ensureTenantContext();
        milestoneRepository.save(m1_2);

        Milestone m1_3 = Milestone.builder()
                .projectId(project1.getId())
                .title("Frontend Architecture & Component Setup")
                .description("Setup Next.js, Tailwind v4 and core component structures.")
                .status("PENDING")
                .targetDate(Instant.now().plus(30, ChronoUnit.DAYS))
                .build();
        m1_3.ensureTenantContext();
        milestoneRepository.save(m1_3);

        // Project 1 Updates
        ProjectUpdate u1_1 = ProjectUpdate.builder()
                .projectId(project1.getId())
                .title("Figma High-Fidelity Mockups Ready")
                .description("Our UI/UX team has finalized the design patterns for the homepage, dashboard, and settings. Please review the shared Figma link in the document section.")
                .build();
        u1_1.ensureTenantContext();
        projectUpdateRepository.save(u1_1);

        ProjectUpdate u1_2 = ProjectUpdate.builder()
                .projectId(project1.getId())
                .title("Project Kick-off & Discovery Complete")
                .description("Discovery sessions completed successfully. Technical architecture design signed off.")
                .build();
        u1_2.ensureTenantContext();
        projectUpdateRepository.save(u1_2);

        // Project 1 Documents
        ProjectDocument d1_1 = ProjectDocument.builder()
                .projectId(project1.getId())
                .name("Hari_Ventures_Project_Charter.pdf")
                .type("CONTRACT")
                .sizeBytes(2450000L) // 2.3 MB
                .fileUrl("/documents/charter.pdf")
                .build();
        d1_1.ensureTenantContext();
        projectDocumentRepository.save(d1_1);

        ProjectDocument d1_2 = ProjectDocument.builder()
                .projectId(project1.getId())
                .name("UI_UX_Design_Specifications.pdf")
                .type("DESIGN")
                .sizeBytes(4890000L) // 4.6 MB
                .fileUrl("/documents/design-specs.pdf")
                .build();
        d1_2.ensureTenantContext();
        projectDocumentRepository.save(d1_2);

        // Project 1 Invoices
        Invoice inv1_1 = Invoice.builder()
                .projectId(project1.getId())
                .invoiceNumber("INV-2026-001")
                .title("Project Kick-off (25% Milestone)")
                .description("Initial milestone payment upon project kickoff and wireframe sign-off.")
                .amount(new BigDecimal("125000"))
                .currency("INR")
                .status("PAID")
                .dueDate(Instant.now().minus(15, ChronoUnit.DAYS))
                .paidAt(Instant.now().minus(14, ChronoUnit.DAYS))
                .build();
        inv1_1.ensureTenantContext();
        invoiceRepository.save(inv1_1);

        Payment pmt1_1 = Payment.builder()
                .invoiceId(inv1_1.getId())
                .paymentNumber("PMT-2026-001")
                .amount(new BigDecimal("125000"))
                .currency("INR")
                .status("SUCCESS")
                .paidAt(Instant.now().minus(14, ChronoUnit.DAYS))
                .receiptUrl("/api/v1/client/billing/receipts/PMT-2026-001")
                .razorpayOrderId("order_mock_001")
                .razorpayPaymentId("pay_mock_001")
                .build();
        pmt1_1.ensureTenantContext();
        paymentRepository.save(pmt1_1);

        Invoice inv1_2 = Invoice.builder()
                .projectId(project1.getId())
                .invoiceNumber("INV-2026-002")
                .title("UI/UX Design Milestone (25%)")
                .description("Milestone payment due upon final approval of high-fidelity designs.")
                .amount(new BigDecimal("125000"))
                .currency("INR")
                .status("PENDING")
                .dueDate(Instant.now().plus(14, ChronoUnit.DAYS))
                .build();
        inv1_2.ensureTenantContext();
        invoiceRepository.save(inv1_2);


        // 3. Create Project 2: Mobile App Development
        Project project2 = Project.builder()
                .name("Hari Ventures Client iOS & Android App")
                .description("Cross-platform React Native application to give investors real-time access to portfolio performance and analytics.")
                .clientId(userId)
                .status(ProjectStatus.PLANNING)
                .currentPhase("Phase 1: Architecture Review")
                .completionPercentage(10)
                .startDate(Instant.now().minus(5, ChronoUnit.DAYS))
                .estimatedEndDate(Instant.now().plus(120, ChronoUnit.DAYS))
                .build();
        project2.ensureTenantContext();
        projectRepository.save(project2);

        // Project 2 Milestones
        Milestone m2_1 = Milestone.builder()
                .projectId(project2.getId())
                .title("Security Review & Architecture Design")
                .description("Assess data flow security and API endpoint integration strategies.")
                .status("IN_PROGRESS")
                .targetDate(Instant.now().plus(15, ChronoUnit.DAYS))
                .build();
        m2_1.ensureTenantContext();
        milestoneRepository.save(m2_1);

        // Project 2 Invoices
        Invoice inv2_1 = Invoice.builder()
                .projectId(project2.getId())
                .invoiceNumber("INV-2026-003")
                .title("Mobile Project Kick-off (15%)")
                .description("Kick-off milestone billing for Mobile app setup and team onboarding.")
                .amount(new BigDecimal("95000"))
                .currency("INR")
                .status("OVERDUE")
                .dueDate(Instant.now().minus(2, ChronoUnit.DAYS))
                .build();
        inv2_1.ensureTenantContext();
        invoiceRepository.save(inv2_1);


        // 4. Create Support Tickets
        SupportTicket ticket1 = SupportTicket.builder()
                .ticketNumber("TKT-2026-0001")
                .subject("Access issues to Staging environment")
                .description("We cannot open the staging URL provided in the kickoff document. It returns a DNS error. Please verify the URL.")
                .status("RESOLVED")
                .priority("HIGH")
                .clientId(userId)
                .assignedTo("lead")
                .build();
        ticket1.ensureTenantContext();
        supportTicketRepository.save(ticket1);

        SupportTicket ticket2 = SupportTicket.builder()
                .ticketNumber("TKT-2026-0002")
                .subject("Request for additional mockup reviews")
                .description("We need to add a review session with our chief investment officer next Monday. Please accommodate it in the project timeline.")
                .status("OPEN")
                .priority("MEDIUM")
                .clientId(userId)
                .build();
        ticket2.ensureTenantContext();
        supportTicketRepository.save(ticket2);

        log.info("Successfully seeded all mock data for client: {}", userId);
    }
}
