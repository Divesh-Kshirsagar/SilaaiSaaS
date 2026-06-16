package com.silaaisaas.order;

import com.silaaisaas.auth.User;
import com.silaaisaas.auth.UserRepository;
import com.silaaisaas.billing.BillingService;
import com.silaaisaas.common.enums.OrderStatus;
import com.silaaisaas.common.enums.TaskStatus;
import com.silaaisaas.common.enums.TaskType;
import com.silaaisaas.common.enums.TransactionReason;
import com.silaaisaas.common.exception.BusinessException;
import com.silaaisaas.common.exception.ResourceNotFoundException;
import com.silaaisaas.customer.Customer;
import com.silaaisaas.customer.CustomerService;
import com.silaaisaas.inventory.InventoryItem;
import com.silaaisaas.inventory.InventoryItemRepository;
import com.silaaisaas.inventory.InventoryTransaction;
import com.silaaisaas.inventory.InventoryTransactionRepository;
import com.silaaisaas.shop.Shop;
import com.silaaisaas.shop.ShopService;
import com.silaaisaas.task.Task;
import com.silaaisaas.task.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final TaskRepository taskRepository;
    private final CustomerService customerService;
    private final ShopService shopService;
    private final UserRepository userRepository;
    private final GarmentCatalogRepository garmentCatalogRepository;
    private final BillOfMaterialRepository bomRepository;
    @Lazy
    private final BillingService billingService;

    // ---- DTOs ----

    public record OrderItemRequest(Long garmentCatalogId, Integer quantity,
                                   Long inventoryItemId, Long measurementId) {}

    public record CreateOrderRequest(Long customerId, LocalDate deliveryDate,
                                     List<OrderItemRequest> items) {}

    public record UpdateOrderRequest(LocalDate deliveryDate) {}

    // ---- Helpers ----

    private User currentUser() {
        String phone = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private String generateOrderNumber() {
        long count = orderRepository.count() + 1;
        return String.format("ORD-%04d", count);
    }

    // ---- API Methods ----

    public List<Order> list(OrderStatus status, Long customerId) {
        Shop shop = shopService.getCurrentShop();
        if (status != null) return orderRepository.findByShopIdAndStatus(shop.getId(), status);
        if (customerId != null) return orderRepository.findByShopIdAndCustomerId(shop.getId(), customerId);
        return orderRepository.findByShopIdOrderByBookingDateDesc(shop.getId());
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    @Transactional
    public Order create(CreateOrderRequest req) {
        Shop shop = shopService.getCurrentShop();
        Customer customer = customerService.getById(req.customerId());
        User creator = currentUser();

        // Calculate total from garment base prices
        double total = req.items().stream().mapToDouble(item -> {
            GarmentCatalog garment = garmentCatalogRepository.findById(item.garmentCatalogId())
                    .orElseThrow(() -> new ResourceNotFoundException("Garment not found: " + item.garmentCatalogId()));
            return garment.getBasePrice() * item.quantity();
        }).sum();

        Order order = orderRepository.save(Order.builder()
                .orderNumber(generateOrderNumber())
                .shop(shop)
                .customer(customer)
                .createdBy(creator)
                .bookingDate(LocalDate.now())
                .deliveryDate(req.deliveryDate())
                .status(OrderStatus.DRAFT)
                .build());

        // Create order items using BOM for material tracking
        for (OrderItemRequest itemReq : req.items()) {
            GarmentCatalog garment = garmentCatalogRepository.findById(itemReq.garmentCatalogId()).orElseThrow();
            InventoryItem inventoryItem = itemReq.inventoryItemId() != null
                    ? inventoryItemRepository.findById(itemReq.inventoryItemId()).orElse(null)
                    : null;

            // Calculate material quantity from BOM if inventory item provided
            double materialUsed = 0.0;
            if (inventoryItem != null) {
                materialUsed = bomRepository.findByGarmentCatalogId(garment.getId()).stream()
                        .filter(bom -> bom.getInventoryItem().getId().equals(inventoryItem.getId()))
                        .mapToDouble(bom -> bom.getQuantityRequired() * itemReq.quantity())
                        .sum();
            }

            orderItemRepository.save(OrderItem.builder()
                    .order(order)
                    .garmentCatalog(garment)
                    .quantity(itemReq.quantity())
                    .pricePerItem(garment.getBasePrice())
                    .inventoryItem(inventoryItem)
                    .materialQuantityUsed(materialUsed)
                    .measurementId(itemReq.measurementId())
                    .build());
        }

        return order;
    }

    @Transactional
    public Order update(Long id, UpdateOrderRequest req) {
        Order order = getById(id);
        order.setDeliveryDate(req.deliveryDate());
        return orderRepository.save(order);
    }

    /**
     * Confirm an order:
     * 1. Validate sufficient stock for all BOM items.
     * 2. Deduct stock, create InventoryTransaction records.
     * 3. Set order status to CONFIRMED.
     * 4. Auto-create first CUTTING task.
     */
    @Transactional
    public Order confirmOrder(Long orderId) {
        Order order = getById(orderId);

        if (order.getStatus() != OrderStatus.DRAFT) {
            throw new BusinessException("Only DRAFT orders can be confirmed. Current status: " + order.getStatus());
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);

        // Step 1: Validate stock
        for (OrderItem item : items) {
            if (item.getInventoryItem() == null) continue;
            InventoryItem inv = item.getInventoryItem();
            if (inv.getQuantityAvailable() < item.getMaterialQuantityUsed()) {
                throw new BusinessException(
                        "Insufficient stock for '" + inv.getName() +
                        "'. Required: " + item.getMaterialQuantityUsed() +
                        " " + inv.getUnitType() + ", Available: " + inv.getQuantityAvailable());
            }
        }

        // Step 2: Deduct stock
        for (OrderItem item : items) {
            if (item.getInventoryItem() == null) continue;
            InventoryItem inv = item.getInventoryItem();
            inv.setQuantityAvailable(inv.getQuantityAvailable() - item.getMaterialQuantityUsed());
            inventoryItemRepository.save(inv);

            inventoryTransactionRepository.save(InventoryTransaction.builder()
                    .inventoryItem(inv)
                    .orderItem(item)
                    .quantityChange(-item.getMaterialQuantityUsed())
                    .reason(TransactionReason.SALE)
                    .build());
        }

        // Step 3: Confirm order
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        // Step 3b: Auto-create invoice
        billingService.createInvoice(order.getId());

        // Step 4: Create CUTTING task — assign to first available tailor in shop
        User tailor = userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("TAILOR") &&
                             u.getShop().getId().equals(order.getShop().getId()))
                .findFirst()
                .orElse(null);

        taskRepository.save(Task.builder()
                .order(order)
                .assignedTo(tailor)
                .taskType(TaskType.CUTTING)
                .status(TaskStatus.PENDING)
                .dueDate(order.getDeliveryDate())
                .build());

        return order;
    }

    @Transactional
    public Order updateStatus(Long id, OrderStatus newStatus) {
        Order order = getById(id);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
