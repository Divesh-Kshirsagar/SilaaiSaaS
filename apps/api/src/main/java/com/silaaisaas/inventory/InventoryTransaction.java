package com.silaaisaas.inventory;

import com.silaaisaas.common.enums.TransactionReason;
import com.silaaisaas.order.OrderItem;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    // Nullable — only set when triggered by an order item deduction
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;

    // Positive = stock added, negative = stock deducted
    @Column(nullable = false)
    private Double quantityChange;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionReason reason;

    @Column(nullable = false)
    private LocalDateTime transactionDate;

    @PrePersist
    private void setTimestamp() {
        this.transactionDate = LocalDateTime.now();
    }
}
