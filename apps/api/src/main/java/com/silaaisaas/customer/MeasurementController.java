package com.silaaisaas.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MeasurementController {

    private final MeasurementService measurementService;
    private final CustomerService customerService;

    @GetMapping("/api/v1/customers/{customerId}/measurements")
    public ResponseEntity<List<Measurement>> list(@PathVariable Long customerId) {
        return ResponseEntity.ok(measurementService.listForCustomer(customerId));
    }

    @PostMapping("/api/v1/customers/{customerId}/measurements")
    public ResponseEntity<Measurement> create(
            @PathVariable Long customerId,
            @RequestBody MeasurementService.MeasurementRequest req) {
        Customer customer = customerService.getById(customerId);
        return ResponseEntity.status(201).body(measurementService.create(customer, req));
    }

    @PutMapping("/api/v1/measurements/{id}")
    public ResponseEntity<Measurement> update(
            @PathVariable Long id,
            @RequestBody MeasurementService.MeasurementRequest req) {
        return ResponseEntity.ok(measurementService.update(id, req));
    }

    /** List all measurements pending approval — OWNER / MANAGER only */
    @GetMapping("/api/v1/measurements/pending")
    public ResponseEntity<List<Measurement>> listPendingApprovals() {
        return ResponseEntity.ok(measurementService.listPendingApprovals());
    }

    /** Approve a pending measurement change */
    @PostMapping("/api/v1/measurements/{id}/approve")
    public ResponseEntity<Measurement> approve(@PathVariable Long id) {
        return ResponseEntity.ok(measurementService.approve(id));
    }

    /** Reject a pending measurement change */
    @DeleteMapping("/api/v1/measurements/{id}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long id) {
        measurementService.reject(id);
        return ResponseEntity.noContent().build();
    }
}
