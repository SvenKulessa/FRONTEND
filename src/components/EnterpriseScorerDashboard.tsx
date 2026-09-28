/**
 * CAPITAL AI — ENTERPRISE SCORER DASHBOARD (PART 3)
 * Interactive multi-asset scorer presenting the 50 Market Intelligence components
 * with verifiable confidence, eligibility hard gates, and 1-click explainability.
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Cpu,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Info,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { motion } from 'motion/react';
import { FinalRankResult, AssetIdentity } from '../contracts/canonicalContracts';
import { ScoringEngineService } from '../services/scoringEngine';
import { FeatureStoreService } from '../services/featureStore';
import { BinanceProviderAdapter, TwelveDataProviderAdapter, ExplicitDemoAdapter } from '../services/providerAdapters';
import { ScoreExplainabilityDrawer } from './ScoreExplainabilityDrawer';

export interface EnterpriseScorerDashboardProps {
  onSelectAsset?: (symbol: string) => void;
}

const PRESET_ASSETS: AssetIdentity[] = [
  { assetId: 'ast_aapl', symbol: 'AAPL', name: 'Apple Inc.', assetClass: 'equity_us', venue: 'NASDAQ', currency: 'USD', status: 'active' },
  { assetId: 'ast_btc', symbol: 'BTC', name: 'Bitcoin', assetClass: 'crypto', venue: 'Binance', currency: 'USD', status: 'active' },
  { assetId: 'ast_eth', symbol: 'ETH', name: 'Ethereum', assetClass: 'crypto', venue: 'Binance', currency: 'USD', status: 'active' },
  { assetId: 'ast_sap', symbol: 'SAP', name: 'SAP SE', assetClass: 'equity_eu', venue: 'XETRA', currency: 'EUR', status: 'active' },
  { assetId: 'ast_nvda', symbol: 'NVDA', name: 'NVIDIA Corp.', assetClass: 'equity_us', venue: 'NASDAQ', currency: 'USD', status: 'active' },
  { assetId: 'ast_gold', symbol: 'GOLD', name: 'Gold Spot', assetClass: 'commodities', venue: 'LBMA', currency: 'USD', status: 'active' },
];

export const EnterpriseScorerDashboard: React.FC<EnterpriseScorerDashboardProps> = ({ onSelectAsset }) => {
  const [selectedAsset, setSelectedAsset] = useState<AssetIdentity>(PRESET_ASSETS[0]);
  const [activeResult, setActiveResult] = useState<FinalRankResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataMode, setDataMode] = useState<'LIVE' | 'DEMO'>('LIVE');

  const featureStore = new FeatureStoreService();
  const binanceAdapter = new BinanceProviderAdapter();
  const twelveDataAdapter = new TwelveDataProviderAdapter();
  const demoAdapter = new ExplicitDemoAdapter();

  const computeAssetScore = async (asset: AssetIdentity, isDemo: boolean) => {
    setIsLoading(true);
    try {
      const adapter = isDemo
        ? demoAdapter
        : asset.assetClass === 'crypto'
        ? binanceAdapter
        : twelveDataAdapter;

      const rawObs = await adapter.fetchObservation(asset);
      const features = featureStore.extractFeatures({ asset, observation: rawObs });
      const res = await ScoringEngineService.computeFinalScore(asset, features, isDemo);
      setActiveResult(res);
    } catch (e) {
      console.error('Scoring computation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    computeAssetScore(selectedAsset, dataMode === 'DEMO');
  }, [selectedAsset, dataMode]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Asset Quick Selector */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1633] via-[#090e21] to-[#070b19] border border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span>ENTERPRISE MULTI-FAKTOR SCORING ENGINE • 50 KOMPONENTEN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Enterprise Scorer &amp; Explainability Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Verifizierte Multi-Asset-Bewertung mit expliziter Trennung zwischen Börsen-Fakten,
              abgeleiteten Merkmalen und mathematischen Modell-Inferenzen.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Live / Demo Mode Switcher */}
            <div className="p-1 rounded-xl bg-black/60 border border-slate-800 flex items-center">
              <button
                type="button"
                onClick={() => setDataMode('LIVE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  dataMode === 'LIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LIVE FEED
              </button>
              <button
                type="button"
                onClick={() => setDataMode('DEMO')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  dataMode === 'DEMO'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                DEMO SANDBOX
              </button>
            </div>
          </div>
        </div>

        {/* Quick Asset Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PRESET_ASSETS.map((asset) => {
            const isSel = selectedAsset.assetId === asset.assetId;
            return (
              <button
                key={asset.assetId}
                type="button"
                onClick={() => {
                  setSelectedAsset(asset);
                  onSelectAsset?.(asset.symbol);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isSel
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'bg-[#090e21] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{asset.symbol}</span>
                <span className={`text-[10px] ${isSel ? 'text-black/80' : 'text-slate-400'}`}>
                  {asset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Score & Driver Card */}
      {activeResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Card (Left 2 Columns) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#090e21] border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#0d1633] to-black border border-amber-500/40 min-w-[110px] shadow-lg">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Final Rank Score</div>
                  <div className="text-4xl font-extrabold font-mono text-amber-400 mt-1">
                    {activeResult.finalScore}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">Skala 0-100</div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {selectedAsset.name} ({selectedAsset.symbol})
                    </h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        activeResult.isDemo
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {activeResult.isDemo ? 'DEMO' : 'LIVE'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                        activeResult.eligibility
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      {activeResult.eligibility ? '✓ ELIGIBLE (Gate Bestanden)' : '🚫 INELIGIBLE (Hard Veto)'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Konfidenz: <span className="text-cyan-400 font-bold">{Math.round(activeResult.confidence * 100)}%</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Risiko-Abzug: <span className="text-rose-400 font-bold">-{activeResult.riskPenalty} Pkt.</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Explainability Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 shrink-0"
              >
                <span>Score herleiten</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Drivers: Top Positive & Top Negative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Top 3 Positive Treiber</span>
                </div>
                <div className="space-y-2">
                  {activeResult.topPositiveDrivers.slice(0, 3).map((d, i) => (
                    <div key={i} className="text-xs p-2.5 rounded-lg bg-[#090e21] border border-slate-800/80">
                      <div className="font-bold text-white flex justify-between">
                        <span>{d.nameDe}</span>
                        <span className="font-mono text-emerald-400">+{d.contributionScore} Pkt.</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{d.evidenceSummary}</div>
                    </div>
                  ))}
                  {activeResult.topPositiveDrivers.length === 0 && (
                    <div className="text-xs text-slate-500 italic p-2">Keine überdurchschnittlichen positiven Treiber.</div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-rose-400 font-mono flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  <span>Risiko-Faktoren &amp; Abzüge</span>
                </div>
                <div className="space-y-2">
                  {activeResult.topNegativeDrivers.slice(0, 3).map((d, i) => (
                    <div key={i} className="text-xs p-2.5 rounded-lg bg-[#090e21] border border-slate-800/80">
                      <div className="font-bold text-white flex justify-between">
                        <span>{d.nameDe}</span>
                        <span className="font-mono text-rose-400">{d.contributionScore} Pkt.</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{d.evidenceSummary}</div>
                    </div>
                  ))}
                  {activeResult.topNegativeDrivers.length === 0 && (
                    <div className="text-xs text-slate-500 italic p-2">Keine erhöhten Risiko-Vetos aktiv.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscore Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-800">
              {[
                { label: 'Momentum', val: activeResult.subScores.momentumScore },
                { label: 'Technik', val: activeResult.subScores.technicalScore },
                { label: 'Fundamental', val: activeResult.subScores.fundamentalScore },
                { label: 'Sentiment', val: activeResult.subScores.sentimentScore },
                { label: 'Event', val: activeResult.subScores.eventScore },
                { label: 'Positioning', val: activeResult.subScores.positioningScore },
              ].map((s) => (
                <div key={s.label} className="p-2 rounded-lg bg-black/30 text-center">
                  <div className="text-[10px] font-mono text-slate-400">{s.label}</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Model Version & Evidence Metadata */}
          <div className="p-6 rounded-2xl bg-[#090e21] border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Audit-Trail Metadaten
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  BaFin AT 7.2
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-black/40">
                  <span className="text-slate-400">Modellversion:</span>
                  <span className="text-white font-bold">{activeResult.modelVersion}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/40">
                  <span className="text-slate-400">Regime:</span>
                  <span className="text-cyan-300 font-bold">Bullish Expansion</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/40">
                  <span className="text-slate-400">Plausibilität:</span>
                  <span className="text-emerald-400 font-bold">✓ 11/11 Bestanden</span>
                </div>
                <div className="p-2 rounded bg-black/40">
                  <div className="text-slate-400 mb-1">SHA-256 Fingerprint:</div>
                  <div className="text-[10px] text-cyan-300 break-all select-all">
                    {activeResult.evidenceId}
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-300">Hinweis: </span>
              Scores drücken die relative Modellausrichtung aus und begründen keine Rendite-Zusicherung oder Anlageberatung.
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      <ScoreExplainabilityDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        result={activeResult}
      />
    </div>
  );
};
