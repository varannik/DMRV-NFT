# DMRV SaaS Platform – Technical Architecture & Implementation Guide

## 1. Executive Summary

This document describes the **end-to-end architecture** of the DMRV (Digital Monitoring, Reporting, Verification) SaaS platform that:

- Processes MRV data from external sources
- Issues carbon credit NFTs on NEAR Protocol
- Synchronizes with multiple carbon registries (Verra, Puro, Isometric, EU ETS)
- Provides multi-tenant SaaS APIs for enterprise customers

**Target Audience**: Backend engineers, DevOps, technical leadership, auditors

---

## 2. Core Design Principles

| Principle | Description |
|-----------|-------------|
| **Blockchain as Trust Anchor** | On-chain for integrity & authority, not computation |
| **Registry-First** | NFTs only minted after registry approval |
| **Event-Driven** | All state changes emit events; services react asynchronously |
| **Multi-Tenant by Design** | Data isolation, per-tenant configuration, shared infrastructure |
| **Carbon Science Aware** | Additionality, permanence, leakage built into the model |

---

## 3. Technology Stack

### 3.1 Infrastructure

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Cloud** | AWS | Primary infrastructure |
| **Compute** | ECS/EKS (Kubernetes) | Container orchestration |
| **Database** | PostgreSQL (RDS) | Primary data store with RLS |
| **Cache** | Redis (ElastiCache) | Session, rate limiting, caching |
| **Event Bus** | AWS EventBridge | Async messaging between services |
| **Queue** | SQS | Dead letter queues, retry queues |
| **Storage** | S3 + IPFS + Arweave | Multi-layer data persistence |
| **Secrets** | AWS Secrets Manager + HSM | Key management |
| **IaC** | Terraform | Infrastructure as code |

### 3.2 Blockchain

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Network** | NEAR Protocol | NFT issuance and lifecycle |
| **Contract Language** | Rust | Smart contract development |
| **NFT Standard** | NEP-171 | NEAR NFT specification |
| **Indexer** | NEAR Lake + Custom | Chain event ingestion |

### 3.3 Application

| Layer | Technology | Purpose |
|-------|------------|---------|
| **API Gateway** | Kong / AWS API Gateway | Auth, routing, rate limiting |
| **Backend Services** | Node.js (TypeScript) | Microservices |
| **API Style** | REST + GraphQL | External and internal APIs |
| **Auth** | OAuth 2.0 + JWT | Authentication & authorization |

### 3.4 Observability

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Metrics** | Prometheus + Grafana | Performance monitoring |
| **Logging** | ELK / CloudWatch | Centralized logging |
| **Tracing** | Jaeger / X-Ray | Distributed tracing |
| **Alerting** | PagerDuty / OpsGenie | Incident management |

---

## 4. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DMRV SaaS PLATFORM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   TENANTS   │    │   USERS     │    │  PROJECTS   │    │   CREDITS   │   │
│  │ (Companies) │───►│ (People)    │───►│ (CDR Sites) │───►│   (NFTs)    │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
│         │                                     │                  │          │
│         ▼                                     ▼                  ▼          │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        SaaS API LAYER                                │   │
│  │  API Gateway → Auth → Rate Limiting → Routing → Services             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     MICROSERVICES LAYER                              │   │
│  │                                                                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ Tenant   │ │  User    │ │ Project  │ │  MRV     │ │ Verifier │   │   │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Engine   │ │ Service  │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  │                                                                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ Hashing  │ │ Credit   │ │ Registry │ │Blockchain│ │  NEAR    │   │   │
│  │  │ Service  │ │ Service  │ │ Adapters │ │Submitter │ │ Indexer  │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      AWS EVENTBRIDGE                                 │   │
│  │              (Event Bus for Async Communication)                     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│         │                           │                         │             │
│         ▼                           ▼                         ▼             │
│  ┌──────────────┐          ┌──────────────┐          ┌──────────────┐       │
│  │   REGISTRIES │          │     NEAR     │          │  MARKETPLACE │       │
│  │ Verra, Puro  │          │  BLOCKCHAIN  │          │   (Future)   │       │
│  │ Isometric    │          │              │          │              │       │
│  └──────────────┘          └──────────────┘          └──────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. User & Tenant Management

### 5.1 Tenant Model

A **Tenant** represents a company/organization using the platform.

```
┌─────────────────────────────────────────────────────────────────┐
│                    TENANT HIERARCHY                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TENANT (Company)                                               │
│     │                                                           │
│     ├── Users (People with accounts)                            │
│     │      ├── Admin Users                                      │
│     │      ├── Project Managers                                 │
│     │      ├── MRV Analysts                                     │
│     │      └── Viewers                                          │
│     │                                                           │
│     ├── Projects (Carbon removal sites)                         │
│     │      ├── MRV Submissions                                  │
│     │      └── Credits (NFTs)                                   │
│     │                                                           │
│     ├── Registry Connections                                    │
│     │      └── Per-tenant API credentials                       │
│     │                                                           │
│     ├── Billing & Subscription                                  │
│     │      └── Plan, usage, invoices                            │
│     │                                                           │
│     └── Settings                                                │
│            ├── Branding (white-label)                           │
│            ├── Webhooks                                         │
│            └── API Keys                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 User Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| **Tenant Admin** | Full tenant access | Manage users, billing, settings, all projects |
| **Project Manager** | Manages specific projects | Create/edit projects, submit MRV, view credits |
| **MRV Analyst** | Data entry & analysis | Submit MRV data, view reports |
| **Verifier** | External verification body | Review MRV, approve/reject submissions |
| **Viewer** | Read-only access | View projects, credits, reports |
| **API User** | Machine access | Programmatic access via API keys |

### 5.3 Tenant Isolation Strategy

| Layer | Isolation Method |
|-------|------------------|
| **API Gateway** | Tenant ID in JWT, rate limiting per tenant |
| **Service Layer** | Tenant context injected in every request |
| **Database** | Row-Level Security (RLS) policies |
| **Events** | Tenant ID in all event payloads |
| **Storage** | Tenant-prefixed S3 paths |
| **Encryption** | Optional per-tenant encryption keys |

### 5.4 User Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LIFECYCLE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. INVITATION                                                  │
│     └── Admin invites user via email                            │
│         └── Invitation token generated (24h expiry)             │
│                                                                 │
│  2. ONBOARDING                                                  │
│     ├── User clicks invite link                                 │
│     ├── Sets password, completes profile                        │
│     ├── MFA setup (required for Admin/Verifier)                 │
│     └── Accepts Terms of Service                                │
│                                                                 │
│  3. ACTIVE                                                      │
│     ├── Normal platform access                                  │
│     ├── Session management (JWT + refresh tokens)               │
│     └── Activity logging for audit                              │
│                                                                 │
│  4. SUSPENSION                                                  │
│     ├── Admin suspends user                                     │
│     ├── All sessions invalidated                                │
│     └── Can be reactivated                                      │
│                                                                 │
│  5. DELETION                                                    │
│     ├── GDPR-compliant deletion                                 │
│     ├── Personal data anonymized                                │
│     └── Audit trail preserved (anonymized)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.5 Tenant Onboarding Flow

| Step | Action | System Response |
|------|--------|-----------------|
| 1 | Company signs up | Create tenant, admin user |
| 2 | Select subscription plan | Configure limits, features |
| 3 | Complete KYC (if compliance market) | Identity verification |
| 4 | Connect registries | Store encrypted API credentials |
| 5 | Create first project | Ready for MRV submission |

---

## 6. End-to-End Credit Lifecycle

### 6.1 Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              CREDIT ISSUANCE LIFECYCLE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 1: DATA INGESTION                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ External MRV data received (sensors, labs, satellite)   │    │
│  │ Data validated against methodology schema               │    │
│  │ Stored with tenant/project association                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  PHASE 2: MRV COMPUTATION                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ MRV Engine applies methodology calculations             │    │
│  │ Baseline comparison, leakage adjustments                │    │
│  │ Tonnage (tCO2e) computed                                │    │
│  │ Event: mrv.computed.v1                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  PHASE 3: VERIFICATION                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Independent verifier reviews MRV results                │    │
│  │ Checks methodology compliance                           │    │
│  │ Approves or rejects with comments                       │    │
│  │ Event: mrv.approved.v1 or mrv.rejected.v1               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  PHASE 4: CANONICAL HASHING                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Deterministic JSON payload constructed                  │    │
│  │ SHA-256 hash (mrv_hash) generated                       │    │
│  │ This hash = permanent identity of the credit            │    │
│  │ Event: mrv.hash.created.v1                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  PHASE 5: REGISTRY SUBMISSION                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Registry Adapter transforms to registry format          │    │
│  │ Submits to registry API for approval                    │    │
│  │ Registry validates and issues serial number             │    │
│  │ Event: registry.approved.v1 (with serial)               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  PHASE 6: NFT MINTING                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Blockchain Submitter receives registry approval         │    │
│  │ Mints NFT on NEAR with mrv_hash + registry_serial       │    │
│  │ Smart contract validates authority, no double-mint      │    │
│  │ Event: blockchain.nft.minted.v1                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  PHASE 7: ACTIVE CREDIT                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Credit available for trading or retirement              │    │
│  │ Can be split into fractions                             │    │
│  │ Ownership transfers tracked on-chain                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  PHASE 8: RETIREMENT                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Owner initiates retirement with beneficiary claim       │    │
│  │ NFT status changed to RETIRED on-chain                  │    │
│  │ Registry notified for final cancellation                │    │
│  │ Retirement certificate generated                        │    │
│  │ Event: blockchain.nft.retired.v1                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Hash Integrity Model

**Critical Principle**: The same `mrv_hash` flows through the entire system.

```
MRV Data → Computation → Verification → Hash Creation
                                             │
                     ┌───────────────────────┴───────────────────────┐
                     │                                               │
                     ▼                                               ▼
              Registry Submission                              NFT Minting
              (hash in payload)                               (hash in metadata)
                     │                                               │
                     ▼                                               ▼
              Registry Serial                                  Token ID
                     │                                               │
                     └───────────────────┬───────────────────────────┘
                                         │
                                         ▼
                              VERIFIABLE CHAIN OF CUSTODY
                              (Anyone can verify hash matches)
```

---

## 7. MRV Verification Framework

Before any credit can proceed to registry submission, it must pass a comprehensive verification process. This section defines the 9 verification categories that the Verifier Service evaluates.

### 7.1 Verification Process Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              MRV VERIFICATION WORKFLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MRV Data Submitted                                             │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  AUTOMATED PRE-CHECKS                                   │    │
│  │  • Data completeness validation                         │    │
│  │  • Schema conformance                                   │    │
│  │  • Duplicate detection                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  9-CATEGORY VERIFICATION (Human + Automated)            │    │
│  │                                                         │    │
│  │  1. Project Setup         6. LCA                        │    │
│  │  2. General               7. Project Emissions          │    │
│  │  3. Project Design        8. GHG Statements             │    │
│  │  4. Facilities            9. Removal Data               │    │
│  │  5. Carbon Accounting                                   │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                                                       │
│    ┌────┴────┐                                                  │
│    ▼         ▼                                                  │
│  ALL PASS   ANY FAIL                                            │
│    │         │                                                  │
│    ▼         ▼                                                  │
│  Generate   Return with                                         │
│  mrv_hash   findings                                            │
│    │         │                                                  │
│    ▼         ▼                                                  │
│  Proceed   Corrective                                           │
│  to        action                                               │
│  Registry  required                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Category 1: Project Setup

Validates that the project is properly registered and configured.

| Check | Description | Evidence Required | Validation |
|-------|-------------|-------------------|------------|
| Project registration | Project exists in system | Project ID | Automated |
| Legal entity | Valid company/organization | Registration docs | Manual |
| Project boundaries | Geographic scope defined | Coordinates, maps | Manual |
| Crediting period | Start/end dates valid | Date range | Automated |
| Methodology selected | Approved methodology assigned | Methodology ID | Automated |
| Baseline established | Reference scenario defined | Baseline data | Manual |

**Pass Criteria**: All mandatory fields complete, legal entity verified, boundaries clearly defined.

### 7.3 Category 2: General

Validates overall project eligibility and compliance.

| Check | Description | Evidence Required | Validation |
|-------|-------------|-------------------|------------|
| Methodology eligibility | Project type matches methodology | Project classification | Automated |
| Additionality | Project wouldn't happen without carbon finance | Financial analysis, barrier analysis | Manual |
| Regulatory surplus | Goes beyond legal requirements | Regulatory assessment | Manual |
| Double-counting check | Not registered elsewhere | Hash registry lookup | Automated |
| Stakeholder consultation | Community engagement completed | Consultation records | Manual |
| Environmental safeguards | No negative environmental impact | Impact assessment | Manual |

**Pass Criteria**: Additionality demonstrated, no regulatory conflicts, stakeholder concerns addressed.

### 7.4 Category 3: Project Design

Validates technical specifications and monitoring approach.

| Check | Description | Evidence Required | Validation |
|-------|-------------|-------------------|------------|
| Technology selection | Appropriate for project type | Technical specifications | Manual |
| Baseline scenario | Credible counterfactual defined | Baseline documentation | Manual |
| Project scenario | Clear description of intervention | Project description | Manual |
| Monitoring plan | Adequate measurement approach | Monitoring protocol | Manual |
| Quality assurance | QA/QC procedures defined | QA/QC plan | Manual |
| Data management | Data collection procedures | Data management plan | Manual |

**Pass Criteria**: Design is technically sound, monitoring plan is adequate for quantification.

### 7.5 Category 4: Facilities

Validates physical infrastructure and operational capacity.

| Check | Description | Evidence Required | Validation |
|-------|-------------|-------------------|------------|
| Site location | Accurate coordinates | GPS coordinates, maps | Automated |
| Site ownership/control | Legal right to operate | Ownership/lease docs | Manual |
| Equipment specifications | Relevant equipment documented | Equipment list, specs | Manual |
| Operational capacity | Capacity matches claims | Capacity analysis | Manual |
| Site access | Verifier can access if needed | Access arrangement | Manual |
| Safety compliance | Meets safety requirements | Safety certifications | Manual |

**Pass Criteria**: Site exists, equipment matches claims, operational capacity verified.

### 7.6 Category 5: Carbon Accounting

Validates the quantification methodology and calculations.

| Check | Description | Evidence Required | Validation |
|-------|-------------|-------------------|------------|
| Calculation methodology | Correct formulas applied | Calculation spreadsheet | Manual |
| Emission factors | Appropriate factors used | Factor sources | Manual |
| Activity data | Accurate input data | Raw data, measurements | Manual |
| Uncertainty analysis | Quantified uncertainty bounds | Uncertainty calculation | Manual |
| Conservative approach | Conservative estimates used | Justification document | Manual |
| Unit consistency | Correct units throughout | Calculation review | Automated |

**Pass Criteria**: Calculations are correct, conservative, and uncertainty is acceptable.

### 7.7 Category 6: Life Cycle Assessment (LCA)

Validates full lifecycle emissions are considered.

| Check | Description | Evidence Required | Validation |
|-------|-------------|-------------------|------------|
| System boundaries | Clear LCA scope defined | Boundary diagram | Manual |
| Upstream emissions | Materials, transport included | Upstream calculations | Manual |
| Operational emissions | Energy, maintenance included | Operational data | Manual |
| Downstream emissions | End-of-life considered | Downstream analysis | Manual |
| Embodied carbon | Equipment/infrastructure carbon | Embodied carbon calc | Manual |
| LCA standard | ISO 14040/14044 compliance | LCA methodology | Manual |

**Pass Criteria**: All lifecycle stages assessed, net removal is positive after lifecycle emissions.

### 7.8 Category 7: Project Emissions

Validates all emission sources are identified and quantified.

| Check | Description | Evidence Required | Validation |
|-------|-------------|-------------------|------------|
| Scope 1 (Direct) | On-site fossil fuel, process emissions | Fuel records, measurements | Manual |
| Scope 2 (Energy) | Purchased electricity, heat | Utility bills, grid factors | Manual |
| Scope 3 (Indirect) | Transport, supply chain | Scope 3 calculations | Manual |
| Fugitive emissions | Leaks, venting | Fugitive emission estimate | Manual |
| Emission sources list | All sources identified | Source inventory | Manual |
| Baseline emissions | Pre-project emissions | Historical data | Manual |

**Pass Criteria**: All material emission sources identified, quantified, and documented.

### 7.9 Category 8: GHG Statements

Validates the final greenhouse gas impact claims.

| Check | Description | Evidence Required | Validation |
|-------|-------------|-------------------|------------|
| Gross removal | Total CO2 removed before deductions | Removal calculation | Manual |
| Leakage deduction | Activity/market leakage accounted | Leakage assessment | Manual |
| Buffer deduction | Permanence risk buffer applied | Buffer calculation | Automated |
| Net removal | Final tCO2e claim | Net calculation | Automated |
| Permanence assessment | Duration of storage | Permanence analysis | Manual |
| Reversal risk | Risk of carbon release | Risk assessment | Manual |
| Uncertainty statement | Confidence interval | Uncertainty bounds | Manual |

**Pass Criteria**: GHG statement is accurate, conservative, and includes all deductions.

### 7.10 Category 9: Removal Data

Validates the measurement and monitoring data quality.

| Check | Description | Evidence Required | Validation |
|-------|-------------|-------------------|------------|
| Measurement methodology | Approved method used | Method documentation | Manual |
| Instrument calibration | Equipment calibrated | Calibration records | Manual |
| Data completeness | No gaps in monitoring | Data completeness check | Automated |
| Data quality | Accuracy, precision acceptable | QA/QC records | Manual |
| Temporal coverage | Correct monitoring period | Date range validation | Automated |
| Third-party data | External data sources valid | Data source verification | Manual |
| Sampling approach | Representative sampling | Sampling protocol | Manual |

**Pass Criteria**: Data is complete, accurate, and from calibrated/validated sources.

### 7.11 Verification Status Model

Each category produces a status:

| Status | Meaning | Action |
|--------|---------|--------|
| **PASSED** | All checks passed | Proceed |
| **PASSED_WITH_COMMENTS** | Minor observations, no impact | Proceed with notes |
| **CLARIFICATION_REQUIRED** | Need more information | Request from project |
| **CORRECTIVE_ACTION** | Issue found, fixable | Project must correct |
| **FAILED** | Fundamental issue | Reject, major revision needed |

### 7.12 Verification Report Structure

```
┌─────────────────────────────────────────────────────────────────┐
│              VERIFICATION REPORT                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HEADER                                                         │
│  ├── Report ID: VR-2024-00123                                   │
│  ├── Project ID: PRJ-456                                        │
│  ├── Verification Period: 2024-01-01 to 2024-06-30              │
│  ├── Verifier: John Smith (Accredited Verifier #V-789)          │
│  └── Report Date: 2024-07-15                                    │
│                                                                 │
│  CATEGORY RESULTS                                               │
│  ┌──────────────────────┬──────────┬─────────────────────────┐  │
│  │ Category             │ Status   │ Findings                │  │
│  ├──────────────────────┼──────────┼─────────────────────────┤  │
│  │ 1. Project Setup     │ PASSED   │ —                       │  │
│  │ 2. General           │ PASSED   │ —                       │  │
│  │ 3. Project Design    │ PASSED   │ Minor: Update mon. plan │  │
│  │ 4. Facilities        │ PASSED   │ —                       │  │
│  │ 5. Carbon Accounting │ PASSED   │ —                       │  │
│  │ 6. LCA               │ PASSED   │ —                       │  │
│  │ 7. Project Emissions │ PASSED   │ —                       │  │
│  │ 8. GHG Statements    │ PASSED   │ —                       │  │
│  │ 9. Removal Data      │ PASSED   │ —                       │  │
│  └──────────────────────┴──────────┴─────────────────────────┘  │
│                                                                 │
│  OVERALL RESULT: APPROVED                                       │
│                                                                 │
│  VERIFIED QUANTITIES                                            │
│  ├── Gross Removal: 1,200 tCO2e                                 │
│  ├── Leakage Deduction: -60 tCO2e (5%)                          │
│  ├── Buffer Contribution: -171 tCO2e (15%)                      │
│  └── Net Issuance: 969 tCO2e                                    │
│                                                                 │
│  VERIFIER SIGNATURE: [Digital Signature]                        │
│  VERIFICATION HASH: sha256:abc123...                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.13 Verification Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `verification.started.v1` | Verification begins | project_id, verifier_id, mrv_submission_id |
| `verification.category.completed.v1` | Category reviewed | category, status, findings |
| `verification.clarification.requested.v1` | Need more info | category, questions |
| `verification.clarification.received.v1` | Response received | category, response |
| `verification.completed.v1` | All categories done | overall_status, verified_tonnage |
| `mrv.approved.v1` | Verification passed | mrv_hash, verification_report_id |
| `mrv.rejected.v1` | Verification failed | rejection_reasons, required_actions |

### 7.14 Verifier Governance

| Aspect | Requirement |
|--------|-------------|
| **Accreditation** | Must be accredited by recognized body (ISO 14065) |
| **Independence** | No financial interest in project outcome |
| **Competence** | Trained in relevant methodology |
| **Conflict of Interest** | Rotation required every 3 verification cycles |
| **Performance Tracking** | Approval rate, turnaround time, dispute rate monitored |
| **Liability** | Professional indemnity insurance required |

### 7.15 Verification Checklist Template

Each verification category has a standardized checklist:

| # | Check Item | Required Evidence | Status | Notes |
|---|------------|-------------------|--------|-------|
| 1.1 | Project registered | Project ID | ☐ | |
| 1.2 | Legal entity verified | Registration docs | ☐ | |
| 1.3 | Boundaries defined | Map/coordinates | ☐ | |
| ... | ... | ... | ☐ | |

**Checklist is stored as structured data and versioned per methodology.**

---

## 8. Carbon Science Integrity

### 7.1 Core Carbon Market Requirements

| Requirement | Description | Platform Implementation |
|-------------|-------------|-------------------------|
| **Additionality** | Removal wouldn't happen without carbon finance | Methodology-specific tests, baseline comparison |
| **Permanence** | Removal is long-lasting or permanent | Buffer pool, reversal handling, monitoring |
| **Leakage** | No carbon shifting to other locations | Leakage adjustments in MRV calculation |
| **Measurability** | Quantifiable with acceptable uncertainty | Methodology-compliant calculations, uncertainty bounds |

### 8.2 Additionality Verification

```
┌─────────────────────────────────────────────────────────────────┐
│              ADDITIONALITY ASSESSMENT                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TEST 1: REGULATORY SURPLUS                                     │
│  └── Project goes beyond legal requirements                     │
│                                                                 │
│  TEST 2: FINANCIAL BARRIER                                      │
│  └── Project not financially viable without carbon revenue      │
│                                                                 │
│  TEST 3: COMMON PRACTICE                                        │
│  └── Activity is not standard practice in the region            │
│                                                                 │
│  STORED IN CREDIT METADATA:                                     │
│  • additionality_test_results                                   │
│  • baseline_scenario_id                                         │
│  • financial_analysis_hash                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Permanence & Buffer Pool

```
┌─────────────────────────────────────────────────────────────────┐
│              PERMANENCE RISK MANAGEMENT                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BUFFER POOL MECHANISM                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Project generates 1000 tCO2e                           │    │
│  │       │                                                 │    │
│  │       ├── 850 tCO2e → Issued to project (tradeable)     │    │
│  │       │                                                 │    │
│  │       └── 150 tCO2e → Buffer Pool (15% reserve)         │    │
│  │                            │                            │    │
│  │                            ▼                            │    │
│  │              Held to cover reversal events              │    │
│  │              (fire, disease, policy change)             │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  BUFFER CONTRIBUTION RATES                                      │
│  ┌──────────────────┬────────────────┐                          │
│  │ Project Type     │ Buffer Rate    │                          │
│  ├──────────────────┼────────────────┤                          │
│  │ Forestry         │ 15-25%         │                          │
│  │ Soil Carbon      │ 10-20%         │                          │
│  │ DAC/BECCS        │ 5%             │                          │
│  │ Mineralization   │ 0% (permanent) │                          │
│  └──────────────────┴────────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.4 Reversal Handling

```
┌─────────────────────────────────────────────────────────────────┐
│              REVERSAL EVENT FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: REVERSAL DETECTED                                      │
│  └── Monitoring detects loss event (fire, disease, etc.)        │
│                                                                 │
│  STEP 2: QUANTIFICATION                                         │
│  └── Calculate tonnes of CO2 released back                      │
│                                                                 │
│  STEP 3: BUFFER DEDUCTION                                       │
│  └── Deduct equivalent credits from buffer pool                 │
│                                                                 │
│  STEP 4: AFFECTED CREDIT UPDATE                                 │
│  ├── If credit active: Mark as "impaired"                       │
│  ├── If credit retired: No change (retirement stands)           │
│  └── Registry notified of reversal                              │
│                                                                 │
│  STEP 5: REMEDIATION (if buffer insufficient)                   │
│  ├── Project must purchase replacement credits                  │
│  └── Or provide additional collateral                           │
│                                                                 │
│  CREDIT STATES RELATED TO PERMANENCE:                           │
│  • ACTIVE → Normal tradeable state                              │
│  • IMPAIRED → Partial reversal, reduced value                   │
│  • INVALIDATED → Full reversal, not tradeable                   │
│  • RETIRED → Permanent, unaffected by reversal                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.5 Leakage Assessment

| Leakage Type | Description | Mitigation |
|--------------|-------------|------------|
| **Activity Shifting** | Deforestation moves to nearby area | Expanded monitoring boundaries |
| **Market Leakage** | Reduced supply causes production elsewhere | Market analysis, discounting |
| **Ecological Leakage** | Natural systems release carbon elsewhere | Life cycle assessment |

Leakage is expressed as a **discount factor** applied to gross removals:

```
Net Credits = Gross Removal × (1 - Leakage Factor)
```

---

## 9. Vintage & Expiry Management

### 9.1 Vintage Rules

| Field | Description |
|-------|-------------|
| **Vintage Year** | Year the carbon removal occurred |
| **Issuance Date** | When credit was issued on platform |
| **Crediting Period** | Valid period for the project (e.g., 10 years) |
| **Expiry Date** | When credit can no longer be retired (if applicable) |

### 9.2 Expiry Enforcement

```
┌─────────────────────────────────────────────────────────────────┐
│              CREDIT EXPIRY HANDLING                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RULE: Credits must be retired before expiry                    │
│                                                                 │
│  TIMELINE:                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Issuance    -6 months    -30 days    Expiry    +1 day  │    │
│  │      │           │            │          │          │   │    │
│  │      ▼           ▼            ▼          ▼          ▼   │    │
│  │   ACTIVE    WARNING      URGENT      EXPIRED    VOID    │    │
│  │             NOTICE       NOTICE     (locked)            │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ACTIONS:                                                       │
│  • -6 months: Email notification to owner                       │
│  • -30 days: Urgent notification, dashboard alert               │
│  • Expiry: Credit locked, cannot trade or retire                │
│  • Post-expiry: Returned to buffer pool or voided               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Microservices Architecture

### 10.1 Service Catalog

| Service | Responsibility | Stateful | Dependencies |
|---------|---------------|----------|--------------|
| **API Gateway** | Auth, routing, rate limiting | No | Auth Provider |
| **Tenant Service** | Tenant CRUD, settings, billing | Yes | Database |
| **User Service** | User management, auth, roles | Yes | Database, Auth Provider |
| **Project Service** | Project & methodology management | Yes | Database, Tenant Service |
| **MRV Ingestion** | Receive & validate raw MRV data | Yes | Database, Project Service |
| **MRV Engine** | Computation & methodology logic | No | MRV Ingestion |
| **Verifier Service** | 9-category MRV verification, verifier management | Yes | Database, User Service, MRV Engine |
| **Hashing Service** | Canonical payload & SHA-256 | No | MRV Engine |
| **Registry Adapter(s)** | Per-registry integration | Yes | Hashing Service |
| **Blockchain Submitter** | NEAR transaction submission | No | Registry Adapters |
| **NEAR Indexer** | Chain event listener | No | NEAR RPC |
| **Credit Service** | Credit state management | Yes | Database, NEAR Indexer |
| **Notification Service** | Emails, webhooks, alerts | No | All services |
| **Audit Log Service** | Immutable audit trail | Yes | All services |

### 10.2 Service Communication

```
┌─────────────────────────────────────────────────────────────────┐
│              SERVICE COMMUNICATION PATTERNS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SYNCHRONOUS (REST/gRPC)                                        │
│  └── Used for: User auth, data queries, validation              │
│                                                                 │
│  ASYNCHRONOUS (EventBridge)                                     │
│  └── Used for: State changes, cross-service coordination        │
│                                                                 │
│  EVENT FLOW:                                                    │
│                                                                 │
│  MRV Engine ──► mrv.computed.v1 ──► EventBridge                 │
│                                           │                     │
│                     ┌─────────────────────┼─────────────────┐   │
│                     ▼                     ▼                 ▼   │
│              Verifier Service      Audit Log         Analytics  │
│                     │                                           │
│                     ▼                                           │
│              mrv.approved.v1 ──► EventBridge                    │
│                                       │                         │
│                                       ▼                         │
│                               Hashing Service                   │
│                                       │                         │
│                                       ▼                         │
│                              mrv.hash.created.v1                │
│                                       │                         │
│                                       ▼                         │
│                               Registry Adapter                  │
│                                       │                         │
│                                       ▼                         │
│                              registry.approved.v1               │
│                                       │                         │
│                                       ▼                         │
│                             Blockchain Submitter                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Event-Driven Architecture

### 11.1 Event Taxonomy

| Domain | Events |
|--------|--------|
| **MRV** | `mrv.computed.v1`, `mrv.approved.v1`, `mrv.rejected.v1` |
| **Verification** | `verification.started.v1`, `verification.category.completed.v1`, `verification.clarification.requested.v1`, `verification.completed.v1` |
| **Hashing** | `mrv.hash.created.v1` |
| **Registry** | `registry.approved.v1`, `registry.rejected.v1`, `registry.retired.v1` |
| **Blockchain** | `blockchain.nft.minted.v1`, `blockchain.nft.transferred.v1`, `blockchain.nft.retired.v1` |
| **Marketplace** | `marketplace.listed.v1`, `marketplace.sold.v1` |
| **System** | `audit.recorded.v1`, `notification.sent.v1` |

### 11.2 Event Structure

| Field | Purpose |
|-------|---------|
| `event_id` | Unique identifier (UUID) |
| `event_type` | Event name with version |
| `correlation_id` | Links related events across flow |
| `causation_id` | Parent event that triggered this |
| `tenant_id` | Tenant context |
| `aggregate_id` | Entity this event belongs to |
| `aggregate_version` | Version for ordering |
| `timestamp` | ISO-8601 timestamp |
| `payload` | Event-specific data |

### 11.3 Event Processing Guarantees

| Guarantee | Implementation |
|-----------|----------------|
| **At-least-once delivery** | EventBridge + SQS DLQ |
| **Idempotency** | Event ID deduplication at consumer |
| **Ordering** | Aggregate version checking |
| **Replay** | Full event store with sequence numbers |

---

## 12. Registry Integration

### 12.1 Supported Registries

| Registry | Market Type | API Integration | Features |
|----------|-------------|-----------------|----------|
| **Verra (VCS)** | Voluntary | REST API | Full lifecycle |
| **Puro.earth** | Voluntary | REST API | Full lifecycle |
| **Isometric** | Voluntary | REST API | Full lifecycle |
| **EU ETS** | Compliance | Government portal | Limited (manual steps) |
| **California ARB** | Compliance | Government portal | Limited (manual steps) |

### 12.2 Registry Adapter Pattern

Each registry has an independent adapter service:

```
┌─────────────────────────────────────────────────────────────────┐
│              REGISTRY ADAPTER RESPONSIBILITIES                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ISSUANCE FLOW:                                                 │
│  1. Subscribe to mrv.hash.created.v1                            │
│  2. Transform MRV payload to registry-specific format           │
│  3. Submit to registry API                                      │
│  4. Handle response (approval/rejection)                        │
│  5. Emit registry.approved.v1 or registry.rejected.v1           │
│                                                                 │
│  RETIREMENT FLOW:                                               │
│  1. Subscribe to blockchain.nft.retired.v1                      │
│  2. Transform retirement data to registry format                │
│  3. Submit cancellation to registry API                         │
│  4. Emit registry.retired.v1 confirmation                       │
│                                                                 │
│  RESILIENCE:                                                    │
│  • Circuit breaker for API failures                             │
│  • Exponential backoff retry                                    │
│  • Dead letter queue for manual review                          │
│  • Health monitoring dashboard                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.3 Cross-Registry Deduplication

**Problem**: Same MRV data could be submitted to multiple registries.

**Solution**: Global Hash Registry (on-chain or centralized)

| Check | Action |
|-------|--------|
| Hash exists with different registry | REJECT (double-counting) |
| Hash exists with same registry | REJECT (duplicate) |
| Hash is new | LOCK, proceed with submission |

---

## 13. Blockchain Layer (NEAR Protocol)

### 13.1 Smart Contract Functions

| Function | Purpose | Authority |
|----------|---------|-----------|
| `mint` | Create new credit NFT | Blockchain Submitter only |
| `transfer` | Change ownership | Current owner |
| `retire` | Permanently retire credit | Current owner |
| `split` | Fractionalize credit | Current owner |
| `merge` | Combine fractions | Owner of all fractions |
| `pause/unpause` | Emergency control | Multi-sig admin |

### 13.2 NFT Metadata Structure

| Field | Description |
|-------|-------------|
| `token_id` | Unique identifier |
| `mrv_hash` | SHA-256 of canonical MRV payload |
| `registry_id` | Which registry approved |
| `registry_serial` | Registry's serial number |
| `project_id` | Project reference |
| `vintage` | Year of removal |
| `methodology` | Methodology ID and version |
| `tonnage_co2e` | Amount in tonnes |
| `mrv_report_uri` | IPFS link to full report |
| `status` | active, retired, impaired |

### 13.3 NEAR Operational Considerations

| Aspect | Value | Impact |
|--------|-------|--------|
| Block time | ~1 second | Fast finality |
| Finality | 2-3 blocks | 3 second confirmation |
| Gas per mint | ~50-100 TGas | ~$0.005 per mint |
| Storage per NFT | ~700 bytes | ~0.007 NEAR staked |
| Max tx per block | ~1000 | Batch size limits |

### 13.4 Transaction Confirmation Flow

```
TX Submitted → Block Included → 3 Confirmations → Final → Indexed → Event Emitted
     │              │                │              │         │           │
     └──────────────┴────────────────┴──────────────┴─────────┴───────────┘
                               ~5 seconds total
```

---

## 14. Batch Operations

### 14.1 Batch Minting

For projects with large credit issuances:

| Parameter | Specification |
|-----------|---------------|
| Max batch size | 100 credits per request |
| Processing | Async with callback webhook |
| Atomicity | All-or-nothing per batch |
| Rate limit | 10 batches per minute per tenant |

### 14.2 Batch Retirement

For corporate offset programs:

| Parameter | Specification |
|-----------|---------------|
| Max batch size | 500 credits per request |
| Beneficiary | Single beneficiary per batch |
| Certificate | One certificate per batch |
| Registry sync | Sequential per registry |

### 14.3 Batch API Design

| Endpoint | Purpose |
|----------|---------|
| `POST /v1/credits/batch/mint` | Submit batch mint request |
| `POST /v1/credits/batch/retire` | Submit batch retirement |
| `GET /v1/batches/{batch_id}` | Check batch status |
| `GET /v1/batches/{batch_id}/results` | Get individual results |

---

## 15. Security Architecture

### 15.1 Key Management

```
┌─────────────────────────────────────────────────────────────────┐
│              KEY MANAGEMENT HIERARCHY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BLOCKCHAIN SUBMITTER KEYS                                      │
│  ├── Standard mints (<10,000 tCO2e): Single HSM key             │
│  └── Large mints (≥10,000 tCO2e): 2-of-3 multi-sig              │
│                                                                 │
│  CONTRACT ADMIN KEYS                                            │
│  └── 3-of-5 multi-sig + 48-hour timelock                        │
│                                                                 │
│  KEY ROTATION                                                   │
│  ├── Submitter keys: Every 90 days (automated)                  │
│  ├── Admin keys: Every 180 days (ceremony)                      │
│  └── API keys: Every 30 days (automated)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 15.2 Access Control Matrix

| Role | Mint | Transfer | Retire | Pause | Upgrade |
|------|------|----------|--------|-------|---------|
| Blockchain Submitter | ✅ | ❌ | ❌ | ❌ | ❌ |
| Credit Owner | ❌ | ✅ | ✅ | ❌ | ❌ |
| Platform Admin | ❌ | ❌ | ❌ | ✅ (emergency) | ❌ |
| Multi-sig Council | ❌ | ❌ | ❌ | ✅ | ✅ |

### 15.3 Data Security

| Data Type | At Rest | In Transit | Access Control |
|-----------|---------|------------|----------------|
| User credentials | AES-256 | TLS 1.3 | User only |
| API keys | AES-256 | TLS 1.3 | Tenant admin |
| MRV data | AES-256 | TLS 1.3 | Tenant + verifier |
| Registry credentials | HSM | TLS 1.3 | System only |
| Blockchain keys | HSM | HSM-to-HSM | Multi-sig |

---

## 16. Reliability & Resilience

### 16.1 Circuit Breaker Pattern

Applied to all external API calls:

| State | Behavior |
|-------|----------|
| **Closed** | Normal operation |
| **Open** | Fail fast, no calls (after 5 failures) |
| **Half-Open** | Test with single call (after 60s) |

### 16.2 Retry Policy

| Scenario | Strategy |
|----------|----------|
| Registry API timeout | Exponential backoff: 1s, 2s, 4s, 8s, 16s |
| NEAR RPC failure | Immediate retry × 3, then queue |
| Database connection | Connection pool with health check |
| Max retries exceeded | Dead Letter Queue + alert |

### 16.3 Dead Letter Queue Handling

```
┌─────────────────────────────────────────────────────────────────┐
│              DLQ PROCESSING                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Event fails processing                                         │
│         │                                                       │
│         ▼                                                       │
│  Retry with backoff (max 5 attempts)                            │
│         │                                                       │
│    ┌────┴────┐                                                  │
│    ▼         ▼                                                  │
│  Success   Failure                                              │
│    │         │                                                  │
│    ▼         ▼                                                  │
│  Done    Move to DLQ                                            │
│              │                                                  │
│              ▼                                                  │
│         Alert ops team                                          │
│              │                                                  │
│              ▼                                                  │
│         Manual review                                           │
│              │                                                  │
│         ┌────┴────┐                                             │
│         ▼         ▼                                             │
│       Reprocess  Discard                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 17. Disaster Recovery

### 17.1 Multi-Region Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              DISASTER RECOVERY TOPOLOGY                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRIMARY (us-east-1)              SECONDARY (eu-west-1)         │
│  ┌───────────────────┐            ┌───────────────────┐         │
│  │ Services (Active) │            │ Services (Standby)│         │
│  │ Database (Primary)│ ─────────► │ Database (Replica)│         │
│  │ Event Bus (Active)│ ─────────► │ Event Bus (Mirror)│         │
│  │ Redis (Primary)   │ ─────────► │ Redis (Replica)   │         │
│  └───────────────────┘            └───────────────────┘         │
│                                                                 │
│  RECOVERY OBJECTIVES                                            │
│  ├── RPO (Recovery Point): < 1 minute                           │
│  └── RTO (Recovery Time): < 15 minutes                          │
│                                                                 │
│  FAILOVER TRIGGER                                               │
│  ├── Automatic: Primary health check fails for 5 minutes        │
│  └── Manual: Ops team decision for planned maintenance          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 17.2 Backup Strategy

| Component | Backup Frequency | Retention | Location |
|-----------|------------------|-----------|----------|
| Database | Continuous + daily snapshot | 30 days | Cross-region S3 |
| Event Store | Continuous replication | 1 year | Cross-region S3 |
| IPFS Data | Triple redundancy | Permanent | IPFS + S3 + Arweave |
| Config/Secrets | Versioned | 90 days | Secrets Manager |

---

## 18. Monitoring & Observability

### 18.1 Key Metrics

| Category | Metrics |
|----------|---------|
| **Business** | Credits minted/day, retirements/day, total tonnage |
| **API** | Request rate, latency (p50/p95/p99), error rate |
| **Blockchain** | TX success rate, gas usage, finality time |
| **Registry** | API health per registry, sync delay |
| **Infrastructure** | CPU, memory, disk, network |

### 18.2 Service Level Objectives (SLOs)

| Service | SLO | Alert Threshold |
|---------|-----|-----------------|
| API availability | 99.9% | < 99.5% over 5 min |
| Mint latency | < 30 seconds | > 60 seconds average |
| Registry sync | < 5 minutes | > 15 minutes delay |
| Event processing | < 1 second | > 5 seconds average |
| Data availability | 99.99% | < 99.9% |

### 18.3 Alerting Tiers

| Tier | Examples | Response |
|------|----------|----------|
| **P1 Critical** | Service down, blockchain sync failed | Immediate page, 15 min response |
| **P2 High** | High latency, elevated errors | Page during business hours |
| **P3 Medium** | Degraded performance | Next business day |
| **P4 Low** | Unusual patterns | Review in weekly ops meeting |

---

## 19. Compliance & Audit

### 19.1 Compliance Requirements Matrix

| Requirement | Voluntary Market | EU ETS | California |
|-------------|-----------------|--------|------------|
| KYC/AML | Optional | Required | Required |
| Transaction limits | None | Regulated | Regulated |
| Reporting | Annual | Quarterly | Annual |
| Audit | Optional | Mandatory | Mandatory |
| Data retention | 7 years | 10 years | 10 years |

### 19.2 Audit Trail

All actions are logged with:

| Field | Purpose |
|-------|---------|
| Actor | Who performed the action |
| Tenant | Which organization |
| Action | What was done |
| Resource | What was affected |
| Timestamp | When (immutable) |
| IP Address | Where (for security) |
| Correlation ID | Link to related events |

### 19.3 GDPR Compliance

| Requirement | Implementation |
|-------------|----------------|
| Right to access | Data export API |
| Right to erasure | Anonymization (blockchain data remains) |
| Data portability | Standard export formats |
| Consent | Explicit opt-in for data processing |

---

## 20. API Design

### 20.1 API Versioning

| Version | Status | Support Until |
|---------|--------|---------------|
| v1 | Current | Ongoing |
| v2 | Planned | — |

### 20.2 Public API Endpoints

| Category | Endpoints |
|----------|-----------|
| **Auth** | `/auth/login`, `/auth/refresh`, `/auth/logout` |
| **Tenants** | `/tenants`, `/tenants/{id}` |
| **Users** | `/users`, `/users/{id}`, `/users/{id}/roles` |
| **Projects** | `/projects`, `/projects/{id}`, `/projects/{id}/mrv` |
| **Credits** | `/credits`, `/credits/{id}`, `/credits/{id}/retire` |
| **Batches** | `/batches`, `/batches/{id}` |
| **Verification** | `/verifications`, `/verifications/{id}/approve` |

### 20.3 Public Verification API

For external parties to verify credits:

| Endpoint | Purpose |
|----------|---------|
| `GET /public/credits/{token_id}` | Get credit metadata |
| `GET /public/verify/{mrv_hash}` | Verify hash exists |
| `GET /public/retirements/{token_id}` | Get retirement certificate |

---

## 21. Governance Model

### 21.1 Decision Hierarchy

| Level | Scope | Authority | Process |
|-------|-------|-----------|---------|
| **Level 1** | Daily ops | Engineering Team | Autonomous |
| **Level 2** | Platform changes | Product Council (3-of-5) | Weekly review |
| **Level 3** | Contract changes | Multi-sig (3-of-5) | 48h timelock |
| **Level 4** | Protocol changes | Stakeholder vote | 30-day notice |

### 21.2 Dispute Resolution

| Dispute Type | First Level | Escalation | SLA |
|--------------|-------------|------------|-----|
| Credit rejection | Support team | Dispute committee | 14 days |
| Verification dispute | Support team | Arbitration | 30 days |
| Ownership dispute | Automated | Arbitration | 7 days |
| Methodology dispute | Support team | Expert panel | 21 days |

---

## 22. Implementation Checklist

### Security
- [ ] Multi-sig configured for contract admin
- [ ] HSM for blockchain submitter keys
- [ ] Key rotation policies implemented
- [ ] Penetration testing completed
- [ ] Verifier governance model deployed

### Reliability
- [ ] Circuit breakers on all external APIs
- [ ] Dead letter queues configured
- [ ] Retry policies implemented
- [ ] Health checks on all services
- [ ] DR tested (failover drill)

### Data Integrity
- [ ] Cross-registry deduplication active
- [ ] IPFS pinning configured
- [ ] Backup storage active
- [ ] Event ordering verified
- [ ] Buffer pool mechanism active

### Multi-Tenancy
- [ ] RLS enabled on all tables
- [ ] Tenant isolation tested
- [ ] Per-tenant rate limiting
- [ ] Tenant-specific encryption (optional)

### Compliance
- [ ] Audit logging comprehensive
- [ ] KYC/AML integration ready
- [ ] Data retention configured
- [ ] GDPR compliance verified
- [ ] Terms of service in place

### Operations
- [ ] Monitoring dashboards deployed
- [ ] Alerting rules configured
- [ ] Runbooks documented
- [ ] Incident response plan ready

### Carbon Science
- [ ] Additionality checks implemented
- [ ] Buffer pool configured
- [ ] Reversal handling tested
- [ ] Leakage calculations validated
- [ ] Vintage/expiry rules active

### MRV Verification Framework
- [ ] 9-category verification checklist implemented
- [ ] Project setup validation automated
- [ ] Carbon accounting checks configured
- [ ] LCA assessment module active
- [ ] GHG statement validation tested
- [ ] Removal data quality checks automated
- [ ] Verifier onboarding process defined
- [ ] Verifier accreditation verified
- [ ] Conflict of interest checks implemented
- [ ] Verification report template configured
- [ ] Verification events integrated with event bus

---

## 23. Billing & Subscription

### 23.1 Subscription Plans

| Plan | Target | Credits/Month | API Calls/Month | Features |
|------|--------|---------------|-----------------|----------|
| **Starter** | Small projects | 1,000 | 10,000 | Basic MRV, 1 registry |
| **Professional** | Growing companies | 10,000 | 100,000 | All registries, batch ops |
| **Enterprise** | Large organizations | Unlimited | Unlimited | SSO, SLA, dedicated support |
| **Custom** | Special needs | Negotiated | Negotiated | Custom integrations |

### 23.2 Usage Metering

| Metric | Billing Model | Measured By |
|--------|---------------|-------------|
| Credits minted | Per credit fee | `blockchain.nft.minted.v1` events |
| Credits retired | Per credit fee | `blockchain.nft.retired.v1` events |
| API calls | Tiered pricing | API Gateway counter |
| Storage | Per GB/month | S3 + IPFS usage |
| Registry submissions | Pass-through | `registry.approved.v1` events |

### 23.3 Billing Event Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              BILLING EVENT INTEGRATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Billable Action Occurs                                         │
│         │                                                       │
│         ▼                                                       │
│  Service emits domain event                                     │
│  (e.g., blockchain.nft.minted.v1)                               │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────┐                        │
│  │     BILLING SERVICE (Subscriber)    │                        │
│  │                                     │                        │
│  │  1. Receives billable event         │                        │
│  │  2. Extracts tenant_id, quantity    │                        │
│  │  3. Updates usage ledger            │                        │
│  │  4. Checks quota limits             │                        │
│  │  5. Emits billing.usage.recorded.v1 │                        │
│  └─────────────────────────────────────┘                        │
│         │                                                       │
│    ┌────┴────┐                                                  │
│    ▼         ▼                                                  │
│  Within    Quota                                                │
│  Quota     Exceeded                                             │
│    │         │                                                  │
│    ▼         ▼                                                  │
│  Continue   billing.quota.exceeded.v1                           │
│             │                                                   │
│             ├── Block further actions                           │
│             ├── Notify tenant admin                             │
│             └── Offer upgrade path                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 23.4 Billing Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `billing.usage.recorded.v1` | Any billable action | tenant_id, metric, quantity, timestamp |
| `billing.quota.exceeded.v1` | Quota limit hit | tenant_id, metric, limit, current |
| `billing.invoice.generated.v1` | Monthly cycle | tenant_id, amount, line_items |
| `billing.payment.received.v1` | Payment processed | tenant_id, amount, method |
| `billing.payment.failed.v1` | Payment declined | tenant_id, reason, retry_at |

### 23.5 Tenant Status Based on Billing

| Status | Condition | Allowed Actions |
|--------|-----------|-----------------|
| **Active** | Paid & within quota | Full access |
| **Grace Period** | Payment overdue < 7 days | Full access, warnings |
| **Restricted** | Payment overdue 7-30 days | Read-only, no new credits |
| **Suspended** | Payment overdue > 30 days | Login only, data export |
| **Churned** | Cancelled or 90 days overdue | Data retained 30 days |

---

## 24. API Quotas & Rate Limiting

### 24.1 Rate Limit Tiers

| Plan | Requests/Second | Requests/Minute | Burst Limit |
|------|-----------------|-----------------|-------------|
| Starter | 10 | 300 | 50 |
| Professional | 50 | 1,500 | 200 |
| Enterprise | 200 | 6,000 | 1,000 |
| Custom | Negotiated | Negotiated | Negotiated |

### 24.2 Quota Types

| Quota | Scope | Reset Period | Enforcement |
|-------|-------|--------------|-------------|
| API rate limit | Per tenant | Rolling window | HTTP 429 |
| Monthly credits | Per tenant | Calendar month | Block minting |
| Monthly API calls | Per tenant | Calendar month | HTTP 429 |
| Concurrent requests | Per tenant | Real-time | Queue/reject |
| Batch size | Per request | Per request | HTTP 400 |

### 24.3 Rate Limit Response Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│              RATE LIMIT HANDLING                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Request arrives at API Gateway                                 │
│         │                                                       │
│         ▼                                                       │
│  Check Redis rate limit counter                                 │
│         │                                                       │
│    ┌────┴────┐                                                  │
│    ▼         ▼                                                  │
│  Under    Over                                                  │
│  Limit    Limit                                                 │
│    │         │                                                  │
│    ▼         ▼                                                  │
│  Process  Return HTTP 429                                       │
│  Request  │                                                     │
│           ├── X-RateLimit-Limit: 1000                           │
│           ├── X-RateLimit-Remaining: 0                          │
│           ├── X-RateLimit-Reset: 1702944000                     │
│           └── Retry-After: 60                                   │
│                                                                 │
│  BURST HANDLING:                                                │
│  • Token bucket algorithm                                       │
│  • Burst = 5x normal rate for 10 seconds                        │
│  • Then throttle to base rate                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 24.4 Quota Warning Events

| Threshold | Event | Action |
|-----------|-------|--------|
| 80% used | `quota.warning.v1` | Email notification |
| 90% used | `quota.critical.v1` | Dashboard alert, email |
| 100% used | `quota.exceeded.v1` | Block, notify, offer upgrade |

---

## 25. Feature Entitlements

### 25.1 Feature Matrix

| Feature | Starter | Professional | Enterprise |
|---------|---------|--------------|------------|
| Basic MRV submission | ✅ | ✅ | ✅ |
| Single registry | ✅ | ✅ | ✅ |
| Multiple registries | ❌ | ✅ | ✅ |
| Batch operations | ❌ | ✅ | ✅ |
| Credit fractionalization | ❌ | ✅ | ✅ |
| Custom webhooks | ❌ | ✅ | ✅ |
| SSO/SAML | ❌ | ❌ | ✅ |
| Dedicated support | ❌ | ❌ | ✅ |
| SLA guarantee | ❌ | ❌ | ✅ |
| Custom integrations | ❌ | ❌ | ✅ |
| White-label | ❌ | ❌ | ✅ |

### 25.2 Feature Flag System

```
┌─────────────────────────────────────────────────────────────────┐
│              FEATURE FLAG ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FEATURE FLAG SOURCES (Priority Order):                         │
│                                                                 │
│  1. Tenant Override (highest priority)                          │
│     └── Custom features for specific tenant                     │
│                                                                 │
│  2. Plan Entitlement                                            │
│     └── Features included in subscription plan                  │
│                                                                 │
│  3. Global Default (lowest priority)                            │
│     └── Platform-wide feature state                             │
│                                                                 │
│  EVALUATION:                                                    │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ Request with tenant_id + feature_name                 │      │
│  │         │                                             │      │
│  │         ▼                                             │      │
│  │ Check tenant_overrides table                          │      │
│  │         │                                             │      │
│  │    ┌────┴────┐                                        │      │
│  │  Found    Not Found                                   │      │
│  │    │         │                                        │      │
│  │    ▼         ▼                                        │      │
│  │ Return   Check plan_entitlements table                │      │
│  │ value         │                                       │      │
│  │          ┌────┴────┐                                  │      │
│  │        Found    Not Found                             │      │
│  │          │         │                                  │      │
│  │          ▼         ▼                                  │      │
│  │       Return   Return global default                  │      │
│  │       value                                           │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 25.3 Feature Flag Events

| Event | Trigger | Purpose |
|-------|---------|---------|
| `feature.enabled.v1` | Feature turned on | Audit, analytics |
| `feature.disabled.v1` | Feature turned off | Audit, analytics |
| `feature.access.denied.v1` | Unauthorized access attempt | Upsell opportunity |

---

## 26. Enterprise Authentication (SSO)

### 26.1 Supported Protocols

| Protocol | Use Case | Configuration |
|----------|----------|---------------|
| **SAML 2.0** | Enterprise IdP (Okta, Azure AD) | Per-tenant metadata |
| **OIDC** | Modern IdP integration | Per-tenant client config |
| **SCIM 2.0** | User provisioning | Directory sync |

### 26.2 SSO Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              SAML SSO FLOW                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User accesses platform                                      │
│         │                                                       │
│         ▼                                                       │
│  2. Check tenant SSO configuration                              │
│         │                                                       │
│    ┌────┴────┐                                                  │
│    ▼         ▼                                                  │
│  SSO       No SSO                                               │
│  Enabled   (Local Auth)                                         │
│    │                                                            │
│    ▼                                                            │
│  3. Redirect to IdP with SAML AuthnRequest                      │
│         │                                                       │
│         ▼                                                       │
│  4. User authenticates at IdP                                   │
│         │                                                       │
│         ▼                                                       │
│  5. IdP returns SAML Response to ACS endpoint                   │
│         │                                                       │
│         ▼                                                       │
│  6. Platform validates SAML assertion                           │
│         │                                                       │
│         ▼                                                       │
│  7. Create/update user from SAML attributes                     │
│         │                                                       │
│         ▼                                                       │
│  8. Issue platform JWT                                          │
│         │                                                       │
│         ▼                                                       │
│  9. Emit auth.sso.login.v1 event                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 26.3 SCIM Provisioning

| Operation | Trigger | Platform Action |
|-----------|---------|-----------------|
| Create User | IdP adds user to group | Create user, assign role |
| Update User | IdP updates attributes | Update user profile |
| Deactivate User | IdP removes from group | Suspend user, revoke sessions |
| Delete User | IdP deletes user | GDPR-compliant deletion |

### 26.4 SSO Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `auth.sso.login.v1` | SSO login success | tenant_id, user_id, idp_name |
| `auth.sso.failed.v1` | SSO login failure | tenant_id, error_code, idp_name |
| `auth.scim.user.created.v1` | SCIM provisioning | tenant_id, user_id, source_idp |
| `auth.scim.user.deactivated.v1` | SCIM deprovisioning | tenant_id, user_id |

---

## 27. Webhook System

### 27.1 Webhook Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| Endpoint URL | HTTPS endpoint to receive events | Required |
| Events | Which events to send | All |
| Secret | Signing key for verification | Auto-generated |
| Active | Enable/disable | true |
| Retry policy | Retry on failure | 3 attempts |

### 27.2 Webhook Delivery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              WEBHOOK DELIVERY SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Domain event occurs                                            │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────┐                        │
│  │     WEBHOOK SERVICE (Subscriber)    │                        │
│  │                                     │                        │
│  │  1. Filter: Does tenant have       │                        │
│  │     webhook for this event type?    │                        │
│  │                                     │                        │
│  │  2. Build payload with:             │                        │
│  │     • event_id                      │                        │
│  │     • event_type                    │                        │
│  │     • timestamp                     │                        │
│  │     • payload                       │                        │
│  │                                     │                        │
│  │  3. Sign with HMAC-SHA256           │                        │
│  │     X-Webhook-Signature header      │                        │
│  │                                     │                        │
│  │  4. POST to endpoint                │                        │
│  └─────────────────────────────────────┘                        │
│         │                                                       │
│    ┌────┴────┐                                                  │
│    ▼         ▼                                                  │
│  2xx      4xx/5xx/Timeout                                       │
│  Success  Failure                                               │
│    │         │                                                  │
│    ▼         ▼                                                  │
│  Record   Retry with exponential backoff                        │
│  success  │                                                     │
│           ├── Attempt 1: Immediate                              │
│           ├── Attempt 2: After 1 minute                         │
│           ├── Attempt 3: After 5 minutes                        │
│           └── After 3 failures: Mark failed, alert              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 27.3 Webhook Signature Verification

| Header | Purpose |
|--------|---------|
| `X-Webhook-Signature` | HMAC-SHA256(secret, payload) |
| `X-Webhook-Timestamp` | Request timestamp (replay protection) |
| `X-Webhook-ID` | Unique delivery ID (idempotency) |

### 27.4 Webhook Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `webhook.delivered.v1` | Successful delivery | webhook_id, event_id, response_time |
| `webhook.failed.v1` | All retries exhausted | webhook_id, event_id, error |
| `webhook.disabled.v1` | Auto-disabled (too many failures) | webhook_id, failure_count |

---

## 28. Schema Registry & Event Governance

### 28.1 Schema Registry Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              SCHEMA REGISTRY                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PURPOSE:                                                       │
│  • Single source of truth for event schemas                     │
│  • Enforce compatibility rules                                  │
│  • Enable schema evolution                                      │
│  • Support consumer/producer validation                         │
│                                                                 │
│  COMPONENTS:                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Schema Store (PostgreSQL)                              │    │
│  │  ├── event_type (e.g., mrv.approved.v1)                 │    │
│  │  ├── version (1, 2, 3...)                               │    │
│  │  ├── schema (JSON Schema)                               │    │
│  │  ├── status (draft, active, deprecated)                 │    │
│  │  └── compatibility_mode                                 │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  COMPATIBILITY MODES:                                           │
│  ┌─────────────────┬───────────────────────────────────────┐    │
│  │ Mode            │ Rule                                  │    │
│  ├─────────────────┼───────────────────────────────────────┤    │
│  │ BACKWARD        │ New schema can read old data          │    │
│  │ FORWARD         │ Old schema can read new data          │    │
│  │ FULL            │ Both backward and forward             │    │
│  │ NONE            │ No compatibility check (dangerous)    │    │
│  └─────────────────┴───────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 28.2 Schema Evolution Rules

| Change Type | Backward Compatible | Forward Compatible |
|-------------|--------------------|--------------------|
| Add optional field | ✅ | ✅ |
| Add required field | ❌ | ✅ (with default) |
| Remove optional field | ✅ | ❌ |
| Remove required field | ❌ | ❌ |
| Rename field | ❌ | ❌ |
| Change field type | ❌ | ❌ |

### 28.3 Event Version Migration

```
┌─────────────────────────────────────────────────────────────────┐
│              EVENT VERSION MIGRATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MIGRATION PATH: mrv.approved.v1 → mrv.approved.v2              │
│                                                                 │
│  PHASE 1: PREPARE (Week 1-2)                                    │
│  ├── Register v2 schema in registry                             │
│  ├── Update consumers to handle v1 AND v2                       │
│  └── Deploy updated consumers                                   │
│                                                                 │
│  PHASE 2: DUAL-PUBLISH (Week 3-4)                               │
│  ├── Producers emit both v1 and v2                              │
│  ├── Monitor consumer metrics                                   │
│  └── Verify v2 processing successful                            │
│                                                                 │
│  PHASE 3: V2-ONLY (Week 5-6)                                    │
│  ├── Producers emit v2 only                                     │
│  ├── Mark v1 as deprecated in registry                          │
│  └── Set deprecation date (90 days)                             │
│                                                                 │
│  PHASE 4: CLEANUP (After 90 days)                               │
│  ├── Remove v1 handling from consumers                          │
│  ├── Archive v1 schema                                          │
│  └── Document migration complete                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 28.4 Schema Validation

| Stage | Validation | Action on Failure |
|-------|------------|-------------------|
| Producer (publish) | Validate against registered schema | Reject event, log error |
| Event Bus | Optional schema validation | Pass-through or reject |
| Consumer (receive) | Validate against expected schema | DLQ + alert |

---

## 29. Saga & Compensation Patterns

### 29.1 Credit Issuance Saga

```
┌─────────────────────────────────────────────────────────────────┐
│              CREDIT ISSUANCE SAGA                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SAGA DEFINITION: credit.issuance                               │
│  TIMEOUT: 24 hours                                              │
│  COMPENSATION: Automatic rollback on failure                    │
│                                                                 │
│  STEPS:                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  STEP 1: MRV Approval                                   │    │
│  │  ├── Action: Verifier approves MRV                      │    │
│  │  ├── Success: mrv.approved.v1                           │    │
│  │  ├── Failure: mrv.rejected.v1                           │    │
│  │  └── Compensation: N/A (terminal)                       │    │
│  │                                                         │    │
│  │  STEP 2: Hash Creation                                  │    │
│  │  ├── Action: Generate canonical hash                    │    │
│  │  ├── Success: mrv.hash.created.v1                       │    │
│  │  ├── Failure: saga.step.failed.v1                       │    │
│  │  └── Compensation: Mark MRV as "hash_failed"            │    │
│  │                                                         │    │
│  │  STEP 3: Registry Submission                            │    │
│  │  ├── Action: Submit to registry                         │    │
│  │  ├── Success: registry.approved.v1                      │    │
│  │  ├── Failure: registry.rejected.v1                      │    │
│  │  └── Compensation: N/A (registry handles rollback)      │    │
│  │                                                         │    │
│  │  STEP 4: NFT Minting                                    │    │
│  │  ├── Action: Mint on NEAR                               │    │
│  │  ├── Success: blockchain.nft.minted.v1                  │    │
│  │  ├── Failure: blockchain.mint.failed.v1                 │    │
│  │  └── Compensation: Request registry cancellation        │    │
│  │                    Emit registry.cancel.requested.v1    │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  SAGA STATES:                                                   │
│  INITIATED → PROCESSING → COMPLETED | COMPENSATING → FAILED     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 29.2 Retirement Saga

```
┌─────────────────────────────────────────────────────────────────┐
│              RETIREMENT SAGA                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SAGA DEFINITION: credit.retirement                             │
│  TIMEOUT: 1 hour                                                │
│                                                                 │
│  STEPS:                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  STEP 1: Reserve in Registry                            │    │
│  │  ├── Action: Soft-lock credit in registry               │    │
│  │  ├── Success: registry.reserved.v1                      │    │
│  │  └── Compensation: N/A                                  │    │
│  │                                                         │    │
│  │  STEP 2: Retire On-Chain                                │    │
│  │  ├── Action: Call retire() on NEAR contract             │    │
│  │  ├── Success: blockchain.nft.retired.v1                 │    │
│  │  └── Compensation: registry.unreserve.requested.v1      │    │
│  │                                                         │    │
│  │  STEP 3: Confirm in Registry                            │    │
│  │  ├── Action: Finalize retirement in registry            │    │
│  │  ├── Success: registry.retired.v1                       │    │
│  │  └── Compensation: Retry indefinitely (NFT is retired)  │    │
│  │                    Alert ops after 3 failures           │    │
│  │                                                         │    │
│  │  STEP 4: Generate Certificate                           │    │
│  │  ├── Action: Create retirement certificate              │    │
│  │  ├── Success: certificate.generated.v1                  │    │
│  │  └── Compensation: Retry (non-critical)                 │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 29.3 Saga Coordinator Service

| Responsibility | Description |
|----------------|-------------|
| State tracking | Persist saga state per instance |
| Timeout handling | Trigger compensation after timeout |
| Retry logic | Retry failed steps with backoff |
| Compensation orchestration | Execute rollback in reverse order |
| Alerting | Notify on saga failure |

### 29.4 Saga Events

| Event | Trigger | Purpose |
|-------|---------|---------|
| `saga.started.v1` | Saga initiated | Audit, tracking |
| `saga.step.completed.v1` | Step succeeded | Progress tracking |
| `saga.step.failed.v1` | Step failed | Trigger compensation |
| `saga.compensating.v1` | Compensation started | Audit |
| `saga.completed.v1` | All steps done | Success notification |
| `saga.failed.v1` | Compensation complete | Failure notification |

---

## 30. Long-Running Process Tracking

### 30.1 Process Status Model

| Field | Description |
|-------|-------------|
| `process_id` | Unique identifier (UUID) |
| `process_type` | e.g., credit_issuance, batch_retirement |
| `tenant_id` | Owning tenant |
| `status` | pending, processing, completed, failed |
| `current_step` | Which step is active |
| `total_steps` | Total steps in process |
| `progress_percent` | Estimated completion |
| `started_at` | Timestamp |
| `estimated_completion` | ETA |
| `error` | Error details if failed |

### 30.2 Process Tracking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              PROCESS TRACKING ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  API Request (e.g., POST /credits/batch/mint)                   │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────┐                        │
│  │  1. Create Process Record           │                        │
│  │     status: PENDING                 │                        │
│  │     Return process_id immediately   │                        │
│  └─────────────────────────────────────┘                        │
│         │                                                       │
│         ▼                                                       │
│  Emit process.started.v1                                        │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────┐                        │
│  │  PROCESS SERVICE (Subscriber)       │                        │
│  │                                     │                        │
│  │  Listens to all step events:        │                        │
│  │  • mrv.approved.v1 → Update step 1  │                        │
│  │  • mrv.hash.created.v1 → Step 2     │                        │
│  │  • registry.approved.v1 → Step 3    │                        │
│  │  • blockchain.nft.minted.v1 → Done  │                        │
│  │                                     │                        │
│  │  Updates process record on each     │                        │
│  │  Emits process.progress.v1          │                        │
│  └─────────────────────────────────────┘                        │
│         │                                                       │
│         ▼                                                       │
│  Client polls GET /processes/{id}                               │
│  OR receives webhook process.completed.v1                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 30.3 Process Status API

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `GET /v1/processes/{id}` | Get process status | Full status object |
| `GET /v1/processes/{id}/steps` | Get step details | Array of steps with status |
| `GET /v1/processes?status=processing` | List active processes | Paginated list |
| `POST /v1/processes/{id}/cancel` | Cancel process | Triggers saga compensation |

### 30.4 Process Events

| Event | Trigger | Purpose |
|-------|---------|---------|
| `process.started.v1` | Process initiated | Webhook, audit |
| `process.progress.v1` | Step completed | Real-time updates |
| `process.completed.v1` | All steps done | Webhook notification |
| `process.failed.v1` | Process failed | Webhook, alert |
| `process.cancelled.v1` | User cancelled | Audit |

### 30.5 Timeout Handling

| Process Type | Timeout | On Timeout |
|--------------|---------|------------|
| Credit issuance | 24 hours | Cancel saga, notify user |
| Batch minting | 4 hours | Partial completion report |
| Retirement | 1 hour | Alert ops, manual review |
| Registry sync | 30 minutes | Retry or DLQ |

---

## 31. Event Replay & Recovery

### 31.1 Event Store Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              EVENT STORE                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PURPOSE:                                                       │
│  • Immutable log of all events                                  │
│  • Enable replay for recovery                                   │
│  • Support audit and compliance                                 │
│                                                                 │
│  STORAGE:                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  event_store table                                      │    │
│  │  ├── sequence_number (BIGSERIAL, global order)          │    │
│  │  ├── event_id (UUID, unique)                            │    │
│  │  ├── event_type (VARCHAR)                               │    │
│  │  ├── aggregate_id (VARCHAR, partition key)              │    │
│  │  ├── aggregate_version (INT)                            │    │
│  │  ├── tenant_id (UUID)                                   │    │
│  │  ├── payload (JSONB)                                    │    │
│  │  ├── metadata (JSONB)                                   │    │
│  │  ├── created_at (TIMESTAMP)                             │    │
│  │  └── INDEX on (tenant_id, event_type, created_at)       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  RETENTION:                                                     │
│  • Hot storage: 90 days (PostgreSQL)                            │
│  • Warm storage: 2 years (S3 Glacier)                           │
│  • Cold storage: 10 years (S3 Deep Archive)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 31.2 Replay Capabilities

| Replay Type | Use Case | Scope |
|-------------|----------|-------|
| Full replay | Rebuild read model | All events |
| Tenant replay | Tenant data recovery | Single tenant |
| Time-range replay | Point-in-time recovery | Date range |
| Event-type replay | Fix specific consumer | One event type |
| Aggregate replay | Rebuild single entity | One aggregate |

### 31.3 Replay Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              EVENT REPLAY FLOW                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Replay Request                                                 │
│  POST /admin/replay                                             │
│  {                                                              │
│    "type": "tenant",                                            │
│    "tenant_id": "xxx",                                          │
│    "from_sequence": 1000,                                       │
│    "to_sequence": 2000,                                         │
│    "target_consumers": ["credit-service"],                      │
│    "rate_limit": 100  // events per second                      │
│  }                                                              │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────┐                        │
│  │  REPLAY SERVICE                     │                        │
│  │                                     │                        │
│  │  1. Validate request                │                        │
│  │  2. Create replay job               │                        │
│  │  3. Query event store               │                        │
│  │  4. Emit events with replay flag    │                        │
│  │     (X-Replay: true header)         │                        │
│  │  5. Rate limit per config           │                        │
│  │  6. Track progress                  │                        │
│  └─────────────────────────────────────┘                        │
│         │                                                       │
│         ▼                                                       │
│  Consumers process with idempotency                             │
│  (Skip if event_id already processed)                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 31.4 Snapshot/Checkpoint

| Component | Snapshot Frequency | Purpose |
|-----------|-------------------|---------|
| Credit Service | Every 1000 events | Fast rebuild |
| Billing ledger | Daily | Billing accuracy |
| Process state | Per step | Resume capability |

---

## 32. Consumer Management

### 32.1 Consumer Groups

| Consumer Group | Services | Event Types |
|----------------|----------|-------------|
| `mrv-processors` | Verifier, Hashing | `mrv.*` |
| `registry-sync` | Registry Adapters | `mrv.hash.*`, `blockchain.nft.retired.*` |
| `blockchain-ops` | Submitter, Indexer | `registry.approved.*` |
| `notifications` | Notification Service | All user-facing events |
| `audit` | Audit Log Service | All events |
| `billing` | Billing Service | Billable events |

### 32.2 Consumer Health Monitoring

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| Consumer lag | > 1000 events | Scale up |
| Processing latency | > 5 seconds | Investigate |
| Error rate | > 1% | Alert ops |
| DLQ depth | > 100 | Manual review |
| Last heartbeat | > 60 seconds | Restart consumer |

### 32.3 Backpressure Handling

```
┌─────────────────────────────────────────────────────────────────┐
│              BACKPRESSURE STRATEGY                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRODUCER SIDE:                                                 │
│  ├── Monitor EventBridge delivery rate                          │
│  ├── If throttled: Queue locally, retry with backoff            │
│  └── Circuit breaker if sustained throttling                    │
│                                                                 │
│  CONSUMER SIDE:                                                 │
│  ├── Process in batches (configurable size)                     │
│  ├── Acknowledge only after successful processing               │
│  ├── If overwhelmed: Stop polling, process backlog              │
│  └── Auto-scale based on queue depth                            │
│                                                                 │
│  SYSTEM PROTECTION:                                             │
│  ├── Per-tenant event rate limits                               │
│  ├── Global event rate monitoring                               │
│  └── Circuit breaker on downstream services                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 33. API Idempotency

### 33.1 Idempotency Key Strategy

| Endpoint | Idempotency Required | Key Source |
|----------|---------------------|------------|
| `POST /credits` | Yes | `Idempotency-Key` header |
| `POST /credits/batch/mint` | Yes | `Idempotency-Key` header |
| `POST /credits/{id}/retire` | Yes | `Idempotency-Key` header |
| `POST /verifications/{id}/approve` | Yes | `Idempotency-Key` header |
| `GET /*` | No | N/A |
| `PUT /*` | Natural | Resource ID |
| `DELETE /*` | Natural | Resource ID |

### 33.2 Idempotency Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              IDEMPOTENCY HANDLING                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Request with Idempotency-Key: abc123                           │
│         │                                                       │
│         ▼                                                       │
│  Check idempotency cache (Redis)                                │
│         │                                                       │
│    ┌────┴────┐                                                  │
│    ▼         ▼                                                  │
│  Cache     Cache                                                │
│  Miss      Hit                                                  │
│    │         │                                                  │
│    ▼         ▼                                                  │
│  Process  Return cached response                                │
│  request  (same status, body, headers)                          │
│    │                                                            │
│    ▼                                                            │
│  Store in cache:                                                │
│  {                                                              │
│    key: "abc123",                                               │
│    status: 201,                                                 │
│    body: {...},                                                 │
│    ttl: 24 hours                                                │
│  }                                                              │
│    │                                                            │
│    ▼                                                            │
│  Return response                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 33.3 Idempotency Response Headers

| Header | Purpose |
|--------|---------|
| `Idempotency-Key` | Echo back the key |
| `X-Idempotent-Replayed` | true if cached response |
| `X-Request-Id` | Unique request ID for tracing |

---

## 34. Updated Implementation Checklist

### SaaS Operations
- [ ] Billing integration (Stripe/similar)
- [ ] Usage metering active
- [ ] Quota enforcement tested
- [ ] Feature flags configured per plan
- [ ] SSO/SAML for enterprise tenants
- [ ] SCIM provisioning tested
- [ ] Webhook delivery reliable
- [ ] Webhook signature verification documented

### Event-Driven Architecture
- [ ] Schema registry deployed
- [ ] Schema validation on producers
- [ ] Event versioning strategy documented
- [ ] Saga coordinator service deployed
- [ ] Compensation flows tested
- [ ] Process tracking API available
- [ ] Event replay capability tested
- [ ] Consumer lag monitoring active
- [ ] Backpressure handling verified
- [ ] API idempotency implemented

### Previously Defined
- [ ] Multi-sig for contract admin
- [ ] HSM for blockchain keys
- [ ] Circuit breakers configured
- [ ] DLQ monitoring active
- [ ] DR failover tested
- [ ] RLS enabled on all tables
- [ ] Audit logging comprehensive

---

## 35. Glossary

| Term | Definition |
|------|------------|
| **MRV** | Monitoring, Reporting, Verification |
| **tCO2e** | Tonnes of CO2 equivalent |
| **Vintage** | Year carbon removal occurred |
| **Buffer Pool** | Reserve credits for permanence risk |
| **Additionality** | Proof removal wouldn't happen anyway |
| **Leakage** | Carbon shifting to other locations |
| **Registry** | Authority that issues/tracks credits |
| **NFT** | Non-Fungible Token (unique credit) |
| **mrv_hash** | SHA-256 hash of canonical MRV payload |
| **Saga** | Long-running transaction with compensation |
| **Idempotency** | Same request = same result |
| **DLQ** | Dead Letter Queue for failed events |
| **RLS** | Row-Level Security for tenant isolation |
| **SCIM** | System for Cross-domain Identity Management |
| **LCA** | Life Cycle Assessment - full emissions analysis |
| **GHG** | Greenhouse Gas (CO2, CH4, N2O, etc.) |
| **Scope 1/2/3** | Direct, energy, and indirect emission categories |
| **Baseline** | Reference scenario without project intervention |
| **Verifier** | Accredited party that reviews MRV data |
| **Crediting Period** | Timeframe during which project can generate credits |

---

**End of Document**
