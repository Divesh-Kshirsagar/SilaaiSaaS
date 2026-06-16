# Phase 3 Task Tracker — Backend REST APIs

> **File:** `20260616_TASK_phase3_backend_api_01.md`
> **Branch:** `agent/phase3-backend-api`
> **Started:** 2026-06-16

---

## Tasks

### Setup
- [x] Create branch `agent/phase3-backend-api`
- [x] Create this task file
- [x] Create `JwtUtil` (token generation + validation)
- [x] Create `JwtAuthenticationFilter`
- [x] Replace SecurityConfig stub with full JWT security chain
- [x] Create `GlobalExceptionHandler` (`@RestControllerAdvice`)

### Auth Module
- [x] `AuthService` (login, loadUserByUsername)
- [x] `AuthController` — `POST /api/v1/auth/login`

### Shop Module
- [x] `ShopService`
- [x] `ShopController` — `GET /api/v1/shop`

### Customer Module
- [x] `CustomerService`
- [x] `CustomerController` — GET list, POST, GET by id, PUT

### Measurement Module
- [x] `MeasurementService`
- [x] `MeasurementController` — GET list, POST, PUT

### Inventory Module
- [x] `FabricService`
- [x] `FabricController` — GET list, POST, PUT (adjust stock)

### Garment Catalog Module
- [x] `GarmentCatalogService`
- [x] `GarmentCatalogController` — GET list, POST

### Order Module (Core)
- [x] `OrderService` (create, getById, updateStatus)
- [x] `OrderService.confirmOrder()` — inventory deduction + task auto-creation
- [x] `OrderController` — GET list, POST, GET by id, PUT, POST confirm, PUT status

### Task Module
- [x] `TaskService`
- [x] `TaskController` — GET list, POST complete

### Dashboard Module
- [x] `DashboardService`
- [x] `DashboardController` — GET /api/v1/dashboard/stats

### Finalization
- [x] `CorsConfig` (inline in SecurityConfig)
- [x] Verify: `./gradlew compileJava` — `BUILD SUCCESSFUL in 3s`
- [x] Commit all Phase 3 changes (1 commit, 24 files, 1061 insertions)

## Phase 3 Complete ✅

Branch `agent/phase3-backend-api` is ready for your review. Merge when you're happy — remember local merge only, never push to remote.

