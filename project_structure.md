# Enterprise DMRV-NFT Platform - Project Structure

## Overview
This document defines the folder and file structure for the cloud-native, microservices-based DMRV platform.

## Directory Tree

```text
.
├── .github/                            # [Domain 12] Governance & CI/CD
│   ├── ISSUE_TEMPLATE/                 # Standardization for issue reporting
│   └── workflows/                      # CI/CD pipeline definitions
├── apps/                               # [Domain 5] Frontend Applications
│   ├── admin-console/                  # Admin dashboard for platform management
│   ├── marketplace-ui/                 # User-facing marketplace interface
│   ├── registry-viewer/                # Public view for carbon registries
│   └── verifier-portal/                # Dedicated portal for verification auditors
├── contracts/                          # [Domain 1] Smart Contracts (NEAR Protocol)
│   ├── .scripts/                       # Deployment and maintenance scripts
│   ├── nft-core/                       # Core NFT logic (issuance, lifecycle)
│   ├── marketplace/                    # Marketplace contract logic
│   ├── registry/                       # Registry integration contracts
│   ├── tests/                          # Contract-specific unit & simulation tests
│   └── migrations/                     # Smart contract upgrade paths
├── data/                               # [Domain 6] Data Layer
│   ├── migrations/                     # Database schema migrations (SQL/NoSQL)
│   ├── schemas/                        # Canonical data models (Protobuf/JSON-Schema)
│   └── seeds/                          # Data seeding for dev/staging environments
├── docs/                               # [Domain 11] Documentation Hub
│   ├── adr/                            # [Domain 12] Architecture Decision Records
│   ├── architecture/                   # High-level architecture & diagrams
│   ├── api/                            # OpenAPI/Swagger specs
│   ├── compliance/                     # [Domain 8] ISO/SOC2 compliance artifacts
│   └── runbooks/                       # Operational guides and playbooks
├── infrastructure/                     # [Domain 7] Cloud & DevOps
│   ├── k8s/                            # Kubernetes manifests (Helm/Kustomize)
│   ├── terraform/                      # Infrastructure as Code (AWS/GCP/Azure)
│   │   ├── environments/               # Env-specific configs (dev, stage, prod)
│   │   └── modules/                    # Reusable infrastructure modules
│   └── secrets/                        # Secret management configuration (Vault/KMS)
├── ops/                                # [Domain 9] Observability & Operations
│   ├── alerting/                       # Alert manager rules
│   ├── dashboards/                     # Grafana/Monitoring dashboard exports
│   └── logging/                        # Log aggregation configs (Fluentd/Vector)
├── security/                           # [Domain 8] Security & Audit
│   ├── audit-logs/                     # Audit trail definitions & schema
│   ├── policies/                       # OPA (Open Policy Agent) definitions
│   └── threat-modeling/                # STRIDE models and security reports
├── services/                           # [Domain 2, 3, 4] Backend Microservices
│   ├── api-gateway/                    # [Domain 4] Unified public API entry point
│   ├── auth-service/                   # [Domain 4] Enterprise AuthN/AuthZ
│   ├── mrv-ingestion/                  # [Domain 2] IoT & Oracle data intake
│   ├── mrv-pipeline/                   # [Domain 2] Computation & AI validation engine
│   ├── proof-service/                  # [Domain 2] Data integrity & creating ZK proofs
│   ├── registry-connector/             # [Domain 3] External registry adapter/sync
│   └── verification-workflow/          # [Domain 3] Managing verification state transitions
├── tests/                              # [Domain 10] Cross-Service Testing
│   ├── chaos/                          # Chaos engineering experiments
│   ├── e2e/                            # End-to-end integration suites
│   └── performance/                    # Load testing (k6/JMeter) scripts
├── tools/                              # Project Tooling
│   ├── dev/                            # Local development utilities
│   └── scripts/                        # Global repository maintenance scripts
├── .gitignore                          # Git ignore rules
├── .tool-versions                      # Version pinning (asdf/rbenv etc)
├── ADR_TEMPLATE.md                     # Template for new Architecture Decision Records
├── CHANGELOG.md                        # [Domain 12] Version history
├── CONTRIBUTING.md                     # [Domain 12] Governance guidelines
├── docker-compose.yml                  # Local development orchestration
├── LICENSE                             # License definition
├── Makefile                            # Top-level command shortcuts
├── README.md                           # Main project entry point
└── SECURITY.md                         # Security reporting policy
```
