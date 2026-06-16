# SilaaiSaaS — Reports Module Task Tracker

## Backend (`apps/api`)
- [x] Add `countByShopId` to `CustomerRepository.java`
- [x] Add `countByShopId` and `countOrdersByShopIdGroupByStatus` to `OrderRepository.java`
- [x] Add `sumGrandTotalByShopId` and `sumMonthlyRevenue` to `InvoiceRepository.java`
- [x] Create `ReportsService.java` to aggregate data
- [x] Update `ReportsController.java` to use `ReportsService`

## Frontend (`apps/app`)
- [x] Update `ReportsPage.tsx` to define `ReportSummaryResponse` interface
- [x] Bind real data to Total Revenue, Total Orders, Active Customers
- [x] Bind real data to Revenue Trend Chart
- [x] Bind real data to Order Status Chart

## Verification
- [x] Backend compilation (`./gradlew compileJava`)
- [x] Frontend type check (`npm run build`)
