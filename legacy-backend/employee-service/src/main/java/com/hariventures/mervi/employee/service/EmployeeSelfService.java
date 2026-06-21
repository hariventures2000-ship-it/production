package com.hariventures.mervi.employee.service;

import com.hariventures.mervi.employee.model.EmployeeView;
import com.hariventures.mervi.employee.repository.EmployeeSelfRepository;
import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeSelfService {

    private final EmployeeSelfRepository employeeSelfRepository;

    public EmployeeView getMyProfile() {
        String tenantId = TenantContext.getTenantId();
        String userId = TenantContext.getUserId();

        return employeeSelfRepository.findByTenantIdAndUserId(tenantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));
    }

    public EmployeeView updateMyProfile(EmployeeView updates) {
        EmployeeView existing = getMyProfile();

        // Employees can only update limited fields
        if (updates.getPhone() != null) existing.setPhone(updates.getPhone());
        if (updates.getAvatarUrl() != null) existing.setAvatarUrl(updates.getAvatarUrl());

        return employeeSelfRepository.save(existing);
    }
}
