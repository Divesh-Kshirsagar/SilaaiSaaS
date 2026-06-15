## 1. System Architecture Overview

The system follows a **client-server** model with a **responsive web app** (desktop/mobile browser) and a **RESTful API** backend. Data is stored in a relational database.

```
[Browser] → [Web Server (React/Vue)] → [API Gateway] → [Application Server] → [Database]
                                                             ↓
                                                    [Authentication Service]
```

All business logic (order booking, measurement management, inventory, workflow) lives in the application server. The database handles persistence.

---

## 2. Core Database Schema (Simplified)

Tables and key relationships:

| Table | Columns | Purpose |
|-------|---------|---------|
| `shops` | id, name, address, phone, owner_id, created_at | Multi-branch support; each shop has an owner (user). |
| `users` | id, name, role (owner/manager/tailor/assistant), shop_id, phone, password_hash | Role-based access control. |
| `customers` | id, name, phone, email, address, created_at, shop_id | Customer master data. |
| `measurements` | id, customer_id, garment_type (shirt/kurta/etc.), chest, waist, hip, length, shoulder, sleeve, notes, updated_at, approved_by | Each customer can have multiple measurement sets per garment type. Approval flag for changes. |
| `garment_catalog` | id, shop_id, name (e.g., "Men's Shirt"), base_price, default_fabric_consumption (meters) | Standard garment types with default pricing/material usage. |
| `fabrics` | id, shop_id, name (e.g., "Blue Cotton"), unit (meter), quantity_in_stock, reorder_level, cost_per_unit | Inventory items. |
| `orders` | id, order_number, customer_id, shop_id, created_by (user_id), booking_date, delivery_date, status (draft/confirmed/cutting/stitching/quality_check/ready/delivered), total_amount, advance_paid, balance_due | Core order tracking. |
| `order_items` | id, order_id, garment_catalog_id, quantity, price_per_item, fabric_id (optional, if from shop stock), fabric_quantity_used, measurement_id (snapshot) | Line items within an order. Uses a snapshot of measurements at booking time. |
| `inventory_transactions` | id, fabric_id, order_item_id (if deduction), quantity_change (+/-), reason (sale/purchase/waste), transaction_date | Audit trail for stock changes. |
| `tasks` | id, order_id, assigned_to (user_id), task_type (cutting/stitching/finishing), status (pending/in_progress/completed), due_date, completed_at | Workflow automation for stitching stages. |
| `payments` | id, order_id, amount, payment_method (cash/card/upi), date, recorded_by | Payment history. |

**Key Relationships:**
- `shops` 1---* `users`
- `shops` 1---* `customers`
- `customers` 1---* `measurements`
- `shops` 1---* `fabrics`
- `orders` 1---* `order_items`
- `order_items` 0..1---* `fabrics` (optional, if fabric from shop stock)
- `orders` 1---* `tasks`
- `orders` 1---* `payments`

---

## 3. High-Level Module Design

The system is divided into functional modules. Each module has its own API endpoints and UI screens.

### 3.1. Shop & User Management
- **APIs**: CRUD shops, invite users, assign roles.
- **UI**: Shop selection dropdown (for multi‑branch owners); user list with role badges; permission matrix (what each role can do).

### 3.2. Customer & Measurement Management
- **APIs**: Create/update customer; add/modify measurements (with approval workflow if role is not owner).
- **UI**: Customer search bar; customer profile page with tabs: Orders, Measurements, History.
  - Measurement form: labeled fields (chest, waist, etc.) with large input boxes; “Save as new version” button.
  - For measurement modifications: if a non‑owner edits, a “Request Approval” button appears; owner gets a notification badge.

### 3.3. Order Management (Booking & Tracking)
- **APIs**: Create order (with items, fabric selection, measurements); update order status; list orders with filters (date, status, customer).
- **UI**:
  - **New Order** wizard:
    1. Select customer (or add new).
    2. Add items (garment type, quantity, choose from saved measurements or enter new ones).
    3. Select fabric from shop inventory (or mark “customer fabric”).
    4. Set delivery date, advance amount.
    5. Review & confirm.
  - **Order List** table: shows order #, customer, status, delivery date, balance due. Color‑coded status badges.
  - **Order Detail** page: timeline of status changes, list of items, fabric used, tasks assigned, payment history. Buttons to update status (“Move to Cutting”, “Mark Ready”, etc.) based on user role.

### 3.4. Inventory Management
- **APIs**: Add/edit fabrics, adjust stock (purchase/return/waste), get low‑stock alerts.
- **UI**:
  - Inventory dashboard: list of fabrics with current stock, reorder level, and a “Stock Alert” flag.
  - “Add Stock” form: fabric name, unit, quantity, cost.
  - When an order is confirmed, the system automatically deducts fabric quantity (based on default consumption per garment) and creates an inventory transaction. If insufficient stock, the user is warned.

### 3.5. Workflow & Task Management
- **APIs**: Create tasks automatically when order status changes to “confirmed”; assign tasks to tailors; update task status.
- **UI**:
  - **Task Board** (Kanban style) for each shop: columns “Pending”, “In Progress”, “Completed”. Each card shows order #, garment, assigned tailor.
  - Tailor view (role‑restricted): only sees tasks assigned to them; can click “Start” and “Complete”.
  - Owner/manager view: can reassign tasks, see estimated vs. actual completion time.

### 3.6. Billing & Payments
- **APIs**: Generate invoice (PDF); record payments; calculate balance.
- **UI**:
  - On order detail page: a “Billing” section showing total, advance, balance due.
  - “Record Payment” button: opens modal with amount, method, date.
  - “Print Invoice” button: generates a printable invoice with shop logo, customer details, itemised charges, taxes (if any), and payment summary.

### 3.7. Reporting & Dashboard
- **APIs**: Aggregated data for orders, revenue, stock usage, task completion times.
- **UI**:
  - Owner dashboard: cards for today’s deliveries, pending orders, low stock count, revenue this month.
  - Charts (simple bar/line) for order volume over time.
  - “Export” button to download CSV reports.

---

## 4. Frontend UI Mock (Text Description)

### Login Screen
- Fields: Shop ID (optional for multi‑shop), Phone/Email, Password.
- “Remember me” checkbox.

### Main Navigation (for Owner)
Bottom bar or sidebar (mobile/desktop responsive):
- **Dashboard** (home icon)
- **Orders** (list icon)
- **Customers** (people icon)
- **Inventory** (box icon)
- **Tasks** (checklist icon)
- **Reports** (chart icon)
- **Shop Settings** (gear icon)

### Order List Screen (Example layout)
```
[ + New Order ]  [Search by customer/order#]  [Filter: All | Pending | Cutting | Ready ]

| Order # | Customer   | Items        | Delivery  | Status       | Balance  |
|---------|------------|--------------|-----------|--------------|----------|
| 101     | Ramesh     | 2 shirts     | 05 Mar    | Cutting      | ₹400     |
| 102     | Sita       | 1 saree blouse | 07 Mar  | Ready        | ₹0       |
```
Clicking any row opens Order Detail.

### Order Detail Screen (Owner view)
```
Order #101  |  Customer: Ramesh  |  Booking: 28 Feb

[Status: Cutting]  [Update Status → dropdown]

Items:
- 2x Men's Shirt (Blue Cotton, fabric from shop)
  Measurements: Chest 40, Waist 32, Length 28

Tasks:
- Cutting → assigned to Suresh → Completed
- Stitching → assigned to Raj → In Progress

Payments:
- Advance: ₹200 (Cash)
- Balance due: ₹400

[Record Payment]  [Print Invoice]  [Add Task]
```

### Measurement Screen (Customer profile)
```
Customer: Ramesh (Phone: 9876543210)

Saved Measurements (Shirt):
Version 1 (28 Feb 2025) – Chest 40, Waist 32
Version 2 (02 Mar 2025, pending approval) – Chest 41, Waist 33 [Approve] [Reject]

[Add New Measurement]
[Use for New Order]
```

---

## 5. Core Workflows (Management & Tracking)

### Order Tracking Lifecycle
1. **Draft** – order created but not confirmed.
2. **Confirmed** – after payment/fabric check; triggers:
   - Deduct inventory
   - Generate tasks (Cutting → Stitching → Quality Check → Ready)
3. **Cutting** – task assigned to tailor.
4. **Stitching** – next task.
5. **Quality Check** – optional step.
6. **Ready** – order marked ready for delivery.
7. **Delivered** – final status; balance payment recorded.

Each status change is logged with timestamp and user ID.

### Inventory Tracking
- When order confirmed: system calculates `fabric_quantity_used = sum(garment_quantity * default_consumption)`. Deducts from `fabrics.quantity_in_stock`.
- If fabric is customer‑provided, no deduction.
- Low‑stock detection: after any deduction, check if `quantity_in_stock <= reorder_level`. If yes, create a system alert (visible on dashboard).

### Measurement Modification Approval Workflow
- Only owner/admin can directly modify measurements.
- Tailor/assistant can propose changes – those are stored in a separate `measurement_pending_changes` table (or a flag on measurement record).
- Owner sees a notification: “Ramesh’s shirt measurement changed – pending approval”. Owner clicks “Approve” (overwrites active version) or “Reject”.

---

## 6. Security & Roles (Simplified)

| Role | Can do |
|------|--------|
| Owner | Full access: CRUD shops, users, inventory, orders, approve measurements, view all reports. |
| Manager | Same as owner except cannot delete shop or add/remove users. |
| Tailor | View assigned tasks, update task status, view order measurements (read‑only). Cannot modify billing or inventory. |
| Assistant | Create orders for customers, add/edit measurements (pending approval), record payments, view inventory but not modify. |

Authentication: JWT tokens. Password hashing with bcrypt.

---

## 7. Technology Stack (Suggested)

- **Backend**: Node.js + Express (or Python Django) – REST API.
- **Database**: PostgreSQL (for relational integrity and transactions).
- **Frontend**: React (with React Router, Tailwind CSS for mobile‑first UI).
- **State management**: Redux Toolkit or React Context.
- **Hosting**: Cloud (AWS EC2 or DigitalOcean) + S3 for invoice PDFs.
- **Offline capability** (optional): Service workers + IndexedDB for basic order creation when internet is spotty.

---

## 8. High-Level Diagram (Text)

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Dashboard│  │ Orders   │  │ Customers│  │ Inventory│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS / JSON
┌───────────────────────────▼─────────────────────────────────┐
│                     API Gateway (Express)                    │
│  • Authentication middleware                                │
│  • Role-based access control                                │
└───────────┬─────────────────────────────┬───────────────────┘
            │                             │
┌───────────▼───────────┐     ┌───────────▼───────────┐
│   Application Server  │     │   File Storage (PDFs) │
│   Business logic:     │     └───────────────────────┘
│   • Order service     │
│   • Inventory service │
│   • Task service      │
│   • Billing service   │
└───────────┬───────────┘
            │ SQL
┌───────────▼───────────┐
│     PostgreSQL DB     │
│   (tables above)      │
└───────────────────────┘
```


---
# After Introducing some changes in plan 15-06-2026
Here’s a **revamped MVP plan** for **SilaiSaaS** based on your new stack: **Ionic React** (frontend) + **Spring Boot** (backend) with heavy boilerplate reduction. The goal is to build a **lean, testable web app** that validates the core idea with real cloth shop owners before adding WhatsApp or voice features.

---

## 1. Revised Philosophy: Web-First MVP

Since you’re skipping WhatsApp integrations for now, the MVP will be a **responsive web app** that works on mobile browsers (no app store submission needed). This lets you:

- Test the core workflow (order booking, measurement storage, inventory tracking) quickly.
- Iterate based on feedback from 5–10 pilot shops.
- Later wrap the same Ionic React codebase into a mobile app if needed.

**Key assumption:** The shop owner or a younger assistant will use the web app on a smartphone. The elderly tailor only needs to view tasks (if at all) – but task assignment can be a Phase 2 feature.

---

## 2. Tech Stack Summary (Boilerplate-Free)

| Layer | Technology | Why (Minimal Boilerplate) |
|-------|------------|----------------------------|
| **Frontend** | Ionic React (with Capacitor for future mobile) | Pre-built UI components (forms, modals, lists) – no CSS from scratch. |
| **State Management** | Zustand + zod| Simpler than Redux. |
| **HTTP Client** | Axios (or native fetch) | Standard. |
| **Backend** | Spring Boot 3 + Java 17 | Robust, fast to develop. |
| **ORM** | Spring Data JPA (Hibernate) | Auto-implemented repositories. |
| **Boilerplate Removal** | Lombok (`@Data`, `@Builder`), Java Records (DTOs), MapStruct (entity↔DTO mapping) | Drastically reduces code. |
| **Validation** | Spring Boot Validation (`@NotNull`, `@Size`) on Records | No manual if-checks. |
| **Auth** | JWT (with Spring Security) | Stateless, role-based. |
| **Database** | PostgreSQL (or H2 for local dev) | Relational, transactional. |
| **Migration** | Flyway (or just `ddl-auto=update` for MVP) | Simple schema versioning. |

---

## 3. Core Features for MVP (Slimmed Down)

To launch fast, focus on **one shop, two roles (owner + tailor)**, no multi-branch initially.

| Feature | MVP Scope | Why |
|---------|-----------|-----|
| **Shop & User** | Single shop, owner (admin) + up to 5 tailors (read‑only task view) | Validate workflow before scaling. |
| **Customer Management** | Add/edit customer, view list | Essential for orders. |
| **Measurement Management** | Store measurements per customer & garment type (shirt/kurta/trousers). No approval workflow yet – owner edits directly. | Core value. |
| **Order Booking** | Create order with customer, garment, quantity, fabric selection (from inventory or “customer fabric”), delivery date, advance payment. Status: `DRAFT → CONFIRMED → CUTTING → STITCHING → READY → DELIVERED`. | Main loop. |
| **Inventory Tracking** | Fabric stock (name, quantity, reorder level). Auto-deduct when order confirmed. Low‑stock alert on dashboard. | Solves fabric waste. |
| **Task Assignment (Simplified)** | When order status becomes `CONFIRMED`, system creates a `CUTTING` task assigned to a tailor. Tailor can mark task `COMPLETED`. Next task `STITCHING` created automatically. No Kanban board – just a task list. | Show workflow value. |
| **Billing (Basic)** | Auto-calculate total based on garment base price. Record advance and balance. No tax or discount inputs for MVP. Print invoice (browser print). | Enough for testing. |
| **Dashboard** | Cards: pending orders, low stock, today’s deliveries. Simple bar chart of orders per week (Chart.js). | Quick insights. |

**Features postponed after MVP:**
- Multi-branch, role-based approvals, detailed reports, WhatsApp notifications, voice input, payment gateway.

---

## 4. Database Schema (Simplified)

Tables (only essential columns shown):

```sql
shop (id, name, phone, address) – single row for MVP
users (id, shop_id, name, role [OWNER/TAILOR], phone, password_hash)

customers (id, shop_id, name, phone)

measurements (id, customer_id, garment_type, chest, waist, hip, length, shoulder, sleeve, updated_at)

garment_catalog (id, shop_id, name, base_price, default_fabric_consumption_meters)

fabrics (id, shop_id, name, quantity_available, reorder_level)

orders (id, order_number, customer_id, booking_date, delivery_date, status, total_amount, advance_paid, created_by_user_id)

order_items (id, order_id, garment_catalog_id, quantity, fabric_id (nullable), fabric_quantity_used, price_per_item)

inventory_transactions (id, fabric_id, order_item_id (nullable), quantity_change, reason, transaction_date)

tasks (id, order_id, assigned_to_user_id, task_type [CUTTING/STITCHING], status [PENDING/COMPLETED], due_date)
```

**Relationships:** Shorter than original, no separate payment table (store advance in orders). For MVP, payments are just advance + balance; full payment history later.

---

## 5. Module Breakdown (API + UI)

### 5.1. Backend – REST API Endpoints (Spring Boot)

All endpoints prefixed `/api/v1`. JWT required except `/auth/login`.

| Module | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| Auth | `/auth/login` | POST | returns JWT |
| Shop | `/shop` | GET | current shop details |
| Customers | `/customers` | GET, POST | list, create |
| | `/customers/{id}` | GET, PUT, DELETE | |
| Measurements | `/customers/{customerId}/measurements` | GET, POST | |
| | `/measurements/{id}` | PUT | |
| Garments | `/garments` | GET | list of available garment types |
| Fabrics | `/fabrics` | GET, POST | list, add |
| | `/fabrics/{id}` | PUT (adjust stock) | |
| Orders | `/orders` | GET (with filters), POST | |
| | `/orders/{id}` | GET, PUT (update status) | |
| | `/orders/{id}/items` | POST | add item |
| | `/orders/{id}/confirm` | POST | confirms order → deduct inventory → create tasks |
| Tasks | `/tasks` | GET (filter by assigned user) | |
| | `/tasks/{id}/complete` | POST | mark task done → update order status if last task |
| Reports | `/dashboard/stats` | GET | counts, low stock, weekly orders |

**No boilerplate examples:**
```java
// Entity with Lombok
@Entity @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Order {
    @Id @GeneratedValue private Long id;
    private String orderNumber;
    @ManyToOne private Customer customer;
    @Enumerated(EnumType.STRING) private OrderStatus status;
    // ...
}

// Repository – no implementation needed
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByShopIdAndStatus(Long shopId, OrderStatus status);
}

// DTO as Java Record
public record OrderRequest(Long customerId, LocalDate deliveryDate, Long advancePaid) {}

// Controller with validation
@PostMapping
public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
    // ...
}
```

### 5.2. Frontend – Ionic React Pages

| Page | Route | Components |
|------|-------|-------------|
| Login | `/login` | IonInput (phone, password), IonButton |
| Dashboard | `/dashboard` | IonCard (stats), IonChart (simple bar), IonList (pending orders) |
| Customers | `/customers` | IonSearchbar, IonList of customers, IonFabButton to add |
| Customer Detail | `/customer/:id` | IonTabs (Info, Measurements, Orders) |
| New Order | `/order/new` | Stepper: select customer → add items (garment, fabric, quantity) → set delivery date → review |
| Order List | `/orders` | IonSegment (status filter), IonList with order cards |
| Order Detail | `/order/:id` | IonCard for details, timeline (status badges), task list, button to update status (if owner) |
| Inventory | `/inventory` | IonList of fabrics, IonItemSliding for edit stock, low stock warning |
| Tasks (Tailor view) | `/tasks` | IonList of assigned tasks, IonButton “Mark Complete” |

**State management:** Use React Context for auth + shop info. For orders/customers, fetch on each page (or use React Query for caching). Keep it simple for MVP.

---

## 6. Boilerplate Reduction Checklist (Spring Boot)

- [ ] Use **Spring Initializr** with dependencies: Web, Data JPA, PostgreSQL, Lombok, Validation, Security.
- [ ] Enable **Lombok** in IDE (annotation processing).
- [ ] Write **entities** with `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`.
- [ ] Write **repositories** as interfaces extending `JpaRepository`.
- [ ] Write **DTOs** as Java Records.
- [ ] Use **MapStruct** to convert Entity ↔ Record (add dependency, create mapper interface with `@Mapper`).
- [ ] Use **Spring Security** with JWT – you can copy a standard `JwtAuthenticationFilter` from a tutorial (no need to reinvent).
- [ ] Use **`spring.jpa.hibernate.ddl-auto=update`** for MVP (disable in production later).
- [ ] Write **service classes** with `@Service` and `@Transactional` – Lombok’s `@RequiredArgsConstructor` to inject repositories.

**Expected lines of code:** Backend ~500–700 lines (excluding generated boilerplate). Frontend ~800–1000 lines of TSX.

---

## 7. Development Phases (4–6 weeks)

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **1. Setup** | 3 days | Spring Boot project, Ionic React project, PostgreSQL (local/Docker), JWT auth working. |
| **2. Core Entities & Repositories** | 4 days | Create all tables, Lombok entities, repositories, simple seed data. |
| **3. Backend APIs** | 7 days | Implement all endpoints (customers, measurements, orders, inventory). Test with Postman. |
| **4. Frontend Pages** | 10 days | Build all Ionic pages (login, dashboard, customers, order flow, tasks). Connect to APIs. |
| **5. Integration & Polish** | 5 days | Error handling, loading states, basic responsive design, print invoice. |
| **6. Pilot with 2 shops** | 7 days | Deploy on a cheap VPS (DigitalOcean $6/mo). Onboard 2 cloth shop owners. Collect feedback. |

---

## 8. Deployment for MVP

- **Backend:** Run as JAR on a small VPS (or use Railway.app / Render for simpler deployment). Use PostgreSQL on same VPS or managed (Supabase free tier).
- **Frontend:** Build Ionic React (`npm run build`) and serve static files via Nginx or Vercel/Netlify (free).
- **Domain:** Use a free `.tk` or buy a cheap `.in` domain.

**Cost:** ~$10/month for VPS + free tiers.

---

## 9. Success Metrics for MVP Validation

After pilot, measure:
- Can a shop owner book an order in under 2 minutes?
- Does the automatic inventory deduction reduce fabric wastage (ask owner)?
- Do tailors use the task list without confusion?
- Would they pay ₹500/month for it?

---

## 10. Next Steps (Immediate Actions)

1. Clone the [Ionic React starter](https://ionicframework.com/docs/react/your-first-app) and [Spring Boot Initializr](https://start.spring.io/).
2. Define the database schema as SQL script (use Flyway or just run manually).
3. Build the `OrderService.confirmOrder()` method – most complex logic (deduct inventory, create tasks).
4. Create the Ionic “New Order” wizard – test with mock data first.

This revamped plan keeps the MVP **lean, testable, and aligned with your stack**, while preserving the ability to add WhatsApp and multi-branch later.

