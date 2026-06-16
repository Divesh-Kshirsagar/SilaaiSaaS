import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function MeasurementApprovalPage() {
  const queryClient = useQueryClient()

  const { data: pending, isLoading } = useQuery({
    queryKey: ['measurements', 'pending'],
    queryFn: () => api.get('/measurements/pending').then(res => res.data),
  })

  const approveMutation = useMutation({
    mutationFn: (id: number) => api.post(`/measurements/${id}/approve`),
    onSuccess: () => {
      toast.success('Measurement profile approved and activated')
      queryClient.invalidateQueries({ queryKey: ['measurements', 'pending'] })
    }
  })

  const rejectMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/measurements/${id}/reject`),
    onSuccess: () => {
      toast.success('Measurement change rejected')
      queryClient.invalidateQueries({ queryKey: ['measurements', 'pending'] })
    }
  })

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Measurement Approvals</h1>
        <p className="text-muted-foreground">Review and approve measurement updates from staff.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : pending?.length === 0 ? (
        <div className="text-center py-16 border rounded-lg border-dashed text-muted-foreground flex flex-col items-center gap-3">
          <AlertCircle size={32} className="text-muted-foreground/50" />
          <p>No pending approvals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pending.map((m: any) => (
            <Card key={m.id}>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg">Customer ID: {m.customer?.id}</CardTitle>
                <CardDescription>Garment: {m.garmentType} (Version {m.version})</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-6">
                  <div className="flex justify-between"><span className="text-muted-foreground">Chest:</span> <span className="font-medium">{m.chest} cm</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Waist:</span> <span className="font-medium">{m.waist} cm</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Hip:</span> <span className="font-medium">{m.hip} cm</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Length:</span> <span className="font-medium">{m.length} cm</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shoulder:</span> <span className="font-medium">{m.shoulder} cm</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Sleeve:</span> <span className="font-medium">{m.sleeve} cm</span></div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    className="flex-1" 
                    variant="success" 
                    onClick={() => approveMutation.mutate(m.id)}
                    disabled={approveMutation.isPending}
                  >
                    <Check size={16} className="mr-2" /> Approve
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="destructive" 
                    onClick={() => rejectMutation.mutate(m.id)}
                    disabled={rejectMutation.isPending}
                  >
                    <X size={16} className="mr-2" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
