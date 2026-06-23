package com.hariventures.mervi.client.service;

import com.hariventures.mervi.client.model.Invoice;
import com.hariventures.mervi.client.model.Payment;
import com.hariventures.mervi.client.model.Project;
import com.hariventures.mervi.client.repository.InvoiceRepository;
import com.hariventures.mervi.client.repository.PaymentRepository;
import com.hariventures.mervi.client.repository.ProjectRepository;
import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;
import com.hariventures.mervi.shared.event.InvoicePaidEvent;

import java.io.IOException;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientBillingService {

    private final DataSeeder dataSeeder;
    private final ProjectRepository projectRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final PdfInvoiceService pdfInvoiceService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private List<String> getClientProjectIds() {
        String userId = TenantContext.getUserId();
        String tenantId = TenantContext.getTenantId();
        return projectRepository.findByClientIdAndTenantId(userId, tenantId)
                .stream()
                .map(Project::getId)
                .collect(Collectors.toList());
    }

    public List<Invoice> getInvoices() {
        dataSeeder.seedIfNeeded();
        String tenantId = TenantContext.getTenantId();
        List<String> projectIds = getClientProjectIds();
        if (projectIds.isEmpty()) return Collections.emptyList();
        return invoiceRepository.findByProjectIdInAndTenantId(projectIds, tenantId);
    }

    public List<Payment> getPayments() {
        dataSeeder.seedIfNeeded();
        String tenantId = TenantContext.getTenantId();
        List<Invoice> invoices = getInvoices();
        if (invoices.isEmpty()) return Collections.emptyList();
        List<String> invoiceIds = invoices.stream().map(Invoice::getId).collect(Collectors.toList());
        return paymentRepository.findByInvoiceIdInAndTenantId(invoiceIds, tenantId);
    }

    public Invoice getInvoice(String invoiceId) {
        String tenantId = TenantContext.getTenantId();
        Invoice invoice = invoiceRepository.findByIdAndTenantId(invoiceId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", invoiceId));

        // Ownership validation
        List<String> clientProjectIds = getClientProjectIds();
        if (!clientProjectIds.contains(invoice.getProjectId())) {
            throw new ResourceNotFoundException("Invoice", "id", invoiceId);
        }

        return invoice;
    }

    public Payment payInvoice(String invoiceId) {
        Invoice invoice = getInvoice(invoiceId);
        String tenantId = TenantContext.getTenantId();

        if ("PAID".equals(invoice.getStatus())) {
            throw new IllegalArgumentException("Invoice is already paid");
        }

        // Generate a successful payment
        invoice.setStatus("PAID");
        invoice.setPaidAt(Instant.now());
        invoiceRepository.save(invoice);

        String paymentNumber = "PMT-" + LocalDateYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Payment payment = Payment.builder()
                .invoiceId(invoice.getId())
                .paymentNumber(paymentNumber)
                .amount(invoice.getAmount())
                .currency(invoice.getCurrency())
                .status("SUCCESS")
                .paidAt(Instant.now())
                .razorpayOrderId("order_" + UUID.randomUUID().toString().substring(0, 12))
                .razorpayPaymentId("pay_" + UUID.randomUUID().toString().substring(0, 12))
                .build();

        payment.ensureTenantContext();
        paymentRepository.save(payment);

        // Update receipt URL to include the generated payment ID
        payment.setReceiptUrl("/api/v1/client/billing/receipts/" + payment.getId());
        paymentRepository.save(payment);

        // Publish INVOICE_PAID event to Kafka
        InvoicePaidEvent paidEvent = InvoicePaidEvent.builder()
                .invoiceId(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .amount(invoice.getAmount())
                .projectId(invoice.getProjectId())
                .tenantId(tenantId)
                .build();
        try {
            kafkaTemplate.send("INVOICE_PAID", invoice.getId(), paidEvent);
            log.info("Published INVOICE_PAID event to Kafka for invoice: {}", invoice.getId());
        } catch (Exception e) {
            log.error("Failed to publish INVOICE_PAID event to Kafka", e);
        }

        log.info("Invoice {} paid successfully, recorded payment {}", invoiceId, payment.getId());
        return payment;
    }

    public String getReceiptUrl(String paymentId) {
        String tenantId = TenantContext.getTenantId();
        Payment payment = paymentRepository.findByIdAndTenantId(paymentId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        // Ownership validation
        Invoice invoice = getInvoice(payment.getInvoiceId()); // will check project list

        return "/api/v1/client/billing/receipts/" + payment.getId() + "/download";
    }

    public byte[] getReceiptPdfBytes(String paymentId) throws IOException {
        String tenantId = TenantContext.getTenantId();
        Payment payment = paymentRepository.findByIdAndTenantId(paymentId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        Invoice invoice = getInvoice(payment.getInvoiceId());

        return pdfInvoiceService.generateReceiptPdf(invoice, payment);
    }

    private int LocalDateYear() {
        return java.time.LocalDate.now().getYear();
    }
}
