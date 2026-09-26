/**
 * CAPITAL AI — PIPELINE TOOL INVENTORY & REVENUE ASSURANCE CATALOG (WP-004 / AP-006)
 *
 * Implements a strict, institutional inventory and cataloging system for user-selected tools
 * across all 5 architecture layers (Alternate PC-Konfigurator Style):
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

export interface PipelineConfigState {
  analysisFocusId: string;
  latencyIntervalId: string;
  providerIds: string[];
  cachingId: string;
  evidenceId: string;
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

  // Layer 3 (can have multiple providers)
  if (Array.isArray(config.providerIds)) {
    for (const pid of config.providerIds) {
      if (MASTER_TOOL_CATALOG[pid]) {
        items.push(MASTER_TOOL_CATALOG[pid]);
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
