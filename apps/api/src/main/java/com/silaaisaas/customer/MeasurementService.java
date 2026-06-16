package com.silaaisaas.customer;

import com.silaaisaas.auth.User;
import com.silaaisaas.auth.UserRepository;
import com.silaaisaas.common.enums.MeasurementStatus;
import com.silaaisaas.common.enums.UserRole;
import com.silaaisaas.common.exception.BusinessException;
import com.silaaisaas.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MeasurementService {

    private final MeasurementRepository measurementRepository;
    private final MeasurementAuditRepository auditRepository;
    private final UserRepository userRepository;

    public record MeasurementRequest(
            String garmentType,
            Double chest, Double waist, Double hip,
            Double length, Double shoulder, Double sleeve,
            String notes
    ) {}

    private User currentUser() {
        String phone = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<Measurement> listForCustomer(Long customerId) {
        // Return only ACTIVE measurements by default
        return measurementRepository.findByCustomerIdAndStatus(customerId, MeasurementStatus.ACTIVE);
    }

    public List<Measurement> listPendingApprovals() {
        return measurementRepository.findByStatus(MeasurementStatus.PENDING_APPROVAL);
    }

    @Transactional
    public Measurement create(Customer customer, MeasurementRequest req) {
        return measurementRepository.save(Measurement.builder()
                .customer(customer)
                .garmentType(req.garmentType())
                .version(1)
                .chest(req.chest()).waist(req.waist()).hip(req.hip())
                .length(req.length()).shoulder(req.shoulder()).sleeve(req.sleeve())
                .notes(req.notes())
                .status(MeasurementStatus.ACTIVE)
                .build());
    }

    /**
     * Measurement update with approval workflow:
     * - OWNER / MANAGER: applies changes directly (creates new ACTIVE version, marks old SUPERSEDED)
     * - TAILOR / ASSISTANT: creates PENDING_APPROVAL version (old stays ACTIVE until approved)
     */
    @Transactional
    public Measurement update(Long measurementId, MeasurementRequest req) {
        Measurement old = measurementRepository.findById(measurementId)
                .orElseThrow(() -> new ResourceNotFoundException("Measurement not found: " + measurementId));

        User actor = currentUser();
        boolean canApproveDirectly = actor.getRole() == UserRole.OWNER || actor.getRole() == UserRole.MANAGER;

        // Create new version
        Measurement newVersion = measurementRepository.save(Measurement.builder()
                .customer(old.getCustomer())
                .garmentType(old.getGarmentType())
                .version(old.getVersion() + 1)
                .chest(req.chest()).waist(req.waist()).hip(req.hip())
                .length(req.length()).shoulder(req.shoulder()).sleeve(req.sleeve())
                .notes(req.notes())
                .status(canApproveDirectly ? MeasurementStatus.ACTIVE : MeasurementStatus.PENDING_APPROVAL)
                .build());

        // Log field-level diffs to audit trail
        logDiff(old, req, actor, newVersion);

        if (canApproveDirectly) {
            old.setStatus(MeasurementStatus.SUPERSEDED);
            measurementRepository.save(old);
        }

        return newVersion;
    }

    /**
     * Approve a PENDING_APPROVAL measurement (OWNER / MANAGER only).
     */
    @Transactional
    public Measurement approve(Long measurementId) {
        User actor = currentUser();
        if (actor.getRole() != UserRole.OWNER && actor.getRole() != UserRole.MANAGER) {
            throw new BusinessException("Only OWNER or MANAGER can approve measurement changes");
        }

        Measurement pending = measurementRepository.findById(measurementId)
                .orElseThrow(() -> new ResourceNotFoundException("Measurement not found: " + measurementId));

        if (pending.getStatus() != MeasurementStatus.PENDING_APPROVAL) {
            throw new BusinessException("Measurement is not in PENDING_APPROVAL state");
        }

        // Supersede the current ACTIVE version for the same customer + garment type
        measurementRepository
                .findByCustomerIdAndGarmentTypeAndStatus(pending.getCustomer().getId(), pending.getGarmentType(), MeasurementStatus.ACTIVE)
                .ifPresent(active -> {
                    active.setStatus(MeasurementStatus.SUPERSEDED);
                    measurementRepository.save(active);
                });

        pending.setStatus(MeasurementStatus.ACTIVE);
        pending.setApprovedBy(actor);
        pending.setApprovedAt(LocalDateTime.now());
        return measurementRepository.save(pending);
    }

    /**
     * Reject a PENDING_APPROVAL measurement (OWNER / MANAGER only).
     */
    @Transactional
    public void reject(Long measurementId) {
        User actor = currentUser();
        if (actor.getRole() != UserRole.OWNER && actor.getRole() != UserRole.MANAGER) {
            throw new BusinessException("Only OWNER or MANAGER can reject measurement changes");
        }

        Measurement pending = measurementRepository.findById(measurementId)
                .orElseThrow(() -> new ResourceNotFoundException("Measurement not found: " + measurementId));

        if (pending.getStatus() != MeasurementStatus.PENDING_APPROVAL) {
            throw new BusinessException("Measurement is not in PENDING_APPROVAL state");
        }

        measurementRepository.delete(pending);
    }

    private void logDiff(Measurement old, MeasurementRequest req, User actor, Measurement newVersion) {
        Map<String, Object[]> fields = Map.of(
                "chest",    new Object[]{ old.getChest(),    req.chest()    },
                "waist",    new Object[]{ old.getWaist(),    req.waist()    },
                "hip",      new Object[]{ old.getHip(),      req.hip()      },
                "length",   new Object[]{ old.getLength(),   req.length()   },
                "shoulder", new Object[]{ old.getShoulder(), req.shoulder() },
                "sleeve",   new Object[]{ old.getSleeve(),   req.sleeve()   }
        );

        fields.forEach((field, vals) -> {
            if (vals[0] != null || vals[1] != null) {
                if (!java.util.Objects.equals(vals[0], vals[1])) {
                    auditRepository.save(MeasurementAudit.builder()
                            .measurement(newVersion)
                            .changedBy(actor)
                            .fieldName(field)
                            .oldValue(vals[0] != null ? vals[0].toString() : null)
                            .newValue(vals[1] != null ? vals[1].toString() : null)
                            .build());
                }
            }
        });
    }
}
