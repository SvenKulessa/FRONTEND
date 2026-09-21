import React, { useState } from 'react';
import { Menu, X, ChevronRight, TrendingUp, ShieldCheck, Zap, BookOpen, Activity, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenAnalysis?: () => void;
  onOpenModule?: (moduleId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAnalysis, onOpenModule }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-30 w-full px-4 sm:px-6 pt-3.5 pb-2.5 flex items-center justify-between select-none">
      {/* LEFT SIDE: Hamburger Navigation Button & Brand Logo */}
      <div className="flex items-center space-x-3">
        {/* Hamburger Menu Button on the Left */}
        <button
          id="mobile-menu-btn"
          type="button"
          aria-label="Navigation öffnen"
          onClick={() => setIsMenuOpen(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 active:bg-white/15 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-[0_0_12px_rgba(249,191,33,0.12)] cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Vector SVG Brand Logo */}
        <BrandLogo
          variant="inline"
          size="md"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>

      {/* RIGHT SIDE: Live Status Chip */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onOpenAnalysis}
          className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(249,191,33,0.15)]"
        >
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Analyse</span>
        </button>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">LIVE</span>
        </div>
      </div>

      {/* Slide-out Mobile Menu Drawer FROM THE LEFT ("links aufklappbar") */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Left Slide-in Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 bottom-0 left-0 w-[85%] max-w-[320px] bg-[#090D1C] border-r border-amber-500/25 shadow-[0_0_40px_rgba(0,0,0,0.8)] z-50 flex flex-col justify-between overflow-y-auto text-slate-200"
            >
              {/* Drawer Top / Header */}
              <div className="p-5">
                <div className="flex items-center justify-between pb-4 border-b border-amber-500/15">
                  <BrandLogo variant="inline" size="sm" />
                  <button
                    id="close-menu-btn"
                    type="button"
                    aria-label="Navigation schließen"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400/10 via-purple-500/10 to-transparent border border-amber-400/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-amber-200">System v6.0 Online</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/30">
                    #8D26FF
                  </span>
                </div>

                {/* Navigation Sections */}
                <div className="mt-5 space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80 px-1">
                    Kernfunktionen & Module
                  </div>

                  {/* Primary CTA */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAnalysis?.();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-transparent border border-amber-400/40 text-amber-200 font-semibold text-sm hover:from-amber-500/30 hover:to-purple-500/25 transition-all text-left group shadow-[0_0_15px_rgba(249,191,33,0.12)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      KI-Marktanalyse
                    </span>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </button>

                  <div className="grid grid-cols-1 gap-1.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenModule?.('enterprise-scorer');
                      }}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 text-left transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-[#8D26FF]" />
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
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 text-left transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#44DE88]" />
                        Buffett Value Check
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenModule?.('ai-newsfeed');
                      }}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 text-left transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <Newspaper className="w-4 h-4 text-[#F87171]" />
                        AI Newsfeed
                      </span>
                      <span className="text-[10px] font-mono text-[#F87171] bg-[#F87171]/15 px-1.5 py-0.5 rounded border border-[#F87171]/30">
                        NEU
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenModule?.('vocabulary');
                      }}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 text-left transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-[#F9BF21]" />
                        Finanz-Glossar
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom */}
              <div className="p-5 border-t border-slate-800/80 bg-[#060914]">
                <div className="text-[11px] text-slate-400 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>Kraken Pro Partner:</span>
                    <span className="text-amber-300 font-mono">Verbunden</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>KI-Latenz:</span>
                    <span className="text-emerald-400 font-mono">12 ms</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500">
                  <span>© Capital-AI</span>
                  <span>v6.0 Manifest</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
