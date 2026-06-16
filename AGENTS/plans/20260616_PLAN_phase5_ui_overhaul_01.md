# Phase 5 — UI Overhaul, Registration, Inventory & Logging

> Created: 2026-06-16 | Branch: `agent/phase5-ui-overhaul`

## Goal

Address all items in `AGENTS/TODO.md`. Phase 5 is split into three parallel tracks:

1. **UI/UX Redesign** — design system, themes, form fixes, sidebar, filters
2. **New Feature APIs** — registration, inventory CRUD, customer portal
3. **Infrastructure** — structured backend logging

---

## Proposed Changes

---

### Track 1 — UI/UX Redesign (`apps/app/`)

#### [MODIFY] `theme/variables.css`
- Add full `@media (prefers-color-scheme: light)` and `.light` class overrides
- Add CSS custom properties for surface, card, and sidebar widths
- Keep the existing dark-mode palette as-is

#### [MODIFY] `theme/global.css`
- Fix all floating/inline labels → stack labels above inputs using `IonLabel` + `stacked` position
- Add `.ion-link` utility class (underline, primary color, no background) to clearly distinguish links from buttons
- Add `.btn-primary`, `.btn-outline`, `.btn-ghost` clearly-named button variants
- Add sidebar collapse transition CSS (`--sidebar-width`, `--sidebar-collapsed-width`)
- Add light-mode card, toolbar, and background overrides

#### [NEW] `components/ThemeToggle.tsx`
- Toggle button (sun/moon icon) stored in a new `uiStore` (Zustand) persisted to localStorage
- Adds/removes `.light` class on `document.body`

#### [MODIFY] `components/AppMenu.tsx`
- Add **collapse/close button** (chevron icon) at the top of the sidebar
- On mobile: tapping X closes the menu (`menuController.close()`)
- On desktop: toggles a "collapsed" state (icon-only mode, 64px wide)
- Add `ThemeToggle` in the footer area next to Logout

#### [MODIFY] All pages with forms (`LoginPage`, `CustomersPage`, `NewOrderPage`)
- Replace all `IonLabel position="floating"` → `IonLabel position="stacked"` (label sits above input)
- Wrap inputs in `IonItem lines="none"` with custom border for cleaner look

#### [MODIFY] `pages/DashboardPage.tsx`
- Replace plain text quick-action links with `IonButton fill="clear"` + explicit chevron icon for visual hierarchy

#### [MODIFY] `pages/TasksPage.tsx`
- Replace inline "Done" button with an **accordion/swipe card** per task
  - Shows: task type dropdown (CUTTING / STITCHING / FINISHING), notes textarea, "Mark Complete" button
  - Collapse/expand on tap

#### [MODIFY] `pages/CustomersPage.tsx`, `OrderListPage.tsx`
- Add `IonSearchbar` + `IonSelect` filter chips (by status, date range, etc.)
- Filtering is client-side (React state, no extra API calls needed)

#### [NEW] `stores/uiStore.ts`
- Persisted Zustand store for: `theme: 'dark' | 'light'`, `sidebarCollapsed: boolean`

---

### Track 2 — New Feature APIs & UI

#### Backend — `apps/api/`

##### [MODIFY] `auth/AuthController.java`
- Add `POST /api/v1/auth/register` — creates a new `User` + `Shop` in one transaction (multitenant registration)
- Add `POST /api/v1/auth/register/staff` — owner-only: add a tailor/staff member to the shop (no new shop created)
- Request body uses a `RegisterRequest` record with: `shopName`, `ownerName`, `phone`, `password`

##### [MODIFY] `auth/AuthService.java`
- `register()` method: validate phone uniqueness, hash password (BCrypt), create Shop → create User with OWNER role
- `registerStaff()` method: OWNER-only, creates User with TAILOR role linked to the same shop

##### [MODIFY] `inventory/FabricController.java` (or `InventoryController.java`)
- Add `POST /api/v1/fabrics` — create new fabric
- Add `PUT /api/v1/fabrics/{id}` — update name, reorder level
- Add `POST /api/v1/fabrics/{id}/stock` — add stock (creates `InventoryTransaction`)
- Add `POST /api/v1/garments` — create new garment type
- Add `PUT /api/v1/garments/{id}` — update garment price/name

##### [NEW] `customer/CustomerPortalController.java`
- Add `GET /api/v1/portal/orders/{trackingCode}` — **public endpoint** (no JWT required)
- Returns order status, customer name, garment list, delivery date
- `trackingCode` = `orderNumber` (already exists, e.g. `ORD-0001`)

#### Frontend — `apps/app/`

##### [NEW] `pages/RegisterPage.tsx`
- Public route `/register`
- Form: Shop Name, Owner Name, Phone, Password, Confirm Password
- On success → auto-login → redirect to `/dashboard`

##### [MODIFY] `pages/LoginPage.tsx`
- Add "New shop? Register here →" link at the bottom

##### [NEW] `pages/InventoryManagePage.tsx`
- Route: `/inventory/manage`
- Two tabs: **Fabrics** | **Garments**
- Fabrics tab: list + FAB to add new fabric + inline "Add Stock" button per row
- Garments tab: list + FAB to add new garment type

##### [NEW] `pages/CustomerPortalPage.tsx`
- Public route `/track/:orderNumber` (no auth required)
- Single input: enter order number
- Shows: status timeline (CONFIRMED → CUTTING → STITCHING → QUALITY_CHECK → READY → DELIVERED), delivery date, garment summary

---

### Track 3 — Backend Logging (`apps/api/`)

##### [NEW] `common/logging/RequestLoggingFilter.java`
- `OncePerRequestFilter` that logs: method, URI, status, duration, user phone (if authenticated)
- Output format: structured JSON using `logstash-logback-encoder` (or plain pattern for MVP)

##### [MODIFY] `apps/api/src/main/resources/application.yml`
- Add `logging.level.*` config section
- Add `logging.pattern.console` with timestamp, level, traceId, userId

##### [MODIFY] `build.gradle.kts`
- Add `implementation("net.logstash.logback:logstash-logback-encoder:7.4")` (optional, MVP can use plain logback)

---

## TODO.md Items Resolved by This Phase

- [x] Sidebar Toggle
- [x] Design Overhaul
- [x] Light Theme
- [x] Visual Hierarchy (links vs buttons)
- [x] Form Labels (stacked, above inputs)
- [x] Task UX (expand card + save)
- [x] Search Filters
- [x] User Registration
- [x] Multitenant Registration
- [x] Customer Portal
- [x] Inventory Management
- [x] Logging Registry

---

## Verification Plan

### Backend
```bash
cd apps/api
./gradlew compileJava   # must be BUILD SUCCESSFUL
SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun
```

New endpoints to test with cURL:
- `POST /api/v1/auth/register` (public)
- `POST /api/v1/fabrics` (owner-only)
- `POST /api/v1/fabrics/{id}/stock`
- `GET /api/v1/portal/orders/ORD-0001` (public)

### Frontend
```bash
cd apps/app
npm run build   # 0 TypeScript errors
```

Manual checks:
- Theme toggle works (sun/moon, persists on reload)
- Sidebar collapse works on desktop, closes on mobile
- Register page flow: fill form → land on dashboard
- Labels are visibly above inputs on all forms
- Inventory manage page: add fabric + add stock

---

## Open Questions

> None — scope is fully defined by the TODO.md items. Proceeding to execution on approval.
