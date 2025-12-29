# Dashboard Quick Start Guide

## ✅ Project Initialized Successfully!

Your Next.js dashboard has been created at: `apps/dashboard/`

## 📁 Created Structure

```
apps/dashboard/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Main dashboard routes
│   │   │   ├── dashboard/        # Overview page
│   │   │   ├── projects/         # Project management
│   │   │   ├── mrv/              # MRV submissions
│   │   │   ├── verification/     # Verification workflow
│   │   │   ├── credits/          # Credit NFT management
│   │   │   ├── processes/        # Process tracking
│   │   │   ├── billing/          # Billing & subscriptions
│   │   │   └── settings/         # Settings
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Landing page
│   ├── components/               # React components
│   │   ├── layout/              # Layout components
│   │   ├── projects/            # Project components
│   │   ├── mrv/                 # MRV components
│   │   ├── verification/        # Verification components
│   │   ├── credits/             # Credit components
│   │   ├── processes/           # Process components
│   │   └── shared/              # Shared/reusable components
│   ├── lib/
│   │   ├── api/                 # API client
│   │   ├── hooks/               # Custom React hooks
│   │   └── utils/               # Utility functions
│   └── types/                   # TypeScript types
├── public/                      # Static assets
├── README.md                    # Comprehensive documentation
├── package.json
└── tsconfig.json
```

## 🚀 Run the Dashboard

```bash
# Navigate to dashboard
cd apps/dashboard

# Start development server
npm run dev
```

Then open: **http://localhost:3000**

## 📋 Next Steps

### 1. Install shadcn/ui Components (Recommended)

```bash
cd apps/dashboard
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

Then add components:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add badge
npx shadcn@latest add progress
npx shadcn@latest add tabs
```

### 2. Install Data Fetching Library

**Option A: SWR (Recommended for Next.js)**
```bash
npm install swr
```

**Option B: TanStack Query**
```bash
npm install @tanstack/react-query
```

### 3. Install Form Handling

```bash
npm install react-hook-form zod @hookform/resolvers
```

### 4. Install Charts

```bash
npm install recharts
```

### 5. Install Date Utilities

```bash
npm install date-fns
```

### 6. Setup Environment Variables

Create `.env.local`:

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# NEAR
NEXT_PUBLIC_NEAR_NETWORK=testnet
NEXT_PUBLIC_NEAR_CONTRACT_ID=your-contract.testnet

# Feature Flags
NEXT_PUBLIC_ENABLE_REGISTRY_CHANGE=true
```

## 🎨 Design System

The dashboard uses:
- **Tailwind CSS v4** for styling
- **shadcn/ui** for components (to be installed)
- **Green/blue theme** for carbon/climate focus
- **Responsive design** (mobile-first)

## 🔗 Backend Integration

The dashboard will connect to:
- **API Gateway**: `../../services/api-gateway/`
- **Shared Types**: `../../shared/types/` or `../../types/`
- **Auth Library**: `../../shared/auth/`

## 📖 Key Pages to Build

Based on `docs/architecture/COMPREHENSIVE_WORKFLOWS.md`:

1. **Dashboard** (`/dashboard`)
   - Credit lifecycle pipeline visualization
   - Key metrics (projects, credits, verifications)
   - Recent activity feed
   - Quick actions

2. **Projects** (`/projects`)
   - Project list with filters
   - Project details
   - Registry selection with gap analysis
   - Registry change management

3. **MRV Submissions** (`/mrv`)
   - Data submission form
   - Evidence upload
   - Gap analysis results
   - Computation status

4. **Verification** (`/verification`)
   - 9-category checklist
   - Verification status
   - Clarification requests
   - Verification reports

5. **Credits** (`/credits`)
   - Credit list
   - NFT details (token ID, registry serial, hashes)
   - NEAR blockchain info
   - Transfer/retire actions

6. **Processes** (`/processes`)
   - Long-running workflow tracking
   - Process status with progress bars
   - Step-by-step details
   - Error handling and retry

7. **Billing** (`/billing`)
   - Subscription plans
   - Usage metrics
   - Invoices
   - Payment methods

8. **Settings** (`/settings`)
   - Tenant settings
   - User management
   - API keys
   - Webhooks

## 🎯 Implementation Priority

Start with these pages first:

1. **Dashboard** (overview) - Week 1
2. **Projects** - Week 2-3
3. **MRV Submissions** - Week 4-5
4. **Verification** - Week 6-7
5. **Credits** - Week 8-9
6. **Processes** - Week 10
7. **Billing & Settings** - Week 11-12

## 📚 Documentation

- **Full Dashboard README**: `README.md`
- **Comprehensive Workflows**: `../../docs/architecture/COMPREHENSIVE_WORKFLOWS.md`
- **Architecture**: `../../dmrv_saa_s_architecture_near_nft_design.md`
- **API Specs**: `../../docs/api/README.md`
- **Development Guide**: `../../docs/development/README.md`

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Type checking
npx tsc --noEmit         # Check TypeScript errors
```

## ✨ Features to Implement

### Registry-First Approach
- Registry selection with real-time gap analysis
- Registry change management with impact assessment
- Multi-registry comparison (exploratory mode)

### Double-Counting Prevention
- Evidence hash display
- Warning system for multi-registry attempts
- Compliance indicators

### Credit Lifecycle Pipeline
- Visual workflow representation
- Status tracking
- Real-time updates

### Verification Workflow
- 9-category checklist with progress
- Clarification request handling
- Document uploads

### NFT Management
- NEAR blockchain integration
- Token metadata display
- Transfer and retirement

## 🎉 You're Ready to Build!

Start by creating your first page:

```bash
cd apps/dashboard

# Edit the dashboard page
code src/app/(dashboard)/dashboard/page.tsx
```

Then visit: http://localhost:3000/dashboard

Happy coding! 🚀

