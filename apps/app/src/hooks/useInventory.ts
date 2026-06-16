import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { FabricSchema } from '../schemas/inventory';
import { GarmentCatalogSchema } from '../schemas/order';
import { z } from 'zod';

const FABRICS_KEY = 'fabrics';
const GARMENTS_KEY = 'garments';

export function useFabrics() {
  return useQuery({
    queryKey: [FABRICS_KEY],
    queryFn: async () => {
      const res = await api.get('/fabrics');
      return z.array(FabricSchema).parse(res.data);
    },
  });
}

export function useGarments() {
  return useQuery({
    queryKey: [GARMENTS_KEY],
    queryFn: async () => {
      const res = await api.get('/garments');
      return z.array(GarmentCatalogSchema).parse(res.data);
    },
  });
}

export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantityChange, reason }: { id: number; quantityChange: number; reason: string }) => {
      const res = await api.put(`/fabrics/${id}/stock`, { quantityChange, reason });
      return FabricSchema.parse(res.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [FABRICS_KEY] }),
  });
}
