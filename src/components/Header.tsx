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
  Building2,
  Leaf,
  FileCode,
  Bot,
  Gauge,
  Sliders,
  LineChart,
  Compass,
  GraduationCap,
  Users,
  Server,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { ASSET_CLASSES } from '../data/mockData';
import { MainCategory, AssetSubclass } from '../types';
import { trackLoginClick } from '../utils/analytics';
import { usePriceAlerts } from '../context/PriceAlertsContext';

interface HeaderProps {
  currentRoute?: string;
  onOpenAnalysis?: () => void;
  onOpenSectorAnalysis?: () => void;
  onOpenModule?: (moduleId: string) => void;
  onOpenVocabulary?: () => void;
  onOpenPriceAlerts?: () => void;
  onOpenMonetization?: () => void;
  onOpenWhaleRadar?: () => void;
  onOpenMarketscreener?: () => void;
  onSelectSubclass?: (subclass: AssetSubclass, category: MainCategory) => void;
  onViewAllMarkets?: () => void;
  onNavigateLogin?: () => void;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onOpenAnalysis,
  onOpenSectorAnalysis,
  onOpenModule,
  onOpenVocabulary,
  onOpenPriceAlerts,
  onOpenMonetization,
  onOpenWhaleRadar,
  onOpenMarketscreener,
  onSelectSubclass,
  onViewAllMarkets,
  onNavigateLogin,
  onNavigate,
}) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedHub, setExpandedHub] = useState<string | null>('studio');
  const [expandedClass, setExpandedClass] = useState<MainCategory | null>('KRYPTO');
  const { activeAlertsCount, triggeredAlertsCount } = usePriceAlerts();

  // Active Hub Calculation for the 4 Reiter
  const isMarketscreenerActive =
    !currentRoute ||
    currentRoute === '/' ||
    currentRoute === '/marketscreener' ||
    currentRoute === '/screener';
  const isStudioActive =
    currentRoute === '/studio' ||
    currentRoute === '/architecture' ||
    currentRoute === '/pipeline-builder';
  const isLearningActive =
    currentRoute === '/learning' ||
    currentRoute === '/vocabulary' ||
    currentRoute === '/glossar';
  const isControlActive =
    currentRoute === '/control-center' ||
    currentRoute === '/admin' ||
    currentRoute === '/roadmap' ||
    currentRoute === '/cost-center';

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
    <header className="relative z-30 w-full px-3 sm:px-6 pt-3.5 pb-2.5 flex items-center justify-between select-none">
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

      {/* CENTER: DIE 4 HAUPTREITER (Marketscreener, Studio Hub, Learning Portal, Control Center) */}
      <nav aria-label="Hauptnavigation" className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-slate-800/80 shadow-inner">
        {/* Marketscreener */}
        <button
          type="button"
          onClick={() => onNavigate?.('/')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
            isMarketscreenerActive
              ? 'bg-amber-400 text-black font-extrabold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="Marketscreener (Echtzeit-Marktdaten & Scorer)"
        >
          <LineChart className="w-3.5 h-3.5" />
          <span>Marketscreener</span>
        </button>

        {/* Studio Hub */}
        <button
          type="button"
          onClick={() => onNavigate?.('/studio')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
            isStudioActive
              ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="Studio Hub (7 Module: Architektur, Builder, Blueprints, etc.)"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Studio Hub</span>
        </button>

        {/* Learning Portal */}
        <button
          type="button"
          onClick={() => onNavigate?.('/learning')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
            isLearningActive
              ? 'bg-amber-400 text-black font-extrabold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="Learning Portal (Vocabulary, Glossar & Cheat-Sheets)"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Learning Portal</span>
        </button>

        {/* Control Center */}
        <button
          type="button"
          onClick={() => onNavigate?.('/control-center')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
            isControlActive
              ? 'bg-rose-500 text-white font-extrabold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="Control Center (v1.0 Roadmap, Cockpit, Console & Governance)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Control Center</span>
        </button>
      </nav>

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

        {/* STUDIO HUB BUTTON */}
        <button
          type="button"
          onClick={() => onNavigate?.('/studio')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)] shrink-0"
          title="Studio Hub: Pipeline Architektur, Blueprints, Pipeline Builder, AI Kauf-Berater, Data & Providers, Analytics & Scoring, Benchmark Lab, Configurator Console (/studio)"
        >
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Studio Hub</span>
        </button>

        {/* LIVE LATENCY STATUS CHIP */}
        <button
          type="button"
          onClick={() => onNavigate?.('/provider-status')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-[11px] font-mono text-emerald-400 transition-all cursor-pointer group shrink-0"
          title="Data Provider Status Dashboard, Latenzen & Health Monitor (/provider-status)"
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

                {/* Navigation Sections: DIE 4 HAUPTHUBS (GLEICHE GRAFIKARCHITEKTUR WIE ASSETKLASSEN) */}
                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 px-1 mb-1">
                      Plattform Hubs &amp; Navigation
                    </div>

                    {[
                      {
                        id: 'marketscreener',
                        name: 'Market Screener Hub',
                        color: '#F5B014',
                        icon: <LineChart className="w-3.5 h-3.5" />,
                        badge: '5 Module',
                        tabs: [
                          {
                            id: 'screener',
                            name: 'Multi Asset Screener Terminal',
                            icon: <LineChart className="w-3.5 h-3.5 text-amber-400" />,
                            badge: 'Sub-45ms',
                            shortDesc: 'Echtzeit Cross-Sectional Ranking über alle 5 Haupt-Assetklassen mit 50 Quant-Dimensionen',
                            tags: ['Aktien', 'Krypto', 'Forex', 'Rohstoffe'],
                            onClick: () => {
                              if (onOpenMarketscreener) onOpenMarketscreener();
                              else onOpenAnalysis?.();
                            },
                          },
                          {
                            id: 'buffett',
                            name: 'Buffett Value Check',
                            icon: <Leaf className="w-3.5 h-3.5 text-emerald-400" />,
                            badge: 'Moat & DCF',
                            shortDesc: 'Burggraben-Kriterien, ROE > 15% & Margin of Safety nach Warren Buffett',
                            tags: ['Burggraben', 'DCF', 'FCF Yield'],
                            onClick: () => onOpenModule?.('buffett-value'),
                          },
                          {
                            id: 'scorer',
                            name: 'Enterprise Scorer (0-100)',
                            icon: <Zap className="w-3.5 h-3.5 text-purple-400" />,
                            badge: 'Multi-Faktor',
                            shortDesc: 'Fundamentaldaten, Cashflows & Altman Z-Score Bewertung in einer Kennzahl',
                            tags: ['Multi-Faktor', 'Z-Score', 'Piotroski'],
                            onClick: () => onOpenModule?.('enterprise-scorer'),
                          },
                          {
                            id: 'sector',
                            name: 'KI-Sektor-Rotation',
                            icon: <Layers className="w-3.5 h-3.5 text-cyan-400" />,
                            badge: 'Kapitalfluss',
                            shortDesc: 'Sektor-Rotations-Radar & institutionelle Liquiditätsströme in Echtzeit',
                            tags: ['Rotation', 'Makro', 'Kapitalfluss'],
                            onClick: () => onOpenSectorAnalysis?.(),
                          },
                          {
                            id: 'newsfeed',
                            name: 'AI Newsfeed',
                            icon: <Newspaper className="w-3.5 h-3.5 text-[#F87171]" />,
                            badge: 'NLP-Sentiment',
                            shortDesc: 'NLP-Sentiment-Impact & kuratierte Marktnachrichten mit Auswirkungs-Score',
                            tags: ['NLP', 'Sentiment', 'Breaking News'],
                            onClick: () => onOpenModule?.('ai-newsfeed'),
                          },
                          {
                            id: 'alerts',
                            name: 'PriceAlerts & Schwellenwerte',
                            icon: <Bell className="w-3.5 h-3.5 text-amber-400" />,
                            badge: `${activeAlertsCount} aktiv`,
                            shortDesc: 'Echtzeit-Preisalarme, Ausbruchssignale & Schwellenwert-Überwachung',
                            tags: ['Alarme', 'Benachrichtigungen'],
                            onClick: () => onOpenPriceAlerts?.(),
                          },
                        ],
                      },
                      {
                        id: 'studio',
                        name: 'Studio Hub',
                        color: '#06B6D4',
                        icon: <Building2 className="w-3.5 h-3.5" />,
                        badge: '7 Tabs',
                        tabs: [
                          {
                            id: 'architecture',
                            name: 'Pipeline Architektur',
                            icon: <Layers className="w-3.5 h-3.5 text-amber-400" />,
                            badge: '16 Konzepte',
                            shortDesc: 'Vollständige 5-Ebenen Ingestion-Architektur & BaFin WORM Spezifikation',
                            tags: ['Layer 1-5', 'BaFin', 'WORM'],
                            onClick: () => onNavigate?.('/studio?tab=architecture'),
                          },
                          {
                            id: 'blueprints',
                            name: 'Blueprints & Schemata',
                            icon: <FileCode className="w-3.5 h-3.5 text-cyan-400" />,
                            badge: '7 Schemata',
                            shortDesc: 'Bereitstellbare Integrations-Vorlagen für TradingView, Python & Bloomberg',
                            tags: ['TradingView', 'Python', 'Pandas'],
                            onClick: () => onNavigate?.('/studio?tab=blueprints'),
                          },
                          {
                            id: 'builder',
                            name: 'Pipeline Builder',
                            icon: <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />,
                            badge: 'Modular',
                            shortDesc: 'Interaktiver Konfigurator mit strikter 40 € / Monat Budget-Garantie',
                            tags: ['Bill of Materials', '40 € Cap'],
                            onClick: () => onNavigate?.('/studio?tab=builder'),
                          },
                          {
                            id: 'advisor',
                            name: 'AI Kauf-Berater',
                            icon: <Bot className="w-3.5 h-3.5 text-purple-400" />,
                            badge: 'Advisor',
                            shortDesc: 'KI-gestützter Architekt für Latenz-, Lizenz- & MaRisk-Optimierung',
                            tags: ['KI-Berater', 'Revenue Assurance'],
                            onClick: () => onNavigate?.('/studio?tab=advisor'),
                          },
                          {
                            id: 'providers',
                            name: 'Data & Providers',
                            icon: <Radio className="w-3.5 h-3.5 text-emerald-400" />,
                            badge: 'Fleet Health',
                            shortDesc: 'Latenz- & Ausführungsstatus der autorisierten Provider-Gateways',
                            tags: ['Kraken', 'Binance', '12Data'],
                            onClick: () => onNavigate?.('/studio?tab=providers'),
                          },
                          {
                            id: 'analytics',
                            name: 'Analytics & Scoring',
                            icon: <BarChart3 className="w-3.5 h-3.5 text-amber-400" />,
                            badge: '50 Faktoren',
                            shortDesc: '50-Komponenten Multi-Faktor Engine & Z-Score Berechnung',
                            tags: ['Z-Score', '50 Quants'],
                            onClick: () => onNavigate?.('/studio?tab=analytics'),
                          },
                          {
                            id: 'benchmark',
                            name: 'Benchmark Lab',
                            icon: <Gauge className="w-3.5 h-3.5 text-cyan-400" />,
                            badge: 'Sub-45ms',
                            shortDesc: 'Live Conflation Stress-Testing & deterministisches Schatten-Benchmarking',
                            tags: ['Conflation', 'Sub-45ms'],
                            onClick: () => onNavigate?.('/studio?tab=benchmark'),
                          },
                        ],
                      },
                      {
                        id: 'learning',
                        name: 'Learning Portal',
                        color: '#F9BF21',
                        icon: <BookOpen className="w-3.5 h-3.5" />,
                        badge: '3 Bereiche',
                        tabs: [
                          {
                            id: 'glossar',
                            name: 'Market Vocabulary & Glossar',
                            icon: <BookOpen className="w-3.5 h-3.5 text-amber-400" />,
                            badge: '480+ Begriffe',
                            shortDesc: 'Umfassendes Finanz- und Krypto-Lexikon mit praxiserprobten Faustformeln',
                            tags: ['Lexikon', 'Faustformeln', 'Formeln'],
                            onClick: () => onNavigate?.('/learning?tab=glossar'),
                          },
                          {
                            id: 'guides',
                            name: 'Cheat-Sheets & Guides',
                            icon: <Layers className="w-3.5 h-3.5 text-cyan-400" />,
                            badge: '4 Guides',
                            shortDesc: 'Spickzettel für Buffett Value Investing, BaFin WORM & Latenz-Architektur',
                            tags: ['DCF', 'MaRisk', 'Cheatsheets'],
                            onClick: () => onNavigate?.('/learning?tab=guides'),
                          },
                          {
                            id: 'quiz',
                            name: 'Quant & Trader Skill-Check',
                            icon: <GraduationCap className="w-3.5 h-3.5 text-purple-400" />,
                            badge: 'Quiz',
                            shortDesc: 'Interaktiver Wissenstest mit Sofort-Auswertung & Skill-Level Einstufung',
                            tags: ['Skill-Test', 'Zertifikat'],
                            onClick: () => onNavigate?.('/learning?tab=quiz'),
                          },
                        ],
                      },
                      {
                        id: 'control-center',
                        name: 'Control Center',
                        color: '#F43F5E',
                        icon: <ShieldCheck className="w-3.5 h-3.5" />,
                        badge: '6 Bereiche',
                        tabs: [
                          {
                            id: 'roadmap',
                            name: 'Roadmap (v1.0 Go-Live)',
                            icon: <Compass className="w-3.5 h-3.5 text-rose-400" />,
                            badge: '11 Owner',
                            shortDesc: 'Navigationsfreundliche Roadmap filterbar nach 11 Projektownern & 5 Phasen',
                            tags: ['11 Owner', '5 Phasen', 'AP-001..011'],
                            onClick: () => onNavigate?.('/control-center?tab=roadmap'),
                          },
                          {
                            id: 'console',
                            name: 'Configurator Console',
                            icon: <Sliders className="w-3.5 h-3.5 text-rose-400" />,
                            badge: 'Admin & Audit',
                            shortDesc: 'Shadow-Run Orchestrierung, 50-Komponenten Health & BaFin Revisionskontrolle',
                            tags: ['Shadow Run', 'Audit Trail', 'Governance'],
                            onClick: () => onNavigate?.('/control-center?tab=console'),
                          },
                          {
                            id: 'cockpit',
                            name: 'Executive Cockpit',
                            icon: <Activity className="w-3.5 h-3.5 text-amber-400" />,
                            badge: 'GF & Founder',
                            shortDesc: 'SLA-Monitoring, MaRisk Compliance-Score & Schnell-Aktionen für Geschäftsführung',
                            tags: ['GF / Founder', 'MaRisk', 'KPIs'],
                            onClick: () => onNavigate?.('/control-center?tab=cockpit'),
                          },
                          {
                            id: 'team',
                            name: 'Team & Rollen',
                            icon: <Users className="w-3.5 h-3.5 text-cyan-400" />,
                            badge: '11 Leads',
                            shortDesc: 'Verantwortlichkeits- und Berechtigungsmatrix aller 11 Projektverantwortlichen',
                            tags: ['Rollenmatrix', 'Leads'],
                            onClick: () => onNavigate?.('/control-center?tab=team'),
                          },
                          {
                            id: 'cost_center',
                            name: 'Cost Center & Finanzen',
                            icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
                            badge: '40 € Cap',
                            shortDesc: 'AP-006 Budget-Governance & monatliche Kostenkontrolle unter 40 €',
                            tags: ['Finanzen', 'AP-006', 'Budget-Cap'],
                            onClick: () => onNavigate?.('/control-center?tab=cost_center'),
                          },
                          {
                            id: 'system',
                            name: 'Webanwendung & System',
                            icon: <Server className="w-3.5 h-3.5 text-purple-400" />,
                            badge: 'Optionen',
                            shortDesc: 'Feature Flags, Auto-Healing & WORM-Archivierungsstatus für Administratoren',
                            tags: ['Feature Flags', 'System-Optionen'],
                            onClick: () => onNavigate?.('/control-center?tab=system'),
                          },
                        ],
                      },
                    ].map((hub) => {
                      const isExpanded = expandedHub === hub.id;
                      return (
                        <div
                          key={hub.id}
                          className="rounded-xl border border-slate-800/80 bg-[#060c1d]/90 overflow-hidden transition-all"
                          style={{
                            borderColor: isExpanded ? `${hub.color}50` : undefined,
                          }}
                        >
                          {/* Hub Header Button */}
                          <button
                            type="button"
                            onClick={() => setExpandedHub(isExpanded ? null : hub.id)}
                            className="w-full flex items-center justify-between p-2.5 text-left hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border"
                                style={{
                                  backgroundColor: `${hub.color}18`,
                                  borderColor: `${hub.color}35`,
                                  color: hub.color,
                                }}
                              >
                                {hub.icon}
                              </div>
                              <div className="min-w-0">
                                <span className="text-[12.5px] font-bold text-white block truncate">
                                  {hub.name}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border"
                                style={{
                                  color: hub.color,
                                  backgroundColor: `${hub.color}10`,
                                  borderColor: `${hub.color}30`,
                                }}
                              >
                                {hub.badge}
                              </span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-white' : ''
                                }`}
                              />
                            </div>
                          </button>

                          {/* Sub-tabs List Accordion */}
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
                                  {hub.tabs.map((tab) => (
                                    <div
                                      key={tab.id}
                                      onClick={() => {
                                        setIsMenuOpen(false);
                                        tab.onClick();
                                      }}
                                      className="p-2 rounded-lg bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-[11.5px] font-bold text-slate-200 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                                          <span className="text-slate-500 font-mono text-[10px]">↳</span>
                                          {tab.icon}
                                          <span>{tab.name}</span>
                                        </span>
                                        {tab.badge && (
                                          <span
                                            className="text-[9.5px] font-mono font-bold px-1 rounded border"
                                            style={{
                                              color: hub.color,
                                              backgroundColor: `${hub.color}15`,
                                              borderColor: `${hub.color}30`,
                                            }}
                                          >
                                            {tab.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2 pl-4">
                                        {tab.shortDesc}
                                      </p>
                                      {tab.tags && (
                                        <div className="flex items-center gap-1 mt-1.5 flex-wrap pl-4">
                                          {tab.tags.map((tag) => (
                                            <span
                                              key={tag}
                                              className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/5 text-slate-300"
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      )}
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

                  {/* SECTION 5: SYSTEM & MEHR */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1 mb-2">
                      System &amp; Mehr
                    </div>

                    <div className="space-y-1">
                      {/* MONETARISIERUNGSKONZEPT & TARIFE */}
                      {onOpenMonetization && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenMonetization();
                          }}
                          className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                            <span>Preise &amp; SaaS Tarife</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                      )}

                      {/* $CPT TOKENOMICS */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onNavigate?.('/tokenomics');
                        }}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <span>$CPT Tokenomics &amp; Staking</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                      </button>
                    </div>
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
                    FinTech Architektur
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
