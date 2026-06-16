package com.silaaisaas.billing;

import com.silaaisaas.auth.User;
import com.silaaisaas.auth.UserRepository;
import com.silaaisaas.common.enums.InvoiceStatus;
import com.silaaisaas.common.enums.PaymentMethod;
import com.silaaisaas.common.exception.BusinessException;
import com.silaaisaas.common.exception.ResourceNotFoundException;
import com.silaaisaas.order.Order;
import com.silaaisaas.order.OrderItem;
import com.silaaisaas.order.OrderItemRepository;
import com.silaaisaas.order.OrderRepository;
import com.silaaisaas.shop.Organization;
import com.silaaisaas.shop.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ShopService shopService;

    public record RecordPaymentRequest(Double amount, PaymentMethod method, String transactionRef) {}

    public record InvoiceResponse(
            Long invoiceId,
            String invoiceNumber,
            String orderNumber,
            Double subtotal,
            Double discountAmount,
            Double taxRate,
            Double taxAmount,
            Double grandTotal,
            Double amountPaid,
            Double balanceDue,
            String status
    ) {}

    private String generateInvoiceNumber() {
        long count = invoiceRepository.count() + 1;
        return String.format("INV-%04d", count);
    }

    private User currentUser() {
        String phone = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private InvoiceResponse toResponse(Invoice invoice) {
        List<Payment> payments = paymentRepository.findByInvoiceId(invoice.getId());
        double amountPaid = payments.stream().mapToDouble(Payment::getAmount).sum();
        double balance = invoice.getGrandTotal() - amountPaid;
        return new InvoiceResponse(
                invoice.getId(), invoice.getInvoiceNumber(),
                invoice.getOrder().getOrderNumber(),
                invoice.getSubtotal(), invoice.getDiscountAmount(),
                invoice.getTaxRate(), invoice.getTaxAmount(),
                invoice.getGrandTotal(), amountPaid, balance,
                invoice.getStatus().name()
        );
    }

    /**
     * Auto-generate an Invoice for an Order based on its items and org tax rate.
     * Called automatically when order is confirmed.
     */
    @Transactional
    public Invoice createInvoice(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (invoiceRepository.findByOrderId(orderId).isPresent()) {
            throw new BusinessException("Invoice already exists for order: " + orderId);
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        double subtotal = items.stream()
                .mapToDouble(i -> i.getPricePerItem() * i.getQuantity())
                .sum();

        Organization org = shopService.getCurrentOrganization();
        double taxRate = org.getDefaultTaxRate();
        double taxAmount = subtotal * taxRate;
        double grandTotal = subtotal + taxAmount;

        return invoiceRepository.save(Invoice.builder()
                .order(order)
                .invoiceNumber(generateInvoiceNumber())
                .subtotal(subtotal)
                .discountAmount(0.0)
                .taxRate(taxRate)
                .taxAmount(taxAmount)
                .grandTotal(grandTotal)
                .status(InvoiceStatus.ISSUED)
                .build());
    }

    public InvoiceResponse getByOrderId(Long orderId) {
        Invoice invoice = invoiceRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found for order: " + orderId));
        return toResponse(invoice);
    }

    public InvoiceResponse getById(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));
        return toResponse(invoice);
    }

    @Transactional
    public InvoiceResponse recordPayment(Long invoiceId, RecordPaymentRequest req) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));

        paymentRepository.save(Payment.builder()
                .invoice(invoice)
                .amount(req.amount())
                .method(req.method())
                .transactionRef(req.transactionRef())
                .recordedBy(currentUser())
                .build());

        // Recompute status
        List<Payment> payments = paymentRepository.findByInvoiceId(invoiceId);
        double amountPaid = payments.stream().mapToDouble(Payment::getAmount).sum();
        if (amountPaid >= invoice.getGrandTotal()) {
            invoice.setStatus(InvoiceStatus.PAID);
        } else if (amountPaid > 0) {
            invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
        }
        invoiceRepository.save(invoice);

        return toResponse(invoice);
    }

    @Transactional
    public InvoiceResponse applyDiscount(Long invoiceId, Double discountAmount, String discountCode) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));

        invoice.setDiscountAmount(discountAmount);
        invoice.setDiscountCode(discountCode);
        invoice.setGrandTotal(invoice.getSubtotal() - discountAmount + invoice.getTaxAmount());
        invoiceRepository.save(invoice);
        return toResponse(invoice);
    }
}
