# DMRV SaaS Platform - Development Guide

This guide provides step-by-step instructions, guidelines, and best practices for developing the DMRV SaaS platform.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Development Phases](#development-phases)
4. [Implementation Roadmap](#implementation-roadmap)
5. [Development Workflow](#development-workflow)
6. [Best Practices](#best-practices)
7. [Testing Strategy](#testing-strategy)
8. [Code Standards](#code-standards)
9. [Dependencies & Tools](#dependencies--tools)
10. [Troubleshooting](#troubleshooting)

---

## Development Setup

### Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **TypeScript**: v5.0+
- **PostgreSQL**: v14+
- **Redis**: v7+
- **Docker & Docker Compose**: For local infrastructure
- **Terraform**: v1.5+ (for infrastructure)
- **NEAR CLI**: Latest version
- **AWS CLI**: v2+ (for cloud resources)
- **Git**: Latest version

### Initial Setup Steps

1. **Clone and Navigate**
   ```bash
   cd DMRV-NFT
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies (if any)
   npm install
   
   # Install service dependencies
   cd services/api-gateway && npm install
   cd ../tenant-service && npm install
   # Repeat for each service
   ```

3. **Environment Configuration**
   ```bash
   # Copy example env files
   cp .env.example .env
   cp services/*/.env.example services/*/.env
   
   # Configure environment variables
   # See Environment Variables section below
   ```

4. **Database Setup**
   ```bash
   # Start local PostgreSQL with Docker
   docker-compose up -d postgres redis
   
   # Run migrations
   npm run migrate:up
   ```

5. **Start Development Services**
   ```bash
   # Start all services in development mode
   npm run dev
   
   # Or start individual services
   npm run dev:api-gateway
   npm run dev:tenant-service
   ```

### Environment Variables

Key environment variables to configure:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dmrv
REDIS_URL=redis://localhost:6379

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
EVENTBRIDGE_BUS_NAME=dmrv-events

# NEAR Blockchain
NEAR_NETWORK=testnet
NEAR_ACCOUNT_ID=your-account.testnet
NEAR_PRIVATE_KEY=your-private-key
NEAR_CONTRACT_ID=your-contract.testnet

# Auth
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=24h
OAuth_CLIENT_ID=your-client-id
OAuth_CLIENT_SECRET=your-client-secret

# Multi-tenancy
TENANT_ISOLATION_MODE=row_level_security

# Feature Flags
FEATURE_FLAGS_ENABLED=true
```

---

## Project Structure

```
DMRV-NFT/
├── services/              # Microservices
│   ├── api-gateway/      # API Gateway service
│   ├── tenant-service/   # Tenant management
│   ├── user-service/     # User management
│   ├── project-service/  # Project management
│   ├── mrv-engine/       # MRV computation
│   ├── verifier-service/ # Verification workflow
│   ├── hashing-service/  # Canonical hashing
│   ├── credit-service/   # Credit lifecycle
│   ├── blockchain-submitter/ # NEAR integration
│   └── ...               # Other services
├── shared/               # Shared libraries
│   ├── auth/            # Authentication utilities
│   ├── events/          # Event definitions
│   ├── types/           # TypeScript types
│   └── validation/      # Validation schemas
├── smart-contracts/     # NEAR smart contracts
│   └── nft-contract/    # NFT contract (Rust)
├── infrastructure/      # Infrastructure as code
│   ├── terraform/       # Terraform modules
│   ├── kubernetes/      # K8s manifests
│   └── docker-compose/  # Local development
├── docs/                # Documentation
└── tests/               # E2E and load tests
```

---

## Development Phases

### Phase 1: Foundation (Weeks 1-4)

**Goal**: Set up core infrastructure and basic services

#### Week 1: Infrastructure & Setup
- [ ] Set up development environment
- [ ] Configure Docker Compose for local services
- [ ] Set up PostgreSQL with RLS
- [ ] Configure Redis for caching/rate limiting
- [ ] Set up AWS EventBridge (local mock or dev account)
- [ ] Initialize Terraform modules
- [ ] Set up CI/CD pipeline basics

#### Week 2: Core Services - Tenant & User
- [ ] Implement Tenant Service
  - [ ] Tenant CRUD operations
  - [ ] Tenant settings management
  - [ ] Row-level security policies
- [ ] Implement User Service
  - [ ] User CRUD operations
  - [ ] Role-based access control (RBAC)
  - [ ] Authentication (JWT)
  - [ ] User invitation flow
- [ ] Implement API Gateway
  - [ ] Request routing
  - [ ] Authentication middleware
  - [ ] Tenant context injection
  - [ ] Rate limiting

#### Week 3: Project & MRV Foundation
- [ ] Implement Project Service
  - [ ] Project CRUD
  - [ ] Methodology management
  - [ ] Project-project relationships
- [ ] Implement MRV Ingestion Service
  - [ ] Data validation
  - [ ] Schema validation
  - [ ] Data storage
- [ ] Set up event bus integration
  - [ ] Event publishing
  - [ ] Event consumption
  - [ ] Event store

#### Week 4: Testing & Documentation
- [ ] Unit tests for core services
- [ ] Integration tests
- [ ] API documentation (OpenAPI)
- [ ] Development documentation

### Phase 2: MRV Processing (Weeks 5-8)

**Goal**: Complete MRV computation and verification

#### Week 5: MRV Engine
- [ ] Implement MRV Engine
  - [ ] Methodology calculation engine
  - [ ] Baseline comparison logic
  - [ ] Leakage adjustments
  - [ ] Tonnage computation
- [ ] Implement methodology plugins
- [ ] Add calculation validation

#### Week 6: Verification Framework
- [ ] Implement Verifier Service
  - [ ] 9-category verification checklist
  - [ ] Verification workflow state machine
  - [ ] Verifier user management
  - [ ] Verification report generation
- [ ] Implement automated pre-checks
- [ ] Build verification UI/workflow

#### Week 7: Hashing & Integrity
- [ ] Implement Hashing Service
  - [ ] Canonical JSON serialization
  - [ ] SHA-256 hash generation
  - [ ] Hash verification
- [ ] Implement cross-registry deduplication
- [ ] Add hash integrity checks

#### Week 8: Testing & Refinement
- [ ] End-to-end MRV flow testing
- [ ] Verification workflow testing
- [ ] Performance testing
- [ ] Bug fixes and refinements

### Phase 3: Registry Integration (Weeks 9-12)

**Goal**: Integrate with carbon registries

#### Week 9: Registry Adapter Pattern
- [ ] Design registry adapter interface
- [ ] Implement base adapter class
- [ ] Error handling and retry logic
- [ ] Circuit breaker implementation

#### Week 10: Verra Integration
- [ ] Implement Verra adapter
  - [ ] API client
  - [ ] Data transformation
  - [ ] Submission flow
  - [ ] Status polling
- [ ] Test with Verra sandbox

#### Week 11: Additional Registries
- [ ] Implement Puro.earth adapter
- [ ] Implement Isometric adapter
- [ ] Implement EU ETS adapter (if applicable)
- [ ] Registry health monitoring

#### Week 12: Registry Testing
- [ ] Integration testing with registries
- [ ] Error scenario testing
- [ ] Performance optimization
- [ ] Documentation

### Phase 4: Blockchain Integration (Weeks 13-16)

**Goal**: NEAR Protocol integration

#### Week 13: Smart Contract Development
- [ ] Set up NEAR development environment
- [ ] Implement NFT contract (Rust)
  - [ ] Mint function
  - [ ] Transfer function
  - [ ] Retire function
  - [ ] Split/merge functions
- [ ] Contract testing
- [ ] Deploy to testnet

#### Week 14: Blockchain Submitter
- [ ] Implement Blockchain Submitter service
  - [ ] NEAR RPC client
  - [ ] Transaction building
  - [ ] Transaction signing (HSM integration)
  - [ ] Transaction monitoring
- [ ] Batch minting support
- [ ] Error handling and retries

#### Week 15: NEAR Indexer
- [ ] Implement NEAR Indexer service
  - [ ] Chain event listening
  - [ ] Event parsing
  - [ ] Event publishing to EventBridge
- [ ] Handle reorgs and missed blocks
- [ ] Indexer health monitoring

#### Week 16: Blockchain Testing
- [ ] End-to-end minting flow
- [ ] Transfer and retirement testing
- [ ] Batch operation testing
- [ ] Performance testing
- [ ] Security audit preparation

### Phase 5: Credit Lifecycle (Weeks 17-20)

**Goal**: Complete credit management

#### Week 17: Credit Service
- [ ] Implement Credit Service
  - [ ] Credit state management
  - [ ] Credit queries
  - [ ] Credit metadata management
- [ ] Vintage and expiry management
- [ ] Buffer pool tracking

#### Week 18: Retirement Flow
- [ ] Implement retirement workflow
- [ ] Retirement certificate generation
- [ ] Registry retirement sync
- [ ] Retirement reporting

#### Week 19: Batch Operations
- [ ] Batch minting API
- [ ] Batch retirement API
- [ ] Batch status tracking
- [ ] Batch error handling

#### Week 20: Credit Features
- [ ] Credit fractionalization
- [ ] Credit merging
- [ ] Credit transfer tracking
- [ ] Credit history/audit trail

### Phase 6: SaaS Features (Weeks 21-24)

**Goal**: Multi-tenant SaaS capabilities

#### Week 21: Billing & Subscription
- [ ] Implement Billing Service
  - [ ] Subscription management
  - [ ] Usage metering
  - [ ] Invoice generation
  - [ ] Payment processing integration
- [ ] Quota enforcement
- [ ] Billing event integration

#### Week 22: Feature Entitlements
- [ ] Feature flag system
- [ ] Plan-based entitlements
- [ ] Feature access control
- [ ] Entitlement API

#### Week 23: SSO & Enterprise Auth
- [ ] SAML 2.0 implementation
- [ ] OIDC implementation
- [ ] SCIM provisioning
- [ ] SSO configuration UI

#### Week 24: Webhooks
- [ ] Webhook service
- [ ] Webhook delivery with retries
- [ ] Webhook signature verification
- [ ] Webhook management API

### Phase 7: Advanced Features (Weeks 25-28)

**Goal**: Event-driven architecture and advanced patterns

#### Week 25: Event Schema Registry
- [ ] Schema registry implementation
- [ ] Schema validation
- [ ] Schema versioning
- [ ] Compatibility checking

#### Week 26: Saga Pattern
- [ ] Saga Coordinator Service
- [ ] Credit issuance saga
- [ ] Retirement saga
- [ ] Compensation flows

#### Week 27: Process Tracking
- [ ] Process Service
- [ ] Long-running process tracking
- [ ] Process status API
- [ ] Progress notifications

#### Week 28: Event Replay
- [ ] Event store implementation
- [ ] Replay service
- [ ] Snapshot/checkpoint system
- [ ] Recovery procedures

### Phase 8: Security & Compliance (Weeks 29-32)

**Goal**: Security hardening and compliance

#### Week 29: Security Hardening
- [ ] HSM integration for keys
- [ ] Multi-sig setup
- [ ] Key rotation automation
- [ ] Security audit logging

#### Week 30: Access Control
- [ ] Fine-grained permissions
- [ ] API key management
- [ ] Session management
- [ ] Security headers

#### Week 31: Compliance Features
- [ ] Audit log service
- [ ] GDPR compliance features
- [ ] Data retention policies
- [ ] Compliance reporting

#### Week 32: Security Testing
- [ ] Penetration testing
- [ ] Vulnerability scanning
- [ ] Security review
- [ ] Remediation

### Phase 9: Observability & Operations (Weeks 33-36)

**Goal**: Monitoring, logging, and operations

#### Week 33: Observability Stack
- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] Centralized logging (ELK/CloudWatch)
- [ ] Distributed tracing (Jaeger/X-Ray)

#### Week 34: Alerting & SLOs
- [ ] Alert rules configuration
- [ ] SLO monitoring
- [ ] PagerDuty/OpsGenie integration
- [ ] Runbook creation

#### Week 35: Disaster Recovery
- [ ] Multi-region setup
- [ ] Backup automation
- [ ] Failover procedures
- [ ] DR testing

#### Week 36: Performance Optimization
- [ ] Database query optimization
- [ ] Caching strategy
- [ ] API performance tuning
- [ ] Load testing and optimization

### Phase 10: Testing & Launch Prep (Weeks 37-40)

**Goal**: Comprehensive testing and launch preparation

#### Week 37: Integration Testing
- [ ] End-to-end test suite
- [ ] Integration test scenarios
- [ ] Test data management
- [ ] Test environment setup

#### Week 38: Load & Chaos Testing
- [ ] Load testing scenarios
- [ ] Chaos engineering tests
- [ ] Performance benchmarking
- [ ] Capacity planning

#### Week 39: Documentation & Training
- [ ] API documentation completion
- [ ] Developer guides
- [ ] Operator runbooks
- [ ] User training materials

#### Week 40: Launch Preparation
- [ ] Production infrastructure setup
- [ ] Security review
- [ ] Compliance verification
- [ ] Launch checklist completion
- [ ] Go-live planning

---

## Implementation Roadmap

### Priority 1: Core Platform (Must Have)
1. Tenant & User Management
2. Project Management
3. MRV Ingestion & Computation
4. Basic Verification
5. Hashing Service
6. Single Registry Integration (Verra)
7. NEAR Smart Contract
8. Basic NFT Minting
9. Credit Service (basic)
10. API Gateway with Auth

### Priority 2: Essential Features (Should Have)
1. Complete Verification Framework (9 categories)
2. Multiple Registry Adapters
3. Retirement Flow
4. Batch Operations
5. Billing & Subscriptions
6. Event-Driven Architecture
7. Basic Observability

### Priority 3: Advanced Features (Nice to Have)
1. SSO/SAML
2. Webhooks
3. Saga Pattern
4. Process Tracking
5. Event Replay
6. Advanced Observability
7. Multi-region DR

---

## Development Workflow

### Branch Strategy

```
main          # Production-ready code
├── develop   # Integration branch
├── feature/* # Feature branches
├── bugfix/*  # Bug fix branches
└── release/* # Release preparation
```

### Git Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/service-name-feature
   ```

2. **Development**
   - Write code following standards
   - Write tests
   - Update documentation

3. **Commit**
   ```bash
   git commit -m "feat(service-name): add feature description"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/)

4. **Push and Create PR**
   ```bash
   git push origin feature/service-name-feature
   # Create PR in GitHub/GitLab
   ```

5. **Code Review**
   - At least one approval required
   - CI checks must pass
   - Address review comments

6. **Merge**
   - Squash and merge to `develop`
   - Delete feature branch

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat(verifier-service): implement 9-category verification
fix(blockchain-submitter): handle NEAR RPC timeouts
docs(api): update OpenAPI schema for credit endpoints
```

---

## Best Practices

### Code Organization

1. **Service Structure**
   ```
   service-name/
   ├── src/
   │   ├── config/        # Configuration
   │   ├── controllers/   # Request handlers
   │   ├── services/      # Business logic
   │   ├── repositories/  # Data access
   │   ├── models/        # Data models
   │   ├── middleware/    # Express middleware
   │   ├── events/        # Event handlers
   │   ├── utils/         # Utilities
   │   └── index.ts       # Entry point
   ├── tests/
   │   ├── unit/
   │   └── integration/
   ├── migrations/        # Database migrations
   └── package.json
   ```

2. **Naming Conventions**
   - Files: `kebab-case.ts`
   - Classes: `PascalCase`
   - Functions/Variables: `camelCase`
   - Constants: `UPPER_SNAKE_CASE`
   - Types/Interfaces: `PascalCase` with `I` prefix for interfaces

3. **Error Handling**
   ```typescript
   // Use custom error classes
   class ValidationError extends Error {
     constructor(message: string, public field: string) {
       super(message);
       this.name = 'ValidationError';
     }
   }
   
   // Always handle errors
   try {
     await operation();
   } catch (error) {
     logger.error('Operation failed', { error, context });
     throw new ServiceError('User-friendly message', error);
   }
   ```

4. **Logging**
   ```typescript
   // Use structured logging
   logger.info('User created', {
     userId: user.id,
     tenantId: user.tenantId,
     timestamp: new Date().toISOString()
   });
   
   logger.error('Operation failed', {
     error: error.message,
     stack: error.stack,
     context: { userId, operation }
   });
   ```

5. **Type Safety**
   ```typescript
   // Always use TypeScript types
   interface Credit {
     id: string;
     tokenId: string;
     mrvHash: string;
     tonnage: number;
     status: CreditStatus;
   }
   
   // Use type guards
   function isCredit(obj: unknown): obj is Credit {
     return typeof obj === 'object' &&
            obj !== null &&
            'id' in obj &&
            'tokenId' in obj;
   }
   ```

### Database Best Practices

1. **Migrations**
   - Always use migrations for schema changes
   - Never modify existing migrations
   - Test migrations up and down
   - Use transactions for data migrations

2. **Row-Level Security**
   ```sql
   -- Always enable RLS
   ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
   
   -- Create tenant isolation policy
   CREATE POLICY tenant_isolation ON credits
     FOR ALL
     USING (tenant_id = current_setting('app.tenant_id')::uuid);
   ```

3. **Queries**
   - Always use parameterized queries
   - Use indexes appropriately
   - Avoid N+1 queries
   - Use transactions for multi-step operations

### Event-Driven Best Practices

1. **Event Publishing**
   ```typescript
   // Always include required fields
   await eventBus.publish({
     event_id: uuidv4(),
     event_type: 'mrv.approved.v1',
     correlation_id: correlationId,
     causation_id: causationId,
     tenant_id: tenantId,
     aggregate_id: mrvId,
     aggregate_version: version,
     timestamp: new Date().toISOString(),
     payload: { /* event data */ }
   });
   ```

2. **Event Consumption**
   ```typescript
   // Always handle idempotency
   async function handleEvent(event: Event) {
     // Check if already processed
     const processed = await checkEventProcessed(event.event_id);
     if (processed) {
       logger.info('Event already processed', { event_id: event.event_id });
       return;
     }
     
     // Process event
     await processEvent(event);
     
     // Mark as processed
     await markEventProcessed(event.event_id);
   }
   ```

3. **Error Handling**
   - Always implement retry logic
   - Use dead letter queues
   - Log failures with context
   - Alert on persistent failures

### Security Best Practices

1. **Authentication**
   - Always validate JWT tokens
   - Check token expiration
   - Verify tenant access
   - Use secure session management

2. **Authorization**
   - Check permissions at service level
   - Use RBAC consistently
   - Log authorization failures
   - Implement principle of least privilege

3. **Data Protection**
   - Encrypt sensitive data at rest
   - Use TLS for all communications
   - Never log sensitive data
   - Sanitize user inputs

4. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS only
   - Implement CORS properly

---

## Testing Strategy

### Test Pyramid

```
        /\
       /  \      E2E Tests (10%)
      /____\
     /      \    Integration Tests (30%)
    /________\
   /          \  Unit Tests (60%)
  /____________\
```

### Unit Tests

- **Coverage Target**: 80%+
- **Framework**: Jest
- **Location**: `tests/unit/`
- **Focus**: Business logic, utilities, pure functions

```typescript
describe('MRVEngine', () => {
  it('should calculate tonnage correctly', () => {
    const engine = new MRVEngine();
    const result = engine.calculate({
      baseline: 100,
      project: 50,
      leakage: 0.05
    });
    expect(result.netRemoval).toBe(47.5);
  });
});
```

### Integration Tests

- **Coverage**: Critical flows
- **Framework**: Jest + Supertest
- **Location**: `tests/integration/`
- **Focus**: Service interactions, database operations, event flows

```typescript
describe('Credit Issuance Flow', () => {
  it('should mint credit after registry approval', async () => {
    // Setup
    const mrv = await createMRV();
    await approveMRV(mrv.id);
    
    // Execute
    await waitForEvent('blockchain.nft.minted.v1');
    
    // Verify
    const credit = await getCredit(mrv.id);
    expect(credit.tokenId).toBeDefined();
  });
});
```

### End-to-End Tests

- **Coverage**: User journeys
- **Framework**: Playwright or Cypress
- **Location**: `tests/e2e/`
- **Focus**: Complete workflows, API contracts

### Test Data Management

- Use factories for test data
- Clean up after tests
- Use transactions for isolation
- Mock external services

---

## Code Standards

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Linting & Formatting

- **ESLint**: Airbnb config with TypeScript
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **lint-staged**: Run linters on staged files

### Code Review Checklist

- [ ] Code follows style guide
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Error handling implemented
- [ ] Logging appropriate
- [ ] No hardcoded values
- [ ] Environment variables used
- [ ] Multi-tenancy considered

---

## Dependencies & Tools

### Core Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "typeorm": "^0.3.0",
    "pg": "^8.11.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "zod": "^3.22.0",
    "uuid": "^9.0.0",
    "@aws-sdk/client-eventbridge": "^3.400.0",
    "near-api-js": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0"
  }
}
```

### Development Tools

- **VS Code Extensions**:
  - ESLint
  - Prettier
  - TypeScript
  - Docker
  - GitLens

- **CLI Tools**:
  - `npm` or `yarn` for package management
  - `docker-compose` for local services
  - `terraform` for infrastructure
  - `near-cli` for blockchain operations

---

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check PostgreSQL is running
   - Verify connection string
   - Check firewall rules
   - Verify credentials

2. **EventBridge Connection Issues**
   - Verify AWS credentials
   - Check region configuration
   - Verify EventBridge bus exists
   - Check IAM permissions

3. **NEAR Transaction Failures**
   - Verify account has enough NEAR
   - Check network (testnet/mainnet)
   - Verify contract is deployed
   - Check transaction gas limits

4. **Multi-Tenancy Issues**
   - Verify tenant_id in context
   - Check RLS policies
   - Verify tenant isolation
   - Review query logs

5. **Event Processing Failures**
   - Check event schema
   - Verify consumer is running
   - Check DLQ for failed events
   - Review event logs

### Debugging Tips

1. **Enable Debug Logging**
   ```typescript
   process.env.LOG_LEVEL = 'debug';
   ```

2. **Use Correlation IDs**
   - Always include correlation_id in logs
   - Trace requests across services

3. **Database Query Logging**
   ```typescript
   // Enable query logging in TypeORM
   logging: ['query', 'error']
   ```

4. **Event Tracing**
   - Use correlation_id to trace event flows
   - Check event store for event history

---

## Additional Resources

- [Architecture Document](../dmrv_saa_s_architecture_near_nft_design.md)
- [API Documentation](../api/README.md)
- [Event Catalog](../events/README.md)
- [Security Guidelines](../security/README.md)
- [Testing Strategy](../testing/README.md)

---

## Getting Help

- **Documentation**: Check relevant docs subfolders
- **Code Review**: Ask in PR comments
- **Architecture Questions**: Consult architecture document
- **Blockers**: Escalate to tech lead

---

**Last Updated**: 2024-01-XX
**Maintained By**: Development Team

