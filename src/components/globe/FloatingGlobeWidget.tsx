/**
 * ============================================================================
 * CAPITAL AI — FLOATING GLOBE WIDGET (ABGEKOPPELTE HERO-ERDE)
 * ----------------------------------------------------------------------------
 * Schwebendes, interaktives Bild-in-Bild (PiP) Widget der rotierenden Erde:
 * - Bleibt beim Scrollen über alle Seitenbereiche hinweg sichtbar
 * - Bietet direkte Andock-Möglichkeit zurück in die Hero-Sektion
 * - Schnellschalter für Finanzzentren & Latenz-Telemetrie
 * - Umschaltbar zwischen Vollbild-Cockpit und Minimalsicht
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Radio,
  Clock,
  Zap,
  Globe2,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowDownLeft,
} from 'lucide-react';
import { HeroRotatingGlobe } from './HeroRotatingGlobe';
import { FINANCIAL_NODES, FinancialNode, isExchangeOpen } from '../../data/globeNodes';

export interface FloatingGlobeWidgetProps {
  isOpen: boolean;
  onDockBackToHero: () => void;
  onOpenCockpit: () => void;
  selectedNodeId?: string | null;
  onSelectNode?: (node: FinancialNode | null) => void;
}

export const FloatingGlobeWidget: React.FC<FloatingGlobeWidgetProps> = ({
  isOpen,
  onDockBackToHero,
  onOpenCockpit,
  selectedNodeId,
  onSelectNode,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [selectedHubId, setSelectedHubId] = useState<string>('frankfurt');

  if (!isOpen) return null;

  const currentHub = FINANCIAL_NODES.find((n) => n.id === selectedHubId) || FINANCIAL_NODES[0];
  const isOpenNow = isExchangeOpen(currentHub);

  return (
    <div
      role="complementary"
      aria-label="Abgekoppelte rotierende Hero-Erde"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto select-none transition-all duration-300"
    >
      {/* MINIMIZED BUBBLE ORB */}
      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#070e24]/95 border border-amber-400/50 shadow-2xl backdrop-blur-xl text-white hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center animate-pulse">
            <Globe2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-bold text-amber-300">Live Orbit</span>
          <span className="text-[10px] text-slate-400 font-mono">· 45ms</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        </button>
      ) : (
        /* EXPANDED FLOATING WINDOW */
        <div className="w-[320px] sm:w-[360px] rounded-2xl bg-[#050b1d]/95 border border-amber-400/40 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden flex flex-col">
          {/* Top Bar Header */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-amber-400/10 via-[#0a1435] to-cyan-500/10 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Abgekoppelte Hero-Erde</span>
                </span>
                <span className="text-[9.5px] font-mono text-cyan-400">
                  Global Live Feed Mesh
                </span>
              </div>
            </div>

            {/* Quick Actions: Minimize, Re-Dock, Expand Cockpit */}
            <div className="flex items-center gap-1">
              {/* Wieder andocken Button */}
              <button
                type="button"
                onClick={onDockBackToHero}
                title="Wieder in die Hero-Sektion andocken"
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 text-[10.5px] font-mono font-bold border border-amber-400/30 hover:border-amber-400/60 transition-all cursor-pointer"
              >
                <ArrowDownLeft className="w-3 h-3 text-amber-400" />
                <span>Andocken</span>
              </button>

              <button
                type="button"
                onClick={onOpenCockpit}
                title="Vollbild-Cockpit öffnen"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="Minimieren"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive 3D Rotating Canvas Body */}
          <div className="w-full h-[260px] bg-gradient-to-b from-[#02050e] to-[#081026] relative">
            <HeroRotatingGlobe
              mode="floating"
              isDetached={true}
              onToggleDetach={onDockBackToHero}
              onOpenCockpit={onOpenCockpit}
              selectedNodeId={selectedHubId}
              onSelectNode={(n) => {
                if (n) {
                  setSelectedHubId(n.id);
                  onSelectNode?.(n);
                }
              }}
              className="w-full h-full"
            />
          </div>

          {/* Bottom Hub Selector & Telemetry Footer */}
          <div className="p-3 bg-[#040817] border-t border-slate-800/80 space-y-2">
            {/* Quick Financial Hub Selector */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>FINANZ-ZENTRUM:</span>
              <span className={isOpenNow ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {isOpenNow ? '● HANDEL AKTIV' : '○ MARKT GESCHLOSSEN'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {FINANCIAL_NODES.map((node) => {
                const isSelected = selectedHubId === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      setSelectedHubId(node.id);
                      onSelectNode?.(node);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    {node.city}
                  </button>
                );
              })}
            </div>

            {/* Hub Detail Line */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <div className="flex flex-col">
                <span className="font-semibold text-white">{currentHub.primaryFeed}</span>
                <span className="text-[9.5px] font-mono text-slate-400">
                  {currentHub.exchange} · Ping {currentHub.latencyMs}ms
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenCockpit}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-mono text-[10px] border border-cyan-500/30 transition-colors cursor-pointer"
              >
                Cockpit &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
