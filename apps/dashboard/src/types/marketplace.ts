/**
 * DMRV Marketplace - Type Definitions
 * 
 * TypeScript interfaces for the Carbon Credit Marketplace on NEAR Protocol.
 */

// ============================================
// Registry Types
// ============================================

export type MarketplaceRegistry = 
  | 'verra'
  | 'gold_standard'
  | 'acr'
  | 'car'
  | 'gcc'
  | 'art'
  | 'plan_vivo'
  | 'independent'

export interface RegistryInfo {
  id: MarketplaceRegistry
  name: string
  code: string
  website: string
  description: string
  established: number
  accreditation: string[]
  logoUrl?: string
}

// ============================================
// Methodology Types
// ============================================

export type MethodologyCategory = 
  | 'renewable_energy'
  | 'forestry_land_use'
  | 'blue_carbon'
  | 'carbon_capture'
  | 'methane_management'
  | 'soil_carbon'
  | 'energy_efficiency'
  | 'industrial_processes'
  | 'transportation'

export type MethodologySubtype = 
  // Renewable Energy
  | 'solar' | 'wind' | 'hydro' | 'geothermal'
  // Forestry & Land Use
  | 'redd_plus' | 'afforestation' | 'ifm' | 'agroforestry'
  // Blue Carbon
  | 'coastal_wetlands' | 'mangrove' | 'seagrass'
  // Carbon Capture
  | 'dac' | 'beccs' | 'enhanced_weathering'
  // Methane
  | 'landfill_gas' | 'agricultural_methane'
  // Soil Carbon
  | 'regenerative_agriculture' | 'biochar'
  // Energy Efficiency
  | 'industrial_efficiency' | 'building_efficiency'
  // Transportation
  | 'clean_cookstoves' | 'fuel_switching'

export interface Methodology {
  category: MethodologyCategory
  subtype: MethodologySubtype
  name: string
  description: string
  permanenceYears: number
  verificationStandard: string
}

// ============================================
// Carbon Credit Types
// ============================================

export type CreditStatus = 'available' | 'sold' | 'reserved' | 'retired'

export interface CoBenefits {
  sdgAligned: number[] // SDG goal numbers
  biodiversity: boolean
  communityDevelopment: boolean
  indigenousRights: boolean
  jobsCreated?: number
}

export interface CarbonCredit {
  id: string
  projectId: string
  projectName: string
  registry: MarketplaceRegistry
  registryProjectId: string
  methodology: Methodology
  vintageYear: number
  location: {
    country: string
    region?: string
    coordinates?: { lat: number; lng: number }
  }
  quantity: number
  priceUsd: number
  priceNear: number
  status: CreditStatus
  imageUrl?: string
  coBenefits: CoBenefits
  verification: {
    lastAudit: string
    thirdPartyVerified: boolean
    certifications: string[]
  }
  seller: string // NEAR wallet address
  nearTokenId?: string
  nearContractAddress?: string
  createdAt: string
  updatedAt: string
}

// ============================================
// Portfolio Types
// ============================================

export interface PortfolioHolding {
  credit: CarbonCredit
  quantity: number
  purchasePriceUsd: number
  purchasePriceNear: number
  currentValueUsd: number
  currentValueNear: number
  acquiredAt: string
  percentChange: number
}

export interface PortfolioSummary {
  totalCredits: number
  totalValueUsd: number
  totalValueNear: number
  totalCo2Offset: number
  percentChange24h: number
  percentChange7d: number
  percentChange30d: number
  byRegistry: Record<MarketplaceRegistry, { credits: number; valueUsd: number }>
  byMethodology: Record<MethodologyCategory, { credits: number; percentage: number }>
}

// ============================================
// Trading Types
// ============================================

export type ListingType = 'fixed' | 'auction' | 'negotiable'
export type ListingStatus = 'active' | 'sold' | 'cancelled' | 'expired'

export interface MarketplaceListing {
  id: string
  sellerId: string
  credit: CarbonCredit
  quantity: number
  priceUsd: number
  priceNear: number
  listingType: ListingType
  status: ListingStatus
  minimumPurchase?: number
  expiresAt: string
  views: number
  watchers: number
  offers: number
  createdAt: string
}

export interface BuyOrder {
  id: string
  buyerId: string
  listingId: string
  quantity: number
  priceUsd: number
  priceNear: number
  status: 'pending' | 'completed' | 'cancelled' | 'failed'
  nearTxHash?: string
  createdAt: string
}

export interface OrderBookEntry {
  price: number
  quantity: number
  type: 'buy' | 'sell'
}

// ============================================
// Transaction Types
// ============================================

export type TransactionType = 'buy' | 'sell' | 'retire' | 'transfer'
export type TransactionStatus = 'pending' | 'confirmed' | 'failed'

export interface Transaction {
  id: string
  type: TransactionType
  fromUserId?: string
  toUserId?: string
  credit: CarbonCredit
  quantity: number
  priceUsd: number
  priceNear: number
  gasFeeNear: number
  nearTxHash: string
  blockNumber: number
  status: TransactionStatus
  confirmations: number
  createdAt: string
}

// ============================================
// Retirement Types
// ============================================

export type RetirementReason = 
  | 'personal_offset'
  | 'corporate_sustainability'
  | 'event_neutrality'
  | 'product_neutrality'
  | 'voluntary'
  | 'other'

export interface Retirement {
  id: string
  userId: string
  credit: CarbonCredit
  quantity: number
  beneficiaryType: 'individual' | 'organization'
  beneficiaryName: string
  reason: RetirementReason
  notes?: string
  certificateId: string
  certificateUrl: string
  nearTxHash: string
  impact: {
    co2Tons: number
    equivalentCars: number
    equivalentMiles: number
    equivalentTrees: number
    equivalentGallons: number
  }
  retiredAt: string
}

// ============================================
// NEAR Wallet Types
// ============================================

export type NetworkType = 'mainnet' | 'testnet'

export interface WalletState {
  isConnected: boolean
  accountId: string | null
  balance: {
    near: number
    usd: number
  }
  network: NetworkType
}

export interface NetworkStatus {
  network: NetworkType
  isHealthy: boolean
  blockHeight: number
  tps: number
  activeValidators: number
  totalTransactions: number
  avgBlockTime: number
  gasPrice: number
}

export interface SmartContractInfo {
  address: string
  type: string
  auditStatus: 'verified' | 'pending' | 'unverified'
  lastAudit?: string
  auditor?: string
}

// ============================================
// Filter Types
// ============================================

export interface MarketplaceFilters {
  registries: MarketplaceRegistry[]
  methodologies: MethodologyCategory[]
  subtypes: MethodologySubtype[]
  priceRange: { min: number; max: number }
  vintageYears: { min: number; max: number }
  countries: string[]
  coBenefits: {
    biodiversity: boolean
    sdgAligned: boolean
    communityDevelopment: boolean
    indigenousRights: boolean
  }
  minVolume: number
  verification: {
    recentlyAudited: boolean
    thirdPartyVerified: boolean
  }
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'popular' | 'volume' | 'rating'
  searchQuery: string
}

// ============================================
// User Registry Connection Types
// ============================================

export interface UserRegistryConnection {
  id: string
  registry: MarketplaceRegistry
  accountId: string
  isVerified: boolean
  credits: number
  connectedAt: string
}

// ============================================
// Analytics Types
// ============================================

export interface MarketAnalytics {
  totalVolume24h: number
  totalVolume7d: number
  totalTransactions24h: number
  avgPrice: number
  priceChange24h: number
  topProjects: { projectName: string; volume: number }[]
  priceByMethodology: Record<MethodologyCategory, number>
}

export interface ImpactMetrics {
  totalCo2Offset: number
  totalRetirements: number
  equivalentCars: number
  equivalentTrees: number
  equivalentMiles: number
  equivalentHomes: number
  byMethodology: Record<MethodologyCategory, number>
  timeline: { date: string; co2: number }[]
}
