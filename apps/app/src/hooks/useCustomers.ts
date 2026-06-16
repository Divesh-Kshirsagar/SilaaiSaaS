import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CustomerSchema, type CustomerRequest } from '../schemas/customer';
import { z } from 'zod';

const CUSTOMERS_KEY = 'customers';

export function useCustomers(search?: string) {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, search],
    queryFn: async () => {
      const res = await api.get('/customers', { params: { search, size: 50 } });
      return z.array(CustomerSchema).parse(res.data.content ?? []);
    },
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: CustomerRequest) => {
      const res = await api.post('/customers', req);
      return CustomerSchema.parse(res.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] }),
  });
}
