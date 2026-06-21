package com.hariventures.mervi.employee.service;

import com.hariventures.mervi.employee.model.EmployeeView;
import com.hariventures.mervi.employee.model.LeaveRequestEntry;
import com.hariventures.mervi.employee.repository.EmployeeLeaveRepository;
import com.hariventures.mervi.employee.repository.EmployeeSelfRepository;
import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeLeaveService {

    private final EmployeeLeaveRepository leaveRepository;
    private final EmployeeSelfRepository employeeSelfRepository;

    public List<LeaveRequestEntry> getMyLeaves() {
        String tenantId = TenantContext.getTenantId();
        String userId = TenantContext.getUserId();

        EmployeeView employee = employeeSelfRepository.findByTenantIdAndUserId(tenantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));

        return leaveRepository.findByTenantIdAndEmployeeId(tenantId, employee.getId());
    }

    public LeaveRequestEntry requestLeave(LeaveRequestEntry request) {
        String tenantId = TenantContext.getTenantId();
        String userId = TenantContext.getUserId();

        EmployeeView employee = employeeSelfRepository.findByTenantIdAndUserId(tenantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));

        // Validate leave balance
        Map<String, Integer> balance = employee.getLeaveBalance();
        if (balance != null && balance.containsKey(request.getLeaveType())) {
            int available = balance.get(request.getLeaveType());
            if (request.getTotalDays() > available) {
                throw new IllegalArgumentException(
                        String.format("Insufficient %s leave. Available: %d, Requested: %d",
                                request.getLeaveType(), available, request.getTotalDays()));
            }
        }

        request.setEmployeeId(employee.getId());
        request.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
        request.setStatus("PENDING");
        request.ensureTenantContext();

        log.info("Leave request submitted by {} for {} days of {}", 
                employee.getEmployeeId(), request.getTotalDays(), request.getLeaveType());

        return leaveRepository.save(request);
    }

    public LeaveRequestEntry cancelLeave(String leaveId) {
        String tenantId = TenantContext.getTenantId();

        LeaveRequestEntry leave = leaveRepository.findByTenantIdAndId(tenantId, leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", leaveId));

        if (!"PENDING".equals(leave.getStatus())) {
            throw new IllegalStateException("Only PENDING leave requests can be cancelled");
        }

        leave.setStatus("CANCELLED");
        return leaveRepository.save(leave);
    }

    public Map<String, Integer> getMyLeaveBalance() {
        String tenantId = TenantContext.getTenantId();
        String userId = TenantContext.getUserId();

        EmployeeView employee = employeeSelfRepository.findByTenantIdAndUserId(tenantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));

        return employee.getLeaveBalance();
    }
}
