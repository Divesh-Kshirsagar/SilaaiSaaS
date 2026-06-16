import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppLayout from '@/components/AppLayout'

// Pages
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import CustomersPage from '@/pages/CustomersPage'
import CustomerDetailPage from '@/pages/CustomerDetailPage'
import OrderListPage from '@/pages/OrderListPage'
import NewOrderPage from '@/pages/NewOrderPage'
import OrderDetailPage from '@/pages/OrderDetailPage'
import TasksPage from '@/pages/TasksPage'
import InventoryManagePage from '@/pages/InventoryManagePage'
import CustomerPortalPage from '@/pages/CustomerPortalPage'
import InvoicePage from '@/pages/InvoicePage'
import MeasurementApprovalPage from '@/pages/MeasurementApprovalPage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/portal/:orderNumber" element={<CustomerPortalPage />} />

          {/* Protected routes with sidebar layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Orders — OWNER, MANAGER, ASSISTANT */}
              <Route element={<ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'ASSISTANT']} />}>
                <Route path="/orders" element={<OrderListPage />} />
                <Route path="/orders/new" element={<NewOrderPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
              </Route>

              {/* Customers */}
              <Route element={<ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'ASSISTANT']} />}>
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/customers/:id" element={<CustomerDetailPage />} />
              </Route>

              {/* Tasks — all roles */}
              <Route path="/tasks" element={<TasksPage />} />

              {/* Inventory — OWNER, MANAGER */}
              <Route element={<ProtectedRoute allowedRoles={['OWNER', 'MANAGER']} />}>
                <Route path="/inventory" element={<InventoryManagePage />} />
              </Route>

              {/* Billing — OWNER, MANAGER */}
              <Route element={<ProtectedRoute allowedRoles={['OWNER', 'MANAGER']} />}>
                <Route path="/billing" element={<Navigate to="/orders" replace />} />
                <Route path="/billing/orders/:orderId" element={<InvoicePage />} />
              </Route>

              {/* Measurement Approvals — OWNER, MANAGER */}
              <Route element={<ProtectedRoute allowedRoles={['OWNER', 'MANAGER']} />}>
                <Route path="/measurements/pending" element={<MeasurementApprovalPage />} />
              </Route>

              {/* Reports — OWNER, MANAGER */}
              <Route element={<ProtectedRoute allowedRoles={['OWNER', 'MANAGER']} />}>
                <Route path="/reports" element={<ReportsPage />} />
              </Route>

              {/* Settings — OWNER only */}
              <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
