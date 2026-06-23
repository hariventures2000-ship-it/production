package com.hariventures.mervi.client.repository;

import com.hariventures.mervi.client.model.SupportTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends MongoRepository<SupportTicket, String> {
    List<SupportTicket> findByClientIdAndTenantId(String clientId, String tenantId);
}
