package com.silaaisaas.common.notification;

import com.silaaisaas.order.Order;

/**
 * Notification service interface.
 * Currently implemented by LoggingNotificationService (stub).
 * TODO: Replace with Twilio SMS or SendGrid email provider.
 * See AGENTS/TODO.md for the integration task.
 */
public interface NotificationService {
    void sendOrderStatusUpdate(Order order, String customerPhone);
    void sendDeliveryReady(Order order, String customerPhone);
    void sendMeasurementApprovalRequired(String ownerPhone, String customerName, String garmentType);
}
