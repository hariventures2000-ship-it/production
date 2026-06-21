package com.hariventures.mervi.hr.service;

import com.hariventures.mervi.hr.model.AttendanceRecord;
import com.hariventures.mervi.hr.repository.AttendanceRepository;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class HrAttendanceService {

    private final AttendanceRepository attendanceRepository;

    public List<AttendanceRecord> getTodayAttendance() {
        return attendanceRepository.findByTenantIdAndDate(
                TenantContext.getTenantId(), LocalDate.now());
    }

    public List<AttendanceRecord> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByTenantIdAndDate(TenantContext.getTenantId(), date);
    }

    public List<AttendanceRecord> getEmployeeAttendanceRange(String employeeId, LocalDate from, LocalDate to) {
        return attendanceRepository.findByTenantIdAndEmployeeIdAndDateBetween(
                TenantContext.getTenantId(), employeeId, from, to);
    }

    public AttendanceRecord checkIn(String employeeId, String employeeName, String location, String ipAddress) {
        String tenantId = TenantContext.getTenantId();
        LocalDate today = LocalDate.now();

        Optional<AttendanceRecord> existing = attendanceRepository
                .findByTenantIdAndEmployeeIdAndDate(tenantId, employeeId, today);

        if (existing.isPresent() && existing.get().getCheckIn() != null) {
            throw new IllegalStateException("Employee has already checked in today");
        }

        AttendanceRecord record = existing.orElseGet(() -> {
            AttendanceRecord newRecord = new AttendanceRecord();
            newRecord.setEmployeeId(employeeId);
            newRecord.setEmployeeName(employeeName);
            newRecord.setDate(today);
            newRecord.ensureTenantContext();
            return newRecord;
        });

        record.setCheckIn(Instant.now());
        record.setStatus(AttendanceRecord.AttendanceStatus.PRESENT);
        record.setLocation(location);
        record.setIpAddress(ipAddress);

        log.info("Check-in recorded for employee {} at {}", employeeId, record.getCheckIn());

        return attendanceRepository.save(record);
    }

    public AttendanceRecord checkOut(String employeeId) {
        String tenantId = TenantContext.getTenantId();
        LocalDate today = LocalDate.now();

        AttendanceRecord record = attendanceRepository
                .findByTenantIdAndEmployeeIdAndDate(tenantId, employeeId, today)
                .orElseThrow(() -> new IllegalStateException("No check-in record found for today"));

        if (record.getCheckOut() != null) {
            throw new IllegalStateException("Employee has already checked out today");
        }

        record.setCheckOut(Instant.now());

        // Calculate hours worked
        long seconds = record.getCheckOut().getEpochSecond() - record.getCheckIn().getEpochSecond();
        record.setHoursWorked(Math.round(seconds / 360.0) / 10.0); // round to 1 decimal

        // Half day if less than 4 hours
        if (record.getHoursWorked() < 4.0) {
            record.setStatus(AttendanceRecord.AttendanceStatus.HALF_DAY);
        }

        log.info("Check-out recorded for employee {} — {} hours worked", employeeId, record.getHoursWorked());

        return attendanceRepository.save(record);
    }

    public Map<String, Long> getTodayStats() {
        String tenantId = TenantContext.getTenantId();
        LocalDate today = LocalDate.now();
        Map<String, Long> stats = new HashMap<>();
        stats.put("present", attendanceRepository.countByTenantIdAndDateAndStatus(
                tenantId, today, AttendanceRecord.AttendanceStatus.PRESENT));
        stats.put("absent", attendanceRepository.countByTenantIdAndDateAndStatus(
                tenantId, today, AttendanceRecord.AttendanceStatus.ABSENT));
        stats.put("wfh", attendanceRepository.countByTenantIdAndDateAndStatus(
                tenantId, today, AttendanceRecord.AttendanceStatus.WORK_FROM_HOME));
        stats.put("onLeave", attendanceRepository.countByTenantIdAndDateAndStatus(
                tenantId, today, AttendanceRecord.AttendanceStatus.ON_LEAVE));
        return stats;
    }
}
