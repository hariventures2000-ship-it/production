package com.hariventures.mervi.hr.controller;

import com.hariventures.mervi.hr.model.LeaveRequest;
import com.hariventures.mervi.hr.service.HrLeaveService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hr/leaves")
@RequiredArgsConstructor
public class HrLeaveController {

    private final HrLeaveService hrLeaveService;

    @GetMapping("/pending")
    public ApiResponse<List<LeaveRequest>> getPendingLeaves() {
        return ApiResponse.ok(hrLeaveService.getPendingLeaves());
    }

    @GetMapping("/employee/{employeeId}")
    public ApiResponse<List<LeaveRequest>> getLeavesByEmployee(@PathVariable String employeeId) {
        return ApiResponse.ok(hrLeaveService.getLeavesByEmployee(employeeId));
    }

    @PostMapping
    public ApiResponse<LeaveRequest> submitLeaveRequest(@RequestBody LeaveRequest request) {
        return ApiResponse.created(hrLeaveService.submitLeaveRequest(request), "Leave request submitted");
    }

    @PostMapping("/{leaveId}/approve")
    public ApiResponse<LeaveRequest> approveLeave(@PathVariable String leaveId) {
        String approverUserId = TenantContext.getUserId();
        return ApiResponse.ok(hrLeaveService.approveLeave(leaveId, approverUserId), "Leave approved");
    }

    @PostMapping("/{leaveId}/reject")
    public ApiResponse<LeaveRequest> rejectLeave(
            @PathVariable String leaveId,
            @RequestParam String reason) {
        String approverUserId = TenantContext.getUserId();
        return ApiResponse.ok(hrLeaveService.rejectLeave(leaveId, approverUserId, reason), "Leave rejected");
    }

    @GetMapping("/pending/count")
    public ApiResponse<Long> getPendingCount() {
        return ApiResponse.ok(hrLeaveService.getPendingCount());
    }
}
