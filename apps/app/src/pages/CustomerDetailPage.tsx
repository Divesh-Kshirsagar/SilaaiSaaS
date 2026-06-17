import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Edit, Plus, History } from 'lucide-react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: customer, isLoading: loadingCustomer } = useQuery({
    queryKey: ['customers', id],
    queryFn: () => api.get(`/customers/${id}`).then((res) => res.data),
  })

  const { data: measurements, isLoading: loadingMeasurements } = useQuery({
    queryKey: ['customers', id, 'measurements'],
    queryFn: () => api.get(`/customers/${id}/measurements`).then((res) => res.data),
  })

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ['orders', { customerId: id }],
    queryFn: () => api.get('/orders', { params: { customerId: id } }).then((res) => res.data),
  })

  if (loadingCustomer) return <div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-[400px] w-full" /></div>

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{customer?.name}</h1>
          <p className="text-muted-foreground">{customer?.phone}</p>
        </div>
      </div>

      <Tabs defaultValue="measurements">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div>{customer?.phone}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div>{customer?.email || '-'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div>{customer?.address || '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Measurement Profiles</h3>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Profile
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loadingMeasurements ? (
              <Skeleton className="h-48 w-full" />
            ) : measurements?.length === 0 ? (
              <div className="col-span-2 text-center py-12 border rounded-lg border-dashed text-muted-foreground">
                No measurement profiles found.
              </div>
            ) : (
              measurements?.map((m: any) => (
                <Card key={m.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{m.garmentType}</CardTitle>
                    <Badge variant={m.status === 'ACTIVE' ? 'success' : 'secondary'}>{m.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Chest</span>
                        <span className="font-medium">{m.chest} cm</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Waist</span>
                        <span className="font-medium">{m.waist} cm</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Hip</span>
                        <span className="font-medium">{m.hip} cm</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Length</span>
                        <span className="font-medium">{m.length} cm</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Shoulder</span>
                        <span className="font-medium">{m.shoulder} cm</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Sleeve</span>
                        <span className="font-medium">{m.sleeve} cm</span>
                      </div>
                    </div>
                    {m.notes && (
                      <p className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded">
                        {m.notes}
                      </p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit size={14} className="mr-2" />
                        Update
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/measurements/${m.id}/history`)}>
                        <History size={14} className="mr-2" />
                        History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Recent orders for this customer</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <Skeleton className="h-32 w-full" />
              ) : orders?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No orders found.</div>
              ) : (
                <div className="space-y-4">
                  {orders?.map((o: any) => (
                     <div key={o.id} className="flex items-center justify-between p-4 border rounded-lg">
                       <div>
                         <div className="font-medium">{o.orderNumber}</div>
                         <div className="text-sm text-muted-foreground">Booked: {o.bookingDate} • Due: {o.deliveryDate}</div>
                       </div>
                       <Badge>{o.status}</Badge>
                     </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
