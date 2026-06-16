import { z } from 'zod';

export const FabricSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantityAvailable: z.number(),
  reorderLevel: z.number(),
  lowStock: z.boolean(),
});
export type Fabric = z.infer<typeof FabricSchema>;

export const StockAdjustSchema = z.object({
  quantityChange: z.number(),
  reason: z.enum(['SALE', 'PURCHASE', 'WASTE']),
});
export type StockAdjust = z.infer<typeof StockAdjustSchema>;
