# Frontend Applications

This directory contains all frontend applications for the DMRV platform.

## Applications

### Dashboard (`dashboard/`)

Next.js-based user dashboard for the DMRV platform.

**Features:**
- Project management
- MRV submission workflows
- Verification tracking
- Credit (NFT) management
- Process monitoring
- Billing and settings

**Quick Start:**
```bash
cd dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Documentation:** See `dashboard/README.md` for detailed information.

---

## Future Applications

### Admin Portal (Planned)
Platform administration interface for managing tenants, users, and system configuration.

### Public Portal (Planned)
Public-facing website for credit marketplace, registry information, and platform documentation.

### Mobile App (Planned)
React Native mobile application for field data collection and MRV submission.

---

## Development

All applications should follow these conventions:

### Structure
```
app-name/
├── src/                  # Source code
├── public/               # Static assets
├── tests/                # Test files
├── .env.example          # Environment variables template
├── README.md             # App-specific documentation
└── package.json          # Dependencies
```

### Environment Variables
- Use `.env.example` as template
- Never commit actual `.env` files
- Use `NEXT_PUBLIC_` prefix for client-side variables

### API Integration
- All apps connect to the API Gateway at `services/api-gateway/`
- Use shared types from `../../shared/types/` or `../../types/`
- Implement proper error handling and loading states

### Authentication
- Use shared auth library from `../../shared/auth/`
- Implement JWT-based authentication
- Support multi-tenant isolation

### Styling
- Use Tailwind CSS for consistency
- Follow the platform design system
- Ensure responsive design (mobile-first)

---

## Deployment

### Development
```bash
cd app-name
npm run dev
```

### Production
```bash
cd app-name
npm run build
npm start
```

### Docker
Each application includes a Dockerfile for containerization.

```bash
docker build -t dmrv-app-name .
docker run -p 3000:3000 dmrv-app-name
```

---

## Related Documentation

- **Architecture**: `../docs/architecture/COMPREHENSIVE_WORKFLOWS.md`
- **API Specs**: `../docs/api/README.md`
- **Development Guide**: `../docs/development/README.md`

