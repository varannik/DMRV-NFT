/**
 * Sidebar Store
 * 
 * Manages the state of the sidebar (expanded/collapsed) using Zustand.
 * Persists state to localStorage.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SidebarState {
  isExpanded: boolean
  activeSection: string | null
  toggle: () => void
  expand: () => void
  collapse: () => void
  setActiveSection: (section: string | null) => void
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set) => ({
        isExpanded: true,
        activeSection: null,
        toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
        expand: () => set({ isExpanded: true }),
        collapse: () => set({ isExpanded: false }),
        setActiveSection: (section) => set({ activeSection: section }),
      }),
      {
        name: 'dmrv-sidebar-storage',
      }
    ),
    { name: 'SidebarStore' }
  )
)

