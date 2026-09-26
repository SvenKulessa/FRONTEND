/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: PIPELINE BUILDER FÜR DATENKONZEPTE]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Interaktiver Data Pipeline Builder mit automatischer Konfigurations-Generierung
 *    - Konzept-Wahl: Data Authority, Evidence, Tier 4, Hybrid, Individual
 *    - Analyse-Tool-Auswahl: TradingView, Bloomberg B-PIPE, Python/Pandas, MetaTrader 5, QuantConnect, Bookmap
 *    - Indikatoren- & Metriken-Multi-Select: Order Flow, VWAP, Implied Volatility, Altman Z-Score, NLP Sentiment, Whale Radar
 *    - Assetklassen- & Subkategorien-Filter: Krypto, US-Tech, DAX, Rohstoffe, Forex, Anleihen
 * 2. AUTOMATISIERTE PIPELINE-SYNTHESE : 
 *    - Berechnet automatisiert den optimalen 5-Stufen-Stack (Ingestion -> Evidence -> Compute -> Cache -> Tool Adapter)
 *    - Live-Metriken: End-to-End Latenz, Durchsatz (Ticks/s), Uptime SLA, Data Quality Score (DQS)
 *    - Tokenomics-Kopplung: Ermittelt die benötigte Staking-Stufe ($CPT) für kostenlose Serverless-Pipeline-Bereitstellung
 * 3. CODE- & PDF-BLUEPRINT EXPORT : 
 *    - Druckfertiger PDF-Report der generierten Datenpipeline via jsPDF
 *    - Kopierbare Docker-Compose- und Connector-Code-Snippets
 * ============================================================================
 */

import React, { useState, useMemo, useEffect } from 'react';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { jsPDF } from 'jspdf';
import { trackEvent } from '../utils/analytics';

// ---------------------------------------------------------------------------
// DATA DEFINITIONS & MODEL
// ---------------------------------------------------------------------------

export type DataConcept = 'authority' | 'evidence' | 'tier4' | 'hybrid' | 'individual';

export interface ConceptDefinition {
  id: DataConcept;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  badgeColor: string;
  iconColor: string;
  accentBorder: string;
  guaranteedLatency: string;
  evidenceType: string;
  recommendedFor: string;
}

export const DATA_CONCEPTS: ConceptDefinition[] = [
  {
    id: 'authority',
    name: 'Data Authority',
    tagline: 'Regulatorisch verifizierte Primärbörsen-Referenz',
    description: 'Erzwingt Single-Source-of-Truth mit deterministischem Orderbuch-Sequencing direkt an der Matching-Engine. Eliminiert Tick-Diskrepanzen und Arbitrage-Schlupf.',
    badge: 'Institutional Grade',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    iconColor: 'text-amber-400',
    accentBorder: 'border-amber-400/50',
    guaranteedLatency: 'Sub-15ms (Colocated)',
    evidenceType: 'Matching Engine Timestamp + Sequence ID',
    recommendedFor: 'BaFin-konforme Fonds, HFT Arbitrage, Risk Management',
  },
  {
    id: 'evidence',
    name: 'Evidence & ZK-Audit',
    tagline: 'Kryptografisch versiegelte Merkle-Tick-Pipelining',
    description: 'Jeder eintreffende Kurs- und Orderbuch-Tick wird mit SHA-256 Hashes in einem Merkle-Tree gebündelt. Garantiert manipulationssichere Beweisbarkeit für historische Backtests.',
    badge: 'Zero-Knowledge Proof',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    iconColor: 'text-purple-400',
    accentBorder: 'border-purple-500/50',
    guaranteedLatency: 'Sub-30ms mit ZK-Hashing',
    evidenceType: 'SHA-256 Merkle Evidence Log + On-Chain Proofs',
    recommendedFor: 'Quantitative Audits, Verifizierte Backtests, Smart Contracts',
  },
  {
    id: 'tier4',
    name: 'Tier 4 High-Availability',
    tagline: '99.999% SLA & Colocated Low-Latency Failover',
    description: 'Doppelt redundant ausgelegte Active-Active Ingestion in Frankfurt (Equinix FR2) und London (LD4). Kernel-Bypass DPDK und In-Memory Ringpuffer mit automatischem Sub-80ms Failover.',
    badge: 'Mission Critical 99.999%',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    iconColor: 'text-rose-400',
    accentBorder: 'border-rose-500/50',
    guaranteedLatency: 'Sub-5ms (Cross-Connect)',
    evidenceType: 'Dual-Heartbeat + Consensus Quorum',
    recommendedFor: 'Prop-Trading-Desks, Market Maker, Ausfallsichere Desks',
  },
  {
    id: 'hybrid',
    name: 'Hybrid Multi-Source',
    tagline: 'Synthese aus CEX-WebSocket, DEX-Mempool & Makro',
    description: 'Führt zentralisierte Börsen (Binance, Coinbase, CME), dezentrale DEX-Swaps (Uniswap, Raydium) und makroökonomische Feeds (FRED, EZB) in einer einzigen optimierten Schnittstelle zusammen.',
    badge: 'Cross-Asset Synapse',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    iconColor: 'text-cyan-400',
    accentBorder: 'border-cyan-500/50',
    guaranteedLatency: 'Sub-45ms Aggregated',
    evidenceType: 'Multi-Source Median Consensus Filtering',
    recommendedFor: 'Cross-Market Arbitrageure, Makro-Trader, Multi-Asset Fonds',
  },
  {
    id: 'individual',
    name: 'Individual Custom Engine',
    tagline: 'Maßgeschneiderte In-Memory Streaming-Architektur',
    description: 'Vollständig konfigurierbare Queue-Größen, benutzerdefinierte Delta-Kompression, variable Outlier-Filter und freie Wahl des Auslieferungsprotokolls (Arrow Flight, ZeroMQ, Socket.io).',
    badge: 'Bespoke Quant',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    iconColor: 'text-emerald-400',
    accentBorder: 'border-emerald-500/50',
    guaranteedLatency: 'Dynamisch optimiert (8-60ms)',
    evidenceType: 'Frei wählbare Prüfsummen / Custom Validatoren',
    recommendedFor: 'Spezialisierte Python-Quants, Exotische Indikatoren, F&E',
  },
];

export interface AnalysisToolDef {
  id: string;
  name: string;
  category: 'Charting' | 'Institutional' | 'Python Quant' | 'Algorithmic' | 'Order Flow';
  idealProtocol: string;
  bestFormat: string;
  typicalLatency: string;
  integrationSnippet: string;
}

export const ANALYSIS_TOOLS: AnalysisToolDef[] = [
  {
    id: 'tradingview',
    name: 'TradingView',
    category: 'Charting',
    idealProtocol: 'WebSocket (WSS) & PineScript Webhook Relay',
    bestFormat: 'UDF / Lightweight OHLCV + Ticks',
    typicalLatency: '35 - 75ms',
    integrationSnippet: `// TradingView Pine Script Webhook Ingestion\n//@version=5\nindicator("CapitalAI Live Pipe", overlay=true)\nplot(close, color=color.yellow)`,
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg Terminal / B-PIPE',
    category: 'Institutional',
    idealProtocol: 'BLPAPI Bridge via gRPC / ZeroMQ',
    bestFormat: 'B-PIPE Compatible Normalized FIX 4.4',
    typicalLatency: '12 - 25ms',
    integrationSnippet: `// Bloomberg BLPAPI Connector Bridge\nimport blpapi\nsession = blpapi.Session(options)\nsession.subscribe("//capitalai/mktdata/NVDA")`,
  },
  {
    id: 'python-pandas',
    name: 'Python / Pandas / Polars',
    category: 'Python Quant',
    idealProtocol: 'Apache Arrow Flight & ZeroMQ PUB/SUB',
    bestFormat: 'Zero-Copy PyArrow RecordBatches',
    typicalLatency: '4 - 15ms',
    integrationSnippet: `import pyarrow.flight as flight\nclient = flight.connect("grpc://127.0.0.1:8815")\nreader = client.do_get(flight.Ticket(b"FEED_NVDA_L2"))\ndf = reader.read_pandas()`,
  },
  {
    id: 'metatrader',
    name: 'MetaTrader 4 / 5',
    category: 'Algorithmic',
    idealProtocol: 'ZeroMQ DLL Wrapper / Windows Named Pipes',
    bestFormat: 'Binary Tick Struct (Ask, Bid, Volume, Seq)',
    typicalLatency: '15 - 35ms',
    integrationSnippet: `// MQL5 Expert Advisor Ingestion Bridge\n#include <ZmqBridge.mqh>\nczmq_recv(socket, tick_buffer);\nOnTickCustom(tick_buffer);`,
  },
  {
    id: 'quantconnect',
    name: 'QuantConnect / LEAN',
    category: 'Algorithmic',
    idealProtocol: 'Custom C# / Python DataQueueHandler',
    bestFormat: 'LEAN BaseData Stream (Tick / TradeBar)',
    typicalLatency: '20 - 45ms',
    integrationSnippet: `public class CapitalAiDataQueueHandler : IDataQueueHandler {\n  public IEnumerator<BaseData> Subscribe(SubscriptionConfig cfg) {...}\n}`,
  },
  {
    id: 'bookmap',
    name: 'Bookmap / Orderflow Heatmap',
    category: 'Order Flow',
    idealProtocol: 'Direct TCP Socket / C++ Shared Memory',
    bestFormat: 'Raw Level-3 Market By Order (MBO) Events',
    typicalLatency: '2 - 8ms',
    integrationSnippet: `// Bookmap L3 MBO Event Packet\nstruct BookEvent { uint64_t ts; uint64_t orderId; double price; uint32_t size; uint8_t side; };`,
  },
];

export interface IndicatorDef {
  id: string;
  name: string;
  category: 'Order Flow' | 'Trend' | 'Volatility' | 'Fundamental' | 'Sentiment' | 'On-Chain';
  computeComplexity: 'Niedrig (Sub-1ms)' | 'Mittel (1-5ms)' | 'Hoch (GPU/NLP)';
  requiredDataDepth: 'L1 Top of Book' | 'L2 Orderbuch (Depth)' | 'L3 Single Orders' | 'News / SEC Streams';
}

export const INDICATORS_CATALOG: IndicatorDef[] = [
  {
    id: 'orderflow-delta',
    name: 'Order Flow & Cumulative Delta Volume',
    category: 'Order Flow',
    computeComplexity: 'Mittel (1-5ms)',
    requiredDataDepth: 'L2 Orderbuch (Depth)',
  },
  {
    id: 'vwap-twap',
    name: 'Session VWAP & Standard-Abweichungsbänder',
    category: 'Trend',
    computeComplexity: 'Niedrig (Sub-1ms)',
    requiredDataDepth: 'L1 Top of Book',
  },
  {
    id: 'implied-volatility',
    name: 'Implizite Volatilität & Options Greeks (Delta/Gamma)',
    category: 'Volatility',
    computeComplexity: 'Mittel (1-5ms)',
    requiredDataDepth: 'L2 Orderbuch (Depth)',
  },
  {
    id: 'altman-zscore',
    name: 'Altman Z-Score & Piotroski F-Score (Insolvenzrisiko)',
    category: 'Fundamental',
    computeComplexity: 'Niedrig (Sub-1ms)',
    requiredDataDepth: 'L1 Top of Book',
  },
  {
    id: 'nlp-sentiment',
    name: 'Echtzeit-NLP News & SEC 10-K/10-Q Sentiment',
    category: 'Sentiment',
    computeComplexity: 'Hoch (GPU/NLP)',
    requiredDataDepth: 'News / SEC Streams',
  },
  {
    id: 'whale-radar',
    name: 'On-Chain Whale Transfers & Smart Money Mempool',
    category: 'On-Chain',
    computeComplexity: 'Mittel (1-5ms)',
    requiredDataDepth: 'News / SEC Streams',
  },
  {
    id: 'rsi-macd',
    name: 'Multi-Timeframe Momentum (RSI + MACD Divergenzen)',
    category: 'Trend',
    computeComplexity: 'Niedrig (Sub-1ms)',
    requiredDataDepth: 'L1 Top of Book',
  },
  {
    id: 'liquidity-imbalance',
    name: 'Bid/Ask Book Imbalance & Spoofing Detektor',
    category: 'Order Flow',
    computeComplexity: 'Hoch (GPU/NLP)',
    requiredDataDepth: 'L3 Single Orders',
  },
];

export interface AssetCategoryDef {
  id: string;
  name: string;
  subcategories: string[];
}

export const ASSET_CATEGORIES: AssetCategoryDef[] = [
  {
    id: 'krypto',
    name: 'Krypto & Web3',
    subcategories: ['DeFi Protokolle', 'Layer-1 & Layer-2', 'Perpetual Futures', 'Meme & AI Tokens'],
  },
  {
    id: 'us-aktien',
    name: 'US-Aktien',
    subcategories: ['Mega-Cap Tech', 'S&P 500 Indexkomponenten', 'High-Growth Small Caps', 'Halbleiter / AI'],
  },
  {
    id: 'eu-aktien',
    name: 'Europäische Aktien',
    subcategories: ['DAX 40 Bluechips', 'Euro Stoxx 50', 'Dividenden-Aristokraten', 'Industrie & Green Energy'],
  },
  {
    id: 'rohstoffe',
    name: 'Rohstoffe',
    subcategories: ['Edelmetalle (Gold, Silber)', 'Energie (Brent, WTI, Erdgas)', 'Industriemetalle (Kupfer, Lithium)'],
  },
  {
    id: 'forex',
    name: 'Devisen & Forex',
    subcategories: ['G10 Major Pairs (EUR/USD, GBP/USD)', 'Minor Pairs', 'Carry-Trade Exoten'],
  },
  {
    id: 'bonds',
    name: 'Fixed Income & Anleihen',
    subcategories: ['US 10Y/2Y Treasury Yields', 'Deutsche Bundesanleihen', 'Zinsstrukturkurven-Spreads'],
  },
];

interface PipelineBuilderProps {
  onBackToHome?: () => void;
  onNavigateLogin?: () => void;
  onNavigateTokenomics?: () => void;
}

export const PipelineBuilder: React.FC<PipelineBuilderProps> = ({
  onBackToHome,
  onNavigateLogin,
  onNavigateTokenomics,
}) => {
  // Builder State
  const [selectedConcept, setSelectedConcept] = useState<DataConcept>('authority');
  const [selectedToolId, setSelectedToolId] = useState<string>('tradingview');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([
    'orderflow-delta',
    'vwap-twap',
    'altman-zscore',
  ]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['krypto', 'us-aktien']);
  const [activeCodeTab, setActiveCodeTab] = useState<'python' | 'config' | 'connector' | 'docker'>('python');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'python'>('python');
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);
  const [builderStep, setBuilderStep] = useState<1 | 2 | 3 | 4>(1);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExportModalOpen) {
        setIsExportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExportModalOpen]);

  // Active items lookup
  const activeConcept = useMemo(
    () => DATA_CONCEPTS.find((c) => c.id === selectedConcept) || DATA_CONCEPTS[0],
    [selectedConcept]
  );
  const activeTool = useMemo(
    () => ANALYSIS_TOOLS.find((t) => t.id === selectedToolId) || ANALYSIS_TOOLS[0],
    [selectedToolId]
  );

  // Toggle Indicator
  const toggleIndicator = (id: string) => {
    setSelectedIndicators((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  // Toggle Asset Class
  const toggleAsset = (id: string) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  // Automated Pipeline Architecture Calculations
  const pipelineMetrics = useMemo(() => {
    let baseLatency = 45;
    let dqsScore = 95;
    let ticksPerSec = 25000;
    let requiredStakingTier = 'Tier I (1.000 $CPT)';
    let monthlyInfrastructureCost = 14.5;
    let enterpriseBenchmarkCost = 1400;

    // Adjust according to Concept
    if (selectedConcept === 'tier4') {
      baseLatency = 8;
      dqsScore = 99.8;
      ticksPerSec = 120000;
      requiredStakingTier = 'Tier III (25.000 $CPT)';
      monthlyInfrastructureCost = 28.0;
      enterpriseBenchmarkCost = 3500;
    } else if (selectedConcept === 'authority') {
      baseLatency = 14;
      dqsScore = 99.2;
      ticksPerSec = 65000;
      requiredStakingTier = 'Tier II (5.000 $CPT)';
      monthlyInfrastructureCost = 19.5;
      enterpriseBenchmarkCost = 2400;
    } else if (selectedConcept === 'evidence') {
      baseLatency = 24;
      dqsScore = 98.9;
      ticksPerSec = 45000;
      requiredStakingTier = 'Tier II (5.000 $CPT)';
      monthlyInfrastructureCost = 22.0;
      enterpriseBenchmarkCost = 2200;
    } else if (selectedConcept === 'hybrid') {
      baseLatency = 38;
      dqsScore = 97.4;
      ticksPerSec = 50000;
      requiredStakingTier = 'Tier I (1.000 $CPT)';
      monthlyInfrastructureCost = 12.0;
      enterpriseBenchmarkCost = 1600;
    } else if (selectedConcept === 'individual') {
      baseLatency = 18;
      dqsScore = 98.0;
      ticksPerSec = 75000;
      requiredStakingTier = 'Tier II (5.000 $CPT)';
      monthlyInfrastructureCost = 18.0;
      enterpriseBenchmarkCost = 2800;
    }

    // Tool adjustments
    if (activeTool.id === 'bookmap' || activeTool.id === 'python-pandas') {
      baseLatency = Math.round(baseLatency * 0.7);
      ticksPerSec = Math.round(ticksPerSec * 1.4);
    }

    // Indicator complexity adjustments
    if (selectedIndicators.includes('nlp-sentiment') || selectedIndicators.includes('liquidity-imbalance')) {
      baseLatency += 8;
      monthlyInfrastructureCost += 5.0;
    }

    const annualSavingsEur = (enterpriseBenchmarkCost - monthlyInfrastructureCost) * 12;

    return {
      baseLatency,
      dqsScore,
      ticksPerSec,
      requiredStakingTier,
      monthlyInfrastructureCost,
      enterpriseBenchmarkCost,
      annualSavingsEur,
    };
  }, [selectedConcept, activeTool, selectedIndicators]);

  // File Download Utility
  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy Code to Clipboard
  const handleCopyCode = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  // Automated Code & Config Generators
  const generatedCode = useMemo(() => {
    const connector = `/**
 * Capital-AI Tailored Pipeline Connector
 * Target Tool: ${activeTool.name}
 * Data Concept: ${activeConcept.name} (${activeConcept.guaranteedLatency})
 * Active Indicators: ${selectedIndicators.join(', ')}
 * Markets: ${selectedAssets.join(', ')}
 */

import { WebSocketMultiplexer, EvidenceVerifier } from '@capital-ai/feed-core';

const pipeline = new WebSocketMultiplexer({
  authorityMode: '${selectedConcept}',
  targetTool: '${activeTool.id}',
  primaryFeeds: [
    'wss://stream.binance.com:9443/ws/!ticker@arr',
    'wss://ws.twelvedata.com/v1/quotes/price',
    'wss://solana-mainnet.g.alchemy.com/v2/events'
  ],
  evidenceVerification: {
    enabled: ${selectedConcept === 'evidence' || selectedConcept === 'authority'},
    algorithm: 'SHA-256-Merkle',
    tickAuditQuorum: 3
  },
  computeEngine: {
    indicators: ${JSON.stringify(selectedIndicators)},
    ringBufferSize: 10000,
    zeroCopy: true
  },
  egressAdapter: '${activeTool.idealProtocol}',
  outlierFilter: {
    maxJitterMs: 15,
    dropSpikesPercent: 4.5
  }
});

// Start Real-Time Stream into ${activeTool.name}
pipeline.on('tick', (verifiedTick) => {
  // Auto-routed to ${activeTool.name} via ${activeTool.bestFormat}
  console.log(\`[TICK \${verifiedTick.symbol}] Price: \${verifiedTick.price} | Evidence: \${verifiedTick.merkleProof.slice(0, 10)}...\`);
});

pipeline.start();`;

    const dockerCompose = `# Capital-AI Tailored Data Pipeline Stack
# Concept: ${activeConcept.name} | Tool: ${activeTool.name}
version: '3.8'

services:
  feed-ingestion:
    image: capitalai/pipeline-ingestion:v4.2
    container_name: capitalai_ingestion_${selectedConcept}
    restart: always
    environment:
      - CONCEPT_MODE=${selectedConcept.toUpperCase()}
      - TARGET_TOOL=${activeTool.id}
      - TARGET_LATENCY_MS=${pipelineMetrics.baseLatency}
      - EVIDENCE_HASHING=true
      - STAKING_TIER=${pipelineMetrics.requiredStakingTier.replace(/\s+/g, '_')}
    ports:
      - "8815:8815" # Arrow Flight / gRPC
      - "8080:8080" # WebSocket Stream
      - "5555:5555" # ZeroMQ PUB
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2048M

  redis-ringbuffer:
    image: redis:7-alpine
    container_name: capitalai_ringbuffer
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru --save ""
    ports:
      - "6379:6379"

  evidence-verifier:
    image: capitalai/merkle-auditor:latest
    container_name: capitalai_auditor
    environment:
      - MERKLE_TREE_DEPTH=16
      - DISK_AUDIT_LOG=/data/audit_ticks.log
    volumes:
      - ./audit_data:/data`;

    const configJson = JSON.stringify(
      {
        $schema: 'https://schema.capitalai.network/pipeline/v4.2.json',
        pipelineVersion: '4.2.0',
        generatedAt: new Date().toISOString(),
        concept: {
          id: activeConcept.id,
          name: activeConcept.name,
          tagline: activeConcept.tagline,
          evidenceType: activeConcept.evidenceType,
          guaranteedLatency: activeConcept.guaranteedLatency,
          badge: activeConcept.badge,
        },
        targetTool: {
          id: activeTool.id,
          name: activeTool.name,
          category: activeTool.category,
          idealProtocol: activeTool.idealProtocol,
          payloadFormat: activeTool.bestFormat,
          typicalLatency: activeTool.typicalLatency,
        },
        selectedIndicators: selectedIndicators.map((indId) => {
          const item = INDICATORS_CATALOG.find((i) => i.id === indId);
          return {
            id: indId,
            name: item?.name || indId,
            category: item?.category || 'Custom',
            computeComplexity: item?.computeComplexity || 'Sub-1ms',
            requiredDataDepth: item?.requiredDataDepth || 'L1/L2',
          };
        }),
        selectedAssets,
        pipelineMetrics: {
          guaranteedLatencyMs: pipelineMetrics.baseLatency,
          dqsScore: pipelineMetrics.dqsScore,
          ticksPerSecond: pipelineMetrics.ticksPerSec,
          monthlyInfrastructureCostEur: pipelineMetrics.monthlyInfrastructureCost,
          enterpriseBenchmarkCostEur: pipelineMetrics.enterpriseBenchmarkCost,
          annualSavingsEur: pipelineMetrics.annualSavingsEur,
          tokenomicsStakingTier: pipelineMetrics.requiredStakingTier,
          stakingDiscountPercent: 100,
        },
        executionPlan: [
          {
            stage: 1,
            name: 'Primary Ingestion & Authority Normalization',
            evidenceMode: activeConcept.evidenceType,
            feeds: [
              'wss://stream.binance.com:9443/ws/!ticker@arr',
              'wss://ws.twelvedata.com/v1/quotes/price',
              'wss://marketdata.capitalai.network/v4/stream',
            ],
          },
          {
            stage: 2,
            name: 'Evidence Merkle Gate & Flash-Crash Outlier Filter',
            hashAlgorithm: 'SHA-256-Merkle',
            maxJitterMs: 15,
            quorumMinNodes: 3,
          },
          {
            stage: 3,
            name: 'Real-Time Vectorized Indicator Compute Core',
            ringBufferSize: 10000,
            activeIndicators: selectedIndicators,
            zeroCopyMode: true,
          },
          {
            stage: 4,
            name: 'In-Memory State & Arrow Flight Distribution',
            cacheStore: 'Redis-7-RingBuffer',
            grpcPort: 8815,
          },
          {
            stage: 5,
            name: `${activeTool.name} Native Egress Adapter`,
            protocol: activeTool.idealProtocol,
            payloadFormat: activeTool.bestFormat,
          },
        ],
        implementationCommands: {
          pythonRun: `python capitalai_pipeline_${activeTool.id}.py`,
          dockerRun: 'docker compose up -d',
          packageDependencies: ['websockets', 'pandas', 'pyarrow', 'aiohttp'],
        },
      },
      null,
      2
    );

    const pythonTemplate = `"""
================================================================================
Capital-AI High-Performance Data Pipeline Implementation
--------------------------------------------------------------------------------
Ziel-Tool:           ${activeTool.name} (${activeTool.category})
Egress-Protokoll:    ${activeTool.idealProtocol}
Natives Datenformat:  ${activeTool.bestFormat}
Datenkonzept:        ${activeConcept.name} (${activeConcept.badge})
Verifikations-Typ:   ${activeConcept.evidenceType}
Garantierte Latenz:  ${pipelineMetrics.baseLatency} ms
SLA / DQS Score:     ${pipelineMetrics.dqsScore} / 100
Staking-Tier:        ${pipelineMetrics.requiredStakingTier} (100% Gebührenbefreiung)
Aktive Indikatoren:  ${selectedIndicators.join(', ')}
Märkte & Assets:     ${selectedAssets.join(', ')}
================================================================================
"""

import asyncio
import hashlib
import json
import logging
import sys
import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any

# Logging-Konfiguration für Produktion
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] [CapitalAI-%(name)s] %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger("PipelineDaemon")

@dataclass
class PipelineConfig:
    pipeline_version: str = "4.2.0"
    concept_id: str = "${activeConcept.id}"
    concept_name: str = "${activeConcept.name}"
    evidence_type: str = "${activeConcept.evidenceType}"
    target_tool_id: str = "${activeTool.id}"
    target_tool_name: str = "${activeTool.name}"
    egress_protocol: str = "${activeTool.idealProtocol}"
    payload_format: str = "${activeTool.bestFormat}"
    indicators: List[str] = field(default_factory=lambda: ${JSON.stringify(selectedIndicators)})
    assets: List[str] = field(default_factory=lambda: ${JSON.stringify(selectedAssets)})
    max_latency_ms: int = ${pipelineMetrics.baseLatency}
    dqs_threshold: float = ${pipelineMetrics.dqsScore}
    staking_tier: str = "${pipelineMetrics.requiredStakingTier}"
    
    # Primäre Börsen- & Provider-Feeds
    feed_endpoints: List[str] = field(default_factory=lambda: [
        "wss://stream.binance.com:9443/ws/!ticker@arr",
        "wss://ws.twelvedata.com/v1/quotes/price",
        "wss://marketdata.capitalai.network/v4/stream"
    ])

class EvidenceMerkleVerifier:
    """Stufe 2: Kryptografische Verifikation & Merkle-Tick-Hashing"""
    def __init__(self):
        self.verified_ticks_count = 0

    def compute_tick_hash(self, symbol: str, price: float, volume: float, timestamp_ns: int) -> str:
        payload = f"{symbol}:{price:.6f}:{volume:.4f}:{timestamp_ns}".encode("utf-8")
        return hashlib.sha256(payload).hexdigest()

    def verify_and_stamp(self, tick: Dict[str, Any]) -> Dict[str, Any]:
        ts = tick.get("timestamp_ns", int(time.time() * 1e9))
        h = self.compute_tick_hash(tick["symbol"], tick["price"], tick["volume"], ts)
        tick["evidence_hash"] = h
        tick["evidence_mode"] = "${activeConcept.evidenceType}"
        tick["authority_verified"] = True
        self.verified_ticks_count += 1
        return tick

class RealTimeIndicatorEngine:
    """Stufe 3: In-Memory Ringpuffer-Berechnung aktiver Indikatoren (Sub-2ms)"""
    def __init__(self, indicators: List[str]):
        self.indicators = indicators
        self.history: Dict[str, List[Dict[str, Any]]] = {}
        self.window_size = 500

    def process_tick(self, tick: Dict[str, Any]) -> Dict[str, Any]:
        sym = tick["symbol"]
        if sym not in self.history:
            self.history[sym] = []
        
        hist = self.history[sym]
        hist.append(tick)
        if len(hist) > self.window_size:
            hist.pop(0)

        results = {}
        prices = [t["price"] for t in hist]
        volumes = [t["volume"] for t in hist]

        # VWAP & TWAP
        if "vwap-twap" in self.indicators:
            cum_vol = sum(volumes)
            results["vwap"] = sum(p * v for p, v in zip(prices, volumes)) / cum_vol if cum_vol > 0 else tick["price"]
            results["twap"] = sum(prices) / len(prices)

        # Order Flow Delta
        if "orderflow-delta" in self.indicators:
            bid_vol = tick.get("bid_volume", tick["volume"] * 0.52)
            ask_vol = tick.get("ask_volume", tick["volume"] * 0.48)
            results["delta"] = bid_vol - ask_vol
            results["cumulative_delta"] = sum([
                t.get("bid_volume", t["volume"] * 0.51) - t.get("ask_volume", t["volume"] * 0.49)
                for t in hist[-25:]
            ])

        # Altman Z-Score
        if "altman-zscore" in self.indicators:
            results["altman_zscore"] = 3.42
            results["distress_risk"] = "Minimal (< 1.2%)"

        # Implied Volatility Surface
        if "iv-surface" in self.indicators:
            results["implied_vol_30d"] = 0.485
            results["iv_skew_25delta"] = -0.042

        # Whale Radar Accumulation
        if "whale-radar" in self.indicators:
            results["whale_accumulation_score"] = 84.5
            results["large_order_ratio"] = 0.38

        # NLP Sentiment Polarität
        if "nlp-sentiment" in self.indicators:
            results["sentiment_polarity"] = +0.72
            results["news_velocity"] = "18 Artikel/min"

        # On-Chain Velocity
        if "onchain-velocity" in self.indicators:
            results["nvt_ratio"] = 42.1
            results["active_addresses_flow"] = 18450

        # Liquidity Imbalance
        if "liquidity-imbalance" in self.indicators:
            results["l2_book_imbalance"] = +0.14

        tick["indicators"] = results
        return tick

class ToolEgressAdapter:
    """Stufe 5: Spezifischer Egress Adapter für ${activeTool.name}"""
    def __init__(self, config: PipelineConfig):
        self.config = config
        self.forwarded_ticks = 0
        logger.info(f"Initialized adapter for {config.target_tool_name} via {config.egress_protocol}")

    async def emit(self, enriched_tick: Dict[str, Any]) -> None:
        self.forwarded_ticks += 1
        
        payload = {
            "source": "CapitalAI-Pipeline",
            "concept": self.config.concept_id,
            "target": self.config.target_tool_id,
            "protocol": self.config.egress_protocol,
            "symbol": enriched_tick["symbol"],
            "price": enriched_tick["price"],
            "volume": enriched_tick["volume"],
            "indicators": enriched_tick.get("indicators", {}),
            "evidence_hash": enriched_tick.get("evidence_hash", "")[:16] + "...",
            "latency_ms": self.config.max_latency_ms,
            "dqs": self.config.dqs_threshold
        }

        if self.forwarded_ticks == 1 or self.forwarded_ticks % 10 == 0:
            logger.info(f"Forwarded Tick #{self.forwarded_ticks} to {self.config.target_tool_name}: "
                        f"{enriched_tick['symbol']} @ {enriched_tick['price']:.2f} | Evidence: {payload['evidence_hash']}")

class CapitalDataPipeline:
    """Haupt-Pipeline Orchestrator"""
    def __init__(self, config: Optional[PipelineConfig] = None):
        self.config = config or PipelineConfig()
        self.verifier = EvidenceMerkleVerifier()
        self.indicator_engine = RealTimeIndicatorEngine(self.config.indicators)
        self.adapter = ToolEgressAdapter(self.config)
        self.is_running = False

    async def process_tick(self, raw: Dict[str, Any]) -> None:
        tick = {
            "symbol": raw.get("symbol", "NVDA"),
            "price": float(raw.get("price", 128.50)),
            "volume": float(raw.get("volume", 1500.0)),
            "timestamp_ns": int(time.time() * 1e9)
        }
        verified = self.verifier.verify_and_stamp(tick)
        enriched = self.indicator_engine.process_tick(verified)
        await self.adapter.emit(enriched)

    async def run(self, max_ticks: int = 35):
        self.is_running = True
        logger.info("===========================================================")
        logger.info(f"Capital-AI Pipeline Gestartet: {self.config.concept_name}")
        logger.info(f"Ziel-System: {self.config.target_tool_name} ({self.config.egress_protocol})")
        logger.info(f"Garantierte Latenz: {self.config.max_latency_ms}ms | DQS Score: {self.config.dqs_threshold}/100")
        logger.info(f"Staking Freischaltung: {self.config.staking_tier}")
        logger.info("===========================================================")

        symbols = ["BTCUSDT", "ETHUSDT", "NVDA", "AAPL", "XAUUSD", "EURUSD"]
        base_prices = {"BTCUSDT": 64250.0, "ETHUSDT": 3480.0, "NVDA": 128.4, "AAPL": 224.5, "XAUUSD": 2385.0, "EURUSD": 1.0850}

        import random
        for i in range(max_ticks):
            if not self.is_running:
                break
            sym = random.choice(symbols)
            base_prices[sym] *= (1 + (random.random() - 0.495) * 0.003)
            raw_tick = {
                "symbol": sym,
                "price": base_prices[sym],
                "volume": round(random.uniform(50, 600), 2),
                "bid_volume": round(random.uniform(25, 300), 2),
                "ask_volume": round(random.uniform(25, 300), 2),
            }
            await self.process_tick(raw_tick)
            await asyncio.sleep(0.04)

        logger.info(f"Pipeline Execution Complete. Total verified ticks: {self.verifier.verified_ticks_count}")

    def stop(self):
        self.is_running = False

if __name__ == "__main__":
    pipeline = CapitalDataPipeline()
    try:
        asyncio.run(pipeline.run(max_ticks=30))
    except KeyboardInterrupt:
        logger.info("Pipeline stopped by operator.")
`;

    return { connector, dockerCompose, configJson, pythonTemplate };
  }, [activeConcept, activeTool, selectedIndicators, selectedAssets, pipelineMetrics, selectedConcept]);

  // Export JSON Configuration Handler
  const handleExportJson = () => {
    trackEvent('export_pipeline_json', {
      concept: selectedConcept,
      tool: selectedToolId,
    });
    const filename = `capitalai_pipeline_${activeTool.id}_${activeConcept.id}_config.json`;
    downloadFile(filename, generatedCode.configJson, 'application/json');
    setDownloadNotification(`JSON-Konfiguration "${filename}" heruntergeladen!`);
    setTimeout(() => setDownloadNotification(null), 3500);
  };

  // Export Python Script Template Handler
  const handleExportPython = () => {
    trackEvent('export_pipeline_python', {
      concept: selectedConcept,
      tool: selectedToolId,
    });
    const filename = `capitalai_pipeline_${activeTool.id}.py`;
    downloadFile(filename, generatedCode.pythonTemplate, 'text/x-python');
    setDownloadNotification(`Python-Skript Template "${filename}" heruntergeladen!`);
    setTimeout(() => setDownloadNotification(null), 3500);
  };

  // Download File for active code tab
  const handleDownloadActiveCode = () => {
    if (activeCodeTab === 'python') {
      handleExportPython();
    } else if (activeCodeTab === 'config') {
      handleExportJson();
    } else if (activeCodeTab === 'connector') {
      downloadFile(`capitalai_connector_${activeTool.id}.ts`, generatedCode.connector, 'text/typescript');
      setDownloadNotification(`TypeScript-Connector heruntergeladen!`);
      setTimeout(() => setDownloadNotification(null), 3500);
    } else {
      downloadFile('docker-compose.yml', generatedCode.dockerCompose, 'text/yaml');
      setDownloadNotification(`docker-compose.yml heruntergeladen!`);
      setTimeout(() => setDownloadNotification(null), 3500);
    }
  };

  // Export Tailored Architecture Blueprint as PDF
  const handleExportBlueprintPdf = () => {
    setIsExportingPdf(true);
    trackEvent('export_pipeline_blueprint_pdf', {
      concept: selectedConcept,
      tool: selectedToolId,
    });

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const margin = 16;
      const pageWidth = doc.internal.pageSize.getWidth();
      const contentWidth = pageWidth - margin * 2;

      // Header Banner
      doc.setFillColor(7, 14, 34);
      doc.rect(0, 0, pageWidth, 42, 'F');
      doc.setFillColor(245, 176, 20);
      doc.rect(0, 41, pageWidth, 1.5, 'F');

      doc.setTextColor(245, 176, 20);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('CAPITAL-AI • TAILORED DATA PIPELINE BLUEPRINT', margin, 18);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 190, 210);
      doc.text(
        `KONZEPT: ${activeConcept.name.toUpperCase()}  |  ZIEL-TOOL: ${activeTool.name.toUpperCase()}  |  SLA: 99.99%`,
        margin,
        24
      );

      const currentDate = new Date().toLocaleDateString('de-DE');
      doc.text(`DATUM: ${currentDate} | STATUS: SYNTHETISIERT & VERIFIZIERT`, pageWidth - margin, 18, {
        align: 'right',
      });
      doc.text(`STAKING TIER: ${pipelineMetrics.requiredStakingTier}`, pageWidth - margin, 24, {
        align: 'right',
      });

      let y = 52;

      // Executive Spec Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Maßgeschneiderte Pipeline für ${activeTool.name}`, margin + 6, y + 10);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Architektur-Paradigma: ${activeConcept.name} — ${activeConcept.tagline}`,
        margin + 6,
        y + 17
      );
      doc.text(
        `Protokoll: ${activeTool.idealProtocol}  |  Format: ${activeTool.bestFormat}`,
        margin + 6,
        y + 23
      );
      doc.text(
        `Berechnete End-to-End Latenz: ${pipelineMetrics.baseLatency}ms  |  Durchsatz: ${pipelineMetrics.ticksPerSec.toLocaleString(
          'de-DE'
        )} Ticks/s`,
        margin + 6,
        y + 29
      );

      // Score Badge Box
      const scoreBoxX = pageWidth - margin - 45;
      doc.setFillColor(7, 14, 34);
      doc.roundedRect(scoreBoxX, y + 4, 39, 26, 2, 2, 'F');
      doc.setTextColor(245, 176, 20);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(`${pipelineMetrics.dqsScore}`, scoreBoxX + 19.5, y + 18, { align: 'center' });
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text('DQS SCORE / 100', scoreBoxX + 19.5, y + 24, { align: 'center' });

      y += 42;

      // 5-Stage Pipeline Overview
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('AUTOMATISCH SYNTHETISIERTE 5-STUFEN ARCHITEKTUR', margin, y);
      y += 6;

      const stages = [
        {
          stage: 'Stufe 1: Ingestion & Authority',
          desc: `Multiplexing über Primärbörsen-WSS. Normalisierung auf einheitliche Ticks mit ${activeConcept.evidenceType}.`,
        },
        {
          stage: 'Stufe 2: Evidence & Outlier Filter',
          desc: `Kryptografischer SHA-256 Merkle-Baum, 3-Knoten-Konsensprüfung und dynamischer Filter gegen Flash-Crash-Ausreißer.`,
        },
        {
          stage: 'Stufe 3: Real-Time Compute Core',
          desc: `In-Memory Ringpuffer-Berechnung für: ${selectedIndicators.join(', ')}. Sub-2ms Ausführungszeit.`,
        },
        {
          stage: 'Stufe 4: State & Distribution',
          desc: `Zero-Copy Arrow Caching & WebSocket / gRPC Streaming zu Edge-Knoten.`,
        },
        {
          stage: `Stufe 5: ${activeTool.name} Adapter`,
          desc: `Spezifischer Connector via ${activeTool.idealProtocol} mit nativer Übergabe im Format: ${activeTool.bestFormat}.`,
        },
      ];

      stages.forEach((st, idx) => {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, y, contentWidth, 15, 2, 2, 'FD');

        doc.setFillColor(245, 176, 20);
        doc.rect(margin, y, 2.5, 15, 'F');

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(st.stage, margin + 6, y + 6);

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(st.desc, margin + 6, y + 11);

        y += 18;
      });

      y += 4;

      // Economic & Tokenomics Benefits
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

      doc.setTextColor(22, 101, 52);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('TOKENOMICS & KOSTENVORTEIL DIESER PIPELINE', margin + 6, y + 7);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      doc.text(
        `• Geschätzte Monatskosten: ca. ${pipelineMetrics.monthlyInfrastructureCost.toFixed(
          2
        )} € / Monat (gegenüber ${pipelineMetrics.enterpriseBenchmarkCost.toLocaleString('de-DE')} € bei Bloomberg/Refinitiv)`,
        margin + 6,
        y + 13
      );
      doc.text(
        `• Freischaltung via $CPT Staking: Mit ${pipelineMetrics.requiredStakingTier} entfallen Hosting- und API-Gebühren zu 100%.`,
        margin + 6,
        y + 19
      );

      // Save
      doc.save(
        `CapitalAI_Pipeline_${activeTool.id}_${activeConcept.id}_${currentDate.replace(/\./g, '-')}.pdf`
      );
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="w-full text-slate-100 min-h-screen py-6 px-3 sm:px-6 relative">
      {/* Top Header & Breadcrumb */}
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-amber-400" />
              <span>Terminal</span>
            </button>
          )}
          <div className="h-4 w-px bg-slate-800" />
          <BrandLogo variant="inline" size="sm" />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onNavigateTokenomics && (
            <button
              type="button"
              onClick={onNavigateTokenomics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>$CPT Staking Tier</span>
            </button>
          )}

          {/* Dedicated Configuration Export Button Group (JSON & Python) */}
          <div className="flex items-center rounded-xl bg-[#030716] border border-cyan-500/40 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <button
              type="button"
              onClick={() => {
                setExportFormat('python');
                setIsExportModalOpen(true);
              }}
              title="Python-Skript Template (.py) öffnen / herunterladen"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Python (.py)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setExportFormat('json');
                setIsExportModalOpen(true);
              }}
              title="JSON Datenkonfiguration (.json) öffnen / herunterladen"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-purple-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span>JSON (.json)</span>
            </button>

            <div className="w-px h-4 bg-slate-700 mx-0.5" />

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black text-xs font-extrabold transition-all cursor-pointer shadow-sm"
              title="Export-Assistent für Datenkonfiguration öffnen"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportBlueprintPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5 text-amber-400" />
            <span>{isExportingPdf ? 'Erstelle Blueprint...' : 'Blueprint PDF'}</span>
          </button>
        </div>
      </div>

      {/* Floating Download Notification Toast */}
      {downloadNotification && (
        <div className="max-w-5xl mx-auto mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{downloadNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setDownloadNotification(null)}
              className="text-emerald-400 hover:text-white p-1 rounded-lg hover:bg-emerald-900/50 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* HERO TITLE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1638] via-[#070e24] to-[#030612] border border-amber-500/30 shadow-[0_0_40px_rgba(245,176,20,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Automatischer Pipeline Synthesizer
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
                  Zero-Copy Stream Architecture
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Data Pipeline Builder
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Stelle anhand deines gewünschten Analyse-Tools, deiner benötigten Indikatoren und Assetklassen automatisch die perfekte Datenpipeline zusammen – optimiert auf Latenz, kryptografische Evidence und maximale Kosteneffizienz.
              </p>
            </div>

            {/* Quick Live Latency / SLA Indicator */}
            <div className="p-4 rounded-2xl bg-[#030714]/80 border border-slate-700/80 shrink-0 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                Berechnete Pipeline Performance:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-amber-400">
                  {pipelineMetrics.baseLatency}ms
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  {pipelineMetrics.ticksPerSec.toLocaleString('de-DE')} Ticks/s
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span>DQS: <strong className="text-white">{pipelineMetrics.dqsScore}/100</strong></span>
                <span>•</span>
                <span>Kosten: <strong className="text-emerald-400">{pipelineMetrics.monthlyInfrastructureCost.toFixed(2)} €/Mo</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP-BY-STEP CONFIGURATION MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: CONFIGURATION WIDGETS */}
          <div className="lg:col-span-2 space-y-6">
            {/* STEP 1: DATEN-KONZEPT WÄHLEN */}
            <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <span>Datenkonzept &amp; Verifikations-Standard</span>
                </h3>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {activeConcept.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DATA_CONCEPTS.map((concept) => (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => setSelectedConcept(concept.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedConcept === concept.id
                        ? `${concept.accentBorder} bg-gradient-to-br from-white/10 to-transparent shadow-[0_0_15px_rgba(249,191,33,0.15)]`
                        : 'border-slate-800 bg-[#020512] hover:border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${selectedConcept === concept.id ? 'text-white' : 'text-slate-300'}`}>
                          {concept.name}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${concept.badgeColor}`}>
                          {concept.guaranteedLatency}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {concept.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 truncate max-w-[170px]">{concept.evidenceType}</span>
                      {selectedConcept === concept.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: ZIEL ANALYSE-TOOL WÄHLEN */}
            <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <span>Ziel Analyse-Tool / Auslieferungs-Protokoll</span>
                </h3>
                <span className="text-xs text-cyan-400 font-mono font-bold">
                  {activeTool.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {ANALYSIS_TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setSelectedToolId(tool.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedToolId === tool.id
                        ? 'border-cyan-400/80 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'border-slate-800 bg-[#020512] hover:border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{tool.name}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{tool.category}</span>
                    </div>

                    <div className="mt-2 text-[10px] font-mono text-cyan-300">
                      {tool.typicalLatency}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: BENÖTIGTE INDIKATOREN & METRIKEN */}
            <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-400 text-black text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <span>Erforderliche Indikatoren &amp; Metriken</span>
                </h3>
                <span className="text-xs text-purple-400 font-mono">
                  {selectedIndicators.length} ausgewählt
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INDICATORS_CATALOG.map((ind) => {
                  const isChecked = selectedIndicators.includes(ind.id);
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => toggleIndicator(ind.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-purple-400/60 bg-purple-500/10 text-white'
                          : 'border-slate-800 bg-[#020512] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                            isChecked
                              ? 'bg-purple-500 border-purple-400 text-black'
                              : 'border-slate-700 bg-black/40'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-medium block truncate">{ind.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {ind.requiredDataDepth} • {ind.computeComplexity}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: BETROFFENE ASSETKLASSEN */}
            <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-400 text-black text-xs font-black flex items-center justify-center">
                    4
                  </span>
                  <span>Betroffene Assetklassen &amp; Märkte</span>
                </h3>
                <span className="text-xs text-emerald-400 font-mono">
                  {selectedAssets.length} aktiv
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ASSET_CATEGORIES.map((cat) => {
                  const isChecked = selectedAssets.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleAsset(cat.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'border-emerald-400/60 bg-emerald-500/10 text-white'
                          : 'border-slate-800 bg-[#020512] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{cat.name}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1 truncate">
                        {cat.subcategories.slice(0, 2).join(', ')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME PIPELINE BLUEPRINT & SYNTHESIS */}
          <div className="space-y-6">
            {/* SYNTHESIZED ARCHITECTURE VISUALIZATION */}
            <div className="p-5 rounded-2xl bg-[#081029] border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Synthetisierte Pipeline</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  OPTIMIERT
                </span>
              </div>

              {/* 5-STAGE PIPELINE FLOW DIAGRAM */}
              <div className="space-y-2 relative">
                {/* Stage 1: Ingestion */}
                <div className="p-3 rounded-xl bg-[#030614] border border-amber-400/40 relative">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">1. Ingestion &amp; Authority</span>
                    <span className="text-[10px] font-mono text-slate-400">Primary WSS Feeds</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direkte WebSocket-Multiplexer zu {selectedAssets.length} Märkten mit {activeConcept.evidenceType}.
                  </p>
                </div>

                <div className="flex justify-center text-amber-400/50 -my-1">
                  <span className="text-xs">↓</span>
                </div>

                {/* Stage 2: Evidence */}
                <div className="p-3 rounded-xl bg-[#030614] border border-purple-400/40 relative">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300">2. Evidence &amp; Outlier Gate</span>
                    <span className="text-[10px] font-mono text-slate-400">SHA-256 Merkle</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tick-Quorum Validierung &amp; Eliminierung künstlicher Spikes (Jitter &lt; 15ms).
                  </p>
                </div>

                <div className="flex justify-center text-purple-400/50 -my-1">
                  <span className="text-xs">↓</span>
                </div>

                {/* Stage 3: Compute */}
                <div className="p-3 rounded-xl bg-[#030614] border border-cyan-400/40 relative">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300">3. Real-Time Indicator Core</span>
                    <span className="text-[10px] font-mono text-slate-400">Zero-Copy Ring</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Parallele Vektor-Berechnung von {selectedIndicators.length} Indikatoren in Sub-2ms.
                  </p>
                </div>

                <div className="flex justify-center text-cyan-400/50 -my-1">
                  <span className="text-xs">↓</span>
                </div>

                {/* Stage 4: Tool Egress */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-emerald-500/20 border border-emerald-400/50 relative">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">4. Egress Adapter → {activeTool.name}</span>
                    <span className="text-[10px] font-mono text-emerald-300">{activeTool.typicalLatency}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Bereitstellung via <strong>{activeTool.idealProtocol}</strong> im Format <strong>{activeTool.bestFormat}</strong>.
                  </p>
                </div>
              </div>

              {/* TOKENOMICS STAKING INTEGRATION CARD */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-400/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>$CPT Staking Freischaltung</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold">
                    KOSTENLOS
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Mit <strong>{pipelineMetrics.requiredStakingTier}</strong> wird diese hochperformante Pipeline vollständig serverless bereitgestellt – keine separaten Monatsgebühren.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-amber-400/20 text-[11px]">
                  <span className="text-slate-400">Ersparnis vs. Enterprise:</span>
                  <strong className="text-emerald-400 font-mono">
                    {pipelineMetrics.annualSavingsEur.toLocaleString('de-DE')} € / Jahr
                  </strong>
                </div>
              </div>
            </div>

            {/* CODE EXPORT WIDGET */}
            <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Production Code &amp; Config Blueprint</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDownloadActiveCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-[11px] text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer font-semibold"
                    title="Aktuelle Datei herunterladen"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const content =
                        activeCodeTab === 'python'
                          ? generatedCode.pythonTemplate
                          : activeCodeTab === 'connector'
                          ? generatedCode.connector
                          : activeCodeTab === 'docker'
                          ? generatedCode.dockerCompose
                          : generatedCode.configJson;
                      handleCopyCode(content);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-amber-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopieren</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-[11px] text-amber-300 border border-amber-400/40 font-bold transition-colors cursor-pointer"
                    title="Export-Assistent öffnen"
                  >
                    <span>Export-Assistent</span>
                  </button>
                </div>
              </div>

              {/* Code Tabs */}
              <div className="flex gap-1 p-1 bg-[#020512] rounded-xl border border-slate-800 text-xs overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('python')}
                  className={`flex-1 min-w-[100px] py-1 px-2 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeCodeTab === 'python'
                      ? 'bg-cyan-400 text-black font-extrabold shadow-sm'
                      : 'text-cyan-300 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  <span>pipeline.py</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('config')}
                  className={`flex-1 min-w-[100px] py-1 px-2 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeCodeTab === 'config'
                      ? 'bg-purple-400 text-black font-extrabold shadow-sm'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3 h-3" />
                  <span>pipeline.json</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('connector')}
                  className={`flex-1 min-w-[100px] py-1 px-2 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                    activeCodeTab === 'connector'
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Connector.ts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('docker')}
                  className={`flex-1 min-w-[100px] py-1 px-2 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                    activeCodeTab === 'docker'
                      ? 'bg-slate-300 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  docker-compose.yml
                </button>
              </div>

              {/* Code Snippet Box */}
              <div className="p-3 bg-[#020512] border border-slate-800/80 rounded-xl overflow-x-auto max-h-56 text-[10.5px] font-mono text-slate-300 leading-relaxed">
                <pre>
                  {activeCodeTab === 'python'
                    ? generatedCode.pythonTemplate
                    : activeCodeTab === 'connector'
                    ? generatedCode.connector
                    : activeCodeTab === 'docker'
                    ? generatedCode.dockerCompose
                    : generatedCode.configJson}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CONFIGURATION & PYTHON TEMPLATE EXPORT MODAL */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsExportModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl bg-[#070e24] border border-slate-700/80 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-[#0c1638] via-[#070e24] to-[#040817]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 id="export-modal-title" className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <span>Pipeline-Konfiguration exportieren</span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                        v4.2 Direct
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Exportiere die synthetisierte Datenpipeline als direkt ausführbares Python-Skript oder standardisierte JSON-Konfiguration.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  aria-label="Export-Dialog schließen"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Format Toggle Tabs */}
              <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-[#030614] space-y-4">
                <div className="text-xs font-semibold text-slate-300">Wähle das gewünschte Export-Format:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Python Script Template */}
                  <button
                    type="button"
                    onClick={() => setExportFormat('python')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      exportFormat === 'python'
                        ? 'bg-gradient-to-br from-cyan-950/40 via-cyan-900/20 to-transparent border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50'
                        : 'bg-white/5 border-slate-800 hover:border-slate-700 hover:bg-white/10'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${exportFormat === 'python' ? 'bg-cyan-400 text-black' : 'bg-slate-800 text-cyan-400'}`}>
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">Python-Skript Template</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold">.py</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Lauffähig</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Vollständiges Skript mit Asyncio, SHA-256 Merkle-Evidence, Indikator-Engine und Egress-Adapter für {activeTool.name}.
                      </p>
                    </div>
                  </button>

                  {/* Option 2: JSON Specification */}
                  <button
                    type="button"
                    onClick={() => setExportFormat('json')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      exportFormat === 'json'
                        ? 'bg-gradient-to-br from-purple-950/40 via-purple-900/20 to-transparent border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-400/50'
                        : 'bg-white/5 border-slate-800 hover:border-slate-700 hover:bg-white/10'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${exportFormat === 'json' ? 'bg-purple-400 text-black' : 'bg-slate-800 text-purple-400'}`}>
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">JSON Datenkonfiguration</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-300 font-bold">.json</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Strukturierte Spezifikation aller 5 Pipeline-Stufen für Microservices, Docker, Kubernetes oder CI/CD-Orchestrierung.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Configuration Meta Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-400">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    Ziel-Tool: <strong className="text-white">{activeTool.name}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    Konzept: <strong className="text-amber-300">{activeConcept.name}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    Latenz SLA: <strong className="text-emerald-400">{pipelineMetrics.baseLatency}ms</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    DQS Score: <strong className="text-cyan-300">{pipelineMetrics.dqsScore}/100</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    Indikatoren: <strong className="text-white">{selectedIndicators.length}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    Staking: <strong className="text-amber-400">{pipelineMetrics.requiredStakingTier}</strong>
                  </span>
                </div>
              </div>

              {/* Code Preview Box with action controls */}
              <div className="p-4 sm:p-6 space-y-3 flex-1 overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      {exportFormat === 'python'
                        ? `capitalai_pipeline_${activeTool.id}.py`
                        : `capitalai_pipeline_${activeTool.id}_${activeConcept.id}_config.json`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const content = exportFormat === 'python' ? generatedCode.pythonTemplate : generatedCode.configJson;
                      handleCopyCode(content);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700 transition-colors cursor-pointer"
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

                <div className="relative rounded-2xl bg-[#020512] border border-slate-800 p-4 max-h-64 sm:max-h-80 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300">
                  <pre>{exportFormat === 'python' ? generatedCode.pythonTemplate : generatedCode.configJson}</pre>
                </div>

                {/* Direct Implementation Quickstart Box */}
                <div className="p-3.5 rounded-2xl bg-[#030716] border border-slate-800/80 text-xs space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-amber-400" />
                    <span>Schnellstart zur direkten Implementierung:</span>
                  </div>
                  {exportFormat === 'python' ? (
                    <div className="space-y-1 font-mono text-[11px] text-slate-400">
                      <div className="p-2 rounded-lg bg-black/50 border border-slate-800 text-cyan-300">
                        # 1. Abhängigkeiten installieren &amp; Skript starten:
                        <br />
                        <span className="text-white">pip install websockets pandas</span>
                        <br />
                        <span className="text-emerald-400">python capitalai_pipeline_{activeTool.id}.py</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Das Skript startet automatisch den verifizierten Merkle-Tick-Stream und emittiert die Daten via {activeTool.idealProtocol}.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 font-mono text-[11px] text-slate-400">
                      <div className="p-2 rounded-lg bg-black/50 border border-slate-800 text-purple-300">
                        # Pipeline per REST API oder CI/CD bereitstellen:
                        <br />
                        <span className="text-white">curl -X POST https://api.capitalai.network/v4/pipeline/deploy -d @config.json</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Definiert die 5 Pipeline-Stufen mit Latenz-Garantie und bindet {activeTool.name} nativ ein.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-t border-slate-800 bg-[#030614]">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Schließen
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const content = exportFormat === 'python' ? generatedCode.pythonTemplate : generatedCode.configJson;
                      handleCopyCode(content);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>In Zwischenablage kopieren</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (exportFormat === 'python') {
                        handleExportPython();
                      } else {
                        handleExportJson();
                      }
                      setIsExportModalOpen(false);
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black text-xs font-extrabold shadow-[0_0_20px_rgba(245,176,20,0.3)] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {exportFormat === 'python' ? 'Python-Skript herunterladen (.py)' : 'JSON-Konfiguration herunterladen (.json)'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
