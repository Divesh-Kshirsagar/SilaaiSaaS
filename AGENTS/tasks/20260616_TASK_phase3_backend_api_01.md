# Phase 3 Task Tracker — Backend REST APIs

> **File:** `20260616_TASK_phase3_backend_api_01.md`
> **Branch:** `agent/phase3-backend-api`
> **Started:** 2026-06-16

---

## Tasks

### Setup
- [x] Create branch `agent/phase3-backend-api`
- [x] Create this task file
- [ ] Create `JwtUtil` (token generation + validation)
- [ ] Create `JwtAuthenticationFilter`
- [ ] Replace SecurityConfig stub with full JWT security chain
- [ ] Create `GlobalExceptionHandler` (`@RestControllerAdvice`)

### Auth Module
- [ ] `AuthService` (login, loadUserByUsername)
- [ ] `AuthController` — `POST /api/v1/auth/login`

### Shop Module
- [ ] `ShopService`
- [ ] `ShopController` — `GET /api/v1/shop`

### Customer Module
- [ ] `CustomerService`
- [ ] `CustomerController` — GET list, POST, GET by id, PUT

### Measurement Module
- [ ] `MeasurementService`
- [ ] `MeasurementController` — GET list, POST, PUT

### Inventory Module
- [ ] `FabricService`
- [ ] `FabricController` — GET list, POST, PUT (adjust stock)

### Garment Catalog Module
- [ ] `GarmentCatalogService`
- [ ] `GarmentCatalogController` — GET list, POST

### Order Module (Core)
- [ ] `OrderService` (create, getById, updateStatus)
- [ ] `OrderService.confirmOrder()` — inventory deduction + task auto-creation
- [ ] `OrderController` — GET list, POST, GET by id, PUT, POST confirm, PUT status

### Task Module
- [ ] `TaskService`
- [ ] `TaskController` — GET list, POST complete

### Dashboard Module
- [ ] `DashboardService`
- [ ] `DashboardController` — GET /api/v1/dashboard/stats

### Finalization
- [ ] `CorsConfig` (allow frontend origins)
- [ ] Verify: `./gradlew compileJava` — BUILD SUCCESSFUL
- [ ] Smoke test: `bootRun` + `POST /api/v1/auth/login` returns JWT
- [ ] Commit all Phase 3 changes
