package com.silaaisaas.customer;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "measurements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Measurement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // e.g. "SHIRT", "KURTA", "TROUSERS", "SAREE_BLOUSE"
    @Column(nullable = false)
    private String garmentType;

    // All measurements in centimetres
    private Double chest;
    private Double waist;
    private Double hip;
    private Double length;
    private Double shoulder;
    private Double sleeve;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    private void setTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}
