# SilaaiSaaS — Reports Module Real Data Integration

Provide a brief description of the problem, any background context, and what the change accomplishes.
Currently, the `/api/v1/reports/summary` endpoint returns a hardcoded mock JSON `{"totalRevenue": 25000.0, "totalOrders": 42}` and the frontend React components use hardcoded arrays for charts. The goal is to build the actual SQL aggregation queries so the shop owners see real-time insights based on their orders and invoices.

## User Review Required

> [!IMPORTANT]
> Please review the proposed query logic. The data will strictly be isolated by `TenantContext.getCurrentShopId()` to adhere to the multi-tenancy rules set in `AGENTS.md`.

## Open Questions

None currently. The requirements are clear: implement real aggregations for Revenue, Orders, Customers, and chart breakdowns.

## Proposed Changes

### Backend (`apps/api`)

#### [MODIFY] [CustomerRepository.java](file:///home/Divesh/projects/SilaaiSaaS/apps/api/src/main/java/com/silaaisaas/customer/CustomerRepository.java)
- Add `long countByShopId(Long shopId);`

#### [MODIFY] [OrderRepository.java](file:///home/Divesh/projects/SilaaiSaaS/apps/api/src/main/java/com/silaaisaas/order/OrderRepository.java)
- Add `long countByShopId(Long shopId);`
- Add `@Query("SELECT o.status, COUNT(o) FROM Order o WHERE o.shop.id = :shopId GROUP BY o.status")`
  `List<Object[]> countOrdersByShopIdGroupByStatus(@Param("shopId") Long shopId);`

#### [MODIFY] [InvoiceRepository.java](file:///home/Divesh/projects/SilaaiSaaS/apps/api/src/main/java/com/silaaisaas/billing/InvoiceRepository.java)
- Add `@Query("SELECT SUM(i.grandTotal) FROM Invoice i WHERE i.order.shop.id = :shopId")`
  `Double sumGrandTotalByShopId(@Param("shopId") Long shopId);`
- Add `@Query("SELECT EXTRACT(MONTH FROM i.issuedAt), SUM(i.grandTotal) FROM Invoice i WHERE i.order.shop.id = :shopId AND EXTRACT(YEAR FROM i.issuedAt) = :year GROUP BY EXTRACT(MONTH FROM i.issuedAt)")`
  `List<Object[]> sumMonthlyRevenue(@Param("shopId") Long shopId, @Param("year") int year);`

#### [NEW] [ReportsService.java](file:///home/Divesh/projects/SilaaiSaaS/apps/api/src/main/java/com/silaaisaas/report/ReportsService.java)
- Create a service to orchestrate these queries using the `TenantContext`.
- Format results into a new `ReportSummaryResponse` record containing:
  - `totalRevenue`, `totalOrders`, `activeCustomers`
  - `revenueTrend`: A list of 12 values (Jan-Dec) for the current year.
  - `orderStatusBreakdown`: Map of Status -> Count.

#### [MODIFY] [ReportsController.java](file:///home/Divesh/projects/SilaaiSaaS/apps/api/src/main/java/com/silaaisaas/report/ReportsController.java)
- Inject `ReportsService`.
- Replace the mock `Map.of()` response with a call to `reportsService.getSummary()`.

---

### Frontend (`apps/app`)

#### [MODIFY] [ReportsPage.tsx](file:///home/Divesh/projects/SilaaiSaaS/apps/app/src/pages/ReportsPage.tsx)
- Define TypeScript interface for `ReportSummaryResponse`.
- Remove the hardcoded `revenueData` and `orderStatusData` arrays.
- Populate `react-chartjs-2` components dynamically using the fetched `report.revenueTrend` and `report.orderStatusBreakdown`.
- Show empty/zero states if no data exists.

## Verification Plan

### Automated Tests
- The commands of any automated tests you'll run.
  - `./gradlew compileJava` to ensure JPQL syntax in Repositories is valid.
  - `npm run build` to verify React types.

### Manual Verification
- We will visit the Reports page in the UI to ensure the mock data is gone and real values (even if 0 or populated from seeded DB) appear correctly.
