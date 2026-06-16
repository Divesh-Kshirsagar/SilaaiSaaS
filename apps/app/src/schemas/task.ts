import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.number(),
  taskType: z.enum(['CUTTING', 'STITCHING', 'FINISHING']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  dueDate: z.string(),
  order: z.object({
    id: z.number(),
    orderNumber: z.string(),
    customer: z.object({ id: z.number(), name: z.string() }),
    deliveryDate: z.string(),
  }),
  assignedTo: z.object({ id: z.number(), name: z.string() }).nullable(),
});
export type Task = z.infer<typeof TaskSchema>;

export const DashboardStatsSchema = z.object({
  pendingOrders: z.number(),
  todayDeliveries: z.number(),
  lowStockCount: z.number(),
  readyOrders: z.number(),
});
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
