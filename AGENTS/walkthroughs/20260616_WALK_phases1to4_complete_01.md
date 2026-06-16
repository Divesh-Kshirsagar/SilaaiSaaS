# SilaaiSaaS — Developer Walkthrough (Phases 1–4)

> **File:** `20260616_WALK_phases1to4_complete_01.md`
> **Created:** 2026-06-16
> **Covers:** Phase 1 (Setup) → Phase 2 (Entities) → Phase 3 (Backend APIs) → Phase 4 (Frontend UI)

---

## Quick Summary — What Was Built

| Phase | What | Status |
|-------|------|--------|
| 1 | Project scaffolding — Spring Boot API, Ionic React app, PostgreSQL via Docker | ✅ Merged |
| 2 | JPA entities (10), repositories (10), enums (5), dev seed data | ✅ Merged |
| 3 | Full REST API — JWT auth, 11 endpoints, confirmOrder pipeline, Dashboard | ✅ Merged |
| 4 | Frontend UI — 9 pages, Zustand state, React Query hooks, Zod schemas, dark theme | ✅ On branch |

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Version | Check |
|------|---------|-------|
| Docker & Docker Compose | Any recent | `docker --version` |
| SDKMAN + JDK 21 | 21.0.11-tem | `sdk current java` |
| Node.js | ≥ 18 | `node --version` |
| npm | ≥ 9 | `npm --version` |

> **Important:** The Gradle build is hard-wired to the SDKMAN JDK via `apps/api/gradle.properties`.
> If your SDKMAN path differs from `/home/Divesh/.sdkman/candidates/java/21.0.11-tem`, update that file.

---

## Phase 1 — Project Setup

### What was created

```
SilaaiSaaS/
├── apps/
│   ├── api/                  ← Spring Boot 4.1 + Java 21
│   │   ├── build.gradle.kts  ← JWT, Security, Lombok, MapStruct, PostgreSQL
│   │   ├── gradle.properties ← org.gradle.java.home = SDKMAN JDK 21
│   │   └── src/main/resources/application.yml
│   └── app/                  ← Ionic React (TypeScript)
│       └── package.json      ← Zustand, Zod, React Query, Axios, Chart.js
├── docker-compose.yml        ← PostgreSQL 16 container
└── AGENTS/                   ← Agent governance files
```

### How to run Phase 1 verification

```bash
# 1. Start the database
docker compose up -d

# 2. Confirm DB is healthy
docker compose ps
# Expected: silaaisaas_db ... Up ... (healthy)

# 3. Verify backend compiles
cd apps/api
./gradlew compileJava
# Expected: BUILD SUCCESSFUL

# 4. Verify frontend installs
cd apps/app
npm install
npm run build
# Expected: ✓ built in ~20s
```

---

## Phase 2 — Core Entities & Repositories

### What was created

**Package structure** under `apps/api/src/main/java/com/silaaisaas/`:

```
com.silaaisaas/
├── api/           ApiApplication.java  ← @SpringBootApplication entry point
├── auth/          User.java, UserRepository.java
├── shop/          Shop.java, ShopRepository.java
├── customer/      Customer.java, Measurement.java + Repositories
├── order/         Order.java, OrderItem.java, GarmentCatalog.java + Repositories
├── inventory/     Fabric.java, InventoryTransaction.java + Repositories
├── task/          Task.java, TaskRepository.java
└── common/
    ├── config/    DataInitializer.java, SecurityConfig.java (stub)
    └── enums/     OrderStatus, TaskType, TaskStatus, UserRole, TransactionReason
```

### Dev seed data (runs automatically on startup with `SPRING_PROFILES_ACTIVE=dev`)

| Data | Value |
|------|-------|
| Shop | **Ramesh Tailors**, 123 MG Road, Bangalore |
| Owner login | Phone: `9999999999` / Password: `admin` |
| Tailor login | Phone: `8888888888` / Password: `tailor` |
| Fabrics | Blue Cotton (50m), White Linen (30m), Black Polyester (20m) |
| Garments | Men's Shirt (₹350), Kurta (₹500), Trousers (₹400) |

### How to run Phase 2 verification

```bash
cd apps/api
./gradlew compileJava
# Expected: BUILD SUCCESSFUL in ~3s
```

---

## Phase 3 — Backend REST APIs

### Starting the backend

```bash
# Terminal 1 — start DB (if not running)
docker compose up -d

# Terminal 2 — start API
cd apps/api
SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun
```

**Expected startup log:**
```
Started ApiApplication in 7s
Dev seed complete. Shop: 'Ramesh Tailors', Owner login: 9999999999 / admin
```

The API is now live at **`http://localhost:8080`**.

---

### Complete cURL flow — run in order

#### Step 1 — Login (get JWT)

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "9999999999", "password": "admin"}' \
  | jq -r .token)

echo "Token: $TOKEN"
```

**Expected response:**
```json
{
  "token": "eyJhbGci...",
  "userId": 1,
  "name": "Owner",
  "role": "OWNER"
}
```

> Save the token — all subsequent requests require it as `Authorization: Bearer <token>`.

---

#### Step 2 — Get shop info

```bash
curl -s http://localhost:8080/api/v1/shop \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:**
```json
{ "id": 1, "name": "Ramesh Tailors", "phone": "9876500000", "address": "123 MG Road, Bangalore" }
```

---

#### Step 3 — Create a customer

```bash
CUSTOMER=$(curl -s -X POST http://localhost:8080/api/v1/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Ravi Kumar", "phone": "9123456789"}')

CUSTOMER_ID=$(echo $CUSTOMER | jq -r .id)
echo "Customer ID: $CUSTOMER_ID"
```

---

#### Step 4 — Add measurements

```bash
MEASUREMENT=$(curl -s -X POST "http://localhost:8080/api/v1/customers/$CUSTOMER_ID/measurements" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"garmentType": "Shirt", "chest": 40.0, "waist": 34.0, "length": 29.0, "shoulder": 18.5, "sleeve": 25.0, "notes": "Slim fit preferred"}')

MEASUREMENT_ID=$(echo $MEASUREMENT | jq -r .id)
echo "Measurement ID: $MEASUREMENT_ID"
```

---

#### Step 5 — List fabrics and garments

```bash
# Get fabric ID
FABRIC_ID=$(curl -s http://localhost:8080/api/v1/fabrics \
  -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')

# Get garment ID
GARMENT_ID=$(curl -s http://localhost:8080/api/v1/garments \
  -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')

echo "Fabric: $FABRIC_ID, Garment: $GARMENT_ID"
```

---

#### Step 6 — Create a DRAFT order

```bash
ORDER=$(curl -s -X POST http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"customerId\": $CUSTOMER_ID,
    \"deliveryDate\": \"2026-07-15\",
    \"advancePaid\": 200.0,
    \"items\": [{
      \"garmentCatalogId\": $GARMENT_ID,
      \"quantity\": 1,
      \"fabricId\": $FABRIC_ID,
      \"measurementId\": $MEASUREMENT_ID
    }]
  }")

ORDER_ID=$(echo $ORDER | jq -r .id)
echo "Order ID: $ORDER_ID, Status: $(echo $ORDER | jq -r .status)"
# Expected status: DRAFT
```

---

#### Step 7 — Confirm the order (core flow)

```bash
curl -s -X POST "http://localhost:8080/api/v1/orders/$ORDER_ID/confirm" \
  -H "Authorization: Bearer $TOKEN" | jq '{id, orderNumber, status}'
```

**Expected:**
```json
{ "id": 1, "orderNumber": "ORD-0001", "status": "CONFIRMED" }
```

> **What happens internally:**
> 1. Validates sufficient fabric stock
> 2. Deducts fabric qty → creates `InventoryTransaction`
> 3. Sets order status → `CONFIRMED`
> 4. Auto-creates a `CUTTING` task assigned to the tailor

---

#### Step 8 — View auto-created task

```bash
curl -s http://localhost:8080/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, taskType, status, assignedTo: .assignedTo.name}'
```

**Expected:**
```json
{ "id": 1, "taskType": "CUTTING", "status": "PENDING", "assignedTo": "Suresh Tailor" }
```

---

#### Step 9 — Complete the task (triggers pipeline)

```bash
TASK_ID=1
curl -s -X POST "http://localhost:8080/api/v1/tasks/$TASK_ID/complete" \
  -H "Authorization: Bearer $TOKEN" | jq '{id, taskType, status}'
```

> **Pipeline chain:** CUTTING ✅ → STITCHING task created, order → `STITCHING`
> Complete STITCHING → FINISHING task created, order → `QUALITY_CHECK`
> Complete FINISHING → no more tasks, order → `READY`

---

#### Step 10 — Dashboard stats

```bash
curl -s http://localhost:8080/api/v1/dashboard/stats \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:**
```json
{
  "pendingOrders": 1,
  "todayDeliveries": 0,
  "lowStockCount": 0,
  "readyOrders": 0
}
```

---

## Phase 4 — Frontend UI

### Starting the frontend

```bash
# Terminal 1 — backend (if not running)
docker compose up -d
cd apps/api && SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun

# Terminal 2 — frontend
cd apps/app
npm run dev
```

The app opens at **`http://localhost:5173`** (or the port Vite reports).

---

### UI flow walkthrough

#### 1. Login

- Navigate to `http://localhost:5173`
- You'll be redirected to `/login` (ProtectedRoute guard)
- Enter: Phone **`9999999999`**, Password **`admin`**
- Click **Sign In** → JWT is stored in `localStorage` via Zustand
- Redirected to `/dashboard`

---

#### 2. Dashboard

- **4 stat cards:** Pending Orders, Today's Deliveries, Low Stock, Ready for Pickup
- **Quick actions grid:** Links to New Order, Tasks, Customers, Inventory
- Stats auto-refresh every 60 seconds

---

#### 3. Create a customer

- Click **Customers** in the side menu (or hamburger → Customers on mobile)
- Use the searchbar to find existing customers
- Click the **+** FAB button → modal opens
- Fill in name and phone → **Save Customer**

---

#### 4. New Order wizard (5 steps)

1. **Customer** — select from dropdown (all customers loaded)
2. **Garment** — choose type (Men's Shirt / Kurta / Trousers) + quantity
3. **Fabric** — pick from shop stock (low-stock items shown with ⚠️) or "Customer's own"
4. **Delivery & Payment** — date picker + advance amount
5. **Review** — summary card showing total, advance, balance due
   - Click **Place & Confirm Order** → creates + confirms the order in one click
   - On success → redirected to `/orders`

---

#### 5. Order detail

- Click any order from the list
- See: order number, status badge (color-coded), customer name, booking/delivery dates
- **Payment card:** total, advance paid, balance due (red if overdue delivery)
- DRAFT orders show a **"Confirm Order & Start Production"** button

---

#### 6. Tasks

- Side menu → **Tasks**
- **Pending** tasks listed with task type badge (CUTTING=yellow, STITCHING=purple, FINISHING=teal)
- Click **Done** → marks task complete → next task auto-created → order status advances

---

#### 7. Inventory

- Side menu → **Inventory**
- Red **Low Stock** banner appears if any fabric is below reorder level
- Each fabric shows available meters and **OK** / **Low Stock** badge

---

#### 8. Side menu (desktop vs mobile)

| Device | Behavior |
|--------|---------|
| Desktop (>= 768px) | Side menu always visible (`IonSplitPane`) |
| Mobile | Side menu hidden; use hamburger ☰ to open |

---

## Troubleshooting

### Backend won't start — "Could not find JDK"

```bash
# Check SDKMAN JDK
sdk current java
# Should show: 21.0.11-tem

# Verify path in gradle.properties
cat apps/api/gradle.properties
# Should contain: org.gradle.java.home=/home/<user>/.sdkman/candidates/java/21.0.11-tem
```

### DB connection refused

```bash
docker compose ps
# If postgres container is not running:
docker compose up -d
```

### Frontend shows blank / CORS error in browser console

```bash
# Ensure backend is running on port 8080
# Ensure apps/app/.env.local exists:
cat apps/app/.env.local
# Should show: VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### JWT expired / 401 on all requests

- Clear `localStorage` in browser DevTools → Application → Storage → `silaai-auth`
- Login again

---

## Repository State

```
main                ← Phases 1, 2, 3 merged here
agent/phase4-frontend ← Phase 4 (ready for merge)
```

### Full API Reference

See [`docs/API.md`](file:///home/Divesh/projects/SilaaiSaaS/docs/API.md) for all endpoints with live cURL test records.

---

*Walkthrough created by Antigravity AI Agent — 2026-06-16*
