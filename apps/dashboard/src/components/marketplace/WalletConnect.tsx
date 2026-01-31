'use client'

/**
 * WalletConnect Component
 * 
 * NEAR wallet connection button with balance display.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  ChevronDown, 
  ExternalLink, 
  Copy, 
  Check, 
  LogOut,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react'
import clsx from 'clsx'
import { useWalletStore } from '@/lib/stores'
import { GlassCard } from '@/components/shared'

interface WalletConnectProps {
  className?: string
  compact?: boolean
}

export function WalletConnect({ className, compact = false }: WalletConnectProps) {
  const { 
    isConnected, 
    accountId, 
    balance, 
    network,
    networkStatus,
    isConnecting,
    connect, 
    disconnect,
    refreshBalance,
  } = useWalletStore()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleCopyAddress = async () => {
    if (accountId) {
      await navigator.clipboard.writeText(accountId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshBalance()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const formatBalance = (amount: number) => {
    return amount.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200',
          'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
          'text-white font-medium shadow-lg shadow-blue-500/25',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
      >
        {isConnecting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            {!compact && <span>Connecting...</span>}
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            {!compact && <span>Connect Wallet</span>}
          </>
        )}
      </button>
    )
  }

  return (
    <div className={clsx('relative', className)}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={clsx(
          'flex items-center gap-3 px-3 py-2 rounded-xl glass transition-all duration-200',
          'hover:bg-white/15 border border-white/10',
          isDropdownOpen && 'bg-white/15 border-white/20'
        )}
      >
        {/* Network Status Indicator */}
        <div className="flex items-center gap-1.5">
          <div className={clsx(
            'w-2 h-2 rounded-full',
            networkStatus.isHealthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          )} />
          {!compact && (
            <span className="text-xs text-white/50 uppercase">{network}</span>
          )}
        </div>

        {/* Balance */}
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-white">
            {formatBalance(balance.near)} NEAR
          </span>
          {!compact && (
            <span className="text-xs text-white/50">
              ${formatBalance(balance.usd)}
            </span>
          )}
        </div>

        {/* Account Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-white" />
        </div>

        <ChevronDown className={clsx(
          'w-4 h-4 text-white/50 transition-transform',
          isDropdownOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsDropdownOpen(false)} 
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-72 z-50"
            >
              <GlassCard variant="dropdown" className="!p-0 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50 uppercase tracking-wide">
                      Connected Wallet
                    </span>
                    <div className="flex items-center gap-1.5">
                      {networkStatus.isHealthy ? (
                        <Wifi className="w-3 h-3 text-green-400" />
                      ) : (
                        <WifiOff className="w-3 h-3 text-red-400" />
                      )}
                      <span className={clsx(
                        'text-xs',
                        networkStatus.isHealthy ? 'text-green-400' : 'text-red-400'
                      )}>
                        {networkStatus.isHealthy ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Account Address */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {accountId}
                      </p>
                      <p className="text-xs text-white/50">
                        NEAR {network === 'mainnet' ? 'Mainnet' : 'Testnet'}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="p-2 rounded-lg hover:bg-white/10 transition text-white/50 hover:text-white"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Balance Section */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/50 uppercase tracking-wide">
                      Balance
                    </span>
                    <button
                      onClick={handleRefresh}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/50 hover:text-white"
                      title="Refresh balance"
                    >
                      <RefreshCw className={clsx(
                        'w-3.5 h-3.5',
                        isRefreshing && 'animate-spin'
                      )} />
                    </button>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      {formatBalance(balance.near)}
                    </span>
                    <span className="text-sm text-white/50">NEAR</span>
                  </div>
                  <p className="text-sm text-white/50 mt-1">
                    ≈ ${formatBalance(balance.usd)} USD
                  </p>
                </div>

                {/* Network Stats */}
                <div className="p-4 border-b border-white/10">
                  <span className="text-xs text-white/50 uppercase tracking-wide">
                    Network Stats
                  </span>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className="text-xs text-white/50">Block Height</p>
                      <p className="text-sm font-medium text-white font-mono">
                        {networkStatus.blockHeight.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">TPS</p>
                      <p className="text-sm font-medium text-white">
                        {networkStatus.tps}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Gas Price</p>
                      <p className="text-sm font-medium text-white">
                        {networkStatus.gasPrice} Ⓝ
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Validators</p>
                      <p className="text-sm font-medium text-white">
                        {networkStatus.activeValidators}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <a
                    href={`https://explorer.${network === 'mainnet' ? '' : 'testnet.'}near.org/accounts/${accountId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">View on Explorer</span>
                  </a>
                  <button
                    onClick={() => {
                      disconnect()
                      setIsDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Disconnect</span>
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
