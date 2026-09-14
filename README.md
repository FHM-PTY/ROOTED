# ROOTED™

[![Live Site](https://img.shields.io/badge/Live%20Site-fhm--pty.github.io%2FROOTED-black?style=flat&logo=github)](https://fhm-pty.github.io/ROOTED/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Security](https://img.shields.io/badge/Security-POPIA%20%26%20Tenant%20Isolation-10B981)](https://fhm-pty.github.io/ROOTED/#/vendor)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary%20%28Not%20Open%20Source%29-red)](LICENSE)
[![Region](https://img.shields.io/badge/Region-Pretoria%20(012)%20%26%20Gauteng%20🇿🇦-C88A35)](https://fhm-pty.github.io/ROOTED/)

> **Live Deployments:**  
> 🛍️ **Customer Storefront:** [https://fhm-pty.github.io/ROOTED/commerce/](https://fhm-pty.github.io/ROOTED/commerce/) (or [https://fhm-pty.github.io/ROOTED/](https://fhm-pty.github.io/ROOTED/))  
> 🏛️ **Vendor Atelier Studio:** [https://fhm-pty.github.io/ROOTED/vendor/](https://fhm-pty.github.io/ROOTED/vendor/) (or [https://fhm-pty.github.io/ROOTED/#/vendor](https://fhm-pty.github.io/ROOTED/#/vendor))  

---

## 🇿🇦 About ROOTED

**ROOTED** is a curated multi-brand marketplace and digital storefront platform engineered specifically for Pretoria (012) and greater Gauteng independent streetwear labels (celebrating brands like *Lesupa Atelier*, *Mokasi*, *Galxboy Heritage*, *Soweto Threads*, *Braam District*, and *Gusheshe*), paired with an authentic 1-of-1 curated vintage archive (**Thrift Zone ⚡**).

The platform bridges local township and CBD atelier artisans with nationwide consumers through an integrated 48-hour dispatch SLA, automated Bob Go smart locker logistics, South African payment integrations (Capitec Pay, Payflex, Ozow), and a completely decoupled, privacy-first Atelier Studio for independent label merchants.

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

### 5. Decoupled Vendor Atelier Studio (`/vendor/` or `#/vendor`)
A dedicated, decoupled multi-tenant merchant portal designed specifically for independent designers, atelier managers, and streetwear founders:
- **Tenant Isolation & Studio Gateway**: Secure login gateway requiring brand credentials, with Quick Passkeys for verified labels to switch contexts seamlessly in demo mode.
- **Privacy Shield (Discreet Mode)**: Instant toggle to mask sensitive metrics (gross revenue, payout balances, sales figures) with blur/stars—ideal for founders managing stores in shared ateliers, coffee shops, or public environments.
- **POPIA-Compliant Customer Masking**: Enforces privacy by redacting customer phone numbers and residential addresses for studio staff while maintaining fulfillment utility.
- **Role-Based Views**:
  - **Founder Mode**: Full financial analytics, revenue overviews, product pricing adjustments, and catalog management.
  - **Atelier Staff Mode**: Focused strictly on order packing, dispatch fulfillment, and inventory counts without exposing store financials.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Design Tokens**: Custom CSS variables for earth & ink palette (`--ink`, `--paper`, `--gold`, `--clay`, `--moss`)
- **Typography**: Space Grotesk (sans), Fraunces (editorial serif), Space Mono (monospace)
- **Package Manager**: [pnpm](https://pnpm.io/) / [npm](https://www.npmjs.com/)
- **CI/CD & Hosting**: [GitHub Actions](https://github.com/features/actions) deploying directly to [GitHub Pages](https://pages.github.com/)

---

## 📁 Project Architecture

```
ROOTED/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages multi-site deployment workflow
├── public/
│   └── favicon.svg              # SVG brand favicon
├── src/
│   ├── Customer/
│   │   ├── CustomerApp.tsx      # Customer storefront shell & shopping flows
│   │   └── BrandLandingPage.tsx # Dedicated standalone brand storefront
│   ├── Vendor/
│   │   ├── VendorApp.tsx        # Decoupled Atelier Studio merchant portal
│   │   └── AtelierLoginPage.tsx # High-fashion editorial vendor login gateway
│   ├── data/
│   │   └── marketplaceData.ts   # Centralized brands, products, orders & lockers data
│   ├── types.ts                 # TypeScript models (Vendor, Product, Locker, Order)
│   ├── App.tsx                  # Root router & environment detector
│   ├── index.css                # Global CSS & Tailwind CSS v4 design tokens
│   └── main.tsx                 # React DOM entrypoint
├── index.html                   # HTML shell with Google Fonts & SEO metadata
├── vite.config.ts               # Vite configuration with dynamic repository base URL
├── package.json                 # Project dependencies and npm scripts
├── LICENSE                      # Strict proprietary license (Not Open Source)
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
   git clone https://github.com/FHM-PTY/ROOTED.git
   cd ROOTED
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

The project includes an automated GitHub Actions deployment workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) that builds and hosts both the customer commerce site and the vendor atelier studio simultaneously under distinct entrypoints:

- **Customer Storefront**: `https://<org>.github.io/ROOTED/commerce/` (and root `https://<org>.github.io/ROOTED/`)
- **Vendor Atelier Studio**: `https://<org>.github.io/ROOTED/vendor/` (and hash route `#/vendor`)
- **SPA Fallback**: `dist/404.html` client-side route fallback

---

## 📄 License & Intellectual Property Notice

**PROPRIETARY SOFTWARE — NOT OPEN SOURCE.**  
Copyright © 2026 ROOTED™. All rights reserved.

This software, codebase, architecture, and design system are the exclusive proprietary property of:
1. **Lehlohonolo Malope**
2. **Sifiso Madonsela**
3. **Lavani Chauke**
4. **Obakeng Modikwane**

### Public Hosting Notice
This repository is hosted publicly strictly for demonstration, portfolio review, and static delivery via GitHub Pages. Public visibility **DOES NOT** constitute an open-source license or grant any rights to copy, clone, fork, modify, deploy, redistribute, or use this software in any form.

### Strict Monetization Prohibition & Liquidated Damages
Any unauthorized commercial use, monetization, or revenue generation derived directly or indirectly from this software, design, or system will be reported to legal authorities and prosecuted under the South African Copyright Act (Act 98 of 1978). The copyright holders strictly claim liquidated damages of no less than **two times (200%) of any and all monies, revenue, or profits made from the system**, plus all associated legal fees.

See [`LICENSE`](LICENSE) for the full legal agreement.
