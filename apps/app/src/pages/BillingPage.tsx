import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FileText, Plus, Search } from 'lucide-react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

interface Invoice {
  invoiceId: number
  invoiceNumber: string
  orderId: number
  orderNumber: string
  grandTotal: number
  amountPaid: number
  balanceDue: number
  status: string
}

export default function BillingPage() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get('/billing/invoices').then(res => res.data),
  })

  // The backend wraps the list in a Page object: { content: [...] }
  const invoices: Invoice[] = res?.content || []

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Billing & Invoices</h1>
          <p className="text-muted-foreground">Manage all customer invoices and payments.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="pl-8" />
        </div>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Order #</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Balance Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.invoiceId}>
                  <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                  <TableCell>
                    <Link to={`/orders/${inv.orderId}`} className="text-blue-600 hover:underline">
                      {inv.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>₹{inv.grandTotal.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">₹{inv.amountPaid.toLocaleString()}</TableCell>
                  <TableCell className={inv.balanceDue > 0 ? "text-red-600 font-medium" : ""}>
                    ₹{inv.balanceDue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      inv.status === 'PAID' ? 'default' :
                      inv.status === 'PARTIALLY_PAID' ? 'secondary' :
                      'outline'
                    }>
                      {inv.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/billing/orders/${inv.orderId}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
