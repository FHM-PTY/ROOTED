# Le Benkeleng™

[![Live Site](https://img.shields.io/badge/Live%20Site-fhm--pty.github.io%2FLeBenkeleng-black?style=flat&logo=github)](https://fhm-pty.github.io/LeBenkeleng/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Region](https://img.shields.io/badge/Region-Pretoria%20(012)%20%26%20Gauteng%20🇿🇦-C88A35)](https://fhm-pty.github.io/LeBenkeleng/)

> **Live Production Site:**  
> 🔗 **[https://fhm-pty.github.io/LeBenkeleng/](https://fhm-pty.github.io/LeBenkeleng/)**

---

## 🇿🇦 About Le Benkeleng

**Le Benkeleng** is a curated multi-brand marketplace and digital storefront engine built specifically for Pretoria (012) and greater Gauteng independent streetwear labels (celebrating brands like *Lesupa Atelier*, *Mokasi*, *Galxboy Heritage*, *Soweto Threads*, *Braam District*, and *Gusheshe*), paired with an authentic 1-of-1 curated vintage archive (**The Dunusa Vault**).

The platform bridges local township and CBD atelier artisans with nationwide consumers through an integrated 48-hour dispatch SLA, automated locker logistics, and trusted local payment methods.

---

## 🌟 Key Features

### 1. Dedicated Brand Landing Pages (`#/brand/:slug`)
Every independent streetwear label has its own shareable, standalone storefront featuring:
- **Campaign Hero**: Editorial cover image with city badge (`📍 PRETORIA 012`), established year, and coordinates.
- **4-Metric Trust Bar**: Guaranteed 48-hour Bob Go dispatch SLA, local fulfillment atelier, price range, and verified customer rating.
- **Brand Story & Atelier Craft**: Authentic designer narrative, direct designer WhatsApp contact button, and link copy tool.
- **Dedicated Catalog Grid**: Category filtering, price sorting, Payflex 4-installment breakdown, and quick add-to-bag.
- **Regional Discovery**: Cross-promotes other labels from the same region.

### 2. Bash-Style 3-Tier Navigation
- **Utility Bar**: Active Bob Go smart locker pickup station selector, free delivery badge, and currency switcher (`ZAR`, `USD`, `EUR`).
- **Sticky Header**: Brand identity, live instant search with drop-down preview, department switcher (`All`, `Men`, `Women`, `Vintage`), wishlist counter, and shopping bag drawer.
- **Category Sub-Nav**: Instant routing to `Brands A-Z`, `Pretoria (012)`, `The Dunusa Vault`, `Outerwear`, `Workwear`, `Footwear`, and `Accessories`.
- **Mobile Bottom Navigation**: Fixed bottom tab bar for mobile shoppers (`Shop`, `Brands`, `Vault`, `Saved`, `Bag`).

### 3. Brands A–Z Directory (`#/brands`)
- Comprehensive brand directory featuring alphabet pills (`ALL`, `B`, `D`, `G`, `K`, `L`, `M`, `S`) for rapid discovery across all affiliated designers.

### 4. The Dunusa Vintage Vault (`#/vault`)
- Dedicated 1-of-1 archive of hand-hunted vintage streetwear from Small Street CBD wholesale stashes, Bree Taxi Interchange, and Durban beachfront arcades. Each item is verified Grade A+ mint, triple steam-cleaned, and measured to the centimeter.

### 5. Local Logistics & Payments
- **Bob Go Smart Locker Network**: Integrated locker picker for 1,400+ pickup depots (Hatfield Station, Menlyn Park, Centurion Mall, Rosebank Link, Braamfontein Hub, Sandton City).
- **South African Checkout**: Capitec 1-Tap QR Pay, Payflex 4-interest-free installments, Ozow Instant EFT, and card payments.
- **Real-Time Parcel Tracker**: Track deliveries via Bob Go waypoint simulation with WhatsApp notification toggle.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Icons & Typography**: Plus Jakarta Sans, Syne, and Space Mono
- **Package Manager**: [pnpm](https://pnpm.io/)
- **CI/CD & Hosting**: [GitHub Actions](https://github.com/features/actions) deploying directly to [GitHub Pages](https://pages.github.com/)

---

## 📁 Project Architecture

```
LeBenkeleng/
├── public/
│   └── favicon.svg              # SVG brand favicon
├── src/
│   ├── components/
│   │   └── BrandLandingPage.tsx # Standalone brand storefront component
│   ├── data/
│   │   └── marketplaceData.ts   # Centralized brand, product & locker data
│   ├── types.ts                 # TypeScript interfaces (Vendor, Product, Locker)
│   ├── App.tsx                  # Main app shell & hash-based multi-page router
│   ├── index.css                # Global CSS & Tailwind CSS v4 theme tokens
│   └── main.tsx                 # React DOM entrypoint
├── index.html                   # HTML shell with Google Fonts & SEO metadata
├── vite.config.ts               # Vite configuration with conditional base URL
├── package.json                 # Dependencies and build scripts
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm (`npm install -g pnpm`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/FHM-PTY/LeBenkeleng.git
   cd LeBenkeleng
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the local development server:
   ```bash
   pnpm run dev
   ```
   The application will be accessible at `http://localhost:8443` (or the port defined by `$PORT`).

4. Build for production:
   ```bash
   pnpm run build
   ```

5. Preview the production build:
   ```bash
   pnpm run preview
   ```

---

## 🚢 Hosting & Deployment (GitHub Pages)

The application is pre-configured with a Vite base URL for **GitHub Pages** (`https://fhm-pty.github.io/LeBenkeleng/`) or any custom static host.

### Live Production URL:
🔗 **[https://fhm-pty.github.io/LeBenkeleng/](https://fhm-pty.github.io/LeBenkeleng/)**

### Automated Deployment with GitHub Actions (Optional)
To deploy via GitHub Actions:
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
