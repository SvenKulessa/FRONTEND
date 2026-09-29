/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: CAPITAL-AI KERNMODULE REPOSITORY]
 * ----------------------------------------------------------------------------
 * 1. KERNMODULE (LANDINGPAGE):
 *    - Multi Asset Market Screener (Cyan #06B6D4)
 *    - Learning Platform (Gold #F9BF21)
 *    - Pipeline Builder (Emerald #10B981)
 * 2. AUFKLAPPBARE SIDELISTE:
 *    - Bei Klick auf die Action Buttons der Module öffnet sich eine elegante
 *      aufklappbare Sideliste mit allen Einträgen, Funktionen, Metriken und Aktionen.
 *    - Keine störenden statischen Listen unter den Modulen.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  SlidersHorizontal,
  Layers,
  BookOpen,
  LineChart,
  Sparkles,
  X,
  ChevronRight,
  ShieldCheck,
  PanelRightOpen,
  PanelRightClose,
  ExternalLink,
  CheckCircle2,
  Activity,
  Cpu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CORE_MODULES } from '../data/mockData';
import { CoreModule } from '../types';

interface CoreModulesProps {
  onSelectModule: (module: CoreModule) => void;
  onViewAllModules: () => void;
  onNavigate?: (path: string) => void;
}

export const CoreModules: React.FC<CoreModulesProps> = ({
  onSelectModule,
  onViewAllModules,
  onNavigate,
}) => {
  // Sideliste State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarModule, setActiveSidebarModule] = useState<CoreModule>(CORE_MODULES[0]);

  // The 3 explicit core modules requested on the landing page:
  const primaryModules = CORE_MODULES.slice(0, 3);

  // Close Sideliste when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openSidebarForModule = (module: CoreModule) => {
    setActiveSidebarModule(module);
    setIsSidebarOpen(true);
  };

  const handleLaunchModule = (module: CoreModule) => {
    setIsSidebarOpen(false);
    onSelectModule(module);
  };

  const renderModuleIcon = (module: CoreModule, size: 'sm' | 'md' = 'md') => {
    const containerClasses =
      size === 'sm'
        ? 'w-9 h-9 rounded-xl flex items-center justify-center shrink-0'
        : 'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mb-3.5';

    switch (module.iconType) {
      case 'screener':
        return (
          <div
            className={`${containerClasses} border border-cyan-400/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.3)]`}
          >
            <LineChart className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]'} />
          </div>
        );
      case 'book':
        return (
          <div
            className={`${containerClasses} border border-[#F9BF21]/40 bg-[#F9BF21]/15 text-[#F9BF21] shadow-[0_0_16px_rgba(249,191,33,0.3)]`}
          >
            <BookOpen className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6 drop-shadow-[0_0_6px_rgba(249,191,33,0.5)]'} />
          </div>
        );
      case 'builder':
        return (
          <div
            className={`${containerClasses} border border-emerald-400/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.3)]`}
          >
            <SlidersHorizontal className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]'} />
          </div>
        );
      case 'brain':
        return (
          <div
            className={`${containerClasses} border border-[#8D26FF]/40 bg-[#8D26FF]/15 text-[#8D26FF] shadow-[0_0_16px_rgba(141,38,255,0.3)]`}
          >
            <Layers className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} />
          </div>
        );
      case 'leaf':
        return (
          <div
            className={`${containerClasses} border border-[#44DE88]/40 bg-[#44DE88]/15 text-[#44DE88] shadow-[0_0_16px_rgba(68,222,136,0.3)]`}
          >
            <ShieldCheck className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} />
          </div>
        );
      case 'news':
        return (
          <div
            className={`${containerClasses} border border-[#F87171]/40 bg-[#F87171]/15 text-[#F87171] shadow-[0_0_16px_rgba(248,113,113,0.3)]`}
          >
            <Sparkles className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} />
          </div>
        );
      default:
        return (
          <div
            className={`${containerClasses} border border-amber-400/40 bg-amber-500/15 text-amber-300`}
          >
            <Sparkles className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} />
          </div>
        );
    }
  };

  return (
    <section className="px-3 sm:px-6 py-6 relative" aria-labelledby="core-modules-heading">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
            Architektur &amp; Plattform-Säulen
          </div>
          <h2
            id="core-modules-heading"
            className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2"
          >
            <span>Unsere Kernmodule</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-slate-700/60 text-slate-300">
              Top 3
            </span>
          </h2>
        </div>

        {/* Global Sidelisten-Trigger & Alle Module */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openSidebarForModule(primaryModules[0])}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all shadow-[0_0_12px_rgba(245,176,20,0.15)] cursor-pointer"
            title="Aufklappbare Sideliste für alle Module öffnen"
          >
            <PanelRightOpen className="w-3.5 h-3.5" />
            <span>Sideliste aufklappen</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-amber-200">
              {CORE_MODULES.length} Module
            </span>
          </button>

          <button
            type="button"
            onClick={onViewAllModules}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors cursor-pointer pl-1"
          >
            <span>Alle Module</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DIE 3 PRIMÄREN KERNMODULE (Multi Asset Screener, Learning Platform, Pipeline Builder) */}
      {/* Clean Cards: Keine störenden statischen Listen unter den Modulen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {primaryModules.map((module) => (
          <motion.div
            key={module.id}
            whileHover={{ y: -3 }}
            className="rounded-2xl bg-gradient-to-b from-[#0a122c] to-[#040817] border border-slate-800/90 hover:border-amber-400/40 p-5 flex flex-col justify-between transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.35)] group relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-15 pointer-events-none transition-opacity group-hover:opacity-30"
              style={{ backgroundColor: module.brandColor || '#F9BF21' }}
            />

            <div>
              {/* Header: Icon & Top Tag */}
              <div className="flex items-start justify-between">
                {renderModuleIcon(module)}
                <span
                  className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md border"
                  style={{
                    backgroundColor: `${module.brandColor}15`,
                    color: module.brandColor || '#F9BF21',
                    borderColor: `${module.brandColor}40`,
                  }}
                >
                  {module.id === 'market-screener'
                    ? 'Sub-45ms Tick'
                    : module.id === 'learning-portal'
                    ? '480+ Begriffe'
                    : '40 € / Mo Cap'}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white tracking-tight mb-1 group-hover:text-amber-300 transition-colors">
                {module.title}
              </h3>

              {/* Tagline */}
              <div className="text-[11px] font-mono text-slate-400 mb-2.5 font-medium line-clamp-1">
                {module.tagline}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                {module.description}
              </p>
            </div>

            {/* ACTION BUTTONS AUF DIE MODULE: Öffnet die aufklappbare Sideliste */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => openSidebarForModule(module)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all shadow-sm cursor-pointer group/btn"
                style={{
                  backgroundColor: `${module.brandColor}15`,
                  color: module.brandColor || '#F9BF21',
                  borderColor: `${module.brandColor}40`,
                }}
                title={`${module.title} Einträge & Aktionen in der Sideliste aufklappen`}
              >
                <PanelRightOpen className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                <span>Einträge &amp; Sideliste aufklappen</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectModule(module)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer shrink-0"
                title="Direkt öffnen"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* AUFKLAPPBARE SIDELISTE FÜR MODULE (OVERLAY & SLIDE-IN PANEL)              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-In Side Panel from the Right */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[440px] md:w-[480px] bg-[#060b1e] border-l border-slate-800 p-5 sm:p-6 flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden"
              aria-label="Modul Einträge Sideliste"
            >
              {/* TOP HEADER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ backgroundColor: activeSidebarModule.brandColor || '#F9BF21' }}
                    />
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                        Aufgeklappte Sideliste
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        Modul-Einträge &amp; Aktionen
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Sideliste schließen (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* MODUL-SCHNELLWECHSLER TABS OBEN IN DER SIDELISTE */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {CORE_MODULES.map((m) => {
                    const isSelected = m.id === activeSidebarModule.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setActiveSidebarModule(m)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/15 text-white border shadow-sm'
                            : 'bg-black/40 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-white/5'
                        }`}
                        style={{
                          borderColor: isSelected ? m.brandColor || '#F9BF21' : undefined,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: m.brandColor || '#F9BF21' }}
                        />
                        <span>{m.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* AKTIVES MODUL SUMMARY BANNER */}
                <div
                  className="p-4 rounded-2xl border transition-all"
                  style={{
                    backgroundColor: `${activeSidebarModule.brandColor}10`,
                    borderColor: `${activeSidebarModule.brandColor}35`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {renderModuleIcon(activeSidebarModule, 'sm')}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-bold text-white tracking-tight truncate">
                          {activeSidebarModule.title}
                        </h4>
                        <span
                          className="text-[9px] font-mono px-2 py-0.5 rounded font-bold border shrink-0"
                          style={{
                            backgroundColor: `${activeSidebarModule.brandColor}20`,
                            color: activeSidebarModule.brandColor || '#F9BF21',
                            borderColor: `${activeSidebarModule.brandColor}40`,
                          }}
                        >
                          {activeSidebarModule.id === 'market-screener'
                            ? 'Cross-Sectional'
                            : activeSidebarModule.id === 'learning-portal'
                            ? 'Wissensportal'
                            : activeSidebarModule.id === 'pipeline-builder'
                            ? '5-Ebenen Ingestion'
                            : 'Quant Alpha'}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5 line-clamp-1">
                        {activeSidebarModule.tagline}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {activeSidebarModule.details?.useCase || activeSidebarModule.description}
                  </p>
                </div>

                {/* SCROLLABLE EINTRÄGE DES AKTIVEN MODULS */}
                <div className="space-y-4 max-h-[calc(100vh-390px)] overflow-y-auto pr-1 scrollbar-thin">
                  {/* Sektion 1: Aufgeklappte Kernfunktionen & Einträge */}
                  {activeSidebarModule.details?.features && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Enthaltene Funktionen &amp; Unterseiten:</span>
                      </div>
                      <div className="space-y-1.5">
                        {activeSidebarModule.details.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-black/40 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-200"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                              style={{ backgroundColor: activeSidebarModule.brandColor || '#F9BF21' }}
                            />
                            <span className="leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sektion 2: Aufgeklappte Quantitative Metriken & Spezifikationen */}
                  {activeSidebarModule.details?.sampleMetrics && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Spezifikationen &amp; Leistungsdaten:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {activeSidebarModule.details.sampleMetrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-black/50 border border-slate-800/80 flex flex-col justify-between"
                          >
                            <span className="text-[10px] font-mono text-slate-400 truncate">
                              {metric.label}
                            </span>
                            <div className="flex items-center justify-between gap-1 mt-1">
                              <span className="text-xs font-bold text-white font-mono">
                                {metric.value}
                              </span>
                              <span
                                className="text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold"
                                style={{
                                  backgroundColor: `${activeSidebarModule.brandColor}20`,
                                  color: activeSidebarModule.brandColor || '#F9BF21',
                                }}
                              >
                                {metric.score}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER: DIREKTE ACTION BUTTONS */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => handleLaunchModule(activeSidebarModule)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-black transition-all shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: activeSidebarModule.brandColor || '#F9BF21',
                  }}
                >
                  <span>
                    {activeSidebarModule.id === 'market-screener'
                      ? 'Marktscreener Terminal jetzt öffnen'
                      : activeSidebarModule.id === 'learning-portal'
                      ? 'Learning Portal & Glossar starten'
                      : activeSidebarModule.id === 'pipeline-builder'
                      ? 'Pipeline Builder Konfigurator starten'
                      : `${activeSidebarModule.title} öffnen`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                  <span>Capital-AI Enterprise Engine</span>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Sideliste schließen
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
