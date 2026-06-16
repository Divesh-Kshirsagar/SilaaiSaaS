import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { OrderSchema, type CreateOrderRequest } from '../schemas/order';
import { z } from 'zod';
import type { OrderStatus } from '../constants/enums';

const ORDERS_KEY = 'orders';

export function useOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: [ORDERS_KEY, status],
    queryFn: async () => {
      const res = await api.get('/orders', { params: { status } });
      return z.array(OrderSchema).parse(res.data);
    },
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: [ORDERS_KEY, id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return OrderSchema.parse(res.data);
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateOrderRequest) => {
      const res = await api.post('/orders', req);
      return OrderSchema.parse(res.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [ORDERS_KEY] }),
  });
}

export function useConfirmOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await api.post(`/orders/${orderId}/confirm`);
      return OrderSchema.parse(res.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [ORDERS_KEY] }),
  });
}
