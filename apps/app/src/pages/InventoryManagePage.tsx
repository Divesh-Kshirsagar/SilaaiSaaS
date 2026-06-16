import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Package, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export default function InventoryManagePage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'FABRIC', unitType: 'METRES', quantityAvailable: 0, reorderLevel: 0, unitCost: 0 })
  const queryClient = useQueryClient()

  const { data: items, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => api.get('/inventory').then((res) => res.data),
  })

  const addMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/inventory', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      setIsAddOpen(false)
      toast.success('Item added to inventory')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addMutation.mutate(form)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FABRIC">Fabric</SelectItem>
                      <SelectItem value="LINING">Lining</SelectItem>
                      <SelectItem value="BUTTON">Button</SelectItem>
                      <SelectItem value="THREAD">Thread</SelectItem>
                      <SelectItem value="ZIPPER">Zipper</SelectItem>
                      <SelectItem value="ACCESSORY">Accessory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unit Type</Label>
                  <Select value={form.unitType} onValueChange={v => setForm({...form, unitType: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="METRES">Metres</SelectItem>
                      <SelectItem value="PIECES">Pieces</SelectItem>
                      <SelectItem value="ROLLS">Rolls</SelectItem>
                      <SelectItem value="SPOOLS">Spools</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Initial Qty</Label>
                  <Input type="number" step="0.1" value={form.quantityAvailable} onChange={e => setForm({...form, quantityAvailable: parseFloat(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <Label>Reorder Level</Label>
                  <Input type="number" step="0.1" value={form.reorderLevel} onChange={e => setForm({...form, reorderLevel: parseFloat(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <Label>Unit Cost (₹)</Label>
                  <Input type="number" step="0.1" value={form.unitCost} onChange={e => setForm({...form, unitCost: parseFloat(e.target.value)})} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={addMutation.isPending}>Save Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : items?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No items in inventory</TableCell></TableRow>
            ) : (
              items?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-2">
                      <Package size={16} className="text-muted-foreground" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={item.lowStock ? "text-red-600" : ""}>
                      {item.quantityAvailable} {item.unitType.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">₹{item.unitCost}</TableCell>
                  <TableCell className="text-right">
                    {item.lowStock && (
                      <Badge variant="destructive" className="ml-2"><AlertTriangle size={12} className="mr-1" /> Low Stock</Badge>
                    )}
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
