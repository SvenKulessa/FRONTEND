# ARCH-PIPE-0002: Target State Delta Report & Evolution Plan
**Document ID:** ARCH-PIPE-0002  
**Project:** CAPITAL AI  
**Component:** Visual Pipeline Builder Evolution & Multi-Asset Intelligence Platform  
**Status:** Architecture Blueprint Approved  
**Author:** AI System Architect & Senior Software Engineer  
**Date:** September 2026  

---

## 1. Target Architecture & Strategic Vision

The **CAPITAL AI Pipeline Builder** is transformed from a static concept-to-code generator into a **modular, visual, evidence-first Multi-Asset Intelligence Platform**. It establishes a contract-first runtime and visual composer spanning data ingestion, authority validation, feature engineering, quantitative scoring, backtesting, risk guardrails, report generation, and paper trading.

### 1.1 Core Architectural Principles (AP-001 – AP-008)

1. **AP-001 (Contract-First Architecture):** Every node, connector, evidence record, and provider route implements a formal, versioned TypeScript contract validated at runtime via Zod schemas.
2. **AP-002 (Evidence Before Decision):** Zero production scores, rankings, alerts, or paper orders may execute without a cryptographically sealed Merkle evidence packet, source timestamps, provider consensus quorum, and audit lineage.
3. **AP-003 (Taxonomy Controls Routing):** Asset class (Crypto, Equities, FX, Commodities, Rates) and subclass strictly determine required providers, compliance gates, calculation methods, and UI tooltips.
4. **AP-004 (Human Approval for Irreversible Actions):** Strict approval barriers for publishing, domain actions, API key rotations, live trade authorization, or token operations.
5. **AP-005 (Paper-First Execution):** Research -> Backtesting -> Paper Trading -> Live Execution Guardrails. No strategy may execute live without passing simulation gates.
6. **AP-006 (Budget-Aware Operations):** All architecture components must strictly adhere to the **€40/month infrastructure budget**.
7. **AP-007 (No Hidden Current-State Assumptions):** Physical schema and deployment units are generated via explicit code and SQL migrations without assuming non-existent infrastructure.
8. **AP-008 (Policy-Bounded Autonomy):** Agent operations are strictly sandboxed to allowlisted read and reversible staging tasks.

---

## 2. Complete Target Node Catalog Architecture

The platform architecture defines 8 modular node categories:

```
[ Data Ingestion ] ──────> [ Authority & Quality ] ──────> [ Transformation ]
        │                             │                           │
        ▼                             ▼                           ▼
[ Analytics & Features ] ───> [ Models & Reasoning ] ────> [ Risk & Guardrails ]
        │                             │                           │
        ▼                             ▼                           ▼
[ Benchmarking / Backtest ] ──> [ Egress / Paper / Reports / Visuals ]
```

### 2.1 Ingestion Nodes (`node_categories.ingestion`)
- `provider_rest`: Polling REST client with rate-limit governor and jitter backoff.
- `provider_websocket`: Resilient WebSocket multiplexer with heartbeat and auto-reconnect.
- `rss_feed`: Financial news, corporate RSS, and regulatory feed parser.
- `file_upload`: Manual drag-and-drop ingestion of JSON/CSV/Parquet datasets.
- `csv_import`: High-speed batch ingestion with type inference.
- `manual_input`: Parameter overrides and test tick injections.
- `blockchain_rpc`: EVM and Solana RPC nodes for direct mempool and block logs.
- `graphql_subgraph`: The Graph decentralized protocol querying for DeFi pools.
- `social_api`: Social volume and sentiment ingest (X/Twitter, Reddit, Farcaster).
- `news_api`: Structured institutional financial news wires.
- `macro_api`: Macroeconomic indicators (FRED, ECB, BLS, OECD).
- `github_api`: Developer activity and commit velocity tracking for Web3 protocols.
- `ga4_mcp`: Web analytics and traffic ingestion.
- `search_console_api`: Search trend velocity and retail interest monitoring.

### 2.2 Authority & Quality Nodes (`node_categories.authority`)
- `provider_registry`: Verified catalog of market data providers and endpoints.
- `provider_matrix`: Dynamic primary/secondary/fallback provider routing.
- `rate_limit_budget`: Token-bucket rate limiter enforcing provider quotas.
- `circuit_breaker`: Error-rate-based automatic feed isolation.
- `request_coalescer`: Deduplicating concurrent identical queries.
- `market_data_cache`: High-speed in-memory LRU cache.
- `schema_validator`: Runtime Zod validation against target data types.
- `freshness_validator`: Maximum allowable age check (staleness rejection).
- `sequence_validator`: Monotonic orderbook and tick sequence number validation.
- `provider_consensus`: Multi-source median filtering and outlier trimming.
- `data_quality_gate`: Comprehensive DQS scoring barrier.
- `evidence_writer`: SHA-256 Merkle leaf creator with cryptographic timestamping.

### 2.3 Transformation Nodes (`node_categories.transformation`)
- `canonical_normalizer`: Unified tick, candle, and orderbook schema mapper.
- `asset_resolver`: Mapping tickers across naming standards (ISIN, CIK, CoinGecko ID, CCXT).
- `taxonomy_router`: Directing events based on asset subclass and risk profile.
- `timeframe_resampler`: Real-time OHLCV aggregation (1s, 1m, 5m, 1h, 1d).
- `currency_converter`: Real-time FX conversion to target quote currency (EUR/USD).
- `unit_converter`: Standardizing volume units, satoshis, and base decimals.
- `outlier_winsorizer`: Clamping flash-crash and anomalous single-tick spikes.
- `feature_builder`: Real-time sliding window calculations.
- `enrichment_join`: Merging macro/sentiment context into price events.

### 2.4 Analytics, Scoring & Features
- `orderflow_delta`: Cumulative volume delta (CVD) and aggressive buy/sell ratio.
- `vwap_bands`: Anchored VWAP with standard deviation volatility bands.
- `volatility_surface`: Implied volatility modeling and Black-Scholes Greeks.
- `macro_credit`: Altman Z-Score, Piotroski F-Score, and bond yield spreads.
- `sentiment_nlp`: FinBERT sentiment classification for news headlines.
- `smart_money_tracker`: Dark pool blocks and on-chain whale transaction scoring.
- `multi_factor_score`: Weighted synthesis of technical, on-chain, and fundamental factors.

### 2.5 Risk & Guardrail Gates
- `max_drawdown_stop`: Automated circuit trip on maximum strategy drawdown.
- `volatility_circuit`: Execution halt on severe market turbulence.
- `regulatory_sanction_filter`: Sanctioned address and restricted jurisdiction blocking.
- `position_limit_gate`: Strict capital allocation ceilings per asset.

### 2.6 Benchmarking, Backtest & Paper Execution
- `historical_backtest_runner`: Event-driven backtester with slippage and fee simulation.
- `benchmark_comparator`: Relative performance analysis vs. S&P 500, BTC, and MSCI World.
- `paper_broker_adapter`: Virtual portfolio execution maintaining simulated cash and PnL.
- `order_approval_gate`: Mandatory human sign-off for execution-eligible signals.

---

## 3. Workflow Lifecycle & Execution Modes

### 3.1 Pipeline States
```
[ Draft ] ──> [ Validated ] ──> [ Benchmarked ] ──> [ Shadow ] ──> [ Canary ] ──> [ Production ]
                                                                             │
                                                                             ├──> [ Deprecated ]
                                                                             └──> [ Archived ]
```

### 3.2 Execution Modes
1. **Research:** Ad-hoc backtesting and parameter tuning; zero alerts or external side-effects.
2. **Shadow:** Ingestion and scoring run in real-time, but outputs are written only to audit logs.
3. **Paper:** Automated simulation emitting virtual orders to the paper trading engine.
4. **Production:** Emits verified scores, dashboard rankings, alerts, and PDF research reports.
5. **Execution Eligible:** Reserved tier; unlocks external routing only after human compliance approval.

---

## 4. System of Record: Supabase Schema Architecture

To fulfill the requirements without violating AP-007, the following relational schema is designed for deployment via SQL migration:

### 4.1 Table Manifest
1. `auth.users`: Core multi-tenant identities managed by Supabase Auth.
2. `public.workspaces`: Multi-tenant organization boundaries and quota tiers.
3. `public.workspace_members`: User-to-workspace membership with RBAC (owner, analyst, viewer).
4. `public.pipelines`: Pipeline definition header (name, description, status, mode, version).
5. `public.pipeline_nodes`: Graph node declarations, position coordinates, and parameter bundles.
6. `public.pipeline_edges`: Directed dataflow edges connecting node ports.
7. `public.pipeline_versions`: Immutable snapshot bundles of validated pipelines.
8. `public.pipeline_runs`: Execution logs with status, latency, tick counts, and error states.
9. `public.evidence_bundles`: SHA-256 Merkle roots, quorum consensus, and data source signatures.
10. `public.paper_portfolios`: Simulated capital accounts for paper trading.
11. `public.paper_orders`: Simulated limit/market orders and fills.
12. `public.audit_events`: Tamper-evident ledger of user actions and automated state transitions.

### 4.2 Storage Buckets
- `pipeline-blueprints`: Generated architecture PDFs and JSON specifications.
- `evidence-proofs`: Cryptographic Merkle tree audit artifacts.
- `research-reports`: Published institutional research documents.

---

## 5. Budget-Aware Operating Infrastructure (< €40 / Month)

| Component | Target Implementation | Host / Provider | Monthly Cost |
|---|---|---|---|
| **Web SPA & BFF** | Vite + React 19 Frontend | Render Static Site / Node Free/Starter | €0.00 – €7.00 |
| **BFF & Business API** | NestJS modular services | Render Web Service (Starter tier) | €7.00 |
| **System of Record** | PostgreSQL + Auth + Storage | Supabase Free / Micro tier | €0.00 – €10.00 |
| **WebSocket Ingestion** | Lightweight Go Daemon | Render Background Worker | €7.00 |
| **Message & State Bus** | Embedded NATS JetStream / Redis | Shared In-Memory / Render Worker | €7.00 |
| **Buffer Reserve** | Variable traffic & domain DNS | Contingency | €2.00 |
| **Total Projected Budget** | | | **€23.00 – €38.00 / Mo** |

---

## 6. Phased Evolution Roadmap & Acceptance Criteria

### Work Package 1 (WP-1): Architecture Contracts & Validation Layer
- Define complete TypeScript types & Zod schemas for all 8 node categories.
- Implement strict contract validation for node input/output signatures.
- **Acceptance Criteria:** `tsc --noEmit` and Zod schema validations pass with 100% coverage on all pipeline contracts.

### Work Package 2 (WP-2): Supabase Persistence & Migrations
- Provide copy-paste-ready SQL migration files for all 12 tables and RLS security rules.
- Implement client-side persistence adapter with local fallback and remote sync.
- **Acceptance Criteria:** Valid SQL migration script generated; client safely falls back to local storage when offline.

### Work Package 3 (WP-3): Modular Visual Pipeline Canvas & Node Catalog UI
- Refactor `PipelineBuilder.tsx` into modular visual components (Node Palette, Drag Canvas, Inspector Drawer, Evidence Terminal).
- Implement interactive connections between nodes with cycle detection and type-checking.
- **Acceptance Criteria:** User can visually drag, connect, configure, and inspect pipeline nodes across all 8 categories with live DQS calculation.

### Work Package 4 (WP-4): Evidence, Simulation & Paper Trading Engine
- Implement the Merkle evidence tree generator and cryptographic audit log.
- Integrate paper trading order generation with risk guardrail enforcement.
- **Acceptance Criteria:** Pipeline runs in "Paper" mode emit simulated orders with valid Merkle proofs and risk limit checks.

### Work Package 5 (WP-5): Deployment Units & CI/CD Manifests
- Create `render.yaml` infrastructure-as-code specification.
- Create GitHub Actions workflow for linting, testing, and contract auditing.
- **Acceptance Criteria:** Valid Render and GitHub Actions manifests ready for production provisioning.

---
*Report ARCH-PIPE-0002 finalized. Foundation audit complete.*
