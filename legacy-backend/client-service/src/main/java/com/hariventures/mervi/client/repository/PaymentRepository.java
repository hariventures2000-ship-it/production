package com.hariventures.mervi.client.repository;

import com.hariventures.mervi.client.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByInvoiceIdAndTenantId(String invoiceId, String tenantId);
    List<Payment> findByInvoiceIdInAndTenantId(List<String> invoiceIds, String tenantId);
    Optional<Payment> findByIdAndTenantId(String id, String tenantId);
}
