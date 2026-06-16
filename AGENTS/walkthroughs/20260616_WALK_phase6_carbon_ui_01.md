# SilaaiSaaS — Phase 6 Walkthrough (IBM Carbon UI Migration)

> **File:** `AGENTS/walkthroughs/20260616_WALK_phase6_carbon_ui_01.md`
> **Created:** 2026-06-16
> **Phase:** 6

---

## 🎨 Complete Framework Replacement

We successfully completely eradicated Ionic from our stack due to UI bugs, replacing it natively with **IBM's Carbon Design System** (`@carbon/react`). The result is a robust, strictly enterprise-grade React app without any custom overriding styles.

### 1. Architectural Overhaul
- **Removed Dependencies:** Uninstalled `@ionic/react`, `@ionic/react-router`, `@ionic/pwa-elements`, and `ionicons`.
- **Added Dependencies:** Installed `@carbon/react`, `@carbon/icons-react`, and `sass`.
- **Routing:** Removed `IonReactRouter` and `IonRouterOutlet`. Replaced with standard `react-router-dom` (`BrowserRouter`, `Switch`, `Route`).
- **Global Styles:** Added `index.scss` containing the `@use '@carbon/react';` initialization, stripping out `variables.css`.

### 2. Layout & Shell
- Replaced `AppMenu.tsx` with a new `AppHeader.tsx` leveraging Carbon's **UI Shell**.
- It provides a persistent top `<Header>` with `<HeaderGlobalAction>` icons for the User Profile and Logout.
- It includes an expandable side navigation menu (`<SideNav>`) mapping to our routes.

### 3. Component Refactoring

Every single view was rewritten to use pure Carbon components:

- **Authentication (Login/Register):** Now powered by `<Form>`, `<TextInput>`, and `<PasswordInput>` with native Carbon inline notifications for errors.
- **Dashboard:** Replaced generic cards with Carbon's `<Grid>`, `<Column>`, and `<Tile>` for statistical widgets.
- **Lists (Customers & Orders):** We removed `IonList` and manually built search bars. They now use Carbon's highly capable **`<DataTable>`**, complete with internal `<TableToolbarSearch>` handling.
- **New Order Flow:** The Ionic step-bars were completely swapped for Carbon's **`<ProgressIndicator>`**. The UX is significantly cleaner for data-heavy wizards.
- **Tasks:** Replaced the Ionic Accordion with Carbon's **`<Accordion>`**, mapping internal tasks logically to the UI.
- **Inventory Management:** Removed `IonSegment`. Replaced with Carbon's **`<Tabs>`**. Swapped the Ionic Modals with Carbon's strictly-typed `<Modal>`.

### 4. Build & Verification
- We executed `npm run build`.
- The compilation succeeded successfully and correctly minified the IBM Plex fonts and Carbon styles.
- **Result:** 0 TypeScript errors.

We are now running a pure web-first, enterprise-grade architecture.
