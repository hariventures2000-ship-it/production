package com.hariventures.mervi.tenant.service;

import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.exception.UnauthorizedException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import com.hariventures.mervi.tenant.model.Tenant;
import com.hariventures.mervi.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;

    public Tenant createTenant(Tenant tenant) {
        verifyPlatformAccess();
        if (tenantRepository.existsBySlug(tenant.getSlug())) {
            throw new IllegalArgumentException("Tenant slug already exists");
        }
        return tenantRepository.save(tenant);
    }

    public Tenant getTenantById(String id) {
        verifyPlatformAccess();
        return tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant", "id", id));
    }

    public Tenant getTenantBySlug(String slug) {
        // This method can be called without platform access for resolution
        return tenantRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant", "slug", slug));
    }

    public List<Tenant> getAllTenants() {
        verifyPlatformAccess();
        return tenantRepository.findAll();
    }

    public Tenant updateTenantStatus(String id, String status) {
        verifyPlatformAccess();
        Tenant tenant = getTenantById(id);
        tenant.setStatus(status);
        // TODO: Publish Kafka event for tenant status change
        return tenantRepository.save(tenant);
    }

    private void verifyPlatformAccess() {
        if (!TenantContext.isPlatformRequest()) {
            throw new UnauthorizedException("Only Super Admin can manage tenants");
        }
    }
}
