package com.silaaisaas.inventory;

import com.silaaisaas.common.enums.ItemCategory;
import com.silaaisaas.common.enums.UnitType;
import com.silaaisaas.shop.Shop;
import jakarta.persistence.*;
import lombok.*;

/**
 * Generic inventory item replacing the old Fabric entity.
 * Supports both continuous units (metres of fabric) and discrete units (buttons, zippers).
 */
@Entity
@Table(name = "inventory_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(nullable = false)
    private String name; // e.g. "Blue Cotton", "Pearl Buttons", "YKK Zipper 12in"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemCategory category; // FABRIC, BUTTON, THREAD, etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnitType unitType; // METRES, PIECES, ROLLS, SPOOLS

    @Column(nullable = false)
    private Double quantityAvailable;

    @Column(nullable = false)
    private Double reorderLevel; // alert threshold

    private Double unitCost; // cost per unit (for BOM cost estimates)
}
