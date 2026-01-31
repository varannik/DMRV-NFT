'use client'

/**
 * Trading Desk Page
 * 
 * Advanced trading interface for carbon credits.
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight,
  Plus,
  Eye,
  Pause,
  Trash2,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Edit,
  MessageSquare,
} from 'lucide-react'
import clsx from 'clsx'
import { useTradingStore, usePortfolioStore } from '@/lib/stores'
import { GlassCard } from '@/components/shared'
import { WalletConnect } from '@/components/marketplace'
import { 
  mockMyListings, 
  mockOrderBook, 
  mockPortfolioHoldings 
} from '@/lib/data/marketplaceMockData'

export default function TradingDeskPage() {
  const {
    myListings,
    setMyListings,
    orderBook,
    setOrderBook,
    cancelListing,
    pauseListing,
    isLoading,
  } = useTradingStore()

  const { holdings, setHoldings } = usePortfolioStore()

  const [selectedTab, setSelectedTab] = useState<'sell' | 'listings' | 'orderbook'>('listings')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize data
  useEffect(() => {
    setMyListings(mockMyListings)
    setOrderBook(mockOrderBook)
    setHoldings(mockPortfolioHoldings)
    setIsInitialized(true)
  }, [setMyListings, setOrderBook, setHoldings])

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days} days left`
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours > 0) return `${hours} hours left`
    return 'Expiring soon'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Trading Desk</h1>
          <p className="text-white/60 mt-1">
            Create listings and manage your sell orders
          </p>
        </div>
        <WalletConnect />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
          <p className="text-sm text-white/60 mb-1">Active Listings</p>
          <p className="text-2xl font-bold text-white">
            {myListings.filter(l => l.status === 'active').length}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-white/60 mb-1">Total Listed Value</p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(myListings.reduce((sum, l) => sum + l.priceUsd * l.quantity, 0))}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-white/60 mb-1">Total Views</p>
          <p className="text-2xl font-bold text-white">
            {myListings.reduce((sum, l) => sum + l.views, 0)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-white/60 mb-1">Pending Offers</p>
          <p className="text-2xl font-bold text-white">
            {myListings.reduce((sum, l) => sum + l.offers, 0)}
          </p>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['listings', 'sell', 'orderbook'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition',
              selectedTab === tab
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            )}
          >
            {tab === 'listings' && 'My Listings'}
            {tab === 'sell' && 'Create Listing'}
            {tab === 'orderbook' && 'Order Book'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'listings' && (
        <div className="space-y-4">
          {!isInitialized ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
            </div>
          ) : myListings.length === 0 ? (
            <GlassCard className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <ArrowLeftRight className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Active Listings</h3>
              <p className="text-white/60 mb-4">Create your first listing to start trading</p>
              <button
                onClick={() => setSelectedTab('sell')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                <Plus className="w-4 h-4" />
                Create Listing
              </button>
            </GlassCard>
          ) : (
            myListings.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Project Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className={clsx(
                          'px-2 py-1 rounded text-xs font-medium',
                          listing.status === 'active' && 'bg-green-500/20 text-green-400',
                          listing.status === 'sold' && 'bg-blue-500/20 text-blue-400',
                          listing.status === 'cancelled' && 'bg-red-500/20 text-red-400',
                          listing.status === 'expired' && 'bg-gray-500/20 text-gray-400',
                        )}>
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </div>
                        <span className="px-2 py-1 rounded text-xs bg-white/10 text-white/60">
                          {listing.listingType === 'fixed' && 'Fixed Price'}
                          {listing.listingType === 'auction' && 'Auction'}
                          {listing.listingType === 'negotiable' && 'Negotiable'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mt-2">
                        {listing.credit.projectName}
                      </h3>
                      <p className="text-sm text-white/50 mt-1">
                        {listing.credit.registry.replace('_', ' ').toUpperCase()} · {listing.credit.methodology?.name || 'Carbon Credit'}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-white/50">Quantity</p>
                        <p className="font-semibold text-white">{listing.quantity}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/50">Price</p>
                        <p className="font-semibold text-white">{formatCurrency(listing.priceUsd)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/50">Total</p>
                        <p className="font-semibold text-white">{formatCurrency(listing.priceUsd * listing.quantity)}</p>
                      </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {listing.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {listing.watchers}
                      </span>
                      {listing.offers > 0 && (
                        <span className="flex items-center gap-1 text-amber-400">
                          <MessageSquare className="w-4 h-4" />
                          {listing.offers} offers
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {getTimeRemaining(listing.expiresAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => pauseListing(listing.id)}
                        className="p-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => cancelListing(listing.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      )}

      {selectedTab === 'sell' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Listing Form */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Create New Listing</h3>
            
            <div className="space-y-4">
              {/* Select Credits */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Select Credits to Sell</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {holdings.map((holding) => (
                    <label
                      key={holding.credit.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition"
                    >
                      <input
                        type="radio"
                        name="credit"
                        className="w-4 h-4 text-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{holding.credit.projectName}</p>
                        <p className="text-xs text-white/50">{holding.quantity} credits available</p>
                      </div>
                      <span className="text-sm text-white/60">
                        {formatCurrency(holding.credit.priceUsd)}/credit
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Listing Type */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Listing Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['fixed', 'auction', 'negotiable'].map((type) => (
                    <button
                      key={type}
                      className="px-3 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition text-sm capitalize"
                    >
                      {type === 'fixed' ? 'Fixed Price' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Price per Credit</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-7 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="NEAR"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">Ⓝ</span>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Quantity to List</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Duration</label>
                <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer">
                  <option value="7" className="bg-gray-900">7 days</option>
                  <option value="14" className="bg-gray-900">14 days</option>
                  <option value="30" className="bg-gray-900">30 days</option>
                  <option value="60" className="bg-gray-900">60 days</option>
                </select>
              </div>

              {/* Submit */}
              <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition shadow-lg shadow-blue-500/25">
                Create Listing
              </button>
            </div>
          </GlassCard>

          {/* Fee Estimate */}
          <div className="space-y-4">
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Fee Estimate</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Platform Fee (2%)</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">NEAR Gas Fee (est.)</span>
                  <span className="text-white">~0.01 Ⓝ</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-semibold">
                  <span className="text-white">Net Proceeds (est.)</span>
                  <span className="text-white">$0.00</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Market Insights</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Avg. Market Price</span>
                  <span className="text-white">$42.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Suggested Price</span>
                  <span className="text-green-400">$43.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">24h Volume</span>
                  <span className="text-white">$245,000</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {selectedTab === 'orderbook' && (
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Order Book - Solar Credits (Verra)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buy Orders */}
            <div>
              <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Buy Orders
              </h4>
              <div className="space-y-1">
                {orderBook.buyOrders.map((order, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-green-500/5">
                    <span className="text-green-400">{formatCurrency(order.price)}</span>
                    <span className="text-white/60">{order.quantity.toLocaleString()}</span>
                    <div 
                      className="h-1 bg-green-500/30 rounded"
                      style={{ width: `${(order.quantity / 12000) * 100}px` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sell Orders */}
            <div>
              <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Sell Orders
              </h4>
              <div className="space-y-1">
                {orderBook.sellOrders.map((order, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-red-500/5">
                    <span className="text-red-400">{formatCurrency(order.price)}</span>
                    <span className="text-white/60">{order.quantity.toLocaleString()}</span>
                    <div 
                      className="h-1 bg-red-500/30 rounded"
                      style={{ width: `${(order.quantity / 9000) * 100}px` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
