# 20260616_TASK_phase7_architecture_overhaul_01.md

## Phase A — Multi-Tenant Architecture Fix
- [ ] Create `Organization.java` entity
- [ ] Modify `Shop.java` — add `organization` FK
- [ ] Modify `User.java` — add `getOrganizationId()` accessor
- [ ] Modify `JwtUtil.java` — embed `shopId`, `orgId` in JWT
- [ ] Create `TenantContext.java` — thread-local tenant holder
- [ ] Modify `JwtAuthenticationFilter.java` — populate TenantContext
- [ ] Rewrite `ShopService.java` — use TenantContext
- [ ] Modify `AuthService.java` — register creates Org → Shop → User
- [ ] Modify all services to use `getCurrentShop()` (Customer, Order, Fabric, GarmentCatalog, Task)
- [ ] Add `IN_PROGRESS` to `TaskStatus` enum

## Phase B — Abstract Inventory
- [ ] Create `ItemCategory.java` enum
- [ ] Create `UnitType.java` enum
- [ ] Create `InventoryItem.java` entity
- [ ] Delete `Fabric.java` (rename to InventoryItem)
- [ ] Create `BillOfMaterial.java` entity
- [ ] Modify `GarmentCatalog.java` — remove defaultFabricConsumptionMeters, add BOM
- [ ] Modify `InventoryTransaction.java` — fabric FK → inventoryItem FK
- [ ] Modify `OrderItem.java` — fabric FK → inventoryItem FK
- [ ] Rename FabricService → InventoryService (refactor all usages)
- [ ] Rename FabricController → InventoryController
- [ ] Rename FabricRepository → InventoryItemRepository

## Phase C — Financial Engine
- [ ] Create `InvoiceStatus.java` enum
- [ ] Create `PaymentMethod.java` enum
- [ ] Create `Invoice.java` entity
- [ ] Create `Payment.java` entity
- [ ] Create `InvoiceRepository.java`
- [ ] Create `PaymentRepository.java`
- [ ] Create `BillingService.java`
- [ ] Create `BillingController.java`
- [ ] Modify `Order.java` — remove totalAmount/advancePaid, add invoice FK
- [ ] Modify `OrderService.java` — auto-create invoice on confirm

## Phase D — Measurement Approval Workflow
- [ ] Create `MeasurementStatus.java` enum
- [ ] Modify `Measurement.java` — add status, approvedBy, approvedAt, version
- [ ] Create `MeasurementAudit.java` entity
- [ ] Create `MeasurementAuditRepository.java`
- [ ] Modify `MeasurementService.java` — state machine: update → PENDING_APPROVAL, approve, reject

## Phase E — Notification Stub
- [ ] Create `NotificationService.java` interface
- [ ] Create `LoggingNotificationService.java` stub
- [ ] Inject into `TaskService.java` + `OrderService.java`
- [ ] Add TODO to `AGENTS/TODO.md` for real provider

## Phase F — Frontend shadcn/ui Migration + RBAC + PWA
- [ ] Uninstall `@carbon/react`, `@carbon/icons-react`, `sass`
- [ ] Uninstall `react-router-dom` v5 type packages
- [ ] Install `react-router-dom` v6
- [ ] Run `npx shadcn@latest init`
- [ ] Install `vite-plugin-pwa`
- [ ] Delete `src/index.scss`, `src/theme/variables.css`, `src/stores/uiStore.ts`, `src/pages/Tab*.css`
- [ ] Update `vite.config.ts` — remove legacy plugin, add VitePWA
- [ ] Scaffold shadcn components: Button, Card, Input, Table, Dialog, Accordion, Tabs, Badge, Select, Sheet, Skeleton, Label, Form
- [ ] Rewrite `App.tsx` — React Router v6, layout route with sidebar
- [ ] Rewrite `ProtectedRoute.tsx` — add `allowedRoles` prop
- [ ] Modify `authStore.ts` — store shopId, orgId, shopName, role
- [ ] Rewrite `LoginPage.tsx`
- [ ] Rewrite `RegisterPage.tsx`
- [ ] Rewrite `DashboardPage.tsx`
- [ ] Rewrite `CustomersPage.tsx`
- [ ] Rewrite `CustomerDetailPage.tsx`
- [ ] Rewrite `OrderListPage.tsx`
- [ ] Rewrite `NewOrderPage.tsx`
- [ ] Rewrite `OrderDetailPage.tsx`
- [ ] Rewrite `TasksPage.tsx`
- [ ] Rewrite `InventoryManagePage.tsx`
- [ ] Rewrite `CustomerPortalPage.tsx`
- [ ] Create `InvoicePage.tsx`
- [ ] Create `MeasurementApprovalPage.tsx`
- [ ] Create `ReportsPage.tsx`
- [ ] Create `SettingsPage.tsx`
- [ ] Add RBAC sidebar nav (role-conditional items)
- [ ] Configure PWA manifest

## Phase G — Governance, Cleanup & Verification
- [ ] Update `AGENTS/AGENTS.md` §4.2 (Ionic → shadcn/ui)
- [ ] Update `AGENTS/TODO.md`
- [ ] Delete stale files: `Tab*.css`, `OrderStatusBadge.tsx`, `AppHeader.tsx`
- [ ] Run `./gradlew compileJava` — 0 errors
- [ ] Run `npm run build` — 0 errors
- [ ] Create `AGENTS/walkthroughs/20260616_WALK_phase7_architecture_overhaul_01.md`
- [ ] Commit all changes
