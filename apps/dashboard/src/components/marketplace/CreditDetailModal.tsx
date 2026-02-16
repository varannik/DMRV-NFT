'use client'

/**
 * CreditDetailModal Component
 * 
 * Shows full project details when clicking on a credit card.
 */

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  X,
  MapPin,
  Calendar,
  Building2,
  TreePine,
  Leaf,
  CheckCircle2,
  Heart,
  ShoppingCart,
  ExternalLink,
  Users,
  Shield,
  Globe,
  Clock,
  Award,
} from 'lucide-react'
import clsx from 'clsx'
import type { CarbonCredit } from '@/types/marketplace'
import { GlassCard } from '@/components/shared'

interface CreditDetailModalProps {
  credit: CarbonCredit | null
  isOpen: boolean
  onClose: () => void
  onBuy: (credit: CarbonCredit) => void
  onToggleWatchlist?: (creditId: string) => void
  isInWatchlist?: boolean
}

// SDG configuration
const sdgConfig: Record<number, { color: string; name: string }> = {
  1: { color: 'bg-red-500', name: 'No Poverty' },
  2: { color: 'bg-amber-600', name: 'Zero Hunger' },
  3: { color: 'bg-green-600', name: 'Good Health and Well-being' },
  4: { color: 'bg-red-600', name: 'Quality Education' },
  5: { color: 'bg-orange-500', name: 'Gender Equality' },
  6: { color: 'bg-sky-500', name: 'Clean Water and Sanitation' },
  7: { color: 'bg-yellow-500', name: 'Affordable and Clean Energy' },
  8: { color: 'bg-rose-600', name: 'Decent Work and Economic Growth' },
  9: { color: 'bg-orange-600', name: 'Industry, Innovation and Infrastructure' },
  10: { color: 'bg-pink-500', name: 'Reduced Inequalities' },
  11: { color: 'bg-amber-500', name: 'Sustainable Cities and Communities' },
  12: { color: 'bg-amber-700', name: 'Responsible Consumption and Production' },
  13: { color: 'bg-green-700', name: 'Climate Action' },
  14: { color: 'bg-blue-600', name: 'Life Below Water' },
  15: { color: 'bg-green-500', name: 'Life on Land' },
  16: { color: 'bg-blue-700', name: 'Peace, Justice and Strong Institutions' },
  17: { color: 'bg-blue-900', name: 'Partnerships for the Goals' },
}

export function CreditDetailModal({
  credit,
  isOpen,
  onClose,
  onBuy,
  onToggleWatchlist,
  isInWatchlist = false,
}: CreditDetailModalProps) {
  if (!credit) return null

  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }

  // Generate Google Maps embed URL (use coordinates when available, else country)
  const coords = credit.location.coordinates
  const mapQuery = coords ? `${coords.lat},${coords.lng}` : encodeURIComponent(credit.location.country)
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapQuery}&zoom=6`
  
  // Fallback static map image
  const staticMapCenter = coords ? `${coords.lat},${coords.lng}` : encodeURIComponent(credit.location.country)
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${staticMapCenter}&zoom=5&size=400x200&maptype=terrain${coords ? `&markers=color:green%7C${coords.lat},${coords.lng}` : ''}`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
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
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto !p-0 pointer-events-auto"
            >
              {/* Header Image */}
              <div className="relative h-48 overflow-hidden">
                {credit.imageUrl ? (
                  <Image
                    src={credit.imageUrl}
                    alt={credit.projectName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-600/30 to-blue-600/30 flex items-center justify-center">
                    <TreePine className="w-20 h-20 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-lg bg-green-500/90 text-white text-sm font-semibold">
                    {credit.registry.replace('_', ' ').toUpperCase()}
                  </span>
                  {credit.verification.thirdPartyVerified && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/90 text-white text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Project name overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {credit.projectName}
                  </h2>
                  <p className="text-white/70 text-sm font-mono">
                    {credit.registryProjectId}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Quick Info Row */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{credit.location.country}, {credit.location.region}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span>Vintage {credit.vintageYear}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>{credit.methodology.name}</span>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Left Column - Map & Location */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      Project Location
                    </h3>
                    <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      {/* Map placeholder - using coordinates display */}
                      <div className="h-40 bg-gradient-to-br from-blue-900/50 to-green-900/50 flex items-center justify-center relative">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          {coords ? (
                            <p className="text-white/70 text-sm">
                              {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
                            </p>
                          ) : null}
                          <p className="text-white text-sm font-medium mt-1">
                            {[credit.location.region, credit.location.country].filter(Boolean).join(', ')}
                          </p>
                        </div>
                        <a
                          href={coords
                            ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
                            : `https://www.google.com/maps?q=${encodeURIComponent(credit.location.country)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-white/70 hover:text-white text-xs transition"
                        >
                          Open in Maps
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Methodology & Verification */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      Verification & Standards
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-white/50 mb-1">Methodology</p>
                        <p className="text-sm text-white">{credit.methodology.name}</p>
                        <p className="text-xs text-white/50 mt-1">{credit.methodology.verificationStandard}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-white/50 mb-1">Permanence</p>
                        <p className="text-sm text-white">{credit.methodology.permanenceYears} years</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-white/50 mb-1">Last Audit</p>
                            <p className="text-sm text-white flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(credit.verification.lastAudit).toLocaleDateString()}
                            </p>
                          </div>
                          {credit.verification.thirdPartyVerified && (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Co-Benefits Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Co-Benefits & Impact
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {credit.coBenefits.biodiversity && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                        <Leaf className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-xs text-green-300">Biodiversity</p>
                      </div>
                    )}
                    {credit.coBenefits.communityDevelopment && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                        <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-xs text-blue-300">Community</p>
                      </div>
                    )}
                    {credit.coBenefits.indigenousRights && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
                        <Shield className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-xs text-purple-300">Indigenous Rights</p>
                      </div>
                    )}
                    {credit.coBenefits.jobsCreated && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
                        <Users className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                        <p className="text-xs text-amber-300">{credit.coBenefits.jobsCreated} Jobs</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SDGs */}
                {credit.coBenefits.sdgAligned.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white mb-3">
                      UN Sustainable Development Goals
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {credit.coBenefits.sdgAligned.map((sdg) => (
                        <div
                          key={sdg}
                          className={clsx(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm',
                            sdgConfig[sdg]?.color || 'bg-gray-500'
                          )}
                        >
                          <span className="font-bold">{sdg}</span>
                          <span className="text-white/90 text-xs">{sdgConfig[sdg]?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {credit.verification.certifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {credit.verification.certifications.map((cert, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price & Actions */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-white/50">Available Credits</p>
                      <p className="text-2xl font-bold text-white">
                        {credit.quantity.toLocaleString()}
                        <span className="text-sm font-normal text-white/50 ml-1">tonnes CO₂</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/50">Price per credit</p>
                      <p className="text-2xl font-bold text-white">{formatPrice(credit.priceUsd)}</p>
                      <p className="text-sm text-white/50">{credit.priceNear} NEAR</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {onToggleWatchlist && (
                      <button
                        onClick={() => onToggleWatchlist(credit.id)}
                        className={clsx(
                          'p-3 rounded-xl transition',
                          isInWatchlist
                            ? 'bg-red-500 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                        )}
                      >
                        <Heart className={clsx('w-5 h-5', isInWatchlist && 'fill-current')} />
                      </button>
                    )}
                    <button
                      onClick={() => onBuy(credit)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition font-semibold shadow-lg shadow-blue-500/25"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Buy Credits
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
