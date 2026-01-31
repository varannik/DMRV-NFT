'use client'

/**
 * Portfolio Page
 * 
 * User's carbon credit portfolio with holdings, retirements, and impact metrics.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  Leaf,
  Award,
  FileText,
  Download,
  Grid3X3,
  List,
  TreePine,
  Car,
  Home,
  Droplets,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import clsx from 'clsx'
import { usePortfolioStore } from '@/lib/stores'
import { GlassCard } from '@/components/shared'
import { PortfolioStats, WalletConnect } from '@/components/marketplace'
import { 
  mockPortfolioHoldings, 
  mockPortfolioSummary, 
  mockTransactions,
  mockRetirements,
  mockImpactMetrics,
} from '@/lib/data/marketplaceMockData'

// Registry display config
const registryColors: Record<string, string> = {
  verra: 'from-green-500 to-emerald-600',
  gold_standard: 'from-amber-500 to-yellow-600',
  acr: 'from-blue-500 to-indigo-600',
  car: 'from-purple-500 to-violet-600',
}

export default function PortfolioPage() {
  const {
    holdings,
    setHoldings,
    summary,
    setSummary,
    transactions,
    setTransactions,
    retirements,
    setRetirements,
    impactMetrics,
    setImpactMetrics,
    holdingsView,
    setHoldingsView,
  } = usePortfolioStore()

  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions' | 'impact'>('holdings')
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setHoldings(mockPortfolioHoldings)
      setSummary(mockPortfolioSummary)
      setTransactions(mockTransactions)
      setRetirements(mockRetirements)
      setImpactMetrics(mockImpactMetrics)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [setHoldings, setSummary, setTransactions, setRetirements, setImpactMetrics])

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Portfolio</h1>
          <p className="text-white/60 mt-1">
            Manage your carbon credit holdings and track your impact
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <WalletConnect />
        </div>
      </div>

      {/* Portfolio Stats */}
      {summary && <PortfolioStats stats={summary} />}

      {/* Registry Breakdown */}
      {summary && (
        <GlassCard>
          <h2 className="text-lg font-semibold text-white mb-4">Holdings by Registry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(summary.byRegistry)
              .filter(([_, data]) => data.credits > 0)
              .map(([registry, data]) => (
                <div
                  key={registry}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={clsx(
                      'w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br',
                      registryColors[registry] || 'from-gray-500 to-slate-600'
                    )}>
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white capitalize">
                        {registry.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-white/50">Registry</p>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-white">
                      {data.credits.toLocaleString()}
                    </span>
                    <span className="text-sm text-white/50">credits</span>
                  </div>
                  <p className="text-sm text-white/60 mt-1">
                    {formatCurrency(data.valueUsd)}
                  </p>
                </div>
              ))}
          </div>
        </GlassCard>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {(['holdings', 'transactions', 'impact'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition',
              activeTab === tab
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'holdings' && (
          <motion.div
            key="holdings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="!p-0 overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-medium text-white">
                  {holdings.length} Holdings
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg bg-white/10 p-1">
                    <button
                      onClick={() => setHoldingsView('grid')}
                      className={clsx(
                        'p-1.5 rounded transition',
                        holdingsView === 'grid' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setHoldingsView('table')}
                      className={clsx(
                        'p-1.5 rounded transition',
                        holdingsView === 'table' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Holdings Table */}
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                </div>
              ) : holdingsView === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-left">
                        <th className="px-4 py-3 text-xs text-white/50 font-medium uppercase">Project</th>
                        <th className="px-4 py-3 text-xs text-white/50 font-medium uppercase">Registry</th>
                        <th className="px-4 py-3 text-xs text-white/50 font-medium uppercase">Quantity</th>
                        <th className="px-4 py-3 text-xs text-white/50 font-medium uppercase">Avg Price</th>
                        <th className="px-4 py-3 text-xs text-white/50 font-medium uppercase">Current Value</th>
                        <th className="px-4 py-3 text-xs text-white/50 font-medium uppercase">Change</th>
                        <th className="px-4 py-3 text-xs text-white/50 font-medium uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((holding) => (
                        <tr key={holding.credit.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-white">{holding.credit.projectName}</p>
                              <p className="text-xs text-white/50">{holding.credit.methodology.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={clsx(
                              'px-2 py-1 rounded text-xs font-medium text-white bg-gradient-to-r',
                              registryColors[holding.credit.registry] || 'from-gray-500 to-slate-600'
                            )}>
                              {holding.credit.registry.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-white">
                            {holding.quantity.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-white">
                            {formatCurrency(holding.purchasePriceUsd)}
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-white">{formatCurrency(holding.currentValueUsd)}</p>
                              <p className="text-xs text-white/50">{holding.currentValueNear.toLocaleString()} NEAR</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={clsx(
                              'flex items-center gap-1',
                              holding.percentChange >= 0 ? 'text-green-400' : 'text-red-400'
                            )}>
                              {holding.percentChange >= 0 ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              {holding.percentChange >= 0 ? '+' : ''}{holding.percentChange.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition">
                                Sell
                              </button>
                              <button className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition">
                                Retire
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {holdings.map((holding) => (
                    <div
                      key={holding.credit.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-white">{holding.credit.projectName}</p>
                          <p className="text-xs text-white/50 mt-1">{holding.credit.methodology.name}</p>
                        </div>
                        <span className={clsx(
                          'flex items-center gap-1 text-sm',
                          holding.percentChange >= 0 ? 'text-green-400' : 'text-red-400'
                        )}>
                          {holding.percentChange >= 0 ? '+' : ''}{holding.percentChange.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-2xl font-bold text-white">{holding.quantity}</span>
                        <span className="text-sm text-white/50">credits</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{formatCurrency(holding.currentValueUsd)}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition">
                          Sell
                        </button>
                        <button className="flex-1 px-3 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition">
                          Retire
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="!p-0 overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-medium text-white">Transaction History</h3>
              </div>
              <div className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center gap-4 hover:bg-white/5">
                    <div className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      tx.type === 'buy' && 'bg-green-500/20',
                      tx.type === 'sell' && 'bg-blue-500/20',
                      tx.type === 'retire' && 'bg-amber-500/20',
                      tx.type === 'transfer' && 'bg-purple-500/20',
                    )}>
                      {tx.type === 'buy' && <TrendingUp className="w-5 h-5 text-green-400" />}
                      {tx.type === 'sell' && <TrendingDown className="w-5 h-5 text-blue-400" />}
                      {tx.type === 'retire' && <Award className="w-5 h-5 text-amber-400" />}
                      {tx.type === 'transfer' && <ArrowRight className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white capitalize">{tx.type}</span>
                        <span className="text-white/50">·</span>
                        <span className="text-white/60">{tx.credit.projectName}</span>
                      </div>
                      <p className="text-sm text-white/50">{formatDate(tx.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{tx.quantity} credits</p>
                      <p className="text-sm text-white/50">{formatCurrency(tx.priceUsd)}</p>
                    </div>
                    <a
                      href={`https://explorer.near.org/transactions/${tx.nearTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'impact' && impactMetrics && (
          <motion.div
            key="impact"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Impact Overview */}
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-6">Environmental Impact</h2>
              <div className="text-center mb-8">
                <p className="text-sm text-white/50 mb-2">Total CO₂ Offset</p>
                <p className="text-5xl font-bold text-green-400">
                  {impactMetrics.totalCo2Offset.toLocaleString()}
                </p>
                <p className="text-lg text-white/60">tons of CO₂</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <Car className="w-7 h-7 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{impactMetrics.equivalentCars}</p>
                  <p className="text-sm text-white/50">Cars off road/year</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                    <TreePine className="w-7 h-7 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{(impactMetrics.equivalentTrees / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-white/50">Trees grown 10 years</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                    <Home className="w-7 h-7 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{impactMetrics.equivalentHomes}</p>
                  <p className="text-sm text-white/50">Homes powered/year</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                    <Droplets className="w-7 h-7 text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{(impactMetrics.equivalentMiles / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-white/50">Miles not driven</p>
                </div>
              </div>
            </GlassCard>

            {/* Retirements */}
            <GlassCard className="!p-0 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-medium text-white">Retirement Certificates</h3>
                <span className="text-sm text-white/50">{retirements.length} retirements</span>
              </div>
              <div className="divide-y divide-white/5">
                {retirements.map((retirement) => (
                  <div key={retirement.id} className="p-4 flex items-center gap-4 hover:bg-white/5">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{retirement.quantity} credits retired</span>
                      </div>
                      <p className="text-sm text-white/50">
                        {retirement.beneficiaryName} · {formatDate(retirement.retiredAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/60 font-mono">{retirement.certificateId}</p>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition">
                      <FileText className="w-4 h-4" />
                      Certificate
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
