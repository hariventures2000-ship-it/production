package com.hariventures.mervi.client.controller;

import com.hariventures.mervi.client.model.SupportTicket;
import com.hariventures.mervi.client.service.SupportTicketService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    @GetMapping
    public ApiResponse<List<SupportTicket>> getTickets() {
        return ApiResponse.ok(supportTicketService.getTickets());
    }

    @PostMapping
    public ApiResponse<SupportTicket> createTicket(@RequestBody SupportTicket ticket) {
        return ApiResponse.ok(supportTicketService.createTicket(ticket), "Ticket created successfully");
    }
}
