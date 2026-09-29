/**
 * CAPITAL AI — SUBPAGE SIDEBAR NAVIGATION (NACH RECHTS AUFKLAPPBAR)
 * 
 * Ermöglicht in Studio Hub, Learning Portal und Control Center die bequeme
 * Navigation über eine moderne, nach rechts aufklappbare Side-Liste.
 */

import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  PanelLeftOpen,
  PanelLeftClose,
  Sparkles,
} from 'lucide-react';

export interface SubpageNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  desc?: string;
}

interface SubpageSidebarNavProps {
  hubTitle: string;
  items: SubpageNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  accentColor?: 'cyan' | 'amber' | 'rose' | 'purple';
}

export const SubpageSidebarNav: React.FC<SubpageSidebarNavProps> = ({
  hubTitle,
  items,
  activeId,
  onSelect,
  accentColor = 'cyan',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const colorStyles = {
    cyan: {
      btnBg: 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
      activeItem: 'bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      accentText: 'text-cyan-400',
      borderGlow: 'border-cyan-500/40',
      dot: 'bg-cyan-400',
      floatingBg: 'bg-[#041026] text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20',
    },
    amber: {
      btnBg: 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(245,176,20,0.15)]',
      activeItem: 'bg-amber-400 text-black font-extrabold shadow-[0_0_15px_rgba(245,176,20,0.4)]',
      accentText: 'text-amber-400',
      borderGlow: 'border-amber-400/40',
      dot: 'bg-amber-400',
      floatingBg: 'bg-[#181102] text-amber-300 border-amber-500/40 hover:bg-amber-400/20',
    },
    rose: {
      btnBg: 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
      activeItem: 'bg-rose-500 text-white font-extrabold shadow-[0_0_15px_rgba(244,63,94,0.4)]',
      accentText: 'text-rose-400',
      borderGlow: 'border-rose-500/40',
      dot: 'bg-rose-400',
      floatingBg: 'bg-[#1e070d] text-rose-300 border-rose-500/40 hover:bg-rose-500/20',
    },
    purple: {
      btnBg: 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.15)]',
      activeItem: 'bg-purple-500 text-white font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      accentText: 'text-purple-400',
      borderGlow: 'border-purple-500/40',
      dot: 'bg-purple-400',
      floatingBg: 'bg-[#140521] text-purple-300 border-purple-500/40 hover:bg-purple-500/20',
    },
  }[accentColor];

  const activeItemObj = items.find((i) => i.id === activeId);

  return (
    <>
      {/* 1. INLINE TRIGGER BAR (Direkt über den Inhalten platziert) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 p-2 rounded-xl bg-black/40 border border-slate-800/80 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          {/* Main Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer group ${colorStyles.btnBg}`}
            title={`${hubTitle} Side-Liste nach rechts aufklappen`}
          >
            <PanelLeftOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Side-Liste (nach rechts aufklappbar)</span>
            <span className="flex items-center text-[10px] opacity-80 font-mono px-1.5 py-0.5 rounded bg-black/30">
              {items.length} Unterseiten
            </span>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isOpen ? 'rotate-90' : 'group-hover:translate-x-0.5'
              }`}
            />
          </button>

          {/* Quick Info text on active subpage */}
          {activeItemObj && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono pl-1">
              <span>Aktive Unterseite:</span>
              <span className={`font-bold ${colorStyles.accentText} flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-slate-700/50`}>
                <span className={`w-1.5 h-1.5 rounded-full ${colorStyles.dot} animate-pulse`} />
                {activeItemObj.label}
              </span>
            </div>
          )}
        </div>

        {/* Quick hint */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
          <Sparkles className="w-3 h-3 text-amber-400/70" />
          <span>Wählen Sie Unterseiten via Seitenleiste</span>
        </div>
      </div>

      {/* 2. FLOATING EDGE TAB (Am linken Bildschirmrand angeheftet für schnellen Zugriff) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-30 hidden sm:flex items-center gap-1 py-3 px-1.5 rounded-r-xl border-y border-r shadow-2xl transition-all cursor-pointer group ${colorStyles.floatingBg} hover:pl-2.5`}
        title={`${hubTitle} Side-Liste nach rechts aufklappen`}
      >
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold tracking-wider uppercase font-mono py-1">
          Unterseiten ({items.length})
        </span>
      </button>

      {/* 3. OVERLAY BACKDROP WHEN OPENED */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* 4. NACH RECHTS AUFKLAPPBARE SIDE-LISTE (DRAWER / PANEL) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-84 bg-[#060b1e] border-r border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label={`${hubTitle} Unterseiten Navigation`}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Nach rechts aufgeklappt
              </div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${colorStyles.dot}`} />
                <span>{hubTitle}</span>
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Seitenleiste schließen (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Info text */}
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Wählen Sie direkt eine der <strong className="text-white">{items.length} Unterseiten</strong> aus:
          </p>

          {/* Subpages Vertical List */}
          <nav className="space-y-1.5 max-h-[calc(100vh-230px)] overflow-y-auto pr-1 scrollbar-thin">
            {items.map((item, idx) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer group ${
                    isActive
                      ? colorStyles.activeItem
                      : 'bg-black/30 hover:bg-white/5 text-slate-300 hover:text-white border border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-mono opacity-50 shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="shrink-0">{item.icon}</div>
                    <div className="truncate">
                      <div className="font-bold leading-tight truncate">{item.label}</div>
                      {item.desc && (
                        <div
                          className={`text-[10px] truncate leading-none mt-1 ${
                            isActive ? 'opacity-90' : 'text-slate-500'
                          }`}
                        >
                          {item.desc}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-black/40 text-white'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>Capital-AI Enterprise</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-sans"
          >
            <span>Einklappen</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
