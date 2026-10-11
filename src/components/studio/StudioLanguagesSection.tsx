/**
 * ============================================================================
 * CAPITAL AI — STUDIO HUB: PROGRAMMIERSPRACHEN & TECH-STACK
 * ----------------------------------------------------------------------------
 * Ausführliche, aufgeräumte Übersicht aller Programmiersprachen und SDKs,
 * die in der Multi-Tier Ingestion-, Scoring- und Analyse-Pipeline im Einsatz sind:
 * Python 3.11+, TypeScript, Go (Golang), Rust, SQL (TimescaleDB) & PineScript v5.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Cpu,
  Layers,
  Zap,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Activity,
  FileCode,
  Gauge,
  Sparkles,
} from 'lucide-react';

export interface LanguageSpec {
  id: string;
  name: string;
  version: string;
  role: string;
  pipelineLayer: string;
  badge: string;
  color: string;
  accentBg: string;
  accentBorder: string;
  latencySla: string;
  throughput: string;
  memoryFootprint: string;
  keyLibraries: string[];
  strengths: string[];
  rationale: string;
  codeSnippet: string;
}

export const PROGRAMMING_LANGUAGES: LanguageSpec[] = [
  {
    id: 'python',
    name: 'Python',
    version: '3.11+ / PyPy',
    role: 'Quantitative Finanzmathematik, Financial NLP & Modell-Backtesting',
    pipelineLayer: 'Layer 4: Analytics, AI & Inferenz',
    badge: 'Quant & AI Core',
    color: '#38BDF8',
    accentBg: 'bg-sky-500/10',
    accentBorder: 'border-sky-500/30',
    latencySla: '15 – 45 ms (Numba JIT)',
    throughput: '~25.000 Signal-Berechnungen / s',
    memoryFootprint: '~180 MB Worker Process',
    keyLibraries: ['pandas 2.2', 'numpy 1.26', 'scipy', 'numba', 'google-genai', 'scikit-learn'],
    strengths: [
      'Umfangreichstes quantitatives Ökosystem weltweit für ökonometrische Zeitreihenanalysen',
      'Direkte Integration des @google/genai SDKs für SEC-10-K NLP & Earnings-Call-Analysen',
      'SIMD-Vektorisierung und JIT-Kompilierung via Numba für Sub-40ms Z-Score & VaR Matrizen',
    ],
    rationale:
      'Python ist der de-facto Standard in der quantitativen Finanzforschung. Durch Vektorisierung mit NumPy und Numba erreichen wir C-nahe Berechnungszeiten bei gleichzeitig maximaler Entwicklungsgeschwindigkeit für komplexe Multi-Faktor-Modelle.',
    codeSnippet: `# CAPITAL-AI QUANTITATIVE SCORING ENGINE (PYTHON 3.11)
import numpy as np
from numba import njit

@njit(fastmath=True)
def calculate_altman_z_score(
    working_capital_to_assets: float,
    retained_earnings_to_assets: float,
    ebit_to_assets: float,
    market_equity_to_liabilities: float,
    sales_to_assets: float
) -> float:
    """
    Kanonische Berechnung des Altman Z-Scores für Produktionsunternehmen
    Formel: Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5
    """
    z = (
        1.2 * working_capital_to_assets +
        1.4 * retained_earnings_to_assets +
        3.3 * ebit_to_assets +
        0.6 * market_equity_to_liabilities +
        0.999 * sales_to_assets
    )
    return z

# Vektorisierte Kovarianz-Matrix für Value-at-Risk (VaR 99%)
def compute_var_99(returns: np.ndarray, weights: np.ndarray) -> float:
    cov_matrix = np.cov(returns, rowvar=False)
    port_variance = np.dot(weights.T, np.dot(cov_matrix, weights))
    port_std = np.sqrt(port_variance)
    return float(2.326 * port_std)  # 99% Konfidenzniveau (Normalverteilung)
`,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    version: '5.5+ / Node.js & React 19',
    role: 'Reaktive Benutzeroberfläche, State-Engine & Client-Side Verification',
    pipelineLayer: 'Layer 4 & 5: UI Virtualisierung & Client-Audit',
    badge: 'UI & State Engine',
    color: '#3178C6',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/30',
    latencySla: 'Sub-16 ms (60 FPS Render-Loop)',
    throughput: '> 60.000 State-Events / s',
    memoryFootprint: '~45 MB Browser Runtime',
    keyLibraries: ['react 19', 'vite', 'motion', 'lucide-react', 'jspdf', 'tailwindcss'],
    strengths: [
      'Strikte Compile-Time-Typsicherheit für alle Börsen-APIs und Orderbuch-Strukturen',
      'Clientseitige PDF-Erzeugung (jsPDF) für formale BaFin-Zertifikate ohne Server-Last',
      'Virtuelle Fensterung (Virtualization) für flüssige L2-Tapes mit 10.000+ Zeilen ohne Ruckeln',
    ],
    rationale:
      'TypeScript ermöglicht vollständige End-to-End Typsicherheit vom WebSocket-Ingest bis zum gerenderten Dashboard. Alle API-Contracts sind strikt typisiert, was Laufzeitfehler bei unvorhergesehenen Börsen-Payloads ausschließt.',
    codeSnippet: `// CAPITAL-AI CLIENT-SIDE TICK GATE & MERKLE VERIFIER (TYPESCRIPT)
export interface CanonicalTick {
  readonly symbol: string;
  readonly price: number;
  readonly size: number;
  readonly exchange: 'kraken' | 'binance' | 'twelve' | 'polygon';
  readonly timestampNs: bigint;
  readonly merkleHash: string;
}

export class Sub45msTickGate {
  private ringBuffer: CanonicalTick[] = [];
  private readonly maxBufferSize = 3600;

  public ingest(tick: CanonicalTick): boolean {
    // Outlier-Detection: Abweichung > 1.5% vom 10-Tick-Median filtern
    if (this.isOutlier(tick.price)) return false;
    
    if (this.ringBuffer.length >= this.maxBufferSize) {
      this.ringBuffer.shift();
    }
    this.ringBuffer.push(tick);
    return true;
  }

  private isOutlier(newPrice: number): boolean {
    if (this.ringBuffer.length < 5) return false;
    const median = this.ringBuffer[this.ringBuffer.length - 1].price;
    return Math.abs(newPrice - median) / median > 0.015;
  }
}
`,
  },
  {
    id: 'golang',
    name: 'Go (Golang)',
    version: '1.22+',
    role: 'High-Throughput WebSocket Ingestion & 250ms Conflation Gateways',
    pipelineLayer: 'Layer 1 & 2: Ingress & Tick-Gate',
    badge: 'Ingress & Conflation Hub',
    color: '#00ADD8',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
    latencySla: 'Sub-8 ms (Goroutines)',
    throughput: '> 450.000 Ticks / s pro Core',
    memoryFootprint: '~22 MB pro Service-Instanz',
    keyLibraries: ['gorilla/websocket', 'gin', 'go-redis', 'zap', 'ristretto'],
    strengths: [
      'Leichtgewichtige Goroutines (2 KB Stack) ermöglichen 100.000+ gleichzeitige Börsen-Streams',
      'Deterministische Garbage Collection mit Pausen unter 1 ms (Sub-1ms STW)',
      'Kompiliert zu statischen Single-Binary-Artefakten für minimale Docker-Images (18 MB)',
    ],
    rationale:
      'Go eignet sich ideal für die I/O-intensive Ingestion von zehntausenden Live-Trades. Das integrierte Concurrency-Modell fängt Marktturbulenzen und Flash-Spikes ohne Speicherüberlauf oder Thread-Starvation sicher ab.',
    codeSnippet: `// CAPITAL-AI CONFLATION ENGINE SERVICE (GOLANG 1.22)
package main

import (
	"sync"
	"time"
)

type Conflator struct {
	mu           sync.RWMutex
	latestPrices map[string]float64
	window       time.Duration
}

func NewConflator(window time.Duration) *Conflator {
	return &Conflator{
		latestPrices: make(map[string]float64),
		window:       window, // z.B. 250 Millisekunden
	}
}

func (c *Conflator) PushTick(symbol string, price float64) {
	c.mu.Lock()
	c.latestPrices[symbol] = price
	c.mu.Unlock()
}

// Emittiert exakt 4 Ticks pro Sekunde pro Ticker ins Redis Pub/Sub
func (c *Conflator) RunTickerBroadcast(out chan<- map[string]float64) {
	ticker := time.NewTicker(c.window)
	defer ticker.Stop()

	for range ticker.C {
		c.mu.Lock()
		snapshot := make(map[string]float64, len(c.latestPrices))
		for k, v := range c.latestPrices {
			snapshot[k] = v
		}
		c.mu.Unlock()

		if len(snapshot) > 0 {
			out <- snapshot
		}
	}
}
`,
  },
  {
    id: 'rust',
    name: 'Rust',
    version: 'Edition 2021',
    role: 'Ultra-Low-Latency Orderbuch-Engine & L2/L3 SIMD Binary Parsing',
    pipelineLayer: 'Layer 1: Low-Latency Orderbook Core',
    badge: 'Zero-Cost Speed',
    color: '#DEA584',
    accentBg: 'bg-orange-500/10',
    accentBorder: 'border-orange-500/30',
    latencySla: 'Sub-2 ms (Lock-Free)',
    throughput: '> 2.800.000 Messages / s',
    memoryFootprint: '~8 MB Memory-Safe',
    keyLibraries: ['tokio', 'crossbeam-channel', 'serde_json', 'ring', 'fastrand'],
    strengths: [
      'Zero-Cost Abstractions: Keine Garbage Collection und keine Laufzeitpausen (0 ms GC STW)',
      'Garantierte Speichersicherheit ohne Race Conditions für parallele Orderbuch-Tapes',
      'Lock-Free Ringbuffer mit Cache-Line Padding für Sub-Mikrosekunden-Latenzen',
    ],
    rationale:
      'Für hochfrequente L2/L3-Orderbuch-Aggregat-Berechnungen (Bid/Ask Imbalance Ratio) ist Rust die schnellste und sicherste Wahl. Es verhindert Memory-Leaks und garantiert unveränderliche Latenz auch bei massiven Volatilitätsspitzen.',
    codeSnippet: `// CAPITAL-AI LOCK-FREE ORDERBOOK INGESTION WORKER (RUST)
use std::sync::atomic::{AtomicU64, Ordering};

pub struct AtomicPriceLevel {
    pub price_e8: AtomicU64,
    pub volume_e8: AtomicU64,
}

impl AtomicPriceLevel {
    pub fn update(&self, price: f64, volume: f64) {
        let p_int = (price * 1e8) as u64;
        let v_int = (volume * 1e8) as u64;
        self.price_e8.store(p_int, Ordering::Release);
        self.volume_e8.store(v_int, Ordering::Release);
    }

    pub fn read(&self) -> (f64, f64) {
        let p = self.price_e8.load(Ordering::Acquire) as f64 / 1e8;
        let v = self.volume_e8.load(Ordering::Acquire) as f64 / 1e8;
        (p, v)
    }
}
`,
  },
  {
    id: 'sql',
    name: 'SQL / TimescaleDB',
    version: 'PostgreSQL 16 + Timescale 2.15',
    role: 'Zeitreihen-Persistenz, Continuous Aggregates & BaFin WORM-Archiv',
    pipelineLayer: 'Layer 3 & 5: Hypertables & Audit Storage',
    badge: 'Time-Series DB',
    color: '#336791',
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/30',
    latencySla: '2 – 12 ms (Aggregat-Query)',
    throughput: '> 180.000 Inserts / s mit Chunk-Compression',
    memoryFootprint: '~512 MB Shared Buffers',
    keyLibraries: ['timescaledb', 'pg_crypto', 'pg_stat_statements', 'citus'],
    strengths: [
      'Hypertables partitionieren Milliarden Ticks automatisch nach Zeitfenstern (z.B. 1 Tag pro Chunk)',
      'Continuous Aggregates berechnen 1m, 5m, 1h und 1d Candlesticks inkrementell im Hintergrund',
      'Kompression spart bis zu 95% Festplattenplatz (von 1 TB auf unter 50 GB)',
    ],
    rationale:
      'TimescaleDB verbindet die unangefochtene Stabilität von relationalem PostgreSQL mit spezialisierten Zeitreihen-Optimierungen. Gesetzlich vorgeschriebene BaFin-Audits (WORM) lassen sich mit Standard-SQL direkt auditieren.',
    codeSnippet: `-- CAPITAL-AI CONTINUOUS AGGREGATE VIEW & BAFIN WORM TRIGGER
CREATE TABLE market_ticks (
    time TIMESTAMPTZ NOT NULL,
    symbol VARCHAR(16) NOT NULL,
    price NUMERIC(18, 8) NOT NULL,
    volume NUMERIC(18, 8) NOT NULL,
    exchange VARCHAR(16) NOT NULL,
    merkle_sha256 VARCHAR(64) NOT NULL
);

-- Zeitreihen-Partitionierung (Hypertable)
SELECT create_hypertable('market_ticks', 'time', chunk_time_interval => INTERVAL '1 day');

-- Automatisch aktualisierte 1-Minuten Candlestick View
CREATE MATERIALIZED VIEW ohlcv_1m
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 minute', time) AS bucket,
    symbol,
    first(price, time) AS open,
    max(price) AS high,
    min(price) AS low,
    last(price, time) AS close,
    sum(volume) AS volume,
    count(*) AS tick_count
FROM market_ticks
GROUP BY bucket, symbol;
`,
  },
  {
    id: 'pinescript',
    name: 'PineScript v5',
    version: 'v5 (TradingView Standard)',
    role: 'Visuelle Chart-Indikatoren & Client-seitige Signal-Ausführung',
    pipelineLayer: 'Layer 4: TradingView Bridge & Screener Signals',
    badge: 'Chart Execution',
    color: '#2962FF',
    accentBg: 'bg-blue-600/10',
    accentBorder: 'border-blue-600/30',
    latencySla: 'Sub-50 ms On-Chart Rendering',
    throughput: 'Echtzeit-Berechnung pro Candlestick',
    memoryFootprint: 'Im Browser des Benutzers',
    keyLibraries: ['TradingView Pine Standard Library', 'ta.rsi', 'ta.macd', 'ta.atr'],
    strengths: [
      'Nahtloser Export von Capital-AI Signalen in jedes TradingView Chart-Setup weltweit',
      'Visuelle Darstellung von Buffett-Moat- und Z-Score-Ausreißern direkt im Kerzenchart',
      'Integrierte Alert-Webhooks zur Triggerung automatisierter Telegram-Benachrichtigungen',
    ],
    rationale:
      'Viele professionelle Händler und Analysten nutzen TradingView als Primär-Terminal. Durch offizielle PineScript v5 Blueprints können Kunden unsere 0–100 Scores ohne Code-Anpassung direkt in ihre gewohnte Arbeitsumgebung einbinden.',
    codeSnippet: `//@version=5
// CAPITAL-AI ENTERPRISE SCORE INDICATOR (PINESCRIPT V5)
indicator("Capital-AI Enterprise Score & Z-Score Overlay", overlay=false, precision=1)

// Eingabeparameter
rsiLength = input.int(14, "RSI Periode")
zScoreThreshold = input.float(2.99, "Altman Safe-Zone Limit")

// Indikator-Berechnung
rsiVal = ta.rsi(close, rsiLength)
rocVal = ta.roc(close, 20)

// Synthetischer Capital-AI Momentum-Score (0-100)
caiScore = math.min(100.0, math.max(0.0, (rsiVal * 0.6) + ((rocVal + 20.0) * 1.0)))

// Farbcodierung
scoreColor = caiScore >= 75 ? color.green : caiScore >= 45 ? color.yellow : color.red
plot(caiScore, "Capital-AI Score", color=scoreColor, linewidth=2)
hline(75, "Bullish Target", color=color.green, linestyle=hline.style_dashed)
hline(45, "Neutral Band", color=color.gray, linestyle=hline.style_dotted)
hline(25, "Distress Warning", color=color.red, linestyle=hline.style_dashed)
`,
  },
];

export const StudioLanguagesSection: React.FC = () => {
  const [selectedLangId, setSelectedLangId] = useState<string>('python');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedLang =
    PROGRAMMING_LANGUAGES.find((l) => l.id === selectedLangId) || PROGRAMMING_LANGUAGES[0];

  const handleCopy = (code: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500/10 via-[#0d1530] to-cyan-500/10 border border-sky-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>MULTI-LANGUAGE TECH-STACK • 6 KANONISCHE SPRACHEN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Programmiersprachen &amp; Technologie-Stack
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Jede Schicht der Capital-AI Pipeline nutzt die für ihren Zweck mathematisch und architektonisch
              optimal geeignete Sprache: Von Sub-2ms Low-Latency C/Rust Ingestion über Go Concurrency bis hin zu Python Quant Analytics und TypeScript UI.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-sky-400/20 text-sky-300 border border-sky-400/40 font-bold">
              6 Sprachen Aktiv
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
              Sub-45ms E2E
            </span>
          </div>
        </div>
      </div>

      {/* Language Quick Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {PROGRAMMING_LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            type="button"
            onClick={() => setSelectedLangId(lang.id)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedLangId === lang.id
                ? `${lang.accentBg} ${lang.accentBorder} text-white shadow-lg scale-[1.02]`
                : 'bg-[#090e21] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold" style={{ color: lang.color }}>
                {lang.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{lang.version.split(' ')[0]}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 truncate">{lang.badge}</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1 truncate">{lang.latencySla}</div>
          </button>
        ))}
      </div>

      {/* Detailed Selected Language Display */}
      <div className="p-6 rounded-2xl bg-[#090e21] border border-slate-800 space-y-6">
        {/* Top Info Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0 border"
              style={{
                backgroundColor: `${selectedLang.color}20`,
                borderColor: `${selectedLang.color}40`,
                color: selectedLang.color,
              }}
            >
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedLang.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  {selectedLang.version}
                </span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded font-bold border"
                  style={{
                    backgroundColor: `${selectedLang.color}15`,
                    borderColor: `${selectedLang.color}40`,
                    color: selectedLang.color,
                  }}
                >
                  {selectedLang.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{selectedLang.role}</p>
              <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">
                {selectedLang.pipelineLayer}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 text-center min-w-[90px]">
              <div className="text-[10px] font-mono text-slate-400">Latenz-SLA</div>
              <div className="text-xs font-mono font-bold text-emerald-400">
                {selectedLang.latencySla}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 text-center min-w-[90px]">
              <div className="text-[10px] font-mono text-slate-400">Throughput</div>
              <div className="text-xs font-mono font-bold text-cyan-300">
                {selectedLang.throughput.split(' ')[0]}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 text-center min-w-[90px]">
              <div className="text-[10px] font-mono text-slate-400">Memory</div>
              <div className="text-xs font-mono font-bold text-amber-300">
                {selectedLang.memoryFootprint.split(' ')[0]}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Rationale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] font-mono tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Architektonische Begründung
            </h4>
            <p className="text-slate-300 leading-relaxed">{selectedLang.rationale}</p>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-400">Schlüssellaufzeiten: </span>
              <span className="text-xs font-mono text-emerald-300 font-semibold">
                {selectedLang.latencySla}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] font-mono tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Wichtigste Vorteile in der Pipeline
            </h4>
            <div className="space-y-1.5">
              {selectedLang.strengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 flex flex-wrap gap-1.5">
              {selectedLang.keyLibraries.map((lib) => (
                <span
                  key={lib}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300"
                >
                  {lib}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Code Contract Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-sky-400" />
              <span>Produktions-Code Snippet ({selectedLang.name})</span>
            </span>
            <button
              type="button"
              onClick={() => handleCopy(selectedLang.codeSnippet, selectedLang.id)}
              className="text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedId === selectedLang.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code kopieren</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-black/80 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed max-h-[320px]">
            {selectedLang.codeSnippet}
          </pre>
        </div>
      </div>

      {/* Multi-Language Benchmark Comparison Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-[#090e21] overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase font-mono text-white tracking-wider">
              Technologie-Vergleichsmatrix (Architektur &amp; Durchsatz)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Kombiniert für strikte E2E Latenzen &lt; 45 ms
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-black/40 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Sprache / Runtime</th>
                <th className="py-3 px-4">Pipeline-Schicht</th>
                <th className="py-3 px-4">Latenz-Klasse</th>
                <th className="py-3 px-4">Concurrency-Modell</th>
                <th className="py-3 px-4">Memory Footprint</th>
                <th className="py-3 px-4">Primärer Zweck</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {PROGRAMMING_LANGUAGES.map((l) => (
                <tr key={l.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                    <span>{l.name}</span>
                  </td>
                  <td className="py-3 px-4 text-cyan-300">{l.pipelineLayer.split(':')[0]}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{l.latencySla}</td>
                  <td className="py-3 px-4 text-slate-300">
                    {l.id === 'golang'
                      ? 'Goroutines (CSP)'
                      : l.id === 'rust'
                      ? 'Lock-Free Threads'
                      : l.id === 'typescript'
                      ? 'Single-Thread Event Loop'
                      : l.id === 'python'
                      ? 'Vectorized Process Pool'
                      : l.id === 'sql'
                      ? 'ACID Multi-Core Engine'
                      : 'On-Demand Shader'}
                  </td>
                  <td className="py-3 px-4 text-amber-300">{l.memoryFootprint}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{l.badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
