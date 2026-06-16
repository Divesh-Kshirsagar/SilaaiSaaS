import { z } from 'zod';

export const GarmentCatalogSchema = z.object({
  id: z.number(),
  name: z.string(),
  basePrice: z.number(),
  defaultFabricConsumptionMeters: z.number(),
});
export type GarmentCatalog = z.infer<typeof GarmentCatalogSchema>;

export const OrderItemSchema = z.object({
  id: z.number(),
  garmentCatalog: GarmentCatalogSchema,
  quantity: z.number(),
  pricePerItem: z.number(),
  fabricQuantityUsed: z.number().nullable(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  id: z.number(),
  orderNumber: z.string(),
  status: z.enum(['DRAFT', 'CONFIRMED', 'CUTTING', 'STITCHING', 'QUALITY_CHECK', 'READY', 'DELIVERED']),
  bookingDate: z.string(),
  deliveryDate: z.string(),
  totalAmount: z.number(),
  advancePaid: z.number(),
  customer: z.object({ id: z.number(), name: z.string(), phone: z.string() }),
});
export type Order = z.infer<typeof OrderSchema>;

export const CreateOrderRequestSchema = z.object({
  customerId: z.number(),
  deliveryDate: z.string(),
  advancePaid: z.number().min(0),
  items: z.array(z.object({
    garmentCatalogId: z.number(),
    quantity: z.number().min(1),
    fabricId: z.number().nullable(),
    measurementId: z.number().nullable(),
  })).min(1, 'Add at least one item'),
});
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
