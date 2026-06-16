# Phase 5 — UI Overhaul, Registration, Inventory & Logging

> Branch: `agent/phase5-ui-overhaul` | Started: 2026-06-16

## Track 1 — UI/UX Redesign

### Theme & Design System
- [x] Create `stores/uiStore.ts` (theme + sidebar state, persisted)
- [x] Update `theme/variables.css` — add light theme variables + CSS class `.light`
- [x] Update `theme/global.css` — stacked labels, link/button hierarchy, sidebar transition CSS

### Sidebar
- [x] Update `components/AppMenu.tsx` — add collapse/close button + ThemeToggle
- [x] Create `components/ThemeToggle.tsx` — sun/moon toggle button

### Forms
- [x] Fix `pages/LoginPage.tsx` — stacked labels
- [x] Fix `pages/CustomersPage.tsx` — stacked labels, improve button hierarchy
- [x] Fix `pages/NewOrderPage.tsx` — stacked labels

### Pages
- [x] Update `pages/DashboardPage.tsx` — visual hierarchy fixes
- [x] Update `pages/TasksPage.tsx` — replace Done button with expand card + Save
- [x] Update `pages/CustomersPage.tsx` — add filters
- [x] Update `pages/OrderListPage.tsx` — add filters

---

## Track 2 — New Feature APIs (Backend)

- [x] Add `POST /api/v1/auth/register` (public, creates Shop + Owner User)
- [x] Add `POST /api/v1/auth/register/staff` (owner-only)
- [x] Add `POST /api/v1/fabrics`, `PUT /api/v1/fabrics/{id}`, `POST /api/v1/fabrics/{id}/stock`
- [x] Add `POST /api/v1/garments`, `PUT /api/v1/garments/{id}`
- [x] Add `GET /api/v1/portal/orders/{orderNumber}` (public, no auth)
- [x] Backend: `./gradlew compileJava` → BUILD SUCCESSFUL

## Track 2 — New Feature UI (Frontend)

- [x] Create `pages/RegisterPage.tsx`
- [x] Update `pages/LoginPage.tsx` — add "Register" link
- [x] Create `pages/InventoryManagePage.tsx` (add fabric/garment, add stock)
- [x] Create `pages/CustomerPortalPage.tsx` (public order tracking)
- [x] Update `App.tsx` — add new routes (`/register`, `/inventory/manage`, `/track/:orderNumber`)

---

## Track 3 — Backend Logging

- [x] Create `common/logging/RequestLoggingFilter.java`
- [x] Update `application.yml` — logging config
- [x] Backend: `./gradlew compileJava` → BUILD SUCCESSFUL

---

## Final Checks

- [x] `npm run build` — 0 TypeScript errors
- [x] Commit all source changes
- [x] Update `AGENTS/TODO.md` — mark resolved items as `[x]`
- [x] Create `AGENTS/walkthroughs/20260616_WALK_phase5_ui_overhaul_01.md`
