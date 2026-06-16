package com.silaaisaas.billing;

import com.silaaisaas.common.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByOrderId(Long orderId);
    long countByStatus(InvoiceStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT i FROM Invoice i WHERE i.order.shop.id = :shopId ORDER BY i.issuedAt DESC")
    org.springframework.data.domain.Page<Invoice> findByOrderShopIdOrderByIssuedAtDesc(@org.springframework.data.repository.query.Param("shopId") Long shopId, org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(i.grandTotal) FROM Invoice i WHERE i.order.shop.id = :shopId AND i.status != 'DRAFT'")
    Double sumGrandTotalByShopId(@org.springframework.data.repository.query.Param("shopId") Long shopId);

    @org.springframework.data.jpa.repository.Query("SELECT EXTRACT(MONTH FROM i.issuedAt), SUM(i.grandTotal) FROM Invoice i WHERE i.order.shop.id = :shopId AND EXTRACT(YEAR FROM i.issuedAt) = :year AND i.status != 'DRAFT' GROUP BY EXTRACT(MONTH FROM i.issuedAt)")
    java.util.List<Object[]> sumMonthlyRevenue(@org.springframework.data.repository.query.Param("shopId") Long shopId, @org.springframework.data.repository.query.Param("year") int year);
}
