import { z } from 'zod';

export const CustomerSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string(),
});
export type Customer = z.infer<typeof CustomerSchema>;

export const MeasurementSchema = z.object({
  id: z.number(),
  garmentType: z.string(),
  chest: z.number().nullable(),
  waist: z.number().nullable(),
  hip: z.number().nullable(),
  length: z.number().nullable(),
  shoulder: z.number().nullable(),
  sleeve: z.number().nullable(),
  notes: z.string().nullable(),
  updatedAt: z.string(),
});
export type Measurement = z.infer<typeof MeasurementSchema>;

export const CustomerRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
});
export type CustomerRequest = z.infer<typeof CustomerRequestSchema>;
