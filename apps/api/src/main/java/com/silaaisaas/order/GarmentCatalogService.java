package com.silaaisaas.order;

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
    private final ShopService shopService;

    public record GarmentRequest(String name, Double basePrice, Double defaultFabricConsumptionMeters) {}

    public List<GarmentCatalog> list() {
        Shop shop = shopService.getShop();
        return garmentCatalogRepository.findByShopId(shop.getId());
    }

    @Transactional
    public GarmentCatalog create(GarmentRequest req) {
        Shop shop = shopService.getShop();
        return garmentCatalogRepository.save(GarmentCatalog.builder()
                .shop(shop)
                .name(req.name())
                .basePrice(req.basePrice())
                .defaultFabricConsumptionMeters(req.defaultFabricConsumptionMeters())
                .build());
    }

    @Transactional
    public GarmentCatalog update(Long id, GarmentRequest req) {
        GarmentCatalog g = garmentCatalogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Garment not found: " + id));
        g.setName(req.name());
        if (req.basePrice() != null) g.setBasePrice(req.basePrice());
        if (req.defaultFabricConsumptionMeters() != null)
            g.setDefaultFabricConsumptionMeters(req.defaultFabricConsumptionMeters());
        return garmentCatalogRepository.save(g);
    }
}
