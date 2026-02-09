# DMRV Carbon Credit Marketplace — Software Requirements Specification

> **Version:** 1.0  
> **Last Updated:** February 8, 2026  
> **Status:** Draft  
> **Module:** `apps/dashboard` — Marketplace (`/marketplace/*`)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Detailed Requirements](#3-detailed-requirements)
   - 3.1 [Functional Requirements](#31-functional-requirements)
   - 3.2 [Non-Functional Requirements](#32-non-functional-requirements)
   - 3.3 [Technical Requirements](#33-technical-requirements)
4. [Resource Planning](#4-resource-planning)
   - 4.1 [Team Structure](#41-team-structure)
   - 4.2 [Tools and Infrastructure](#42-tools-and-infrastructure)
   - 4.3 [Budget Estimation](#43-budget-estimation)
5. [Project Timeline and Milestones](#5-project-timeline-and-milestones)
   - 5.1 [Project Phases](#51-project-phases)
   - 5.2 [Sprint Planning](#52-sprint-planning)
   - 5.3 [Key Milestones](#53-key-milestones)
6. [Risk Management](#6-risk-management)
7. [Project Management Methodology](#7-project-management-methodology)
8. [Quality Assurance Strategy](#8-quality-assurance-strategy)
9. [Deployment Strategy](#9-deployment-strategy)
10. [Post-Launch Support](#10-post-launch-support)
11. [Stakeholder Management](#11-stakeholder-management)
12. [Constraints and Assumptions](#12-constraints-and-assumptions)
13. [Dependencies](#13-dependencies)
14. [Appendices](#14-appendices)

---

## 1. Executive Summary

### 1.1 Project Vision and Mission

**Vision:** Build the most transparent, verifiable, and accessible decentralized carbon credit marketplace on the NEAR Protocol, bridging traditional carbon registries with blockchain-native trading infrastructure.

**Mission:** Enable organizations and individuals to buy, sell, retire, and track verified carbon credits through an intuitive marketplace interface backed by NEAR blockchain immutability and the DMRV (Digital Measurement, Reporting, and Verification) framework.

### 1.2 Business Objectives

| Objective | Measurable Outcome |
|---|---|
| Democratize carbon credit access | 10,000+ registered users within 12 months |
| Bridge off-chain registries to on-chain | Support 8 major registries (Verra, Gold Standard, ACR, CAR, GCC, ART, Plan Vivo, Independent) |
| Enable transparent price discovery | Real-time order book with < 2s latency |
| Support credit retirement | Verifiable on-chain retirement certificates |
| Drive voluntary carbon market growth | $10M+ in trading volume within 18 months |

### 1.3 High-Level Scope

The Marketplace module is a sub-application within the DMRV Dashboard (`apps/dashboard`) that provides:

- **Carbon Credit Browsing** — Search, filter, and discover credits from multiple registries
- **Trading Desk** — Create listings (fixed, auction, negotiable), manage orders
- **Portfolio Management** — Track holdings, transaction history, and retirement certificates
- **Market Analytics** — Volume trends, price discovery, methodology breakdowns
- **NEAR Blockchain Explorer** — On-chain transaction verification and smart contract visibility
- **Registry Connections** — Link external registry accounts to import credits

### 1.4 Strategic Alignment

The Marketplace is the monetization and distribution layer of the DMRV platform. It sits downstream of:

- **Project Creation** — Carbon offset projects that generate credits
- **MRV Submission & Verification** — The verification pipeline that validates credits
- **Credit Issuance / NFT Minting** — NEAR-based tokenization that makes credits tradeable

---

## 2. Project Overview

### 2.1 Problem Statement

The voluntary carbon market suffers from:

1. **Fragmentation** — Credits are siloed across 8+ disconnected registries with no unified interface
2. **Opacity** — Price discovery is opaque; buyers and sellers lack real-time market data
3. **Friction** — Buying, selling, and retiring credits requires manual processes with multiple intermediaries
4. **Trust** — Verification integrity depends on centralized actors; double-counting remains a risk
5. **Accessibility** — Small-scale participants face high barriers to entry (minimum lot sizes, custody complexity)

### 2.2 Target Audience

| Persona | Description | Key Needs |
|---|---|---|
| **Corporate Buyer** | ESG/sustainability teams purchasing offsets | Bulk buying, compliance reports, retirement certificates |
| **Individual Offset Buyer** | Climate-conscious individual | Simple purchase flow, impact visualization, small lot sizes |
| **Project Developer (Seller)** | Carbon project owner listing credits | Listing creation, pricing tools, sales analytics |
| **Carbon Broker / Trader** | Professional intermediary | Order book, advanced trading, volume analytics |
| **Compliance Officer** | Internal audit / regulatory staff | Transaction history, retirement audit trail, registry traceability |
| **Registry Administrator** | Registry staff verifying connections | API key management, credit sync, verification status |

### 2.3 Value Proposition

| Differentiator | Description |
|---|---|
| **Multi-Registry Unified View** | Single interface to browse credits across Verra, Gold Standard, ACR, CAR, GCC, ART, Plan Vivo |
| **Blockchain-Backed Transparency** | Every trade, transfer, and retirement recorded on NEAR Protocol |
| **Verifiable Retirement** | On-chain retirement certificates with immutable impact data |
| **Real-Time Price Discovery** | Live order book with buy/sell depth and methodology-based pricing |
| **DMRV Integration** | Credits backed by full MRV data lineage from the same platform |

### 2.4 Success Metrics (KPIs)

| Metric | Target | Measurement |
|---|---|---|
| Monthly Active Users (MAU) | 2,500+ by Month 6 | Analytics |
| Total Trading Volume | $1M+ per month by Month 9 | Transaction logs |
| Average Order Completion Time | < 30 seconds | From order placement to NEAR confirmation |
| Credit Listing Count | 500+ active listings | Marketplace store |
| Registry Connection Rate | 60% of users connect ≥1 registry | User analytics |
| Retirement Certificate Issuance | 100+ per month by Month 6 | Retirement store |
| User Satisfaction (NPS) | > 40 | Quarterly surveys |
| Platform Uptime | 99.9% | Monitoring |

---

## 3. Detailed Requirements

### 3.1 Functional Requirements

#### 3.1.1 Marketplace Browse (`/marketplace`)

**User Stories:**

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| MKT-001 | As a buyer, I want to browse available carbon credits in a grid or list view, so that I can discover credits to purchase | Must-have | Grid/list toggle; credits display project name, registry, methodology, vintage, price (USD + NEAR), quantity, co-benefits |
| MKT-002 | As a buyer, I want to filter credits by registry, methodology, price range, vintage year, country, co-benefits, and verification status, so that I can find credits matching my criteria | Must-have | All 7 filter dimensions functional; filters persist across page navigation; filter reset button |
| MKT-003 | As a buyer, I want to sort credits by price (asc/desc), popularity, volume, and date, so that I can prioritize my search | Must-have | 6 sort options: Most Popular, Price Low→High, Price High→Low, Newest, Oldest, Highest Volume |
| MKT-004 | As a buyer, I want to view a detailed credit modal with full project info, verification data, co-benefits, and seller info, so that I can make an informed purchase decision | Must-have | Modal shows all `CarbonCredit` fields; includes verification audit date, third-party status, certifications |
| MKT-005 | As a buyer, I want to add credits to a watchlist, so that I can track credits I'm interested in | Should-have | Toggle watchlist per credit; watchlist persists in local storage; visual indicator on card |
| MKT-006 | As a buyer, I want to compare up to 3 credits side-by-side, so that I can evaluate alternatives | Should-have | Compare toggle on card; comparison count badge in toolbar |
| MKT-007 | As a buyer, I want paginated results, so that I can navigate large result sets efficiently | Must-have | Page size configurable; prev/next buttons; page number buttons; results count displayed |
| MKT-008 | As a buyer, I want responsive mobile filters that slide in from the left, so that I can filter on mobile devices | Must-have | Mobile filter drawer with spring animation; overlay backdrop; close button |

**Market Stats Display:**

| Stat | Source |
|---|---|
| 24h Trading Volume | `MarketAnalytics.totalVolume24h` |
| Daily Transactions | `MarketAnalytics.totalTransactions24h` |
| Average Price | `MarketAnalytics.avgPrice` |
| 24h Price Change | `MarketAnalytics.priceChange24h` |
| Active Listings Count | Derived from credits array |
| Total Credits Available | Sum of all credit quantities |

#### 3.1.2 Buy Flow

**User Stories:**

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| BUY-001 | As a buyer, I want to click "Buy" on a credit card or detail modal to initiate a purchase, so that I can acquire credits | Must-have | Buy button opens `BuyModal`; pre-populated with credit info |
| BUY-002 | As a buyer, I want to specify the quantity of credits to purchase, so that I can buy partial lots | Must-have | Quantity input with min/max validation; real-time total calculation |
| BUY-003 | As a buyer, I want to see a price breakdown (subtotal, platform fee, gas fee, total) before confirming, so that I know the full cost | Must-have | Breakdown shows USD and NEAR amounts; platform fee (2%); estimated NEAR gas fee |
| BUY-004 | As a buyer, I want to confirm the purchase via my connected NEAR wallet, so that the transaction is signed and submitted on-chain | Must-have | Wallet must be connected; transaction signed via NEAR wallet; confirmation toast on success |
| BUY-005 | As a buyer, I want to see transaction status (pending → confirmed → complete) after purchase, so that I know the order was successful | Must-have | Status indicator; NEAR transaction hash link; confirmations count |

#### 3.1.3 Trading Desk (`/marketplace/trading`)

**User Stories:**

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| TRD-001 | As a seller, I want to create a new listing by selecting credits from my holdings, setting a price, and choosing a listing type, so that I can sell my credits | Must-have | Select from portfolio holdings; listing types: Fixed Price, Auction, Negotiable; price input in USD with NEAR auto-conversion |
| TRD-002 | As a seller, I want to set listing duration (7, 14, 30, 60 days), so that my listing auto-expires | Must-have | Duration dropdown; expiration date calculated and displayed |
| TRD-003 | As a seller, I want to see a fee estimate before creating a listing, so that I understand my net proceeds | Must-have | Platform fee (2%); estimated NEAR gas fee (~0.01 Ⓝ); net proceeds calculation |
| TRD-004 | As a seller, I want to view all my active listings with status, engagement metrics (views, watchers, offers), and time remaining, so that I can manage my sales | Must-have | Listing card shows: status badge, listing type, project name, registry, quantity, price, total value, views, watchers, offers, time remaining |
| TRD-005 | As a seller, I want to pause, resume, and cancel my listings, so that I can manage my sales strategy | Must-have | Pause button; cancel button with confirmation; status updates reflected immediately |
| TRD-006 | As a seller, I want to edit the price of an existing listing, so that I can adjust to market conditions | Should-have | Edit button; inline price editing; validation |
| TRD-007 | As a trader, I want to view the order book with buy and sell orders, so that I can understand market depth | Must-have | Split view: buy orders (green) and sell orders (red); price and quantity columns; visual depth bars |

**Trading Desk Stats:**

| Stat | Derivation |
|---|---|
| Active Listings | Count of listings with `status === 'active'` |
| Total Listed Value | Sum of `priceUsd × quantity` for all listings |
| Total Views | Sum of `views` across all listings |
| Pending Offers | Sum of `offers` across all listings |

**Market Insights Panel:**

| Data Point | Description |
|---|---|
| Average Market Price | Mean price across all active listings |
| Suggested Price | Algorithmic recommendation based on recent trades |
| 24h Volume | Total USD volume in last 24 hours |

#### 3.1.4 Portfolio (`/marketplace/portfolio`)

**User Stories:**

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| PRT-001 | As a holder, I want to view my portfolio summary (total credits, total value in USD/NEAR, CO₂ offset, and % change over 24h/7d/30d), so that I can track my portfolio performance | Must-have | `PortfolioSummary` rendered via `PortfolioStats` component |
| PRT-002 | As a holder, I want to view holdings broken down by registry, so that I understand diversification | Must-have | Registry breakdown cards with gradient branding, credit count, and USD value |
| PRT-003 | As a holder, I want to view holdings in grid or table view with project name, registry, quantity, average price, current value, and % change, so that I can evaluate each position | Must-have | Grid/table toggle; table with sortable columns; grid with summary cards |
| PRT-004 | As a holder, I want to sell credits from my portfolio, so that I can list them on the marketplace | Must-have | Sell button per holding → opens `SellModal` pre-populated with holding data |
| PRT-005 | As a holder, I want to retire credits from my portfolio, so that I can permanently offset emissions | Must-have | Retire button per holding → opens `RetireModal` with beneficiary and reason fields |
| PRT-006 | As a holder, I want to view my full transaction history (buy, sell, retire, transfer), so that I can audit my activity | Must-have | Transaction list with type icon, project name, date/time, quantity, price, NEAR explorer link |
| PRT-007 | As a holder, I want to view my environmental impact metrics (total CO₂ offset, equivalent cars, trees, homes, miles), so that I can understand my contribution | Must-have | Impact dashboard with visual equivalents; methodology breakdown; timeline chart |
| PRT-008 | As a holder, I want to view and download retirement certificates, so that I can prove my offsets | Must-have | Certificate list with ID, quantity, beneficiary, date; Certificate button per retirement |
| PRT-009 | As a holder, I want to export a portfolio report, so that I can share with stakeholders | Should-have | Export Report button; PDF/CSV generation |

**Retirement Flow:**

| Field | Type | Required | Description |
|---|---|---|---|
| Quantity | number | Yes | Number of credits to retire |
| Beneficiary Type | `'individual' \| 'organization'` | Yes | Who the retirement is on behalf of |
| Beneficiary Name | string | Yes | Name of individual or organization |
| Reason | `RetirementReason` | Yes | One of: `personal_offset`, `corporate_sustainability`, `event_neutrality`, `product_neutrality`, `voluntary`, `other` |
| Notes | string | No | Optional description |

**Retirement Output:**

| Output | Description |
|---|---|
| Certificate ID | Unique identifier (e.g., `RET-2026-001234`) |
| Certificate URL | Downloadable/viewable certificate |
| NEAR Transaction Hash | On-chain proof of retirement (burn) |
| Impact Metrics | CO₂ tons, equivalent cars, miles, trees, gallons |

#### 3.1.5 Market Analytics (`/marketplace/analytics`)

**User Stories:**

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| ANL-001 | As a user, I want to view trading volume, average price, daily transactions, and total retired CO₂, so that I understand market health | Must-have | 4 key metric cards with trend indicators |
| ANL-002 | As a user, I want to filter analytics by time range (24h, 7d, 30d, 90d), so that I can compare periods | Must-have | Time range toggle; data updates on selection |
| ANL-003 | As a user, I want to see a ranked list of top projects by volume, so that I can identify popular credits | Must-have | Ranked list with progress bars relative to top project |
| ANL-004 | As a user, I want to see average price by methodology, so that I can compare category pricing | Must-have | Color-coded methodology list with prices |
| ANL-005 | As a user, I want to see market distribution by methodology (percentage breakdown), so that I can understand market composition | Must-have | Percentage circles per methodology with tonnage |
| ANL-006 | As a user, I want to see a CO₂ offset timeline chart, so that I can track environmental progress over time | Must-have | Bar chart with monthly data points; animated bars |

**Methodology Categories (9):**

| Category | Color Code | Subtypes |
|---|---|---|
| Renewable Energy | `#3B82F6` | Solar, Wind, Hydro, Geothermal |
| Forestry & Land Use | `#22C55E` | REDD+, Afforestation, IFM, Agroforestry |
| Blue Carbon | `#0EA5E9` | Coastal Wetlands, Mangrove, Seagrass |
| Carbon Capture | `#8B5CF6` | DAC, BECCS, Enhanced Weathering |
| Methane Management | `#F59E0B` | Landfill Gas, Agricultural Methane |
| Soil Carbon | `#84CC16` | Regenerative Agriculture, Biochar |
| Energy Efficiency | `#EAB308` | Industrial Efficiency, Building Efficiency |
| Industrial Processes | `#6B7280` | — |
| Transportation | `#EC4899` | Clean Cookstoves, Fuel Switching |

#### 3.1.6 NEAR Explorer (`/marketplace/explorer`)

**User Stories:**

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| EXP-001 | As a user, I want to view the NEAR network status (health, block height, TPS, validators, total TXs, block time, gas price), so that I can confirm network health | Must-have | 6 metric tiles; health indicator with pulse animation |
| EXP-002 | As a user, I want to view smart contract info (address, type, audit status, auditor, version, available functions), so that I trust the contract | Must-have | Contract card with NEP-141 details; audit badge; function list |
| EXP-003 | As a user, I want to search transactions by hash, wallet address, or block number, so that I can look up specific transactions | Must-have | Search input; filtered results |
| EXP-004 | As a user, I want to view recent transactions with type, credits involved, project name, NEAR TX hash, block number, confirmations, and value (USD + NEAR), so that I can verify on-chain activity | Must-have | Transaction list with copy-hash, external explorer link |

**Smart Contract Specification:**

| Property | Value |
|---|---|
| Contract Address | `carbon-credits.near` |
| Token Standard | NEP-141 (Fungible Token) |
| Audit Status | Verified (CertiK, December 2025) |
| Contract Version | v2.1.0 |
| Key Functions | `mint_credits()`, `transfer_credits()`, `burn_credits()`, `list_for_sale()`, `buy_credits()`, `get_balance()` |

#### 3.1.7 Registry Management (`/marketplace/registries`)

**User Stories:**

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| REG-001 | As a user, I want to view my connected registry accounts with verification status, credit count, and connection date, so that I can manage my registry links | Must-have | Registry cards with gradient branding, verified badge, account ID, credits linked |
| REG-002 | As a user, I want to connect a new registry account by selecting a registry, entering account ID and API key, so that I can import credits | Must-have | Add Registry modal; registry grid selector; account ID + API key inputs; encrypted credential storage notice |
| REG-003 | As a user, I want to sync credits from a connected registry, so that my portfolio stays up-to-date | Should-have | Sync button per connection; loading state during sync |
| REG-004 | As a user, I want to disconnect a registry, so that I can remove access | Must-have | Delete button with confirmation; connection removed from list |
| REG-005 | As a user, I want to view available (unconnected) registries, so that I can discover new registries to link | Must-have | Available registries grid filtered to exclude already-connected; click to open connection modal |

**Supported Registries (8):**

| Registry | Code | Website | Accreditations |
|---|---|---|---|
| Verra (VCS) | `verra` | verra.org | ICROA, CORSIA |
| Gold Standard | `gold_standard` | goldstandard.org | ICROA, SDG Impact |
| American Carbon Registry | `acr` | americancarbonregistry.org | ICROA |
| Climate Action Reserve | `car` | climateactionreserve.org | ICROA |
| Global Carbon Council | `gcc` | globalcarboncouncil.com | — |
| Architecture for REDD+ Transactions | `art` | artredd.org | REDD+ |
| Plan Vivo | `plan_vivo` | planvivo.org | Community-based |
| Independent | `independent` | — | Project-specific |

#### 3.1.8 Wallet Integration (Cross-Cutting)

**User Stories:**

| ID | User Story | Priority | Acceptance Criteria |
|---|---|---|---|
| WAL-001 | As a user, I want to connect my NEAR wallet from any marketplace page, so that I can transact | Must-have | `WalletConnect` component on every marketplace page header |
| WAL-002 | As a user, I want to see my wallet balance (NEAR + USD equivalent), so that I know my spending capacity | Must-have | Balance displayed when connected; refreshes on network change |
| WAL-003 | As a user, I want to switch between NEAR mainnet and testnet, so that I can test before going live | Should-have | Network toggle; status indicator |
| WAL-004 | As a user, I want to disconnect my wallet, so that I can log out securely | Must-have | Disconnect button; state cleared |

**Wallet State:**

```typescript
interface WalletState {
  isConnected: boolean
  accountId: string | null
  balance: { near: number; usd: number }
  network: 'mainnet' | 'testnet'
}
```

---

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance

| Requirement | Target | Measurement |
|---|---|---|
| Initial Page Load (LCP) | < 2.5 seconds | Lighthouse CI |
| Filter/Sort Response Time | < 200ms | Client-side; computed in Zustand selector |
| API Response Time (p95) | < 500ms | Backend APM |
| Order Book Refresh | < 2 seconds | WebSocket latency |
| NEAR Transaction Confirmation | < 5 seconds (average) | NEAR block time ~1.2s |
| Pagination Render | < 100ms | React profiler |
| Animation Frame Rate | 60fps | Framer Motion; no jank |

#### 3.2.2 Scalability

| Dimension | Target |
|---|---|
| Concurrent Users | 10,000+ |
| Active Listings | 100,000+ without UI degradation |
| Portfolio Holdings per User | 1,000+ |
| Transaction History per User | 50,000+ with virtual scrolling |

#### 3.2.3 Security

| Requirement | Description |
|---|---|
| Wallet Authentication | NEAR wallet signature-based auth; no password storage |
| API Authentication | JWT tokens with refresh rotation |
| Registry Credentials | AES-256 encrypted at rest; never sent to frontend |
| Rate Limiting | 100 requests/minute per user for trading endpoints |
| Input Validation | Server-side validation for all trade parameters |
| XSS Protection | CSP headers; React DOM escaping; no `dangerouslySetInnerHTML` |
| CSRF Protection | SameSite cookies; CSRF tokens on state-changing requests |
| Audit Logging | All transactions logged with user ID, timestamp, IP |
| Smart Contract Security | CertiK audited; reentrancy guards; access control |

#### 3.2.4 Usability and Accessibility

| Requirement | Standard |
|---|---|
| WCAG Compliance | Level AA (WCAG 2.1) |
| Keyboard Navigation | Full tab/enter support for all interactive elements |
| Screen Reader | ARIA labels on all controls; live regions for dynamic content |
| Color Contrast | 4.5:1 minimum (text), 3:1 (large text / UI components) |
| Mobile Responsiveness | Fully functional at 320px–2560px; breakpoints at sm/md/lg/xl |
| Loading States | Skeleton loaders for all async content |
| Error States | Contextual error messages; retry actions; empty states with CTAs |
| Toast Notifications | Success/error/info toasts for all user actions |

#### 3.2.5 Reliability and Availability

| Requirement | Target |
|---|---|
| Uptime SLA | 99.9% (< 8.76 hours downtime/year) |
| RTO (Recovery Time Objective) | < 30 minutes |
| RPO (Recovery Point Objective) | < 5 minutes |
| Data Durability | 99.999999999% (S3/equivalent) |
| Graceful Degradation | Marketplace browsable when NEAR network is unhealthy; trading paused with notice |

#### 3.2.6 Compatibility

| Dimension | Supported |
|---|---|
| Browsers | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |
| Devices | Desktop, Tablet, Mobile |
| Operating Systems | Windows 10+, macOS 12+, iOS 15+, Android 12+ |
| Wallet Support | NEAR Wallet, MyNearWallet, Sender, Meteor (via near-api-js) |
| Screen Resolutions | 320px (mobile) to 2560px (4K) |

#### 3.2.7 Compliance and Regulatory

| Standard | Relevance |
|---|---|
| ICROA Code of Best Practice | Ensuring listed credits meet ICROA standards |
| GDPR | EU user data handling; privacy policy; data deletion |
| CCPA | California consumer privacy; opt-out mechanisms |
| SOC 2 Type II | Security controls for enterprise customers |
| CORSIA | Eligible credits flagged for aviation offsetting |
| Verra / GS Standards | Credit metadata conformance to registry standards |

---

### 3.3 Technical Requirements

#### 3.3.1 Technology Stack

| Layer | Technology | Justification |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | SSR/SSG hybrid; route-based code splitting; React Server Components |
| **Language** | TypeScript 5+ | Type safety across 344 lines of marketplace types |
| **State Management** | Zustand | Lightweight (< 2KB); 4 marketplace stores; no boilerplate |
| **Animations** | Framer Motion | Declarative; `AnimatePresence` for mount/unmount; layout animations |
| **Styling** | Tailwind CSS | Utility-first; glass morphism design system; responsive |
| **UI Components** | Custom (`GlassCard`, `CreditCard`, etc.) | Project-specific glass morphism design language |
| **Icons** | Lucide React | Consistent, tree-shakeable icon set |
| **Blockchain** | NEAR Protocol (near-api-js) | Low gas fees; 1.2s block time; NEP-141/NEP-171 token standards |
| **HTTP Client** | Custom (`lib/api/client.ts`) | Typed endpoints; auth header injection; error handling |
| **Utility** | clsx | Conditional class composition |

#### 3.3.2 System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        MARKETPLACE FRONTEND                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │ Browse   │ │ Trading  │ │Portfolio │ │Analytics │ │Explorer││
│  │ /market  │ │ /trading │ │/portfolio│ │/analytics│ │/explorer│
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘│
│       │            │            │            │           │      │
│  ┌────┴────────────┴────────────┴────────────┴───────────┴────┐ │
│  │                    ZUSTAND STORES                          │ │
│  │  marketplaceStore │ tradingStore │ portfolioStore │ wallet │ │
│  └────────────────────────────┬───────────────────────────────┘ │
│                               │                                  │
│  ┌────────────────────────────┴───────────────────────────────┐ │
│  │                    COMPONENT LIBRARY                        │ │
│  │  CreditCard │ BuyModal │ SellModal │ RetireModal │ Filters │ │
│  │  CreditDetailModal │ MarketplaceStats │ WalletConnect      │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │     API GATEWAY          │
                    │  /api/v1/marketplace/*   │
                    └──────┬──────────┬────────┘
                           │          │
              ┌────────────┘          └────────────┐
              │                                    │
    ┌─────────┴────────┐               ┌──────────┴────────┐
    │  BACKEND API      │               │  NEAR PROTOCOL     │
    │  (REST + WS)      │               │  (Blockchain)      │
    │  ─────────────    │               │  ──────────────    │
    │  PostgreSQL       │               │  carbon-credits.   │
    │  Redis Cache      │               │    near            │
    │  S3 Certificates  │               │  NEP-141 / NEP-171│
    │  Registry APIs    │               │  Transaction       │
    └───────────────────┘               │    Signing         │
                                        └───────────────────┘
```

#### 3.3.3 State Management Architecture

**4 Zustand Stores:**

| Store | File | Responsibilities |
|---|---|---|
| `marketplaceStore` | `lib/stores/marketplaceStore.ts` | Credits list, filters, sort, pagination, view mode, watchlist, compare list |
| `tradingStore` | `lib/stores/tradingStore.ts` | My listings, order book (buy/sell), buy modal state, listing CRUD |
| `portfolioStore` | `lib/stores/portfolioStore.ts` | Holdings, summary, transactions, retirements, impact metrics, registry connections, sell/retire modals |
| `walletStore` | `lib/stores/walletStore.ts` | NEAR wallet connection, account ID, balance, network status |

#### 3.3.4 API Endpoints (Required Backend)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/marketplace/credits` | List credits with filters, sort, pagination | Public |
| `GET` | `/api/v1/marketplace/credits/:id` | Get single credit with full details | Public |
| `POST` | `/api/v1/marketplace/listings` | Create a new listing | Wallet Auth |
| `GET` | `/api/v1/marketplace/listings` | Get current user's listings | Wallet Auth |
| `PUT` | `/api/v1/marketplace/listings/:id` | Update listing (price, status) | Wallet Auth (owner) |
| `DELETE` | `/api/v1/marketplace/listings/:id` | Cancel listing | Wallet Auth (owner) |
| `POST` | `/api/v1/marketplace/orders` | Create buy order (triggers NEAR TX) | Wallet Auth |
| `GET` | `/api/v1/marketplace/orders` | Get current user's orders | Wallet Auth |
| `GET` | `/api/v1/marketplace/orderbook` | Get order book (buy/sell depth) | Public |
| `GET` | `/api/v1/marketplace/portfolio` | Get user portfolio (holdings) | Wallet Auth |
| `GET` | `/api/v1/marketplace/portfolio/summary` | Get portfolio summary stats | Wallet Auth |
| `GET` | `/api/v1/marketplace/transactions` | Get user transaction history | Wallet Auth |
| `POST` | `/api/v1/marketplace/retire` | Retire credits (triggers NEAR burn) | Wallet Auth |
| `GET` | `/api/v1/marketplace/retirements` | Get user retirements | Wallet Auth |
| `GET` | `/api/v1/marketplace/retirements/:id/certificate` | Download retirement certificate | Wallet Auth |
| `GET` | `/api/v1/marketplace/analytics` | Get market analytics | Public |
| `GET` | `/api/v1/marketplace/analytics/impact` | Get impact metrics | Public |
| `GET` | `/api/v1/marketplace/registries/connections` | Get user registry connections | Wallet Auth |
| `POST` | `/api/v1/marketplace/registries/connect` | Connect a new registry | Wallet Auth |
| `POST` | `/api/v1/marketplace/registries/:id/sync` | Sync credits from registry | Wallet Auth |
| `DELETE` | `/api/v1/marketplace/registries/:id` | Disconnect registry | Wallet Auth |
| `GET` | `/api/v1/marketplace/explorer/network` | Get NEAR network status | Public |
| `GET` | `/api/v1/marketplace/explorer/transactions` | Get recent NEAR transactions | Public |
| `GET` | `/api/v1/marketplace/explorer/search` | Search by TX hash, wallet, block | Public |

#### 3.3.5 Data Types

All TypeScript interfaces are defined in `src/types/marketplace.ts` (344 lines). Key entities:

| Type | Fields (Key) | Status |
|---|---|---|
| `CarbonCredit` | id, projectId, projectName, registry, methodology, vintageYear, location, quantity, priceUsd, priceNear, status, coBenefits, verification, seller, nearTokenId | Implemented |
| `MarketplaceListing` | id, sellerId, credit, quantity, priceUsd, priceNear, listingType, status, expiresAt, views, watchers, offers | Implemented |
| `BuyOrder` | id, buyerId, listingId, quantity, priceUsd, priceNear, status, nearTxHash | Implemented |
| `OrderBookEntry` | price, quantity, type (buy/sell) | Implemented |
| `PortfolioHolding` | credit, quantity, purchasePriceUsd, currentValueUsd, percentChange | Implemented |
| `PortfolioSummary` | totalCredits, totalValueUsd, totalCo2Offset, byRegistry, byMethodology | Implemented |
| `Transaction` | id, type, credit, quantity, priceUsd, nearTxHash, blockNumber, status, confirmations | Implemented |
| `Retirement` | id, credit, quantity, beneficiaryType, beneficiaryName, reason, certificateId, nearTxHash, impact | Implemented |
| `MarketplaceFilters` | registries, methodologies, subtypes, priceRange, vintageYears, countries, coBenefits, verification, sortBy, searchQuery | Implemented |
| `MarketAnalytics` | totalVolume24h/7d, totalTransactions24h, avgPrice, priceChange24h, topProjects, priceByMethodology | Implemented |
| `ImpactMetrics` | totalCo2Offset, equivalentCars/Trees/Miles/Homes, byMethodology, timeline | Implemented |
| `WalletState` | isConnected, accountId, balance, network | Implemented |
| `NetworkStatus` | network, isHealthy, blockHeight, tps, activeValidators, gasPrice | Implemented |
| `SmartContractInfo` | address, type, auditStatus, lastAudit, auditor | Implemented |
| `UserRegistryConnection` | id, registry, accountId, isVerified, credits, connectedAt | Implemented |

#### 3.3.6 NEAR Blockchain Integration

| Operation | Smart Contract Method | Token Standard | Status |
|---|---|---|---|
| Mint Credits | `mint_credits()` | NEP-141 | Pending backend |
| Transfer Credits | `transfer_credits()` | NEP-141 | Pending backend |
| Burn / Retire Credits | `burn_credits()` | NEP-141 | Pending backend |
| List for Sale | `list_for_sale()` | Custom | Pending backend |
| Buy Credits | `buy_credits()` | Custom | Pending backend |
| Query Balance | `get_balance()` | NEP-141 | Pending backend |

**NEAR Configuration:**

| Parameter | Mainnet | Testnet |
|---|---|---|
| Network ID | `mainnet` | `testnet` |
| Contract | `carbon-credits.near` | `carbon-credits.testnet` |
| Explorer | `explorer.near.org` | `explorer.testnet.near.org` |
| RPC | `https://rpc.mainnet.near.org` | `https://rpc.testnet.near.org` |
| Avg Block Time | ~1.2s | ~1.2s |

---

## 4. Resource Planning

### 4.1 Team Structure

```
                    ┌──────────────────┐
                    │  Project Manager  │
                    │  (1 person)       │
                    └────────┬─────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                   │
  ┌───────┴──────┐  ┌───────┴──────┐  ┌────────┴───────┐
  │  Product      │  │  Tech Lead    │  │  Design Lead   │
  │  Owner (1)    │  │  (1)          │  │  (1)           │
  └───────────────┘  └───────┬──────┘  └────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                     │
┌───────┴──────┐    ┌───────┴──────┐    ┌─────────┴────────┐
│  Frontend     │    │  Backend      │    │  Blockchain       │
│  Engineers    │    │  Engineers    │    │  Engineers        │
│  (2 persons) │    │  (2 persons)  │    │  (1-2 persons)    │
└──────────────┘    └──────────────┘    └──────────────────┘
        │                    │                     │
┌───────┴──────┐    ┌───────┴──────┐    ┌─────────┴────────┐
│  QA Engineer  │    │  DevOps       │    │  Security         │
│  (1 person)  │    │  Engineer     │    │  Auditor          │
│              │    │  (1 person)   │    │  (External)       │
└──────────────┘    └──────────────┘    └──────────────────┘
```

**Role Definitions:**

| Role | Count | Responsibilities |
|---|---|---|
| Project Manager | 1 | Sprint planning, stakeholder communication, risk management, timeline tracking |
| Product Owner | 1 | Backlog prioritization, acceptance criteria, user research, registry partnerships |
| Tech Lead | 1 | Architecture decisions, code review, technical standards, NEAR protocol design |
| Frontend Engineers | 2 | React/Next.js development, Zustand stores, component library, UI/UX implementation |
| Backend Engineers | 2 | API development, PostgreSQL schema, Redis caching, registry API integration |
| Blockchain Engineers | 1-2 | NEAR smart contract development (Rust), wallet integration, token standards |
| UI/UX Designer | 1 | Glass morphism design system, wireframes, user flows, usability testing |
| QA Engineer | 1 | Test strategy, E2E tests, performance testing, regression testing |
| DevOps Engineer | 1 | CI/CD pipeline, infrastructure, monitoring, deployment automation |
| Security Auditor | External | Smart contract audit, penetration testing, compliance review |

### 4.2 Tools and Infrastructure

| Category | Tool | Purpose |
|---|---|---|
| **Version Control** | Git + GitHub | Source code, PRs, issues |
| **IDE** | Cursor / VS Code | Development environment |
| **Project Management** | Linear or Jira | Sprint tracking, backlog management |
| **Communication** | Slack + Discord | Team and community communication |
| **Design** | Figma | UI/UX design, prototypes, design system |
| **CI/CD** | GitHub Actions | Build, test, deploy pipeline |
| **Hosting** | Vercel (Frontend) | Next.js optimized hosting |
| **Backend Hosting** | AWS (ECS/Fargate) or Railway | API server, database |
| **Database** | PostgreSQL 15+ | Primary data store |
| **Cache** | Redis 7+ | Session cache, order book cache |
| **Object Storage** | AWS S3 / Cloudflare R2 | Retirement certificates, credit images |
| **Monitoring** | Datadog / Grafana + Prometheus | APM, logs, metrics, alerts |
| **Error Tracking** | Sentry | Frontend + backend error tracking |
| **Analytics** | PostHog / Mixpanel | User behavior analytics |
| **Testing** | Vitest + Playwright | Unit + E2E testing |
| **NEAR Tooling** | near-cli, near-api-js, NEAR Wallet Selector | Blockchain development |
| **API Documentation** | Swagger / OpenAPI 3.0 | API specs |

### 4.3 Budget Estimation

| Category | Monthly | Annual | Notes |
|---|---|---|---|
| **Personnel** | | | |
| Engineering Team (7 FTE) | $105,000 | $1,260,000 | Avg $15K/mo per engineer |
| Product + Design (2 FTE) | $25,000 | $300,000 | PM + Designer |
| External Security Audit | — | $50,000 | 2 audits/year (smart contract) |
| **Infrastructure** | | | |
| Vercel (Frontend) | $500 | $6,000 | Pro plan |
| AWS / Cloud (Backend) | $2,000 | $24,000 | ECS, RDS, ElastiCache, S3 |
| NEAR RPC Access | $500 | $6,000 | Pagoda / Lava Network |
| Domain + CDN | $100 | $1,200 | Cloudflare |
| **Software Licenses** | | | |
| GitHub Team | $200 | $2,400 | 10 seats |
| Linear / Jira | $150 | $1,800 | Project management |
| Figma | $75 | $900 | Design |
| Sentry | $200 | $2,400 | Error tracking |
| Datadog | $500 | $6,000 | Monitoring |
| PostHog | $200 | $2,400 | Analytics |
| **Third-Party APIs** | | | |
| Registry API Licenses | $1,000 | $12,000 | Verra, Gold Standard API access |
| Price Feed Oracle | $300 | $3,600 | NEAR/USD exchange rate |
| **Contingency (15%)** | | $253,290 | Risk buffer |
| | | | |
| **TOTAL** | | **$1,932,090** | Annual estimate |

---

## 5. Project Timeline and Milestones

### 5.1 Project Phases

| Phase | Duration | Start | End | Key Deliverables |
|---|---|---|---|---|
| **Phase 1: Discovery & Planning** | 3 weeks | Week 1 | Week 3 | Requirements finalized; technical architecture approved; design system established; registry partnership agreements |
| **Phase 2: Design** | 3 weeks | Week 4 | Week 6 | Wireframes for all 6 marketplace pages; interactive Figma prototype; design review sign-off; component inventory |
| **Phase 3: Core Development** | 10 weeks | Week 7 | Week 16 | Frontend pages, Zustand stores, API endpoints, database schema, NEAR smart contract v1 |
| **Phase 4: Integration** | 4 weeks | Week 17 | Week 20 | NEAR wallet integration, registry API connections, real-time order book, certificate generation |
| **Phase 5: Testing & QA** | 3 weeks | Week 21 | Week 23 | Unit tests (80% coverage), E2E tests, performance testing, security audit, UAT |
| **Phase 6: Deployment** | 2 weeks | Week 24 | Week 25 | Testnet launch; mainnet deployment; monitoring setup; documentation |
| **Phase 7: Post-Launch** | Ongoing | Week 26+ | — | Bug fixes, performance optimization, feature enhancements, user feedback loop |

**Total: ~25 weeks (6 months) to production launch**

### 5.2 Sprint Planning

| Parameter | Value |
|---|---|
| Sprint Duration | 2 weeks |
| Total Sprints (to launch) | 12–13 |
| Sprint Velocity (target) | 30–40 story points |
| Release Cadence | Every 2 sprints (monthly) |

**Sprint Breakdown:**

| Sprint | Focus | Key Deliverables |
|---|---|---|
| Sprint 1 | Foundation | Project setup, design system, Zustand store scaffolding, type definitions |
| Sprint 2 | Browse MVP | Marketplace browse page, credit cards, filter sidebar, sort, pagination |
| Sprint 3 | Credit Details + Buy | Credit detail modal, buy modal, wallet connect component |
| Sprint 4 | Trading Desk | Create listing form, listing management, fee calculator |
| Sprint 5 | Order Book | Order book UI, buy/sell depth visualization |
| Sprint 6 | Portfolio | Holdings view (grid/table), portfolio stats, registry breakdown |
| Sprint 7 | Transactions + Retirement | Transaction history, retirement flow, certificate UI |
| Sprint 8 | Analytics | Analytics dashboard, time range filters, methodology charts |
| Sprint 9 | NEAR Explorer + Registries | Explorer page, registry management, connection modal |
| Sprint 10 | Backend Integration | Replace mock data with real API calls, NEAR wallet transactions |
| Sprint 11 | NEAR Smart Contract | Smart contract deployment (testnet), wallet signing flows |
| Sprint 12 | Testing + Security | E2E tests, security audit, performance benchmarks, UAT |
| Sprint 13 | Launch Prep | Mainnet deployment, monitoring, documentation, go-live |

### 5.3 Key Milestones

| Milestone | Date (Week) | Success Criteria |
|---|---|---|
| Requirements Sign-Off | Week 3 | SRS approved by all stakeholders |
| Design Review Complete | Week 6 | All wireframes approved; design system documented |
| Alpha Release (Mock Data) | Week 12 | All 6 pages functional with mock data; internal demo |
| Beta Release (Testnet) | Week 20 | Real NEAR testnet transactions; registry API connected; limited beta users |
| Security Audit Complete | Week 22 | Smart contract audit passed; no critical/high findings |
| UAT Sign-Off | Week 23 | Product owner + 10 beta users approve |
| Mainnet Go-Live | Week 25 | Production deployment; monitoring active; support team ready |
| Post-Launch Review | Week 29 | KPI review; user feedback analysis; roadmap update |

---

## 6. Risk Management

### 6.1 Risk Assessment Matrix

| ID | Risk | Probability | Impact | Mitigation Strategy | Contingency Plan | Owner |
|---|---|---|---|---|---|---|
| R-001 | NEAR network outage disrupts trading | Low | High | Graceful degradation; cache order book; queue orders for retry | Display "Network Maintenance" banner; allow browsing/watchlist; retry queue | Tech Lead |
| R-002 | Smart contract vulnerability discovered | Medium | Critical | CertiK audit pre-launch; formal verification; bug bounty program | Emergency pause contract; deploy patched version; communicate to users | Blockchain Engineer |
| R-003 | Registry API rate limiting or downtime | Medium | Medium | Cache registry data aggressively (TTL: 1h); implement circuit breaker | Show last-known data with "Stale" indicator; retry with exponential backoff | Backend Engineer |
| R-004 | NEAR/USD price volatility during order | Medium | Medium | Lock exchange rate for 60 seconds during order; slippage protection (2%) | Cancel order if slippage > threshold; notify user | Backend Engineer |
| R-005 | Regulatory changes affect credit trading | Low | High | Legal counsel on retainer; monitor ICROA/CORSIA updates; modular compliance layer | Pause affected credit types; update compliance rules; communicate timeline | Product Owner |
| R-006 | Low marketplace liquidity at launch | High | Medium | Seed marketplace with partner credits; incentive program for early listers | Aggregate from external marketplaces; display as "partner listings" | Product Owner |
| R-007 | Performance degradation at scale (>10K users) | Medium | Medium | Load testing during Phase 5; CDN for static assets; Redis caching; DB indexing | Horizontal scaling; add read replicas; implement query pagination | DevOps |
| R-008 | Double-counting of credits across registries | Low | Critical | Unique identifier per credit (registry + project ID + vintage + serial); DB unique constraint | Automated reconciliation job; manual review queue; affected credits flagged | Backend Engineer |
| R-009 | User wallet private key compromise | Low | Critical | Never store private keys; use NEAR Wallet Selector (browser extension); educate users | Freeze affected account; investigate; assist with NEAR account recovery | Security |
| R-010 | Scope creep delays launch | Medium | Medium | Strict MVP scope (this SRS); change request process; sprint commitment protection | Defer to Phase 2; communicate revised timeline; negotiate trade-offs | PM |

### 6.2 Risk Categories Summary

| Category | Count | Highest Severity |
|---|---|---|
| Technical (blockchain, APIs) | 4 | Critical |
| Security | 2 | Critical |
| Market / Business | 2 | High |
| Operational (performance, scope) | 2 | Medium |

---

## 7. Project Management Methodology

### 7.1 Chosen Methodology: Agile / Scrum (Hybrid)

**Justification:**

- Blockchain integration involves high uncertainty → iterative approach reduces risk
- Frontend is largely feature-complete (mock data) → incremental API integration is ideal for Scrum
- Multiple dependency chains (NEAR, registries, backend) → need flexibility to reprioritize
- Stakeholder feedback cycles are critical for marketplace UX

### 7.2 Ceremonies

| Ceremony | Frequency | Duration | Participants |
|---|---|---|---|
| Daily Standup | Daily (async on Slack, sync Tue/Thu) | 15 min | All engineers |
| Sprint Planning | Every 2 weeks (Monday) | 2 hours | PM, PO, Tech Lead, Engineers |
| Sprint Review / Demo | Every 2 weeks (Friday) | 1 hour | Full team + stakeholders |
| Sprint Retrospective | Every 2 weeks (Friday) | 45 min | Full team |
| Backlog Grooming | Weekly (Wednesday) | 1 hour | PM, PO, Tech Lead |
| Architecture Review | Monthly | 2 hours | Tech Lead, Engineers, Security |
| Stakeholder Update | Bi-weekly | 30 min | PM, PO, Stakeholders |

### 7.3 Communication Plan

| Channel | Purpose | Audience |
|---|---|---|
| Slack `#marketplace-dev` | Daily engineering discussion | Engineers |
| Slack `#marketplace-product` | Product decisions, user feedback | PO, PM, Design |
| GitHub Issues + PRs | Technical tasks, code review | Engineers |
| Linear Board | Sprint tracking, backlog | Full team |
| Confluence / Notion | Documentation, ADRs, meeting notes | Full team |
| Email / Loom | Stakeholder updates, demo recordings | Stakeholders |

### 7.4 Change Management Process

1. **Change Request** — Submitted via Linear/Jira with impact analysis
2. **Triage** — PO + Tech Lead assess scope, effort, and priority
3. **Decision** — Accept (add to backlog), Defer (post-launch), or Reject
4. **Communication** — Update sprint backlog; notify team in standup
5. **Implementation** — Standard sprint workflow with code review + QA

### 7.5 Definition of Done (DoD)

A feature is "Done" when:

- [ ] Code is written and passes TypeScript strict mode (`noImplicitAny`, `strictNullChecks`)
- [ ] Unit tests cover happy path + error cases (≥80% line coverage for new code)
- [ ] E2E test covers the critical user flow
- [ ] Linter passes (`eslint`, `prettier`)
- [ ] Code reviewed and approved by ≥1 peer
- [ ] Tested on Chrome, Firefox, Safari (desktop + mobile)
- [ ] Loading states, error states, and empty states implemented
- [ ] ARIA labels and keyboard navigation verified
- [ ] Documentation updated (if API or type changes)
- [ ] Deployed to staging and smoke-tested
- [ ] Product owner has accepted the story

---

## 8. Quality Assurance Strategy

### 8.1 Testing Pyramid

| Level | Tool | Coverage Target | Scope |
|---|---|---|---|
| **Unit Tests** | Vitest | 80% line coverage | Zustand stores, utility functions, type guards, formatters |
| **Component Tests** | Vitest + Testing Library | Key components | CreditCard, BuyModal, SellModal, RetireModal, MarketplaceFilters |
| **Integration Tests** | Vitest | API layer | API client, store → API integration |
| **E2E Tests** | Playwright | Critical paths | Browse → Buy, Create Listing, Portfolio → Retire, Wallet Connect |
| **Performance Tests** | Lighthouse CI + k6 | LCP < 2.5s, p95 < 500ms | Page load, API response, concurrent users |
| **Smart Contract Tests** | NEAR Sandbox (near-workspaces) | 100% function coverage | All contract methods, edge cases, access control |
| **Security Tests** | OWASP ZAP + CertiK | No critical/high findings | XSS, CSRF, injection, contract vulnerabilities |
| **Visual Regression** | Chromatic / Percy | All components | Screenshot comparison on PR |

### 8.2 Code Review Process

1. All code changes via Pull Request
2. Minimum 1 reviewer (2 for smart contract / security-critical code)
3. CI must pass (lint, type-check, unit tests, build)
4. PR description includes: summary, screenshots (UI changes), test plan
5. No self-merges; Tech Lead override for critical hotfixes

### 8.3 Bug Tracking

| Severity | Response Time | Resolution Time | Examples |
|---|---|---|---|
| **Critical** (P0) | 1 hour | 4 hours | Transaction failure, funds loss, data breach |
| **High** (P1) | 4 hours | 24 hours | Buy flow broken, wallet won't connect, data corruption |
| **Medium** (P2) | 1 business day | 1 sprint | Filter not working, analytics incorrect, UI glitch |
| **Low** (P3) | 1 week | Backlog | Typo, minor alignment, enhancement request |

---

## 9. Deployment Strategy

### 9.1 Environment Setup

| Environment | Purpose | URL Pattern | NEAR Network |
|---|---|---|---|
| **Local** | Development | `localhost:3000` | Testnet / Sandbox |
| **Preview** | PR preview (Vercel) | `pr-{id}.dmrv.vercel.app` | Testnet |
| **Staging** | Pre-production testing | `staging.dmrv.app` | Testnet |
| **Production** | Live | `app.dmrv.app` | Mainnet |

### 9.2 CI/CD Pipeline

```
┌─────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐    ┌───────────┐
│  Push /  │ →  │  Lint +   │ →  │  Unit +    │ →  │  Build    │ →  │  Deploy    │
│  PR      │    │  Typecheck│    │  Component │    │  Next.js  │    │  (Vercel)  │
│          │    │           │    │  Tests     │    │           │    │            │
└─────────┘    └──────────┘    └───────────┘    └──────────┘    └───────────┘
                                                                       │
                                                                ┌──────┴──────┐
                                                                │  E2E Tests   │
                                                                │  (Playwright)│
                                                                └──────┬──────┘
                                                                       │
                                                                ┌──────┴──────┐
                                                                │  Preview /   │
                                                                │  Staging /   │
                                                                │  Production  │
                                                                └─────────────┘
```

**Pipeline Steps:**

1. **Lint + Typecheck** — ESLint, Prettier, `tsc --noEmit`
2. **Unit + Component Tests** — Vitest with coverage report
3. **Build** — `next build` (catches SSR errors)
4. **Deploy Preview** — Automatic for PRs (Vercel)
5. **E2E Tests** — Playwright against preview URL
6. **Staging Deploy** — Automatic on merge to `develop`
7. **Production Deploy** — Manual promotion from staging (approved by Tech Lead + PM)

### 9.3 Rollback Procedures

| Scenario | Action | RTO |
|---|---|---|
| Frontend regression | Vercel instant rollback to previous deployment | < 1 minute |
| Backend API failure | Roll back ECS task definition; restore from RDS snapshot | < 15 minutes |
| Smart contract bug | Pause contract (admin function); deploy patched version | < 1 hour |
| Data migration failure | Restore PostgreSQL from point-in-time backup | < 30 minutes |

### 9.4 Data Migration Plan

| Migration | Strategy | Tools |
|---|---|---|
| Mock data → Real DB | SQL seed scripts from existing mock data structure | Prisma migrations |
| Registry import | Batch import via registry APIs during onboarding | Custom ETL scripts |
| NEAR testnet → mainnet | Redeploy contract; no data migration (blockchain is append-only) | near-cli |

---

## 10. Post-Launch Support

### 10.1 Maintenance Plan

| Activity | Frequency | Owner |
|---|---|---|
| Dependency updates | Weekly (Dependabot) | DevOps |
| Security patches | Within 24h of advisory | DevOps + Security |
| Performance monitoring | Continuous (Datadog) | DevOps |
| Database maintenance | Monthly (vacuum, analyze) | Backend |
| NEAR RPC health check | Every 5 minutes | Monitoring |
| Registry API health check | Every 15 minutes | Monitoring |
| Backup verification | Monthly | DevOps |

### 10.2 Bug Fix SLAs

(See Section 8.3 — Bug Tracking severity table)

### 10.3 Feature Enhancement Process

1. User submits feedback via in-app form or support channel
2. PO triages and adds to backlog with priority
3. Monthly roadmap review to prioritize enhancements
4. Accepted enhancements enter sprint planning

### 10.4 Monitoring Strategy

| Metric | Tool | Alert Threshold |
|---|---|---|
| Error Rate (5xx) | Sentry + Datadog | > 1% of requests |
| API Latency (p95) | Datadog | > 1 second |
| NEAR Transaction Failure Rate | Custom + NEAR Indexer | > 5% |
| Frontend Core Web Vitals | Vercel Analytics | LCP > 4s, FID > 300ms |
| Database Connection Pool | Datadog | > 80% utilization |
| Redis Memory | Datadog | > 80% capacity |
| Certificate Generation Failures | Sentry | Any failure |

### 10.5 Knowledge Transfer Plan

| Document | Location | Audience |
|---|---|---|
| This SRS | `apps/dashboard/MARKETPLACE_SRS.md` | Full team |
| Data Schema | `apps/dashboard/DATA_SCHEMA.md` | Engineers |
| Architecture Workflows | `docs/architecture/COMPREHENSIVE_WORKFLOWS.md` | Engineers |
| API Documentation | Swagger UI (`/api/docs`) | Engineers + Partners |
| Runbooks | `docs/runbooks/` | DevOps + On-call |
| User Guide | In-app help center | End users |

---

## 11. Stakeholder Management

### 11.1 Stakeholder Register

| Stakeholder | Role | Interest | Influence | Communication |
|---|---|---|---|---|
| CEO / Founder | Executive sponsor | Strategic alignment, business metrics | High | Monthly executive summary |
| VP Engineering | Technical governance | Architecture, security, scalability | High | Bi-weekly architecture review |
| Product Owner | Feature prioritization | User satisfaction, market fit | High | Daily Slack, sprint ceremonies |
| Carbon Registry Partners | External | API integration, credit verification | Medium | Monthly partnership call |
| Beta Users (Pilot) | Early adopters | Usability, feature completeness | Medium | In-app feedback; quarterly survey |
| Legal / Compliance | Regulatory oversight | ICROA, GDPR, CCPA compliance | Medium | Monthly compliance review |
| Marketing | Go-to-market | Launch readiness, messaging | Low | Sprint demos; launch coordination |
| Investors | Funding | ROI, growth metrics | Low | Quarterly board update |

### 11.2 Escalation Path

```
Developer → Tech Lead → VP Engineering → CEO
    ↑ (product)
Developer → PO → PM → CEO
```

---

## 12. Constraints and Assumptions

### 12.1 Constraints

| Type | Constraint |
|---|---|
| **Time** | 6-month timeline to production launch (non-negotiable for funding milestone) |
| **Budget** | ~$2M annual; limited runway for scope expansion |
| **Technical** | NEAR Protocol is the mandated blockchain; no multi-chain in Phase 1 |
| **Regulatory** | Must comply with ICROA standards for listed credits |
| **Integration** | Registry APIs have rate limits (varies by registry); some registries lack public APIs |
| **Team** | Maximum 10 FTE allocated to marketplace module |
| **Design** | Must follow existing glass morphism design system from DMRV dashboard |

### 12.2 Assumptions

| ID | Assumption | Impact if Invalid |
|---|---|---|
| A-001 | NEAR Protocol remains operational and maintains < 2s finality | Must evaluate alternative L1/L2 (high impact) |
| A-002 | At least 3 registries provide API access by Month 3 | Manual credit import as fallback (medium impact) |
| A-003 | NEAR/USD exchange rate oracle is available and reliable | Build fallback with CoinGecko API (low impact) |
| A-004 | CertiK or equivalent auditor available for smart contract audit in Month 5 | Delay launch by 2-4 weeks (medium impact) |
| A-005 | Users have NEAR wallets or are willing to create one | Provide onboarding flow with wallet creation guide (medium impact) |
| A-006 | Mock data structure accurately represents production data shape | Minor type adjustments; low impact |
| A-007 | 2% platform fee is acceptable to market participants | A/B test fee levels; adjustable via admin config (medium impact) |
| A-008 | Frontend is largely complete (all 6 pages built with mock data) | Accurate — reduces frontend Phase 3 effort significantly |

---

## 13. Dependencies

### 13.1 External Dependencies

| Dependency | Type | Risk Level | Mitigation |
|---|---|---|---|
| NEAR Protocol (blockchain) | Infrastructure | Medium | Multi-RPC provider setup; fallback nodes |
| Verra API | Registry integration | Medium | Cache + circuit breaker; manual import fallback |
| Gold Standard API | Registry integration | Medium | Same as Verra |
| ACR / CAR / GCC / ART / Plan Vivo APIs | Registry integration | High (some lack APIs) | Prioritize Verra + Gold Standard; others as available |
| CertiK (smart contract audit) | Security | Low | Schedule 3 months ahead; alternate: OpenZeppelin |
| Vercel (hosting) | Infrastructure | Low | Alternative: AWS Amplify / Cloudflare Pages |
| CoinGecko / NEAR Price Oracle | Data feed | Low | Multiple oracle sources; cached fallback |

### 13.2 Internal Dependencies

| Dependency | Module | Description |
|---|---|---|
| DMRV Project Creation | `apps/dashboard` — Projects | Credits originate from verified projects |
| MRV Submission Pipeline | `apps/dashboard` — MRV | Verification data backs credit integrity |
| Credit Issuance / NFT Minting | Backend + NEAR | Minted credits appear in marketplace |
| User Authentication | `apps/dashboard` — Auth | Wallet-based auth underpins all trading |
| Design System | `components/shared/GlassCard` etc. | Shared UI components used across marketplace |
| Data Schema | `DATA_SCHEMA.md` | PostgreSQL schema for marketplace tables |

### 13.3 Data Dependencies

| Data | Source | Freshness |
|---|---|---|
| Carbon credit metadata | Registry APIs | Real-time sync on connection; 1h cache |
| NEAR/USD exchange rate | Price oracle | Refreshed every 60 seconds |
| Order book | Internal matching engine | Real-time (WebSocket) |
| Portfolio valuations | Computed from latest prices | Refreshed on page load + every 5 minutes |
| Network status | NEAR RPC | Refreshed every 30 seconds |
| Impact metrics | Aggregated from retirement records | Computed hourly |

---

## 14. Appendices

### Appendix A: Glossary

| Term | Definition |
|---|---|
| **Carbon Credit** | A tradeable certificate representing the removal or avoidance of 1 metric ton of CO₂ equivalent |
| **DMRV** | Digital Measurement, Reporting, and Verification — the platform's core framework |
| **NEAR Protocol** | A proof-of-stake Layer 1 blockchain with sharding (Nightshade) |
| **NEP-141** | NEAR Enhancement Proposal for fungible tokens (equivalent to ERC-20) |
| **NEP-171** | NEAR Enhancement Proposal for non-fungible tokens (equivalent to ERC-721) |
| **Vintage Year** | The year in which the carbon reduction/removal occurred |
| **Retirement** | Permanently removing a credit from circulation (burning) to claim the offset |
| **REDD+** | Reducing Emissions from Deforestation and Forest Degradation |
| **SDG** | United Nations Sustainable Development Goals |
| **ICROA** | International Carbon Reduction and Offset Alliance |
| **CORSIA** | Carbon Offsetting and Reduction Scheme for International Aviation |
| **Order Book** | A list of buy and sell orders organized by price level |
| **Glass Morphism** | UI design style using translucent backgrounds with blur effects |
| **Zustand** | Lightweight React state management library |

### Appendix B: File Structure Reference

```
apps/dashboard/src/
├── app/(dashboard)/marketplace/
│   ├── page.tsx                    # Browse credits
│   ├── trading/page.tsx            # Trading desk
│   ├── portfolio/page.tsx          # Portfolio management
│   ├── analytics/page.tsx          # Market analytics
│   ├── explorer/page.tsx           # NEAR blockchain explorer
│   └── registries/page.tsx         # Registry connections
├── components/marketplace/
│   ├── index.ts                    # Barrel export
│   ├── CreditCard.tsx              # Credit display card
│   ├── MarketplaceFilters.tsx      # Filter sidebar
│   ├── BuyModal.tsx                # Purchase modal
│   ├── SellModal.tsx               # Sell/listing modal
│   ├── RetireModal.tsx             # Retirement modal
│   ├── CreditDetailModal.tsx       # Detailed credit view
│   ├── MarketplaceStats.tsx        # Stats display
│   └── WalletConnect.tsx           # NEAR wallet connection
├── lib/stores/
│   ├── marketplaceStore.ts         # Browse state
│   ├── tradingStore.ts             # Trading state
│   ├── portfolioStore.ts           # Portfolio state
│   └── walletStore.ts              # Wallet state
├── lib/data/
│   └── marketplaceMockData.ts      # Mock data (to be replaced)
└── types/
    └── marketplace.ts              # TypeScript type definitions (344 lines)
```

### Appendix C: Current Implementation Status

| Feature | Frontend | Backend API | NEAR Integration | Status |
|---|---|---|---|---|
| Credit Browsing | Complete | Mock | N/A | **UI Complete** |
| Filtering & Sorting | Complete | Mock | N/A | **UI Complete** |
| Credit Detail Modal | Complete | Mock | N/A | **UI Complete** |
| Buy Flow | Complete | Mock | Simulated | **UI Complete** |
| Trading Desk | Complete | Mock | Simulated | **UI Complete** |
| Order Book | Complete | Mock | N/A | **UI Complete** |
| Portfolio Holdings | Complete | Mock | N/A | **UI Complete** |
| Transaction History | Complete | Mock | N/A | **UI Complete** |
| Retirement Flow | Complete | Mock | Simulated | **UI Complete** |
| Impact Metrics | Complete | Mock | N/A | **UI Complete** |
| Market Analytics | Complete | Mock | N/A | **UI Complete** |
| NEAR Explorer | Complete | Mock | Simulated | **UI Complete** |
| Registry Management | Complete | Mock | N/A | **UI Complete** |
| Wallet Connection | Complete | Mock | Simulated | **UI Complete** |

> **Summary:** All 6 marketplace pages and 8 component modules are fully implemented on the frontend with mock data. The remaining work is backend API development, NEAR blockchain integration, registry API connections, and production hardening.

### Appendix D: Wireframe Reference

All pages follow the DMRV glass morphism design system:

- **Background:** Dark gradient (`bg-gray-900` to `bg-black`)
- **Cards:** `GlassCard` component with `bg-white/5`, `border-white/10`, `backdrop-blur-xl`
- **Text:** Primary: `text-white`, Secondary: `text-white/60`, Tertiary: `text-white/50`
- **Accents:** Blue (`blue-500`), Green (`green-500`), Amber (`amber-500`), Purple (`purple-500`)
- **Animations:** Framer Motion `AnimatePresence`, `motion.div` with `layout` prop
- **Icons:** Lucide React (consistent 4/5/7/8px sizing)

Refer to Figma for high-fidelity wireframes (link TBD).

---

*Document prepared based on the existing codebase at `apps/dashboard/src/` as of February 8, 2026. All code references are from the implemented frontend module.*
