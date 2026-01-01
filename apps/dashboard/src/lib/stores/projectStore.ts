/**
 * Project Store
 * 
 * Manages project state including selected project and project list.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Project, UUID } from '@/types'

interface ProjectState {
  projects: Project[]
  selectedProjectId: UUID | null
  isLoading: boolean
  error: string | null
  setProjects: (projects: Project[]) => void
  selectProject: (projectId: UUID | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  getSelectedProject: () => Project | undefined
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      projects: [],
      selectedProjectId: null,
      isLoading: false,
      error: null,
      
      setProjects: (projects) => set({ projects }),
      
      selectProject: (projectId) => set({ selectedProjectId: projectId }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      getSelectedProject: () => {
        const state = get()
        return state.projects.find(p => p.project_id === state.selectedProjectId)
      },
    }),
    { name: 'ProjectStore' }
  )
)

