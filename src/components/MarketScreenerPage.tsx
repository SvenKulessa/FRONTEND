/**
 * ============================================================================
 * CAPITAL AI — MARKET SCREENER HUB (VOLLSTÄNDIGER DEDIZIERTER HUB)
 * ----------------------------------------------------------------------------
 * 1. GRAFIKARCHITEKTUR WIE DIE ASSETKLASSEN:
 *    - Aufklappbare Tabs (Accordion) für alle 6 Kernbereiche
 *    - Visuelle Hierarchie mit Brand-Tints, Icons, Metriken und rotierendem Chevron
 * 2. PFAD-BASIERTE NAVIGATION:
 *    - /marketscreener/terminal
 *    - /marketscreener/buffett
 *    - /marketscreener/scorer
 *    - /marketscreener/sector
 *    - /marketscreener/newsfeed
 *    - /marketscreener/alerts
 * 3. INHALTE DER 6 TABS:
 *    - Tab 1: Multi Asset Screener Terminal (ScreenerTable & Real-time Ranking)
 *    - Tab 2: Buffett Value Check (DCF, ROE > 15%, Moat & Margin of Safety)
 *    - Tab 3: Enterprise Scorer (0-100) (50-Dimension Multi-Faktor Analyse)
 *    - Tab 4: KI-Sektor-Rotation (Kapitalströme & Makro-Rotation)
 *    - Tab 5: AI Newsfeed & NLP Impact (NLP Sentiment & Breaking News)
 *    - Tab 6: PriceAlerts & Schwellenwerte (Alarme & Ausbruchssignale)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  Bell,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { MARKET_ASSETS } from '../data/mockData';
import { MarketAsset } from '../types';
import { EnterpriseScorerDashboard } from './EnterpriseScorerDashboard';
import { ScreenerTable } from './ScreenerTable';
import { SectorAnalysis } from './SectorAnalysis';
import { HubTabsAccordionArchitecture, HubTabItem } from './HubTabsAccordionArchitecture';
import { SubpageSidebarNav, SubpageNavItem } from './SubpageSidebarNav';
import { usePriceAlerts } from '../context/PriceAlertsContext';

export type MarketScreenerTab =
  | 'terminal'
  | 'buffett'
  | 'scorer'
  | 'sector'
  | 'newsfeed'
  | 'alerts';

interface MarketScreenerPageProps {
  initialTab?: MarketScreenerTab;
  onBackToHome: () => void;
  onNavigateLogin?: () => void;
  onNavigateTab?: (path: string) => void;
  onSelectAsset?: (asset: MarketAsset) => void;
}

export const MarketScreenerPage: React.FC<MarketScreenerPageProps> = ({
  initialTab = 'terminal',
  onBackToHome,
  onNavigateLogin,
  onNavigateTab,
  onSelectAsset,
}) => {
  const [activeTab, setActiveTab] = useState<MarketScreenerTab>(initialTab);
  const { alerts, deleteAlert } = usePriceAlerts();

  // Sync initialTab when route updates
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleSelectTab = (tabId: string, path: string) => {
    setActiveTab(tabId as MarketScreenerTab);
    if (onNavigateTab) {
      onNavigateTab(path);
    }
  };

  // Tabs Definition mit gleicher Grafikarchitektur wie Assetklassen
  const screenerTabs: HubTabItem[] = [
    {
      id: 'terminal',
      name: 'Multi Asset Screener Terminal',
      shortDesc: 'Echtzeit Cross-Sectional Ranking über alle 5 Haupt-Assetklassen mit 50 Quant-Dimensionen und Sub-45ms Latenz.',
      icon: <LineChart className="w-4 h-4 text-cyan-400" />,
      color: '#06B6D4',
      badge: 'Sub-45ms',
      tags: ['Aktien', 'Krypto', 'Forex', 'Rohstoffe', 'L1/L2 Feed'],
      path: '/marketscreener/terminal',
    },
    {
      id: 'buffett',
      name: 'Buffett Value Check',
      shortDesc: 'Burggraben-Kriterien, ROE > 15%, Owner Earnings & Margin of Safety Berechnung nach Warren Buffett.',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      color: '#10B981',
      badge: 'Moat & DCF',
      tags: ['Burggraben', 'DCF', 'FCF Yield', 'Owner Earnings'],
      path: '/marketscreener/buffett',
    },
    {
      id: 'scorer',
      name: 'Enterprise Scorer (0-100)',
      shortDesc: 'Fundamentaldaten, Cashflow-Stabilität & Altman Z-Score Bewertung in einer ganzheitlichen Kennzahl.',
      icon: <Zap className="w-4 h-4 text-purple-400" />,
      color: '#8D26FF',
      badge: 'Multi-Faktor',
      tags: ['Multi-Faktor', 'Altman Z-Score', 'Piotroski F-Score'],
      path: '/marketscreener/scorer',
    },
    {
      id: 'sector',
      name: 'KI-Sektor-Rotation',
      shortDesc: 'Sektor-Rotations-Radar & institutionelle Liquiditätsströme zur Identifikation von Trendwechseln.',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      color: '#06B6D4',
      badge: 'Kapitalfluss',
      tags: ['Rotation', 'Makro', 'Kapitalfluss', 'Risk-On/Off'],
      path: '/marketscreener/sector',
    },
    {
      id: 'newsfeed',
      name: 'AI Newsfeed & NLP Impact',
      shortDesc: 'NLP-Sentiment-Impact & kuratierte Marktnachrichten mit berechnetem Auswirkungs-Score.',
      icon: <Sparkles className="w-4 h-4 text-rose-400" />,
      color: '#F87171',
      badge: 'NLP-Sentiment',
      tags: ['NLP', 'Sentiment', 'Breaking News', 'Impact-Score'],
      path: '/marketscreener/newsfeed',
    },
    {
      id: 'alerts',
      name: 'PriceAlerts & Schwellenwerte',
      shortDesc: 'Echtzeit-Preisalarme, Ausbruchssignale & Schwellenwert-Überwachung mit WebHook-Integration.',
      icon: <Bell className="w-4 h-4 text-amber-400" />,
      color: '#F5B014',
      badge: `${alerts.length} aktiv`,
      tags: ['Alarme', 'WebHook', 'Push Notifications'],
      path: '/marketscreener/alerts',
    },
  ];

  // Subpage Items für die aufklappbare Sideliste
  const subpageItems: SubpageNavItem[] = screenerTabs.map((t) => ({
    id: t.id,
    label: t.name,
    icon: t.icon,
    badge: t.badge,
    desc: t.shortDesc,
  }));

  return (
    <div className="w-full text-slate-100 min-h-screen py-4 sm:py-6 px-2 sm:px-6 relative">
      {/* 1. TOP HEADER CONTRACT (Breadcrumb + Controls) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
            <span>Capital-AI Enterprise</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-cyan-400 font-semibold">Market Screener Hub</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-amber-300 font-medium">
              {screenerTabs.find((t) => t.id === activeTab)?.name || 'Terminal'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <LineChart className="w-6 h-6 text-cyan-400 shrink-0" />
              <span>Capital-AI Market Screener Hub</span>
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              CROSS-SECTIONAL ENGINE
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sub-45ms Latenz
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Zurück zur Übersicht</span>
            </button>
          )}

          {onNavigateLogin && (
            <button
              type="button"
              onClick={onNavigateLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Terminal Login</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SUBPAGE SIDEBAR (AUFKLAPPBAR) */}
      <SubpageSidebarNav
        hubTitle="Market Screener Hub"
        items={subpageItems}
        activeId={activeTab}
        onSelect={(id) => handleSelectTab(id, `/marketscreener/${id}`)}
        accentColor="cyan"
      />

      {/* 3. GLEICHE GRAFIKARCHITEKTUR WIE ASSETKLASSEN (AUFKLAPPBARE TABS) */}
      <HubTabsAccordionArchitecture
        hubTitle="Market Screener Hub"
        hubBadge="50 Quant-Dimensionen"
        hubColor="#06B6D4"
        tabs={screenerTabs}
        activeTabId={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* ========================================================================= */}
      {/* 4. TAB CONTENTS                                                           */}
      {/* ========================================================================= */}

      {/* TAB 1: TERMINAL & SCREENER TABLE */}
      {activeTab === 'terminal' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-black/80 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <LineChart className="w-4 h-4 text-cyan-400" />
                <span>Multi Asset Screener Terminal (Cross-Sectional Ranking)</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Echtzeit-Sortierung von {MARKET_ASSETS.length}+ Titeln über Aktien, Krypto, Forex und Rohstoffe mit quantitativer Momentum- und Qualitätsbewertung.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                Ringpuffer: 2.048 Ticks
              </span>
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                AP-006 Konform
              </span>
            </div>
          </div>

          <ScreenerTable />
        </div>
      )}

      {/* TAB 2: BUFFETT VALUE CHECK */}
      {activeTab === 'buffett' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-black/80 border border-emerald-500/30">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Warren Buffett Value &amp; Moat Check</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                BERKSHIRE REGELWERK
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Prüft Unternehmen auf nachhaltige Wettbewerbsvorteile (Economic Moat), dauerhafte Eigenkapitalrendite (ROE &gt; 15%), solide Bilanz ohne übermäßige Verschuldung und eine Sicherheitsmarge (Margin of Safety) zum Discounted-Cashflow-Wert.
            </p>
          </div>

          {/* Buffett Filter Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKET_ASSETS.filter((a) => a.mainCategory === 'AKTIEN').slice(0, 9).map((asset) => (
              <div
                key={asset.id}
                onClick={() => onSelectAsset?.(asset)}
                className="p-4 rounded-xl border border-slate-800/80 bg-[#060c1d]/90 hover:border-emerald-500/40 hover:bg-[#081329] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400">{asset.symbol}</span>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {asset.name}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                    Moat: Hoch
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/70 text-center text-[10px] font-mono">
                  <div className="p-1 rounded bg-black/30">
                    <span className="text-slate-400 block">ROE</span>
                    <span className="text-emerald-300 font-bold">18.4%</span>
                  </div>
                  <div className="p-1 rounded bg-black/30">
                    <span className="text-slate-400 block">MoS</span>
                    <span className="text-amber-300 font-bold">+24%</span>
                  </div>
                  <div className="p-1 rounded bg-black/30">
                    <span className="text-slate-400 block">Kurs</span>
                    <span className="text-white font-bold">{asset.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ENTERPRISE SCORER (0-100) */}
      {activeTab === 'scorer' && (
        <div className="space-y-6">
          <EnterpriseScorerDashboard
            onSelectAsset={(sym) => {
              const found = MARKET_ASSETS.find((m) => m.symbol === sym);
              if (found) onSelectAsset?.(found);
            }}
          />
        </div>
      )}

      {/* TAB 4: KI-SEKTOR-ROTATION */}
      {activeTab === 'sector' && (
        <div className="space-y-6">
          <SectorAnalysis
            onSelectAsset={(asset) => onSelectAsset?.(asset)}
          />
        </div>
      )}

      {/* TAB 5: AI NEWSFEED & NLP IMPACT */}
      {activeTab === 'newsfeed' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900/60 to-black/80 border border-rose-500/30 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>AI Newsfeed &amp; NLP Sentiment Impact</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Automatisierte FinBERT-Klassifizierung und Auswirkungsanalyse globaler Marktnachrichten.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
              Live NLP Stream
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'EZB belässt Leitzins stabil — Liquiditätszufluss in europäische Dividendentitel',
                source: 'Reuters Financial',
                time: 'vor 14 Min',
                impact: '+7.8 Bullish',
                color: '#10B981',
                summary: 'FinBERT erkennt hohe Wahrscheinlichkeit für Sektor-Rotation in defensive Industrie- und Bankwerte.',
                tags: ['EZB', 'Zinsen', 'DAX', 'Euro'],
              },
              {
                title: 'Bitcoin Mining Difficulty erreicht Allzeithoch bei stabilen Hashrates',
                source: 'CoinDesk Pro',
                time: 'vor 28 Min',
                impact: '+6.2 Bullish',
                color: '#F5B014',
                summary: 'On-Chain Indikatoren deuten auf anhaltende Miner-Akkumulation und reduzierten Verkaufsdruck hin.',
                tags: ['Bitcoin', 'On-Chain', 'Difficulty'],
              },
              {
                title: 'Rohöl-Lagerbestände in den USA überraschend gesunken',
                source: 'Bloomberg Energy',
                time: 'vor 45 Min',
                impact: '+4.5 Moderat',
                color: '#F5B014',
                summary: 'WTI und Brent verzeichnen kurzfristige Preissprünge; Raffinerieauslastung steigt saisonal.',
                tags: ['WTI', 'Brent', 'Energie'],
              },
              {
                title: 'Halbleiter-Nachfrage im KI-Rechenzentrumsmarkt übersteigt Angebot',
                source: 'TechMarkets Insight',
                time: 'vor 1 Std',
                impact: '+9.1 Stark Bullish',
                color: '#10B981',
                summary: 'Hohe Auftragseingänge treiben Margenaussichten bei Chiplieferanten weiter nach oben.',
                tags: ['Halbleiter', 'KI', 'NVIDIA', 'TSMC'],
              },
            ].map((news, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-800/80 bg-[#060c1d]/90 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{news.source} • {news.time}</span>
                  <span
                    className="font-bold px-1.5 py-0.5 rounded border"
                    style={{
                      color: news.color,
                      backgroundColor: `${news.color}15`,
                      borderColor: `${news.color}35`,
                    }}
                  >
                    Impact: {news.impact}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {news.title}
                </h3>
                <p className="text-xs text-slate-300">
                  {news.summary}
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  {news.tags.map((t) => (
                    <span key={t} className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PRICE ALERTS & SCHWELLENWERTE */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-black/80 border border-amber-500/30 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>PriceAlerts &amp; Schwellenwert-Überwachung</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Konfigurierte Trigger für Kursausbrüche, Z-Score Schwellen und Volatilitätsalarme.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              {alerts.length} Aktive Alarme
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 bg-black/20 text-slate-400 text-xs">
              Keine aktiven Alarme konfiguriert. Klicken Sie in der Marktübersicht auf das Glocken-Symbol eines Assets, um einen Preisalarm zu erstellen.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="p-3.5 rounded-xl border border-slate-800/90 bg-[#060c1d]/90 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{al.assetSymbol}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                        {al.direction === 'ABOVE' ? '≥ Schwelle' : '≤ Schwelle'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-amber-400 font-mono block mt-1">
                      {al.formattedTarget || `$${al.targetPrice?.toLocaleString()}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteAlert(al.id)}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer px-2 py-1 rounded bg-white/5"
                  >
                    Entfernen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
