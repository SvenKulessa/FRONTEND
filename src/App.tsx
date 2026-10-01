/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: HAUPTANWENDUNG & ORCHESTRIERUNGS-CONTAINER]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Main Viewport Layout (iPhone Mockup Frame vs. Vollbreite)
 *    - Orchestriert alle Hauptsektionen (Hero, Sentiment, Sektoren, Whale Radar, Märkte, Module)
 *    - Globaler Modal-Container (Analysis, ProductTour, AssetDetail, Vocabulary, WhaleRadar, Pricing)
 * 2. SCORING-LOGIK        : 
 *    - Koordiniert globales State-Management & Filterung für Multi-Faktor-Scores
 *    - Dynamic Routing SEO-Scoring & Google Analytics Pageview Tracking
 * 3. DATENANBINDUNG       : 
 *    - PriceAlertsProvider (Zentraler Event-Bus & Context)
 *    - Browser History API & PopState Event Listener für SPA-Routing
 * 4. DATENQUELLEN / FEEDS : 
 *    - Integrierte Mock-Stores (MARKET_ASSETS, CORE_MODULES)
 *    - Sub-Klassen-Kataloge und Live-Alert-Subscriptions
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { KeyPillars } from './components/KeyPillars';
import { MarketOverview } from './components/MarketOverview';
import { CoreModules } from './components/CoreModules';
import { Footer } from './components/Footer';
import { StatusBar } from './components/StatusBar';
import { LoginPage } from './components/LoginPage';
import { AnalysisModal } from './components/AnalysisModal';
import { ProductTourModal } from './components/ProductTourModal';
import { AssetDetailModal } from './components/AssetDetailModal';
import { ModuleDetailModal } from './components/ModuleDetailModal';
import { AllMarketsModal } from './components/AllMarketsModal';
import { SubclassDetailModal } from './components/SubclassDetailModal';
import { LegalAndFaqPages, LegalRoute } from './components/LegalAndFaqPages';
import { MarketAsset, CoreModule, MainCategory, AssetSubclass } from './types';
import { CORE_MODULES, MARKET_ASSETS } from './data/mockData';
import { MarketVocabularyModal } from './components/MarketVocabularyModal';
import { initGoogleAnalytics, trackPageView, updatePageSEO } from './utils/analytics';
import { PriceAlertsProvider, usePriceAlerts } from './context/PriceAlertsContext';
import { PriceAlertToast } from './components/PriceAlertToast';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { MarketSentiment } from './components/MarketSentiment';
import { SectorAnalysis } from './components/SectorAnalysis';
import { WhaleRadarModal } from './components/WhaleRadarModal';
import { MonetizationModal } from './components/MonetizationModal';
import { ArchitecturePage } from './components/ArchitecturePage';
import { TokenomicsPage } from './components/TokenomicsPage';
import { PipelineBuilder } from './components/PipelineBuilder';
import { ProviderStatusDashboard } from './components/ProviderStatusDashboard';
import { FounderPage } from './components/FounderPage';
import { StudioPage, StudioTabKey } from './components/StudioPage';
import { LearningPortalPage, LearningPortalTab } from './components/LearningPortalPage';
import { ControlCenterPage, ControlCenterTab } from './components/ControlCenterPage';
import { MarketScreenerPage, MarketScreenerTab } from './components/MarketScreenerPage';
import { MarketscreenerModal } from './components/MarketscreenerModal';
import { EnterpriseScorerDashboard } from './components/EnterpriseScorerDashboard';
import { ScreenerTable } from './components/ScreenerTable';

export const LEGAL_ROUTES: LegalRoute[] = [
  '/faq',
  '/datenschutz',
  '/agb',
  '/impressum',
  '/lizenz',
  '/datenprovider-lizenzen',
  '/opensource-lizenzen',
];

export function resolveMarketScreenerTab(path: string): MarketScreenerTab {
  const p = path.toLowerCase();
  if (p.includes('buffett')) return 'buffett';
  if (p.includes('scorer') || p.includes('score')) return 'scorer';
  if (p.includes('sector') || p.includes('rotation')) return 'sector';
  if (p.includes('news') || p.includes('feed')) return 'newsfeed';
  if (p.includes('alert')) return 'alerts';
  return 'terminal';
}

export function resolveStudioTab(path: string): StudioTabKey {
  const p = path.toLowerCase();
  if (p.includes('blueprint')) return 'blueprints';
  if (p.includes('builder') || p.includes('konfigurator')) return 'builder';
  if (p.includes('advisor') || p.includes('berater')) return 'advisor';
  if (p.includes('provider') || p.includes('fleet')) return 'providers';
  if (p.includes('analytic') || p.includes('scoring')) return 'analytics';
  if (p.includes('benchmark')) return 'benchmark';
  return 'architecture';
}

export function resolveLearningTab(path: string): LearningPortalTab {
  const p = path.toLowerCase();
  if (p.includes('guide') || p.includes('cheat')) return 'guides';
  if (p.includes('quiz') || p.includes('skill')) return 'quiz';
  return 'glossar';
}

export function resolveControlCenterTab(path: string): ControlCenterTab {
  const p = path.toLowerCase();
  if (p.includes('console') || p.includes('audit')) return 'console';
  if (p.includes('cockpit') || p.includes('gf')) return 'cockpit';
  if (p.includes('team') || p.includes('rolle')) return 'team';
  if (p.includes('cost') || p.includes('finanz') || p.includes('budget')) return 'cost_center';
  if (p.includes('system') || p.includes('option') || p.includes('flag')) return 'system';
  return 'roadmap';
}

/**
 * Robust route normalizer supporting case-insensitivity, trailing slashes,
 * and German/English aliases (/Datenschutz, /AGB, /privacy, /terms, /imprint, etc.)
 */
export function resolveAppRoute(rawPath: string): string {
  if (!rawPath) return '/';
  const clean = rawPath.trim().toLowerCase().replace(/\/+$/, '') || '/';

  if (clean === '/login' || clean === '/anmelden' || clean === '/signin') {
    return '/login';
  }
  if (clean === '/faq' || clean === '/hilfe' || clean === '/questions') {
    return '/faq';
  }
  if (
    clean === '/datenschutz' ||
    clean === '/privacy' ||
    clean === '/privacy-policy' ||
    clean === '/datenschutzerklaerung'
  ) {
    return '/datenschutz';
  }
  if (
    clean === '/agb' ||
    clean === '/terms' ||
    clean === '/nutzungsbedingungen' ||
    clean === '/tos' ||
    clean === '/conditions'
  ) {
    return '/agb';
  }
  if (
    clean === '/impressum' ||
    clean === '/imprint' ||
    clean === '/anbieterkennzeichnung' ||
    clean === '/legal'
  ) {
    return '/impressum';
  }
  if (
    clean === '/lizenz' ||
    clean === '/license' ||
    clean === '/licenses' ||
    clean === '/design-lizenz'
  ) {
    return '/lizenz';
  }
  if (
    clean === '/datenprovider-lizenzen' ||
    clean === '/provider-licenses' ||
    clean === '/provider-license' ||
    clean === '/daten-lizenzen' ||
    clean === '/datenprovider' ||
    clean === '/academic-licenses' ||
    clean === '/academic-terms' ||
    clean === '/research-licenses' ||
    clean === '/forschungslizenzen'
  ) {
    return '/datenprovider-lizenzen';
  }
  if (
    clean === '/opensource-lizenzen' ||
    clean === '/os-licenses' ||
    clean === '/oss-licenses' ||
    clean === '/open-source' ||
    clean === '/oss'
  ) {
    return '/opensource-lizenzen';
  }

  // Market Screener Hub & Tab Pfade
  if (
    clean === '/marketscreener' ||
    clean.startsWith('/marketscreener/') ||
    clean === '/screener' ||
    clean.startsWith('/screener/') ||
    clean === '/buffett' ||
    clean === '/buffett-value' ||
    clean === '/enterprise-scorer' ||
    clean === '/scorer' ||
    clean === '/sector-analysis' ||
    clean === '/ai-newsfeed' ||
    clean === '/newsfeed' ||
    clean === '/price-alerts' ||
    clean === '/alerts' ||
    clean === '/market-screener'
  ) {
    return '/marketscreener';
  }

  // Learning Portal Hub & Tab Pfade
  if (
    clean === '/learning' ||
    clean.startsWith('/learning/') ||
    clean === '/learning-portal' ||
    clean === '/lernportal' ||
    clean === '/wissen' ||
    clean === '/vocabulary' ||
    clean === '/glossar' ||
    clean === '/lexikon' ||
    clean === '/market-vocabulary' ||
    clean === '/guides' ||
    clean === '/cheatsheets' ||
    clean === '/quiz' ||
    clean === '/skill-check' ||
    clean === '/dictionary'
  ) {
    return '/learning';
  }

  // Control Center Hub & Tab Pfade
  if (
    clean === '/control-center' ||
    clean.startsWith('/control-center/') ||
    clean === '/control' ||
    clean === '/admin' ||
    clean === '/cost-center' ||
    clean === '/roadmap' ||
    clean === '/console' ||
    clean === '/cockpit' ||
    clean === '/team' ||
    clean === '/system' ||
    clean === '/management' ||
    clean === '/gf' ||
    clean === '/founder-control'
  ) {
    return '/control-center';
  }

  if (
    clean === '/pricing' ||
    clean === '/preise' ||
    clean === '/tarife' ||
    clean === '/monetarisierung' ||
    clean === '/membership'
  ) {
    return '/pricing';
  }
  if (
    clean === '/whale-radar' ||
    clean === '/whales' ||
    clean === '/smart-money' ||
    clean === '/on-chain' ||
    clean === '/telegram'
  ) {
    return '/whale-radar';
  }
  if (
    clean === '/pipeline-builder' ||
    clean === '/builder' ||
    clean === '/pipeline-konfigurator' ||
    clean === '/data-pipeline' ||
    clean === '/pipeline'
  ) {
    return '/pipeline-builder';
  }
  if (
    clean === '/architecture' ||
    clean === '/architektur' ||
    clean === '/system-architecture' ||
    clean === '/kursdaten' ||
    clean === '/data-feed'
  ) {
    return '/architecture';
  }
  if (
    clean === '/tokenomics' ||
    clean === '/token' ||
    clean === '/cpt' ||
    clean === '/tokenomics-konzept' ||
    clean === '/token-economy'
  ) {
    return '/tokenomics';
  }

  // Studio Hub & Tab Pfade
  if (
    clean === '/studio' ||
    clean.startsWith('/studio/') ||
    clean === '/studio-hub' ||
    clean === '/blueprints' ||
    clean === '/advisor' ||
    clean === '/benchmark' ||
    clean === '/benchmark-lab' ||
    clean === '/analytics' ||
    clean === '/founder' ||
    clean === '/founder-hub' ||
    clean === '/founder-suite' ||
    clean === '/founders' ||
    clean === '/founder-strategie'
  ) {
    return '/studio';
  }

  if (
    clean === '/provider-status' ||
    clean === '/providers' ||
    clean === '/admin/providers' ||
    clean === '/provider-fleet' ||
    clean === '/fleet'
  ) {
    return '/provider-status';
  }
  return '/';
}


function AppContent() {
  const {
    isAlertModalOpen,
    setIsAlertModalOpen,
    isWhaleRadarOpen,
    setIsWhaleRadarOpen,
    openWhaleRadar,
  } = usePriceAlerts();
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return resolveAppRoute(window.location.pathname);
    }
    return '/';
  });
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  });


  const [viewMode, setViewMode] = useState<'mockup' | 'fullscreen'>('mockup');
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isMarketscreenerOpen, setIsMarketscreenerOpen] = useState(false);
  const [isProductTourOpen, setIsProductTourOpen] = useState(false);
  const [isAllMarketsOpen, setIsAllMarketsOpen] = useState(false);
  const [isMonetizationOpen, setIsMonetizationOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return resolveAppRoute(window.location.pathname) === '/pricing';
    }
    return false;
  });
  const [isVocabularyOpen, setIsVocabularyOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return resolveAppRoute(window.location.pathname) === '/vocabulary';
    }
    return false;
  });
  const [marketCategoryFilter, setMarketCategoryFilter] = useState<'ALLE' | MainCategory>('ALLE');
  const [marketSubclassFilter, setMarketSubclassFilter] = useState<string | undefined>(undefined);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [selectedModule, setSelectedModule] = useState<CoreModule | null>(null);
  const [selectedSubclass, setSelectedSubclass] = useState<{
    subclass: AssetSubclass;
    category: MainCategory;
  } | null>(null);

  // Analysis Modal initial state for shared query parameters
  const [analysisInitialTab, setAnalysisInitialTab] = useState<'asset' | 'sector'>('asset');
  const [analysisInitialTicker, setAnalysisInitialTicker] = useState<string | undefined>(undefined);
  const [analysisInitialSectorId, setAnalysisInitialSectorId] = useState<string | undefined>(undefined);

  // Initialize Analytics & handle popstate browser routing + query params
  useEffect(() => {
    initGoogleAnalytics();

    const parseUrlState = () => {
      const fullPath = window.location.pathname + window.location.search;
      const resolved = resolveAppRoute(window.location.pathname);
      setCurrentRoute(resolved);
      setCurrentPath(fullPath);

      // Check URL query parameters for shared analysis links
      try {
        const params = new URLSearchParams(window.location.search);
        const analysisParam = params.get('analysis');
        const tickerParam = params.get('ticker');
        const sectorParam = params.get('sector');

        if (analysisParam || tickerParam || sectorParam) {
          if (analysisParam === 'sector' || sectorParam) {
            setAnalysisInitialTab('sector');
            if (sectorParam) setAnalysisInitialSectorId(sectorParam);
          } else {
            setAnalysisInitialTab('asset');
            if (tickerParam) setAnalysisInitialTicker(tickerParam);
          }
          setIsAnalysisOpen(true);
        }
      } catch {
        // Silent fallback
      }
    };

    parseUrlState();

    const handlePopState = () => {
      parseUrlState();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update SEO metadata & GA pageview whenever route changes
  useEffect(() => {
    if (currentRoute === '/login') {
      const title = 'Capital-AI | Terminal Anmeldung & Login';
      const description =
        'Sicherer Zugang zum Capital-AI Terminal: KI-gestützte Echtzeit-Marktdaten, automatisierte Portfolio-Analysen und institutionelles Scoring.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/login',
      });
      trackPageView('/login', title);
    } else if (currentRoute === '/faq') {
      const title = 'Capital-AI | Häufig gestellte Fragen (FAQ)';
      const description =
        'Fragen und Antworten zu Capital-AI: Funktionsweise des KI-Scorings, Datenfeeds, Latenzen, unterstützte Assetklassen und Sicherheit.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/faq',
      });
      trackPageView('/faq', title);
    } else if (currentRoute === '/datenschutz') {
      const title = 'Capital-AI | Datenschutzerklärung';
      const description =
        'Datenschutzrichtlinie der Capital-AI Intelligence Plattform: DSGVO-Konformität, 256-Bit TLS-Verschlüsselung und Rechenzentren in der EU.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/datenschutz',
      });
      trackPageView('/datenschutz', title);
    } else if (currentRoute === '/agb') {
      const title = 'Capital-AI | Allgemeine Geschäftsbedingungen (AGB)';
      const description =
        'Nutzungsbedingungen und WpHG-Risikohinweise für die Nutzung der Capital-AI Marktanalyse-Plattform.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/agb',
      });
      trackPageView('/agb', title);
    } else if (currentRoute === '/impressum') {
      const title = 'Capital-AI | Impressum';
      const description =
        'Impressum und Anbieterkennzeichnung gemäß § 5 TMG / DDG der Capital-AI Technologies GmbH.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/impressum',
      });
      trackPageView('/impressum', title);
    } else if (currentRoute === '/learning' || currentRoute === '/vocabulary') {
      const title = 'Capital-AI | Learning Portal: Market Vocabulary & Glossar';
      const description =
        'Umfassendes Finanz- & Quant-Glossar von Capital-AI: Fachbegriffe verständlich erklärt mit Berechnungsformeln und Praxisbeispielen.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/learning',
      });
      trackPageView('/learning', title);
    } else if (currentRoute === '/control-center') {
      const title = 'Capital-AI | Control Center: Roadmap & Governance Console';
      const description =
        'Control Center von Capital-AI: Navigationsfreundliche v1.0 Roadmap nach 11 Projektownern, Executive Cockpit und Cost Center.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/control-center',
      });
      trackPageView('/control-center', title);
    } else if (currentRoute === '/pricing') {
      const title = 'Capital-AI | Preise, Tarife & Monetarisierungskonzept';
      const description =
        'Capital-AI Business Model: Transparente B2C SaaS Tarife (Free, Pro, Alpha Elite), B2B Data APIs, Broker-Affiliates und interaktiver Ertrags-Simulator.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/pricing',
      });
      trackPageView('/pricing', title);
      setIsMonetizationOpen(true);
    } else if (currentRoute === '/whale-radar') {
      const title = 'Capital-AI | Smart Money Flow & On-Chain Whale Radar';
      const description =
        'Echtzeit-Tracking institutioneller On-Chain Großtransaktionen, Smart Money Flow Index (SMFI), Dark Pool ATS Blocks und Telegram Push-Benachrichtigungen.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/whale-radar',
      });
      trackPageView('/whale-radar', title);
      setIsWhaleRadarOpen(true);
    } else if (currentRoute === '/pipeline-builder') {
      const title = 'Capital-AI | Data Pipeline Builder & Concept Synthesizer';
      const description =
        'Automatischer Pipeline Builder für Data Authority, Evidence, Tier 4, Hybrid & Individual Datenkonzepte für TradingView, Bloomberg, Python/Pandas & MetaTrader.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/pipeline-builder',
      });
      trackPageView('/pipeline-builder', title);
    } else if (currentRoute === '/architecture') {
      const title = 'Capital-AI | FinTech Architektur Konzepte & Low-Budget Pipeline';
      const description =
        'Technische Spezifikation der Capital-AI Marktdaten-Pipeline: Sub-45ms Latenz, Multi-Provider Failover, Zero-Trust Proxy, In-Memory Caching & Low-Budget Blueprint (<35€/Mo).';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/architecture',
      });
      trackPageView('/architecture', title);
    } else if (currentRoute === '/tokenomics') {
      const title = 'Capital-AI | $CPT Tokenomics, Staking & Deflations-Konzept';
      const description =
        'Wirtschafts- und Token-Konzept von Capital-AI ($CPT): 100M Hard Cap, Staking-Tiers für Sub-45ms Latenz, 25% Revenue Buyback & Burn sowie dezentrale Kuration.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/tokenomics',
      });
      trackPageView('/tokenomics', title);
    } else if (currentRoute === '/studio' || currentRoute === '/founder') {
      const title = 'Capital-AI | Studio Hub: Pipeline Architektur, Blueprints & Builder';
      const description =
        'Studio Hub von Capital-AI: 16 kanonische Datenkonzepte, 7 Produktions-Blueprints, modularer Pipeline Builder, AI Kauf-Berater und Benchmark Lab.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/studio',
      });
      trackPageView('/studio', title);
    } else if (currentRoute === '/provider-status') {
      const title = 'Capital-AI | Data Provider Status Dashboard & Health Monitor';
      const description =
        'Echtzeit-Überwachung aller autorisierten Data-Provider: Latenz, Jitter, Circuit-Breaker, AP-006 Budget (<40€) und Zod-Vertrags-Audits.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/provider-status',
      });
      trackPageView('/provider-status', title);
    } else if (currentRoute === '/datenprovider-lizenzen') {
      const title = 'Capital-AI | Datenprovider-Lizenzen & Wissenschaftliche Nutzungsbedingungen';
      const description =
        'Offizieller Rechts- und Forschungsnachweis für BaFin, Universitäten und Partner: Wissenschaftliche Lizenzen von Kraken, Binance, Twelve Data und Polygon.io / Massive.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/datenprovider-lizenzen',
      });
      trackPageView('/datenprovider-lizenzen', title);
    } else if (currentRoute === '/opensource-lizenzen') {
      const title = 'Capital-AI | Open-Source-Software (OSS) Lizenzen & Compliance-Inventar';
      const description =
        'Vollständiges Open-Source-Lizenzinventar: 100% freizügige MIT-, ISC-, Apache-2.0- und BSD-Lizenzen aller Frontend- und Backend-Komponenten.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/opensource-lizenzen',
      });
      trackPageView('/opensource-lizenzen', title);
    } else if (currentRoute === '/lizenz') {
      const title = 'Capital-AI | Kommerzielle Design-, Marken- & Bild-Lizenz';
      const description =
        'Rechtssichere Urkunde über die weltweite, unbefristete Freigabe aller Designsysteme, Bilddateien und Vektor-Assets.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/lizenz',
      });
      trackPageView('/lizenz', title);
    } else {
      const title = 'Capital-AI | AI-Driven Market Intelligence';
      const description =
        'Marktdaten verstehen. Chancen besser erkennen. Capital-AI vereint Echtzeit-Marktdaten, KI-gestütztes Scoring und fundierte Analysen.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/',
      });
      trackPageView('/', title);
    }
  }, [currentRoute]);

  const navigateTo = (path: string) => {
    const targetRoute = resolveAppRoute(path);

    if (typeof window !== 'undefined' && window.location.pathname.toLowerCase() !== path.toLowerCase()) {
      window.history.pushState({}, '', path);
    }
    setCurrentRoute(targetRoute);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModuleById = (moduleId: string) => {
    if (moduleId === 'vocabulary') {
      setIsVocabularyOpen(true);
      return;
    }
    const found = CORE_MODULES.find((m) => m.id === moduleId);
    if (found) {
      setSelectedModule(found);
    }
  };

  const handleOpenSectorAnalysis = () => {
    if (currentRoute !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const el = document.getElementById('sector-analysis-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById('sector-analysis-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsAnalysisOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#02050e] text-slate-100 flex flex-col items-center justify-start relative overflow-x-hidden">
      {/* Accessibility Skip-To-Content Link for screen reader and keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-black focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-500"
      >
        Zum Hauptinhalt springen
      </a>

      {/* Background ambient gold light rays & cosmic particles (matching mockup outer environment) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Diagonal Golden Ray 1 */}
        <div
          className="absolute -top-40 -left-40 w-[650px] h-[650px] opacity-25"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245, 176, 20, 0.18) 0%, rgba(245, 176, 20, 0.04) 45%, transparent 70%)',
            transform: 'rotate(-25deg)',
          }}
        />
        {/* Diagonal Golden Ray 2 */}
        <div
          className="absolute top-1/3 -right-60 w-[750px] h-[750px] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245, 176, 20, 0.15) 0%, transparent 65%)',
            transform: 'rotate(35deg)',
          }}
        />
        {/* Bottom subtle gold glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Top Floating Control Bar for Screen Toggle on Desktop */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-xl px-4 py-3 z-30 select-none">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Capital-AI • Mobile Landing Page Preview</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode('mockup')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              viewMode === 'mockup' ? 'bg-amber-400 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone Frame</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('fullscreen')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              viewMode === 'fullscreen' ? 'bg-amber-400 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Vollbreite</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`w-full relative z-10 transition-all duration-300 outline-none ${
          currentRoute !== '/'
            ? 'max-w-5xl bg-[#02050e]'
            : viewMode === 'mockup'
            ? 'sm:my-6 sm:max-w-[412px] sm:rounded-[52px] sm:border-[8px] sm:border-[#2a2f3e] sm:ring-1 sm:ring-amber-500/20 sm:shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(245,176,20,0.15)] bg-[#02050e] overflow-hidden'
            : 'max-w-md bg-[#02050e]'
        }`}
      >
        {/* Smartphone Hardware Elements (Only visible in mockup mode on main landing page on larger screens) */}
        {currentRoute === '/' && viewMode === 'mockup' && (
          <div className="hidden sm:block">
            <StatusBar />
          </div>
        )}

        {currentRoute === '/login' ? (
          /* Dedicated Login Terminal View */
          <LoginPage
            onBackToHome={() => navigateTo('/')}
            onNavigateFaq={() => navigateTo('/faq')}
            onNavigateLegal={navigateTo}
          />
        ) : currentRoute === '/pipeline-builder' ? (
          /* Dedicated Pipeline Builder & Synthesizer View */
          <PipelineBuilder
            onBackToHome={() => navigateTo('/')}
            onNavigateLogin={() => navigateTo('/login')}
            onNavigateTokenomics={() => navigateTo('/tokenomics')}
          />
        ) : currentRoute === '/studio' || currentRoute === '/founder' ? (
          /* Dedicated Studio Hub: Pipeline Architektur, Blueprints, Builder, Advisor, Providers, Analytics & Benchmark Lab */
          <StudioPage
            initialTab={resolveStudioTab(currentPath)}
            onBackToHome={() => navigateTo('/')}
            onNavigateLogin={() => navigateTo('/login')}
            onNavigateLegal={navigateTo}
            onNavigate={navigateTo}
          />
        ) : currentRoute === '/architecture' ? (
          /* Dedicated Architecture & Market Data Pipeline View */
          <ArchitecturePage
            onBackToHome={() => navigateTo('/')}
            onNavigateLogin={() => navigateTo('/login')}
            onNavigateLegal={navigateTo}
            onNavigateTokenomics={() => navigateTo('/tokenomics')}
          />
        ) : currentRoute === '/tokenomics' ? (
          /* Dedicated Tokenomics, Staking & Deflation Concept View */
          <TokenomicsPage
            onBackToHome={() => navigateTo('/')}
            onNavigateLogin={() => navigateTo('/login')}
            onNavigateLegal={navigateTo}
          />
        ) : currentRoute === '/provider-status' ? (
          /* Dedicated Provider Status Dashboard (WP-004) */
          <ProviderStatusDashboard
            onBackToHome={() => navigateTo('/')}
            onNavigateArchitecture={() => navigateTo('/architecture')}
            onNavigateLogin={() => navigateTo('/login')}
            isStandaloneView={true}
          />
        ) : currentRoute === '/screener' || currentRoute === '/marketscreener' ? (
          /* Dedicated Market Screener Hub View mit gleicher Grafikarchitektur wie Assetklassen */
          <MarketScreenerPage
            initialTab={resolveMarketScreenerTab(currentPath)}
            onBackToHome={() => navigateTo('/')}
            onNavigateLogin={() => navigateTo('/login')}
            onNavigateTab={navigateTo}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
          />
        ) : currentRoute === '/learning' || currentRoute === '/vocabulary' ? (
          /* Dedicated Learning Portal View */
          <LearningPortalPage
            initialTab={resolveLearningTab(currentPath)}
            onBackToHome={() => navigateTo('/')}
            onNavigateLogin={() => navigateTo('/login')}
            onNavigateTab={navigateTo}
          />
        ) : currentRoute === '/control-center' ? (
          /* Dedicated Control Center & Roadmap View */
          <ControlCenterPage
            initialTab={resolveControlCenterTab(currentPath)}
            onBackToHome={() => navigateTo('/')}
            onNavigateLogin={() => navigateTo('/login')}
            onNavigateTab={navigateTo}
          />
        ) : LEGAL_ROUTES.includes(currentRoute as LegalRoute) ? (
          /* Dedicated Legal & FAQ View (/faq, /datenschutz, /agb, /impressum) */
          <LegalAndFaqPages
            route={currentRoute as LegalRoute}
            onNavigate={navigateTo}
          />
        ) : (
          /* Main Landing Page Experience */
          <>
            {/* Header */}
            <Header
              currentRoute={currentRoute}
              onOpenMarketscreener={() => setIsMarketscreenerOpen(true)}
              onOpenAnalysis={() => setIsAnalysisOpen(true)}
              onOpenSectorAnalysis={handleOpenSectorAnalysis}
              onOpenModule={handleOpenModuleById}
              onOpenVocabulary={() => setIsVocabularyOpen(true)}
              onOpenPriceAlerts={() => setIsAlertModalOpen(true)}
              onOpenMonetization={() => setIsMonetizationOpen(true)}
              onOpenWhaleRadar={() => setIsWhaleRadarOpen(true)}
              onNavigateLogin={() => navigateTo('/login')}
              onNavigate={navigateTo}
              onSelectSubclass={(subclass, category) => {
                setSelectedSubclass({ subclass, category });
              }}
              onViewAllMarkets={() => {
                setMarketCategoryFilter('ALLE');
                setIsAllMarketsOpen(true);
              }}
            />

            {/* Hero Section */}
            <Hero
              onStartAnalysis={() => setIsAnalysisOpen(true)}
              onExploreProduct={() => setIsProductTourOpen(true)}
            />

            {/* 4 Feature Key Pillars */}
            <KeyPillars />

            {/* Sector Analysis (Sector Rotation Radar & Institutional Capital Flows) - SWAPPED AS REQUESTED */}
            <SectorAnalysis
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onOpenPriceAlerts={() => setIsAlertModalOpen(true)}
              onExploreMarkets={(category) => {
                setMarketCategoryFilter(category || 'ALLE');
                setIsAllMarketsOpen(true);
              }}
            />

            {/* Market Sentiment (Fear & Greed Index & Macro Trend Radar) */}
            <MarketSentiment
              onStartAnalysis={() => setIsAnalysisOpen(true)}
              onExploreMarkets={() => {
                setMarketCategoryFilter('ALLE');
                setIsAllMarketsOpen(true);
              }}
            />

            {/* Global Markets Overview */}
            <MarketOverview
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onViewAllMarkets={() => {
                setMarketCategoryFilter('ALLE');
                setIsAllMarketsOpen(true);
              }}
            />

            {/* Core Modules ("Unsere Kernmodule") */}
            <CoreModules
              onSelectModule={(module) => {
                if (module.id === 'market-screener' || module.id === 'screener') {
                  navigateTo('/screener');
                } else if (module.id === 'learning-portal' || module.id === 'vocabulary') {
                  navigateTo('/learning');
                } else if (module.id === 'pipeline-builder') {
                  navigateTo('/pipeline-builder');
                } else {
                  setSelectedModule(module);
                }
              }}
              onViewAllModules={() => handleOpenModuleById('enterprise-scorer')}
              onNavigate={navigateTo}
            />

            {/* Footer with Slogan & Dedicated Routing Links */}
            <Footer onNavigate={navigateTo} />
          </>
        )}
      </main>

      {/* Interactive Modals */}
      <AnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => {
          setIsAnalysisOpen(false);
          // If URL had analysis query params, clean them up cleanly in the URL bar
          if (typeof window !== 'undefined' && window.location.search.includes('analysis=')) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
          }
        }}
        initialTab={analysisInitialTab}
        initialTicker={analysisInitialTicker}
        initialSectorId={analysisInitialSectorId}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />


      <ProductTourModal
        isOpen={isProductTourOpen}
        onClose={() => setIsProductTourOpen(false)}
        onStartAnalysis={() => {
          setIsProductTourOpen(false);
          setIsAnalysisOpen(true);
        }}
      />

      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onOpenAllAlerts={() => setIsAlertModalOpen(true)}
      />

      <ModuleDetailModal
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
        onOpenAnalysis={() => {
          setSelectedModule(null);
          setIsAnalysisOpen(true);
        }}
        onOpenVocabulary={() => {
          setSelectedModule(null);
          setIsVocabularyOpen(true);
        }}
      />

      {/* Dedicated Market Vocabulary & Finanz-Glossar Module */}
      <MarketVocabularyModal
        isOpen={isVocabularyOpen}
        onClose={() => {
          setIsVocabularyOpen(false);
          if (currentRoute === '/vocabulary') {
            navigateTo('/');
          }
        }}
        onOpenAnalysis={() => {
          setIsVocabularyOpen(false);
          setIsAnalysisOpen(true);
        }}
        onSelectAssetSymbol={(symbol) => {
          const cleanSymbol = symbol.split('/')[0].toUpperCase();
          const found = MARKET_ASSETS.find(
            (a) =>
              a.symbol.toUpperCase() === symbol.toUpperCase() ||
              a.symbol.toUpperCase() === cleanSymbol ||
              a.name.toUpperCase().includes(cleanSymbol)
          );
          if (found) {
            setSelectedAsset(found);
          }
        }}
      />

      <SubclassDetailModal
        isOpen={!!selectedSubclass}
        onClose={() => setSelectedSubclass(null)}
        subclass={selectedSubclass ? selectedSubclass.subclass : null}
        category={selectedSubclass ? selectedSubclass.category : null}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
        onOpenAnalysis={() => {
          setSelectedSubclass(null);
          setIsAnalysisOpen(true);
        }}
        onExploreMarkets={(subclassId) => {
          if (selectedSubclass) {
            setMarketCategoryFilter(selectedSubclass.category);
            setMarketSubclassFilter(subclassId || selectedSubclass.subclass.id);
            setSelectedSubclass(null);
            setIsAllMarketsOpen(true);
          }
        }}
      />

      <AllMarketsModal
        isOpen={isAllMarketsOpen}
        onClose={() => {
          setIsAllMarketsOpen(false);
          setMarketSubclassFilter(undefined);
        }}
        initialCategory={marketCategoryFilter}
        initialSubclassId={marketSubclassFilter}
        onSelectAsset={(asset) => {
          setIsAllMarketsOpen(false);
          setSelectedAsset(asset);
        }}
      />

      {/* Global In-App Price Alert Toast Notification */}
      <PriceAlertToast
        onSelectAsset={(asset) => setSelectedAsset(asset)}
        onOpenSentiment={() => {
          const el = document.getElementById('market-sentiment-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Full-featured PriceAlerts Manager & Preferences Modal */}
      <PriceAlertsModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSelectAsset={(asset) => {
          setIsAlertModalOpen(false);
          setSelectedAsset(asset);
        }}
      />

      {/* Monetization & Business Model Concept Modal */}
      <MonetizationModal
        isOpen={isMonetizationOpen}
        onClose={() => {
          setIsMonetizationOpen(false);
          if (currentRoute === '/pricing') {
            navigateTo('/');
          }
        }}
        onNavigateLogin={() => {
          setIsMonetizationOpen(false);
          navigateTo('/login');
        }}
        onOpenWhaleRadar={() => {
          setIsMonetizationOpen(false);
          setIsWhaleRadarOpen(true);
        }}
        onNavigateTokenomics={() => {
          setIsMonetizationOpen(false);
          navigateTo('/tokenomics');
        }}
      />

      {/* Smart Money Flow & On-Chain Whale Radar Terminal Modal */}
      <WhaleRadarModal
        isOpen={isWhaleRadarOpen}
        onClose={() => {
          setIsWhaleRadarOpen(false);
          if (currentRoute === '/whale-radar') {
            navigateTo('/');
          }
        }}
        onSelectAsset={(sym) => {
          const found = MARKET_ASSETS.find(
            (a) => a.symbol.toUpperCase() === sym.toUpperCase()
          );
          if (found) {
            setSelectedAsset(found);
          }
        }}
      />

      {/* Unified Marketscreener & Analysis Modal */}
      <MarketscreenerModal
        isOpen={isMarketscreenerOpen}
        onClose={() => {
          setIsMarketscreenerOpen(false);
        }}
        onNavigate={navigateTo}
        onOpenAnalysis={(tab) => {
          setIsMarketscreenerOpen(false);
          if (tab) setAnalysisInitialTab(tab);
          setIsAnalysisOpen(true);
        }}
        onOpenSectorAnalysis={() => {
          setIsMarketscreenerOpen(false);
          handleOpenSectorAnalysis();
        }}
        onOpenWhaleRadar={() => {
          setIsMarketscreenerOpen(false);
          setIsWhaleRadarOpen(true);
        }}
        onOpenModule={(modId) => {
          setIsMarketscreenerOpen(false);
          handleOpenModuleById(modId);
        }}
        onViewAllMarkets={() => {
          setIsMarketscreenerOpen(false);
          setMarketCategoryFilter('ALLE');
          setIsAllMarketsOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <PriceAlertsProvider>
      <AppContent />
    </PriceAlertsProvider>
  );
}

