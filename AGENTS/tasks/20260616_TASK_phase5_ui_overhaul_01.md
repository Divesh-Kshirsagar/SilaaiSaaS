# Phase 5 — UI Overhaul, Registration, Inventory & Logging

> Branch: `agent/phase5-ui-overhaul` | Started: 2026-06-16

## Track 1 — UI/UX Redesign

### Theme & Design System
- [ ] Create `stores/uiStore.ts` (theme + sidebar state, persisted)
- [ ] Update `theme/variables.css` — add light theme variables + CSS class `.light`
- [ ] Update `theme/global.css` — stacked labels, link/button hierarchy, sidebar transition CSS

### Sidebar
- [ ] Update `components/AppMenu.tsx` — add collapse/close button + ThemeToggle
- [ ] Create `components/ThemeToggle.tsx` — sun/moon toggle button

### Forms
- [ ] Fix `pages/LoginPage.tsx` — stacked labels
- [ ] Fix `pages/CustomersPage.tsx` — stacked labels, improve button hierarchy
- [ ] Fix `pages/NewOrderPage.tsx` — stacked labels

### Pages
- [ ] Update `pages/DashboardPage.tsx` — visual hierarchy fixes
- [ ] Update `pages/TasksPage.tsx` — replace Done button with expand card + Save
- [ ] Update `pages/CustomersPage.tsx` — add filters
- [ ] Update `pages/OrderListPage.tsx` — add filters

---

## Track 2 — New Feature APIs (Backend)

- [ ] Add `POST /api/v1/auth/register` (public, creates Shop + Owner User)
- [ ] Add `POST /api/v1/auth/register/staff` (owner-only)
- [ ] Add `POST /api/v1/fabrics`, `PUT /api/v1/fabrics/{id}`, `POST /api/v1/fabrics/{id}/stock`
- [ ] Add `POST /api/v1/garments`, `PUT /api/v1/garments/{id}`
- [ ] Add `GET /api/v1/portal/orders/{orderNumber}` (public, no auth)
- [ ] Backend: `./gradlew compileJava` → BUILD SUCCESSFUL

## Track 2 — New Feature UI (Frontend)

- [ ] Create `pages/RegisterPage.tsx`
- [ ] Update `pages/LoginPage.tsx` — add "Register" link
- [ ] Create `pages/InventoryManagePage.tsx` (add fabric/garment, add stock)
- [ ] Create `pages/CustomerPortalPage.tsx` (public order tracking)
- [ ] Update `App.tsx` — add new routes (`/register`, `/inventory/manage`, `/track/:orderNumber`)

---

## Track 3 — Backend Logging

- [ ] Create `common/logging/RequestLoggingFilter.java`
- [ ] Update `application.yml` — logging config
- [ ] Backend: `./gradlew compileJava` → BUILD SUCCESSFUL

---

## Final Checks

- [ ] `npm run build` — 0 TypeScript errors
- [ ] Commit all source changes
- [ ] Update `AGENTS/TODO.md` — mark resolved items as `[x]`
- [ ] Create `AGENTS/walkthroughs/20260616_WALK_phase5_ui_overhaul_01.md`
