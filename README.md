# DMRV SaaS Platform

**Digital Monitoring, Reporting, and Verification (DMRV) for Carbon Credits**

This repository contains the source code for the DMRV SaaS platform, an enterprise-grade solution for transparent and automated carbon credit lifecycle management. It integrates IoT data ingestion, verifiable methodology engines, and blockchain-based credit issuance.

## Architecture

This project is structured as a **Monorepo** to ensure consistency across backend services, frontend applications, and shared libraries.

-   **Backend**: NestJS (Microservices)
-   **Frontend**: Next.js (React)
-   **Blockchain**: NEAR Protocol (Rust Smart Contracts)
-   **Infrastructure**: Kubernetes, Terraform
-   **Monorepo Tools**: TurboRepo, pnpm

## Getting Started

### Prerequisites

Ensure you have the following installed:

-   **Node.js** (v18+)
-   **pnpm** (v8+)
-   **Docker & Docker Compose**
-   **Rust & Cargo** (for Smart Contract development)
-   **NEAR CLI** (`npm install -g near-cli`)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repo-url>
    cd dmrv-platform
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Set up environment variables:
    ```bash
    cp .env.example .env
    # Update .env with your local credentials
    ```

### Running Locally

Start the development environment (databases, queues) using Docker:

```bash
docker-compose up -d
```

Start all applications and services in development mode:

```bash
pnpm dev
```

## Project Structure

```text
dmrv-platform/
├── apps/               # Frontend applications (Admin, Portal, Marketplace)
├── services/           # Backend microservices (Project, Credit, MRV Engine)
├── contracts/          # NEAR smart contracts (Rust)
├── libs/               # Shared libraries (DTOs, Common logic)
├── infrastructure/     # Terraform, K8s manifests
├── docs/               # Architecture docs & ADRs
└── tools/              # Build configurations
```

For a detailed breakdown of the folder structure, see [docs/adr/001-monorepo.md](./docs/adr/001-monorepo.md) (coming soon) or refer to the project structure documentation.

## Development Workflow

We follow strict version control guidelines to ensure code quality and history cleanliness.

👉 **Can't push code?** Read our **[Git Best Practices & Workflow](./GIT_BEST_PRACTICES.md)** before contributing.

### Key Rules
1.  **Branching**: `feat/feature-name`, `fix/bug-name`. Never push to `main` directly.
2.  **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/). Example: `feat(auth): login endpoint`.
3.  **PRs**: All changes must go through a Pull Request.

## Key Commands

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start all apps/services in watch mode |
| `pnpm build` | Build all projects |
| `pnpm test` | Run unit tests across the workspace |
| `pnpm lint` | Lint all files |
| `pnpm clean` | Remove `node_modules` and build artifacts |

---

*Copyright © 2025 DMRV Platform. All rights reserved.*
