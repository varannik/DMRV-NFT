'use client'

/**
 * RetireModal Component
 * 
 * Modal for retiring carbon credits - permanently removing them from circulation.
 * Generates a retirement certificate for carbon offset claims.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Award,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Minus,
  Plus,
  Building2,
  MapPin,
  Calendar,
  User,
  Building,
  FileText,
  Leaf,
  TreePine,
  Car,
} from 'lucide-react'
import clsx from 'clsx'
import { usePortfolioStore, useWalletStore } from '@/lib/stores'
import { GlassCard } from '@/components/shared'
import type { RetirementReason } from '@/types/marketplace'

const retirementReasons: { value: RetirementReason; label: string }[] = [
  { value: 'personal_offset', label: 'Personal Carbon Offset' },
  { value: 'corporate_sustainability', label: 'Corporate Sustainability Goals' },
  { value: 'event_neutrality', label: 'Event Carbon Neutrality' },
  { value: 'product_neutrality', label: 'Product Carbon Neutrality' },
  { value: 'voluntary', label: 'Voluntary Climate Action' },
  { value: 'other', label: 'Other' },
]

export function RetireModal() {
  const {
    isRetireModalOpen,
    closeRetireModal,
    selectedHoldingForRetire: holding,
    retireQuantity,
    setRetireQuantity,
    retireCredits,
    isLoading,
    error,
  } = usePortfolioStore()

  const { isConnected, connect, isConnecting } = useWalletStore()
  
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details')
  const [beneficiaryType, setBeneficiaryType] = useState<'individual' | 'organization'>('individual')
  const [beneficiaryName, setBeneficiaryName] = useState('')
  const [reason, setReason] = useState<RetirementReason>('personal_offset')
  const [notes, setNotes] = useState('')
  const [certificateId, setCertificateId] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  // Reset on close
  useEffect(() => {
    if (!isRetireModalOpen) {
      setStep('details')
      setBeneficiaryType('individual')
      setBeneficiaryName('')
      setReason('personal_offset')
      setNotes('')
      setCertificateId(null)
      setTxHash(null)
    }
  }, [isRetireModalOpen])

  if (!holding) return null

  const credit = holding.credit

  // Calculate impact equivalents
  const impactCo2 = retireQuantity
  const impactCars = Math.round(retireQuantity / 4.6)
  const impactTrees = Math.round(retireQuantity * 16.5)

  const handleRetire = async () => {
    if (!isConnected) {
      await connect()
      return
    }
    
    if (!beneficiaryName.trim()) {
      return
    }
    
    setStep('confirm')
  }

  const handleConfirm = async () => {
    try {
      const retirement = await retireCredits(credit.id, retireQuantity, {
        beneficiaryType,
        beneficiaryName,
        reason,
        notes: notes || undefined,
      })
      setCertificateId(retirement.certificateId)
      setTxHash(retirement.nearTxHash || null)
      setStep('success')
    } catch (e) {
      // Error handled by store
    }
  }

  return (
    <AnimatePresence>
      {isRetireModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeRetireModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <GlassCard 
              solid
              className="w-full max-w-md !p-0 pointer-events-auto max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-gray-900 z-10">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-semibold text-white">
                    {step === 'success' ? 'Credits Retired' : 'Retire Carbon Credits'}
                  </h2>
                </div>
                <button
                  onClick={closeRetireModal}
                  className="p-2 rounded-lg hover:bg-white/10 transition text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {step === 'details' && (
                  <>
                    {/* Info Banner */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4">
                      <div className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-200">
                          Retiring credits permanently removes them from circulation. This action cannot be undone. You'll receive a certificate proving your carbon offset.
                        </p>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="mb-4">
                      <h3 className="font-medium text-white mb-1 line-clamp-1">{credit.projectName}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {credit.registry.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {credit.location.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {credit.vintageYear}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-4">
                      <label className="block text-xs text-white/70 mb-1.5">
                        Quantity to Retire
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRetireQuantity(Math.max(1, retireQuantity - 10))}
                          disabled={retireQuantity <= 1}
                          className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={retireQuantity}
                          onChange={(e) => setRetireQuantity(Math.max(1, Math.min(holding.quantity, Number(e.target.value))))}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-center text-lg font-bold text-white focus:outline-none focus:border-amber-500/50"
                          min={1}
                          max={holding.quantity}
                        />
                        <button
                          onClick={() => setRetireQuantity(Math.min(holding.quantity, retireQuantity + 10))}
                          disabled={retireQuantity >= holding.quantity}
                          className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-white/50 mt-1">
                        You own: {holding.quantity.toLocaleString()} credits
                      </p>
                    </div>

                    {/* Impact Preview */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4">
                      <p className="text-xs text-green-300 mb-2 font-medium">Environmental Impact</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <Leaf className="w-5 h-5 text-green-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{impactCo2}</p>
                          <p className="text-[10px] text-white/50">tonnes CO₂</p>
                        </div>
                        <div className="text-center">
                          <Car className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{impactCars}</p>
                          <p className="text-[10px] text-white/50">cars/year</p>
                        </div>
                        <div className="text-center">
                          <TreePine className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{impactTrees}</p>
                          <p className="text-[10px] text-white/50">trees/10yr</p>
                        </div>
                      </div>
                    </div>

                    {/* Beneficiary Type */}
                    <div className="mb-4">
                      <label className="block text-xs text-white/70 mb-1.5">
                        Beneficiary Type
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setBeneficiaryType('individual')}
                          className={clsx(
                            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-sm',
                            beneficiaryType === 'individual'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                          )}
                        >
                          <User className="w-4 h-4" />
                          Individual
                        </button>
                        <button
                          onClick={() => setBeneficiaryType('organization')}
                          className={clsx(
                            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-sm',
                            beneficiaryType === 'organization'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                          )}
                        >
                          <Building className="w-4 h-4" />
                          Organization
                        </button>
                      </div>
                    </div>

                    {/* Beneficiary Name */}
                    <div className="mb-4">
                      <label className="block text-xs text-white/70 mb-1.5">
                        {beneficiaryType === 'individual' ? 'Your Name' : 'Organization Name'}
                      </label>
                      <input
                        type="text"
                        value={beneficiaryName}
                        onChange={(e) => setBeneficiaryName(e.target.value)}
                        placeholder={beneficiaryType === 'individual' ? 'John Doe' : 'Acme Corporation'}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
                      />
                      <p className="text-[10px] text-white/40 mt-1">
                        This name will appear on your retirement certificate
                      </p>
                    </div>

                    {/* Reason */}
                    <div className="mb-4">
                      <label className="block text-xs text-white/70 mb-1.5">
                        Reason for Retirement
                      </label>
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value as RetirementReason)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                      >
                        {retirementReasons.map((r) => (
                          <option key={r.value} value={r.value} className="bg-gray-900">
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Notes (optional) */}
                    <div className="mb-4">
                      <label className="block text-xs text-white/70 mb-1.5">
                        Notes (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any additional details..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 resize-none"
                      />
                    </div>

                    {/* Wallet Status */}
                    {!isConnected && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-amber-400 shrink-0" />
                          <p className="text-xs text-amber-200">
                            Connect your NEAR wallet to retire
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <p className="text-xs text-red-200">{error}</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={closeRetireModal}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-medium text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRetire}
                        disabled={!beneficiaryName.trim() || retireQuantity < 1}
                        className={clsx(
                          'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition',
                          'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
                          'hover:from-amber-600 hover:to-orange-600',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          'shadow-lg shadow-amber-500/25'
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
                            <Award className="w-4 h-4" />
                            Retire Credits
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}

                {step === 'confirm' && (
                  <>
                    <div className="text-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                        <Award className="w-7 h-7 text-amber-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Confirm Retirement
                      </h3>
                      <p className="text-sm text-white/60">
                        This action is permanent and cannot be undone
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 mb-4 text-sm">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-white/60">Project</span>
                        <span className="text-white font-medium text-right max-w-[60%] truncate">{credit.projectName}</span>
                      </div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-white/60">Quantity</span>
                        <span className="text-white font-medium">{retireQuantity} credits</span>
                      </div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-white/60">Beneficiary</span>
                        <span className="text-white font-medium">{beneficiaryName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Reason</span>
                        <span className="text-white font-medium">
                          {retirementReasons.find(r => r.value === reason)?.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setStep('details')}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-medium text-sm disabled:opacity-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={clsx(
                          'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition',
                          'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
                          'hover:from-amber-600 hover:to-orange-600',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          'shadow-lg shadow-amber-500/25'
                        )}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Retiring...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Confirm Retirement
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}

                {step === 'success' && (
                  <>
                    <div className="text-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3"
                      >
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Credits Retired!
                      </h3>
                      <p className="text-sm text-white/60">
                        Thank you for your contribution to climate action
                      </p>
                    </div>

                    {/* Impact Summary */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                      <p className="text-center text-sm text-green-300 mb-3">
                        You've offset <span className="font-bold">{retireQuantity} tonnes</span> of CO₂
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <Leaf className="w-5 h-5 text-green-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{impactCo2}</p>
                          <p className="text-[10px] text-white/50">tonnes CO₂</p>
                        </div>
                        <div>
                          <Car className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{impactCars}</p>
                          <p className="text-[10px] text-white/50">cars off road</p>
                        </div>
                        <div>
                          <TreePine className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{impactTrees}</p>
                          <p className="text-[10px] text-white/50">trees grown</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 mb-4 text-sm">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-white/60">Beneficiary</span>
                        <span className="text-white font-medium">{beneficiaryName}</span>
                      </div>
                      {certificateId && (
                        <div className="flex justify-between mb-1.5">
                          <span className="text-white/60">Certificate ID</span>
                          <span className="text-amber-400 font-mono text-xs">{certificateId}</span>
                        </div>
                      )}
                      {txHash && (
                        <div className="flex justify-between items-center pt-1.5 mt-1.5 border-t border-white/10">
                          <span className="text-white/60">Transaction</span>
                          <a
                            href={`https://explorer.near.org/transactions/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition text-xs"
                          >
                            <span className="font-mono">{txHash.slice(0, 8)}...</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={closeRetireModal}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-medium text-sm"
                      >
                        Done
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition font-medium text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        View Certificate
                      </button>
                    </div>
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
