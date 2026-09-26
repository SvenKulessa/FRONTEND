/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: TOKENOMICS KONZEPT & REITER-KOMPONENTE]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Institutionelles Tokenomics-Dashboard mit Reitern (Tabs)
 *    - Interaktiver Staking-Tier-Rechner mit dynamischen Feature-Freischaltungen
 *    - Interaktiver Buyback & Burn Simulator für Plattform-Umsätze
 *    - Visuelle Allokations-Matrix & 48-Monats-Vesting-Zeitstrahl
 * 2. ÖKONOMISCHE LOGIK   : 
 *    - $CPT (Capital-AI Token) Hard Cap: 100.000.000 Einheiten
 *    - Deflationäres Schwungrad: 25% aller SaaS- & B2B-API-Umsätze fließen in Buyback & Burn
 *    - Staking-Yields bis zu 8,4% APY für Dezentrale Algorithmus-Validatoren
 * 3. ACCESSIBILITY & A11Y : 
 *    - ARIA Tablist/Tabpanel Struktur mit Tastaturbedienung
 *    - Kontrastreiche Farbschemata (Gold, Cyan, Emerald) mit Screenreader-Unterstützung
 * 4. ROUTING & SYNC       : 
 *    - Aufrufbar unter /tokenomics, /token, /cpt sowie als Reiter in der Navigation
 * ============================================================================
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
} from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { jsPDF } from 'jspdf';
import { trackEvent } from '../utils/analytics';

interface TokenomicsPageProps {
  onBackToHome?: () => void;
  onNavigateLogin?: () => void;
  onNavigateLegal?: (path: string) => void;
}

type TabKey = 'concept' | 'staking' | 'allocation' | 'burn' | 'governance';

export const TokenomicsPage: React.FC<TokenomicsPageProps> = ({
  onBackToHome,
  onNavigateLogin,
  onNavigateLegal,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('concept');
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
        telegramBot: 'Instant Realtime Push',
        discount: '50% Rabatt auf B2B APIs',
        governanceWeight: '3.0x Stimmgewicht',
        aiPrompts: 'Unbegrenzt',
      };
    }
    if (amount >= 5000) {
      return {
        name: 'Tier II: Pro Trader',
        color: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10',
        badgeColor: 'bg-cyan-400 text-black',
        latency: 'Sub-45ms WebSocket Feed',
        apiCalls: '100.000 Requests/Tag',
        telegramBot: 'Whale Radar Live Bot',
        discount: '25% Rabatt',
        governanceWeight: '1.5x Stimmgewicht',
        aiPrompts: '500 Analysen/Tag',
      };
    }
    if (amount >= 1000) {
      return {
        name: 'Tier I: Explorer',
        color: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
        badgeColor: 'bg-emerald-400 text-black',
        latency: 'Sub-100ms Fast Polling',
        apiCalls: '10.000 Requests/Tag',
        telegramBot: 'Tägliche Zusammenfassung',
        discount: '10% Rabatt',
        governanceWeight: '1.0x Stimmgewicht',
        aiPrompts: '50 Analysen/Tag',
      };
    }
    return {
      name: 'Basis-Zugang (Kein Staking)',
      color: 'text-slate-400 border-slate-700 bg-slate-800/40',
      badgeColor: 'bg-slate-700 text-white',
      latency: '15 Minuten verzögert',
      apiCalls: '500 Requests/Tag',
      telegramBot: 'Kein Push-Zugriff',
      discount: '0% Rabatt',
      governanceWeight: '0x Stimmgewicht',
      aiPrompts: '5 Analysen/Tag',
    };
  };

  const currentTier = getTierInfo(stakedAmount);

  // Buyback calculation: 25% revenue allocated, assumed average token price ~0.40€
  const assumedTokenPrice = 0.45;
  const annualBuybackBudget = annualRevenue * 0.25;
  const annualBurnTokens = Math.round(annualBuybackBudget / assumedTokenPrice);
  const burnPercentOfSupply = ((annualBurnTokens / 100000000) * 100).toFixed(2);

  const handleCopyContract = () => {
    const address = '0xcA91A18d098e987cFe67a14e9182390fFe9B2026';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2500);
    }
  };

  const handleExportTokenomicsWhitepaper = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const margin = 16;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header Banner
      doc.setFillColor(7, 14, 34);
      doc.rect(0, 0, pageWidth, 42, 'F');
      doc.setFillColor(245, 176, 20);
      doc.rect(0, 41, pageWidth, 1.5, 'F');

      doc.setTextColor(245, 176, 20);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CAPITAL-AI • $CPT TOKENOMICS', margin, 18);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 190, 210);
      doc.text('OFFIZIELLES WIRTSCHAFTS- & DEFLATIONS-KONZEPT (V2.4)', margin, 24);

      let y = 52;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('1. KERNPARAMETER DES $CPT UTILITY-TOKENS', margin, y);
      y += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const metrics = [
        'Token Symbol: $CPT (Capital-AI Platform Token)',
        'Gesamtangebot (Hard Cap): 100.000.000 $CPT (Streng limitiert, keine Inflation)',
        'Initialer Umlaufbestand (TGE): 12.500.000 $CPT (12,5%)',
        'Deflations-Schwungrad: 25% aller SaaS- & B2B-Umsätze fließen in Buyback & Burn',
        'Staking APY: 4,5% - 8,4% für Community-Algorithmus-Kuratoren & Validatoren',
        'Smart Contract Standard: ERC-20 / Arbitrum One & Ethereum L1',
      ];
      metrics.forEach((m) => {
        doc.text(`• ${m}`, margin + 4, y);
        y += 6;
      });

      y += 6;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('2. TOKEN-ALLOKATION & VESTING-PLAN', margin, y);
      y += 8;

      const allocations = [
        'Community & Public Sale (30%): 30.000.000 $CPT - 20% TGE, 12M linear',
        'Ecosystem & Staking Rewards (25%): 25.000.000 $CPT - 48 Monate lineare Emission',
        'Treasury & Liquiditätsbereitstellung (20%): 20.000.000 $CPT - Multi-Sig 3/5',
        'Kernteam & Entwickler (15%): 15.000.000 $CPT - 12 Monate Cliff, 36 Monate Vesting',
        'Strategische Partner & Seed (10%): 10.000.000 $CPT - 6 Monate Cliff, 18 Monate Vesting',
      ];
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      allocations.forEach((a) => {
        doc.text(`• ${a}`, margin + 4, y);
        y += 6;
      });

      y += 6;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('3. STAKING-STUFEN & NUTZEN-ARCHITEKTUR', margin, y);
      y += 8;

      const tiers = [
        'Tier I Explorer (1.000 $CPT): Sub-100ms Feeds, 10k API-Requests, 10% Rabatt',
        'Tier II Pro Trader (5.000 $CPT): Sub-45ms WebSocket, Whale Radar Bot, 25% Rabatt',
        'Tier III Whale (25.000 $CPT): Sub-20ms Direct Gateway, Unbegrenzte L3 Feeds, 50% Rabatt',
      ];
      tiers.forEach((t) => {
        doc.text(`• ${t}`, margin + 4, y);
        y += 6;
      });

      doc.save(`CapitalAI_Tokenomics_Whitepaper_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('PDF export failed:', e);
    }
  };

  return (
    <div className="w-full text-slate-100 pb-16">
      {/* Top Breadcrumb & Navigation */}
      <nav aria-label="Breadcrumb Navigation" className="px-4 sm:px-6 py-4 border-b border-amber-500/20 bg-[#040817]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Terminal Übersicht</span>
            </button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">$CPT Tokenomics Konzept</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportTokenomicsWhitepaper}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
              title="Tokenomics Whitepaper als PDF exportieren"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Whitepaper PDF</span>
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors cursor-pointer"
            >
              Anmelden
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Hero Header */}
        <header className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1638] via-[#070e24] to-[#030612] border border-amber-500/30 shadow-[0_0_50px_rgba(245,176,20,0.12)] overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  $CPT Utility &amp; Governance
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
                  Hard Cap: 100M Fixed
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Capital-AI Tokenomics &amp; Ökosystem
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Das wirtschaftliche Fundament des Terminals: Kopplung von Real-Time Latenz-Garantien, institutionellem Multi-Faktor-Scoring und automatisiertem Buyback &amp; Burn aus echten Plattform-Umsätzen.
              </p>
            </div>

            {/* Contract Box */}
            <div className="p-4 rounded-2xl bg-[#030714]/80 border border-slate-700/80 shrink-0 text-xs">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                Offizieller Token Smart Contract:
              </span>
              <div className="flex items-center gap-2 font-mono text-amber-300 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800">
                <span>0xcA91...9B2026</span>
                <button
                  type="button"
                  onClick={handleCopyContract}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Adresse kopieren"
                >
                  {copiedContract ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Netzwerk: Ethereum / Arbitrum One</span>
            </div>
          </div>
        </header>

        {/* Tab Navigation (Reiter) with High Usability & Accessibility */}
        <nav
          role="tablist"
          aria-label="Tokenomics Themenbereiche"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 mt-6 border-b border-slate-800"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'concept'}
            aria-controls="tabpanel-concept"
            id="tab-concept"
            type="button"
            onClick={() => setActiveTab('concept')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
              activeTab === 'concept'
                ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(249,191,33,0.3)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Konzept &amp; Nutzen</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'staking'}
            aria-controls="tabpanel-staking"
            id="tab-staking"
            type="button"
            onClick={() => setActiveTab('staking')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
              activeTab === 'staking'
                ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Staking-Tier Rechner</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'burn'}
            aria-controls="tabpanel-burn"
            id="tab-burn"
            type="button"
            onClick={() => setActiveTab('burn')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none ${
              activeTab === 'burn'
                ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Buyback &amp; Deflation</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'allocation'}
            aria-controls="tabpanel-allocation"
            id="tab-allocation"
            type="button"
            onClick={() => setActiveTab('allocation')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${
              activeTab === 'allocation'
                ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Allokation &amp; Vesting</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'governance'}
            aria-controls="tabpanel-governance"
            id="tab-governance"
            type="button"
            onClick={() => setActiveTab('governance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
              activeTab === 'governance'
                ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Vote className="w-4 h-4" />
            <span>Governance &amp; Validierung</span>
          </button>
        </nav>

        {/* TAB PANELS */}
        <div className="mt-6">
          {/* TAB 1: KONZEPT & NUTZEN */}
          {activeTab === 'concept' && (
            <motion.div
              id="tabpanel-concept"
              role="tabpanel"
              aria-labelledby="tab-concept"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#091129] border border-amber-500/20">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Tier-Access &amp; Latenz</h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Staker schalten exklusive Sub-45ms und Sub-20ms WebSocket-Pipelines frei, um Slippage beim Trading zu eliminieren.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#091129] border border-cyan-500/20">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-3">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Deflationäres Schwungrad</h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    25% aller B2B-API-Lizenzen und Enterprise-Abonnements werden quartalsweise für den automatisierten Rückkauf und Burn verwendet.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#091129] border border-emerald-500/20">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3">
                    <Vote className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Dezentrale Kuration</h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Token-Holder stimmen über Multi-Faktor-Gewichtungen ab und partizipieren an Staking-Belohnungen für Datenvalidierung.
                  </p>
                </div>
              </div>

              {/* Economic Pillars Deep Dive */}
              <div className="p-6 rounded-3xl bg-[#070e24] border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <span>Das Capital-AI Wertschöpfungskonzept (Value Flywheel)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Im Gegensatz zu rein spekulativen Utility-Tokens basiert $CPT auf realer wirtschaftlicher Nachfrage: 
                  Institutionelle Hedgefonds, Prop-Trading-Desks und Privatanleger benötigen das Terminal und die Low-Latency API. 
                  Je mehr Nutzer und Datenabfragen das System verarbeitet, desto höher ist das kontinuierliche Buyback-Volumen.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#020512] border border-slate-800">
                    <span className="text-xs font-bold text-amber-300 block mb-1">
                      1. Reale Cashflow-Verankerung
                    </span>
                    <p className="text-[11px] text-slate-400">
                      SaaS-Erlöse (39€ bis 399€/Monat) und API-Volumenabrechnungen fließen direkt in den Treasury Smart Contract.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#020512] border border-slate-800">
                    <span className="text-xs font-bold text-cyan-300 block mb-1">
                      2. Keine unkontrollierte Verwässerung
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Strikter Hard Cap von 100 Millionen Tokens. Keine Mint-Funktion im Smart Contract nach TGE implementiert.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: INTERAKTIVER STAKING RECHNER */}
          {activeTab === 'staking' && (
            <motion.div
              id="tabpanel-staking"
              role="tabpanel"
              aria-labelledby="tab-staking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-[#070e24] border border-cyan-500/30 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-cyan-400" />
                      <span>Interaktiver Staking-Tier Rechner</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Wähle die Anzahl an gestakten $CPT Tokens, um freigeschaltete Terminal-Vorteile zu simulieren.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 uppercase font-mono block">Aktuelle Auswahl</span>
                    <span className="text-2xl font-black font-mono text-cyan-400">{stakedAmount.toLocaleString('de-DE')} $CPT</span>
                  </div>
                </div>

                {/* Slider */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>0 $CPT (Free)</span>
                    <span>1.000 (Tier I)</span>
                    <span>5.000 (Tier II)</span>
                    <span>25.000 (Whale)</span>
                    <span>50.000 $CPT</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={stakedAmount}
                    onChange={(e) => setStakedAmount(Number(e.target.value))}
                    aria-label="Staked Token Amount Slider"
                    className="w-full accent-cyan-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Unlocked Tier Display Card */}
                <div className={`mt-6 p-5 rounded-2xl border ${currentTier.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-80 block">
                        Erreichte Stufe
                      </span>
                      <h4 className="text-xl font-black mt-0.5">{currentTier.name}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${currentTier.badgeColor}`}>
                      AKTIV
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/30">
                      <span className="text-[10px] text-slate-400 block">Feed-Latenz</span>
                      <span className="font-bold text-white block mt-0.5">{currentTier.latency}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/30">
                      <span className="text-[10px] text-slate-400 block">API-Kontingent</span>
                      <span className="font-bold text-white block mt-0.5">{currentTier.apiCalls}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/30">
                      <span className="text-[10px] text-slate-400 block">Whale Radar Push</span>
                      <span className="font-bold text-white block mt-0.5">{currentTier.telegramBot}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/30">
                      <span className="text-[10px] text-slate-400 block">Gebührenrabatt</span>
                      <span className="font-bold text-white block mt-0.5">{currentTier.discount}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/30">
                      <span className="text-[10px] text-slate-400 block">KI-Prompt Analysen</span>
                      <span className="font-bold text-white block mt-0.5">{currentTier.aiPrompts}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/30">
                      <span className="text-[10px] text-slate-400 block">Governance-Stimmrecht</span>
                      <span className="font-bold text-white block mt-0.5">{currentTier.governanceWeight}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: BUYBACK & BURN */}
          {activeTab === 'burn' && (
            <motion.div
              id="tabpanel-burn"
              role="tabpanel"
              aria-labelledby="tab-burn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-[#070e24] border border-rose-500/30 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Flame className="w-5 h-5 text-rose-400" />
                      <span>Autonomer Buyback &amp; Burn Simulator</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      25% des Bruttoumsatzes werden für den Rückkauf und das permanente Verbrennen von $CPT aufgewendet.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 uppercase font-mono block">Jährlicher Plattform-Umsatz</span>
                    <span className="text-2xl font-black font-mono text-rose-400">
                      {(annualRevenue / 1000000).toFixed(1)} Mio. €
                    </span>
                  </div>
                </div>

                {/* Slider for Revenue */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>1 Mio. €</span>
                    <span>5 Mio. €</span>
                    <span>10 Mio. €</span>
                    <span>20 Mio. €</span>
                    <span>30 Mio. €</span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="30000000"
                    step="500000"
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                    aria-label="Annual Revenue Slider"
                    className="w-full accent-rose-500 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Simulation Output Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Jährliches Buyback-Budget</span>
                    <span className="text-xl font-bold font-mono text-emerald-400 block mt-1">
                      {annualBuybackBudget.toLocaleString('de-DE')} €
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">25% direkter Abzug aus Cashflow</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Geschätzte verbrannte Tokens</span>
                    <span className="text-xl font-bold font-mono text-rose-400 block mt-1">
                      ~{annualBurnTokens.toLocaleString('de-DE')} $CPT
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">Basis: ~{assumedTokenPrice}€ / $CPT</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Supply-Reduktion / Jahr</span>
                    <span className="text-xl font-bold font-mono text-amber-400 block mt-1">
                      -{burnPercentOfSupply}% p.a.
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">Verringerung des Gesamtangebots</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: ALLOKATION & VESTING */}
          {activeTab === 'allocation' && (
            <motion.div
              id="tabpanel-allocation"
              role="tabpanel"
              aria-labelledby="tab-allocation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-[#070e24] border border-purple-500/30 shadow-xl space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    <span>Token-Allokation &amp; 48-Monats-Vesting-Plan</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Faire Verteilung ohne übermäßige Frühphasen-Entsperrungen zur langfristigen Preisstabilität.
                  </p>
                </div>

                {/* Visual Distribution Bar */}
                <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-800">
                  <div style={{ width: '30%' }} className="bg-amber-400" title="Community 30%" />
                  <div style={{ width: '25%' }} className="bg-cyan-400" title="Ecosystem 25%" />
                  <div style={{ width: '20%' }} className="bg-purple-400" title="Treasury 20%" />
                  <div style={{ width: '15%' }} className="bg-rose-400" title="Team 15%" />
                  <div style={{ width: '10%' }} className="bg-emerald-400" title="Partners 10%" />
                </div>

                {/* Table of Allocations */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#020512] text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-3">Kategorie</th>
                        <th className="p-3">Anteil</th>
                        <th className="p-3">Tokenmenge</th>
                        <th className="p-3">Vesting &amp; Cliff</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      <tr>
                        <td className="p-3 font-semibold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          Community &amp; Public Sale
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-400">30%</td>
                        <td className="p-3 font-mono">30.000.000 $CPT</td>
                        <td className="p-3 text-slate-400">20% bei TGE, danach 12 Monate linear</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                          Ecosystem &amp; Staking Rewards
                        </td>
                        <td className="p-3 font-mono font-bold text-cyan-400">25%</td>
                        <td className="p-3 font-mono">25.000.000 $CPT</td>
                        <td className="p-3 text-slate-400">48 Monate lineare Emission basierend auf Validierung</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                          Treasury &amp; Liquidity Provision
                        </td>
                        <td className="p-3 font-mono font-bold text-purple-400">20%</td>
                        <td className="p-3 font-mono">20.000.000 $CPT</td>
                        <td className="p-3 text-slate-400">Multi-Sig 3/5, zweckgebunden für DEX/CEX Market Making</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                          Kernteam &amp; Entwicklung
                        </td>
                        <td className="p-3 font-mono font-bold text-rose-400">15%</td>
                        <td className="p-3 font-mono">15.000.000 $CPT</td>
                        <td className="p-3 text-slate-400">12 Monate Cliff, 36 Monate lineares Vesting</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          Strategische Partner &amp; Seed
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-400">10%</td>
                        <td className="p-3 font-mono">10.000.000 $CPT</td>
                        <td className="p-3 text-slate-400">6 Monate Cliff, 18 Monate lineares Vesting</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: GOVERNANCE & VALIDIERUNG */}
          {activeTab === 'governance' && (
            <motion.div
              id="tabpanel-governance"
              role="tabpanel"
              aria-labelledby="tab-governance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-[#070e24] border border-emerald-500/30 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Vote className="w-5 h-5 text-emerald-400" />
                  <span>Dezentrale Kuration &amp; Protokoll-Governance</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Die quantitative Qualität von Capital-AI wird durch die Community validiert. 
                  Holder von $CPT entscheiden in On-Chain-Abstimmungen über Kernaspekte der Plattform.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-[#020512] border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">
                      1. Algorithmen-Gewichtung
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Abstimmung über die Gewichtung von Fundamentalfaktoren (Graham/Buffett), News-Sentiment und Orderbuch-Momentum im Gesamt-Score.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#020512] border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">
                      2. Neue Asset-Listings
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Entscheidung, welche neuen Token, DePIN-Projekte oder Rohstoff-Futures priorisiert an die Sub-45ms Pipeline angebunden werden.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold block mb-1">Sicherheit &amp; Timelock:</span>
                  Alle Governance-Entscheidungen durchlaufen eine 48-stündige Timelock-Verzögerung auf Arbitrum One, überwacht von einem 3-von-5 Gnosis Multi-Sig Rat.
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">Interesse an institutionellem Zugang?</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Kontaktiere unseren Desk für OTC-Allokationen, B2B-API-Pakete oder Validator-Node-Registrierung.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateLogin}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs sm:text-sm transition-all shadow-[0_0_12px_rgba(249,191,33,0.3)] shrink-0 cursor-pointer"
          >
            Terminal öffnen
          </button>
        </div>
      </div>
    </div>
  );
};
