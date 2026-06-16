package com.silaaisaas.inventory;

import com.silaaisaas.common.exception.ResourceNotFoundException;
import com.silaaisaas.common.enums.TransactionReason;
import com.silaaisaas.shop.Shop;
import com.silaaisaas.shop.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FabricService {

    private final FabricRepository fabricRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final ShopService shopService;

    public record FabricRequest(String name, Double quantityAvailable, Double reorderLevel) {}
    public record StockAdjustRequest(Double quantityChange, TransactionReason reason) {}

    public record FabricResponse(Long id, String name, Double quantityAvailable,
                                  Double reorderLevel, boolean lowStock) {}

    public List<FabricResponse> list() {
        Shop shop = shopService.getShop();
        return fabricRepository.findByShopId(shop.getId()).stream()
                .map(f -> new FabricResponse(f.getId(), f.getName(),
                        f.getQuantityAvailable(), f.getReorderLevel(),
                        f.getQuantityAvailable() <= f.getReorderLevel()))
                .toList();
    }

    public Fabric getById(Long id) {
        return fabricRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fabric not found: " + id));
    }

    @Transactional
    public Fabric create(FabricRequest req) {
        Shop shop = shopService.getShop();
        return fabricRepository.save(Fabric.builder()
                .shop(shop)
                .name(req.name())
                .quantityAvailable(req.quantityAvailable())
                .reorderLevel(req.reorderLevel())
                .build());
    }

    @Transactional
    public FabricResponse update(Long id, FabricRequest req) {
        Fabric fabric = getById(id);
        fabric.setName(req.name());
        if (req.reorderLevel() != null) fabric.setReorderLevel(req.reorderLevel());
        fabricRepository.save(fabric);
        return new FabricResponse(fabric.getId(), fabric.getName(),
                fabric.getQuantityAvailable(), fabric.getReorderLevel(),
                fabric.getQuantityAvailable() <= fabric.getReorderLevel());
    }

    @Transactional
    public FabricResponse adjustStock(Long id, StockAdjustRequest req) {
        Fabric fabric = getById(id);
        fabric.setQuantityAvailable(fabric.getQuantityAvailable() + req.quantityChange());
        fabricRepository.save(fabric);

        transactionRepository.save(InventoryTransaction.builder()
                .fabric(fabric)
                .quantityChange(req.quantityChange())
                .reason(req.reason())
                .build());

        return new FabricResponse(fabric.getId(), fabric.getName(),
                fabric.getQuantityAvailable(), fabric.getReorderLevel(),
                fabric.getQuantityAvailable() <= fabric.getReorderLevel());
    }
}
