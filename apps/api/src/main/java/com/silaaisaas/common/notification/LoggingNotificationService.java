package com.silaaisaas.common.notification;

import com.silaaisaas.order.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Stub implementation of NotificationService that logs to console.
 * Replace this with a real provider (Twilio, SendGrid) when ready.
 * See AGENTS/TODO.md → "Integrate real notification provider".
 */
@Slf4j
@Service
public class LoggingNotificationService implements NotificationService {

    @Override
    public void sendOrderStatusUpdate(Order order, String customerPhone) {
        log.info("[NOTIFICATION STUB] Order status update → Customer: {}, Order: {}, Status: {}",
                customerPhone, order.getOrderNumber(), order.getStatus());
    }

    @Override
    public void sendDeliveryReady(Order order, String customerPhone) {
        log.info("[NOTIFICATION STUB] Delivery ready → Customer: {}, Order: {}",
                customerPhone, order.getOrderNumber());
    }

    @Override
    public void sendMeasurementApprovalRequired(String ownerPhone, String customerName, String garmentType) {
        log.info("[NOTIFICATION STUB] Measurement approval required → Owner: {}, Customer: {}, Garment: {}",
                ownerPhone, customerName, garmentType);
    }
}
