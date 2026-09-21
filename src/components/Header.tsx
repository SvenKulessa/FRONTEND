import React, { useState } from 'react';
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  ShieldCheck,
  Zap,
  BookOpen,
  Activity,
  Newspaper,
  Coins,
  BarChart3,
  Globe,
  DollarSign,
  Flame,
  LogIn,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { ASSET_CLASSES } from '../data/mockData';
import { MainCategory, AssetSubclass } from '../types';
import { trackLoginClick } from '../utils/analytics';

interface HeaderProps {
  onOpenAnalysis?: () => void;
  onOpenModule?: (moduleId: string) => void;
  onSelectSubclass?: (subclass: AssetSubclass, category: MainCategory) => void;
  onViewAllMarkets?: () => void;
  onNavigateLogin?: () => void;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAnalysis,
  onOpenModule,
  onSelectSubclass,
  onViewAllMarkets,
  onNavigateLogin,
  onNavigate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedClass, setExpandedClass] = useState<MainCategory | null>('KRYPTO');

  const renderClassIcon = (id: MainCategory) => {
    switch (id) {
      case 'KRYPTO':
        return <Coins className="w-3.5 h-3.5" />;
      case 'AKTIEN':
        return <BarChart3 className="w-3.5 h-3.5" />;
      case 'INDIZIES':
        return <Globe className="w-3.5 h-3.5" />;
      case 'FOREX':
        return <DollarSign className="w-3.5 h-3.5" />;
      case 'ROHSTOFFE':
        return <Flame className="w-3.5 h-3.5" />;
      default:
        return <Coins className="w-3.5 h-3.5" />;
    }
  };

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

      {/* RIGHT SIDE: Live Status Chip & Login Button */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onOpenAnalysis}
          className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(249,191,33,0.15)]"
          data-analytics="header-analysis-btn"
          data-ga-category="navigation"
          data-ga-action="open_analysis"
        >
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Analyse</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE</span>
        </div>

        {/* PROMINENT TOP-RIGHT LOGIN BUTTON LEADING TO /login */}
        <a
          id="header-login-btn"
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            trackLoginClick('header_top_right');
            onNavigateLogin?.();
          }}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400/15 via-[#FF2E93]/15 to-[#8D26FF]/20 hover:from-amber-400/25 hover:via-[#FF2E93]/25 hover:to-[#8D26FF]/35 border border-amber-400/40 hover:border-amber-300 text-amber-200 hover:text-white text-xs font-bold transition-all shadow-[0_0_14px_rgba(249,191,33,0.18)] hover:shadow-[0_0_20px_rgba(255,46,147,0.3)] active:scale-95 cursor-pointer group shrink-0"
          data-analytics="login-click"
          data-ga-category="authentication"
          data-ga-action="click_login"
          data-ga-label="header_top_right"
          aria-label="Zum Capital-AI Login /login"
          title="Terminal Anmeldung (/login)"
        >
          <LogIn className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-200 group-hover:scale-110 transition-all" />
          <span>Login</span>
        </a>
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

                {/* Status Indicator & Quick Login */}
                <div className="mt-4 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400/10 via-purple-500/10 to-transparent border border-amber-400/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-amber-200">System v6.0 Online</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/30">
                    #8D26FF
                  </span>
                </div>

                {/* Mobile Drawer Login CTA */}
                <div className="mt-3">
                  <a
                    id="drawer-login-btn"
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      trackLoginClick('drawer');
                      onNavigateLogin?.();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400/15 via-[#FF2E93]/15 to-[#8D26FF]/20 border border-amber-400/40 text-amber-200 hover:text-white font-bold text-xs transition-all shadow-[0_0_12px_rgba(249,191,33,0.15)] group"
                    data-analytics="drawer-login-click"
                    data-ga-category="authentication"
                    data-ga-action="click_login"
                    data-ga-label="drawer_menu"
                  >
                    <span className="flex items-center gap-2">
                      <LogIn className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>Terminal Anmeldung (/Login)</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  </a>
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

                  {/* ASSETKLASSEN & UNTERKLASSEN (KRYPTO, AKTIEN, INDIZIES, FOREX, ROHSTOFFE) */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80">
                        Assetklassen & Unterklassen
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onViewAllMarkets?.();
                        }}
                        className="text-[10px] font-semibold text-amber-300 hover:text-amber-200 cursor-pointer flex items-center gap-0.5"
                      >
                        <span>Alle Märkte</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {ASSET_CLASSES.map((cls) => {
                        const isExpanded = expandedClass === cls.id;
                        return (
                          <div
                            key={cls.id}
                            className="rounded-xl border border-slate-800/80 bg-[#060c1d]/90 overflow-hidden transition-all"
                            style={{
                              borderColor: isExpanded ? `${cls.color}50` : undefined,
                            }}
                          >
                            {/* Asset Class Header Button */}
                            <button
                              type="button"
                              onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
                              className="w-full flex items-center justify-between p-2.5 text-left hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border"
                                  style={{
                                    backgroundColor: `${cls.color}18`,
                                    borderColor: `${cls.color}35`,
                                    color: cls.color,
                                  }}
                                >
                                  {renderClassIcon(cls.id)}
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[12.5px] font-bold text-white block truncate">
                                    {cls.name}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border"
                                  style={{
                                    color: cls.color,
                                    backgroundColor: `${cls.color}10`,
                                    borderColor: `${cls.color}30`,
                                  }}
                                >
                                  {cls.subclasses.length} Klassen
                                </span>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                    isExpanded ? 'rotate-180 text-white' : ''
                                  }`}
                                />
                              </div>
                            </button>

                            {/* Subclasses List Accordion */}
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden border-t border-slate-800/60 bg-black/25"
                                >
                                  <div className="p-2 space-y-1.5">
                                    {cls.subclasses.map((sub) => (
                                      <div
                                        key={sub.id}
                                        onClick={() => {
                                          setIsMenuOpen(false);
                                          onSelectSubclass?.(sub, cls.id);
                                        }}
                                        className="p-2 rounded-lg bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="text-[11.5px] font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                                            {sub.name}
                                          </span>
                                          {sub.trending && (
                                            <span className="text-[9.5px] font-mono text-emerald-400 font-bold bg-emerald-400/10 px-1 rounded">
                                              {sub.trending}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                                          {sub.shortDesc}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                                          {sub.examples.map((ex) => (
                                            <span
                                              key={ex}
                                              className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/5 text-slate-300"
                                            >
                                              {ex}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom */}
              <div className="p-5 border-t border-slate-800/80 bg-[#060914]">
                <div className="text-[11px] text-slate-400 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>Echtzeit-Feed:</span>
                    <span className="text-emerald-400 font-mono">Sub-45ms Latenz</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sicherheitsstandard:</span>
                    <span className="text-amber-300 font-mono">SSL 256-Bit • MiCA</span>
                  </div>
                </div>

                {/* Direct Legal & FAQ Routing Links in Drawer */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigate?.('/faq');
                    }}
                    className="hover:text-amber-300 transition-colors font-bold text-amber-400 cursor-pointer"
                  >
                    FAQ
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigate?.('/datenschutz');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Datenschutz
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigate?.('/agb');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    AGB
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigate?.('/impressum');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Impressum
                  </button>
                </div>

                <div className="mt-2 text-center text-[10px] text-slate-500">
                  <span>© {new Date().getFullYear()} Capital-AI</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
