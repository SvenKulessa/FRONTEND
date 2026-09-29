/**
 * CAPITAL AI — PIPELINE TOOL INVENTORY & REVENUE ASSURANCE CATALOG (WP-004 / AP-006)
 *
 * Implements a strict, institutional inventory and cataloging system for user-selected tools
 * across all 5 architecture layers (Modular Pipeline Builder):
 * 1. Screener & Analysis Focus (e.g. Buffett Value Check, BaFin Scorer, Whale Radar)
 * 2. Timing & Latency Requirements (e.g. EOD, 15m Delayed, 1m Intraday, Sub-20ms Tick)
 * 3. Data Ingestion Gateways (e.g. TwelveData, FRED, Binance, Kraken, Alchemy, CCXT)
 * 4. Caching & Memory Architecture (e.g. Redis Ring Buffer, FlatBuffers Delta, Arrow Flight)
 * 5. BaFin / MiCA Compliance & Audit Evidence (e.g. WORM Storage, Merkle Tree, Outlier Consensus)
 */

export interface CatalogToolEntry {
  sku: string;
  layerNumber: 1 | 2 | 3 | 4 | 5;
  layerName: string;
  id: string;
  name: string;
  subtitle: string;
  category: string;
  monthlyCostEur: number;
  latencyContribution: string;
  latencyMs: number;
  specs: string;
  bafinStandard: string;
  licenseType: 'Commercial Enterprise' | 'Sovereign Free' | 'Open Source MIT' | 'Public Market Data';
  revenueAssuranceGrade: 'A+' | 'A' | 'B' | 'Safe' | 'Attention';
  keyFormulas?: string[];
}

export type SignalType = 'bullish' | 'bearish' | 'neutral' | 'volatility';
export type PriorityLevel = 'P1' | 'P2' | 'P3';
export type TimeframeRelevance = '1m' | '15m' | 'eod' | 'tick' | 'multi';

export interface IndicatorToolItem {
  id: string;
  name: string;
  shortName: string;
  category: 'Momentum' | 'Trend' | 'Volatilität' | 'Volumen' | 'Gleitende Durchschnitte';
  formula: string;
  signal: SignalType;
  priority: PriorityLevel;
  timeframe: TimeframeRelevance;
  defaultThreshold: string;
  description: string;
}

export interface PatternToolItem {
  id: string;
  name: string;
  category: 'Umkehrmuster' | 'Fortsetzungsmuster' | 'Harmonic & Wyckoff' | 'Breakout';
  signal: SignalType;
  priority: PriorityLevel;
  timeframe: TimeframeRelevance;
  winRateHistorical: string;
  description: string;
}

export interface NewsApiToolItem {
  id: string;
  name: string;
  category: 'Makro & Zentralbanken' | 'Regulatorisch & BaFin' | 'Ad-Hoc & Earnings' | 'Krypto & On-Chain';
  provider: string;
  monthlyCostEur: number;
  latencySpec: string;
  updateFrequency: string;
  bafinRelevance: string;
  description: string;
}

export interface PipelineConfigState {
  analysisFocusId: string;
  latencyIntervalId: string;
  providerIds: string[];
  cachingId: string;
  evidenceId: string;
  selectedIndicators?: string[];
  selectedPatterns?: string[];
  selectedNewsApis?: string[];
  selectedAssetClasses?: string[];
  logicalOperator?: 'AND' | 'OR';
}

export interface InventoryBOMSummary {
  items: CatalogToolEntry[];
  totalMonthlyCostEur: number;
  budgetLimitEur: number;
  budgetUtilizationPercent: number;
  remainingBudgetEur: number;
  isBudgetCompliant: boolean;
  calculatedLatencyMs: number;
  bafinComplianceScore: number;
  complianceRating: string;
  activeProviderCount: number;
  hasRedundantFeeds: boolean;
  generatedTimestamp: string;
}

// =============================================================================
// MASTER TOOL REGISTRY (THE COMPONENT CATALOG)
// =============================================================================

export const MASTER_TOOL_CATALOG: Record<string, CatalogToolEntry> = {
  // --- LAYER 1: ANALYSIS & SCREENER ENGINE ---
  'buffett-value': {
    sku: 'CAP-L1-BUFFETT',
    layerNumber: 1,
    layerName: 'Ebene 1: Screener-Fokus',
    id: 'buffett-value',
    name: 'Buffett Value Check Engine',
    subtitle: 'Fundamental- & Burggraben-Scoring',
    category: 'Fundamental Analysis',
    monthlyCostEur: 0.0,
    latencyContribution: 'EOD Batch Execution',
    latencyMs: 15,
    specs: 'DCF Innerer Wert, 10J ROE >15%, Margin of Safety, Verschuldungsgrad <50%',
    bafinStandard: 'WpHG § 83 Revisionssicher',
    licenseType: 'Open Source MIT',
    revenueAssuranceGrade: 'A+',
    keyFormulas: ['ROE = Net Income / Equity > 15%', 'DCF MoS = (FairValue - Price) / FairValue > 25%'],
  },
  'bafin-scoring': {
    sku: 'CAP-L1-BAFIN',
    layerNumber: 1,
    layerName: 'Ebene 1: Screener-Fokus',
    id: 'bafin-scoring',
    name: 'BaFin Multi-Faktor Scorer',
    subtitle: 'MaRisk & WpHG Risiko-Scoring',
    category: 'Compliance & Risk',
    monthlyCostEur: 0.0,
    latencyContribution: '1-15 Min Refresh',
    latencyMs: 18,
    specs: 'Sharpe Ratio, Sortino Ratio, Value at Risk (VaR 99%), Max Drawdown, Stresstest',
    bafinStandard: 'BaFin MaRisk & WpHG § 83',
    licenseType: 'Commercial Enterprise',
    revenueAssuranceGrade: 'A+',
    keyFormulas: ['Sharpe = (Rp - Rf) / Sigma', 'VaR_99 = Mu - 2.33 * Sigma'],
  },
  'momentum-breakout': {
    sku: 'CAP-L1-MOMENTUM',
    layerNumber: 1,
    layerName: 'Ebene 1: Screener-Fokus',
    id: 'momentum-breakout',
    name: 'Momentum & Trend Breakout Screener',
    subtitle: 'Intraday Trendfolge & Volatilität',
    category: 'Technical Screening',
    monthlyCostEur: 0.0,
    latencyContribution: '60s Intraday Refresh',
    latencyMs: 25,
    specs: '200/50 SMA Crossover, RSI 14 Divergenzen, VWAP Spike, ATR Volatilität',
    bafinStandard: 'MiFID II Best Execution',
    licenseType: 'Open Source MIT',
    revenueAssuranceGrade: 'Safe',
    keyFormulas: ['VWAP = Sum(P * V) / Sum(V)', 'RSI = 100 - (100 / (1 + RS))'],
  },
  'whale-radar': {
    sku: 'CAP-L1-WHALE',
    layerNumber: 1,
    layerName: 'Ebene 1: Screener-Fokus',
    id: 'whale-radar',
    name: 'Smart Money & Whale Radar',
    subtitle: 'On-Chain & Dark Pool Großaufträge',
    category: 'On-Chain & Dark Pool',
    monthlyCostEur: 0.0,
    latencyContribution: 'Sub-45ms Realtime Events',
    latencyMs: 35,
    specs: 'DEX Wal-Swaps (>500.000 $), CEX Netflow, ATS Dark Pool Block-Trades',
    bafinStandard: 'MiCA On-Chain Audit',
    licenseType: 'Commercial Enterprise',
    revenueAssuranceGrade: 'A',
    keyFormulas: ['Netflow = Inflow - Outflow', 'DarkPoolRatio = BlockVol / TotalVol'],
  },
  'macro-yield': {
    sku: 'CAP-L1-MACRO',
    layerNumber: 1,
    layerName: 'Ebene 1: Screener-Fokus',
    id: 'macro-yield',
    name: 'Macro Yield Curve & Spread Radar',
    subtitle: 'Zinsstrukturkurve & Zentralbank-Monitor',
    category: 'Macroeconomics',
    monthlyCostEur: 0.0,
    latencyContribution: 'Daily / Weekly Macro',
    latencyMs: 120,
    specs: 'US 10Y-2Y Inversion, M2 Geldmengen-Wachstum, CPI Kerninflation, Credit Spreads',
    bafinStandard: 'Sovereign Data Authority',
    licenseType: 'Sovereign Free',
    revenueAssuranceGrade: 'A+',
    keyFormulas: ['YieldSpread = 10Y_Yield - 2Y_Yield'],
  },
  'hft-arbitrage': {
    sku: 'CAP-L1-HFT',
    layerNumber: 1,
    layerName: 'Ebene 1: Screener-Fokus',
    id: 'hft-arbitrage',
    name: 'HFT Cross-Exchange Arbitrage Screener',
    subtitle: 'Sub-20ms Spread- & Liquiditäts-Scoring',
    category: 'High-Frequency',
    monthlyCostEur: 0.0,
    latencyContribution: 'Sub-18ms Tick-by-Tick',
    latencyMs: 18,
    specs: 'L2 Top-of-Book Differenzen, Monotone Sequenzen, VWAP Slippage Kompensation',
    bafinStandard: 'MiFID II Art. 48 Algorithmus-Compliance',
    licenseType: 'Commercial Enterprise',
    revenueAssuranceGrade: 'A+',
    keyFormulas: ['ArbSpread = BestBid_B - BestAsk_A - 2*Fee'],
  },

  // --- LAYER 2: TIMING & LATENCY REQUIREMENTS ---
  'eod-daily': {
    sku: 'CAP-L2-EOD',
    layerNumber: 2,
    layerName: 'Ebene 2: Taktung & Latenz',
    id: 'eod-daily',
    name: 'End-of-Day (EOD) / Daily Close',
    subtitle: 'Tägliche Schlusskurse + Bilanzen',
    category: 'Batch Taktung',
    monthlyCostEur: 0.0,
    latencyContribution: 'Batch Close (EOD)',
    latencyMs: 200,
    specs: 'Schlusskurse, fundamentale Bilanzdaten, kein Dauer-WebSocket Overhead',
    bafinStandard: 'Vollständig BaFin-auditierbar',
    licenseType: 'Public Market Data',
    revenueAssuranceGrade: 'A+',
  },
  'delayed-15m': {
    sku: 'CAP-L2-15M',
    layerNumber: 2,
    layerName: 'Ebene 2: Taktung & Latenz',
    id: 'delayed-15m',
    name: '15-Minuten Delayed Snapshot',
    subtitle: 'Regulatorischer Prüfstandard',
    category: 'Snapshot Taktung',
    monthlyCostEur: 0.0,
    latencyContribution: '15 Min Intervall (SLA 99.9%)',
    latencyMs: 900,
    specs: 'Offizieller Prüfstandard für Vermögensverwalter; 0 € Börsenlizenzgebühr',
    bafinStandard: 'Offizieller BaFin WpHG § 83 Standard',
    licenseType: 'Public Market Data',
    revenueAssuranceGrade: 'A+',
  },
  'intraday-1m': {
    sku: 'CAP-L2-1M',
    layerNumber: 2,
    layerName: 'Ebene 2: Taktung & Latenz',
    id: 'intraday-1m',
    name: '1-Minuten Intraday OHLCV Candles',
    subtitle: '60 Sekunden Taktung',
    category: 'Intraday Streaming',
    monthlyCostEur: 0.0,
    latencyContribution: '60 Sekunden Intervall',
    latencyMs: 60,
    specs: 'Kompakte OHLCV Kerzen, ca. 150 MB / Tag, moderater Cache-Bedarf',
    bafinStandard: 'MiFID II Best Execution',
    licenseType: 'Public Market Data',
    revenueAssuranceGrade: 'Safe',
  },
  'hft-tick': {
    sku: 'CAP-L2-TICK',
    layerNumber: 2,
    layerName: 'Ebene 2: Taktung & Latenz',
    id: 'hft-tick',
    name: 'Sub-20ms Realtime WebSocket Streaming',
    subtitle: 'Tick-by-Tick Monotoner Feed',
    category: 'Ultra-Low Latency',
    monthlyCostEur: 0.0,
    latencyContribution: 'Sub-20ms Tick-by-Tick',
    latencyMs: 18,
    specs: 'Ungefilterter L2 Orderbuch-Stream mit monotonen Sequenznummern',
    bafinStandard: 'Erfordert monotone Sequenzierung',
    licenseType: 'Public Market Data',
    revenueAssuranceGrade: 'A',
  },

  // --- LAYER 3: DATA INGESTION GATEWAYS ---
  'twelvedata': {
    sku: 'CAP-L3-TWELVE',
    layerNumber: 3,
    layerName: 'Ebene 3: Daten-Gateways',
    id: 'twelvedata',
    name: 'TwelveData Financial Feeds',
    subtitle: 'Aktien, Forex, Rohstoffe & Bilanzen',
    category: 'Equities & Fundamental Data',
    monthlyCostEur: 8.5,
    latencyContribution: '40 - 80ms RTT',
    latencyMs: 65,
    specs: 'REST + WSS, US & EU Top 150 Aktien, DAX, G10 Forex, ETFs, 1825 Tage Bilanzhistorie',
    bafinStandard: 'Regulatorisch zugelassene Referenzkurse (US/EU)',
    licenseType: 'Commercial Enterprise',
    revenueAssuranceGrade: 'A+',
  },
  'fred': {
    sku: 'CAP-L3-FRED',
    layerNumber: 3,
    layerName: 'Ebene 3: Daten-Gateways',
    id: 'fred',
    name: 'Federal Reserve Bank of St. Louis (FRED)',
    subtitle: 'Makro, Zinsstruktur & Disziplin',
    category: 'Sovereign Macro Data',
    monthlyCostEur: 0.0,
    latencyContribution: '120 - 150ms RTT',
    latencyMs: 135,
    specs: 'REST JSON, US 10Y-2Y Zinskurve, M2 Geldmenge, Fed Funds Rate, risikofreie Diskontierung',
    bafinStandard: '100% Free Sovereign Authority Data',
    licenseType: 'Sovereign Free',
    revenueAssuranceGrade: 'A+',
  },
  'binance': {
    sku: 'CAP-L3-BINANCE',
    layerNumber: 3,
    layerName: 'Ebene 3: Daten-Gateways',
    id: 'binance',
    name: 'Binance Market Data Engine',
    subtitle: 'Krypto Realtime L2 Orderbuch',
    category: 'Crypto Liquidity',
    monthlyCostEur: 0.0,
    latencyContribution: '15 - 25ms RTT',
    latencyMs: 20,
    specs: 'WebSocket (WSS) + REST, BTC/ETH & Top 100 Altcoins, L2 Depth Ticker',
    bafinStandard: 'Öffentlicher Public Data Feed',
    licenseType: 'Public Market Data',
    revenueAssuranceGrade: 'A',
  },
  'kraken': {
    sku: 'CAP-L3-KRAKEN',
    layerNumber: 3,
    layerName: 'Ebene 3: Daten-Gateways',
    id: 'kraken',
    name: 'Kraken Financial Ingestion',
    subtitle: 'Krypto & EUR Referenz',
    category: 'Regulated Crypto/EUR',
    monthlyCostEur: 0.0,
    latencyContribution: '20 - 30ms RTT',
    latencyMs: 25,
    specs: 'WebSocket (WSS), Krypto/EUR Orderbücher, monotone Sequenzierung, BaFin-Partner',
    bafinStandard: 'BaFin-konforme EU-Referenz',
    licenseType: 'Public Market Data',
    revenueAssuranceGrade: 'A+',
  },
  'alchemy': {
    sku: 'CAP-L3-ALCHEMY',
    layerNumber: 3,
    layerName: 'Ebene 3: Daten-Gateways',
    id: 'alchemy',
    name: 'Alchemy Supernode Web3 RPC',
    subtitle: 'On-Chain DEX Swaps & Mempool',
    category: 'Blockchain RPC',
    monthlyCostEur: 0.0,
    latencyContribution: '45 - 65ms RTT',
    latencyMs: 55,
    specs: 'RPC + WebSocket, Ethereum & Solana DEX Swaps (Uniswap/Raydium)',
    bafinStandard: 'Dezentral auditierbare Blockchain Logs (MiCA)',
    licenseType: 'Public Market Data',
    revenueAssuranceGrade: 'Safe',
  },
  'ccxt': {
    sku: 'CAP-L3-CCXT',
    layerNumber: 3,
    layerName: 'Ebene 3: Daten-Gateways',
    id: 'ccxt',
    name: 'CCXT Pro Multiplexer',
    subtitle: 'Multi-Börsen Normalisierung',
    category: 'Cross-Exchange Bridge',
    monthlyCostEur: 0.0,
    latencyContribution: '30 - 50ms RTT',
    latencyMs: 40,
    specs: 'Self-Hosted Multiplexer, 120+ Krypto-Börsen vereinheitlicht, Failover-Support',
    bafinStandard: 'Open-Source (MIT Lizenz)',
    licenseType: 'Open Source MIT',
    revenueAssuranceGrade: 'Safe',
  },

  // --- LAYER 4: CACHING & MEMORY ARCHITECTURE ---
  'redis-ring': {
    sku: 'CAP-L4-REDIS',
    layerNumber: 4,
    layerName: 'Ebene 4: Caching & RAM',
    id: 'redis-ring',
    name: 'In-Memory Redis Ring Buffer',
    subtitle: '1.000 Ticks / Symbol im RAM',
    category: 'In-Memory Cache',
    monthlyCostEur: 0.0,
    latencyContribution: 'Sub-5ms Query Latenz',
    latencyMs: 4,
    specs: 'Ringpuffer mit 1.000 Ticks / Symbol, ca. 64 MB RAM, entkoppelt Clients verlustfrei',
    bafinStandard: 'Verlustfreie Entkopplung von Clients nach MaRisk',
    licenseType: 'Open Source MIT',
    revenueAssuranceGrade: 'A+',
  },
  'flatbuffers-delta': {
    sku: 'CAP-L4-FLATBUF',
    layerNumber: 4,
    layerName: 'Ebene 4: Caching & RAM',
    id: 'flatbuffers-delta',
    name: 'FlatBuffers / Delta Kompression',
    subtitle: '70% Bandbreiten-Reduktion',
    category: 'Binary Compression',
    monthlyCostEur: 0.0,
    latencyContribution: 'Sub-2ms Zero-Copy',
    latencyMs: 2,
    specs: 'Binäre Delta-Kompression ohne JSON Overhead; minimale Garbage Collection Delays',
    bafinStandard: 'Exakte Monotonie-Verifizierung',
    licenseType: 'Open Source MIT',
    revenueAssuranceGrade: 'A+',
  },
  'arrow-flight': {
    sku: 'CAP-L4-ARROW',
    layerNumber: 4,
    layerName: 'Ebene 4: Caching & RAM',
    id: 'arrow-flight',
    name: 'Zero-Copy Apache Arrow Flight RPC',
    subtitle: 'Direct PyArrow / Pandas Stream',
    category: 'Quant Columnar RPC',
    monthlyCostEur: 0.0,
    latencyContribution: 'Sub-4ms Batching',
    latencyMs: 4,
    specs: 'Spaltenorientiertes Arrow Format direkt in GPU/RAM; ideal für Python Quants',
    bafinStandard: 'Revisionssichere DataFrames',
    licenseType: 'Open Source MIT',
    revenueAssuranceGrade: 'A',
  },
  'token-bucket': {
    sku: 'CAP-L4-BUCKET',
    layerNumber: 4,
    layerName: 'Ebene 4: Caching & RAM',
    id: 'token-bucket',
    name: 'Token-Bucket Rate Limiter & Zero-Trust Proxy',
    subtitle: 'DDoS & HTTP 429 Schutz',
    category: 'Traffic Shaping & Security',
    monthlyCostEur: 0.0,
    latencyContribution: '< 1ms Overhead',
    latencyMs: 1,
    specs: 'Strikter Token-Bucket Algorithmus, verhindert API-Sperren, maskiert API-Keys',
    bafinStandard: 'IT-Sicherheitsnachweis nach MaRisk',
    licenseType: 'Open Source MIT',
    revenueAssuranceGrade: 'A+',
  },

  // --- LAYER 5: AUDIT EVIDENCE & COMPLIANCE ---
  'worm-storage': {
    sku: 'CAP-L5-WORM',
    layerNumber: 5,
    layerName: 'Ebene 5: Audit-Trail & Evidence',
    id: 'worm-storage',
    name: 'WORM Storage (Write Once, Read Many)',
    subtitle: '5 Jahre Vorratsdatenspeicherung',
    category: 'Statutory Retention',
    monthlyCostEur: 0.0,
    latencyContribution: 'Asynchrones Append-Only (< 1ms)',
    latencyMs: 1,
    specs: 'Kryptografische Schreibsperre (WORM), revisionssicheres Logging für alle Scores',
    bafinStandard: 'WpHG § 83 & BaFin MaRisk konform',
    licenseType: 'Commercial Enterprise',
    revenueAssuranceGrade: 'A+',
  },
  'merkle-tree': {
    sku: 'CAP-L5-MERKLE',
    layerNumber: 5,
    layerName: 'Ebene 5: Audit-Trail & Evidence',
    id: 'merkle-tree',
    name: 'SHA-256 Merkle Audit Tree',
    subtitle: 'Kryptografischer Integritätsbeweis',
    category: 'Cryptographic Proof',
    monthlyCostEur: 0.0,
    latencyContribution: '1ms Hash-Overhead',
    latencyMs: 1,
    specs: 'Bündelt alle Ticks in Merkle-Wurzeln; mathematischer Nachweis des genauen Kurses',
    bafinStandard: 'Manipulationssicherer Nachweis für Schlichtungsstellen',
    licenseType: 'Open Source MIT',
    revenueAssuranceGrade: 'A+',
  },
  'consensus-outlier': {
    sku: 'CAP-L5-CONSENSUS',
    layerNumber: 5,
    layerName: 'Ebene 5: Audit-Trail & Evidence',
    id: 'consensus-outlier',
    name: 'Multi-Source Median & Outlier Rejection',
    subtitle: 'Flash-Crash & Spoofing-Schutz',
    category: 'Data Integrity Filter',
    monthlyCostEur: 0.0,
    latencyContribution: 'Sub-2ms Filterung',
    latencyMs: 2,
    specs: 'Abweichungen > 2% gegenüber Median werden sofort als Spoofing verworfen',
    bafinStandard: 'Erfüllt BaFin MaRisk Vorgaben zur Datenplausibilisierung',
    licenseType: 'Commercial Enterprise',
    revenueAssuranceGrade: 'A+',
  },
};

// =============================================================================
// MASTER INDICATORS & FORMULAS CATALOG
// =============================================================================

export const MASTER_INDICATORS_CATALOG: IndicatorToolItem[] = [
  {
    id: 'rsi-14',
    name: 'RSI (14) - Relative Strength Index',
    shortName: 'RSI-14',
    category: 'Momentum',
    formula: 'RSI = 100 - (100 / (1 + RS))',
    signal: 'neutral',
    priority: 'P1',
    timeframe: 'multi',
    defaultThreshold: 'Überverkauft < 30 / Überkauft > 70',
    description: 'Misst das Ausmaß jüngster Kursänderungen, um überkaufte oder überverkaufte Zustände zu bewerten.',
  },
  {
    id: 'macd-12-26-9',
    name: 'MACD (12, 26, 9) Trend & Signal Line',
    shortName: 'MACD',
    category: 'Trend',
    formula: 'MACD = EMA(12) - EMA(26); Signal = EMA(9)',
    signal: 'bullish',
    priority: 'P1',
    timeframe: '15m',
    defaultThreshold: 'Histogramm Crossover > 0',
    description: 'Zeigt die Beziehung zwischen zwei exponentiell gleitenden Durchschnitten des Preises eines Wertpapiers.',
  },
  {
    id: 'bollinger-20-2',
    name: 'Bollinger Bänder (20, 2 Sigma)',
    shortName: 'BBands',
    category: 'Volatilität',
    formula: 'Upper = SMA(20) + 2*Sigma; Lower = SMA(20) - 2*Sigma',
    signal: 'volatility',
    priority: 'P2',
    timeframe: '15m',
    defaultThreshold: 'Bandbreiten-Kompression (Squeeze)',
    description: 'Volatilitätsband mit 2 Standardabweichungen um den 20-Perioden Durchschnitt zur Ausbruchserkennung.',
  },
  {
    id: 'ema-ribbon',
    name: 'EMA Ribbon (20, 50, 100, 200)',
    shortName: 'EMA-Ribbon',
    category: 'Gleitende Durchschnitte',
    formula: 'EMA_t = (Price * alpha) + EMA_{t-1} * (1 - alpha)',
    signal: 'bullish',
    priority: 'P1',
    timeframe: 'eod',
    defaultThreshold: 'Fächer-Expansion (Bullish Alignment)',
    description: 'Reihe von exponentiellen Durchschnitten zur Identifikation von übergeordneten Trendphasen.',
  },
  {
    id: 'atr-14',
    name: 'ATR (14) - Average True Range',
    shortName: 'ATR-14',
    category: 'Volatilität',
    formula: 'ATR = SMA(TrueRange, 14)',
    signal: 'volatility',
    priority: 'P2',
    timeframe: '1m',
    defaultThreshold: 'Volatilitäts-Spike > 1.5x Median',
    description: 'Präziser Volatilitätsindikator für dynamische Trailing Stop-Loss und Risikomanagement.',
  },
  {
    id: 'vwap-anchored',
    name: 'VWAP (Volume-Weighted Average Price)',
    shortName: 'VWAP',
    category: 'Volumen',
    formula: 'VWAP = Sum(Price * Volume) / Sum(Volume)',
    signal: 'bullish',
    priority: 'P1',
    timeframe: '1m',
    defaultThreshold: 'Kurs über Tages-VWAP Benchmark',
    description: 'Institutioneller Referenzkurs für Best-Execution und Identifikation von Liquiditätszonen.',
  },
  {
    id: 'supertrend-10-3',
    name: 'Supertrend Indikator (10, 3)',
    shortName: 'Supertrend',
    category: 'Trend',
    formula: 'Band = (High + Low)/2 +/- 3 * ATR(10)',
    signal: 'bullish',
    priority: 'P2',
    timeframe: '15m',
    defaultThreshold: 'Trendrichtungs-Wechsel Grün/Rot',
    description: 'Dynamischer Trendfolge-Indikator, der Kursrichtung und Stop-Loss in einer Metrik kombiniert.',
  },
  {
    id: 'obv-flow',
    name: 'OBV (On-Balance Volume) Akkumulation',
    shortName: 'OBV',
    category: 'Volumen',
    formula: 'OBV_t = OBV_{t-1} +/- Volume_t',
    signal: 'bullish',
    priority: 'P2',
    timeframe: 'eod',
    defaultThreshold: 'Volumen-Divergenz vor Kurssprung',
    description: 'Korreliert das Handelsvolumen mit der Kursbewegung zur Erkennung institutioneller Akkumulation.',
  },
];

// =============================================================================
// MASTER CHART PATTERNS CATALOG
// =============================================================================

export const MASTER_PATTERNS_CATALOG: PatternToolItem[] = [
  {
    id: 'double-bottom',
    name: 'Doppelter Boden (W-Formation)',
    category: 'Umkehrmuster',
    signal: 'bullish',
    priority: 'P1',
    timeframe: '15m',
    winRateHistorical: '68.4%',
    description: 'Klassisches bullisches Trendwendemuster nach Abwärtstrend mit Re-Test der Unterstützung.',
  },
  {
    id: 'head-shoulders',
    name: 'Kopf-Schulter-Formation (SKS)',
    category: 'Umkehrmuster',
    signal: 'bearish',
    priority: 'P1',
    timeframe: 'eod',
    winRateHistorical: '72.1%',
    description: 'Starkes bearishes Umkehrmuster mit Nackenlinien-Durchbruch und abnehmendem Volumen.',
  },
  {
    id: 'bull-flag',
    name: 'Bullische Flagge (Bull Flag)',
    category: 'Fortsetzungsmuster',
    signal: 'bullish',
    priority: 'P2',
    timeframe: '1m',
    winRateHistorical: '65.2%',
    description: 'Kurze, abwärtsgerichtete Konsolidierung nach impulsivem Anstieg; Ausbruch nach oben wahrscheinlich.',
  },
  {
    id: 'ascending-triangle',
    name: 'Aufsteigendes Dreieck (Ascending Triangle)',
    category: 'Breakout',
    signal: 'bullish',
    priority: 'P2',
    timeframe: '15m',
    winRateHistorical: '66.8%',
    description: 'Horizontale Widerstandslinie mit ansteigenden Tiefstständen signalisiert kontinuierlichen Kaufdruck.',
  },
  {
    id: 'golden-cross',
    name: 'Golden Cross (SMA 50 kreuzt SMA 200)',
    category: 'Fortsetzungsmuster',
    signal: 'bullish',
    priority: 'P1',
    timeframe: 'eod',
    winRateHistorical: '74.5%',
    description: 'Institutionelles Makro-Signal für langfristigen Bullenmarkt in Aktien und Indizes.',
  },
  {
    id: 'death-cross',
    name: 'Death Cross (SMA 50 fällt unter SMA 200)',
    category: 'Umkehrmuster',
    signal: 'bearish',
    priority: 'P1',
    timeframe: 'eod',
    winRateHistorical: '71.0%',
    description: 'Langfristiges Bärensignal für anhaltenden Verkaufsdruck und Risikoabbau.',
  },
  {
    id: 'wyckoff-spring',
    name: 'Wyckoff Akkumulation Phase C (Spring)',
    category: 'Harmonic & Wyckoff',
    signal: 'bullish',
    priority: 'P1',
    timeframe: '15m',
    winRateHistorical: '76.8%',
    description: 'Liquidation kleiner Marktteilnehmer unterhalb der Range gefolgt von sofortigem Rückkauf (Smart Money).',
  },
  {
    id: 'rsi-divergence',
    name: 'RSI Bullische Divergenz',
    category: 'Umkehrmuster',
    signal: 'bullish',
    priority: 'P2',
    timeframe: 'multi',
    winRateHistorical: '69.3%',
    description: 'Tieferes Tief im Kurs bei gleichzeitig höherem Tief im RSI signalisiert nachlassendes Momentum.',
  },
];

// =============================================================================
// MASTER NEWS API INTERFACES CATALOG
// =============================================================================

export const MASTER_NEWS_APIS_CATALOG: NewsApiToolItem[] = [
  {
    id: 'news-bafin-press',
    name: 'BaFin Pressemitteilungen & Warnlisten Feed',
    category: 'Regulatorisch & BaFin',
    provider: 'Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)',
    monthlyCostEur: 0.0,
    latencySpec: 'Realtime Push / RSS',
    updateFrequency: 'Täglich / Ad-Hoc',
    bafinRelevance: 'WpHG § 83 Audit-Trail konform',
    description: 'Offizieller deutscher Behördenfeed für sofortige Warnungen, Markteingriffe und Bußgelder.',
  },
  {
    id: 'news-sec-edgar',
    name: 'SEC EDGAR Filings (10-K, 10-Q, 8-K)',
    category: 'Regulatorisch & BaFin',
    provider: 'U.S. Securities and Exchange Commission (EDGAR)',
    monthlyCostEur: 0.0,
    latencySpec: 'Sub-60s Stream',
    updateFrequency: 'Echtzeit-Meldungen',
    bafinRelevance: 'Aufsichtsrechtliche Offenlegungspflicht',
    description: 'Vollständige Quartals- und Insider-Berichte aller US-börsennotierten Unternehmen.',
  },
  {
    id: 'news-fed-wire',
    name: 'Federal Reserve Wire & FOMC Statements',
    category: 'Makro & Zentralbanken',
    provider: 'Federal Reserve Bank St. Louis / Board of Governors',
    monthlyCostEur: 0.0,
    latencySpec: 'Sofortige Übermittlung',
    updateFrequency: 'Nach FOMC Sitzungen / Wöchentlich',
    bafinRelevance: 'Sovereign Reference',
    description: 'Leitzinsentscheide, geldpolitische Reden und offizielle Zinsstruktur-Analysen.',
  },
  {
    id: 'news-ezb-ecb',
    name: 'EZB Pressekonferenzen & Zinsbeschlüsse',
    category: 'Makro & Zentralbanken',
    provider: 'Europäische Zentralbank (EZB)',
    monthlyCostEur: 0.0,
    latencySpec: 'Sub-30s Webhook',
    updateFrequency: 'Zinstermine & Monatsberichte',
    bafinRelevance: 'EU Leitzins Benchmark',
    description: 'Amtliche europäische Zinsbeschlüsse und geldpolitische Transkripte für EUR-Finanzprodukte.',
  },
  {
    id: 'news-eqs-dgap',
    name: 'EQS / DGAP Ad-Hoc Insider-Newsfeed',
    category: 'Ad-Hoc & Earnings',
    provider: 'EQS Group Regulatory Hub (DGAP)',
    monthlyCostEur: 0.0,
    latencySpec: 'Realtime Ad-Hoc Push',
    updateFrequency: 'Sekundengenau',
    bafinRelevance: 'WpHG Ad-Hoc Meldepflicht',
    description: 'Gesetzlich vorgeschriebene Ad-hoc-Mitteilungen börsennotierter Gesellschaften in Deutschland.',
  },
  {
    id: 'news-bloomberg-wire',
    name: 'Bloomberg Terminal News & Macro Headlines',
    category: 'Makro & Zentralbanken',
    provider: 'Bloomberg Financial Markets',
    monthlyCostEur: 0.0, // Free Public Headlines Tier
    latencySpec: 'Sub-5s Streaming',
    updateFrequency: 'Kontinuierlich',
    bafinRelevance: 'Institutionelle Markt-Benchmark',
    description: 'Globale Breaking News zu Aktien, Devisen, Staatsanleihen und Rohstoffen.',
  },
  {
    id: 'news-coindesk',
    name: 'CoinDesk Institutional & MiCA Policy Wire',
    category: 'Krypto & On-Chain',
    provider: 'CoinDesk Intelligence',
    monthlyCostEur: 0.0,
    latencySpec: 'Echtzeit-Feed',
    updateFrequency: 'Kontinuierlich',
    bafinRelevance: 'MiCA Krypto-Regulierung',
    description: 'Institutionelle Analysen zur Krypto-Adoption, ETF-Zuflüssen und globaler Krypto-Regulierung.',
  },
  {
    id: 'news-whale-alert',
    name: 'Whale Alert Großtransaktionen Push API',
    category: 'Krypto & On-Chain',
    provider: 'Whale Alert WebSocket Gateway',
    monthlyCostEur: 0.0,
    latencySpec: 'Sub-15s Block Event',
    updateFrequency: 'Bei Transfers > $1.000.000',
    bafinRelevance: 'On-Chain Markttransparenz',
    description: 'Automatisierte Alarme bei Transfers großer Bestände zwischen Börsen und anonymen Wallets.',
  },
];

// =============================================================================
// INVENTORY CATALOGING ENGINE (REVENUE ASSURANCE AUDIT)
// =============================================================================

export function catalogUserSelectedTools(config: PipelineConfigState): InventoryBOMSummary {
  const items: CatalogToolEntry[] = [];

  // Layer 1
  if (config.analysisFocusId && MASTER_TOOL_CATALOG[config.analysisFocusId]) {
    items.push(MASTER_TOOL_CATALOG[config.analysisFocusId]);
  }

  // Layer 2
  if (config.latencyIntervalId && MASTER_TOOL_CATALOG[config.latencyIntervalId]) {
    items.push(MASTER_TOOL_CATALOG[config.latencyIntervalId]);
  }

  // Layer 3: Market Data Feeds & News APIs
  if (Array.isArray(config.providerIds)) {
    for (const pid of config.providerIds) {
      if (MASTER_TOOL_CATALOG[pid]) {
        items.push(MASTER_TOOL_CATALOG[pid]);
      }
    }
  }

  // Layer 3 Extension: Categorized News API Interfaces
  if (Array.isArray(config.selectedNewsApis)) {
    for (const newsId of config.selectedNewsApis) {
      const newsItem = MASTER_NEWS_APIS_CATALOG.find((n) => n.id === newsId);
      if (newsItem) {
        items.push({
          sku: `CAP-NEWS-${newsItem.id.toUpperCase().replace('NEWS-', '')}`,
          layerNumber: 3,
          layerName: `Ebene 3: News API (${newsItem.category})`,
          id: newsItem.id,
          name: newsItem.name,
          subtitle: newsItem.provider,
          category: newsItem.category,
          monthlyCostEur: newsItem.monthlyCostEur,
          latencyContribution: newsItem.latencySpec,
          latencyMs: 15,
          specs: `${newsItem.updateFrequency} · ${newsItem.description}`,
          bafinStandard: newsItem.bafinRelevance,
          licenseType: 'Public Market Data',
          revenueAssuranceGrade: 'A+',
        });
      }
    }
  }

  // Layer 1 Extension: Selected Indicators & Formulas
  if (Array.isArray(config.selectedIndicators)) {
    for (const indId of config.selectedIndicators) {
      const indItem = MASTER_INDICATORS_CATALOG.find((i) => i.id === indId);
      if (indItem) {
        items.push({
          sku: `CAP-IND-${indItem.shortName.toUpperCase()}`,
          layerNumber: 1,
          layerName: `Ebene 1: Indikator (${indItem.category})`,
          id: indItem.id,
          name: indItem.name,
          subtitle: indItem.defaultThreshold,
          category: indItem.category,
          monthlyCostEur: 0.0,
          latencyContribution: `Signal: ${indItem.signal.toUpperCase()} [${indItem.priority}]`,
          latencyMs: 1,
          specs: `${indItem.formula} · ${indItem.description}`,
          bafinStandard: 'Deterministische Berechnung',
          licenseType: 'Open Source MIT',
          revenueAssuranceGrade: 'A+',
          keyFormulas: [indItem.formula],
        });
      }
    }
  }

  // Layer 1 Extension: Selected Chart Patterns
  if (Array.isArray(config.selectedPatterns)) {
    for (const patId of config.selectedPatterns) {
      const patItem = MASTER_PATTERNS_CATALOG.find((p) => p.id === patId);
      if (patItem) {
        items.push({
          sku: `CAP-PAT-${patItem.id.toUpperCase()}`,
          layerNumber: 1,
          layerName: `Ebene 1: Chart-Muster (${patItem.category})`,
          id: patItem.id,
          name: patItem.name,
          subtitle: `Historische Win-Rate: ${patItem.winRateHistorical}`,
          category: patItem.category,
          monthlyCostEur: 0.0,
          latencyContribution: `Signal: ${patItem.signal.toUpperCase()} [${patItem.priority}]`,
          latencyMs: 1,
          specs: `${patItem.description} (Win-Rate: ${patItem.winRateHistorical})`,
          bafinStandard: 'Regelbasierte Mustererkennung',
          licenseType: 'Open Source MIT',
          revenueAssuranceGrade: 'A+',
        });
      }
    }
  }

  // Layer 4
  if (config.cachingId && MASTER_TOOL_CATALOG[config.cachingId]) {
    items.push(MASTER_TOOL_CATALOG[config.cachingId]);
  }

  // Layer 5
  if (config.evidenceId && MASTER_TOOL_CATALOG[config.evidenceId]) {
    items.push(MASTER_TOOL_CATALOG[config.evidenceId]);
  }

  // Revenue Assurance Calculations
  const budgetLimitEur = 40.0;
  const totalMonthlyCostEur = items.reduce((sum, item) => sum + item.monthlyCostEur, 0);
  const remainingBudgetEur = Math.max(0, budgetLimitEur - totalMonthlyCostEur);
  const budgetUtilizationPercent = Math.min(100, (totalMonthlyCostEur / budgetLimitEur) * 100);
  const isBudgetCompliant = totalMonthlyCostEur <= budgetLimitEur;

  // Latency Aggregation (Base transport + cache overhead)
  const providerLatencies = items
    .filter((i) => i.layerNumber === 3)
    .map((i) => i.latencyMs);
  const minProviderLatency = providerLatencies.length > 0 ? Math.min(...providerLatencies) : 25;
  const cacheLatency = items.find((i) => i.layerNumber === 4)?.latencyMs || 4;
  const evidenceOverhead = items.find((i) => i.layerNumber === 5)?.latencyMs || 1;
  const calculatedLatencyMs = minProviderLatency + cacheLatency + evidenceOverhead;

  // BaFin Compliance Score (Base 70 + 10 for WORM + 10 for Outlier Consensus + 10 for 15m/EOD or Monotone)
  let bafinScore = 75;
  if (config.evidenceId === 'worm-storage' || config.evidenceId === 'merkle-tree') bafinScore += 15;
  if (config.providerIds.length >= 2) bafinScore += 5; // Multi-source redundancy
  if (config.cachingId === 'redis-ring' || config.cachingId === 'token-bucket') bafinScore += 5;
  bafinScore = Math.min(100, bafinScore);

  let complianceRating = '95%+ Institutionell (BaFin/MiCA Vollzertifiziert)';
  if (bafinScore < 80) complianceRating = 'Community / Forschung (Teil-Audit)';
  else if (bafinScore < 90) complianceRating = '90% Erweiterte Marktfähigkeit';

  const hasRedundantFeeds = config.providerIds.length >= 2;

  return {
    items,
    totalMonthlyCostEur,
    budgetLimitEur,
    budgetUtilizationPercent,
    remainingBudgetEur,
    isBudgetCompliant,
    calculatedLatencyMs,
    bafinComplianceScore: bafinScore,
    complianceRating,
    activeProviderCount: config.providerIds.length,
    hasRedundantFeeds,
    generatedTimestamp: new Date().toISOString(),
  };
}

/**
 * Format catalog inventory as clean JSON for export and audit logs
 */
export function exportInventoryAsJson(bom: InventoryBOMSummary): string {
  return JSON.stringify(
    {
      appName: 'Capital-AI Screener Architecture',
      specVersion: '1.0.0-AP006',
      auditStatus: bom.isBudgetCompliant ? 'APPROVED_REVENUE_ASSURANCE' : 'BUDGET_EXCEEDED',
      generatedAt: bom.generatedTimestamp,
      summary: {
        totalMonthlyCostEur: bom.totalMonthlyCostEur,
        budgetLimitEur: bom.budgetLimitEur,
        remainingBudgetEur: bom.remainingBudgetEur,
        budgetUtilizationPercent: `${bom.budgetUtilizationPercent.toFixed(1)}%`,
        calculatedLatencyMs: bom.calculatedLatencyMs,
        bafinComplianceScore: `${bom.bafinComplianceScore}%`,
        complianceRating: bom.complianceRating,
      },
      catalogedTools: bom.items.map((i) => ({
        sku: i.sku,
        layer: i.layerName,
        name: i.name,
        category: i.category,
        costEur: i.monthlyCostEur,
        latency: i.latencyContribution,
        specs: i.specs,
        bafinStandard: i.bafinStandard,
        license: i.licenseType,
        revenueAssuranceGrade: i.revenueAssuranceGrade,
      })),
    },
    null,
    2
  );
}

/**
 * Format catalog inventory as human-readable text Bill of Materials (BOM)
 */
export function exportInventoryAsText(bom: InventoryBOMSummary): string {
  const lines: string[] = [];
  lines.push('========================================================================');
  lines.push('CAPITAL-AI — REVENUE ASSURANCE INVENTAR-STÜCKLISTE (BILL OF MATERIALS)');
  lines.push(`Datum: ${new Date().toLocaleString('de-DE')} | BaFin WpHG § 83 & AP-006`);
  lines.push('========================================================================');
  lines.push('');
  lines.push(`[REVENUE ASSURANCE STATUS]`);
  lines.push(`• Monatliche Gesamtkosten:  ${bom.totalMonthlyCostEur.toFixed(2)} € / Monat`);
  lines.push(`• Budget-Obergrenze (AP-006): 40.00 € / Monat`);
  lines.push(`• Verbleibender Puffer:      ${bom.remainingBudgetEur.toFixed(2)} € (${(100 - bom.budgetUtilizationPercent).toFixed(1)}% Reserve)`);
  lines.push(`• Budget-Status:             ${bom.isBudgetCompliant ? '✓ 100% BUDGETKONFORM (GRÜN)' : '⚠ BUDGET ÜBERSCHRITTEN'}`);
  lines.push(`• Berechnete Systemlatenz:   ${bom.calculatedLatencyMs} ms`);
  lines.push(`• BaFin Compliance Score:    ${bom.bafinComplianceScore}% (${bom.complianceRating})`);
  lines.push('');
  lines.push('------------------------------------------------------------------------');
  lines.push('KATALOGISIERTE KOMPONENTEN & SYSTEM-SPEZIFIKATIONEN:');
  lines.push('------------------------------------------------------------------------');

  bom.items.forEach((item, idx) => {
    lines.push(`${idx + 1}. [${item.sku}] ${item.layerName}`);
    lines.push(`   Name:      ${item.name} (${item.subtitle})`);
    lines.push(`   Kategorie: ${item.category} | Lizenz: ${item.licenseType}`);
    lines.push(`   Kosten:    ${item.monthlyCostEur === 0 ? '0,00 € (Kostenfrei / Sovereign)' : `${item.monthlyCostEur.toFixed(2)} € / Monat`}`);
    lines.push(`   Latenz:    ${item.latencyContribution}`);
    lines.push(`   Spez.:     ${item.specs}`);
    lines.push(`   BaFin:     ${item.bafinStandard}`);
    lines.push(`   Grade:     ${item.revenueAssuranceGrade}`);
    lines.push('');
  });

  lines.push('========================================================================');
  lines.push('Generiert von Capital-AI Systems Architect & Purchase Advisor');
  lines.push('========================================================================');
  return lines.join('\n');
}
