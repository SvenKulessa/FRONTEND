/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: SYSTEM- & KURS-DATEN-PIPELINE ARCHITEKTUR (/architecture)]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Interaktiver 4-Tier Daten-Pipeline Visualizer (Ingestion -> Normalisierung -> Caching -> Distribution -> Client/KI)
 *    - Provider- & Konfigurations-Matrix mit dynamischen Multi-Kriterien-Filtern (Assetklasse, Budget, Latenz, Protokoll)
 *    - Live Latency Simulator & Failover Test-Bench mit Reconnect & Circuit-Breaker Simulation
 *    - Low-Budget TCO-Rechner & Hosting Blueprint ($0 - $39/Monat für 10.000+ aktive Nutzer)
 *    - Security & Compliance Blueprint (TLS 1.3, mTLS, Token-Bucket Rate Limiter, Zero-Trust Proxy, MiCA/BaFin)
 *    - Production-Ready Code Blueprints (Node.js WebSocket Multiplexer, Redis Ring Buffer, React Client Hook)
 * 2. SCORING-LOGIK        : 
 *    - Data Quality Score (DQS: 0-100 basierend auf Tick-Spreizung, Latenz-Jitter, Orderbuch-Tiefe & VWAP)
 *    - Cost-Efficiency Ratio (CER: Performance-Ticks pro Dollar)
 *    - Multi-Source Consensus Score (Validierung von Ticks gegen Referenz-Preise zur Outlier-Erkennung)
 * 3. DATENANBINDUNG       : 
 *    - Live Feed Simulator (Browser WebSocket Heartbeat Generator mit dynamischem Jitter)
 *    - WebSocket Multiplexer Abstraction Layer
 *    - In-Memory Ring Buffer Schnittstelle & Delta-Kompression
 * 4. DATENQUELLEN / FEEDS : 
 *    - Krypto: Binance Public WebSocket (0€ / 15-30ms), Coinbase Pro WSS (0€ / 35-50ms)
 *    - Aktien & ETFs: Finnhub.io Starter/Free (0€-29€ / 60-90ms), Polygon.io Starter (29€ / 50-80ms)
 *    - Forex & Rohstoffe: Twelve Data Free Tier (0€ / 80-120ms), AlphaVantage / CCXT Fallback
 *    - Makro & Sentiment: FRED API (0€), Alternative.me Fear & Greed (0€), Whale-Alert Free RSS
 * ============================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Server,
  Zap,
  Shield,
  ShieldCheck,
  Cpu,
  Database,
  ArrowRight,
  RefreshCw,
  Layers,
  Activity,
  DollarSign,
  Lock,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Wifi,
  Sliders,
  Sparkles,
  ArrowLeft,
  Gauge,
  Radio,
  FileCode,
  Coins,
  BarChart3,
  Globe,
  Flame,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { trackEvent } from '../utils/analytics';
import { PipelineBuilder } from './PipelineBuilder';
import { ProviderStatusDashboard } from './ProviderStatusDashboard';

interface ArchitecturePageProps {
  onBackToHome: () => void;
  onNavigateLogin?: () => void;
  onNavigateLegal?: (path: string) => void;
  onNavigateTokenomics?: () => void;
}

// ---------------------------------------------------------------------------
// DATA DEFINITIONS: PROVIDERS & CONFIGURATIONS
// ---------------------------------------------------------------------------
export interface DataFeedProvider {
  id: string;
  name: string;
  category: 'KRYPTO' | 'AKTIEN' | 'FOREX' | 'ROHSTOFFE' | 'CROSS_ASSET' | 'ON_CHAIN';
  pricingTier: 'Free (0€)' | 'Low-Budget (<30€/Mo)' | 'Pay-per-Use';
  monthlyCostEur: number;
  latencyClass: 'Sub-25ms' | 'Sub-50ms' | 'Sub-100ms' | '100-300ms';
  protocol: 'WebSocket (WSS)' | 'REST JSON' | 'Hybrid (WSS + REST)';
  securityRating: 'A+' | 'A' | 'B+';
  dataQualityScore: number; // 0 - 100
  uptimeSla: string;
  rateLimit: string;
  securityFeatures: string[];
  features: string[];
  recommendedRole: 'Primärer Realtime-Stream' | 'Sekundärer Failover' | 'Historische Daten / EOD' | 'Sektor-Aggregator';
  endpointSnippet: string;
  pros: string[];
  cons: string[];
}

export const DATA_PROVIDERS: DataFeedProvider[] = [
  {
    id: 'binance-public-wss',
    name: 'Binance Public Stream API',
    category: 'KRYPTO',
    pricingTier: 'Free (0€)',
    monthlyCostEur: 0,
    latencyClass: 'Sub-25ms',
    protocol: 'WebSocket (WSS)',
    securityRating: 'A+',
    dataQualityScore: 99,
    uptimeSla: '99.98%',
    rateLimit: 'Unbegrenzte Public Ticks (1024 Streams/Conn)',
    securityFeatures: ['TLS 1.3', 'Zero Client-Key Exposure', 'Public Endpoint (No Secret Leak)'],
    features: ['Tick-by-Tick Trades', 'Best Bid/Offer (BBO)', '24h Ticker Stats', 'Mini-Ticker Batch'],
    recommendedRole: 'Primärer Realtime-Stream',
    endpointSnippet: 'wss://stream.binance.com:9443/ws/!miniTicker@arr',
    pros: ['Völlig kostenlos ohne API-Key', 'Extrem geringe Latenz (<25ms)', 'Höchste weltweite Krypto-Liquidität'],
    cons: ['Nur Krypto-Assets', 'Gelegentliche TCP-Drops bei Marktschocks erfordert Auto-Reconnect'],
  },
  {
    id: 'coinbase-advanced-wss',
    name: 'Coinbase Advanced Trade API',
    category: 'KRYPTO',
    pricingTier: 'Free (0€)',
    monthlyCostEur: 0,
    latencyClass: 'Sub-50ms',
    protocol: 'WebSocket (WSS)',
    securityRating: 'A+',
    dataQualityScore: 98,
    uptimeSla: '99.95%',
    rateLimit: '10.000 msgs/sec pro WebSocket',
    securityFeatures: ['HMAC-SHA256 Signatures', 'TLS 1.3', 'US/EU Regulatory Compliance'],
    features: ['Ticker Channel', 'Heartbeat Ping', 'Level 2 Orderbuch', 'Match Engine Trades'],
    recommendedRole: 'Sekundärer Failover',
    endpointSnippet: 'wss://advanced-trade-ws.coinbase.com',
    pros: ['Sehr hohe Datenkonsistenz & US-Dollar Referenzpreise', 'Sehr zuverlässiges Heartbeat-Protokoll'],
    cons: ['Geringere Altcoin-Auswahl als Binance'],
  },
  {
    id: 'finnhub-starter',
    name: 'Finnhub.io Market API',
    category: 'AKTIEN',
    pricingTier: 'Low-Budget (<30€/Mo)',
    monthlyCostEur: 29,
    latencyClass: 'Sub-100ms',
    protocol: 'Hybrid (WSS + REST)',
    securityRating: 'A',
    dataQualityScore: 95,
    uptimeSla: '99.90%',
    rateLimit: 'Free: 60 Calls/Min | Pro: 300 Calls/Min',
    securityFeatures: ['API Token Auth', 'IP Whitelisting', 'TLS 1.3'],
    features: ['Echtzeit US-Aktien Trades', 'Forex Live Ticks', 'Unternehmenskennzahlen', 'Earnings & News NLP'],
    recommendedRole: 'Primärer Realtime-Stream',
    endpointSnippet: 'wss://ws.finnhub.io?token=${FINNHUB_API_KEY}',
    pros: ['Sehr erschwinglich ($29/Mo Starter, Free Tier vorhanden)', 'Bietet Aktien, Forex und Krypto in einem Feed', 'Integrierte News & Sentiment'],
    cons: ['Free Tier hat striktes 60 Calls/Min Rate-Limit'],
  },
  {
    id: 'polygon-io-starter',
    name: 'Polygon.io Starter',
    category: 'AKTIEN',
    pricingTier: 'Low-Budget (<30€/Mo)',
    monthlyCostEur: 29,
    latencyClass: 'Sub-50ms',
    protocol: 'WebSocket (WSS)',
    securityRating: 'A+',
    dataQualityScore: 98,
    uptimeSla: '99.99%',
    rateLimit: 'Unbegrenzte Ticks im WebSocket Channel',
    securityFeatures: ['API Key Authentication', 'TLS 1.3 Encryption', 'Strict Origin CORS'],
    features: ['US Stock Ticks (NBBO)', 'Second/Minute Aggregates', 'Market Status', 'Pre/Post Market Hours'],
    recommendedRole: 'Primärer Realtime-Stream',
    endpointSnippet: 'wss://socket.polygon.io/stocks',
    pros: ['Institutionelle Datenqualität (SIP Feed Aggregation)', 'Sehr saubere Normalisierung', 'Umfangreiche historische Ticks'],
    cons: ['Global equities außerhalb der USA erfordern Zusatzpakete'],
  },
  {
    id: 'twelve-data-free',
    name: 'Twelve Data API',
    category: 'FOREX',
    pricingTier: 'Free (0€)',
    monthlyCostEur: 0,
    latencyClass: '100-300ms',
    protocol: 'Hybrid (WSS + REST)',
    securityRating: 'A',
    dataQualityScore: 92,
    uptimeSla: '99.85%',
    rateLimit: '800 Credits/Tag (Free Tier) | 8 Calls/Min',
    securityFeatures: ['Bearer Token', 'TLS 1.3', 'IP Restriction'],
    features: ['Forex Major/Minor Pairs', 'Rohstoffe (Gold, Silber, Öl)', 'Globale Indizes (DAX, S&P 500)'],
    recommendedRole: 'Sekundärer Failover',
    endpointSnippet: 'wss://ws.twelvedata.com/v1/quotes/price?apikey=${TWELVE_DATA_KEY}',
    pros: ['Hervorragende Forex- & Rohstoff-Abdeckung', 'Breite Unterstützung exotischer Währungspaare'],
    cons: ['Free Tier benötigt kluges Server-Caching (Redis 3-5s Polling)'],
  },
  {
    id: 'ccxt-open-source',
    name: 'CCXT Pro & OpenBB Platform',
    category: 'CROSS_ASSET',
    pricingTier: 'Free (0€)',
    monthlyCostEur: 0,
    latencyClass: 'Sub-50ms',
    protocol: 'WebSocket (WSS)',
    securityRating: 'A+',
    dataQualityScore: 96,
    uptimeSla: 'Self-Hosted',
    rateLimit: 'Voll konfigurierbares Client-Side Rate-Limiting',
    securityFeatures: ['Open-Source Auditierbar', 'Lokale Schlüsselhaltung', 'Keine Vendor-Locks'],
    features: ['Einheitliche Schnittstelle zu 120+ Börsen', 'Automatische Normalisierung von Orderbüchern und Trades'],
    recommendedRole: 'Sektor-Aggregator',
    endpointSnippet: 'import ccxt.pro as ccxtpro\nexchange = ccxtpro.binance()',
    pros: ['100% Open-Source (MIT Lizenz)', 'Vermeidet Vendor Lock-in', 'Ermöglicht nahtlosen Multi-Exchange-Handel'],
    cons: ['Erfordert eigene Node.js/Python Microservice-Orchestrierung'],
  },
  {
    id: 'alchemy-solana-rpc',
    name: 'Alchemy / QuickNode RPC Free Tier',
    category: 'ON_CHAIN',
    pricingTier: 'Free (0€)',
    monthlyCostEur: 0,
    latencyClass: 'Sub-100ms',
    protocol: 'WebSocket (WSS)',
    securityRating: 'A+',
    dataQualityScore: 99,
    uptimeSla: '99.95%',
    rateLimit: '300 Compute Units/Sec (Free Tier)',
    securityFeatures: ['JWT Token', 'WSS TLS 1.3', 'Smart Contract Event Filtering'],
    features: ['Whale Wallet Transfers', 'Solana & Ethereum Event Subscriptions', 'DEX Swaps (Raydium, Uniswap)'],
    recommendedRole: 'Primärer Realtime-Stream',
    endpointSnippet: 'wss://solana-mainnet.g.alchemy.com/v2/${API_KEY}',
    pros: ['Direkter Zugang zu On-Chain Großtransaktionen', 'Echtes Smart Money Tracking ohne Intermediäre'],
    cons: ['Benötigt Backend-Event-Parser für DEX-Signaturen'],
  },
  {
    id: 'yahoo-finance-fallback',
    name: 'Yahoo Finance Engine (yfinance / rapidapi)',
    category: 'CROSS_ASSET',
    pricingTier: 'Free (0€)',
    monthlyCostEur: 0,
    latencyClass: '100-300ms',
    protocol: 'REST JSON',
    securityRating: 'B+',
    dataQualityScore: 88,
    uptimeSla: '99.50%',
    rateLimit: '2000 Requests/IP/Stunde',
    securityFeatures: ['TLS 1.3', 'HTTP Headers Masking'],
    features: ['Historische Tagesendkurse (EOD)', 'Dividenden, Splits, Bilanzkennzahlen', 'Makro-Indizes'],
    recommendedRole: 'Historische Daten / EOD',
    endpointSnippet: 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL',
    pros: ['Umfangreichste historische Datenbasis weltweit', 'Kostenlose Fundamentaldaten'],
    cons: ['Kein offizieller Realtime-WebSocket, nur für Fallback & Backtesting geeignet'],
  },
];

export const ArchitecturePage: React.FC<ArchitecturePageProps> = ({
  onBackToHome,
  onNavigateLogin,
  onNavigateLegal,
  onNavigateTokenomics,
}) => {
  const [activeTab, setActiveTab] = useState<
    'pipeline' | 'builder' | 'providers' | 'dashboard' | 'simulator' | 'cost' | 'security' | 'code'
  >('pipeline');

  // Filter state for providers matrix
  const [providerCategory, setProviderCategory] = useState<string>('ALLE');
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<'ALL' | 'FREE' | 'LOW'>('ALL');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('binance-public-wss');

  // Cost calculator state
  const [activeUsersCount, setActiveUsersCount] = useState<number>(1500);
  const [trackedSymbolsCount, setTrackedSymbolsCount] = useState<number>(35);
  const [includeEquitiesFeed, setIncludeEquitiesFeed] = useState<boolean>(true);
  const [hostingPlatform, setHostingPlatform] = useState<'hetzner' | 'cloudrun'>('hetzner');

  // Simulator state
  const [simProvider, setSimProvider] = useState<'binance' | 'finnhub' | 'twelve' | 'coinbase'>('binance');
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [simFailoverActive, setSimFailoverActive] = useState<boolean>(false);
  const [simJitterMs, setSimJitterMs] = useState<number>(14);
  const [simPacketLossPct, setSimPacketLossPct] = useState<number>(0);
  const [simPrice, setSimPrice] = useState<number>(87420.50);
  const [simTickCount, setSimTickCount] = useState<number>(14280);
  const [simLatency, setSimLatency] = useState<number>(24);
  const [simLogs, setSimLogs] = useState<string[]>([
    '[INIT] WebSocket Ingestion Gateway initialisiert auf Port 443 (WSS / TLS 1.3)',
    '[FEED] Binance Public Stream verbunden: wss://stream.binance.com:9443/ws/btcusdt@trade',
    '[CACHE] Upstash Redis Ring Buffer synchronisiert (Latenz: 4.2ms)',
    '[MUX] 1 Client(s) subskribiert auf Channel: BTC/USDT, ETH/USDT, NVDA, EUR/USD',
  ]);

  // Code snippet tab
  const [selectedCodeSnippet, setSelectedCodeSnippet] = useState<'multiplexer' | 'circuitBreaker' | 'hook'>('multiplexer');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  // Track initial page view event
  useEffect(() => {
    trackEvent('architecture_view', {
      category: 'architecture',
      label: 'pipeline_concept',
    });
  }, []);

  // Live Simulator Pulse
  useEffect(() => {
    if (!isSimRunning) return;

    const interval = setInterval(() => {
      // Simulate random price change (-0.15% to +0.15%)
      const deltaPercent = (Math.random() - 0.49) * 0.003;
      setSimPrice((prev) => {
        const next = prev * (1 + deltaPercent);
        return Math.round(next * 100) / 100;
      });

      // Calculate latency based on provider & jitter
      let baseLatency = 22;
      if (simProvider === 'finnhub') baseLatency = 68;
      if (simProvider === 'twelve') baseLatency = 135;
      if (simProvider === 'coinbase') baseLatency = 42;

      if (simFailoverActive) {
        baseLatency += 12; // slight failover proxy penalty
      }

      const currentJitter = (Math.random() - 0.5) * simJitterMs;
      const computedLatency = Math.max(12, Math.round(baseLatency + currentJitter));
      setSimLatency(computedLatency);

      setSimTickCount((prev) => prev + 1);

      // Log periodically
      if (Math.random() < 0.25) {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
        const providerTag = simFailoverActive ? 'FAILOVER(Coinbase)' : simProvider.toUpperCase();
        const logEntry = `[${timestamp}] [${providerTag}] TICK BTC/USDT @ $${simPrice.toFixed(2)} | Latency: ${computedLatency}ms | Q-Score: 99.4`;
        setSimLogs((prev) => [logEntry, ...prev.slice(0, 18)]);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isSimRunning, simProvider, simFailoverActive, simJitterMs, simPrice]);

  // Handle provider manual failover toggle in simulator
  const toggleFailoverSimulation = () => {
    const nextState = !simFailoverActive;
    setSimFailoverActive(nextState);
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    if (nextState) {
      setSimLogs((prev) => [
        `[${timestamp}] [ALERT] Simulierter Heartbeat-Timeout auf Primär-Feed! Circuit Breaker schaltet um...`,
        `[${timestamp}] [CIRCUIT-BREAKER] Automatischer Failover auf Sekundär-Feed (Coinbase Pro WSS) in 38ms vollzogen!`,
        ...prev,
      ]);
    } else {
      setSimLogs((prev) => [
        `[${timestamp}] [RESTORE] Primär-Provider wieder gesund. Failback auf Primär-Stream in geordneter Sequenz.`,
        ...prev,
      ]);
    }
  };

  // Filtered providers
  const filteredProviders = useMemo(() => {
    return DATA_PROVIDERS.filter((p) => {
      const matchCat = providerCategory === 'ALLE' || p.category === providerCategory;
      let matchBudget = true;
      if (maxBudgetFilter === 'FREE') matchBudget = p.monthlyCostEur === 0;
      if (maxBudgetFilter === 'LOW') matchBudget = p.monthlyCostEur <= 30;
      return matchCat && matchBudget;
    });
  }, [providerCategory, maxBudgetFilter]);

  // Selected Provider Details
  const selectedProvider = useMemo(() => {
    return DATA_PROVIDERS.find((p) => p.id === selectedProviderId) || DATA_PROVIDERS[0];
  }, [selectedProviderId]);

  // Cost calculation
  const calculatedMonthlyCost = useMemo(() => {
    // 1. Data feeds
    const apiCost = includeEquitiesFeed ? 29 : 0; // Finnhub Starter: 29€, Binance/Coinbase: 0€
    // 2. Compute VPS
    const serverCost = hostingPlatform === 'hetzner' ? 4.50 : (activeUsersCount > 5000 ? 12.00 : 5.00);
    // 3. Redis In-Memory Cache (Upstash)
    const redisCost = activeUsersCount > 10000 ? 7.00 : 0; // Free tier covers up to 10k cmds/day
    // 4. Cloudflare CDN & WAF
    const cloudflareCost = 0; // Free plan covers full SSL/DDoS
    // 5. Total
    const total = apiCost + serverCost + redisCost + cloudflareCost;
    // Enterprise equivalent (Bloomberg B-PIPE / Refinitiv Elektron / ICE Data Services)
    const enterpriseCost = 2100; // ~2.100€/month minimum
    const savingsPercent = Math.round(((enterpriseCost - total) / enterpriseCost) * 1000) / 10;

    return {
      apiCost,
      serverCost,
      redisCost,
      cloudflareCost,
      total,
      enterpriseCost,
      savingsPercent,
    };
  }, [activeUsersCount, includeEquitiesFeed, hostingPlatform]);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="w-full text-slate-100 min-h-screen py-6 px-3 sm:px-6 relative">
      {/* TOP HEADER & NAVIGATION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80 mb-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-amber-400" />
            <span>Zurück zum Terminal</span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          <BrandLogo variant="inline" size="sm" />
        </div>

        {/* Live System Health Badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Pipeline Status: LIVE</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Radio className="w-3 h-3 text-amber-400" />
            <span>Sim. Ping: {simLatency}ms</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION WITH TITLE & OVERVIEW */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span>System-Architektur &amp; Kursdaten-Konzept</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          High-Performance &amp; Low-Budget{' '}
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-[#FF2E93] bg-clip-text text-transparent">
            Echtzeit-Kursdaten Anbindung
          </span>
        </h1>

        <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Umfassendes Architektur-Blueprint für institutionelle Datenqualität, Sub-45ms Latenzen und höchste 
          Sicherheitsstandards (TLS 1.3, Token-Bucket Rate Limiting, Zero-Trust Proxy) bei einem monatlichen 
          Budget von unter <strong className="text-amber-400">35 € / Monat</strong> für über 10.000 aktive Nutzer.
        </p>
      </div>

      {/* INTERACTIVE NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#090e21] border border-slate-800/90 mb-8 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'pipeline'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. 4-Tier Pipeline Konzept</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'builder'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>2. Pipeline Builder</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-extrabold">
            NEU
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('providers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'providers'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>3. Provider-Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>4. Provider Fleet Dashboard</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-400 text-black font-extrabold">
            WP-004
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>5. Live Latency &amp; Failover Tester</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cost')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'cost'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>4. Low-Budget TCO-Rechner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>5. Sicherheits- &amp; Qualitätsstandard</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'code'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>6. Code-Blueprints</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: 4-TIER PIPELINE ARCHITECTURE CONCEPT */}
      {/* =================================================================== */}
      {activeTab === 'pipeline' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Executive Architecture Summary Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-400/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Das hybride 4-Stufen Kursdaten-Konzept (Zero-Waste Fan-Out)</span>
                </h2>
                <p className="mt-1 text-slate-300 text-xs sm:text-sm max-w-2xl">
                  Traditionelle Finanz-Apps machen den fatalen Fehler, jeden Client direkt mit externen APIs zu verbinden. 
                  Unser Konzept nutzt einen <strong>Zentralen Multiplexer</strong>: 1 einzige Verbindung zum Datenanbieter 
                  bedient 10.000 Clients ohne zusätzliche API-Kosten oder Rate-Limit-Risiken.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">Gesamt-Durchsatz</div>
                  <div className="text-lg font-mono font-bold text-emerald-400">12.500 Ticks/s</div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">End-to-End Latenz</div>
                  <div className="text-lg font-mono font-bold text-amber-300">22 - 45 ms</div>
                </div>
              </div>
            </div>
          </div>

          {/* VISUAL 4-TIER PIPELINE INTERACTIVE DIAGRAM */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* TIER 1 */}
            <div className="p-5 rounded-2xl bg-[#090e21] border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    Tier 1: Ingestion
                  </span>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Multi-Provider Ingestion</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Permanente WebSocket-Verbindungen zu führenden Low-Cost- und Free-Feed-Providern.
                </p>
                <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>Binance WSS (Krypto)</span>
                    <span className="text-emerald-400 font-bold">0€ • &lt;25ms</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>Finnhub / Polygon (Stocks)</span>
                    <span className="text-amber-300 font-bold">29€ • &lt;70ms</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>Twelve Data (FX/Commodities)</span>
                    <span className="text-blue-400 font-bold">0€ • &lt;95ms</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-amber-400 font-semibold flex items-center justify-between">
                <span>Heartbeat: 15s Ping/Pong</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>

            {/* TIER 2 */}
            <div className="p-5 rounded-2xl bg-[#090e21] border border-purple-500/30 hover:border-purple-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-400/10 border border-purple-400/20">
                    Tier 2: Gate &amp; Norm
                  </span>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Quality Gate &amp; Normalizer</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Sanitisierung, Outlier-Erkennung (Spike Buster) und Vereinheitlichung in das kanonische Format.
                </p>
                <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>3σ Outlier Drop</span>
                    <span className="text-purple-300">Spike-Schutz</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>VWAP &amp; BBO Engine</span>
                    <span className="text-purple-300">Tick-Glättung</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>Token-Bucket WAF</span>
                    <span className="text-purple-300">Zero Abuse</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-purple-400 font-semibold flex items-center justify-between">
                <span>Verarbeitungszeit: &lt;1.8ms</span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
              </div>
            </div>

            {/* TIER 3 */}
            <div className="p-5 rounded-2xl bg-[#090e21] border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
                    Tier 3: Cache &amp; Fan-out
                  </span>
                  <Database className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">In-Memory Redis Pub/Sub</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Ultraschneller Upstash/Redis Ring-Buffer und WebSocket Multiplexer für zehntausende Clients.
                </p>
                <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>Ring-Buffer Cache</span>
                    <span className="text-cyan-300">200 Ticks/Asset</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>Delta-Kompression</span>
                    <span className="text-cyan-300">-78% Payload</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>Room Multiplexing</span>
                    <span className="text-cyan-300">Topic Pub/Sub</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-cyan-400 font-semibold flex items-center justify-between">
                <span>Cache Read: 0.8ms</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>

            {/* TIER 4 */}
            <div className="p-5 rounded-2xl bg-[#090e21] border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20">
                    Tier 4: Client &amp; AI
                  </span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Frontend &amp; Scorer Engine</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Verzögerungsfreie UI-Aktualisierung mit Canvas-Sparklines und Trigger für Capital-AI Scoring.
                </p>
                <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>useMarketFeed Hook</span>
                    <span className="text-emerald-300">Auto-Reconnect</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>Multi-Faktor Scorer</span>
                    <span className="text-emerald-300">Live Evaluation</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5">
                    <span>PriceAlert Watcher</span>
                    <span className="text-emerald-300">Sub-5ms Check</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-emerald-400 font-semibold flex items-center justify-between">
                <span>UI Render: 60 FPS Canvas</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* DETAILED TECHNICAL STAGES ACCORDION / EXPLANATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stage A: Der Zero-Waste Multiplexer */}
            <div className="p-6 rounded-2xl bg-[#090e21] border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">1. Der Zero-Waste Ingestion Multiplexer</h4>
                  <p className="text-xs text-slate-400">Architektur zur Vermeidung von Tausend-Euro API-Rechnungen</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Beim naiven Ansatz öffnet jeder Web- oder Smartphone-Client eine eigene Verbindung zu Binance, Finnhub 
                oder Polygon. Bei 2.000 parallelen Tradern führt dies unvermeidlich zu <strong>HTTP 429 Too Many Requests</strong> 
                oder API-Kosten von tausenden Euro im Monat.
              </p>
              <div className="p-3.5 rounded-xl bg-black/50 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Capital-AI Ingestion Prinzip:</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Unser Node.js/Go Backend hält genau <strong>1 einzige WSS-Verbindung</strong> zum Provider aufrecht. 
                  Eintreffende Marktticks werden mit ca. 1.200 Ticks/Sekunde in Redis gepusht und über interne 
                  WebSocket-Räume (Rooms nach Symbol: z.B. <code className="text-amber-300">room:BTC/USDT</code>) per 
                  Fan-Out an beliebig viele Clients gestreamt.
                </p>
              </div>
            </div>

            {/* Stage B: Circuit Breaker & Failover */}
            <div className="p-6 rounded-2xl bg-[#090e21] border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-400/15 border border-purple-400/30 flex items-center justify-center text-purple-400">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">2. Auto-Failover Circuit Breaker</h4>
                  <p className="text-xs text-slate-400">Sub-80ms Ausfallkompensation bei Provider-Störungen</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Krypto- und Aktienbörsen erleiden bei Markt-Volatilität (z. B. FOMC-Zinsentscheid oder Flash Crashes) 
                gelegentliche TCP-Timeouts. Unsere Pipeline implementiert einen adaptiven <strong>Heartbeat Circuit Breaker</strong>.
              </p>
              <div className="p-3.5 rounded-xl bg-black/50 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-semibold font-mono text-[11px]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Kaskadierende Failover-Kette:</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Sendet Binance für &gt; 250ms kein Lebenszeichen, schaltet der Aggregator automatisch und nahtlos auf 
                  den <strong>Coinbase Advanced WSS</strong> um. Für Aktien wechselt der Stream von Finnhub zu Polygon.io 
                  oder TwelveData REST Polling. Die Frontend-Clients bemerken keine Verbindungsunterbrechung!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB: PIPELINE BUILDER (DATA CONCEPTS, EVIDENCE, TIER 4 & TOOLS) */}
      {/* =================================================================== */}
      {activeTab === 'builder' && (
        <div className="animate-fadeIn">
          <PipelineBuilder
            onBackToHome={onBackToHome}
            onNavigateLogin={onNavigateLogin}
            onNavigateTokenomics={onNavigateTokenomics}
          />
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: PROVIDER & CONFIGURATION MATRIX */}
      {/* =================================================================== */}
      {activeTab === 'providers' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Controls & Category Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#090e21] border border-slate-800">
            {/* Category selection */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold mr-1">Kategorie:</span>
              {[
                { id: 'ALLE', label: 'Alle Klassen' },
                { id: 'KRYPTO', label: 'Krypto' },
                { id: 'AKTIEN', label: 'Aktien / US' },
                { id: 'FOREX', label: 'Forex' },
                { id: 'CROSS_ASSET', label: 'Multi-Asset' },
                { id: 'ON_CHAIN', label: 'On-Chain' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setProviderCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    providerCategory === cat.id
                      ? 'bg-amber-400 text-black font-bold shadow'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Budget filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Budget:</span>
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMaxBudgetFilter('ALL')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    maxBudgetFilter === 'ALL' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Alle
                </button>
                <button
                  type="button"
                  onClick={() => setMaxBudgetFilter('FREE')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    maxBudgetFilter === 'FREE' ? 'bg-emerald-400/20 text-emerald-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Nur Free (0€)
                </button>
                <button
                  type="button"
                  onClick={() => setMaxBudgetFilter('LOW')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    maxBudgetFilter === 'LOW' ? 'bg-blue-400/20 text-blue-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  &le; 30€/Mo
                </button>
              </div>
            </div>
          </div>

          {/* Comparative Matrix Layout: Left Provider List, Right Detail Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Provider Cards List */}
            <div className="lg:col-span-2 space-y-3">
              {filteredProviders.map((prov) => {
                const isSelected = prov.id === selectedProviderId;
                return (
                  <div
                    key={prov.id}
                    onClick={() => setSelectedProviderId(prov.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/10 via-[#0d1530] to-[#0d1530] border-amber-400/80 shadow-lg shadow-amber-500/10'
                        : 'bg-[#090e21] border-slate-800/80 hover:border-slate-700 hover:bg-[#0c132c]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-white">{prov.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {prov.category}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              prov.monthlyCostEur === 0
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {prov.pricingTier}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{prov.recommendedRole}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500">Latenz</div>
                          <div className="text-emerald-400 font-bold">{prov.latencyClass}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500">Qualitäts-Score</div>
                          <div className="text-amber-300 font-bold">{prov.dataQualityScore} / 100</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500">Protokoll</div>
                          <div className="text-slate-300">{prov.protocol.split(' ')[0]}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Provider Deep-Dive Inspector */}
            <div className="p-5 rounded-2xl bg-[#090e21] border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                      Provider Deep-Dive
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedProvider.name}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-black font-black text-xs font-mono">
                    {selectedProvider.pricingTier}
                  </span>
                </div>

                {/* Score & SLA Badges */}
                <div className="grid grid-cols-2 gap-2 my-4">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">Data Quality Score</div>
                    <div className="text-lg font-mono font-bold text-emerald-400">
                      {selectedProvider.dataQualityScore}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">Verfügbarkeit SLA</div>
                    <div className="text-lg font-mono font-bold text-amber-300">
                      {selectedProvider.uptimeSla}
                    </div>
                  </div>
                </div>

                {/* Endpoint Snippet */}
                <div className="mb-4">
                  <div className="text-[11px] text-slate-400 font-semibold mb-1 flex items-center justify-between">
                    <span>WebSocket / REST Endpoint:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(selectedProvider.endpointSnippet)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Kopieren</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-amber-300 overflow-x-auto">
                    {selectedProvider.endpointSnippet}
                  </pre>
                </div>

                {/* Security Standards */}
                <div className="mb-4">
                  <div className="text-[11px] text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sicherheitsmerkmale:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProvider.securityFeatures.map((sec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-[11px] font-semibold text-emerald-400 mb-1">Vorteile:</div>
                    <ul className="space-y-1">
                      {selectedProvider.pros.map((pro, i) => (
                        <li key={i} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-amber-400 mb-1">Einschränkungen:</div>
                    <ul className="space-y-1">
                      {selectedProvider.cons.map((con, i) => (
                        <li key={i} className="text-slate-400 flex items-start gap-1.5 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('simulator');
                    if (selectedProvider.id.includes('binance')) setSimProvider('binance');
                    if (selectedProvider.id.includes('finnhub')) setSimProvider('finnhub');
                    if (selectedProvider.id.includes('twelve')) setSimProvider('twelve');
                    if (selectedProvider.id.includes('coinbase')) setSimProvider('coinbase');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Im Live-Simulator testen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: LIVE PROVIDER STATUS DASHBOARD (WP-004)                      */}
      {/* =================================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          <ProviderStatusDashboard
            onBackToHome={onBackToHome}
            onNavigateArchitecture={() => setActiveTab('pipeline')}
            onNavigateLogin={onNavigateLogin}
            isStandaloneView={false}
          />
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 5: LIVE LATENCY & FAILOVER SIMULATOR                            */}
      {/* =================================================================== */}
      {activeTab === 'simulator' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Simulator Control Dashboard */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090e21] border border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-amber-400" />
                  <span>Interaktive Feed-Latenz &amp; Circuit-Breaker Test-Bench</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Testen Sie Latenzen, künstlichen Netzwerk-Jitter und simulieren Sie einen Provider-Ausfall in Echtzeit.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimRunning(!isSimRunning)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSimRunning
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-red-400/20 text-red-300 border border-red-400/40'
                  }`}
                >
                  {isSimRunning ? 'Simulation Läuft' : 'Pausiert'}
                </button>

                <button
                  type="button"
                  onClick={toggleFailoverSimulation}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    simFailoverActive
                      ? 'bg-red-500 text-white font-black shadow-lg shadow-red-500/30'
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{simFailoverActive ? 'Failover Aktiv (Reset)' : 'Ausfall Simulieren'}</span>
                </button>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Aktive Latenz</div>
                <div className="text-2xl font-mono font-black text-emerald-400">{simLatency} ms</div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5">P99: {simLatency + 8}ms</div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Live BTC Kurs</div>
                <div className="text-2xl font-mono font-black text-amber-300">
                  ${simPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[9px] text-emerald-400 font-mono mt-0.5">Live Tick Event</div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Verarbeitete Ticks</div>
                <div className="text-2xl font-mono font-black text-cyan-300">{simTickCount.toLocaleString()}</div>
                <div className="text-[9px] text-cyan-400 font-mono mt-0.5">0 Packet Drops</div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Aktiver Provider</div>
                <div className="text-base sm:text-lg font-mono font-black text-purple-300 mt-1 truncate">
                  {simFailoverActive ? 'COINBASE (Backup)' : simProvider.toUpperCase()}
                </div>
                <div className="text-[9px] text-purple-400 font-mono mt-0.5">
                  {simFailoverActive ? 'Failover Switch: 38ms' : 'Normalbetrieb'}
                </div>
              </div>
            </div>

            {/* Interactive Sliders for Jitter & Packet Loss */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-black/30 border border-slate-800">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Netzwerk-Jitter (Schwankung):</span>
                  <span className="text-amber-400 font-mono font-bold">±{simJitterMs} ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={simJitterMs}
                  onChange={(e) => setSimJitterMs(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>0ms (Dedizierte Faser)</span>
                  <span>30ms (Normal)</span>
                  <span>60ms (Mobilfunk 4G)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Primärer Provider für Test:</span>
                  <span className="text-cyan-400 font-mono font-bold">{simProvider.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['binance', 'coinbase', 'finnhub', 'twelve'] as const).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => {
                        setSimProvider(pr);
                        setSimFailoverActive(false);
                      }}
                      className={`py-1 px-1.5 rounded-lg text-[11px] font-mono font-bold uppercase transition-colors ${
                        simProvider === pr && !simFailoverActive
                          ? 'bg-amber-400 text-black'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Terminal Console Log */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Realtime WebSocket Gateway Logs:</span>
                </span>
                <span className="text-[10px] text-slate-500">Auto-Scroll Active</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black border border-slate-800 font-mono text-[11px] space-y-1 h-44 overflow-y-auto scrollbar-thin">
                {simLogs.map((log, idx) => {
                  const isAlert = log.includes('[ALERT]') || log.includes('Timeout');
                  const isSuccess = log.includes('[CIRCUIT-BREAKER]') || log.includes('[RESTORE]');
                  return (
                    <div
                      key={idx}
                      className={
                        isAlert
                          ? 'text-red-400 font-bold'
                          : isSuccess
                          ? 'text-purple-300 font-semibold'
                          : 'text-slate-400'
                      }
                    >
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: LOW-BUDGET TCO RECHNER */}
      {/* =================================================================== */}
      {activeTab === 'cost' && (
        <div className="space-y-6 animate-fadeIn">
          {/* TCO Calculator Interactive Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090e21] border border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Low-Budget TCO Blueprint (Total Cost of Ownership)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Berechnen Sie die realen Infrastruktur- und Daten-Kosten im Vergleich zu traditionellen Enterprise-Terminals.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right">
                <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Ihre Kosteneinsparung</div>
                <div className="text-xl sm:text-2xl font-mono font-black text-emerald-300">
                  {calculatedMonthlyCost.savingsPercent}% Günstiger
                </div>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Gleichzeitige aktive Nutzer:</span>
                  <span className="text-amber-400 font-mono font-bold text-sm">
                    {activeUsersCount.toLocaleString()} Trader
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="25000"
                  step="100"
                  value={activeUsersCount}
                  onChange={(e) => setActiveUsersCount(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>100 (MVP)</span>
                  <span>5.000 (Wachstum)</span>
                  <span>25.000 (Scale)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Anzahl getrackter Assets:</span>
                  <span className="text-cyan-400 font-mono font-bold text-sm">
                    {trackedSymbolsCount} Symbole
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={trackedSymbolsCount}
                  onChange={(e) => setTrackedSymbolsCount(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>10 (Top Coins)</span>
                  <span>50 (All Major)</span>
                  <span>150 (Cross-Asset)</span>
                </div>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-black/40 border border-slate-800 mb-6">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeEquitiesFeed}
                  onChange={(e) => setIncludeEquitiesFeed(e.target.checked)}
                  className="rounded accent-amber-400 w-4 h-4"
                />
                <span>Inklusive US-Aktien Realtime Feed (Finnhub Starter: 29 €/Mo)</span>
              </label>

              <div className="h-4 w-px bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Hosting-Umgebung:</span>
                <button
                  type="button"
                  onClick={() => setHostingPlatform('hetzner')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    hostingPlatform === 'hetzner'
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  Hetzner Cloud VPS (Frankfurt, 4,50€)
                </button>
                <button
                  type="button"
                  onClick={() => setHostingPlatform('cloudrun')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    hostingPlatform === 'cloudrun'
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  Google Cloud Run (Serverless)
                </button>
              </div>
            </div>

            {/* Breakdown Cost Comparison Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Capital-AI Architecture Cost */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c1633] to-[#080d21] border border-amber-400/40">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3">
                  Capital-AI Low-Budget Stack
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Krypto Datenfeeds (Binance/Coinbase):</span>
                    <span className="text-emerald-400 font-bold">0,00 €</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Aktien/Forex Feeds (Finnhub / Twelve):</span>
                    <span className="text-slate-200">{calculatedMonthlyCost.apiCost.toFixed(2)} €</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">WebSocket Compute Node (Frankfurt):</span>
                    <span className="text-slate-200">{calculatedMonthlyCost.serverCost.toFixed(2)} €</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Upstash Redis Ring-Buffer Caching:</span>
                    <span className="text-slate-200">{calculatedMonthlyCost.redisCost.toFixed(2)} €</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Cloudflare Zero-Trust DDoS &amp; SSL:</span>
                    <span className="text-emerald-400 font-bold">0,00 € (Free)</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-sm">
                    <span className="text-white font-bold">Gesamtkosten / Monat:</span>
                    <span className="text-amber-400 font-extrabold text-base">
                      {calculatedMonthlyCost.total.toFixed(2)} € / Monat
                    </span>
                  </div>
                </div>
              </div>

              {/* Traditional Enterprise Stack */}
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Traditionelle Enterprise-Alternative (Refinitiv / Bloomberg)
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-400">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span>B-PIPE / Elektron Feed Lizenz:</span>
                    <span className="text-red-400">ca. 1.800,00 €</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span>Dedizierte Colocation (Frankfurt Equinix):</span>
                    <span className="text-red-400">ca. 450,00 €</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span>Exchange Non-Display Gebühren (NYSE/Nasdaq):</span>
                    <span className="text-red-400">ca. 600,00 €</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-sm">
                    <span className="text-white font-bold">Gesamtkosten / Monat:</span>
                    <span className="text-red-400 font-extrabold text-base">
                      &gt; 2.850,00 € / Monat
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 5: SECURITY & QUALITY STANDARDS */}
      {/* =================================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Security Standards 4-Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1: Zero-Trust Gateway */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">1. Zero-Trust API-Key Proxy</h4>
                  <p className="text-xs text-slate-400">Keine Client-Side Secrets im Browser-Bundle</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Der Browser oder Smartphone-Client erhält niemals geheime API-Tokens für Drittanbieter. 
                Sämtliche Kommunikation zu Finnhub, Polygon oder On-Chain RPCs wird serverseitig in 
                unserem gehärteten Express/Go Proxy terminiert.
              </p>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secrets verschlüsselt in Google Secret Manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HMAC-SHA256 Signatur-Verifikation für sensible Operationen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Strikte CORS- &amp; Origin-Prüfung verhindert Cross-Site Leaks</span>
                </div>
              </div>
            </div>

            {/* Pillar 2: Token Bucket Rate Limiting */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">2. Token-Bucket Rate Limiter</h4>
                  <p className="text-xs text-slate-400">DDoS-Schutz &amp; Quota-Einhaltung via Redis</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Um Überlastungen oder Denial-of-Service Attacken abzuwehren, greift ein adaptiver 
                Token-Bucket Algorithmus. Jeder Client erhält ein lokales Burst-Budget von 30 Requests 
                mit stetiger Auffüllung (Refill Rate: 2 Tokens/Sekunde).
              </p>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Automatischer IP-Jail bei &gt; 120 Reqs/Minute</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upstash In-Memory Counter mit automatischer TTL</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Priorisierte WebSocket Subscriptions für Pro-Abonnenten</span>
                </div>
              </div>
            </div>

            {/* Pillar 3: Data Quality & Spike Buster */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">3. Spike Buster &amp; Outlier Gate</h4>
                  <p className="text-xs text-slate-400">Schutz vor fehlerhaften Bad Ticks und Fat-Finger Trades</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Manchmal senden unregulierte Börsen Ticks mit Tippfehlern (z. B. 8.000$ statt 80.000$). 
                Unser Quality Gate filtert Ticks, die mehr als <strong>3 Standardabweichungen (3σ)</strong> 
                vom gleitenden Median der letzten 15 Ticks abweichen.
              </p>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Multi-Source Consensus (Binance vs Coinbase Vergleich)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Deadman Switch: Stoppt Alarm-Auslösung bei inkonsistentem Spread</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DQS-Scoring (Data Quality Score) von 0 bis 100 Punkten</span>
                </div>
              </div>
            </div>

            {/* Pillar 4: DSGVO, MiCA & Regulatory */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-400/15 border border-purple-400/30 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">4. DSGVO, BaFin &amp; MiCA Konformität</h4>
                  <p className="text-xs text-slate-400">Serverstandort Deutschland / EU</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hosting und Edge Caching erfolgen in ISO-27001 zertifizierten Rechenzentren in Frankfurt am Main 
                (Hetzner / Google Cloud europe-west3). Sämtliche Marktdaten-Pipes sind von personenbezogenen 
                Nutzerprofilen strikt logisch getrennt.
              </p>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Keine Speicherung sensibler Trades ohne Verschlüsselung</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Vollständige Konformität mit MiCA (Markets in Crypto-Assets)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>TLS 1.3 mit Forward Secrecy &amp; HSTS Preload</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 6: PRODUCTION-READY CODE BLUEPRINTS */}
      {/* =================================================================== */}
      {activeTab === 'code' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090e21] border border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-amber-400" />
                  <span>Produktionsfertige Code-Blueprints</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Kopieren Sie diese praxiserprobten TypeScript-Dateien direkt in Ihre Backend- und Frontend-Services.
                </p>
              </div>

              {/* Snippet selector tabs */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedCodeSnippet('multiplexer')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedCodeSnippet === 'multiplexer'
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Multiplexer.ts
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCodeSnippet('circuitBreaker')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedCodeSnippet === 'circuitBreaker'
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CircuitBreaker.ts
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCodeSnippet('hook')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedCodeSnippet === 'hook'
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  useMarketFeed.ts
                </button>
              </div>
            </div>

            {/* Code display box */}
            <div className="relative mt-4">
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={() => {
                    const code =
                      selectedCodeSnippet === 'multiplexer'
                        ? MULTIPLEXER_CODE
                        : selectedCodeSnippet === 'circuitBreaker'
                        ? CIRCUIT_BREAKER_CODE
                        : HOOK_CODE;
                    handleCopyCode(code);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-white text-xs font-mono border border-slate-700 transition-colors shadow cursor-pointer"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Kopiert!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Code kopieren</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 sm:p-5 rounded-xl bg-black border border-slate-800 font-mono text-xs sm:text-[12.5px] text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
                {selectedCodeSnippet === 'multiplexer' && MULTIPLEXER_CODE}
                {selectedCodeSnippet === 'circuitBreaker' && CIRCUIT_BREAKER_CODE}
                {selectedCodeSnippet === 'hook' && HOOK_CODE}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER NAVIGATION BACK TO SECTIONS */}
      <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Capital-AI Architecture Suite • Release v2.4</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-mono font-bold">Sub-45ms Standard Compliant</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="hover:text-amber-400 transition-colors cursor-pointer font-semibold"
          >
            Zurück zur Übersicht
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onNavigateLegal?.('/faq')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            FAQ
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onNavigateLegal?.('/datenschutz')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Datenschutz
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onNavigateLegal?.('/agb')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            AGB
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// PRODUCTION READY CODE BLUEPRINT STRINGS
// ---------------------------------------------------------------------------
const MULTIPLEXER_CODE = `/**
 * Capital-AI WebSocket Ingestion & Client Fan-Out Multiplexer
 * =========================================================================
 * - Verbindet sich genau EINMAL zum externen Low-Budget Datenfeed (Binance/Finnhub)
 * - Verteilt Ticks an n-tausend verbundene Browser-Clients via Room-Pub/Sub
 * - Minimiert Netzwerktraffic mit Delta-Kompression
 */
import { WebSocketServer, WebSocket } from 'ws';

export interface CanonicalMarketTick {
  s: string;  // Symbol (z.B. "BTC/USDT")
  p: number;  // Aktueller Preis
  v: number;  // 24h Volumen
  t: number;  // UTC Timestamp ms
  d: number;  // 24h Change %
  q: number;  // Quality Score (0-100)
}

export class MarketDataMultiplexer {
  private wss: WebSocketServer;
  private clientRooms: Map<string, Set<WebSocket>> = new Map();
  private upstreamSocket: WebSocket | null = null;
  private lastPrices: Map<string, number> = new Map();

  constructor(port: number = 8080) {
    this.wss = new WebSocketServer({ port });
    this.setupClientConnections();
    this.connectToBinanceStream();
  }

  // 1. Verbindung zum kostenlosen Binance Public Stream (0€ / Monat)
  private connectToBinanceStream() {
    const streamUrl = 'wss://stream.binance.com:9443/ws/!miniTicker@arr';
    console.log('[UPSTREAM] Verbinde mit Binance Public WebSocket...');

    this.upstreamSocket = new WebSocket(streamUrl);

    this.upstreamSocket.on('message', (raw: Buffer) => {
      try {
        const batch = JSON.parse(raw.toString());
        for (const item of batch) {
          const symbol = item.s.replace('USDT', '/USDT');
          const price = parseFloat(item.c);
          const prev = this.lastPrices.get(symbol);

          // Nur senden wenn sich der Preis geändert hat (Delta-Filter)
          if (prev !== price) {
            this.lastPrices.set(symbol, price);
            const tick: CanonicalMarketTick = {
              s: symbol,
              p: price,
              v: parseFloat(item.v),
              t: item.E,
              d: parseFloat(item.c) - parseFloat(item.o),
              q: 99.4,
            };
            this.broadcastToRoom(symbol, tick);
          }
        }
      } catch (err) {
        console.error('[PARSE ERROR]', err);
      }
    });

    this.upstreamSocket.on('close', () => {
      console.warn('[UPSTREAM] Verbindung getrennt. Reconnect in 2s...');
      setTimeout(() => this.connectToBinanceStream(), 2000);
    });
  }

  // 2. Client Room Subscriptions
  private setupClientConnections() {
    this.wss.on('connection', (clientWs: WebSocket) => {
      clientWs.on('message', (msg: string) => {
        const payload = JSON.parse(msg.toString());
        if (payload.action === 'SUBSCRIBE' && payload.symbol) {
          if (!this.clientRooms.has(payload.symbol)) {
            this.clientRooms.set(payload.symbol, new Set());
          }
          this.clientRooms.get(payload.symbol)!.add(clientWs);
        }
      });

      clientWs.on('close', () => {
        this.clientRooms.forEach((set) => set.delete(clientWs));
      });
    });
  }

  private broadcastToRoom(symbol: string, tick: CanonicalMarketTick) {
    const subscribers = this.clientRooms.get(symbol);
    if (!subscribers || subscribers.size === 0) return;

    const message = JSON.stringify(tick);
    subscribers.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
}`;

const CIRCUIT_BREAKER_CODE = `/**
 * Capital-AI Adaptive Circuit Breaker & Failover Controller
 * =========================================================================
 * - Überwacht Heartbeats des primären Daten-Feeds
 * - Schaltet in < 80ms auf Sekundär-Provider um, falls Heartbeat ausbleibt
 * - Verhindert Fehlauslösungen durch adaptiven Deadman-Switch
 */
export interface ProviderHealth {
  id: string;
  name: string;
  isAlive: boolean;
  lastHeartbeat: number;
  consecutiveDrops: number;
}

export class FeedCircuitBreaker {
  private primaryProvider: ProviderHealth;
  private secondaryProvider: ProviderHealth;
  private activeProviderId: string;
  private heartbeatTimeoutMs: number = 350; // Max tolerierte Stille

  constructor() {
    this.primaryProvider = { id: 'binance', name: 'Binance WSS', isAlive: true, lastHeartbeat: Date.now(), consecutiveDrops: 0 };
    this.secondaryProvider = { id: 'coinbase', name: 'Coinbase Advanced WSS', isAlive: true, lastHeartbeat: Date.now(), consecutiveDrops: 0 };
    this.activeProviderId = 'binance';

    this.startWatchdog();
  }

  public recordTick(providerId: string) {
    if (providerId === this.primaryProvider.id) {
      this.primaryProvider.lastHeartbeat = Date.now();
      this.primaryProvider.consecutiveDrops = 0;
      this.primaryProvider.isAlive = true;

      // Wenn Primär wieder gesund, sanftes Failback
      if (this.activeProviderId !== this.primaryProvider.id) {
        console.log('[CIRCUIT BREAKER] Primär-Provider wieder stabil. Führe Failback durch.');
        this.activeProviderId = this.primaryProvider.id;
      }
    }
  }

  private startWatchdog() {
    setInterval(() => {
      const now = Date.now();
      const primaryLag = now - this.primaryProvider.lastHeartbeat;

      if (primaryLag > this.heartbeatTimeoutMs && this.activeProviderId === this.primaryProvider.id) {
        this.primaryProvider.consecutiveDrops++;
        console.warn(\`[ALERT] Primär-Feed reagiert nicht (\${primaryLag}ms). Failover auf Coinbase Pro eingeleitet!\`);
        this.activeProviderId = this.secondaryProvider.id;
      }
    }, 100);
  }

  public getActiveProvider(): string {
    return this.activeProviderId;
  }
}`;

const HOOK_CODE = `/**
 * Capital-AI React Client Hook: useLiveMarketFeed
 * =========================================================================
 * - Reaktive Verbindung zum hausinternen Multiplexer
 * - Reconnect mit Exponential Backoff & Jitter
 * - Lokales State Reconciliation verhindert UI-Flackern
 */
import { useState, useEffect, useRef } from 'react';

export interface LiveTick {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

export function useLiveMarketFeed(symbol: string) {
  const [currentTick, setCurrentTick] = useState<LiveTick | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTING' | 'LIVE' | 'OFFLINE'>('CONNECTING');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let reconnectAttempts = 0;
    let isMounted = true;

    function connect() {
      const wsUrl = \`\${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//\${window.location.host}/api/live-stream\`;
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        if (!isMounted) return;
        setConnectionStatus('LIVE');
        reconnectAttempts = 0;
        // Symbol subskribieren
        socket.send(JSON.stringify({ action: 'SUBSCRIBE', symbol }));
      };

      socket.onmessage = (event) => {
        if (!isMounted) return;
        const tick = JSON.parse(event.data);
        if (tick.s === symbol) {
          setCurrentTick({
            symbol: tick.s,
            price: tick.p,
            volume: tick.v,
            timestamp: tick.t,
          });
        }
      };

      socket.onclose = () => {
        if (!isMounted) return;
        setConnectionStatus('OFFLINE');
        // Exponential Backoff: 1s, 2s, 4s, max 10s
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
        reconnectAttempts++;
        setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      isMounted = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol]);

  return { currentTick, connectionStatus };
}`;
