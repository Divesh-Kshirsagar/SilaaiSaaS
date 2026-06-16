package com.silaaisaas.customer;

import com.silaaisaas.common.exception.ResourceNotFoundException;
import com.silaaisaas.order.Order;
import com.silaaisaas.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/portal")
@RequiredArgsConstructor
public class CustomerPortalController {

    private final OrderRepository orderRepository;

    public record PortalOrderResponse(
            String orderNumber,
            String customerName,
            String status,
            LocalDate bookingDate,
            LocalDate deliveryDate,
            Double totalAmount,
            Double advancePaid
    ) {}

    @GetMapping("/orders/{orderNumber}")
    public ResponseEntity<PortalOrderResponse> trackOrder(@PathVariable String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));

        return ResponseEntity.ok(new PortalOrderResponse(
                order.getOrderNumber(),
                order.getCustomer().getName(),
                order.getStatus().name(),
                order.getBookingDate(),
                order.getDeliveryDate(),
                order.getTotalAmount(),
                order.getAdvancePaid()
        ));
    }
}
