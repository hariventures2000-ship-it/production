package com.hariventures.mervi.client.controller;

import com.hariventures.mervi.client.model.Invoice;
import com.hariventures.mervi.client.model.Payment;
import com.hariventures.mervi.client.service.ClientBillingService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/client/billing")
@RequiredArgsConstructor
public class ClientBillingController {

    private final ClientBillingService clientBillingService;

    @GetMapping("/invoices")
    public ApiResponse<List<Invoice>> getInvoices() {
        return ApiResponse.ok(clientBillingService.getInvoices());
    }

    @GetMapping("/payments")
    public ApiResponse<List<Payment>> getPayments() {
        return ApiResponse.ok(clientBillingService.getPayments());
    }

    @PostMapping("/invoices/{invoiceId}/pay")
    public ApiResponse<Map<String, Object>> payInvoice(@PathVariable String invoiceId) {
        Payment payment = clientBillingService.payInvoice(invoiceId);

        // Map Razorpay-compatible overlay configuration response
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", payment.getRazorpayOrderId());
        // Razorpay expects amount in paise (1 INR = 100 paise)
        response.put("amount", payment.getAmount().multiply(new BigDecimal("100")).longValue());
        response.put("currency", payment.getCurrency());
        response.put("key", "rzp_test_mockkey12345"); // Dummy Razorpay key for local mode

        return ApiResponse.ok(response, "Payment initiated");
    }

    @GetMapping("/receipts/{paymentId}")
    public ApiResponse<String> getReceiptUrl(@PathVariable String paymentId) {
        String downloadPath = clientBillingService.getReceiptUrl(paymentId);
        return ApiResponse.ok(downloadPath);
    }

    @GetMapping("/receipts/{paymentId}/download")
    public ResponseEntity<byte[]> downloadReceiptPdf(@PathVariable String paymentId) throws IOException {
        byte[] pdfBytes = clientBillingService.getReceiptPdfBytes(paymentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"receipt_" + paymentId + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
