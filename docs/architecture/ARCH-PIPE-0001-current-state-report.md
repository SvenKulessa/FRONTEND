# ARCH-PIPE-0001: Current State Report — CAPITAL AI Pipeline Builder
**Document ID:** ARCH-PIPE-0001  
**Project:** CAPITAL AI  
**Component:** Visual Pipeline Builder & Market Intelligence Synthesizer  
**Status:** Baseline Audit Completed  
**Author:** AI System Architect & Senior Software Engineer  
**Date:** September 2026  

---

## 1. Executive Summary & Inventory Overview

A comprehensive codebase audit of the repository was conducted to establish the factual baseline of the **CAPITAL AI Pipeline Builder** application prior to any architectural migration or evolution. 

In strict adherence to Principle **AP-007 ("No hidden current-state assumptions")**, this report documents exclusively existing components, files, data structures, and runtime mechanics. It explicitly notes all absent infrastructure (databases, CI/CD pipelines, backend microservices).

---

## 2. Codebase & Repository Inventory

### 2.1 File System Structure

```
/
├── .env.example                     # Environment template (Gemini API, App URL, GA4)
├── .gitignore                       # Git exclusion rules
├── bun.lock                         # Lockfile for Bun package manager
├── index.html                       # Single Page Application HTML entry point
├── metadata.json                    # AI Studio metadata & permission configuration
├── package.json                     # Dependency manifests & NPM scripts
├── tsconfig.json                    # TypeScript compiler configuration (ES2022 / React-JSX)
├── vite.config.ts                   # Vite 8 bundling & Tailwind CSS plugin config
├── public/                          # Static assets and favicons
└── src/
    ├── App.tsx                      # Root orchestration container & client-side router
    ├── index.css                    # Tailwind CSS v4 entry point
    ├── main.tsx                     # React 19 DOM mount entry
    ├── types.ts                     # Core TypeScript domain entities & market models
    ├── assets/                      # Brand imagery and SVG graphics
    ├── context/
    │   └── PriceAlertsContext.tsx   # React Context for simulated price alert events
    ├── data/
    │   ├── assets/                  # Asset catalog data
    │   ├── mockData.ts              # In-memory fixtures (MARKET_ASSETS, CORE_MODULES)
    │   ├── sectorData.ts            # Sector rotation and macroeconomic indicators
    │   ├── vocabularyData.ts        # Financial & quantitative glossary terms
    │   └── whaleRadarData.ts        # On-chain transaction radar records
    ├── utils/
    │   ├── analytics.ts             # Google Analytics 4 pageview & custom event tracker
    │   ├── pdfExport.ts             # PDF document generator for asset reports
    │   ├── priceAlerts.ts           # Alert evaluation logic & local store helpers
    │   └── telegramService.ts       # Telegram webhook and mock dispatcher
    └── components/
        ├── PipelineBuilder.tsx      # Core Pipeline Builder component (1,920 lines)
        ├── ArchitecturePage.tsx     # Conceptual documentation of data feeds & low-budget pipeline
        ├── TokenomicsPage.tsx       # $CPT tokenomics, staking tiers & deflation mechanics
        ├── Header.tsx / Footer.tsx  # Navigation bars & platform headers
        ├── Hero.tsx / KeyPillars.tsx# Landing page presentations
        ├── MarketOverview.tsx       # Real-time multi-asset quotes table
        ├── MarketSentiment.tsx      # Fear & Greed index and sentiment gauge
        ├── SectorAnalysis.tsx       # Sector rotation heatmaps
        ├── WhaleRadarSection.tsx    # Whale radar teaser & transaction table
        ├── WhaleRadarModal.tsx      # Fullscreen smart-money tracking terminal
        ├── MonetizationModal.tsx    # B2C & B2B SaaS pricing model & simulator
        ├── MarketVocabularyModal.tsx# Educational financial terms drawer & dictionary
        ├── AnalysisModal.tsx        # In-depth asset & sector scoring modal
        ├── ProductTourModal.tsx     # Onboarding wizard
        ├── AssetDetailModal.tsx     # Detailed metrics drawer per ticker
        ├── ModuleDetailModal.tsx    # Core module explainability dialog
        ├── AllMarketsModal.tsx      # Paginated market selector
        ├── SubclassDetailModal.tsx  # Sub-asset class taxonomy viewer
        ├── PriceAlertsModal.tsx     # User alert threshold manager
        ├── PriceAlertToast.tsx      # Real-time push notification toaster
        ├── LoginPage.tsx            # Access gate & authentication terminal interface
        ├── LegalAndFaqPages.tsx     # Compliance routes (/faq, /datenschutz, /agb, /impressum)
        ├── BrandLogo.tsx            # SVG Vector Branding component
        ├── AssetLogo.tsx            # Dynamic currency/crypto/equity asset badges
        └── StatusBar.tsx            # Simulated mobile viewport OS status bar
```

---

## 3. Current Pipeline Builder Implementation (`PipelineBuilder.tsx`)

The existing Pipeline Builder is an interactive 4-step wizard with real-time code synthesis and export capabilities.

### 3.1 Existing Nodes & Configuration Options

| Dimension | Available Options in Current Implementation |
|---|---|
| **1. Data Concepts (`DataConcept`)** | • `authority`: Regulatory verified primary exchange reference (Sub-15ms, Engine Timestamp + Sequence ID)<br>• `evidence`: Cryptographically sealed Merkle tick pipelining (Sub-30ms, SHA-256 Merkle Evidence Log)<br>• `tier4`: 99.999% SLA active-active failover (Sub-5ms, Dual-Heartbeat + Quorum)<br>• `hybrid`: CEX-WebSocket + DEX-Mempool + Macro aggregation (Sub-45ms, Median Consensus Filtering)<br>• `individual`: Custom in-memory streaming engine (8–60ms, user validators) |
| **2. Target Analysis Tools (`ANALYSIS_TOOLS`)** | • `tradingview`: PineScript Webhook Relay & WebSocket UDF<br>• `bloomberg`: BLPAPI Bridge via gRPC / ZeroMQ (FIX 4.4)<br>• `python-pandas`: Apache Arrow Flight & ZeroMQ PUB/SUB (Zero-Copy)<br>• `metatrader`: MT4/MT5 DLL Wrapper & Binary Tick Structs<br>• `quantconnect`: C# / LEAN DataQueueHandler<br>• `bookmap`: Level-3 Market By Order (MBO) TCP / Shared Memory |
| **3. Indicators Catalog (`INDICATORS_CATALOG`)** | • `orderflow-delta`: Order Flow & Cumulative Delta Volume (L2 Depth)<br>• `vwap-twap`: Session VWAP & Standard Deviation Bands (L1 Top of Book)<br>• `implied-volatility`: Implied Volatility & Options Greeks (L2 Depth)<br>• `altman-zscore`: Altman Z-Score & Piotroski F-Score (L1 Fundamentals)<br>• `nlp-sentiment`: Real-Time NLP News & SEC Filings Sentiment (News/SEC Streams)<br>• `whale-radar`: On-Chain Whale Transfers & Smart Money Mempool<br>• `rsi-macd`: Multi-Timeframe Momentum Divergences<br>• `liquidity-imbalance`: Bid/Ask Imbalance & Spoofing Detector (L3 Single Orders) |
| **4. Asset Categories (`ASSET_CATEGORIES`)** | • `krypto`: DeFi, Layer-1/2, Perpetual Futures, AI Tokens<br>• `us-aktien`: Mega-Cap Tech, S&P 500, High-Growth, Semiconductors<br>• `eu-aktien`: DAX 40 Bluechips, Euro Stoxx 50, Dividend Aristocrats<br>• `rohstoffe`: Precious Metals (Gold/Silver), Energy (Brent/WTI), Industrial Metals<br>• `forex`: G10 Majors, Minors, Exotics<br>• `bonds`: US 10Y/2Y Yields, German Bunds, Yield Curve Spreads |

### 3.2 Automated Synthesis & Algorithmic Computations

The builder calculates a 5-stage architectural execution plan dynamically using a `useMemo` dependency tree:
1. **Stage 1 (Ingestion):** Primary Ingestion & Authority Normalization (Binance, TwelveData, Alchemy RPC).
2. **Stage 2 (Validation):** Evidence Merkle Gate & Flash-Crash Outlier Filter (Jitter threshold 15ms, SHA-256 Merkle tree).
3. **Stage 3 (Compute):** Real-Time Vectorized Indicator Compute Core (Ring buffer size 10,000, zero-copy mode).
4. **Stage 4 (Distribution):** In-Memory State & Arrow Flight Distribution (Redis 7 LRU RingBuffer, gRPC port 8815).
5. **Stage 5 (Egress):** Target Tool Native Egress Adapter (PineScript, BLPAPI, PyArrow, ZeroMQ, MBO).

### 3.3 Dynamic SLA, Cost & Tokenomics Engine

- **End-to-End Latency Calculation:** Modeled from 4ms up to 60ms based on selected concept and indicator computational overhead.
- **Data Quality Score (DQS):** Computed from 95.0% to 99.8% based on consensus gates and proof types.
- **Cost & Staking Mapping:**
  - Self-hosted infrastructure cost calculated at €12.00 to €28.00/month (fitting within the €40/mo budget).
  - Enterprise benchmark reference cost calculated at €1,400 to €3,500/month.
  - $CPT Staking Tier requirement: Tier I (1,000 $CPT) to Tier III (25,000 $CPT) granting 100% fee exemption.

### 3.4 Code Generation & Export Capabilities

The existing builder exports runnable code in 4 separate formats:
- **`pipeline.py`:** Complete asynchronous Python 3 script using `asyncio`, `dataclasses`, and simulated high-speed tick generators.
- **`pipeline.json`:** Formal schema specification conforming to `https://schema.capitalai.network/pipeline/v4.2.json`.
- **`Connector.ts`:** TypeScript multiplexer connector implementation.
- **`docker-compose.yml`:** Multi-service container orchestration stack (ingestion, Redis buffer, Merkle auditor).
- **PDF Export:** Vector document generated in-memory via `jspdf` featuring architectural block diagrams and metrics.

---

## 4. Pipeline State Persistence & Data Flow Audit

### 4.1 Persistence Mechanism
- **Current State:** **Purely Ephemeral Client Memory (`useState`).**
- **State Loss:** Refreshing the page resets the pipeline configuration to default (`selectedConcept = 'authority'`).
- **URL Parameters:** `App.tsx` parses URL queries only for ticker analysis (`?analysis=`, `?ticker=`, `?sector=`). There is **no URL serialization** for pipeline state.
- **Storage Subsystems:** Neither `localStorage`, `sessionStorage`, nor `IndexedDB` are currently utilized for the Pipeline Builder.

### 4.2 Data Flow Mechanics
- Client-side static definitions feed the synthesis function.
- No live WebSocket connection is established in the web client; Python and Docker snippets generate configurations intended for external execution.

---

## 5. Backend, Database & Infrastructure Audit

In compliance with AP-007, the actual state of backend and deployment infrastructure is audited as follows:

| System / Component | Current Implementation Status in Codebase |
|---|---|
| **Supabase Database Tables** | **None.** No Supabase client (`@supabase/supabase-js`) is installed in `package.json`. No SQL migration files exist. |
| **Supabase RLS Policies** | **None.** No Row-Level Security policies or roles configured. |
| **Supabase Storage Buckets** | **None.** No remote object buckets configured. |
| **Authentication System** | Simulated UI modal (`LoginPage.tsx`) with client-side state only. |
| **Backend Business API (NestJS)**| **None.** The repository is a standalone Vite + React SPA. An Express dependency is present in `package.json` for potential preview serving, but no NestJS modules exist. |
| **WebSocket Gateway (Go)** | **None.** Code snippets provide Go references, but no Go files or binaries exist in the repository. |
| **Message Bus (NATS JetStream)**| **None.** NATS client is not integrated. |
| **Render Deployment Units** | **None.** No `render.yaml` or Render blueprint manifests present. |
| **GitHub Enterprise Workflows** | **None.** No `.github/workflows/` directory present. |
| **Environment Variables** | Restricted to: `GEMINI_API_KEY`, `APP_URL`, and `VITE_GA_MEASUREMENT_ID`. |

---

## 6. Gap Analysis & Component Classification

| Existing Element | Classification | Rationale & Migration Action |
|---|---|---|
| `PipelineBuilder.tsx` | **REFACTOR & EXTEND** | Retain UI synthesis core; modularize into subcomponents (canvas, node catalog, parameter drawers, export modal). |
| Data Concepts Definition | **EXTEND** | Expand from 5 predefined concepts to dynamic composition with contract-based nodes. |
| Analysis Tools Catalog | **EXTEND** | Add gRPC, Webhook, and REST endpoints as generic egress nodes. |
| Indicators Catalog | **EXTEND** | Convert to modular `analytics` & `scoring` node catalog. |
| Code Generators (`pipeline.py`, JSON) | **KEEP & EXTEND** | Retain existing high-fidelity generators; add Zod validation and NATS/Go connector templates. |
| Client-Side Routing (`App.tsx`) | **EXTEND** | Add pipeline URL state serialization (`/pipeline-builder?id=...` or base64 config share). |
| PDF Blueprint Export | **KEEP** | Maintain `jspdf` export as an offline, zero-cost value-add. |
| Data Contracts & Validation | **NEW** | Introduce contract interfaces (Zod schemas) for all node types. |
| State Persistence | **NEW** | Implement multi-tier persistence (LocalStorage fallback -> Supabase PostgreSQL schema). |
| Supabase Migrations & RLS | **NEW** | Author comprehensive SQL migration files for pipelines, nodes, runs, and evidence logs. |
| Render & CI/CD Definitions | **NEW** | Author `render.yaml` and GitHub Actions CI workflow specifications. |

---
*Report ARCH-PIPE-0001 finalized. Proceeding to Target State Delta Report (ARCH-PIPE-0002).*
