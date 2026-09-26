/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Central Node Catalog Registry, Metadata, Ports & Config Validators
 */

import { z } from 'zod';
import { NodePort } from './common';
import { NodeCategory, PipelineNode } from './pipeline';

// Import All Config Schemas
import {
  ProviderRestConfigSchema,
  ProviderWebsocketConfigSchema,
  RssFeedConfigSchema,
  FileUploadConfigSchema,
  CsvImportConfigSchema,
  ManualInputConfigSchema,
  BlockchainRpcConfigSchema,
  GraphqlSubgraphConfigSchema,
  SocialApiConfigSchema,
  NewsApiConfigSchema,
  MacroApiConfigSchema,
  GithubApiConfigSchema,
  Ga4McpConfigSchema,
  SearchConsoleApiConfigSchema,
} from './nodes/ingestion';

import {
  ProviderRegistryConfigSchema,
  ProviderMatrixConfigSchema,
  RateLimitBudgetConfigSchema,
  CircuitBreakerConfigSchema,
  RequestCoalescerConfigSchema,
  MarketDataCacheConfigSchema,
  SchemaValidatorConfigSchema,
  FreshnessValidatorConfigSchema,
  SequenceValidatorConfigSchema,
  ProviderConsensusConfigSchema,
  DataQualityGateConfigSchema,
  EvidenceWriterConfigSchema,
} from './nodes/authority';

import {
  CanonicalNormalizerConfigSchema,
  AssetResolverConfigSchema,
  TaxonomyRouterConfigSchema,
  TimeframeResamplerConfigSchema,
  CurrencyConverterConfigSchema,
  UnitConverterConfigSchema,
  OutlierWinsorizerConfigSchema,
  FeatureBuilderConfigSchema,
  EnrichmentJoinConfigSchema,
} from './nodes/transformation';

import {
  OrderflowDeltaConfigSchema,
  VwapBandsConfigSchema,
  VolatilitySurfaceConfigSchema,
  MacroCreditConfigSchema,
  SentimentNlpConfigSchema,
  SmartMoneyTrackerConfigSchema,
  MultiFactorScoreConfigSchema,
} from './nodes/analytics';

import {
  PatternRecognitionConfigSchema,
  RegimeClassifierConfigSchema,
  AnomalyDetectorConfigSchema,
  LlmReasonerConfigSchema,
} from './nodes/reasoning';

import {
  HumanApprovalGateConfigSchema,
  MaxDrawdownStopConfigSchema,
  VolatilityCircuitConfigSchema,
  RegulatorySanctionFilterConfigSchema,
  PositionLimitGateConfigSchema,
} from './nodes/risk';

import {
  HistoricalBacktestRunnerConfigSchema,
  BenchmarkComparatorConfigSchema,
  MonteCarloSimulatorConfigSchema,
  PaperBrokerAdapterConfigSchema,
} from './nodes/backtest';

import {
  TargetAdapterTradingViewConfigSchema,
  TargetAdapterBloombergConfigSchema,
  TargetAdapterPythonArrowConfigSchema,
  TargetAdapterMetaTraderConfigSchema,
  TargetAdapterBookmapConfigSchema,
  AlertDispatcherConfigSchema,
  ReportPdfGeneratorConfigSchema,
} from './nodes/egress';

export interface NodeCatalogDescriptor {
  type: string;
  category: NodeCategory;
  name: string;
  badge: string;
  description: string;
  color: string;
  iconName: string;
  configSchema: z.ZodType<any>;
  defaultConfig: Record<string, any>;
  defaultInputs: NodePort[];
  defaultOutputs: NodePort[];
}

export const NODE_CATALOG: Record<string, NodeCatalogDescriptor> = {
  // ===========================================================================
  // 1. INGESTION (14 NODES)
  // ===========================================================================
  provider_websocket: {
    type: 'provider_websocket',
    category: 'ingestion',
    name: 'WebSocket Feed Ingestion',
    badge: 'Real-Time Streaming',
    description: 'High-Throughput WebSocket Stream mit automatischer Reconnect-Logik und Heartbeat.',
    color: '#00E5FF',
    iconName: 'Radio',
    configSchema: ProviderWebsocketConfigSchema,
    defaultConfig: {
      endpointUrl: 'wss://stream.binance.com:9443/ws/!ticker@arr',
      subscriptionPayload: { method: 'SUBSCRIBE', params: ['!ticker@arr'], id: 1 },
      reconnectIntervalMs: 2000,
      heartbeatIntervalMs: 15000,
      sequenceValidation: true,
      targetAssetClass: 'crypto',
      symbols: ['BTCUSDT', 'ETHUSDT'],
      channelType: 'trades',
    },
    defaultInputs: [],
    defaultOutputs: [
      { id: 'ticks_out', name: 'Raw Ticks', type: 'tick_stream', direction: 'out', required: true },
    ],
  },
  provider_rest: {
    type: 'provider_rest',
    category: 'ingestion',
    name: 'REST Polling Gateway',
    badge: 'Snapshot Ingest',
    description: 'Periodischer REST API Poller mit Rate-Limit Backoff und Jitter-Kompensation.',
    color: '#00E5FF',
    iconName: 'Server',
    configSchema: ProviderRestConfigSchema,
    defaultConfig: {
      endpointUrl: 'https://api.twelvedata.com/quote',
      method: 'GET',
      pollIntervalMs: 2000,
      authType: 'api_key_header',
      targetAssetClass: 'equity_us',
      symbols: ['NVDA', 'AAPL'],
      timeoutMs: 2500,
      maxRetries: 3,
    },
    defaultInputs: [],
    defaultOutputs: [
      { id: 'quotes_out', name: 'Price Quotes', type: 'tick_stream', direction: 'out', required: true },
    ],
  },
  rss_feed: {
    type: 'rss_feed',
    category: 'ingestion',
    name: 'Financial RSS Reader',
    badge: 'News Wire',
    description: 'Automatisierter RSS/Atom-Feed Parser für Ad-Hoc Meldungen und Unternehmensberichte.',
    color: '#00E5FF',
    iconName: 'Rss',
    configSchema: RssFeedConfigSchema,
    defaultConfig: {
      feedUrls: ['https://feeds.reuters.com/news/wealth'],
      pollIntervalMinutes: 10,
      stripHtml: true,
      maxItemsPerBatch: 20,
    },
    defaultInputs: [],
    defaultOutputs: [
      { id: 'news_out', name: 'News Stream', type: 'news_event', direction: 'out', required: true },
    ],
  },
  blockchain_rpc: {
    type: 'blockchain_rpc',
    category: 'ingestion',
    name: 'Blockchain RPC Listener',
    badge: 'On-Chain RPC',
    description: 'Direkte Node-Verbindung zu EVM/Solana Blockchains für Block-Events und Mempool-Überwachung.',
    color: '#00E5FF',
    iconName: 'Link',
    configSchema: BlockchainRpcConfigSchema,
    defaultConfig: {
      network: 'ethereum',
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo',
      eventSignatures: ['Swap(address,uint256,uint256,uint256,uint256,address)'],
      targetContractAddresses: ['0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'],
      confirmationsRequired: 1,
    },
    defaultInputs: [],
    defaultOutputs: [
      { id: 'events_out', name: 'On-Chain Events', type: 'onchain_tx', direction: 'out', required: true },
    ],
  },
  macro_api: {
    type: 'macro_api',
    category: 'ingestion',
    name: 'Macro FRED / ECB Feed',
    badge: 'Macroeconomics',
    description: 'Makroökonomische Datenreihen wie Zinsstrukturkurven, Inflation (CPI) und M2 Geldmenge.',
    color: '#00E5FF',
    iconName: 'Globe',
    configSchema: MacroApiConfigSchema,
    defaultConfig: {
      seriesId: 'T10Y2Y',
      frequency: 'daily',
      fillForwardMissing: true,
    },
    defaultInputs: [],
    defaultOutputs: [
      { id: 'macro_out', name: 'Macro Series', type: 'macro_series', direction: 'out', required: true },
    ],
  },

  // ===========================================================================
  // 2. AUTHORITY & DATA QUALITY (12 NODES)
  // ===========================================================================
  provider_consensus: {
    type: 'provider_consensus',
    category: 'authority',
    name: 'Provider Quorum Consensus',
    badge: 'Consensus Gate (AP-002)',
    description: 'Multi-Source Median Filter zur Eliminierung von Arbitrage-Fehlern und Flash-Spikes.',
    color: '#21D07A',
    iconName: 'ShieldCheck',
    configSchema: ProviderConsensusConfigSchema,
    defaultConfig: {
      minRequiredProviders: 3,
      aggregationMethod: 'median',
      maxAllowedDivergenceBps: 35,
      rejectOutlierProviders: true,
    },
    defaultInputs: [
      { id: 'in_raw_ticks', name: 'Raw Feeds', type: 'tick_stream', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_consensus_ticks', name: 'Consensus Ticks', type: 'tick_stream', direction: 'out', required: true },
    ],
  },
  evidence_writer: {
    type: 'evidence_writer',
    category: 'authority',
    name: 'Merkle Evidence Gate',
    badge: 'Cryptographic Audit (AP-002)',
    description: 'Bündelt Ticks kryptografisch mit SHA-256 Merkle-Bäumen für revisionssichere Nachweise.',
    color: '#A78BFA',
    iconName: 'Lock',
    configSchema: EvidenceWriterConfigSchema,
    defaultConfig: {
      merkleTreeDepth: 16,
      hashAlgorithm: 'sha256',
      writeBatchIntervalMs: 100,
      persistAuditLogToDisk: true,
      zkProofGenerationEligible: false,
    },
    defaultInputs: [
      { id: 'in_ticks', name: 'Validated Ticks', type: 'tick_stream', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_evidence', name: 'Evidence Packet', type: 'evidence_packet', direction: 'out', required: true },
    ],
  },
  data_quality_gate: {
    type: 'data_quality_gate',
    category: 'authority',
    name: 'Data Quality Gate (DQS)',
    badge: 'Quality Barrier',
    description: 'Erzwingt minimale DQS-Schwellenwerte (Freshness, Vollständigkeit, Konsens) vor Weiterleitung.',
    color: '#21D07A',
    iconName: 'CheckCircle',
    configSchema: DataQualityGateConfigSchema,
    defaultConfig: {
      minPassingDqsScore: 98.0,
      weightFreshness: 0.35,
      weightConsensus: 0.35,
      weightCompleteness: 0.30,
      rejectBelowPassing: true,
    },
    defaultInputs: [
      { id: 'in_data', name: 'Candidate Stream', type: 'tick_stream', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_passed', name: 'Approved Stream', type: 'tick_stream', direction: 'out', required: true },
    ],
  },
  rate_limit_budget: {
    type: 'rate_limit_budget',
    category: 'authority',
    name: 'Budget & Rate Limiter',
    badge: 'Cost Guard (AP-006)',
    description: 'Hält das monatliche Ingest-Budget strikt unter 40 EUR über Token-Bucket-Verfahren.',
    color: '#FFB020',
    iconName: 'Coins',
    configSchema: RateLimitBudgetConfigSchema,
    defaultConfig: {
      monthlyBudgetCapEur: 35.0,
      tokensPerMinute: 120,
      burstBucketCapacity: 30,
      dropStrategy: 'queue_buffered',
    },
    defaultInputs: [
      { id: 'in_requests', name: 'Requests', type: 'tick_stream', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_governed', name: 'Governed Stream', type: 'tick_stream', direction: 'out', required: true },
    ],
  },

  // ===========================================================================
  // 3. TRANSFORMATION (9 NODES)
  // ===========================================================================
  canonical_normalizer: {
    type: 'canonical_normalizer',
    category: 'transformation',
    name: 'Canonical Normalizer',
    badge: 'Format Unifier',
    description: 'Bringt disparate Datenquellen in ein einheitliches nanosekunden-präzises Datenformat.',
    color: '#38BDF8',
    iconName: 'Layers',
    configSchema: CanonicalNormalizerConfigSchema,
    defaultConfig: {
      targetFormat: 'standard_l1_tick',
      enforceNanNullCheck: true,
      timestampNormalization: 'nanoseconds',
    },
    defaultInputs: [
      { id: 'in_raw', name: 'Raw Inbound', type: 'tick_stream', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_normalized', name: 'Normalized Stream', type: 'tick_stream', direction: 'out', required: true },
    ],
  },
  timeframe_resampler: {
    type: 'timeframe_resampler',
    category: 'transformation',
    name: 'Timeframe Resampler',
    badge: 'OHLCV Aggregator',
    description: 'Aggregiert kontinuierliche Ticks in Standard-Kerzen (1s bis 1d) oder Tick-Volume-Bars.',
    color: '#38BDF8',
    iconName: 'BarChart2',
    configSchema: TimeframeResamplerConfigSchema,
    defaultConfig: {
      targetTimeframe: '1m',
      aggregationStyle: 'time_bucketed',
      emitPartialCandleOnUpdate: false,
    },
    defaultInputs: [
      { id: 'in_ticks', name: 'Tick Stream', type: 'tick_stream', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_candles', name: 'OHLCV Candles', type: 'ohlcv_candle', direction: 'out', required: true },
    ],
  },
  feature_builder: {
    type: 'feature_builder',
    category: 'transformation',
    name: 'Sliding Window Feature Builder',
    badge: 'Feature Engineering',
    description: 'Berechnet Log-Returns, Rolling Volatilität und Spread-Bps in Zero-Copy Ringspeichern.',
    color: '#38BDF8',
    iconName: 'Sliders',
    configSchema: FeatureBuilderConfigSchema,
    defaultConfig: {
      slidingWindowSize: 50,
      enabledFeatures: ['log_returns', 'rolling_volatility', 'volume_imbalance'],
    },
    defaultInputs: [
      { id: 'in_candles', name: 'Candle Stream', type: 'ohlcv_candle', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_features', name: 'Feature Vector', type: 'feature_vector', direction: 'out', required: true },
    ],
  },

  // ===========================================================================
  // 4. ANALYTICS & SCORING
  // ===========================================================================
  orderflow_delta: {
    type: 'orderflow_delta',
    category: 'analytics',
    name: 'Order Flow Cumulative Delta',
    badge: 'L2 Liquidity',
    description: 'Echtzeit-Tracking von agressivem Kauf- und Verkaufsdruck über Cumulative Volume Delta (CVD).',
    color: '#F43F5E',
    iconName: 'Activity',
    configSchema: OrderflowDeltaConfigSchema,
    defaultConfig: {
      calculationMode: 'cumulative_volume_delta',
      depthLevels: 10,
      imbalanceRatioThreshold: 3.0,
      resetSessionDaily: true,
    },
    defaultInputs: [
      { id: 'in_depth', name: 'L2 Depth Stream', type: 'orderbook_l2', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_delta', name: 'CVD Metric', type: 'score_metric', direction: 'out', required: true },
    ],
  },
  multi_factor_score: {
    type: 'multi_factor_score',
    category: 'analytics',
    name: 'Multi-Factor Alpha Synthesizer',
    badge: 'Explainable Score (AP-002)',
    description: 'Synthetisiert technische, fundamentale, Sentiment- und On-Chain-Faktoren mit voller Nachvollziehbarkeit.',
    color: '#F59E0B',
    iconName: 'Sparkles',
    configSchema: MultiFactorScoreConfigSchema,
    defaultConfig: {
      weights: {
        technicalWeight: 0.35,
        fundamentalWeight: 0.25,
        sentimentWeight: 0.20,
        onChainSmartMoneyWeight: 0.20,
      },
      scale: '0_to_100',
      requireAllFactorsForOutput: true,
      explainabilityAuditDrawer: true,
    },
    defaultInputs: [
      { id: 'in_features', name: 'Feature Vector', type: 'feature_vector', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_score', name: 'Composite Score', type: 'score_metric', direction: 'out', required: true },
    ],
  },

  // ===========================================================================
  // 5. REASONING & MODELS
  // ===========================================================================
  pattern_recognition: {
    type: 'pattern_recognition',
    category: 'reasoning',
    name: 'Pattern & Order Block Recognizer',
    badge: 'Structure Scanner',
    description: 'Erkennt Fair Value Gaps, Order Blocks, Wyckoff Accumulation und Head & Shoulders.',
    color: '#8B5CF6',
    iconName: 'TrendingUp',
    configSchema: PatternRecognitionConfigSchema,
    defaultConfig: {
      detectedPatterns: ['order_block_imbalance', 'fair_value_gap', 'bull_bear_flag'],
      minConfidencePercent: 80,
      lookbackBars: 120,
    },
    defaultInputs: [
      { id: 'in_candles', name: 'Candle Stream', type: 'ohlcv_candle', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_signals', name: 'Pattern Signals', type: 'signal_event', direction: 'out', required: true },
    ],
  },

  // ===========================================================================
  // 6. RISK & GUARDRAILS (AP-004, AP-008)
  // ===========================================================================
  human_approval_gate: {
    type: 'human_approval_gate',
    category: 'risk',
    name: 'Human Approval Gate',
    badge: 'Human-in-the-Loop (AP-004)',
    description: 'Erzwingt manuelle Bestätigung eines menschlichen Operators für irreversible Aktionen.',
    color: '#EF4444',
    iconName: 'ShieldAlert',
    configSchema: HumanApprovalGateConfigSchema,
    defaultConfig: {
      approvalType: 'paper_order_routing',
      timeoutMinutes: 60,
      fallbackActionOnTimeout: 'auto_reject',
      requiredRole: 'portfolio_manager',
      multiSigRequiredSignatures: 1,
    },
    defaultInputs: [
      { id: 'in_candidate_signal', name: 'Candidate Signal', type: 'signal_event', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_approved_order', name: 'Approved Execution', type: 'paper_order', direction: 'out', required: true },
    ],
  },
  max_drawdown_stop: {
    type: 'max_drawdown_stop',
    category: 'risk',
    name: 'Maximum Drawdown Circuit',
    badge: 'Capital Protection',
    description: 'Stoppt automatisierte Pipelines bei Überschreiten des maximal tolerierten Portfolio-Drawdowns.',
    color: '#EF4444',
    iconName: 'AlertTriangle',
    configSchema: MaxDrawdownStopConfigSchema,
    defaultConfig: {
      maxDrawdownPercent: 5.0,
      evaluationWindowDays: 30,
      actionOnBreach: 'halt_pipeline',
    },
    defaultInputs: [
      { id: 'in_reports', name: 'Execution Reports', type: 'execution_report', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_circuit_state', name: 'Circuit State', type: 'signal_event', direction: 'out', required: true },
    ],
  },

  // ===========================================================================
  // 7. BENCHMARK & BACKTEST (AP-005)
  // ===========================================================================
  paper_broker_adapter: {
    type: 'paper_broker_adapter',
    category: 'backtest',
    name: 'Paper Trading Engine',
    badge: 'Virtual Execution (AP-005)',
    description: 'Simulierte Orderausführung ohne Echtrisiko mit konfigurierbaren Latenzen und Slippage.',
    color: '#10B981',
    iconName: 'DollarSign',
    configSchema: PaperBrokerAdapterConfigSchema,
    defaultConfig: {
      virtualAccountId: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
      initialBalanceEur: 50000,
      allowFractionalShares: true,
      fillLatencySimulatedMs: 45,
      persistOrderBookAudit: true,
    },
    defaultInputs: [
      { id: 'in_orders', name: 'Paper Orders', type: 'paper_order', direction: 'in', required: true },
    ],
    defaultOutputs: [
      { id: 'out_fills', name: 'Execution Reports', type: 'execution_report', direction: 'out', required: true },
    ],
  },

  // ===========================================================================
  // 8. EGRESS & PRESENTATION
  // ===========================================================================
  target_adapter_tradingview: {
    type: 'target_adapter_tradingview',
    category: 'egress',
    name: 'TradingView Webhook & UDF',
    badge: 'Charting Egress',
    description: 'Nativer Egress-Adapter für TradingView Charts und PineScript Webhook-Triggering.',
    color: '#6366F1',
    iconName: 'ExternalLink',
    configSchema: TargetAdapterTradingViewConfigSchema,
    defaultConfig: {
      protocol: 'WebSocket (WSS) & PineScript Webhook Relay',
      format: 'UDF / Lightweight OHLCV + Ticks',
      enableCustomPinePlots: true,
    },
    defaultInputs: [
      { id: 'in_scores', name: 'Processed Data', type: 'score_metric', direction: 'in', required: true },
    ],
    defaultOutputs: [],
  },
  target_adapter_python_arrow: {
    type: 'target_adapter_python_arrow',
    category: 'egress',
    name: 'Apache Arrow Flight & ZeroMQ',
    badge: 'Python Quant Egress',
    description: 'Zero-Copy PyArrow Flight Server für ultraschnelle Pandas/Polars Ingestion in Sub-10ms.',
    color: '#6366F1',
    iconName: 'Terminal',
    configSchema: TargetAdapterPythonArrowConfigSchema,
    defaultConfig: {
      protocol: 'Apache Arrow Flight & ZeroMQ PUB/SUB',
      format: 'Zero-Copy PyArrow RecordBatches',
      flightLocationUri: 'grpc://127.0.0.1:8815',
      zeroCopySharedMemory: true,
    },
    defaultInputs: [
      { id: 'in_ticks', name: 'Tick Stream', type: 'tick_stream', direction: 'in', required: true },
    ],
    defaultOutputs: [],
  },
  report_pdf_generator: {
    type: 'report_pdf_generator',
    category: 'egress',
    name: 'Institutional PDF Report',
    badge: 'Audit Export (AP-002)',
    description: 'Generiert druckfertige Vektor-PDFs inklusive Merkle Evidence Log und WpHG-Disclaimern.',
    color: '#6366F1',
    iconName: 'FileText',
    configSchema: ReportPdfGeneratorConfigSchema,
    defaultConfig: {
      templateStyle: 'institutional_dark',
      includeEvidenceMerkleProofs: true,
      includeExplainabilityDrawer: true,
      includeDisclaimersAndWphg: true,
      paperTradingAuditTrail: true,
    },
    defaultInputs: [
      { id: 'in_scores', name: 'Verified Scores', type: 'score_metric', direction: 'in', required: true },
      { id: 'in_evidence', name: 'Merkle Audit Log', type: 'evidence_packet', direction: 'in', required: true },
    ],
    defaultOutputs: [],
  },
};

/**
 * Factory to instantiate a fresh validated PipelineNode from the catalog
 */
export function createPipelineNode(
  type: string,
  position: { x: number; y: number },
  customConfig?: Record<string, any>
): PipelineNode {
  const descriptor = NODE_CATALOG[type];
  if (!descriptor) {
    throw new Error(`Unbekannter Knoten-Typ im Katalog: "${type}"`);
  }

  const rawConfig = { ...descriptor.defaultConfig, ...(customConfig || {}) };
  // Validate config with descriptor Zod schema
  const parsedConfig = descriptor.configSchema.parse(rawConfig);

  const nodeId = `${type}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    id: nodeId,
    type: descriptor.type,
    category: descriptor.category,
    label: descriptor.name,
    description: descriptor.description,
    config: parsedConfig,
    inputs: JSON.parse(JSON.stringify(descriptor.defaultInputs)),
    outputs: JSON.parse(JSON.stringify(descriptor.defaultOutputs)),
    position,
    status: 'valid',
  };
}
