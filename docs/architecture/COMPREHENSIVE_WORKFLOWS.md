# DMRV Platform - Comprehensive Workflows

**Document Purpose**: End-to-end workflow documentation for presentations and technical onboarding

**Last Updated**: 2024-01-XX  
**Version**: 1.0  
**Audience**: Stakeholders, developers, verifiers, registry partners

---

## Table of Contents

1. [Overview](#1-overview)
2. [Actors & Roles](#2-actors--roles)
3. [Core Workflows](#3-core-workflows)
4. [Registry-First Approach](#4-registry-first-approach)
5. [Verification Workflow](#5-verification-workflow)
6. [Blockchain Integration Workflow](#6-blockchain-integration-workflow)
7. [Error Handling & Recovery](#7-error-handling--recovery)
8. [Multi-Registry Scenarios](#8-multi-registry-scenarios)

---

## 1. Overview

### 1.1 Platform Mission

The DMRV platform transforms carbon removal data into tradeable, verified carbon credit NFTs through a **registry-first**, **verification-driven** approach that ensures:

- **Integrity**: Cryptographic hashing ensures data immutability
- **Transparency**: All steps auditable and verifiable
- **Compliance**: Registry requirements met before issuance
- **Trust**: Independent verification at every stage

### 1.2 High-Level Process Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DMRV PLATFORM OVERVIEW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DATA SOURCES          PLATFORM SERVICES          BLOCKCHAIN/REGISTRY│
│  ┌──────────┐         ┌──────────────┐           ┌──────────┐      │
│  │ Sensors  │────────►│ MRV Engine   │──────────►│  NEAR    │      │
│  │ Labs     │         │ Verification │           │  NFTs    │      │
│  │Satellite │         │   Hashing    │           │          │      │
│  └──────────┘         └──────────────┘           └──────────┘      │
│                              │                          │           │
│                              ▼                          │           │
│                       ┌──────────────┐                  │           │
│                       │  Registries  │◄─────────────────┘           │
│                       │ (Verra/Puro) │                              │
│                       └──────────────┘                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.3 Key Milestones

| Milestone | Description | Output |
|-----------|-------------|--------|
| **Registry Selection** | Choose target registry + methodology | Requirements checklist |
| **Data Collection** | Gather evidence per registry requirements | MRV submission |
| **Computation** | Calculate tonnage using methodology | Computed results |
| **Verification** | Independent review (9 categories) | Verification report |
| **Hashing** | Create canonical hash | `mrv_hash` |
| **Registry Approval** | Submit to registry | Registry serial number |
| **NFT Minting** | Mint on NEAR blockchain | Token ID |
| **Active Trading** | Credit available for market | Tradeable asset |

---

## 2. Actors & Roles

### 2.1 Primary Actors

```
┌─────────────────────────────────────────────────────────────────┐
│                    ACTOR INTERACTION MAP                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TENANT ADMIN          PROJECT MANAGER         VERIFIER         │
│  ┌──────────┐         ┌──────────────┐        ┌──────────┐     │
│  │ Setup    │         │ Submit MRV   │        │ Review   │     │
│  │ Users    │────────►│ Data         │───────►│ Approve  │     │
│  │ Configure│         │ Track Status │        │ Reject   │     │
│  └──────────┘         └──────────────┘        └──────────┘     │
│       │                      │                      │           │
│       ▼                      ▼                      ▼           │
│  ┌──────────────────────────────────────────────────────┐       │
│  │            PLATFORM SERVICES                         │       │
│  └──────────────────────────────────────────────────────┘       │
│       │                      │                      │           │
│       ▼                      ▼                      ▼           │
│  REGISTRY              BLOCKCHAIN              MARKETPLACE      │
│  OPERATOR              ORACLE                  PARTICIPANT      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Role Definitions

| Role | Responsibilities | Access Level |
|------|------------------|--------------|
| **Tenant Admin** | Manage organization settings, users, billing | Full tenant access |
| **Project Manager** | Create projects, submit MRV data, track credits | Project-level access |
| **MRV Analyst** | Data entry, evidence upload, initial validation | Data submission only |
| **Verifier** | Independent review of MRV submissions | Verification access |
| **Registry Operator** | Approve/reject registry submissions | External partner |
| **Blockchain Oracle** | Monitor on-chain events | System service |
| **Credit Owner** | Buy, sell, retire credits | Wallet-based |

---

## 3. Core Workflows

### 3.1 Complete Credit Issuance Workflow

**Duration**: 4-8 weeks (typical)  
**Participants**: Tenant, Verifier, Registry, Platform  
**Outcome**: NFT minted on NEAR blockchain

```
┌─────────────────────────────────────────────────────────────────────┐
│         COMPLETE CREDIT ISSUANCE WORKFLOW (END-TO-END)             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  WEEK 1-2: SETUP & PLANNING                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Tenant creates project                                    │   │
│  │ 2. Select target registry (Verra/Puro/Isometric)             │   │
│  │ 3. Choose methodology (e.g., VM0042 for Verra)               │   │
│  │ 4. Platform loads registry requirements                      │   │
│  │ 5. Gap analysis shows missing evidence/data                  │   │
│  │ 6. Project manager plans data collection                     │   │
│  │                                                              │   │
│  │ EVENT: mrv.registry.selected.v1                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                          ▼                                          │
│  WEEK 2-3: DATA COLLECTION                                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Deploy sensors/measurement equipment                      │   │
│  │ 2. Collect monitoring data (6-12 months typical)             │   │
│  │ 3. Upload evidence artifacts:                                │   │
│  │    - Sensor calibration certificates                         │   │
│  │    - Lab analysis reports                                    │   │
│  │    - QA/QC procedures                                        │   │
│  │    - Baseline assessments                                    │   │
│  │ 4. Validate against registry schema                          │   │
│  │ 5. Store in platform (PostgreSQL + S3)                       │   │
│  │                                                              │   │
│  │ STATUS: MRV Submission = "received"                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                          ▼                                          │
│  WEEK 3-4: COMPUTATION                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. MRV Engine selects registry-specific calculator           │   │
│  │ 2. Apply methodology formulas:                               │   │
│  │    - Calculate baseline emissions                            │   │
│  │    - Calculate project emissions                             │   │
│  │    - Calculate gross removal                                 │   │
│  │    - Apply leakage deduction (e.g., 5%)                      │   │
│  │    - Apply buffer deduction (e.g., 15%)                      │   │
│  │ 3. Compute net tonnage (tCO2e)                                │   │
│  │ 4. Generate computation report                               │   │
│  │ 5. Store results in mrv.mrv_computations table               │   │
│  │                                                              │   │
│  │ EVENT: mrv.computed.v1                                       │   │
│  │ STATUS: MRV Submission = "computed"                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                          ▼                                          │
│  WEEK 4-6: VERIFICATION (Critical Phase)                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Assign accredited verifier                                │   │
│  │ 2. Verifier reviews 9 categories:                            │   │
│  │    ✓ Project Setup                                           │   │
│  │    ✓ General (Additionality, etc.)                           │   │
│  │    ✓ Project Design                                          │   │
│  │    ✓ Facilities                                              │   │
│  │    ✓ Carbon Accounting                                       │   │
│  │    ✓ Life Cycle Assessment (LCA)                             │   │
│  │    ✓ Project Emissions                                       │   │
│  │    ✓ GHG Statements                                          │   │
│  │    ✓ Removal Data                                            │   │
│  │ 3. Verifier may request clarifications                       │   │
│  │ 4. Project manager responds                                  │   │
│  │ 5. Verifier approves or rejects                              │   │
│  │ 6. Generate verification report with signature               │   │
│  │                                                              │   │
│  │ EVENT: verification.completed.v1                             │   │
│  │ EVENT: mrv.approved.v1 (if passed) or mrv.rejected.v1        │   │
│  │ STATUS: MRV Submission = "approved" or "rejected"            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                          ▼                                          │
│  WEEK 6: CANONICAL HASHING                                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Hashing Service constructs canonical payload:             │   │
│  │    {                                                         │   │
│  │      registry: "verra",                                      │   │
│  │      methodology: "VM0042",                                  │   │
│  │      computed_tonnage: 969,                                  │   │
│  │      verification_report_hash: "sha256:...",                 │   │
│  │      evidence_hash: "sha256:...",                            │   │
│  │      ...                                                     │   │
│  │    }                                                         │   │
│  │ 2. Sort keys alphabetically                                  │   │
│  │ 3. Generate SHA-256 hash → mrv_hash                          │   │
│  │ 4. Store in hashing.mrv_hashes table                         │   │
│  │ 5. Check global evidence registry for duplicates             │   │
│  │                                                              │   │
│  │ EVENT: mrv.hash.created.v1                                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                          ▼                                          │
│  WEEK 6-7: REGISTRY SUBMISSION                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Registry Adapter transforms payload                       │   │
│  │ 2. Submit to registry API (e.g., Verra API)                  │   │
│  │ 3. Registry validates submission                             │   │
│  │ 4. Registry issues serial number                             │   │
│  │ 5. Store registry_submissions record                         │   │
│  │                                                              │   │
│  │ EVENT: registry.approved.v1                                  │   │
│  │ ARTIFACT: Registry serial number                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                          ▼                                          │
│  WEEK 7-8: NFT MINTING                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Blockchain Submitter receives registry approval           │   │
│  │ 2. Construct NFT metadata:                                   │   │
│  │    - mrv_hash                                                │   │
│  │    - registry_serial                                         │   │
│  │    - tonnage_co2e                                            │   │
│  │    - vintage year                                            │   │
│  │ 3. Call NEAR smart contract mint() function                  │   │
│  │ 4. Wait for blockchain confirmation (~3 seconds)             │   │
│  │ 5. NEAR Indexer detects mint event                           │   │
│  │ 6. Update credit.credits table with token_id                 │   │
│  │                                                              │   │
│  │ EVENT: blockchain.nft.minted.v1                              │   │
│  │ STATUS: Credit = "active"                                    │   │
│  │ OUTCOME: ✅ NFT ISSUED                                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                          ▼                                          │
│  ONGOING: CREDIT LIFECYCLE                                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Transfer to buyers                                         │   │
│  │ • Trade on marketplace                                       │   │
│  │ • Fractional splitting                                       │   │
│  │ • Retirement for carbon offsetting                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Step-by-Step Breakdown

#### Step 1: Project Creation & Registry Selection

**Actors**: Tenant Admin, Project Manager  
**Duration**: 1-2 days  
**Criticality**: ⭐⭐⭐⭐⭐ (Determines entire process)

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: PROJECT SETUP                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USER ACTION                     SYSTEM RESPONSE            │
│  ┌────────────────┐             ┌─────────────────────┐    │
│  │ 1. Navigate to │             │ Display project     │    │
│  │    Projects    │────────────►│ creation form       │    │
│  └────────────────┘             └─────────────────────┘    │
│         │                                │                 │
│         ▼                                ▼                 │
│  ┌────────────────┐             ┌─────────────────────┐    │
│  │ 2. Enter       │             │ Validate fields     │    │
│  │    Details:    │────────────►│ Check tenant quota  │    │
│  │    - Name      │             └─────────────────────┘    │
│  │    - Location  │                      │                 │
│  │    - Type      │                      ▼                 │
│  └────────────────┘             ┌─────────────────────┐    │
│         │                       │ Load registries     │    │
│         ▼                       │ compatible with     │    │
│  ┌────────────────┐             │ project type        │    │
│  │ 3. Select      │             └─────────────────────┘    │
│  │    Registry:   │                      │                 │
│  │    ○ Verra     │◄─────────────────────┘                 │
│  │    ○ Puro      │                                        │
│  │    ○ Isometric │                                        │
│  └────────────────┘                                        │
│         │                                                  │
│         ▼                                                  │
│  ┌────────────────┐             ┌─────────────────────┐    │
│  │ 4. Choose      │             │ Load methodology    │    │
│  │    Methodology │────────────►│ requirements        │    │
│  │    (e.g.,      │             │ Generate checklist  │    │
│  │    VM0042)     │             └─────────────────────┘    │
│  └────────────────┘                      │                 │
│         │                                ▼                 │
│         │                       ┌─────────────────────┐    │
│         │                       │ Run gap analysis    │    │
│         │                       │ Show: 0% complete   │    │
│         │                       │ Missing: X fields   │    │
│         │                       │ Missing: Y evidence │    │
│         │                       └─────────────────────┘    │
│         │                                │                 │
│         ▼                                ▼                 │
│  ┌────────────────┐             ┌─────────────────────┐    │
│  │ 5. Review gap  │             │ Create project      │    │
│  │    analysis &  │────────────►│ Set status: SETUP   │    │
│  │    Submit      │             │ Emit event          │    │
│  └────────────────┘             └─────────────────────┘    │
│                                                             │
│  OUTCOME:                                                   │
│  ✅ Project created                                         │
│  ✅ Registry requirements loaded                            │
│  ✅ Gap analysis available                                  │
│  ✅ Ready for data collection                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**API Call:**
```typescript
POST /api/v1/projects
{
  "name": "Forest Carbon Removal Project",
  "project_type": "forestry",
  "location": { "lat": 45.5, "lon": -122.6 },
  "target_registry": "verra",
  "methodology_code": "VM0042",
  "methodology_version": "v2.0"
}
```

**Response:**
```json
{
  "project_id": "prj_abc123",
  "status": "setup",
  "target_registry": "verra",
  "gap_analysis": {
    "completeness_score": 0,
    "missing_required_fields": 45,
    "missing_evidence_types": ["calibration_certificates", "qa_qc_procedures", ...]
  }
}
```

---

#### Step 2: Data Collection & MRV Submission

**Actors**: Project Manager, MRV Analyst, IoT Sensors  
**Duration**: Ongoing (6-12 months typical monitoring period)  
**Criticality**: ⭐⭐⭐⭐⭐

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: DATA COLLECTION                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DATA SOURCES          INGESTION          STORAGE           │
│  ┌──────────────┐     ┌──────────┐      ┌──────────┐       │
│  │ IoT Sensors  │────►│Validation│─────►│PostgreSQL│       │
│  │ (Continuous) │     │ Against  │      │  (JSONB) │       │
│  └──────────────┘     │ Schema   │      └──────────┘       │
│         │             └──────────┘            │            │
│         │                    │                │            │
│  ┌──────────────┐           │                │            │
│  │ Lab Reports  │───────────┤                │            │
│  │ (Periodic)   │           │                │            │
│  └──────────────┘           ▼                ▼            │
│         │             ┌──────────┐      ┌──────────┐       │
│         │             │  Check   │      │   S3     │       │
│  ┌──────────────┐     │  Gap     │      │(Evidence │       │
│  │ Satellite    │────►│ Analysis │      │ Files)   │       │
│  │ Imagery      │     └──────────┘      └──────────┘       │
│  └──────────────┘            │                             │
│                              ▼                             │
│                        Update Progress                     │
│                        25% → 50% → 75% → 100%              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Data Submission Flow:**

1. **Sensor Data Upload (Automated)**
   ```typescript
   POST /api/v1/projects/{project_id}/mrv/sensor-data
   {
     "monitoring_period_start": "2024-01-01T00:00:00Z",
     "monitoring_period_end": "2024-01-31T23:59:59Z",
     "readings": [
       { "timestamp": "2024-01-01T12:00:00Z", "co2_removed": 100.5 },
       { "timestamp": "2024-01-02T12:00:00Z", "co2_removed": 102.3 },
       ...
     ]
   }
   ```

2. **Evidence Artifact Upload**
   ```typescript
   POST /api/v1/projects/{project_id}/mrv/evidence
   Content-Type: multipart/form-data
   
   Files:
   - calibration_certificate.pdf
   - qa_qc_procedures.pdf
   - baseline_assessment.pdf
   ```

3. **Gap Analysis Check**
   ```typescript
   GET /api/v1/projects/{project_id}/mrv/gap-analysis
   
   Response:
   {
     "completeness_score": 78,
     "can_proceed_to_computation": false,
     "missing_required_fields": [
       "leakage.assessment",
       "buffer_pool.calculation"
     ],
     "missing_evidence_types": ["qa_qc_procedures"]
   }
   ```

---

#### Step 3: MRV Computation

**Actors**: MRV Engine (Automated)  
**Duration**: < 1 minute  
**Criticality**: ⭐⭐⭐⭐⭐

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: MRV COMPUTATION ENGINE                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INPUT: MRV Submission (raw data + evidence)                │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. SELECT REGISTRY-SPECIFIC CALCULATOR               │   │
│  │                                                      │   │
│  │    if (registry === 'verra') {                       │   │
│  │      calculator = new VerraCalculator(methodology);  │   │
│  │    } else if (registry === 'puro') {                 │   │
│  │      calculator = new PuroCalculator(methodology);   │   │
│  │    }                                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 2. BASELINE EMISSIONS CALCULATION                     │   │
│  │                                                      │   │
│  │    baseline_emissions = calculate_baseline({         │   │
│  │      historical_data,                               │   │
│  │      project_boundaries,                            │   │
│  │      counterfactual_scenario                        │   │
│  │    });                                              │   │
│  │                                                      │   │
│  │    Result: 100 tCO2e                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 3. PROJECT EMISSIONS CALCULATION                      │   │
│  │                                                      │   │
│  │    project_emissions = calculate_project_emissions({ │   │
│  │      scope_1: direct_emissions,                     │   │
│  │      scope_2: electricity_consumption,              │   │
│  │      scope_3: transport_supply_chain                │   │
│  │    });                                              │   │
│  │                                                      │   │
│  │    Result: 50 tCO2e                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 4. GROSS REMOVAL CALCULATION                          │   │
│  │                                                      │   │
│  │    gross_removal = calculate_gross_removal({         │   │
│  │      sensor_measurements,                           │   │
│  │      monitoring_period,                             │   │
│  │      methodology_formulas                           │   │
│  │    });                                              │   │
│  │                                                      │   │
│  │    Result: 1200 tCO2e                                │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 5. LEAKAGE DEDUCTION                                  │   │
│  │                                                      │   │
│  │    leakage = gross_removal * leakage_factor;         │   │
│  │             = 1200 * 0.05                            │   │
│  │             = 60 tCO2e                               │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 6. BUFFER CONTRIBUTION                                │   │
│  │                                                      │   │
│  │    buffer = (gross_removal - leakage) * buffer_rate; │   │
│  │           = (1200 - 60) * 0.15                       │   │
│  │           = 171 tCO2e                                │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 7. NET TONNAGE (FINAL RESULT)                         │   │
│  │                                                      │   │
│  │    net_removal = gross_removal                       │   │
│  │                  - leakage                           │   │
│  │                  - buffer                            │   │
│  │                = 1200 - 60 - 171                     │   │
│  │                = 969 tCO2e                           │   │
│  │                                                      │   │
│  │    ✅ COMPUTATION COMPLETE                           │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  STORE IN DATABASE: mrv.mrv_computations                    │
│  EMIT EVENT: mrv.computed.v1                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Database Record:**
```sql
INSERT INTO mrv.mrv_computations (
  mrv_submission_id,
  target_registry,
  methodology_code,
  computed_tonnage,
  computed_payload
) VALUES (
  'mrv_sub_123',
  'verra',
  'VM0042',
  969.0,
  '{
    "gross_removal": 1200.0,
    "baseline_emissions": 100.0,
    "project_emissions": 50.0,
    "leakage_deduction": 60.0,
    "leakage_factor": 0.05,
    "buffer_deduction": 171.0,
    "buffer_rate": 0.15,
    "net_removal": 969.0,
    "uncertainty_lower": 920.0,
    "uncertainty_upper": 1018.0
  }'::jsonb
);
```

---

_(Continued in next sections due to length...)_

## 4. Registry-First Approach

### 4.1 Why Registry Selection Matters

Different registries have **fundamentally different requirements**:

| Aspect | Verra (VCS) | Puro.earth | Isometric |
|--------|-------------|------------|-----------|
| **Evidence Focus** | QA/QC procedures, calibration | Lab analysis, permanence | Sensor specs, data quality |
| **Calculation Method** | VCS methodology formulas | Puro-specific formulas | Isometric protocol |
| **Buffer Rate** | 15-25% (risk-based) | 10-20% | 5-15% |
| **Verification** | 9-category checklist | Custom checklist | Protocol compliance |
| **Leakage** | Required assessment | Not always required | Simplified |

**Implication**: Same raw data → different computations → different hashes → different credits

### 4.2 Registry Requirements Catalog

```typescript
interface RegistryRequirement {
  registry_id: 'verra' | 'puro' | 'isometric';
  methodology_code: string;
  methodology_version: string;
  
  required_fields: {
    [json_path: string]: {
      type: 'string' | 'number' | 'boolean' | 'object' | 'array';
      required: boolean;
      validation_rules?: {
        min?: number;
        max?: number;
        pattern?: string;
        enum?: any[];
      };
    };
  };
  
  required_evidence_types: string[];
  recommended_fields: string[];
  conditional_requirements: Array<{
    condition: { field: string; value: any };
    then_required: string[];
  }>;
}
```

### 4.3 Gap Analysis Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  GAP ANALYSIS: CHECK ALL REGISTRIES                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INPUT: Available MRV Data                                  │
│         │                                                   │
│         ├──────┬──────────┬──────────┐                      │
│         ▼      ▼          ▼          ▼                      │
│     ┌─────┐ ┌─────┐  ┌──────┐  ┌────────┐                 │
│     │Verra│ │Puro │  │Isomet│  │EU ETS │                  │
│     │Check│ │Check│  │Check │  │Check  │                  │
│     └─────┘ └─────┘  └──────┘  └────────┘                 │
│         │      │          │          │                      │
│         ▼      ▼          ▼          ▼                      │
│      78%    45%       30%       10%                         │
│    Complete Complete Complete Complete                      │
│         │      │          │          │                      │
│         ▼      ▼          ▼          ▼                      │
│  Missing:  Missing:  Missing:  Missing:                     │
│  - QA/QC   - Lab     - Sensor   - Govt                      │
│  - Leakage - Perm.   - Quality  - Forms                     │
│                                                             │
│  RECOMMENDATION: Verra (closest to complete)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Verification Workflow

### 5.1 9-Category Verification Process

**Purpose**: Independent validation before registry submission  
**Duration**: 2-4 weeks  
**Outcome**: Approved or Rejected with findings

```
┌─────────────────────────────────────────────────────────────┐
│  VERIFICATION: 9-CATEGORY CHECKLIST                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CATEGORY 1: PROJECT SETUP                    [✓] PASSED   │
│  ├─ Project registration complete                          │
│  ├─ Legal entity verified                                  │
│  ├─ Project boundaries defined                             │
│  └─ Crediting period valid                                 │
│                                                             │
│  CATEGORY 2: GENERAL                          [✓] PASSED   │
│  ├─ Additionality demonstrated                             │
│  ├─ Regulatory surplus confirmed                           │
│  ├─ No double-counting                                     │
│  └─ Stakeholder consultation complete                      │
│                                                             │
│  CATEGORY 3: PROJECT DESIGN                   [✓] PASSED   │
│  ├─ Technology selection appropriate                       │
│  ├─ Baseline scenario credible                             │
│  ├─ Monitoring plan adequate                               │
│  └─ QA/QC procedures defined                               │
│                                                             │
│  CATEGORY 4: FACILITIES                       [✓] PASSED   │
│  ├─ Site location accurate                                 │
│  ├─ Site ownership verified                                │
│  ├─ Equipment specifications documented                    │
│  └─ Operational capacity matches claims                    │
│                                                             │
│  CATEGORY 5: CARBON ACCOUNTING                [!] MINOR    │
│  ├─ Calculation methodology correct                        │
│  ├─ Emission factors appropriate                           │
│  ├─ Activity data accurate                                 │
│  └─ ⚠️ Update uncertainty analysis (non-blocking)          │
│                                                             │
│  CATEGORY 6: LIFE CYCLE ASSESSMENT            [✓] PASSED   │
│  ├─ System boundaries clear                                │
│  ├─ Upstream emissions included                            │
│  ├─ Operational emissions included                         │
│  └─ Net removal positive                                   │
│                                                             │
│  CATEGORY 7: PROJECT EMISSIONS                [✓] PASSED   │
│  ├─ Scope 1 emissions quantified                           │
│  ├─ Scope 2 emissions quantified                           │
│  ├─ Scope 3 emissions estimated                            │
│  └─ All material sources identified                        │
│                                                             │
│  CATEGORY 8: GHG STATEMENTS                   [✓] PASSED   │
│  ├─ Gross removal accurate                                 │
│  ├─ Leakage deduction applied                              │
│  ├─ Buffer deduction applied                               │
│  └─ Net removal calculation correct                        │
│                                                             │
│  CATEGORY 9: REMOVAL DATA                     [✓] PASSED   │
│  ├─ Measurement methodology approved                       │
│  ├─ Instrument calibration current                         │
│  ├─ Data completeness verified                             │
│  └─ Data quality acceptable                                │
│                                                             │
│  ════════════════════════════════════════════               │
│  OVERALL RESULT: ✅ APPROVED WITH MINOR COMMENTS            │
│  Verified Tonnage: 969 tCO2e                                │
│  ════════════════════════════════════════════               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Verification Status Flow

```
┌─────────────────────────────────────────────────────────────┐
│  VERIFICATION STATE MACHINE                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STARTED                                                    │
│     │                                                       │
│     ▼                                                       │
│  IN_PROGRESS ──────────────► CLARIFICATION_REQUIRED        │
│     │                              │                        │
│     │                              ▼                        │
│     │              Project responds with clarification      │
│     │                              │                        │
│     ◄──────────────────────────────┘                        │
│     │                                                       │
│     ▼                                                       │
│  COMPLETED                                                  │
│     │                                                       │
│     ├────► APPROVED (All categories passed)                │
│     │         │                                             │
│     │         └──► Generate mrv_hash                        │
│     │                                                       │
│     └────► REJECTED (Any category failed)                  │
│               │                                             │
│               └──► Return findings to project               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Blockchain Integration Workflow

### 6.1 NEAR NFT Minting Process

```
┌─────────────────────────────────────────────────────────────┐
│  NFT MINTING ON NEAR BLOCKCHAIN                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TRIGGER: Registry approval received                        │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ BLOCKCHAIN SUBMITTER SERVICE                         │   │
│  │                                                      │   │
│  │ 1. Receive registry.approved.v1 event                │   │
│  │ 2. Fetch MRV data:                                   │   │
│  │    - mrv_hash                                        │   │
│  │    - registry_serial                                 │   │
│  │    - tonnage_co2e                                    │   │
│  │    - methodology                                     │   │
│  │    - vintage                                         │   │
│  │ 3. Construct NFT metadata                            │   │
│  │ 4. Sign transaction with HSM key                     │   │
│  │ 5. Call smart contract:                              │   │
│  │    contract.mint({                                   │   │
│  │      token_id: "token_12345",                        │   │
│  │      metadata: {...},                                │   │
│  │      owner_id: tenant_wallet                         │   │
│  │    })                                                │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ NEAR BLOCKCHAIN                                      │   │
│  │                                                      │   │
│  │ 1. Transaction submitted to RPC                      │   │
│  │ 2. Transaction included in block                     │   │
│  │ 3. Smart contract executes mint()                    │   │
│  │ 4. Validation checks:                                │   │
│  │    ✓ Authority (only submitter can mint)            │   │
│  │    ✓ No duplicate mrv_hash                           │   │
│  │    ✓ Valid metadata format                           │   │
│  │ 5. NFT created and assigned to owner                 │   │
│  │ 6. Event emitted: nft_mint                           │   │
│  │                                                      │   │
│  │ ⏱️ Confirmation time: ~3 seconds                     │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ NEAR INDEXER SERVICE                                 │   │
│  │                                                      │   │
│  │ 1. Listen for blockchain events                      │   │
│  │ 2. Detect nft_mint event                             │   │
│  │ 3. Parse event data                                  │   │
│  │ 4. Emit platform event:                              │   │
│  │    blockchain.nft.minted.v1                          │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ CREDIT SERVICE                                       │   │
│  │                                                      │   │
│  │ 1. Receive blockchain.nft.minted.v1                  │   │
│  │ 2. Update credit.credits table:                      │   │
│  │    - Set token_id                                    │   │
│  │    - Set status = "active"                           │   │
│  │    - Set issuance_date                               │   │
│  │ 3. Create credit_ownership record                    │   │
│  │ 4. Notify tenant (email/webhook)                     │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ✅ NFT MINTED - Credit is now tradeable                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 NFT Metadata Structure

```json
{
  "token_id": "credit_verra_vm0042_12345",
  "mrv_hash": "sha256:a1b2c3d4e5f6...",
  "evidence_hash": "sha256:f6e5d4c3b2a1...",
  "registry_id": "verra",
  "registry_serial": "VCS-12345-2024",
  "project_id": "prj_abc123",
  "project_name": "Forest Carbon Removal Project",
  "vintage": 2024,
  "methodology": {
    "code": "VM0042",
    "version": "v2.0",
    "name": "Methodology for Improved Agricultural Land Management"
  },
  "tonnage_co2e": 969.0,
  "gross_removal": 1200.0,
  "leakage_deduction": 60.0,
  "buffer_contribution": 171.0,
  "verification": {
    "verifier_id": "verifier_john_smith",
    "verification_date": "2024-06-15T10:30:00Z",
    "report_hash": "sha256:9876543210..."
  },
  "mrv_report_uri": "ipfs://QmXyZ123...",
  "status": "active",
  "created_at": "2024-07-01T14:00:00Z"
}
```

---

## 7. Error Handling & Recovery

### 7.1 Common Failure Scenarios

```
┌─────────────────────────────────────────────────────────────┐
│  ERROR HANDLING MATRIX                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SCENARIO 1: Verification Rejection                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Verifier rejects MRV submission                    │     │
│  │   ↓                                                │     │
│  │ Emit: mrv.rejected.v1                              │     │
│  │   ↓                                                │     │
│  │ Status: MRV = "rejected"                           │     │
│  │   ↓                                                │     │
│  │ Action: Notify project manager with findings      │     │
│  │   ↓                                                │     │
│  │ Project corrects issues and resubmits              │     │
│  │   ↓                                                │     │
│  │ New verification cycle starts                      │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  SCENARIO 2: Registry API Failure                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Registry API returns 500 error                     │     │
│  │   ↓                                                │     │
│  │ Circuit breaker opens                              │     │
│  │   ↓                                                │     │
│  │ Retry with exponential backoff:                    │     │
│  │   - Attempt 1: After 1 second                      │     │
│  │   - Attempt 2: After 2 seconds                     │     │
│  │   - Attempt 3: After 4 seconds                     │     │
│  │   - Attempt 4: After 8 seconds                     │     │
│  │   - Attempt 5: After 16 seconds                    │     │
│  │   ↓                                                │     │
│  │ If all retries fail:                               │     │
│  │   - Move to Dead Letter Queue                      │     │
│  │   - Alert operations team                          │     │
│  │   - Manual review required                         │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  SCENARIO 3: Blockchain Transaction Failure                │
│  ┌────────────────────────────────────────────────────┐     │
│  │ NEAR transaction fails (gas/network)               │     │
│  │   ↓                                                │     │
│  │ Emit: blockchain.mint.failed.v1                    │     │
│  │   ↓                                                │     │
│  │ Saga compensation triggered                        │     │
│  │   ↓                                                │     │
│  │ Request registry cancellation (if applicable)      │     │
│  │   ↓                                                │     │
│  │ Update credit status to "mint_failed"              │     │
│  │   ↓                                                │     │
│  │ Notify tenant                                      │     │
│  │   ↓                                                │     │
│  │ Manual resolution: retry or refund                 │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  SCENARIO 4: Duplicate Hash Detection                      │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Same evidence_hash found in different registry     │     │
│  │   ↓                                                │     │
│  │ Check: Same tenant or different tenant?            │     │
│  │   ↓                                                │     │
│  │ If same tenant:                                    │     │
│  │   - Warning: "Already submitted to Registry X"    │     │
│  │   - Allow with explicit confirmation               │     │
│  │   ↓                                                │     │
│  │ If different tenant:                               │     │
│  │   - REJECT: Potential double-counting fraud       │     │
│  │   - Flag for manual review                         │     │
│  │   - Alert compliance team                          │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Saga Pattern for Credit Issuance

```
┌─────────────────────────────────────────────────────────────┐
│  CREDIT ISSUANCE SAGA (with Compensation)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STEP 1: MRV Approval                                       │
│  ├─ Action: Verification approved                           │
│  ├─ Success: mrv.approved.v1                                │
│  ├─ Failure: mrv.rejected.v1                                │
│  └─ Compensation: N/A (terminal state)                      │
│                ↓                                            │
│  STEP 2: Hash Creation                                      │
│  ├─ Action: Generate canonical hash                         │
│  ├─ Success: mrv.hash.created.v1                            │
│  ├─ Failure: saga.step.failed.v1                            │
│  └─ Compensation: Mark MRV as "hash_failed"                 │
│                ↓                                            │
│  STEP 3: Registry Submission                                │
│  ├─ Action: Submit to registry API                          │
│  ├─ Success: registry.approved.v1                           │
│  ├─ Failure: registry.rejected.v1                           │
│  └─ Compensation: N/A (registry handles state)              │
│                ↓                                            │
│  STEP 4: NFT Minting                                        │
│  ├─ Action: Mint on NEAR blockchain                         │
│  ├─ Success: blockchain.nft.minted.v1                       │
│  ├─ Failure: blockchain.mint.failed.v1                      │
│  └─ Compensation: ⚠️ CRITICAL                               │
│       - Request registry cancellation                       │
│       - Emit: registry.cancel.requested.v1                  │
│       - Manual review if registry already issued            │
│                ↓                                            │
│  SAGA STATUS: COMPLETED or FAILED                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Multi-Registry Scenarios & Double-Counting Prevention

### 8.1 ⚠️ Critical: Double-Counting Rules

**IMPORTANT**: Issuing multiple tradeable credits from the same physical carbon removal **violates double-counting rules** in most jurisdictions and registry policies.

#### 8.1.1 What is Double-Counting?

**Double-counting** occurs when the same environmental benefit (carbon removal/reduction) is claimed or sold multiple times, creating a false impression of climate impact.

```
┌─────────────────────────────────────────────────────────────┐
│  DOUBLE-COUNTING VIOLATION                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Same Physical Carbon Removal: 1000 tCO2e                   │
│                    │                                        │
│                    ├──────────────┬─────────────┐           │
│                    ▼              ▼             ▼           │
│              Verra Credit    Puro Credit   ISO Credit      │
│               969 tCO2e      850 tCO2e     920 tCO2e       │
│                    │              │             │           │
│                    ▼              ▼             ▼           │
│              Sold to         Sold to       Sold to         │
│              Buyer A         Buyer B       Buyer C         │
│                                                             │
│  ❌ PROBLEM: Three buyers paid for the same 1000 tCO2e      │
│  ❌ Total claimed impact: 2739 tCO2e                        │
│  ✅ Actual impact: 1000 tCO2e                               │
│  📊 Overcounting: 174%                                      │
│                                                             │
│  THIS IS DOUBLE-COUNTING FRAUD                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 8.1.2 Registry Policies on Double-Counting

All major registries explicitly prohibit double-counting:

| Registry | Policy | Documentation |
|----------|--------|---------------|
| **Verra (VCS)** | "Projects must not claim credits for the same GHG emission reductions or removals under multiple GHG programs" | VCS Standard §3.14 |
| **Puro.earth** | "Each tonne of CO2 removed can only be certified once" | Puro Methodology |
| **Isometric** | "No double counting - credits cannot be issued by multiple registries" | Isometric Protocol |
| **Gold Standard** | "Emission reductions shall not be double counted" | GS4GG Requirements |
| **EU ETS** | Prohibits credits already claimed elsewhere | EU Directive 2003/87/EC |

**Conclusion**: You **CANNOT** issue active tradeable credits in multiple registries for the same physical carbon removal.

---

### 8.2 Scenario: WRONG - Submit Same Evidence to Multiple Registries

**❌ This approach violates double-counting rules**

```
┌─────────────────────────────────────────────────────────────┐
│  ❌ PROHIBITED: MULTI-REGISTRY ISSUANCE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SAME EVIDENCE → MULTIPLE REGISTRIES                        │
│                                                             │
│  Evidence Bundle (Raw Data + Artifacts)                     │
│       │                                                     │
│       ├──────────────────┬──────────────────┐               │
│       ▼                  ▼                  ▼               │
│  VERRA Credit      PURO Credit        ISO Credit           │
│  969 tCO2e         850 tCO2e          920 tCO2e            │
│       │                │                  │                │
│       ▼                ▼                  ▼                │
│  Sold/Retired      Sold/Retired      Sold/Retired         │
│                                                             │
│  ❌ VIOLATION: Same carbon removal claimed 3 times          │
│  ❌ Registry rules: PROHIBITED                              │
│  ❌ Buyer impact: FRAUDULENT                                │
│  ❌ Platform liability: HIGH                                │
│                                                             │
│  SYSTEM RESPONSE:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ When evidence_hash is detected in multiple          │   │
│  │ registries, system MUST:                            │   │
│  │                                                     │   │
│  │ 1. Flag for compliance review                      │   │
│  │ 2. Block automatic minting                         │   │
│  │ 3. Require user to choose ONE registry             │   │
│  │ 4. Mark others as "exploration only"               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 8.3 Scenario: CORRECT - Registry Comparison Then Single Selection

**✅ Permitted approach: Compare, then choose ONE**

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ PERMITTED: COMPARE THEN SELECT ONE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PHASE 1: EXPLORATION & COMPARISON                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Project has MRV data, wants to find best registry   │   │
│  │         │                                            │   │
│  │         ├───────────┬────────────┬──────────────┐    │   │
│  │         ▼           ▼            ▼              ▼    │   │
│  │    Run gap     Run gap      Run gap       Run gap   │   │
│  │    analysis:   analysis:    analysis:    analysis:  │   │
│  │    Verra       Puro         Isometric    Gold Std   │   │
│  │         │           │            │              │    │   │
│  │         ▼           ▼            ▼              ▼    │   │
│  │    78% match   65% match    82% match    45% match  │   │
│  │    969 tCO2e   850 tCO2e    920 tCO2e    800 tCO2e  │   │
│  │    $50/ton     $45/ton      $55/ton      $60/ton    │   │
│  │         │           │            │              │    │   │
│  │         └───────────┴────────────┴──────────────┘    │   │
│  │                        │                             │   │
│  │                        ▼                             │   │
│  │              COMPARISON TABLE                        │   │
│  │         (Show user all options)                      │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  PHASE 2: USER SELECTS ONE REGISTRY                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ User chooses: Isometric                              │   │
│  │ Reason: Best match (82%) + highest price ($55/ton)   │   │
│  │                                                      │   │
│  │ System actions:                                      │   │
│  │ 1. Mark project.target_registry = 'isometric'        │   │
│  │ 2. Discard other registry computations               │   │
│  │ 3. Proceed ONLY with Isometric                       │   │
│  │ 4. Flag: "Verra/Puro/GoldStd exploratory only"       │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  PHASE 3: SINGLE REGISTRY ISSUANCE                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Complete workflow for Isometric ONLY:                │   │
│  │ • Computation: 920 tCO2e                             │   │
│  │ • Verification: Isometric checklist                  │   │
│  │ • Hashing: mrv_hash + evidence_hash                  │   │
│  │ • Registry: Submit to Isometric                      │   │
│  │ • NFT: Mint ONE credit                               │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ✅ ONE CREDIT ISSUED (No double-counting)                 │
│  evidence_hash recorded (prevents future reuse)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 8.4 Legitimate Use Case: Sequential Retirement

**✅ PERMITTED**: Issue in Registry A, retire it, then issue in Registry B

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ PERMITTED: SEQUENTIAL ISSUANCE (After Retirement)       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TIMELINE:                                                  │
│                                                             │
│  YEAR 1: Verra Credit Lifecycle                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Jan 2024: Issue Verra credit (969 tCO2e)             │   │
│  │ Mar 2024: Sell to Company A                          │   │
│  │ Dec 2024: Company A retires credit                   │   │
│  │           → Verra credit now RETIRED (inactive)      │   │
│  │           → Cannot be traded again                   │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  YEAR 2: Puro Credit (Same Evidence)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Jan 2025: System checks evidence_hash                │   │
│  │           → Found: Verra credit exists               │   │
│  │           → Check: Verra credit status = "RETIRED"   │   │
│  │           → ✅ ALLOWED: Can issue in Puro             │   │
│  │                                                      │   │
│  │ Feb 2025: Issue Puro credit (850 tCO2e)              │   │
│  │           → Different registry methodology           │   │
│  │           → Different market                         │   │
│  │           → No double-counting (Verra retired)       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ⚠️ CAVEAT: Not all registries allow this!                 │
│  Check registry-specific policies.                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Important**: This is controversial. Some registries/buyers may consider this unethical even if technically allowed. Platform should warn users.

---

### 8.5 Legitimate Use Case: Registry Migration

**✅ PERMITTED**: Transfer between registries (with registry approval)

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ PERMITTED: REGISTRY MIGRATION                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Use Case: Verra closing operations, migrate to Puro       │
│                                                             │
│  STEP 1: Cancel/Void in Original Registry                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Request Verra to void/cancel credit                │   │
│  │ • Verra marks as "VOIDED - MIGRATED"                 │   │
│  │ • Get official cancellation certificate              │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  STEP 2: Reissue in New Registry                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Submit same evidence to Puro                       │   │
│  │ • Include Verra cancellation certificate             │   │
│  │ • Puro verifies no active Verra credit               │   │
│  │ • Puro issues new credit                             │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  RESULT:                                                    │
│  • Verra: VOIDED (no longer tradeable)                     │
│  • Puro: ACTIVE (tradeable)                                │
│  • No double-counting                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 8.6 Platform Policy: Recommended Approach

**Our Recommendation**: **STRICT - Prevent Multi-Registry Active Credits**

```typescript
// Platform configuration
const DOUBLE_COUNTING_POLICY = {
  // When evidence_hash is found in multiple registries
  allow_multi_registry_active_credits: false,  // ❌ STRICT
  
  // Allowed scenarios
  allowed_scenarios: [
    "comparison_only",      // ✅ Compare registries before choosing
    "sequential_retired",   // ✅ Issue in B after A is retired
    "registry_migration",   // ✅ Void in A, reissue in B
    "exploratory_computation" // ✅ Compute for analysis only
  ],
  
  // When same evidence_hash detected
  on_duplicate_detection: {
    action: "block_and_review",
    notification: [
      "compliance_team",
      "project_owner"
    ],
    require_manual_approval: true,
    require_justification: true
  }
};
```

### 8.7 System Enforcement

```
┌─────────────────────────────────────────────────────────────┐
│  EVIDENCE_HASH DUPLICATION CHECK                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  When creating mrv_hash for registry submission:           │
│                                                             │
│  1. Calculate evidence_hash from raw evidence               │
│     evidence_hash = SHA256(sorted evidence artifacts)       │
│                                                             │
│  2. Check global evidence registry:                         │
│     SELECT * FROM hashing.evidence_registry                 │
│     WHERE evidence_hash = 'sha256:xyz123...'                │
│                                                             │
│  3. If found:                                               │
│     ┌─────────────────────────────────────────────────┐     │
│     │ FOUND MATCHING EVIDENCE                         │     │
│     │                                                 │     │
│     │ Existing Submission:                            │     │
│     │ • Registry: Verra                               │     │
│     │ • Status: ACTIVE (tradeable)                    │     │
│     │ • Tenant: Same or Different?                    │     │
│     │                                                 │     │
│     │ Current Request:                                │     │
│     │ • Registry: Puro                                │     │
│     │ • Same evidence!                                │     │
│     │                                                 │     │
│     │ DECISION MATRIX:                                │     │
│     │                                                 │     │
│     │ IF existing.status === "ACTIVE":                │     │
│     │   ❌ BLOCK: "Evidence already used for active  │     │
│     │              credit in {registry}"              │     │
│     │   → Require manual review                       │     │
│     │                                                 │     │
│     │ IF existing.status === "RETIRED":               │     │
│     │   ⚠️ WARN: "Evidence was used in {registry},   │     │
│     │            now retired. Proceed?"               │     │
│     │   → Require explicit confirmation               │     │
│     │                                                 │     │
│     │ IF existing.status === "VOIDED":                │     │
│     │   ✅ ALLOW: "Previous credit voided,           │     │
│     │             migration permitted"                │     │
│     │                                                 │     │
│     │ IF existing.tenant_id !== current.tenant_id:    │     │
│     │   🚨 ALERT: "POTENTIAL FRAUD - Different tenant│     │
│     │             using same evidence"                │     │
│     │   → Block + escalate to compliance              │     │
│     └─────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.8 Database Schema for Enforcement

```sql
-- Global evidence registry (cross-tenant, cross-registry)
CREATE TABLE hashing.evidence_registry (
  id UUID PRIMARY KEY,
  evidence_hash VARCHAR(64) NOT NULL UNIQUE,
  
  -- Original submission
  original_submission_id UUID NOT NULL,
  original_tenant_id UUID NOT NULL,
  original_project_id UUID NOT NULL,
  original_registry VARCHAR(50) NOT NULL,
  
  -- Status tracking
  status VARCHAR(50) NOT NULL, -- active, retired, voided, superseded
  status_updated_at TIMESTAMP NOT NULL,
  
  -- All registries this evidence was submitted to
  registry_submissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [
  --   { "registry": "verra", "status": "retired", "serial": "VCS-123" },
  --   { "registry": "puro", "status": "active", "serial": "PURO-456" }
  -- ]
  
  -- Audit
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for fast lookups
CREATE UNIQUE INDEX idx_evidence_hash ON hashing.evidence_registry(evidence_hash);

-- Check constraint: Only ONE active submission per evidence_hash
CREATE OR REPLACE FUNCTION check_single_active_submission()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM hashing.evidence_registry
    WHERE evidence_hash = NEW.evidence_hash
      AND (registry_submissions @> '[{"status": "active"}]'::jsonb)
  ) > 1 THEN
    RAISE EXCEPTION 'Double-counting violation: Evidence already has an active credit in another registry';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_active_credit
  AFTER INSERT OR UPDATE ON hashing.evidence_registry
  FOR EACH ROW
  EXECUTE FUNCTION check_single_active_submission();
```

---

### 8.9 Cross-Registry Comparison Table (Exploratory Only)

When users compare registries BEFORE selecting, show this table:

| Aspect | Verra Credit | Puro Credit | Isometric Credit | Notes |
|--------|--------------|-------------|------------------|-------|
| **Evidence** | Same sensors, same data | Same sensors, same data | Same sensors, same data | Shared |
| **Methodology** | VM0042 | Puro.earth | Isometric Protocol | Different |
| **Computation** | 969 tCO2e | 850 tCO2e | 920 tCO2e | Registry-specific |
| **mrv_hash** | `sha256:abc...` | `sha256:def...` | `sha256:ghi...` | Different |
| **evidence_hash** | `sha256:xyz123...` | `sha256:xyz123...` | `sha256:xyz123...` | ⚠️ SAME |
| **Status** | Exploratory | Exploratory | Exploratory | Not issued |
| **Can Issue?** | ✅ Select ONE | ✅ Select ONE | ✅ Select ONE | Choose wisely! |
| **Market Price** | $50/ton | $45/ton | $55/ton | Current estimate |

**⚠️ IMPORTANT**: You can only proceed with **ONE** of these registries. The others are for comparison purposes only.

---

### 8.10 Summary: Double-Counting Rules

| Scenario | Allowed? | Rationale |
|----------|----------|-----------|
| **Issue same evidence in multiple registries simultaneously** | ❌ NO | Double-counting violation |
| **Compare registries, then select one** | ✅ YES | Legitimate comparison shopping |
| **Issue in Verra, retire it, then issue in Puro** | ⚠️ CONTROVERSIAL | Technically legal but ethically questionable |
| **Void Verra credit, migrate to Puro** | ✅ YES | Legitimate registry migration |
| **Same evidence, different tenants** | ❌ NO | Fraud - escalate immediately |
| **Exploratory computation (no issuance)** | ✅ YES | Gap analysis and planning |

**Platform Stance**: We enforce **strict single-registry issuance** by default. Users must explicitly request and justify any exceptions, which require compliance team approval.

---

## 9. Decision Trees

### 9.1 Registry Selection Decision Tree

```
                    ┌─────────────────┐
                    │ Start: Choose   │
                    │ Target Registry │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Market Type?    │
                    └────┬───────┬────┘
                         │       │
                 Voluntary    Compliance
                         │       │
            ┌────────────┼───────┼────────────┐
            │            │       │            │
       ┌────▼────┐  ┌───▼────┐ ┌▼──────┐ ┌──▼──────┐
       │ Verra   │  │ Puro   │ │EU ETS │ │ Cal ARB │
       └────┬────┘  └───┬────┘ └┬──────┘ └──┬──────┘
            │           │       │           │
       ┌────▼──────────────────────────────┐│
       │ Load Registry Requirements        ││
       │ - Methodology options             ││
       │ - Evidence requirements           ││
       │ - Calculation rules               ││
       └────┬──────────────────────────────┘│
            │                               │
       ┌────▼──────────────────────────────┐│
       │ Run Gap Analysis                  ││
       │ - Check available data            ││
       │ - Identify missing fields         ││
       │ - Calculate completeness %        ││
       └────┬──────────────────────────────┘│
            │                               │
       ┌────▼──────────────────────────────┐│
       │ Best Match?                       ││
       │ - Highest completeness score      ││
       │ - Lowest cost to complete         ││
       │ - Fastest time to issuance        ││
       └────┬──────────────────────────────┘│
            │                               │
       ┌────▼──────────────────────────────┐│
       │ ✅ Registry Selected               ││
       │ Proceed with data collection      ││
       └───────────────────────────────────┘│
```

### 9.2 Verification Decision Tree

```
                    ┌─────────────────┐
                    │ Start:          │
                    │ Verification    │
                    └────────┬────────┘
                             │
                    ┌────────▼─────────┐
                    │ All Categories   │
                    │ Reviewed?        │
                    └────┬────────┬────┘
                         │        │
                        Yes       No
                         │        │
                         │   ┌────▼────┐
                         │   │Continue │
                         │   │Review   │
                         │   └─────────┘
                         │
                    ┌────▼─────────┐
                    │ Any Category │
                    │ FAILED?      │
                    └────┬────┬────┘
                         │    │
                        No   Yes
                         │    │
                         │   ┌▼──────────────┐
                         │   │ REJECT        │
                         │   │ Return with   │
                         │   │ findings      │
                         │   └───────────────┘
                         │
                    ┌────▼─────────┐
                    │ Any Category │
                    │ CLARIFICATION│
                    │ REQUIRED?    │
                    └────┬────┬────┘
                         │    │
                        No   Yes
                         │    │
                         │   ┌▼──────────────┐
                         │   │ Request       │
                         │   │ Clarification │
                         │   │ from Project  │
                         │   └───────────────┘
                         │
                    ┌────▼─────────┐
                    │ All PASSED   │
                    │ or PASSED    │
                    │ WITH COMMENTS│
                    └────┬─────────┘
                         │
                    ┌────▼─────────┐
                    │ ✅ APPROVE    │
                    │ Generate Hash│
                    └──────────────┘
```

---

## 10. Registry Change Management

### 10.1 Overview: Changing Registry at Any Stage

Users can change their target registry at any point in the workflow, but the impact varies depending on how far along they are in the process. The platform supports registry changes with clear impact assessment and guided workflows.

```
┌─────────────────────────────────────────────────────────────┐
│  REGISTRY CHANGE IMPACT BY STAGE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Stage 1: Before Computation              Impact: ✅ Low    │
│  Stage 2: After Computation               Impact: ⚠️ Medium │
│  Stage 3: After Verification              Impact: ⚠️ High   │
│  Stage 4: After Hash                      Impact: ❌ V.High │
│  Stage 5: After Registry Submission       Impact: ❌ Blocked│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Stage 1: Change Registry Before Computation

**Current Progress**: Project setup, data collection started  
**Impact**: ✅ Minimal  
**Time Lost**: < 1 day  
**Cost**: Negligible

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: CHANGE BEFORE COMPUTATION                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USER ACTION                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ User clicks "Change Registry" button                 │   │
│  │         │                                            │   │
│  │         ▼                                            │   │
│  │ Select new registry: Puro (was Verra)                │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SYSTEM ANALYSIS                                       │   │
│  │                                                      │   │
│  │ 1. Check current stage: "data_collection"            │   │
│  │ 2. Calculate impact:                                 │   │
│  │    - No computation done ✅                           │   │
│  │    - No verification done ✅                          │   │
│  │    - No hash created ✅                               │   │
│  │ 3. Display impact summary:                           │   │
│  │    ┌────────────────────────────────────────────┐    │   │
│  │    │ Impact Assessment:                         │    │   │
│  │    │ • Work Lost: None                          │    │   │
│  │    │ • Time Impact: < 1 day                     │    │   │
│  │    │ • Required Actions:                        │    │   │
│  │    │   - Re-run gap analysis                    │    │   │
│  │    │   - May need additional evidence for Puro  │    │   │
│  │    │ • Estimated Cost: $0                       │    │   │
│  │    └────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ USER CONFIRMS CHANGE                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SYSTEM ACTIONS                                        │   │
│  │                                                      │   │
│  │ 1. Update project record:                            │   │
│  │    UPDATE projects                                   │   │
│  │    SET target_registry = 'puro',                     │   │
│  │        previous_registry = 'verra',                  │   │
│  │        registry_changed_at = NOW()                   │   │
│  │                                                      │   │
│  │ 2. Load Puro requirements                            │   │
│  │ 3. Re-run gap analysis                               │   │
│  │ 4. Emit event: project.registry.changed.v1           │   │
│  │ 5. Show new gap analysis results                     │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ✅ Registry changed successfully                          │
│  📋 New gap analysis: 65% complete (need lab reports)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**API Call:**
```typescript
PUT /api/v1/projects/{project_id}/registry
{
  "new_registry": "puro",
  "reason": "Better market price for Puro credits"
}

Response:
{
  "success": true,
  "previous_registry": "verra",
  "new_registry": "puro",
  "impact": {
    "stage": "data_collection",
    "requires_recomputation": false,
    "requires_reverification": false,
    "requires_new_submission": false,
    "estimated_time_days": 0.5
  },
  "gap_analysis": {
    "completeness_score": 65,
    "missing_required_fields": ["evidence.lab_analysis", "permanence.assessment"],
    "action_items": [
      "Upload lab analysis reports",
      "Complete permanence assessment"
    ]
  }
}
```

---

### 10.3 Stage 2: Change Registry After Computation

**Current Progress**: Computation completed (969 tCO2e for Verra)  
**Impact**: ⚠️ Medium  
**Time Lost**: 1-2 days  
**Cost**: Computation work lost

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 2: CHANGE AFTER COMPUTATION                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USER ACTION                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ User changes registry: Verra → Puro                  │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SYSTEM IMPACT ANALYSIS                                │   │
│  │                                                      │   │
│  │ ⚠️ WARNING: Computation already done                 │   │
│  │                                                      │   │
│  │ Impact Summary:                                      │   │
│  │ ┌────────────────────────────────────────────────┐   │   │
│  │ │ • Current: 969 tCO2e (Verra VM0042)            │   │   │
│  │ │ • Will invalidate: Computation results         │   │   │
│  │ │ • Must redo: Computation with Puro formulas    │   │   │
│  │ │ • New result may differ: ~850 tCO2e (estimate) │   │   │
│  │ │ • Time impact: 1-2 days                        │   │   │
│  │ │ • Cost: Computation resources                  │   │   │
│  │ └────────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │ Confirm change? [Yes] [No]                           │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼ (User confirms)                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SYSTEM ACTIONS                                        │   │
│  │                                                      │   │
│  │ 1. Mark existing computation as superseded:          │   │
│  │    UPDATE mrv.mrv_computations                       │   │
│  │    SET status = 'superseded',                        │   │
│  │        superseded_reason = 'registry_change',        │   │
│  │        superseded_at = NOW()                          │   │
│  │    WHERE mrv_submission_id = 'xxx'                   │   │
│  │                                                      │   │
│  │ 2. Update project registry                           │   │
│  │ 3. Create new computation request                    │   │
│  │ 4. Emit event: computation.invalidated.v1            │   │
│  │ 5. Trigger new computation with Puro methodology     │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ NEW COMPUTATION                                       │   │
│  │                                                      │   │
│  │ - Use Puro calculation engine                         │   │
│  │ - Apply Puro formulas                                │   │
│  │ - Result: 850 tCO2e (different!)                      │   │
│  │ - Store new computation                               │   │
│  │ - Emit: mrv.computed.v1 (with new registry)          │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ✅ Registry changed, ready for verification               │
│  📊 New tonnage: 850 tCO2e (was 969 tCO2e)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 10.4 Stage 3: Change Registry After Verification

**Current Progress**: Verification approved by verifier  
**Impact**: ⚠️ High  
**Time Lost**: 2-4 weeks (verification time)  
**Cost**: Verification fees + computation

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 3: CHANGE AFTER VERIFICATION                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USER ACTION                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ User changes registry: Verra → Puro                  │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SYSTEM IMPACT ANALYSIS                                │   │
│  │                                                      │   │
│  │ ⚠️ CRITICAL WARNING: Verification already completed   │   │
│  │                                                      │   │
│  │ Impact Summary:                                      │   │
│  │ ┌────────────────────────────────────────────────┐   │   │
│  │ │ • Lost Work:                                   │   │   │
│  │ │   - Verra verification (2-4 weeks)             │   │   │
│  │ │   - Verification report                        │   │   │
│  │ │   - Verifier review time                       │   │   │
│  │ │                                                │   │   │
│  │ │ • Must Redo:                                   │   │   │
│  │ │   - Re-compute with Puro formulas              │   │   │
│  │ │   - Re-verify with Puro checklist              │   │   │
│  │ │   - New verification report                    │   │   │
│  │ │                                                │   │   │
│  │ │ • Time Impact: 2-4 weeks                       │   │   │
│  │ │ • Cost: Verification fee ($500-2000)           │   │   │
│  │ │                                                │   │   │
│  │ │ ⚠️ Puro may have different checklist!          │   │   │
│  │ └────────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │ Are you sure? [Yes] [No]                             │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼ (User confirms)                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SYSTEM ACTIONS                                        │   │
│  │                                                      │   │
│  │ 1. Invalidate existing verification:                 │   │
│  │    UPDATE verification.verifications                 │   │
│  │    SET status = 'superseded',                        │   │
│  │        superseded_reason = 'registry_changed'        │   │
│  │                                                      │   │
│  │ 2. Invalidate computation                            │   │
│  │    (same as Stage 2)                                 │   │
│  │                                                      │   │
│  │ 3. Update project registry                           │   │
│  │                                                      │   │
│  │ 4. Trigger new computation                           │   │
│  │    - Wait for completion                             │   │
│  │    - Emit: mrv.computed.v1                           │   │
│  │                                                      │   │
│  │ 5. Assign new verifier (Puro-accredited)            │   │
│  │    - Puro may require different verifier             │   │
│  │    - Must be familiar with Puro requirements         │   │
│  │                                                      │   │
│  │ 6. Start new verification workflow                   │   │
│  │    - Use Puro-specific checklist                     │   │
│  │    - Emit: verification.started.v1                   │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  📋 Status: Verification in progress (Puro)                │
│  ⏳ ETA: 2-4 weeks                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Database State:**
```sql
-- Archive old verification
UPDATE verification.verifications
SET status = 'superseded',
    superseded_reason = 'registry_changed',
    superseded_at = NOW(),
    metadata = metadata || jsonb_build_object(
      'original_registry', 'verra',
      'changed_to_registry', 'puro'
    )
WHERE mrv_submission_id = 'mrv_sub_123';

-- Archive old computation
UPDATE mrv.mrv_computations
SET status = 'superseded'
WHERE mrv_submission_id = 'mrv_sub_123';

-- Update project
UPDATE project.projects
SET target_registry = 'puro',
    previous_registry = 'verra',
    registry_changed_at = NOW(),
    status = 'computation_pending';
```

---

### 10.5 Stage 4: Change Registry After Hash Created

**Current Progress**: Hash generated, not yet submitted to registry  
**Impact**: ❌ Very High  
**Time Lost**: 4-6 weeks  
**Cost**: Full workflow cost

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 4: CHANGE AFTER HASH CREATED                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CURRENT STATE:                                             │
│  ✅ Computation: 969 tCO2e (Verra)                          │
│  ✅ Verification: Approved                                  │
│  ✅ Hash: sha256:abc123... (locked, immutable)              │
│  ⏸️ Registry: Not yet submitted                            │
│                                                             │
│  USER ACTION: Change Verra → Puro                          │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ⚠️ CRITICAL IMPACT ANALYSIS                           │   │
│  │                                                      │   │
│  │ Hash is immutable and registry-specific!             │   │
│  │                                                      │   │
│  │ Impact Assessment:                                   │   │
│  │ ┌────────────────────────────────────────────────┐   │   │
│  │ │ ❌ CANNOT use existing hash for Puro           │   │   │
│  │ │    - Hash includes registry_id: "verra"        │   │   │
│  │ │    - Puro needs registry_id: "puro"            │   │   │
│  │ │                                                │   │   │
│  │ │ Must Create NEW SUBMISSION:                    │   │   │
│  │ │ 1. Keep original (Verra path) available        │   │   │
│  │ │ 2. Create NEW submission for Puro              │   │   │
│  │ │ 3. Re-compute (850 tCO2e)                      │   │   │
│  │ │ 4. Re-verify (Puro checklist)                  │   │   │
│  │ │ 5. Generate NEW hash (sha256:xyz789...)        │   │   │
│  │ │                                                │   │   │
│  │ │ Time Impact: 4-6 weeks                         │   │   │
│  │ │ Cost: $500-2000 (full verification)            │   │   │
│  │ │                                                │   │   │
│  │ │ OR: Keep BOTH submissions (multi-registry)     │   │   │
│  │ │ - Submit Verra hash to Verra                   │   │   │
│  │ │ - Create Puro submission separately            │   │   │
│  │ └────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ USER DECISION REQUIRED                                │   │
│  │                                                      │   │
│  │ Option 1: Abandon Verra, create new Puro submission │   │
│  │           [Proceed with New Submission]              │   │
│  │                                                      │   │
│  │ Option 2: Keep both (multi-registry approach)       │   │
│  │           [Submit to Both Registries]                │   │
│  │                                                      │   │
│  │ Option 3: Cancel change, continue with Verra        │   │
│  │           [Cancel Change]                            │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼ (User selects Option 1: New Submission)          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SYSTEM ACTIONS                                        │   │
│  │                                                      │   │
│  │ 1. Archive original Verra submission:                │   │
│  │    - Keep all records (audit trail)                  │   │
│  │    - Mark as "registry_changed"                      │   │
│  │                                                      │   │
│  │ 2. Create new MRV submission:                        │   │
│  │    - New mrv_submission_id                           │   │
│  │    - parent_submission_id = original                 │   │
│  │    - target_registry = "puro"                        │   │
│  │    - Same raw data (reused)                          │   │
│  │                                                      │   │
│  │ 3. Trigger new computation:                          │   │
│  │    - Use PuroCalculator                              │   │
│  │    - Result: 850 tCO2e                               │   │
│  │                                                      │   │
│  │ 4. Assign Puro-accredited verifier                   │   │
│  │ 5. Start verification workflow                       │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  📋 New submission created: mrv_sub_456                    │
│  ⏳ Status: Verification pending                            │
│  🔗 Linked to original: mrv_sub_123 (Verra)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 10.6 Stage 5: Change Registry After Registry Submission

**Current Progress**: Submitted to Verra (approved or pending)  
**Impact**: ❌ Blocked — Cannot change  
**Alternative**: Create parallel submission

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 5: CHANGE AFTER REGISTRY SUBMISSION                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CURRENT STATE:                                             │
│  ✅ Verra submission: Approved (serial VCS-12345)           │
│  ✅ Hash: Locked in Verra registry                          │
│                                                             │
│  USER ACTION: Want to change to Puro                       │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ❌ CANNOT CHANGE EXISTING SUBMISSION                  │   │
│  │                                                      │   │
│  │ Reason:                                              │   │
│  │ • Already submitted to Verra                         │   │
│  │ • Verra may have issued serial number                │   │
│  │ • Hash is locked in registry                         │   │
│  │ • Cannot retroactively change                        │   │
│  │                                                      │   │
│  │ Available Options:                                   │   │
│  │ ┌────────────────────────────────────────────────┐   │   │
│  │ │ Option 1: Continue with Verra ✅               │   │   │
│  │ │   - Proceed to NFT minting                     │   │   │
│  │ │   - Complete original workflow                 │   │   │
│  │ │                                                │   │   │
│  │ │ Option 2: Add Puro (Parallel) ⚠️              │   │   │
│  │ │   - Keep Verra submission                      │   │   │
│  │ │   - Create NEW Puro submission                 │   │   │
│  │ │   - Both registries simultaneously             │   │   │
│  │ │   - evidence_hash will detect relationship     │   │   │
│  │ │                                                │   │   │
│  │ │ Option 3: Cancel Verra, start Puro ❌          │   │   │
│  │ │   - Request Verra cancellation                 │   │   │
│  │ │   - May not be possible if approved            │   │   │
│  │ │   - Create new Puro submission                 │   │   │
│  │ └────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼ (User selects Option 2: Parallel)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ CREATE PARALLEL PURO SUBMISSION                       │   │
│  │                                                      │   │
│  │ 1. Keep Verra submission active                      │   │
│  │    - Will proceed to NFT minting                     │   │
│  │    - Verra credit will be issued                     │   │
│  │                                                      │   │
│  │ 2. Create new submission for Puro:                   │   │
│  │    - New mrv_submission_id                           │   │
│  │    - Same evidence (reused)                          │   │
│  │    - Generate evidence_hash (same as Verra)          │   │
│  │                                                      │   │
│  │ 3. System detects same evidence_hash:                │   │
│  │    ⚠️ WARNING: Same evidence in multiple registries  │   │
│  │    - Flag for transparency                           │   │
│  │    - Disclose in NFT metadata                        │   │
│  │    - Policy: Allow or block?                         │   │
│  │                                                      │   │
│  │ 4. If allowed, proceed with Puro workflow:           │   │
│  │    - Compute with Puro (850 tCO2e)                   │   │
│  │    - Verify with Puro checklist                      │   │
│  │    - Generate Puro hash (different)                  │   │
│  │    - Submit to Puro registry                         │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  RESULT: TWO SEPARATE CREDITS                              │
│  ┌────────────────────┬────────────────────┐                │
│  │ Verra Credit       │ Puro Credit        │                │
│  │ Token: credit_v_1  │ Token: credit_p_1  │                │
│  │ Hash: sha256:abc.. │ Hash: sha256:def.. │                │
│  │ Evidence: sha256:xyz (same)            │                │
│  └────────────────────┴────────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 10.7 Registry Change API

```typescript
// Comprehensive registry change endpoint
PUT /api/v1/projects/{project_id}/registry

Request:
{
  "new_registry": "puro",
  "change_strategy": "replace" | "parallel",  // Replace or add parallel
  "reason": "Better market pricing",
  "acknowledge_impact": true  // User confirms they understand
}

Response:
{
  "success": true,
  "change_id": "chg_abc123",
  "previous_registry": "verra",
  "new_registry": "puro",
  "strategy": "replace",
  
  // Impact assessment
  "impact": {
    "stage": "verified",
    "severity": "high",
    "invalidated_work": [
      {
        "type": "computation",
        "id": "comp_123",
        "tonnage": 969.0
      },
      {
        "type": "verification",
        "id": "verif_456",
        "verifier": "John Smith"
      }
    ],
    "requires_recomputation": true,
    "requires_reverification": true,
    "requires_new_hash": true,
    "estimated_time_days": 28,
    "estimated_cost_usd": 1500
  },
  
  // Next steps
  "next_steps": [
    {
      "step": 1,
      "action": "Complete gap analysis",
      "status": "in_progress"
    },
    {
      "step": 2,
      "action": "Collect missing evidence",
      "status": "pending",
      "missing_items": ["lab_analysis_report"]
    },
    {
      "step": 3,
      "action": "Computation",
      "status": "pending"
    },
    {
      "step": 4,
      "action": "Verification",
      "status": "pending"
    }
  ],
  
  // Audit trail
  "change_history": [
    {
      "timestamp": "2024-06-01T10:00:00Z",
      "from_registry": null,
      "to_registry": "verra",
      "reason": "Initial selection"
    },
    {
      "timestamp": "2024-07-15T14:30:00Z",
      "from_registry": "verra",
      "to_registry": "puro",
      "reason": "Better market pricing",
      "initiated_by": "user_xyz"
    }
  ]
}
```

---

### 10.8 UI/UX for Registry Changes

```
┌─────────────────────────────────────────────────────────────┐
│  PROJECT DASHBOARD - REGISTRY CHANGE WIDGET                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current Registry: Verra (VM0042)                          │
│  Status: Verified ✓                                        │
│                                                             │
│  [Change Registry] button                                  │
│         │                                                   │
│         ▼ (User clicks)                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ CHANGE REGISTRY MODAL                                 │   │
│  │                                                      │   │
│  │ Select New Registry:                                 │   │
│  │ ○ Puro.earth                                         │   │
│  │ ○ Isometric                                          │   │
│  │ ○ EU ETS                                             │   │
│  │                                                      │   │
│  │ Impact Preview:                                      │   │
│  │ ┌────────────────────────────────────────────────┐   │   │
│  │ │ ⚠️ Changing to Puro will:                      │   │   │
│  │ │                                                │   │   │
│  │ │ Invalidate:                                    │   │   │
│  │ │ • Verra computation (969 tCO2e)                │   │   │
│  │ │ • Verification report                          │   │   │
│  │ │                                                │   │   │
│  │ │ Require:                                       │   │   │
│  │ │ • Re-computation (est. 850 tCO2e)              │   │   │
│  │ │ • Re-verification (~3 weeks)                   │   │   │
│  │ │ • Additional evidence: Lab reports             │   │   │
│  │ │                                                │   │   │
│  │ │ Timeline: +28 days                             │   │   │
│  │ │ Cost: $1,500                                   │   │   │
│  │ └────────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │ Alternative: Keep both?                              │   │
│  │ □ Submit to BOTH Verra and Puro                      │   │
│  │   (Creates separate credits)                         │   │
│  │                                                      │   │
│  │ [Cancel] [Proceed with Change]                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 10.9 Multi-Registry Strategy (Keep Both)

Instead of changing, users can pursue a **multi-registry strategy**:

```
┌─────────────────────────────────────────────────────────────┐
│  MULTI-REGISTRY STRATEGY (PARALLEL SUBMISSIONS)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ORIGINAL: Verra Submission                                 │
│  ✅ Computation: 969 tCO2e                                  │
│  ✅ Hash: sha256:abc123...                                  │
│  ✅ Status: Proceeding to Verra                             │
│         │                                                   │
│         ├──► Continue Verra workflow                        │
│         │   (Submit to Verra → Mint NFT)                    │
│         │                                                   │
│         │                                                   │
│  PARALLEL: Puro Submission                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. Create new submission for Puro                    │   │
│  │    - New mrv_submission_id                           │   │
│  │    - Reuse raw data/evidence                         │   │
│  │    - Same evidence_hash                              │   │
│  │                                                      │   │
│  │ 2. Compute with Puro: 850 tCO2e                      │   │
│  │ 3. Verify with Puro checklist                        │   │
│  │ 4. Generate Puro hash: sha256:def456...              │   │
│  │ 5. Submit to Puro registry                           │   │
│  │ 6. Mint Puro NFT                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  RESULT: TWO CREDITS FROM SAME EVIDENCE                    │
│  ┌────────────────────┬────────────────────┐                │
│  │ Verra NFT          │ Puro NFT           │                │
│  │ • 969 tCO2e        │ • 850 tCO2e        │                │
│  │ • VCS-12345        │ • PURO-67890       │                │
│  │ • $50/ton market   │ • $45/ton market   │                │
│  │                                         │                │
│  │ evidence_hash: sha256:xyz123... (SAME) │                │
│  │ → Disclosed in both NFT metadata        │                │
│  └─────────────────────────────────────────┘                │
│                                                             │
│  ⚠️ TRANSPARENCY: Buyers can see relationship               │
│  ⚠️ POLICY: Platform must decide if allowed                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 10.10 Registry Change Decision Matrix

| User Goal | Current Stage | Recommended Action | Impact |
|-----------|---------------|-------------------|--------|
| **Try different registry** | Before computation | Change registry directly | ✅ Low |
| **Better pricing** | After computation | Compare markets, decide early | ⚠️ Medium |
| **Maximize revenue** | After hash | Multi-registry strategy | ⚠️ High (but dual income) |
| **Fix wrong registry** | After submission | Too late - continue or parallel | ❌ Very High |
| **Market access** | Any stage | Multi-registry from start | ⚠️ Parallel work |

### 10.11 Registry Change Events

New events to track registry changes:

| Event | Trigger | Payload |
|-------|---------|---------|
| `project.registry.changed.v1` | Registry changed | project_id, old_registry, new_registry, stage |
| `computation.invalidated.v1` | Computation invalidated | computation_id, reason |
| `verification.invalidated.v1` | Verification invalidated | verification_id, reason |
| `submission.parallel.created.v1` | Parallel registry submission | original_submission_id, new_submission_id, new_registry |

---

## 11. Presentation Slides Outline

### Slide 1: Title
**DMRV Platform: Comprehensive Workflows**  
Transforming Carbon Data into Verified NFT Credits

### Slide 2: Platform Overview
- Mission & Vision
- High-Level Architecture
- Key Stakeholders

### Slide 3: Registry-First Approach
- Why Registry Selection Matters
- Different Requirements Per Registry
- Gap Analysis Process

### Slide 4: 8-Phase Credit Lifecycle
1. Registry Selection
2. Data Collection
3. Computation
4. Verification
5. Hashing
6. Registry Approval
7. NFT Minting
8. Active Trading

### Slide 5: Verification Framework
- 9-Category Checklist
- Independent Verifiers
- Pass/Fail Criteria

### Slide 6: Blockchain Integration
- NEAR Protocol
- NFT Metadata
- 3-Second Confirmation

### Slide 7: Hash Integrity Model
- `mrv_hash`: Registry-specific claim
- `evidence_hash`: Cross-registry detection
- Verifiable Chain of Custody

### Slide 8: Multi-Registry Scenarios
- Same Evidence, Different Credits
- Cross-Registry Deduplication
- Policy Options

### Slide 9: Error Handling & Recovery
- Circuit Breakers
- Retry Logic
- Saga Compensation

### Slide 10: Key Metrics & SLAs
- 99.9% API Availability
- < 30 Second Mint Latency
- < 5 Minute Registry Sync

---

## 11. Summary & Next Steps

### 11.1 Key Takeaways

✅ **Registry-first** approach ensures compliance from day one  
✅ **9-category verification** ensures credit integrity  
✅ **Dual-hash system** enables transparency and deduplication  
✅ **Event-driven architecture** ensures auditability  
✅ **NEAR blockchain** provides fast, low-cost NFT issuance  

### 11.2 Implementation Priorities

1. **Phase 1** (Weeks 1-4): Core infrastructure + Tenant management
2. **Phase 2** (Weeks 5-8): MRV processing + Verification
3. **Phase 3** (Weeks 9-12): Registry integration (Verra first)
4. **Phase 4** (Weeks 13-16): Blockchain integration
5. **Phase 5** (Weeks 17-20): Credit lifecycle management

### 11.3 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to First Credit** | < 8 weeks | From project creation to NFT mint |
| **Verification Pass Rate** | > 85% | First-time verification approval |
| **Registry Approval Rate** | > 95% | Registry submission success |
| **NFT Mint Success Rate** | > 99.5% | Blockchain transaction success |
| **User Satisfaction** | > 4.5/5 | Net Promoter Score |

---

**Document End**

For questions or clarifications, contact:  
Technical Architecture Team  
Email: architecture@dmrv-platform.com

