'use client'

/**
 * ProjectSelector Component
 * 
 * Dropdown to select the active project for viewing MRV submissions.
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { ChevronDown, FolderKanban, Check, Search } from 'lucide-react'
import { GlassCard } from '@/components/shared'
import type { RegistryType } from '@/types'

interface Project {
  id: string
  name: string
  registryType: RegistryType
  status: string
}

interface ProjectSelectorProps {
  projects: Project[]
  selectedProjectId: string | null
  onProjectSelect: (projectId: string) => void
  isLoading?: boolean
}

const registryIcons: Record<RegistryType, string> = {
  verra: '🌍',
  puro: '🌱',
  isometric: '📐',
  eu_ets: '🇪🇺',
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onProjectSelect,
  isLoading,
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const selectedProject = projects.find(p => p.id === selectedProjectId)
  
  // Filter projects based on search
  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleSelect = (projectId: string) => {
    onProjectSelect(projectId)
    setIsOpen(false)
    setSearchQuery('')
  }
  
  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={clsx(
          'flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl',
          'glass glass-hover w-full sm:min-w-[280px] sm:w-auto',
          'text-left transition-all duration-200',
          isOpen && 'ring-2 ring-green-500/50'
        )}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-green-500/30 to-emerald-500/10 flex items-center justify-center flex-shrink-0">
          <FolderKanban className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/50">Selected Project</p>
          {isLoading ? (
            <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
          ) : selectedProject ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white truncate">
                {selectedProject.name}
              </span>
              <span className="text-sm">
                {registryIcons[selectedProject.registryType]}
              </span>
            </div>
          ) : (
            <p className="text-sm text-white/70">Select a project</p>
          )}
        </div>
        <ChevronDown className={clsx(
          'w-5 h-5 text-white/50 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <GlassCard className="!p-2 max-h-80 overflow-hidden flex flex-col" variant="strong">
              {/* Search Input */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 bg-white/5 rounded-lg border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-green-500/50"
                  autoFocus
                />
              </div>
              
              {/* Projects List */}
              <div className="overflow-y-auto">
                {filteredProjects.length === 0 ? (
                  <p className="text-sm text-white/50 text-center py-4">
                    No projects found
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {filteredProjects.map((project) => (
                      <li key={project.id}>
                        <button
                          onClick={() => handleSelect(project.id)}
                          className={clsx(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                            'text-left transition-all duration-150',
                            project.id === selectedProjectId
                              ? 'bg-green-500/20 text-white'
                              : 'text-white/70 hover:bg-white/10 hover:text-white'
                          )}
                        >
                          <span className="text-lg">
                            {registryIcons[project.registryType]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {project.name}
                            </p>
                            <p className="text-xs text-white/50 capitalize">
                              {project.status}
                            </p>
                          </div>
                          {project.id === selectedProjectId && (
                            <Check className="w-4 h-4 text-green-400" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

