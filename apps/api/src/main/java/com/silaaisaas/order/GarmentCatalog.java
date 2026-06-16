package com.silaaisaas.order;

import com.silaaisaas.shop.Shop;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "garment_catalog")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GarmentCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(nullable = false)
    private String name; // e.g. "Men's Shirt", "Kurta"

    @Column(nullable = false)
    private Double basePrice;

    /**
     * Bill of Materials: the raw materials required to make one unit of this garment.
     * Replaces the old hardcoded defaultFabricConsumptionMeters field.
     */
    @OneToMany(mappedBy = "garmentCatalog", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BillOfMaterial> bom = new ArrayList<>();
}
