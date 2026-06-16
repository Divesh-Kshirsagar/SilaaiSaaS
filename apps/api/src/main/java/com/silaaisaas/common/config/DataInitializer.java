package com.silaaisaas.common.config;

import com.silaaisaas.auth.User;
import com.silaaisaas.auth.UserRepository;
import com.silaaisaas.common.enums.ItemCategory;
import com.silaaisaas.common.enums.UnitType;
import com.silaaisaas.common.enums.UserRole;
import com.silaaisaas.inventory.InventoryItem;
import com.silaaisaas.inventory.InventoryItemRepository;
import com.silaaisaas.order.GarmentCatalog;
import com.silaaisaas.order.GarmentCatalogRepository;
import com.silaaisaas.shop.Organization;
import com.silaaisaas.shop.OrganizationRepository;
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

    private final OrganizationRepository organizationRepository;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final GarmentCatalogRepository garmentCatalogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (shopRepository.count() > 0) {
            log.info("Dev seed data already present — skipping DataInitializer.");
            return;
        }

        log.info("Seeding dev data...");

        // 1. Organization
        Organization org = organizationRepository.save(Organization.builder()
                .name("Ramesh Textiles")
                .defaultTaxRate(0.18)
                .build());

        // 2. Shop
        Shop shop = shopRepository.save(Shop.builder()
                .organization(org)
                .name("Ramesh Tailors - Main Branch")
                .phone("9876500000")
                .address("123 MG Road, Bangalore")
                .build());

        // 3. Owner user (login: 9999999999 / admin)
        userRepository.save(User.builder()
                .shop(shop)
                .name("Owner")
                .role(UserRole.OWNER)
                .phone("9999999999")
                .passwordHash(passwordEncoder.encode("admin"))
                .build());

        // 4. Tailor user (login: 8888888888 / tailor)
        userRepository.save(User.builder()
                .shop(shop)
                .name("Suresh Tailor")
                .role(UserRole.TAILOR)
                .phone("8888888888")
                .passwordHash(passwordEncoder.encode("tailor"))
                .build());

        // 5. Inventory items (fabrics + accessories)
        inventoryItemRepository.save(InventoryItem.builder().shop(shop).name("Blue Cotton").category(ItemCategory.FABRIC).unitType(UnitType.METRES).quantityAvailable(50.0).reorderLevel(10.0).unitCost(120.0).build());
        inventoryItemRepository.save(InventoryItem.builder().shop(shop).name("White Linen").category(ItemCategory.FABRIC).unitType(UnitType.METRES).quantityAvailable(30.0).reorderLevel(8.0).unitCost(150.0).build());
        inventoryItemRepository.save(InventoryItem.builder().shop(shop).name("Pearl Buttons (12mm)").category(ItemCategory.BUTTON).unitType(UnitType.PIECES).quantityAvailable(500.0).reorderLevel(50.0).unitCost(2.0).build());

        // 6. Garment types
        garmentCatalogRepository.save(GarmentCatalog.builder().shop(shop).name("Men's Shirt").basePrice(350.0).build());
        garmentCatalogRepository.save(GarmentCatalog.builder().shop(shop).name("Kurta").basePrice(500.0).build());
        garmentCatalogRepository.save(GarmentCatalog.builder().shop(shop).name("Trousers").basePrice(400.0).build());

        log.info("Dev seed complete. Shop: '{}', Owner login: 9999999999 / admin", shop.getName());
    }
}
