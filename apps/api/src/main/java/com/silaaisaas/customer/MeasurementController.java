package com.silaaisaas.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MeasurementController {

    private final MeasurementService measurementService;

    @GetMapping("/api/v1/customers/{customerId}/measurements")
    public ResponseEntity<List<Measurement>> list(@PathVariable Long customerId) {
        return ResponseEntity.ok(measurementService.listByCustomer(customerId));
    }

    @PostMapping("/api/v1/customers/{customerId}/measurements")
    public ResponseEntity<Measurement> create(@PathVariable Long customerId,
                                               @RequestBody MeasurementService.MeasurementRequest req) {
        return ResponseEntity.status(201).body(measurementService.create(customerId, req));
    }

    @PutMapping("/api/v1/measurements/{id}")
    public ResponseEntity<Measurement> update(@PathVariable Long id,
                                               @RequestBody MeasurementService.MeasurementRequest req) {
        return ResponseEntity.ok(measurementService.update(id, req));
    }
}
