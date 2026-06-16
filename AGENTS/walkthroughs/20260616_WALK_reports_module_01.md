# SilaaiSaaS — Reports Module Walkthrough

## What Changed
- **`CustomerRepository.java`**: Added `countByShopId` to fetch the total active customers.
- **`OrderRepository.java`**: Added `countByShopId` and `countOrdersByShopIdGroupByStatus` to retrieve order volumes and pipeline breakdowns.
- **`InvoiceRepository.java`**: Added queries to sum total revenue and compute monthly revenue trends grouped by month for the current year.
- **`ReportsService.java`**: A new service class to orchestrate the backend repository queries and format the results into a `ReportSummaryResponse`.
- **`ReportsController.java`**: Replaced mock data with the newly created `ReportsService` method.
- **`ReportsPage.tsx`**: Removed hardcoded chart arrays and connected the `react-chartjs-2` components to the new dynamic API response.

## How to Run It
1. Start the database (Docker):
   ```bash
   docker start silaaisaas_db
   ```
2. Start the backend server:
   ```bash
   cd apps/api
   SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun
   ```
3. Start the frontend development server:
   ```bash
   cd apps/app
   npm run dev
   ```

## User Flows
1. **View Reports**: Navigate to `http://localhost:5173` and click on **Reports** in the sidebar.
2. The page will dynamically query the API at `/api/v1/reports/summary`.
3. If you create new orders or record payments to invoices, you will see the **Total Revenue**, **Total Orders**, and **Chart** data update in real-time.

## Known Limitations
- The Monthly Revenue Trend currently assumes the backend operates in the server's local timezone.
- Chart.js animations might re-render unnecessarily on fast window resizes (a minor React StrictMode artifact).
