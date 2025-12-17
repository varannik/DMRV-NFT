# DMRV SaaS Platform - Enterprise Folder Structure

## overview
This document defines the comprehensive directory structure for the separate Digital MRV SaaS platform. It follows a **Monorepo** architecture (managed via TurboRepo or similar) to ensure consistency across services, shared libraries, and frontend applications while maintaining clean boundaries.

## Top-Level Hierarchy

```text
dmrv-platform/
├── .github/                   # GitHub Actions (CI/CD)
├── .husky/                    # Git hooks (pre-commit, commit-msg)
├── apps/                      # Frontend applications / Gateways
├── contracts/                 # NEAR Smart Contracts (Rust)
├── docs/                      # Global documentation & ADRs
├── infrastructure/            # IaC, K8s, Terraform
├── libs/                      # Shared internal libraries (TS)
├── scripts/                   # Ops & dev scripts
├── services/                  # Backend Microservices (NestJS)
├── tools/                     # Build tools, generators, configs
├── .env.example               # Root environment template
├── .gitignore
├── docker-compose.yml         # Local dev environment
├── package.json               # Root dependencies (DevOps, linting)
├── pnpm-workspace.yaml        # Workspace definition
├── README.md                  # Project entry point
└── turbo.json                 # TurboRepo pipeline config
```

---

## Detailed Structure

### 1. Services (`services/*`)
*Backend microservices. Stack: NestJS + TypeScript.*

```text
services/
├── project-service/           # Project Management
│   ├── src/
│   │   ├── domain/            # Domain entities & logic (DDD)
│   │   ├── application/       # Use cases, command handlers
│   │   ├── infrastructure/    # DB adapters, external APIs
│   │   └── interface/         # Controllers, Resolvers
│   ├── Dockerfile
│   ├── package.json
│   └── test/                  # Service-level integration tests
├── mrv-engine/                # MRV Processing & Verification
│   ├── src/
│   │   ├── calculation/       # Methodology engines
│   │   ├── ingestion/         # IoT/Satellite data handlers
│   │   └── reports/           # PDF/Excel generation
│   └── ...
├── registry-adapter/          # Registry Sync Service
│   ├── src/
│   │   ├── adapters/          # IRegistryAdapter implementations
│   │   │   ├── verra/
│   │   │   ├── puro/
│   │   │   └── isometric/
│   │   ├── mapping/           # Data transformers
│   │   └── sync/              # Cron/Event listeners
│   └── ...
├── credit-service/            # Issuance & Retirement
│   ├── src/
│   │   ├── issuance/          # Credit minting logic
│   │   └── lifecycle/         # Transfer/Retire workflows
│   └── ...
├── marketplace/               # Trading & Listings
│   ├── src/
│   │   ├── orderbook/
│   │   └── settlement/
│   └── ...
├── blockchain-service/        # NEAR Integration & Events
│   ├── src/
│   │   ├── listeners/         # Indexer/Event subscribers
│   │   └── transactions/      # Transaction queue/signer
│   └── ...
└── auth-service/              # Identity & Access (or Keycloak wrapper)
    └── ...
```

### 2. Contracts (`contracts/`)
*NEAR Smart Contracts. Stack: Rust.*

```text
contracts/
├── Cargo.toml                 # Workspace manifest
├── nft-credit/                # Core Credit Token (NEP-171/177+)
│   ├── src/
│   │   ├── lib.rs
│   │   ├── metadata.rs
│   │   ├── minting.rs
│   │   └── royalty.rs
│   └── Cargo.toml
├── registry-core/             # Registry Logic & Authority
│   ├── src/
│   │   ├── lib.rs
│   │   └── storage.rs         # Organization mapping
│   └── Cargo.toml
├── market-contract/           # On-chain Marketplace
│   ├── src/
│   └── Cargo.toml
└── tests/                     # Integration/Simulation tests
    ├── workspaces/            # NEAR Workspaces-rs tests
    └── fuzzing/
```

### 3. Frontend Apps (`apps/`)
*User-facing applications. Stack: Next.js / React.*

```text
apps/
├── admin-dashboard/           # Platform Admin
│   ├── src/
│   │   ├── app/               # App Router
│   │   ├── features/          # Feature-based folders
│   │   └── components/
│   └── next.config.js
├── project-portal/            # Project Developer UI
│   ├── src/
│   │   ├── forms/             # Complex wizard forms
│   │   └── dashboard/         # Analytics views
│   └── ...
├── verifier-dashboard/        # 3rd Party Verifier UI
│   └── ...
├── marketplace-ui/            # Public Trading Interface
│   └── ...
└── api-gateway/               # BFF / Gateway (NestJS or Apollo Fed)
    ├── src/
    │   ├── rovers/            # GraphQL Federation
    │   └── proxy/             # REST Routing
    └── ...
```

### 4. Shared Libraries (`libs/`)
*Reusable internal packages.*

```text
libs/
├── api-interfaces/            # Shared DTOs, Types, Enums
│   └── src/
│       ├── project/
│       └── credit/
├── common-backend/            # NestJS shared modules
│   └── src/
│       ├── auth/              # Guards, Strategies
│       ├── database/          # TypeORM/Prisma base
│       ├── logging/           # Logger wrappers
│       └── filters/           # Exception filters
├── common-frontend/           # React Component Library
│   ├── src/
│   │   ├── components/        # Buttons, Inputs, Tables
│   │   ├── hooks/
│   │   └── theme/
│   └── package.json
├── domain-core/               # Pure domain logic (Platform Agnostic)
│   └── src/
│       ├── value-objects/
│       └── algorithms/        # Hashing/Merkle tree utils
└── events/                    # Event Bus Schemas (RabbitMQ/Kafka)
    └── src/
        ├── schemas/
        └── topics.ts
```

### 5. Infrastructure (`infrastructure/`)
*DevOps and Cloud resources.*

```text
infrastructure/
├── k8s/                       # Kubernetes Manifests
│   ├── base/
│   └── overlays/
│       ├── dev/
│       ├── staging/
│       └── prod/
├── terraform/                 # IaC (AWS/GCP)
│   ├── modules/
│   │   ├── vpc/
│   │   ├── rds/
│   │   └── eks/
│   └── environments/
│       └── prod/
└── helm/                      # Helm Charts
    └── dmrv-platform/
```

### 6. Docs (`docs/`)
*Project documentation.*

```text
docs/
├── adr/                       # Architecture Decision Records
│   ├── 001-monorepo.md
│   └── 002-near-protocol.md
├── api/                       # OpenAPI / Swagger specs
├── compliance/                # Audit & Reg docs
└── user-guides/
```

## Naming Conventions & Rules

- **Files**: `kebab-case` (e.g., `user-profile.service.ts`, `mint-credit.rs`)
- **Classes**: `PascalCase` (e.g., `userProfileService`)
- **Interfaces**: `I` prefix + `PascalCase` (e.g., `IRegistryAdapter`)
- **Directories**: `kebab-case`
- **Tests**: `*.spec.ts` (unit), `*.test.ts` (integration)

## Environment Configuration

Configuration is managed via `dotenv` and strictly typed config services.

- `.env` (gitignored): Local secrets
- `.env.example`: Template for required variables
- `config/`: Default configurations per environment (yaml/json) mapped in generic service loaders.

### Key Environment Variables Structure

```bash
# GLOBAL
NODE_ENV=development
LOG_LEVEL=debug

# DATABASE
DB_HOST=localhost
DB_PORT=5432

# BLOCKCHAIN
NEAR_NETWORK=testnet
NEAR_MASTER_ACCOUNT=dmrv.testnet

# SERVICES
RABBITMQ_URI=amqp://guest:guest@localhost
AUTH0_DOMAIN=...
```

## Recommended Tech Stack

- **Monorepo Manager**: TurboRepo or Nx
- **Package Manager**: pnpm
- **Backend Framework**: NestJS (Node.js)
- **Frontend Framework**: Next.js (React)
- **Blockchain**: Rust (Contracts) + near-api-js (Integration)
- **Database**: PostgreSQL (Relational) + MongoDB (Audit/Logs)
- **Messaging**: RabbitMQ
- **DevOps**: Docker, K8s, GitHub Actions
