# SilaaiSaaS — Revised Implementation Plan (v2)

> **File:** `20260615_PLAN_project_overview_02.md`
> **Created:** 2026-06-15 (rev 2, supersedes `_01`)
> **Status:** Awaiting User Approval

---

## What Changed from v1

| Item | v1 | v2 (This Plan) |
|------|----|----------------|
| State management | React Context + useReducer | **Zustand + Zod** |
| Local DB | Unspecified | **Docker Compose (PostgreSQL)** |
| Schema migration | `ddl-auto=update` (ask) | `ddl-auto=update` + **TODO comment for production** |
| Ionic scaffold | Cancelled (`Ctrl+C`) | **Re-run `ionic start`** (Phase 1) |
| Phase 6 (Pilot) | Included | **Deferred — not in scope now** |

---

## Background

SilaaiSaaS is a **mobile-first, web-first SaaS** for Indian tailoring shops (B2B, ~1.2 crore tailors addressable). The MVP validates:

- Order booking (DRAFT → DELIVERED lifecycle)
- Customer measurement storage per garment type
- Fabric inventory auto-deduction on order confirm
- Basic task assignment (cutting → stitching pipeline)
- Billing + browser-print invoice

**Market context** (from `MARKET_REPORT.md`): ₹60B apparel market, custom segment growing at ~10% CAGR. Core pain points: lost measurements, manual billing, no inventory control. Winning features: Order Management, Measurement Tracking, Billing/Invoicing.

---

## Tech Stack (Confirmed)

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | Ionic React + Capacitor (TypeScript) | Pre-built mobile-first UI components |
| **State — Global** | **Zustand** | Auth store, shop store (no Redux overhead) |
| **State — Server** | **React Query** | Caching, loading/error states per page |
| **Validation** | **Zod** | Schema validation for API responses + form inputs |
| **HTTP** | Axios | JWT interceptor, base URL from env |
| **Backend** | Spring Boot **4.1** + Java **21** | Lombok, Records, JPA |
| **ORM** | Spring Data JPA (Hibernate) | Auto-implemented repositories |
| **Auth** | JWT (Spring Security) | Stateless, role-based |
| **Database** | PostgreSQL | via Docker locally; managed cloud for production |
| **Local Dev DB** | **Docker Compose** | `docker-compose.yml` in repo root |
| **Schema** | `ddl-auto=update` | ⚠️ TODO: replace with Flyway before production |

---

## Phase 1 — Project Setup (3 days)

### 1.1 Fix Backend Build (`apps/api/`)

#### [MODIFY] [build.gradle.kts](file:///home/Divesh/projects/SilaaiSaaS/apps/api/build.gradle.kts)

**Remove** (invalid starters that don't exist):
```kotlin
testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
```

**Add** (missing required dependencies):
```kotlin
// Security + Validation
implementation("org.springframework.boot:spring-boot-starter-security")
implementation("org.springframework.boot:spring-boot-starter-validation")

// JWT
implementation("io.jsonwebtoken:jjwt-api:0.12.6")
runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")

// MapStruct (entity ↔ DTO)
implementation("org.mapstruct:mapstruct:1.6.3")
annotationProcessor("org.mapstruct:mapstruct-processor:1.6.3")

// Test (correct starter)
testImplementation("org.springframework.boot:spring-boot-starter-test")
testImplementation("org.springframework.security:spring-security-test")
```

### 1.2 Scaffold Ionic Frontend (`apps/app/`)

Run inside `apps/app/` (currently empty):
```bash
ionic start silaai-app tabs --type=react --capacitor --no-git
```

Then update `capacitor.config.ts`:
```ts
const config: CapacitorConfig = {
  appId: 'com.silaaisaas.app',
  appName: 'SilaaiSaaS',
  webDir: 'dist',
};
```

Install Zustand, Zod, React Query, Axios, Chart.js:
```bash
npm install zustand zod @tanstack/react-query axios chart.js react-chartjs-2
```

Strip the default tabs template; replace with custom routing (see Phase 4).

### 1.3 Docker Compose for Local DB

#### [NEW] `docker-compose.yml` (repo root)
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: silaaisaas
      POSTGRES_USER: silaai
      POSTGRES_PASSWORD: silaai_dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Start with: `docker compose up -d`

### 1.4 Backend Config

#### [NEW] `apps/api/src/main/resources/application.yml`
```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/silaaisaas}
    username: ${DB_USERNAME:silaai}
    password: ${DB_PASSWORD:silaai_dev}
  jpa:
    hibernate:
      # TODO: Replace with Flyway before production deployment
      ddl-auto: update
    show-sql: false
    properties:
      hibernate.format_sql: true

app:
  jwt:
    secret: ${JWT_SECRET:dev-secret-key-change-in-production-min-32-chars}
    expiry-ms: ${JWT_EXPIRY_MS:86400000}  # 24h
```

#### [NEW] `apps/api/.env.example`
```
DB_URL=jdbc:postgresql://localhost:5432/silaaisaas
DB_USERNAME=silaai
DB_PASSWORD=silaai_dev
JWT_SECRET=replace-with-32-char-minimum-secret
JWT_EXPIRY_MS=86400000
```

#### [NEW] `apps/app/.env.example`
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## Phase 2 — Core Entities & Repositories (4 days)

All under `apps/api/src/main/java/com/silaaisaas/`.

### Package Structure
```
com.silaaisaas/
├── SilaaiSaasApplication.java
├── common/          ← shared config, exceptions, base classes
├── auth/            ← User entity, JWT filter, SecurityConfig
├── shop/            ← Shop entity + controller
├── customer/        ← Customer, Measurement entities
├── order/           ← Order, OrderItem, GarmentCatalog entities
├── inventory/       ← Fabric, InventoryTransaction entities
└── task/            ← Task entity
```

### Entities (all with `@Entity @Data @Builder @NoArgsConstructor @AllArgsConstructor`)

| Entity | Key Fields | Package |
|--------|-----------|---------|
| `Shop` | id, name, phone, address | `shop/` |
| `User` | id, shop, name, role (enum), phone, passwordHash | `auth/` |
| `Customer` | id, shop, name, phone | `customer/` |
| `Measurement` | id, customer, garmentType, chest, waist, hip, length, shoulder, sleeve, updatedAt | `customer/` |
| `GarmentCatalog` | id, shop, name, basePrice, defaultFabricConsumptionMeters | `order/` |
| `Fabric` | id, shop, name, quantityAvailable, reorderLevel | `inventory/` |
| `Order` | id, orderNumber, customer, bookingDate, deliveryDate, status, totalAmount, advancePaid, createdBy | `order/` |
| `OrderItem` | id, order, garmentCatalog, quantity, fabric (nullable), fabricQuantityUsed, pricePerItem | `order/` |
| `InventoryTransaction` | id, fabric, orderItem (nullable), quantityChange, reason, transactionDate | `inventory/` |
| `Task` | id, order, assignedTo, taskType, status, dueDate | `task/` |

### Enums (in `common/enums/`)
- `OrderStatus`: `DRAFT, CONFIRMED, CUTTING, STITCHING, QUALITY_CHECK, READY, DELIVERED`
- `TaskType`: `CUTTING, STITCHING, FINISHING`
- `TaskStatus`: `PENDING, IN_PROGRESS, COMPLETED`
- `UserRole`: `OWNER, MANAGER, TAILOR, ASSISTANT`
- `TransactionReason`: `SALE, PURCHASE, WASTE`

### Repositories (JpaRepository interfaces only)
One per entity. Custom finders as needed:
```java
List<Order> findByShopIdAndStatus(Long shopId, OrderStatus status);
List<Task> findByAssignedToId(Long userId);
```

### Dev Seed Data
`DataInitializer.java` (runs only when `spring.profiles.active=dev`):
- 1 shop, 1 owner user (phone: `9999999999`, password: `admin`), 3 fabrics, 2 garment types.

---

## Phase 3 — Backend APIs (7 days)

All endpoints under `/api/v1/`. JWT required except `/auth/login`.

### 3.1 Auth Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | None | Returns JWT token |

Response:
```json
{ "token": "eyJ...", "user": { "id": 1, "name": "Owner", "role": "OWNER" } }
```

Files:
- `SecurityConfig.java` — stateless, permitAll on `/auth/**`
- `JwtAuthenticationFilter.java` — extracts + validates JWT from `Authorization: Bearer`
- `AuthController.java`, `AuthService.java`

### 3.2 Shop Module
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/shop` | Current shop details |

### 3.3 Customer Module
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | List, paginated, `?search=name_or_phone` |
| POST | `/customers` | Create |
| GET | `/customers/{id}` | With measurements + recent orders |
| PUT | `/customers/{id}` | Update |
| GET | `/customers/{id}/measurements` | All measurement records |
| POST | `/customers/{id}/measurements` | Add new measurement set |
| PUT | `/measurements/{id}` | Update (OWNER/MANAGER only) |

### 3.4 Inventory Module
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fabrics` | List with `lowStock: boolean` flag |
| POST | `/fabrics` | Add fabric |
| PUT | `/fabrics/{id}` | Adjust stock quantity |

### 3.5 Order Module
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Filters: `status`, `customerId`, `dateFrom`, `dateTo` |
| POST | `/orders` | Create DRAFT order with items |
| GET | `/orders/{id}` | Full detail: items, tasks |
| PUT | `/orders/{id}` | Update delivery date / advance |
| POST | `/orders/{id}/confirm` | **Core**: validate stock → deduct → create tasks → set CONFIRMED |
| PUT | `/orders/{id}/status` | Move to next status (owner/manager) |

`confirmOrder()` logic:
1. Check each `OrderItem.fabric.quantityAvailable >= fabricQuantityUsed`.
2. Deduct stock, create `InventoryTransaction` per item.
3. Check if `quantityAvailable <= reorderLevel` → set low-stock alert.
4. Create `Task(CUTTING, PENDING)` assigned to a tailor (first available or specified).
5. Set `Order.status = CONFIRMED`.

### 3.6 Task Module
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | `?assignedTo=me` for tailor, all for owner |
| POST | `/tasks/{id}/complete` | Mark done → auto-create next task → update order status |

Task chain: `CUTTING → STITCHING → FINISHING → READY (order status)`

### 3.7 Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Pending count, today deliveries, low-stock count, weekly orders chart data |

### 3.8 Garment Catalog
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/garments` | List available garment types |
| POST | `/garments` | Add garment type (owner only) |

---

## Phase 4 — Frontend Pages (10 days)

All under `apps/app/src/`.

### Folder Structure
```
src/
├── pages/           ← Route-level page components
├── components/      ← Reusable UI components
├── stores/          ← Zustand stores
├── hooks/           ← React Query hooks
├── lib/             ← api.ts (Axios), queryClient.ts
├── schemas/         ← Zod schemas (API response + form validation)
├── constants/       ← Typed enums
└── App.tsx          ← Routes
```

### Zustand Stores (`stores/`)

#### `authStore.ts`
```ts
interface AuthState {
  token: string | null;
  user: { id: number; name: string; role: UserRole } | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}
```

#### `shopStore.ts`
```ts
interface ShopState {
  shop: Shop | null;
  setShop: (shop: Shop) => void;
}
```

### Zod Schemas (`schemas/`)

Key schemas mirroring API responses:
```ts
export const CustomerSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string(),
});

export const OrderSchema = z.object({
  id: z.number(),
  orderNumber: z.string(),
  status: z.enum(['DRAFT','CONFIRMED','CUTTING','STITCHING','QUALITY_CHECK','READY','DELIVERED']),
  deliveryDate: z.string(),
  totalAmount: z.number(),
  advancePaid: z.number(),
});
```

### Pages

| Page | Route | Key Components |
|------|-------|----------------|
| `LoginPage.tsx` | `/login` | IonInput (phone, password), IonButton; writes to `authStore` |
| `DashboardPage.tsx` | `/dashboard` | 3 IonCard stats, Bar chart (Chart.js + react-chartjs-2) |
| `CustomersPage.tsx` | `/customers` | IonSearchbar, IonList, IonFabButton → add new |
| `CustomerDetailPage.tsx` | `/customers/:id` | IonTabs: Info / Measurements / Orders |
| `OrderListPage.tsx` | `/orders` | IonSegment (status filter), IonList with status badges |
| `NewOrderPage.tsx` | `/orders/new` | 5-step IonSlides wizard |
| `OrderDetailPage.tsx` | `/orders/:id` | Timeline, items, tasks, Record Payment, Print Invoice |
| `InventoryPage.tsx` | `/inventory` | IonList + IonItemSliding, low-stock banners |
| `TasksPage.tsx` | `/tasks` | Tailor: own tasks only; IonButton "Mark Complete" |

### New Order Wizard Steps (5 steps)
1. **Select customer** — search/create
2. **Add items** — garment type, quantity, measurements (saved or new)
3. **Select fabric** — from shop stock (auto-calculates consumption) or "Customer Fabric"
4. **Delivery & advance** — date picker, advance amount input
5. **Review & confirm** — summary card, "Place Order" → POST `/orders/{id}/confirm`

### React Query Hooks (`hooks/`)
- `useOrders(filters)` — GET `/orders`
- `useOrder(id)` — GET `/orders/:id`
- `useCustomers(search)` — GET `/customers`
- `useCustomer(id)` — GET `/customers/:id`
- `useFabrics()` — GET `/fabrics`
- `useTasks()` — GET `/tasks`
- `useDashboard()` — GET `/dashboard/stats`

All hooks validate responses with Zod schemas before returning.

---

## Phase 5 — Integration & Polish (5 days)

- **Error handling:** Global Axios response interceptor → `IonToast` for 4xx/5xx.
- **Loading states:** `IonSkeletonText` on all list pages (while React Query is loading).
- **Invoice print:** `window.print()` with `@media print` CSS (hide nav, show invoice only).
- **Responsive:** Test at 375px (mobile), 768px (tablet), 1280px (desktop).
- **CORS:** Spring Boot `CorsConfig.java` allowing `http://localhost:5173` in dev.
- **Auth guard:** React Router `ProtectedRoute` component wrapping all non-login routes.
- **Role guard:** Disable/hide owner-only buttons based on `authStore.user.role`.

---

## ~~Phase 6 — Pilot Deployment~~ *(Deferred)*

Deployment is out of scope for the current build. Will be planned separately when MVP is feature-complete.

---

## Verification Plan

### Automated Tests
```bash
# Backend unit + integration tests
cd apps/api && ./gradlew test

# Frontend type-check + build
cd apps/app && npm run build
```

### Manual Flow Verification
| Step | Expected Result |
|------|----------------|
| `docker compose up -d` | PostgreSQL running on port 5432 |
| `./gradlew bootRun` | API starts, seeds dev data |
| `POST /api/v1/auth/login` | Returns JWT |
| Login in browser | Redirects to dashboard |
| Create customer → add measurement | Saved, visible in profile |
| New Order wizard → confirm | Inventory deducted, task created |
| Tailor logs in → sees task → marks complete | Order status advances |
| Print invoice | Browser print dialog opens |

---

## Timeline (5 Phases)

| Phase | Duration | End Day |
|-------|----------|---------|
| 1 — Setup | 3 days | Day 3 |
| 2 — Entities & Repos | 4 days | Day 7 |
| 3 — Backend APIs | 7 days | Day 14 |
| 4 — Frontend Pages | 10 days | Day 24 |
| 5 — Integration & Polish | 5 days | Day 29 |

---

## Related Files
- Original plan: [PLAN.md](file:///home/Divesh/projects/SilaaiSaaS/docs/PLAN.md)
- Market research: [MARKET_REPORT.md](file:///home/Divesh/projects/SilaaiSaaS/docs/MARKET_REPORT.md)
- Governance: [AGENTS.md](file:///home/Divesh/projects/SilaaiSaaS/AGENTS/AGENTS.md)
- Build file: [build.gradle.kts](file:///home/Divesh/projects/SilaaiSaaS/apps/api/build.gradle.kts)
- Supersedes: [20260615_PLAN_project_overview_01.md](file:///home/Divesh/projects/SilaaiSaaS/AGENTS/plans/20260615_PLAN_project_overview_01.md)
