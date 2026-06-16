package com.silaaisaas.common.config;

import com.silaaisaas.auth.User;
import com.silaaisaas.auth.UserRepository;
import com.silaaisaas.common.enums.ItemCategory;
import com.silaaisaas.common.enums.UnitType;
import com.silaaisaas.common.enums.UserRole;
import com.silaaisaas.common.tenant.TenantContext;
import com.silaaisaas.customer.Customer;
import com.silaaisaas.customer.CustomerRepository;
import com.silaaisaas.inventory.InventoryItem;
import com.silaaisaas.inventory.InventoryItemRepository;
import com.silaaisaas.order.BillOfMaterial;
import com.silaaisaas.order.GarmentCatalog;
import com.silaaisaas.order.GarmentCatalogRepository;
import com.silaaisaas.shop.Organization;
import com.silaaisaas.shop.OrganizationRepository;
import com.silaaisaas.shop.Shop;
import com.silaaisaas.shop.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final OrganizationRepository organizationRepository;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final GarmentCatalogRepository garmentCatalogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (organizationRepository.count() > 0) {
            System.out.println("Database already seeded.");
            return;
        }

        System.out.println("Starting Database Seeding...");

        // 1. Create Organization
        Organization org = new Organization();
        org.setName("Silaai SaaS Demo Org");
        org.setDefaultTaxRate(0.05);
        org = organizationRepository.save(org);

        // 2. Create Shop
        Shop shop = new Shop();
        shop.setName("Demo Main Branch");
        shop.setOrganization(org);
        shop = shopRepository.save(shop);

        // Set tenant context for the rest of the seeding
        TenantContext.setCurrentShopId(shop.getId());
        TenantContext.setCurrentOrgId(org.getId());

        // 3. Create Users
        User owner = new User();
        owner.setName("Demo Owner");
        owner.setPhone("9999999999");
        owner.setPasswordHash(passwordEncoder.encode("password"));
        owner.setRole(UserRole.OWNER);
        owner.setShop(shop);
        userRepository.save(owner);

        User manager = new User();
        manager.setName("Demo Manager");
        manager.setPhone("8888888888");
        manager.setPasswordHash(passwordEncoder.encode("password"));
        manager.setRole(UserRole.MANAGER);
        manager.setShop(shop);
        userRepository.save(manager);

        User tailor = new User();
        tailor.setName("Demo Tailor");
        tailor.setPhone("7777777777");
        tailor.setPasswordHash(passwordEncoder.encode("password"));
        tailor.setRole(UserRole.TAILOR);
        tailor.setShop(shop);
        userRepository.save(tailor);

        // 4. Create Customers
        Customer c1 = new Customer();
        c1.setName("Alice Smith");
        c1.setPhone("1234567890");
        c1.setShop(shop);
        customerRepository.save(c1);

        Customer c2 = new Customer();
        c2.setName("Bob Jones");
        c2.setPhone("0987654321");
        c2.setShop(shop);
        customerRepository.save(c2);

        // 5. Create Inventory Items
        InventoryItem fabric = new InventoryItem();
        fabric.setName("Premium Cotton White");
        fabric.setCategory(ItemCategory.FABRIC);
        fabric.setUnitType(UnitType.METRES);
        fabric.setQuantityAvailable(100.0);
        fabric.setReorderLevel(20.0);
        fabric.setUnitCost(150.0);
        fabric.setShop(shop);
        fabric = inventoryItemRepository.save(fabric);

        InventoryItem buttons = new InventoryItem();
        buttons.setName("White Shirt Buttons");
        buttons.setCategory(ItemCategory.BUTTON);
        buttons.setUnitType(UnitType.PIECES);
        buttons.setQuantityAvailable(500.0);
        buttons.setReorderLevel(100.0);
        buttons.setUnitCost(2.0);
        buttons.setShop(shop);
        buttons = inventoryItemRepository.save(buttons);

        // 6. Create Garment Catalog with BOM
        GarmentCatalog shirt = new GarmentCatalog();
        shirt.setName("Custom Tailored Shirt");
        shirt.setBasePrice(850.0);
        shirt.setShop(shop);

        BillOfMaterial bom1 = new BillOfMaterial();
        bom1.setGarmentCatalog(shirt);
        bom1.setInventoryItem(fabric);
        bom1.setQuantityRequired(2.5); // 2.5 meters
        
        BillOfMaterial bom2 = new BillOfMaterial();
        bom2.setGarmentCatalog(shirt);
        bom2.setInventoryItem(buttons);
        bom2.setQuantityRequired(8.0); // 8 buttons

        shirt.setBom(List.of(bom1, bom2));
        garmentCatalogRepository.save(shirt);

        GarmentCatalog pant = new GarmentCatalog();
        pant.setName("Formal Trousers");
        pant.setBasePrice(1200.0);
        pant.setShop(shop);
        garmentCatalogRepository.save(pant);

        // Clear tenant context
        TenantContext.clear();

        System.out.println("Database Seeding Completed.");
    }
}
