package com.silaaisaas.shop;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organizations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g. "Ramesh Textiles Pvt. Ltd."

    private String taxId; // GST / VAT registration number

    @Column(nullable = false)
    @Builder.Default
    private Double defaultTaxRate = 0.0; // e.g. 0.18 for 18% GST
}
