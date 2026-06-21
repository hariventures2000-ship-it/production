package com.hariventures.mervi.employee.service;

import com.hariventures.mervi.employee.model.AttendanceEntry;
import com.hariventures.mervi.employee.model.EmployeeView;
import com.hariventures.mervi.employee.repository.EmployeeAttendanceRepository;
import com.hariventures.mervi.employee.repository.EmployeeSelfRepository;
import com.hariventures.mervi.shared.exception.ResourceNotFoundException;
import com.hariventures.mervi.shared.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeAttendanceService {

    private final EmployeeAttendanceRepository attendanceRepository;
    private final EmployeeSelfRepository employeeSelfRepository;

    public AttendanceEntry checkIn(String location, String ipAddress) {
        String tenantId = TenantContext.getTenantId();
        String userId = TenantContext.getUserId();

        EmployeeView employee = employeeSelfRepository.findByTenantIdAndUserId(tenantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));

        LocalDate today = LocalDate.now();
        Optional<AttendanceEntry> existing = attendanceRepository
                .findByTenantIdAndEmployeeIdAndDate(tenantId, employee.getId(), today);

        if (existing.isPresent() && existing.get().getCheckIn() != null) {
            throw new IllegalStateException("You have already checked in today");
        }

        AttendanceEntry record = existing.orElseGet(() -> {
            AttendanceEntry entry = new AttendanceEntry();
            entry.setEmployeeId(employee.getId());
            entry.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
            entry.setDate(today);
            entry.setStatus("PRESENT");
            entry.ensureTenantContext();
            return entry;
        });

        record.setCheckIn(Instant.now());
        record.setLocation(location);
        record.setIpAddress(ipAddress);

        log.info("Employee {} checked in at {}", employee.getEmployeeId(), record.getCheckIn());

        return attendanceRepository.save(record);
    }

    public AttendanceEntry checkOut() {
        String tenantId = TenantContext.getTenantId();
        String userId = TenantContext.getUserId();

        EmployeeView employee = employeeSelfRepository.findByTenantIdAndUserId(tenantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));

        LocalDate today = LocalDate.now();
        AttendanceEntry record = attendanceRepository
                .findByTenantIdAndEmployeeIdAndDate(tenantId, employee.getId(), today)
                .orElseThrow(() -> new IllegalStateException("No check-in record found for today"));

        if (record.getCheckOut() != null) {
            throw new IllegalStateException("You have already checked out today");
        }

        record.setCheckOut(Instant.now());

        long seconds = record.getCheckOut().getEpochSecond() - record.getCheckIn().getEpochSecond();
        record.setHoursWorked(Math.round(seconds / 360.0) / 10.0);

        if (record.getHoursWorked() < 4.0) {
            record.setStatus("HALF_DAY");
        }

        log.info("Employee {} checked out — {} hours", employee.getEmployeeId(), record.getHoursWorked());

        return attendanceRepository.save(record);
    }

    public AttendanceEntry getTodayStatus() {
        String tenantId = TenantContext.getTenantId();
        String userId = TenantContext.getUserId();

        EmployeeView employee = employeeSelfRepository.findByTenantIdAndUserId(tenantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));

        return attendanceRepository
                .findByTenantIdAndEmployeeIdAndDate(tenantId, employee.getId(), LocalDate.now())
                .orElse(null);
    }

    public List<AttendanceEntry> getMyAttendanceHistory(LocalDate from, LocalDate to) {
        String tenantId = TenantContext.getTenantId();
        String userId = TenantContext.getUserId();

        EmployeeView employee = employeeSelfRepository.findByTenantIdAndUserId(tenantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));

        return attendanceRepository.findByTenantIdAndEmployeeIdAndDateBetween(
                tenantId, employee.getId(), from, to);
    }
}
