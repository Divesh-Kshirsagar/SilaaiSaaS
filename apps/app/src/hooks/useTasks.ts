import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TaskSchema, DashboardStatsSchema } from '../schemas/task';
import { z } from 'zod';

const TASKS_KEY = 'tasks';

export function useTasks() {
  return useQuery({
    queryKey: [TASKS_KEY],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return z.array(TaskSchema).parse(res.data);
    },
  });
}

export function useCompleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: number) => {
      const res = await api.post(`/tasks/${taskId}/complete`);
      return TaskSchema.parse(res.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return DashboardStatsSchema.parse(res.data);
    },
    refetchInterval: 1000 * 60, // auto-refresh every minute
  });
}
