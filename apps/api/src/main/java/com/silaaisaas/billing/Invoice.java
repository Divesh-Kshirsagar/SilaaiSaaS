package com.silaaisaas.billing;

import com.silaaisaas.common.enums.InvoiceStatus;
import com.silaaisaas.order.Order;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false, unique = true)
    private String invoiceNumber; // e.g. "INV-0001"

    @Column(nullable = false)
    private Double subtotal; // sum of order item line totals

    @Builder.Default
    private Double discountAmount = 0.0;

    private String discountCode; // nullable promo code

    @Column(nullable = false)
    @Builder.Default
    private Double taxRate = 0.0; // e.g. 0.18 from Organization.defaultTaxRate

    @Column(nullable = false)
    @Builder.Default
    private Double taxAmount = 0.0; // computed: subtotal * taxRate

    @Column(nullable = false)
    private Double grandTotal; // subtotal - discountAmount + taxAmount

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    @Column(nullable = false)
    private LocalDateTime issuedAt;

    @PrePersist
    private void setTimestamp() {
        if (issuedAt == null) issuedAt = LocalDateTime.now();
    }
}
