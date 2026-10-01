/**
 * ============================================================================
 * CAPITAL AI — HUB TABS ARCHITEKTUR (DIREKTE TAB-NAVIGATION OHNE ACCORDION)
 * ----------------------------------------------------------------------------
 * Einheitliche Grafikarchitektur für:
 *  1. Market Screener Hub (/marketscreener)
 *  2. Studio Hub (/studio)
 *  3. Learning Portal (/learning)
 *  4. Control Center (/control-center)
 * 
 * EIGENSCHAFTEN:
 *  - Das alte "nach unten aufklappbare Design" ist entfallen
 *  - Alle Seiten sind direkt über die aufklappbare Sidebar und Tabs aufrufbar
 *  - Jeder Tab ist eine responsive Karte mit direktem Klick-Wechsel & Pfad-Synchronisation
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface HubTabItem {
  id: string;
  name: string;
  shortDesc: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
  tags?: string[];
  path: string;
}

interface HubTabsAccordionArchitectureProps {
  hubTitle: string;
  hubBadge?: string;
  hubColor: string;
  tabs: HubTabItem[];
  activeTabId: string;
  onSelectTab: (tabId: string, path: string) => void;
  onOpenSidebar?: () => void;
  className?: string;
}

export const HubTabsAccordionArchitecture: React.FC<HubTabsAccordionArchitectureProps> = ({
  hubTitle,
  hubBadge,
  hubColor,
  tabs,
  activeTabId,
  onSelectTab,
  onOpenSidebar,
  className = '',
}) => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const handleCopyPath = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + path);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    }
  };

  return (
    <div className={`space-y-3 mb-6 ${className}`}>
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: hubColor }}
          />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            {hubTitle} — Modulbereiche
          </h2>
          {hubBadge && (
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
              style={{
                color: hubColor,
                backgroundColor: `${hubColor}15`,
                borderColor: `${hubColor}35`,
              }}
            >
              {hubBadge}
            </span>
          )}
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span>{tabs.length} Module direkt verfügbar</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-300/80 font-semibold font-mono">Sub-45ms Tick</span>
        </div>
      </div>

      {/* TABS GRID: Jede Unterseite direkt auswählbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id, tab.path)}
              className={`rounded-xl border p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                isActive
                  ? 'bg-[#0a142e] shadow-lg'
                  : 'bg-[#060c1d]/90 hover:bg-[#09122a] border-slate-800/80 hover:border-slate-700'
              }`}
              style={{
                borderColor: isActive ? `${tab.color}80` : undefined,
                boxShadow: isActive ? `0 0 16px ${tab.color}25` : undefined,
              }}
            >
              <div>
                {/* Header: Icon + Name + Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${tab.color}20`,
                        borderColor: `${tab.color}40`,
                        color: tab.color,
                      }}
                    >
                      {tab.icon}
                    </div>

                    <span className="text-[12.5px] font-bold text-white block truncate group-hover:text-amber-200 transition-colors">
                      {tab.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isActive ? (
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border"
                        style={{
                          color: tab.color,
                          backgroundColor: `${tab.color}25`,
                          borderColor: `${tab.color}60`,
                        }}
                      >
                        AKTIV
                      </span>
                    ) : tab.badge ? (
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border text-slate-400 bg-white/5 border-slate-800"
                      >
                        {tab.badge}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-2.5">
                  {tab.shortDesc}
                </p>

                {/* Tags */}
                {tab.tags && tab.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap mb-2.5">
                    {tab.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/5 text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer: Path & Action */}
              <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500 group-hover:text-amber-400 transition-colors truncate max-w-[170px]">
                  {tab.path}
                </span>

                <span
                  className="flex items-center gap-1 font-bold transition-transform group-hover:translate-x-0.5"
                  style={{ color: isActive ? tab.color : '#94a3b8' }}
                >
                  <span>{isActive ? 'Geöffnet' : 'Öffnen'}</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
