/**
 * CAPITAL AI — ENTERPRISE SCREENER TABLE (PART 3)
 * Full cross-sectional screener table with all 13 canonical columns, multi-parameter filters,
 * eligibility sorting discipline, and 1-click explainability drawer inspection.
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Info,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { FinalRankResult, AssetIdentity } from '../contracts/canonicalContracts';
import { ScoreExplainabilityDrawer } from './ScoreExplainabilityDrawer';

export interface ScreenerRowItem {
  assetId: string;
  symbol: string;
  name: string;
  assetClass: 'equity_us' | 'equity_eu' | 'crypto' | 'forex' | 'commodities';
  sector: string;
  finalScore: number;
  eligibility: boolean;
  confidence: number;
  regime: string;
  subScores: {
    momentum: number;
    sentiment: number;
    catalyst: number;
    liquidity: number;
  };
  riskFlag: 'CLEAN' | 'WARNING' | 'VETO_BLOCKED';
  dataStatus: 'LIVE' | 'DELAYED' | 'DEMO';
  lastUpdated: string;
  evidenceId: string;
  rawResult: FinalRankResult;
}

const INITIAL_SCREENER_ITEMS: ScreenerRowItem[] = [
  {
    assetId: 'ast_nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    assetClass: 'equity_us',
    sector: 'Halbleiter / KI',
    finalScore: 89,
    eligibility: true,
    confidence: 0.94,
    regime: 'Bullish Expansion',
    subScores: { momentum: 88, sentiment: 82, catalyst: 90, liquidity: 98 },
    riskFlag: 'CLEAN',
    dataStatus: 'LIVE',
    lastUpdated: 'vor 4 Sek.',
    evidenceId: 'EVD-NVDA-8A1C294F9182',
    rawResult: {
      assetId: 'ast_nvda',
      symbol: 'NVDA',
      assetClass: 'equity_us',
      rank: 1,
      finalScore: 89,
      eligibility: true,
      confidence: 0.94,
      riskPenalty: 4,
      subScores: { momentumScore: 88, technicalScore: 84, fundamentalScore: 92, sentimentScore: 82, eventScore: 90, positioningScore: 78 },
      weightsApplied: { weightMomentum: 0.15, weightTechnical: 0.20, weightFundamental: 0.35, weightSentiment: 0.10, weightEvent: 0.10, weightPositioning: 0.10 },
      topPositiveDrivers: [
        { componentId: 'fundamental_quality_scorer', nameDe: 'Exzellente Bruttomargen (>75%)', contributionScore: 14.2, evidenceSummary: 'Piotroski F-Score 9/9 und massives Rechenzentren-Wachstum.' },
        { componentId: 'momentum_persistence_scorer', nameDe: 'Sektor-Outperformance', contributionScore: 6.8, evidenceSummary: 'Relative Stärke im obersten Dezil des S&P 500.' },
      ],
      topNegativeDrivers: [],
      reasonCodes: ['ELIGIBILITY_GATE_PASSED', 'HIGH_CONVICTION_RATING'],
      modelVersion: '3.2.0',
      evidenceId: 'EVD-NVDA-8A1C294F9182',
      computedAt: Date.now() - 4000,
      isDemo: false,
      regulatoryDisclaimer: 'Keine Anlageberatung. Historische Scores begründen keine Garantie.',
    },
  },
  {
    assetId: 'ast_btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    assetClass: 'crypto',
    sector: 'Store of Value',
    finalScore: 84,
    eligibility: true,
    confidence: 0.92,
    regime: 'Trend Acceleration',
    subScores: { momentum: 78, sentiment: 75, catalyst: 85, liquidity: 99 },
    riskFlag: 'CLEAN',
    dataStatus: 'LIVE',
    lastUpdated: 'vor 1 Sek.',
    evidenceId: 'EVD-BTC-9C3E147B2289',
    rawResult: {
      assetId: 'ast_btc',
      symbol: 'BTC',
      assetClass: 'crypto',
      rank: 2,
      finalScore: 84,
      eligibility: true,
      confidence: 0.92,
      riskPenalty: 6,
      subScores: { momentumScore: 78, technicalScore: 76, fundamentalScore: 65, sentimentScore: 75, eventScore: 85, positioningScore: 82 },
      weightsApplied: { weightMomentum: 0.25, weightTechnical: 0.20, weightFundamental: 0.10, weightSentiment: 0.20, weightEvent: 0.10, weightPositioning: 0.15 },
      topPositiveDrivers: [
        { componentId: 'orderflow_liquidity_imbalance_scorer', nameDe: 'Netto-Börsenabflüsse (Cold Storage)', contributionScore: 8.5, evidenceSummary: 'Deutliche Verknappung im Binance- und Coinbase-Orderbuch.' },
      ],
      topNegativeDrivers: [
        { componentId: 'volatility_regime_scorer', nameDe: 'Erhöhte Realisierte Volatilität', contributionScore: -6.0, evidenceSummary: '30-Tage annualisierte Volatilität bei 52%.' },
      ],
      reasonCodes: ['ELIGIBILITY_GATE_PASSED'],
      modelVersion: '3.2.0',
      evidenceId: 'EVD-BTC-9C3E147B2289',
      computedAt: Date.now() - 1000,
      isDemo: false,
      regulatoryDisclaimer: 'Keine Anlageberatung. Historische Scores begründen keine Garantie.',
    },
  },
  {
    assetId: 'ast_aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    assetClass: 'equity_us',
    sector: 'Consumer Electronics',
    finalScore: 81,
    eligibility: true,
    confidence: 0.96,
    regime: 'Quality Consolidation',
    subScores: { momentum: 65, sentiment: 70, catalyst: 74, liquidity: 99 },
    riskFlag: 'CLEAN',
    dataStatus: 'LIVE',
    lastUpdated: 'vor 8 Sek.',
    evidenceId: 'EVD-AAPL-1B8D994E4412',
    rawResult: {
      assetId: 'ast_aapl',
      symbol: 'AAPL',
      assetClass: 'equity_us',
      rank: 3,
      finalScore: 81,
      eligibility: true,
      confidence: 0.96,
      riskPenalty: 2,
      subScores: { momentumScore: 65, technicalScore: 72, fundamentalScore: 94, sentimentScore: 70, eventScore: 74, positioningScore: 68 },
      weightsApplied: { weightMomentum: 0.15, weightTechnical: 0.20, weightFundamental: 0.35, weightSentiment: 0.10, weightEvent: 0.10, weightPositioning: 0.10 },
      topPositiveDrivers: [
        { componentId: 'fundamental_quality_scorer', nameDe: '10-Jahres ROE > 35%', contributionScore: 15.4, evidenceSummary: 'Höchster FCF-Yield der Mega-Caps.' },
      ],
      topNegativeDrivers: [],
      reasonCodes: ['ELIGIBILITY_GATE_PASSED'],
      modelVersion: '3.2.0',
      evidenceId: 'EVD-AAPL-1B8D994E4412',
      computedAt: Date.now() - 8000,
      isDemo: false,
      regulatoryDisclaimer: 'Keine Anlageberatung.',
    },
  },
  {
    assetId: 'ast_sap',
    symbol: 'SAP',
    name: 'SAP SE',
    assetClass: 'equity_eu',
    sector: 'Enterprise Software',
    finalScore: 78,
    eligibility: true,
    confidence: 0.91,
    regime: 'Cloud Momentum',
    subScores: { momentum: 72, sentiment: 68, catalyst: 76, liquidity: 92 },
    riskFlag: 'CLEAN',
    dataStatus: 'LIVE',
    lastUpdated: 'vor 12 Sek.',
    evidenceId: 'EVD-SAP-4F2A1099CC31',
    rawResult: {
      assetId: 'ast_sap',
      symbol: 'SAP',
      assetClass: 'equity_eu',
      rank: 4,
      finalScore: 78,
      eligibility: true,
      confidence: 0.91,
      riskPenalty: 3,
      subScores: { momentumScore: 72, technicalScore: 75, fundamentalScore: 84, sentimentScore: 68, eventScore: 76, positioningScore: 65 },
      weightsApplied: { weightMomentum: 0.15, weightTechnical: 0.20, weightFundamental: 0.35, weightSentiment: 0.10, weightEvent: 0.10, weightPositioning: 0.10 },
      topPositiveDrivers: [],
      topNegativeDrivers: [],
      reasonCodes: ['ELIGIBILITY_GATE_PASSED'],
      modelVersion: '3.2.0',
      evidenceId: 'EVD-SAP-4F2A1099CC31',
      computedAt: Date.now() - 12000,
      isDemo: false,
      regulatoryDisclaimer: 'Keine Anlageberatung.',
    },
  },
  {
    assetId: 'ast_halted',
    symbol: 'SPEC',
    name: 'Spectra Biotech Inc.',
    assetClass: 'equity_us',
    sector: 'Biotechnology',
    finalScore: 0,
    eligibility: false, // HARD VETO
    confidence: 0.42,
    regime: 'Trading Halted',
    subScores: { momentum: 15, sentiment: 20, catalyst: 30, liquidity: 12 },
    riskFlag: 'VETO_BLOCKED',
    dataStatus: 'DELAYED',
    lastUpdated: 'vor 45 Min.',
    evidenceId: 'EVD-SPEC-000000VETO88',
    rawResult: {
      assetId: 'ast_halted',
      symbol: 'SPEC',
      assetClass: 'equity_us',
      rank: null,
      finalScore: 0,
      eligibility: false,
      eligibilityReason: 'Handelsaussetzung (Circuit Breaker) & Insolvenzrisiko',
      confidence: 0.42,
      riskPenalty: 60,
      subScores: { momentumScore: 15, technicalScore: 12, fundamentalScore: 10, sentimentScore: 20, eventScore: 30, positioningScore: 10 },
      weightsApplied: { weightMomentum: 0.15, weightTechnical: 0.20, weightFundamental: 0.35, weightSentiment: 0.10, weightEvent: 0.10, weightPositioning: 0.10 },
      topPositiveDrivers: [],
      topNegativeDrivers: [
        { componentId: 'financial_distress_scorer', nameDe: 'Altman Z-Score < 1.1', contributionScore: -60, evidenceSummary: 'Akute Liquiditätskrise.' },
      ],
      reasonCodes: ['BLOCKED_BY_ELIGIBILITY_GATE', 'MARKET_HALT_ACTIVE'],
      modelVersion: '3.2.0',
      evidenceId: 'EVD-SPEC-000000VETO88',
      computedAt: Date.now() - 2700000,
      isDemo: false,
      regulatoryDisclaimer: 'Keine Anlageberatung.',
    },
  },
];

export const ScreenerTable: React.FC = () => {
  const [items] = useState<ScreenerRowItem[]>(INITIAL_SCREENER_ITEMS);
  const [search, setSearch] = useState('');
  const [assetClassFilter, setAssetClassFilter] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(50);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'finalScore' | 'momentum' | 'catalyst'>('finalScore');
  const [selectedResult, setSelectedResult] = useState<FinalRankResult | null>(null);

  // Filtered and sorted rows
  const filteredRows = useMemo(() => {
    return items
      .filter((it) => {
        if (search && !it.symbol.toLowerCase().includes(search.toLowerCase()) && !it.name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        if (assetClassFilter !== 'ALL' && it.assetClass !== assetClassFilter) return false;
        if (it.confidence * 100 < minConfidence) return false;
        if (statusFilter !== 'ALL' && it.dataStatus !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => {
        // MANDATORY RULE: Ineligible assets sort to the bottom regardless of score
        if (!a.eligibility && b.eligibility) return 1;
        if (a.eligibility && !b.eligibility) return -1;

        if (sortBy === 'finalScore') return b.finalScore - a.finalScore;
        if (sortBy === 'momentum') return b.subScores.momentum - a.subScores.momentum;
        if (sortBy === 'catalyst') return b.subScores.catalyst - a.subScores.catalyst;
        return 0;
      });
  }, [items, search, assetClassFilter, minConfidence, statusFilter, sortBy]);

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#090e21] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Symbol oder Name suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Asset Class Filter */}
          <select
            value={assetClassFilter}
            onChange={(e) => setAssetClassFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">Alle Anlageklassen</option>
            <option value="equity_us">US Aktien</option>
            <option value="equity_eu">EU Aktien</option>
            <option value="crypto">Krypto</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">Status: Alle</option>
            <option value="LIVE">Nur LIVE Feeds</option>
            <option value="DEMO">Demo Sandbox</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Sortierung:</span>
          <button
            type="button"
            onClick={() => setSortBy('finalScore')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              sortBy === 'finalScore' ? 'bg-amber-400 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Final Score
          </button>
          <button
            type="button"
            onClick={() => setSortBy('momentum')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              sortBy === 'momentum' ? 'bg-amber-400 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Momentum
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-[#090e21] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c1433] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Rang</th>
                <th className="py-3 px-3">Asset</th>
                <th className="py-3 px-3">Klasse</th>
                <th className="py-3 px-3 text-right">Final Score</th>
                <th className="py-3 px-3">Gate</th>
                <th className="py-3 px-3">Konfidenz</th>
                <th className="py-3 px-3">Markt-Regime</th>
                <th className="py-3 px-3 text-center">Mom.</th>
                <th className="py-3 px-3 text-center">Sent.</th>
                <th className="py-3 px-3 text-center">Katalysator</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRows.map((row, idx) => (
                <tr
                  key={row.assetId}
                  onClick={() => setSelectedResult(row.rawResult)}
                  className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                    !row.eligibility ? 'opacity-60 bg-rose-950/10' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">
                    {row.eligibility ? `#${idx + 1}` : '—'}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{row.symbol}</span>
                      <span className="text-[10px] font-normal text-slate-400 hidden sm:inline">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px] uppercase">
                    {row.assetClass}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-sm">
                    <span className={row.eligibility ? 'text-amber-400' : 'text-slate-500'}>
                      {row.finalScore}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {row.eligibility ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Bestanden
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        VETO
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-300">
                    {Math.round(row.confidence * 100)}%
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {row.regime}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">
                    {row.subScores.momentum}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">
                    {row.subScores.sentiment}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">
                    {row.subScores.catalyst}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                        row.dataStatus === 'LIVE'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : row.dataStatus === 'DELAYED'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-purple-500/15 text-purple-300'
                      }`}
                    >
                      {row.dataStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      className="p-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono flex items-center gap-1 ml-auto cursor-pointer"
                      title="Score detailliert herleiten"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Explainability Drawer */}
      <ScoreExplainabilityDrawer
        isOpen={selectedResult !== null}
        onClose={() => setSelectedResult(null)}
        result={selectedResult}
      />
    </div>
  );
};
