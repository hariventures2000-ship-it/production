package com.hariventures.mervi.client.service;

import com.hariventures.mervi.client.model.Invoice;
import com.hariventures.mervi.client.model.Payment;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfInvoiceService {

    public byte[] generateReceiptPdf(Invoice invoice, Payment payment) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Title Block
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 20);
                contentStream.newLineAtOffset(50, 720);
                contentStream.showText("HARIVENTURES ENTERPRISE");
                contentStream.endText();

                // Subtitle
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                contentStream.newLineAtOffset(50, 680);
                contentStream.showText("OFFICIAL PAYMENT RECEIPT");
                contentStream.endText();

                // Divider Line
                contentStream.setLineWidth(1f);
                contentStream.moveTo(50, 660);
                contentStream.lineTo(550, 660);
                contentStream.stroke();

                // Details Text Block
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);
                contentStream.newLineAtOffset(50, 630);
                contentStream.showText("Receipt Number: " + payment.getPaymentNumber());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Invoice Number: " + invoice.getInvoiceNumber());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Invoice Title:  " + invoice.getTitle());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Description:    " + invoice.getDescription());
                contentStream.newLineAtOffset(0, -30);
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                contentStream.showText("Amount Paid:    " + invoice.getCurrency() + " " + payment.getAmount().toString());
                contentStream.newLineAtOffset(0, -25);
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);
                contentStream.showText("Payment Date:   " + payment.getPaidAt().toString());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Status:         " + payment.getStatus());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Transaction ID: " + payment.getRazorpayPaymentId());
                contentStream.endText();

                // Footer
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE), 9);
                contentStream.newLineAtOffset(50, 80);
                contentStream.showText("This is an electronically generated receipt. No signature is required.");
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("Thank you for your business! For any billing queries, please open a support ticket in the portal.");
                contentStream.endText();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
}
