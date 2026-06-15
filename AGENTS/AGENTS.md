# AGENTS.md — SilaaiSaaS Project Governance Rules

> This file defines the **rules, conventions, and structure** that all agents and contributors must follow when working on this repository. Every agent (AI or human) operating in this repo MUST read and respect this document before making any changes.

---

## 1. Repository Structure

```
SilaaiSaaS/
├── AGENTS/                  ← All agent artifacts, plans, and tracking files live here
│   ├── AGENTS.md            ← This governance file (the source of truth)
│   ├── plans/               ← Implementation plans (one file per feature/milestone)
│   ├── tasks/               ← Task tracking files (one file per sprint/phase)
│   └── walkthroughs/        ← Post-completion summaries with screenshots/notes
├── apps/
│   ├── api/                 ← Spring Boot 3 backend (Java 21 + Lombok)
│   └── app/                 ← Ionic React frontend (TypeScript + Capacitor)
├── docs/
│   └── PLAN.md              ← Original project plan (do NOT edit, read-only reference)
└── README.md
```

---

## 2. Unique Naming Conventions

Every artifact, plan, task, or walkthrough file MUST follow a **unique, deterministic naming convention** to avoid collisions and make history traceable.

### 2.1 General Format

```
<YYYYMMDD>_<CATEGORY>_<SCOPE>_<SEQUENCE>.md
```

| Segment | Description | Example |
|---------|-------------|---------|
| `YYYYMMDD` | ISO date the file was **created** (not modified) | `20260615` |
| `CATEGORY` | Type of artifact (see §2.2) | `PLAN`, `TASK`, `WALK`, `SCHEMA`, `SPEC` |
| `SCOPE` | Short snake_case name of the feature/phase | `auth_setup`, `order_module`, `inventory` |
| `SEQUENCE` | Two-digit number to disambiguate same-day same-scope files | `01`, `02` |

### 2.2 Category Codes

| Code | Meaning | Saved in |
|------|---------|----------|
| `PLAN` | Implementation plan (design doc) | `AGENTS/plans/` |
| `TASK` | Task checklist (progress tracker) | `AGENTS/tasks/` |
| `WALK` | Walkthrough / completion report | `AGENTS/walkthroughs/` |
| `SCHEMA` | Database migration or schema spec | `AGENTS/plans/` |
| `SPEC` | API or UI specification | `AGENTS/plans/` |
| `SCRATCH` | Temporary scripts / throwaway files | `AGENTS/scratch/` |

### 2.3 Examples

```
AGENTS/plans/20260615_PLAN_project_overview_01.md
AGENTS/plans/20260615_SCHEMA_core_database_01.md
AGENTS/tasks/20260615_TASK_phase1_setup_01.md
AGENTS/walkthroughs/20260620_WALK_auth_module_01.md
```

### 2.4 Rules

- ✅ **Always use the creation date**, never the current date when updating.
- ✅ **Increment the sequence** (`02`, `03`) if a same-scope file already exists for that date.
- ✅ **Never rename** an existing file — append a new version instead.
- ✅ **Scope must be snake_case**, max 30 characters, no spaces or special chars.
- ❌ **Do NOT** use vague names like `plan.md`, `task1.md`, `notes.md`.
- ❌ **Do NOT** save agent artifacts outside the `AGENTS/` directory.

---

## 3. Agent Workflow Rules

### 3.1 Before Starting Any Work

1. Read `AGENTS/AGENTS.md` (this file).
2. Search `AGENTS/plans/` for an existing plan on the same topic. If one exists, **update it** instead of creating a new one.
3. Search `AGENTS/tasks/` for an in-progress task file. Resume from where it left off.

### 3.2 During Planning

- Create a `PLAN` file before writing any code.
- Document: goal, proposed file changes, open questions, verification steps.
- Mark open questions clearly; wait for user approval before executing.

### 3.3 During Execution

- Maintain a `TASK` file with checkboxes (`[ ]`, `[/]`, `[x]`).
- Update the task file **as you work** (mark in-progress, then done).
- Commit one logical unit of work at a time.

### 3.4 After Completing Work

- Create a `WALK` file summarising: what changed, how it was tested, known limitations.
- Embed screenshots or recording paths if UI changes were made.

---

## 4. Code Conventions

### 4.1 Backend (`apps/api/` — Spring Boot)

- **Java version:** 21
- **Spring Boot version:** 4.1.0
- **Mandatory annotations on entities:** `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor` (Lombok)
- **DTOs:** Java Records only (no POJO classes for DTOs)
- **Repositories:** Interfaces extending `JpaRepository` — no implementation classes
- **Services:** `@Service` + `@Transactional` + `@RequiredArgsConstructor`
- **Package structure:**
  ```
  com.silaaisaas/
  ├── auth/
  ├── shop/
  ├── customer/
  ├── order/
  ├── inventory/
  ├── task/
  ├── billing/
  └── common/
  ```
- **No `ddl-auto=create-drop` in production.** Use Flyway for migrations.
- **All endpoints** prefixed `/api/v1/`
- **JWT** required on all endpoints except `/api/v1/auth/login`

### 4.2 Frontend (`apps/app/` — Ionic React)

- **Language:** TypeScript (strict mode)
- **UI library:** Ionic components only (no raw CSS from scratch for layout)
- **State:** **Zustand** for global state (auth, shop context). **React Query** for server/async state. **Zod** for runtime schema validation of API responses and form inputs.
- **HTTP:** Axios, base URL from env variable `VITE_API_BASE_URL`
- **File naming:** PascalCase for components (`OrderList.tsx`), camelCase for hooks (`useOrders.ts`), SCREAMING_SNAKE for constants (`ORDER_STATUS.ts`)
- **Route structure:**
  ```
  /login
  /dashboard
  /customers
  /customers/:id
  /orders
  /orders/new
  /orders/:id
  /inventory
  /tasks
  /settings
  ```

---

## 5. Branch & Commit Rules

### 5.1 Agent Git Rules (MANDATORY — AI Agents MUST follow these)

> [!CAUTION]
> These rules are non-negotiable. Violating them can corrupt the repository history.

1. **Never commit directly to `main`.** Always create and switch to a feature branch before making any changes.
2. **Branch naming for agents:** `agent/<phase>-<scope>`
   - Examples: `agent/phase1-setup`, `agent/phase2-entities`, `agent/phase3-backend-api`
3. **Create the branch at the start of each phase.** If the branch already exists, check it out and continue from the last commit.
4. **Commit after every logical unit of work** (e.g., one file added, one module complete). Do not batch all changes into a single commit at the end.
5. **Commit message format:** `<type>(<scope>): <description>`
   - Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
   - Example: `feat(auth): add JWT authentication filter`
6. **Never use `git push`.** All work stays **local only**. The remote repository is never touched by agents.
7. **Never use `git merge` or `git rebase`.** Merging is exclusively the user's decision.
8. **Always tell the user** when a phase is complete and a branch is ready to merge. Use this exact phrasing:
   > "Phase X is complete. Branch `agent/phaseX-scope` is ready for your review. Merge when you're happy — remember local merge only, never push to remote."
9. **Commit the `AGENTS/` files first** (plan updates, task updates) before committing source code changes.
10. **Verify before committing:** Run `git status` and `git diff --stat` to confirm exactly what is being staged.

### 5.2 Human Git Rules

- Branch format: `feature/<scope>`, `fix/<scope>`, `chore/<scope>`
- Commit message format: `<type>(<scope>): <short description>`
  - Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`
  - Example: `feat(order): add confirm-order endpoint`
- No direct commits to `main`.
- You (the user) are the sole decision-maker for all merges to `main`.
- All merges are local only — **never `git push` after merging**.

---

## 6. Environment Variables

| Variable | Where Used | Description |
|----------|-----------|-------------|
| `DB_URL` | `apps/api` | PostgreSQL JDBC URL |
| `DB_USERNAME` | `apps/api` | Database username |
| `DB_PASSWORD` | `apps/api` | Database password |
| `JWT_SECRET` | `apps/api` | Secret for signing JWTs (min 32 chars) |
| `JWT_EXPIRY_MS` | `apps/api` | Token TTL in milliseconds |
| `VITE_API_BASE_URL` | `apps/app` | Backend API base URL |

Store secrets in `.env.local` (never committed). A `.env.example` must be maintained in both `apps/api/` and `apps/app/`.

---

## 7. Testing Requirements

- **Backend:** JUnit 5 + Spring Boot Test. Minimum: one integration test per service.
- **Frontend:** No mandatory tests for MVP; add Playwright E2E tests in Phase 2.
- Run `./gradlew test` before marking any backend task complete.

---

## 8. Prohibited Actions

- ❌ Do NOT delete any file in `AGENTS/` — create a new version instead.
- ❌ Do NOT modify `docs/PLAN.md` — it is the original product spec.
- ❌ Do NOT hard-code credentials anywhere in source code.
- ❌ Do NOT install packages not listed in the plan without documenting the reason.
- ❌ Do NOT run `ddl-auto=create` against a production database.

---

*Last updated: 2026-06-15 (rev 2) by Antigravity AI Agent*

### Changelog
| Date | Change |
|------|--------|
| 2026-06-15 | Initial version. |
| 2026-06-15 (rev 2) | State management updated from React Context+useReducer to **Zustand + Zod**. Local dev DB confirmed as **Docker container**. `ddl-auto=update` confirmed for MVP with TODO for production. Phase 6 (Pilot) deferred. |
