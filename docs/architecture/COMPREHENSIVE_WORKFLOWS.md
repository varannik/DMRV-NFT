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

## 8. Multi-Registry Scenarios

### 8.1 Scenario: Submit Same Evidence to Multiple Registries

**Business Case**: Maximize credit value by issuing in multiple markets

```
┌─────────────────────────────────────────────────────────────┐
│  MULTI-REGISTRY ISSUANCE FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SAME EVIDENCE → MULTIPLE REGISTRIES                        │
│                                                             │
│  Evidence Bundle (Raw Data + Artifacts)                     │
│       │                                                     │
│       ├──────────────────┬──────────────────┐               │
│       ▼                  ▼                  ▼               │
│  VERRA Path        PURO Path         ISOMETRIC Path        │
│  ┌──────────┐     ┌──────────┐      ┌──────────┐          │
│  │Registry: │     │Registry: │      │Registry: │          │
│  │ verra    │     │ puro     │      │isometric │          │
│  └──────────┘     └──────────┘      └──────────┘          │
│       │                │                  │                │
│       ▼                ▼                  ▼                │
│  Compute w/        Compute w/        Compute w/           │
│  VM0042            Puro formulas     Isometric            │
│       │                │                  │                │
│       ▼                ▼                  ▼                │
│  Result:           Result:           Result:              │
│  969 tCO2e         850 tCO2e         920 tCO2e            │
│       │                │                  │                │
│       ▼                ▼                  ▼                │
│  Generate Hash:    Generate Hash:    Generate Hash:       │
│  sha256:abc...     sha256:def...     sha256:ghi...        │
│  (different!)      (different!)      (different!)         │
│       │                │                  │                │
│       ▼                ▼                  ▼                │
│  ┌──────────┐     ┌──────────┐      ┌──────────┐          │
│  │evidence  │     │evidence  │      │evidence  │          │
│  │_hash:    │     │_hash:    │      │_hash:    │          │
│  │xyz123... │     │xyz123... │      │xyz123... │          │
│  │(SAME!)   │     │(SAME!)   │      │(SAME!)   │          │
│  └──────────┘     └──────────┘      └──────────┘          │
│       │                │                  │                │
│       ▼                ▼                  ▼                │
│  DETECTION: Same evidence_hash across registries!         │
│                                                             │
│  POLICY DECISION:                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Option 1: REJECT (prevent double-counting)          │   │
│  │   → Most conservative approach                      │   │
│  │                                                     │   │
│  │ Option 2: ALLOW with disclosure                     │   │
│  │   → Same evidence, different registries OK          │   │
│  │   → Must disclose in metadata                       │   │
│  │   → Buyer decides                                   │   │
│  │                                                     │   │
│  │ Option 3: SEQUENTIAL issuance only                  │   │
│  │   → First registry issues immediately               │   │
│  │   → Others must wait for first to retire           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Cross-Registry Comparison Table

| Aspect | Verra Credit | Puro Credit | Isometric Credit |
|--------|--------------|-------------|------------------|
| **Evidence** | Same sensors, same data | Same sensors, same data | Same sensors, same data |
| **Methodology** | VM0042 | Puro.earth | Isometric Protocol |
| **Computation** | 969 tCO2e | 850 tCO2e | 920 tCO2e |
| **mrv_hash** | `sha256:abc...` | `sha256:def...` | `sha256:ghi...` |
| **evidence_hash** | `sha256:xyz123...` | `sha256:xyz123...` | `sha256:xyz123...` |
| **Registry Serial** | VCS-12345 | PURO-67890 | ISO-11223 |
| **Token ID** | `credit_verra_12345` | `credit_puro_67890` | `credit_iso_11223` |
| **Market** | Voluntary | Voluntary | Voluntary |
| **Price** | $50/ton | $45/ton | $55/ton |

**Key Point**: Different `mrv_hash` values are expected and correct. The `evidence_hash` detects the relationship.

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

## 10. Presentation Slides Outline

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

