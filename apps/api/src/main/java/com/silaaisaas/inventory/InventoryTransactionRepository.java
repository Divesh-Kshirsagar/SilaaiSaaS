package com.silaaisaas.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    List<InventoryTransaction> findByFabricIdOrderByTransactionDateDesc(Long fabricId);
}
