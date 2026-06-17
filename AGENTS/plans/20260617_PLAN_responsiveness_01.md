# SilaaiSaaS — Mobile Responsiveness & Collapsible Sidebar

Provide a brief description of the problem, any background context, and what the change accomplishes.
To ensure the app feels like a true PWA on mobile devices, the layout must be fully responsive. Currently, the sidebar is fixed at `w-64` which breaks on small screens. We will introduce a mobile-friendly collapsible sidebar with a hamburger menu, an overlay for mobile, and proper content padding adjustments for smaller devices.

## User Review Required

> [!IMPORTANT]
> - Is there any specific behavior you want for the desktop sidebar? E.g., Should the sidebar on desktop collapse into an "icon-only" mode, or simply disappear/slide-out like on mobile? (The proposed plan uses a slide-out drawer for mobile and a persistent sidebar for desktop, but allows collapsing on desktop as well).

## Open Questions
- None currently.

## Proposed Changes

### Frontend (`apps/app`)

#### [MODIFY] [AppLayout.tsx](file:///home/Divesh/projects/SilaaiSaaS/apps/app/src/components/AppLayout.tsx)
- Add local state `isSidebarOpen` and `isMobile`.
- On mobile (`md` breakpoint), hide the sidebar by default using `-translate-x-full`.
- Add a top navigation bar (Header) visible only on mobile (or universally) containing a Hamburger Menu (`Menu` icon) to toggle the sidebar.
- Add an overlay (`<div className="fixed inset-0 bg-black/50 ...">`) that appears when the sidebar is open on mobile, allowing users to click outside to close it.
- Ensure the main content area has `overflow-x-hidden` so tables can scroll horizontally without breaking the page layout.

#### [MODIFY] Page Components (General Responsiveness)
- Ensure all pages (e.g., `DashboardPage.tsx`, `OrdersPage.tsx`, `BillingPage.tsx`) use `p-4 md:p-6` instead of strict `p-6` to save screen real-estate on mobile.
- Ensure all `Table` components are wrapped in a container with `overflow-x-auto` to allow horizontal scrolling on small screens instead of squishing columns.

## Verification Plan

### Automated Tests
- `npm run build` to ensure no TypeScript/React errors are introduced by the new layout state.

### Manual Verification
- We will view the UI in a simulated mobile viewport (e.g. 375px width) to verify:
  1. The sidebar is hidden by default.
  2. A top bar with a hamburger menu is visible.
  3. Tapping the menu opens the sidebar smoothly with an overlay.
  4. Data tables can be scrolled horizontally without breaking the screen width.
