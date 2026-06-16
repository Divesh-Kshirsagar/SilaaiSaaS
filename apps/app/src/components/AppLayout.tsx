import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Users, Package, CheckSquare,
  Receipt, BarChart2, Settings, LogOut, Scissors
} from 'lucide-react'
import { useAuthStore, type UserRole } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
  allowedRoles?: UserRole[]
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/orders', label: 'Orders', icon: <ShoppingBag size={18} />, allowedRoles: ['OWNER', 'MANAGER', 'ASSISTANT'] },
  { to: '/customers', label: 'Customers', icon: <Users size={18} />, allowedRoles: ['OWNER', 'MANAGER', 'ASSISTANT'] },
  { to: '/tasks', label: 'Tasks', icon: <CheckSquare size={18} /> },
  { to: '/inventory', label: 'Inventory', icon: <Package size={18} />, allowedRoles: ['OWNER', 'MANAGER'] },
  { to: '/billing', label: 'Billing', icon: <Receipt size={18} />, allowedRoles: ['OWNER', 'MANAGER'] },
  { to: '/reports', label: 'Reports', icon: <BarChart2 size={18} />, allowedRoles: ['OWNER', 'MANAGER'] },
  { to: '/settings', label: 'Settings', icon: <Settings size={18} />, allowedRoles: ['OWNER'] },
]

export default function AppLayout() {
  const { name, role, shopName, logout } = useAuthStore()
  const navigate = useNavigate()

  const visibleNav = navItems.filter(item =>
    !item.allowedRoles || (role && item.allowedRoles.includes(role))
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        {/* Brand */}
        <div className="p-6 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Scissors size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">SilaaiSaaS</h1>
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{shopName}</p>
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleNav.map(item => (
            <NavLink key={item.to} to={item.to}>
              {({ isActive }) => (
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}>
                  {item.icon}
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <Separator />

        {/* User info + logout */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{name}</p>
              <Badge variant="outline" className="text-xs">{role}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
