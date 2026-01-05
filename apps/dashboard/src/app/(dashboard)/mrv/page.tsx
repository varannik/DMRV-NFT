'use client'

/**
 * MRV Submissions Page
 * 
 * Lists all MRV submissions with filtering and search.
 * Integrates with the registry-driven data injection system.
 */

import { motion } from 'framer-motion'
import { FileSpreadsheet, Filter, Download, Plus, ArrowRight, Building2 } from 'lucide-react'
import Link from 'next/link'
import { GlassCard, Button, StatusBadge, Input } from '@/components/shared'
import { useRegistryStore } from '@/lib/stores'

const demoSubmissions = [
  { id: 'mrv-001', project: 'Amazon Reforestation', registry: 'Verra', protocol: 'VM0042', date: '2024-01-15', tonnage: 15000, status: 'approved' as const },
  { id: 'mrv-002', project: 'Amazon Reforestation', registry: 'Verra', protocol: 'VM0042', date: '2024-01-10', tonnage: 12500, status: 'in_progress' as const },
  { id: 'mrv-003', project: 'Direct Air Capture', registry: 'Isometric', protocol: 'iso_dac', date: '2024-01-05', tonnage: 18000, status: 'approved' as const },
  { id: 'mrv-004', project: 'Biochar Production', registry: 'Puro', protocol: 'puro_biochar', date: '2024-01-01', tonnage: 9500, status: 'pending' as const },
  { id: 'mrv-005', project: 'Enhanced Weathering', registry: 'Isometric', protocol: 'iso_enhanced_weathering', date: '2023-12-28', tonnage: 7200, status: 'failed' as const },
]

export default function MRVPage() {
  const { reset: resetRegistry } = useRegistryStore()
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">MRV Submissions</h1>
          <p className="text-white/60">Track and manage your MRV data submissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Link href="/data-injection" onClick={() => resetRegistry()}>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              New Submission
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Quick Start Card */}
      <GlassCard className="p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Start Data Injection</h3>
              <p className="text-white/60 text-sm">
                Select a registry and protocol, then submit your MRV data
              </p>
            </div>
          </div>
          <Link href="/data-injection" onClick={() => resetRegistry()}>
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Started
            </Button>
          </Link>
        </div>
      </GlassCard>
      
      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input placeholder="Search submissions..." />
        </div>
        <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
          Filters
        </Button>
      </div>
      
      {/* Table */}
      <GlassCard className="overflow-hidden !p-0">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr className="text-left text-white/50 text-sm">
              <th className="p-4">Submission ID</th>
              <th className="p-4">Project</th>
              <th className="p-4">Registry / Protocol</th>
              <th className="p-4">Date</th>
              <th className="p-4">Net CORC</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoSubmissions.map((sub, index) => (
              <motion.tr
                key={sub.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
              >
                <td className="p-4 font-mono text-sm text-white">{sub.id}</td>
                <td className="p-4 text-white">{sub.project}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-white text-sm">{sub.registry}</span>
                    <span className="text-white/50 text-xs">{sub.protocol}</span>
                  </div>
                </td>
                <td className="p-4 text-white/70">{sub.date}</td>
                <td className="p-4 text-white font-medium">{sub.tonnage.toLocaleString()} tCO₂e</td>
                <td className="p-4">
                  <StatusBadge status={sub.status} size="sm" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}

