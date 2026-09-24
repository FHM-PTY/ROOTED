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
- **Backend & Database**: [PostgreSQL 16](https://www.postgresql.org/) via [Supabase](https://supabase.com/) with Row-Level Security (RLS) & Atomic Mutex RPCs
- **Client ORM/SDK**: `@supabase/supabase-js` v2 with resilient offline sandbox caching
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
│       └── deploy.yml              # GitHub Pages multi-site deployment workflow
├── public/
│   └── favicon.svg                 # SVG brand favicon
├── supabase/
│   ├── migrations/
│   │   └── 20260924_initial_schema.sql # PostgreSQL 16 schema, RLS policies & atomic mutex
│   └── seed.sql                    # Full master dataset seed (lockers, labels, products, orders)
├── src/
│   ├── Customer/
│   │   ├── CustomerApp.tsx         # Customer storefront shell & shopping flows
│   │   └── BrandLandingPage.tsx    # Dedicated standalone brand storefront
│   ├── Vendor/
│   │   ├── VendorApp.tsx           # Decoupled Atelier Studio merchant portal
│   │   └── AtelierLoginPage.tsx    # High-fashion editorial vendor login gateway
│   ├── components/
│   │   ├── BackendStatusBadge.tsx  # In-app connection status indicator
│   │   └── BackendConnectionModal.tsx # Runtime Supabase config, ping & 1-click seeder
│   ├── services/
│   │   └── marketplaceService.ts   # Universal data provider (Supabase DB + offline sandbox)
│   ├── lib/
│   │   └── supabase.ts             # Supabase client, diagnostic ping & seeder engine
│   ├── data/
│   │   └── marketplaceData.ts      # Master dataset models & static fallback
│   ├── types.ts                    # TypeScript models (Vendor, Product, Locker, Order)
│   ├── App.tsx                     # Root router & environment detector
│   ├── index.css                   # Global CSS & Tailwind CSS v4 design tokens
│   └── main.tsx                    # React DOM entrypoint
├── scripts/
│   ├── hub.cjs                     # Cross-platform Launch Automation Hub engine
│   └── build_seed_sql.cjs          # Master seed SQL compiler
├── hub / Hub                       # macOS & Linux terminal executable launcher
├── hub.cmd / Hub.cmd               # Windows CMD & PowerShell executable launcher
├── .env.example                    # Environment variable template
├── index.html                      # HTML shell with Google Fonts & SEO metadata
├── vite.config.ts                  # Vite configuration with dynamic repository base URL
├── package.json                    # Project dependencies and npm scripts
├── LICENSE                         # Strict proprietary license (Not Open Source)
└── README.md                       # Comprehensive documentation
```

---

## ⚡ Launch Automation Hub (`Hub`)

ROOTED features a unified, cross-platform Launch Hub automation script that runs whenever you or your team types `Hub` (or `hub`) in terminal or cmd.

```text
  ____   ____   ____ _______ ______ _____  
 |  _ \ / __ \ / __ \__   __|  ____|  __ \ 
 | |_) | |  | | |  | | | |  | |__  | |  | |
 |  _ <| |  | | |  | | | |  |  __| | |  | |
 | |_) | |__| | |__| | | |  | |____| |__| |
 |____/ \____/ \____/  |_|  |______|_____/ 
   ROOTED™ (Le Benkeleng) — Launch Automation Hub
   Pretoria (012) & Gauteng Independent Streetwear Platform 🇿🇦
```

### 📋 1-Step Team Copy & Paste Setup

Share this single line with your co-founders or engineering team to clone, install, and launch everything automatically:

#### 🪟 Windows CMD / PowerShell / VS Code Terminal:
```cmd
git clone https://github.com/FHM-PTY/ROOTED.git && cd ROOTED && npm install && Hub
```

#### 🍎 macOS / 🐧 Linux / VS Code Bash Terminal:
```bash
git clone https://github.com/FHM-PTY/ROOTED.git && cd ROOTED && pnpm install && ./Hub
```

> [!TIP]
> **Enable typing `Hub` directly on Mac/Linux:**
> Run this once in your terminal:
> ```bash
> echo 'alias Hub="[ -f ./Hub ] && ./Hub || pnpm hub"' >> ~/.bashrc && source ~/.bashrc
> ```
> *(On macOS with zsh, replace `~/.bashrc` with `~/.zshrc`).*

---

### 🕹️ Daily Hub Commands

Whenever you are working in the repository, simply type:

| Command | Action |
| :--- | :--- |
| **`Hub`** | Launches interactive menu (Dev server, diagnostics, seeder, build) |
| **`Hub dev`** | Directly starts the local dev server on port `5174` |
| **`Hub check`** | Runs live PostgreSQL & Supabase connection, table, and RLS checks |
| **`Hub seed`** | Verifies / seeds remote Supabase database with master catalog |
| **`Hub build`** | Builds production-optimized static distribution bundle |
| **`Hub studio`** | Directly displays Atelier Studio login & dev server links |

---

## 🚀 Manual Getting Started

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

### PostgreSQL & Supabase Database Setup (Phase 1 Migration)

The platform supports both live **PostgreSQL 16 on Supabase** and a zero-friction **Local Sandbox Engine (Offline Cache)**:

1. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase Project URL and Anon Public Key:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   *(Note: You can also configure credentials directly inside the app at runtime using the floating **Backend: Sandbox / PostgreSQL** badge).*

2. **Execute Database Migration & RLS:**
   Open your [Supabase Dashboard](https://supabase.com/dashboard) -> **SQL Editor**, and run:
   - [`supabase/migrations/20260924_initial_schema.sql`](supabase/migrations/20260924_initial_schema.sql)
   This creates all 5 tables (`locker_stations`, `vendors`, `products`, `orders`, `order_items`), sets up POPIA Row-Level Security policies, and deploys the `create_order_atomic` stored procedure with 1-of-1 Thrift Vault mutex locking.

3. **Seed Database with Master Catalog:**
   - **Option A (In-App)**: Open the **Backend Status Modal** inside the browser and click **⚡ 1-Click Seed Remote Database**.
   - **Option B (SQL Editor / CLI)**: Run [`supabase/seed.sql`](supabase/seed.sql) in your Supabase SQL editor or via psql.

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
