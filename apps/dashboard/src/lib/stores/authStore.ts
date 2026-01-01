/**
 * Auth Store
 * 
 * Manages authentication state including user, tokens, and MFA.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  mfaRequired: boolean
  mfaSessionToken: string | null
  
  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setMfaRequired: (required: boolean, sessionToken?: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        mfaRequired: false,
        mfaSessionToken: null,
        
        setUser: (user) => set({ 
          user, 
          isAuthenticated: !!user,
        }),
        
        setTokens: (accessToken, refreshToken) => set({ 
          accessToken, 
          refreshToken,
          isAuthenticated: true,
          mfaRequired: false,
          mfaSessionToken: null,
        }),
        
        setMfaRequired: (required, sessionToken) => set({ 
          mfaRequired: required,
          mfaSessionToken: sessionToken ?? null,
        }),
        
        logout: () => set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false,
          mfaRequired: false,
          mfaSessionToken: null,
        }),
        
        setLoading: (isLoading) => set({ isLoading }),
      }),
      {
        name: 'dmrv-auth-storage',
        partialize: (state) => ({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
)

