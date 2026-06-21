package com.hariventures.mervi.hr.repository;

import com.hariventures.mervi.hr.model.AttendanceRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends MongoRepository<AttendanceRecord, String> {

    Optional<AttendanceRecord> findByTenantIdAndEmployeeIdAndDate(
            String tenantId, String employeeId, LocalDate date);

    List<AttendanceRecord> findByTenantIdAndDate(String tenantId, LocalDate date);

    List<AttendanceRecord> findByTenantIdAndEmployeeIdAndDateBetween(
            String tenantId, String employeeId, LocalDate startDate, LocalDate endDate);

    long countByTenantIdAndDateAndStatus(
            String tenantId, LocalDate date, AttendanceRecord.AttendanceStatus status);
}
