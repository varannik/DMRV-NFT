# DMRV Dashboard Development Prompt

**Project**: DMRV SaaS Platform - User Dashboard  
**Framework**: Next.js 16 (App Router) with TypeScript  
**Target**: Production-ready dashboard for carbon credit issuance workflow

---

## 📚 Reference Documents (MUST READ FIRST)

Before implementing, thoroughly review these documents:

1. **Workflow Documentation**: `../../docs/architecture/COMPREHENSIVE_WORKFLOWS.md`
   - Complete 8-phase credit issuance workflow (Project Creation → NFT Minting)
   - Registry-first approach with gap analysis
   - 9-category verification process
   - Registry change management
   - Double-counting prevention

2. **Data Schema**: `./DATA_SCHEMA.md` (v2.0, 83% coverage)
   - 43 database entities with TypeScript interfaces
   - Redis cache patterns with tenant namespacing
   - API response schemas
   - State management schemas

3. **State Management**: `./STATE_MANAGEMENT.md` (44 categories)
   - Complete state management architecture
   - Zustand/React Query/React Hook Form recommendations
   - Real-time synchronization patterns
   - Multi-tenant isolation

---

## 🎨 Design Requirements

### Visual Style

**Overall Theme**: Modern, professional, blockchain-inspired with glassmorphism UI

1. **Animated Gradient Background**
   - Continuous animated gradient (subtle, professional colors)
   - Should not distract from content
   - Consider: Carbon/forest green → blue → purple gradient
   - Animation: Slow, smooth color transitions (5-10 second cycles)

2. **Glassmorphism Design System**
   - All menus, cards, modals, sidebars use glassmorphism effect
   - Properties:
     - Background: `rgba(255, 255, 255, 0.1)` to `rgba(255, 255, 255, 0.2)`
     - Backdrop blur: `blur(10px)` to `blur(20px)`
     - Border: `1px solid rgba(255, 255, 255, 0.2)`
     - Box shadow: Subtle inner and outer shadows
   - Reference: Modern macOS Big Sur / iOS design language

3. **Color Palette**
   - Primary: Carbon/forest green (#2D5016, #4A7C59)
   - Secondary: Blue (#3B82F6, #60A5FA)
   - Accent: Purple (#8B5CF6, #A78BFA)
   - Success: Green (#10B981)
   - Warning: Amber (#F59E0B)
   - Error: Red (#EF4444)
   - Text: High contrast white/light gray on dark backgrounds

---

## 📄 Page Structure

### 1. Landing Page (`/`)

**Reference**: https://charmindustrial.com

**Requirements**:
- Hero section with value proposition
- Features showcase (registry-first, blockchain-backed, multi-tenant)
- Use cases/case studies
- Call-to-action buttons (Sign In, Get Started)
- Footer with links
- **Design**: Clean, modern, professional SaaS landing page
- **Glassmorphism**: Apply to navigation bar, feature cards, CTA buttons

**Key Sections**:
- Hero: "Digital MRV for Carbon Credit Issuance"
- Features: Registry Integration, Blockchain Verification, Real-time Tracking
- How It Works: Visual workflow diagram (simplified version)
- Trust Indicators: Supported registries (Verra, Puro, Isometric logos)
- CTA: Sign In / Request Demo

---

### 2. Sign In Page (`/sign-in`)

**Requirements**:
- Email/password authentication
- SSO/SAML option (for enterprise tenants)
- MFA support (TOTP, WebAuthn)
- "Forgot Password" link
- "Sign Up" / "Request Access" link
- **Design**: Centered form, glassmorphism card
- **State Management**: Use `STATE_MANAGEMENT.md` #1 Authentication State

**Form Fields**:
- Email (required)
- Password (required)
- "Remember me" checkbox
- MFA code (conditional, shown after password)

**API Integration**:
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/mfa/verify`
- GET `/api/v1/auth/sso/{tenant_slug}` (for SSO tenants)

---

### 3. Dashboard (`/dashboard`)

**Layout**: Three-column layout with expandable sidebar

```
┌─────────────┬──────────────────────────────────────┬─────────────┐
│             │                                      │             │
│   SIDEBAR   │         MAIN CONTENT AREA            │  RIGHT      │
│  (Left)     │                                      │  SIDEBAR    │
│             │  ┌────────────────────────────────┐ │  (Steps)    │
│  - Projects │  │   PROJECT SELECTOR + BLOCKS     │ │             │
│  - MRV      │  │   (Top Section)                 │ │  Current    │
│  - Credits  │  └────────────────────────────────┘ │  Step: X    │
│  - Settings │                                      │             │
│             │  ┌────────────────────────────────┐ │  Remaining: │
│             │  │                                 │ │  - Step Y   │
│             │  │   REACTFLOW PROCESS VIEW       │ │  - Step Z   │
│             │  │   (Middle Section)              │ │             │
│             │  │                                 │ │             │
│             │  └────────────────────────────────┘ │             │
│             │                                      │             │
└─────────────┴──────────────────────────────────────┴─────────────┘
```

---

#### 3.1 Left Sidebar (Expandable)

**Requirements**:
- Collapsible/expandable (hamburger menu or toggle button)
- When collapsed: Show icons only
- When expanded: Show icons + labels
- **Glassmorphism**: Full glassmorphism effect
- **State Management**: Use `STATE_MANAGEMENT.md` #14 UI/UX State

**Navigation Items**:
- 🏠 Dashboard (overview)
- 📁 Projects (project list)
- 📊 MRV Submissions (MRV data)
- ✅ Verification (verification status)
- 🪙 Credits (NFT credits)
- ⚙️ Settings (tenant settings)
- 👤 Profile (user profile)

**Features**:
- Active route highlighting
- Badge notifications (e.g., "3 pending verifications")
- Multi-tenant switcher (if user has access to multiple tenants)
- User avatar + name at bottom

**Implementation**:
- Use Next.js App Router navigation
- Zustand store for sidebar state (expanded/collapsed)
- Responsive: Auto-collapse on mobile

---

#### 3.2 Top Section: Project Selector + Blockchain Blocks

**Reference**: https://mempool.space (blockchain block visualization)

**Concept**: Each MRV submission is a "block" in the DMRV chain. Show blocks horizontally, newest on top/left.

**Requirements**:

1. **Project Selector Dropdown** (Top-left)
   - Dropdown menu to select active project
   - Shows: Project name, status, registry type
   - **State Management**: Use `STATE_MANAGEMENT.md` #2 Project State

2. **Blockchain-Style Blocks Display** (Horizontal scroll or grid)
   - Each block represents an MRV submission
   - Blocks arranged left-to-right (newest first) or top-to-bottom
   - Visual design inspired by mempool.space:
     - Block-like cards with rounded corners
     - Block height/color indicates status:
       - 🟢 Green: Approved/Active
       - 🟡 Yellow: In Progress/Verification
       - 🔴 Red: Rejected/Failed
       - ⚪ Gray: Pending
     - Block shows:
       - Block number (sequence)
       - MRV submission ID (truncated)
       - Status badge
       - Timestamp
       - Registry type icon
   - **Glassmorphism**: Each block uses glassmorphism
   - **Interaction**: Click block to expand process flow below

3. **Current Block Indicator**
   - Highlight currently selected block
   - Show "Current Block" label
   - Visual connection to process flow below

**Data Source**:
- GET `/api/v1/projects/{project_id}/mrv/submissions`
- Real-time updates via WebSocket/SSE for new blocks
- **State Management**: Use `STATE_MANAGEMENT.md` #3 MRV Submission State

**Visual Design**:
```
┌─────────────────────────────────────────────────────────────┐
│ [Project: Forestry Project A ▼]  Current Block: #42        │
│                                                             │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐         │
│  │ #42│  │ #41│  │ #40│  │ #39│  │ #38│  │ #37│  ...      │
│  │ ✅ │  │ 🟡 │  │ ✅ │  │ ✅ │  │ 🔴 │  │ ✅ │         │
│  └────┘  └────┘  └────┘  └────┘  └────┘  └────┘         │
│  (selected)                                                │
└─────────────────────────────────────────────────────────────┘
```

---

#### 3.3 Middle Section: ReactFlow Process Visualization

**Requirements**:
- Use ReactFlow library for process visualization
- Show complete workflow from selected block
- **Workflow Source**: `COMPREHENSIVE_WORKFLOWS.md` Section 3 (8-phase workflow)

**Process Flow Structure** (Top to Bottom):

```
┌─────────────────────────────────────────────────────────────┐
│                    SELECTED BLOCK (MRV #42)                 │
│                    [Block Header Card]                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 0: REGISTRY SELECTION + GAP ANALYSIS                │
│  [Node: Registry Selected] → [Node: Gap Analysis Complete] │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: DATA INGESTION                                    │
│  [Node: MRV Data Received] → [Node: Data Validated]        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: MRV COMPUTATION                                   │
│  [Node: Computation Started] → [Node: Tonnage Calculated]  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: VERIFICATION (9 Categories)                       │
│  [Node: Verification Started]                              │
│    ├─ [Category 1: Project Setup]                          │
│    ├─ [Category 2: General]                                │
│    ├─ [Category 3: Project Design]                         │
│    ├─ [Category 4: Facilities]                             │
│    ├─ [Category 5: Carbon Accounting]                      │
│    ├─ [Category 6: LCA]                                    │
│    ├─ [Category 7: Project Emissions]                      │
│    ├─ [Category 8: GHG Statements]                          │
│    └─ [Category 9: Removal Data]                            │
│  [Node: Verification Approved]                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: CANONICAL HASHING                                 │
│  [Node: Hash Created] → [Node: mrv_hash Generated]         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 5: REGISTRY SUBMISSION                               │
│  [Node: Submitted to Registry] → [Node: Registry Approved] │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 6: NFT MINTING                                       │
│  [Node: Minting Started] → [Node: NFT Minted on NEAR]       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 7: ACTIVE CREDIT                                     │
│  [Node: Credit Active] → [Node: Available for Trading]     │
└─────────────────────────────────────────────────────────────┘
```

**Node States** (Visual Indicators):
- ✅ **Completed**: Green checkmark, solid border
- 🟡 **In Progress**: Yellow/orange, pulsing animation
- ⏳ **Pending**: Gray, dashed border
- ❌ **Failed**: Red X, error icon
- 🔒 **Blocked**: Lock icon, disabled appearance

**Interaction**:
- Click node to see details (modal or side panel)
- Hover to show tooltip with status, timestamp, user
- Zoom/pan controls (ReactFlow built-in)
- Auto-layout: Vertical flow with smart routing

**Data Source**:
- GET `/api/v1/mrv/submissions/{mrv_submission_id}/process`
- Real-time updates via WebSocket/SSE
- **State Management**: Use `STATE_MANAGEMENT.md` #8 Process/Workflow State

**Implementation**:
- Install: `npm install reactflow`
- Create custom node components for each phase
- Use ReactFlow's `useReactFlow` hook for programmatic control
- Implement auto-layout algorithm (dagre or elkjs)

---

#### 3.4 Block Chain Visualization (Below Process Flow)

**Requirements**:
- Show all blocks in chronological order (newest at top)
- Visual chain connecting blocks
- When new block added, animate into view
- **Glassmorphism**: Each block card uses glassmorphism

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  BLOCK CHAIN (All Submissions)                             │
│                                                             │
│  ┌────┐                                                     │
│  │ #42│ ← Newest (just added)                              │
│  │ ✅ │                                                     │
│  └────┘                                                     │
│    │                                                        │
│    ▼                                                        │
│  ┌────┐                                                     │
│  │ #41│                                                     │
│  │ 🟡 │                                                     │
│  └────┘                                                     │
│    │                                                        │
│    ▼                                                        │
│  ┌────┐                                                     │
│  │ #40│                                                     │
│  │ ✅ │                                                     │
│  └────┘                                                     │
│    │                                                        │
│    ▼                                                        │
│  ... (older blocks)                                         │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
- Infinite scroll or pagination for older blocks
- Filter by status (all, active, pending, failed)
- Search by MRV submission ID
- **State Management**: Use `STATE_MANAGEMENT.md` #3 MRV Submission State

---

#### 3.5 Right Sidebar: Process Steps Tracker

**Requirements**:
- Show current step and remaining steps
- Click step to focus/scroll to that step in ReactFlow
- **Glassmorphism**: Full glassmorphism card
- **State Management**: Use `STATE_MANAGEMENT.md` #8 Process/Workflow State

**Layout**:
```
┌─────────────────────────────┐
│   PROCESS STEPS             │
│                             │
│  ✅ Phase 0: Registry       │
│     Selected                │
│                             │
│  ✅ Phase 1: Data           │
│     Ingestion               │
│                             │
│  ✅ Phase 2: Computation    │
│                             │
│  🟡 Phase 3: Verification   │ ← Current Step (highlighted)
│     └─ Category 5/9 done    │
│                             │
│  ⏳ Phase 4: Hashing        │
│                             │
│  ⏳ Phase 5: Registry        │
│     Submission              │
│                             │
│  ⏳ Phase 6: NFT Minting     │
│                             │
│  ⏳ Phase 7: Active Credit   │
│                             │
│  ─────────────────────────  │
│                             │
│  Progress: 37.5% (3/8)      │
│  ETA: 2-3 weeks             │
└─────────────────────────────┘
```

**Features**:
- Click step to focus ReactFlow on that node
- Expandable sub-steps (e.g., 9 verification categories)
- Progress bar showing overall completion
- Estimated time remaining (based on workflow)
- Status indicators: ✅ Complete, 🟡 In Progress, ⏳ Pending, ❌ Failed

**Data Source**:
- GET `/api/v1/processes/{process_id}/steps`
- Real-time updates via WebSocket/SSE
- Calculate progress from process steps

---

## 🔄 Real-Time Updates

**Requirements**:
- WebSocket or Server-Sent Events (SSE) for real-time updates
- Update blocks, process flow, and step tracker in real-time
- Show notification badges for new events
- **State Management**: Use `STATE_MANAGEMENT.md` #13 Real-Time Updates State

**Events to Listen For**:
- `mrv.computed.v1` - Update computation node
- `mrv.approved.v1` - Update verification node
- `mrv.hash.created.v1` - Update hashing node
- `registry.approved.v1` - Update registry submission node
- `blockchain.nft.minted.v1` - Update NFT minting node
- `process.progress.v1` - Update step tracker

**Implementation**:
- Use React Query with WebSocket subscription
- Or use `useSWR` with `revalidateOnFocus: true` and polling
- Show toast notifications for important events

---

## 🎨 CSS Implementation Details

### Animated Gradient Background

```css
/* Global background */
body {
  background: linear-gradient(
    -45deg,
    #1a2e1a,  /* Dark green */
    #2d5016,  /* Forest green */
    #1e3a5f,  /* Dark blue */
    #4a148c   /* Dark purple */
  );
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
```

### Glassmorphism Utility Classes

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.5);
}

.glass-hover:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
```

### Apply Glassmorphism To:
- Left sidebar
- Right sidebar (steps tracker)
- Top project selector dropdown
- All block cards
- ReactFlow node cards
- Modals/dialogs
- Navigation bar
- Form inputs (subtle)

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "next": "^16.1.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "reactflow": "^11.10.0",  // Process visualization
    "zustand": "^4.5.0",      // State management
    "@tanstack/react-query": "^5.0.0",  // Server state
    "react-hook-form": "^7.50.0",  // Form management
    "zod": "^3.22.0",  // Validation
    "framer-motion": "^10.16.0",  // Animations
    "lucide-react": "^0.300.0",  // Icons
    "clsx": "^2.1.0",  // Conditional classes
    "tailwindcss": "^4.0.0",  // Styling
    "react-window": "^1.8.10"  // Virtualization for long lists
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0"
  }
}
```

---

## 🗂️ File Structure

```
apps/dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx  # Main dashboard
│   │   │   └── layout.tsx  # Dashboard layout with sidebars
│   │   └── page.tsx  # Landing page
│   ├── components/
│   │   ├── atoms/              # Basic building blocks
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Badge/
│   │   │   └── Icon/
│   │   ├── molecules/          # Composed components
│   │   │   ├── FormField/
│   │   │   ├── StatusBadge/
│   │   │   └── BlockHeader/
│   │   ├── organisms/          # Complex components
│   │   │   ├── BlockCard/
│   │   │   │   ├── BlockCard.tsx
│   │   │   │   ├── BlockCard.test.tsx
│   │   │   │   ├── BlockCard.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── ProcessNode/
│   │   │   └── Sidebar/
│   │   ├── templates/          # Page layouts
│   │   │   ├── DashboardLayout/
│   │   │   └── AuthLayout/
│   │   ├── layout/             # App-level layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── StepsTracker.tsx
│   │   ├── blocks/             # Block-related components
│   │   │   ├── BlockCard.tsx
│   │   │   ├── BlockChain.tsx
│   │   │   └── ProjectSelector.tsx
│   │   ├── process/            # Process flow components
│   │   │   ├── ProcessFlow.tsx  # ReactFlow component
│   │   │   ├── ProcessNode.tsx  # Custom node component
│   │   │   └── ProcessEdge.tsx  # Custom edge component
│   │   └── shared/             # Shared utilities
│   │       ├── GlassCard.tsx  # Reusable glassmorphism card
│   │       ├── ErrorBoundary.tsx
│   │       └── AnimatedBackground.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── endpoints.ts
│   │   ├── hooks/
│   │   │   ├── useProcessFlow.ts
│   │   │   ├── useBlockChain.ts
│   │   │   └── useWebSocket.ts
│   │   └── stores/
│   │       ├── sidebarStore.ts  # Zustand
│   │       ├── projectStore.ts
│   │       └── processStore.ts
│   └── types/
│       ├── process.ts
│       ├── blocks.ts
│       └── api.ts
├── public/
│   └── (assets)
└── styles/
    └── globals.css  # Gradient + glassmorphism styles
```

---

## 🏗️ Code Quality & Best Practices

### Component Organization Principles

**All UI components MUST follow these best practices:**

#### 1. TypeScript Interfaces & Type Safety

**Requirement**: Every component must have proper TypeScript interfaces for all props, state, and data structures.

**Example Structure**:
```typescript
// src/types/components.ts
export interface BlockCardProps {
  blockId: string
  mrvSubmissionId: string
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'failed'
  registryType: 'verra' | 'puro' | 'isometric' | 'eu_ets'
  timestamp: Date
  onClick?: (blockId: string) => void
  className?: string
}

export interface ProcessNodeData {
  phase: number
  phaseName: string
  status: 'completed' | 'in_progress' | 'pending' | 'failed'
  timestamp?: Date
  metadata?: Record<string, unknown>
}

// src/components/blocks/BlockCard.tsx
import { BlockCardProps } from '@/types/components'

export function BlockCard({ 
  blockId, 
  mrvSubmissionId, 
  status, 
  registryType, 
  timestamp, 
  onClick,
  className 
}: BlockCardProps) {
  // Component implementation
}
```

**Rules**:
- ✅ **NO `any` types** - Use `unknown` if type is truly unknown, then narrow
- ✅ **Strict TypeScript** - Enable `strict: true` in `tsconfig.json`
- ✅ **Shared types** - Define types in `src/types/` directory, import where needed
- ✅ **Generic components** - Use TypeScript generics for reusable components
- ✅ **Type inference** - Leverage TypeScript inference, but be explicit for public APIs

**Type Organization**:
```
src/types/
├── components.ts      # Component prop types
├── api.ts            # API request/response types (from DATA_SCHEMA.md)
├── process.ts        # Process workflow types
├── blocks.ts         # Block/MRV submission types
├── state.ts          # State management types (from STATE_MANAGEMENT.md)
└── index.ts          # Re-export all types
```

---

#### 2. Modularity & Component Architecture

**Requirement**: Components must be modular, reusable, and follow single responsibility principle.

**Component Hierarchy**:
```
Component Structure:
├── Atomic Components (src/components/atoms/)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   └── Icon.tsx
│
├── Molecular Components (src/components/molecules/)
│   ├── FormField.tsx (Input + Label + Error)
│   ├── StatusBadge.tsx (Badge + Icon)
│   └── BlockHeader.tsx (Title + Status + Timestamp)
│
├── Organism Components (src/components/organisms/)
│   ├── BlockCard.tsx (uses molecules)
│   ├── ProcessNode.tsx (uses molecules)
│   └── Sidebar.tsx (uses molecules)
│
└── Template Components (src/components/templates/)
    ├── DashboardLayout.tsx (uses organisms)
    └── AuthLayout.tsx (uses organisms)
```

**Modularity Rules**:
- ✅ **Single Responsibility** - Each component does ONE thing well
- ✅ **Composition over Inheritance** - Build complex components from simple ones
- ✅ **Props Interface** - Every component exports its props interface
- ✅ **Default Props** - Use default parameters or defaultProps for optional props
- ✅ **Controlled vs Uncontrolled** - Prefer controlled components (props-driven)
- ✅ **Separation of Concerns** - Separate presentation from logic (hooks)

**Example - Modular Component**:
```typescript
// src/components/atoms/Button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'glass glass-hover',
        `btn-${variant}`,
        `btn-${size}`,
        { 'btn-loading': isLoading },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}

// src/components/molecules/BlockCard.tsx (uses Button)
import { Button } from '@/components/atoms/Button'
import { StatusBadge } from '@/components/molecules/StatusBadge'

export interface BlockCardProps {
  block: Block
  onSelect: (blockId: string) => void
}

export function BlockCard({ block, onSelect }: BlockCardProps) {
  return (
    <div className="glass block-card">
      <StatusBadge status={block.status} />
      <Button onClick={() => onSelect(block.id)}>View Details</Button>
    </div>
  )
}
```

---

#### 3. Testing Requirements

**Requirement**: All components must have comprehensive test coverage.

**Testing Strategy**:
- ✅ **Unit Tests** - Test individual components in isolation
- ✅ **Integration Tests** - Test component interactions
- ✅ **Visual Regression Tests** - Test UI appearance (optional but recommended)
- ✅ **Accessibility Tests** - Test keyboard navigation, screen readers

**Testing Tools**:
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0"
  }
}
```

**Test File Structure**:
```
src/components/
├── blocks/
│   ├── BlockCard.tsx
│   ├── BlockCard.test.tsx      # Unit tests
│   └── BlockCard.stories.tsx   # Storybook (optional)
```

**Example Test**:
```typescript
// src/components/blocks/BlockCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlockCard } from './BlockCard'
import type { Block } from '@/types/blocks'

describe('BlockCard', () => {
  const mockBlock: Block = {
    id: 'block-1',
    mrvSubmissionId: 'mrv-123',
    status: 'approved',
    registryType: 'verra',
    timestamp: new Date('2024-01-15'),
  }

  it('renders block information correctly', () => {
    render(<BlockCard block={mockBlock} onSelect={vi.fn()} />)
    
    expect(screen.getByText('mrv-123')).toBeInTheDocument()
    expect(screen.getByText('approved')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    
    render(<BlockCard block={mockBlock} onSelect={onSelect} />)
    
    await user.click(screen.getByRole('button', { name: /view details/i }))
    
    expect(onSelect).toHaveBeenCalledWith('block-1')
  })

  it('applies correct status styling', () => {
    const { container } = render(
      <BlockCard block={mockBlock} onSelect={vi.fn()} />
    )
    
    expect(container.querySelector('.status-approved')).toBeInTheDocument()
  })

  it('is accessible via keyboard', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    
    render(<BlockCard block={mockBlock} onSelect={onSelect} />)
    
    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard('{Enter}')
    
    expect(onSelect).toHaveBeenCalled()
  })
})
```

**Test Coverage Requirements**:
- ✅ **Minimum 80% code coverage** for all components
- ✅ **100% coverage** for critical components (auth, payment, data submission)
- ✅ **Test all user interactions** (click, hover, keyboard navigation)
- ✅ **Test edge cases** (empty states, error states, loading states)
- ✅ **Test accessibility** (ARIA labels, keyboard navigation, screen reader)

---

#### 4. Programming Paradigms & Patterns

**Requirement**: Follow modern React and TypeScript best practices.

##### 4.1 Functional Components & Hooks

**Rules**:
- ✅ **Use functional components only** - No class components
- ✅ **Custom hooks for logic** - Extract reusable logic to hooks
- ✅ **Hooks naming** - Start with `use` prefix (e.g., `useBlockChain`, `useProcessFlow`)

**Example - Custom Hook**:
```typescript
// src/lib/hooks/useBlockChain.ts
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMRVSubmissions } from '@/lib/api/endpoints'
import type { Block, MRVSubmission } from '@/types/blocks'

export interface UseBlockChainOptions {
  projectId: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useBlockChain({ 
  projectId, 
  autoRefresh = true,
  refreshInterval = 5000 
}: UseBlockChainOptions) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['mrv-submissions', projectId],
    queryFn: () => getMRVSubmissions(projectId),
    refetchInterval: autoRefresh ? refreshInterval : false,
  })

  const blocks: Block[] = submissions?.map(submission => ({
    id: `block-${submission.mrv_submission_id}`,
    mrvSubmissionId: submission.mrv_submission_id,
    status: submission.status,
    registryType: submission.registry_type,
    timestamp: new Date(submission.received_at),
  })) ?? []

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) ?? null

  return {
    blocks,
    selectedBlock,
    selectedBlockId,
    setSelectedBlockId,
    isLoading,
    error,
  }
}
```

##### 4.2 State Management Patterns

**Rules**:
- ✅ **Local state** - Use `useState` for component-specific state
- ✅ **Server state** - Use React Query/TanStack Query (from `STATE_MANAGEMENT.md`)
- ✅ **Global state** - Use Zustand for shared application state
- ✅ **Form state** - Use React Hook Form for forms
- ✅ **Derived state** - Use `useMemo` for computed values

**Example - Zustand Store**:
```typescript
// src/lib/stores/sidebarStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SidebarState {
  isExpanded: boolean
  activeSection: string | null
  toggle: () => void
  expand: () => void
  collapse: () => void
  setActiveSection: (section: string | null) => void
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set) => ({
        isExpanded: true,
        activeSection: null,
        toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
        expand: () => set({ isExpanded: true }),
        collapse: () => set({ isExpanded: false }),
        setActiveSection: (section) => set({ activeSection: section }),
      }),
      {
        name: 'sidebar-storage', // localStorage key
      }
    ),
    { name: 'SidebarStore' } // Redux DevTools name
  )
)
```

##### 4.3 Error Handling & Loading States

**Rules**:
- ✅ **Error boundaries** - Use React Error Boundaries for component tree errors
- ✅ **Loading states** - Show skeleton loaders, not just spinners
- ✅ **Error states** - Show user-friendly error messages with retry options
- ✅ **Empty states** - Show helpful empty state messages

**Example - Error Boundary**:
```typescript
// src/components/shared/ErrorBoundary.tsx
'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    // Log to error reporting service (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="glass error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

##### 4.4 Performance Optimization

**Rules**:
- ✅ **React.memo** - Memoize expensive components
- ✅ **useMemo** - Memoize expensive computations
- ✅ **useCallback** - Memoize callback functions passed to children
- ✅ **Code splitting** - Use dynamic imports for large components
- ✅ **Virtualization** - Use `react-window` or `react-virtuoso` for long lists

**Example - Optimized Component**:
```typescript
// src/components/blocks/BlockCard.tsx
import { memo, useCallback } from 'react'
import type { Block } from '@/types/blocks'

interface BlockCardProps {
  block: Block
  onSelect: (blockId: string) => void
  isSelected: boolean
}

export const BlockCard = memo(function BlockCard({
  block,
  onSelect,
  isSelected,
}: BlockCardProps) {
  const handleClick = useCallback(() => {
    onSelect(block.id)
  }, [block.id, onSelect])

  return (
    <div
      className={clsx('glass block-card', { 'block-selected': isSelected })}
      onClick={handleClick}
    >
      {/* Component content */}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.block.id === nextProps.block.id &&
    prevProps.block.status === nextProps.block.status &&
    prevProps.isSelected === nextProps.isSelected
  )
})
```

---

#### 5. Component Documentation

**Requirement**: All components must be documented.

**Documentation Template**:
```typescript
/**
 * BlockCard Component
 * 
 * Displays a single MRV submission as a blockchain-style block card.
 * Used in the top section of the dashboard to show the chain of submissions.
 * 
 * @example
 * ```tsx
 * <BlockCard
 *   block={blockData}
 *   onSelect={(id) => console.log('Selected:', id)}
 *   isSelected={true}
 * />
 * ```
 * 
 * @param block - The block data to display
 * @param onSelect - Callback when block is clicked
 * @param isSelected - Whether this block is currently selected
 * 
 * @see {@link Block} for block data structure
 * @see {@link useBlockChain} for block chain management hook
 */
export function BlockCard({ block, onSelect, isSelected }: BlockCardProps) {
  // Implementation
}
```

---

#### 6. File Naming Conventions

**Rules**:
- ✅ **PascalCase** for component files: `BlockCard.tsx`
- ✅ **camelCase** for utility files: `formatDate.ts`
- ✅ **kebab-case** for CSS files: `block-card.module.css`
- ✅ **Test files**: `ComponentName.test.tsx`
- ✅ **Type files**: `types.ts` or `ComponentName.types.ts`

**Example Structure**:
```
src/components/blocks/
├── BlockCard.tsx              # Component
├── BlockCard.test.tsx          # Tests
├── BlockCard.types.ts         # Component-specific types
├── BlockCard.module.css        # Styles (if using CSS modules)
└── index.ts                   # Re-export
```

---

#### 7. Import Organization

**Rules**:
- ✅ **Group imports** - External → Internal → Types → Styles
- ✅ **Absolute imports** - Use `@/` alias for `src/` directory
- ✅ **Barrel exports** - Use `index.ts` files for clean imports

**Example**:
```typescript
// External dependencies
import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'

// Internal components
import { Button } from '@/components/atoms/Button'
import { StatusBadge } from '@/components/molecules/StatusBadge'

// Types
import type { Block, BlockCardProps } from '@/types/blocks'

// Styles
import styles from './BlockCard.module.css'
```

---

### Quick Reference: Component Development Checklist

**Before submitting any component for review, ensure:**

- [ ] **TypeScript**: All props have interfaces, no `any` types, strict mode enabled
- [ ] **Modularity**: Component follows atomic → molecular → organism hierarchy
- [ ] **Testing**: Unit tests written with minimum 80% coverage (100% for critical)
- [ ] **Documentation**: JSDoc comments for component and all public props
- [ ] **Performance**: Memoized if needed (React.memo, useMemo, useCallback)
- [ ] **Error Handling**: Loading states, error states, empty states implemented
- [ ] **Accessibility**: ARIA labels, keyboard navigation, screen reader tested
- [ ] **File Structure**: Proper naming (PascalCase), organized in correct directory
- [ ] **Imports**: Grouped correctly (external → internal → types → styles)
- [ ] **Code Review**: Self-reviewed against this checklist

---

## 🎯 Implementation Priority

### Phase 1: Foundation (Week 1)
1. ✅ Setup Next.js project structure
2. ✅ Implement animated gradient background
3. ✅ Create glassmorphism utility components
4. ✅ Build landing page
5. ✅ Build sign-in page

### Phase 2: Dashboard Layout (Week 2)
1. ✅ Create expandable left sidebar
2. ✅ Create right sidebar (steps tracker)
3. ✅ Implement project selector dropdown
4. ✅ Setup layout structure

### Phase 3: Block Visualization (Week 3)
1. ✅ Create block card component
2. ✅ Implement blockchain-style block display
3. ✅ Add block selection logic
4. ✅ Connect to API for MRV submissions

### Phase 4: Process Flow (Week 4)
1. ✅ Install and configure ReactFlow
2. ✅ Create custom node components for each phase
3. ✅ Implement process flow visualization
4. ✅ Add node interaction (click, hover, focus)

### Phase 5: Integration & Real-Time (Week 5)
1. ✅ Connect process flow to selected block
2. ✅ Implement WebSocket/SSE for real-time updates
3. ✅ Connect steps tracker to process flow
4. ✅ Add progress calculation and ETA

### Phase 6: Polish & Testing (Week 6)
1. ✅ Add animations and transitions
2. ✅ Responsive design (mobile/tablet)
3. ✅ Error handling and loading states
4. ✅ Performance optimization
5. ✅ **Write comprehensive tests** for all components (80%+ coverage)
6. ✅ **TypeScript strict mode** - Fix all type errors, add missing interfaces
7. ✅ **Code review** - Ensure all components follow best practices checklist
8. ✅ **Accessibility audit** - Test with keyboard, screen readers, fix issues
9. ✅ **Documentation** - Add JSDoc comments to all public components
10. ✅ **Performance audit** - Profile and optimize slow components

---

## 🔗 API Integration Points

### Authentication
- `POST /api/v1/auth/login` - Sign in
- `POST /api/v1/auth/mfa/verify` - MFA verification
- `GET /api/v1/auth/sso/{tenant_slug}` - SSO redirect

### Projects
- `GET /api/v1/projects` - List projects
- `GET /api/v1/projects/{id}` - Get project details
- `GET /api/v1/projects/{id}/mrv/submissions` - Get MRV submissions (blocks)

### Process Flow
- `GET /api/v1/mrv/submissions/{id}/process` - Get process status
- `GET /api/v1/processes/{id}` - Get process details
- `GET /api/v1/processes/{id}/steps` - Get process steps

### Real-Time
- WebSocket: `wss://api.dmrv.io/v1/events` (with auth token)
- Or SSE: `GET /api/v1/events/stream`

---

## ✅ Success Criteria

1. **Visual Design**
   - ✅ Animated gradient background implemented
   - ✅ All UI elements use glassmorphism
   - ✅ Consistent color palette throughout
   - ✅ Professional, modern appearance

2. **Functionality**
   - ✅ Landing page matches charmindustrial.com quality
   - ✅ Sign-in works with email/password + MFA
   - ✅ Dashboard shows project blocks like mempool.space
   - ✅ Process flow visualizes 8-phase workflow accurately
   - ✅ Steps tracker syncs with process flow
   - ✅ Real-time updates work correctly

3. **User Experience**
   - ✅ Smooth animations and transitions
   - ✅ Responsive design (mobile, tablet, desktop)
   - ✅ Loading states and error handling
   - ✅ Intuitive navigation and interactions

4. **Code Quality & Best Practices**
   - ✅ **TypeScript strict mode** - No `any` types, proper interfaces for all components
   - ✅ **Modular architecture** - Atomic → Molecular → Organism → Template hierarchy
   - ✅ **Comprehensive testing** - Minimum 80% coverage, 100% for critical components
   - ✅ **Component documentation** - JSDoc comments for all public components
   - ✅ **Performance optimization** - React.memo, useMemo, useCallback, code splitting
   - ✅ **Error handling** - Error boundaries, loading states, empty states
   - ✅ **Follows STATE_MANAGEMENT.md patterns** - Zustand, React Query, React Hook Form
   - ✅ **Uses DATA_SCHEMA.md types** - All API types imported from schema
   - ✅ **Implements COMPREHENSIVE_WORKFLOWS.md workflow** - Accurate 8-phase process
   - ✅ **Clean code structure** - Proper file naming, import organization, barrel exports
   - ✅ **Accessibility** - WCAG 2.1 AA compliance, keyboard navigation, screen readers

---

## 📝 Notes

- **TypeScript Configuration**: Ensure `tsconfig.json` has `strict: true` enabled
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noImplicitAny": true,
      "strictNullChecks": true,
      "strictFunctionTypes": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true
    }
  }
  ```

- **Performance**: Use React.memo for block cards, virtualize long lists with react-window
- **Accessibility**: Ensure WCAG 2.1 AA compliance (keyboard navigation, screen readers, ARIA labels)
- **Testing**: Write unit tests for critical components (blocks, process flow, authentication)
- **Documentation**: Document component props with JSDoc, maintain README for each component directory
- **Code Reviews**: All components must pass code review checklist:
  - ✅ TypeScript interfaces defined
  - ✅ Tests written and passing
  - ✅ Accessibility tested
  - ✅ Performance optimized
  - ✅ Documentation complete

---

**End of Development Prompt**

