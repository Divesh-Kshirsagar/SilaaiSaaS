# SilaaiSaaS — Master Implementation Plan

> **File:** `20260615_PLAN_project_overview_01.md`
> **Created:** 2026-06-15
> **Status:** Awaiting User Approval

---

## Background

SilaaiSaaS is a **web-first tailoring shop management SaaS** targeting single-shop owners in India. The MVP validates:
- Order booking + status tracking
- Customer measurement storage
- Fabric inventory auto-deduction
- Basic task assignment (cutting → stitching)
- Simple billing + invoice printing

**Stack decided:** Ionic React (frontend) + Spring Boot 4.1 / Java 21 (backend) + PostgreSQL.

---

## User Review Required

> [!WARNING]
> The `ionic start` command was interrupted (exit code 130 — user cancelled with Ctrl+C). The `apps/app/` directory is currently **empty**. We need to scaffold the Ionic React app before building any frontend pages. Confirm if you want the agent to scaffold it now.

> [!IMPORTANT]
> The current `build.gradle.kts` references `spring-boot-starter-webmvc-test` and `spring-boot-starter-data-jpa-test` — these do not exist as standalone starters. They need to be replaced with `spring-boot-starter-test`. This will be fixed in Phase 1.

> [!IMPORTANT]
> Spring Security and Validation are **not yet in the build file** but are required for JWT auth and request validation. They will be added in Phase 1.

---

## Open Questions

1. **Database hosting for local dev:** Should we use a local PostgreSQL install, or spin up a Docker container (`docker-compose.yml`)? Docker is recommended for reproducibility.
2. **Flyway vs `ddl-auto=update`:** For MVP speed, use `ddl-auto=update`. Migrate to Flyway before the pilot. Agree?
3. **Ionic app scaffold:** The cancelled `ionic start` used template `tabs`. Should we restart with a **blank** template and set up routes manually, or retry with `tabs`?

---

## Proposed Changes

### Phase 1 — Project Setup (3 days)

#### [MODIFY] build.gradle.kts
- Remove non-existent test starters.
- Add `spring-boot-starter-security`, `spring-boot-starter-validation`.
- Add `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson` for JWT.
- Add `org.mapstruct:mapstruct` + annotation processor.

#### [NEW] apps/app/ — Ionic React scaffold
- Run `ionic start silaai-app blank --type=react --capacitor` inside `apps/app/`.
- Configure `capacitor.config.ts` with `appId: com.silaaisaas.app`.
- Set up custom routing (remove default boilerplate).

#### [NEW] apps/api/src/main/resources/application.yml
- Local dev config: H2 in-memory for unit tests, PostgreSQL for dev profile.
- JWT secret + expiry placeholders reading from env vars.

#### [NEW] apps/api/.env.example & apps/app/.env.example
- Document all required environment variables (see AGENTS.md §6).

---

### Phase 2 — Core Entities & Repositories (4 days)

All files created under `apps/api/src/main/java/com/silaaisaas/`.

#### [NEW] Domain Entities (with Lombok)
| Entity | Package |
|--------|---------|
| `Shop` | `shop/` |
| `User` | `auth/` |
| `Customer` | `customer/` |
| `Measurement` | `customer/` |
| `GarmentCatalog` | `order/` |
| `Fabric` | `inventory/` |
| `Order` | `order/` |
| `OrderItem` | `order/` |
| `InventoryTransaction` | `inventory/` |
| `Task` | `task/` |

Each entity uses: `@Entity @Data @Builder @NoArgsConstructor @AllArgsConstructor`

#### [NEW] Enums
- `OrderStatus`: `DRAFT, CONFIRMED, CUTTING, STITCHING, QUALITY_CHECK, READY, DELIVERED`
- `TaskType`: `CUTTING, STITCHING, FINISHING`
- `TaskStatus`: `PENDING, IN_PROGRESS, COMPLETED`
- `UserRole`: `OWNER, TAILOR, ASSISTANT, MANAGER`
- `TransactionReason`: `SALE, PURCHASE, WASTE`

#### [NEW] Repositories (JpaRepository interfaces — no implementation)
One repository interface per entity.

#### [NEW] DB Seed Data
- `DataInitializer.java` — creates one demo shop, owner user, 3 fabric types, 2 garment types on first boot (dev profile only).

---

### Phase 3 — Backend APIs (7 days)

All endpoints under `/api/v1/`. JWT required except `/auth/login`.

#### [NEW] Auth Module (`auth/`)
- `POST /auth/login` → validates credentials, returns JWT.
- `JwtAuthenticationFilter.java` — validates token on every request.
- `SecurityConfig.java` — Spring Security config (stateless, permit login endpoint).

#### [NEW] Customer Module (`customer/`)
- `GET /customers` — paginated, searchable by name/phone.
- `POST /customers` — create.
- `GET /customers/{id}` — with measurements and recent orders.
- `PUT /customers/{id}` — update.

#### [NEW] Measurement Module (under `customer/`)
- `GET /customers/{customerId}/measurements`
- `POST /customers/{customerId}/measurements`
- `PUT /measurements/{id}` — owner only.

#### [NEW] Inventory Module (`inventory/`)
- `GET /fabrics` — list with stock levels + low-stock flag.
- `POST /fabrics` — add fabric.
- `PUT /fabrics/{id}` — adjust stock (purchase/waste).

#### [NEW] Order Module (`order/`)
- `GET /orders` — filters: status, customerId, dateFrom, dateTo.
- `POST /orders` — create draft order with items.
- `GET /orders/{id}` — full detail: items, tasks, payments.
- `PUT /orders/{id}` — update delivery date / advance.
- `POST /orders/{id}/confirm` — **core endpoint**: validate stock → deduct inventory → set `CONFIRMED` → auto-create `CUTTING` task.
- `PUT /orders/{id}/status` — move to next status (owner/manager only).

#### [NEW] Task Module (`task/`)
- `GET /tasks` — filter `assignedTo=me` for tailor.
- `POST /tasks/{id}/complete` — mark done, auto-create next task, update order status.

#### [NEW] Dashboard Module
- `GET /dashboard/stats` — counts + weekly bar chart data.

---

### Phase 4 — Frontend Pages (10 days)

All files under `apps/app/src/`.

#### [NEW] Auth
- `pages/LoginPage.tsx` — phone + password, JWT stored in localStorage.
- `context/AuthContext.tsx` — `user`, `token`, `login()`, `logout()`.

#### [NEW] Navigation
- `App.tsx` — IonRouterOutlet; redirect to `/login` if no token.
- `components/AppMenu.tsx` — IonTabBar (Dashboard, Orders, Customers, Inventory, Tasks).

#### [NEW] Dashboard
- `pages/DashboardPage.tsx` — stat cards + weekly bar chart (Chart.js).

#### [NEW] Customers
- `pages/CustomersPage.tsx` — IonSearchbar + IonList.
- `pages/CustomerDetailPage.tsx` — IonTabs: Info | Measurements | Orders.
- `components/MeasurementForm.tsx` — chest, waist, hip, length, shoulder, sleeve fields.

#### [NEW] Orders
- `pages/OrderListPage.tsx` — IonSegment filter + color-coded status badges.
- `pages/NewOrderPage.tsx` — 5-step wizard: customer → items → fabric → delivery → review.
- `pages/OrderDetailPage.tsx` — timeline, items list, task list, Record Payment, Print Invoice.

#### [NEW] Inventory
- `pages/InventoryPage.tsx` — IonItemSliding, low-stock warning banners.

#### [NEW] Tasks
- `pages/TasksPage.tsx` — tailor sees only their tasks; "Mark Complete" button.

#### [NEW] Shared Utilities
- `hooks/useOrders.ts`, `useCustomers.ts`, `useInventory.ts` — React Query hooks.
- `lib/api.ts` — Axios with JWT interceptor.
- `constants/ORDER_STATUS.ts`, `TASK_TYPE.ts`.

---

### Phase 5 — Integration & Polish (5 days)

- Global Axios error interceptor → IonToast notifications.
- IonSkeletonText loading states on all list pages.
- Invoice print: `window.print()` + print-only CSS.
- Responsive testing: 375px (mobile) and 1280px (desktop).
- CORS config in Spring Boot.

---

### Phase 6 — Pilot Deployment (7 days)

- **Backend:** Dockerfile + deploy to Railway.app or DigitalOcean.
- **Database:** Supabase free tier PostgreSQL.
- **Frontend:** `npm run build` → Netlify/Vercel free tier.
- **[NEW] docs/DEPLOYMENT.md** — step-by-step deployment guide.

---

## Verification Plan

### Automated Tests
```bash
# Backend
cd apps/api && ./gradlew test

# Frontend type-check
cd apps/app && npm run build
```

### Manual Verification (per phase)
| Phase | Verification |
|-------|-------------|
| 1 | App starts; `/api/v1/auth/login` returns 200 + JWT. |
| 2 | Seed data visible in DB; entity relations correct. |
| 3 | All endpoints pass Postman collection. |
| 4 | Full flow in browser: Login → Dashboard → New Order → Confirm → See task. |
| 5 | Works on 375px mobile. Invoice prints correctly. |
| 6 | Pilot shop owner completes an order in < 2 minutes. |

---

## Timeline Summary

| Phase | Duration | Cumulative Day |
|-------|----------|---------------|
| 1 — Setup | 3 days | 3 |
| 2 — Entities & Repos | 4 days | 7 |
| 3 — Backend APIs | 7 days | 14 |
| 4 — Frontend Pages | 10 days | 24 |
| 5 — Integration & Polish | 5 days | 29 |
| 6 — Pilot Deployment | 7 days | 36 |

---

## Related Files
- Original plan: [PLAN.md](file:///home/Divesh/projects/SilaaiSaaS/docs/PLAN.md)
- Governance: [AGENTS.md](file:///home/Divesh/projects/SilaaiSaaS/AGENTS/AGENTS.md)
- Build file: [build.gradle.kts](file:///home/Divesh/projects/SilaaiSaaS/apps/api/build.gradle.kts)
