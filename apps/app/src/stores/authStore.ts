import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'OWNER' | 'MANAGER' | 'TAILOR' | 'ASSISTANT'

interface AuthState {
  token: string | null
  userId: number | null
  name: string | null
  role: UserRole | null
  shopId: number | null
  orgId: number | null
  shopName: string | null
  isAuthenticated: boolean
  login: (data: {
    token: string
    userId: number
    name: string
    role: string
    shopId: number
    orgId: number
    shopName: string
  }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      name: null,
      role: null,
      shopId: null,
      orgId: null,
      shopName: null,
      isAuthenticated: false,

      login: (data) =>
        set({
          token: data.token,
          userId: data.userId,
          name: data.name,
          role: data.role as UserRole,
          shopId: data.shopId,
          orgId: data.orgId,
          shopName: data.shopName,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          userId: null,
          name: null,
          role: null,
          shopId: null,
          orgId: null,
          shopName: null,
          isAuthenticated: false,
        }),
    }),
    { name: 'silaai-auth' }
  )
)
