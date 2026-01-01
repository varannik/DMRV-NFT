'use client'

/**
 * Projects Page
 * 
 * Lists all projects for the current tenant.
 */

import { motion } from 'framer-motion'
import { Plus, FolderKanban, Search } from 'lucide-react'
import { GlassCard, Button, StatusBadge, Input } from '@/components/shared'

// Demo data
const demoProjects = [
  { id: 'proj-1', name: 'Amazon Reforestation Project', registryType: 'verra', status: 'active' as const, tonnage: 45000, submissions: 12 },
  { id: 'proj-2', name: 'Direct Air Capture Facility', registryType: 'puro', status: 'active' as const, tonnage: 28000, submissions: 8 },
  { id: 'proj-3', name: 'EU Carbon Capture Site', registryType: 'eu_ets', status: 'draft' as const, tonnage: 0, submissions: 0 },
  { id: 'proj-4', name: 'Biochar Production', registryType: 'isometric', status: 'active' as const, tonnage: 15000, submissions: 5 },
]

const registryIcons: Record<string, string> = {
  verra: '🌍',
  puro: '🌱',
  isometric: '📐',
  eu_ets: '🇪🇺',
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-white/60">Manage your carbon credit projects</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          New Project
        </Button>
      </div>
      
      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search projects..."
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
      </div>
      
      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {demoProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover className="cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/10 flex items-center justify-center text-2xl">
                  {registryIcons[project.registryType]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {project.name}
                    </h3>
                    <StatusBadge status={project.status} size="sm" />
                  </div>
                  <p className="text-sm text-white/50 capitalize mb-3">
                    {project.registryType.replace('_', ' ')} Registry
                  </p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-white/50">Total Credits</span>
                      <p className="text-white font-medium">{project.tonnage.toLocaleString()} tCO₂e</p>
                    </div>
                    <div>
                      <span className="text-white/50">Submissions</span>
                      <p className="text-white font-medium">{project.submissions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

