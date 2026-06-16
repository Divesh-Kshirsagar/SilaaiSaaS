package com.silaaisaas.customer;

import com.silaaisaas.auth.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Immutable audit record of every measurement field change.
 * Created whenever a measurement is modified (regardless of approval state).
 */
@Entity
@Table(name = "measurement_audit")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "measurement_id", nullable = false)
    private Measurement measurement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_user_id", nullable = false)
    private User changedBy;

    @Column(nullable = false)
    private String fieldName; // e.g. "chest", "waist"

    private String oldValue;
    private String newValue;

    @Column(nullable = false)
    private LocalDateTime changedAt;

    @PrePersist
    private void setTimestamp() {
        if (changedAt == null) changedAt = LocalDateTime.now();
    }
}
