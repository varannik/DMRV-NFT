# DMRV Platform - Comprehensive Workflows

**Document Purpose**: End-to-end workflow documentation for presentations and technical onboarding

**Last Updated**: 2024-01-XX  
**Version**: 1.0  
**Audience**: Stakeholders, developers, verifiers, registry partners

---

## Table of Contents

1. [Overview](#1-overview)
   - 1.3 [Key Milestones](#13-key-milestones)
   - 1.4 [Data Input Methods](#14-data-input-methods)
2. [Actors & Roles](#2-actors--roles)
3. [Core Workflows](#3-core-workflows)
   - 3.0 [Data Structure Overview](#30-data-structure-overview)
   - 3.0.1 [Expandable UI: Net CORC Visualization](#301-expandable-ui-net-corc-visualization)
   - 3.0.2 [Registry-Driven Data Injection Architecture](#302-registry-driven-data-injection-architecture)
   - 3.0.3 [Data Injection Tree Structure](#303-data-injection-tree-structure)
   - 3.0.4 [Registry Configuration Schema](#304-registry-configuration-schema)
   - 3.0.5 [Example: Verra VM0042 Protocol](#305-example-verra-vm0042-protocol-configuration)
   - 3.0.6 [Example: Puro.earth Biochar Protocol](#306-example-puroearth-biochar-protocol-configuration)
   - 3.0.7 [Example: Isometric Enhanced Weathering](#307-example-isometric-enhanced-weathering-protocol)
   - 3.0.8 [Dynamic UI Tree Rendering](#308-dynamic-ui-tree-rendering)
   - 3.0.9 [Adding a New Registry](#309-adding-a-new-registry-no-code-changes-required)
   - 3.0.10 [Registry Configuration API](#3010-registry-configuration-api)
   - 3.0.11 [Life Cycle Assessment (LCA)](#3011-life-cycle-assessment-lca---detailed-structure)
   - 3.1 [Complete Credit Issuance Workflow](#31-complete-credit-issuance-workflow)
4. [Registry-First Approach](#4-registry-first-approach)
5. [Verification Workflow](#5-verification-workflow)
   - 5.1 [Two-Phase Verification Process](#51-two-phase-verification-process)
   - 5.1.1 [Expandable UI: Verification Node Structure](#511-expandable-ui-verification-node-structure)
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

| Milestone | Description | Output | Data Type |
|-----------|-------------|--------|-----------|
| **Project Creation** | Setup project with General, Design, Facilities | Project record | Phase A |
| **Registry Selection** | Choose target registry + methodology | Requirements checklist | Phase A |
| **Data Injection** | Submit LCA, Emissions, GHG, Removal Data | MRV submission | Phase B |
| **Computation** | Calculate Net CORC using formulas | Computed results | Phase B |
| **Verification** | Independent review (7 categories) | Verification report | Both |
| **Hashing** | Create canonical hash | `mrv_hash` | Phase B |
| **Registry Approval** | Submit to registry | Registry serial number | Phase B |
| **NFT Minting** | Mint on NEAR blockchain | Token ID | Phase B |
| **Active Trading** | Credit available for market | Tradeable asset | Ongoing |

### 1.4 Data Input Methods

All data can be submitted via two methods:

| Input Method | Description | Best For |
|--------------|-------------|----------|
| **API Integration** | RESTful API endpoints for programmatic submission | IoT sensors, automated systems, real-time data |
| **Excel Upload** | Templated spreadsheets for bulk data entry | Manual data entry, historical records, lab reports |

```
┌─────────────────────────────────────────────────────────────┐
│  DATA INPUT FLOW: API vs EXCEL                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                    ┌──────────────┐      │
│  │  API Call    │                    │ Excel Upload │      │
│  │  (JSON)      │                    │  (.xlsx)     │      │
│  └──────┬───────┘                    └──────┬───────┘      │
│         │                                   │              │
│         └──────────────┬────────────────────┘              │
│                        │                                   │
│                        ▼                                   │
│              ┌─────────────────┐                           │
│              │   Validation    │                           │
│              │   (Schema +     │                           │
│              │    Registry)    │                           │
│              └────────┬────────┘                           │
│                       │                                    │
│              ┌────────▼────────┐                           │
│              │    Storage      │                           │
│              │  (PostgreSQL +  │                           │
│              │      S3)        │                           │
│              └────────┬────────┘                           │
│                       │                                    │
│              ┌────────▼────────┐                           │
│              │  Gap Analysis   │                           │
│              │  (Progress %)   │                           │
│              └─────────────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

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

### 3.0 Data Structure Overview

The DMRV platform organizes data into two distinct phases:

**PHASE A: PROJECT CREATION** - One-time setup information about the CDR project
**PHASE B: DATA INJECTION (MRV)** - Ongoing measurement data for carbon removal quantification

```
┌─────────────────────────────────────────────────────────────────────┐
│              DATA STRUCTURE: PROJECT vs MRV DATA                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ PHASE A: PROJECT CREATION (One-Time Setup)                  │   │
│  │                                                              │   │
│  │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │   │
│  │ │ 1. GENERAL      │ │ 2. PROJECT      │ │ 3. FACILITIES   │ │   │
│  │ │    INFORMATION  │ │    DESIGN       │ │                 │ │   │
│  │ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤ │   │
│  │ │ • Project name  │ │ • Technology    │ │ • Site location │ │   │
│  │ │ • Legal entity  │ │ • Baseline      │ │ • Site ownership│ │   │
│  │ │ • Additionality │ │ • Monitoring    │ │ • Equipment     │ │   │
│  │ │ • Crediting     │ │   plan          │ │   specs         │ │   │
│  │ │   period        │ │ • QA/QC         │ │ • Operational   │ │   │
│  │ │ • Stakeholder   │ │   procedures    │ │   capacity      │ │   │
│  │ │   consultation  │ │                 │ │                 │ │   │
│  │ └─────────────────┘ └─────────────────┘ └─────────────────┘ │   │
│  │                                                              │   │
│  │ INPUT: API or Excel Upload                                   │   │
│  │ EVENT: project.created.v1                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ PHASE B: DATA INJECTION / MRV SUBMISSION (Ongoing)          │   │
│  │                                                              │   │
│  │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │   │
│  │ │ 1. LIFE CYCLE   │ │ 2. PROJECT      │ │ 3. GHG          │ │   │
│  │ │    ASSESSMENT   │ │    EMISSIONS    │ │    STATEMENTS   │ │   │
│  │ │    (LCA)        │ │                 │ │                 │ │   │
│  │ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤ │   │
│  │ │ • All CO₂e      │ │ • Scope 1       │ │ • Gross removal │ │   │
│  │ │   fluxes        │ │ • Scope 2       │ │ • Leakage       │ │   │
│  │ │ • System        │ │ • Scope 3       │ │   deduction     │ │   │
│  │ │   boundaries    │ │ • Energy use    │ │ • Buffer        │ │   │
│  │ │ • Upstream      │ │ • Transport     │ │   deduction     │ │   │
│  │ │   emissions     │ │ • Materials     │ │ • Net removal   │ │   │
│  │ └─────────────────┘ └─────────────────┘ └─────────────────┘ │   │
│  │                                                              │   │
│  │ ┌───────────────────────────────────────────────────────────┐│   │
│  │ │ 4. REMOVAL DATA                                           ││   │
│  │ ├───────────────────────────────────────────────────────────┤│   │
│  │ │ • Measurement methodology • Instrument calibration        ││   │
│  │ │ • Sensor data             • Data completeness             ││   │
│  │ │ • Lab analysis reports    • Data quality metrics          ││   │
│  │ └───────────────────────────────────────────────────────────┘│   │
│  │                                                              │   │
│  │ INPUT: API or Excel Upload                                   │   │
│  │ EVENT: mrv.submitted.v1                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 3.0.1 Expandable UI: Net CORC Visualization

The dashboard displays the final **Net CORC (Carbon Removal Credit)** at the top, with expandable sections showing formulas and required inputs for each component.

```
┌─────────────────────────────────────────────────────────────────────┐
│  EXPANDABLE UI: NET CORC CALCULATION                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ▼ NET CORC: 969 tCO₂e                         [FINAL RESULT]  │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │ FORMULA:                                                      │ │
│  │ ┌─────────────────────────────────────────────────────────┐   │ │
│  │ │ Net_CORC = Gross_Removal - Project_Emissions            │   │ │
│  │ │            - Leakage - Buffer_Contribution              │   │ │
│  │ │                                                         │   │ │
│  │ │ Net_CORC = 1200 - 50 - 60 - 121 = 969 tCO₂e            │   │ │
│  │ └─────────────────────────────────────────────────────────┘   │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                              │                                      │
│  ┌───────────────────────────┴───────────────────────────────────┐ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ ▶ 1. LIFE CYCLE ASSESSMENT (LCA)           [EXPAND +]   │  │ │
│  │  │   Overview of all CO₂e fluxes related to the project    │  │ │
│  │  │   Status: ✅ Complete | Data Source: API + Excel        │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                              │                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ ▼ 2. PROJECT EMISSIONS: 50 tCO₂e           [EXPANDED]   │  │ │
│  │  ├─────────────────────────────────────────────────────────┤  │ │
│  │  │                                                         │  │ │
│  │  │ FORMULA:                                                │  │ │
│  │  │ Project_Emissions = Scope1 + Scope2 + Scope3            │  │ │
│  │  │                   = 15 + 20 + 15 = 50 tCO₂e             │  │ │
│  │  │                                                         │  │ │
│  │  │ REQUIRED INPUTS:                                        │  │ │
│  │  │ ┌───────────────────────────────────────────────────┐   │  │ │
│  │  │ │ Field              │ Value  │ Source    │ Status  │   │  │ │
│  │  │ ├───────────────────────────────────────────────────┤   │  │ │
│  │  │ │ Scope 1 (Direct)   │ 15     │ API       │ ✅      │   │  │ │
│  │  │ │ Scope 2 (Energy)   │ 20     │ Excel     │ ✅      │   │  │ │
│  │  │ │ Scope 3 (Supply)   │ 15     │ API       │ ✅      │   │  │ │
│  │  │ │ Energy Usage (kWh) │ 50000  │ API       │ ✅      │   │  │ │
│  │  │ │ Transport (km)     │ 12000  │ Excel     │ ✅      │   │  │ │
│  │  │ └───────────────────────────────────────────────────┘   │  │ │
│  │  │                                                         │  │ │
│  │  │ [Upload Excel] [Submit via API]                         │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                              │                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ ▶ 3. GHG STATEMENTS                        [EXPAND +]   │  │ │
│  │  │   Gross removal, leakage, buffer calculations           │  │ │
│  │  │   Status: ✅ Complete | Gross: 1200 tCO₂e               │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                              │                                │ │
│  │  ┌─────────────────────────────────────────────────────────┐  │ │
│  │  │ ▶ 4. REMOVAL DATA                          [EXPAND +]   │  │ │
│  │  │   Measurement data, sensor readings, lab reports        │  │ │
│  │  │   Status: ⚠️ Pending 2 items                            │  │ │
│  │  └─────────────────────────────────────────────────────────┘  │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 3.0.2 Registry-Driven Data Injection Architecture

The data injection system is **configuration-driven**, allowing new registries and protocols to be added without code changes. Each registry defines its own tree structure of required data.

```
┌─────────────────────────────────────────────────────────────────────┐
│  FLEXIBLE REGISTRY ARCHITECTURE                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ REGISTRY CONFIGURATION (JSON/YAML)                          │   │
│  │                                                              │   │
│  │ Each registry defines:                                       │   │
│  │ • Tree structure of data nodes                              │   │
│  │ • Required inputs per node                                  │   │
│  │ • Formulas for calculations                                 │   │
│  │ • Validation rules                                          │   │
│  │ • Input methods (API spec, Excel template)                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ DYNAMIC UI GENERATION                                        │   │
│  │                                                              │   │
│  │ System reads registry config → Generates UI tree            │   │
│  │ No code changes needed for new registries!                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.0.3 Data Injection Tree Structure

Based on your diagram, here's the standardized tree structure that each registry defines:

```
┌─────────────────────────────────────────────────────────────────────┐
│  DATA INJECTION TREE (Generic Template)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────────┐                         │
│                    │    Project Name     │                         │
│                    │   (from Phase A)    │                         │
│                    └──────────┬──────────┘                         │
│                               │                                     │
│                               ▼                                     │
│                    ┌─────────────────────┐                         │
│                    │     Net CORC        │ ← Final calculated      │
│                    │   (Calculated)      │   value shown at top    │
│                    └──────────┬──────────┘                         │
│                               │                                     │
│              ┌────────────────┼────────────────┐                   │
│              │                │                │                    │
│              ▼                ▼                ▼                    │
│     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│     │ Removal Data │  │      -       │  │  Emits Data  │           │
│     │   (Input)    │  │  (Operator)  │  │   (Input)    │           │
│     └──────┬───────┘  └──────────────┘  └──────┬───────┘           │
│            │                                    │                   │
│      ┌─────┼─────┐                        ┌─────┼─────┐             │
│      │     │     │                        │     │     │             │
│      ▼     ▼     ▼                        ▼     ▼     ▼             │
│    ┌───┐ ┌───┐ ┌───┐                    ┌───┐ ┌───┐ ┌───┐          │
│    │#1 │ │#2 │ │#3 │                    │#1 │ │#2 │ │#3 │          │
│    └─┬─┘ └─┬─┘ └─┬─┘                    └─┬─┘ └─┬─┘ └─┬─┘          │
│      │     │     │                        │     │     │            │
│      ▼     ▼     ▼                        ▼     ▼     ▼            │
│   ┌──────────────────┐               ┌──────────────────┐          │
│   │ Required Data    │               │ Required Data    │          │
│   │ • API spec       │               │ • API spec       │          │
│   │ • Excel upload   │               │ • Excel upload   │          │
│   └──────────────────┘               └──────────────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.0.4 Registry Configuration Schema

Each registry is defined by a JSON/YAML configuration file:

```typescript
// Registry Configuration Schema
interface RegistryConfig {
  registry_id: string;                    // e.g., "verra", "puro", "isometric"
  registry_name: string;                  // Display name
  version: string;                        // Config version
  
  protocols: ProtocolConfig[];            // Available protocols/methodologies
}

interface ProtocolConfig {
  protocol_id: string;                    // e.g., "VM0042", "puro_biochar"
  protocol_name: string;                  // Display name
  version: string;                        // Protocol version
  
  // The tree structure defining Net CORC calculation
  net_corc_formula: FormulaNode;
  
  // Excel template for bulk upload
  excel_template: string;                 // Template file path
  
  // API endpoints
  api_endpoints: APIEndpointConfig[];
}

interface FormulaNode {
  node_id: string;                        // Unique identifier
  node_name: string;                      // Display name
  node_type: "calculated" | "input" | "operator";
  
  // For calculated nodes
  formula?: string;                       // e.g., "removal_data - emits_data"
  
  // For operator nodes
  operator?: "+" | "-" | "*" | "/";
  
  // For input nodes
  required_inputs?: InputField[];
  
  // Child nodes (tree structure)
  children?: FormulaNode[];
}

interface InputField {
  field_id: string;
  field_name: string;
  field_type: "number" | "string" | "file" | "array";
  unit?: string;                          // e.g., "tCO₂e", "kWh", "%"
  required: boolean;
  validation_rules?: ValidationRule[];
  input_methods: ("api" | "excel" | "upload")[];
  api_spec?: APIFieldSpec;
  excel_column?: string;
}
```

### 3.0.5 Example: Verra VM0042 Protocol Configuration

```yaml
# registries/verra/VM0042.yaml

registry_id: verra
registry_name: "Verra VCS"
version: "1.0"

protocols:
  - protocol_id: VM0042
    protocol_name: "Methodology for Improved Agricultural Land Management"
    version: "v2.0"
    
    # Net CORC Tree Structure
    net_corc_formula:
      node_id: net_corc
      node_name: "Net CORC"
      node_type: calculated
      formula: "removal_data - project_emissions - leakage - buffer"
      children:
        # Branch 1: Removal Data
        - node_id: removal_data
          node_name: "Removal Data"
          node_type: input
          required_inputs:
            - field_id: gross_removal
              field_name: "Gross CO₂ Removal"
              field_type: number
              unit: "tCO₂e"
              required: true
              input_methods: [api, excel]
              api_spec:
                endpoint: "/mrv/removal-data"
                method: POST
              excel_column: "B"
            
            - field_id: sensor_readings
              field_name: "Sensor Readings"
              field_type: array
              required: true
              input_methods: [api, excel]
            
            - field_id: calibration_cert
              field_name: "Calibration Certificate"
              field_type: file
              required: true
              input_methods: [upload]
            
            - field_id: lab_analysis
              field_name: "Lab Analysis Report"
              field_type: file
              required: true
              input_methods: [upload]
        
        # Operator
        - node_id: operator_subtract
          node_name: "-"
          node_type: operator
          operator: "-"
        
        # Branch 2: Project Emissions
        - node_id: project_emissions
          node_name: "Project Emissions"
          node_type: input
          required_inputs:
            - field_id: scope_1
              field_name: "Scope 1 Emissions"
              field_type: number
              unit: "tCO₂e"
              required: true
              input_methods: [api, excel]
            
            - field_id: scope_2
              field_name: "Scope 2 Emissions"
              field_type: number
              unit: "tCO₂e"
              required: true
              input_methods: [api, excel]
            
            - field_id: scope_3
              field_name: "Scope 3 Emissions"
              field_type: number
              unit: "tCO₂e"
              required: true
              input_methods: [api, excel]
        
        # Branch 3: Leakage
        - node_id: leakage
          node_name: "Leakage Deduction"
          node_type: calculated
          formula: "gross_removal * leakage_factor"
          required_inputs:
            - field_id: leakage_factor
              field_name: "Leakage Factor"
              field_type: number
              unit: "%"
              required: true
              validation_rules:
                - type: range
                  min: 0
                  max: 0.20
              input_methods: [api, excel]
        
        # Branch 4: Buffer
        - node_id: buffer
          node_name: "Buffer Pool"
          node_type: calculated
          formula: "(gross_removal - leakage) * buffer_rate"
          required_inputs:
            - field_id: buffer_rate
              field_name: "Buffer Rate"
              field_type: number
              unit: "%"
              required: true
              validation_rules:
                - type: range
                  min: 0.10
                  max: 0.25
              input_methods: [api, excel]
    
    # Excel template
    excel_template: "templates/verra_VM0042_v2.xlsx"
```

### 3.0.6 Example: Puro.earth Biochar Protocol Configuration

```yaml
# registries/puro/biochar.yaml

registry_id: puro
registry_name: "Puro.earth"
version: "1.0"

protocols:
  - protocol_id: puro_biochar
    protocol_name: "Biochar Carbon Removal"
    version: "v3.0"
    
    net_corc_formula:
      node_id: net_corc
      node_name: "Net CORC"
      node_type: calculated
      formula: "biochar_carbon - production_emissions - transport_emissions"
      children:
        # Branch 1: Biochar Carbon Content
        - node_id: biochar_carbon
          node_name: "Biochar Carbon Content"
          node_type: input
          required_inputs:
            - field_id: biochar_mass
              field_name: "Biochar Mass Produced"
              field_type: number
              unit: "tonnes"
              required: true
              input_methods: [api, excel]
            
            - field_id: carbon_content
              field_name: "Carbon Content (%)"
              field_type: number
              unit: "%"
              required: true
              validation_rules:
                - type: range
                  min: 0.50
                  max: 0.95
              input_methods: [api, excel]
            
            - field_id: h_c_ratio
              field_name: "H:C Molar Ratio"
              field_type: number
              required: true
              validation_rules:
                - type: max
                  value: 0.7
              input_methods: [api, excel]
            
            - field_id: lab_certificate
              field_name: "EBC/IBI Certificate"
              field_type: file
              required: true
              input_methods: [upload]
        
        - node_id: operator_subtract
          node_type: operator
          operator: "-"
        
        # Branch 2: Production Emissions
        - node_id: production_emissions
          node_name: "Production Emissions"
          node_type: input
          required_inputs:
            - field_id: pyrolysis_energy
              field_name: "Pyrolysis Energy"
              field_type: number
              unit: "kWh"
              required: true
              input_methods: [api, excel]
            
            - field_id: feedstock_transport
              field_name: "Feedstock Transport"
              field_type: number
              unit: "km"
              required: true
              input_methods: [api, excel]
            
            - field_id: feedstock_processing
              field_name: "Feedstock Processing"
              field_type: number
              unit: "tCO₂e"
              required: true
              input_methods: [api, excel]
        
        # Branch 3: Permanence
        - node_id: permanence
          node_name: "Permanence Factor"
          node_type: input
          required_inputs:
            - field_id: permanence_years
              field_name: "Permanence Period"
              field_type: number
              unit: "years"
              required: true
              validation_rules:
                - type: min
                  value: 100
              input_methods: [api, excel]
    
    excel_template: "templates/puro_biochar_v3.xlsx"
```

### 3.0.7 Example: Isometric Enhanced Weathering Protocol

```yaml
# registries/isometric/enhanced_weathering.yaml

registry_id: isometric
registry_name: "Isometric"
version: "1.0"

protocols:
  - protocol_id: iso_enhanced_weathering
    protocol_name: "Enhanced Rock Weathering"
    version: "v1.0"
    
    net_corc_formula:
      node_id: net_corc
      node_name: "Net CORC"
      node_type: calculated
      formula: "co2_sequestered - supply_chain_emissions - application_emissions"
      children:
        # Branch 1: CO2 Sequestered
        - node_id: co2_sequestered
          node_name: "CO₂ Sequestered"
          node_type: input
          required_inputs:
            - field_id: rock_mass
              field_name: "Rock Mass Applied"
              field_type: number
              unit: "tonnes"
              required: true
              input_methods: [api, excel]
            
            - field_id: rock_type
              field_name: "Rock Type"
              field_type: string
              required: true
              validation_rules:
                - type: enum
                  values: ["basalt", "olivine", "wollastonite"]
              input_methods: [api, excel]
            
            - field_id: weathering_rate
              field_name: "Measured Weathering Rate"
              field_type: number
              unit: "tCO₂/tonne rock"
              required: true
              input_methods: [api, excel]
            
            - field_id: soil_analysis
              field_name: "Soil Analysis Report"
              field_type: file
              required: true
              input_methods: [upload]
            
            - field_id: sensor_data
              field_name: "Continuous Sensor Data"
              field_type: array
              required: true
              input_methods: [api, excel]
        
        - node_id: operator_subtract
          node_type: operator
          operator: "-"
        
        # Branch 2: Supply Chain Emissions
        - node_id: supply_chain_emissions
          node_name: "Supply Chain Emissions"
          node_type: input
          required_inputs:
            - field_id: mining_emissions
              field_name: "Mining Emissions"
              field_type: number
              unit: "tCO₂e"
              required: true
              input_methods: [api, excel]
            
            - field_id: crushing_emissions
              field_name: "Crushing/Grinding Emissions"
              field_type: number
              unit: "tCO₂e"
              required: true
              input_methods: [api, excel]
            
            - field_id: transport_emissions
              field_name: "Transport Emissions"
              field_type: number
              unit: "tCO₂e"
              required: true
              input_methods: [api, excel]
        
        # Branch 3: Application Emissions
        - node_id: application_emissions
          node_name: "Application Emissions"
          node_type: input
          required_inputs:
            - field_id: spreading_emissions
              field_name: "Spreading Equipment Emissions"
              field_type: number
              unit: "tCO₂e"
              required: true
              input_methods: [api, excel]
    
    excel_template: "templates/isometric_erw_v1.xlsx"
```

### 3.0.8 Dynamic UI Tree Rendering

The system dynamically generates the UI based on the registry configuration:

```
┌─────────────────────────────────────────────────────────────────────┐
│  DYNAMIC UI: VERRA VM0042                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Project: Forest Carbon Project Alpha                               │
│  Registry: Verra (VCS) | Protocol: VM0042 v2.0                     │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ▼ Net CORC: 969 tCO₂e                         [CALCULATED]    │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │ Formula: removal_data - project_emissions - leakage - buffer  │ │
│  │        = 1200 - 50 - 60 - 121 = 969 tCO₂e                     │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│       │                                                             │
│  ┌────┴────────────────────────┬───────────────────────────────┐   │
│  │                             │                               │   │
│  │  ┌────────────────────┐    │    ┌────────────────────────┐ │   │
│  │  │ ▼ Removal Data     │    │    │ ▶ Project Emissions    │ │   │
│  │  │   1200 tCO₂e       │    │    │   50 tCO₂e             │ │   │
│  │  ├────────────────────┤    │    │   Status: ✅ Complete  │ │   │
│  │  │                    │   ─┼─   └────────────────────────┘ │   │
│  │  │ Required Inputs:   │    │                               │   │
│  │  │ ┌────────────────┐ │    │    ┌────────────────────────┐ │   │
│  │  │ │ Gross Removal  │ │    │    │ ▶ Leakage Deduction   │ │   │
│  │  │ │ 1200 tCO₂e ✅  │ │    │    │   60 tCO₂e (5%)       │ │   │
│  │  │ ├────────────────┤ │    │    │   Status: ✅ Complete  │ │   │
│  │  │ │ Sensor Data    │ │    │    └────────────────────────┘ │   │
│  │  │ │ 365 points ✅  │ │    │                               │   │
│  │  │ ├────────────────┤ │    │    ┌────────────────────────┐ │   │
│  │  │ │ Calibration    │ │    │    │ ▶ Buffer Pool         │ │   │
│  │  │ │ cert.pdf ✅    │ │    │    │   121 tCO₂e (15%)     │ │   │
│  │  │ ├────────────────┤ │    │    │   Status: ✅ Complete  │ │   │
│  │  │ │ Lab Analysis   │ │    │    └────────────────────────┘ │   │
│  │  │ │ ⚠️ Missing     │ │    │                               │   │
│  │  │ └────────────────┘ │    │                               │   │
│  │  │                    │    │                               │   │
│  │  │ [API] [Excel]      │    │                               │   │
│  │  │ [Upload Files]     │    │                               │   │
│  │  └────────────────────┘    │                               │   │
│  └─────────────────────────────┴───────────────────────────────┘   │
│                                                                     │
│  Progress: 87% Complete | Missing: Lab Analysis Report             │
│  [Save Draft] [Submit for Computation]                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.0.9 Adding a New Registry (No Code Changes Required)

To add a new registry or protocol:

```
┌─────────────────────────────────────────────────────────────────────┐
│  ADDING NEW REGISTRY: STEP-BY-STEP                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: Create Registry Configuration                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ /config/registries/new_registry/                             │   │
│  │   ├── registry.yaml          # Registry metadata             │   │
│  │   ├── protocol_v1.yaml       # Protocol tree definition      │   │
│  │   └── templates/                                             │   │
│  │       └── protocol_v1.xlsx   # Excel template                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  Step 2: Define the Net CORC Tree                                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Define root node (Net CORC formula)                        │   │
│  │ • Add branch nodes (Removal, Emissions, etc.)                │   │
│  │ • Specify required inputs per node                           │   │
│  │ • Set validation rules                                       │   │
│  │ • Configure input methods (API, Excel, Upload)               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  Step 3: Create Excel Template                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Map fields to Excel columns                                │   │
│  │ • Add validation dropdowns                                   │   │
│  │ • Include formula cells (read-only)                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  Step 4: Deploy Configuration                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ POST /api/v1/admin/registries                                │   │
│  │ {                                                            │   │
│  │   "registry_config_path": "/registries/new_registry/"        │   │
│  │ }                                                            │   │
│  │                                                              │   │
│  │ System automatically:                                        │   │
│  │ • Validates configuration                                    │   │
│  │ • Generates API endpoints                                    │   │
│  │ • Builds UI tree                                             │   │
│  │ • Makes registry available to projects                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ✅ New registry available - NO CODE DEPLOYMENT NEEDED!            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.0.10 Registry Configuration API

```typescript
// API for managing registry configurations

// List all available registries
GET /api/v1/registries
Response: {
  registries: [
    { id: "verra", name: "Verra VCS", protocols: ["VM0042", "VM0044", ...] },
    { id: "puro", name: "Puro.earth", protocols: ["biochar", "dac", ...] },
    { id: "isometric", name: "Isometric", protocols: ["enhanced_weathering", ...] }
  ]
}

// Get protocol tree structure (for UI rendering)
GET /api/v1/registries/{registry_id}/protocols/{protocol_id}/tree
Response: {
  protocol_id: "VM0042",
  protocol_name: "Methodology for Improved Agricultural Land Management",
  tree: {
    node_id: "net_corc",
    node_name: "Net CORC",
    formula: "removal_data - project_emissions - leakage - buffer",
    children: [
      {
        node_id: "removal_data",
        node_name: "Removal Data",
        required_inputs: [
          { field_id: "gross_removal", field_name: "Gross CO₂ Removal", ... },
          ...
        ]
      },
      ...
    ]
  }
}

// Download Excel template for a protocol
GET /api/v1/registries/{registry_id}/protocols/{protocol_id}/template
Response: (Excel file download)

// Add new registry (admin only)
POST /api/v1/admin/registries
Body: { config: {...} }

// Add new protocol to existing registry (admin only)
POST /api/v1/admin/registries/{registry_id}/protocols
Body: { protocol_config: {...} }
```

### 3.0.11 Life Cycle Assessment (LCA) - Detailed Structure

The LCA provides a comprehensive overview of all CO₂e fluxes and determines the components needed to certify the CDR project based on the selected registry protocol.

```
┌─────────────────────────────────────────────────────────────────────┐
│  LIFE CYCLE ASSESSMENT (LCA) - EXPANDABLE NODE                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PURPOSE:                                                           │
│  • Provides overview of ALL CO₂e fluxes related to the project     │
│  • Used to create removals (quantification of net removed CO₂e)    │
│  • Based on selected registry protocol (Verra/Puro/Isometric)      │
│  • Shows components needed to certify the CDR project              │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ REGISTRY: Verra (VM0042)                                      │ │
│  │ PROTOCOL: Enhanced Weathering v2.0                            │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  FORMULA (Registry-Specific):                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │ Net_CDR = Gross_CO2_Removal                                   │ │
│  │         - Upstream_Emissions                                   │ │
│  │         - Operational_Emissions                                │ │
│  │         - Downstream_Emissions                                 │ │
│  │         - Leakage                                              │ │
│  │         - Buffer_Pool_Contribution                             │ │
│  │                                                               │ │
│  │ Where:                                                        │ │
│  │ • Gross_CO2_Removal = Measured removal from CDR activity      │ │
│  │ • Upstream = Mining, processing, transport of materials       │ │
│  │ • Operational = Energy use during CDR operations              │ │
│  │ • Downstream = Disposal, end-of-life emissions                │ │
│  │ • Leakage = Unintended emissions outside boundary             │ │
│  │ • Buffer = Risk reserve (registry-defined %)                  │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  REQUIRED LCA COMPONENTS (Per Registry Protocol):                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │ ┌─────────────────────────────────────────────────────────┐   │ │
│  │ │ SYSTEM BOUNDARY DEFINITION                              │   │ │
│  │ ├─────────────────────────────────────────────────────────┤   │ │
│  │ │ Field                    │ Required │ Source    │ Status│   │ │
│  │ ├─────────────────────────────────────────────────────────┤   │ │
│  │ │ Boundary description     │ Yes      │ API       │ ✅    │   │ │
│  │ │ Included processes       │ Yes      │ Excel     │ ✅    │   │ │
│  │ │ Excluded processes       │ Yes      │ API       │ ✅    │   │ │
│  │ │ Justification            │ Yes      │ API       │ ✅    │   │ │
│  │ └─────────────────────────────────────────────────────────┘   │ │
│  │                                                               │ │
│  │ ┌─────────────────────────────────────────────────────────┐   │ │
│  │ │ UPSTREAM EMISSIONS                                      │   │ │
│  │ ├─────────────────────────────────────────────────────────┤   │ │
│  │ │ Field                    │ Required │ Source    │ Status│   │ │
│  │ ├─────────────────────────────────────────────────────────┤   │ │
│  │ │ Material extraction      │ Yes      │ Excel     │ ✅    │   │ │
│  │ │ Material processing      │ Yes      │ Excel     │ ✅    │   │ │
│  │ │ Material transport       │ Yes      │ API       │ ✅    │   │ │
│  │ │ Equipment manufacturing  │ Yes      │ Excel     │ ⚠️    │   │ │
│  │ └─────────────────────────────────────────────────────────┘   │ │
│  │                                                               │ │
│  │ ┌─────────────────────────────────────────────────────────┐   │ │
│  │ │ OPERATIONAL EMISSIONS                                   │   │ │
│  │ ├─────────────────────────────────────────────────────────┤   │ │
│  │ │ Field                    │ Required │ Source    │ Status│   │ │
│  │ ├─────────────────────────────────────────────────────────┤   │ │
│  │ │ Energy consumption       │ Yes      │ API       │ ✅    │   │ │
│  │ │ Fuel usage               │ Yes      │ API       │ ✅    │   │ │
│  │ │ On-site emissions        │ Yes      │ API       │ ✅    │   │ │
│  │ │ Waste generation         │ Cond.    │ Excel     │ N/A   │   │ │
│  │ └─────────────────────────────────────────────────────────┘   │ │
│  │                                                               │ │
│  │ ┌─────────────────────────────────────────────────────────┐   │ │
│  │ │ DOWNSTREAM EMISSIONS                                    │   │ │
│  │ ├─────────────────────────────────────────────────────────┤   │ │
│  │ │ Field                    │ Required │ Source    │ Status│   │ │
│  │ ├─────────────────────────────────────────────────────────┤   │ │
│  │ │ Product distribution     │ Yes      │ Excel     │ ✅    │   │ │
│  │ │ End-of-life treatment    │ Yes      │ API       │ ✅    │   │ │
│  │ │ Permanence assessment    │ Yes      │ API       │ ✅    │   │ │
│  │ └─────────────────────────────────────────────────────────┘   │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  DATA INPUT OPTIONS:                                                │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │ OPTION 1: API Integration                                     │ │
│  │ POST /api/v1/projects/{id}/mrv/lca                           │ │
│  │ {                                                             │ │
│  │   "system_boundary": { ... },                                 │ │
│  │   "upstream_emissions": { ... },                              │ │
│  │   "operational_emissions": { ... },                           │ │
│  │   "downstream_emissions": { ... }                             │ │
│  │ }                                                             │ │
│  │                                                               │ │
│  │ OPTION 2: Excel Upload                                        │ │
│  │ Template: LCA_Template_[Registry]_v2.xlsx                     │ │
│  │ Upload: POST /api/v1/projects/{id}/mrv/lca/upload             │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 3.1 Complete Credit Issuance Workflow

**Duration**: 4-8 weeks (typical)  
**Participants**: Tenant, Verifier, Registry, Platform  
**Outcome**: NFT minted on NEAR blockchain

```
┌─────────────────────────────────────────────────────────────────────┐
│         COMPLETE CREDIT ISSUANCE WORKFLOW (END-TO-END)             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ══════════════════════════════════════════════════════════════════ │
│  PHASE A: PROJECT CREATION (One-Time Setup)                         │
│  ══════════════════════════════════════════════════════════════════ │
│                                                                     │
│  WEEK 1-2: SETUP & PLANNING                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Tenant creates project                                    │   │
│  │ 2. Select target registry (Verra/Puro/Isometric)             │   │
│  │ 3. Choose methodology (e.g., VM0042 for Verra)               │   │
│  │ 4. Platform loads registry requirements                      │   │
│  │                                                              │   │
│  │ PROJECT CREATION DATA (3 Categories):                        │   │
│  │ ┌────────────────────────────────────────────────────────┐   │   │
│  │ │ 1. GENERAL INFORMATION                                 │   │   │
│  │ │    • Project name, description, legal entity           │   │   │
│  │ │    • Additionality demonstration                       │   │   │
│  │ │    • Crediting period start/end                        │   │   │
│  │ │    • Stakeholder consultation records                  │   │   │
│  │ │    • Regulatory surplus confirmation                   │   │   │
│  │ │    INPUT: API or Excel                                 │   │   │
│  │ │                                                        │   │   │
│  │ │ 2. PROJECT DESIGN                                      │   │   │
│  │ │    • Technology selection and justification            │   │   │
│  │ │    • Baseline scenario description                     │   │   │
│  │ │    • Monitoring plan details                           │   │   │
│  │ │    • QA/QC procedures documentation                    │   │   │
│  │ │    INPUT: API or Excel                                 │   │   │
│  │ │                                                        │   │   │
│  │ │ 3. FACILITIES                                          │   │   │
│  │ │    • Site location (GPS coordinates)                   │   │   │
│  │ │    • Site ownership documentation                      │   │   │
│  │ │    • Equipment specifications                          │   │   │
│  │ │    • Operational capacity claims                       │   │   │
│  │ │    INPUT: API or Excel                                 │   │   │
│  │ └────────────────────────────────────────────────────────┘   │   │
│  │                                                              │   │
│  │ 5. Gap analysis shows missing evidence/data                  │   │
│  │ 6. Project manager plans data collection                     │   │
│  │                                                              │   │
│  │ EVENT: project.created.v1                                    │   │
│  │ EVENT: mrv.registry.selected.v1                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│  ══════════════════════════════════════════════════════════════════ │
│  PHASE B: DATA INJECTION / MRV SUBMISSION (Ongoing)                 │
│  ══════════════════════════════════════════════════════════════════ │
│                          │                                          │
│                          ▼                                          │
│  WEEK 2-3: DATA COLLECTION (MRV Injection)                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Deploy sensors/measurement equipment                      │   │
│  │ 2. Collect monitoring data (6-12 months typical)             │   │
│  │                                                              │   │
│  │ MRV DATA INJECTION (4 Categories):                           │   │
│  │ ┌────────────────────────────────────────────────────────┐   │   │
│  │ │ 1. LIFE CYCLE ASSESSMENT (LCA)                         │   │   │
│  │ │    • All CO₂e fluxes related to project                │   │   │
│  │ │    • System boundary definition                        │   │   │
│  │ │    • Upstream/operational/downstream emissions         │   │   │
│  │ │    • Net removal quantification                        │   │   │
│  │ │    • Based on registry protocol requirements           │   │   │
│  │ │    INPUT: API or Excel                                 │   │   │
│  │ │                                                        │   │   │
│  │ │ 2. PROJECT EMISSIONS                                   │   │   │
│  │ │    • Scope 1 (direct) emissions                        │   │   │
│  │ │    • Scope 2 (energy) emissions                        │   │   │
│  │ │    • Scope 3 (supply chain) emissions                  │   │   │
│  │ │    • Energy consumption data                           │   │   │
│  │ │    • Transport emissions                               │   │   │
│  │ │    INPUT: API or Excel                                 │   │   │
│  │ │                                                        │   │   │
│  │ │ 3. GHG STATEMENTS                                      │   │   │
│  │ │    • Gross removal calculation                         │   │   │
│  │ │    • Leakage deduction                                 │   │   │
│  │ │    • Buffer pool contribution                          │   │   │
│  │ │    • Net removal statement                             │   │   │
│  │ │    INPUT: API or Excel                                 │   │   │
│  │ │                                                        │   │   │
│  │ │ 4. REMOVAL DATA                                        │   │   │
│  │ │    • Measurement methodology                           │   │   │
│  │ │    • Instrument calibration certificates               │   │   │
│  │ │    • Sensor readings and data logs                     │   │   │
│  │ │    • Lab analysis reports                              │   │   │
│  │ │    • Data completeness metrics                         │   │   │
│  │ │    • Data quality assessment                           │   │   │
│  │ │    INPUT: API or Excel                                 │   │   │
│  │ └────────────────────────────────────────────────────────┘   │   │
│  │                                                              │   │
│  │ 3. Validate against registry schema                          │   │
│  │ 4. Store in platform (PostgreSQL + S3)                       │   │
│  │                                                              │   │
│  │ STATUS: MRV Submission = "received"                          │   │
│  │ EVENT: mrv.submitted.v1                                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                          ▼                                          │
│  WEEK 3-4: COMPUTATION                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. MRV Engine selects registry-specific calculator           │   │
│  │ 2. Apply methodology formulas:                               │   │
│  │    - Calculate baseline emissions                            │   │
│  │    - Calculate project emissions (from injected data)        │   │
│  │    - Calculate gross removal (from removal data)             │   │
│  │    - Apply leakage deduction (e.g., 5%)                      │   │
│  │    - Apply buffer deduction (e.g., 15%)                      │   │
│  │ 3. Compute net tonnage (tCO2e) = NET CORC                    │   │
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
│  │ 2. Verifier reviews ALL categories:                          │   │
│  │                                                              │   │
│  │    PROJECT CREATION DATA (from Phase A):                     │   │
│  │    ✓ General Information (Additionality, etc.)               │   │
│  │    ✓ Project Design                                          │   │
│  │    ✓ Facilities                                              │   │
│  │                                                              │   │
│  │    MRV DATA (from Phase B):                                  │   │
│  │    ✓ Life Cycle Assessment (LCA)                             │   │
│  │    ✓ Project Emissions                                       │   │
│  │    ✓ GHG Statements                                          │   │
│  │    ✓ Removal Data                                            │   │
│  │                                                              │   │
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
│  │    - tonnage_co2e (NET CORC)                                 │   │
│  │    - vintage year                                            │   │
│  │ 3. Call NEAR smart contract mint() function                  │   │
│  │ 4. Wait for blockchain confirmation (~3 seconds)             │   │
│  │ 5. NEAR Indexer detects mint event                           │   │
│  │ 6. Update credit.credits table with token_id                 │   │
│  │                                                              │   │
│  │ EVENT: blockchain.nft.minted.v1                              │   │
│  │ STATUS: Credit = "active"                                    │   │
│  │ OUTCOME: ✅ NFT ISSUED (NET CORC: 969 tCO₂e)                 │   │
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

#### Step 2: Data Collection & MRV Submission (Data Injection)

**Actors**: Project Manager, MRV Analyst, IoT Sensors  
**Duration**: Ongoing (6-12 months typical monitoring period)  
**Criticality**: ⭐⭐⭐⭐⭐

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: DATA INJECTION (MRV SUBMISSION)                   │
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

### MRV Data Categories (4 Required Components)

The MRV submission requires data in 4 main categories. Each category shows the **Net CORC formula** contribution and required inputs.

```
┌─────────────────────────────────────────────────────────────────┐
│  MRV DATA INJECTION: 4 COMPONENTS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ NET CORC FORMULA (Displayed at Top of UI):              │   │
│  │                                                         │   │
│  │ Net_CORC = Gross_Removal - Project_Emissions            │   │
│  │            - Leakage - Buffer                           │   │
│  │          = [Removal Data] - [Project Emissions]         │   │
│  │            - [GHG Statements: Leakage + Buffer]         │   │
│  │                                                         │   │
│  │ All values derived from LCA framework                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ════════════════════════════╪══════════════════════════════   │
│                              ▼                                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. LIFE CYCLE ASSESSMENT (LCA)                          │   │
│  │    "Framework for all CO₂e flux quantification"         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ PURPOSE:                                                │   │
│  │ • Provides overview of ALL CO₂e fluxes                  │   │
│  │ • Used to create removals (net removed CO₂e)            │   │
│  │ • Based on selected registry protocol                   │   │
│  │ • Shows components needed to certify CDR project        │   │
│  │                                                         │   │
│  │ FORMULA:                                                │   │
│  │ LCA_Net = Gross_Removal - Upstream - Operational        │   │
│  │           - Downstream - Leakage - Buffer               │   │
│  │                                                         │   │
│  │ REQUIRED INPUTS (via API or Excel):                     │   │
│  │ • System boundary definition                            │   │
│  │ • Included/excluded processes                           │   │
│  │ • Upstream emissions (material, transport)              │   │
│  │ • Operational emissions (energy, fuel)                  │   │
│  │ • Downstream emissions (disposal)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 2. PROJECT EMISSIONS                                    │   │
│  │    "Emissions generated by the CDR project itself"      │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ FORMULA:                                                │   │
│  │ Project_Emissions = Scope1 + Scope2 + Scope3            │   │
│  │                                                         │   │
│  │ REQUIRED INPUTS (via API or Excel):                     │   │
│  │ • Scope 1 emissions (tCO₂e)                             │   │
│  │ • Scope 2 emissions (tCO₂e)                             │   │
│  │ • Scope 3 emissions (tCO₂e)                             │   │
│  │ • Energy consumption (kWh)                              │   │
│  │ • Fuel consumption (L/kg)                               │   │
│  │ • Transport distance (km)                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 3. GHG STATEMENTS                                       │   │
│  │    "Final carbon accounting declarations"               │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ FORMULA:                                                │   │
│  │ Net_Removal = Gross_Removal - Leakage - Buffer          │   │
│  │                                                         │   │
│  │ REQUIRED INPUTS (via API or Excel):                     │   │
│  │ • Gross removal (tCO₂e)                                 │   │
│  │ • Leakage factor (%)                                    │   │
│  │ • Buffer rate (%)                                       │   │
│  │ • Uncertainty assessment                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 4. REMOVAL DATA                                         │   │
│  │    "Evidence and measurements supporting claims"        │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ REQUIRED INPUTS (via API or Excel):                     │   │
│  │ • Measurement methodology                               │   │
│  │ • Sensor readings (array)                               │   │
│  │ • Calibration certificates (PDF upload)                 │   │
│  │ • Lab analysis reports (PDF upload)                     │   │
│  │ • Data completeness (%)                                 │   │
│  │ • Data quality score (0-100)                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Data Submission Flow (API):**

1. **Life Cycle Assessment Upload**
   ```typescript
   POST /api/v1/projects/{project_id}/mrv/lca
   {
     "system_boundary": {
       "description": "Enhanced weathering project",
       "included_processes": ["mining", "transport", "application"],
       "excluded_processes": ["end_consumer_use"]
     },
     "upstream_emissions": { "material": 25.5, "transport": 8.2 },
     "operational_emissions": { "energy": 15.0, "fuel": 5.5 },
     "downstream_emissions": { "disposal": 2.0 }
   }
   ```

2. **Project Emissions Upload**
   ```typescript
   POST /api/v1/projects/{project_id}/mrv/project-emissions
   {
     "scope_1": { "direct_emissions": 15.0, "fuel_combustion": 8.5 },
     "scope_2": { "electricity": 20.0, "heating": 5.0 },
     "scope_3": { "transport": 10.0, "materials": 5.0 }
   }
   ```

3. **GHG Statements Upload**
   ```typescript
   POST /api/v1/projects/{project_id}/mrv/ghg-statements
   {
     "gross_removal": 1200.0,
     "leakage_factor": 0.05,
     "buffer_rate": 0.15,
     "uncertainty_assessment": { "lower": 920.0, "upper": 1018.0 }
   }
   ```

4. **Removal Data Upload**
   ```typescript
   POST /api/v1/projects/{project_id}/mrv/removal-data
   {
     "measurement_methodology": "ISO 14064-2",
     "sensor_readings": [
       { "timestamp": "2024-01-01T12:00:00Z", "co2_removed": 100.5 },
       { "timestamp": "2024-01-02T12:00:00Z", "co2_removed": 102.3 }
     ],
     "data_completeness_percent": 98.5,
     "data_quality_score": 92
   }
   ```

5. **Excel Bulk Upload (Alternative)**
   ```typescript
   POST /api/v1/projects/{project_id}/mrv/upload
   Content-Type: multipart/form-data
   
   // Template: MRV_Data_Template_[Registry].xlsx
   // Contains sheets: LCA, Project_Emissions, GHG_Statements, Removal_Data
   ```

6. **Gap Analysis Check**
   ```typescript
   GET /api/v1/projects/{project_id}/mrv/gap-analysis
   
   Response:
   {
     "completeness_score": 78,
     "can_proceed_to_computation": false,
     "categories": {
       "lca": { "complete": true, "score": 100 },
       "project_emissions": { "complete": true, "score": 100 },
       "ghg_statements": { "complete": false, "score": 60 },
       "removal_data": { "complete": false, "score": 52 }
     },
     "missing_required_fields": [
       "ghg_statements.uncertainty_assessment",
       "removal_data.calibration_certificates"
     ]
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

### 5.1 Two-Phase Verification Process

The verification process covers data from both phases:
- **Phase A: Project Creation Data** (General, Project Design, Facilities)
- **Phase B: MRV Data Injection** (LCA, Project Emissions, GHG Statements, Removal Data)

**Purpose**: Independent validation before registry submission  
**Duration**: 2-4 weeks  
**Outcome**: Approved or Rejected with findings

```
┌─────────────────────────────────────────────────────────────┐
│  VERIFICATION CHECKLIST: 7 CATEGORIES                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ══════════════════════════════════════════════════════════ │
│  PHASE A: PROJECT CREATION DATA (3 Categories)             │
│  ══════════════════════════════════════════════════════════ │
│                                                             │
│  CATEGORY 1: GENERAL INFORMATION              [✓] PASSED   │
│  ├─ Project registration complete                          │
│  ├─ Legal entity verified                                  │
│  ├─ Additionality demonstrated                             │
│  ├─ Regulatory surplus confirmed                           │
│  ├─ Crediting period valid                                 │
│  ├─ No double-counting                                     │
│  └─ Stakeholder consultation complete                      │
│                                                             │
│  CATEGORY 2: PROJECT DESIGN                   [✓] PASSED   │
│  ├─ Technology selection appropriate                       │
│  ├─ Baseline scenario credible                             │
│  ├─ Monitoring plan adequate                               │
│  └─ QA/QC procedures defined                               │
│                                                             │
│  CATEGORY 3: FACILITIES                       [✓] PASSED   │
│  ├─ Site location accurate (GPS verified)                  │
│  ├─ Site ownership verified                                │
│  ├─ Equipment specifications documented                    │
│  ├─ Project boundaries defined                             │
│  └─ Operational capacity matches claims                    │
│                                                             │
│  ══════════════════════════════════════════════════════════ │
│  PHASE B: MRV DATA INJECTION (4 Categories)                │
│  ══════════════════════════════════════════════════════════ │
│                                                             │
│  CATEGORY 4: LIFE CYCLE ASSESSMENT (LCA)      [✓] PASSED   │
│  ├─ System boundaries clearly defined                      │
│  ├─ All CO₂e fluxes identified                             │
│  ├─ Upstream emissions included                            │
│  ├─ Operational emissions included                         │
│  ├─ Downstream emissions included                          │
│  ├─ Registry protocol requirements met                     │
│  └─ Net removal positive                                   │
│                                                             │
│  CATEGORY 5: PROJECT EMISSIONS                [✓] PASSED   │
│  ├─ Scope 1 emissions quantified                           │
│  ├─ Scope 2 emissions quantified                           │
│  ├─ Scope 3 emissions estimated                            │
│  ├─ Emission factors appropriate                           │
│  ├─ Activity data accurate                                 │
│  └─ All material sources identified                        │
│                                                             │
│  CATEGORY 6: GHG STATEMENTS                   [!] MINOR    │
│  ├─ Gross removal accurate                                 │
│  ├─ Leakage deduction applied correctly                    │
│  ├─ Buffer deduction applied correctly                     │
│  ├─ Net removal calculation correct                        │
│  └─ ⚠️ Update uncertainty analysis (non-blocking)          │
│                                                             │
│  CATEGORY 7: REMOVAL DATA                     [✓] PASSED   │
│  ├─ Measurement methodology approved                       │
│  ├─ Instrument calibration current                         │
│  ├─ Sensor data complete                                   │
│  ├─ Lab analysis reports verified                          │
│  ├─ Data completeness > 95%                                │
│  └─ Data quality score acceptable                          │
│                                                             │
│  ════════════════════════════════════════════               │
│  OVERALL RESULT: ✅ APPROVED WITH MINOR COMMENTS            │
│  Verified Net CORC: 969 tCO₂e                               │
│  ════════════════════════════════════════════               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.1.1 Expandable UI: Verification Node Structure

Each verification category in the UI shows an expandable node with formula and required inputs:

```
┌─────────────────────────────────────────────────────────────┐
│  VERIFICATION NODE: EXPANDABLE UI STRUCTURE                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ▼ GHG STATEMENTS                        [EXPANDED]    │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │                                                       │ │
│  │ STATUS: ⚠️ Minor issues | SCORE: 85/100              │ │
│  │                                                       │ │
│  │ FORMULA VERIFIED:                                     │ │
│  │ ┌─────────────────────────────────────────────────┐   │ │
│  │ │ Net_CORC = Gross_Removal - Leakage - Buffer     │   │ │
│  │ │          = 1200 - 60 - 171 = 969 tCO₂e          │   │ │
│  │ │                                                 │   │ │
│  │ │ Leakage  = 1200 × 5%  = 60 tCO₂e   ✅ Correct   │   │ │
│  │ │ Buffer   = 1140 × 15% = 171 tCO₂e  ✅ Correct   │   │ │
│  │ └─────────────────────────────────────────────────┘   │ │
│  │                                                       │ │
│  │ INPUT VALUES VERIFIED:                                │ │
│  │ ┌─────────────────────────────────────────────────┐   │ │
│  │ │ Input            │ Value  │ Source │ Verified  │   │ │
│  │ ├─────────────────────────────────────────────────┤   │ │
│  │ │ Gross removal    │ 1200   │ API    │ ✅ Pass   │   │ │
│  │ │ Leakage factor   │ 5%     │ Excel  │ ✅ Pass   │   │ │
│  │ │ Buffer rate      │ 15%    │ API    │ ✅ Pass   │   │ │
│  │ │ Uncertainty      │ ±8%    │ Excel  │ ⚠️ Review │   │ │
│  │ └─────────────────────────────────────────────────┘   │ │
│  │                                                       │ │
│  │ FINDINGS:                                             │ │
│  │ • ⚠️ Uncertainty analysis needs additional detail    │ │
│  │ • Recommendation: Expand Monte Carlo documentation   │ │
│  │                                                       │ │
│  │ [View Raw Data] [Download Report] [Request Changes]  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ▶ REMOVAL DATA                        [COLLAPSED]     │ │
│  │   Status: ✅ Passed | Score: 98/100                   │ │
│  │   Data completeness: 98.5% | Quality: 92/100          │ │
│  └───────────────────────────────────────────────────────┘ │
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

### Slide 3: Two-Phase Data Model
**Phase A: Project Creation (One-Time)**
- General Information (legal, additionality, crediting)
- Project Design (technology, baseline, monitoring)
- Facilities (location, equipment, capacity)

**Phase B: Data Injection (Ongoing MRV)**
- Life Cycle Assessment (LCA)
- Project Emissions
- GHG Statements
- Removal Data

### Slide 4: Life Cycle Assessment (LCA)
- Overview of ALL CO₂e fluxes
- Based on selected registry protocol
- Components needed to certify CDR project
- System boundaries, upstream, operational, downstream emissions

### Slide 5: Net CORC Calculation
- Formula: Net_CORC = Gross - Emissions - Leakage - Buffer
- Expandable UI showing each component
- Required inputs per node (API or Excel)
- Real-time gap analysis

### Slide 6: Input Methods
- **API Integration**: IoT sensors, automated systems
- **Excel Upload**: Manual entry, historical records
- Template per registry protocol
- Validation against registry schema

### Slide 7: 7-Category Verification
**Project Data (3 categories):**
1. General Information
2. Project Design
3. Facilities

**MRV Data (4 categories):**
4. Life Cycle Assessment
5. Project Emissions
6. GHG Statements
7. Removal Data

### Slide 8: Registry-First Approach
- Why Registry Selection Matters
- Different Requirements Per Registry
- Gap Analysis Process

### Slide 9: Blockchain Integration
- NEAR Protocol
- NFT Metadata (includes Net CORC)
- 3-Second Confirmation

### Slide 10: Hash Integrity Model
- `mrv_hash`: Registry-specific claim
- `evidence_hash`: Cross-registry detection
- Verifiable Chain of Custody

### Slide 11: Multi-Registry Scenarios
- Same Evidence, Different Credits
- Cross-Registry Deduplication
- Policy Options

### Slide 12: Error Handling & Recovery
- Circuit Breakers
- Retry Logic
- Saga Compensation

### Slide 13: Key Metrics & SLAs
- 99.9% API Availability
- < 30 Second Mint Latency
- < 5 Minute Registry Sync

---

## 11. Summary & Next Steps

### 11.1 Key Takeaways

✅ **Two-phase data model**: Project Creation (General, Design, Facilities) + Data Injection (LCA, Emissions, GHG, Removal)  
✅ **Configuration-driven registry system**: Add new registries/protocols via YAML config (no code changes)  
✅ **Dynamic tree structure**: Each registry defines its own Net CORC calculation tree  
✅ **Registry-first** approach ensures compliance from day one  
✅ **7-category verification** ensures credit integrity (3 project + 4 MRV categories)  
✅ **Expandable UI** shows Net CORC formula at top with drill-down to required inputs  
✅ **Dual input methods**: API integration and Excel upload for all data categories  
✅ **LCA framework** provides comprehensive CO₂e flux quantification based on registry protocol  
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

