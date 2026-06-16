# Phase 4 Task Tracker — Frontend UI

> **File:** `20260616_TASK_phase4_frontend_01.md`
> **Branch:** `agent/phase4-frontend`
> **Started:** 2026-06-16

---

## Tasks

### Foundation
- [x] Create branch `agent/phase4-frontend`
- [x] Create this task file
- [x] `src/constants/enums.ts`
- [x] `src/lib/api.ts` (Axios instance + JWT interceptor)
- [x] `src/lib/queryClient.ts`

### State Management
- [x] `src/stores/authStore.ts` (Zustand + localStorage persist)
- [x] `src/stores/shopStore.ts`

### Zod Schemas
- [x] `src/schemas/auth.ts`
- [x] `src/schemas/customer.ts`
- [x] `src/schemas/order.ts`
- [x] `src/schemas/inventory.ts`
- [x] `src/schemas/task.ts`
- [x] `src/schemas/dashboard.ts`

### React Query Hooks
- [x] `src/hooks/useAuth.ts`
- [x] `src/hooks/useCustomers.ts`
- [x] `src/hooks/useOrders.ts`
- [x] `src/hooks/useInventory.ts`
- [x] `src/hooks/useTasks.ts`
- [x] `src/hooks/useDashboard.ts`

### Theme & Global CSS
- [x] `src/theme/variables.css` (custom Ionic CSS variables — dark, brand colors)
- [x] `src/theme/global.css` (typography, utility classes)

### Routing & Auth Guard
- [x] `src/components/ProtectedRoute.tsx`
- [x] `src/App.tsx` (replace default tabs scaffold with proper routing)
- [x] `src/main.tsx` (wrap with QueryClientProvider)

### Pages
- [x] `src/pages/LoginPage.tsx`
- [x] `src/pages/DashboardPage.tsx`
- [x] `src/pages/CustomersPage.tsx`
- [x] `src/pages/CustomerDetailPage.tsx`
- [x] `src/pages/OrderListPage.tsx`
- [x] `src/pages/NewOrderPage.tsx` (5-step wizard)
- [x] `src/pages/OrderDetailPage.tsx`
- [x] `src/pages/InventoryPage.tsx`
- [x] `src/pages/TasksPage.tsx`

### Reusable Components
- [x] `src/components/OrderStatusBadge.tsx`
- [x] `src/components/LowStockBanner.tsx`
- [x] `src/components/AppMenu.tsx` (side nav)

### Finalization
- [x] `src/.env.local` / `.env.example`
- [x] Verify: `npm run build` — zero errors
- [x] Commit all Phase 4 changes

## Phase 4 Complete ✅

Branch `agent/phase4-frontend` is ready for your review. Merge when you're happy — remember local merge only, never push to remote.
