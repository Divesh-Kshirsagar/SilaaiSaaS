# Phase 4 Task Tracker — Frontend UI

> **File:** `20260616_TASK_phase4_frontend_01.md`
> **Branch:** `agent/phase4-frontend`
> **Started:** 2026-06-16

---

## Tasks

### Foundation
- [x] Create branch `agent/phase4-frontend`
- [x] Create this task file
- [ ] `src/constants/enums.ts`
- [ ] `src/lib/api.ts` (Axios instance + JWT interceptor)
- [ ] `src/lib/queryClient.ts`

### State Management
- [ ] `src/stores/authStore.ts` (Zustand + localStorage persist)
- [ ] `src/stores/shopStore.ts`

### Zod Schemas
- [ ] `src/schemas/auth.ts`
- [ ] `src/schemas/customer.ts`
- [ ] `src/schemas/order.ts`
- [ ] `src/schemas/inventory.ts`
- [ ] `src/schemas/task.ts`
- [ ] `src/schemas/dashboard.ts`

### React Query Hooks
- [ ] `src/hooks/useAuth.ts`
- [ ] `src/hooks/useCustomers.ts`
- [ ] `src/hooks/useOrders.ts`
- [ ] `src/hooks/useInventory.ts`
- [ ] `src/hooks/useTasks.ts`
- [ ] `src/hooks/useDashboard.ts`

### Theme & Global CSS
- [ ] `src/theme/variables.css` (custom Ionic CSS variables — dark, brand colors)
- [ ] `src/theme/global.css` (typography, utility classes)

### Routing & Auth Guard
- [ ] `src/components/ProtectedRoute.tsx`
- [ ] `src/App.tsx` (replace default tabs scaffold with proper routing)
- [ ] `src/main.tsx` (wrap with QueryClientProvider)

### Pages
- [ ] `src/pages/LoginPage.tsx`
- [ ] `src/pages/DashboardPage.tsx`
- [ ] `src/pages/CustomersPage.tsx`
- [ ] `src/pages/CustomerDetailPage.tsx`
- [ ] `src/pages/OrderListPage.tsx`
- [ ] `src/pages/NewOrderPage.tsx` (5-step wizard)
- [ ] `src/pages/OrderDetailPage.tsx`
- [ ] `src/pages/InventoryPage.tsx`
- [ ] `src/pages/TasksPage.tsx`

### Reusable Components
- [ ] `src/components/OrderStatusBadge.tsx`
- [ ] `src/components/LowStockBanner.tsx`
- [ ] `src/components/AppMenu.tsx` (side nav)

### Finalization
- [ ] `src/.env.local` / `.env.example`
- [ ] Verify: `npm run build` — zero errors
- [ ] Commit all Phase 4 changes
