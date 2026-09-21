import React from 'react';
import { X, TrendingUp, Sparkles, Shield, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AssetSubclass, MainCategory } from '../types';

interface SubclassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subclass: AssetSubclass | null;
  category: MainCategory | null;
  onOpenAnalysis?: () => void;
  onExploreMarkets?: () => void;
}

export const SubclassDetailModal: React.FC<SubclassDetailModalProps> = ({
  isOpen,
  onClose,
  subclass,
  category,
  onOpenAnalysis,
  onExploreMarkets,
}) => {
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
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="w-full sm:max-w-lg bg-[#070D1E] border border-slate-800 sm:rounded-3xl rounded-t-3xl p-5 sm:p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          style={{
            boxShadow: `0 0 40px ${themeColor}15`,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[10.5px] font-extrabold uppercase px-2 py-0.5 rounded border font-mono"
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
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{subclass.name}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <div className="mt-4 p-3.5 rounded-2xl bg-[#091228] border border-slate-800/90 text-sm text-slate-300 leading-relaxed">
            {subclass.shortDesc}
          </div>

          {/* Key Tickers / Assets in this subclass */}
          <div className="mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Führende Protokolle & Assets</span>
              <span className="text-slate-500 font-normal font-mono">Live-Beobachtung</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {subclass.examples.map((ticker) => (
                <div
                  key={ticker}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-sm"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                  <span>{ticker}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Intelligence Metrics for this Subclass */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-purple-950/20 via-slate-900/60 to-slate-900 border border-purple-500/25">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-[#8D26FF]" />
                KI-Sektor-Einschätzung
              </span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/15 px-1.5 py-0.5 rounded border border-purple-500/30">
                Deep-Scan Aktiv
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mt-3">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10.5px] text-slate-400 block">Sektor-Sentiment</span>
                <span className="font-bold text-white text-[13px] flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Bullisch
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10.5px] text-slate-400 block">Liquiditäts-Cluster</span>
                <span className="font-bold text-amber-300 text-[13px] mt-0.5 block">
                  Hohes On-Chain Vol.
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onExploreMarkets?.();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Markt anzeigen</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAnalysis?.();
              }}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>KI-Analyse starten</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
