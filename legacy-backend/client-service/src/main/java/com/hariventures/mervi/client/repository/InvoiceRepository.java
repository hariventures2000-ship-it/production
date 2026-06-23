package com.hariventures.mervi.client.repository;

import com.hariventures.mervi.client.model.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends MongoRepository<Invoice, String> {
    List<Invoice> findByProjectIdAndTenantId(String projectId, String tenantId);
    List<Invoice> findByProjectIdInAndTenantId(List<String> projectIds, String tenantId);
    Optional<Invoice> findByIdAndTenantId(String id, String tenantId);
}
