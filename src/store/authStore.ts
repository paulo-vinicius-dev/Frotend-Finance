import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserResponse } from '@/types/api'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserResponse | null
  isAuthenticated: boolean
  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: UserResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, user: null, isAuthenticated: true }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'finance-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Specific selectors
export const useIsAuthenticated = () =>
  useAuthStore((s) => s.isAuthenticated)
export const useCurrentUser = () => useAuthStore((s) => s.user)
export const useAccessToken = () => useAuthStore((s) => s.accessToken)
