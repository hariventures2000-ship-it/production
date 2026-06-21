package com.hariventures.mervi.employee.controller;

import com.hariventures.mervi.employee.model.AttendanceEntry;
import com.hariventures.mervi.employee.service.EmployeeAttendanceService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/employee/attendance")
@RequiredArgsConstructor
public class EmployeeAttendanceController {

    private final EmployeeAttendanceService attendanceService;

    @PostMapping("/check-in")
    public ApiResponse<AttendanceEntry> checkIn(
            @RequestParam(required = false, defaultValue = "Office") String location,
            @RequestParam(required = false) String ipAddress) {
        return ApiResponse.ok(attendanceService.checkIn(location, ipAddress), "Checked in successfully");
    }

    @PostMapping("/check-out")
    public ApiResponse<AttendanceEntry> checkOut() {
        return ApiResponse.ok(attendanceService.checkOut(), "Checked out successfully");
    }

    @GetMapping("/today")
    public ApiResponse<AttendanceEntry> getTodayStatus() {
        return ApiResponse.ok(attendanceService.getTodayStatus());
    }

    @GetMapping("/history")
    public ApiResponse<List<AttendanceEntry>> getHistory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.ok(attendanceService.getMyAttendanceHistory(from, to));
    }
}
