/**
 * Marketplace Store
 * 
 * Manages marketplace state including filters, listings, and credit browsing.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  CarbonCredit, 
  MarketplaceFilters, 
  MarketplaceListing,
  MarketplaceRegistry,
  MethodologyCategory,
  MethodologySubtype,
} from '@/types/marketplace'

interface MarketplaceStoreState {
  // State
  credits: CarbonCredit[]
  listings: MarketplaceListing[]
  filters: MarketplaceFilters
  selectedCredit: CarbonCredit | null
  isLoading: boolean
  error: string | null
  
  // Pagination
  page: number
  pageSize: number
  totalCredits: number
  
  // View options
  viewMode: 'grid' | 'list'
  compareList: string[]
  watchlist: string[]

  // Actions
  setCredits: (credits: CarbonCredit[]) => void
  setListings: (listings: MarketplaceListing[]) => void
  selectCredit: (credit: CarbonCredit | null) => void
  
  // Filter actions
  setFilters: (filters: Partial<MarketplaceFilters>) => void
  resetFilters: () => void
  toggleRegistry: (registry: MarketplaceRegistry) => void
  toggleMethodology: (methodology: MethodologyCategory) => void
  toggleSubtype: (subtype: MethodologySubtype) => void
  setPriceRange: (min: number, max: number) => void
  setVintageRange: (min: number, max: number) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: MarketplaceFilters['sortBy']) => void
  
  // View actions
  setViewMode: (mode: 'grid' | 'list') => void
  toggleCompare: (creditId: string) => void
  toggleWatchlist: (creditId: string) => void
  clearCompareList: () => void
  
  // Pagination
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  
  // Loading
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed
  filteredCredits: () => CarbonCredit[]
}

const defaultFilters: MarketplaceFilters = {
  registries: [],
  methodologies: [],
  subtypes: [],
  priceRange: { min: 0, max: 500 },
  vintageYears: { min: 2015, max: 2026 },
  countries: [],
  coBenefits: {
    biodiversity: false,
    sdgAligned: false,
    communityDevelopment: false,
    indigenousRights: false,
  },
  minVolume: 0,
  verification: {
    recentlyAudited: false,
    thirdPartyVerified: false,
  },
  sortBy: 'popular',
  searchQuery: '',
}

export const useMarketplaceStore = create<MarketplaceStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      credits: [],
      listings: [],
      filters: defaultFilters,
      selectedCredit: null,
      isLoading: false,
      error: null,
      page: 1,
      pageSize: 12,
      totalCredits: 0,
      viewMode: 'grid',
      compareList: [],
      watchlist: [],

      // Basic setters
      setCredits: (credits) => set({ credits, totalCredits: credits.length }),
      setListings: (listings) => set({ listings }),
      selectCredit: (credit) => set({ selectedCredit: credit }),
      
      // Filter actions
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
        page: 1, // Reset to first page on filter change
      })),
      
      resetFilters: () => set({ filters: defaultFilters, page: 1 }),
      
      toggleRegistry: (registry) => set((state) => {
        const registries = state.filters.registries.includes(registry)
          ? state.filters.registries.filter(r => r !== registry)
          : [...state.filters.registries, registry]
        return { filters: { ...state.filters, registries }, page: 1 }
      }),
      
      toggleMethodology: (methodology) => set((state) => {
        const methodologies = state.filters.methodologies.includes(methodology)
          ? state.filters.methodologies.filter(m => m !== methodology)
          : [...state.filters.methodologies, methodology]
        return { filters: { ...state.filters, methodologies }, page: 1 }
      }),
      
      toggleSubtype: (subtype) => set((state) => {
        const subtypes = state.filters.subtypes.includes(subtype)
          ? state.filters.subtypes.filter(s => s !== subtype)
          : [...state.filters.subtypes, subtype]
        return { filters: { ...state.filters, subtypes }, page: 1 }
      }),
      
      setPriceRange: (min, max) => set((state) => ({
        filters: { ...state.filters, priceRange: { min, max } },
        page: 1,
      })),
      
      setVintageRange: (min, max) => set((state) => ({
        filters: { ...state.filters, vintageYears: { min, max } },
        page: 1,
      })),
      
      setSearchQuery: (query) => set((state) => ({
        filters: { ...state.filters, searchQuery: query },
        page: 1,
      })),
      
      setSortBy: (sortBy) => set((state) => ({
        filters: { ...state.filters, sortBy },
      })),
      
      // View actions
      setViewMode: (mode) => set({ viewMode: mode }),
      
      toggleCompare: (creditId) => set((state) => {
        const compareList = state.compareList.includes(creditId)
          ? state.compareList.filter(id => id !== creditId)
          : state.compareList.length < 4 
            ? [...state.compareList, creditId]
            : state.compareList
        return { compareList }
      }),
      
      toggleWatchlist: (creditId) => set((state) => {
        const watchlist = state.watchlist.includes(creditId)
          ? state.watchlist.filter(id => id !== creditId)
          : [...state.watchlist, creditId]
        return { watchlist }
      }),
      
      clearCompareList: () => set({ compareList: [] }),
      
      // Pagination
      setPage: (page) => set({ page }),
      setPageSize: (pageSize) => set({ pageSize, page: 1 }),
      
      // Loading
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      // Computed - filter credits based on current filters
      filteredCredits: () => {
        const { credits, filters } = get()
        
        return credits.filter(credit => {
          // Registry filter
          if (filters.registries.length > 0 && !filters.registries.includes(credit.registry)) {
            return false
          }
          
          // Methodology filter
          if (filters.methodologies.length > 0 && !filters.methodologies.includes(credit.methodology.category)) {
            return false
          }
          
          // Subtype filter
          if (filters.subtypes.length > 0 && !filters.subtypes.includes(credit.methodology.subtype)) {
            return false
          }
          
          // Price range
          if (credit.priceUsd < filters.priceRange.min || credit.priceUsd > filters.priceRange.max) {
            return false
          }
          
          // Vintage year
          if (credit.vintageYear < filters.vintageYears.min || credit.vintageYear > filters.vintageYears.max) {
            return false
          }
          
          // Country filter
          if (filters.countries.length > 0 && !filters.countries.includes(credit.location.country)) {
            return false
          }
          
          // Min volume
          if (credit.quantity < filters.minVolume) {
            return false
          }
          
          // Co-benefits
          if (filters.coBenefits.biodiversity && !credit.coBenefits.biodiversity) {
            return false
          }
          if (filters.coBenefits.sdgAligned && credit.coBenefits.sdgAligned.length === 0) {
            return false
          }
          if (filters.coBenefits.communityDevelopment && !credit.coBenefits.communityDevelopment) {
            return false
          }
          if (filters.coBenefits.indigenousRights && !credit.coBenefits.indigenousRights) {
            return false
          }
          
          // Verification
          if (filters.verification.thirdPartyVerified && !credit.verification.thirdPartyVerified) {
            return false
          }
          
          // Search query
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase()
            const searchable = `${credit.projectName} ${credit.registryProjectId} ${credit.location.country} ${credit.methodology.name}`.toLowerCase()
            if (!searchable.includes(query)) {
              return false
            }
          }
          
          return true
        }).sort((a, b) => {
          switch (filters.sortBy) {
            case 'price_asc':
              return a.priceUsd - b.priceUsd
            case 'price_desc':
              return b.priceUsd - a.priceUsd
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            case 'oldest':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            case 'volume':
              return b.quantity - a.quantity
            default:
              return 0
          }
        })
      },
    }),
    { name: 'MarketplaceStore' }
  )
)
