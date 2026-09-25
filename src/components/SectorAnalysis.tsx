/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: KI-SEKTOR-ANALYSE & ROTATIONS-RADAR]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - 4-Quadranten Sektor-Rotations-Radar (Leading, Weakening, Lagging, Improving)
 *    - Recharts Horizontales Performance- & Kapitalfluss-Diagramm (1T, 1W, 1M, YTD)
 *    - Detaillierte Sektor-Karten mit Treibern & Risikofaktoren
 * 2. SCORING-LOGIK        : 
 *    - Sektor-Score (0-100) berechnet aus Relativer Stärke (RS) vs. Benchmark & Momentum
 *    - Institutional Capital Flows in Mrd. USD
 *    - Beta-Faktor & Volatilitäts-Risiko
 * 3. DATENANBINDUNG       : 
 *    - Verknüpfung mit Top-Assets aus `MARKET_ASSETS`
 *    - Callback `onSelectAsset()` für Detail-Modal
 * 4. DATENQUELLEN / FEEDS : 
 *    - GICS Branchenklassifikationen & ETF-Zuflüsse (XLK, XLF, XLE, SOXX)
 *    - On-Chain DeFi/L1 Sektorkapitalisierung
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import {
  Layers,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  Activity,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  DollarSign,
  Info,
  Sparkles,
  Flame,
  BarChart3,
  Cpu,
  Coins,
  Gem,
  Factory,
  Building2,
  HeartPulse,
  Fuel,
  ShoppingBag,
  Bell,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { SectorInfo, SectorRotationPhase, MarketAsset, MainCategory } from '../types';
import { SECTORS_DATA } from '../data/sectorData';
import { MARKET_ASSETS } from '../data/mockData';
import { AssetLogo } from './AssetLogo';
import { usePriceAlerts } from '../context/PriceAlertsContext';

type TimeframeOption = '1D' | '1W' | '1M' | 'YTD';
type ViewModeOption = 'ranking' | 'rotation' | 'capital';

interface SectorAnalysisProps {
  onSelectAsset?: (asset: MarketAsset) => void;
  onOpenPriceAlerts?: () => void;
  onExploreMarkets?: (category?: MainCategory | 'ALLE') => void;
}


export const SectorAnalysis: React.FC<SectorAnalysisProps> = ({
  onSelectAsset,
  onOpenPriceAlerts,
  onExploreMarkets,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>('1M');
  const [activeView, setActiveView] = useState<ViewModeOption>('ranking');
  const [selectedSectorId, setSelectedSectorId] = useState<string>(SECTORS_DATA[0].id);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  const { openAlertModalWithSentiment } = usePriceAlerts();

  // Active sector data
  const activeSector = useMemo(() => {
    return SECTORS_DATA.find((s) => s.id === selectedSectorId) || SECTORS_DATA[0];
  }, [selectedSectorId]);

  // Linked real MarketAssets for active sector
  const linkedAssets = useMemo(() => {
    const symbols = activeSector.topAssetSymbols;
    return symbols
      .map((sym) =>
        MARKET_ASSETS.find(
          (a) =>
            a.symbol.toUpperCase() === sym.toUpperCase() ||
            a.name.toUpperCase().includes(sym.toUpperCase())
        )
      )
      .filter((a): a is MarketAsset => Boolean(a));
  }, [activeSector]);

  // Chart performance data sorted by performance in selected timeframe
  const chartData = useMemo(() => {
    return [...SECTORS_DATA]
      .map((s) => ({
        id: s.id,
        name: s.shortName,
        value: s.performance[selectedTimeframe],
        score: s.aiScore,
        phase: s.rotationPhase,
      }))
      .sort((a, b) => b.value - a.value);
  }, [selectedTimeframe]);

  // Sector Icon Helper
  const renderSectorIcon = (type: SectorInfo['iconType'], className = 'w-4 h-4') => {
    switch (type) {
      case 'tech':
        return <Cpu className={className} />;
      case 'crypto':
        return <Coins className={className} />;
      case 'materials':
        return <Gem className={className} />;
      case 'industry':
        return <Factory className={className} />;
      case 'finance':
        return <Building2 className={className} />;
      case 'health':
        return <HeartPulse className={className} />;
      case 'energy':
        return <Fuel className={className} />;
      case 'consumer':
        return <ShoppingBag className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  // Phase Badge Helper
  const getPhaseBadge = (phase: SectorRotationPhase) => {
    switch (phase) {
      case 'LEADING':
        return {
          label: 'Führend (Leading)',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'IMPROVING':
        return {
          label: 'Erstarkend (Improving)',
          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
          dot: 'bg-cyan-400',
        };
      case 'WEAKENING':
        return {
          label: 'Abschwächend (Weakening)',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'LAGGING':
        return {
          label: 'Nachhinkend (Lagging)',
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          dot: 'bg-rose-400',
        };
    }
  };

  return (
    <section id="sector-analysis-section" className="px-3 sm:px-5 py-6">
      <div className="rounded-3xl bg-[#091129]/95 border border-slate-800/90 shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-4 sm:p-6 backdrop-blur-md relative overflow-hidden">
        {/* Subtle radial ambient background glow */}
        <div
          className="absolute -top-24 right-1/4 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-15 transition-all duration-700"
          style={{ backgroundColor: activeSector.phaseColor }}
        />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400 font-mono">
                Sektor-Rotation &amp; Kapitalströme
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                8 Sektoren
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight flex items-center gap-2">
              KI-Sektor-Analyse
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Multi-Asset
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMethodologyOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Methodik des Sektor-Rotationsmodells"
            >
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">Methodik</span>
            </button>

            {onOpenPriceAlerts && (
              <button
                type="button"
                onClick={onOpenPriceAlerts}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                title="Preis-Alerts für Sektor-Werte anlegen"
              >
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Sektor-Alarm</span>
              </button>
            )}
          </div>
        </div>

        {/* View Switcher & Timeframe Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-800/70 relative z-10">
          {/* Main View Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveView('ranking')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'ranking'
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'bg-[#040919] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Ranking &amp; Performance</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('rotation')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'rotation'
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'bg-[#040919] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Rotations-Radar</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('capital')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'capital'
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'bg-[#040919] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Kapitalflüsse</span>
            </button>
          </div>

          {/* Timeframe Selector Buttons */}
          <div className="flex items-center gap-1 bg-[#020510] p-1 rounded-xl border border-slate-800/80 self-start sm:self-auto">
            {(['1D', '1W', '1M', 'YTD'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedTimeframe === tf
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* View Content: Dynamic visualization according to activeView */}
        <div className="pt-4 pb-2">
          {activeView === 'ranking' && (
            <div className="space-y-4">
              {/* Recharts Horizontal Bar Chart */}
              <div className="p-3 sm:p-4 rounded-2xl bg-[#030715] border border-slate-800/90 relative">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    Sektor-Performance ({selectedTimeframe})
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    Sortiert nach Rendite
                  </span>
                </div>

                <div className="h-56 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                      <XAxis
                        type="number"
                        tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                        tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
                        stroke="#1e293b"
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
                        stroke="#1e293b"
                        width={105}
                      />
                      <ReferenceLine x={0} stroke="#334155" strokeWidth={1.5} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-[#091129]/95 border border-slate-700/90 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md text-xs font-mono">
                                <div className="font-bold text-white mb-1">{d.name}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400">{selectedTimeframe}-Rendite:</span>
                                  <span
                                    className={`font-black ${
                                      d.value >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                    }`}
                                  >
                                    {d.value > 0 ? `+${d.value}` : d.value}%
                                  </span>
                                </div>
                                <div className="text-[10px] text-amber-300 mt-1">
                                  KI-Score: {d.score}/100
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[0, 4, 4, 0]}
                        onClick={(data) => {
                          if (data && data.id) setSelectedSectorId(data.id);
                        }}
                        className="cursor-pointer"
                      >
                        {chartData.map((entry) => (
                          <Cell
                            key={entry.id}
                            fill={
                              entry.id === selectedSectorId
                                ? '#06b6d4'
                                : entry.value >= 0
                                ? '#10b981'
                                : '#ef4444'
                            }
                            opacity={entry.id === selectedSectorId ? 1 : 0.85}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sector Quick-Select Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SECTORS_DATA.map((sec) => {
                  const isSelected = sec.id === selectedSectorId;
                  const phaseInfo = getPhaseBadge(sec.rotationPhase);
                  const perfVal = sec.performance[selectedTimeframe];
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setSelectedSectorId(sec.id)}
                      className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40'
                          : 'bg-[#030715] hover:bg-[#050c22] border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${sec.phaseColor}20`, color: sec.phaseColor }}
                          >
                            {renderSectorIcon(sec.iconType, 'w-3.5 h-3.5')}
                          </div>
                          <span className="text-xs font-bold text-white truncate max-w-[90px]">
                            {sec.shortName}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-amber-300">
                          {sec.aiScore}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono mt-1 pt-1 border-t border-slate-800/60">
                        <span className={`text-[10px] font-semibold ${phaseInfo.color} px-1.5 py-0.2 rounded`}>
                          {sec.rotationPhase.slice(0, 4)}
                        </span>
                        <span
                          className={`font-bold ${
                            perfVal >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {perfVal > 0 ? `+${perfVal}` : perfVal}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeView === 'rotation' && (
            /* 4-Quadrant Macro Sector Rotation Radar */
            <div className="p-4 rounded-2xl bg-[#030715] border border-slate-800/90 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-800/80">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    4-Phasen Sektor-Rotationsmodell
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Klassifiziert nach Relativer Stärke (RS) vs. Kurs-Momentum
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Führend
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> Erstarkend
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Abschwächend
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> Nachhinkend
                  </span>
                </div>
              </div>

              {/* 4 Quadrants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Quadrant 1: LEADING */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between min-h-[140px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                        1. Führend (Leading)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400/80">
                      Hohe RS • Hohes Momentum
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {SECTORS_DATA.filter((s) => s.rotationPhase === 'LEADING').map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSectorId(s.id)}
                        className={`p-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                          selectedSectorId === s.id
                            ? 'bg-emerald-500/30 text-white font-bold ring-1 ring-emerald-400'
                            : 'bg-[#020510]/80 text-slate-300 hover:bg-[#06122c]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {renderSectorIcon(s.iconType, 'w-3.5 h-3.5 text-emerald-400')}
                          <span>{s.name}</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">
                          RS {s.relativeStrength}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quadrant 2: IMPROVING */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col justify-between min-h-[140px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                        2. Erstarkend (Improving)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/80">
                      Steigendes Momentum • Bodenbildung
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {SECTORS_DATA.filter((s) => s.rotationPhase === 'IMPROVING').map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSectorId(s.id)}
                        className={`p-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                          selectedSectorId === s.id
                            ? 'bg-cyan-500/30 text-white font-bold ring-1 ring-cyan-400'
                            : 'bg-[#020510]/80 text-slate-300 hover:bg-[#06122c]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {renderSectorIcon(s.iconType, 'w-3.5 h-3.5 text-cyan-400')}
                          <span>{s.name}</span>
                        </div>
                        <span className="font-mono text-cyan-400 font-bold">
                          RS {s.relativeStrength}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quadrant 3: WEAKENING */}
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col justify-between min-h-[140px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                        3. Abschwächend (Weakening)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400/80">
                      Hohe RS • Nachlassendes Momentum
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {SECTORS_DATA.filter((s) => s.rotationPhase === 'WEAKENING').map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSectorId(s.id)}
                        className={`p-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                          selectedSectorId === s.id
                            ? 'bg-amber-500/30 text-white font-bold ring-1 ring-amber-400'
                            : 'bg-[#020510]/80 text-slate-300 hover:bg-[#06122c]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {renderSectorIcon(s.iconType, 'w-3.5 h-3.5 text-amber-400')}
                          <span>{s.name}</span>
                        </div>
                        <span className="font-mono text-amber-400 font-bold">
                          RS {s.relativeStrength}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quadrant 4: LAGGING */}
                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col justify-between min-h-[140px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                        4. Nachhinkend (Lagging)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-rose-400/80">
                      Geringe RS • Negatives Momentum
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {SECTORS_DATA.filter((s) => s.rotationPhase === 'LAGGING').map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSectorId(s.id)}
                        className={`p-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                          selectedSectorId === s.id
                            ? 'bg-rose-500/30 text-white font-bold ring-1 ring-rose-400'
                            : 'bg-[#020510]/80 text-slate-300 hover:bg-[#06122c]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {renderSectorIcon(s.iconType, 'w-3.5 h-3.5 text-rose-400')}
                          <span>{s.name}</span>
                        </div>
                        <span className="font-mono text-rose-400 font-bold">
                          RS {s.relativeStrength}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'capital' && (
            /* Institutional Capital Flows (Inflow / Outflow) */
            <div className="p-4 rounded-2xl bg-[#030715] border border-slate-800/90 relative">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Institutionelle Netto-Kapitalflüsse (Smart Money Tracker)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Kumulierte Zu- und Abflüsse der letzten 30 Tage in Milliarden USD
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {SECTORS_DATA.map((s) => {
                  const isInflow = s.netCapitalInflowMrd >= 0;
                  const absVal = Math.abs(s.netCapitalInflowMrd);
                  const barWidth = Math.min(100, Math.round((absVal / 5.5) * 100));

                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSectorId(s.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedSectorId === s.id
                          ? 'bg-cyan-950/30 border-cyan-500/50'
                          : 'bg-[#020510] hover:bg-[#061028] border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          {renderSectorIcon(s.iconType, 'w-3.5 h-3.5 text-cyan-400')}
                          <span>{s.name}</span>
                        </div>
                        <span
                          className={`font-mono font-bold ${
                            isInflow ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isInflow ? `+${s.netCapitalInflowMrd}` : s.netCapitalInflowMrd} Mrd. $
                        </span>
                      </div>

                      {/* Flow bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isInflow
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : 'bg-gradient-to-r from-rose-500 to-amber-500'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ACTIVE SECTOR DEEP-DIVE CARD */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0a1435] to-[#04081c] border border-cyan-500/30 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/90">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg"
                style={{
                  backgroundColor: `${activeSector.phaseColor}20`,
                  borderColor: `${activeSector.phaseColor}50`,
                  color: activeSector.phaseColor,
                }}
              >
                {renderSectorIcon(activeSector.iconType, 'w-6 h-6')}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Sektor-Profil
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      getPhaseBadge(activeSector.rotationPhase).color
                    }`}
                  >
                    {activeSector.rotationLabel}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {activeSector.name}
                </h3>
              </div>
            </div>

            {/* Score & Key Stats Row */}
            <div className="flex items-center gap-4 self-start md:self-auto bg-[#020510]/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  KI-Sektor Score
                </span>
                <div className="text-2xl font-black font-mono text-amber-400 leading-none mt-0.5">
                  {activeSector.aiScore}
                  <span className="text-xs text-slate-500 font-normal">/100</span>
                </div>
              </div>

              <div className="w-px h-8 bg-slate-800" />

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Beta</span>
                <span className="text-sm font-mono font-bold text-white">
                  {activeSector.beta}
                </span>
              </div>

              <div className="w-px h-8 bg-slate-800" />

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Rel. Stärke</span>
                <span className="text-sm font-mono font-bold text-cyan-300">
                  {activeSector.relativeStrength}/100
                </span>
              </div>
            </div>
          </div>

          {/* AI Macro Synthesis & Growth Drivers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 text-xs">
            {/* Left: Summary & Growth Drivers */}
            <div className="lg:col-span-7 space-y-3">
              <div className="p-3 rounded-xl bg-[#020617]/70 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>KI-Synthese &amp; Makro-Einschätzung</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-xs sm:text-[13px]">
                  {activeSector.aiSummary}
                </p>
              </div>

              {/* Drivers & Risks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-950/15 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Zentrale Wachstumstreiber</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {activeSector.growthDrivers.map((d, i) => (
                      <li key={i} className="leading-snug">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/15 border border-rose-500/20">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Wesentliche Risikofaktoren</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {activeSector.keyRisks.map((r, i) => (
                      <li key={i} className="leading-snug">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Top Sector Assets Live Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Leit-Assets &amp; Top-Picks
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Klick für Detail</span>
                </div>

                <div className="space-y-1.5">
                  {linkedAssets.slice(0, 4).map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => onSelectAsset?.(asset)}
                      className="p-2 rounded-xl bg-[#030718] hover:bg-[#081232] border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <AssetLogo symbol={asset.symbol} name={asset.name} size="sm" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {asset.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {asset.symbol} • {asset.category}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-xs text-white">
                          {asset.value}
                        </div>
                        <div
                          className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${
                            asset.isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {asset.isPositive ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {asset.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => openAlertModalWithSentiment(activeSector.category)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sektor-Alarm</span>
                </button>

                {onExploreMarkets && (
                  <button
                    type="button"
                    onClick={() => onExploreMarkets(activeSector.category)}
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                  >
                    <span>Märkte öffnen</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sektor-Methodik Modal */}
      <AnimatePresence>
        {isMethodologyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#091129] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    <Compass className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Methodik: Sektor-Rotationsmodell
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Relative Stärke &amp; Momentum</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMethodologyOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <p>
                  Das <strong>Capital-AI Sektor-Rotationsmodell</strong> analysiert kontinuierlich
                  die Umschichtung institutioneller Liquidität zwischen verschiedenen Wirtschaftssektoren
                  entlang des makroökonomischen Konjunkturzyklus:
                </p>

                <div className="space-y-2 pt-1 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <strong className="text-emerald-400 block mb-0.5">1. Führend (Leading):</strong>
                    Sektoren mit überdurchschnittlicher Relativer Stärke (RS &gt; 75) und anhaltend
                    positivem Kurstrend. Hohe institutionelle Akkumulation.
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
                    <strong className="text-amber-400 block mb-0.5">2. Abschwächend (Weakening):</strong>
                    Hohe relative Stärke, aber nachlassende Kursdynamik. Erste
                    Gewinnmitnahmen und beginnende Rotation in Nachzügler.
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30">
                    <strong className="text-rose-400 block mb-0.5">3. Nachhinkend (Lagging):</strong>
                    Unterdurchschnittliche Performance und Abflüsse. Defensive Vorsicht
                    oder zyklischer Abschwung.
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                    <strong className="text-cyan-400 block mb-0.5">4. Erstarkend (Improving):</strong>
                    Sektoren, die eine Bodenbildung durchlaufen und an relativem Momentum
                    gewinnen. Attraktives Chance-Risiko-Verhältnis für Neueinstiege.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMethodologyOpen(false)}
                className="mt-5 w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Verstanden &amp; Schließen
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
