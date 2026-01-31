'use client'

/**
 * CreditCard Component
 * 
 * Displays a carbon credit project in the marketplace.
 */

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Leaf,
  Heart,
  Scale,
  ShoppingCart,
  Eye,
  TrendingUp,
  Users,
  TreePine,
  Droplets,
  Wind,
  Sun,
  Factory,
  Flame,
  Mountain,
  Truck,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import type { CarbonCredit, MethodologyCategory } from '@/types/marketplace'
import { GlassCard } from '@/components/shared'

interface CreditCardProps {
  credit: CarbonCredit
  onBuy?: (credit: CarbonCredit) => void
  onViewDetails?: (credit: CarbonCredit) => void
  onToggleWatchlist?: (creditId: string) => void
  onToggleCompare?: (creditId: string) => void
  isInWatchlist?: boolean
  isInCompare?: boolean
  className?: string
}

// Registry display names and colors
const registryConfig: Record<string, { name: string; color: string }> = {
  verra: { name: 'Verra', color: 'from-green-500 to-emerald-600' },
  gold_standard: { name: 'Gold Standard', color: 'from-amber-500 to-yellow-600' },
  acr: { name: 'ACR', color: 'from-blue-500 to-indigo-600' },
  car: { name: 'CAR', color: 'from-purple-500 to-violet-600' },
  gcc: { name: 'GCC', color: 'from-teal-500 to-cyan-600' },
  art: { name: 'ART', color: 'from-rose-500 to-pink-600' },
  plan_vivo: { name: 'Plan Vivo', color: 'from-lime-500 to-green-600' },
  independent: { name: 'Independent', color: 'from-gray-500 to-slate-600' },
}

// Methodology icons
const methodologyIcons: Record<MethodologyCategory, React.ComponentType<{ className?: string }>> = {
  renewable_energy: Sun,
  forestry_land_use: TreePine,
  blue_carbon: Droplets,
  carbon_capture: Factory,
  methane_management: Flame,
  soil_carbon: Mountain,
  energy_efficiency: Zap,
  industrial_processes: Factory,
  transportation: Truck,
}

// SDG colors
const sdgColors: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-amber-600',
  3: 'bg-green-600',
  4: 'bg-red-600',
  5: 'bg-orange-500',
  6: 'bg-sky-500',
  7: 'bg-yellow-500',
  8: 'bg-rose-600',
  9: 'bg-orange-600',
  10: 'bg-pink-500',
  11: 'bg-amber-500',
  12: 'bg-amber-700',
  13: 'bg-green-700',
  14: 'bg-blue-600',
  15: 'bg-green-500',
  16: 'bg-blue-700',
  17: 'bg-blue-900',
}

export function CreditCard({
  credit,
  onBuy,
  onViewDetails,
  onToggleWatchlist,
  onToggleCompare,
  isInWatchlist = false,
  isInCompare = false,
  className,
}: CreditCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const registry = registryConfig[credit.registry] || registryConfig.independent
  const MethodologyIcon = methodologyIcons[credit.methodology.category] || Leaf
  
  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      <GlassCard 
        className="!p-0 overflow-hidden h-full flex flex-col"
        hover
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {credit.imageUrl && !imageError ? (
            <Image
              src={credit.imageUrl}
              alt={credit.projectName}
              fill
              className="object-cover transition-transform duration-300"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
              <MethodologyIcon className="w-16 h-16 text-white/20" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Registry Badge */}
            <span className={clsx(
              'px-2 py-1 rounded-lg text-xs font-semibold text-white',
              'bg-gradient-to-r shadow-lg',
              registry.color
            )}>
              {registry.name}
            </span>
            
            {/* Verification badge */}
            {credit.verification.thirdPartyVerified && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/90 text-white text-xs font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          
          {/* Action buttons (on hover) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute top-3 right-3 flex flex-col gap-2"
          >
            {onToggleWatchlist && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleWatchlist(credit.id)
                }}
                className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition',
                  isInWatchlist 
                    ? 'bg-red-500 text-white' 
                    : 'bg-black/50 text-white/70 hover:bg-black/70 hover:text-white'
                )}
                title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <Heart className={clsx('w-4 h-4', isInWatchlist && 'fill-current')} />
              </button>
            )}
            {onToggleCompare && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleCompare(credit.id)
                }}
                className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition',
                  isInCompare 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-black/50 text-white/70 hover:bg-black/70 hover:text-white'
                )}
                title={isInCompare ? 'Remove from compare' : 'Add to compare'}
              >
                <Scale className="w-4 h-4" />
              </button>
            )}
          </motion.div>
          
          {/* Bottom info */}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-xs text-white/70 font-mono">
              {credit.registryProjectId}
            </p>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Project Name */}
          <h3 className="font-semibold text-white text-lg leading-tight mb-2 line-clamp-2">
            {credit.projectName}
          </h3>
          
          {/* Methodology */}
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-white/10">
              <MethodologyIcon className="w-4 h-4 text-white/70" />
            </div>
            <span className="text-sm text-white/70">
              {credit.methodology.name}
            </span>
          </div>
          
          {/* Location & Vintage */}
          <div className="flex items-center gap-4 mb-3 text-sm text-white/60">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{credit.location.country}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{credit.vintageYear}</span>
            </div>
          </div>
          
          {/* Co-Benefits / SDGs */}
          {credit.coBenefits.sdgAligned.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-xs text-white/50">SDGs:</span>
              <div className="flex gap-1">
                {credit.coBenefits.sdgAligned.slice(0, 5).map((sdg) => (
                  <span
                    key={sdg}
                    className={clsx(
                      'w-5 h-5 rounded text-[10px] font-bold text-white flex items-center justify-center',
                      sdgColors[sdg] || 'bg-gray-500'
                    )}
                  >
                    {sdg}
                  </span>
                ))}
                {credit.coBenefits.sdgAligned.length > 5 && (
                  <span className="text-xs text-white/50">
                    +{credit.coBenefits.sdgAligned.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Stats row */}
          <div className="flex items-center gap-3 mb-4 text-sm">
            <div className="flex items-center gap-1 text-white/60">
              <Leaf className="w-4 h-4 text-green-400" />
              <span>{credit.quantity.toLocaleString()} available</span>
            </div>
            {credit.coBenefits.jobsCreated && (
              <div className="flex items-center gap-1 text-white/60">
                <Users className="w-4 h-4 text-blue-400" />
                <span>{credit.coBenefits.jobsCreated} jobs</span>
              </div>
            )}
          </div>
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Price & Actions */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs text-white/50">Price per credit</p>
                <p className="text-xl font-bold text-white">
                  {formatPrice(credit.priceUsd)}
                </p>
                <p className="text-sm text-white/50">
                  {credit.priceNear} NEAR
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(credit)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Details
                </button>
              )}
              {onBuy && (
                <button
                  onClick={() => onBuy(credit)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition font-medium text-sm shadow-lg shadow-blue-500/25"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
