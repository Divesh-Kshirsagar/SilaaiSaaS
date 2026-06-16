import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserRole } from '../constants/enums';

interface AuthUser {
  userId: number;
  name: string;
  role: UserRole;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => get().token !== null,
    }),
    {
      name: 'silaai-auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
