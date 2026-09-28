/**
 * CAPITAL AI — BAFIN-KONFORMER PIPELINE BUILDER
 * Work Package: WP-004 / AP-001 / AP-003 / AP-006
 *
 * Konfiguriert Datenpipelines und Screener-Lösungen modular nach institutionellen Architektur-Standards.
 * Ausgangspunkt: Analyse-Tool (z.B. Buffett Value Check) -> Latenz/Taktung -> Provider -> Caching -> BaFin Audit -> Blueprint.
 * Enthält den Reasoning-Kaufberater mit Scientist Stack & Revenue Assurance.
 */

import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Layers,
  Zap,
  Shield,
  ShieldCheck,
  Database,
  ArrowRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileCode,
  FileDown,
  Copy,
  Check,
  Coins,
  RefreshCw,
  Terminal,
  Activity,
  SlidersHorizontal,
  Server,
  DollarSign,
  TrendingUp,
  BarChart2,
  ArrowLeft,
  Share2,
  Code2,
  Radio,
  ExternalLink,
  Download,
  X,
  FileText,
  CheckCheck,
  ChevronDown,
  Play,
  Gauge,
  HelpCircle,
  MessageSquare,
  Flame,
  BrainCircuit,
  Lock,
  Boxes,
  Filter,
  Globe,
  Newspaper,
  Workflow,
  Target,
  CheckSquare,
  Square,
  Search,
  TrendingDown,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { trackEvent } from '../utils/analytics';
import {
  AdvisorChatbot,
  PipelineConfigState,
} from './AdvisorChatbot';
import {
  MASTER_INDICATORS_CATALOG,
  MASTER_PATTERNS_CATALOG,
  MASTER_NEWS_APIS_CATALOG,
  IndicatorToolItem,
  PatternToolItem,
  NewsApiToolItem,
  SignalType,
  PriorityLevel,
} from '../utils/pipelineToolCatalog';

export interface PipelineBuilderProps {
  onBackToHome?: () => void;
  onNavigateLogin?: () => void;
  onNavigateTokenomics?: () => void;
  onNavigateFounder?: () => void;
}

// =============================================================================
// BUILDER-DATEN: DIE 6 EBENEN DER DATENPIPELINE
// =============================================================================

// EBENE 1: ANALYSE-FOKUS & SCREENER-ZIEL (DER AUSGANGSPUNKT)
export interface AnalysisFocusItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  idealLatency: string;
  bafinStandard: string;
  keyMetrics: string[];
  recommendedInterval: string;
  badge: string;
}

export const ANALYSIS_FOCUS_CATALOG: AnalysisFocusItem[] = [
  {
    id: 'buffett-value',
    title: 'Buffett Value Check',
    subtitle: 'Fundamental- & Burggraben-Scoring',
    description: 'Bewertet Aktien nach Warren Buffetts Kriterien: 10-Jahres Eigenkapitalrendite (ROE > 15%), ROCE, Verschuldungsgrad, freier Cashflow und Margin of Safety (DCF Innerer Wert).',
    category: 'Fundamental Value',
    idealLatency: 'End-of-Day (EOD) / Daily',
    bafinStandard: 'WpHG § 83 Revisionssicher',
    keyMetrics: ['ROE > 15%', 'DCF Margin of Safety', 'Verschuldung < 50%', 'Burggraben (Moat)'],
    recommendedInterval: 'eod-daily',
    badge: 'Klassiker',
  },
  {
    id: 'bafin-scoring',
    title: 'BaFin Multi-Faktor Scorer',
    subtitle: 'MaRisk & WpHG Risiko-Scoring',
    description: 'Prüfstandard für institutionelle Vermögensverwalter: Sharpe Ratio, Sortino Ratio, Value at Risk (VaR 99%), maximale Drawdown-Schwellen und regulatorische Stresstest-Simulation.',
    category: 'Compliance & Risk',
    idealLatency: '15-Minuten Delayed Snapshot',
    bafinStandard: 'BaFin MaRisk & WpHG § 83',
    keyMetrics: ['Sharpe Ratio', 'VaR (99%)', 'Max Drawdown', 'Stresstest-Szenarien'],
    recommendedInterval: 'delayed-15m',
    badge: 'BaFin-Prüfstandard',
  },
  {
    id: 'momentum-breakout',
    title: 'Momentum & Trend Breakout Screener',
    subtitle: 'Intraday Trendfolge & Volatilität',
    description: 'Erkennt Trendwechsel und Ausbrüche: 200/50 SMA Crossover, RSI Divergenzen, Volume-Weighted MACD und Volatilitäts-Spikes über 150 weltweite Aktien und Krypto-Assets.',
    category: 'Technischer Screener',
    idealLatency: '1-Minuten Intraday Candles',
    bafinStandard: 'MiFID II Best Execution',
    keyMetrics: ['200/50 SMA', 'RSI Divergenz', 'VWAP Spike', 'ATR Volatilität'],
    recommendedInterval: 'intraday-1m',
    badge: 'High Dynamic',
  },
  {
    id: 'whale-radar',
    title: 'Smart Money & Whale Radar',
    subtitle: 'On-Chain & Dark Pool Großaufträge',
    description: 'Echtzeit-Infiltration institutioneller Großtransaktionen: DEX Wal-Swaps (>500.000 $), CEX Zu-/Abflüsse und ATS Dark Pool Block-Trades vor der Kursbewegung.',
    category: 'On-Chain & Smart Money',
    idealLatency: 'Sub-45ms Realtime Events',
    bafinStandard: 'MiCA On-Chain Audit',
    keyMetrics: ['Whale Transfers >500k$', 'CEX Netflow', 'Dark Pool ATS Volume', 'Mempool Swaps'],
    recommendedInterval: 'hft-tick',
    badge: 'On-Chain Alpha',
  },
  {
    id: 'macro-yield',
    title: 'Macro Yield Curve & Spread Radar',
    subtitle: 'Zinsstrukturkurve & Zentralbank-Monitor',
    description: 'Aggregiert Makro-Leitindikatoren der US Federal Reserve (FRED) und EZB: US 10Y-2Y Zinsinversion, M2 Geldmenge, CPI Kerninflation und High-Yield Credit Spreads.',
    category: 'Makroökonomie',
    idealLatency: 'Daily / Weekly Macro',
    bafinStandard: 'Sovereign Data Authority',
    keyMetrics: ['US 10Y-2Y Inversion', 'M2 Geldmengen-Wachstum', 'Fed Funds Rate', 'Credit Spreads'],
    recommendedInterval: 'eod-daily',
    badge: '100% Free Public',
  },
  {
    id: 'hft-arbitrage',
    title: 'HFT Cross-Exchange Arbitrage Screener',
    subtitle: 'Sub-20ms Spread- & Liquiditäts-Scoring',
    description: 'Hochfrequente Arbitrage-Erkennung zwischen Krypto- und FX-Börsen mit synchronisierter L2-Orderbuchtiefe und minimaler Slippage-Kompensation.',
    category: 'High-Frequency',
    idealLatency: 'Sub-20ms Tick-by-Tick',
    bafinStandard: 'MiFID II Art. 48 Algorithmus-Compliance',
    keyMetrics: ['Cross-Exchange Spread', 'L2 Book Depth', 'VWAP Slippage', 'Monotone Ticks'],
    recommendedInterval: 'hft-tick',
    badge: 'Ultra Low-Latency',
  },
  {
    id: 'graham-value',
    title: 'Benjamin Graham Deep Value (NCAV)',
    subtitle: 'Net-Current-Asset-Value & Sicherheitsmarge',
    description: 'Klassisches Value-Investing: Identifiziert Aktien, deren Marktkapitalisierung unter dem bereinigten Umlaufvermögen abzüglich aller Verbindlichkeiten liegt.',
    category: 'Fundamental Value',
    idealLatency: 'End-of-Day (EOD) / Daily',
    bafinStandard: 'WpHG § 83 Revisionssicher',
    keyMetrics: ['Kurs < 67% Net-Current-Asset-Value', 'Liquidationswert', 'KGV * KBV < 22.5', 'Dividendenhistorie > 20J'],
    recommendedInterval: 'eod-daily',
    badge: 'Klassiker',
  },
  {
    id: 'piotroski-fscore',
    title: 'Piotroski 9-Faktor Bilanz-Scorer',
    subtitle: 'Rentabilität, Verschuldung & Effizienz',
    description: 'Systematisches 9-Kriterien Scoring zur Trennung finanziell gesunder von notleidenden Unternehmen vor der Veröffentlichung von Quartalsberichten.',
    category: 'Fundamental Value',
    idealLatency: 'End-of-Day (EOD) / Daily',
    bafinStandard: 'WpHG § 83 Revisionssicher',
    keyMetrics: ['ROA positiv', 'Operating Cashflow > Net Income', 'Margin Expansion', 'Asset Turnover'],
    recommendedInterval: 'eod-daily',
    badge: 'F-Score 9/9',
  },
  {
    id: 'altman-zscore',
    title: 'Altman Z-Score Insolvenz-Frühwarnung',
    subtitle: 'Kreditrisiko- & Ausfallwahrscheinlichkeits-Modell',
    description: 'Quantitatives Frühwarnsystem für Kreditinstitute und Risikomanager zur Identifikation von Insolvenzrisiken über multivariate Diskriminanzanalyse.',
    category: 'Compliance & Risk',
    idealLatency: '15-Minuten Delayed Snapshot',
    bafinStandard: 'BaFin MaRisk & WpHG § 83',
    keyMetrics: ['Z-Score > 2.99 Safe Zone', 'Working Capital / Assets', 'EBIT / Assets', 'Market Equity / Debt'],
    recommendedInterval: 'delayed-15m',
    badge: 'Risk Early Warning',
  },
  {
    id: 'volatility-squeeze',
    title: 'TTM Squeeze & Volatilitäts-Ausbruch',
    subtitle: 'Bollinger Band & Keltner Channel Kompression',
    description: 'Erkennt explosive Ausbruchsbewegungen durch Messung der Bandbreiten-Kompression, wenn Bollinger Bänder innerhalb der Keltner Kanäle wandern.',
    category: 'Technischer Screener',
    idealLatency: '1-Minuten Intraday Candles',
    bafinStandard: 'MiFID II Best Execution',
    keyMetrics: ['BB inside Keltner', 'Momentum Histogramm Flip', 'Volume Surge > 200%', 'Directional Breakout'],
    recommendedInterval: 'intraday-1m',
    badge: 'High Dynamic',
  },
  {
    id: 'smart-money-orderblock',
    title: 'SMC Orderblock & Fair Value Gap (FVG)',
    subtitle: 'Institutionelle Liquiditätszonen & Imbalance',
    description: 'Algorithmus zur automatisierten Lokalisierung institutioneller Orderblöcke, Ungleichgewichte (FVGs) und Liquiditäts-Sweeps auf Multi-Asset Charts.',
    category: 'On-Chain & Smart Money',
    idealLatency: 'Sub-45ms Realtime Events',
    bafinStandard: 'MiCA On-Chain Audit',
    keyMetrics: ['Bullish/Bearish FVG', 'Breaker Block', 'Liquidity Sweep', 'Change of Character (CHoCH)'],
    recommendedInterval: 'hft-tick',
    badge: 'Smart Money Alpha',
  },
  {
    id: 'stat-arbitrage',
    title: 'Statistische Kointegration & Pairs Engine',
    subtitle: 'Mean-Reversion Z-Score & Spread Deviation',
    description: 'Hochfrequenter statistischer Arbitrage-Scanner für kointegrierte Wertpapierpaare mit dynamischer Z-Score Schwellenüberwachung.',
    category: 'High-Frequency',
    idealLatency: 'Sub-20ms Tick-by-Tick',
    bafinStandard: 'MiFID II Art. 48 Algorithmus-Compliance',
    keyMetrics: ['Engle-Granger Kointegration', 'Spread Z-Score > 2.5', 'Half-Life Mean Reversion', 'Beta Hedge Ratio'],
    recommendedInterval: 'hft-tick',
    badge: 'Quant Algorithmic',
  },
];

// EBENE 2: TAKTUNG & LATENZ-VORAUSSETZUNGEN
export interface LatencyIntervalItem {
  id: string;
  name: string;
  latencySpec: string;
  description: string;
  bandwidthImpact: string;
  costImpactEur: number;
  bafinCompliance: string;
}

export const LATENCY_INTERVALS: LatencyIntervalItem[] = [
  {
    id: 'eod-daily',
    name: 'End-of-Day (EOD) / Daily Close',
    latencySpec: 'Tägliche Schlusskurse + Bilanzen',
    description: 'Ideal für Buffett Value Check und Makro-Analysen. Minimaler Server-Overhead, keine teuren WebSocket-Dauerverbindungen.',
    bandwidthImpact: 'Sehr gering (< 1 MB / Tag)',
    costImpactEur: 0,
    bafinCompliance: 'Vollständig BaFin-auditierbar',
  },
  {
    id: 'delayed-15m',
    name: '15-Minuten Delayed Snapshot',
    latencySpec: '15 Min Verzögerung (Prüfstandard)',
    description: 'Der regulatorische Standard für Vermögensverwalter und Research-Häuser. Stark reduzierte Lizenzgebühren bei hoher Rechtssicherheit.',
    bandwidthImpact: 'Gering (ca. 10 MB / Tag)',
    costImpactEur: 0,
    bafinCompliance: 'Offizieller BaFin WpHG § 83 Standard',
  },
  {
    id: 'intraday-1m',
    name: '1-Minuten Intraday OHLCV Candles',
    latencySpec: '60 Sekunden Taktung',
    description: 'Für technische Screener, Momentum-Scanner und Breakout-Radar. Schnelle Signalgenerierung bei berechenbarem Speicherbedarf.',
    bandwidthImpact: 'Mittel (ca. 150 MB / Tag)',
    costImpactEur: 0,
    bafinCompliance: 'MiFID II Best Execution konform',
  },
  {
    id: 'hft-tick',
    name: 'Sub-20ms Realtime WebSocket Streaming',
    latencySpec: 'Sub-20ms Tick-by-Tick Feed',
    description: 'Ungefilterter L2-Orderbuch-Stream für High-Frequency-Arbitrage und Wal-Tracking. Höchste Anforderung an CPU & Caching.',
    bandwidthImpact: 'Hoch (> 5 GB / Tag)',
    costImpactEur: 0, // Mit kostenlosem Binance/Kraken WSS
    bafinCompliance: 'Erfordert monotone Sequenzierung',
  },
];

// EBENE 3: DATA INGESTION & PROVIDER STACK ("HARDWARE-LIEFERANTEN")
export interface IngestionProviderItem {
  id: string;
  name: string;
  category: string;
  monthlyCostEur: number;
  protocols: string;
  typicalLatency: string;
  coverage: string;
  bafinStatus: string;
}

export const INGESTION_PROVIDERS: IngestionProviderItem[] = [
  {
    id: 'twelvedata',
    name: 'TwelveData Financial Feeds',
    category: 'Aktien, Forex, Rohstoffe',
    monthlyCostEur: 8.5,
    protocols: 'REST + WSS',
    typicalLatency: '40 - 80ms',
    coverage: 'US & EU Aktien (Top 150), DAX, G10 Forex, ETFs',
    bafinStatus: 'Regulatorisch zugelassen (US/EU)',
  },
  {
    id: 'fred',
    name: 'Federal Reserve Bank of St. Louis (FRED)',
    category: 'Makro & Zinsstruktur',
    monthlyCostEur: 0.0,
    protocols: 'REST JSON',
    typicalLatency: '120 - 150ms',
    coverage: 'US 10Y-2Y Zinskurve, M2 Geldmenge, CPI, Fed Funds Rate',
    bafinStatus: '100% Free Sovereign Authority',
  },
  {
    id: 'binance',
    name: 'Binance Market Data Engine',
    category: 'Krypto Realtime',
    monthlyCostEur: 0.0,
    protocols: 'WebSocket (WSS) + REST',
    typicalLatency: '15 - 25ms',
    coverage: 'BTC, ETH, Top 100 Altcoins, L2 Depth Ticker',
    bafinStatus: 'Öffentlicher Public Data Feed',
  },
  {
    id: 'kraken',
    name: 'Kraken Financial Ingestion',
    category: 'Krypto & EUR Referenz',
    monthlyCostEur: 0.0,
    protocols: 'WebSocket (WSS)',
    typicalLatency: '20 - 30ms',
    coverage: 'Krypto/EUR Orderbücher, Monotone Sequenzierung',
    bafinStatus: 'BaFin-konforme EU-Referenz',
  },
  {
    id: 'alchemy',
    name: 'Alchemy Supernode Web3 RPC',
    category: 'On-Chain & Mempool',
    monthlyCostEur: 0.0,
    protocols: 'RPC + WebSocket',
    typicalLatency: '45 - 65ms',
    coverage: 'Ethereum, Solana, DEX Swaps (Uniswap/Raydium)',
    bafinStatus: 'Dezentral auditierbare Blockchain Logs',
  },
  {
    id: 'ccxt',
    name: 'CCXT Pro Multiplexer',
    category: 'Multi-Börsen Ingestion',
    monthlyCostEur: 0.0,
    protocols: 'Self-Hosted Multiplexer',
    typicalLatency: '30 - 50ms',
    coverage: '120+ Krypto-Börsen vereinheitlicht',
    bafinStatus: 'Open-Source (MIT Lizenz)',
  },
];

// EBENE 4: NORMALISIERUNG & IN-MEMORY CACHING ("MAINBOARD & RAM")
export interface CachingArchitectureItem {
  id: string;
  name: string;
  specs: string;
  description: string;
  memoryFootprint: string;
  queryLatency: string;
  bafinAdvantage: string;
}

export const CACHING_ARCHITECTURES: CachingArchitectureItem[] = [
  {
    id: 'redis-ring',
    name: 'In-Memory Redis Ring Buffer',
    specs: 'Ringpuffer mit 1.000 Ticks / Symbol',
    description: 'Hält die letzten 1.000 Kurstickets im Arbeitsspeicher. Ermöglicht Sub-5ms Screener-Abfragen für alle Clients ohne API-Last.',
    memoryFootprint: 'Ca. 64 MB RAM',
    queryLatency: 'Sub-5ms Cache-Hit',
    bafinAdvantage: 'Verlustfreie Entkopplung von Clients',
  },
  {
    id: 'flatbuffers-delta',
    name: 'FlatBuffers / Delta Kompression',
    specs: '70% Bandbreiten-Reduktion',
    description: 'Binäre Delta-Kompression ohne JSON-Parsing Overhead. Überträgt nur Preis- und Volumenänderungen gegenüber dem Vor-Tick.',
    memoryFootprint: 'Minimal (< 20 MB)',
    queryLatency: 'Sub-2ms Zero-Copy',
    bafinAdvantage: 'Exakte Monotonie-Verifizierung',
  },
  {
    id: 'arrow-flight',
    name: 'Zero-Copy Apache Arrow Flight RPC',
    specs: 'Direct PyArrow / Pandas Stream',
    description: 'Ideal für Python-Quants: Daten werden im Arrow-Spaltenformat direkt in GPU/RAM gestreamt, ohne Serialisierungskosten.',
    memoryFootprint: 'Ca. 128 MB RAM',
    queryLatency: 'Sub-4ms Batching',
    bafinAdvantage: 'Revisionssichere DataFrames',
  },
  {
    id: 'token-bucket',
    name: 'Token-Bucket Rate Limiter & Zero-Trust Proxy',
    specs: 'DDoS & HTTP 429 Schutz',
    description: 'Verhindert API-Sperren durch striktes Token-Bucket Rate Limiting und maskiert interne Client-Tokens hinter einem Zero-Trust Proxy.',
    memoryFootprint: 'Sehr gering (< 10 MB)',
    queryLatency: '< 1ms Overhead',
    bafinAdvantage: 'IT-Sicherheitsnachweis nach MaRisk',
  },
];

// EBENE 5: BAFIN / MICA AUDIT-TRAIL & EVIDENCE ("SCHUTZ & NETZTEIL")
export interface EvidenceComplianceItem {
  id: string;
  name: string;
  retention: string;
  description: string;
  tamperProofMethod: string;
  bafinParagraph: string;
}

export const EVIDENCE_COMPLIANCE_OPTIONS: EvidenceComplianceItem[] = [
  {
    id: 'worm-storage',
    name: 'WORM Storage (Write Once, Read Many)',
    retention: '5 Jahre Vorratsdatenspeicherung',
    description: 'Jeder generierte Score und Tick wird unveränderlich auf WORM-zertifiziertem Speicher archiviert. Ein nachträgliches Ändern ist technisch unmöglich.',
    tamperProofMethod: 'Kryptografische Schreibsperre (WORM)',
    bafinParagraph: 'WpHG § 83 & BaFin MaRisk',
  },
  {
    id: 'merkle-tree',
    name: 'SHA-256 Merkle Audit Tree',
    retention: 'Permanenter kryptografischer Beweis',
    description: 'Bündelt alle Ticks in kryptografischen Merkle-Wurzeln. Erlaubt mathematischen Nachweis, dass der Screener zum Zeitpunkt X exakt diesen Kurs genutzt hat.',
    tamperProofMethod: 'SHA-256 Merkle Root Proofs',
    bafinParagraph: 'MiCA Art. 68 Audit-Compliance',
  },
  {
    id: 'consensus-outlier',
    name: 'Multi-Source Consensus & Outlier Filter',
    retention: 'Live-Konsensus Protokoll',
    description: 'Validiert Preise über mindestens 2 unabhängige Datenquellen. Extreme Spikes oder Fehl-Ticks werden vor dem Scoring automatisch verworfen.',
    tamperProofMethod: 'Median-Filter mit Standardabweichung',
    bafinParagraph: 'BaFin Qualitäts-Anforderung für Benchmarks',
  },
];

export const PipelineBuilder: React.FC<PipelineBuilderProps> = ({
  onBackToHome,
  onNavigateLogin,
  onNavigateTokenomics,
  onNavigateFounder,
}) => {
  // Modular Pipeline Builder Step Selection State
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Configuration State across all 6 Levels
  const [config, setConfig] = useState<PipelineConfigState>({
    analysisFocusId: 'buffett-value',
    latencyIntervalId: 'eod-daily',
    providerIds: ['twelvedata', 'fred'],
    cachingId: 'redis-ring',
    evidenceId: 'worm-storage',
    selectedIndicators: ['rsi-14', 'macd-12-26-9'],
    selectedPatterns: ['double-bottom'],
    selectedNewsApis: ['news-bafin-press', 'news-fed-wire'],
    selectedAssetClasses: ['us-equities', 'dax-equities', 'crypto'],
    logicalOperator: 'AND',
  });

  // Filter & Search State for Analysis Tools Dropdown
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLogicalBuilderOpen, setIsLogicalBuilderOpen] = useState<boolean>(true);
  const [selectedNewsCategoryFilter, setSelectedNewsCategoryFilter] = useState<string>('all');

  // Chatbot Drawer / Modal State
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);

  // Active Selected Objects
  const selectedFocus = useMemo(
    () => ANALYSIS_FOCUS_CATALOG.find((f) => f.id === config.analysisFocusId) || ANALYSIS_FOCUS_CATALOG[0],
    [config.analysisFocusId]
  );

  const selectedLatency = useMemo(
    () => LATENCY_INTERVALS.find((l) => l.id === config.latencyIntervalId) || LATENCY_INTERVALS[0],
    [config.latencyIntervalId]
  );

  const selectedProviders = useMemo(
    () => INGESTION_PROVIDERS.filter((p) => config.providerIds.includes(p.id)),
    [config.providerIds]
  );

  const selectedCaching = useMemo(
    () => CACHING_ARCHITECTURES.find((c) => c.id === config.cachingId) || CACHING_ARCHITECTURES[0],
    [config.cachingId]
  );

  const selectedEvidence = useMemo(
    () => EVIDENCE_COMPLIANCE_OPTIONS.find((e) => e.id === config.evidenceId) || EVIDENCE_COMPLIANCE_OPTIONS[0],
    [config.evidenceId]
  );

  // Real-time Calculations (Budget, Latency, BaFin Score)
  const calculationSummary = useMemo(() => {
    // 1. Costs (Data providers + Latency impact + News APIs)
    const providersCost = selectedProviders.reduce((sum, p) => sum + p.monthlyCostEur, 0);
    const latencyCost = selectedLatency.costImpactEur;
    const newsCost = (config.selectedNewsApis || []).reduce((sum, nId) => {
      const item = MASTER_NEWS_APIS_CATALOG.find((n) => n.id === nId);
      return sum + (item?.monthlyCostEur || 0);
    }, 0);

    const totalMonthlyCostEur = Math.round((providersCost + latencyCost + newsCost) * 100) / 100;
    const budgetCapEur = 40.0;
    const remainingBudgetEur = Math.max(0, budgetCapEur - totalMonthlyCostEur);
    const isWithinBudget = totalMonthlyCostEur <= budgetCapEur;

    // 2. Latency calculation
    let calculatedLatencyMs = 24;
    if (config.latencyIntervalId === 'hft-tick') calculatedLatencyMs = 18;
    else if (config.latencyIntervalId === 'intraday-1m') calculatedLatencyMs = 35;
    else if (config.latencyIntervalId === 'delayed-15m') calculatedLatencyMs = 60;
    else calculatedLatencyMs = 95; // EOD batch

    // 3. BaFin Compliance Score
    let bafinScore = 90;
    if (config.evidenceId === 'worm-storage') bafinScore += 6;
    if (config.evidenceId === 'merkle-tree') bafinScore += 5;
    if (selectedProviders.some((p) => p.id === 'twelvedata' || p.id === 'kraken')) bafinScore += 2;
    if ((config.selectedNewsApis || []).includes('news-bafin-press')) bafinScore += 2;
    bafinScore = Math.min(100, bafinScore);

    return {
      totalMonthlyCostEur,
      budgetCapEur,
      remainingBudgetEur,
      isWithinBudget,
      calculatedLatencyMs,
      bafinScore,
    };
  }, [selectedProviders, selectedLatency, config]);

  // Unique categories for analysis dropdown
  const toolCategories = useMemo(() => {
    const cats = Array.from(new Set(ANALYSIS_FOCUS_CATALOG.map((t) => t.category)));
    return ['all', ...cats];
  }, []);

  // Filtered analysis tools
  const filteredAnalysisTools = useMemo(() => {
    return ANALYSIS_FOCUS_CATALOG.filter((item) => {
      const matchesCat = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keyMetrics.some((km) => km.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategoryFilter, searchQuery]);

  // Handle preset application from Kaufberater chatbot
  const handleApplyPresetConfig = (newConfig: PipelineConfigState) => {
    setConfig(newConfig);
    // Move to step 6 to see the completed custom PC/Pipeline build!
    setCurrentStep(6);
    trackEvent('pipeline_preset_applied', {
      category: 'pipeline_builder',
      label: newConfig.analysisFocusId,
    });
  };

  // Toggle provider selection
  const toggleProvider = (providerId: string) => {
    setConfig((prev: PipelineConfigState) => {
      const exists = prev.providerIds.includes(providerId);
      if (exists) {
        // Keep at least one
        if (prev.providerIds.length <= 1) return prev;
        return {
          ...prev,
          providerIds: prev.providerIds.filter((id: string) => id !== providerId),
        };
      } else {
        return {
          ...prev,
          providerIds: [...prev.providerIds, providerId],
        };
      }
    });
  };

  // Toggle indicator selection
  const toggleIndicator = (indId: string) => {
    setConfig((prev: PipelineConfigState) => {
      const current = prev.selectedIndicators || [];
      const next = current.includes(indId)
        ? current.filter((id: string) => id !== indId)
        : [...current, indId];
      return { ...prev, selectedIndicators: next };
    });
  };

  // Toggle chart pattern selection
  const togglePattern = (patId: string) => {
    setConfig((prev: PipelineConfigState) => {
      const current = prev.selectedPatterns || [];
      const next = current.includes(patId)
        ? current.filter((id: string) => id !== patId)
        : [...current, patId];
      return { ...prev, selectedPatterns: next };
    });
  };

  // Toggle news API selection
  const toggleNewsApi = (newsId: string) => {
    setConfig((prev: PipelineConfigState) => {
      const current = prev.selectedNewsApis || [];
      const next = current.includes(newsId)
        ? current.filter((id: string) => id !== newsId)
        : [...current, newsId];
      return { ...prev, selectedNewsApis: next };
    });
  };

  // Toggle asset class selection
  const toggleAssetClass = (assetId: string) => {
    setConfig((prev: PipelineConfigState) => {
      const current = prev.selectedAssetClasses || [];
      if (current.includes(assetId) && current.length <= 1) return prev;
      const next = current.includes(assetId)
        ? current.filter((id: string) => id !== assetId)
        : [...current, assetId];
      return { ...prev, selectedAssetClasses: next };
    });
  };

  // Copy code helper
  const handleCopyCode = (snippet: string, key: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCodeSnippet(key);
    setTimeout(() => setCopiedCodeSnippet(null), 2000);
  };

  // Generate PDF Blueprint
  const handleExportPdfBlueprint = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('CAPITAL AI — PIPELINE BLUEPRINT SPEZIFIKATION', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Erstellt am: ${new Date().toLocaleString()} | BaFin-Compliance Score: ${calculationSummary.bafinScore}%`, 14, 28);
    doc.text(`Monatliche Gesamtkosten: ${calculationSummary.totalMonthlyCostEur.toFixed(2)} EUR / 40.00 EUR Budget Cap`, 14, 34);

    doc.line(14, 38, 196, 38);

    doc.setFont('helvetica', 'bold');
    doc.text('1. Analyse-Fokus & Screener-Ziel:', 14, 46);
    doc.setFont('helvetica', 'normal');
    doc.text(`${selectedFocus.title} (${selectedFocus.category})`, 14, 52);
    doc.text(`Beschreibung: ${selectedFocus.description.slice(0, 100)}...`, 14, 58);

    doc.setFont('helvetica', 'bold');
    doc.text('2. Taktung & Latenz-Vorgabe:', 14, 68);
    doc.setFont('helvetica', 'normal');
    doc.text(`${selectedLatency.name} — ${selectedLatency.latencySpec}`, 14, 74);

    doc.setFont('helvetica', 'bold');
    doc.text('3. Ingestion & Data Provider:', 14, 84);
    doc.setFont('helvetica', 'normal');
    selectedProviders.forEach((p, idx) => {
      doc.text(`• ${p.name} (${p.category}) — ${p.monthlyCostEur.toFixed(2)} €/Mo`, 18, 90 + idx * 6);
    });

    const startCachingY = 96 + selectedProviders.length * 6;
    doc.setFont('helvetica', 'bold');
    doc.text('4. Normalisierung & Caching:', 14, startCachingY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${selectedCaching.name} (${selectedCaching.specs})`, 14, startCachingY + 6);

    doc.setFont('helvetica', 'bold');
    doc.text('5. BaFin Evidence & Audit-Trail:', 14, startCachingY + 16);
    doc.setFont('helvetica', 'normal');
    doc.text(`${selectedEvidence.name} (${selectedEvidence.bafinParagraph})`, 14, startCachingY + 22);

    doc.save(`capital_ai_pipeline_blueprint_${config.analysisFocusId}.pdf`);
  };

  return (
    <div className="w-full text-slate-100 min-h-screen py-4 sm:py-6 px-2 sm:px-6 relative">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER CONTRACT (Breadcrumb + Controls)                            */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
            {onNavigateFounder ? (
              <button
                type="button"
                onClick={onNavigateFounder}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Studio Hub
              </button>
            ) : (
              <span>Studio Hub</span>
            )}
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-amber-400 font-semibold">Pipeline Builder</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <SlidersHorizontal className="w-6 h-6 text-amber-400 shrink-0" />
              <span>Pipeline Builder</span>
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              PIPELINE BUILDER
            </span>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Zurück zur Übersicht</span>
            </button>
          )}

          {onNavigateFounder && (
            <button
              type="button"
              onClick={onNavigateFounder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition-colors cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Studio Hub &amp; Architektur</span>
            </button>
          )}

          {/* Kaufberater Button */}
          <button
            type="button"
            onClick={() => setIsChatbotOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Reasoning Chatbot als Kaufberater öffnen"
          >
            <BrainCircuit className="w-4 h-4 fill-black text-black" />
            <span>Kaufberater (Reasoning KI)</span>
            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STICKY / COMPACT STATUS BAR (Pipeline Builder Summary)                 */}
      {/* ========================================================================= */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#090e21] border border-slate-800/90 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <div className="text-[10px] text-slate-400 font-mono uppercase">1. Screener-Fokus</div>
          <div className="text-sm font-bold text-white truncate mt-0.5">{selectedFocus.title}</div>
          <div className="text-[10px] text-slate-400 font-mono truncate">{selectedFocus.category}</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-mono uppercase">2. Taktung &amp; Latenz</div>
          <div className="text-sm font-bold text-amber-400 font-mono tabular-nums mt-0.5">
            {calculationSummary.calculatedLatencyMs} ms
          </div>
          <div className="text-[10px] text-slate-400 truncate">{selectedLatency.name}</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-mono uppercase">3. BaFin Compliance</div>
          <div className="text-sm font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
            {calculationSummary.bafinScore} % Score
          </div>
          <div className="text-[10px] text-emerald-400/80 truncate">MaRisk &amp; WpHG § 83</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-mono uppercase">4. Monatsbudget (AP-006)</div>
          <div className="text-sm font-bold text-cyan-400 font-mono tabular-nums mt-0.5">
            {calculationSummary.totalMonthlyCostEur.toFixed(2)} € <span className="text-slate-400 font-normal text-[10px]">/ 40 €</span>
          </div>
          <div className="text-[10px] text-cyan-300/80 font-mono truncate">
            {calculationSummary.remainingBudgetEur.toFixed(2)} € Puffer
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STEP PROGRESS BAR (Pipeline Builder Step Navigation)                   */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090e21] border border-slate-800/90 mb-6 overflow-x-auto scrollbar-none">
        {[
          { step: 1, label: '1. Screener-Fokus', desc: 'Buffett / Scoring' },
          { step: 2, label: '2. Taktung & Latenz', desc: 'EOD / Intraday' },
          { step: 3, label: '3. Data Ingestion', desc: 'TwelveData / FRED' },
          { step: 4, label: '4. Caching & RAM', desc: 'Redis Ring / Arrow' },
          { step: 5, label: '5. BaFin Evidence', desc: 'WORM / Merkle' },
          { step: 6, label: '6. Fertiges System', desc: 'Blueprint Export' },
        ].map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => setCurrentStep(s.step)}
            className={`flex flex-col items-start px-3 py-2 rounded-lg text-xs transition-all shrink-0 cursor-pointer text-left ${
              currentStep === s.step
                ? 'bg-amber-400 text-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-bold whitespace-nowrap">{s.label}</span>
            <span className={`text-[10px] whitespace-nowrap font-normal ${currentStep === s.step ? 'text-black/80' : 'text-slate-500'}`}>
              {s.desc}
            </span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN CONFIGURATOR CANVAS: EBENEN 1 BIS 6                              */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* EBENE 1: ANALYSE-FOKUS & SCREENER-ZIEL (DER AUSGANGSPUNKT)                */}
      {/* ------------------------------------------------------------------------- */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Header & Category Dropdown Filter */}
          <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-400 text-black text-xs font-black flex items-center justify-center font-mono">
                    1
                  </span>
                  <span>Analysetools, Arten &amp; Multi-Asset Screener-Ausgangspunkt</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Wählen Sie Ihr Kern-Tool (z.B. <strong>Buffett Value Check</strong> oder <strong>BaFin Multi-Faktor Scorer</strong>) 
                  und konfigurieren Sie unten im <strong>Logical Screening Builder</strong> Indikatoren, Chart-Muster und Asset-Klassen.
                </p>
              </div>

              {/* Dropdown Menu for Tool Categories */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-slate-700 text-xs">
                    <Filter className="w-3.5 h-3.5 text-amber-400" />
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer pr-4"
                    >
                      <option value="all" className="bg-[#090e21] text-white">
                        Alle Tool-Arten ({ANALYSIS_FOCUS_CATALOG.length})
                      </option>
                      {toolCategories
                        .filter((c) => c !== 'all')
                        .map((cat) => (
                          <option key={cat} value={cat} className="bg-[#090e21] text-white">
                            {cat} ({ANALYSIS_FOCUS_CATALOG.filter((t) => t.category === cat).length})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tool suchen..."
                    className="w-32 sm:w-44 bg-black/60 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAnalysisTools.map((item) => {
              const isSelected = config.analysisFocusId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setConfig((prev: PipelineConfigState) => ({
                      ...prev,
                      analysisFocusId: item.id,
                      latencyIntervalId: item.recommendedInterval,
                    }));
                  }}
                  className={`p-4 rounded-xl bg-[#090e21] border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/5 ring-1 ring-amber-400/30 shadow-lg'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">{item.title}</h3>
                        <div className="text-[11px] text-amber-400 font-medium">{item.subtitle}</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.description}</p>

                    <div className="space-y-1 mb-3">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Schlüssel-Metriken:</div>
                      <div className="flex flex-wrap gap-1">
                        {item.keyMetrics.map((km, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-slate-800 text-slate-300"
                          >
                            {km}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Ideale Latenz: <strong className="text-white">{item.idealLatency}</strong></span>
                    <span className="text-emerald-400 font-bold">{isSelected ? '✓ Gewählt' : 'Auswählen'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===================================================================== */}
          {/* MULTI-ASSET & LOGICAL SCREENING BUILDER (PATTERNS & INDICATORS)       */}
          {/* ===================================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#090e21] to-[#040714] border border-cyan-500/30 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-cyan-400" />
                  <span>Individueller Multi-Asset &amp; Logical Screening Builder</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    FINTECH STACK KIT
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kombinieren Sie logische Regeln, Chart-Muster und mathematische Indikatoren mit Signal- und Prioritäts-Badges.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Logik:</span>
                <div className="flex rounded-lg bg-black/60 p-0.5 border border-slate-800">
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev: PipelineConfigState) => ({ ...prev, logicalOperator: 'AND' }))
                    }
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      config.logicalOperator === 'AND'
                        ? 'bg-amber-400 text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    UND (Alle)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev: PipelineConfigState) => ({ ...prev, logicalOperator: 'OR' }))
                    }
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      config.logicalOperator === 'OR'
                        ? 'bg-cyan-400 text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ODER (Trigger)
                  </button>
                </div>
              </div>
            </div>

            {/* Live Screener Trigger Sentence Visualizer */}
            <div className="p-3 rounded-xl bg-black/70 border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-[10px] uppercase text-slate-500 flex items-center gap-1 font-bold">
                <Target className="w-3 h-3 text-amber-400" />
                <span>Aktive Screener-Trigger Logik (Kompilierter Regelsatz):</span>
              </div>
              <div className="text-cyan-200 leading-relaxed">
                <strong className="text-amber-400">WENN</strong> [Basis: {selectedFocus.title}]
                <strong className="text-white"> {config.logicalOperator || 'AND'} </strong>
                <span>[Assets: {(config.selectedAssetClasses || []).join(', ') || 'Alle'}]</span>
                <strong className="text-white"> {config.logicalOperator || 'AND'} </strong>
                <span>[Indikatoren ({(config.selectedIndicators || []).length}): {(config.selectedIndicators || []).join(', ')}]</span>
                <strong className="text-white"> {config.logicalOperator || 'AND'} </strong>
                <span>[Muster ({(config.selectedPatterns || []).length}): {(config.selectedPatterns || []).join(', ')}]</span>
                <strong className="text-emerald-400"> → DANN </strong>
                <span className="text-emerald-300 font-bold">[BaFin WORM Audit Snapshot auslösen]</span>
              </div>
            </div>

            {/* 1. Multi-Asset Classes Selector */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Multi-Asset Abdeckung auswählen:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'us-equities', label: 'US Equities (S&P / Nasdaq)', badge: 'Top 150' },
                  { id: 'dax-equities', label: 'DAX & EU Blue Chips', badge: 'EUR Benchmark' },
                  { id: 'crypto', label: 'Krypto (BTC, ETH, Top 100)', badge: 'Realtime L2' },
                  { id: 'forex', label: 'Forex G10 Currencies', badge: '24/5 FX' },
                  { id: 'commodities', label: 'Rohstoffe (Gold, Silber, Brent)', badge: 'Futures' },
                  { id: 'bonds', label: 'Staatsanleihen (US 10Y-2Y)', badge: 'Zinskurve' },
                ].map((asset) => {
                  const isSelected = (config.selectedAssetClasses || []).includes(asset.id);
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => toggleAssetClass(asset.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-sm'
                          : 'bg-black/40 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> : <Square className="w-3.5 h-3.5" />}
                      <span>{asset.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/60 text-slate-400">
                        {asset.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Indicators with Signal & Priority Badges */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. Mathematische Indikatoren &amp; Formeln:</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {(config.selectedIndicators || []).length} aktiv
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MASTER_INDICATORS_CATALOG.map((ind) => {
                  const isSelected = (config.selectedIndicators || []).includes(ind.id);

                  // Signal badge colors
                  let signalBadgeClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                  if (ind.signal === 'bearish') signalBadgeClass = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
                  else if (ind.signal === 'neutral') signalBadgeClass = 'bg-amber-400/15 text-amber-300 border-amber-400/30';
                  else if (ind.signal === 'volatility') signalBadgeClass = 'bg-purple-500/15 text-purple-300 border-purple-500/30';

                  // Priority badge colors
                  let priorityBadgeClass = 'bg-rose-500/20 text-rose-200 border-rose-500/40';
                  if (ind.priority === 'P2') priorityBadgeClass = 'bg-amber-400/20 text-amber-200 border-amber-400/40';
                  else if (ind.priority === 'P3') priorityBadgeClass = 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40';

                  return (
                    <div
                      key={ind.id}
                      onClick={() => toggleIndicator(ind.id)}
                      className={`p-3 rounded-xl bg-black/50 border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/5 ring-1 ring-amber-400/30'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                            <span className="text-xs font-bold text-white">{ind.name}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Signal Badge */}
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${signalBadgeClass}`}>
                              {ind.signal}
                            </span>
                            {/* Priority Badge */}
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold ${priorityBadgeClass}`}>
                              {ind.priority}
                            </span>
                          </div>
                        </div>

                        <div className="p-1.5 rounded-lg bg-black/80 border border-slate-800 text-[10px] font-mono text-cyan-200 mb-1.5 truncate">
                          {ind.formula}
                        </div>

                        <p className="text-[11px] text-slate-400 mb-1.5">{ind.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Trigger: <strong className="text-slate-200">{ind.defaultThreshold}</strong></span>
                        <span className="text-slate-300">Intervall: {ind.timeframe.toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Chart Patterns with Signal & Priority Badges */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>3. Chart-Muster mit Historischer Win-Rate:</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {(config.selectedPatterns || []).length} aktiv
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MASTER_PATTERNS_CATALOG.map((pat) => {
                  const isSelected = (config.selectedPatterns || []).includes(pat.id);

                  let signalBadgeClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                  if (pat.signal === 'bearish') signalBadgeClass = 'bg-rose-500/15 text-rose-300 border-rose-500/30';

                  let priorityBadgeClass = 'bg-rose-500/20 text-rose-200 border-rose-500/40';
                  if (pat.priority === 'P2') priorityBadgeClass = 'bg-amber-400/20 text-amber-200 border-amber-400/40';

                  return (
                    <div
                      key={pat.id}
                      onClick={() => togglePattern(pat.id)}
                      className={`p-3 rounded-xl bg-black/50 border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-purple-400 bg-purple-400/5 ring-1 ring-purple-400/30'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-purple-400 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                            <span className="text-xs font-bold text-white">{pat.name}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${signalBadgeClass}`}>
                              {pat.signal}
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold ${priorityBadgeClass}`}>
                              {pat.priority}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-bold">
                              {pat.winRateHistorical}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 mb-2">{pat.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Typ: <strong className="text-slate-200">{pat.category}</strong></span>
                        <span className="text-slate-300">Intervall: {pat.timeframe.toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs shadow-lg hover:bg-amber-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Weiter zu Ebene 2: Taktung &amp; Latenz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* EBENE 2: TAKTUNG & LATENZ-VORAUSSETZUNGEN                                 */}
      {/* ------------------------------------------------------------------------- */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-400 text-black text-xs font-black flex items-center justify-center font-mono">
                2
              </span>
              <span>Latenz- &amp; Zeitintervall-Vorgaben für &quot;{selectedFocus.title}&quot;</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Wählen Sie die Abtastfrequenz. Für fundamentale Screener wie den <strong>Buffett Value Check</strong> reicht EOD / Daily vollkommen aus 
              (spart 100% Streaming-Kosten), während HFT-Arbitrage Sub-20ms WebSocket Feeds benötigt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LATENCY_INTERVALS.map((item) => {
              const isSelected = config.latencyIntervalId === item.id;
              const isRecommended = selectedFocus.recommendedInterval === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setConfig((prev: PipelineConfigState) => ({ ...prev, latencyIntervalId: item.id }))}
                  className={`p-4 rounded-xl bg-[#090e21] border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/5 ring-1 ring-amber-400/30 shadow-lg'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      {isRecommended && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          Empfohlen für {selectedFocus.title}
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold font-mono text-amber-400 mb-2">{item.latencySpec}</div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{item.bandwidthImpact}</span>
                    <span className="text-emerald-400 font-bold">{isSelected ? '✓ Aktiv' : 'Wählen'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 cursor-pointer"
            >
              Zurück zu Ebene 1
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs shadow-lg hover:bg-amber-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Weiter zu Ebene 3: Data Ingestion</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* EBENE 3: DATA INGESTION & PROVIDER STACK                                  */}
      {/* ------------------------------------------------------------------------- */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-400 text-black text-xs font-black flex items-center justify-center font-mono">
                3
              </span>
              <span>Data Ingestion &amp; Hardware-Lieferanten (Mehrfachauswahl möglich)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Wählen Sie die autorisierten Gateways. Alle Provider halten sich strikt an die <strong>40 € / Monat Budget-Obergrenze (AP-006)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {INGESTION_PROVIDERS.map((provider) => {
              const isSelected = config.providerIds.includes(provider.id);

              return (
                <div
                  key={provider.id}
                  onClick={() => toggleProvider(provider.id)}
                  className={`p-4 rounded-xl bg-[#090e21] border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/5 ring-1 ring-amber-400/30 shadow-lg'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white">{provider.name}</h3>
                      <span className="text-xs font-bold font-mono text-cyan-300">
                        {provider.monthlyCostEur === 0 ? '0,00 € (Free)' : `${provider.monthlyCostEur.toFixed(2)} €/Mo`}
                      </span>
                    </div>

                    <div className="text-[11px] text-amber-400 font-mono mb-2">{provider.category}</div>
                    <p className="text-xs text-slate-300 mb-2">{provider.coverage}</p>

                    <div className="text-[10px] font-mono text-slate-400 mb-2">
                      Protokolle: <strong className="text-white">{provider.protocols}</strong> · Latenz: <strong className="text-white">{provider.typicalLatency}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 text-[10px]">{provider.bafinStatus}</span>
                    <span className="font-bold text-xs">{isSelected ? '✓ Ausgewählt' : '+ Hinzufügen'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===================================================================== */}
          {/* AUSWAHL AN NEWS API SCHNITTSTELLEN MIT KATEGORISIERUNG                */}
          {/* ===================================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#090e21] to-[#040714] border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-cyan-400" />
                  <span>Auswahl an News API Schnittstellen (Kategorisiert)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    REALTIME NEWS WIRE
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Integrieren Sie behördliche BaFin-Warnungen, SEC Edgar Filings, Makro-Zentralbankdaten und Krypto-Newsfeeds direkt in Ihr Fintech Stack Kit.
                </p>
              </div>

              {/* News Category Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
                {[
                  { id: 'all', label: 'Alle News' },
                  { id: 'Makro & Zentralbanken', label: 'Makro & Zinsen' },
                  { id: 'Regulatorisch & BaFin', label: 'BaFin & SEC' },
                  { id: 'Ad-Hoc & Earnings', label: 'Ad-Hoc (DGAP)' },
                  { id: 'Krypto & On-Chain', label: 'Krypto & Whales' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedNewsCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedNewsCategoryFilter === cat.id
                        ? 'bg-amber-400 text-black font-bold shadow-sm'
                        : 'bg-black/50 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* News API Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MASTER_NEWS_APIS_CATALOG.filter(
                (news) => selectedNewsCategoryFilter === 'all' || news.category === selectedNewsCategoryFilter
              ).map((news) => {
                const isSelected = (config.selectedNewsApis || []).includes(news.id);

                return (
                  <div
                    key={news.id}
                    onClick={() => toggleNewsApi(news.id)}
                    className={`p-3.5 rounded-xl bg-black/50 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-400/5 ring-1 ring-cyan-400/30 shadow-md'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <h4 className="text-xs font-bold text-white leading-tight">{news.name}</h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-bold shrink-0">
                          {news.monthlyCostEur === 0 ? '0,00 € (Sovereign)' : `${news.monthlyCostEur.toFixed(2)} €/Mo`}
                        </span>
                      </div>

                      <div className="text-[10px] text-cyan-300 font-mono mb-1">{news.provider}</div>
                      <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">{news.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Latenz: <strong className="text-slate-200">{news.latencySpec}</strong></span>
                      <span className="text-emerald-400 font-medium">{news.bafinRelevance}</span>
                      <span className={`font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                        {isSelected ? '✓ Aktiviert' : '+ Hinzufügen'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 cursor-pointer"
            >
              Zurück zu Ebene 2
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs shadow-lg hover:bg-amber-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Weiter zu Ebene 4: Caching &amp; RAM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* EBENE 4: NORMALISIERUNG & IN-MEMORY CACHING ("MAINBOARD & RAM")           */}
      {/* ------------------------------------------------------------------------- */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-400 text-black text-xs font-black flex items-center justify-center font-mono">
                4
              </span>
              <span>Normalisierung &amp; In-Memory Caching-Architektur</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Das Herzstück der Performance. Entkoppelt Tausende von Frontend-Nutzern von externen Provider-APIs durch In-Memory Ringpuffer und Zero-Copy RPC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CACHING_ARCHITECTURES.map((item) => {
              const isSelected = config.cachingId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setConfig((prev: PipelineConfigState) => ({ ...prev, cachingId: item.id }))}
                  className={`p-4 rounded-xl bg-[#090e21] border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/5 ring-1 ring-amber-400/30 shadow-lg'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300">
                        {item.queryLatency}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-amber-400 font-mono mb-2">{item.specs}</div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] font-mono">{item.memoryFootprint}</span>
                    <span className="text-emerald-400 font-bold">{isSelected ? '✓ Aktiv' : 'Wählen'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 cursor-pointer"
            >
              Zurück zu Ebene 3
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs shadow-lg hover:bg-amber-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Weiter zu Ebene 5: BaFin Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* EBENE 5: BAFIN EVIDENCE & AUDIT-TRAIL                                      */}
      {/* ------------------------------------------------------------------------- */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-400 text-black text-xs font-black flex items-center justify-center font-mono">
                5
              </span>
              <span>BaFin &amp; MiCA Audit-Trail / Evidence Recording (&quot;Schutz &amp; Netzteil&quot;)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Garantiert Rechtssicherheit nach WpHG § 83 und MaRisk. Unveränderliche kryptografische Beweisbarkeit für historische Backtests und Kundenberatung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EVIDENCE_COMPLIANCE_OPTIONS.map((item) => {
              const isSelected = config.evidenceId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setConfig((prev: PipelineConfigState) => ({ ...prev, evidenceId: item.id }))}
                  className={`p-4 rounded-xl bg-[#090e21] border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/5 ring-1 ring-amber-400/30 shadow-lg'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{item.name}</h3>
                    <div className="text-[11px] text-cyan-300 font-mono mb-2">{item.retention}</div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="text-[10px] text-slate-400 font-mono mb-1">{item.tamperProofMethod}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-mono text-[10px]">{item.bafinParagraph}</span>
                      <span className="text-emerald-400 font-bold">{isSelected ? '✓ Aktiv' : 'Wählen'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 cursor-pointer"
            >
              Zurück zu Ebene 4
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(6)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs shadow-lg hover:bg-amber-300 flex items-center gap-2 cursor-pointer"
            >
              <span>System fertigstellen &amp; Blueprint exportieren</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* EBENE 6: FERTIGES SYSTEM, BLUEPRINT & CODE EXPORT                         */}
      {/* ------------------------------------------------------------------------- */}
      {currentStep === 6 && (
        <div className="space-y-6">
          {/* Certificate Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-amber-500/10 to-cyan-500/15 border border-emerald-500/40 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>BaFin-Konformitätszertifikat Ausgestellt</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Ihr individuelles {selectedFocus.title} Datensystem
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Konfiguriert nach der modularen Enterprise Pipeline-Architektur. Erfüllt alle Kriterien für BaFin MaRisk, WpHG § 83 und die 
                  vertragliche <strong className="text-amber-400 font-mono">40,00 € Monatsbudget-Obergrenze (AP-006)</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportPdfBlueprint}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FileDown className="w-4 h-4" />
                  <span>PDF Evidence Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full Specification List (Enterprise Bill of Materials) */}
          <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-400" />
                <span>Vollständige Komponenten-Spezifikation (Stückliste)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsChatbotOpen(true)}
                className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inventar im Kaufberater auditieren</span>
              </button>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-3.5 rounded-lg bg-black/40 border border-slate-800 flex flex-col justify-between gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">EBENE 1: ANALYSE-FOKUS &amp; MULTI-ASSET LOGIK</div>
                    <div className="text-sm font-bold text-white">{selectedFocus.title}</div>
                    <div className="text-xs text-slate-400">{selectedFocus.subtitle}</div>
                  </div>
                  <div className="text-right font-mono text-xs text-emerald-400 font-bold">
                    {selectedFocus.bafinStandard}
                  </div>
                </div>

                {/* Sub-Items: Assets, Indicators & Patterns */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 items-center text-[10px] font-mono">
                  <span className="text-slate-500 uppercase">Assets:</span>
                  {(config.selectedAssetClasses || []).map((a) => (
                    <span key={a} className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {a}
                    </span>
                  ))}
                  <span className="text-slate-500 uppercase ml-2">Logik:</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                    {config.logicalOperator || 'AND'}
                  </span>
                  <span className="text-slate-500 uppercase ml-2">Indikatoren ({(config.selectedIndicators || []).length}):</span>
                  {(config.selectedIndicators || []).map((indId) => {
                    const ind = MASTER_INDICATORS_CATALOG.find((i) => i.id === indId);
                    return (
                      <span key={indId} className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                        {ind?.shortName || indId}
                      </span>
                    );
                  })}
                  <span className="text-slate-500 uppercase ml-2">Muster ({(config.selectedPatterns || []).length}):</span>
                  {(config.selectedPatterns || []).map((patId) => {
                    const pat = MASTER_PATTERNS_CATALOG.find((p) => p.id === patId);
                    return (
                      <span key={patId} className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {pat?.name.split(' (')[0] || patId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">EBENE 2: TAKTUNG &amp; LATENZ</div>
                  <div className="text-sm font-bold text-white">{selectedLatency.name}</div>
                  <div className="text-xs text-slate-400">{selectedLatency.latencySpec} · {selectedLatency.bandwidthImpact}</div>
                </div>
                <div className="text-right font-mono text-xs text-amber-400 font-bold">
                  {calculationSummary.calculatedLatencyMs} ms Berechnet
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-3.5 rounded-lg bg-black/40 border border-slate-800 flex flex-col justify-between gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      EBENE 3: INGESTION GATEWAYS &amp; NEWS APIS ({selectedProviders.length + (config.selectedNewsApis || []).length})
                    </div>
                    <div className="text-sm font-bold text-white">
                      {selectedProviders.map((p) => p.name).join(' · ')}
                    </div>
                    <div className="text-xs text-slate-400">Multi-Asset Normalisierung &amp; Failover-Kette</div>
                  </div>
                  <div className="text-right font-mono text-xs text-cyan-300 font-bold">
                    {calculationSummary.totalMonthlyCostEur.toFixed(2)} € / Mo
                  </div>
                </div>

                {/* Sub-Items: Active News APIs */}
                {(config.selectedNewsApis || []).length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 items-center text-[10px] font-mono">
                    <span className="text-slate-500 uppercase">News APIs ({(config.selectedNewsApis || []).length}):</span>
                    {(config.selectedNewsApis || []).map((newsId) => {
                      const news = MASTER_NEWS_APIS_CATALOG.find((n) => n.id === newsId);
                      return (
                        <span key={newsId} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {news?.name || newsId} ({news?.category})
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Item 4 */}
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">EBENE 4: CACHING &amp; RAM</div>
                  <div className="text-sm font-bold text-white">{selectedCaching.name}</div>
                  <div className="text-xs text-slate-400">{selectedCaching.specs} · {selectedCaching.memoryFootprint}</div>
                </div>
                <div className="text-right font-mono text-xs text-slate-300 font-bold">
                  {selectedCaching.queryLatency}
                </div>
              </div>

              {/* Item 5 */}
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">EBENE 5: AUDIT-TRAIL &amp; COMPLIANCE</div>
                  <div className="text-sm font-bold text-white">{selectedEvidence.name}</div>
                  <div className="text-xs text-slate-400">{selectedEvidence.retention} · {selectedEvidence.tamperProofMethod}</div>
                </div>
                <div className="text-right font-mono text-xs text-emerald-400 font-bold">
                  {selectedEvidence.bafinParagraph}
                </div>
              </div>
            </div>
          </div>

          {/* Code Blueprint Snippets */}
          <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Generierter Code Blueprint ({selectedFocus.id === 'buffett-value' ? 'Python Buffett Screener' : 'TypeScript Contract'})</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  handleCopyCode(
                    selectedFocus.id === 'buffett-value'
                      ? `# Buffett Value Check Screener Engine (BaFin WpHG § 83)
import pandas as pd
import numpy as np

def calculate_buffett_score(ticker, financial_history_10y):
    # 1. 10-Jahres Eigenkapitalrendite (ROE > 15%)
    avg_roe = financial_history_10y['roe'].mean()
    moat_score = 100 if avg_roe > 0.15 else (avg_roe / 0.15) * 80
    
    # 2. Verschuldungsgrad (Debt/Equity < 0.5)
    debt_equity = financial_history_10y['debt_equity'].iloc[-1]
    debt_score = 100 if debt_equity < 0.5 else 50
    
    # 3. Discounted Cashflow Margin of Safety (> 25%)
    fair_value = financial_history_10y['dcf_fair_value'].iloc[-1]
    current_price = financial_history_10y['close'].iloc[-1]
    margin_of_safety = (fair_value - current_price) / fair_value
    
    composite_score = (moat_score * 0.4) + (debt_score * 0.3) + (max(0, margin_of_safety) * 100 * 0.3)
    return {
        "ticker": ticker,
        "buffett_composite_score": round(composite_score, 1),
        "is_undervalued": margin_of_safety > 0.25,
        "evidence_hash": "sha256_merkle_root_verified"
    }`
                      : `// Capital-AI Provider Contract Blueprint (AP-001 / AP-003 / AP-006)
import { z } from 'zod';

export const ConfiguredPipelineContract = z.object({
  screenerFocus: z.literal('${config.analysisFocusId}'),
  latencyInterval: z.literal('${config.latencyIntervalId}'),
  selectedProviders: z.array(z.string()).default(${JSON.stringify(config.providerIds)}),
  selectedNewsApis: z.array(z.string()).default(${JSON.stringify(config.selectedNewsApis || [])}),
  selectedIndicators: z.array(z.string()).default(${JSON.stringify(config.selectedIndicators || [])}),
  selectedPatterns: z.array(z.string()).default(${JSON.stringify(config.selectedPatterns || [])}),
  selectedAssetClasses: z.array(z.string()).default(${JSON.stringify(config.selectedAssetClasses || [])}),
  logicalOperator: z.enum(['AND', 'OR']).default('${config.logicalOperator || 'AND'}'),
  cachingTier: z.literal('${config.cachingId}'),
  evidenceCompliance: z.literal('${config.evidenceId}'),
  budgetLimitEur: z.number().max(40.0).default(${calculationSummary.totalMonthlyCostEur}),
  bafinComplianceScore: z.literal(${calculationSummary.bafinScore}),
});`,
                    'blueprint'
                  )
                }
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCodeSnippet === 'blueprint' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Code kopieren</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
              {selectedFocus.id === 'buffett-value' ? (
`# Buffett Value Check Screener Engine (BaFin WpHG § 83 Konform)
import pandas as pd
import numpy as np

def calculate_buffett_score(ticker, financial_history_10y):
    # 1. 10-Jahres Eigenkapitalrendite (ROE > 15%)
    avg_roe = financial_history_10y['roe'].mean()
    moat_score = 100 if avg_roe > 0.15 else (avg_roe / 0.15) * 80
    
    # 2. Verschuldungsgrad (Debt/Equity < 0.5)
    debt_equity = financial_history_10y['debt_equity'].iloc[-1]
    debt_score = 100 if debt_equity < 0.5 else 50
    
    # 3. Discounted Cashflow Margin of Safety (> 25%)
    fair_value = financial_history_10y['dcf_fair_value'].iloc[-1]
    current_price = financial_history_10y['close'].iloc[-1]
    margin_of_safety = (fair_value - current_price) / fair_value
    
    composite_score = (moat_score * 0.4) + (debt_score * 0.3) + (max(0, margin_of_safety) * 100 * 0.3)
    return {
        "ticker": ticker,
        "buffett_composite_score": round(composite_score, 1),
        "is_undervalued": margin_of_safety > 0.25,
        "evidence_hash": "sha256_merkle_root_verified"
    }`
              ) : (
`// Capital-AI Provider Contract Blueprint (AP-001 / AP-003 / AP-006)
import { z } from 'zod';

export const ConfiguredPipelineContract = z.object({
  screenerFocus: z.literal('${config.analysisFocusId}'),
  latencyInterval: z.literal('${config.latencyIntervalId}'),
  selectedProviders: z.array(z.string()).default(${JSON.stringify(config.providerIds)}),
  selectedNewsApis: z.array(z.string()).default(${JSON.stringify(config.selectedNewsApis || [])}),
  selectedIndicators: z.array(z.string()).default(${JSON.stringify(config.selectedIndicators || [])}),
  selectedPatterns: z.array(z.string()).default(${JSON.stringify(config.selectedPatterns || [])}),
  selectedAssetClasses: z.array(z.string()).default(${JSON.stringify(config.selectedAssetClasses || [])}),
  logicalOperator: z.enum(['AND', 'OR']).default('${config.logicalOperator || 'AND'}'),
  cachingTier: z.literal('${config.cachingId}'),
  evidenceCompliance: z.literal('${config.evidenceId}'),
  budgetLimitEur: z.number().max(40.0).default(${calculationSummary.totalMonthlyCostEur}),
  bafinComplianceScore: z.literal(${calculationSummary.bafinScore}),
});`
              )}
            </pre>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 cursor-pointer"
            >
              Konfiguration von vorn anpassen
            </button>
            {onNavigateFounder && (
              <button
                type="button"
                onClick={onNavigateFounder}
                className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs shadow-lg hover:bg-amber-300 flex items-center gap-2 cursor-pointer"
              >
                <span>Zum Studio Hub (Architektur &amp; Blueprints)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FLOATING / SLIDE-IN REASONING CHATBOT (KAUFBERATER)                     */}
      {/* ========================================================================= */}
      <AdvisorChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        currentConfig={config}
        onApplyConfig={handleApplyPresetConfig}
        onStepChange={(step) => setCurrentStep(step)}
        isFloating={true}
      />
    </div>
  );
};
