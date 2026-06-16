package com.silaaisaas.order;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GarmentCatalogRepository extends JpaRepository<GarmentCatalog, Long> {

    List<GarmentCatalog> findByShopId(Long shopId);
}
