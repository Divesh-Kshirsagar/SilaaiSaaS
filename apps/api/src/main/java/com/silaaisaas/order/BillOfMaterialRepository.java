package com.silaaisaas.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillOfMaterialRepository extends JpaRepository<BillOfMaterial, Long> {
    List<BillOfMaterial> findByGarmentCatalogId(Long garmentCatalogId);
}
