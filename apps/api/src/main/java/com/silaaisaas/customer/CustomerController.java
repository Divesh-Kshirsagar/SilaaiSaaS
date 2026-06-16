package com.silaaisaas.customer;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<Page<Customer>> list(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(customerService.list(search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Customer> create(@Valid @RequestBody CustomerService.CustomerRequest req) {
        return ResponseEntity.status(201).body(customerService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(@PathVariable Long id,
                                           @Valid @RequestBody CustomerService.CustomerRequest req) {
        return ResponseEntity.ok(customerService.update(id, req));
    }
}
