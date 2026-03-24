# DMRV — AWS Activate Program Proposal

> **Applicant:** DMRV Platform  
> **Program:** AWS Activate / AWS Startup Credits  
> **Credit Request:** Up to $80,000 (24-month infrastructure coverage)  
> **Submission Date:** March 2026  
> **Classification:** Confidential — For AWS Review Only  
> **Document Version:** 2.0

---

## Document Navigation

| Section | Page | Purpose |
|---|---|---|
| [1. Executive Brief](#1-executive-brief) | — | 60-second overview for decision-makers |
| [2. Problem & Market Opportunity](#2-problem--market-opportunity) | — | Why this matters and why now |
| [3. Product Overview](#3-product-overview) | — | What we've built and what it does |
| [4. AWS Architecture & Service Map](#4-aws-architecture--service-map) | — | Complete AWS workload specification |
| [5. Technical Architecture Deep Dive](#5-technical-architecture-deep-dive) | — | System design, data flows, blockchain integration |
| [6. Security, Compliance & Tenant Isolation](#6-security-compliance--tenant-isolation) | — | Enterprise-grade security posture |
| [7. Reliability, Observability & DR](#7-reliability-observability--dr) | — | SLOs, monitoring, disaster recovery |
| [8. Functional Requirements Summary](#8-functional-requirements-summary) | — | Key workload characteristics for capacity planning |
| [9. Business Model & Revenue](#9-business-model--revenue) | — | Path to sustainability |
| [10. Current Traction & Build Status](#10-current-traction--build-status) | — | What exists today, what's next |
| [11. Team & Execution Plan](#11-team--execution-plan) | — | Who builds it and how |
| [12. Budget & AWS Resource Forecast](#12-budget--aws-resource-forecast) | — | AWS cost projections and the $80K ask |
| [13. Appendices](#13-appendices) | — | Glossary, competitive matrix, supporting data |

---

## 1. Executive Brief

**DMRV is the first end-to-end decentralized carbon credit platform — from environmental measurement to blockchain-backed retirement — built entirely on AWS infrastructure.**

| Dimension | Detail |
|---|---|
| **What** | A SaaS marketplace for carbon credits with full MRV (Measurement, Reporting, Verification) pipeline, NEAR blockchain tokenization, and multi-registry integration |
| **Market** | Voluntary carbon market: $2.4B (2024) → projected $50B by 2030 |
| **Differentiation** | Only platform combining measurement, verification, tokenization, trading, and retirement in one product. Competitors (Toucan, KlimaDAO, CBL/Xpansiv) cover 1–2 stages; we cover all 5 |
| **AWS Dependency** | AWS is the primary infrastructure provider for all non-blockchain workloads — compute, database, caching, storage, eventing, secrets, and observability |
| **Build Status** | Frontend: 100% complete (6 pages, 20+ screens). Database schema: 83% (43/52 tables). Architecture: fully designed. Backend + blockchain deployment: in progress, requires AWS infrastructure |
| **The Ask** | Up to **$80K in AWS credits** + startup program support to take a production-ready frontend and designed architecture to revenue in 6 months |

---

## 2. Problem & Market Opportunity

### 2.1 The Problem

The voluntary carbon market hit **$2.4B in 2024** and is projected to reach **$50B by 2030** ([McKinsey/TSVCM](https://www.mckinsey.com/capabilities/sustainability/our-insights/a-blueprint-for-scaling-voluntary-carbon-markets-to-meet-the-climate-challenge), [Ecosystem Marketplace 2024](https://www.ecosystemmarketplace.com/publications/2024-state-of-the-voluntary-carbon-markets-sovcm/)), yet the infrastructure supporting it is fundamentally broken:

| Problem | Impact | Current State |
|---|---|---|
| **Fragmented registries** | No unified view across 8+ disconnected registries (Verra, Gold Standard, ACR, CAR, GCC, ART, Plan Vivo) | Corporate buyers search each registry manually, compare inconsistent data formats, and negotiate via email |
| **Opaque pricing** | Brokers extract 15–30% margins | No public order book. Buyers don't know the market price. Sellers don't know the fair ask |
| **Broken trust** | Buyer confidence eroded | High-profile scandals — Verra/REDD+ exposés, double-counted credits, phantom offsets — with no end-to-end chain of custody |
| **Unverifiable retirement** | Greenwashing goes unchecked | When a company claims "we retired 10,000 tonnes of CO₂," there is no public, immutable proof |
| **Locked-out participants** | Small businesses and individuals excluded | Minimum lot sizes, custody complexity, and broker fees create barriers to entry |

### 2.2 Market Size

| Year | Market Size | Growth | Source |
|---|---|---|---|
| 2022 | $2.0B | — | Ecosystem Marketplace |
| 2024 | $2.4B | +20% | Ecosystem Marketplace SOVCM 2024 |
| 2026 (projected) | $5B | +108% | BloombergNEF |
| 2030 (projected) | $50B | +900% | McKinsey / TSVCM |

**Serviceable Addressable Market (SAM):** Blockchain carbon markets (~$400M) + corporate self-service offset purchasing (~$600M) = **~$1B today, growing to ~$10B by 2030**.

### 2.3 Why Now

1. **Regulatory tailwinds.** EU CBAM went live in 2026. Article 6 of the Paris Agreement is standardizing international credit transfer rules.
2. **Enterprise demand.** Microsoft, Stripe, Google, and Shopify have committed billions to carbon removal. They need audit-grade procurement infrastructure.
3. **Trust rebuild cycle.** After 2023–2024 Verra controversies and 2022–2023 bridge exploits (Ronin $625M, Wormhole $320M), the market demands verifiable provenance and infrastructure security.
4. **EVM carbon projects struggling.** Flowcarbon ($70M raised, token paused), KlimaDAO (token down 98%), Toucan (exploit issues). The "bridge credits to Polygon" thesis has not produced a sustainable business.
5. **NEAR ecosystem alignment.** NEAR Foundation actively funds ReFi projects. Climate-neutral chain with human-readable accounts — purpose-built for carbon.

---

## 3. Product Overview

### 3.1 The DMRV Pipeline

Unlike platforms that handle 1–2 stages, DMRV covers the entire carbon credit lifecycle:

```
  STAGE 1           STAGE 2            STAGE 3           STAGE 4          STAGE 5
  ──────────        ──────────         ──────────        ──────────       ──────────
  MEASUREMENT       VERIFICATION       TOKENIZATION      TRADING          RETIREMENT
  ┌──────────┐     ┌──────────────┐   ┌────────────┐   ┌──────────┐    ┌──────────┐
  │ Sensors  │     │  9-Category  │   │  NEAR NFT  │   │  Order   │    │ On-Chain │
  │ Labs     │────►│  Independent │──►│  Minting   │──►│  Book    │───►│  Burn +  │
  │ Satellite│     │  Review      │   │ (NEP-171)  │   │  Trading │    │  Cert    │
  └──────────┘     └──────────────┘   └────────────┘   └──────────┘    └──────────┘
       │                  │                 │                │               │
       └──────────────────┴─────────────────┴────────────────┴───────────────┘
                            SINGLE PLATFORM — END TO END
                         ALL STAGES RUN ON AWS INFRASTRUCTURE
```

### 3.2 Competitive Positioning

| Capability | Toucan | KlimaDAO | CBL/Xpansiv | Carbonplace | **DMRV** |
|---|:---:|:---:|:---:|:---:|:---:|
| MRV Data Pipeline | — | — | — | — | **Yes** |
| 9-Category Independent Verification | — | — | Partial | — | **Yes** |
| Blockchain Tokenization | Yes | Yes | — | — | **Yes** |
| Multi-Registry Unified Browsing (8+) | — | — | 2–3 | — | **Yes** |
| Real-Time Order Book | — | — | Yes | — | **Yes** |
| On-Chain Retirement Certificates | Partial | Partial | — | — | **Yes** |
| Environmental Impact Dashboard | — | — | — | — | **Yes** |
| Multi-Tenant SaaS Architecture | — | — | — | — | **Yes** |
| Enterprise SSO / Billing / Webhooks | — | — | Partial | Partial | **Yes** |

### 3.3 Marketplace Modules (All Frontend-Complete)

| Module | Route | Key Features |
|---|---|---|
| **Marketplace Browse** | `/marketplace` | Unified search across 8 registries, 7-dimension filtering (registry, methodology, price, vintage, country, co-benefits, verification), grid/list views, watchlist, comparison |
| **Trading Desk** | `/marketplace/trading` | Fixed Price / Auction / Negotiable listings, dual-currency pricing (USD + NEAR), real-time fee estimation, order book with depth visualization |
| **Portfolio** | `/marketplace/portfolio` | Holdings dashboard, registry breakdown, performance tracking (24h/7d/30d), sell and retire flows |
| **Market Analytics** | `/marketplace/analytics` | Volume trends, price tracking, top projects, methodology breakdown, CO₂ offset timeline |
| **NEAR Explorer** | `/marketplace/explorer` | Network health, smart contract info (CertiK audit), transaction search, confirmation tracking |
| **Registry Hub** | `/marketplace/registries` | Connect/disconnect 8 registries via API key, credit sync, credential encryption (AES-256) |

---

## 4. AWS Architecture & Service Map

This is the core section for AWS reviewers. Every non-blockchain workload runs on AWS.

### 4.1 AWS Service Inventory

| Layer | AWS Service | Purpose | Configuration Target |
|---|---|---|---|
| **Compute** | Amazon ECS on Fargate (or Amazon EKS) | Container orchestration for 14 microservices | Auto-scaling task definitions; multi-AZ |
| **API Edge** | Amazon API Gateway (or Kong on ECS) | Public API ingress, request routing, rate limiting, JWT validation | Regional deployment; throttling per tenant |
| **Relational Database** | Amazon RDS for PostgreSQL 15+ | Primary multi-tenant data store (43+ tables) with Row-Level Security | Multi-AZ; db.r6g.xlarge (initial); automated backups with PITR |
| **In-Memory Cache** | Amazon ElastiCache for Redis 7+ | Session tokens, rate limiting counters, marketplace stats, order book cache | Cluster mode; cache.r6g.large (initial) |
| **Object Storage** | Amazon S3 | MRV evidence, verification reports, retirement certificates, static assets, backups | Standard + Glacier tiering; cross-region replication |
| **Event Bus** | Amazon EventBridge | Domain event backbone connecting all 14 microservices asynchronously | Custom event bus; schema registry; rules per service |
| **Message Queues** | Amazon SQS | Reliable work queues, dead-letter queues (DLQ), retry pipelines | FIFO queues for ordering; standard queues for throughput |
| **Secrets Management** | AWS Secrets Manager | Registry API keys, database credentials, blockchain signing keys | Automatic rotation; HSM-backed for signing keys |
| **Infrastructure as Code** | Terraform | Version-controlled infrastructure across dev/staging/prod | State in S3 + DynamoDB locking |
| **Networking** | Amazon VPC | Private subnets for databases/services; public subnets for API edge | VPC endpoints for S3, EventBridge, SQS; NAT gateway |
| **DNS & CDN** | Amazon CloudFront + Route 53 | Global content delivery, certificate assets, API acceleration | Edge locations for global access |
| **Monitoring** | Amazon CloudWatch | Centralized logging from all services and gateways | Log groups per service; metric filters; alarms |
| **Tracing** | AWS X-Ray | Distributed tracing across microservices and external calls | Sampling rules; service map visualization |

### 4.2 AWS Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              AWS CLOUD (us-east-1)                                    │
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │                           PUBLIC SUBNET                                          │ │
│  │                                                                                  │ │
│  │   ┌─────────────────┐     ┌──────────────────────────────────────────────────┐   │ │
│  │   │  Route 53 (DNS) │────►│  API Gateway / Kong on ECS                       │   │ │
│  │   └─────────────────┘     │  • JWT validation  • Rate limiting (per tenant)  │   │ │
│  │                           │  • Request routing  • Throttling                  │   │ │
│  │   ┌─────────────────┐     └──────────────────────┬───────────────────────────┘   │ │
│  │   │ CloudFront CDN  │                            │                               │ │
│  │   │ (static assets) │                            │                               │ │
│  │   └─────────────────┘                            │                               │ │
│  └──────────────────────────────────────────────────┼───────────────────────────────┘ │
│                                                     │                                │
│  ┌──────────────────────────────────────────────────┼───────────────────────────────┐ │
│  │                          PRIVATE SUBNET                                          │ │
│  │                                                  │                               │ │
│  │   ┌──────────────────────────────────────────────▼───────────────────────────┐   │ │
│  │   │                    AMAZON ECS / EKS (FARGATE)                            │   │ │
│  │   │                                                                          │   │ │
│  │   │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │ │
│  │   │  │  Tenant    │ │   User     │ │  Project   │ │    MRV     │           │   │ │
│  │   │  │  Service   │ │  Service   │ │  Service   │ │   Engine   │           │   │ │
│  │   │  └────────────┘ └────────────┘ └────────────┘ └────────────┘           │   │ │
│  │   │                                                                          │   │ │
│  │   │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │ │
│  │   │  │  Verifier  │ │  Hashing   │ │   Credit   │ │  Registry  │           │   │ │
│  │   │  │  Service   │ │  Service   │ │  Service   │ │  Adapters  │           │   │ │
│  │   │  └────────────┘ └────────────┘ └────────────┘ └────────────┘           │   │ │
│  │   │                                                                          │   │ │
│  │   │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │ │
│  │   │  │ Blockchain │ │   NEAR     │ │ Billing    │ │ Notification│           │   │ │
│  │   │  │ Submitter  │ │  Indexer   │ │ Service    │ │  Service   │           │   │ │
│  │   │  └────────────┘ └────────────┘ └────────────┘ └────────────┘           │   │ │
│  │   │                                                                          │   │ │
│  │   │  ┌────────────┐ ┌────────────┐                                          │   │ │
│  │   │  │ Audit Log  │ │  Webhook   │                                          │   │ │
│  │   │  │  Service   │ │  Service   │                                          │   │ │
│  │   │  └────────────┘ └────────────┘                                          │   │ │
│  │   └──────────────────────────────────────────────────────────────────────────┘   │ │
│  │              │                │                 │                                 │ │
│  │              ▼                ▼                 ▼                                 │ │
│  │   ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐                     │ │
│  │   │ Amazon RDS   │  │ ElastiCache   │  │ Amazon           │                     │ │
│  │   │ PostgreSQL   │  │ Redis Cluster │  │ EventBridge      │                     │ │
│  │   │ (Multi-AZ)   │  │              │  │ + SQS DLQs       │                     │ │
│  │   │ 43+ tables   │  │ Sessions     │  │                  │                     │ │
│  │   │ RLS enabled  │  │ Rate limits  │  │ Domain events    │                     │ │
│  │   └──────────────┘  │ Order book   │  │ Saga orchestration│                     │ │
│  │                     └───────────────┘  └──────────────────┘                     │ │
│  │                                                                                  │ │
│  │   ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐                     │ │
│  │   │ Amazon S3    │  │ Secrets       │  │ CloudWatch       │                     │ │
│  │   │ MRV evidence │  │ Manager       │  │ + X-Ray          │                     │ │
│  │   │ Certificates │  │ + HSM         │  │ Logs, Metrics,   │                     │ │
│  │   │ Backups      │  │              │  │ Traces, Alarms   │                     │ │
│  │   └──────────────┘  └───────────────┘  └──────────────────┘                     │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│                         ┌───────────────────────────┐                                │
│                         │     VPC Endpoints          │                                │
│                         │  S3 │ EventBridge │ SQS    │                                │
│                         └───────────────────────────┘                                │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       │
                          ┌────────────┴────────────┐
                          │                         │
               ┌──────────▼──────────┐   ┌─────────▼──────────┐
               │  NEAR PROTOCOL      │   │  EXTERNAL           │
               │  (Blockchain)       │   │  REGISTRIES          │
               │                     │   │                     │
               │  carbon-credits.near│   │  Verra API          │
               │  NEP-171 / NEP-141  │   │  Gold Standard API  │
               │  Mint / Transfer /  │   │  ACR / CAR / GCC    │
               │  Retire / Split     │   │  ART / Plan Vivo    │
               └─────────────────────┘   └─────────────────────┘
```

### 4.3 AWS Service Usage by Workload

| Workload | Primary AWS Services | Traffic Pattern | Scaling Approach |
|---|---|---|---|
| **Marketplace Browse** | API Gateway → ECS → RDS (read replicas) → ElastiCache | High-read, filter/sort-heavy | Read replicas + ElastiCache; cache TTL 5 min |
| **Trading (Orders + Listings)** | API Gateway → ECS → RDS (write) → EventBridge → SQS | Write-heavy bursts | ECS auto-scaling; SQS buffering for peak load |
| **MRV Ingestion & Computation** | API Gateway → ECS → S3 (evidence) → RDS → EventBridge | Batch uploads, variable payload sizes | S3 multipart upload; ECS task-level scaling |
| **Verification Pipeline** | EventBridge → ECS → RDS → S3 | Event-driven, asynchronous | SQS-backed processing; no idle compute cost |
| **Blockchain Operations** | ECS (Submitter + Indexer) → Secrets Manager → NEAR RPC | Low-volume, high-criticality | Dedicated task with retry queue + DLQ |
| **Registry Sync** | ECS (Adapters) → Secrets Manager → External APIs → RDS | Scheduled + on-demand | Circuit breaker pattern; 1-hour cache TTL |
| **Certificate Generation** | ECS → S3 (PDF output) | Triggered by retirement events | EventBridge → Lambda or ECS task |
| **Analytics & Reporting** | RDS (read replicas) → ElastiCache → ECS | Aggregation queries, time-series | Pre-computed materialized views; hourly refresh |
| **Billing & Metering** | EventBridge → ECS (Billing Service) → RDS | Event-driven usage tracking | Subscriber on EventBridge; idempotent processing |

### 4.4 Data Flow Through AWS

```
 USER REQUEST                    AWS PROCESSING                         EXTERNAL
 ───────────                    ──────────────                         ────────

 Browser/App                                                           NEAR Protocol
      │                                                                     ▲
      ▼                                                                     │
 ┌──────────┐    ┌───────────┐    ┌───────────────┐    ┌───────────────┐   │
 │ Route 53 │───►│    API    │───►│  ECS Service  │───►│  Blockchain   │───┘
 │   DNS    │    │  Gateway  │    │  (Business    │    │  Submitter    │
 └──────────┘    │  (Auth,   │    │   Logic)      │    │  (ECS Task)   │
                 │  Routing) │    └───────┬───────┘    └───────────────┘
                 └───────────┘            │
                                          ├──────────────────────────────────────┐
                                          │                                      │
                                          ▼                                      ▼
                                   ┌──────────────┐                  ┌──────────────────┐
                                   │  Amazon RDS  │                  │  Amazon          │
                                   │  PostgreSQL  │                  │  EventBridge     │
                                   │  (with RLS)  │                  │  (Domain Events) │
                                   └──────────────┘                  └────────┬─────────┘
                                          │                                   │
                                          ▼                          ┌────────┴────────┐
                                   ┌──────────────┐                  ▼                 ▼
                                   │ ElastiCache  │         ┌──────────────┐  ┌────────────┐
                                   │   Redis      │         │  SQS Queues  │  │  Registry  │
                                   │ (Hot Cache)  │         │  + DLQs      │  │  Adapters  │
                                   └──────────────┘         └──────────────┘  │  (ECS)     │
                                          │                                   └──────┬─────┘
                                          ▼                                          │
                                   ┌──────────────┐                                  ▼
                                   │  Amazon S3   │                          External Registry
                                   │  (Evidence,  │                          APIs (Verra, GS,
                                   │  Certs, Logs)│                          ACR, CAR...)
                                   └──────────────┘
```

---

## 5. Technical Architecture Deep Dive

### 5.1 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Cloud** | AWS | Primary infrastructure for all non-blockchain workloads |
| **Compute** | Amazon ECS/EKS (Fargate) | Container orchestration |
| **Backend** | Node.js (TypeScript) | 14 microservices |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Zustand, Framer Motion | Production-complete marketplace UI |
| **Database** | PostgreSQL 15+ (Amazon RDS) | Multi-tenant with Row-Level Security |
| **Cache** | Redis 7+ (Amazon ElastiCache) | Sessions, rate limiting, hot data |
| **Events** | Amazon EventBridge + SQS | Async domain events with DLQ retry |
| **Storage** | Amazon S3 + IPFS + Arweave | Multi-layer persistence |
| **Secrets** | AWS Secrets Manager + HSM | Credential and key management |
| **Blockchain** | NEAR Protocol (Rust smart contracts) | NFT issuance, transfer, retirement |
| **NFT Standard** | NEP-171 (NFT) + NEP-141 (Fungible) | Carbon credit tokenization |
| **API Style** | REST + GraphQL + WebSocket | External and internal APIs |
| **Auth** | OAuth 2.0 + JWT + NEAR Wallet Selector | Dual auth model (SaaS + blockchain) |
| **IaC** | Terraform | Infrastructure as code |
| **CI/CD** | GitHub Actions | Build → test → deploy pipeline |

### 5.2 Microservices Catalog (All Running on AWS ECS/EKS)

| Service | Responsibility | Stateful | AWS Dependencies |
|---|---|---|---|
| **API Gateway** | Auth, routing, rate limiting | No | API Gateway, ElastiCache |
| **Tenant Service** | Tenant CRUD, settings, billing config | Yes | RDS, EventBridge |
| **User Service** | User management, auth, RBAC | Yes | RDS, Secrets Manager |
| **Project Service** | Carbon project & methodology management | Yes | RDS, S3 |
| **MRV Ingestion** | Receive & validate raw MRV data | Yes | RDS, S3, EventBridge |
| **MRV Engine** | Registry-specific computation & methodology logic | No | EventBridge |
| **Verifier Service** | 9-category MRV verification | Yes | RDS, EventBridge |
| **Hashing Service** | Canonical payload construction + SHA-256 | No | EventBridge |
| **Registry Adapters** | Per-registry API integration (Verra, Gold Standard, ACR, etc.) | Yes | Secrets Manager, SQS, EventBridge |
| **Blockchain Submitter** | NEAR transaction submission | No | Secrets Manager (HSM-backed keys) |
| **NEAR Indexer** | Chain event listener and ingestion | No | RDS, EventBridge |
| **Credit Service** | Credit state management and lifecycle | Yes | RDS, EventBridge |
| **Billing Service** | Usage metering, invoicing, quota enforcement | Yes | RDS, EventBridge |
| **Notification Service** | Email, webhooks, alerts | No | SQS, EventBridge |

### 5.3 Event-Driven Architecture (AWS EventBridge)

All state changes emit domain events through Amazon EventBridge. This is the backbone of the system:

| Event Domain | Key Events | Consumers |
|---|---|---|
| **MRV** | `mrv.computed.v1`, `mrv.approved.v1`, `mrv.rejected.v1` | Verifier, Hashing, Audit Log, Analytics |
| **Verification** | `verification.started.v1`, `verification.completed.v1` | Notification, Audit Log |
| **Hashing** | `mrv.hash.created.v1` | Registry Adapters |
| **Registry** | `registry.approved.v1`, `registry.rejected.v1` | Blockchain Submitter, Credit Service |
| **Blockchain** | `blockchain.nft.minted.v1`, `blockchain.nft.retired.v1` | Credit Service, Registry Adapters, Billing |
| **Marketplace** | `marketplace.listed.v1`, `marketplace.sold.v1` | Analytics, Notification, Billing |
| **Billing** | `billing.usage.recorded.v1`, `billing.quota.exceeded.v1` | Tenant Service, Notification |

**Processing guarantees:** At-least-once delivery via EventBridge + SQS DLQ. Consumer idempotency via event ID deduplication. Ordering via aggregate version checking. Full event replay via event store with sequence numbers.

### 5.4 Credit Lifecycle (8-Phase Pipeline on AWS)

```
PHASE 0: Registry Selection         → ECS (Project Service) → RDS
PHASE 1: Data Ingestion             → ECS (MRV Ingestion) → S3 + RDS
PHASE 2: MRV Computation            → ECS (MRV Engine) → EventBridge
PHASE 3: 9-Category Verification    → ECS (Verifier Service) → RDS
PHASE 4: Canonical Hashing          → ECS (Hashing Service) → EventBridge
PHASE 5: Registry Submission        → ECS (Registry Adapters) → External APIs
PHASE 6: NFT Minting               → ECS (Blockchain Submitter) → NEAR Protocol
PHASE 7: Active Credit              → Trading via Marketplace API on ECS
PHASE 8: Retirement                 → ECS → NEAR (burn) → S3 (certificate)
```

Each phase emits events to EventBridge that trigger the next phase — fully decoupled, observable, and auditable.

### 5.5 Database Architecture (Amazon RDS PostgreSQL)

| Characteristic | Detail |
|---|---|
| **Tables** | 43 designed (of 52 planned), covering tenants, users, projects, MRV submissions, credits, transactions, registries, billing |
| **Multi-tenancy** | Row-Level Security (RLS) on every table with `tenant_id` column. Tenant context injected at the session level from JWT |
| **Schema completion** | 83% — remaining 9 tables are marketplace-specific (order book, analytics aggregation) |
| **Migrations** | Prisma-managed, version-controlled |
| **Backup** | Continuous + daily snapshots; cross-region replication to `eu-west-1` |
| **Estimated size (Year 1)** | ~50GB data, ~10GB indexes |

### 5.6 Blockchain Integration (NEAR Protocol via AWS)

AWS hosts all off-chain components of the blockchain integration:

| Component | AWS Service | Function |
|---|---|---|
| **Blockchain Submitter** | ECS Task + Secrets Manager (HSM) | Signs and submits NEAR transactions. Keys stored in HSM. Single-purpose: only calls `mint()` |
| **NEAR Indexer** | ECS Task (long-running) | Listens to NEAR blocks via NEAR Lake. Ingests mint/transfer/retire events into RDS via EventBridge |
| **Key Management** | Secrets Manager + HSM | Submitter keys rotated every 90 days (automated). Admin keys: 3-of-5 multi-sig with 48-hour timelock |
| **RPC Connectivity** | ECS → NEAR RPC (outbound) | Multi-RPC provider setup (Pagoda + fallback nodes) via NAT Gateway |

**NEAR Smart Contract Functions:**

| Function | Purpose | Authority | AWS Trigger |
|---|---|---|---|
| `mint` | Create new credit NFT | Blockchain Submitter only | EventBridge → Submitter ECS task |
| `transfer` | Change ownership | Current owner (wallet) | Marketplace API on ECS |
| `retire` | Permanently retire credit | Current owner (wallet) | Marketplace API on ECS |
| `split` | Fractionalize credit | Current owner | Marketplace API on ECS |
| `merge` | Combine fractions | Owner of all fractions | Marketplace API on ECS |
| `pause/unpause` | Emergency control | Multi-sig admin | Manual via admin tooling |

---

## 6. Security, Compliance & Tenant Isolation

### 6.1 Security Architecture

| Layer | Mechanism | AWS Service |
|---|---|---|
| **Network** | Private subnets for all databases and internal services; VPC endpoints for S3/EventBridge/SQS; public access restricted to API edge | VPC, Security Groups, NACLs |
| **Identity** | IAM roles and security groups enforce least privilege between services, databases, queues, and buckets | IAM, Resource Policies |
| **Secrets** | All registry credentials and signing keys encrypted at rest; automatic rotation; HSM-backed for blockchain keys | Secrets Manager, CloudHSM |
| **API Auth** | JWT tokens with refresh rotation; NEAR wallet signature-based auth for blockchain operations | API Gateway, Custom Authorizer |
| **Encryption at Rest** | AES-256 for all data stores | RDS encryption, S3 SSE, ElastiCache encryption |
| **Encryption in Transit** | TLS 1.3 everywhere | ACM certificates, ALB termination |
| **Rate Limiting** | Per-tenant rate limiting via Redis counters at API Gateway | ElastiCache, API Gateway |
| **Audit Trail** | Immutable audit log for all actions (actor, tenant, action, resource, timestamp, IP, correlation ID) | RDS, S3 (long-term), CloudWatch |

### 6.2 Multi-Tenant Isolation

Tenant isolation is enforced at every layer of the stack:

| Layer | Isolation Method | Implementation |
|---|---|---|
| **API Gateway** | Tenant ID extracted from JWT; rate limiting per tenant | API Gateway + ElastiCache |
| **Service Layer** | Tenant context injected in every request; validated before any DB operation | ECS application code |
| **Database** | Row-Level Security (RLS) policies on every table | RDS PostgreSQL |
| **Events** | Tenant ID in all EventBridge event payloads | EventBridge rules |
| **Storage** | Tenant-prefixed S3 paths (`s3://bucket/tenant-{id}/...`) | S3 bucket policies |
| **Blockchain** | NEAR sub-account hierarchy (`tenant.dmrv.near`) | NEAR protocol-level |

### 6.3 Compliance Posture

| Standard | Status | Relevance |
|---|---|---|
| **SOC 2 Type II** | Architecture designed for alignment | Security controls, audit logging, access review |
| **GDPR** | Data export API, anonymization, explicit consent | EU user data handling |
| **CCPA** | Opt-out mechanisms planned | California consumer privacy |
| **ICROA Code of Best Practice** | Enforced via verification framework | Carbon credit listing standards |
| **CORSIA** | Eligible credits flagged | Aviation offsetting |
| **ISO 14065** | Required for verifier accreditation | Verification body governance |
| **KYC/AML** | Integration-ready for compliance markets | Enterprise tenant onboarding |

### 6.4 Smart Contract Security

| Measure | Detail |
|---|---|
| **Audit** | CertiK (or equivalent) audit scheduled pre-mainnet launch |
| **Access Control** | Function-call access keys at NEAR protocol level — Submitter can only call `mint()` |
| **Multi-sig** | 3-of-5 multi-sig for contract admin (pause, upgrade) with 48-hour timelock |
| **Reentrancy** | Guards built into contract design |
| **Key Rotation** | Submitter keys: 90 days (automated). Admin keys: 180 days (ceremony) |

---

## 7. Reliability, Observability & DR

### 7.1 Service Level Objectives

| Service | SLO | Alert Threshold |
|---|---|---|
| API availability | 99.9% uptime | < 99.5% over 5 min |
| API latency (p95) | < 500ms | > 1 second |
| Mint latency (end-to-end) | < 30 seconds | > 60 seconds |
| Registry sync | < 5 minutes | > 15 minutes delay |
| Event processing | < 1 second | > 5 seconds average |
| Data availability | 99.99% | < 99.9% |
| RTO (Recovery Time) | < 15 minutes | — |
| RPO (Recovery Point) | < 1 minute | — |

### 7.2 Observability Stack (AWS-Hosted)

| Dimension | Tooling | AWS Integration |
|---|---|---|
| **Metrics** | Prometheus + Grafana (on ECS) | CloudWatch Metrics as secondary |
| **Logging** | ELK Stack or CloudWatch Logs | Structured JSON logs from all services |
| **Tracing** | Jaeger or AWS X-Ray | Distributed tracing across microservices |
| **Alerting** | PagerDuty / OpsGenie | CloudWatch Alarms integration |
| **Dashboards** | Grafana | Business metrics, SLIs/SLOs, infrastructure |

### 7.3 Resilience Patterns

| Pattern | Implementation | AWS Service |
|---|---|---|
| **Circuit Breaker** | Applied to all external API calls (registries, NEAR RPC). Open after 5 failures; half-open after 60s | ECS application code |
| **Retry with Backoff** | Exponential backoff: 1s, 2s, 4s, 8s, 16s. Max retries → DLQ | SQS + EventBridge |
| **Dead Letter Queue** | Failed events after max retries → DLQ → alert ops team → manual review | SQS DLQ |
| **Graceful Degradation** | If NEAR is degraded, marketplace continues read-only browsing and analytics; trade and retirement paused with user notification | ECS health checks |
| **Multi-AZ** | All stateful services deployed across availability zones | RDS Multi-AZ, ElastiCache replication |

### 7.4 Disaster Recovery

```
PRIMARY (us-east-1)                    SECONDARY (eu-west-1)
┌───────────────────────┐              ┌───────────────────────┐
│  ECS Services (Active)│              │  ECS Services (Standby)│
│  RDS (Primary)        │─────────────►│  RDS (Read Replica)    │
│  EventBridge (Active) │─────────────►│  EventBridge (Mirror)  │
│  ElastiCache (Primary)│─────────────►│  ElastiCache (Replica) │
│  S3 (Primary)         │─────────────►│  S3 (Cross-Region Rep) │
└───────────────────────┘              └───────────────────────┘

RPO: < 1 minute    |    RTO: < 15 minutes
Failover: Automatic after 5 min health check failure, or manual for maintenance
```

**Backup Strategy:**

| Component | Frequency | Retention | Location |
|---|---|---|---|
| Database (RDS) | Continuous PITR + daily snapshot | 30 days | Cross-region S3 |
| Event Store | Continuous replication | 1 year | Cross-region S3 |
| MRV Evidence (S3) | Triple redundancy | Permanent | S3 + IPFS + Arweave |
| Secrets | Versioned | 90 days | Secrets Manager |

---

## 8. Functional Requirements Summary

This section summarizes workload characteristics relevant to AWS capacity planning. Full specifications are maintained in `MARKETPLACE_SRS.md` (1,100+ lines, 40+ user stories with acceptance criteria).

### 8.1 Key Workload Modules

| Module | Traffic Pattern | AWS Capacity Impact |
|---|---|---|
| **Marketplace Browse** | High-read catalog (8 registries, 7 filter dimensions) | RDS read replicas + ElastiCache. Target: 100,000+ active listings without degradation |
| **Trading Desk** | Write-heavy listings + orders with fee estimation | RDS write throughput, EventBridge event volume. Target: order completion < 30 seconds |
| **Portfolio** | Per-user holdings, transactions, retirements | RDS per-user queries. Target: 1,000+ holdings, 50,000+ transactions per user with virtual scrolling |
| **Analytics** | Aggregated time-series (24h/7d/30d/90d) | Materialized views in RDS, cached in ElastiCache. Hourly refresh |
| **NEAR Explorer** | Read-only blockchain visibility | NEAR Indexer ECS task writes to RDS. 30-second refresh |
| **Registry Management** | Scheduled sync + on-demand | ECS tasks with circuit breaker. 1-hour cache TTL |

### 8.2 Non-Functional Requirements

| Requirement | Target | AWS Sizing Implication |
|---|---|---|
| **Concurrent Users** | 10,000+ | ECS auto-scaling, ElastiCache cluster sizing |
| **Initial Page Load (LCP)** | < 2.5 seconds | CloudFront CDN, SSR via Next.js on Vercel (frontend) |
| **API Response Time (p95)** | < 500ms | ECS task sizing, RDS instance class, ElastiCache hit rate |
| **Order Book Refresh** | < 2 seconds (WebSocket) | ElastiCache Pub/Sub or dedicated WebSocket ECS service |
| **NEAR Transaction Confirmation** | < 5 seconds average | NEAR block time ~1.2s; Submitter ECS task latency |
| **Active Listings** | 100,000+ | RDS indexing strategy, ElastiCache hot cache |
| **Uptime** | 99.9% | Multi-AZ, auto-scaling, health checks |
| **Data Durability** | 99.999999999% | S3 standard storage |

### 8.3 Supported Registries (8)

| Registry | Code | API Integration | Accreditations |
|---|---|---|---|
| Verra (VCS) | `verra` | REST API (full lifecycle) | ICROA, CORSIA |
| Gold Standard | `gold_standard` | REST API (full lifecycle) | ICROA, SDG Impact |
| American Carbon Registry | `acr` | REST API | ICROA |
| Climate Action Reserve | `car` | REST API | ICROA |
| Global Carbon Council | `gcc` | REST API | — |
| Architecture for REDD+ Transactions | `art` | REST API | REDD+ |
| Plan Vivo | `plan_vivo` | REST API | Community-based |
| Independent | `independent` | Manual import | Project-specific |

---

## 9. Business Model & Revenue

### 9.1 Revenue Streams

| Stream | Mechanism | Projected Year 1 |
|---|---|---|
| **Trading Fee** | 2% per transaction (buyer side) | $200K (at $10M volume) |
| **Listing Fee** | $0 standard; $50/mo premium placement | $60K |
| **Retirement Certificate** | $5 per certificate (includes NEAR gas) | $30K |
| **Registry API Access** | Enterprise plan for bulk API access | $100K |
| **Data & Analytics** | Premium analytics subscription ($99/mo) | $60K |
| **SaaS Subscriptions** | Starter / Professional / Enterprise tiers | Included above |
| **Year 1 Total** | | **~$450K** |
| **Year 2 Total** (10x volume) | | **~$3–5M** |

### 9.2 SaaS Subscription Tiers

| Plan | Target | Credits/Month | API Calls/Month | Key Features |
|---|---|---|---|---|
| **Starter** | Small projects | 1,000 | 10,000 | Basic MRV, 1 registry |
| **Professional** | Growing companies | 10,000 | 100,000 | All registries, batch ops, webhooks |
| **Enterprise** | Large organizations | Unlimited | Unlimited | SSO/SAML, SLA, dedicated support, white-label |

### 9.3 Unit Economics Path

| Milestone | Timeline | Revenue Impact |
|---|---|---|
| Beta Launch (Testnet) | Month 6 | 100 beta users; validation, no revenue |
| Mainnet Launch | Month 7 | Revenue starts (trading fees + certificates) |
| 2,500 MAU | Month 12 | ~$450K ARR |
| $1M Monthly Volume | Month 15 | Trading fee covers operating costs |
| Break-Even | Month 18 | Revenue run-rate covers infrastructure + skeleton team |

---

## 10. Current Traction & Build Status

### 10.1 What Exists Today (Pre-Funding)

| Component | Status | Detail |
|---|---|---|
| **Frontend UI** | **100% Complete** | 6 pages, 20+ screens, 8 reusable components, production-grade React/TypeScript on Next.js |
| **TypeScript Data Models** | **100% Complete** | 14 interfaces, 344 lines, all marketplace entities |
| **State Management** | **100% Complete** | 4 Zustand stores with computed selectors, modal orchestration |
| **Database Schema** | **83% Complete** | 43 of 52 PostgreSQL tables designed with Prisma migrations |
| **Architecture Design** | **100% Complete** | 2,300+ line architecture document covering all 14 microservices, events, blockchain integration |
| **MRV Pipeline Design** | **100% Complete** | 8-phase credit lifecycle, 9-category verification framework |
| **Requirements Specification** | **100% Complete** | 1,100+ line SRS with 40+ user stories, acceptance criteria, API specs |
| **Design System** | **100% Complete** | Glass morphism UI, responsive (320px–4K), accessible (WCAG AA) |
| **Blockchain Strategy** | **Validated** | NEAR chosen after rigorous evaluation vs. ERC-1155/Polygon/Arbitrum |

### 10.2 What's Next — and Where AWS Credits Apply

| Component | Timeline | AWS Services Required |
|---|---|---|
| **Backend API (23 endpoints)** | Month 1–3 | ECS, RDS, ElastiCache, API Gateway, EventBridge |
| **NEAR Smart Contract** | Month 2–4 | ECS (Submitter + Indexer), Secrets Manager |
| **Registry API Integration** | Month 3–5 | ECS (Adapters), Secrets Manager, SQS |
| **Production Infrastructure** | Month 1–6 | All AWS services in Section 4.1 |
| **CI/CD + Monitoring** | Month 1–2 | GitHub Actions → ECS, CloudWatch, X-Ray |
| **Scale to 10,000 users** | Month 7–24 | ECS auto-scaling, RDS read replicas, ElastiCache cluster |

AWS credits directly accelerate every row in this table.

### 10.3 Key Differentiators

1. **Not starting from zero.** The most expensive phase (product design + frontend engineering) is complete. We've de-risked "will the product work?"
2. **End-to-end ownership.** We own the MRV pipeline, verification framework, tokenization layer, and marketplace — no critical third-party dependencies.
3. **Registry-first architecture.** Built around registry compliance from Day 1, not bolted on later. This is the moat for institutional adoption.
4. **Deliberate blockchain choice.** NEAR provides human-readable identity for certificates, rich on-chain metadata at viable cost, sub-account multi-tenancy, predictable gas fees, and no bridge risk.
5. **Category leadership position.** On NEAR, we can be the flagship carbon credit platform. On Polygon, we'd compete against 50+ projects.

---

## 11. Team & Execution Plan

### 11.1 Hiring Plan

| Role | Count | Key Skills | Start |
|---|---|---|---|
| **Tech Lead** | 1 | NEAR Protocol, Rust, system architecture | Immediate |
| **Backend Engineers** | 2 | Node.js/TypeScript, PostgreSQL, Redis, REST APIs | Immediate |
| **Blockchain Engineer** | 1 | Rust, NEAR smart contracts, NEP-171/141 | Month 1 |
| **Frontend Engineers** | 2 | React, Next.js, TypeScript (backend + wallet integration) | Month 1 |
| **DevOps Engineer** | 1 | AWS (ECS, RDS, Terraform), CI/CD, monitoring | Month 2 |
| **QA Engineer** | 1 | Playwright E2E, performance testing | Month 3 |
| **Product Manager** | 1 | Carbon markets domain, Agile | Immediate |
| **UI/UX Designer** | 1 | Design systems, accessibility, user testing | Month 1 |

### 11.2 Methodology

| Parameter | Value |
|---|---|
| **Methodology** | Agile / Scrum (hybrid) |
| **Sprint Duration** | 2 weeks |
| **Total Sprints to Launch** | 12–13 |
| **Velocity Target** | 30–40 story points per sprint |
| **Release Cadence** | Every 2 sprints (monthly) |
| **Working Model** | Remote-first; 6-hour core overlap (10 AM–4 PM); no-meeting Mondays + Wednesdays |

### 11.3 6-Month Roadmap

```
MONTH 1          MONTH 2          MONTH 3          MONTH 4          MONTH 5          MONTH 6
┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
│ FOUNDATION│   │ BACKEND   │   │ BACKEND   │   │ BLOCKCHAIN│   │ SECURITY  │   │ LAUNCH    │
│           │   │ SPRINT 1  │   │ SPRINT 2  │   │ + REGISTRY│   │ + QA      │   │           │
│ Team hire │   │ Auth API  │   │ Trading   │   │ NEAR      │   │ CertiK    │   │ Mainnet   │
│ AWS setup │   │ Credits   │   │ Portfolio │   │ contract  │   │ audit     │   │ deploy    │
│ Terraform │   │ Listings  │   │ Orders    │   │ Verra API │   │ E2E tests │   │ Monitoring│
│ CI/CD     │   │ Filters   │   │ Retire    │   │ GS API    │   │ Perf test │   │ Beta→Prod │
│ RDS + ECS │   │ RDS+Redis │   │ Analytics │   │ Wallet    │   │ UAT       │   │ Support   │
│ Dev env   │   │ EventBrdg │   │ EventBrdg │   │ Indexer   │   │ Load test │   │ Revenue ▶ │
└───────────┘   └───────────┘   └───────────┘   └───────────┘   └───────────┘   └───────────┘
     ▲                                                                                 ▲
  AWS INFRA                                                                      PRODUCTION
  PROVISIONED                                                                    ON AWS
```

### 11.4 Quality Gates

```
Developer → PR → Lint + TypeCheck → Unit Tests (80%+) → Code Review → Staging → E2E → QA → Production
```

For smart contract changes:

```
... → Code Review (2 reviewers) → Testnet Deploy → Integration Tests → Security Review → Audit → Mainnet
```

---

## 12. Budget & AWS Resource Forecast

> **Total AWS Ask: Under $80,000** covering 24 months from development through revenue traction.

### 12.1 AWS Monthly Cost Forecast (Detailed)

| AWS Service | Configuration | Monthly Cost (Est.) | Notes |
|---|---|---|---|
| **Amazon ECS (Fargate)** | 14 services; avg 0.5 vCPU / 1GB RAM per task; 2 tasks per service | $800 | Auto-scaling reduces off-peak |
| **Amazon RDS (PostgreSQL)** | db.r6g.xlarge, Multi-AZ, 500GB GP3, automated backups | $600 | Read replica added at scale |
| **Amazon ElastiCache (Redis)** | cache.r6g.large, 2-node cluster mode | $300 | Sessions, rate limits, hot cache |
| **Amazon VPC** | NAT Gateway + VPC endpoints | $150 | Private networking |
| **Amazon CloudWatch** | Logs + metrics + alarms | $100 | All services logging |
| **Amazon S3** | 100GB standard (Year 1); lifecycle to Glacier | $50 | MRV evidence, certs, backups |
| **Amazon CloudFront** | CDN for static assets and certificates | $30 | Global distribution |
| **Amazon API Gateway** | ~5M requests/month | $20 | REST API ingress |
| **AWS X-Ray** | Distributed traces sampled at 5% | $20 | Cross-service tracing |
| **AWS Secrets Manager** | ~20 secrets with rotation | $15 | Registry keys, DB creds, signing keys |
| **Amazon EventBridge** | ~500K events/month | $10 | Domain event bus |
| **Amazon Route 53** | DNS hosting + health checks | $10 | Domain management |
| **Amazon SQS** | ~200K messages/month + DLQs | $5 | Work queues, retry pipelines |
| **Terraform State** | S3 + DynamoDB locking | $5 | IaC state management |
| **TOTAL AWS (Steady State)** | | **~$2,115/month** | |

### 12.2 AWS Scaling Projections (24-Month Forecast)

| Phase | Timeline | Users | AWS Monthly Cost | Cumulative AWS Spend |
|---|---|---|---|---|
| **Development** | Month 1–3 | Team only | ~$1,200 | $3,600 |
| **Beta (Testnet)** | Month 4–6 | 100 users | ~$1,800 | $9,000 |
| **Launch** | Month 7–9 | 1,000 users | ~$2,500 | $16,500 |
| **Growth** | Month 10–15 | 2,500–5,000 users | ~$3,500 | $37,500 |
| **Scale** | Month 16–24 | 5,000–10,000 users | ~$4,500 | **$78,000** |

**24-month total projected AWS spend: ~$78,000** — within the $80K budget ceiling.

At the Growth and Scale phases, trading fee revenue ($200K+ ARR at $10M volume) covers AWS costs and the platform becomes self-sustaining on infrastructure spend.

### 12.3 Cost Optimization Strategy

| Strategy | Savings | Implementation |
|---|---|---|
| **ECS Fargate Spot** | Up to 70% on non-critical tasks | Analytics, notification, webhook services run on Spot |
| **RDS Reserved Instances** | ~40% vs. on-demand | Commit after Month 6 when sizing is validated |
| **ElastiCache Reserved Nodes** | ~40% vs. on-demand | Commit after Month 6 |
| **S3 Intelligent-Tiering** | Auto-tiering to Glacier for cold MRV data | Enabled from Day 1 |
| **CloudWatch Log Retention** | Reduce to 30 days (dev) / 90 days (prod) | Per-environment policy |
| **Right-sizing reviews** | 10–20% ongoing | Monthly AWS Cost Explorer review |

With Reserved Instances and Spot, the **effective 24-month spend drops to ~$55K–$65K**.

### 12.4 The Ask

**Total AWS infrastructure request: up to $80,000** in credits covering the 24-month build-to-revenue window.

| Request | Estimated Value | Purpose |
|---|---|---|
| **AWS Activate Credits** | **$75,000** | Infrastructure costs from development through revenue traction (ECS, RDS, ElastiCache, S3, EventBridge, and all supporting services) |
| **AWS Solution Architecture Review** | In-kind | Validate ECS/RDS/EventBridge architecture before production deployment |
| **AWS Well-Architected Review** | In-kind | Formal review against AWS pillars (security, reliability, performance, cost, sustainability) |
| **AWS Partner Introductions** | In-kind | Connections to carbon market / climate-tech enterprises already on AWS |
| **AWS for Startups Go-to-Market** | In-kind | Co-marketing opportunity as a climate-tech case study on AWS |
| **Technical Account Manager access** | In-kind | Proactive guidance during build and launch phases |
| **TOTAL** | **< $80,000** | |

**Why this is a strong investment for AWS:**
- DMRV is an AWS-native workload — 100% of non-blockchain compute, storage, eventing, and data runs on AWS
- Climate-tech is a high-visibility category for AWS sustainability marketing
- Success creates a referenceable case study: "Carbon credit marketplace built end-to-end on AWS"
- Platform growth directly scales AWS consumption — revenue alignment with AWS

---

## 13. Appendices

### Appendix A: Why NEAR Protocol (Not ERC-1155 / Polygon)

This is the most common technical question from reviewers. Five structural reasons:

| # | Reason | Detail |
|---|---|---|
| 1 | **Human-readable identity** | Retirement certificates are legal documents shown to auditors. `acme-corp.near retired 500 credits from green-forest.near` vs. `0x2b8c4a6e...1d9f burned tokens from 0x4d6e8f2a...5c3b`. NEAR's named accounts are protocol-native |
| 2 | **Rich on-chain metadata at viable cost** | Our MRV hash, registry serial, methodology, tonnage, and report URI are stored on-chain per NFT (~$0.03). ERC-1155 typically stores only a `uri` pointer to off-chain JSON, creating a trust gap |
| 3 | **Multi-tenant at the protocol level** | NEAR sub-accounts (`tenant.dmrv.near`) mirror our RLS database multi-tenancy. Function-call access keys enforce permissions at the chain level, not just in contract code |
| 4 | **Predictable gas fees** | Our Trading Desk shows real-time fee estimates. NEAR gas is protocol-governed and stable. Ethereum/L2 gas spikes would make every fee estimate a lie |
| 5 | **No bridge risk for irreversible actions** | Retirement (burn) is permanent and legally meaningful. On NEAR, it happens on a sharded L1 with no bridge dependency. L2 bridges have been exploited for billions |

**Multi-chain expansion is architecturally preserved.** The backend API abstracts all chain operations. ERC-1155 on Polygon is planned for Phase 2 (Month 18) with no frontend or database rewrite.

### Appendix B: Supported Carbon Methodologies (9 Categories)

| Category | Color Code | Subtypes | Example Projects |
|---|---|---|---|
| Renewable Energy | `#3B82F6` | Solar, Wind, Hydro, Geothermal | Large-scale solar in India |
| Forestry & Land Use | `#22C55E` | REDD+, Afforestation, IFM, Agroforestry | Amazon rainforest conservation |
| Blue Carbon | `#0EA5E9` | Coastal Wetlands, Mangrove, Seagrass | Mangrove restoration in Indonesia |
| Carbon Capture | `#8B5CF6` | DAC, BECCS, Enhanced Weathering | Direct air capture in Iceland |
| Methane Management | `#F59E0B` | Landfill Gas, Agricultural Methane | Landfill gas capture |
| Soil Carbon | `#84CC16` | Regenerative Agriculture, Biochar | Biochar application in US Midwest |
| Energy Efficiency | `#EAB308` | Industrial, Building Efficiency | Industrial heat recovery |
| Industrial Processes | `#6B7280` | — | Cement process optimization |
| Transportation | `#EC4899` | Clean Cookstoves, Fuel Switching | Clean cookstove distribution in Africa |

### Appendix C: 9-Category MRV Verification Framework

Every credit passes through a rigorous 9-category verification before registry submission:

| # | Category | Key Checks | Validation Type |
|---|---|---|---|
| 1 | **Project Setup** | Registration, legal entity, boundaries, crediting period, methodology | Automated + Manual |
| 2 | **General** | Methodology eligibility, additionality, regulatory surplus, double-counting, stakeholder consultation | Manual-heavy |
| 3 | **Project Design** | Technology selection, baseline scenario, monitoring plan, QA/QC procedures | Manual |
| 4 | **Facilities** | Site location, ownership, equipment specs, operational capacity, safety compliance | Automated + Manual |
| 5 | **Carbon Accounting** | Calculation methodology, emission factors, activity data, uncertainty analysis | Manual |
| 6 | **LCA (Life Cycle Assessment)** | System boundaries, upstream/downstream emissions, embodied carbon, ISO 14040/14044 | Manual |
| 7 | **Project Emissions** | Scope 1/2/3 emissions, fugitive emissions, baseline emissions | Manual |
| 8 | **GHG Statements** | Gross removal, leakage deduction, buffer contribution, net issuance, permanence, reversal risk | Automated + Manual |
| 9 | **Removal Data** | Measurement methodology, instrument calibration, data completeness, quality, temporal coverage | Automated + Manual |

### Appendix D: Key Data Models

| Type | Fields (Key) | Status |
|---|---|---|
| `CarbonCredit` | id, projectId, projectName, registry, methodology, vintageYear, location, quantity, priceUsd, priceNear, status, coBenefits, verification, seller, nearTokenId | Implemented |
| `MarketplaceListing` | id, sellerId, credit, quantity, priceUsd, priceNear, listingType (fixed/auction/negotiable), status, expiresAt, views, watchers, offers | Implemented |
| `BuyOrder` | id, buyerId, listingId, quantity, priceUsd, priceNear, status, nearTxHash | Implemented |
| `PortfolioHolding` | credit, quantity, purchasePriceUsd, currentValueUsd, percentChange | Implemented |
| `Transaction` | id, type (buy/sell/retire/transfer), credit, quantity, priceUsd, nearTxHash, blockNumber, status, confirmations | Implemented |
| `Retirement` | id, credit, quantity, beneficiaryType, beneficiaryName, reason, certificateId, nearTxHash, impact | Implemented |
| `MarketAnalytics` | totalVolume24h/7d, totalTransactions24h, avgPrice, priceChange24h, topProjects, priceByMethodology | Implemented |
| `NetworkStatus` | network, isHealthy, blockHeight, tps, activeValidators, gasPrice | Implemented |

### Appendix E: Glossary

| Term | Definition |
|---|---|
| **Carbon Credit** | A tradeable certificate representing the removal or avoidance of 1 metric ton of CO₂ equivalent |
| **DMRV** | Digital Measurement, Reporting, and Verification |
| **MRV** | Measurement, Reporting, and Verification |
| **NEAR Protocol** | A proof-of-stake Layer 1 blockchain with sharding (Nightshade) |
| **NEP-171** | NEAR Enhancement Proposal for non-fungible tokens |
| **NEP-141** | NEAR Enhancement Proposal for fungible tokens |
| **RLS** | Row-Level Security — PostgreSQL feature enforcing per-tenant data isolation |
| **VCM** | Voluntary Carbon Market |
| **ICROA** | International Carbon Reduction and Offset Alliance |
| **CORSIA** | Carbon Offsetting and Reduction Scheme for International Aviation |
| **CBAM** | Carbon Border Adjustment Mechanism (EU) |
| **REDD+** | Reducing Emissions from Deforestation and Forest Degradation |
| **SDG** | United Nations Sustainable Development Goals |
| **SaaS** | Software as a Service |
| **HSM** | Hardware Security Module |
| **DLQ** | Dead Letter Queue |
| **PITR** | Point-in-Time Recovery |

---

## Contact

**[Your Name]**  
**[Your Email]**  
**[Your Phone]**

**Project Repository:** GitHub (private — access on request)  
**Live Demo:** Available upon request  
**Technical Documentation:**
- Architecture: `dmrv_saa_s_architecture_near_nft_design.md` (2,300+ lines)
- Requirements: `apps/dashboard/MARKETPLACE_SRS.md` (1,100+ lines)
- Database: `apps/dashboard/DATA_SCHEMA.md`
- Workflows: `docs/architecture/COMPREHENSIVE_WORKFLOWS.md` (3,500+ lines)

---

> *This document is confidential and intended for AWS program review only. Distribution is restricted to authorized AWS reviewers and DMRV team members.*
