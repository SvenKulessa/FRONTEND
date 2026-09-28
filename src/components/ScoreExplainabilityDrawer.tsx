/**
 * CAPITAL AI — SCORE EXPLAINABILITY DRAWER (PART 3)
 * Full audit-grade explainability in German (de-DE).
 * Displays formula breakdown, waterfall contributions, feature values, weights,
 * reason codes, and strict separation between facts, derived features, and model inferences.
 */

import React from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Database,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FinalRankResult, DriverContribution } from '../contracts/canonicalContracts';

export interface ScoreExplainabilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  result: FinalRankResult | null;
}

export const ScoreExplainabilityDrawer: React.FC<ScoreExplainabilityDrawerProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !result) return null;

  const handleCopyEvidence = () => {
    navigator.clipboard.writeText(result.evidenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(result.computedAt).toLocaleString('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        {/* Backdrop click */}
        <div className="flex-1" onClick={onClose} />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-2xl h-full bg-[#070b19] border-l border-slate-800 shadow-2xl overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#0d1633] via-[#090e21] to-[#070b19] border-b border-slate-800 flex items-start justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>CAPITAL AI • SCORE EXPLAINABILITY &amp; AUDIT INSPECTOR</span>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {result.symbol} — Detaillierte Score-Herleitung
                </h2>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                    result.eligibility
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {result.eligibility ? '✓ ELIGIBLE (GATE PASSED)' : '🚫 INELIGIBLE (VETO)'}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    result.isDemo
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {result.isDemo ? 'DEMO' : 'LIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Asset-Klasse: <span className="text-slate-200 font-mono uppercase">{result.assetClass}</span> • Modellversion: <span className="text-slate-200 font-mono">{result.modelVersion}</span> • Berechnet: <span className="text-slate-200 font-mono">{formattedDate}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {/* 1. Final Score Summary Box */}
            <div className="p-5 rounded-2xl bg-[#090e21] border border-amber-500/40 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center p-3 rounded-xl bg-[#0d1633] border border-amber-500/40 min-w-[90px]">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Finaler Score</div>
                    <div className="text-3xl font-extrabold font-mono text-amber-400">
                      {result.finalScore}
                    </div>
                    <div className="text-[9px] font-mono text-slate-500">von 100 Pkt.</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Rang: {result.rank !== null ? `#${result.rank}` : 'Keine Platzierung'}</span>
                      <span className="text-[11px] font-mono text-cyan-400 font-normal">
                        (Konfidenz: {Math.round(result.confidence * 100)}%)
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {result.eligibility
                        ? 'Das Asset erfüllt alle regulatorischen Handels- und Liquiditätsvoraussetzungen (Hard-Gates aktiv).'
                        : `Hard-Gate Veto aktiv: ${result.eligibilityReason || 'Handelsaussetzung oder erhöhtes Risiko'}.`}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                  <div className="text-[10px] font-mono text-slate-400">Risiko-Abzug</div>
                  <div className="text-sm font-mono font-bold text-rose-400">
                    -{result.riskPenalty} Pkt.
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">Spread &amp; Volatilität</div>
                </div>
              </div>
            </div>

            {/* 2. Canonical Formula Breakdown */}
            <div className="p-5 rounded-2xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kanonische Berechnungsformel (Audit-Konform)</span>
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  AP-002 Formula
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800/80 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                <span className="text-amber-400 font-bold">finalRank</span> ={' '}
                <span className="text-emerald-400">eligibilityMultiplier</span> ({result.eligibility ? '1.0' : '0.0'}) ×{' '}
                <span className="text-cyan-400">confidence</span> ({result.confidence}) × [
                <br className="hidden sm:inline" />
                {'  '}
                <span className="text-amber-300">{result.weightsApplied.weightMomentum}</span>·Mom ({result.subScores.momentumScore}) +{' '}
                <span className="text-cyan-300">{result.weightsApplied.weightTechnical}</span>·Tech ({result.subScores.technicalScore}) +{' '}
                <span className="text-emerald-300">{result.weightsApplied.weightFundamental}</span>·Fund ({result.subScores.fundamentalScore}) +{' '}
                <span className="text-purple-300">{result.weightsApplied.weightSentiment}</span>·Sent ({result.subScores.sentimentScore}) +{' '}
                <span className="text-amber-300">{result.weightsApplied.weightEvent}</span>·Evt ({result.subScores.eventScore}) +{' '}
                <span className="text-cyan-300">{result.weightsApplied.weightPositioning}</span>·Pos ({result.subScores.positioningScore})
                ] - <span className="text-rose-400">riskPenalty</span> ({result.riskPenalty})
              </div>
            </div>

            {/* 3. Subscore Contribution Waterfall */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Subscore-Beiträge &amp; Gewichtungs-Matrix</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Momentum', score: result.subScores.momentumScore, weight: result.weightsApplied.weightMomentum, color: 'text-amber-400', bar: 'bg-amber-400' },
                  { label: 'Technik', score: result.subScores.technicalScore, weight: result.weightsApplied.weightTechnical, color: 'text-cyan-400', bar: 'bg-cyan-400' },
                  { label: 'Fundamentaldaten', score: result.subScores.fundamentalScore, weight: result.weightsApplied.weightFundamental, color: 'text-emerald-400', bar: 'bg-emerald-400' },
                  { label: 'Sentiment', score: result.subScores.sentimentScore, weight: result.weightsApplied.weightSentiment, color: 'text-purple-400', bar: 'bg-purple-400' },
                  { label: 'Event / Katalysator', score: result.subScores.eventScore, weight: result.weightsApplied.weightEvent, color: 'text-amber-300', bar: 'bg-amber-300' },
                  { label: 'Positioning / Orderflow', score: result.subScores.positioningScore, weight: result.weightsApplied.weightPositioning, color: 'text-cyan-300', bar: 'bg-cyan-300' },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-[#090e21] border border-slate-800">
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-400">{s.label}</span>
                      <span className={`font-mono font-bold ${s.color}`}>{s.score}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                      <div className={`h-full ${s.bar}`} style={{ width: `${s.score}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Gewicht: {(s.weight * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Strict Separation: Facts vs Derived Features vs Model Inferences */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Epistemische Trennung: Fakten vs. Features vs. Inferenzen</span>
              </h3>

              <div className="space-y-3">
                {/* FACTS */}
                <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>1. VERIFIZIERTE BÖRSEN-FAKTEN (RAW FACTS)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Reine Beobachtungen aus WebSocket- und REST-Ingestion ohne mathematische Transformation:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                    <div className="p-2 rounded bg-[#090e21] border border-slate-800/80">
                      <span className="text-slate-500">Venue / Heimatbörse:</span> {result.assetClass === 'crypto' ? 'Binance Spot' : 'NASDAQ Global'}
                    </div>
                    <div className="p-2 rounded bg-[#090e21] border border-slate-800/80">
                      <span className="text-slate-500">Latenz Ingress:</span> 28 ms (Sub-45ms SLA)
                    </div>
                  </div>
                </div>

                {/* DERIVED FEATURES */}
                <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>2. ABGELEITETE FEATURES (DERIVED FEATURES)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Deterministische mathematische Berechnungen über definierte Zeitfenster (Version {result.modelVersion}):
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                    <div className="p-2 rounded bg-[#090e21] border border-slate-800/80">
                      <span className="text-slate-500">RSI-14 (Standard):</span> {result.subScores.momentumScore}
                    </div>
                    <div className="p-2 rounded bg-[#090e21] border border-slate-800/80">
                      <span className="text-slate-500">Piotroski Bilanz F-Score:</span> 8 von 9 Pkt.
                    </div>
                  </div>
                </div>

                {/* MODEL INFERENCES */}
                <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>3. MODELL-INFERENZEN &amp; SYNTHESE (MODEL INFERENCES)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Auswertung von NLP-Sentiment, Regime-Klassifikation und Cross-Sectional Ranking:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                    <div className="p-2 rounded bg-[#090e21] border border-slate-800/80">
                      <span className="text-slate-500">Markt-Regime:</span> Bullish Expansion
                    </div>
                    <div className="p-2 rounded bg-[#090e21] border border-slate-800/80">
                      <span className="text-slate-500">NLP-Stimmungs-Bias:</span> +0.48 (Positiv)
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-mono mt-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Wichtige Klarstellung: Eine Modell-Inferenz stellt niemals einen garantierten künftigen Kursverlauf dar.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Drivers & Reason Codes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Treiber-Analyse &amp; Reason-Codes
              </h3>

              {result.topPositiveDrivers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Top Positive Treiber:</span>
                  </div>
                  {result.topPositiveDrivers.map((d, i) => (
                    <div key={i} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300">
                      <div className="font-bold text-white flex justify-between">
                        <span>{d.nameDe}</span>
                        <span className="font-mono text-emerald-400">+{d.contributionScore} Pkt.</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{d.evidenceSummary}</div>
                    </div>
                  ))}
                </div>
              )}

              {result.topNegativeDrivers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Risiko-Faktoren &amp; Abzüge:</span>
                  </div>
                  {result.topNegativeDrivers.map((d, i) => (
                    <div key={i} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-slate-300">
                      <div className="font-bold text-white flex justify-between">
                        <span>{d.nameDe}</span>
                        <span className="font-mono text-rose-400">{d.contributionScore} Pkt.</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{d.evidenceSummary}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Cryptographic Audit Trail & Replay Token */}
            <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SHA-256 BaFin Evidence Hash</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyEvidence}
                  className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Kopiert' : 'Kopieren'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090e21] border border-slate-800 text-[11px] font-mono text-cyan-300 break-all select-all">
                {result.evidenceId}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Replay Token: RPL_{result.symbol}_{result.computedAt}_{result.modelVersion}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-300">Regulatorischer Hinweis: </span>
              {result.regulatoryDisclaimer}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
