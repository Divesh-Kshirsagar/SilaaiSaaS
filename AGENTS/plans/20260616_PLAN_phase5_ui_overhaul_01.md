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

> **Styling rule:** All UI must rely **exclusively on native Ionic component props and Ionic CSS Variables** defined in `theme/variables.css`. No custom CSS classes, no `global.css` overrides, no inline `style={{}}` props. If a visual need cannot be met by an Ionic prop (`color`, `fill`, `shape`, `lines`, `size`, `expand`, `slot`) or an Ionic CSS Variable, it is deferred.

#### [MODIFY] `theme/variables.css`
- Add Ionic's built-in light palette variables under `@media (prefers-color-scheme: light)` and `.light` class
- Tune `--ion-color-primary`, `--ion-background-color`, `--ion-item-background`, `--ion-card-background` etc. — Ionic CSS Variables only
- **Delete all custom non-Ionic CSS** (`.silaai-card`, `.btn-gradient`, `.fade-in-up`, `wizard-steps`, etc.)

#### [DELETE] `theme/global.css` _(all custom overrides removed — replaced by native Ionic)_

#### [NEW] `components/ThemeToggle.tsx`
- `IonButton fill="clear"` with `IonIcon` (sunnyOutline / moonOutline) — no custom styling
- Reads/writes `uiStore.theme`; applies Ionic's `dark` palette class to `document.documentElement`

#### [MODIFY] `components/AppMenu.tsx`
- Add close button using `IonMenuToggle` wrapping an `IonButton fill="clear"` — native Ionic close behavior, no CSS needed
- Add `ThemeToggle` in the `IonFooter` area

#### [MODIFY] All pages with forms (`LoginPage`, `CustomersPage`, `NewOrderPage`)
- Change all `IonLabel position="floating"` → `IonLabel position="stacked"` (native Ionic prop, no CSS needed)
- Use `IonItem lines="full"` (native Ionic dividers)

#### [MODIFY] `pages/DashboardPage.tsx`
- Replace raw `<a>` / plain text links with `IonButton fill="outline"` or `IonButton fill="clear"` — native Ionic button variants

#### [MODIFY] `pages/TasksPage.tsx`
- Use `IonAccordion` / `IonAccordionGroup` (native Ionic component) per task — expand to show status select + save
- `IonSelect` for task assignment, `IonButton color="success"` for Mark Complete — native Ionic only

#### [MODIFY] `pages/CustomersPage.tsx`, `OrderListPage.tsx`
- Use `IonSearchbar` (native Ionic) for text search
- Use `IonSelect` with `IonSelectOption` (native Ionic) for status filter chips
- Filtering is client-side (React state)

#### [NEW] `stores/uiStore.ts`
- Persisted Zustand store for: `theme: 'dark' | 'light'`

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
