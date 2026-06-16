package com.silaaisaas.customer;

import com.silaaisaas.auth.User;
import com.silaaisaas.common.enums.MeasurementStatus;
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

    // Version number — increments each time a new version is proposed
    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    // All measurements in centimetres
    private Double chest;
    private Double waist;
    private Double hip;
    private Double length;
    private Double shoulder;
    private Double sleeve;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MeasurementStatus status = MeasurementStatus.ACTIVE;

    // Set when a MANAGER/OWNER approves a PENDING_APPROVAL measurement
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedBy;

    private LocalDateTime approvedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    private void setTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}
