import React, { useState, useMemo } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AssetSubclass, MainCategory, MarketAsset } from '../types';
import { MARKET_ASSETS } from '../data/mockData';
import { AssetLogo } from './AssetLogo';

interface SubclassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subclass: AssetSubclass | null;
  category: MainCategory | null;
  onSelectAsset?: (asset: MarketAsset) => void;
  onOpenAnalysis?: () => void;
  onExploreMarkets?: (subclassId?: string) => void;
}

export const SubclassDetailModal: React.FC<SubclassDetailModalProps> = ({
  isOpen,
  onClose,
  subclass,
  category,
  onSelectAsset,
  onOpenAnalysis,
  onExploreMarkets,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'score' | 'change' | 'name'>('score');

  // Filter ONLY assets that belong to this subclass
  // Priority: 1. strict subclassId match, 2. fallback matching category name / subclassName
  const subclassAssets = useMemo(() => {
    if (!subclass || !category) return [];
    return MARKET_ASSETS.filter((asset) => {
      if (asset.subclassId && asset.subclassId === subclass.id) {
        return true;
      }
      if (asset.mainCategory === category) {
        if (asset.subclassId === subclass.id) return true;
        if (asset.category && asset.category.toLowerCase() === subclass.name.toLowerCase()) return true;
        if (asset.subclassName && asset.subclassName.toLowerCase() === subclass.name.toLowerCase()) return true;
      }
      return false;
    });
  }, [subclass, category]);

  // Search & Sorting within the subclass
  const filteredAssets = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    let result = subclassAssets.filter((asset) => {
      if (!q) return true;
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.symbol.toLowerCase().includes(q) ||
        (asset.description && asset.description.toLowerCase().includes(q)) ||
        (asset.aiRating && asset.aiRating.toLowerCase().includes(q))
      );
    });

    result = [...result].sort((a, b) => {
      if (sortOption === 'score') {
        return b.aiScore - a.aiScore;
      }
      if (sortOption === 'change') {
        const parseChg = (s: string) => {
          const num = parseFloat(s.replace('%', '').replace('+', '').replace(',', '.'));
          return isNaN(num) ? 0 : num;
        };
        return parseChg(b.change) - parseChg(a.change);
      }
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [subclassAssets, searchTerm, sortOption]);

  const avgAiScore = useMemo(() => {
    if (subclassAssets.length === 0) return 85;
    const total = subclassAssets.reduce((sum, a) => sum + a.aiScore, 0);
    return Math.round(total / subclassAssets.length);
  }, [subclassAssets]);

  const positiveCount = useMemo(() => {
    return subclassAssets.filter((a) => a.isPositive).length;
  }, [subclassAssets]);

  // Early return ONLY after all hooks have run unconditionally
  if (!isOpen || !subclass || !category) return null;

  const getCategoryColor = (cat: MainCategory) => {
    switch (cat) {
      case 'KRYPTO':
        return '#F9BF21';
      case 'AKTIEN':
        return '#44DE88';
      case 'INDIZIES':
        return '#8D26FF';
      case 'FOREX':
        return '#E879F9';
      case 'ROHSTOFFE':
        return '#F9BF21';
      default:
        return '#F9BF21';
    }
  };

  const themeColor = getCategoryColor(category);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="w-full sm:max-w-2xl bg-[#070D1E] border border-slate-800 sm:rounded-3xl rounded-t-3xl p-4 sm:p-6 text-slate-100 shadow-2xl relative max-h-[92vh] flex flex-col"
          style={{
            boxShadow: `0 0 45px ${themeColor}18`,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3.5 border-b border-slate-800 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className="text-[10.5px] font-extrabold uppercase px-2 py-0.5 rounded border font-mono tracking-wider"
                  style={{
                    color: themeColor,
                    backgroundColor: `${themeColor}15`,
                    borderColor: `${themeColor}35`,
                  }}
                >
                  {category} • UNTERKLASSE
                </span>
                {subclass.trending && (
                  <span className="text-[10.5px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {subclass.trending}
                  </span>
                )}
                <span className="text-[10.5px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  {subclassAssets.length} Assets zugeordnet
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {subclass.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description & Overview Badges */}
          <div className="mt-3.5 shrink-0 space-y-3">
            <div className="p-3 rounded-2xl bg-[#091228] border border-slate-800/90 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {subclass.shortDesc}
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                  Ø AI-Score
                </span>
                <span className="font-bold text-white text-sm flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {avgAiScore}/100
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                  Marktstimmung
                </span>
                <span className="font-bold text-emerald-400 text-sm flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {positiveCount >= subclassAssets.length / 2 ? 'Bullisch' : 'Neutral'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                  24h Dynamik
                </span>
                <span className="font-bold text-white text-sm flex items-center gap-1 mt-0.5">
                  <span className="text-emerald-400">{positiveCount} ↑</span>
                  <span className="text-slate-500 font-normal">/</span>
                  <span className="text-rose-400">{subclassAssets.length - positiveCount} ↓</span>
                </span>
              </div>
            </div>

            {/* Search and Sort controls within subclass */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`In ${subclass.name} suchen (z.B. Symbol, Name)...`}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSortOption('score')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    sortOption === 'score'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Nach AI Score sortieren"
                >
                  Score
                </button>
                <button
                  type="button"
                  onClick={() => setSortOption('change')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    sortOption === 'change'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Nach Performance sortieren"
                >
                  % 24h
                </button>
                <button
                  type="button"
                  onClick={() => setSortOption('name')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    sortOption === 'name'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Alphabetisch sortieren"
                >
                  A-Z
                </button>
              </div>
            </div>
          </div>

          {/* Dedicated Subclass Assets List (Filtered exclusively to this subclass) */}
          <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-2 min-h-[220px]">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                <p className="text-sm font-semibold text-slate-300">
                  Keine Assets für "{searchTerm}" in dieser Unterklasse gefunden.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Überprüfe das Suchkürzel oder setze den Suchfilter zurück.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="mt-3 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                >
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    onClose();
                    onSelectAsset?.(asset);
                  }}
                  className="p-2.5 sm:p-3 rounded-2xl bg-[#091228]/90 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  {/* Left: Real Symbol & Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <AssetLogo asset={asset} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors truncate">
                          {asset.name}
                        </span>
                        <span className="font-mono text-[11px] font-extrabold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/90 border border-slate-700/80 shrink-0">
                          {asset.symbol}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 truncate">
                        <span className="truncate">{asset.description || asset.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Value, 24h Change & AI Score */}
                  <div className="flex items-center gap-3 shrink-0 text-right">
                    {/* Mini Sparkline preview */}
                    <div className="hidden sm:block w-16 h-7">
                      <svg viewBox="0 0 200 50" className="w-full h-full overflow-visible">
                        <path
                          d={asset.sparklinePath}
                          fill="none"
                          stroke={asset.isPositive ? '#44DE88' : '#F43F5E'}
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div>
                      <div className="font-mono font-bold text-white text-sm">{asset.value}</div>
                      <div
                        className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                          asset.isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {asset.isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{asset.change}</span>
                      </div>
                    </div>

                    <div className="hidden xs:flex flex-col items-end pl-1 border-l border-slate-800">
                      <span className="text-[9px] uppercase font-mono text-slate-400">Score</span>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                        {asset.aiScore}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action CTAs */}
          <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onExploreMarkets?.(subclass.id);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Im Explorer ansehen ({subclassAssets.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAnalysis?.();
              }}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>KI-Sektor-Analyse</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
