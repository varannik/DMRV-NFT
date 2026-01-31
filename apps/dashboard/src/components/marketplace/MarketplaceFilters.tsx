'use client'

/**
 * MarketplaceFilters Component
 * 
 * Advanced filtering sidebar for the carbon credit marketplace.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  TreePine,
  Sun,
  Droplets,
  Factory,
  Flame,
  Mountain,
  Zap,
  Truck,
  Leaf,
  CheckCircle2,
  Clock,
  Shield,
  Users,
  Globe,
} from 'lucide-react'
import clsx from 'clsx'
import { useMarketplaceStore } from '@/lib/stores'
import type { MarketplaceRegistry, MethodologyCategory, MethodologySubtype } from '@/types/marketplace'
import { GlassCard } from '@/components/shared'

interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  count?: number
}

function FilterSection({ title, isOpen, onToggle, children, count }: FilterSectionProps) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{title}</span>
          {count !== undefined && count > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
              {count}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-white/50" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/50" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface CheckboxItemProps {
  label: string
  checked: boolean
  onChange: () => void
  icon?: React.ReactNode
  color?: string
}

function CheckboxItem({ label, checked, onChange, icon, color }: CheckboxItemProps) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
      <div
        className={clsx(
          'w-4 h-4 rounded border-2 flex items-center justify-center transition',
          checked 
            ? 'bg-blue-500 border-blue-500' 
            : 'border-white/30 group-hover:border-white/50'
        )}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2.5 h-2.5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
      </div>
      {icon && (
        <span className={clsx('w-4 h-4', color || 'text-white/50')}>
          {icon}
        </span>
      )}
      <span className="text-sm text-white/70 group-hover:text-white transition">
        {label}
      </span>
    </label>
  )
}

// Registry configuration
const registries: { id: MarketplaceRegistry; name: string; color: string }[] = [
  { id: 'verra', name: 'Verra (VCS)', color: 'text-green-400' },
  { id: 'gold_standard', name: 'Gold Standard', color: 'text-amber-400' },
  { id: 'acr', name: 'American Carbon Registry', color: 'text-blue-400' },
  { id: 'car', name: 'Climate Action Reserve', color: 'text-purple-400' },
  { id: 'gcc', name: 'Global Carbon Council', color: 'text-teal-400' },
  { id: 'art', name: 'ART TREES', color: 'text-rose-400' },
  { id: 'plan_vivo', name: 'Plan Vivo', color: 'text-lime-400' },
]

// Methodology configuration with icons
const methodologies: { 
  id: MethodologyCategory; 
  name: string; 
  icon: React.ComponentType<{ className?: string }>;
  subtypes?: { id: MethodologySubtype; name: string }[]
}[] = [
  { 
    id: 'renewable_energy', 
    name: 'Renewable Energy', 
    icon: Sun,
    subtypes: [
      { id: 'solar', name: 'Solar' },
      { id: 'wind', name: 'Wind' },
      { id: 'hydro', name: 'Hydro' },
      { id: 'geothermal', name: 'Geothermal' },
    ]
  },
  { 
    id: 'forestry_land_use', 
    name: 'Forestry & Land Use', 
    icon: TreePine,
    subtypes: [
      { id: 'redd_plus', name: 'REDD+' },
      { id: 'afforestation', name: 'Afforestation' },
      { id: 'ifm', name: 'Improved Forest Mgmt' },
      { id: 'agroforestry', name: 'Agroforestry' },
    ]
  },
  { 
    id: 'blue_carbon', 
    name: 'Blue Carbon', 
    icon: Droplets,
    subtypes: [
      { id: 'coastal_wetlands', name: 'Coastal Wetlands' },
      { id: 'mangrove', name: 'Mangrove' },
      { id: 'seagrass', name: 'Seagrass' },
    ]
  },
  { 
    id: 'carbon_capture', 
    name: 'Carbon Capture', 
    icon: Factory,
    subtypes: [
      { id: 'dac', name: 'Direct Air Capture' },
      { id: 'beccs', name: 'BECCS' },
      { id: 'enhanced_weathering', name: 'Enhanced Weathering' },
    ]
  },
  { id: 'methane_management', name: 'Methane Management', icon: Flame },
  { 
    id: 'soil_carbon', 
    name: 'Soil Carbon', 
    icon: Mountain,
    subtypes: [
      { id: 'regenerative_agriculture', name: 'Regenerative Agriculture' },
      { id: 'biochar', name: 'Biochar' },
    ]
  },
  { id: 'energy_efficiency', name: 'Energy Efficiency', icon: Zap },
  { id: 'transportation', name: 'Transportation', icon: Truck },
]

export function MarketplaceFilters() {
  const {
    filters,
    setSearchQuery,
    toggleRegistry,
    toggleMethodology,
    toggleSubtype,
    setPriceRange,
    setVintageRange,
    setFilters,
    resetFilters,
    filteredCredits,
  } = useMarketplaceStore()

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    registry: true,
    methodology: true,
    price: false,
    vintage: false,
    cobenefits: false,
    verification: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const activeFilterCount = 
    filters.registries.length +
    filters.methodologies.length +
    filters.subtypes.length +
    (filters.coBenefits.biodiversity ? 1 : 0) +
    (filters.coBenefits.sdgAligned ? 1 : 0) +
    (filters.coBenefits.communityDevelopment ? 1 : 0) +
    (filters.coBenefits.indigenousRights ? 1 : 0) +
    (filters.verification.recentlyAudited ? 1 : 0) +
    (filters.verification.thirdPartyVerified ? 1 : 0)

  return (
    <GlassCard className="!p-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/70" />
          <span className="font-medium text-white">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10 transition"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search projects..."
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
        {/* Registry Filter */}
        <FilterSection
          title="Registry"
          isOpen={openSections.registry}
          onToggle={() => toggleSection('registry')}
          count={filters.registries.length}
        >
          <div className="space-y-1">
            {registries.map((registry) => (
              <CheckboxItem
                key={registry.id}
                label={registry.name}
                checked={filters.registries.includes(registry.id)}
                onChange={() => toggleRegistry(registry.id)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Methodology Filter */}
        <FilterSection
          title="Methodology"
          isOpen={openSections.methodology}
          onToggle={() => toggleSection('methodology')}
          count={filters.methodologies.length + filters.subtypes.length}
        >
          <div className="space-y-2">
            {methodologies.map((methodology) => {
              const Icon = methodology.icon
              const isExpanded = filters.methodologies.includes(methodology.id)
              
              return (
                <div key={methodology.id}>
                  <CheckboxItem
                    label={methodology.name}
                    checked={filters.methodologies.includes(methodology.id)}
                    onChange={() => toggleMethodology(methodology.id)}
                    icon={<Icon className="w-4 h-4" />}
                  />
                  {/* Subtypes */}
                  {methodology.subtypes && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {methodology.subtypes.map((subtype) => (
                        <CheckboxItem
                          key={subtype.id}
                          label={subtype.name}
                          checked={filters.subtypes.includes(subtype.id)}
                          onChange={() => toggleSubtype(subtype.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection
          title="Price Range"
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-white/50 mb-1 block">Min ($)</label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => setPriceRange(Number(e.target.value), filters.priceRange.max)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                  min={0}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-white/50 mb-1 block">Max ($)</label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => setPriceRange(filters.priceRange.min, Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                  min={0}
                />
              </div>
            </div>
            {/* Price range slider visualization */}
            <div className="h-2 rounded-full bg-white/10 relative">
              <div 
                className="absolute h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                style={{ 
                  left: `${(filters.priceRange.min / 500) * 100}%`,
                  right: `${100 - (filters.priceRange.max / 500) * 100}%`,
                }}
              />
            </div>
          </div>
        </FilterSection>

        {/* Vintage Year Filter */}
        <FilterSection
          title="Vintage Year"
          isOpen={openSections.vintage}
          onToggle={() => toggleSection('vintage')}
        >
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-white/50 mb-1 block">From</label>
              <input
                type="number"
                value={filters.vintageYears.min}
                onChange={(e) => setVintageRange(Number(e.target.value), filters.vintageYears.max)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                min={2015}
                max={2026}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-white/50 mb-1 block">To</label>
              <input
                type="number"
                value={filters.vintageYears.max}
                onChange={(e) => setVintageRange(filters.vintageYears.min, Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                min={2015}
                max={2026}
              />
            </div>
          </div>
        </FilterSection>

        {/* Co-Benefits Filter */}
        <FilterSection
          title="Co-Benefits"
          isOpen={openSections.cobenefits}
          onToggle={() => toggleSection('cobenefits')}
          count={
            (filters.coBenefits.biodiversity ? 1 : 0) +
            (filters.coBenefits.sdgAligned ? 1 : 0) +
            (filters.coBenefits.communityDevelopment ? 1 : 0) +
            (filters.coBenefits.indigenousRights ? 1 : 0)
          }
        >
          <div className="space-y-1">
            <CheckboxItem
              label="Biodiversity"
              checked={filters.coBenefits.biodiversity}
              onChange={() => setFilters({ 
                coBenefits: { 
                  ...filters.coBenefits, 
                  biodiversity: !filters.coBenefits.biodiversity 
                } 
              })}
              icon={<Leaf className="w-4 h-4" />}
            />
            <CheckboxItem
              label="SDG Aligned"
              checked={filters.coBenefits.sdgAligned}
              onChange={() => setFilters({ 
                coBenefits: { 
                  ...filters.coBenefits, 
                  sdgAligned: !filters.coBenefits.sdgAligned 
                } 
              })}
              icon={<Globe className="w-4 h-4" />}
            />
            <CheckboxItem
              label="Community Development"
              checked={filters.coBenefits.communityDevelopment}
              onChange={() => setFilters({ 
                coBenefits: { 
                  ...filters.coBenefits, 
                  communityDevelopment: !filters.coBenefits.communityDevelopment 
                } 
              })}
              icon={<Users className="w-4 h-4" />}
            />
            <CheckboxItem
              label="Indigenous Rights"
              checked={filters.coBenefits.indigenousRights}
              onChange={() => setFilters({ 
                coBenefits: { 
                  ...filters.coBenefits, 
                  indigenousRights: !filters.coBenefits.indigenousRights 
                } 
              })}
              icon={<Shield className="w-4 h-4" />}
            />
          </div>
        </FilterSection>

        {/* Verification Filter */}
        <FilterSection
          title="Verification"
          isOpen={openSections.verification}
          onToggle={() => toggleSection('verification')}
          count={
            (filters.verification.recentlyAudited ? 1 : 0) +
            (filters.verification.thirdPartyVerified ? 1 : 0)
          }
        >
          <div className="space-y-1">
            <CheckboxItem
              label="Recently Audited (< 6mo)"
              checked={filters.verification.recentlyAudited}
              onChange={() => setFilters({ 
                verification: { 
                  ...filters.verification, 
                  recentlyAudited: !filters.verification.recentlyAudited 
                } 
              })}
              icon={<Clock className="w-4 h-4" />}
            />
            <CheckboxItem
              label="Third-Party Verified"
              checked={filters.verification.thirdPartyVerified}
              onChange={() => setFilters({ 
                verification: { 
                  ...filters.verification, 
                  thirdPartyVerified: !filters.verification.thirdPartyVerified 
                } 
              })}
              icon={<CheckCircle2 className="w-4 h-4" />}
            />
          </div>
        </FilterSection>
      </div>

      {/* Results count */}
      <div className="px-4 py-3 border-t border-white/10 bg-white/5">
        <p className="text-sm text-white/70">
          <span className="font-medium text-white">{filteredCredits().length}</span> credits found
        </p>
      </div>
    </GlassCard>
  )
}
