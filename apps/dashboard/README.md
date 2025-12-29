# DMRV Platform - User Dashboard

Next.js-based user dashboard for the DMRV (Digital Monitoring, Reporting, and Verification) SaaS platform.

## Overview

This dashboard provides a complete user interface for managing carbon removal projects, submitting MRV data, tracking verification workflows, managing carbon credit NFTs, and monitoring credit issuance processes.

Based on: `docs/architecture/COMPREHENSIVE_WORKFLOWS.md`

## Quick Start

```bash
# Development
npm run dev

# Build for production
npm build

# Start production server
npm start

# Lint
npm run lint
```

Then open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Dashboard routes (with shared layout)
│   │   ├── dashboard/        # Main dashboard (overview)
│   │   ├── projects/         # Project management
│   │   ├── mrv/              # MRV submission workflows
│   │   ├── verification/     # Verification tracking
│   │   ├── credits/          # Credit (NFT) management
│   │   ├── processes/        # Long-running process tracking
│   │   ├── billing/          # Billing and subscriptions
│   │   └── settings/         # Settings and configuration
│   ├── api/                  # API routes (if needed)
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing/redirect page
├── components/
│   ├── layout/               # Layout components (sidebar, header, etc.)
│   ├── projects/             # Project-specific components
│   ├── mrv/                  # MRV workflow components
│   ├── verification/         # Verification components
│   ├── credits/              # Credit/NFT components
│   ├── processes/            # Process tracking components
│   └── shared/               # Shared/reusable components
├── lib/
│   ├── api/                  # API client and request utilities
│   ├── hooks/                # Custom React hooks
│   └── utils/                # Utility functions
└── types/                    # TypeScript type definitions
```

## Key Features

### 1. Dashboard (Main Overview)
- **Credit Lifecycle Pipeline**: Visual representation of MRV → Verification → Registry → NFT flow
- **Key Metrics**: Active projects, total credits issued, pending verifications
- **Recent Activity**: Latest submissions, approvals, and transactions
- **Quick Actions**: Create project, submit MRV data, view credits

### 2. Projects
- **Project List**: All carbon removal projects
- **Project Details**: Project metadata, location, registry selection
- **Registry Selection**: Choose target registry (Verra, Puro, Isometric)
- **Gap Analysis**: Real-time completeness score and missing requirements
- **Registry Change Management**: Change registry with impact assessment

### 3. MRV Submissions
- **Data Submission**: Upload sensor data, lab reports, evidence artifacts
- **Gap Analysis**: Check completeness against registry requirements
- **Computation Status**: Track MRV computation progress
- **Submission History**: View all MRV submissions and their status

### 4. Verification
- **9-Category Checklist**: Visual progress through verification categories
  1. Project Setup
  2. General (Additionality)
  3. Project Design
  4. Facilities
  5. Carbon Accounting
  6. Life Cycle Assessment
  7. Project Emissions
  8. GHG Statements
  9. Removal Data
- **Verifier Dashboard**: For accredited verifiers
- **Clarification Requests**: Handle verifier questions
- **Verification Reports**: Download and review reports

### 5. Credits (NFTs)
- **Credit List**: All issued carbon credit NFTs
- **NFT Details**: Token ID, registry serial, tonnage, mrv_hash, evidence_hash
- **NEAR Blockchain Info**: Transaction hash, block height, owner
- **Transfer/Retire**: Manage credit lifecycle
- **Market Data**: Pricing, trading volume

### 6. Processes
- **Long-Running Workflows**: Track credit issuance saga
- **Process Status**: Visual progress bars and status indicators
- **Step Details**: Computation → Verification → Hashing → Registry → Minting
- **Error Handling**: View failures and retry options

### 7. Billing
- **Subscription Plans**: Free, Professional, Enterprise
- **Usage Metrics**: Credits issued, API calls, storage
- **Invoices**: Download past invoices
- **Payment Methods**: Manage payment information

### 8. Settings
- **Tenant Settings**: Organization name, logo, contact info
- **User Management**: Invite users, assign roles
- **API Keys**: Generate and manage API keys
- **Webhook Configuration**: Set up event notifications

## API Integration

### API Client (`lib/api/`)

The dashboard connects to the backend API Gateway:

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Example usage
import { apiClient } from '@/lib/api/client';

const projects = await apiClient.get('/projects');
const project = await apiClient.post('/projects', { name: 'New Project' });
```

### Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/projects` | GET, POST | List and create projects |
| `/projects/{id}` | GET, PUT | Get and update project |
| `/projects/{id}/registry` | PUT | Change registry |
| `/projects/{id}/mrv` | GET, POST | MRV submissions |
| `/projects/{id}/mrv/gap-analysis` | GET | Gap analysis |
| `/verification/{id}` | GET, PUT | Verification workflow |
| `/credits` | GET | List credits |
| `/credits/{id}` | GET | Get credit details |
| `/processes` | GET | List processes |

## Authentication

Uses JWT-based authentication:

```typescript
// lib/auth/
- Session management
- Token refresh
- Role-based access control (RBAC)
- Multi-tenant isolation
```

## Multi-Tenancy

All requests include tenant context:
- Tenant switching (for admin users)
- Tenant-specific data isolation
- Tenant branding and customization

## Registry-First Approach

The dashboard implements the **registry-first** workflow:

1. **Registry Selection**: User selects target registry (Verra, Puro, Isometric)
2. **Gap Analysis**: Real-time completeness check
3. **Guided Data Collection**: Show exactly what's missing
4. **Registry-Specific Computation**: Different methodologies per registry
5. **Registry Change Management**: Allow changes at any stage with impact assessment

### Registry Change UI

```
Current Registry: Verra (VM0042)
Status: Verified ✓

[Change Registry] button
  │
  └─> Modal shows:
      - Impact assessment
      - Work that will be lost
      - Time and cost estimates
      - Alternative: Keep both registries
```

## Double-Counting Prevention

The UI enforces strict single-registry issuance:

- **Exploratory Mode**: Users can compare multiple registries
- **Warning System**: Clear alerts when attempting multi-registry issuance
- **Evidence Hash Display**: Show when same evidence used across registries
- **Compliance Indicators**: Visual indicators for compliance status

## Theme & Styling

- **Design System**: Tailwind CSS + shadcn/ui components
- **Color Scheme**: Green/blue theme for carbon/climate focus
- **Responsive**: Mobile-first design
- **Accessibility**: WCAG 2.1 AA compliant

## Environment Variables

Create `.env.local`:

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Authentication
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id

# NEAR
NEXT_PUBLIC_NEAR_NETWORK=testnet
NEXT_PUBLIC_NEAR_CONTRACT_ID=your-contract.testnet

# Feature Flags
NEXT_PUBLIC_ENABLE_REGISTRY_CHANGE=true
NEXT_PUBLIC_ENABLE_MULTI_REGISTRY_COMPARISON=true
```

## Development

### Adding a New Page

```bash
# Create page directory
mkdir -p src/app/\(dashboard\)/my-page

# Create page component
touch src/app/\(dashboard\)/my-page/page.tsx
```

```typescript
// src/app/(dashboard)/my-page/page.tsx
export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
    </div>
  );
}
```

### Adding a New Component

```bash
# Create component file
touch src/components/my-component/MyComponent.tsx
```

```typescript
// src/components/my-component/MyComponent.tsx
export function MyComponent() {
  return <div>My Component</div>;
}
```

## Testing

```bash
# Run tests (when configured)
npm test

# E2E tests with Playwright
npm run test:e2e
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build Docker image
docker build -t dmrv-dashboard .

# Run container
docker run -p 3000:3000 dmrv-dashboard
```

## Related Documentation

- **Architecture**: `../../docs/architecture/COMPREHENSIVE_WORKFLOWS.md`
- **API Specs**: `../../docs/api/README.md`
- **Development Guide**: `../../docs/development/README.md`
- **Main Architecture**: `../../dmrv_saa_s_architecture_near_nft_design.md`

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (to be added)
- **State Management**: React Context + Hooks
- **Data Fetching**: SWR or TanStack Query (to be added)
- **Forms**: React Hook Form (to be added)
- **Validation**: Zod (to be added)

## Next Steps

1. **Install UI Components**:
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button card dialog table
   ```

2. **Add Data Fetching**:
   ```bash
   npm install swr
   # or
   npm install @tanstack/react-query
   ```

3. **Add Forms & Validation**:
   ```bash
   npm install react-hook-form zod @hookform/resolvers
   ```

4. **Add Charts**:
   ```bash
   npm install recharts
   ```

5. **Add Authentication**:
   ```bash
   npm install @auth0/nextjs-auth0
   # or
   npm install next-auth
   ```

## Contributing

See root repository CONTRIBUTING.md for guidelines.

## License

See root repository LICENSE.
