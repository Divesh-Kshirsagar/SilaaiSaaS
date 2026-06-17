import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Users, Package, CheckSquare,
  Receipt, BarChart2, Settings, LogOut, Scissors, Menu, X, ChevronLeft, ChevronRight
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
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/orders', label: 'Orders', icon: <ShoppingBag size={20} />, allowedRoles: ['OWNER', 'MANAGER', 'ASSISTANT'] },
  { to: '/customers', label: 'Customers', icon: <Users size={20} />, allowedRoles: ['OWNER', 'MANAGER', 'ASSISTANT'] },
  { to: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  { to: '/inventory', label: 'Inventory', icon: <Package size={20} />, allowedRoles: ['OWNER', 'MANAGER'] },
  { to: '/billing', label: 'Billing', icon: <Receipt size={20} />, allowedRoles: ['OWNER', 'MANAGER'] },
  { to: '/reports', label: 'Reports', icon: <BarChart2 size={20} />, allowedRoles: ['OWNER', 'MANAGER'] },
  { to: '/settings', label: 'Settings', icon: <Settings size={20} />, allowedRoles: ['OWNER'] },
]

export default function AppLayout() {
  const { name, role, shopName, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  const visibleNav = navItems.filter(item =>
    !item.allowedRoles || (role && item.allowedRoles.includes(role))
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className={cn("flex items-center gap-3 p-4 transition-all duration-300", isDesktopCollapsed ? "justify-center" : "px-6")}>
        <div className="h-9 w-9 rounded-lg bg-primary flex-shrink-0 flex items-center justify-center">
          <Scissors size={18} className="text-primary-foreground" />
        </div>
        {!isDesktopCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm leading-tight whitespace-nowrap">SilaaiSaaS</h1>
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{shopName}</p>
          </div>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {visibleNav.map(item => (
          <NavLink key={item.to} to={item.to} title={isDesktopCollapsed ? item.label : undefined}>
            {({ isActive }) => (
              <div className={cn(
                "flex items-center rounded-md text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isDesktopCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
              )}>
                <div className="flex-shrink-0 flex items-center justify-center">
                  {item.icon}
                </div>
                {!isDesktopCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <Separator />

      {/* Collapse Toggle (Desktop Only) */}
      <div className="hidden md:flex p-2 justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground"
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
        >
          {isDesktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* User info + logout */}
      <div className={cn("p-4 space-y-3", isDesktopCollapsed ? "flex flex-col items-center" : "")}>
        {!isDesktopCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{name}</p>
              <Badge variant="outline" className="text-xs">{role}</Badge>
            </div>
          </div>
        ) : (
          <div 
            className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary cursor-help"
            title={`${name} (${role})`}
          >
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
        <Button 
          variant="ghost" 
          size={isDesktopCollapsed ? "icon" : "sm"} 
          className={cn(isDesktopCollapsed ? "h-8 w-8" : "w-full justify-start gap-2")} 
          onClick={handleLogout}
          title={isDesktopCollapsed ? "Sign out" : undefined}
        >
          <LogOut size={16} />
          {!isDesktopCollapsed && <span>Sign out</span>}
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col transform transition-transform duration-300 ease-in-out md:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col bg-card border-r transition-all duration-300 ease-in-out",
        isDesktopCollapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)} className="-ml-2">
              <Menu size={24} />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Scissors size={16} className="text-primary-foreground" />
              </div>
              <h1 className="font-bold text-sm">{shopName}</h1>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
