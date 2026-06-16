package com.silaaisaas.report;

import com.silaaisaas.billing.InvoiceRepository;
import com.silaaisaas.common.tenant.TenantContext;
import com.silaaisaas.customer.CustomerRepository;
import com.silaaisaas.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportsService {

    private final OrderRepository orderRepository;
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;

    public record ReportSummaryResponse(
            Double totalRevenue,
            Long totalOrders,
            Long activeCustomers,
            List<Double> revenueTrend,
            Map<String, Long> orderStatusBreakdown
    ) {}

    public ReportSummaryResponse getSummary() {
        Long shopId = TenantContext.getCurrentShopId();
        int currentYear = LocalDate.now().getYear();

        Double totalRevenue = invoiceRepository.sumGrandTotalByShopId(shopId);
        if (totalRevenue == null) totalRevenue = 0.0;

        long totalOrders = orderRepository.countByShopId(shopId);
        long activeCustomers = customerRepository.countByShopId(shopId);

        // Revenue Trend (Jan-Dec)
        List<Object[]> monthlyRevData = invoiceRepository.sumMonthlyRevenue(shopId, currentYear);
        List<Double> revenueTrend = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            revenueTrend.add(0.0);
        }
        for (Object[] row : monthlyRevData) {
            Number monthNum = (Number) row[0];
            Number rev = (Number) row[1];
            if (monthNum != null && rev != null) {
                int monthIndex = monthNum.intValue() - 1;
                if (monthIndex >= 0 && monthIndex < 12) {
                    revenueTrend.set(monthIndex, rev.doubleValue());
                }
            }
        }

        // Order Status Breakdown
        List<Object[]> statusData = orderRepository.countOrdersByShopIdGroupByStatus(shopId);
        Map<String, Long> orderStatusBreakdown = new HashMap<>();
        orderStatusBreakdown.put("DRAFT", 0L);
        orderStatusBreakdown.put("CONFIRMED", 0L);
        orderStatusBreakdown.put("IN_PROGRESS", 0L);
        orderStatusBreakdown.put("READY", 0L);
        orderStatusBreakdown.put("DELIVERED", 0L);

        for (Object[] row : statusData) {
            Object statusObj = row[0];
            Number countNum = (Number) row[1];
            if (statusObj != null && countNum != null) {
                orderStatusBreakdown.put(statusObj.toString(), countNum.longValue());
            }
        }

        return new ReportSummaryResponse(
                totalRevenue,
                totalOrders,
                activeCustomers,
                revenueTrend,
                orderStatusBreakdown
        );
    }
}
