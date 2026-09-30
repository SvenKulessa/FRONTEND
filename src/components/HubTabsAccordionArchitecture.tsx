/**
 * ============================================================================
 * CAPITAL AI — HUB TABS GRAFIKARCHITEKTUR (ACCORDION WIE ASSETKLASSEN)
 * ----------------------------------------------------------------------------
 * Einheitliche Grafikarchitektur für:
 *  1. Market Screener Hub (/marketscreener)
 *  2. Studio Hub (/studio)
 *  3. Learning Portal (/learning)
 *  4. Control Center (/control-center)
 * 
 * EIGENSCHAFTEN:
 *  - Exakt dieselbe visuelle Architektur wie die Assetklassen & Unterklassen
 *  - Alle Tabs sind aufklappbar (expandable / collapsible Accordion)
 *  - Icon-Rahmen mit Brand-Tint & Rand, rotating ChevronDown (180°)
 *  - Metrik-Badge, Schlagworte/Tags und Deep-Link Pfadanzeige
 *  - Vollständige Navigationspfad-Synchronisation über saubere URLs
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  className?: string;
}

export const HubTabsAccordionArchitecture: React.FC<HubTabsAccordionArchitectureProps> = ({
  hubTitle,
  hubBadge,
  hubColor,
  tabs,
  activeTabId,
  onSelectTab,
  className = '',
}) => {
  // Welcher Tab ist gerade im Accordion aufgeklappt
  // Standardmäßig ist der aktive Tab aufgeklappt
  const [expandedTabId, setExpandedTabId] = useState<string | null>(activeTabId);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // Sync expanded tab if activeTabId changes externally
  React.useEffect(() => {
    setExpandedTabId(activeTabId);
  }, [activeTabId]);

  const handleToggleExpand = (tabId: string) => {
    setExpandedTabId((prev) => (prev === tabId ? null : tabId));
  };

  const handleSelectTab = (tab: HubTabItem) => {
    onSelectTab(tab.id, tab.path);
    setExpandedTabId(tab.id);
  };

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
      {/* SECTION HEADER: Gleiche visuelle Struktur wie Assetklassen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: hubColor }}
          />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            {hubTitle} — Aufklappbare Tabs &amp; Pfad-Navigation
          </h2>
          {hubBadge && (
            <span
              className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border"
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
          <span>Aufklappbar wie Assetklassen</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-300/80 font-semibold">{tabs.length} Bereiche</span>
        </div>
      </div>

      {/* ACCORDION GRID: Jeder Tab als aufklappbare Karte wie die Assetklassen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          const isExpanded = expandedTabId === tab.id;

          return (
            <div
              key={tab.id}
              className="rounded-xl border bg-[#060c1d]/90 overflow-hidden transition-all duration-200"
              style={{
                borderColor: isActive
                  ? `${tab.color}70`
                  : isExpanded
                  ? `${tab.color}40`
                  : 'rgba(51, 65, 85, 0.4)',
                boxShadow: isActive ? `0 0 16px ${tab.color}18` : undefined,
              }}
            >
              {/* TAB CARD HEADER (KLICKBAR ZUM AUFKLAPPEN) */}
              <button
                type="button"
                onClick={() => handleToggleExpand(tab.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors cursor-pointer group"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Square Icon Container mit Brand Tint & Border wie Assetklassen */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${tab.color}18`,
                      borderColor: `${tab.color}35`,
                      color: tab.color,
                    }}
                  >
                    {tab.icon}
                  </div>

                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-bold text-white block truncate group-hover:text-amber-200 transition-colors">
                        {tab.name}
                      </span>
                      {isActive && (
                        <span
                          className="text-[9px] font-mono font-bold px-1 py-0.2 rounded border shrink-0"
                          style={{
                            color: tab.color,
                            backgroundColor: `${tab.color}25`,
                            borderColor: `${tab.color}60`,
                          }}
                        >
                          AKTIV
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block truncate">
                      {tab.path}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {tab.badge && (
                    <span
                      className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border"
                      style={{
                        color: tab.color,
                        backgroundColor: `${tab.color}10`,
                        borderColor: `${tab.color}30`,
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-white' : 'group-hover:text-slate-200'
                    }`}
                  />
                </div>
              </button>

              {/* AUFKLAPPBARER INHALT (ACCORDION EXPANSION WIE BEI ASSETKLASSEN) */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-slate-800/70 bg-black/35"
                  >
                    <div className="p-3 space-y-2.5">
                      {/* Short Description */}
                      <p className="text-[11.5px] text-slate-300 leading-relaxed">
                        {tab.shortDesc}
                      </p>

                      {/* Tag Chips */}
                      {tab.tags && tab.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {tab.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Deep-Link Pfadanzeige & Aktionen */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        {/* Pfad Badge mit Copy-Button */}
                        <button
                          type="button"
                          onClick={(e) => handleCopyPath(tab.path, e)}
                          className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 hover:text-amber-300 bg-white/5 px-2 py-1 rounded border border-white/5 hover:border-amber-400/30 transition-colors cursor-pointer"
                          title="Navigationspfad kopieren"
                        >
                          {copiedPath === tab.path ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">Kopiert!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="truncate max-w-[120px] sm:max-w-[160px]">{tab.path}</span>
                            </>
                          )}
                        </button>

                        {/* Action: Auswählen & Navigieren */}
                        {isActive ? (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Inhalt geöffnet</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSelectTab(tab)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                            style={{
                              backgroundColor: `${tab.color}20`,
                              color: tab.color,
                              border: `1px solid ${tab.color}50`,
                            }}
                          >
                            <span>Zu Reiter wechseln</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
