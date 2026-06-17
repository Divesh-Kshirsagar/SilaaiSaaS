import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, Users, Package, AlertTriangle, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/authStore'

interface DashboardStats {
  pendingOrders: number
  todayDeliveries: number
  lowStockCount: number
  readyOrders: number
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { name, shopName } = useAuthStore()

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then(r => r.data),
  })

  const statCards = [
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders ?? 0,
      icon: <ShoppingBag size={20} />,
      color: 'text-blue-600 bg-blue-50',
      action: () => navigate('/orders'),
    },
    {
      title: "Today's Deliveries",
      value: stats?.todayDeliveries ?? 0,
      icon: <Users size={20} />,
      color: 'text-green-600 bg-green-50',
      action: () => navigate('/orders'),
    },
    {
      title: 'Ready for Pickup',
      value: stats?.readyOrders ?? 0,
      icon: <Package size={20} />,
      color: 'text-purple-600 bg-purple-50',
      action: () => navigate('/orders'),
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockCount ?? 0,
      icon: <AlertTriangle size={20} />,
      color: 'text-orange-600 bg-orange-50',
      action: () => navigate('/inventory'),
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Good morning, {name?.split(' ')[0]}!</h2>
          <p className="text-muted-foreground">{shopName} · Here's what's happening today</p>
        </div>
        <Button onClick={() => navigate('/orders/new')}>
          <ShoppingBag size={16} />
          New Order
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))
          : statCards.map(card => (
              <Card key={card.title} className="cursor-pointer hover:shadow-md transition-shadow" onClick={card.action}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center ${card.color}`}>
                    {card.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value}</div>
                  {card.title === 'Low Stock Alerts' && (card.value as number) > 0 && (
                    <Badge variant="warning" className="mt-1">Attention needed</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Quick links */}
      <div className="flex gap-3 flex-wrap">
        <Button variant="outline" onClick={() => navigate('/orders/new')}>Create Order</Button>
        <Button variant="outline" onClick={() => navigate('/customers')}>View Customers</Button>
        <Button variant="outline" onClick={() => navigate('/tasks')}>My Tasks</Button>
        <Button variant="outline" onClick={() => navigate('/measurements/pending')}>Pending Approvals</Button>
      </div>
    </div>
  )
}
