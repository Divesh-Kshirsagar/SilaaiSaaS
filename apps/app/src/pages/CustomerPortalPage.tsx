import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Scissors, Clock, Package, CheckCircle } from 'lucide-react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function CustomerPortalPage() {
  const { orderNumber } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: ['portal', orderNumber],
    queryFn: () => api.get(`/portal/orders/${orderNumber}`).then(res => res.data),
  })

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Skeleton className="h-96 w-full max-w-md" /></div>

  if (!order) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center py-12">
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground">Please check the link and try again.</p>
      </Card>
    </div>
  )

  const steps = [
    { id: 'CONFIRMED', label: 'Order Confirmed', icon: <CheckCircle size={20} /> },
    { id: 'CUTTING', label: 'Cutting & Prep', icon: <Scissors size={20} /> },
    { id: 'STITCHING', label: 'Stitching', icon: <Scissors size={20} /> },
    { id: 'QUALITY_CHECK', label: 'Quality Check', icon: <CheckCircle size={20} /> },
    { id: 'READY', label: 'Ready for Pickup', icon: <Package size={20} /> },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === order.status)

  return (
    <div className="min-h-screen bg-slate-50 p-4 py-8">
      <div className="w-full max-w-md mx-auto space-y-6">
        
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-3 shadow-md shadow-primary/20">
            <Scissors size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">{order.shopName}</h1>
        </div>

        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="bg-primary p-6 text-primary-foreground text-center">
            <p className="opacity-90 text-sm mb-1">Order Status</p>
            <h2 className="text-3xl font-bold">{order.orderNumber}</h2>
            <div className="mt-4 inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
              Expected Delivery: {order.deliveryDate}
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="space-y-8 py-4">
              {steps.map((step, index) => {
                const isCompleted = currentStepIndex >= index
                const isCurrent = currentStepIndex === index
                
                return (
                  <div key={step.id} className="relative flex items-center gap-4">
                    {/* Connecting line */}
                    {index < steps.length - 1 && (
                      <div className={`absolute left-5 top-10 bottom-[-24px] w-0.5 ${currentStepIndex > index ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                    
                    {/* Circle icon */}
                    <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isCompleted 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'bg-background border-muted text-muted-foreground'
                    }`}>
                      {step.icon}
                    </div>
                    
                    {/* Label */}
                    <div>
                      <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-primary font-medium">Currently in progress</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {order.invoice && (
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                Billing Summary
                <Badge variant={order.invoice.status === 'PAID' ? 'success' : 'warning'} className="ml-auto">
                  {order.invoice.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-medium">₹{order.invoice.grandTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium text-green-600">₹{order.invoice.amountPaid}</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-medium text-foreground">Balance Due</span>
                  <span className="font-bold text-red-600">₹{order.invoice.balanceDue}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Have questions? Contact {order.shopName} at <a href={`tel:${order.shopPhone}`} className="text-primary hover:underline">{order.shopPhone}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
