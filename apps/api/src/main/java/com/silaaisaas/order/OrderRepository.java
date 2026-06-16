package com.silaaisaas.order;

import com.silaaisaas.common.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByShopIdOrderByBookingDateDesc(Long shopId);

    List<Order> findByShopIdAndStatus(Long shopId, OrderStatus status);

    List<Order> findByShopIdAndCustomerId(Long shopId, Long customerId);

    @Query("SELECT o FROM Order o WHERE o.shop.id = :shopId AND o.deliveryDate = :date")
    List<Order> findByShopIdAndDeliveryDate(@Param("shopId") Long shopId, @Param("date") LocalDate date);

    long countByShopIdAndStatus(Long shopId, OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.id = :shopId AND o.status NOT IN ('DELIVERED', 'DRAFT')")
    long countActiveByShopId(@Param("shopId") Long shopId);

    java.util.Optional<Order> findByOrderNumber(String orderNumber);

    long countByShopId(Long shopId);

    @Query("SELECT o.status, COUNT(o) FROM Order o WHERE o.shop.id = :shopId GROUP BY o.status")
    List<Object[]> countOrdersByShopIdGroupByStatus(@Param("shopId") Long shopId);
}
