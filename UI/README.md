# DMRV Platform UI

HTML/CSS mockup of the DMRV SaaS platform based on the architecture document.

## Quick Start

### 🚀 Fastest Way: Run Script

```bash
cd DMRV-NFT/UI
./run.sh
```

This script automatically detects and uses the best available server (Python, Node.js, or PHP).

Then open your browser to: **http://localhost:8000**

---

### Option 1: Open Directly in Browser (Simplest)

1. Navigate to the `UI` directory:
   ```bash
   cd DMRV-NFT/UI
   ```

2. Open `index.html` in your browser:
   - **macOS**: `open index.html`
   - **Linux**: `xdg-open index.html`
   - **Windows**: Double-click `index.html` or right-click → "Open with" → Browser

**Note**: Opening directly may have CORS issues with some browsers. Use a local server for best results.

---

### Option 2: Manual Server Commands

**Using Python 3** (most common):
```bash
cd DMRV-NFT/UI
python3 -m http.server 8000
# Open: http://localhost:8000
```

**Using Node.js**:
```bash
# One-time install
npm install -g http-server

# Run server
cd DMRV-NFT/UI
http-server -p 8000
# Open: http://localhost:8000
```

**Using PHP**:
```bash
cd DMRV-NFT/UI
php -S localhost:8000
# Open: http://localhost:8000
```

**Using npx** (no install needed):
```bash
cd DMRV-NFT/UI
npx http-server -p 8000
# Open: http://localhost:8000
```

## Pages Available

- **Dashboard**: `index.html` - Overview of projects, credits, and pipeline status
- **Projects**: `projects.html` - List and manage carbon removal projects
- **Credits (NFTs)**: `credits.html` - View and manage carbon credit NFTs on NEAR
- **MRV Submissions**: `mrv.html` - Submit and track MRV data
- **Verification**: `verification.html` - 9-category verification workflow
- **Processes**: `processes.html` - Long-running process tracking
- **Billing**: `billing.html` - Subscription and usage billing
- **Settings**: `settings.html` - Tenant settings and configuration

## Navigation

All pages share the same sidebar navigation. Click on any menu item to navigate between pages.

## Features Demonstrated

- **Multi-tenant UI**: Shows tenant context (CarbonCorp Inc. - Enterprise)
- **Credit Lifecycle Pipeline**: Visual representation of MRV → Verification → Registry → NFT flow
- **Project Management**: Forestry, DAC, Soil Carbon projects
- **Credit (NFT) Management**: Token IDs, NEAR blockchain integration, registry serials
- **Process Tracking**: Long-running workflow status with progress bars
- **Registry Integration**: Verra, Puro.earth, Isometric status
- **Statistics Dashboard**: Key metrics and KPIs

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes

- This is a **static HTML/CSS mockup** - no backend functionality
- All data shown is **example/demo data**
- Navigation links work between pages
- Responsive design (mobile-friendly)
- Color scheme: Green/blue theme for carbon/climate focus

## Future Enhancements

To make this interactive, you would:
1. Add JavaScript for API calls
2. Connect to the backend services
3. Add form submissions
4. Implement real-time updates
5. Add authentication flows

