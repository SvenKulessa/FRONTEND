import React, { useState } from 'react';
import { Menu, X, ChevronRight, TrendingUp, ShieldCheck, Zap, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenAnalysis?: () => void;
  onOpenModule?: (moduleId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAnalysis, onOpenModule }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-30 w-full px-5 pt-3 pb-3 flex items-center justify-between">
      {/* Brand Logo & Title with 3D Golden Constellation & Metallic Typography */}
      <BrandLogo
        variant="inline"
        size="md"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Hamburger Navigation Button */}
      <button
        id="mobile-menu-btn"
        type="button"
        aria-label="Navigation öffnen"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white/90 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 stroke-[2]" />}
      </button>

      {/* Slide-out Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 mx-3 p-5 rounded-2xl bg-[#080d1e]/95 backdrop-blur-xl border border-amber-500/20 shadow-2xl z-50 text-slate-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
                <BrandLogo variant="inline" size="sm" />
                <span className="text-[10px] font-mono text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  LIVE v2.4
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400/80 mb-2">
                Navigation & Module
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenAnalysis?.();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 font-semibold text-sm hover:bg-amber-400/20 transition-colors text-left"
              >
                <span className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  KI-Marktanalyse starten
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 gap-2 pt-1 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenModule?.('enterprise-scorer');
                  }}
                  className="w-full flex items-center justify-between py-2 px-2 text-sm text-slate-300 hover:text-amber-400 text-left transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-purple-400" />
                    Enterprise Scorer
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenModule?.('buffett-value');
                  }}
                  className="w-full flex items-center justify-between py-2 px-2 text-sm text-slate-300 hover:text-amber-400 text-left transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Buffett Value Check
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenModule?.('vocabulary');
                  }}
                  className="w-full flex items-center justify-between py-2 px-2 text-sm text-slate-300 hover:text-amber-400 text-left transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    Finanz-Glossar (Vocabulary)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Version 2.4 (Live Feed)</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Märkte aktiv
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
