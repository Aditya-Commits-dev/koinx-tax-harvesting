# KoinX — Tax Loss Harvesting Tool

A React web app that helps users simulate tax loss harvesting on their crypto portfolio by selecting holdings and viewing pre/post-harvesting capital gains in real time.

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm v8 or higher

### Installation

```bash
# Clone or unzip the project
cd koinx-tax-harvesting

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
```

Or connect the GitHub repo to [vercel.com](https://vercel.com) — it auto-detects Vite and deploys automatically.

---

## Assumptions

- **API availability:** The app fetches holdings from the KoinX assignment backend (`https://koinx-backend-assignment.onrender.com/holdings`). If the API is unreachable or returns an empty response, mock portfolio data is used automatically as a fallback. A "Using demo data" badge is shown when this happens.

- **Tax rates:** Estimated tax savings are calculated using a flat 30% rate for Short-Term Capital Gains (STCG) and 20% for Long-Term Capital Gains (LTCG). These are approximations and do not account for individual tax brackets or jurisdiction-specific rules.

- **Harvesting logic:** Selecting a coin simulates selling it entirely. The coin's full STCG/LTCG values are subtracted from the pre-harvesting totals to compute the post-harvesting figures. Partial sells are not modelled.

- **No wash sale rules:** The tool does not enforce wash sale restrictions (e.g. the 30-day repurchase rule), as these vary by jurisdiction and the assignment does not specify them.

- **API response shape:** The API is expected to return an array of holdings, each with `coin`, `coinSymbol`, `currentPrice`, `totalHolding`, `stcg: { gain, loss }`, and `ltcg: { gain, loss }` fields. If the shape differs, the fallback mock data is used.
