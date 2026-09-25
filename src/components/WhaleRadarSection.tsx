/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: SMART MONEY FLOW & ON-CHAIN WHALE RADAR SEKTION]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Concentric Scanner Radar Animation mit Live-Pulse
 *    - Institutional KPI-Leiste (SMFI, Net Inflow, Dark Pool Dominance, Telegram Status)
 *    - Dynamische Wal-Transaktionskarten mit 1-Click Telegram Push Button
 * 2. SCORING-LOGIK        : 
 *    - Impact Score (1-100) basierend auf Transaktionsvolumen & Wallet-Historie
 *    - Aggregierter Smart Money Flow Index (SMFI)
 *    - Bias Klassifikation: STRONG_BULLISH, BULLISH, NEUTRAL, BEARISH
 * 3. DATENANBINDUNG       : 
 *    - `usePriceAlerts()`: `whaleTransactions`, `pushWhaleToTelegram()`, `openWhaleRadar()`
 * 4. DATENQUELLEN / FEEDS : 
 *    - Mempool On-Chain Nodes (BTC/ETH/SOL)
 *    - ATS Dark Pool Feeds (Sigma X)
 *    - Hintergrund-Simulator für periodische Transaktionen
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Radio,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Maximize2,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';
import { usePriceAlerts } from '../context/PriceAlertsContext';
import { SMART_MONEY_METRICS } from '../data/whaleRadarData';
import { WhaleTransaction, MainCategory } from '../types';

interface WhaleRadarSectionProps {
  onOpenTerminal?: () => void;
  onOpenTelegram?: () => void;
  onSelectAsset?: (symbol: string) => void;
}

export const WhaleRadarSection: React.FC<WhaleRadarSectionProps> = ({
  onOpenTerminal,
  onOpenTelegram,
  onSelectAsset,
}) => {
  const {
    whaleTransactions,
    openWhaleRadar,
    pushWhaleToTelegram,
    preferences,
    testTelegramPush,
  } = usePriceAlerts();

  const [minVolumeFilter, setMinVolumeFilter] = useState<number>(5); // in Millions USD
  const [categoryFilter, setCategoryFilter] = useState<'ALLE' | MainCategory>('ALLE');
  const [pushStatusMap, setPushStatusMap] = useState<Record<string, 'sending' | 'sent'>>({});

  // Filtered transactions
  const filteredTxs = whaleTransactions
    .filter((tx) => {
      const volMln = tx.amountUsd / 1_000_000;
      if (volMln < minVolumeFilter) return false;
      if (categoryFilter !== 'ALLE' && tx.category !== categoryFilter) return false;
      return true;
    })
    .slice(0, 4);

  // Aggregated Smart Money Metrics
  const avgSmartScore = Math.round(
    SMART_MONEY_METRICS.reduce((acc, m) => acc + m.score, 0) / SMART_MONEY_METRICS.length
  );
  const totalNetInflowMln = Math.round(
    SMART_MONEY_METRICS.reduce((acc, m) => acc + m.netInflow24hUsd, 0) / 1_000_000
  );

  const handlePushClick = async (e: React.MouseEvent, tx: WhaleTransaction) => {
    e.stopPropagation();
    setPushStatusMap((prev) => ({ ...prev, [tx.id]: 'sending' }));
    await pushWhaleToTelegram(tx.id);
    setPushStatusMap((prev) => ({ ...prev, [tx.id]: 'sent' }));
    setTimeout(() => {
      setPushStatusMap((prev) => {
        const next = { ...prev };
        delete next[tx.id];
        return next;
      });
    }, 3000);
  };

  return (
    <section id="whale-radar-section" className="px-4 sm:px-6 py-6 w-full select-none">
      {/* Container with institutional terminal styling */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#060c22] via-[#040818] to-[#02050e] border border-cyan-500/30 p-4 sm:p-5 shadow-[0_12px_45px_rgba(6,182,212,0.1)] overflow-hidden">
        {/* Subtle decorative radar grid background lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="w-full h-full bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            {/* Pulsing Radar Icon */}
            <div className="relative w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#060c22] animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  On-Chain &amp; Institutional Radar
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE SCAN
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>Smart Money Flow &amp; Whale Radar</span>
              </h3>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenTelegram?.() || openWhaleRadar()}
              className="px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/35 text-blue-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(59,130,246,0.15)]"
              title="Telegram Push konfigurieren"
            >
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>Telegram Push</span>
              {preferences.telegram?.connected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenTerminal?.() || openWhaleRadar()}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Whale Terminal</span>
            </button>
          </div>
        </div>

        {/* Top Quantitative KPI Overview Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="p-3 rounded-2xl bg-[#030716] border border-slate-800/90 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              Smart Money Flow Index
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black font-mono text-cyan-300">{avgSmartScore}</span>
              <span className="text-[10px] text-slate-400 font-mono">/100</span>
              <span className="text-[10px] font-bold text-emerald-400 ml-auto">Akkumulation</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${avgSmartScore}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#030716] border border-slate-800/90 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              24h Net Institutional Flow
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black font-mono text-emerald-400">
                +{totalNetInflowMln.toLocaleString('de-DE')}M $
              </span>
            </div>
            <span className="text-[10px] text-emerald-400/80 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Netto-Zufluss in Cold Vaults</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#030716] border border-slate-800/90 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              Dark Pool Dominance
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black font-mono text-amber-300">68,4 %</span>
              <span className="text-[10px] text-slate-400">ATS / OTC</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">Außerbörsliche Großblöcke</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#030716] border border-slate-800/90 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              Telegram Auto-Push
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`text-sm font-bold font-mono ${
                  preferences.telegram?.connected ? 'text-emerald-400' : 'text-blue-300'
                }`}
              >
                {preferences.telegram?.connected ? 'Aktiviert' : 'Bereit'}
              </span>
              <span className="text-[10px] text-slate-400">
                (&gt; {preferences.telegram?.minWhaleVolumeMln || 5}M $)
              </span>
            </div>
            <button
              type="button"
              onClick={async () => {
                await testTelegramPush();
              }}
              className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer text-left mt-1 underline underline-offset-2"
            >
              Test-Signal senden →
            </button>
          </div>
        </div>

        {/* Interactive Filter Pills */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Min. Volumen:</span>
            </span>
            {[
              { label: 'Alle ($1M+)', val: 1 },
              { label: '$5M+', val: 5 },
              { label: '$25M+', val: 25 },
              { label: '$100M+', val: 100 },
            ].map((f) => (
              <button
                key={f.val}
                type="button"
                onClick={() => setMinVolumeFilter(f.val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  minVolumeFilter === f.val
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {(['ALLE', 'KRYPTO', 'AKTIEN', 'ROHSTOFFE'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-white/10 text-cyan-300 font-bold border border-cyan-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'ALLE' ? 'Alle Klassen' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Live Whale Feed Cards */}
        <div className="relative z-10 space-y-2">
          {filteredTxs.map((tx) => {
            const isOutflow = tx.actionType === 'EXCHANGE_OUTFLOW';
            const isInflow = tx.actionType === 'EXCHANGE_INFLOW';
            const isDarkPool = tx.actionType === 'DARK_POOL_BUY' || tx.actionType === 'DARK_POOL_SELL';
            const isMint = tx.actionType === 'DEFI_MINT_BURN';

            const formattedUsd = (tx.amountUsd / 1_000_000).toFixed(1) + ' Mio. $';
            const isPushing = pushStatusMap[tx.id] === 'sending';
            const isPushed = pushStatusMap[tx.id] === 'sent' || tx.telegramPushed;

            return (
              <div
                key={tx.id}
                onClick={() => onSelectAsset?.(tx.assetSymbol) || openWhaleRadar(tx.assetSymbol)}
                className="group p-3 sm:p-3.5 rounded-2xl bg-[#030716]/90 hover:bg-[#07112d] border border-slate-800/90 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  {/* Action Icon Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isOutflow
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(68,222,136,0.15)]'
                        : isInflow
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                        : isDarkPool
                        ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                        : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    }`}
                  >
                    {isOutflow ? (
                      <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                    ) : isInflow ? (
                      <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
                    ) : isDarkPool ? (
                      <Layers className="w-5 h-5" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-white">{tx.assetSymbol}</span>
                      <span className="text-xs font-mono font-bold text-cyan-300">{formattedUsd}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({tx.amountNative.toLocaleString('de-DE')} {tx.assetSymbol})
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">· {tx.timestamp}</span>
                    </div>

                    <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-200">{tx.actionLabel}:</span>
                      <span className="text-slate-400 font-mono text-[11px] truncate max-w-[140px] sm:max-w-[200px]">
                        {tx.fromWallet.label}
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="text-cyan-400 font-mono text-[11px] truncate max-w-[140px] sm:max-w-[200px]">
                        {tx.toWallet.label}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                      {tx.aiInterpretation}
                    </p>
                  </div>
                </div>

                {/* Right Side: Smart Score & Telegram Push Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Impact Score</div>
                    <div className="text-sm font-black font-mono text-white flex items-center sm:justify-end gap-1">
                      <span className={tx.impactScore >= 90 ? 'text-emerald-400' : 'text-cyan-300'}>
                        {tx.impactScore}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">/100</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handlePushClick(e, tx)}
                    disabled={isPushing}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                      isPushed
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(68,222,136,0.2)]'
                        : 'bg-blue-500/10 hover:bg-blue-500/25 border-blue-400/30 text-blue-300 hover:text-white'
                    }`}
                    title="Diesen Wal-Alarm via Telegram Push senden"
                  >
                    <Send className={`w-3 h-3 ${isPushing ? 'animate-spin' : ''}`} />
                    <span>{isPushing ? 'Sendet...' : isPushed ? 'Gepusht ✓' : 'Push'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Footer: Link to full terminal */}
        <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Mempool &amp; Dark Pool Block Scanners aktiv • Sub-45ms Latenz</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenTerminal?.() || openWhaleRadar()}
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors text-xs"
          >
            <span>Alle 142 On-Chain Wal-Transaktionen im Terminal ansehen</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
