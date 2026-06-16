import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => api.get(`/orders/${id}`).then((res) => res.data),
  })

  const confirmMutation = useMutation({
    mutationFn: () => api.put(`/orders/${id}/confirm`),
    onSuccess: () => {
      toast.success('Order confirmed. Invoice and tasks created.')
      queryClient.invalidateQueries({ queryKey: ['orders', id] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to confirm order')
    }
  })

  if (isLoading) return <div className="p-6"><Skeleton className="h-10 w-48 mb-6" /><Skeleton className="h-64 w-full" /></div>

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {order?.orderNumber}
              <Badge variant={order?.status === 'DRAFT' ? 'secondary' : 'default'}>{order?.status}</Badge>
            </h1>
            <p className="text-muted-foreground">Booking Date: {order?.bookingDate}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {order?.status !== 'DRAFT' && (
            <Button variant="outline" onClick={() => navigate(`/billing/orders/${id}`)}>
              View Invoice
            </Button>
          )}
          {order?.status === 'DRAFT' && (
            <Button onClick={() => confirmMutation.mutate()} disabled={confirmMutation.isPending}>
              <CheckCircle size={16} className="mr-2" />
              {confirmMutation.isPending ? 'Confirming...' : 'Confirm Order'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order?.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.garmentCatalog.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      {item.inventoryItem && (
                        <p className="text-sm text-blue-600">
                          Material: {item.inventoryItem.name} ({item.materialQuantityUsed} used)
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.pricePerItem * item.quantity}</p>
                      <p className="text-xs text-muted-foreground">₹{item.pricePerItem} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order?.customer.name}</p>
              <p className="text-sm text-muted-foreground">{order?.customer.phone}</p>
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate(`/customers/${order?.customer.id}`)}>
                View Customer Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-sm font-medium">Delivery Date</p>
                  <p className="text-sm text-muted-foreground">{order?.deliveryDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
