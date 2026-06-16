import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CreditCard, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function InvoicePage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', orderId],
    queryFn: () => api.get(`/billing/orders/${orderId}/invoice`).then(res => res.data),
  })

  const paymentMutation = useMutation({
    mutationFn: () => api.post(`/billing/invoices/${invoice.invoiceId}/payments`, {
      amount: parseFloat(paymentAmount),
      method: paymentMethod,
      transactionRef: ''
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice', orderId] })
      setPaymentAmount('')
      toast.success('Payment recorded successfully')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to record payment')
    }
  })

  if (isLoading) return <div className="p-6">Loading invoice...</div>
  if (!invoice) return <div className="p-6 text-muted-foreground">Invoice not generated yet.</div>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/orders/${orderId}`)}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              Invoice {invoice.invoiceNumber}
              <Badge variant={invoice.status === 'PAID' ? 'success' : invoice.status === 'PARTIALLY_PAID' ? 'warning' : 'secondary'}>
                {invoice.status.replace('_', ' ')}
              </Badge>
            </h1>
            <p className="text-muted-foreground">Order: {invoice.orderNumber}</p>
          </div>
        </div>
        <Button variant="outline">
          <Download size={16} className="mr-2" /> Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <FileText className="text-primary" size={24} />
              <div>
                <CardTitle>Invoice Summary</CardTitle>
                <CardDescription>Generated automatically on order confirmation</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between py-2 border-b text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">- ₹{invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Tax ({(invoice.taxRate * 100).toFixed(0)}%)</span>
                  <span className="font-medium">₹{invoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-4 text-lg font-bold">
                  <span>Grand Total</span>
                  <span>₹{invoice.grandTotal.toFixed(2)}</span>
                </div>
                
                <div className="bg-muted p-4 rounded-lg mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-medium text-green-600">₹{invoice.amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Balance Due</span>
                    <span className="font-bold text-red-600">₹{invoice.balanceDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Record Payment</CardTitle>
              <CardDescription>Log a customer payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input 
                  type="number" 
                  max={invoice.balanceDue} 
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  placeholder={`Max: ${invoice.balanceDue}`}
                  disabled={invoice.status === 'PAID'}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={invoice.status === 'PAID'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="ONLINE">Online Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => paymentMutation.mutate()} 
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || parseFloat(paymentAmount) > invoice.balanceDue || paymentMutation.isPending || invoice.status === 'PAID'}
              >
                <CreditCard size={16} className="mr-2" /> Record Payment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
