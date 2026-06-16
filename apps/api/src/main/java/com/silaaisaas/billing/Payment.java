package com.silaaisaas.billing;

import com.silaaisaas.auth.User;
import com.silaaisaas.common.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method; // CASH, CARD, UPI, ONLINE

    @Column(nullable = false)
    private LocalDateTime paidAt;

    private String transactionRef; // optional external payment reference

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by_user_id")
    private User recordedBy;

    @PrePersist
    private void setTimestamp() {
        if (paidAt == null) paidAt = LocalDateTime.now();
    }
}
