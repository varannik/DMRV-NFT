'use client'

/**
 * CreditCard Component
 * 
 * Displays a carbon credit project in the marketplace.
 */

import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
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
  Users,
  TreePine,
  Droplets,
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

// SDG colors and names
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

// SDG Badge with Portal Tooltip
function SDGBadge({ sdg }: { sdg: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const badgeRef = useRef<HTMLSpanElement>(null)

  const handleMouseEnter = () => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect()
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      })
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <>
      <span
        ref={badgeRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={clsx(
          'w-5 h-5 rounded text-[10px] font-bold text-white flex items-center justify-center cursor-pointer',
          sdgConfig[sdg]?.color || 'bg-gray-500'
        )}
      >
        {sdg}
      </span>
      {isHovered && position && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed z-[9999] px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap pointer-events-none"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translate(-50%, -100%)',
          }}
        >
          SDG {sdg}: {sdgConfig[sdg]?.name || 'Unknown'}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>,
        document.body
      )}
    </>
  )
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

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(credit)
    }
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
        className="!p-0 overflow-hidden h-full flex flex-col cursor-pointer"
        hover
        onClick={handleCardClick}
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
          {/* Project Name - fixed height for 2 lines to keep cards consistent */}
          <h3 className="font-semibold text-white text-lg leading-tight mb-2 line-clamp-2 min-h-14">
            {credit.projectName}
          </h3>
          
          {/* Methodology - fixed height for consistency */}
          <div className="flex items-start gap-2 mb-3 min-h-10">
            <div className="p-1.5 rounded-lg bg-white/10 shrink-0">
              <MethodologyIcon className="w-4 h-4 text-white/70" />
            </div>
            <span className="text-sm text-white/70 line-clamp-2">
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
          
          {/* Jobs Created */}
          {credit.coBenefits.jobsCreated && (
            <div className="flex items-center gap-1.5 mb-3 text-sm text-white/60">
              <Users className="w-4 h-4 text-blue-400" />
              <span>{credit.coBenefits.jobsCreated} jobs created</span>
            </div>
          )}

          {/* Co-Benefits / SDGs */}
          {credit.coBenefits.sdgAligned.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-xs text-white/50">SDGs:</span>
              <div className="flex gap-1">
                {credit.coBenefits.sdgAligned.slice(0, 5).map((sdg) => (
                  <SDGBadge key={sdg} sdg={sdg} />
                ))}
                {credit.coBenefits.sdgAligned.length > 5 && (
                  <span className="text-xs text-white/50">
                    +{credit.coBenefits.sdgAligned.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Price & Tonnage */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-start justify-between mb-3">
              {/* Tonnage */}
              <div className="flex-1">
                <p className="text-xs text-white/50">Available</p>
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-green-400" />
                  <p className="text-xl font-bold text-white">
                    {credit.quantity.toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-white/50">tonnes CO₂</p>
              </div>
              {/* Price */}
              <div className="flex-1 text-right">
                <p className="text-xs text-white/50">Price per credit</p>
                <p className="text-xl font-bold text-white">
                  {formatPrice(credit.priceUsd)}
                </p>
                <p className="text-sm text-white/50">
                  {credit.priceNear} NEAR
                </p>
              </div>
            </div>
            
            {onBuy && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onBuy(credit)
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition font-medium text-sm shadow-lg shadow-blue-500/25"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy Now
              </button>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
