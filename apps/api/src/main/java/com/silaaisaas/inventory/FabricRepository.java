package com.silaaisaas.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FabricRepository extends JpaRepository<Fabric, Long> {

    List<Fabric> findByShopId(Long shopId);

    @Query("SELECT f FROM Fabric f WHERE f.shop.id = :shopId AND f.quantityAvailable <= f.reorderLevel")
    List<Fabric> findLowStockByShopId(@Param("shopId") Long shopId);
}
