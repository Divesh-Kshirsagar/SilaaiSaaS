package com.silaaisaas.order;

import com.silaaisaas.auth.User;
import com.silaaisaas.auth.UserRepository;
import com.silaaisaas.common.enums.OrderStatus;
import com.silaaisaas.common.enums.TaskStatus;
import com.silaaisaas.common.enums.TaskType;
import com.silaaisaas.common.enums.TransactionReason;
import com.silaaisaas.common.exception.BusinessException;
import com.silaaisaas.common.exception.ResourceNotFoundException;
import com.silaaisaas.customer.Customer;
import com.silaaisaas.customer.CustomerService;
import com.silaaisaas.inventory.Fabric;
import com.silaaisaas.inventory.FabricRepository;
import com.silaaisaas.inventory.InventoryTransaction;
import com.silaaisaas.inventory.InventoryTransactionRepository;
import com.silaaisaas.shop.Shop;
import com.silaaisaas.shop.ShopService;
import com.silaaisaas.task.Task;
import com.silaaisaas.task.TaskRepository;
import lombok.RequiredArgsConstructor;
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
    private final FabricRepository fabricRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final TaskRepository taskRepository;
    private final CustomerService customerService;
    private final ShopService shopService;
    private final UserRepository userRepository;
    private final GarmentCatalogRepository garmentCatalogRepository;

    // ---- DTOs (Java Records) ----

    public record OrderItemRequest(Long garmentCatalogId, Integer quantity,
                                   Long fabricId, Long measurementId) {}

    public record CreateOrderRequest(Long customerId, LocalDate deliveryDate,
                                     Double advancePaid, List<OrderItemRequest> items) {}

    public record UpdateOrderRequest(LocalDate deliveryDate, Double advancePaid) {}

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
        Shop shop = shopService.getShop();
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
        Shop shop = shopService.getShop();
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
                .totalAmount(total)
                .advancePaid(req.advancePaid() != null ? req.advancePaid() : 0.0)
                .build());

        // Create order items
        for (OrderItemRequest itemReq : req.items()) {
            GarmentCatalog garment = garmentCatalogRepository.findById(itemReq.garmentCatalogId()).orElseThrow();
            Fabric fabric = itemReq.fabricId() != null
                    ? fabricRepository.findById(itemReq.fabricId()).orElse(null)
                    : null;
            double fabricUsed = fabric != null
                    ? garment.getDefaultFabricConsumptionMeters() * itemReq.quantity()
                    : 0.0;

            orderItemRepository.save(OrderItem.builder()
                    .order(order)
                    .garmentCatalog(garment)
                    .quantity(itemReq.quantity())
                    .pricePerItem(garment.getBasePrice())
                    .fabric(fabric)
                    .fabricQuantityUsed(fabricUsed)
                    .measurementId(itemReq.measurementId())
                    .build());
        }

        return order;
    }

    @Transactional
    public Order update(Long id, UpdateOrderRequest req) {
        Order order = getById(id);
        order.setDeliveryDate(req.deliveryDate());
        order.setAdvancePaid(req.advancePaid());
        return orderRepository.save(order);
    }

    /**
     * Core confirm logic:
     * 1. Validate sufficient fabric stock for every order item.
     * 2. Deduct fabric stock and create InventoryTransaction records.
     * 3. Set order status to CONFIRMED.
     * 4. Auto-create first CUTTING task assigned to a tailor.
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
            if (item.getFabric() == null) continue; // customer-provided fabric, skip
            Fabric fabric = item.getFabric();
            if (fabric.getQuantityAvailable() < item.getFabricQuantityUsed()) {
                throw new BusinessException(
                        "Insufficient stock for fabric '" + fabric.getName() +
                        "'. Required: " + item.getFabricQuantityUsed() +
                        "m, Available: " + fabric.getQuantityAvailable() + "m");
            }
        }

        // Step 2: Deduct stock
        for (OrderItem item : items) {
            if (item.getFabric() == null) continue;
            Fabric fabric = item.getFabric();
            fabric.setQuantityAvailable(fabric.getQuantityAvailable() - item.getFabricQuantityUsed());
            fabricRepository.save(fabric);

            inventoryTransactionRepository.save(InventoryTransaction.builder()
                    .fabric(fabric)
                    .orderItem(item)
                    .quantityChange(-item.getFabricQuantityUsed())
                    .reason(TransactionReason.SALE)
                    .build());
        }

        // Step 3: Update order status
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        // Step 4: Create CUTTING task — assign to first available tailor in shop
        User tailor = userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("TAILOR") &&
                             u.getShop().getId().equals(order.getShop().getId()))
                .findFirst()
                .orElse(null); // null = unassigned if no tailor exists

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
