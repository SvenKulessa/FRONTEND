/**
 * CAPITAL AI — STUDIO HUB (/studio)
 * Central engineering and architecture hub comprising:
 * 1. Pipeline Architektur (All 16 Data Concepts with Purpose & Capital-AI Examples)
 * 2. Blueprints (The 7 Canonical Blueprints: TIER_1_4_LIVE, AUTHORITY_PLANE, etc.)
 * 3. Pipeline Builder (Modular PC-style Data Pipeline Configurator)
 * 4. AI Kauf-Berater (Intelligent Architecture & Budget Advisor)
 * 5. Data & Providers (Fleet Health, Multi-Provider Latency & Failover)
 * 6. Analytics & Scoring (Buffett Value Check, Enterprise Scoring, BaFin Audit-Trail)
 * 7. Benchmark Lab (Live Throughput, Latency Profiler, Conflation & TCO Testbench)
 */

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Cpu,
  SlidersHorizontal,
  Bot,
  Radio,
  BarChart3,
  Gauge,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Shield,
  Zap,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  FileCode,
  Download,
  Flame,
  Clock,
  Sparkles,
  RefreshCw,
  Building2,
  Sliders,
  Database,
  Coins,
  FileText,
  TrendingUp,
  PieChart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DATA_CONCEPTS, STUDIO_BLUEPRINTS, DataConcept, StudioBlueprint } from '../data/studioData';
import { PipelineBuilder } from './PipelineBuilder';
import { ProviderStatusDashboard } from './ProviderStatusDashboard';
import { AdvisorChatbot } from './AdvisorChatbot';
import { PipelineConfigState } from '../utils/pipelineToolCatalog';
import { ScoringEngineService } from '../services/scoringEngine';
import { PipelineConfiguratorService } from '../services/pipelineConfigurator';
import { SubpageSidebarNav, SubpageNavItem } from './SubpageSidebarNav';

export type StudioTabKey =
  | 'architecture'
  | 'blueprints'
  | 'builder'
  | 'advisor'
  | 'providers'
  | 'analytics'
  | 'benchmark'
  | 'console';

export interface StudioPageProps {
  onBackToHome?: () => void;
  onNavigateLogin?: () => void;
  onNavigateLegal?: (path: string) => void;
  onNavigate?: (path: string) => void;
  initialTab?: StudioTabKey;
}

export const StudioPage: React.FC<StudioPageProps> = ({
  onBackToHome,
  onNavigateLogin,
  onNavigateLegal,
  onNavigate,
  initialTab = 'architecture',
}) => {
  const [activeTab, setActiveTab] = useState<StudioTabKey>(initialTab);

  // Architecture tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedConceptId, setExpandedConceptId] = useState<number | null>(1);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Blueprints tab state
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>('TIER_1_4_LIVE');

  // Advisor config state for AI Kauf-Berater tab
  const [advisorConfig, setAdvisorConfig] = useState<PipelineConfigState>({
    analysisFocusId: 'buffett-value',
    latencyIntervalId: 'intraday-active',
    providerIds: ['binance', 'kraken', 'twelvedata'],
    cachingId: 'in-memory-fast',
    evidenceId: 'bafin-audit',
    selectedIndicators: ['rsi', 'macd'],
    selectedAssetClasses: ['crypto', 'equity'],
  });
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);

  // Benchmark Lab simulator state
  const [benchmarkTicksCount, setBenchmarkTicksCount] = useState(128450);
  const [simulatedLatency, setSimulatedLatency] = useState(28);
  const [conflationSavedPct, setConflationSavedPct] = useState(88.4);
  const [isStressTesting, setIsStressTesting] = useState(false);

  // Interactive Scoring Engine Sandbox State (Part 2)
  const [sandboxAssetClass, setSandboxAssetClass] = useState<string>('equity_us');
  const [sandboxEligibility, setSandboxEligibility] = useState<boolean>(true);
  const [sandboxConfidence, setSandboxConfidence] = useState<number>(0.88);
  const [sandboxMomentum, setSandboxMomentum] = useState<number>(68);
  const [sandboxTechnical, setSandboxTechnical] = useState<number>(62);
  const [sandboxFundamental, setSandboxFundamental] = useState<number>(84);
  const [sandboxSentiment, setSandboxSentiment] = useState<number>(72);
  const [sandboxEvent, setSandboxEvent] = useState<number>(65);
  const [sandboxPositioning, setSandboxPositioning] = useState<number>(58);
  const [sandboxRiskPenalty, setSandboxRiskPenalty] = useState<number>(6);

  const sandboxCalculations = useMemo(() => {
    const weights = ScoringEngineService.getWeightProfile(sandboxAssetClass);
    const rawSum =
      weights.weightMomentum * sandboxMomentum +
      weights.weightTechnical * sandboxTechnical +
      weights.weightFundamental * sandboxFundamental +
      weights.weightSentiment * sandboxSentiment +
      weights.weightEvent * sandboxEvent +
      weights.weightPositioning * sandboxPositioning;
    const eligibilityMultiplier = sandboxEligibility ? 1.0 : 0.0;
    const finalScore = Math.max(
      0,
      Math.min(100, Math.round(eligibilityMultiplier * sandboxConfidence * rawSum - sandboxRiskPenalty))
    );
    const rank = sandboxEligibility && sandboxConfidence >= 0.5 ? 1 : null;
    return { weights, rawSum, eligibilityMultiplier, finalScore, rank };
  }, [
    sandboxAssetClass,
    sandboxEligibility,
    sandboxConfidence,
    sandboxMomentum,
    sandboxTechnical,
    sandboxFundamental,
    sandboxSentiment,
    sandboxEvent,
    sandboxPositioning,
    sandboxRiskPenalty,
  ]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Filtered concepts
  const categories = useMemo(() => {
    const set = new Set(DATA_CONCEPTS.map((c) => c.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredConcepts = useMemo(() => {
    return DATA_CONCEPTS.filter((concept) => {
      const matchesSearch =
        concept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concept.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concept.example.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concept.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || concept.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const activeBlueprint = useMemo(() => {
    return (
      STUDIO_BLUEPRINTS.find((b) => b.id === selectedBlueprintId) ||
      STUDIO_BLUEPRINTS[0]
    );
  }, [selectedBlueprintId]);

  // Run benchmark test
  const runStressTest = () => {
    setIsStressTesting(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSimulatedLatency((prev) => Math.max(14, Math.floor(prev + (Math.random() * 8 - 4))));
      setBenchmarkTicksCount((prev) => prev + 15400);
      setConflationSavedPct((prev) => Math.min(96.2, Number((prev + 0.3).toFixed(1))));
      if (step >= 8) {
        clearInterval(interval);
        setIsStressTesting(false);
      }
    }, 250);
  };

  // Studio Hub Subpage items for nach rechts aufklappbare Side-Liste
  const subpageItems: SubpageNavItem[] = [
    {
      id: 'architecture',
      label: 'Pipeline Architektur',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      badge: '16 Konzepte',
      desc: 'Vollständige Ingestion-Spezifikation',
    },
    {
      id: 'blueprints',
      label: 'Blueprints',
      icon: <FileCode className="w-4 h-4 text-cyan-400" />,
      badge: '7 Schemata',
      desc: 'TradingView, Python & Bloomberg',
    },
    {
      id: 'builder',
      label: 'Pipeline Builder',
      icon: <SlidersHorizontal className="w-4 h-4 text-emerald-400" />,
      badge: 'Modular',
      desc: '5-Ebenen Konfigurator & BoM',
    },
    {
      id: 'advisor',
      label: 'AI Kauf-Berater',
      icon: <Bot className="w-4 h-4 text-purple-400" />,
      badge: 'Advisor',
      desc: 'MaRisk- & Latenz-Optimierung',
    },
    {
      id: 'providers',
      label: 'Data & Providers',
      icon: <Radio className="w-4 h-4 text-emerald-400" />,
      badge: 'Fleet Health',
      desc: 'Tier 1 bis Tier 4 Gateway Status',
    },
    {
      id: 'analytics',
      label: 'Analytics & Scoring',
      icon: <BarChart3 className="w-4 h-4 text-amber-400" />,
      badge: '50 Faktoren',
      desc: 'Multi-Faktor & Z-Scores',
    },
    {
      id: 'benchmark',
      label: 'Benchmark Lab',
      icon: <Gauge className="w-4 h-4 text-cyan-400" />,
      badge: 'Sub-45ms',
      desc: 'Live Stress-Testing & Conflation',
    },
  ];

  return (
    <div className="w-full text-slate-100 min-h-screen py-4 sm:py-6 px-2 sm:px-6 relative">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER CONTRACT (Breadcrumb + Controls)                            */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
            <span>Capital-AI Enterprise</span>
            <span aria-hidden="true" className="text-slate-600">
              /
            </span>
            <span className="text-cyan-400 font-semibold">Studio Hub</span>
            <span aria-hidden="true" className="text-slate-600">
              /
            </span>
            <span className="text-amber-400 font-medium">
              {activeTab === 'architecture' && 'Pipeline Architektur'}
              {activeTab === 'blueprints' && 'Blueprints'}
              {activeTab === 'builder' && 'Pipeline Builder'}
              {activeTab === 'advisor' && 'AI Kauf-Berater'}
              {activeTab === 'providers' && 'Data & Providers'}
              {activeTab === 'analytics' && 'Analytics & Scoring'}
              {activeTab === 'benchmark' && 'Benchmark Lab'}
              {activeTab === 'console' && 'Configurator Console'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-cyan-400 shrink-0" />
              <span>Capital-AI Studio Hub</span>
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              STUDIO HUB v2.5
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sub-45ms Active
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-white text-xs font-bold border border-cyan-500/30 transition-colors cursor-pointer"
            >
              <span>Terminal Login</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUBPAGE SIDEBAR (NACH RECHTS AUFKLAPPBAR)                              */}
      {/* ========================================================================= */}
      <SubpageSidebarNav
        hubTitle="Studio Hub"
        items={subpageItems}
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id as StudioTabKey)}
        accentColor="cyan"
      />

      {/* ========================================================================= */}
      {/* 3. STUDIO HUB TABS (Die 7 Studio-Tabs im Überblick)                      */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090e21] border border-slate-800/90 mb-6 overflow-x-auto scrollbar-none">
        {/* TAB 1: Pipeline Architektur */}
        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-amber-400 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Pipeline Architektur</span>
        </button>

        {/* TAB 2: Blueprints */}
        <button
          type="button"
          onClick={() => setActiveTab('blueprints')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'blueprints'
              ? 'bg-cyan-500 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Blueprints</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">7</span>
        </button>

        {/* TAB 3: Pipeline Builder */}
        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'builder'
              ? 'bg-amber-400 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Pipeline Builder</span>
        </button>

        {/* TAB 4: AI Kauf-Berater */}
        <button
          type="button"
          onClick={() => setActiveTab('advisor')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'advisor'
              ? 'bg-purple-500 text-white font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Kauf-Berater</span>
        </button>

        {/* TAB 5: Data & Providers */}
        <button
          type="button"
          onClick={() => setActiveTab('providers')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'providers'
              ? 'bg-emerald-500 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Data &amp; Providers</span>
        </button>

        {/* TAB 6: Analytics & Scoring */}
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-amber-400 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics &amp; Scoring</span>
        </button>

        {/* TAB 7: Benchmark Lab */}
        <button
          type="button"
          onClick={() => setActiveTab('benchmark')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'benchmark'
              ? 'bg-cyan-500 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>Benchmark Lab</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT 1: PIPELINE ARCHITEKTUR (All 16 Data Concepts)                */}
      {/* ========================================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Header Banner for Pipeline Architecture */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0d1530] to-cyan-500/10 border border-amber-500/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>VOLLSTÄNDIGE ARCHITEKTUR-SPEZIFIKATION • 16 DATENKONZEPTE</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Pipeline Architektur &amp; Marktdaten-Konzepte
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  Über die klassischen Tiers 1 bis 4 hinausgehend: Die 16 kanonischen Datenarchitektur-Muster
                  für hochperformante, ausfallsichere und BaFin-konforme Finanzmarkt-Intelligence im Capital-AI System.
                </p>
              </div>

              {/* View Toggle & Count Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  16 / 16 Konzepte Aktiv
                </span>
                <div className="flex items-center p-1 rounded-lg bg-black/40 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-amber-400 text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Karten
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      viewMode === 'table'
                        ? 'bg-amber-400 text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tabelle
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Category Filter */}
            <div className="mt-5 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Datenkonzept, Zweck oder CAPITAL-AI Beispiel suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat === 'all' ? 'Alle Kategorien (16)' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TABLE VIEW (Exact mapping requested: Datenkonzept | Zweck | Typisches CAPITAL-AI-Beispiel) */}
          {viewMode === 'table' ? (
            <div className="rounded-xl border border-slate-800 bg-[#090e21] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-mono uppercase text-slate-400">
                      <th className="py-3.5 px-4 w-12 text-center">#</th>
                      <th className="py-3.5 px-4 min-w-[200px]">Datenkonzept</th>
                      <th className="py-3.5 px-4 min-w-[260px]">Zweck</th>
                      <th className="py-3.5 px-4 min-w-[300px]">Typisches CAPITAL-AI-Beispiel</th>
                      <th className="py-3.5 px-4 min-w-[120px]">Latenz</th>
                      <th className="py-3.5 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {filteredConcepts.map((item) => (
                      <React.Fragment key={item.id}>
                        <tr
                          onClick={() =>
                            setExpandedConceptId(
                              expandedConceptId === item.id ? null : item.id
                            )
                          }
                          className={`hover:bg-white/5 transition-colors cursor-pointer ${
                            expandedConceptId === item.id ? 'bg-amber-400/5' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-bold">
                            {item.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{item.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                {item.category}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-medium">
                            {item.purpose}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-amber-300 font-semibold">
                            {item.example}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-emerald-400">
                            {item.latencyTarget}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-cyan-400 hover:text-cyan-300 font-mono text-xs inline-flex items-center gap-1">
                              {expandedConceptId === item.id ? 'Schließen' : 'Öffnen'}
                              <ChevronRight
                                className={`w-3.5 h-3.5 transition-transform ${
                                  expandedConceptId === item.id ? 'rotate-90' : ''
                                }`}
                              />
                            </span>
                          </td>
                        </tr>

                        {/* Expanded details row */}
                        {expandedConceptId === item.id && (
                          <tr className="bg-[#0c122a] border-b border-amber-500/20">
                            <td colSpan={6} className="p-5">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    Technische Erläuterung &amp; Funktionsweise
                                  </h4>
                                  <p className="text-xs text-slate-200 leading-relaxed">
                                    {item.details}
                                  </p>
                                </div>

                                {/* Flow & Compliance Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                                    <div className="text-[11px] font-mono text-slate-400 mb-1">
                                      BaFin / Compliance
                                    </div>
                                    <div className="text-xs text-emerald-300 font-medium">
                                      {item.bafinCompliance}
                                    </div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                                    <div className="text-[11px] font-mono text-slate-400 mb-1">
                                      Kosten- &amp; Bandbreiteneffekt
                                    </div>
                                    <div className="text-xs text-cyan-300 font-medium">
                                      {item.costImpact}
                                    </div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                                    <div className="text-[11px] font-mono text-slate-400 mb-1">
                                      Latenz-SLA
                                    </div>
                                    <div className="text-xs text-amber-300 font-mono font-bold">
                                      {item.latencyTarget}
                                    </div>
                                  </div>
                                </div>

                                {/* Code Contract Preview */}
                                <div>
                                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                                    <span>Code Contract (AP-001 Spezifikation)</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(item.contractCodeSnippet, `tbl-${item.id}`);
                                      }}
                                      className="text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer"
                                    >
                                      {copiedSnippet === `tbl-${item.id}` ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                          <span className="text-emerald-400">Kopiert!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span>Snippet kopieren</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="p-3 rounded-lg bg-black/70 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                                    {item.contractCodeSnippet}
                                  </pre>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* CARDS VIEW (Interactive 16 Concept Cards) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredConcepts.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl border transition-all ${
                    expandedConceptId === item.id
                      ? 'bg-gradient-to-b from-[#0f1738] to-[#090e21] border-amber-400/50 shadow-lg shadow-amber-500/5'
                      : 'bg-[#090e21] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {item.id}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{item.name}</h3>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {item.latencyTarget}
                    </span>
                  </div>

                  {/* Zweck */}
                  <div className="mb-2">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Zweck:</div>
                    <div className="text-xs text-slate-200 font-medium">{item.purpose}</div>
                  </div>

                  {/* Typisches CAPITAL-AI-Beispiel */}
                  <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800/80 mb-3">
                    <div className="text-[10px] font-mono uppercase text-amber-400/90 mb-0.5">
                      Typisches CAPITAL-AI-Beispiel:
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-300 break-words">
                      {item.example}
                    </div>
                  </div>

                  {/* Visual Flow Indicator */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px] font-mono text-slate-400">
                    {item.visualFlow.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          {step}
                        </span>
                        {idx < item.visualFlow.length - 1 && (
                          <span className="text-cyan-400">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Details Toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedConceptId(expandedConceptId === item.id ? null : item.id)
                    }
                    className="w-full flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span>
                      {expandedConceptId === item.id ? 'Technische Details verbergen' : 'Architektur-Details & Code'}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        expandedConceptId === item.id ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Expandable Body */}
                  {expandedConceptId === item.id && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                      <p className="text-xs text-slate-300 leading-relaxed">{item.details}</p>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-[11px] space-y-1">
                        <div>
                          <strong className="text-slate-400">BaFin Compliance: </strong>
                          <span className="text-emerald-300">{item.bafinCompliance}</span>
                        </div>
                        <div>
                          <strong className="text-slate-400">Budget-Wirkung: </strong>
                          <span className="text-cyan-300">{item.costImpact}</span>
                        </div>
                      </div>

                      {/* Code Snippet */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span>Schnittstellen-Vertrag</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.contractCodeSnippet, `card-${item.id}`)}
                            className="text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            {copiedSnippet === `card-${item.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Kopieren</span>
                          </button>
                        </div>
                        <pre className="p-2.5 rounded-lg bg-black/80 border border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                          {item.contractCodeSnippet}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 2: BLUEPRINTS (The 7 Canonical Blueprints)                    */}
      {/* ========================================================================= */}
      {activeTab === 'blueprints' && (
        <div className="space-y-6">
          {/* Header Banner for Blueprints */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-[#0d1530] to-purple-500/10 border border-cyan-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>7 KANONISCHE PRODUKTIONS-BLUEPRINTS</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Capital-AI Blueprints
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Schlüsselfertige Architektur-Blaupausen für Tier 1-4 Streaming, Authority Consensus,
                  hybride Speicher, Multimodal-KI und Screener-Verträge nach AP-001/AP-006.
                </p>
              </div>

              {/* Quick Summary Pill */}
              <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/30 text-xs font-mono text-right shrink-0">
                <div className="text-cyan-400 font-bold">Low-Budget Garantierte TCO</div>
                <div className="text-slate-300">Alle Blueprints &lt; 35,00 € / Monat</div>
              </div>
            </div>
          </div>

          {/* Blueprint Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            {STUDIO_BLUEPRINTS.map((bp) => (
              <button
                key={bp.id}
                type="button"
                onClick={() => setSelectedBlueprintId(bp.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedBlueprintId === bp.id
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 scale-[1.02]'
                    : 'bg-[#090e21] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono text-cyan-400 mb-1">{bp.badge}</div>
                <div className="text-xs font-bold truncate text-white">{bp.id}</div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{bp.targetLatency}</div>
              </button>
            ))}
          </div>

          {/* Detailed Selected Blueprint Card */}
          <div className="p-6 rounded-2xl bg-[#090e21] border border-cyan-500/40 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {activeBlueprint.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{activeBlueprint.category}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{activeBlueprint.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{activeBlueprint.description}</p>
              </div>

              {/* Metrics Pill Grid */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 text-center min-w-[90px]">
                  <div className="text-[10px] font-mono text-slate-400">Latenz</div>
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {activeBlueprint.targetLatency}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 text-center min-w-[90px]">
                  <div className="text-[10px] font-mono text-slate-400">SLA Uptime</div>
                  <div className="text-xs font-mono font-bold text-cyan-400">{activeBlueprint.sla}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 text-center min-w-[110px]">
                  <div className="text-[10px] font-mono text-slate-400">Monatlich</div>
                  <div className="text-xs font-mono font-bold text-amber-400">
                    {activeBlueprint.monthlyCostEur.toFixed(2)} €
                  </div>
                </div>
              </div>
            </div>

            {/* Topology Nodes */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Topologie-Knoten der Blueprint-Architektur</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {activeBlueprint.topologyNodes.map((node, i) => (
                  <div
                    key={node.id}
                    className="p-4 rounded-xl bg-black/40 border border-slate-800 relative group hover:border-cyan-400/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{node.tier}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                        {node.type}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">{node.name}</div>
                    {i < activeBlueprint.topologyNodes.length - 1 && (
                      <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-cyan-400">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Concepts Used & Primary Use Case */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 mb-1">Primärer Use-Case</div>
                <div className="text-xs font-semibold text-white">{activeBlueprint.primaryUseCase}</div>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">{activeBlueprint.costNote}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 mb-2">
                  Integrierte Datenkonzepte
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeBlueprint.dataConceptsUsed.map((conceptName) => (
                    <span
                      key={conceptName}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/20"
                    >
                      {conceptName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Produktionsfertiges Code-Snippet ({activeBlueprint.id})</span>
                <button
                  type="button"
                  onClick={() => handleCopy(activeBlueprint.codeSnippet, activeBlueprint.id)}
                  className="text-cyan-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSnippet === activeBlueprint.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Code kopiert!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Blueprint kopieren</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/80 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                {activeBlueprint.codeSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 3: PIPELINE BUILDER                                           */}
      {/* ========================================================================= */}
      {activeTab === 'builder' && (
        <div>
          <PipelineBuilder
            onBackToHome={onBackToHome}
            onNavigateLogin={onNavigateLogin}
            onNavigateFounder={() => setActiveTab('architecture')}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 4: AI KAUF-BERATER (Intelligent Pipeline & Budget Advisor)     */}
      {/* ========================================================================= */}
      {activeTab === 'advisor' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/15 via-[#0d1530] to-cyan-500/15 border border-purple-500/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
                  <Bot className="w-4 h-4" />
                  <span>KI-GESTÜTZTE ARCHITEKTUR- &amp; KOSTEN-BERATUNG</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  AI Kauf-Berater für Datenpipelines
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Lassen Sie sich von unserem interaktiven KI-Berater das optimale Setup für Ihren
                  Screener, Trading-Bot oder Ihre institutionelle Daten-Pipeline zusammenstellen.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAdvisorModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-500 text-black font-extrabold text-xs shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Interaktiven Chat öffnen</span>
              </button>
            </div>
          </div>

          {/* Quick Presets / Prompt Starters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => {
                setAdvisorConfig((prev) => ({
                  ...prev,
                  analysisFocusId: 'buffett-value',
                  latencyIntervalId: 'daily-swing',
                  providerIds: ['sec-edgar', 'financialmodelingprep'],
                }));
                setIsAdvisorModalOpen(true);
              }}
              className="p-5 rounded-xl bg-[#090e21] border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Coins className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Buffett Value Check Setup
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Fokus auf fundamentale Bilanzen, 10-Jahres ROE &amp; Moat-Ratings. Spart 92% API-Quota.
              </p>
              <div className="mt-3 text-xs font-mono text-amber-400 flex items-center gap-1">
                <span>Setup konfigurieren</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => {
                setAdvisorConfig((prev) => ({
                  ...prev,
                  analysisFocusId: 'scalper-orderflow',
                  latencyIntervalId: 'ultra-hft',
                  providerIds: ['binance', 'kraken', 'coinbase'],
                }));
                setIsAdvisorModalOpen(true);
              }}
              className="p-5 rounded-xl bg-[#090e21] border border-slate-800 hover:border-cyan-400/50 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Sub-20ms High-Frequency Setup
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Redundante WebSocket-Feeds mit Fastest-Arrival-Wins und In-Memory Redis Ring Buffer.
              </p>
              <div className="mt-3 text-xs font-mono text-cyan-400 flex items-center gap-1">
                <span>Setup konfigurieren</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => {
                setAdvisorConfig((prev) => ({
                  ...prev,
                  analysisFocusId: 'bafin-marisk',
                  latencyIntervalId: 'intraday-active',
                  evidenceId: 'bafin-audit',
                }));
                setIsAdvisorModalOpen(true);
              }}
              className="p-5 rounded-xl bg-[#090e21] border border-slate-800 hover:border-purple-400/50 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                BaFin MaRisk &amp; MiCA Audit Setup
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                3-Provider Konsensprüfung mit kryptographischem SHA-256 Audit-Trail für jeden generierten Score.
              </p>
              <div className="mt-3 text-xs font-mono text-purple-400 flex items-center gap-1">
                <span>Setup konfigurieren</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Interactive Chatbot Modal */}
          {isAdvisorModalOpen && (
            <AdvisorChatbot
              isOpen={isAdvisorModalOpen}
              onClose={() => setIsAdvisorModalOpen(false)}
              currentConfig={advisorConfig}
              onApplyConfig={(newConfig) => {
                setAdvisorConfig(newConfig);
                setActiveTab('builder');
              }}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 5: DATA & PROVIDERS (Embedded ProviderStatusDashboard)        */}
      {/* ========================================================================= */}
      {activeTab === 'providers' && (
        <div>
          <ProviderStatusDashboard
            onBackToHome={onBackToHome}
            onNavigateLogin={onNavigateLogin}
            onNavigateArchitecture={() => setActiveTab('architecture')}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 6: ANALYTICS & SCORING (Math, Evidence & Audit Engine)        */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0d1530] to-emerald-500/10 border border-amber-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>SCORING MATHEMATIK &amp; EVIDENCE ENGINE</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Analytics &amp; Scoring Architektur
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Mathematische Modelle hinter dem Buffett Value Check, dem Enterprise Multi-Faktor Scorer
                  und der kryptographischen BaFin Evidence Engine nach AP-002.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-xs font-mono text-right shrink-0">
                <div className="text-amber-400 font-bold">100% Zod Type-Safe</div>
                <div className="text-slate-300">Deterministic Scoring Pipeline</div>
              </div>
            </div>
          </div>

          {/* Three Scoring Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Buffett Value Check</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                  Value Score 0-100
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Berechnet den fundamentalen Burggraben (Economic Moat) anhand von 4 quantitativen Säulen:
              </p>
              <ul className="text-xs space-y-1.5 text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-mono">1.</span>
                  <span>10-Jahres ROE &gt; 15% (Eigenkapitalrendite)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-mono">2.</span>
                  <span>Debt/Equity &lt; 0.8 (Geringe Verschuldung)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-mono">3.</span>
                  <span>Free Cash Flow Wachstum &gt; 8% p.a.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-mono">4.</span>
                  <span>Sicherheitsmarge (Margin of Safety) &gt; 25%</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Enterprise Multi-Faktor</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  Quant Score
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kombiniert fundamentale Stärke mit marktnahen Momentum- und Liquiditätsdaten:
              </p>
              <ul className="text-xs space-y-1.5 text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">1.</span>
                  <span>Piotroski F-Score (1 bis 9 Punkte Bilanzqualität)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">2.</span>
                  <span>Orderbook Liquiditätswand &amp; Spread-Stabilität</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">3.</span>
                  <span>Whale-Akkumulation auf On-Chain / Exchange-Ebene</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">4.</span>
                  <span>Gemini NLP News-Sentiment Divergenz</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Evidence &amp; BaFin Audit</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  AP-002 Compliant
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Jeder vergebene Score wird untrennbar mit den zu Grunde liegenden Daten verknüpft:
              </p>
              <ul className="text-xs space-y-1.5 text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono">1.</span>
                  <span>SHA-256 Fingerprint über alle Eingangsdaten</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono">2.</span>
                  <span>Bitemporaler Zeitstempel (Valid vs. Transaction)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono">3.</span>
                  <span>Revisionssicheres Append-Only Event-Log</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono">4.</span>
                  <span>100% Reproduzierbarkeit im Replay-Modus</span>
                </li>
              </ul>
            </div>
          </div>

          {/* INTERACTIVE SCORING ENGINE SANDBOX (PART 2 CANONICAL FORMULA) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0c1433] to-[#090e21] border border-amber-500/40 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>DETERMINISTISCHE FORMEL-SIMULATION • CANONICAL FINAL SCORE MODEL</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Live Scoring-Engine &amp; Eligibility-Gate Simulator
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Testen Sie in Echtzeit, wie Hard-Gates, Konfidenz-Multiplikatoren und dynamische Asset-Klassen-Gewichte den finalen Score bestimmen.
                </p>
              </div>

              {/* Live Formula Badge */}
              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="text-cyan-400 font-bold">finalRank</span> = eligibilityMultiplier × confidence × (∑ wᵢ·sᵢ) - riskPenalty
              </div>
            </div>

            {/* Asset Class Switcher & Hard Gate Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Asset-Klasse (Gewichts-Profil)
                </label>
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-slate-800">
                  {[
                    { id: 'equity_us', label: 'Aktien US' },
                    { id: 'crypto', label: 'Krypto' },
                    { id: 'forex', label: 'Forex/Rohst.' },
                  ].map((ac) => (
                    <button
                      key={ac.id}
                      type="button"
                      onClick={() => setSandboxAssetClass(ac.id)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        sandboxAssetClass === ac.id
                          ? 'bg-amber-400 text-black shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {ac.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Eligibility Hard-Gate Status
                </label>
                <button
                  type="button"
                  onClick={() => setSandboxEligibility((prev) => !prev)}
                  className={`w-full py-2 px-3 rounded-xl border font-mono text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    sandboxEligibility
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <span>{sandboxEligibility ? '✓ Gate Bestanden (Multi = 1.0)' : '🚫 Veto Aktiv (Multi = 0.0)'}</span>
                  <span className="text-[10px] uppercase font-bold underline">Umschalten</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Daten-Konfidenz ({Math.round(sandboxConfidence * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.30"
                  max="1.0"
                  step="0.05"
                  value={sandboxConfidence}
                  onChange={(e) => setSandboxConfidence(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Sliders for 6 Sub-Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Momentum</span>
                  <span className="text-amber-300 font-bold">{sandboxMomentum}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxMomentum}
                  onChange={(e) => setSandboxMomentum(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[9px] font-mono text-slate-500 mt-1">
                  Gewicht: {(sandboxCalculations.weights.weightMomentum * 100).toFixed(0)}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Technik</span>
                  <span className="text-cyan-300 font-bold">{sandboxTechnical}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxTechnical}
                  onChange={(e) => setSandboxTechnical(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[9px] font-mono text-slate-500 mt-1">
                  Gewicht: {(sandboxCalculations.weights.weightTechnical * 100).toFixed(0)}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Fundamental</span>
                  <span className="text-emerald-300 font-bold">{sandboxFundamental}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxFundamental}
                  onChange={(e) => setSandboxFundamental(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="text-[9px] font-mono text-slate-500 mt-1">
                  Gewicht: {(sandboxCalculations.weights.weightFundamental * 100).toFixed(0)}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Sentiment</span>
                  <span className="text-purple-300 font-bold">{sandboxSentiment}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxSentiment}
                  onChange={(e) => setSandboxSentiment(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <div className="text-[9px] font-mono text-slate-500 mt-1">
                  Gewicht: {(sandboxCalculations.weights.weightSentiment * 100).toFixed(0)}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Event/Makro</span>
                  <span className="text-amber-300 font-bold">{sandboxEvent}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxEvent}
                  onChange={(e) => setSandboxEvent(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[9px] font-mono text-slate-500 mt-1">
                  Gewicht: {(sandboxCalculations.weights.weightEvent * 100).toFixed(0)}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Positioning</span>
                  <span className="text-cyan-300 font-bold">{sandboxPositioning}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxPositioning}
                  onChange={(e) => setSandboxPositioning(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[9px] font-mono text-slate-500 mt-1">
                  Gewicht: {(sandboxCalculations.weights.weightPositioning * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Calculated Result Panel */}
            <div className="p-5 rounded-xl bg-black/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center p-3 rounded-xl bg-[#0d1633] border border-amber-500/40 min-w-[100px]">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Final Score</div>
                  <div className="text-3xl font-extrabold font-mono text-amber-400">
                    {sandboxCalculations.finalScore}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      Rang-Status: {sandboxCalculations.rank !== null ? `#${sandboxCalculations.rank} (Aktiv Gerankt)` : '🚫 Geblockt (Ineligible)'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ 11/11 Plausibilitätsregeln OK
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    SHA-256 Audit: <span className="text-cyan-300">EVD-SIM-9B4F81A2C304</span> • Model: <span className="text-slate-200">v3.2.0</span>
                  </div>
                </div>
              </div>

              {/* Risk Penalty Control */}
              <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-slate-800">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400">Risiko-Abzug (Penalty)</div>
                  <div className="text-xs font-mono font-bold text-rose-400">-{sandboxRiskPenalty} Pkt.</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={sandboxRiskPenalty}
                  onChange={(e) => setSandboxRiskPenalty(parseInt(e.target.value, 10))}
                  className="w-24 accent-rose-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 7: BENCHMARK LAB (Live Performance & Budget Verification)     */}
      {/* ========================================================================= */}
      {activeTab === 'benchmark' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-[#0d1530] to-amber-500/10 border border-cyan-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <Gauge className="w-4 h-4" />
                  <span>LIVE BENCHMARK &amp; STRESS-TEST LAB</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Benchmark Lab &amp; Performance-Audits
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Echtzeit-Messung von Throughput, Latenz-Jitter, Conflation-Ersparnis und
                  automatische Validierung der Low-Budget Garantie (&lt; 35,00 € / Monat).
                </p>
              </div>

              <button
                type="button"
                onClick={runStressTest}
                disabled={isStressTesting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isStressTesting ? 'animate-spin' : ''}`} />
                <span>{isStressTesting ? 'Stresstest läuft...' : 'Stresstest starten'}</span>
              </button>
            </div>
          </div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                E2E Pipeline-Latenz
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">
                {simulatedLatency} ms
              </div>
              <div className="text-[11px] text-slate-400 mt-1">SLA Ziel: &lt; 45 ms</div>
            </div>

            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                Throughput (Ticks / Sec)
              </div>
              <div className="text-2xl font-extrabold font-mono text-cyan-400">
                {benchmarkTicksCount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Zero dropped frames</div>
            </div>

            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                Bandbreiten-Kompression
              </div>
              <div className="text-2xl font-extrabold font-mono text-amber-400">
                {conflationSavedPct}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">T2 Conflation Filter</div>
            </div>

            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                Monatliche TCO
              </div>
              <div className="text-2xl font-extrabold font-mono text-white">
                24,50 €
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">Budget-konform (&lt;35€)</div>
            </div>
          </div>

          {/* Architecture Verification Details */}
          <div className="p-6 rounded-2xl bg-[#090e21] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verifizierte Low-Budget Produktions-Architektur (AP-006)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Durch die strikte Nutzung von freien Public WebSockets (Binance, Kraken), minimalem In-Memory
              Caching mit Redis (256MB genügen für 3.600 Ticks) und clientseitiger Conflation bleibt das gesamte
              System selbst bei 10.000 parallelen Nutzern unter 35,00 € monatlichen Infrastrukturkosten.
            </p>
          </div>

          {/* 8 PIPELINE STAGES & SHADOW MODE COMPARATOR (PART 2) */}
          <div className="p-6 rounded-2xl bg-[#090e21] border border-cyan-500/40 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>PIPELINE ORCHESTRIERUNG • 8 DISKRETE STAGES</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  8-Stufige Ausführungs-Pipeline &amp; Shadow-Mode Inspector
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Vollständige Überwachung aller Stufen von der Rohdaten-Erfassung bis zur kryptographischen Evidence-Stempelung.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Active: v2.5.0
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  Shadow Canary: v2.6.0 (10% Sample)
                </span>
              </div>
            </div>

            {/* 8 Stages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { step: '01', name: 'Ingestion & Raw Capture', tech: 'Binance/Kraken WSS', timeout: '1500ms', status: 'Optimal' },
                { step: '02', name: 'Normalization & Identity', tech: 'ISIN / FIGI Mapping', timeout: '800ms', status: 'Optimal' },
                { step: '03', name: 'Validation & Outlier Check', tech: '11 Plausibilitätsregeln', timeout: '1000ms', status: 'Enforced' },
                { step: '04', name: 'Feature Engineering', tech: '7 Feature-Familien', timeout: '2500ms', status: 'Active' },
                { step: '05', name: 'Scoring & Hard Gates', tech: '50 Canonical Components', timeout: '1800ms', status: 'Deterministic' },
                { step: '06', name: 'Cross-Sectional Ranking', tech: 'Peer & Sector Diffusion', timeout: '1200ms', status: 'Active' },
                { step: '07', name: 'SHA-256 Evidence Stamping', tech: 'BaFin MaRisk Audit', timeout: '800ms', status: 'WORM Compliant' },
                { step: '08', name: 'Delivery & Alert Dispatch', tech: 'React UI & Telegram Webhooks', timeout: '600ms', status: 'Sub-45ms' },
              ].map((st) => (
                <div key={st.step} className="p-3.5 rounded-xl bg-black/40 border border-slate-800 hover:border-cyan-400/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">STAGE {st.step}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {st.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mb-0.5">{st.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{st.tech}</div>
                  <div className="text-[9px] text-slate-500 font-mono mt-2">Timeout: {st.timeout}</div>
                </div>
              ))}
            </div>

            {/* Shadow vs Active Benchmark Comparison */}
            <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Shadow Canary vs. Active Production Vergleich</span>
                <span className="text-[10px] font-mono text-cyan-400">Zero-Risk Regression Verification</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80">
                  <div className="text-[10px] font-mono text-slate-400 mb-1">Durchschnittliche E2E Latenz</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-bold text-emerald-400">28 ms (Prod)</span>
                    <span className="text-[10px] text-slate-400 font-mono">vs.</span>
                    <span className="font-mono font-bold text-purple-300">24 ms (Shadow)</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">14% Latenzverbesserung</div>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80">
                  <div className="text-[10px] font-mono text-slate-400 mb-1">Score-Divergenz Delta</div>
                  <div className="font-mono font-bold text-white">&lt; 0.4% Abweichung</div>
                  <div className="text-[10px] text-slate-400 mt-1">Deterministischer Gleichlauf</div>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80">
                  <div className="text-[10px] font-mono text-slate-400 mb-1">Provenance Kennzeichnung</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">LIVE</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">DELAYED</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">DEMO</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Vollständige Transparenz</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: PIPELINE CONFIGURATOR CONSOLE (MOVED TO CONTROL CENTER)       */}
      {/* ========================================================================= */}
      {activeTab === 'console' && (
        <div className="p-8 sm:p-12 rounded-2xl bg-[#090e21] border border-rose-500/40 text-center max-w-2xl mx-auto space-y-4 my-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            <Sliders className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Configurator Console verschoben</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Die Configurator Console wurde wie gewünscht zentral in das <strong>Control Center</strong> verlegt,
            damit alle administrativen Kontrollen für Geschäftsführer, Founder und Audit-Teams an einem zentralen Ort gebündelt sind.
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/control-center?tab=console') : (window.location.href = '/control-center?tab=console')}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
            >
              Zum Control Center (Configurator Console) wechseln →
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium cursor-pointer"
            >
              Im Studio Hub bleiben
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
