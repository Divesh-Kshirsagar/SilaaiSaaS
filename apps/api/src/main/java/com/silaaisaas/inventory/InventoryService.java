package com.silaaisaas.inventory;

import com.silaaisaas.common.enums.ItemCategory;
import com.silaaisaas.common.enums.TransactionReason;
import com.silaaisaas.common.enums.UnitType;
import com.silaaisaas.common.exception.ResourceNotFoundException;
import com.silaaisaas.shop.Shop;
import com.silaaisaas.shop.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final ShopService shopService;

    public record InventoryRequest(
            String name,
            ItemCategory category,
            UnitType unitType,
            Double quantityAvailable,
            Double reorderLevel,
            Double unitCost) {}

    public record StockAdjustRequest(Double quantityChange, TransactionReason reason) {}

    public record InventoryResponse(
            Long id,
            String name,
            ItemCategory category,
            UnitType unitType,
            Double quantityAvailable,
            Double reorderLevel,
            Double unitCost,
            boolean lowStock) {}

    private InventoryResponse toResponse(InventoryItem item) {
        return new InventoryResponse(
                item.getId(),
                item.getName(),
                item.getCategory(),
                item.getUnitType(),
                item.getQuantityAvailable(),
                item.getReorderLevel(),
                item.getUnitCost(),
                item.getQuantityAvailable() <= item.getReorderLevel()
        );
    }

    public List<InventoryResponse> list() {
        Shop shop = shopService.getCurrentShop();
        return inventoryItemRepository.findByShopId(shop.getId())
                .stream().map(this::toResponse).toList();
    }

    public List<InventoryResponse> listByCategory(ItemCategory category) {
        Shop shop = shopService.getCurrentShop();
        return inventoryItemRepository.findByShopId(shop.getId())
                .stream()
                .filter(i -> i.getCategory() == category)
                .map(this::toResponse).toList();
    }

    public InventoryItem getById(Long id) {
        return inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found: " + id));
    }

    @Transactional
    public InventoryResponse create(InventoryRequest req) {
        Shop shop = shopService.getCurrentShop();
        InventoryItem item = inventoryItemRepository.save(InventoryItem.builder()
                .shop(shop)
                .name(req.name())
                .category(req.category())
                .unitType(req.unitType())
                .quantityAvailable(req.quantityAvailable())
                .reorderLevel(req.reorderLevel())
                .unitCost(req.unitCost())
                .build());
        return toResponse(item);
    }

    @Transactional
    public InventoryResponse update(Long id, InventoryRequest req) {
        InventoryItem item = getById(id);
        item.setName(req.name());
        item.setCategory(req.category());
        item.setUnitType(req.unitType());
        if (req.reorderLevel() != null) item.setReorderLevel(req.reorderLevel());
        if (req.unitCost() != null) item.setUnitCost(req.unitCost());
        inventoryItemRepository.save(item);
        return toResponse(item);
    }

    @Transactional
    public InventoryResponse adjustStock(Long id, StockAdjustRequest req) {
        InventoryItem item = getById(id);
        item.setQuantityAvailable(item.getQuantityAvailable() + req.quantityChange());
        inventoryItemRepository.save(item);

        transactionRepository.save(InventoryTransaction.builder()
                .inventoryItem(item)
                .quantityChange(req.quantityChange())
                .reason(req.reason())
                .build());

        return toResponse(item);
    }
}
