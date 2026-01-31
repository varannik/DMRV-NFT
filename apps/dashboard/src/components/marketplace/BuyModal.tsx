'use client'

/**
 * BuyModal Component
 * 
 * Modal for purchasing carbon credits with NEAR integration.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ShoppingCart,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Minus,
  Plus,
  Building2,
  TreePine,
  MapPin,
  Calendar,
  Shield,
} from 'lucide-react'
import clsx from 'clsx'
import { useTradingStore, useWalletStore } from '@/lib/stores'
import { GlassCard } from '@/components/shared'

export function BuyModal() {
  const {
    isBuyModalOpen,
    closeBuyModal,
    selectedCreditForBuy: credit,
    buyQuantity,
    setBuyQuantity,
    executeBuy,
    isLoading,
    error,
  } = useTradingStore()

  const { isConnected, balance, connect, isConnecting } = useWalletStore()
  
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details')
  const [txHash, setTxHash] = useState<string | null>(null)

  // Reset on close
  useEffect(() => {
    if (!isBuyModalOpen) {
      setStep('details')
      setTxHash(null)
    }
  }, [isBuyModalOpen])

  if (!credit) return null

  const subtotal = credit.priceUsd * buyQuantity
  const platformFee = subtotal * 0.02 // 2% fee
  const gasFee = 0.01 // Estimated NEAR gas
  const total = subtotal + platformFee
  const totalNear = credit.priceNear * buyQuantity + gasFee

  const canAfford = isConnected && balance.near >= totalNear
  const maxQuantity = Math.min(credit.quantity, Math.floor(balance.near / credit.priceNear))

  const handleBuy = async () => {
    if (!isConnected) {
      await connect()
      return
    }

    setStep('confirm')
  }

  const handleConfirm = async () => {
    try {
      const order = await executeBuy()
      setTxHash(order.nearTxHash || null)
      setStep('success')
    } catch (e) {
      // Error handled by store
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }

  return (
    <AnimatePresence>
      {isBuyModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBuyModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <GlassCard 
              variant="dropdown" 
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto !p-0"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">
                    {step === 'success' ? 'Purchase Complete' : 'Purchase Carbon Credits'}
                  </h2>
                </div>
                <button
                  onClick={closeBuyModal}
                  className="p-2 rounded-lg hover:bg-white/10 transition text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {step === 'details' && (
                  <>
                    {/* Project Info */}
                    <div className="mb-6">
                      <h3 className="font-medium text-white mb-2">{credit.projectName}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {credit.registry.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1">
                          <TreePine className="w-4 h-4" />
                          {credit.methodology.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {credit.location.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {credit.vintageYear}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-2 font-mono">
                        Project ID: {credit.registryProjectId}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-6">
                      <label className="block text-sm text-white/70 mb-2">
                        Quantity to Purchase
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 10))}
                          disabled={buyQuantity <= 1}
                          className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={buyQuantity}
                          onChange={(e) => setBuyQuantity(Math.max(1, Math.min(credit.quantity, Number(e.target.value))))}
                          className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-center text-xl font-bold text-white focus:outline-none focus:border-blue-500/50"
                          min={1}
                          max={credit.quantity}
                        />
                        <button
                          onClick={() => setBuyQuantity(Math.min(credit.quantity, buyQuantity + 10))}
                          disabled={buyQuantity >= credit.quantity}
                          className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-white/50 mt-2">
                        Available: {credit.quantity.toLocaleString()} credits
                      </p>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                      <h4 className="text-sm font-medium text-white mb-3">Price Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">
                            Price per credit
                          </span>
                          <span className="text-white">{formatPrice(credit.priceUsd)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">
                            Quantity
                          </span>
                          <span className="text-white">× {buyQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Subtotal</span>
                          <span className="text-white">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Platform fee (2%)</span>
                          <span className="text-white">{formatPrice(platformFee)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">NEAR Gas (est.)</span>
                          <span className="text-white">~{gasFee} NEAR</span>
                        </div>
                        <div className="border-t border-white/10 pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-white">Total</span>
                            <div className="text-right">
                              <p className="text-white">{formatPrice(total)}</p>
                              <p className="text-xs text-white/50">{totalNear.toFixed(2)} NEAR</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Status */}
                    {!isConnected ? (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-amber-200">
                              Connect your NEAR wallet to purchase credits
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : !canAfford ? (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-red-200">
                              Insufficient NEAR balance. You have {balance.near.toFixed(2)} NEAR.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <Wallet className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-green-200">
                              Wallet connected: {balance.near.toFixed(2)} NEAR available
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-200">{error}</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={closeBuyModal}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBuy}
                        disabled={isConnected && !canAfford}
                        className={clsx(
                          'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition',
                          'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
                          'hover:from-blue-600 hover:to-cyan-600',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          'shadow-lg shadow-blue-500/25'
                        )}
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Connecting...
                          </>
                        ) : !isConnected ? (
                          <>
                            <Wallet className="w-4 h-4" />
                            Connect Wallet
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Continue
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}

                {step === 'confirm' && (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Confirm Purchase
                      </h3>
                      <p className="text-white/60">
                        You are about to purchase {buyQuantity} carbon credits for {totalNear.toFixed(2)} NEAR
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-white/60">Project</span>
                        <span className="text-white font-medium">{credit.projectName}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/60">Quantity</span>
                        <span className="text-white font-medium">{buyQuantity} credits</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Total</span>
                        <span className="text-white font-bold">{totalNear.toFixed(2)} NEAR</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep('details')}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-medium disabled:opacity-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={clsx(
                          'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition',
                          'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
                          'hover:from-green-600 hover:to-emerald-600',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          'shadow-lg shadow-green-500/25'
                        )}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Confirm Purchase
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}

                {step === 'success' && (
                  <>
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Purchase Successful!
                      </h3>
                      <p className="text-white/60">
                        You have successfully purchased {buyQuantity} carbon credits.
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-white/60">Project</span>
                        <span className="text-white font-medium">{credit.projectName}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/60">Quantity</span>
                        <span className="text-white font-medium">{buyQuantity} credits</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/60">Total Paid</span>
                        <span className="text-white font-bold">{totalNear.toFixed(2)} NEAR</span>
                      </div>
                      {txHash && (
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                          <span className="text-white/60">Transaction</span>
                          <a
                            href={`https://explorer.near.org/transactions/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                          >
                            <span className="font-mono text-sm">{txHash}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={closeBuyModal}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-medium"
                    >
                      Done
                    </button>
                  </>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
