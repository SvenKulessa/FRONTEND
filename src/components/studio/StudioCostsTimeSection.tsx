/**
 * ============================================================================
 * CAPITAL AI — STUDIO HUB: ZEITINTERVALLE, LATENZEN & KOSTEN-MATRIX
 * ----------------------------------------------------------------------------
 * Vollständige Aufschlüsselung der Zeitintervalle (Tick, 1m, Intraday, EOD,
 * Historisch), Latenz-SLAs und der strikten 40 € / Monat Budget-Garantie (AP-006).
 * Inklusive interaktivem Conflation-Sparrechner & monatlicher TCO-Kalkulation.
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import {
  Clock,
  Coins,
  ShieldCheck,
  TrendingDown,
  Gauge,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Layers,
  Database,
  Calculator,
} from 'lucide-react';

export interface TimeIntervalSpec {
  id: string;
  name: string;
  horizon: string;
  latencySla: string;
  sourceFeed: string;
  pipelineStrategy: string;
  bandwidthImpact: string;
  costMonthly: string;
  bestFor: string;
  badge: string;
  color: string;
}

export const TIME_INTERVALS: TimeIntervalSpec[] = [
  {
    id: 'tick',
    name: 'Sub-45ms Tick-by-Tick',
    horizon: '10ms – 45ms',
    latencySla: '< 45 ms E2E',
    sourceFeed: 'Kraken & Binance WebSockets v2, Polygon Clusters',
    pipelineStrategy: 'Layer 1 & 2: Direct WebSocket Ingress mit 250ms Ringpuffer-Conflation',
    bandwidthImpact: '~28 GB / Monat (nach Conflation) statt 450 GB Rohdaten',
    costMonthly: '0,00 € (Public Feeds)',
    bestFor: 'Orderbuch-Imbalance, Flash-Crash-Schutz, sofortige Liquiditäts-Alerts',
    badge: 'Ultra Low-Latency',
    color: '#06B6D4',
  },
  {
    id: 'minute',
    name: '1 Sekunde / 1 Minute',
    horizon: '1s – 60s',
    latencySla: '250 ms – 1 s',
    sourceFeed: 'Aggregated Trades & Conflated Tick Gate',
    pipelineStrategy: 'Layer 2: Redis In-Memory Ring Buffer mit Delta-Broadcasting',
    bandwidthImpact: '~12 GB / Monat',
    costMonthly: '~4,50 € (VPS & Cache)',
    bestFor: 'Realtime Screener-Updates, Bar-Chart Rendering, Breakout-Filterung',
    badge: 'Realtime Screener',
    color: '#10B981',
  },
  {
    id: 'intraday',
    name: 'Intraday (5m, 15m, 1h, 4h)',
    horizon: '5m – 4h',
    latencySla: '5 – 25 ms (Cache Hit)',
    sourceFeed: 'TimescaleDB Continuous Aggregates',
    pipelineStrategy: 'Layer 3: Materialized Continuous Hypertables im Hintergrund',
    bandwidthImpact: '< 2 GB / Monat',
    costMonthly: '~3,00 € (DB Storage)',
    bestFor: 'RSI / MACD Indikator-Berechnung, Z-Score Neuberechnung, Swing Trading',
    badge: 'Swing & Indicator',
    color: '#F5B014',
  },
  {
    id: 'eod',
    name: 'Daily EOD (End of Day)',
    horizon: '1 Tag',
    latencySla: 'Batch nach Börsenschluss',
    sourceFeed: 'Twelve Data & Polygon Daily Feeds',
    pipelineStrategy: 'Layer 4: Täglicher nächtlicher Batch-Run für alle 42.000 Ticker',
    bandwidthImpact: '< 500 MB / Monat',
    costMonthly: 'Im Academic Tier inkludiert',
    bestFor: 'Piotroski F-Score, Bilanz-Updates, Fundamentaldaten & Dividenden-Check',
    badge: 'Fundamental Batch',
    color: '#8D26FF',
  },
  {
    id: 'historical',
    name: 'Historisch (1D bis 20+ Jahre)',
    horizon: '10 – 20+ Jahre',
    latencySla: '< 80 ms (Indexed Query)',
    sourceFeed: 'Polygon S3 Flat Files & Binance Vision CSV Archive',
    pipelineStrategy: 'Layer 5: BaFin WORM Cold Storage & komprimierte Columnar Chunks',
    bandwidthImpact: 'Einmaliger Download (GZIP)',
    costMonthly: '~12,00 € (Flat Files Tier)',
    bestFor: 'Deterministisches Schatten-Benchmarking, Quant-Modelle, Monte-Carlo-Tests',
    badge: 'Quant Backtesting',
    color: '#EC4899',
  },
];

export const StudioCostsTimeSection: React.FC = () => {
  const [selectedIntervalId, setSelectedIntervalId] = useState<string>('tick');

  // Interactive Conflation & Cost Simulator State
  const [tickerCount, setTickerCount] = useState<number>(250);
  const [conflationWindowMs, setConflationWindowMs] = useState<number>(250);
  const [includeTwelveData, setIncludeTwelveData] = useState<boolean>(true);
  const [includePolygon, setIncludePolygon] = useState<boolean>(true);

  // Math Calculations
  const rawTicksPerSec = tickerCount * 25; // Im Schnitt 25 Ticks pro Sekunde pro Ticker bei hoher Volatilität
  const conflatedTicksPerSec = tickerCount * (1000 / conflationWindowMs);
  const savedTicksPct = Math.round(
    Math.max(0, (1 - conflatedTicksPerSec / Math.max(1, rawTicksPerSec)) * 100)
  );

  // Monthly Cost Calculation (TCO)
  const monthlyCosts = useMemo(() => {
    let twelveDataCost = includeTwelveData ? 14.4 : 0; // 20% Academic Plan
    let polygonCost = includePolygon ? 12.0 : 0; // 20% Student/Research Plan
    let vpsRedisCost = 4.5; // Hetzner CX22 Server
    let dbStorageCost = 3.0; // TimescaleDB Storage
    let networkEgressCost = Math.round((tickerCount / 200) * (250 / conflationWindowMs) * 1.5 * 10) / 10;

    const total = Math.round((twelveDataCost + polygonCost + vpsRedisCost + dbStorageCost + networkEgressCost) * 100) / 100;
    return {
      twelveData: twelveDataCost,
      polygon: polygonCost,
      vpsRedis: vpsRedisCost,
      dbStorage: dbStorageCost,
      network: networkEgressCost,
      total,
      isUnderCap: total <= 40.0,
      savingsVsNoConflation: Math.round(networkEgressCost * 8.5 * 10) / 10,
    };
  }, [includeTwelveData, includePolygon, tickerCount, conflationWindowMs]);

  const selectedInterval =
    TIME_INTERVALS.find((i) => i.id === selectedIntervalId) || TIME_INTERVALS[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#0d1530] to-cyan-500/10 border border-emerald-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>ZEITINTERVALLE, LATENZEN &amp; AP-006 KOSTEN-GARANTIE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Zeitintervalle, Latenz-SLA &amp; 40 € Budget-Cap
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Strikte architektonische Kostendisziplin: Durch 250ms Conflation im Ingestion-Gate spart Capital-AI
              bis zu 88,4% Bandbreite und Rechenzeit. Alle Produktions-Blueprints halten garantiert die vertragliche
              TCO-Obergrenze von unter 40,00 € im Monat ein.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 font-bold">
              40 € / Mo Budget-Cap
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
              88,4% Sparquote
            </span>
          </div>
        </div>
      </div>

      {/* Interval Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {TIME_INTERVALS.map((int) => (
          <button
            key={int.id}
            type="button"
            onClick={() => setSelectedIntervalId(int.id)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedIntervalId === int.id
                ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 scale-[1.02]'
                : 'bg-[#090e21] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">{int.name.split(' ')[0]}</span>
              <span className="text-[10px] font-mono text-cyan-400">{int.latencySla}</span>
            </div>
            <div className="text-[11px] text-slate-300 truncate">{int.badge}</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1 truncate">{int.horizon}</div>
          </button>
        ))}
      </div>

      {/* Selected Interval Detail Card */}
      <div className="p-6 rounded-2xl bg-[#090e21] border border-cyan-500/40 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {selectedInterval.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">Zeithorizont: {selectedInterval.horizon}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">{selectedInterval.name}</h3>
            <p className="text-xs text-slate-300 mt-1">{selectedInterval.bestFor}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 shrink-0">
            <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 text-center min-w-[100px]">
              <div className="text-[10px] font-mono text-slate-400">Latenz-SLA</div>
              <div className="text-xs font-mono font-bold text-emerald-400">{selectedInterval.latencySla}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 text-center min-w-[100px]">
              <div className="text-[10px] font-mono text-slate-400">Kostenanteil</div>
              <div className="text-xs font-mono font-bold text-cyan-300">{selectedInterval.costMonthly}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] font-mono tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Ingestion- &amp; Pipeline-Strategie
            </h4>
            <p className="text-slate-300 leading-relaxed">{selectedInterval.pipelineStrategy}</p>
            <div className="pt-2">
              <span className="text-slate-400 font-mono">Quelle: </span>
              <span className="text-slate-200 font-semibold">{selectedInterval.sourceFeed}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] font-mono tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              Bandbreiten- &amp; Kosteneffekt
            </h4>
            <p className="text-slate-300 leading-relaxed">{selectedInterval.bandwidthImpact}</p>
            <div className="pt-2">
              <span className="text-slate-400 font-mono">Monatlicher TCO-Beitrag: </span>
              <span className="text-emerald-300 font-bold font-mono">{selectedInterval.costMonthly}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AP-006 TCO COST BREAKDOWN MATRIX (< 40 € / MONAT) */}
      <div className="rounded-2xl border border-slate-800 bg-[#090e21] overflow-hidden shadow-xl space-y-0">
        <div className="p-5 bg-slate-900/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                AP-006 TCO-Kostenaufstellung (Reale Produktions-Kosten)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aufschlüsselung aller Infrastruktur-, Lizenz- und Serverkomponenten für das gesamte Terminal.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right font-mono">
              <span className="text-[10px] text-slate-400 block">Gesamt-TCO</span>
              <span className="text-base font-black text-emerald-400">~35,40 € / Monat</span>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
              CAP EINGEHALTEN (&lt; 40 €)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-black/40 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Komponente</th>
                <th className="py-3 px-4">Provider / Dienstleister</th>
                <th className="py-3 px-4">Spezifikation / Plan</th>
                <th className="py-3 px-4">Regulärer Preis</th>
                <th className="py-3 px-4">Capital-AI Kondition</th>
                <th className="py-3 px-4 text-right">Monatlicher TCO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-bold text-white">Twelve Data Equities</td>
                <td className="py-3 px-4 text-slate-300">Twelve Data Pte. Ltd.</td>
                <td className="py-3 px-4 text-slate-400">800 req/min, 250+ Börsen</td>
                <td className="py-3 px-4 text-slate-500 line-through">18,00 €</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">20% Academic Rabatt</td>
                <td className="py-3 px-4 text-right text-cyan-300 font-bold">14,40 €</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-bold text-white">Polygon S3 Flat Files</td>
                <td className="py-3 px-4 text-slate-300">Polygon Technology LLC</td>
                <td className="py-3 px-4 text-slate-400">US-Tick Archive, NBBO Quotes</td>
                <td className="py-3 px-4 text-slate-500 line-through">15,00 €</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">20% Student Beans</td>
                <td className="py-3 px-4 text-right text-cyan-300 font-bold">12,00 €</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-bold text-white">Kraken Public Tapes</td>
                <td className="py-3 px-4 text-slate-300">Payward Inc.</td>
                <td className="py-3 px-4 text-slate-400">REST &amp; WebSockets v2 Snapshots</td>
                <td className="py-3 px-4 text-slate-400">0,00 €</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Freie Marktdaten</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-bold">0,00 €</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-bold text-white">Binance Public Data</td>
                <td className="py-3 px-4 text-slate-300">Binance Holdings Ltd.</td>
                <td className="py-3 px-4 text-slate-400">data.binance.vision Archive &amp; WS</td>
                <td className="py-3 px-4 text-slate-400">0,00 €</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Open Data Terms v1.0</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-bold">0,00 €</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-bold text-white">Ingestion VPS &amp; Redis</td>
                <td className="py-3 px-4 text-slate-300">Hetzner Cloud (CX22)</td>
                <td className="py-3 px-4 text-slate-400">2 vCPU, 4 GB RAM, 20 TB Traffic</td>
                <td className="py-3 px-4 text-slate-400">4,50 €</td>
                <td className="py-3 px-4 text-slate-300">Falkenstein / Nuernberg</td>
                <td className="py-3 px-4 text-right text-cyan-300 font-bold">4,50 €</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-bold text-white">TimescaleDB Storage</td>
                <td className="py-3 px-4 text-slate-300">Hetzner Volume</td>
                <td className="py-3 px-4 text-slate-400">25 GB NVMe (95% komprimiert)</td>
                <td className="py-3 px-4 text-slate-400">3,00 €</td>
                <td className="py-3 px-4 text-slate-300">Auto-Chunking Hypertables</td>
                <td className="py-3 px-4 text-right text-cyan-300 font-bold">3,00 €</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-bold text-white">Egress mit 250ms Conflation</td>
                <td className="py-3 px-4 text-slate-300">Cloudflare / Hetzner</td>
                <td className="py-3 px-4 text-slate-400">28 GB / Monat (88,4% Einsparung)</td>
                <td className="py-3 px-4 text-slate-500 line-through">18,50 €</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">T2 Tick-Gate Filter</td>
                <td className="py-3 px-4 text-right text-cyan-300 font-bold">1,50 €</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-700 bg-black/60 font-mono text-xs">
                <td colSpan={5} className="py-3 px-4 font-bold text-white">
                  SUMME MONATLICHE GESAMTKOSTEN (TCO):
                </td>
                <td className="py-3 px-4 text-right font-black text-emerald-400 text-sm">
                  ~35,40 € / Monat
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* INTERACTIVE CONFLATION & COST SIMULATOR */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0e1635] to-[#090e21] border border-cyan-500/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                Interaktiver Conflation- &amp; Kosten-Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Simulieren Sie, wie sich Ticker-Mengen und Conflation-Fenster auf Bandbreite und Monatskosten auswirken.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-slate-800 text-right min-w-[170px] shrink-0 font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Simulierter Monats-TCO</span>
            <span className="text-2xl font-black text-emerald-400">{monthlyCosts.total.toFixed(2)} €</span>
            <span className="text-[11px] block text-cyan-300">
              Spart {monthlyCosts.savingsVsNoConflation.toFixed(1)} € / Mo Egress
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span>Überwachte Ticker</span>
              <strong className="text-cyan-300">{tickerCount} Ticker</strong>
            </div>
            <input
              type="range"
              min="10"
              max="2500"
              step="10"
              value={tickerCount}
              onChange={(e) => setTickerCount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Krypto &amp; Aktien</span>
          </div>

          <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span>Conflation-Fenster</span>
              <strong className="text-amber-300">{conflationWindowMs} ms</strong>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={conflationWindowMs}
              onChange={(e) => setConflationWindowMs(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[10px] text-emerald-400 block font-bold">
              {savedTicksPct}% Ticks gefiltert
            </span>
          </div>

          <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-300 block mb-1">Twelve Data Feed (20% Rabatt)</span>
            <button
              type="button"
              onClick={() => setIncludeTwelveData(!includeTwelveData)}
              className={`w-full py-1.5 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                includeTwelveData
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-white/5 border-slate-700 text-slate-500'
              }`}
            >
              {includeTwelveData ? 'Twelve Data: Aktiv (14,40 €)' : 'Twelve Data: Deaktiviert (0 €)'}
            </button>
            <span className="text-[10px] text-slate-500 block">250+ internationale Börsen</span>
          </div>

          <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-300 block mb-1">Polygon S3 Flat Files (20% Rabatt)</span>
            <button
              type="button"
              onClick={() => setIncludePolygon(!includePolygon)}
              className={`w-full py-1.5 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                includePolygon
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-white/5 border-slate-700 text-slate-500'
              }`}
            >
              {includePolygon ? 'Polygon: Aktiv (12,00 €)' : 'Polygon: Deaktiviert (0 €)'}
            </button>
            <span className="text-[10px] text-slate-500 block">US-Tick Archive &amp; NBBO</span>
          </div>
        </div>
      </div>
    </div>
  );
};
