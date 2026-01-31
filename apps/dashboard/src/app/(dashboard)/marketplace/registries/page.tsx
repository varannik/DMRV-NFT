'use client'

/**
 * My Registries Page
 * 
 * Manage connected carbon credit registry accounts.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Plus,
  CheckCircle2,
  ExternalLink,
  Trash2,
  RefreshCw,
  Shield,
  Key,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react'
import clsx from 'clsx'
import { usePortfolioStore } from '@/lib/stores'
import { GlassCard } from '@/components/shared'
import { WalletConnect } from '@/components/marketplace'
import { mockRegistryConnections, registryInfoList } from '@/lib/data/marketplaceMockData'
import type { MarketplaceRegistry, UserRegistryConnection } from '@/types/marketplace'

// Registry colors and info
const registryConfig: Record<string, { color: string; gradient: string }> = {
  verra: { color: 'text-green-400', gradient: 'from-green-500 to-emerald-600' },
  gold_standard: { color: 'text-amber-400', gradient: 'from-amber-500 to-yellow-600' },
  acr: { color: 'text-blue-400', gradient: 'from-blue-500 to-indigo-600' },
  car: { color: 'text-purple-400', gradient: 'from-purple-500 to-violet-600' },
  gcc: { color: 'text-teal-400', gradient: 'from-teal-500 to-cyan-600' },
  art: { color: 'text-rose-400', gradient: 'from-rose-500 to-pink-600' },
  plan_vivo: { color: 'text-lime-400', gradient: 'from-lime-500 to-green-600' },
}

export default function RegistriesPage() {
  const { 
    registryConnections, 
    setRegistryConnections, 
    addRegistryConnection,
    removeRegistryConnection,
  } = usePortfolioStore()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedRegistry, setSelectedRegistry] = useState<MarketplaceRegistry | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [formData, setFormData] = useState({
    accountId: '',
    apiKey: '',
    apiSecret: '',
  })

  // Initialize data
  useEffect(() => {
    setRegistryConnections(mockRegistryConnections)
  }, [setRegistryConnections])

  const connectedRegistryIds = registryConnections.map(c => c.registry)
  const availableRegistries = registryInfoList.filter(r => !connectedRegistryIds.includes(r.id))

  const handleConnect = async () => {
    if (!selectedRegistry || !formData.accountId) return

    setIsConnecting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newConnection: UserRegistryConnection = {
      id: `conn-${Date.now()}`,
      registry: selectedRegistry,
      accountId: formData.accountId,
      isVerified: true,
      credits: Math.floor(Math.random() * 1000) + 100,
      connectedAt: new Date().toISOString(),
    }

    addRegistryConnection(newConnection)
    setIsConnecting(false)
    setIsAddModalOpen(false)
    setSelectedRegistry(null)
    setFormData({ accountId: '', apiKey: '', apiSecret: '' })
  }

  const handleRemove = (connectionId: string) => {
    removeRegistryConnection(connectionId)
  }

  const getRegistryInfo = (registryId: MarketplaceRegistry) => {
    return registryInfoList.find(r => r.id === registryId)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Registries</h1>
          <p className="text-white/60 mt-1">
            Connect and manage your carbon credit registry accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            Add Registry
          </button>
          <WalletConnect />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <p className="text-sm text-white/60 mb-1">Connected Registries</p>
          <p className="text-3xl font-bold text-white">{registryConnections.length}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-white/60 mb-1">Total Credits Linked</p>
          <p className="text-3xl font-bold text-white">
            {registryConnections.reduce((sum, c) => sum + c.credits, 0).toLocaleString()}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-white/60 mb-1">Verified Connections</p>
          <p className="text-3xl font-bold text-green-400">
            {registryConnections.filter(c => c.isVerified).length}
          </p>
        </GlassCard>
      </div>

      {/* Connected Registries */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Connected Registries</h2>
        
        {registryConnections.length === 0 ? (
          <GlassCard className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Registries Connected</h3>
            <p className="text-white/60 mb-4">
              Connect your registry accounts to import and manage credits
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              <Plus className="w-4 h-4" />
              Add Registry
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registryConnections.map((connection) => {
              const info = getRegistryInfo(connection.registry)
              const config = registryConfig[connection.registry]
              
              return (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard className="relative overflow-hidden">
                    {/* Top gradient bar */}
                    <div className={clsx('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', config?.gradient)} />
                    
                    <div className="pt-2">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
                            config?.gradient || 'from-gray-500 to-slate-600'
                          )}>
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{info?.name}</h3>
                            <p className="text-sm text-white/50">{info?.code}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {connection.isVerified && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-white/50 mb-1">Account ID</p>
                          <p className="text-sm text-white font-mono">{connection.accountId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 mb-1">Credits Available</p>
                          <p className="text-sm text-white font-semibold">
                            {connection.credits.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-white/40 mb-4">
                        Connected {formatDate(connection.connectedAt)}
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                        <a
                          href={info?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Registry
                        </a>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition text-sm">
                          <RefreshCw className="w-4 h-4" />
                          Sync
                        </button>
                        <button
                          onClick={() => handleRemove(connection.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Available Registries */}
      {availableRegistries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Available Registries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRegistries.map((registry) => {
              const config = registryConfig[registry.id]
              
              return (
                <GlassCard 
                  key={registry.id}
                  className="relative overflow-hidden hover:bg-white/10 transition cursor-pointer"
                  onClick={() => {
                    setSelectedRegistry(registry.id)
                    setIsAddModalOpen(true)
                  }}
                >
                  <div className={clsx('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-50', config?.gradient)} />
                  <div className="pt-2 flex items-center gap-3">
                    <div className={clsx(
                      'w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br opacity-50',
                      config?.gradient || 'from-gray-500 to-slate-600'
                    )}>
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{registry.name}</h3>
                      <p className="text-xs text-white/50">{registry.code}</p>
                    </div>
                    <Plus className="w-5 h-5 text-white/50" />
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>
      )}

      {/* Add Registry Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <GlassCard variant="dropdown" className="w-full max-w-md !p-0">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold text-white">Connect Registry</h2>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition text-white/70 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Registry Selection */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Select Registry</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {registryInfoList.map((registry) => {
                        const config = registryConfig[registry.id]
                        const isConnected = connectedRegistryIds.includes(registry.id)
                        
                        return (
                          <button
                            key={registry.id}
                            onClick={() => !isConnected && setSelectedRegistry(registry.id)}
                            disabled={isConnected}
                            className={clsx(
                              'p-3 rounded-xl text-left transition',
                              isConnected && 'opacity-50 cursor-not-allowed',
                              selectedRegistry === registry.id
                                ? 'bg-blue-500/20 border border-blue-500/50'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            )}
                          >
                            <p className="font-medium text-white text-sm">{registry.name}</p>
                            <p className="text-xs text-white/50">{registry.code}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {selectedRegistry && (
                    <>
                      {/* Account ID */}
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Account ID</label>
                        <input
                          type="text"
                          value={formData.accountId}
                          onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                          placeholder="Enter your registry account ID"
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      {/* API Key */}
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          <span className="flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            API Key
                          </span>
                        </label>
                        <input
                          type="password"
                          value={formData.apiKey}
                          onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                          placeholder="Enter your API key"
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      {/* Security Note */}
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-200">
                          Your credentials are encrypted and never shared with third parties.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-4 border-t border-white/10">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConnect}
                    disabled={!selectedRegistry || !formData.accountId || isConnecting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Connect Registry'
                    )}
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
