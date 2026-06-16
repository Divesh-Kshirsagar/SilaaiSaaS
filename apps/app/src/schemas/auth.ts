import { z } from 'zod';

export const LoginRequestSchema = z.object({
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  token: z.string(),
  userId: z.number(),
  name: z.string(),
  role: z.enum(['OWNER', 'MANAGER', 'TAILOR', 'ASSISTANT']),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
