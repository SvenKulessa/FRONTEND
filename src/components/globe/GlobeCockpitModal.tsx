/**
 * ============================================================================
 * CAPITAL AI — GLOBE COCKPIT MODAL (VOLLBILD TELEMETRIE-COCKPIT)
 * ----------------------------------------------------------------------------
 * Vollständiges Markt- & Datenstrom-Cockpit mit großer interaktiver 3D-Erde:
 * - Weltzeit- & Handelszeiten-Matrix (Frankfurt, London, New York, Tokio etc.)
 * - Gateway-Latenz-Profiler (Kraken, Binance, Twelve Data, Polygon)
 * - Geodätischer 3D-Arc Inspector
 * - Direkte Andock-Steuerung zurück in die Hero-Sektion
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  X,
  Globe2,
  Radio,
  Clock,
  Zap,
  RotateCcw,
  Maximize2,
  CheckCircle2,
  Layers,
  ArrowDownLeft,
  ExternalLink,
  ShieldCheck,
  Building2,
  Compass,
} from 'lucide-react';
import { HeroRotatingGlobe } from './HeroRotatingGlobe';
import {
  FINANCIAL_NODES,
  ARC_CONNECTIONS,
  FinancialNode,
  isExchangeOpen,
} from '../../data/globeNodes';

export interface GlobeCockpitModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDetached: boolean;
  onDockBackToHero: () => void;
  onDetachFromHero: () => void;
}

export const GlobeCockpitModal: React.FC<GlobeCockpitModalProps> = ({
  isOpen,
  onClose,
  isDetached,
  onDockBackToHero,
  onDetachFromHero,
}) => {
  const [selectedHubId, setSelectedHubId] = useState<string>('frankfurt');

  if (!isOpen) return null;

  const currentHub =
    FINANCIAL_NODES.find((n) => n.id === selectedHubId) || FINANCIAL_NODES[0];
  const isOpenNow = isExchangeOpen(currentHub);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="globe-cockpit-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl rounded-3xl bg-[#050b1d] border border-amber-400/40 shadow-[0_0_80px_rgba(245,176,20,0.15)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* TOP BAR */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-400/10 via-[#0a1435] to-cyan-500/10 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="globe-cockpit-title"
                  className="text-lg font-bold text-white tracking-tight"
                >
                  Global Telemetry Cockpit · Rotierende Hero-Erde
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE SPHERE v2.5
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Echtzeit-Kugelprojektion mit Geodäten-Arcs, 24/7 Gateways und Sub-45ms Latenz-Mesh.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dock/Detach Toggle */}
            <button
              type="button"
              onClick={() => {
                if (isDetached) {
                  onDockBackToHero();
                } else {
                  onDetachFromHero();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 font-mono text-xs font-bold border border-amber-400/30 transition-all cursor-pointer"
            >
              {isDetached ? (
                <>
                  <ArrowDownLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>In Hero andocken</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Als Widget abkoppeln</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN COCKPIT BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* LEFT / CENTER: HIGH-RES 3D ROTATING GLOBE */}
          <div className="lg:col-span-7 h-[400px] sm:h-[480px] lg:h-auto bg-gradient-to-b from-[#02050e] via-[#070f27] to-[#030713] relative border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-black/50 px-3 py-1.5 rounded-xl border border-slate-800">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interaktiv: Klicken &amp; Ziehen zum Drehen</span>
              </div>
              <div className="text-[11px] font-mono text-amber-400 bg-black/50 px-3 py-1.5 rounded-xl border border-amber-400/30">
                Erdachse: 23,4° Neigung
              </div>
            </div>

            <div className="w-full flex-1 min-h-[300px]">
              <HeroRotatingGlobe
                mode="modal"
                isDetached={isDetached}
                selectedNodeId={selectedHubId}
                onSelectNode={(node) => {
                  if (node) setSelectedHubId(node.id);
                }}
                className="w-full h-full"
              />
            </div>

            <div className="text-[11px] text-slate-400 font-mono text-center z-10 bg-black/40 py-1.5 px-3 rounded-xl border border-slate-800/80">
              8 Geodätische Subsea-Backbone-Routen aktiv · Zero Dropped Packets
            </div>
          </div>

          {/* RIGHT: FINANCIAL HUBS & TELEMETRY PANEL */}
          <div className="lg:col-span-5 p-5 bg-[#060c20] flex flex-col gap-5 overflow-y-auto">
            {/* Selected Hub Dossier */}
            <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentHub.color }}
                  />
                  <h3 className="text-base font-bold text-white">{currentHub.name}</h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isOpenNow
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {isOpenNow ? 'BÖRSE GEÖFFNET' : 'GESCHLOSSEN'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentHub.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-800">
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-slate-400 block text-[9.5px]">Schnittstelle</span>
                  <span className="text-cyan-300 font-semibold">{currentHub.primaryFeed}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-slate-400 block text-[9.5px]">Latenz-SLA</span>
                  <span className="text-emerald-400 font-semibold">{currentHub.latencyMs} ms E2E</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Erfasste Kern-Assets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentHub.assets.map((asset) => (
                    <span
                      key={asset}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/20"
                    >
                      {asset}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hub Switcher Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Globales Netzwerk der Handelsplätze</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FINANCIAL_NODES.map((node) => {
                  const isSelected = selectedHubId === node.id;
                  const nodeOpen = isExchangeOpen(node);
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedHubId(node.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/15 border-amber-400/80 text-white shadow-lg shadow-amber-400/10'
                          : 'bg-black/30 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: node.color }}
                        />
                        <span
                          className={`text-[8.5px] font-mono font-bold ${
                            nodeOpen ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {nodeOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                      </div>
                      <div className="text-xs font-bold truncate">{node.city}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        {node.exchange}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Geodesic Arcs Overview */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Geodätische Datenströme (Mesh-Topologie)</span>
              </h4>
              <div className="space-y-1.5">
                {ARC_CONNECTIONS.slice(0, 4).map((arc) => (
                  <div
                    key={arc.id}
                    className="flex items-center justify-between text-[11px] font-mono p-1.5 rounded-lg bg-white/5 text-slate-300"
                  >
                    <span>{arc.label}</span>
                    <span className="text-cyan-400 font-bold">{arc.latencyMs}ms</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
