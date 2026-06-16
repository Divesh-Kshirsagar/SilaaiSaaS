import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { LoginResponseSchema, type LoginRequest } from '../schemas/auth';

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (req: LoginRequest) => {
      const res = await api.post('/auth/login', req);
      return LoginResponseSchema.parse(res.data);
    },
    onSuccess: (data) => {
      login(data.token, { userId: data.userId, name: data.name, role: data.role });
    },
  });
}
