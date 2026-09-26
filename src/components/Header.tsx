/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: GLOBAL NAVIGATION & TERMINAL HEADER]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Vector Brand Logo mit goldenem Glowing-Effekt
 *    - Live Latency Status Chip (`Sub-45ms Latenz`)
 *    - Schnellzugriff-Buttons (Analyse, Sektoren, Whale Radar, Tarife, Login)
 *    - Vollintegriertes Hamburger-Drawer-Menü mit Assetklassen-Hierarchie
 * 2. SCORING-LOGIK        : 
 *    - Indiziert Alert-Zähler (`activeAlertsCount`, `triggeredAlertsCount`)
 *    - Visuelle Notification-Badges bei Schwellenwert-Auslösung
 * 3. DATENANBINDUNG       : 
 *    - `usePriceAlerts()` Context Hook für Alert-Zähler
 *    - Google Analytics Event Tracking (`trackLoginClick`, `header-analysis-btn`)
 * 4. DATENQUELLEN / FEEDS : 
 *    - Asset-Klassen-Katalog (ASSET_CLASSES)
 *    - Live-Feed-Latenz-Indikator
 * ============================================================================
 */

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
  Bell,
  BellRing,
  Layers,
  CreditCard,
  Radio,
  Cpu,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { ASSET_CLASSES } from '../data/mockData';
import { MainCategory, AssetSubclass } from '../types';
import { trackLoginClick } from '../utils/analytics';
import { usePriceAlerts } from '../context/PriceAlertsContext';

interface HeaderProps {
  onOpenAnalysis?: () => void;
  onOpenSectorAnalysis?: () => void;
  onOpenModule?: (moduleId: string) => void;
  onOpenVocabulary?: () => void;
  onOpenPriceAlerts?: () => void;
  onOpenMonetization?: () => void;
  onOpenWhaleRadar?: () => void;
  onSelectSubclass?: (subclass: AssetSubclass, category: MainCategory) => void;
  onViewAllMarkets?: () => void;
  onNavigateLogin?: () => void;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAnalysis,
  onOpenSectorAnalysis,
  onOpenModule,
  onOpenVocabulary,
  onOpenPriceAlerts,
  onOpenMonetization,
  onOpenWhaleRadar,
  onSelectSubclass,
  onViewAllMarkets,
  onNavigateLogin,
  onNavigate,
}) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedClass, setExpandedClass] = useState<MainCategory | null>('KRYPTO');
  const { activeAlertsCount, triggeredAlertsCount } = usePriceAlerts();

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
        {/* PRICE ALERTS BELL BUTTON */}
        <button
          type="button"
          onClick={onOpenPriceAlerts}
          className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer shadow-[0_0_12px_rgba(249,191,33,0.12)] shrink-0 group"
          aria-label="Preisalarme öffnen"
          title="PriceAlerts & Schwellenwerte"
        >
          <Bell className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-amber-400 text-black text-[9.5px] font-mono font-black flex items-center justify-center shadow-[0_0_8px_rgba(249,191,33,0.8)] border border-[#02050e]">
              {activeAlertsCount}
            </span>
          )}
          {triggeredAlertsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF2E93] animate-ping" />
          )}
        </button>

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

        {onOpenSectorAnalysis && (
          <button
            type="button"
            onClick={onOpenSectorAnalysis}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            title="Zur KI-Sektor-Analyse springen"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sektoren</span>
          </button>
        )}

        {onOpenWhaleRadar && (
          <button
            type="button"
            onClick={onOpenWhaleRadar}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            title="Smart Money Flow & On-Chain Whale Radar"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Whale Radar</span>
          </button>
        )}

        {onOpenMonetization && (
          <button
            type="button"
            onClick={onOpenMonetization}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(249,191,33,0.15)]"
            title="Preise, B2C SaaS Tarife & Business Model"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>Tarife</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onNavigate?.('/pipeline-builder')}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.12)] group"
          title="Pipeline Builder: Data Authority, Evidence, Tier 4 & Hybrid (/pipeline-builder)"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Pipeline Builder</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.('/tokenomics')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(249,191,33,0.12)] group"
          title="$CPT Tokenomics, Staking-Tiers & Deflationäres Konzept (/tokenomics)"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Tokenomics</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.('/architecture')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-[11px] font-mono text-emerald-400 transition-all cursor-pointer group"
          title="Kursdaten-Architektur, Provider & Low-Budget Pipeline (/architecture)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="group-hover:underline underline-offset-2">LIVE • Sub-45ms</span>
        </button>

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

                {/* Mobile Drawer Login CTA */}
                <div className="mt-4">
                  <a
                    id="drawer-login-btn"
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      trackLoginClick('drawer');
                      onNavigateLogin?.();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400/15 via-[#FF2E93]/15 to-[#8D26FF]/20 border border-amber-400/40 text-amber-200 hover:text-white font-bold text-xs transition-all shadow-[0_0_12px_rgba(249,191,33,0.15)] group"
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

                  {/* KI-Sektor-Analyse CTA */}
                  {onOpenSectorAnalysis && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenSectorAnalysis();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border border-cyan-400/40 text-cyan-200 font-semibold text-sm hover:from-cyan-500/30 hover:to-blue-500/25 transition-all text-left group shadow-[0_0_15px_rgba(6,182,212,0.12)] cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-400/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                          <Layers className="w-4 h-4" />
                        </div>
                        KI-Sektor-Analyse
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400 text-black">
                        Rotation
                      </span>
                    </button>
                  )}


                  {/* PRICE ALERTS SYSTEM IN DRAWER */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenPriceAlerts?.();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#091129] border border-amber-500/30 hover:border-amber-400 text-amber-200 font-semibold text-sm hover:bg-[#0e1a3e] transition-all text-left group shadow-[0_0_12px_rgba(249,191,33,0.08)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                        <Bell className="w-4 h-4 text-amber-400" />
                      </div>
                      <span>PriceAlerts &amp; Schwellenwerte</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {activeAlertsCount > 0 && (
                        <span className="text-[10px] font-mono font-bold bg-amber-400 text-black px-1.5 py-0.2 rounded-full">
                          {activeAlertsCount} aktiv
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-amber-400" />
                    </div>
                  </button>

                  {/* SMART MONEY FLOW & WHALE RADAR IN DRAWER */}
                  {onOpenWhaleRadar && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenWhaleRadar();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border border-cyan-400/40 text-cyan-200 font-semibold text-sm hover:from-cyan-500/30 hover:to-blue-500/25 transition-all text-left group shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-400/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                        </div>
                        <div>
                          <div className="text-white font-bold leading-none">Whale Radar &amp; Telegram</div>
                          <div className="text-[10px] text-cyan-300/80 mt-1 font-normal">Smart Money Flow &amp; On-Chain</div>
                        </div>
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400 text-black shadow-sm">
                        Live
                      </span>
                    </button>
                  )}

                  {/* MONETARISIERUNGSKONZEPT & TARIFE */}
                  {onOpenMonetization && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenMonetization();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-400/40 text-amber-200 font-semibold text-sm hover:from-amber-500/25 hover:to-orange-500/20 transition-all text-left group shadow-[0_0_15px_rgba(249,191,33,0.12)] cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-white font-bold leading-none">Preise &amp; Tarife</div>
                          <div className="text-[10px] text-amber-300/80 mt-1 font-normal">SaaS, B2B &amp; Simulator</div>
                        </div>
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black shadow-sm">
                        Modell
                      </span>
                    </button>
                  )}

                  {/* ARCHITEKTUR & KURS-DATEN PIPELINE */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigate?.('/architecture');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-transparent border border-blue-400/40 text-blue-200 font-semibold text-sm hover:from-blue-500/25 hover:to-indigo-500/20 transition-all text-left group shadow-[0_0_15px_rgba(59,130,246,0.12)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-400/20 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-bold leading-none">Architektur &amp; Kursdaten</div>
                        <div className="text-[10px] text-blue-300/80 mt-1 font-normal">Low-Budget &amp; Sub-45ms Pipeline</div>
                      </div>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-400 text-black shadow-sm">
                      /arch
                    </span>
                  </button>

                  {/* $CPT TOKENOMICS & STAKING */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigate?.('/tokenomics');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-400/40 text-amber-200 font-semibold text-sm hover:from-amber-500/25 hover:to-yellow-500/20 transition-all text-left group shadow-[0_0_15px_rgba(249,191,33,0.12)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-bold leading-none">$CPT Tokenomics &amp; Staking</div>
                        <div className="text-[10px] text-amber-300/80 mt-1 font-normal">Konzept, Tiers &amp; Deflation</div>
                      </div>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black shadow-sm">
                      $CPT
                    </span>
                  </button>

                  {/* DATA PIPELINE BUILDER */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigate?.('/pipeline-builder');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-400/40 text-cyan-200 font-semibold text-sm hover:from-cyan-500/25 hover:to-blue-500/20 transition-all text-left group shadow-[0_0_15px_rgba(6,182,212,0.12)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-400/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-bold leading-none">Data Pipeline Builder</div>
                        <div className="text-[10px] text-cyan-300/80 mt-1 font-normal">Data Authority, Evidence &amp; Tier 4</div>
                      </div>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400 text-black shadow-sm">
                      Builder
                    </span>
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

                    {/* MARKET VOCABULARY MODULE */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (onOpenVocabulary) {
                          onOpenVocabulary();
                        } else {
                          onOpenModule?.('vocabulary');
                        }
                      }}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm text-slate-200 hover:text-white bg-amber-400/5 hover:bg-amber-400/15 border border-amber-400/20 hover:border-amber-400/40 text-left transition-all cursor-pointer group shadow-[0_0_10px_rgba(249,191,33,0.06)]"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-3.5 h-3.5 text-[#F9BF21]" />
                        </div>
                        <span className="font-semibold group-hover:text-amber-300 transition-colors">
                          Market Vocabulary
                        </span>
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                        Glossar
                      </span>
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
                      onNavigate?.('/architecture');
                    }}
                    className="hover:text-amber-300 transition-colors font-bold text-amber-400 cursor-pointer"
                  >
                    Architektur
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigate?.('/faq');
                    }}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
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
