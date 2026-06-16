package com.silaaisaas.order;

import com.silaaisaas.inventory.InventoryItem;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "garment_catalog_id", nullable = false)
    private GarmentCatalog garmentCatalog;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double pricePerItem;

    // Nullable — null means customer provided their own material
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id")
    private InventoryItem inventoryItem;

    // Quantity of material used (calculated at order confirmation)
    private Double materialQuantityUsed;

    // Measurement snapshot reference (nullable if measurements entered separately)
    private Long measurementId;
}
