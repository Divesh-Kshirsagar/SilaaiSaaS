package com.silaaisaas.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MeasurementRepository extends JpaRepository<Measurement, Long> {

    List<Measurement> findByCustomerIdOrderByUpdatedAtDesc(Long customerId);

    List<Measurement> findByCustomerIdAndGarmentType(Long customerId, String garmentType);
}
