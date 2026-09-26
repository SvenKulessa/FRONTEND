/**
 * CAPITAL AI — MARKETSCREENER & ANALYSE HUB MODAL
 * Unifies all analysis tools under a single, compact, mobile-friendly interface:
 * Buffett Value Check, Enterprise Scorer, Sector Analysis, Whale Radar & Global Markets.
 */

import React from 'react';
import {
  X,
  TrendingUp,
  Activity,
  Layers,
  Radio,
  BarChart3,
  Globe,
  Leaf,
  Brain,
  Zap,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface MarketscreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAnalysis: (initialTab?: 'asset' | 'sector') => void;
  onOpenSectorAnalysis: () => void;
  onOpenWhaleRadar: () => void;
  onOpenModule: (moduleId: string) => void;
  onViewAllMarkets: () => void;
}

export const MarketscreenerModal: React.FC<MarketscreenerModalProps> = ({
  isOpen,
  onClose,
  onOpenAnalysis,
  onOpenSectorAnalysis,
  onOpenWhaleRadar,
  onOpenModule,
  onViewAllMarkets,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-[#090e21] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-cyan-500/10 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Marketscreener &amp; Analyse Tools
                </h2>
                <p className="text-[11px] text-slate-400">
                  Wählen Sie Ihr Screener-Modul oder starten Sie eine Gesamtanalyse
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tools Grid */}
          <div className="p-4 space-y-2.5 overflow-y-auto scrollbar-thin">
            {/* 1. Buffett Value Check */}
            <div
              onClick={() => {
                onClose();
                onOpenModule('buffett-value');
              }}
              className="p-3.5 rounded-xl bg-black/40 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/10 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Buffett Value Check
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      KLASSIKER
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Fundamental-Check: ROE &gt; 15%, Burggräben (Moats) &amp; DCF Margin of Safety
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </div>

            {/* 2. Enterprise Scorer */}
            <div
              onClick={() => {
                onClose();
                onOpenModule('enterprise-scorer');
              }}
              className="p-3.5 rounded-xl bg-black/40 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/10 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      Enterprise Scorer
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                      0 - 100 SCORE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    KI-gestütztes Multi-Faktor Scoring (Solidität, Wachstum, Sentiment)
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </div>

            {/* 3. KI-Sektor-Rotation */}
            <div
              onClick={() => {
                onClose();
                onOpenSectorAnalysis();
              }}
              className="p-3.5 rounded-xl bg-black/40 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/10 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      KI-Sektor-Rotation &amp; Kapitalflüsse
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Sektor-Radar, Relative Stärke und institutionelle Umschichtungen
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </div>

            {/* 4. Smart Money Flow & Whale Radar */}
            <div
              onClick={() => {
                onClose();
                onOpenWhaleRadar();
              }}
              className="p-3.5 rounded-xl bg-black/40 border border-slate-800 hover:border-cyan-400/50 hover:bg-cyan-950/10 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Smart Money Flow &amp; Whale Radar
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 font-bold">
                      ON-CHAIN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Großtransaktionen, CEX Wal-Transfers &amp; Dark Pool ATS Blocks
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </div>

            {/* 5. Alle Märkte & Screener Liste */}
            <div
              onClick={() => {
                onClose();
                onViewAllMarkets();
              }}
              className="p-3.5 rounded-xl bg-black/40 border border-slate-800 hover:border-amber-400/50 hover:bg-amber-950/10 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      Globale Marktübersicht &amp; Filter
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Top 150 Aktien, Krypto, Forex, Indizes &amp; Rohstoffe mit Echtzeit-Scores
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </div>
          </div>

          {/* Footer Callout */}
          <div className="p-3.5 bg-black/60 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAnalysis();
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs shadow-md hover:bg-amber-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Multi-Faktor Analyse Terminal öffnen</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
