package com.silaaisaas.customer;

import com.silaaisaas.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MeasurementService {

    private final MeasurementRepository measurementRepository;
    private final CustomerService customerService;

    public record MeasurementRequest(
            String garmentType,
            Double chest, Double waist, Double hip,
            Double length, Double shoulder, Double sleeve,
            String notes) {}

    public List<Measurement> listByCustomer(Long customerId) {
        return measurementRepository.findByCustomerIdOrderByUpdatedAtDesc(customerId);
    }

    @Transactional
    public Measurement create(Long customerId, MeasurementRequest req) {
        Customer customer = customerService.getById(customerId);
        Measurement m = Measurement.builder()
                .customer(customer)
                .garmentType(req.garmentType())
                .chest(req.chest()).waist(req.waist()).hip(req.hip())
                .length(req.length()).shoulder(req.shoulder()).sleeve(req.sleeve())
                .notes(req.notes())
                .build();
        return measurementRepository.save(m);
    }

    @Transactional
    public Measurement update(Long id, MeasurementRequest req) {
        Measurement m = measurementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Measurement not found: " + id));
        m.setGarmentType(req.garmentType());
        m.setChest(req.chest()); m.setWaist(req.waist()); m.setHip(req.hip());
        m.setLength(req.length()); m.setShoulder(req.shoulder()); m.setSleeve(req.sleeve());
        m.setNotes(req.notes());
        return measurementRepository.save(m);
    }
}
