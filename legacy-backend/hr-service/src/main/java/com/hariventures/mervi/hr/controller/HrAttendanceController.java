package com.hariventures.mervi.hr.controller;

import com.hariventures.mervi.hr.model.AttendanceRecord;
import com.hariventures.mervi.hr.service.HrAttendanceService;
import com.hariventures.mervi.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hr/attendance")
@RequiredArgsConstructor
public class HrAttendanceController {

    private final HrAttendanceService hrAttendanceService;

    @GetMapping("/today")
    public ApiResponse<List<AttendanceRecord>> getTodayAttendance() {
        return ApiResponse.ok(hrAttendanceService.getTodayAttendance());
    }

    @GetMapping("/date/{date}")
    public ApiResponse<List<AttendanceRecord>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.ok(hrAttendanceService.getAttendanceByDate(date));
    }

    @GetMapping("/employee/{employeeId}")
    public ApiResponse<List<AttendanceRecord>> getEmployeeAttendance(
            @PathVariable String employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.ok(hrAttendanceService.getEmployeeAttendanceRange(employeeId, from, to));
    }

    @GetMapping("/stats/today")
    public ApiResponse<Map<String, Long>> getTodayStats() {
        return ApiResponse.ok(hrAttendanceService.getTodayStats());
    }
}
