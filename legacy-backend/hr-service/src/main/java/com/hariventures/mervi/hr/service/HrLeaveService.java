package com.hariventures.mervi.hr.service;

import com.hariventures.mervi.hr.model.Employee;
import com.hariventures.mervi.hr.model.LeaveRequest;
import com.hariventures.mervi.hr.repository.EmployeeRepository;
import com.hariventures.mervi.hr.repository.LeaveRequestRepository;
import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class HrLeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public List<LeaveRequest> getPendingLeaves() {
        return leaveRequestRepository.findByTenantIdAndStatus(
                TenantContext.getTenantId(), LeaveRequest.LeaveStatus.PENDING);
    }

    public List<LeaveRequest> getLeavesByEmployee(String employeeId) {
        return leaveRequestRepository.findByTenantIdAndEmployeeId(
                TenantContext.getTenantId(), employeeId);
    }

    public LeaveRequest submitLeaveRequest(LeaveRequest request) {
        String tenantId = TenantContext.getTenantId();

        // Validate employee exists
        Employee employee = employeeRepository.findByTenantIdAndId(tenantId, request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));

        // Validate leave balance
        String leaveTypeKey = request.getLeaveType().name();
        Map<String, Integer> balance = employee.getLeaveBalance();
        if (balance != null && balance.containsKey(leaveTypeKey)) {
            int available = balance.get(leaveTypeKey);
            if (request.getTotalDays() > available) {
                throw new IllegalArgumentException(
                        String.format("Insufficient %s leave balance. Available: %d, Requested: %d",
                                leaveTypeKey, available, request.getTotalDays()));
            }
        }

        request.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
        request.setStatus(LeaveRequest.LeaveStatus.PENDING);
        request.ensureTenantContext();

        log.info("Leave request submitted by employee {} for {} days", request.getEmployeeId(), request.getTotalDays());

        // TODO: Publish LEAVE_REQUESTED event to Kafka

        return leaveRequestRepository.save(request);
    }

    public LeaveRequest approveLeave(String leaveId, String approverUserId) {
        String tenantId = TenantContext.getTenantId();

        LeaveRequest leave = leaveRequestRepository.findByTenantIdAndId(tenantId, leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", leaveId));

        if (leave.getStatus() != LeaveRequest.LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is not in PENDING state");
        }

        leave.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        leave.setApprovedBy(approverUserId);
        leave.setApprovedAt(Instant.now());

        // Deduct from employee's leave balance
        Employee employee = employeeRepository.findByTenantIdAndId(tenantId, leave.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", leave.getEmployeeId()));

        String leaveTypeKey = leave.getLeaveType().name();
        Map<String, Integer> balance = employee.getLeaveBalance();
        if (balance != null && balance.containsKey(leaveTypeKey)) {
            balance.put(leaveTypeKey, balance.get(leaveTypeKey) - leave.getTotalDays());
            employeeRepository.save(employee);
        }

        log.info("Leave {} approved by {} for employee {}", leaveId, approverUserId, leave.getEmployeeId());

        // TODO: Publish LEAVE_APPROVED event to Kafka

        return leaveRequestRepository.save(leave);
    }

    public LeaveRequest rejectLeave(String leaveId, String approverUserId, String reason) {
        String tenantId = TenantContext.getTenantId();

        LeaveRequest leave = leaveRequestRepository.findByTenantIdAndId(tenantId, leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", leaveId));

        if (leave.getStatus() != LeaveRequest.LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is not in PENDING state");
        }

        leave.setStatus(LeaveRequest.LeaveStatus.REJECTED);
        leave.setApprovedBy(approverUserId);
        leave.setApprovedAt(Instant.now());
        leave.setRejectionReason(reason);

        log.info("Leave {} rejected by {} for employee {}", leaveId, approverUserId, leave.getEmployeeId());

        return leaveRequestRepository.save(leave);
    }

    public long getPendingCount() {
        return leaveRequestRepository.countByTenantIdAndStatus(
                TenantContext.getTenantId(), LeaveRequest.LeaveStatus.PENDING);
    }
}
