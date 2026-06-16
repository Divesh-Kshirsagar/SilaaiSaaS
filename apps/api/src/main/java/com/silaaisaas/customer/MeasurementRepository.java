package com.silaaisaas.customer;

import com.silaaisaas.common.enums.MeasurementStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MeasurementRepository extends JpaRepository<Measurement, Long> {

    List<Measurement> findByCustomerIdAndStatus(Long customerId, MeasurementStatus status);

    List<Measurement> findByCustomerIdAndGarmentType(Long customerId, String garmentType);

    Optional<Measurement> findByCustomerIdAndGarmentTypeAndStatus(Long customerId, String garmentType, MeasurementStatus status);

    List<Measurement> findByStatus(MeasurementStatus status);
}
