/**
 * ============================================================================
 * CAPITAL AI — HUB SIDEBAR DRAWER (AUFKLAPPBARE SIDEBAR FÜR DIE 4 HAUPTHUBS)
 * ----------------------------------------------------------------------------
 * Wird direkt geöffnet bei Klick auf die runden, leuchtenden Action Buttons:
 * 1. Market Screener Hub (Gold #F5B014)
 * 2. Studio Hub (Cyan #06B6D4)
 * 3. Learning Portal (Gelb #F9BF21)
 * 4. Control Center (Rose #F43F5E)
 *
 * Ersetzt das alte "nach unten aufklappbare Design". Alle Seiten sind wie
 * gemapped direkt über die aufklappbare Sidebar mit Pfad-Synchronisation aufrufbar.
 * ============================================================================
 */

import React, { useEffect } from 'react';
import {
  X,
  ChevronRight,
  LineChart,
  Building2,
  BookOpen,
  ShieldCheck,
  Leaf,
  Zap,
  Layers,
  Newspaper,
  Bell,
  FileCode,
  SlidersHorizontal,
  Bot,
  Radio,
  BarChart3,
  Gauge,
  GraduationCap,
  Compass,
  Sliders,
  Activity,
  Users,
  DollarSign,
  Server,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type MainHubId = 'marketscreener' | 'studio' | 'learning' | 'control-center';

export interface HubSubpageConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  badge?: string;
  shortDesc: string;
  tags?: string[];
  path: string;
}

export interface MainHubDefinition {
  id: MainHubId;
  name: string;
  shortTitle: string;
  color: string;
  glowColor: string;
  accentBg: string;
  icon: React.ReactNode;
  badge: string;
  description: string;
  mainPath: string;
  subpages: HubSubpageConfig[];
}

export const MAIN_HUBS_CONFIG: Record<MainHubId, MainHubDefinition> = {
  marketscreener: {
    id: 'marketscreener',
    name: 'Market Screener Hub',
    shortTitle: 'Marketscreener',
    color: '#F5B014',
    glowColor: 'rgba(245, 176, 20, 0.45)',
    accentBg: 'bg-amber-500/15 border-amber-400/50 text-amber-300',
    icon: <LineChart className="w-5 h-5 text-amber-400" />,
    badge: '6 Module • Sub-45ms',
    description: 'Echtzeit Cross-Sectional Ranking, Buffett Value Investing, Enterprise Scorer und AI Newsfeed.',
    mainPath: '/marketscreener',
    subpages: [
      {
        id: 'terminal',
        name: 'Multi Asset Screener Terminal',
        icon: <LineChart className="w-4 h-4 text-amber-400" />,
        badge: 'Sub-45ms',
        shortDesc: 'Echtzeit Cross-Sectional Ranking über alle 5 Haupt-Assetklassen mit 50 Quant-Dimensionen',
        tags: ['Aktien', 'Krypto', 'Forex', 'Rohstoffe'],
        path: '/marketscreener/terminal',
      },
      {
        id: 'buffett',
        name: 'Buffett Value Check',
        icon: <Leaf className="w-4 h-4 text-emerald-400" />,
        badge: 'Moat & DCF',
        shortDesc: 'Burggraben-Kriterien, ROE > 15% & Margin of Safety nach Warren Buffett',
        tags: ['Burggraben', 'DCF', 'FCF Yield'],
        path: '/marketscreener/buffett',
      },
      {
        id: 'scorer',
        name: 'Enterprise Scorer (0-100)',
        icon: <Zap className="w-4 h-4 text-purple-400" />,
        badge: 'Multi-Faktor',
        shortDesc: 'Fundamentaldaten, Cashflows & Altman Z-Score Bewertung in einer Kennzahl',
        tags: ['Multi-Faktor', 'Z-Score', 'Piotroski'],
        path: '/marketscreener/scorer',
      },
      {
        id: 'sector',
        name: 'KI-Sektor-Rotation',
        icon: <Layers className="w-4 h-4 text-cyan-400" />,
        badge: 'Kapitalfluss',
        shortDesc: 'Sektor-Rotations-Radar & institutionelle Liquiditätsströme in Echtzeit',
        tags: ['Rotation', 'Makro', 'Kapitalfluss'],
        path: '/marketscreener/sector',
      },
      {
        id: 'newsfeed',
        name: 'AI Newsfeed',
        icon: <Newspaper className="w-4 h-4 text-[#F87171]" />,
        badge: 'NLP-Sentiment',
        shortDesc: 'NLP-Sentiment-Impact & kuratierte Marktnachrichten mit Auswirkungs-Score',
        tags: ['NLP', 'Sentiment', 'Breaking News'],
        path: '/marketscreener/newsfeed',
      },
      {
        id: 'alerts',
        name: 'PriceAlerts & Schwellenwerte',
        icon: <Bell className="w-4 h-4 text-amber-400" />,
        badge: 'Live Alarme',
        shortDesc: 'Echtzeit-Preisalarme, Ausbruchssignale & Schwellenwert-Überwachung',
        tags: ['Alarme', 'Benachrichtigungen'],
        path: '/marketscreener/alerts',
      },
    ],
  },
  studio: {
    id: 'studio',
    name: 'Studio Hub',
    shortTitle: 'Studio Hub',
    color: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    accentBg: 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300',
    icon: <Building2 className="w-5 h-5 text-cyan-400" />,
    badge: '7 Module • 40 € Cap',
    description: '5-Ebenen Ingestion-Architektur, BaFin WORM Spezifikation, Pipeline Builder & Benchmark Lab.',
    mainPath: '/studio',
    subpages: [
      {
        id: 'architecture',
        name: 'Pipeline Architektur',
        icon: <Layers className="w-4 h-4 text-amber-400" />,
        badge: '16 Konzepte',
        shortDesc: 'Vollständige 5-Ebenen Ingestion-Architektur & BaFin WORM Spezifikation',
        tags: ['Layer 1-5', 'BaFin', 'WORM'],
        path: '/studio/architecture',
      },
      {
        id: 'blueprints',
        name: 'Blueprints & Schemata',
        icon: <FileCode className="w-4 h-4 text-cyan-400" />,
        badge: '7 Schemata',
        shortDesc: 'Bereitstellbare Integrations-Vorlagen für TradingView, Python & Bloomberg',
        tags: ['TradingView', 'Python', 'Pandas'],
        path: '/studio/blueprints',
      },
      {
        id: 'builder',
        name: 'Pipeline Builder',
        icon: <SlidersHorizontal className="w-4 h-4 text-emerald-400" />,
        badge: 'Modular',
        shortDesc: 'Interaktiver Konfigurator mit strikter 40 € / Monat Budget-Garantie',
        tags: ['Bill of Materials', '40 € Cap'],
        path: '/studio/builder',
      },
      {
        id: 'advisor',
        name: 'AI Kauf-Berater',
        icon: <Bot className="w-4 h-4 text-purple-400" />,
        badge: 'Advisor',
        shortDesc: 'KI-gestützter Architekt für Latenz-, Lizenz- & MaRisk-Optimierung',
        tags: ['KI-Berater', 'Revenue Assurance'],
        path: '/studio/advisor',
      },
      {
        id: 'providers',
        name: 'Data & Providers',
        icon: <Radio className="w-4 h-4 text-emerald-400" />,
        badge: 'Fleet Health',
        shortDesc: 'Latenz- & Ausführungsstatus der autorisierten Provider-Gateways',
        tags: ['Kraken', 'Binance', '12Data'],
        path: '/studio/providers',
      },
      {
        id: 'analytics',
        name: 'Analytics & Scoring',
        icon: <BarChart3 className="w-4 h-4 text-amber-400" />,
        badge: '50 Faktoren',
        shortDesc: '50-Komponenten Multi-Faktor Engine & Z-Score Berechnung',
        tags: ['Z-Score', '50 Quants'],
        path: '/studio/analytics',
      },
      {
        id: 'benchmark',
        name: 'Benchmark Lab',
        icon: <Gauge className="w-4 h-4 text-cyan-400" />,
        badge: 'Sub-45ms',
        shortDesc: 'Live Conflation Stress-Testing & deterministisches Schatten-Benchmarking',
        tags: ['Conflation', 'Sub-45ms'],
        path: '/studio/benchmark',
      },
    ],
  },
  learning: {
    id: 'learning',
    name: 'Learning Portal',
    shortTitle: 'Learning Portal',
    color: '#F9BF21',
    glowColor: 'rgba(249, 191, 33, 0.45)',
    accentBg: 'bg-amber-400/15 border-amber-400/50 text-amber-300',
    icon: <BookOpen className="w-5 h-5 text-[#F9BF21]" />,
    badge: '3 Bereiche • 480+ Termini',
    description: 'Umfassendes Finanz- & Krypto-Lexikon, praxiserprobte Faustformeln, Guides und Skill-Check.',
    mainPath: '/learning',
    subpages: [
      {
        id: 'glossar',
        name: 'Market Vocabulary & Glossar',
        icon: <BookOpen className="w-4 h-4 text-amber-400" />,
        badge: '480+ Begriffe',
        shortDesc: 'Umfassendes Finanz- und Krypto-Lexikon mit praxiserprobten Faustformeln',
        tags: ['Lexikon', 'Faustformeln', 'Formeln'],
        path: '/learning/glossar',
      },
      {
        id: 'guides',
        name: 'Cheat-Sheets & Guides',
        icon: <Layers className="w-4 h-4 text-cyan-400" />,
        badge: '4 Guides',
        shortDesc: 'Spickzettel für Buffett Value Investing, BaFin WORM & Latenz-Architektur',
        tags: ['DCF', 'MaRisk', 'Cheatsheets'],
        path: '/learning/guides',
      },
      {
        id: 'quiz',
        name: 'Quant & Trader Skill-Check',
        icon: <GraduationCap className="w-4 h-4 text-purple-400" />,
        badge: 'Interaktiv',
        shortDesc: 'Interaktiver Wissenstest mit Sofort-Auswertung & Skill-Level Einstufung',
        tags: ['Skill-Test', 'Zertifikat'],
        path: '/learning/quiz',
      },
    ],
  },
  'control-center': {
    id: 'control-center',
    name: 'Control Center',
    shortTitle: 'Control Center',
    color: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    accentBg: 'bg-rose-500/15 border-rose-500/50 text-rose-300',
    icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
    badge: '6 Module • GF Konsole',
    description: 'v1.0 Go-Live Roadmap mit 11 Ownern, Executive Cockpit, Console, Team-Rollen & Cost Center.',
    mainPath: '/control-center',
    subpages: [
      {
        id: 'roadmap',
        name: 'Roadmap (v1.0 Go-Live)',
        icon: <Compass className="w-4 h-4 text-rose-400" />,
        badge: '11 Owner',
        shortDesc: 'Navigationsfreundliche Roadmap filterbar nach 11 Projektownern & 5 Phasen',
        tags: ['11 Owner', '5 Phasen', 'AP-001..011'],
        path: '/control-center/roadmap',
      },
      {
        id: 'console',
        name: 'Configurator Console',
        icon: <Sliders className="w-4 h-4 text-rose-400" />,
        badge: 'Admin & Audit',
        shortDesc: 'Shadow-Run Orchestrierung, 50-Komponenten Health & BaFin Revisionskontrolle',
        tags: ['Shadow Run', 'Audit Trail', 'Governance'],
        path: '/control-center/console',
      },
      {
        id: 'cockpit',
        name: 'Executive Cockpit',
        icon: <Activity className="w-4 h-4 text-amber-400" />,
        badge: 'GF & Founder',
        shortDesc: 'SLA-Monitoring, MaRisk Compliance-Score & Schnell-Aktionen für Geschäftsführung',
        tags: ['GF / Founder', 'MaRisk', 'KPIs'],
        path: '/control-center/cockpit',
      },
      {
        id: 'team',
        name: 'Team & Rollen',
        icon: <Users className="w-4 h-4 text-cyan-400" />,
        badge: '11 Leads',
        shortDesc: 'Verantwortlichkeits- und Berechtigungsmatrix aller 11 Projektverantwortlichen',
        tags: ['Rollenmatrix', 'Leads'],
        path: '/control-center/team',
      },
      {
        id: 'cost_center',
        name: 'Cost Center & Finanzen',
        icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
        badge: '40 € Cap',
        shortDesc: 'AP-006 Budget-Governance & monatliche Kostenkontrolle unter 40 €',
        tags: ['Finanzen', 'AP-006', 'Budget-Cap'],
        path: '/control-center/cost-center',
      },
      {
        id: 'system',
        name: 'Webanwendung & System',
        icon: <Server className="w-4 h-4 text-purple-400" />,
        badge: 'Optionen',
        shortDesc: 'Feature Flags, Auto-Healing & WORM-Archivierungsstatus für Administratoren',
        tags: ['Feature Flags', 'System-Optionen'],
        path: '/control-center/system',
      },
    ],
  },
};

interface HubSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeHubId: MainHubId;
  onSelectHub?: (hubId: MainHubId) => void;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const HubSidebarDrawer: React.FC<HubSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeHubId,
  onSelectHub,
  onNavigate,
  currentPath,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeHub = MAIN_HUBS_CONFIG[activeHubId] || MAIN_HUBS_CONFIG.marketscreener;

  const handleSubpageClick = (path: string) => {
    onClose();
    onNavigate?.(path);
  };

  const handleHubDirectClick = (path: string) => {
    onClose();
    onNavigate?.(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Slide-in Sidebar from the Right */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[460px] md:w-[490px] bg-[#060c1d] border-l border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden"
            aria-label={`${activeHub.name} Sidebar-Navigation`}
          >
            {/* 1. TOP HEADER & HUB SWITCHER */}
            <div className="p-5 border-b border-slate-800/80 bg-[#070e24]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-lg"
                    style={{
                      backgroundColor: `${activeHub.color}20`,
                      borderColor: `${activeHub.color}50`,
                      boxShadow: `0 0 16px ${activeHub.glowColor}`,
                      color: activeHub.color,
                    }}
                  >
                    {activeHub.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: activeHub.color }}
                      />
                      <span>Aufklappbare Sidebar</span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {activeHub.name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  aria-label="Sidebar schließen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 4 RUNDE ACTION BUTTONS ZUM SCHNELLEN WECHSEL DER HUBS IN DER SIDEBAR */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {(Object.keys(MAIN_HUBS_CONFIG) as MainHubId[]).map((hubId) => {
                  const hub = MAIN_HUBS_CONFIG[hubId];
                  const isSelected = hubId === activeHubId;
                  return (
                    <button
                      key={hubId}
                      type="button"
                      onClick={() => onSelectHub?.(hubId)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                          : 'bg-black/30 border-slate-800/80 hover:bg-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                      style={{
                        backgroundColor: isSelected ? `${hub.color}25` : undefined,
                        borderColor: isSelected ? `${hub.color}80` : undefined,
                        color: isSelected ? '#ffffff' : undefined,
                      }}
                      title={`${hub.name} öffnen`}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center mb-1 border"
                        style={{
                          backgroundColor: `${hub.color}20`,
                          borderColor: isSelected ? hub.color : `${hub.color}35`,
                          color: hub.color,
                          boxShadow: isSelected ? `0 0 10px ${hub.glowColor}` : undefined,
                        }}
                      >
                        {hub.icon}
                      </div>
                      <span className="text-[10px] font-bold truncate max-w-full">
                        {hub.shortTitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SUBPAGES LIST (ALLE GEMAPPETEN UNTERSEITEN DIREKT AUFRUFBAR) */}
            <div className="flex-1 p-5 overflow-y-auto space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1">
                <span>{activeHub.subpages.length} Unterseiten direkt aufrufbar:</span>
                <span
                  className="font-bold px-2 py-0.5 rounded-full border text-[10px]"
                  style={{
                    backgroundColor: `${activeHub.color}15`,
                    borderColor: `${activeHub.color}30`,
                    color: activeHub.color,
                  }}
                >
                  {activeHub.badge}
                </span>
              </div>

              {activeHub.subpages.map((subpage, idx) => {
                const isActive =
                  currentPath === subpage.path ||
                  (currentPath?.startsWith(subpage.path) && subpage.path !== '/');

                return (
                  <motion.div
                    key={subpage.id}
                    whileHover={{ x: 3 }}
                    onClick={() => handleSubpageClick(subpage.path)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
                      isActive
                        ? 'bg-slate-800/90 border-slate-600 shadow-md'
                        : 'bg-[#0b142e]/70 hover:bg-[#0f1b3e] border-slate-800/90 hover:border-slate-700'
                    }`}
                    style={{
                      borderColor: isActive ? activeHub.color : undefined,
                    }}
                  >
                    {/* Top Row: Icon + Name + Badge */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                          style={{
                            backgroundColor: `${activeHub.color}15`,
                            borderColor: `${activeHub.color}30`,
                          }}
                        >
                          {subpage.icon}
                        </div>
                        <span className="text-xs sm:text-[13px] font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {subpage.name}
                        </span>
                      </div>

                      {subpage.badge && (
                        <span
                          className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 border"
                          style={{
                            backgroundColor: `${activeHub.color}15`,
                            borderColor: `${activeHub.color}30`,
                            color: activeHub.color,
                          }}
                        >
                          {subpage.badge}
                        </span>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 pl-9">
                      {subpage.shortDesc}
                    </p>

                    {/* Tags & Path Footer */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 pl-9">
                      <div className="flex items-center gap-1 flex-wrap">
                        {subpage.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 border border-white/5 text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-amber-400 flex items-center gap-1 shrink-0 ml-2">
                        <span>{subpage.path}</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* 3. FOOTER: DIREKTER LINK ZUM HAUPT-HUB */}
            <div className="p-4 border-t border-slate-800/80 bg-[#070d22] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleHubDirectClick(activeHub.mainPath)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold text-black transition-all shadow-md cursor-pointer group"
                style={{
                  backgroundColor: activeHub.color,
                  borderColor: activeHub.color,
                  boxShadow: `0 0 16px ${activeHub.glowColor}`,
                }}
              >
                <span>Gesamten {activeHub.shortTitle} aufrufen</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
