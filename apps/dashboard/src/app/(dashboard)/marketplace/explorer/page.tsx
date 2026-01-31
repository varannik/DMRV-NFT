'use client'

/**
 * NEAR Explorer Page
 * 
 * Blockchain explorer for carbon credit transactions on NEAR.
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Globe,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Zap,
  Server,
  Activity,
  Hash,
  ArrowRight,
  Copy,
  Check,
  ShoppingCart,
  Award,
  TrendingUp,
  TrendingDown,
  FileCode,
} from 'lucide-react'
import clsx from 'clsx'
import { useWalletStore } from '@/lib/stores'
import { GlassCard } from '@/components/shared'
import { WalletConnect } from '@/components/marketplace'
import { mockTransactions, mockNetworkStatus } from '@/lib/data/marketplaceMockData'

const transactionTypeConfig = {
  buy: { icon: ShoppingCart, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Purchase' },
  sell: { icon: TrendingDown, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Sale' },
  retire: { icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Retirement' },
  transfer: { icon: ArrowRight, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Transfer' },
}

export default function NEARExplorerPage() {
  const { networkStatus } = useWalletStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const handleCopyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    return new Date(date).toLocaleDateString()
  }

  // Use mock data if store is empty
  const status = networkStatus || mockNetworkStatus

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">NEAR Explorer</h1>
          <p className="text-white/60 mt-1">
            Track carbon credit transactions on the NEAR blockchain
          </p>
        </div>
        <WalletConnect />
      </div>

      {/* Network Status */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className={clsx(
            'w-10 h-10 rounded-full flex items-center justify-center',
            status.isHealthy ? 'bg-green-500/20' : 'bg-red-500/20'
          )}>
            <Globe className={clsx('w-5 h-5', status.isHealthy ? 'text-green-400' : 'text-red-400')} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">NEAR Protocol Network</h2>
            <div className="flex items-center gap-2">
              <span className={clsx(
                'w-2 h-2 rounded-full',
                status.isHealthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              )} />
              <span className={clsx(
                'text-sm',
                status.isHealthy ? 'text-green-400' : 'text-red-400'
              )}>
                {status.isHealthy ? 'Healthy' : 'Issues Detected'}
              </span>
              <span className="text-white/30">·</span>
              <span className="text-sm text-white/50 uppercase">{status.network}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 text-white/50 mb-1">
              <Hash className="w-4 h-4" />
              <span className="text-xs">Block Height</span>
            </div>
            <p className="font-mono text-lg font-semibold text-white">
              {status.blockHeight.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 text-white/50 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs">TPS</span>
            </div>
            <p className="font-mono text-lg font-semibold text-white">{status.tps}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 text-white/50 mb-1">
              <Server className="w-4 h-4" />
              <span className="text-xs">Validators</span>
            </div>
            <p className="font-mono text-lg font-semibold text-white">{status.activeValidators}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 text-white/50 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-xs">Total TXs</span>
            </div>
            <p className="font-mono text-lg font-semibold text-white">
              {(status.totalTransactions / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 text-white/50 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Block Time</span>
            </div>
            <p className="font-mono text-lg font-semibold text-white">{status.avgBlockTime}s</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 text-white/50 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs">Gas Price</span>
            </div>
            <p className="font-mono text-lg font-semibold text-white">{status.gasPrice} Ⓝ</p>
          </div>
        </div>
      </GlassCard>

      {/* Smart Contract Info */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Carbon Credit Smart Contract</h3>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Audited
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/50 mb-1">Contract Address</p>
            <div className="flex items-center gap-2">
              <code className="text-white font-mono">carbon-credits.near</code>
              <button
                onClick={() => handleCopyHash('carbon-credits.near')}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
              >
                {copiedHash === 'carbon-credits.near' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <a
                href="https://explorer.near.org/accounts/carbon-credits.near"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm text-white/50 mb-1">Contract Type</p>
            <p className="text-white">NEP-141 (Fungible Token)</p>
          </div>
          <div>
            <p className="text-sm text-white/50 mb-1">Last Audit</p>
            <p className="text-white">December 2025 by CertiK</p>
          </div>
          <div>
            <p className="text-sm text-white/50 mb-1">Contract Version</p>
            <p className="text-white">v2.1.0</p>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-white/5">
          <p className="text-sm text-white/50 mb-2">Available Functions:</p>
          <div className="flex flex-wrap gap-2">
            {['mint_credits', 'transfer_credits', 'burn_credits', 'list_for_sale', 'buy_credits', 'get_balance'].map((fn) => (
              <code key={fn} className="px-2 py-1 rounded bg-white/10 text-xs text-white/70">
                {fn}()
              </code>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Search */}
      <GlassCard className="!p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search by transaction hash, wallet address, or block number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition"
          />
        </div>
      </GlassCard>

      {/* Recent Transactions */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-white">Recent Transactions</h3>
          <span className="text-sm text-white/50">
            Last {mockTransactions.length} transactions
          </span>
        </div>
        <div className="divide-y divide-white/5">
          {mockTransactions.map((tx, index) => {
            const config = transactionTypeConfig[tx.type]
            const Icon = config.icon
            
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-white/5 transition"
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={clsx('w-10 h-10 rounded-full flex items-center justify-center', config.bg)}>
                    <Icon className={clsx('w-5 h-5', config.color)} />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={clsx('font-medium', config.color)}>{config.label}</span>
                      <span className="text-white/30">·</span>
                      <span className="text-white/60">{tx.quantity} credits</span>
                      <span className="text-white/30">·</span>
                      <span className="text-white">{tx.credit.projectName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-sm text-white/50 font-mono">{tx.nearTxHash}</code>
                      <button
                        onClick={() => handleCopyHash(tx.nearTxHash)}
                        className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition"
                      >
                        {copiedHash === tx.nearTxHash ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                      <span>Block #{tx.blockNumber.toLocaleString()}</span>
                      <span>{formatTime(tx.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        {tx.confirmations} confirmations
                      </span>
                    </div>
                  </div>

                  {/* Value & Link */}
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      ${tx.priceUsd.toLocaleString()}
                    </p>
                    <p className="text-sm text-white/50">
                      {tx.priceNear.toLocaleString()} NEAR
                    </p>
                    <a
                      href={`https://explorer.near.org/transactions/${tx.nearTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-blue-400 hover:text-blue-300 text-sm transition"
                    >
                      View
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
