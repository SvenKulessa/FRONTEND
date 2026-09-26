/**
 * CAPITAL AI — FOUNDER SUITE & TOKENOMICS STRATEGY HUB (/founder)
 * Unifies the $CPT Tokenomics Strategy with subordinate access to
 * the Pipeline Builder (Alternate PC-Style) and Provider Fleet Health Monitor (WP-004).
 */

import React, { useState } from 'react';
import {
  Coins,
  Shield,
  Zap,
  TrendingUp,
  Flame,
  Lock,
  Vote,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  PieChart,
  Layers,
  ChevronRight,
  FileText,
  Sliders,
  Share2,
  ArrowLeft,
  ExternalLink,
  Cpu,
  BarChart3,
  Clock,
  Radio,
  FileDown,
  SlidersHorizontal,
  Database,
  Building2,
  Activity,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { jsPDF } from 'jspdf';
import { trackEvent } from '../utils/analytics';
import { PipelineBuilder } from './PipelineBuilder';
import { ProviderStatusDashboard } from './ProviderStatusDashboard';

export interface FounderPageProps {
  onBackToHome?: () => void;
  onNavigateLogin?: () => void;
  onNavigateLegal?: (path: string) => void;
  initialTab?: 'strategy' | 'builder' | 'providers' | 'staking' | 'burn';
}

type FounderTabKey = 'strategy' | 'builder' | 'providers' | 'staking' | 'burn';

export const FounderPage: React.FC<FounderPageProps> = ({
  onBackToHome,
  onNavigateLogin,
  onNavigateLegal,
  initialTab = 'strategy',
}) => {
  const [activeTab, setActiveTab] = useState<FounderTabKey>(initialTab);
  const [stakedAmount, setStakedAmount] = useState<number>(5000);
  const [annualRevenue, setAnnualRevenue] = useState<number>(5000000); // 5 Mio €
  const [copiedContract, setCopiedContract] = useState(false);

  // Staking Tier Calculation
  const getTierInfo = (amount: number) => {
    if (amount >= 25000) {
      return {
        name: 'Tier III: Institutional Whale',
        color: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
        badgeColor: 'bg-amber-400 text-black',
        latency: 'Sub-20ms Direct Gateway',
        apiCalls: 'Unbegrenzt (Raw L3)',
        discount: '50% Rabatt auf B2B APIs',
        governanceWeight: '3.0x Stimmgewicht',
      };
    }
    if (amount >= 5000) {
      return {
        name: 'Tier II: Pro Trader',
        color: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10',
        badgeColor: 'bg-cyan-400 text-black',
        latency: 'Sub-45ms WebSocket Feed',
        apiCalls: '100.000 Requests/Tag',
        discount: '25% Rabatt',
        governanceWeight: '1.5x Stimmgewicht',
      };
    }
    if (amount >= 1000) {
      return {
        name: 'Tier I: Active Investor',
        color: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
        badgeColor: 'bg-emerald-400 text-black',
        latency: 'Sub-80ms Ingest Stream',
        apiCalls: '25.000 Requests/Tag',
        discount: '10% Rabatt',
        governanceWeight: '1.0x Stimmgewicht',
      };
    }
    return {
      name: 'Community Tier (No Staking)',
      color: 'text-slate-400 border-slate-700 bg-slate-800/40',
      badgeColor: 'bg-slate-700 text-slate-300',
      latency: 'Standard REST Polling (15 Min Delayed)',
      apiCalls: '1.000 Requests/Tag',
      discount: '0%',
      governanceWeight: 'Kein Stimmrecht',
    };
  };

  const currentTier = getTierInfo(stakedAmount);
  const annualBurnAmountEur = annualRevenue * 0.25;
  const estimatedTokensBurned = Math.round(annualBurnAmountEur / 1.25);

  const handleCopyContract = () => {
    navigator.clipboard.writeText('0x71C...CPT...49F2');
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="w-full text-slate-100 min-h-screen py-4 sm:py-6 px-2 sm:px-6 relative">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER CONTRACT (Breadcrumb + Actions)                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
            <span>Capital-AI Enterprise</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-amber-400 font-semibold">Founder Suite &amp; Strategie</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-amber-400 shrink-0" />
              <span>Founder Suite: $CPT Token-Strategie &amp; Datenpipeline</span>
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
              FOUNDER
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Zurück zur Übersicht</span>
            </button>
          )}

          {onNavigateLogin && (
            <button
              type="button"
              onClick={onNavigateLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 hover:text-white text-xs font-medium border border-amber-500/20 transition-colors cursor-pointer"
            >
              <span>Terminal Login</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUBORDINATE FOUNDER NAVIGATION TABS                                    */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090e21] border border-slate-800/90 mb-6 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('strategy')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'strategy'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>1. $CPT Token-Strategie</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'builder'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>2. Pipeline Builder (PC-Konfigurator)</span>
          <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-300 font-bold">
            Alternate-Stil
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('providers')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'providers'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>3. Provider Fleet Monitor (WP-004)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('staking')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'staking'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>4. Staking-Tiers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('burn')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'burn'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>5. 25% Buyback &amp; Burn</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: $CPT TOKEN-STRATEGIE (DIE GRÜNDER- & ÖKONOMIE-VISION)           */}
      {/* ========================================================================= */}
      {activeTab === 'strategy' && (
        <div className="space-y-6">
          {/* Executive Strategy Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-cyan-500/15 border border-amber-400/30 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/40 mb-2">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Capital-AI Token ($CPT) Ökosystem-Strategie</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Das dezentrale Fundament für institutionelle Marktdaten
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Der $CPT Token verbindet hochpräzise Sub-45ms Latenzen, BaFin-konforme Datenspeicherung und ein deflationäres 
                  Schwungrad: <strong>25% aller SaaS- &amp; B2B-API-Umsätze</strong> fließen permanent in den Rückkauf und die Vernichtung von Token.
                </p>
              </div>

              <div className="flex flex-col items-end shrink-0 font-mono">
                <span className="text-xs text-slate-400">Hard Cap</span>
                <span className="text-xl font-bold text-amber-400">100.000.000 $CPT</span>
                <span className="text-[11px] text-emerald-400">Keine Nachinflation</span>
              </div>
            </div>
          </div>

          {/* 4 Pillars of the Token Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Sub-45ms Gateway Access</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Staker ab 5.000 $CPT erhalten exklusiven Zugriff auf Colocated WebSocket Direct Streams und L2-Orderbuchdaten.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">25% Buyback &amp; Burn</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Realer Cashflow-Burn: 25% aller Enterprise B2B-API-Lizenzen und Pro-Abonnements kaufen Token am offenen Markt zurück.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Dezentrale Kuration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Staker auditieren und validieren neue Data-Provider und Screener-Algorithmen (z. B. Buffett Value Check) auf BaFin-Konformität.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Revenue Assurance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Garantierte Budget-Sicherheit: Selbst im größten Ausbau bleibt die monatliche Ingestion unter 40,00 € (AP-006).
              </p>
            </div>
          </div>

          {/* Subordinate Tools Callout Grid */}
          <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Untergeordnete Founder-Werkzeuge
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab('builder')}
                className="p-4 rounded-xl bg-black/40 border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      Pipeline Builder (Alternate PC-Konfigurator)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Eigene Screener &amp; Datasets schrittweise konfigurieren (Buffett Check, BaFin MaRisk)
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>

              <div
                onClick={() => setActiveTab('providers')}
                className="p-4 rounded-xl bg-black/40 border border-slate-800 hover:border-emerald-400/50 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Provider Fleet &amp; Health Monitor
                    </h4>
                    <p className="text-xs text-slate-400">
                      Latenzen, Circuit-Breaker und 40€ Monatsbudget auditieren (WP-004)
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 2: PIPELINE BUILDER (SUBORDINATED ALTERNATE PC-KONFIGURATOR)       */}
      {/* ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="space-y-4">
          <PipelineBuilder
            onBackToHome={() => setActiveTab('strategy')}
            onNavigateLogin={onNavigateLogin}
            onNavigateTokenomics={() => setActiveTab('strategy')}
            onNavigateFounder={() => setActiveTab('strategy')}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 3: PROVIDER FLEET MONITOR (SUBORDINATED WP-004)                    */}
      {/* ========================================================================= */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <ProviderStatusDashboard
            onBackToHome={() => setActiveTab('strategy')}
            onNavigateArchitecture={() => setActiveTab('strategy')}
            onNavigateLogin={onNavigateLogin}
            isStandaloneView={false}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 4: STAKING TIERS RECHNER                                           */}
      {/* ========================================================================= */}
      {activeTab === 'staking' && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#090e21] border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>Interaktiver $CPT Staking-Tier Rechner</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Schalten Sie ultra-niedrige Sub-20ms Gateways und unbegrenzte Raw-L3 Marktdaten durch das Halten von $CPT frei.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">Gestakter $CPT Betrag:</span>
              <span className="text-base font-bold text-amber-400">{stakedAmount.toLocaleString()} $CPT</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={stakedAmount}
              onChange={(e) => setStakedAmount(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className={`p-4 rounded-xl border ${currentTier.color}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">{currentTier.name}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${currentTier.badgeColor}`}>
                AKTIV
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <div className="text-slate-400 text-[10px]">Latenz-Garantie</div>
                <div className="text-white font-bold">{currentTier.latency}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">API Kontingent</div>
                <div className="text-white font-bold">{currentTier.apiCalls}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">API Rabatt</div>
                <div className="text-emerald-400 font-bold">{currentTier.discount}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Stimmgewicht</div>
                <div className="text-amber-400 font-bold">{currentTier.governanceWeight}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB 5: 25% BUYBACK & BURN SIMULATOR                                    */}
      {/* ========================================================================= */}
      {activeTab === 'burn' && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#090e21] border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" />
              <span>25% Revenue Buyback &amp; Burn Simulator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Simulieren Sie das deflationäre Angebot: 25% aller SaaS- &amp; B2B-API-Umsätze fließen in den dauerhaften Token-Burn.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">Jährlicher Plattform-Umsatz:</span>
              <span className="text-base font-bold text-cyan-400">
                {(annualRevenue / 1000000).toFixed(1)} Mio. € / Jahr
              </span>
            </div>
            <input
              type="range"
              min="500000"
              max="20000000"
              step="500000"
              value={annualRevenue}
              onChange={(e) => setAnnualRevenue(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40">
              <div className="text-xs text-slate-400 font-mono">Jährliches Burn-Volumen (25%)</div>
              <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                {annualBurnAmountEur.toLocaleString()} €
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Direkter Marktrückkauf über dezentrale und zentrale Liquiditätspools.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40">
              <div className="text-xs text-slate-400 font-mono">Geschätzte verbrannte Token / Jahr</div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                ~ {estimatedTokensBurned.toLocaleString()} $CPT
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Verknappt das Gesamtangebot von 100M Einheiten kontinuierlich.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
