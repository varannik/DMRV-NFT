# Enterprise DMRV SaaS Platform - Folder Structure

This document provides a comprehensive folder structure for the Enterprise Digital MRV SaaS Platform. It is designed to support a multi-tenant, event-driven microservices architecture on the NEAR blockchain.

## 1. Directory Tree Visualization

```text
dmrv-saas-platform/
├── README.md                           # Project root documentation
├── .gitignore                          # Global gitignore
├── .env.example                        # Example root environment variables
├── .nvmrc                              # Node version pinning
├── docker-compose.yml                  # Local development composition
├── Makefile                            # Make commands for repo management
├── .github/                            # CI/CD Workflows
│   └── workflows/
│       ├── ci-backend.yml              # Backend CI pipeline
│       ├── ci-contracts.yml            # Smart Contracts CI pipeline
│       ├── deploy-staging.yml          # Staging deployment
│       └── deploy-production.yml       # Production deployment
├── services/                           # Microservices Monorepo
│   ├── .eslintrc.json                  # Global linting rules
│   ├── tsconfig.base.json              # Base TypeScript config
│   ├── api-gateway/                    # [Core] API Gateway
│   ├── project-service/                # [Core] Project & Methodology Mgmt
│   ├── mrv-ingestion-service/          # [Core] IoT/Sensor Data Ingestion
│   ├── mrv-engine/                     # [Core] MRV Computation Engine
│   ├── verifier-service/               # [Core] Verifier Workflow
│   ├── hashing-service/                # [Core] Canonical Payload Hashing
│   ├── blockchain-submitter/           # [Core] NEAR Transaction Manager
│   ├── near-indexer/                   # [Core] Blockchain Event Indexer
│   ├── credit-service/                 # [Core] Credit Lifecyle & Projection
│   ├── audit-log-service/              # [Core] Immutable Audit Logs
│   ├── notification-service/           # [Core] User Notifications
│   ├── registry-adapter-verra/         # [Adapter] Verra Registry
│   ├── registry-adapter-puro/          # [Adapter] Puro.earth Registry
│   ├── registry-adapter-isometric/     # [Adapter] Isometric Registry
│   ├── registry-adapter-euets/         # [Adapter] EU ETS Compliance
│   └── marketplace-adapter/            # [Adapter] Trading Integration
├── smart-contracts/                    # NEAR Protocol Smart Contracts
│   ├── Cargo.toml                      # Workspace definition
│   ├── nft-contract/                   # Carbon Credit NFT Standard (NEP-171+)
│   │   ├── src/
│   │   └── Cargo.toml
│   ├── registry-sync/                  # Oracle/Sync Logic Contract
│   │   ├── src/
│   │   └── Cargo.toml
│   └── scripts/                        # Deployment & init scripts
│       ├── deploy.sh
│       └── init.sh
├── shared/                             # Shared Libraries
│   ├── types/                          # Shared TypeScript Interfaces/DTOs
│   ├── events/                         # Event Schemas (CloudEvents/Avro)
│   ├── errors/                         # Standardized Error definitions
│   ├── auth/                           # JWT/AuthZ Middleware & Utils
│   ├── blockchain/                     # NEAR RPC Wrappers & Types
│   ├── validation/                     # Zod/Joi Schemas
│   └── logging/                        # Structured Logger (Pino/Zap)
├── infrastructure/                     # DevOps & Infrastructure
│   ├── kubernetes/                     # K8s Manifests
│   │   ├── base/
│   │   └── overlays/
│   │       ├── dev/
│   │       ├── staging/
│   │       └── prod/
│   ├── terraform/                      # IaC (AWS/Azure/GCP)
│   │   ├── main.tf
│   │   └── variables.tf
│   ├── helm/                           # Helm Charts
│   │   └── dmrv-platform/
│   └── monitoring/                     # Observability Configs
│       ├── prometheus/
│       ├── grafana/
│       └── fluentd/
├── docs/                               # Documentation
│   ├── architecture/                   # C4 Models, Decision logs
│   ├── api/                            # OpenAPI/Swagger specs
│   ├── events/                         # AsyncAPI / Event Catalog
│   ├── runbooks/                       # Ops guides
│   └── adr/                            # Architecture Decision Records
├── scripts/                            # Utility Scripts
│   ├── db-migrate.sh
│   ├── seed-data.js
│   └── setup-local.sh
└── tests/                              # End-to-End System Tests
    ├── e2e/
    └── load-tests/
```

---

## 2. Microservice Structure Template

Every service in `/services/` follows this strict structural pattern to ensure consistency across the engineering team.

### Typical Service Layout (`/services/project-service/`)

```text
project-service/
├── src/
│   ├── config/                 # Environment config loading
│   │   └── index.ts
│   ├── controllers/            # HTTP/RPC Handlers
│   │   └── project.controller.ts
│   ├── services/               # Core Business Logic
│   │   └── project.service.ts
│   ├── repositories/           # Database Access Layer
│   │   └── project.repo.ts
│   ├── models/                 # ORM Entities / Domain Models
│   │   └── project.entity.ts
│   ├── events/                 # Event Publishing & Subscription
│   │   ├── publishers/
│   │   └── consumers/
│   ├── middleware/             # Express/Gin Middleware
│   │   └── tenant-context.ts
│   ├── utils/                  # Helper functions
│   └── index.ts                # Application Entrypoint
├── tests/                      # Local Tests
│   ├── unit/
│   └── integration/
├── migrations/                 # DB Migrations (e.g., TypeORM/Liquibase)
├── Dockerfile                  # Production Docker build
├── package.json                # Dependencies
├── tsconfig.json               # TS Config
├── .env.example                # Service-specific env vars
└── README.md                   # Service documentation
```

### Key Directories Explanation

- **`src/services/`**: Contains pure business logic. Should be framework-agnostic where possible.
- **`src/repositories/`**: Isolates data access. Used to mock databases in unit tests.
- **`src/events/`**: Vital for this event-driven architecture. Contains logic to emit `mrv.computed.v1` or consume `registry.issued.v1`.
- **`src/middleware/`**: Handle cross-cutting concerns like Auth (JWT validation) and Multi-tenancy (extracting Tenant ID).

---

## 3. Sample Configuration Files

### 3.1 Dockerfile Template (`/services/*/Dockerfile`)

A comprehensive multi-stage build optimization for Node.js services.

```dockerfile
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci
COPY src ./src
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install Tini for proper signal handling
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Non-root user for security
USER node

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### 3.2 Service Package.json Stub

```json
{
  "name": "@dmrv/project-service",
  "version": "1.0.0",
  "private": true,
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "migrate": "typeorm-ts-node-commonjs migration:run"
  },
  "dependencies": {
    "@dmrv/shared-types": "workspace:*",
    "@dmrv/shared-events": "workspace:*",
    "@dmrv/shared-auth": "workspace:*",
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "kafkajs": "^2.2.4",
    "typeorm": "^0.3.17",
    "zod": "^3.21.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^18.16.0",
    "typescript": "^5.0.0",
    "jest": "^29.5.0",
    "ts-node": "^10.9.1"
  }
}
```

---

## 4. Operational & Architectural Decisions

### Multi-Tenancy Strategy
- **Isolation**: Services use `middleware/tenant-context.ts` to extract `X-Tenant-ID` from JWTs.
- **Data**: All database queries MUST filter by `tenant_id`. Schemas should include a `tenant_id` column on all primary entities (Projects, Credits, etc.).
- **Config**: Tenant specific configuration (like Registry API keys) is stored in the **Project Service** (encrypted) and loaded on demand.

### Event-Driven Architecture
- **Topics**: Strict naming convention `noun.verb.version` (e.g., `blockchain.nft.minted.v1`).
- **Schema Registry**: All schemas defined in `/shared/events`.
- **Idempotency**: Consumers must check for duplicate `event_id` processing to handle replay attacks or at-least-once delivery.

### Security
- **Signing**: The **Verifier Service** validates digital signatures from MRV devices before data enters the engine.
- **Hashing**: The **Hashing Service** creates a verifiable content-addressable hash (IPFS style) of the MRV payload *before* blockchain submission.
- **Contracts**: All `smart-contracts` directories include a `tests/` folder for Rust-based simulation testing.

### CI/CD Pipeline Strategy
- **Monorepo Handling**: Workflows in `.github/workflows` use `paths` filters to only deploy services that have changed.
- **GitOps**: Deployment manifests in `/infrastructure/kubernetes` are updated automatically by the CI pipeline for ArgoCD/Flux to pick up.

### Documentation
- **ADRs**: Start documenting key decisions immediately in `/docs/adr` (e.g., "ADR-001: Implementing Multi-Tenancy with Row-Level Security").
- **API Specs**: All services must expose a `/swagger.json` endpoint generated from code or defined in `/docs/api`.
