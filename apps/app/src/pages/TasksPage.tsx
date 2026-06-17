import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Play, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Task {
  id: number
  order: { orderNumber: string, deliveryDate: string, customer: { name: string } }
  assignedTo: { name: string } | null
  taskType: string
  status: string
  dueDate: string
}

export default function TasksPage() {
  const queryClient = useQueryClient()

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then(res => {
      const data = res.data;
      return Array.isArray(data) ? data : (data?.content || []);
    }),
  })

  const startMutation = useMutation({
    mutationFn: (id: number) => api.put(`/tasks/${id}/start`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task started')
    }
  })

  const completeMutation = useMutation({
    mutationFn: (id: number) => api.put(`/tasks/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task completed')
    }
  })

  if (isLoading) return <div className="p-6"><Skeleton className="h-8 w-48 mb-6" /><Skeleton className="h-[500px] w-full" /></div>

  const pendingTasks = tasks?.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS') || []
  const completedTasks = tasks?.filter(t => t.status === 'COMPLETED') || []

  const getTaskColor = (type: string) => {
    switch(type) {
      case 'CUTTING': return 'text-orange-600 bg-orange-100'
      case 'STITCHING': return 'text-blue-600 bg-blue-100'
      case 'FINISHING': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">My Tasks</h1></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
            <CardDescription>Tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded border-dashed">No active tasks</div>
            ) : (
              pendingTasks.map(task => (
                <div key={task.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-lg">{task.order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">{task.order.customer.name}</div>
                    </div>
                    <Badge className={getTaskColor(task.taskType)} variant="outline">{task.taskType}</Badge>
                  </div>
                  
                  <div className="text-sm flex justify-between items-center bg-muted/50 p-2 rounded">
                    <span>Due: <span className="font-medium">{task.dueDate}</span></span>
                    <Badge variant={task.status === 'IN_PROGRESS' ? 'info' : 'secondary'}>{task.status}</Badge>
                  </div>

                  <div className="flex gap-2">
                    {task.status === 'PENDING' ? (
                      <Button className="w-full" onClick={() => startMutation.mutate(task.id)} disabled={startMutation.isPending}>
                        <Play size={16} className="mr-2" /> Start Work
                      </Button>
                    ) : (
                      <Button className="w-full" variant="success" onClick={() => completeMutation.mutate(task.id)} disabled={completeMutation.isPending}>
                        <CheckCircle size={16} className="mr-2" /> Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>Recently finished tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 opacity-70">
            {completedTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded border-dashed">No completed tasks yet</div>
            ) : (
              completedTasks.slice(0, 10).map(task => (
                <div key={task.id} className="p-3 border rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium">{task.order.orderNumber}</div>
                    <div className="text-xs text-muted-foreground">{task.taskType}</div>
                  </div>
                  <CheckCircle size={20} className="text-green-600" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
