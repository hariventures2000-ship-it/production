package com.hariventures.mervi.tenant.controller;

import com.hariventures.mervi.shared.dto.ApiResponse;
import com.hariventures.mervi.tenant.model.Tenant;
import com.hariventures.mervi.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    public ApiResponse<Tenant> createTenant(@RequestBody Tenant tenant) {
        return ApiResponse.created(tenantService.createTenant(tenant), "Tenant created successfully");
    }

    @GetMapping
    public ApiResponse<List<Tenant>> getAllTenants() {
        return ApiResponse.ok(tenantService.getAllTenants());
    }

    @GetMapping("/{id}")
    public ApiResponse<Tenant> getTenantById(@PathVariable String id) {
        return ApiResponse.ok(tenantService.getTenantById(id));
    }
    
    @GetMapping("/resolve/{slug}")
    public ApiResponse<Tenant> resolveTenantBySlug(@PathVariable String slug) {
        return ApiResponse.ok(tenantService.getTenantBySlug(slug));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Tenant> updateTenantStatus(
            @PathVariable String id,
            @RequestParam String status) {
        return ApiResponse.ok(tenantService.updateTenantStatus(id, status), "Tenant status updated");
    }
}
