# Phase 4 — Frontend UI & State Management

> **File:** `20260616_PLAN_phase4_frontend_01.md`
> **Status:** Awaiting User Approval

## Goal Description
Implement the frontend architecture and core UI components using Ionic React, Zustand, React Query, and Zod. This phase will translate the backend API capabilities into a functional, mobile-first SaaS application.

> [!IMPORTANT]
> **User Review Required**
> Please review the proposed routing structure and state management approaches below. Let me know if you approve this plan or if you want to modify any of the library choices or the wizard flow.

## Proposed Changes

We will restructure the scaffolded Ionic React app in `apps/app/src/` to follow a feature-based / atomic design-ish structure suited for our tech stack. 

### 1. Folder Structure & Foundation
- **`src/lib/api.ts`**: Configure Axios instance with the base URL and an interceptor to automatically inject the JWT token from the Zustand store.
- **`src/lib/queryClient.ts`**: Configure React Query's `QueryClient` with default stale times and error handling.
- **`src/constants/`**: Typed constants mirroring backend enums (`OrderStatus`, `TaskType`, `UserRole`).

### 2. State Management & Schemas
- **`src/schemas/`**: Define Zod schemas for all API requests and responses (e.g., `AuthResponseSchema`, `OrderSchema`, `CustomerSchema`).
- **`src/stores/authStore.ts`**: Zustand store for JWT token, logged-in user details, `login`, and `logout` actions. It will persist the token to `localStorage`.
- **`src/stores/shopStore.ts`**: Zustand store to hold the current shop context.

### 3. React Query Hooks
- **`src/hooks/useAuth.ts`**: Hook for the login mutation.
- **`src/hooks/useCustomers.ts`**, **`useOrders.ts`**, **`useInventory.ts`**, **`useTasks.ts`**, **`useDashboard.ts`**: Hooks mapping to our backend APIs for data fetching (queries) and updates (mutations).

### 4. Routing Structure (`src/App.tsx`)
We will ditch the default Ionic tabs scaffold and implement a side menu layout (or bottom tabs for mobile) with a protected routing system.

- `/login` (Public)
- `/dashboard` (Protected)
- `/customers`, `/customers/:id` (Protected)
- `/orders`, `/orders/new`, `/orders/:id` (Protected)
- `/inventory` (Protected)
- `/tasks` (Protected)

### 5. Core Pages (UI Components)
- **Login Page**: Simple Ionic form handling phone/password.
- **Dashboard**: High-level metrics and a Chart.js implementation for weekly orders.
- **Customers & Inventory**: List views with search and "add new" capabilities.
- **Order Wizard (`/orders/new`)**: A multi-step flow using `IonSlides` or step components to gather customer details, select garments/fabrics, enter measurements, and confirm the order.
- **Tasks View**: Tailored for the `TAILOR` role to easily mark tasks as complete.

## Verification Plan

### Automated Tests
- Run `npm run build` and `npm run lint` inside `apps/app` to ensure zero TypeScript or compilation errors.

### Manual Verification
1. Start both backend and frontend servers.
2. Verify that visiting `/` redirects to `/login` if unauthenticated.
3. Authenticate with `9999999999` / `admin`.
4. Verify the token is stored and Axios correctly appends it to subsequent API calls (Dashboard data loads successfully).
5. Ensure the Ionic components render correctly and match a premium, responsive design as specified in the UI guidelines.
