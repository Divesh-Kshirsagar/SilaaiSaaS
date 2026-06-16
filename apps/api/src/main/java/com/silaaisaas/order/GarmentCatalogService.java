package com.silaaisaas.order;

import com.silaaisaas.inventory.InventoryItem;
import com.silaaisaas.inventory.InventoryItemRepository;
import com.silaaisaas.shop.Shop;
import com.silaaisaas.shop.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GarmentCatalogService {

    private final GarmentCatalogRepository garmentCatalogRepository;
    private final BillOfMaterialRepository bomRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final ShopService shopService;

    public record GarmentRequest(String name, Double basePrice) {}

    public record BomLineRequest(Long inventoryItemId, Double quantityRequired) {}

    public List<GarmentCatalog> list() {
        Shop shop = shopService.getCurrentShop();
        return garmentCatalogRepository.findByShopId(shop.getId());
    }

    @Transactional
    public GarmentCatalog create(GarmentRequest req) {
        Shop shop = shopService.getCurrentShop();
        return garmentCatalogRepository.save(GarmentCatalog.builder()
                .shop(shop)
                .name(req.name())
                .basePrice(req.basePrice())
                .build());
    }

    @Transactional
    public BillOfMaterial addBomLine(Long garmentId, BomLineRequest req) {
        GarmentCatalog garment = garmentCatalogRepository.findById(garmentId)
                .orElseThrow(() -> new RuntimeException("Garment not found: " + garmentId));
        InventoryItem item = inventoryItemRepository.findById(req.inventoryItemId())
                .orElseThrow(() -> new RuntimeException("Inventory item not found: " + req.inventoryItemId()));
        return bomRepository.save(BillOfMaterial.builder()
                .garmentCatalog(garment)
                .inventoryItem(item)
                .quantityRequired(req.quantityRequired())
                .build());
    }

    @Transactional
    public GarmentCatalog update(Long id, GarmentRequest req) {
        GarmentCatalog g = garmentCatalogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Garment not found: " + id));
        g.setName(req.name());
        if (req.basePrice() != null) g.setBasePrice(req.basePrice());
        return garmentCatalogRepository.save(g);
    }
}
