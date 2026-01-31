'use client'

/**
 * Analytics Page
 * 
 * Market analytics and insights for carbon credits.
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  DollarSign,
  Leaf,
  Award,
  Calendar,
} from 'lucide-react'
import clsx from 'clsx'
import { GlassCard } from '@/components/shared'
import { WalletConnect } from '@/components/marketplace'
import { mockMarketAnalytics, mockImpactMetrics } from '@/lib/data/marketplaceMockData'

// Methodology colors
const methodologyColors: Record<string, string> = {
  renewable_energy: '#3B82F6',
  forestry_land_use: '#22C55E',
  blue_carbon: '#0EA5E9',
  carbon_capture: '#8B5CF6',
  methane_management: '#F59E0B',
  soil_carbon: '#84CC16',
  energy_efficiency: '#EAB308',
  industrial_processes: '#6B7280',
  transportation: '#EC4899',
}

// Methodology display names
const methodologyNames: Record<string, string> = {
  renewable_energy: 'Renewable Energy',
  forestry_land_use: 'Forestry & Land Use',
  blue_carbon: 'Blue Carbon',
  carbon_capture: 'Carbon Capture',
  methane_management: 'Methane Management',
  soil_carbon: 'Soil Carbon',
  energy_efficiency: 'Energy Efficiency',
  industrial_processes: 'Industrial',
  transportation: 'Transportation',
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Market Analytics</h1>
          <p className="text-white/60 mt-1">
            Insights and trends in the carbon credit market
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg bg-white/10 p-1">
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-sm transition',
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <WalletConnect compact />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/60">Trading Volume</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(mockMarketAnalytics.totalVolume7d)}
                </p>
                <p className="text-sm text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +18.5% vs last period
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/60">Average Price</p>
                <p className="text-2xl font-bold text-white mt-1">
                  ${mockMarketAnalytics.avgPrice.toFixed(2)}
                </p>
                <p className={clsx(
                  'text-sm flex items-center gap-1 mt-1',
                  mockMarketAnalytics.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {mockMarketAnalytics.priceChange24h >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {mockMarketAnalytics.priceChange24h >= 0 ? '+' : ''}{mockMarketAnalytics.priceChange24h}% 24h
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/20">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/60">Daily Transactions</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {mockMarketAnalytics.totalTransactions24h.toLocaleString()}
                </p>
                <p className="text-sm text-green-400 flex items-center gap-1 mt-1">
                  <Activity className="w-4 h-4" />
                  +12% vs yesterday
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/60">Total CO₂ Retired</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {(mockImpactMetrics.totalCo2Offset / 1000).toFixed(1)}K tons
                </p>
                <p className="text-sm text-green-400 flex items-center gap-1 mt-1">
                  <Award className="w-4 h-4" />
                  {mockImpactMetrics.totalRetirements} retirements
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Leaf className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Projects */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Top Projects by Volume</h3>
          <div className="space-y-3">
            {mockMarketAnalytics.topProjects.map((project, index) => (
              <div key={project.projectName} className="flex items-center gap-4">
                <span className="w-6 text-center text-white/50 font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-white font-medium">{project.projectName}</p>
                  <div className="mt-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(project.volume / mockMarketAnalytics.topProjects[0].volume) * 100}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  </div>
                </div>
                <span className="text-white/60">{formatCurrency(project.volume)}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Price by Methodology */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Average Price by Methodology</h3>
          <div className="space-y-3">
            {Object.entries(mockMarketAnalytics.priceByMethodology)
              .filter(([_, price]) => price > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([methodology, price], index) => (
                <div key={methodology} className="flex items-center gap-4">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: methodologyColors[methodology] }}
                  />
                  <span className="flex-1 text-white/70">
                    {methodologyNames[methodology]}
                  </span>
                  <span className="font-semibold text-white">${price.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </GlassCard>
      </div>

      {/* Methodology Distribution */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Market Distribution by Methodology</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(mockImpactMetrics.byMethodology)
            .filter(([_, value]) => value > 0)
            .map(([methodology, value]) => {
              const total = Object.values(mockImpactMetrics.byMethodology).reduce((sum, v) => sum + v, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              
              return (
                <motion.div
                  key={methodology}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-4 rounded-xl bg-white/5"
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${methodologyColors[methodology]}20` }}
                  >
                    <span 
                      className="text-lg font-bold"
                      style={{ color: methodologyColors[methodology] }}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium">
                    {methodologyNames[methodology]}
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {value.toLocaleString()} tons
                  </p>
                </motion.div>
              )
            })}
        </div>
      </GlassCard>

      {/* Impact Timeline */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">CO₂ Offset Timeline</h3>
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-white/50">
            <span>3K</span>
            <span>2K</span>
            <span>1K</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-14 h-full flex items-end gap-4 pb-8">
            {mockImpactMetrics.timeline.map((point, index) => {
              const maxValue = Math.max(...mockImpactMetrics.timeline.map(p => p.co2))
              const height = (point.co2 / maxValue) * 100
              
              return (
                <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-green-500 to-emerald-400"
                    style={{ minHeight: 4 }}
                  />
                  <span className="text-xs text-white/50">{point.date}</span>
                </div>
              )
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
