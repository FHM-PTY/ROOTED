# Le Benkeleng™

[![Live Site](https://img.shields.io/badge/Live%20Site-fhm--pty.github.io%2FLeBenkeleng-black?style=flat&logo=github)](https://fhm-pty.github.io/LeBenkeleng/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Privacy](https://img.shields.io/badge/Security-POPIA%20%26%20Tenant%20Isolation-10B981)](https://fhm-pty.github.io/LeBenkeleng/#/vendor-portal)
[![Region](https://img.shields.io/badge/Region-Pretoria%20(012)%20%26%20Gauteng%20🇿🇦-C88A35)](https://fhm-pty.github.io/LeBenkeleng/)

> **Live Production Site:**  
> 🔗 **[https://fhm-pty.github.io/LeBenkeleng/](https://fhm-pty.github.io/LeBenkeleng/)**

---

## 🇿🇦 About Le Benkeleng

**Le Benkeleng** is a curated multi-brand marketplace and digital storefront engine built specifically for Pretoria (012) and greater Gauteng independent streetwear labels (celebrating brands like *Lesupa Atelier*, *Mokasi*, *Galxboy Heritage*, *Soweto Threads*, *Braam District*, and *Gusheshe*), paired with an authentic 1-of-1 curated vintage archive (**Thrift Zone ⚡**).

The platform bridges local township and CBD atelier artisans with nationwide consumers through an integrated 48-hour dispatch SLA, automated Bob Go smart locker logistics, South African payment integrations (Capitec Pay, Payflex, Ozow), and a privacy-first Atelier Studio for independent label merchants.

---

## 🌟 Core Platform Features

### 1. Bash-Inspired Sleek UI & Navigation
- **Utility Bar**: Active Bob Go smart locker pickup station selector, free nationwide delivery badge, and instant currency switcher (`ZAR`, `USD`, `EUR`).
- **Sleek Black Sticky Header**: Bash-inspired aesthetic featuring brand identity, pill-shaped instant search with drop-down live preview, department switcher (`All`, `Men`, `Women`, `Vintage`), and 3-icon quick utility cluster:
  - **Live Parcel Tracker**: Instant modal to track orders via simulated Bob Go waypoints with WhatsApp updates.
  - **Wishlist Counter**: Saved items drawer with quick add-to-bag functionality.
  - **Shopping Bag**: Slide-over drawer with itemized totals, Payflex 4-installment breakdown, and seamless South African checkout.
- **Active Category Pill Strip**: One-click filtering across `All`, `Pretoria (012)`, `Kicks`, `Outerwear`, `Workwear`, `Accessories`, and `Thrift Zone ⚡`.
- **Bash-Style 4-Column Footer**: Modern utility list with quick links, Help & Support (Bob Go pickup locator, 48h dispatch guarantee, sizing chart, returns), Services (Vendor Atelier Studio, Bob Go locker network, Payflex installments), and Company info.
- **Mobile Bottom Navigation Dock**: Fixed mobile tab bar for smooth handheld browsing (`Shop`, `Brands`, `Thrift`, `Saved`, `Bag`).

### 2. Dedicated Brand Landing Pages (`#/brand/:slug`)
Every independent streetwear label has its own shareable, standalone storefront featuring:
- **Campaign Hero**: High-impact editorial imagery with regional coordinates, established year, and city badge (`📍 PRETORIA 012`).
- **4-Metric Trust Bar**: Guaranteed 48-hour Bob Go dispatch SLA, local fulfillment atelier location, curated price range, and verified customer rating.
- **Brand Story & Atelier Craft**: Authentic designer biography, direct designer WhatsApp contact button, and quick link copy tool.
- **Dedicated Catalog Grid**: Category filtering, price sorting, Payflex 4-installment breakdown, and quick add-to-bag.
- **Regional Discovery Carousel**: Cross-promotes affiliated labels from the same creative hub or township.

### 3. Brands A–Z Directory (`#/brands`)
- Comprehensive brand directory featuring alphabet pills (`ALL`, `B`, `D`, `G`, `K`, `L`, `M`, `S`) for rapid discovery across all verified South African independent streetwear labels.

### 4. Thrift Zone ⚡ (`#/vault`)
- Dedicated 1-of-1 archive of hand-hunted vintage streetwear from Small Street CBD wholesale stashes, Bree Taxi Interchange, and Durban beachfront arcades.
- Verified Grade A+ mint condition, triple steam-cleaned, and measured to the centimeter.
- Real-time 1-of-1 scarcity enforcement: quantities are locked to 1 per unique piece to prevent overselling.

### 5. Privacy-First Vendor Atelier Studio (`#/vendor-portal`)
A dedicated multi-tenant merchant portal designed specifically for independent designers, atelier managers, and streetwear founders:
- **Tenant Isolation & Studio Gateway**: Secure login gateway requiring brand credentials, with Quick Passkeys for verified labels to switch contexts seamlessly in demo mode.
- **Privacy Shield (Discreet Mode)**: Instant toggle to mask sensitive metrics (gross revenue, payout balances, sales figures) with blur/stars—ideal for founders managing stores in shared ateliers, coffee shops, or public environments.
- **POPIA-Compliant Customer Masking**: Enforces privacy by redacting customer phone numbers and residential addresses for studio staff while maintaining fulfillment utility.
- **Role-Based Views**:
  - **Founder Mode**: Full financial analytics, revenue overviews, product pricing adjustments, and full catalog control.
  - **Atelier Staff Mode**: Focused strictly on order packing, dispatch fulfillment, and inventory counts without exposing store financials.
- **Live Stock & Inventory Management**: Per-size real-time quantity adjustments (`S`, `M`, `L`, `XL`, `OS`) with immediate cross-application synchronization to the customer-facing storefront and persistent `localStorage`.
- **Product Catalog Builder**: Add, edit, or remove products with preset streetwear image libraries, custom image URLs, price calculators, category tags, and Thrift 1-of-1 flags.
- **Order Fulfillment Workflows**: Track and transition customer orders across `Pending`, `Processing`, `Shipped` (with Bob Go tracking assignment), `Delivered`, and `Cancelled`.

### 6. Local Logistics & South African Checkout
- **Bob Go Smart Locker Network**: Integrated locker picker covering 1,400+ secure pickup depots across Gauteng and nationwide (Hatfield Station, Menlyn Park, Centurion Mall, Rosebank Link, Braamfontein Hub, Sandton City).
- **South African Checkout Suite**:
  - **Capitec 1-Tap QR Pay**: Instant mobile banking payment.
  - **Payflex**: 4 interest-free installments calculated automatically at checkout.
  - **Ozow Instant EFT**: Zero-fee instant bank transfers.
  - **Card Payments**: Secure Visa/Mastercard processing with 3D Secure.
- **Real-Time Parcel Tracking**: Track shipments step-by-step from atelier dispatch to local Bob Go locker arrival with automated WhatsApp status notifications.

---

## 🗺 Application Route Map

The application utilizes a lightweight hash router (`#/`) for seamless client-side routing on any static host or GitHub Pages:

| Route | View | Description |
| :--- | :--- | :--- |
| `#/` | **Marketplace Home** | Curated catalog, department filters, featured drops, and promotions |
| `#/brands` | **Brands A–Z** | Alphabetical directory of all partner streetwear labels |
| `#/brand/:slug` | **Brand Storefront** | Dedicated designer landing page (e.g., `#/brand/lesupa-atelier`) |
| `#/vault` | **Thrift Zone ⚡** | 1-of-1 curated vintage streetwear and archive gems |
| `#/vendor-portal` | **Atelier Studio** | Privacy-first merchant dashboard, inventory manager & order fulfillment |

*(Aliases: `#/vendor`, `#/portal`, and `#/seller` automatically route to the Atelier Studio).*

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev) with [TypeScript 5.7](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Design System**: Bash-inspired aesthetic, soft pill UI, dark accents, and glassmorphic overlays
- **Typography**: Plus Jakarta Sans, Syne, and Space Mono (via Google Fonts)
- **State & Persistence**: LocalStorage multi-tenant store with real-time storefront synchronization
- **Package Manager**: [pnpm](https://pnpm.io/) / [npm](https://www.npmjs.com/)
- **CI/CD & Hosting**: [GitHub Actions](https://github.com/features/actions) deploying directly to [GitHub Pages](https://pages.github.com/)

---

## 📁 Project Architecture

```
LeBenkeleng/
├── public/
│   └── favicon.svg              # SVG brand favicon
├── src/
│   ├── components/
│   │   ├── BrandLandingPage.tsx # Dedicated standalone brand storefront
│   │   └── VendorDashboard.tsx  # Privacy-first vendor portal & inventory studio
│   ├── data/
│   │   └── marketplaceData.ts   # Centralized brands, products, orders & lockers data
│   ├── types.ts                 # TypeScript models (Vendor, Product, Locker, Order)
│   ├── App.tsx                  # Main app shell, Bash navigation, footer & router
│   ├── index.css                # Global CSS & Tailwind CSS v4 design tokens
│   └── main.tsx                 # React DOM entrypoint
├── index.html                   # HTML shell with Google Fonts & SEO metadata
├── vite.config.ts               # Vite configuration with conditional base URL
├── package.json                 # Project dependencies and npm scripts
└── README.md                    # Comprehensive documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm (`npm install -g pnpm`) or npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FHM-PTY/LeBenkeleng.git
   cd LeBenkeleng
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the local development server:**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```
   The application will be accessible at `http://localhost:8443` (or the port defined by `$PORT`).

4. **Build for production:**
   ```bash
   pnpm run build
   # or
   npm run build
   ```

5. **Preview the production build locally:**
   ```bash
   pnpm run preview
   # or
   npm run preview
   ```

---

## 🚢 Hosting & Deployment (GitHub Pages)

The application is pre-configured with a Vite base URL for **GitHub Pages** (`https://fhm-pty.github.io/LeBenkeleng/`) or custom static hosts.

### Live Production URL:
🔗 **[https://fhm-pty.github.io/LeBenkeleng/](https://fhm-pty.github.io/LeBenkeleng/)**

### Automated Deployment with GitHub Actions
To deploy automatically on push:
1. Ensure the repository has GitHub Pages enabled (**Settings** → **Pages** → Source: **GitHub Actions**).
2. Create `.github/workflows/deploy.yml` with the following workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    name: Build Website
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build site
        env:
          BASE_PATH: /LeBenkeleng/
        run: pnpm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    name: Deploy to GitHub Pages
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 📄 License

Private & Proprietary — © 2026 Le Benkeleng™ & FHM-PTY. All rights reserved.
