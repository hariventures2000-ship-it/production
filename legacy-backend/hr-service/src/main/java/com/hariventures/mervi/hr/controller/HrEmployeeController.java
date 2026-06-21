package com.hariventures.mervi.hr.controller;

import com.hariventures.mervi.hr.model.Employee;
import com.hariventures.mervi.hr.service.HrEmployeeService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import com.hariventures.mervi.shared.enums.Department;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hr/employees")
@RequiredArgsConstructor
public class HrEmployeeController {

    private final HrEmployeeService hrEmployeeService;

    @GetMapping
    public ApiResponse<List<Employee>> getAllEmployees() {
        return ApiResponse.ok(hrEmployeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ApiResponse<Employee> getEmployee(@PathVariable String id) {
        return ApiResponse.ok(hrEmployeeService.getEmployeeById(id));
    }

    @GetMapping("/department/{department}")
    public ApiResponse<List<Employee>> getByDepartment(@PathVariable Department department) {
        return ApiResponse.ok(hrEmployeeService.getEmployeesByDepartment(department));
    }

    @GetMapping("/manager/{managerId}")
    public ApiResponse<List<Employee>> getByManager(@PathVariable String managerId) {
        return ApiResponse.ok(hrEmployeeService.getEmployeesByManager(managerId));
    }

    @PostMapping("/onboard")
    public ApiResponse<Employee> onboardEmployee(@RequestBody Employee employee) {
        return ApiResponse.created(hrEmployeeService.onboardEmployee(employee), "Employee onboarded successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<Employee> updateEmployee(@PathVariable String id, @RequestBody Employee updates) {
        return ApiResponse.ok(hrEmployeeService.updateEmployee(id, updates), "Employee updated successfully");
    }

    @PostMapping("/{id}/terminate")
    public ApiResponse<Employee> terminateEmployee(
            @PathVariable String id,
            @RequestParam String reason) {
        return ApiResponse.ok(hrEmployeeService.terminateEmployee(id, reason), "Employee terminated");
    }

    @GetMapping("/stats")
    public ApiResponse<Map<String, Long>> getDashboardStats() {
        return ApiResponse.ok(hrEmployeeService.getDashboardStats());
    }
}
