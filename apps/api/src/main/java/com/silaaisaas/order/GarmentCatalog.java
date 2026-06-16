package com.silaaisaas.order;

import com.silaaisaas.shop.Shop;
import jakarta.persistence.*;
import lombok.*;

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

    // Default fabric consumption in metres per garment unit
    @Column(nullable = false)
    private Double defaultFabricConsumptionMeters;
}
