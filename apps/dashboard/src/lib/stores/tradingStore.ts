/**
 * Trading Store
 * 
 * Manages trading desk state including listings, orders, and order book.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  MarketplaceListing, 
  BuyOrder, 
  OrderBookEntry,
  CarbonCredit,
  ListingType,
} from '@/types/marketplace'

interface TradingStoreState {
  // State
  myListings: MarketplaceListing[]
  myOrders: BuyOrder[]
  orderBook: {
    buyOrders: OrderBookEntry[]
    sellOrders: OrderBookEntry[]
  }
  recentTrades: BuyOrder[]
  isLoading: boolean
  error: string | null
  
  // Form state for creating listings
  listingDraft: {
    creditId: string | null
    quantity: number
    priceUsd: number
    priceNear: number
    listingType: ListingType
    duration: number
    minimumPurchase: number
  } | null
  
  // Selected states
  selectedListing: MarketplaceListing | null
  selectedOrder: BuyOrder | null
  
  // Modal states
  isCreateListingModalOpen: boolean
  isBuyModalOpen: boolean
  selectedCreditForBuy: CarbonCredit | null
  buyQuantity: number

  // Actions
  setMyListings: (listings: MarketplaceListing[]) => void
  setMyOrders: (orders: BuyOrder[]) => void
  setOrderBook: (orderBook: { buyOrders: OrderBookEntry[]; sellOrders: OrderBookEntry[] }) => void
  setRecentTrades: (trades: BuyOrder[]) => void
  
  // Selection actions
  selectListing: (listing: MarketplaceListing | null) => void
  selectOrder: (order: BuyOrder | null) => void
  
  // Listing actions
  setListingDraft: (draft: TradingStoreState['listingDraft']) => void
  createListing: () => Promise<MarketplaceListing>
  cancelListing: (listingId: string) => Promise<void>
  pauseListing: (listingId: string) => Promise<void>
  
  // Buy modal actions
  openBuyModal: (credit: CarbonCredit) => void
  closeBuyModal: () => void
  setBuyQuantity: (quantity: number) => void
  executeBuy: () => Promise<BuyOrder>
  
  // Create listing modal
  openCreateListingModal: () => void
  closeCreateListingModal: () => void
  
  // Loading
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTradingStore = create<TradingStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      myListings: [],
      myOrders: [],
      orderBook: {
        buyOrders: [],
        sellOrders: [],
      },
      recentTrades: [],
      isLoading: false,
      error: null,
      listingDraft: null,
      selectedListing: null,
      selectedOrder: null,
      isCreateListingModalOpen: false,
      isBuyModalOpen: false,
      selectedCreditForBuy: null,
      buyQuantity: 1,

      // Basic setters
      setMyListings: (listings) => set({ myListings: listings }),
      setMyOrders: (orders) => set({ myOrders: orders }),
      setOrderBook: (orderBook) => set({ orderBook }),
      setRecentTrades: (trades) => set({ recentTrades: trades }),
      
      // Selection actions
      selectListing: (listing) => set({ selectedListing: listing }),
      selectOrder: (order) => set({ selectedOrder: order }),
      
      // Listing actions
      setListingDraft: (draft) => set({ listingDraft: draft }),
      
      createListing: async () => {
        const { listingDraft } = get()
        if (!listingDraft || !listingDraft.creditId) {
          throw new Error('No listing draft')
        }
        
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          const listing: MarketplaceListing = {
            id: `LST-${Date.now()}`,
            sellerId: 'demo-user.near',
            credit: {} as CarbonCredit, // Would be fetched from credit ID
            quantity: listingDraft.quantity,
            priceUsd: listingDraft.priceUsd,
            priceNear: listingDraft.priceNear,
            listingType: listingDraft.listingType,
            status: 'active',
            minimumPurchase: listingDraft.minimumPurchase,
            expiresAt: new Date(Date.now() + listingDraft.duration * 24 * 60 * 60 * 1000).toISOString(),
            views: 0,
            watchers: 0,
            offers: 0,
            createdAt: new Date().toISOString(),
          }
          
          set((state) => ({
            myListings: [listing, ...state.myListings],
            listingDraft: null,
            isCreateListingModalOpen: false,
            isLoading: false,
          }))
          
          return listing
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create listing',
            isLoading: false,
          })
          throw error
        }
      },
      
      cancelListing: async (listingId) => {
        set({ isLoading: true, error: null })
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          set((state) => ({
            myListings: state.myListings.map(l => 
              l.id === listingId ? { ...l, status: 'cancelled' as const } : l
            ),
            isLoading: false,
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to cancel listing',
            isLoading: false,
          })
          throw error
        }
      },
      
      pauseListing: async (listingId) => {
        // Toggle between active and paused (not a real status, just demo)
        set((state) => ({
          myListings: state.myListings.map(l => 
            l.id === listingId 
              ? { ...l, status: l.status === 'active' ? 'cancelled' as const : 'active' as const }
              : l
          ),
        }))
      },
      
      // Buy modal actions
      openBuyModal: (credit) => set({ 
        isBuyModalOpen: true, 
        selectedCreditForBuy: credit,
        buyQuantity: 1,
      }),
      
      closeBuyModal: () => set({ 
        isBuyModalOpen: false, 
        selectedCreditForBuy: null,
        buyQuantity: 1,
      }),
      
      setBuyQuantity: (quantity) => set({ buyQuantity: quantity }),
      
      executeBuy: async () => {
        const { selectedCreditForBuy, buyQuantity } = get()
        if (!selectedCreditForBuy) {
          throw new Error('No credit selected')
        }
        
        set({ isLoading: true, error: null })
        
        try {
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const order: BuyOrder = {
            id: `ORD-${Date.now()}`,
            buyerId: 'demo-user.near',
            listingId: `LST-${selectedCreditForBuy.id}`,
            quantity: buyQuantity,
            priceUsd: selectedCreditForBuy.priceUsd * buyQuantity,
            priceNear: selectedCreditForBuy.priceNear * buyQuantity,
            status: 'completed',
            nearTxHash: `${Math.random().toString(36).substr(2, 8)}...${Math.random().toString(36).substr(2, 4)}`,
            createdAt: new Date().toISOString(),
          }
          
          set((state) => ({
            myOrders: [order, ...state.myOrders],
            isBuyModalOpen: false,
            selectedCreditForBuy: null,
            buyQuantity: 1,
            isLoading: false,
          }))
          
          return order
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to execute buy order',
            isLoading: false,
          })
          throw error
        }
      },
      
      // Create listing modal
      openCreateListingModal: () => set({ 
        isCreateListingModalOpen: true,
        listingDraft: {
          creditId: null,
          quantity: 0,
          priceUsd: 0,
          priceNear: 0,
          listingType: 'fixed',
          duration: 30,
          minimumPurchase: 1,
        },
      }),
      
      closeCreateListingModal: () => set({ 
        isCreateListingModalOpen: false,
        listingDraft: null,
      }),
      
      // Loading
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    { name: 'TradingStore' }
  )
)
