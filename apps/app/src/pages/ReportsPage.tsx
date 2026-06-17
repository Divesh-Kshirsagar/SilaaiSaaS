import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Users, ShoppingBag } from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function ReportsPage() {
  const { data: report, isLoading } = useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: () => api.get('/reports/summary').then(res => res.data),
  })

  if (isLoading) return <div className="p-6"><Skeleton className="h-8 w-48 mb-6" /><div className="grid grid-cols-3 gap-6"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div><Skeleton className="h-96 mt-6" /></div>

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: report?.revenueTrend || [0,0,0,0,0,0,0,0,0,0,0,0],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  }

  const orderStatusData = {
    labels: ['Draft', 'Confirmed', 'In Progress', 'Ready', 'Delivered'],
    datasets: [
      {
        data: [
          report?.orderStatusBreakdown?.DRAFT || 0,
          report?.orderStatusBreakdown?.CONFIRMED || 0,
          report?.orderStatusBreakdown?.IN_PROGRESS || 0,
          report?.orderStatusBreakdown?.READY || 0,
          report?.orderStatusBreakdown?.DELIVERED || 0
        ],
        backgroundColor: [
          '#94a3b8',
          '#3b82f6',
          '#f59e0b',
          '#10b981',
          '#64748b'
        ],
      },
    ],
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business Reports</h1>
        <p className="text-muted-foreground">Overview of your shop's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <TrendingUp size={18} className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{report?.totalRevenue?.toLocaleString() || '0'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingBag size={18} className="text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report?.totalOrders || '0'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            <Users size={18} className="text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report?.activeCustomers || '0'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Bar data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Current pipeline breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut data={orderStatusData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
