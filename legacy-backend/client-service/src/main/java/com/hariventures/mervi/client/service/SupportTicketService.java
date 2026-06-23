package com.hariventures.mervi.client.service;

import com.hariventures.mervi.client.model.SupportTicket;
import com.hariventures.mervi.client.repository.SupportTicketRepository;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupportTicketService {

    private final DataSeeder dataSeeder;
    private final SupportTicketRepository supportTicketRepository;

    public List<SupportTicket> getTickets() {
        dataSeeder.seedIfNeeded();
        String userId = TenantContext.getUserId();
        String tenantId = TenantContext.getTenantId();
        return supportTicketRepository.findByClientIdAndTenantId(userId, tenantId);
    }

    public SupportTicket createTicket(SupportTicket ticket) {
        dataSeeder.seedIfNeeded();
        String userId = TenantContext.getUserId();
        String tenantId = TenantContext.getTenantId();

        // Populate metadata
        ticket.setClientId(userId);
        ticket.setTenantId(tenantId);
        ticket.setOrganizationId(tenantId);
        ticket.setStatus("OPEN");

        // Format a unique ticket number
        long count = supportTicketRepository.count();
        String ticketNumber = String.format("TKT-%d-%04d", LocalDate.now().getYear(), count + 1);
        ticket.setTicketNumber(ticketNumber);

        ticket.ensureTenantContext();
        return supportTicketRepository.save(ticket);
    }
}
