package com.hariventures.mervi.employee.controller;

import com.hariventures.mervi.employee.model.LeaveRequestEntry;
import com.hariventures.mervi.employee.service.EmployeeLeaveService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee/leaves")
@RequiredArgsConstructor
public class EmployeeLeaveController {

    private final EmployeeLeaveService leaveService;

    @GetMapping
    public ApiResponse<List<LeaveRequestEntry>> getMyLeaves() {
        return ApiResponse.ok(leaveService.getMyLeaves());
    }

    @PostMapping
    public ApiResponse<LeaveRequestEntry> requestLeave(@RequestBody LeaveRequestEntry request) {
        return ApiResponse.created(leaveService.requestLeave(request), "Leave request submitted");
    }

    @PostMapping("/{leaveId}/cancel")
    public ApiResponse<LeaveRequestEntry> cancelLeave(@PathVariable String leaveId) {
        return ApiResponse.ok(leaveService.cancelLeave(leaveId), "Leave request cancelled");
    }

    @GetMapping("/balance")
    public ApiResponse<Map<String, Integer>> getMyLeaveBalance() {
        return ApiResponse.ok(leaveService.getMyLeaveBalance());
    }
}
