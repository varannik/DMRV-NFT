'use client'

/**
 * MarketplaceStats Component
 * 
 * Display key marketplace metrics and stats.
 */

import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Coins,
  ShoppingCart,
  Leaf,
  Activity,
  Users,
  BarChart3,
} from 'lucide-react'
import clsx from 'clsx'
import { GlassCard } from '@/components/shared'

interface StatCardProps {
  title: string
  value: string
  subValue?: string
  change?: {
    value: number
    label: string
  }
  icon: React.ReactNode
  iconBg: string
  delay?: number
}

function StatCard({ title, value, subValue, change, icon, iconBg, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
    >
      <GlassCard className="h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-white/60 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            {subValue && (
              <p className="text-sm text-white/50">{subValue}</p>
            )}
            {change && (
              <div className={clsx(
                'flex items-center gap-1 mt-2 text-sm',
                change.value >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {change.value >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{change.value >= 0 ? '+' : ''}{change.value}%</span>
                <span className="text-white/40">{change.label}</span>
              </div>
            )}
          </div>
          <div className={clsx('p-3 rounded-xl', iconBg)}>
            {icon}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

interface MarketplaceStatsProps {
  stats: {
    totalVolume24h: number
    totalTransactions24h: number
    avgPrice: number
    priceChange24h: number
    activeListings: number
    totalCredits: number
  }
}

export function MarketplaceStats({ stats }: MarketplaceStatsProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="24h Trading Volume"
        value={formatCurrency(stats.totalVolume24h)}
        change={{
          value: 12.5,
          label: 'vs yesterday',
        }}
        icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
        iconBg="bg-blue-500/20"
        delay={0}
      />
      <StatCard
        title="Total Transactions"
        value={stats.totalTransactions24h.toLocaleString()}
        subValue="in 24 hours"
        icon={<Activity className="w-5 h-5 text-purple-400" />}
        iconBg="bg-purple-500/20"
        delay={1}
      />
      <StatCard
        title="Average Price"
        value={`$${stats.avgPrice.toFixed(2)}`}
        subValue="per credit"
        change={{
          value: stats.priceChange24h,
          label: '24h',
        }}
        icon={<Coins className="w-5 h-5 text-amber-400" />}
        iconBg="bg-amber-500/20"
        delay={2}
      />
      <StatCard
        title="Available Credits"
        value={`${(stats.totalCredits / 1000).toFixed(1)}K`}
        subValue={`${stats.activeListings} active listings`}
        icon={<Leaf className="w-5 h-5 text-green-400" />}
        iconBg="bg-green-500/20"
        delay={3}
      />
    </div>
  )
}

interface PortfolioStatsProps {
  stats: {
    totalCredits: number
    totalValueUsd: number
    totalValueNear: number
    totalCo2Offset: number
    percentChange24h: number
    percentChange7d: number
    percentChange30d: number
  }
}

export function PortfolioStats({ stats }: PortfolioStatsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Portfolio Value"
        value={formatCurrency(stats.totalValueUsd)}
        subValue={`${stats.totalValueNear.toLocaleString()} NEAR`}
        change={{
          value: stats.percentChange24h,
          label: '24h',
        }}
        icon={<Coins className="w-5 h-5 text-blue-400" />}
        iconBg="bg-blue-500/20"
        delay={0}
      />
      <StatCard
        title="Total Credits"
        value={stats.totalCredits.toLocaleString()}
        subValue="carbon credits owned"
        icon={<ShoppingCart className="w-5 h-5 text-purple-400" />}
        iconBg="bg-purple-500/20"
        delay={1}
      />
      <StatCard
        title="CO₂ Offset"
        value={`${stats.totalCo2Offset.toLocaleString()} tons`}
        subValue="total environmental impact"
        icon={<Leaf className="w-5 h-5 text-green-400" />}
        iconBg="bg-green-500/20"
        delay={2}
      />
      <StatCard
        title="30 Day Performance"
        value={`${stats.percentChange30d >= 0 ? '+' : ''}${stats.percentChange30d.toFixed(2)}%`}
        change={{
          value: stats.percentChange7d,
          label: '7d',
        }}
        icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
        iconBg="bg-amber-500/20"
        delay={3}
      />
    </div>
  )
}
