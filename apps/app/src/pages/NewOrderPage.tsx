import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function NewOrderPage() {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState<string>('')
  const [deliveryDate, setDeliveryDate] = useState<string>('')
  const [items, setItems] = useState([{ garmentCatalogId: '', quantity: 1, inventoryItemId: '', measurementId: '' }])

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.get('/customers').then(res => res.data),
  })

  const { data: garments } = useQuery({
    queryKey: ['garments'],
    queryFn: () => api.get('/garments').then(res => res.data),
  })

  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => api.get('/inventory').then(res => res.data),
  })

  const { data: measurements } = useQuery({
    queryKey: ['customers', customerId, 'measurements'],
    queryFn: () => api.get(`/customers/${customerId}/measurements`).then(res => res.data),
    enabled: !!customerId,
  })

  const createOrderMutation = useMutation({
    mutationFn: (data: any) => api.post('/orders', data),
    onSuccess: () => {
      toast.success('Order created successfully')
      navigate('/orders')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create order')
    }
  })

  const handleAddItem = () => {
    setItems([...items, { garmentCatalogId: '', quantity: 1, inventoryItemId: '', measurementId: '' }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    if (!customerId || !deliveryDate) {
      toast.error('Please select customer and delivery date')
      return
    }

    if (items.some(i => !i.garmentCatalogId || i.quantity < 1)) {
      toast.error('Please complete all order items')
      return
    }

    createOrderMutation.mutate({
      customerId: parseInt(customerId),
      deliveryDate,
      items: items.map(i => ({
        garmentCatalogId: parseInt(i.garmentCatalogId),
        quantity: i.quantity,
        inventoryItemId: i.inventoryItemId ? parseInt(i.inventoryItemId) : null,
        measurementId: i.measurementId ? parseInt(i.measurementId) : null,
      }))
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">New Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Select customer and delivery schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers?.map((c: any) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name} ({c.phone})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Delivery Date</Label>
                <Input 
                  type="date" 
                  value={deliveryDate} 
                  onChange={e => setDeliveryDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Add garments to be tailored</CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={handleAddItem}>
              <Plus size={16} className="mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                {items.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                  <div className="space-y-2">
                    <Label>Garment Type</Label>
                    <Select 
                      value={item.garmentCatalogId} 
                      onValueChange={v => handleItemChange(index, 'garmentCatalogId', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select garment" />
                      </SelectTrigger>
                      <SelectContent>
                        {garments?.map((g: any) => (
                          <SelectItem key={g.id} value={g.id.toString()}>{g.name} - ₹{g.basePrice}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Material (Optional)</Label>
                    <Select 
                      value={item.inventoryItemId} 
                      onValueChange={v => handleItemChange(index, 'inventoryItemId', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Customer provided material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Customer provided material</SelectItem>
                        {inventory?.filter((inv: any) => inv.category === 'FABRIC').map((inv: any) => (
                          <SelectItem key={inv.id} value={inv.id.toString()}>{inv.name} (Stock: {inv.quantityAvailable})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Measurement Profile (Optional)</Label>
                    <Select 
                      value={item.measurementId} 
                      onValueChange={v => handleItemChange(index, 'measurementId', v)}
                      disabled={!customerId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={customerId ? "Select measurements" : "Select customer first"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Enter later / Not required</SelectItem>
                        {measurements?.map((m: any) => (
                          <SelectItem key={m.id} value={m.id.toString()}>{m.garmentType} (v{m.version})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/orders')}>
            Cancel
          </Button>
          <Button type="submit" disabled={createOrderMutation.isPending}>
            {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}
