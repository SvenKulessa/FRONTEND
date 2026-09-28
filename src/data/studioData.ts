/**
 * CAPITAL AI — STUDIO HUB DATA & BLUEPRINT CONTRACTS
 * Contains the 16 Canoncial Data Concepts and the 7 Official Architecture Blueprints.
 */

export interface DataConcept {
  id: number;
  name: string;
  category: 'Echtzeit & Streaming' | 'Konsistenz & Compliance' | 'Storage & Caching' | 'Redundanz & High-Availability' | 'Multi-Modal Intelligence' | 'Screener Contracts' | 'Audit & Event Sourcing' | 'Zeitmodell & Historisierung' | 'KI & Scoring' | 'Architektur & Skalierung' | 'Testing & Validierung' | 'Stammdaten & Symbologie' | 'Governance & Modularität';
  purpose: string;
  example: string;
  details: string;
  bafinCompliance: string;
  latencyTarget: string;
  costImpact: string;
  contractCodeSnippet: string;
  visualFlow: string[];
}

export const DATA_CONCEPTS: DataConcept[] = [
  {
    id: 1,
    name: 'Tiered Live Data',
    category: 'Echtzeit & Streaming',
    purpose: 'Echtzeitdaten mit klaren Verarbeitungsschichten',
    example: 'T1 Ingress → T2 Tick Gate → T3 Fan-out → T4 Client/AI',
    details: 'Strikte Entkopplung des Datenstroms in 4 diskrete Schichten: T1 (Rohdaten-Ingestion via WebSocket von Börsen), T2 (Tick Gate mit 250ms Conflation & Outlier Rejection), T3 (Fan-out Bus via Redis Pub/Sub) und T4 (Client-Rendering im React Dashboard & Gemini KI-Inferenz). Verhindert UI-Stottern und API-Blockaden.',
    bafinCompliance: 'MaRisk AT 7.2 konforme Entkopplung von Ingestion und Auswertung',
    latencyTarget: '< 35 ms E2E',
    costImpact: 'Spart bis zu 85% Egress-Bandbreite durch T2 Conflation (max 4 Ticks/s statt 1.000/s)',
    contractCodeSnippet: `// TIER 1 -> TIER 2 INGESTION CONTRACT (AP-001)
export interface ConflatedTickStream {
  symbol: 'BTC/EUR' | 'AAPL' | 'EUR/USD';
  t1_raw_timestamp_ns: number;
  t2_gate_timestamp_ns: number;
  tick_window_ms: 250;
  conflated_bid: number;
  conflated_ask: number;
  tick_count_in_window: number;
}`,
    visualFlow: ['T1: Raw Ingress', 'T2: Tick Gate (250ms)', 'T3: Fan-Out Bus', 'T4: UI / AI Consumer'],
  },
  {
    id: 2,
    name: 'Authority & Evidence',
    category: 'Konsistenz & Compliance',
    purpose: 'Festlegen, welcher Wert als kanonisch und scorefähig gilt',
    example: 'ProviderConsensus → Snapshot → Evidence → Score',
    details: 'Kein Score wird aus unbestätigten Rohdaten berechnet. Mehrere Datenprovider (z.B. Binance + Kraken + Coinbase) werden über einen Median-Konsensfilter validiert. Ein kanonischer Snapshot mit SHA-256 kryptographischem Fingerprint belegt jeden Score audit-sicher.',
    bafinCompliance: 'Vollständige Revisionssicherheit für algorithmische Empfehlungen nach BaFin MaRisk',
    latencyTarget: '40 - 50 ms',
    costImpact: 'Eliminiert fatale Fehl-Trades durch False-Tick Filterung und Preisausreißer (>1.5%)',
    contractCodeSnippet: `// AUTHORITY PLANE & EVIDENCE FINGERPRINT CONTRACT (AP-002)
export interface CanonicalEvidenceSnapshot {
  consensus_id: string;
  symbol: string;
  canonical_price: number;
  participating_providers: ['binance', 'kraken', 'coinbase'];
  median_deviation_pct: number;
  evidence_sha256: string;
  score_eligible: boolean;
}`,
    visualFlow: ['Provider Consensus', 'Median Filter', 'Canonical Snapshot', 'SHA-256 Fingerprint', 'Scoring Plane'],
  },
  {
    id: 3,
    name: 'Hybrid Data Architecture',
    category: 'Storage & Caching',
    purpose: 'Live-, historische und persistierte Daten kombinieren',
    example: 'WebSocket + Redis + PostgreSQL',
    details: 'Kombiniert extrem schnellen In-Memory Ring-Puffer (Redis) für die letzten 3.600 Ticks mit relationaler TimescaleDB/PostgreSQL für historische Candlesticks (10 Jahre) und On-Demand WebSocket Feeds für Spikes. Die UI fragt hierarchisch erst den Cache ab.',
    bafinCompliance: 'Lückenlose 10-Jahres-Archivierung bei gleichzeitiger Sub-20ms Abfragegeschwindigkeit',
    latencyTarget: '1 - 25 ms (Cache-Hit)',
    costImpact: 'Bleibt garantiert unter 35€ / Monat durch lokalen Redis-Cache vor teuren externen REST-APIs',
    contractCodeSnippet: `// HYBRID MULTI-TIER STORAGE CONTRACT (AP-003)
export interface HybridDataRoute {
  live_stream: 'wss://multiplexer.capital-ai.local';
  short_term_buffer: 'redis://cache:6379/ring_buffer_3600';
  cold_storage: 'postgresql://db:5432/market_candles_history';
  cache_hit_ttl_ms: 1000;
}`,
    visualFlow: ['Live WebSocket Ingest', 'In-Memory Ring Buffer (Redis)', 'TimescaleDB / Postgres Archive', 'Unified Query Gateway'],
  },
  {
    id: 4,
    name: 'Parallel Homogeneous',
    category: 'Redundanz & High-Availability',
    purpose: 'Mehrere gleichartige Datenpfade parallel',
    example: 'Binance + Kraken + Coinbase für denselben BTC-Markt',
    details: 'Gleicher Markt (z.B. BTC/EUR), aber redundante Feeds von 3 separaten Börsen. Erkennt Latenz-Spikes, Flash-Crashes oder Ausfälle sofort und schaltet unterbrechungsfrei auf den schnellsten gesunden Provider um (Fastest-Arrival-Wins).',
    bafinCompliance: 'Ausfallsicherheit nach MaRisk (Zero Single Point of Failure für kritische Feeds)',
    latencyTarget: '18 ms (Fastest-Wins)',
    costImpact: 'Zero zusätzliche API-Kosten durch Nutzung freier Public WebSockets mit Multiplexer',
    contractCodeSnippet: `// PARALLEL HOMOGENEOUS ROUTER CONTRACT
export interface ParallelHomogeneousRouter {
  pair: 'BTC-EUR';
  channels: ['binance_wss', 'kraken_wss', 'coinbase_wss'];
  selection_strategy: 'fastest_healthy_response' | 'median_consensus';
  heartbeat_timeout_ms: 1200;
  active_circuit_breaker: boolean;
}`,
    visualFlow: ['Binance WebSocket', 'Kraken WebSocket', 'Coinbase WebSocket', 'Race Resolver (Fastest Wins)', 'Sanitized Stream'],
  },
  {
    id: 5,
    name: 'Parallel Mixed',
    category: 'Multi-Modal Intelligence',
    purpose: 'Unterschiedliche Datenarten parallel',
    example: 'Preis + Orderbook + News + Fundamentals',
    details: 'Asynchrone Parallelisierung heterogener Datenströme: L1-Tick-Preise, L2-Orderbuchtiefe (Liquiditätswand), Realtime-Nachrichten (RSS/Twitter Sentiment) und Bilanzkennzahlen (SEC 10-K/10-Q) fließen synchron in die KI-Pipeline ein.',
    bafinCompliance: 'Multidimensionale Risiko-Beurteilung vor automatischer Score-Vergabe',
    latencyTarget: '120 ms (Gesamt-Signal)',
    costImpact: 'Selektive Abfrage: Fundamentals nur bei News-Ereignis neu laden spart 90% Quota',
    contractCodeSnippet: `// MULTI-MODAL MARKET SIGNAL CONTRACT
export interface MultiModalMarketSignal {
  symbol: string;
  last_price: number;
  orderbook_imbalance_ratio: number;
  sentiment_score_gemini: number;
  piotroski_f_score: number;
  composite_confidence: number;
}`,
    visualFlow: ['Price Stream', 'L2 Orderbook Depth', 'Financial News RSS', 'SEC Fundamentals', 'Gemini Context Vectorizer'],
  },
  {
    id: 6,
    name: 'Individual Analysis Package',
    category: 'Screener Contracts',
    purpose: 'Eigener Datenvertrag pro Screener/Analysetool',
    example: 'Buffett Value Check mit Fundamentals statt Tickstream',
    details: 'Jedes Tool (Buffett Check, Piotroski F-Score, Scalper Radar) definiert exakt seinen minimalen Datenvertrag (Contract-First). Der Buffett Check benötigt keine Millisekunden-Ticks, sondern 10 Jahre Bilanzen, ROE und FCF.',
    bafinCompliance: 'Datenminimierung nach DSGVO und striktes Zielgruppen-Audit',
    latencyTarget: 'Batch / On-Demand (Cache 4ms)',
    costImpact: 'Spart 92% unnötige WebSocket-Verbindungen bei rein fundamentalen Value-Tools',
    contractCodeSnippet: `// BUFFETT VALUE CHECK INDIVIDUAL PACKAGE CONTRACT
export interface BuffettValueCheckContract {
  target_tool: 'BUFFETT_VALUE_CHECK';
  required_fields: ['roe_10y_avg', 'debt_to_equity', 'fcf_growth', 'moat_rating'];
  update_interval: 'DAILY' | 'QUARTERLY';
  tickstream_required: false;
}`,
    visualFlow: ['Buffett Screener Target', 'Contract-First Filter', 'Targeted Fundamentals Loader', 'DCF / Moat Engine'],
  },
  {
    id: 7,
    name: 'Event-Sourced Market Data',
    category: 'Audit & Event Sourcing',
    purpose: 'Jede Marktänderung als unveränderliches Event speichern',
    example: 'Tick/Event-Journal für Replay und Audit',
    details: 'Der Zustand wird nicht überschrieben, sondern als sequenzieller Append-Only Event-Stream (z.B. TradeExecuted, OrderbookShifted, RatingUpdated) abgelegt. Ermöglicht 100% reproduzierbare historische Berechnungen.',
    bafinCompliance: 'Unveränderbarer Audit-Trail nach WORM-Prinzip (Write Once, Read Many)',
    latencyTarget: 'Sub-10ms Append',
    costImpact: 'Hohe Kompression durch Protocol Buffers & Zstandard Event-Logs',
    contractCodeSnippet: `// EVENT-SOURCED MARKET JOURNAL CONTRACT
export interface MarketEventJournalEntry {
  event_id: string;
  sequence_no: number;
  event_type: 'PRICE_TICK' | 'ORDERBOOK_DELTA' | 'NEWS_FLASH';
  payload_hash: string;
  recorded_at_utc: string;
}`,
    visualFlow: ['Market Action', 'Event Generation', 'Append-Only Event Store', 'Materialized Views / Projections'],
  },
  {
    id: 8,
    name: 'Bitemporal Data',
    category: 'Zeitmodell & Historisierung',
    purpose: '„Wann galt der Wert?“ und „wann wussten wir davon?“ unterscheiden',
    example: 'Fundamentals, Ratings, Korrekturen',
    details: 'Verwaltung von zwei Zeitachsen: Valid Time (Wann war der Quartalsgewinn real gültig?) vs. Transaction Time (Wann hat das System die Information offiziell ingestiert?). Verhindert Look-Ahead-Bias in Backtests.',
    bafinCompliance: 'Verhinderung von Marktmanipulations- und Backtest-Fehlschlüssen nach MiFID II',
    latencyTarget: 'Historisch indexiert',
    costImpact: 'Vermeidet teure Fehlallokationen durch verzerrte historische Analysen',
    contractCodeSnippet: `// BITEMPORAL RECORD CONTRACT
export interface BitemporalRecord {
  symbol: string;
  metric_name: 'net_income';
  valid_from: '2025-12-31';
  transaction_recorded_at: '2026-02-14T08:30:00Z';
  stated_value: 125000000;
  is_restatement: boolean;
}`,
    visualFlow: ['Real-World Event (Valid Time)', 'Filing Publication', 'Ingestion & Stamping (Transaction Time)', 'Bias-Free Time-Travel Engine'],
  },
  {
    id: 9,
    name: 'Time-Series Architecture',
    category: 'Storage & Caching',
    purpose: 'Zeitreihen effizient speichern/abfragen',
    example: 'OHLCV, Volatilität, Indikatoren',
    details: 'Optimierte Zeitreihen-Struktur mit komprimierten Chunks, automatischer Downsampling-Hierarchie (1s -> 1m -> 1h -> 1d) und blitzschneller Fenster-Aggregation für gleitende Durchschnitte (EMA, SMA, Bollinger Bänder).',
    bafinCompliance: 'Lückenlose Archivierung von Marktpreisen nach MiFID II Best-Execution Vorgaben',
    latencyTarget: 'Sub-15ms Window Queries',
    costImpact: '80% Speicherplatz-Ersparnis durch Delta-of-Delta Kompression und Chunking',
    contractCodeSnippet: `// TIME-SERIES CHUNK CONTRACT
export interface TimeSeriesChunk {
  symbol: string;
  granularity: '1m' | '1h' | '1d';
  chunk_start_epoch: number;
  compressed_deltas: string;
  aggregations: { vwap: number; high: number; low: number; volume: number };
}`,
    visualFlow: ['Raw Tick Ingest', '1s Aggregator', '1m / 1h Rollups', 'Compressed Columnar Chunks'],
  },
  {
    id: 10,
    name: 'Snapshot + Delta',
    category: 'Echtzeit & Streaming',
    purpose: 'Vollzustand plus inkrementelle Änderungen',
    example: 'Orderbook Snapshot + WebSocket-Deltas',
    details: 'Vollständiges Orderbuch wird einmalig via REST/Snapshot geladen. Danach werden nur noch inkrementelle Änderungen (Add/Update/Delete) via WebSocket gestreamt. Spart 95% Bandbreite gegenüber Full-Book-Polling.',
    bafinCompliance: 'Fehlerfreie Rekonstruktion der Markttiefe zu jedem Zeitpunkt',
    latencyTarget: '< 20 ms Delta-Apply',
    costImpact: 'Bandbreiten-Kollaps von 50 MB/s auf unter 200 KB/s pro Stream',
    contractCodeSnippet: `// SNAPSHOT + DELTA STREAMING CONTRACT
export interface OrderbookDeltaStream {
  snapshot_sequence: 1048202;
  delta_sequence: 1048203;
  changes: Array<['bids' | 'asks', number /* price */, number /* size */]>;
  checksum: number;
}`,
    visualFlow: ['Initial L2 Snapshot', 'WebSocket Delta Stream', 'Client Local Orderbook Apply', 'Checksum Verification'],
  },
  {
    id: 11,
    name: 'Feature Store',
    category: 'KI & Scoring',
    purpose: 'Berechnete KI-/Scoring-Merkmale zentral verwalten',
    example: 'RSI, Momentum, Value Features, Sentiment',
    details: 'Zentraler Katalog vorberechneter Features sowohl für Online-Inferenz (Sub-5ms Abfrage für Screener) als auch Offline-Training (Batch für KI-Modelle). Keine doppelten Berechnungen in verschiedenen Widgets.',
    bafinCompliance: 'Standardisierte Feature-Definitionen ohne Trainings-/Inferenz-Skew',
    latencyTarget: '< 5 ms Feature Lookup',
    costImpact: 'Reduziert CPU-Auslastung der Scoring-Server um 60%',
    contractCodeSnippet: `// CENTRAL FEATURE STORE CONTRACT
export interface MarketFeatureStoreEntry {
  entity_id: 'BINANCE:BTCUSDT';
  features: {
    rsi_14: 62.4;
    macd_divergence: 0.015;
    whale_accumulation_score: 88;
    news_sentiment_polarity: 0.74;
  };
  computed_at: number;
}`,
    visualFlow: ['Feature Calculation Workers', 'Online Store (Redis)', 'Offline Store (Parquet)', 'Unified SDK Consumption'],
  },
  {
    id: 12,
    name: 'Historical/Lakehouse',
    category: 'Storage & Caching',
    purpose: 'Große historische Datenmengen für Research/Training',
    example: 'Backtests, ML-Training, Benchmark-Datasets',
    details: 'Parquet-basierter Object Storage (S3 / Cloud Storage) mit DuckDB/ClickHouse Engine für massive historische Analysen, Monte-Carlo-Simulationen und das Training von Vorhersagemodellen über Millionen Datensätze.',
    bafinCompliance: 'Langzeit-Sicherung und historische Stresstests für quantitative Algorithmen',
    latencyTarget: 'Columnar Batch Scans',
    costImpact: 'Günstigste Speicherform: ~0,02 € pro Gigabyte/Monat',
    contractCodeSnippet: `// LAKEHOUSE DATASET METADATA CONTRACT
export interface LakehouseDatasetMetadata {
  dataset_id: 'crypto_trades_2020_2025_parquet';
  row_count: 850000000;
  format: 'PARQUET_ZSTD';
  query_engine: 'DUCKDB_WASM';
  partitions: ['year', 'month', 'asset_class'];
}`,
    visualFlow: ['Historical Raw Dumps', 'Parquet / ZSTD Compactor', 'Cloud Object Storage', 'DuckDB In-Browser Engine'],
  },
  {
    id: 13,
    name: 'CQRS / Projection',
    category: 'Architektur & Skalierung',
    purpose: 'Schreibmodell vom Lese-/UI-Modell trennen',
    example: 'Market Authority schreibt; Dashboard liest Projektion',
    details: 'Command Query Responsibility Segregation: Die datenhungrige Ingestion und Konsensfindung schreibt in optimierte interne Datenstrukturen. Für die UI werden maßgeschneiderte, denormalisierte Read-Modelle (Projektionen) bereitgestellt.',
    bafinCompliance: 'Klare Trennung von Datenprüfung und Datenpräsentation',
    latencyTarget: '< 2 ms UI Read',
    costImpact: 'Keine teuren DB-Joins bei Nutzer-Aufrufen im Frontend',
    contractCodeSnippet: `// CQRS READ PROJECTION CONTRACT
export interface DashboardProjectionModel {
  market_id: 'CRYPTO_TOP_50';
  precomputed_ranks: Array<{ rank: number; symbol: string; score: number }>;
  last_projected_at: string;
  cache_etag: string;
}`,
    visualFlow: ['Command (Ingest & Validate)', 'Write Model (Relational / Event)', 'Projection Worker', 'Read Model (Denormalized Cache)'],
  },
  {
    id: 14,
    name: 'Replay / Backtesting',
    category: 'Testing & Validierung',
    purpose: 'Exakte historische Datenströme reproduzieren',
    example: 'Screener gegen historischen Tickstream',
    details: 'Die Pipeline kann in einen "Replay-Modus" geschaltet werden, der vergangene Marktsituationen (z.B. Flash Crash März 2020, FTX-Kollaps Nov 2022) Tick für Tick einspeist, um Alarme und Screener zu validieren.',
    bafinCompliance: 'Nachweis der Robustheit und Risikomodellierung (Stress-Testing nach MaRisk)',
    latencyTarget: '10x - 100x Zeitraffer',
    costImpact: 'Findet Algorithmusschwächen vor dem Live-Deployment und schützt Kapital',
    contractCodeSnippet: `// REPLAY & STRESS TESTING SESSION CONTRACT
export interface ReplaySessionConfig {
  session_id: 'replay_ftx_liquidity_drain';
  start_timestamp: 1667865600;
  end_timestamp: 1668038400;
  speed_multiplier: 5.0;
  injected_jitter_ms: 12;
}`,
    visualFlow: ['Historical Event Store', 'Virtual Clock Sequencer', 'Replay Emitter', 'Pipeline Under Stress Test'],
  },
  {
    id: 15,
    name: 'Reference / Master Data',
    category: 'Stammdaten & Symbologie',
    purpose: 'Instrument-, Börsen- und Symbolidentitäten beherrschen',
    example: 'BTC/USD ↔ XBTUSD ↔ BTCUSDT',
    details: 'Globale Symbologie-Auflösung: Kraken nutzt XBTUSD, Binance BTCUSDT, Börse Stuttgart BTC/EUR. Das Master Data Repository normalisiert alle Ticker auf kanonische UUIDs (ISIN, FIGI, LEI, Unified Symbol).',
    bafinCompliance: 'Eindeutige Identifikation aller Wertpapiere und Kryptoassets nach MiFIR',
    latencyTarget: 'In-Memory Map (< 1 ms)',
    costImpact: 'Verhindert Dubletten und Fehlzuordnungen in Portfolios',
    contractCodeSnippet: `// MASTER INSTRUMENT IDENTITY CONTRACT
export interface MasterInstrumentIdentity {
  canonical_id: 'INST_BTC_SPOT';
  exchange_symbols: {
    kraken: 'XXBTZUSD';
    binance: 'BTCUSDT';
    coinbase: 'BTC-USD';
    boerse_frankfurt: 'BTC.DE';
  };
  figi: 'BBG000BLNNV0';
}`,
    visualFlow: ['Incoming Heterogeneous Tickers', 'Symbology Master Registry', 'Canonical UUID Stamping', 'Uniform System Route'],
  },
  {
    id: 16,
    name: 'Data Mesh / Domain Contracts',
    category: 'Governance & Modularität',
    purpose: 'Datenverantwortung nach Domänen strukturieren',
    example: 'Crypto, Equity, FX, Fundamentals jeweils mit Contract',
    details: 'Dezentrale Datenarchitektur nach Domänen (Krypto, Aktien, Devisen, Fundamentaldaten). Jede Domäne liefert ein standardisiertes Datenprodukt mit SLA-Garantien, Zod-Schema und definierter Fehlerbehandlung.',
    bafinCompliance: 'Klare Zuständigkeiten und Daten-Owner nach MaRisk AT 4.3',
    latencyTarget: 'Domänenspezifisch optimiert',
    costImpact: 'Autonome Skalierung einzelner Domänen ohne Gesamtsystem-Restart',
    contractCodeSnippet: `// DOMAIN DATA PRODUCT CONTRACT
export interface DomainDataProductContract {
  domain: 'EQUITY_FUNDAMENTALS';
  owner: 'Fundamental-Data-Squad';
  sla_availability: 0.999;
  schema_version: 'v2.1.0';
  freshness_seconds: 86400;
  primary_format: 'JSON_SCHEMA_ZOD';
}`,
    visualFlow: ['Crypto Domain Product', 'Equity Domain Product', 'FX Domain Product', 'Federated Governance & Mesh'],
  },
];

export interface StudioBlueprint {
  id: string;
  name: string;
  badge: string;
  category: string;
  description: string;
  targetLatency: string;
  sla: string;
  monthlyCostEur: number;
  costNote: string;
  primaryUseCase: string;
  dataConceptsUsed: string[];
  topologyNodes: Array<{ id: string; name: string; type: string; tier: string }>;
  codeSnippet: string;
}

export const STUDIO_BLUEPRINTS: StudioBlueprint[] = [
  {
    id: 'TIER_1_4_LIVE',
    name: 'Tier 1–4 Live Ingestion & Streaming',
    badge: 'CORE STREAMING',
    category: 'Live Ingestion',
    description: 'Ultra-effiziente Pipeline für Echtzeitkurse mit 250ms Conflation Gate, Redis Pub/Sub Bus und lückenlosem Browser-Streaming.',
    targetLatency: '< 35 ms',
    sla: '99.95%',
    monthlyCostEur: 14.50,
    costNote: 'Free WebSocket Tiers von Binance/Kraken + Minimal Redis Cache',
    primaryUseCase: 'Live Preisticker, Orderflow Scalping, Arbitrage Scanner',
    dataConceptsUsed: ['Tiered Live Data', 'Snapshot + Delta', 'Parallel Homogeneous'],
    topologyNodes: [
      { id: 't1', name: 'T1: Binance / Kraken WSS Ingress', type: 'Ingress', tier: 'Tier 1' },
      { id: 't2', name: 'T2: Tick Gate (250ms Conflation)', type: 'Gate', tier: 'Tier 2' },
      { id: 't3', name: 'T3: Redis Pub/Sub Fan-out Bus', type: 'Bus', tier: 'Tier 3' },
      { id: 't4', name: 'T4: React Client & KI Consumer', type: 'Egress', tier: 'Tier 4' },
    ],
    codeSnippet: `// BLUEPRINT: TIER_1_4_LIVE (Node.js + Redis)
import WebSocket from 'ws';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

let lastTickWindow = 0;
const CONFLATION_MS = 250;

ws.on('message', (data) => {
  const now = Date.now();
  if (now - lastTickWindow >= CONFLATION_MS) {
    lastTickWindow = now;
    const tick = JSON.parse(data.toString());
    redis.publish('market:live:btcusdt', JSON.stringify({
      price: parseFloat(tick.c),
      volume: parseFloat(tick.v),
      timestamp_ns: now * 1_000_000
    }));
  }
});`,
  },
  {
    id: 'AUTHORITY_PLANE',
    name: 'Authority Plane & Consensus Evidence',
    badge: 'COMPLIANCE & AUDIT',
    category: 'Consensus & Compliance',
    description: 'BaFin- und MiCA-konforme Konsensfindung mit 3-Provider Median-Filterung, Ausreißer-Bereinigung und SHA-256 Audit Evidence Hash.',
    targetLatency: '42 ms',
    sla: '99.99%',
    monthlyCostEur: 22.00,
    costNote: 'Serverless Consensus Filter & Encrypted Audit Log Store',
    primaryUseCase: 'BaFin-konforme Screener-Scores, Institutionelle Reports, MiCA Compliance',
    dataConceptsUsed: ['Authority & Evidence', 'Event-Sourced Market Data', 'Bitemporal Data'],
    topologyNodes: [
      { id: 'ap1', name: 'Multi-Exchange Stream Ingress', type: 'Ingress', tier: 'Tier 1' },
      { id: 'ap2', name: 'Median Consensus Gate (3 Feeds)', type: 'Authority', tier: 'Tier 2' },
      { id: 'ap3', name: 'Canonical Snapshot & SHA-256 Store', type: 'Evidence', tier: 'Tier 3' },
      { id: 'ap4', name: 'Audited Scoring Engine (BaFin)', type: 'Scoring', tier: 'Tier 4' },
    ],
    codeSnippet: `// BLUEPRINT: AUTHORITY_PLANE (Evidence Engine)
import crypto from 'crypto';

export function createEvidenceSnapshot(symbol: string, prices: number[]) {
  // 1. Median calculation
  const sorted = [...prices].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  
  // 2. Reject outliers > 1.5%
  const valid = prices.filter(p => Math.abs(p - median) / median < 0.015);
  const canonical = valid.reduce((a, b) => a + b, 0) / valid.length;

  // 3. Cryptographic Fingerprint for BaFin Audit Trail
  const payload = JSON.stringify({ symbol, canonical, ts: Date.now() });
  const sha256 = crypto.createHash('sha256').update(payload).digest('hex');

  return { canonicalPrice: canonical, evidenceHash: sha256, isAuditCompliant: true };
}`,
  },
  {
    id: 'HYBRID',
    name: 'Hybrid Real-Time & Historical Data Plane',
    badge: 'MULTI-TIMEFRAME',
    category: 'Storage & Caching',
    description: 'Intelligente Drei-Stufen-Hierarchie: Redis Ring-Buffer für die letzten 3.600 Ticks, TimescaleDB für historische Kerzen und WebSocket für Live-Spikes.',
    targetLatency: '< 20 ms (Cache)',
    sla: '99.90%',
    monthlyCostEur: 28.50,
    costNote: 'Lokale TimescaleDB + Redis Ring-Puffer auf 35€ VPS',
    primaryUseCase: 'Interaktives Multi-Timeframe Charting (1m bis 10 Jahre), Indikatoren-Berechnung',
    dataConceptsUsed: ['Hybrid Data Architecture', 'Time-Series Architecture', 'Feature Store'],
    topologyNodes: [
      { id: 'hy1', name: 'Live Spike WebSocket Stream', type: 'Ingress', tier: 'Tier 1' },
      { id: 'hy2', name: 'Redis In-Memory Ring Buffer', type: 'Cache', tier: 'Tier 2' },
      { id: 'hy3', name: 'TimescaleDB / Postgres Archive', type: 'Cold Storage', tier: 'Tier 3' },
      { id: 'hy4', name: 'Unified Query Router (Cache-First)', type: 'Gateway', tier: 'Tier 4' },
    ],
    codeSnippet: `// BLUEPRINT: HYBRID (Cache-First Router)
export async function getMarketHistory(symbol: string, timeframe: string) {
  // Check Ring Buffer first (< 5ms)
  const cached = await redis.lrange(\`ring:\${symbol}:\${timeframe}\`, 0, 500);
  if (cached && cached.length > 0) {
    return { source: 'REDIS_RING_BUFFER', data: cached.map(JSON.parse) };
  }

  // Fallback to PostgreSQL TimescaleDB (< 35ms)
  const result = await db.query(
    'SELECT * FROM ohlcv WHERE symbol = $1 AND timeframe = $2 ORDER BY time DESC LIMIT 500',
    [symbol, timeframe]
  );
  return { source: 'TIMESCALE_POSTGRES', data: result.rows };
}`,
  },
  {
    id: 'MIXED_DOMAIN',
    name: 'Mixed Domain Multi-Asset Ingestion',
    badge: 'CROSS-ASSET',
    category: 'Multi-Asset Engine',
    description: 'Harmonisiert heterogene Assetklassen: Krypto (24/7 Millisekunden), Aktien (Handelszeiten & L2 Bilanzen) sowie Makro-Zinsen (EZB/FED).',
    targetLatency: 'Asynchron (25ms - 1s)',
    sla: '99.95%',
    monthlyCostEur: 34.00,
    costNote: 'Twelve Data / Finnhub Starter + FRED API Free Tier',
    primaryUseCase: 'Multi-Asset Portfolio Risk, Makro-Hedging, Krypto/Aktien-Korrelationen',
    dataConceptsUsed: ['Parallel Mixed', 'Data Mesh / Domain Contracts', 'Reference / Master Data'],
    topologyNodes: [
      { id: 'md1', name: 'Crypto Feeds (Binance/Kraken)', type: 'Ingress', tier: 'Tier 1' },
      { id: 'md2', name: 'Equity Feeds (Polygon/Finnhub)', type: 'Ingress', tier: 'Tier 1' },
      { id: 'md3', name: 'Macro Rates (EZB / FRED API)', type: 'Ingress', tier: 'Tier 1' },
      { id: 'md4', name: 'Harmonized Multi-Asset Bus', type: 'Harmonizer', tier: 'Tier 3' },
    ],
    codeSnippet: `// BLUEPRINT: MIXED_DOMAIN (Cross-Asset Normalizer)
export interface HarmonizedCrossAssetTick {
  unified_id: string; // e.g. "BTC" or "AAPL"
  asset_type: 'CRYPTO' | 'EQUITY' | 'MACRO_RATE';
  normalized_eur_price: number;
  liquidity_rating: 'A' | 'B' | 'C';
  macro_correlation_coefficient: number;
}`,
  },
  {
    id: 'PARALLEL_HOMOGENEOUS',
    name: 'Parallel Homogeneous Redundant Consensus',
    badge: 'ZERO-DOWNTIME',
    category: 'High Availability & Redundancy',
    description: 'Drei parallele WebSocket-Kanäle (Binance + Kraken + Coinbase) für denselben Markt mit Race-Condition-Resolver und automatischem Failover.',
    targetLatency: '18 ms (Fastest-Wins)',
    sla: '99.999%',
    monthlyCostEur: 19.00,
    costNote: 'Verbindung zu 3 freien Börsen-Sockets über redundanten VPS',
    primaryUseCase: 'Whale Radar, High-Stakes Trading, Instant Order Execution',
    dataConceptsUsed: ['Parallel Homogeneous', 'Authority & Evidence', 'Snapshot + Delta'],
    topologyNodes: [
      { id: 'ph1', name: 'Binance WSS (Primary)', type: 'Ingress', tier: 'Tier 1' },
      { id: 'ph2', name: 'Kraken WSS (Hot Standby)', type: 'Ingress', tier: 'Tier 1' },
      { id: 'ph3', name: 'Coinbase WSS (Hot Standby)', type: 'Ingress', tier: 'Tier 1' },
      { id: 'ph4', name: 'Race Resolver (Sub-20ms)', type: 'Gate', tier: 'Tier 2' },
    ],
    codeSnippet: `// BLUEPRINT: PARALLEL_HOMOGENEOUS (Race Resolver)
export class MultiProviderRaceResolver {
  private latestSeenTimestamp = 0;

  ingestTick(provider: string, price: number, epochMs: number) {
    // Only accept fresher ticks, dropping laggy duplicate streams
    if (epochMs > this.latestSeenTimestamp) {
      this.latestSeenTimestamp = epochMs;
      return { winner: provider, price, accepted: true };
    }
    return { winner: provider, price, accepted: false, reason: 'LATE_TICK' };
  }
}`,
  },
  {
    id: 'PARALLEL_MIXED',
    name: 'Parallel Mixed Multi-Modal Market Intelligence',
    badge: 'AI REASONING',
    category: 'KI & Multi-Modal',
    description: 'Führt Raw Ticks, L2 Orderbuchtiefe, Realtime-News und SEC 10-K Bilanzdaten in einen gemeinsamen Kontextvektor für KI-gestütztes Reasonig zusammen.',
    targetLatency: '110 ms',
    sla: '99.85%',
    monthlyCostEur: 32.00,
    costNote: 'Batch Gemini API + Realtime RSS + WebSockets',
    primaryUseCase: 'KI-Sentiment-Analyse, Earnings Impact Predictor, Smart Money Tracking',
    dataConceptsUsed: ['Parallel Mixed', 'Feature Store', 'Event-Sourced Market Data'],
    topologyNodes: [
      { id: 'pm1', name: 'Tick & Orderbook Stream', type: 'Ingress', tier: 'Tier 1' },
      { id: 'pm2', name: 'Realtime Financial News Stream', type: 'Ingress', tier: 'Tier 1' },
      { id: 'pm3', name: 'SEC EDGAR Fundamentals Ingest', type: 'Ingress', tier: 'Tier 1' },
      { id: 'pm4', name: 'Gemini Context Vectorizer & Scorer', type: 'AI Reasoning', tier: 'Tier 4' },
    ],
    codeSnippet: `// BLUEPRINT: PARALLEL_MIXED (AI Context Combiner)
export async function buildMultiModalContext(ticker: string) {
  const [ticks, orderbook, news, fundamentals] = await Promise.all([
    fetchRecentTicks(ticker),
    fetchOrderbookDepth(ticker),
    fetchLatestNewsRss(ticker),
    fetchSecFinancials(ticker),
  ]);

  return {
    promptContext: \`Marktlage \${ticker}: Preis \${ticks.last}, Spread \${orderbook.spread}, Sentiment \${news.headline}, KGV \${fundamentals.pe}\`,
    readyForGemini: true
  };
}`,
  },
  {
    id: 'INDIVIDUAL_PACKAGE',
    name: 'Individual Analysis Package Contract',
    badge: 'ZERO-WASTE',
    category: 'Screener Contracts',
    description: 'Spezifischer Datenvertrag für fundamentale Screener wie den Buffett Value Check oder Piotroski F-Score ohne unnötigen Millisekunden-Ballast.',
    targetLatency: 'On-Demand (Cache 4ms)',
    sla: '99.95%',
    monthlyCostEur: 8.50,
    costNote: 'Verbraucht minimalste Quota durch targeted Field Requests',
    primaryUseCase: 'Buffett Value Check, Peter Lynch Screener, Dividenden-Aristokraten',
    dataConceptsUsed: ['Individual Analysis Package', 'CQRS / Projection', 'Reference / Master Data'],
    topologyNodes: [
      { id: 'ip1', name: 'Targeted Balance Sheet Ingester', type: 'Ingress', tier: 'Tier 1' },
      { id: 'ip2', name: 'Piotroski & Moat Evaluator', type: 'Analytics', tier: 'Tier 2' },
      { id: 'ip3', name: 'Cached Screener Read-Model', type: 'Projection', tier: 'Tier 3' },
      { id: 'ip4', name: 'Buffett Value Check UI Card', type: 'Client', tier: 'Tier 4' },
    ],
    codeSnippet: `// BLUEPRINT: INDIVIDUAL_PACKAGE (Buffett Screener Contract)
export interface BuffettScreenerContract {
  symbol: string;
  roe_10y_median: number;       // Benchmark: > 15%
  debt_to_equity: number;       // Benchmark: < 0.8
  free_cash_flow_growth_5y: number; // Benchmark: > 10%
  economic_moat: 'WIDE' | 'NARROW' | 'NONE';
  margin_of_safety_pct: number;
}`,
  },
];
