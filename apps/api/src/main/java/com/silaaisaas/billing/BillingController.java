package com.silaaisaas.billing;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    /** Get invoice for a given order */
    @GetMapping("/orders/{orderId}/invoice")
    public ResponseEntity<BillingService.InvoiceResponse> getInvoiceByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(billingService.getByOrderId(orderId));
    }

    /** Manually trigger invoice creation (if not auto-created on confirm) */
    @PostMapping("/orders/{orderId}/invoice")
    public ResponseEntity<BillingService.InvoiceResponse> createInvoice(@PathVariable Long orderId) {
        Invoice inv = billingService.createInvoice(orderId);
        return ResponseEntity.status(201).body(billingService.getById(inv.getId()));
    }

    /** Record a payment against an invoice */
    @PostMapping("/invoices/{invoiceId}/payments")
    public ResponseEntity<BillingService.InvoiceResponse> recordPayment(
            @PathVariable Long invoiceId,
            @RequestBody BillingService.RecordPaymentRequest req) {
        return ResponseEntity.ok(billingService.recordPayment(invoiceId, req));
    }

    /** Apply discount to invoice */
    @PatchMapping("/invoices/{invoiceId}/discount")
    public ResponseEntity<BillingService.InvoiceResponse> applyDiscount(
            @PathVariable Long invoiceId,
            @RequestParam Double amount,
            @RequestParam(required = false) String code) {
        return ResponseEntity.ok(billingService.applyDiscount(invoiceId, amount, code));
    }
}
