package com.hariventures.mervi.employee.repository;

import com.hariventures.mervi.employee.model.AttendanceEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeAttendanceRepository extends MongoRepository<AttendanceEntry, String> {

    Optional<AttendanceEntry> findByTenantIdAndEmployeeIdAndDate(
            String tenantId, String employeeId, LocalDate date);

    List<AttendanceEntry> findByTenantIdAndEmployeeIdAndDateBetween(
            String tenantId, String employeeId, LocalDate from, LocalDate to);
}
