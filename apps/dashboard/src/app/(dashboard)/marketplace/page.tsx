'use client'

/**
 * Marketplace Browse Page
 * 
 * Main marketplace for browsing and purchasing carbon credits.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import clsx from 'clsx'
import { useMarketplaceStore, useTradingStore } from '@/lib/stores'
import { GlassCard } from '@/components/shared'
import { 
  CreditCard, 
  MarketplaceFilters, 
  BuyModal,
  MarketplaceStats,
  WalletConnect,
} from '@/components/marketplace'
import { mockCredits, mockMarketAnalytics } from '@/lib/data/marketplaceMockData'
import type { CarbonCredit } from '@/types/marketplace'

// Sort options
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'volume', label: 'Highest Volume' },
] as const

export default function MarketplacePage() {
  const {
    setCredits,
    filteredCredits,
    filters,
    setSortBy,
    viewMode,
    setViewMode,
    watchlist,
    compareList,
    toggleWatchlist,
    toggleCompare,
    page,
    pageSize,
    setPage,
  } = useMarketplaceStore()

  const { openBuyModal } = useTradingStore()

  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize credits
  useEffect(() => {
    setIsLoading(true)
    // Simulate loading
    const timer = setTimeout(() => {
      setCredits(mockCredits)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [setCredits])

  const credits = filteredCredits()
  const paginatedCredits = credits.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(credits.length / pageSize)

  const handleViewDetails = (credit: CarbonCredit) => {
    // Could open a modal or navigate to detail page
    console.log('View details:', credit.id)
  }

  const handleBuy = (credit: CarbonCredit) => {
    openBuyModal(credit)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Carbon Credit Marketplace</h1>
          <p className="text-white/60 mt-1">
            Browse verified carbon credits from trusted registries
          </p>
        </div>
        <WalletConnect />
      </div>

      {/* Market Stats */}
      <MarketplaceStats
        stats={{
          totalVolume24h: mockMarketAnalytics.totalVolume24h,
          totalTransactions24h: mockMarketAnalytics.totalTransactions24h,
          avgPrice: mockMarketAnalytics.avgPrice,
          priceChange24h: mockMarketAnalytics.priceChange24h,
          activeListings: mockCredits.length,
          totalCredits: mockCredits.reduce((sum, c) => sum + c.quantity, 0),
        }}
      />

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-6">
            <MarketplaceFilters />
          </div>
        </div>

        {/* Credits Grid */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <GlassCard className="!p-3 mb-4">
            <div className="flex items-center justify-between gap-4">
              {/* Results count */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">
                  <span className="font-medium text-white">{credits.length}</span> credits
                </span>
                {compareList.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                    {compareList.length} comparing
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof filters.sortBy)}
                    className="appearance-none px-3 py-2 pr-8 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex items-center rounded-lg bg-white/10 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={clsx(
                      'p-1.5 rounded transition',
                      viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={clsx(
                      'p-1.5 rounded transition',
                      viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[420px] rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : credits.length === 0 ? (
            /* Empty State */
            <GlassCard className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No credits found</h3>
              <p className="text-white/60 mb-4">
                Try adjusting your filters to find more credits
              </p>
              <button
                onClick={() => useMarketplaceStore.getState().resetFilters()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </button>
            </GlassCard>
          ) : (
            /* Credits Grid */
            <>
              <motion.div
                layout
                className={clsx(
                  'grid gap-4',
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                <AnimatePresence mode="popLayout">
                  {paginatedCredits.map((credit, index) => (
                    <motion.div
                      key={credit.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CreditCard
                        credit={credit}
                        onBuy={handleBuy}
                        onViewDetails={handleViewDetails}
                        onToggleWatchlist={toggleWatchlist}
                        onToggleCompare={toggleCompare}
                        isInWatchlist={watchlist.includes(credit.id)}
                        isInCompare={compareList.includes(credit.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={clsx(
                          'w-10 h-10 rounded-lg transition',
                          page === i + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50 lg:hidden p-4"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="absolute -right-3 top-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <MarketplaceFilters />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Buy Modal */}
      <BuyModal />
    </div>
  )
}
