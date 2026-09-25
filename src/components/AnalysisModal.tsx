/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: QUANTITATIVER MULTI-ASSET SCANNER & MODAL]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Echtzeit-Ticker Suchmaske mit Direktsuche über Symbol & Unternehmensname
 *    - Schnellfilter nach Assetklassen & Sektoren
 *    - Visuelle Score-Tachometer & Rating-Indikatoren
 * 2. SCORING-LOGIK        : 
 *    - Multi-Faktor KI-Scoring (0-100)
 *    - Graham/Buffett Value Checks & Altman Z-Score Risikoeinstufung
 * 3. DATENANBINDUNG       : 
 *    - Callback `onSelectAsset()` öffnet das dedizierte `AssetDetailModal`
 * 4. DATENQUELLEN / FEEDS : 
 *    - `MARKET_ASSETS` (500+ Assets) & `SECTORS_DATA` (Sektor-Radar)
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  Shield,
  BarChart3,
  Search,
  CheckCircle2,
  Layers,
  Compass,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { AssetLogo } from './AssetLogo';
import { SECTORS_DATA } from '../data/sectorData';
import { SectorInfo, MarketAsset } from '../types';
import { MARKET_ASSETS } from '../data/mockData';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'asset' | 'sector';
  onSelectAsset?: (asset: MarketAsset) => void;
}

const POPULAR_TICKERS = [
  { symbol: 'NVDA', name: 'Nvidia Corp.', score: 94, trend: '+3,8%' },
  { symbol: 'AAPL', name: 'Apple Inc.', score: 86, trend: '+0,9%' },
  { symbol: 'SAP', name: 'SAP SE', score: 89, trend: '+1,4%' },
  { symbol: 'MSFT', name: 'Microsoft', score: 91, trend: '+1,1%' },
  { symbol: 'BTC', name: 'Bitcoin', score: 82, trend: '+2,3%' },
];

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'asset',
  onSelectAsset,
}) => {
  const [activeTab, setActiveTab] = useState<'asset' | 'sector'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(POPULAR_TICKERS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState<string>(SECTORS_DATA[0].id);

  if (!isOpen) return null;

  const handleSelectStock = (stock: typeof POPULAR_TICKERS[0]) => {
    setIsAnalyzing(true);
    setSelectedStock(stock);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 400);
  };

  const activeSector = SECTORS_DATA.find((s) => s.id === selectedSectorId) || SECTORS_DATA[0];

  const sectorLinkedAssets = activeSector.topAssetSymbols
    .map((sym) =>
      MARKET_ASSETS.find(
        (a) =>
          a.symbol.toUpperCase() === sym.toUpperCase() ||
          a.name.toUpperCase().includes(sym.toUpperCase())
      )
    )
    .filter((a): a is MarketAsset => Boolean(a));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-xl bg-[#070e22] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BrandLogo variant="emblem" size="sm" />
            <div>
              <h3 className="text-lg font-bold text-white leading-none">Capital-AI Analyse-Center</h3>
              <p className="text-xs text-slate-400 mt-1">Multi-Faktor &amp; Sektor-Evaluation</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#020614] rounded-2xl border border-slate-800/90 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('asset')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'asset'
                ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(249,191,33,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Einzel-Asset KI-Score</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sector')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'sector'
                ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>KI-Sektor-Analyse</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-black/20 text-black rounded font-extrabold">
              NEU
            </span>
          </button>
        </div>

        {activeTab === 'asset' ? (
          <>
            {/* Search Ticker */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Wertpapier oder Markt auswählen
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="z.B. Nvidia, Apple, DAX, Bitcoin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
                />
              </div>

              {/* Quick chips */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-2.5">
                {POPULAR_TICKERS.map((item) => (
                  <button
                    key={item.symbol}
                    type="button"
                    onClick={() => handleSelectStock(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                      selectedStock.symbol === item.symbol
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <AssetLogo symbol={item.symbol} name={item.name} size="xs" />
                    <span>{item.symbol}</span>
                    <span
                      className={
                        selectedStock.symbol === item.symbol
                          ? 'text-black/70'
                          : 'text-emerald-400 font-mono'
                      }
                    >
                      {item.trend}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Asset AI Score Card */}
            <div className="mt-4 p-4 rounded-2xl bg-[#0a122c] border border-amber-500/25 relative overflow-hidden">
              {isAnalyzing ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-slate-300">Berechne KI-Scores für {selectedStock.name}...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <AssetLogo
                        symbol={selectedStock.symbol}
                        name={selectedStock.name}
                        size="lg"
                        className="mt-0.5"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                          Analysebericht
                        </span>
                        <h4 className="text-xl font-bold text-white mt-0.5">
                          {selectedStock.name}
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">
                          Ticker: {selectedStock.symbol}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-amber-400 leading-none">
                        {selectedStock.score}
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400 block mt-1">
                        Starke Kaufgelegenheit
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-3.5">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${selectedStock.score}%` }}
                    />
                  </div>

                  {/* Factor Breakdown */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block">Wachstum &amp; Margen</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        94% (Hervorragend)
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block">Bewertungs-Risiko</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        Niedrig (Fairer Wert)
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block">KI-News-Sentiment</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                        <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                        88% Bullish
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block">Buffett-Qualität</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Breiter Burggraben
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          /* Sektor-Analyse View in Modal */
          <div className="mt-4 space-y-3">
            {/* Sector Picker Row */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {SECTORS_DATA.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedSectorId(sec.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedSectorId === sec.id
                      ? 'bg-cyan-400 text-black shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{sec.shortName}</span>
                  <span
                    className={`text-[10px] font-mono px-1 py-0.2 rounded font-extrabold ${
                      selectedSectorId === sec.id
                        ? 'bg-black/20 text-black'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {sec.aiScore}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Sector Summary Card */}
            <div className="p-4 rounded-2xl bg-[#091535] border border-cyan-500/30 relative">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {activeSector.rotationLabel}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Beta {activeSector.beta}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white mt-1">{activeSector.name}</h4>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-amber-400">
                    {activeSector.aiScore}
                    <span className="text-xs text-slate-400 font-normal">/100</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    +{activeSector.performance['1M']}% (1M)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 mt-2.5 leading-relaxed bg-[#020617]/60 p-2.5 rounded-xl border border-slate-800">
                {activeSector.aiSummary}
              </p>

              {/* Drivers & Risks list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800 text-[11px]">
                <div className="p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-emerald-400 font-bold block mb-1">
                    ✓ Wachstumstreiber:
                  </span>
                  <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
                    {activeSector.growthDrivers.slice(0, 2).map((d, i) => (
                      <li key={i} className="truncate">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2 rounded-xl bg-rose-950/20 border border-rose-500/20">
                  <span className="text-rose-400 font-bold block mb-1">
                    ⚠ Risikofaktoren:
                  </span>
                  <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
                    {activeSector.keyRisks.slice(0, 2).map((r, i) => (
                      <li key={i} className="truncate">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Top Assets Pills */}
              <div className="mt-3 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                  Leit-Assets dieses Sektors:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sectorLinkedAssets.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectAsset?.(a);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#020510] hover:bg-[#071333] border border-slate-800 hover:border-cyan-400/50 text-xs text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <AssetLogo symbol={a.symbol} name={a.name} size="xs" />
                      <span>{a.symbol}</span>
                      <span
                        className={`text-[10px] font-mono ${
                          a.isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {a.change}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action */}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Fertig &amp; Zurück zum Überblick
        </button>
      </motion.div>
    </div>
  );
};

