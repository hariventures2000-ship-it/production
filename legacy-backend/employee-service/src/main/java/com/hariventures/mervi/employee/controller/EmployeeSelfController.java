package com.hariventures.mervi.employee.controller;

import com.hariventures.mervi.employee.model.EmployeeView;
import com.hariventures.mervi.employee.service.EmployeeSelfService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee/me")
@RequiredArgsConstructor
public class EmployeeSelfController {

    private final EmployeeSelfService employeeSelfService;

    @GetMapping("/profile")
    public ApiResponse<EmployeeView> getMyProfile() {
        return ApiResponse.ok(employeeSelfService.getMyProfile());
    }

    @PutMapping("/profile")
    public ApiResponse<EmployeeView> updateMyProfile(@RequestBody EmployeeView updates) {
        return ApiResponse.ok(employeeSelfService.updateMyProfile(updates), "Profile updated");
    }
}
