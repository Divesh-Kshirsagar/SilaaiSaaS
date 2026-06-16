import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Save } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({ taxRate: '', taxId: '', currency: 'INR', receiptFooter: '' })

  const { data: org, isLoading } = useQuery({
    queryKey: ['organization'],
    queryFn: () => api.get('/organization').then(res => {
      setFormData({
        taxRate: (res.data.taxRate * 100).toString(),
        taxId: res.data.taxId || '',
        currency: res.data.currency || 'INR',
        receiptFooter: res.data.receiptFooter || ''
      })
      return res.data
    }),
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.put('/organization', {
      ...data,
      taxRate: parseFloat(data.taxRate) / 100
    }),
    onSuccess: () => {
      toast.success('Organization settings updated')
      queryClient.invalidateQueries({ queryKey: ['organization'] })
    },
    onError: () => toast.error('Failed to update settings')
  })

  if (isLoading) return <div className="p-6"><Skeleton className="h-96" /></div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">Manage global configuration for all branches.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 size={20} /> {org?.name}</CardTitle>
          <CardDescription>Financial and invoice configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Default Tax Rate (%)</Label>
              <Input 
                type="number" 
                step="0.1" 
                value={formData.taxRate} 
                onChange={e => setFormData({...formData, taxRate: e.target.value})} 
              />
              <p className="text-xs text-muted-foreground">Applied automatically to new invoices.</p>
            </div>
            <div className="space-y-2">
              <Label>Tax ID / GSTIN</Label>
              <Input 
                value={formData.taxId} 
                onChange={e => setFormData({...formData, taxId: e.target.value})} 
                placeholder="e.g. 22AAAAA0000A1Z5"
              />
            </div>
            <div className="space-y-2">
              <Label>Currency Code</Label>
              <Input 
                value={formData.currency} 
                onChange={e => setFormData({...formData, currency: e.target.value})} 
                placeholder="INR"
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label>Receipt Footer Text</Label>
            <Input 
              value={formData.receiptFooter} 
              onChange={e => setFormData({...formData, receiptFooter: e.target.value})} 
              placeholder="Thank you for your business! Terms & Conditions apply."
            />
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 flex justify-end">
          <Button onClick={() => updateMutation.mutate(formData)} disabled={updateMutation.isPending}>
            <Save size={16} className="mr-2" />
            {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
