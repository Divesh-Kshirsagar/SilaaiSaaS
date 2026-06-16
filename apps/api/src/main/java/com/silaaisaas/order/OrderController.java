package com.silaaisaas.order;

import com.silaaisaas.common.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> list(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) Long customerId) {
        return ResponseEntity.ok(orderService.list(status, customerId));
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody OrderService.CreateOrderRequest req) {
        return ResponseEntity.status(201).body(orderService.create(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> update(@PathVariable Long id,
                                         @RequestBody OrderService.UpdateOrderRequest req) {
        return ResponseEntity.ok(orderService.update(id, req));
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<Order> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.confirmOrder(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id,
                                               @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
