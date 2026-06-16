package com.silaaisaas.common.dashboard;

import com.silaaisaas.common.enums.OrderStatus;
import com.silaaisaas.inventory.InventoryItemRepository;
import com.silaaisaas.order.OrderRepository;
import com.silaaisaas.shop.Shop;
import com.silaaisaas.shop.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final ShopService shopService;

    public record DashboardStats(
            long pendingOrders,
            long todayDeliveries,
            long lowStockCount,
            long readyOrders
    ) {}

    public DashboardStats getStats() {
        Shop shop = shopService.getCurrentShop();
        Long shopId = shop.getId();

        long pending = orderRepository.countByShopIdAndStatus(shopId, OrderStatus.CONFIRMED)
                + orderRepository.countByShopIdAndStatus(shopId, OrderStatus.CUTTING)
                + orderRepository.countByShopIdAndStatus(shopId, OrderStatus.STITCHING);

        long today = orderRepository.findByShopIdAndDeliveryDate(shopId, LocalDate.now()).size();

        long lowStock = inventoryItemRepository.findByShopId(shopId).stream()
                .filter(i -> i.getQuantityAvailable() <= i.getReorderLevel())
                .count();

        long ready = orderRepository.countByShopIdAndStatus(shopId, OrderStatus.READY);

        return new DashboardStats(pending, today, lowStock, ready);
    }
}
