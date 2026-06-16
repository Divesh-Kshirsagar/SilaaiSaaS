package com.silaaisaas.order;

import com.silaaisaas.inventory.InventoryItem;
import jakarta.persistence.*;
import lombok.*;

/**
 * Bill of Materials (BOM) entry linking a GarmentCatalog to the raw materials
 * required to produce one unit of that garment.
 * A garment can have multiple BOM entries (e.g., 2m of fabric + 6 buttons + 1 zipper).
 */
@Entity
@Table(name = "bill_of_materials")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillOfMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "garment_catalog_id", nullable = false)
    private GarmentCatalog garmentCatalog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    @Column(nullable = false)
    private Double quantityRequired; // per garment unit (in the item's UnitType)
}
