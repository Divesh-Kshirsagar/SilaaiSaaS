package com.silaaisaas.inventory;

import com.silaaisaas.shop.Shop;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fabrics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Fabric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(nullable = false)
    private String name; // e.g. "Blue Cotton", "White Linen"

    @Column(nullable = false)
    private Double quantityAvailable; // in metres

    @Column(nullable = false)
    private Double reorderLevel; // alert threshold in metres
}
