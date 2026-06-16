package com.silaaisaas.customer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeasurementAuditRepository extends JpaRepository<MeasurementAudit, Long> {
    List<MeasurementAudit> findByMeasurementIdOrderByChangedAtDesc(Long measurementId);
}
