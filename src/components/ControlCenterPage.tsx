/**
 * CAPITAL AI — CONTROL CENTER & MANAGEMENT KONSOLE
 * 
 * Zentrales Control Center für Geschäftsführer, Founder und Kernteam-Mitglieder.
 * Beinhaltet:
 * 1. Navigationsfreundliche Roadmap (Filterbar nach 11 Projektownern, 3 Status, 5 Phasen bis v1.0)
 * 2. Executive Cockpit (v1.0 Go-Live Readiness, MaRisk Governance)
 * 3. Team & Rollen (Verantwortlichkeiten der 11 Projektowner)
 * 4. Cost Center & Finanzen (AP-006 Budget-Obergrenze 40 € / Monat)
 * 5. Webanwendungs- & System-Optionen (Feature Flags, Auto-Healing)
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Compass,
  Sliders,
  Users,
  DollarSign,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  Calendar,
  Filter,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lock,
  Download,
  Share2,
  Terminal,
  Activity,
  Server,
  Zap,
  CheckCheck,
  ChevronDown,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Flame,
  Building2,
  BookOpen,
  LineChart,
  Shield,
  Radio,
  FileCode,
} from 'lucide-react';
import {
  ProjectOwner,
  WorkPackageStatus,
  ROADMAP_STAGES,
  PROJECT_OWNERS,
  WORK_PACKAGES,
  WorkPackage,
} from '../data/roadmapData';
import { SubpageSidebarNav, SubpageNavItem } from './SubpageSidebarNav';

export type ControlCenterTab = 'roadmap' | 'console' | 'cockpit' | 'team' | 'cost_center' | 'system';

interface ControlCenterPageProps {
  onBackToHome?: () => void;
  onNavigateLogin?: () => void;
  onNavigateTab?: (path: string) => void;
  initialTab?: ControlCenterTab;
}

export const ControlCenterPage: React.FC<ControlCenterPageProps> = ({
  onBackToHome,
  onNavigateLogin,
  onNavigateTab,
  initialTab = 'roadmap',
}) => {
  // Navigation Tabs inside Control Center
  const [activeTab, setActiveTab] = useState<ControlCenterTab>(initialTab);

  // Sync tab with URL search parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (
        tabParam === 'roadmap' ||
        tabParam === 'console' ||
        tabParam === 'cockpit' ||
        tabParam === 'team' ||
        tabParam === 'cost_center' ||
        tabParam === 'system'
      ) {
        setActiveTab(tabParam as ControlCenterTab);
      }
    }
  }, []);

  const subpageItems: SubpageNavItem[] = [
    {
      id: 'roadmap',
      label: 'Roadmap (v1.0 Go-Live)',
      icon: <Compass className="w-4 h-4 text-rose-400" />,
      badge: `${WORK_PACKAGES.length} APs`,
      desc: '11 Projektowner & 5 Phasen',
    },
    {
      id: 'console',
      label: 'Configurator Console',
      icon: <Sliders className="w-4 h-4 text-rose-400" />,
      badge: 'Admin',
      desc: '50-Komponenten & Shadow-Run',
    },
    {
      id: 'cockpit',
      label: 'Executive Cockpit',
      icon: <Activity className="w-4 h-4 text-amber-400" />,
      badge: 'GF & Founder',
      desc: 'SLA, Reifegrad & MaRisk',
    },
    {
      id: 'team',
      label: 'Team & Rollen (11 Owner)',
      icon: <Users className="w-4 h-4 text-cyan-400" />,
      badge: '11 Leads',
      desc: 'Verantwortungsmatrix',
    },
    {
      id: 'cost_center',
      label: 'Cost Center & Finanzen',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      badge: '40 € Cap',
      desc: 'AP-006 Budget-Governance',
    },
    {
      id: 'system',
      label: 'Webanwendung & System',
      icon: <Server className="w-4 h-4 text-purple-400" />,
      badge: 'Optionen',
      desc: 'Feature Flags & WORM',
    },
  ];

  // Roadmap Filters
  const [selectedOwner, setSelectedOwner] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roadmapViewMode, setRoadmapViewMode] = useState<'pipeline' | 'matrix' | 'table'>('pipeline');
  const [selectedPackage, setSelectedPackage] = useState<WorkPackage | null>(null);

  // User Role Switcher simulation for GF / Founder preview
  const [currentRole, setCurrentRole] = useState<'GF_FOUNDER' | 'TECH_LEAD' | 'COMPLIANCE' | 'QA'>('GF_FOUNDER');

  // Filter logic for Roadmap
  const filteredWorkPackages = useMemo(() => {
    return WORK_PACKAGES.filter((wp) => {
      // Owner filter
      if (selectedOwner !== 'ALL' && wp.owner !== selectedOwner) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && wp.status !== selectedStatus) {
        return false;
      }
      // Phase filter
      if (selectedPhase !== 'ALL' && String(wp.phase) !== selectedPhase) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesId = wp.id.toLowerCase().includes(query);
        const matchesTitle = wp.title.toLowerCase().includes(query);
        const matchesDesc = wp.description.toLowerCase().includes(query);
        const matchesOwner = wp.owner.toLowerCase().includes(query);
        const matchesLead = wp.leadName.toLowerCase().includes(query);
        const matchesBafin = wp.bafinStandard?.toLowerCase().includes(query);
        if (!matchesId && !matchesTitle && !matchesDesc && !matchesOwner && !matchesLead && !matchesBafin) {
          return false;
        }
      }
      return true;
    });
  }, [selectedOwner, selectedStatus, selectedPhase, searchQuery]);

  // Overall roadmap progress calculation
  const totalPackages = WORK_PACKAGES.length;
  const activeCount = WORK_PACKAGES.filter((p) => p.status === 'aktiv').length;
  const pendingCount = WORK_PACKAGES.filter((p) => p.status === 'pending').length;
  const planningCount = WORK_PACKAGES.filter((p) => p.status === 'planning').length;
  const avgProgress = Math.round(
    WORK_PACKAGES.reduce((acc, curr) => acc + curr.progressPercent, 0) / totalPackages
  );

  const getOwnerMeta = (owner: ProjectOwner) => {
    return (
      PROJECT_OWNERS.find((p) => p.id === owner) || {
        id: owner,
        label: owner,
        lead: 'Lead Owner',
        badgeColor: 'border-slate-700 bg-slate-800 text-slate-300',
        description: '',
      }
    );
  };

  const getStatusBadge = (status: WorkPackageStatus) => {
    switch (status) {
      case 'aktiv':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            aktiv
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-2.5 h-2.5" />
            pending
          </span>
        );
      case 'planning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Compass className="w-2.5 h-2.5" />
            planning
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: 'Kritisch' | 'Hoch' | 'Mittel') => {
    switch (priority) {
      case 'Kritisch':
        return (
          <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
            P1 Kritisch
          </span>
        );
      case 'Hoch':
        return (
          <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            P2 Hoch
          </span>
        );
      case 'Mittel':
        return (
          <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-700/50 text-slate-300 border border-slate-600/40">
            P3 Normal
          </span>
        );
    }
  };

  return (
    <div className="w-full text-slate-100 min-h-screen py-4 sm:py-6 px-2 sm:px-6 relative">
      {/* 1. TOP EXECUTIVE HEADER CONTRACT */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
            <span>Capital-AI Enterprise</span>
            <span aria-hidden="true" className="text-slate-600">
              /
            </span>
            <span className="text-rose-400 font-semibold">Control Center</span>
            <span aria-hidden="true" className="text-slate-600">
              /
            </span>
            <span className="text-amber-400 font-medium">
              {activeTab === 'roadmap' && 'Roadmap (v1.0 Go-Live)'}
              {activeTab === 'console' && 'Configurator Console & Audit'}
              {activeTab === 'cockpit' && 'Executive Cockpit (GF & Founder)'}
              {activeTab === 'team' && 'Team & Rollen (11 Projektowner)'}
              {activeTab === 'cost_center' && 'Cost Center & Finanzen (AP-006)'}
              {activeTab === 'system' && 'Webanwendung & System Governance'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-rose-400 shrink-0" />
              <span>Capital-AI Control Center</span>
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              GF &amp; FOUNDER CONSOLE
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Target: Version 1.0 Live
            </span>
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View As Role Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Rolle:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as any)}
              className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="GF_FOUNDER" className="bg-[#090e21] text-amber-300">
                Dr. Sven Kulessa (GF &amp; Founder)
              </option>
              <option value="TECH_LEAD" className="bg-[#090e21] text-cyan-300">
                Tech Lead &amp; DevOps
              </option>
              <option value="COMPLIANCE" className="bg-[#090e21] text-purple-300">
                Compliance Officer (BaFin)
              </option>
              <option value="QA" className="bg-[#090e21] text-teal-300">
                Quality Manager
              </option>
            </select>
          </div>

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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Terminal Login</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SUBPAGE SIDEBAR (NACH RECHTS AUFKLAPPBAR) */}
      <SubpageSidebarNav
        hubTitle="Control Center"
        items={subpageItems}
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id as ControlCenterTab)}
        accentColor="rose"
      />

      {/* 3. CONTROL CENTER TABS NAVIGATION */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090e21] border border-slate-800/90 mb-6 overflow-x-auto scrollbar-none">
        {/* TAB 1: ROADMAP (PRIMARY) */}
        <button
          type="button"
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'roadmap'
              ? 'bg-rose-500 text-white font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Roadmap (v1.0 Go-Live)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">
            {WORK_PACKAGES.length} APs
          </span>
        </button>

        {/* TAB 2: CONFIGURATOR CONSOLE (MOVED TO CONTROL CENTER) */}
        <button
          type="button"
          onClick={() => setActiveTab('console')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'console'
              ? 'bg-rose-500 text-white font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Configurator Console</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">Admin</span>
        </button>

        {/* TAB 2: EXECUTIVE COCKPIT */}
        <button
          type="button"
          onClick={() => setActiveTab('cockpit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'cockpit'
              ? 'bg-amber-400 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Executive Cockpit</span>
        </button>

        {/* TAB 3: TEAM & ROLLEN */}
        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'team'
              ? 'bg-cyan-500 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team &amp; Rollen (11 Owner)</span>
        </button>

        {/* TAB 4: COST CENTER & FINANZEN */}
        <button
          type="button"
          onClick={() => setActiveTab('cost_center')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'cost_center'
              ? 'bg-emerald-500 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Cost Center &amp; Finanzen</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">40 € Cap</span>
        </button>

        {/* TAB 5: SYSTEM & WEBAPPLICATION */}
        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'system'
              ? 'bg-purple-500 text-white font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Webanwendung &amp; System</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT 1: ROADMAP (THE PRIMARY V1.0 GO-LIVE ROADMAP)                 */}
      {/* ========================================================================= */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* A. ROADMAP HEADER BANNER WITH VERSION 1.0 PROGRESS */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-rose-500/15 via-[#0d1530] to-amber-500/15 border border-rose-500/40 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-1">
                  <Compass className="w-4 h-4" />
                  <span>PRODUKTIONS-FAHRPLAN BIS ZUM ÖFFENTLICHEN LIVE-GANG</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Navigationsfreundliche v1.0 Roadmap
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Steuern und überwachen Sie den Reifegrad der Capital-AI Webanwendung über alle 5 Entwicklungsphasen
                  und 11 Projektowner bis zum finalen BaFin-konformen Produktionsstart von Version 1.0.
                </p>
              </div>

              {/* Progress Box to v1.0 */}
              <div className="p-4 rounded-xl bg-black/50 border border-rose-500/30 min-w-[260px] shrink-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-mono">v1.0 Reifegrad:</span>
                  <span className="text-amber-400 font-mono font-extrabold text-base">{avgProgress} %</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${avgProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{activeCount} Aktiv</span>
                  <span>•</span>
                  <span>{pendingCount} Pending</span>
                  <span>•</span>
                  <span>{planningCount} Planning</span>
                </div>
              </div>
            </div>

            {/* Stage Progress Pills (The 5 Stages to v1.0) */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {ROADMAP_STAGES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedPhase(selectedPhase === String(st.phase) ? 'ALL' : String(st.phase))}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPhase === String(st.phase)
                      ? 'bg-rose-500/20 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'bg-[#090e21]/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-slate-400 font-bold">Phase {st.phase}</span>
                    <span
                      className={`font-bold ${
                        st.status === 'completed'
                          ? 'text-emerald-400'
                          : st.status === 'in_progress'
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {st.completionPercent}%
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">{st.shortTitle}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{st.targetRelease}</div>
                </button>
              ))}
            </div>
          </div>

          {/* B. MULTI-FILTER BAR (Owner, Status, Phase, Search, ViewMode) */}
          <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800/90 space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Arbeitspaket suchen (z.B. AP-GOV-01, MaRisk, Merkle, Whale, SEO)..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400/80"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setRoadmapViewMode('pipeline')}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    roadmapViewMode === 'pipeline'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Pipeline / Phasen-Ansicht"
                >
                  Phasen
                </button>
                <button
                  type="button"
                  onClick={() => setRoadmapViewMode('matrix')}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    roadmapViewMode === 'matrix'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Owner-Matrix Ansicht"
                >
                  Owner-Matrix
                </button>
                <button
                  type="button"
                  onClick={() => setRoadmapViewMode('table')}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    roadmapViewMode === 'table'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Kompakte Tabelle"
                >
                  Tabelle
                </button>
              </div>
            </div>

            {/* 1. FILTER: PROJEKTOWNER (The 11 Owners Requested) */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
                <span>1. Nach Projektowner filtern (11 Verantwortungsbereiche):</span>
                {selectedOwner !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setSelectedOwner('ALL')}
                    className="text-rose-400 hover:underline cursor-pointer"
                  >
                    Filter zurücksetzen
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedOwner('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedOwner === 'ALL'
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  Alle ({WORK_PACKAGES.length})
                </button>
                {PROJECT_OWNERS.map((po) => {
                  const count = WORK_PACKAGES.filter((p) => p.owner === po.id).length;
                  const isSelected = selectedOwner === po.id;
                  return (
                    <button
                      key={po.id}
                      type="button"
                      onClick={() => setSelectedOwner(isSelected ? 'ALL' : po.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                        isSelected
                          ? `${po.badgeColor} font-bold ring-2 ring-rose-400/50`
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                    >
                      {po.label}
                      <span className="ml-1 text-[10px] opacity-70 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. FILTER: STATUS & PHASE */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/80 text-xs">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[11px]">Status:</span>
                {(['ALL', 'aktiv', 'pending', 'planning'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                      selectedStatus === st
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'ALL' ? 'Alle Status' : st}
                  </button>
                ))}
              </div>

              <span className="text-slate-700">•</span>

              {/* Phase Filter */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[11px]">Phase:</span>
                {(['ALL', '1', '2', '3', '4', '5'] as const).map((ph) => (
                  <button
                    key={ph}
                    type="button"
                    onClick={() => setSelectedPhase(ph)}
                    className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                      selectedPhase === ph
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ph === 'ALL' ? 'Alle Phasen' : `Phase ${ph}`}
                  </button>
                ))}
              </div>

              <div className="ml-auto text-[11px] text-slate-400 font-mono">
                {filteredWorkPackages.length} von {WORK_PACKAGES.length} Arbeitspaketen angezeigt
              </div>
            </div>
          </div>

          {/* C. ROADMAP CARDS DISPLAY (PIPELINE / MATRIX / TABLE) */}
          {roadmapViewMode === 'pipeline' && (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((phaseNum) => {
                const stage = ROADMAP_STAGES.find((s) => s.phase === phaseNum)!;
                const packagesInPhase = filteredWorkPackages.filter((wp) => wp.phase === phaseNum);

                if (packagesInPhase.length === 0 && selectedPhase !== 'ALL') {
                  return null;
                }

                return (
                  <div key={phaseNum} className="space-y-3">
                    {/* Phase Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold text-xs flex items-center justify-center border border-rose-500/40">
                          {phaseNum}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{stage.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 font-normal">
                              ({stage.targetRelease})
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-400">{stage.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          {packagesInPhase.length} Arbeitspakete
                        </span>
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            stage.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : stage.status === 'in_progress'
                              ? 'bg-amber-400/20 text-amber-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {stage.completionPercent}% Erreicht
                        </span>
                      </div>
                    </div>

                    {/* Work Package Cards Grid */}
                    {packagesInPhase.length === 0 ? (
                      <div className="p-4 rounded-xl bg-black/20 border border-slate-800/60 text-xs text-slate-500 text-center">
                        Keine Arbeitspakete entsprechen den aktuellen Filterkriterien in dieser Phase.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {packagesInPhase.map((wp) => {
                          const ownerMeta = getOwnerMeta(wp.owner);
                          return (
                            <div
                              key={wp.id}
                              onClick={() => setSelectedPackage(wp)}
                              className="p-4 rounded-xl bg-[#090e21] hover:bg-[#0c142e] border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
                            >
                              <div>
                                {/* Top Meta Line */}
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[10px] font-bold text-slate-400">
                                      {wp.id}
                                    </span>
                                    <span
                                      className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded border ${ownerMeta.badgeColor}`}
                                    >
                                      {wp.owner}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    {getPriorityBadge(wp.priority)}
                                    {getStatusBadge(wp.status)}
                                  </div>
                                </div>

                                {/* Title */}
                                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors leading-snug line-clamp-2">
                                  {wp.title}
                                </h4>

                                {/* Description */}
                                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                                  {wp.description}
                                </p>

                                {/* Deliverables summary */}
                                <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                                  {wp.deliverables.slice(0, 2).map((del, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10.5px] text-slate-300">
                                      <CheckCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                                      <span className="truncate">{del}</span>
                                    </div>
                                  ))}
                                  {wp.deliverables.length > 2 && (
                                    <div className="text-[10px] text-slate-500 font-mono pl-4.5">
                                      +{wp.deliverables.length - 2} weitere Deliverables...
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Card Footer: Progress & Lead */}
                              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                                  <span>Fortschritt</span>
                                  <span className="text-white font-bold">{wp.progressPercent}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                                    style={{ width: `${wp.progressPercent}%` }}
                                  />
                                </div>

                                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-mono">
                                  <span className="truncate max-w-[130px]">{wp.leadName}</span>
                                  <span className="text-amber-400/90">{wp.targetSprint}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {roadmapViewMode === 'matrix' && (
            <div className="space-y-6">
              {PROJECT_OWNERS.map((po) => {
                const ownerPackages = filteredWorkPackages.filter((wp) => wp.owner === po.id);
                if (ownerPackages.length === 0 && selectedOwner !== 'ALL') {
                  return null;
                }

                return (
                  <div key={po.id} className="p-4 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${po.badgeColor}`}
                          >
                            {po.label}
                          </span>
                          <span className="text-xs text-slate-400">Verantwortlich: {po.lead}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{po.description}</p>
                      </div>
                      <div className="text-xs font-mono text-slate-300">
                        {ownerPackages.length} Arbeitspaket{ownerPackages.length !== 1 ? 'e' : ''}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ownerPackages.map((wp) => (
                        <div
                          key={wp.id}
                          onClick={() => setSelectedPackage(wp)}
                          className="p-3.5 rounded-lg bg-black/40 hover:bg-black/60 border border-slate-800/80 hover:border-rose-400/40 transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                              <span className="text-slate-400 font-bold">{wp.id}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-amber-400 font-bold">Phase {wp.phase}</span>
                                {getStatusBadge(wp.status)}
                              </div>
                            </div>
                            <h4 className="text-xs font-bold text-white line-clamp-2">{wp.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{wp.description}</p>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>{wp.progressPercent}% Erledigt</span>
                            <span className="text-amber-300">{wp.targetSprint}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {roadmapViewMode === 'table' && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090e21]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-black/50 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Titel &amp; Deliverables</th>
                    <th className="p-3">Projektowner</th>
                    <th className="p-3">Phase</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Priorität</th>
                    <th className="p-3">Fortschritt</th>
                    <th className="p-3">Lead &amp; Ziel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-mono">
                  {filteredWorkPackages.map((wp) => {
                    const ownerMeta = getOwnerMeta(wp.owner);
                    return (
                      <tr
                        key={wp.id}
                        onClick={() => setSelectedPackage(wp)}
                        className="hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <td className="p-3 font-bold text-slate-400 whitespace-nowrap">{wp.id}</td>
                        <td className="p-3 font-sans">
                          <div className="font-bold text-white">{wp.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{wp.description}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${ownerMeta.badgeColor}`}>
                            {wp.owner}
                          </span>
                        </td>
                        <td className="p-3 text-amber-300 whitespace-nowrap font-bold">Phase {wp.phase}</td>
                        <td className="p-3 whitespace-nowrap">{getStatusBadge(wp.status)}</td>
                        <td className="p-3 whitespace-nowrap">{getPriorityBadge(wp.priority)}</td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="w-8 font-bold">{wp.progressPercent}%</span>
                            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-emerald-400 rounded-full"
                                style={{ width: `${wp.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 whitespace-nowrap">
                          <div>{wp.leadName}</div>
                          <div className="text-amber-400/80">{wp.targetSprint}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* D. WORK PACKAGE DETAIL MODAL (When clicked) */}
          {selectedPackage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="relative w-full max-w-2xl bg-[#090e21] border border-rose-500/50 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-rose-400">{selectedPackage.id}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          getOwnerMeta(selectedPackage.owner).badgeColor
                        }`}
                      >
                        {selectedPackage.owner}
                      </span>
                      {getStatusBadge(selectedPackage.status)}
                      {getPriorityBadge(selectedPackage.priority)}
                    </div>
                    <h3 className="text-lg font-bold text-white">{selectedPackage.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPackage(null)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400 mb-0.5">Beschreibung:</div>
                    <p className="text-slate-300 leading-relaxed">{selectedPackage.description}</p>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      <span>Verbindliche Deliverables &amp; Arbeitsergebnisse</span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedPackage.deliverables.map((del, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-300">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-black/30 border border-slate-800 font-mono text-[11px]">
                    <div>
                      <div className="text-[9.5px] text-slate-400">Verantwortlicher Lead:</div>
                      <div className="text-white font-bold mt-0.5">{selectedPackage.leadName}</div>
                    </div>
                    <div>
                      <div className="text-[9.5px] text-slate-400">Ziel-Sprint:</div>
                      <div className="text-amber-400 font-bold mt-0.5">{selectedPackage.targetSprint}</div>
                    </div>
                    <div>
                      <div className="text-[9.5px] text-slate-400">Phase &amp; Stage:</div>
                      <div className="text-cyan-300 font-bold mt-0.5">Phase {selectedPackage.phase}</div>
                    </div>
                    {selectedPackage.bafinStandard && (
                      <div className="col-span-2 sm:col-span-3">
                        <div className="text-[9.5px] text-slate-400">Regulatorischer Standard:</div>
                        <div className="text-purple-300 font-bold mt-0.5">{selectedPackage.bafinStandard}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">
                    Fortschritt: <strong className="text-white">{selectedPackage.progressPercent}%</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPackage(null)}
                    className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: CONFIGURATOR CONSOLE & AUDIT (SET INTO CONTROL CENTER)       */}
      {/* ========================================================================= */}
      {activeTab === 'console' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-500/15 via-[#0d1530] to-purple-500/15 border border-rose-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-1">
                  <Shield className="w-4 h-4" />
                  <span>INTERNAL ADMIN &amp; GOVERNANCE CONSOLE • FEATURE-FLAGGED</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Pipeline Configurator &amp; Audit Console
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Zentrale Überwachung von Provider-Flotte, 50-Komponenten-Ausführungsstatus,
                  Schatten-Benchmarking, Daten-Plausibilitätsfehlern und Replay-Evidence im Control Center.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-black/60 text-emerald-400 border border-emerald-500/30 font-bold">
                  Zero Secrets Exposed (Audit OK)
                </span>
              </div>
            </div>
          </div>

          {/* Top 4 KPI Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Provider Flotte (Health)</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">4 / 4 Online</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Binance, Kraken, 12Data, SEC</div>
            </div>

            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Komponenten-Status</div>
              <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">44 Active • 6 Shadow</div>
              <div className="text-[11px] text-slate-400 mt-0.5">50 / 50 Registriert</div>
            </div>

            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Plausibilitäts-Verletzungen</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">0 Fehler</div>
              <div className="text-[11px] text-slate-400 mt-0.5">11 / 11 Regeln bestanden</div>
            </div>

            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Aktive Config-Version</div>
              <div className="text-2xl font-extrabold font-mono text-white mt-1">v2.5.0-prod</div>
              <div className="text-[11px] text-purple-300 mt-0.5">Shadow: v2.6.0 (10% Sample)</div>
            </div>
          </div>

          {/* Configurator Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel 1: Component Execution Matrix */}
            <div className="p-5 rounded-2xl bg-[#090e21] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Komponenten-Ausführungsstatus (Top 50)</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">100% Type-Safe</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {[
                  { id: 'market_integrity_gate', name: 'Market Integrity Gate', domain: 'data-quality', status: 'ACTIVE', gate: true },
                  { id: 'data_quality_scorer', name: 'Data Quality Scorer', domain: 'data-quality', status: 'ACTIVE', gate: true },
                  { id: 'liquidity_eligibility_scorer', name: 'Liquidity Eligibility Scorer', domain: 'risk-controls', status: 'ACTIVE', gate: true },
                  { id: 'spread_slippage_risk_scorer', name: 'Spread & Slippage Risk Scorer', domain: 'risk-controls', status: 'ACTIVE', gate: false },
                  { id: 'multi_timeframe_trend_regime_scorer', name: 'Multi-Timeframe Trend Scorer', domain: 'scoring', status: 'ACTIVE', gate: false },
                  { id: 'fundamental_quality_scorer', name: 'Piotroski & Moat Quality Scorer', domain: 'scoring', status: 'ACTIVE', gate: false },
                  { id: 'bot_manipulation_risk_scorer', name: 'Bot Manipulation Risk Scorer', domain: 'risk-controls', status: 'ACTIVE', gate: true },
                  { id: 'final_rank_confidence_evidence_scorer', name: 'Final Composite & Evidence Scorer', domain: 'ranking', status: 'ACTIVE', gate: true },
                  { id: 'options_positioning_gamma_scorer', name: 'Options Gamma Exposure (GEX)', domain: 'market-intelligence', status: 'SHADOW', gate: false },
                  { id: 'onchain_flow_holder_behavior_scorer', name: 'On-Chain Flow & Whale Scorer', domain: 'market-intelligence', status: 'ACTIVE', gate: false },
                ].map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-black/40 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{c.name}</span>
                        {c.gate && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            GATE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{c.domain} • {c.id}</div>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                          : 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: Shadow-Mode Benchmarking & Diff */}
            <div className="p-5 rounded-2xl bg-[#090e21] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Schatten-Modus &amp; Konfigurations-Diff</span>
                </h3>
                <span className="text-[10px] font-mono text-purple-300">Parallel 10% Canary</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Baseline (v2.5.0-prod):</span>
                    <span className="text-emerald-400 font-bold">P95: 38ms • CPU: 12%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Canary Shadow (v2.6.0):</span>
                    <span className="text-purple-300 font-bold">P95: 34ms • CPU: 11% (-10%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-purple-400 rounded-full w-full" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Audit-Trail &amp; Replay Evidence:</div>
                  <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span>Letzter Merkle-Root Proof:</span>
                    <span className="text-amber-400 font-mono">0x7f4a...8b9c (OK)</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span>WORM-Archivierung (WpHG § 83):</span>
                    <span className="text-emerald-400 font-bold">Aktiv (5 Jahre unveränderbar)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 2: EXECUTIVE COCKPIT (GF & FOUNDER)                           */}
      {/* ========================================================================= */}
      {activeTab === 'cockpit' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-400/15 via-[#0d1530] to-rose-500/15 border border-amber-400/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <Activity className="w-4 h-4" />
                  <span>EXECUTIVE MANAGEMENT DASHBOARD</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Geschäftsführer &amp; Founder Cockpit
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Überblick über den v1.0 Go-Live Status, BaFin MaRisk Freigaben und Governance-Schwellenwerte.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
                  SLA: 99.98% OK
                </span>
              </div>
            </div>
          </div>

          {/* Key KPI Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Version 1.0 Reifegrad</div>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{avgProgress}%</div>
              <div className="text-[11px] text-emerald-400 mt-1">Im Zeitplan (Q4 Launch)</div>
            </div>

            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono uppercase">BaFin MaRisk Audit Score</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">98 / 100</div>
              <div className="text-[11px] text-slate-400 mt-1">WpHG § 83 Konform</div>
            </div>

            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Monatsbudget (AP-006)</div>
              <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">20,00 €</div>
              <div className="text-[11px] text-cyan-300 mt-1">50% unter 40 € Deckel</div>
            </div>

            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Echtzeit-Latenz (Fleet)</div>
              <div className="text-2xl font-bold text-purple-400 font-mono mt-1">38 ms</div>
              <div className="text-[11px] text-purple-300 mt-1">Sub-45ms Standard erfüllt</div>
            </div>
          </div>

          {/* Governance Checklist for v1.0 Go-Live */}
          <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Geschäftsführer v1.0 Freigabe-Checkliste (Management Sign-Off)</span>
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { title: 'Revisionssichere WORM-Archivierung (WpHG § 83)', done: true, lead: 'Compliance & CISO' },
                { title: 'Monatlicher 40,00 € Budget-Deckel technisch gesichert (AP-006)', done: true, lead: 'Governance' },
                { title: 'Gemini Scientist Reasoning Engine mit Fallback-Mechanismus', done: true, lead: 'Agent-Client' },
                { title: 'Multi-Asset Screener 50-Faktoren Validierung (npm test 100% Pass)', done: true, lead: 'QA Lead' },
                { title: 'Finaler externer Penetrationstest vor v1.0 Start', done: false, lead: 'Security' },
                { title: 'Notfall-Umschaltung / Failover nach Frankfurt Standby', done: false, lead: 'DevOps' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-slate-800/80"
                >
                  <div className="flex items-center gap-2.5">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span className={item.done ? 'text-white' : 'text-slate-300'}>{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-slate-400">{item.lead}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        item.done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-400/20 text-amber-300'
                      }`}
                    >
                      {item.done ? 'Freigegeben' : 'In Arbeit'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 3: TEAM & ROLLEN (11 PROJEKTOWNER)                            */}
      {/* ========================================================================= */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-[#0d1530] to-purple-500/15 border border-cyan-500/40">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Die 11 Verantwortungsbereiche &amp; Projektowner
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Klare Zuordnung aller Arbeitspakete nach BaFin MaRisk Verantwortungsmatrix für einen reibungslosen
              Entwicklungszyklus bis Version 1.0.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {PROJECT_OWNERS.map((po) => {
              const apCount = WORK_PACKAGES.filter((p) => p.owner === po.id).length;
              return (
                <div key={po.id} className="p-4 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${po.badgeColor}`}>
                      {po.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{apCount} Arbeitspakete</span>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">Lead Owner:</div>
                    <div className="text-xs font-bold text-white mt-0.5">{po.lead}</div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{po.description}</p>

                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOwner(po.id);
                        setActiveTab('roadmap');
                      }}
                      className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Arbeitspakete in Roadmap ansehen</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 4: COST CENTER & FINANZEN (AP-006 BUDGET CAP)                  */}
      {/* ========================================================================= */}
      {activeTab === 'cost_center' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#0d1530] to-cyan-500/15 border border-emerald-500/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span>REVENUE ASSURANCE &amp; TCO-CONTROLLING (AP-006)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Cost Center &amp; Budget-Governance
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Einhaltung der vertraglichen 40,00 € Monatsbudget-Obergrenze für externe Datenprovider, Server und
                  KI-Token zur Garantie der Profitabilität.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 text-right">
                <div className="text-[10px] text-slate-400 font-mono">Monatlicher Deckel:</div>
                <div className="text-xl font-mono font-bold text-emerald-400">40,00 € / Monat</div>
              </div>
            </div>
          </div>

          {/* Cost Allocation Table */}
          <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Aktueller Monatskosten-Split (Echtzeit-Kalkulation)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 font-mono">
                <thead className="bg-black/50 text-[10px] text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Posten / Provider</th>
                    <th className="p-2.5">Kategorie</th>
                    <th className="p-2.5">Limit</th>
                    <th className="p-2.5">Kosten / Monat</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="p-2.5 font-bold text-white">TwelveData Gateway (US &amp; DAX Aktien)</td>
                    <td className="p-2.5 text-slate-400">Marktdaten</td>
                    <td className="p-2.5 text-slate-400">800 req/Tag</td>
                    <td className="p-2.5 text-amber-300 font-bold">15,00 €</td>
                    <td className="p-2.5 text-emerald-400">Aktiv (In-Memory Buffer)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">FRED St. Louis Fed (Makro &amp; Zinsen)</td>
                    <td className="p-2.5 text-slate-400">Makroökonomie</td>
                    <td className="p-2.5 text-slate-400">Unbegrenzt</td>
                    <td className="p-2.5 text-emerald-400 font-bold">0,00 €</td>
                    <td className="p-2.5 text-emerald-400">Open Data SLA</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Alchemy Web3 RPC (On-Chain Whale Data)</td>
                    <td className="p-2.5 text-slate-400">Krypto RPC</td>
                    <td className="p-2.5 text-slate-400">300 Mio CU</td>
                    <td className="p-2.5 text-amber-300 font-bold">5,00 €</td>
                    <td className="p-2.5 text-emerald-400">Aktiv</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Google Cloud Run (europe-west2)</td>
                    <td className="p-2.5 text-slate-400">Hosting &amp; Compute</td>
                    <td className="p-2.5 text-slate-400">Scale-to-Zero</td>
                    <td className="p-2.5 text-cyan-300 font-bold">0,00 €</td>
                    <td className="p-2.5 text-emerald-400">Free Tier Kontingent</td>
                  </tr>
                  <tr className="bg-emerald-500/10 font-bold">
                    <td className="p-2.5 text-white">GESAMT-AUSGABEN</td>
                    <td className="p-2.5 text-slate-400">Monatlich</td>
                    <td className="p-2.5 text-emerald-400">Max 40,00 €</td>
                    <td className="p-2.5 text-emerald-400 text-sm">20,00 € / Monat</td>
                    <td className="p-2.5 text-emerald-300">20,00 € Restbudget gesichert</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 5: SYSTEM & WEBANWENDUNG                                      */}
      {/* ========================================================================= */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/15 via-[#0d1530] to-rose-500/15 border border-purple-500/40">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Webanwendungs-Optionen &amp; Systemkonfiguration
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Steuern Sie Feature-Toggles, Auto-Healing Mechanismen und Audit-Logging der Produktions-Webanwendung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                title: 'Echtzeit Ringpuffer-Caching (Redis)',
                desc: 'Entlastet Provider-APIs durch In-Memory Ticks und garantiert Sub-45ms Latenz.',
                active: true,
                tag: 'Performance',
              },
              {
                title: 'BaFin WORM Revisionsarchivierung',
                desc: 'Unveränderbares Hashing nach WpHG § 83 für alle berechneten Scores und Signale.',
                active: true,
                tag: 'Compliance',
              },
              {
                title: 'Whale Radar Live-Transaktionsfeed',
                desc: 'Automatisches Tracking von Wal-Transaktionen > 1 Mio $ auf Bitcoin und Ethereum.',
                active: true,
                tag: 'On-Chain',
              },
              {
                title: 'Autonomer Gemini AI Kaufberater',
                desc: 'Scientist Reasoning Kaufberater mit Budget-Validierung und Inventarisierung.',
                active: true,
                tag: 'AI Agent',
              },
            ].map((feat, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#090e21] border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {feat.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                  Aktiv
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
