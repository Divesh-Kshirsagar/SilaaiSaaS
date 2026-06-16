package com.silaaisaas.common.config;

import com.silaaisaas.auth.User;
import com.silaaisaas.auth.UserRepository;
import com.silaaisaas.common.enums.UserRole;
import com.silaaisaas.inventory.Fabric;
import com.silaaisaas.inventory.FabricRepository;
import com.silaaisaas.order.GarmentCatalog;
import com.silaaisaas.order.GarmentCatalogRepository;
import com.silaaisaas.shop.Shop;
import com.silaaisaas.shop.ShopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final FabricRepository fabricRepository;
    private final GarmentCatalogRepository garmentCatalogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (shopRepository.count() > 0) {
            log.info("Dev seed data already present — skipping DataInitializer.");
            return;
        }

        log.info("Seeding dev data...");

        // 1. Shop
        Shop shop = shopRepository.save(Shop.builder()
                .name("Ramesh Tailors")
                .phone("9876500000")
                .address("123 MG Road, Bangalore")
                .build());

        // 2. Owner user (login: 9999999999 / admin)
        userRepository.save(User.builder()
                .shop(shop)
                .name("Owner")
                .role(UserRole.OWNER)
                .phone("9999999999")
                .passwordHash(passwordEncoder.encode("admin"))
                .build());

        // 3. Tailor user (login: 8888888888 / tailor)
        userRepository.save(User.builder()
                .shop(shop)
                .name("Suresh Tailor")
                .role(UserRole.TAILOR)
                .phone("8888888888")
                .passwordHash(passwordEncoder.encode("tailor"))
                .build());

        // 4. Fabrics
        fabricRepository.save(Fabric.builder().shop(shop).name("Blue Cotton").quantityAvailable(50.0).reorderLevel(10.0).build());
        fabricRepository.save(Fabric.builder().shop(shop).name("White Linen").quantityAvailable(30.0).reorderLevel(8.0).build());
        fabricRepository.save(Fabric.builder().shop(shop).name("Black Polyester").quantityAvailable(20.0).reorderLevel(5.0).build());

        // 5. Garment types
        garmentCatalogRepository.save(GarmentCatalog.builder().shop(shop).name("Men's Shirt").basePrice(350.0).defaultFabricConsumptionMeters(2.5).build());
        garmentCatalogRepository.save(GarmentCatalog.builder().shop(shop).name("Kurta").basePrice(500.0).defaultFabricConsumptionMeters(3.0).build());
        garmentCatalogRepository.save(GarmentCatalog.builder().shop(shop).name("Trousers").basePrice(400.0).defaultFabricConsumptionMeters(1.8).build());

        log.info("Dev seed complete. Shop: '{}', Owner login: 9999999999 / admin", shop.getName());
    }
}
