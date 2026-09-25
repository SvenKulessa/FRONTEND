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
import { WhaleRadarSection } from './components/WhaleRadarSection';
import { WhaleRadarModal } from './components/WhaleRadarModal';
import { MonetizationModal } from './components/MonetizationModal';
import { ArchitecturePage } from './components/ArchitecturePage';

export const LEGAL_ROUTES: LegalRoute[] = ['/faq', '/datenschutz', '/agb', '/impressum'];

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
    clean === '/vocabulary' ||
    clean === '/glossar' ||
    clean === '/lexikon' ||
    clean === '/market-vocabulary' ||
    clean === '/dictionary'
  ) {
    return '/vocabulary';
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
    clean === '/architecture' ||
    clean === '/architektur' ||
    clean === '/pipeline' ||
    clean === '/system-architecture' ||
    clean === '/kursdaten' ||
    clean === '/data-feed'
  ) {
    return '/architecture';
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


  const [viewMode, setViewMode] = useState<'mockup' | 'fullscreen'>('mockup');
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
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

  // Initialize Analytics & handle popstate browser routing
  useEffect(() => {
    initGoogleAnalytics();

    const handlePopState = () => {
      const resolved = resolveAppRoute(window.location.pathname);
      setCurrentRoute(resolved);
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
    } else if (currentRoute === '/vocabulary') {
      const title = 'Capital-AI | Market Vocabulary & Finanz-Glossar';
      const description =
        'Umfassendes Finanz- & Quant-Glossar von Capital-AI: Fachbegriffe verständlich erklärt mit Berechnungsformeln und Praxisbeispielen.';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/vocabulary',
      });
      trackPageView('/vocabulary', title);
      setIsVocabularyOpen(true);
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
    } else if (currentRoute === '/architecture') {
      const title = 'Capital-AI | Kursdaten-Architektur, Provider & Low-Budget Pipeline';
      const description =
        'Technische Spezifikation der Capital-AI Marktdaten-Pipeline: Sub-45ms Latenz, Multi-Provider Failover, Zero-Trust Proxy, In-Memory Caching & Low-Budget Blueprint (<35€/Mo).';
      updatePageSEO({
        title,
        description,
        canonicalPath: '/architecture',
      });
      trackPageView('/architecture', title);
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

    if (window.location.pathname.toLowerCase() !== targetRoute) {
      window.history.pushState({}, '', targetRoute);
    }
    setCurrentRoute(targetRoute);
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
        className={`w-full relative z-10 transition-all duration-300 ${
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
        ) : currentRoute === '/architecture' ? (
          /* Dedicated Architecture & Market Data Pipeline View */
          <ArchitecturePage
            onBackToHome={() => navigateTo('/')}
            onNavigateLogin={() => navigateTo('/login')}
            onNavigateLegal={navigateTo}
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

            {/* Market Sentiment (Fear & Greed Index & Macro Trend Radar) */}
            <MarketSentiment
              onStartAnalysis={() => setIsAnalysisOpen(true)}
              onExploreMarkets={() => {
                setMarketCategoryFilter('ALLE');
                setIsAllMarketsOpen(true);
              }}
            />

            {/* Sector Analysis (Sector Rotation Radar & Institutional Capital Flows) */}
            <SectorAnalysis
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onOpenPriceAlerts={() => setIsAlertModalOpen(true)}
              onExploreMarkets={(category) => {
                setMarketCategoryFilter(category || 'ALLE');
                setIsAllMarketsOpen(true);
              }}
            />

            {/* Smart Money Flow & On-Chain Whale Radar */}
            <WhaleRadarSection
              onOpenTerminal={() => setIsWhaleRadarOpen(true)}
              onOpenTelegram={() => setIsWhaleRadarOpen(true)}
              onSelectAsset={(sym) => {
                const found = MARKET_ASSETS.find(
                  (a) => a.symbol.toUpperCase() === sym.toUpperCase()
                );
                if (found) {
                  setSelectedAsset(found);
                } else {
                  openWhaleRadar(sym);
                }
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
                if (module.id === 'vocabulary') {
                  setIsVocabularyOpen(true);
                } else {
                  setSelectedModule(module);
                }
              }}
              onViewAllModules={() => handleOpenModuleById('enterprise-scorer')}
            />

            {/* Footer with Slogan & Dedicated Routing Links */}
            <Footer onNavigate={navigateTo} />
          </>
        )}
      </main>

      {/* Interactive Modals */}
      <AnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
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

