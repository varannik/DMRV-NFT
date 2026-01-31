/**
 * App Mode Store
 * 
 * Manages the current application mode (DMRV or Marketplace).
 * Persists state to localStorage.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type AppMode = 'dmrv' | 'marketplace'

interface AppModeState {
  mode: AppMode
  setMode: (mode: AppMode) => void
  toggleMode: () => void
}

export const useAppModeStore = create<AppModeState>()(
  devtools(
    persist(
      (set) => ({
        mode: 'dmrv',
        setMode: (mode) => set({ mode }),
        toggleMode: () => set((state) => ({ 
          mode: state.mode === 'dmrv' ? 'marketplace' : 'dmrv' 
        })),
      }),
      {
        name: 'dmrv-app-mode-storage',
      }
    ),
    { name: 'AppModeStore' }
  )
)
