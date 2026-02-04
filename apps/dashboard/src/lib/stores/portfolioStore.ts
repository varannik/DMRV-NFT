/**
 * Portfolio Store
 * 
 * Manages user's carbon credit portfolio, holdings, and retirement history.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  PortfolioHolding, 
  PortfolioSummary, 
  Retirement,
  Transaction,
  UserRegistryConnection,
  ImpactMetrics,
  MarketplaceRegistry,
} from '@/types/marketplace'

interface PortfolioStoreState {
  // State
  holdings: PortfolioHolding[]
  summary: PortfolioSummary | null
  transactions: Transaction[]
  retirements: Retirement[]
  registryConnections: UserRegistryConnection[]
  impactMetrics: ImpactMetrics | null
  isLoading: boolean
  error: string | null
  
  // Selected states
  selectedHolding: PortfolioHolding | null
  selectedTransaction: Transaction | null
  
  // View options
  holdingsView: 'grid' | 'table'
  transactionsPage: number
  transactionsPageSize: number
  
  // Sell Modal State
  isSellModalOpen: boolean
  selectedHoldingForSell: PortfolioHolding | null
  sellQuantity: number
  sellPriceUsd: number
  sellPriceNear: number
  
  // Retire Modal State
  isRetireModalOpen: boolean
  selectedHoldingForRetire: PortfolioHolding | null
  retireQuantity: number

  // Actions
  setHoldings: (holdings: PortfolioHolding[]) => void
  setSummary: (summary: PortfolioSummary) => void
  setTransactions: (transactions: Transaction[]) => void
  setRetirements: (retirements: Retirement[]) => void
  setRegistryConnections: (connections: UserRegistryConnection[]) => void
  setImpactMetrics: (metrics: ImpactMetrics) => void
  
  // Selection actions
  selectHolding: (holding: PortfolioHolding | null) => void
  selectTransaction: (transaction: Transaction | null) => void
  
  // View actions
  setHoldingsView: (view: 'grid' | 'table') => void
  setTransactionsPage: (page: number) => void
  
  // Registry connection actions
  addRegistryConnection: (connection: UserRegistryConnection) => void
  removeRegistryConnection: (connectionId: string) => void
  
  // Sell Modal Actions
  openSellModal: (holding: PortfolioHolding) => void
  closeSellModal: () => void
  setSellQuantity: (quantity: number) => void
  setSellPrice: (priceUsd: number, priceNear: number) => void
  executeSell: () => Promise<Transaction>
  
  // Retire Modal Actions
  openRetireModal: (holding: PortfolioHolding) => void
  closeRetireModal: () => void
  setRetireQuantity: (quantity: number) => void
  
  // Retirement action (mock)
  retireCredits: (holdingId: string, quantity: number, details: {
    beneficiaryType: 'individual' | 'organization'
    beneficiaryName: string
    reason: string
    notes?: string
  }) => Promise<Retirement>
  
  // Loading
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed
  getHoldingsByRegistry: (registry: MarketplaceRegistry) => PortfolioHolding[]
  getTotalValue: () => { usd: number; near: number }
  getTotalCredits: () => number
}

export const usePortfolioStore = create<PortfolioStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      holdings: [],
      summary: null,
      transactions: [],
      retirements: [],
      registryConnections: [],
      impactMetrics: null,
      isLoading: false,
      error: null,
      selectedHolding: null,
      selectedTransaction: null,
      holdingsView: 'grid',
      transactionsPage: 1,
      transactionsPageSize: 10,
      
      // Sell Modal State
      isSellModalOpen: false,
      selectedHoldingForSell: null,
      sellQuantity: 1,
      sellPriceUsd: 0,
      sellPriceNear: 0,
      
      // Retire Modal State
      isRetireModalOpen: false,
      selectedHoldingForRetire: null,
      retireQuantity: 1,

      // Basic setters
      setHoldings: (holdings) => set({ holdings }),
      setSummary: (summary) => set({ summary }),
      setTransactions: (transactions) => set({ transactions }),
      setRetirements: (retirements) => set({ retirements }),
      setRegistryConnections: (connections) => set({ registryConnections: connections }),
      setImpactMetrics: (metrics) => set({ impactMetrics: metrics }),
      
      // Selection actions
      selectHolding: (holding) => set({ selectedHolding: holding }),
      selectTransaction: (transaction) => set({ selectedTransaction: transaction }),
      
      // View actions
      setHoldingsView: (view) => set({ holdingsView: view }),
      setTransactionsPage: (page) => set({ transactionsPage: page }),
      
      // Registry connection actions
      addRegistryConnection: (connection) => set((state) => ({
        registryConnections: [...state.registryConnections, connection],
      })),
      
      removeRegistryConnection: (connectionId) => set((state) => ({
        registryConnections: state.registryConnections.filter(c => c.id !== connectionId),
      })),
      
      // Sell Modal Actions
      openSellModal: (holding) => set({
        isSellModalOpen: true,
        selectedHoldingForSell: holding,
        sellQuantity: 1,
        sellPriceUsd: holding.credit.priceUsd,
        sellPriceNear: holding.credit.priceNear,
      }),
      
      closeSellModal: () => set({
        isSellModalOpen: false,
        selectedHoldingForSell: null,
        sellQuantity: 1,
        sellPriceUsd: 0,
        sellPriceNear: 0,
      }),
      
      setSellQuantity: (quantity) => set({ sellQuantity: quantity }),
      
      setSellPrice: (priceUsd, priceNear) => set({ 
        sellPriceUsd: priceUsd,
        sellPriceNear: priceNear,
      }),
      
      executeSell: async () => {
        const { selectedHoldingForSell, sellQuantity, sellPriceUsd, sellPriceNear } = get()
        if (!selectedHoldingForSell) {
          throw new Error('No holding selected')
        }
        
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const transaction: Transaction = {
            id: `TX-${Date.now()}`,
            type: 'sell',
            fromUserId: 'demo-user.near',
            credit: selectedHoldingForSell.credit,
            quantity: sellQuantity,
            priceUsd: sellPriceUsd * sellQuantity,
            priceNear: sellPriceNear * sellQuantity,
            gasFeeNear: 0.01,
            nearTxHash: `${Math.random().toString(36).substr(2, 8)}...${Math.random().toString(36).substr(2, 4)}`,
            blockNumber: Math.floor(Math.random() * 1000000) + 100000000,
            status: 'confirmed',
            confirmations: 12,
            createdAt: new Date().toISOString(),
          }
          
          // Update holdings (reduce quantity)
          set((state) => ({
            holdings: state.holdings.map(h =>
              h.credit.id === selectedHoldingForSell.credit.id
                ? { ...h, quantity: h.quantity - sellQuantity }
                : h
            ).filter(h => h.quantity > 0),
            transactions: [transaction, ...state.transactions],
            isSellModalOpen: false,
            selectedHoldingForSell: null,
            sellQuantity: 1,
            isLoading: false,
          }))
          
          return transaction
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to execute sell order',
            isLoading: false,
          })
          throw error
        }
      },
      
      // Retire Modal Actions
      openRetireModal: (holding) => set({
        isRetireModalOpen: true,
        selectedHoldingForRetire: holding,
        retireQuantity: 1,
      }),
      
      closeRetireModal: () => set({
        isRetireModalOpen: false,
        selectedHoldingForRetire: null,
        retireQuantity: 1,
      }),
      
      setRetireQuantity: (quantity) => set({ retireQuantity: quantity }),
      
      // Retirement action (mock implementation)
      retireCredits: async (holdingId, quantity, details) => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const holding = get().holdings.find(h => h.credit.id === holdingId)
          if (!holding) {
            throw new Error('Holding not found')
          }
          
          const retirement: Retirement = {
            id: `RET-${Date.now()}`,
            userId: 'demo-user.near',
            credit: holding.credit,
            quantity,
            beneficiaryType: details.beneficiaryType,
            beneficiaryName: details.beneficiaryName,
            reason: details.reason as Retirement['reason'],
            notes: details.notes,
            certificateId: `CERT-2026-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            certificateUrl: '#',
            nearTxHash: `${Math.random().toString(36).substr(2, 8)}...${Math.random().toString(36).substr(2, 4)}`,
            impact: {
              co2Tons: quantity,
              equivalentCars: Math.round(quantity / 4.6),
              equivalentMiles: quantity * 2500,
              equivalentTrees: Math.round(quantity * 16.5),
              equivalentGallons: quantity * 25,
            },
            retiredAt: new Date().toISOString(),
          }
          
          // Update holdings (reduce quantity)
          set((state) => ({
            holdings: state.holdings.map(h => 
              h.credit.id === holdingId 
                ? { ...h, quantity: h.quantity - quantity }
                : h
            ).filter(h => h.quantity > 0),
            retirements: [retirement, ...state.retirements],
            isLoading: false,
          }))
          
          return retirement
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to retire credits',
            isLoading: false,
          })
          throw error
        }
      },
      
      // Loading
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      // Computed
      getHoldingsByRegistry: (registry) => {
        return get().holdings.filter(h => h.credit.registry === registry)
      },
      
      getTotalValue: () => {
        const holdings = get().holdings
        return {
          usd: holdings.reduce((sum, h) => sum + h.currentValueUsd, 0),
          near: holdings.reduce((sum, h) => sum + h.currentValueNear, 0),
        }
      },
      
      getTotalCredits: () => {
        return get().holdings.reduce((sum, h) => sum + h.quantity, 0)
      },
    }),
    { name: 'PortfolioStore' }
  )
)
