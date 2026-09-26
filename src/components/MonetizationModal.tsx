/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: MONETARISIERUNGSKONZEPT & BUSINESS MODEL]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - B2C SaaS Tarife (Free Starter, Pro Investor 19€/Monat, Alpha Elite 49€/Monat)
 *    - Monats- / Jahresabrechnungs-Umschalter mit Rabattkalkulation (-20%)
 *    - B2B API Licensing & Broker Affiliate Matrix (CPA 35€-80€)
 *    - Interaktiver Ertrags-Simulator (MAU, Conversion Rate, MRR, ARR Runrate)
 * 2. SCORING-LOGIK        : 
 *    - Dynamische SaaS Umsatz-Kalkulation (MRR, ARR, Affiliate Runrate)
 *    - BaFin Compliance & WpHG Klassifikation (reiner statistischer Informationsdienst)
 * 3. DATENANBINDUNG       : 
 *    - Lokale State-Hooks (`mau`, `convRate`, `proRatio`, `billingCycle`)
 *    - Direktabsprung in `LoginPage` oder `WhaleRadarModal`
 * 4. DATENQUELLEN / FEEDS : 
 *    - Industriemetriken für Neobroker CPAs & SaaS-Konversionsraten
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  Building2,
  TrendingUp,
  CreditCard,
  ArrowRight,
  Sliders,
  DollarSign,
  Layers,
  FileText,
  Lock,
  Percent,
  Calculator,
  Compass,
  Bell,
  Scale,
  Coins,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateLogin?: () => void;
  onOpenWhaleRadar?: () => void;
  onNavigateTokenomics?: () => void;
}

type BillingCycle = 'monthly' | 'annual';
type ActiveTab = 'plans' | 'b2b' | 'tokenomics' | 'calculator' | 'strategy';

export const MonetizationModal: React.FC<MonetizationModalProps> = ({
  isOpen,
  onClose,
  onNavigateLogin,
  onOpenWhaleRadar,
  onNavigateTokenomics,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('plans');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [payWithCpt, setPayWithCpt] = useState<boolean>(false);

  // Interactive Revenue Calculator state
  const [mau, setMau] = useState<number>(50000); // Monthly Active Users
  const [convRate, setConvRate] = useState<number>(3.5); // 3.5% conversion rate
  const [proRatio, setProRatio] = useState<number>(75); // 75% Pro, 25% Alpha

  if (!isOpen) return null;

  // Pricing values with optional 30% $CPT discount
  const discountMultiplier = payWithCpt ? 0.7 : 1.0;
  const proPrice = (billingCycle === 'annual' ? 15.83 : 19) * discountMultiplier;
  const alphaPrice = (billingCycle === 'annual' ? 40.83 : 49) * discountMultiplier;

  // Simulator calculations
  const payingUsers = Math.round(mau * (convRate / 100));
  const proUsers = Math.round(payingUsers * (proRatio / 100));
  const alphaUsers = payingUsers - proUsers;
  const mrrSub = Math.round(proUsers * 19 + alphaUsers * 49);
  const arrSub = mrrSub * 12;
  const estimatedBrokerCpaPerYear = Math.round(mau * 0.02 * 45); // 2% click to broker at 45€ CPA
  const totalArr = arrSub + estimatedBrokerCpaPerYear;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-4xl bg-[#070e22] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BrandLogo variant="emblem" size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Business Model &amp; Monetarisierung
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Multi-Pillar Strategy
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 font-semibold flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-400" />
                  $CPT Utility Powered
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Capital-AI Monetarisierungskonzept
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#030716] rounded-2xl border border-slate-800/90 mt-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(249,191,33,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>B2C SaaS Tarife</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('b2b')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'b2b'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(249,191,33,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>B2B &amp; Data API</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tokenomics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tokenomics'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(249,191,33,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>$CPT Utilities &amp; Staking</span>
            <span className="text-[9px] font-mono px-1 rounded bg-black/20 text-black font-extrabold">
              NEU
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(249,191,33,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Ertrags-Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('strategy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'strategy'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(249,191,33,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Strategie &amp; Compliance</span>
          </button>
        </div>

        {/* TAB 1: B2C SaaS Tarife (Freemium, Pro, Alpha Elite) */}
        {activeTab === 'plans' && (
          <div className="mt-5 space-y-5">
            {/* Billing toggle & $CPT discount toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#030716] border border-slate-800">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold ${
                    billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  Monatlich
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')
                  }
                  className="w-12 h-6 rounded-full bg-slate-800 p-0.5 relative transition-colors cursor-pointer border border-slate-700"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-amber-400 transition-transform ${
                      billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold ${
                      billingCycle === 'annual' ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    Jährlich
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    -20% Rabatt
                  </span>
                </div>
              </div>

              {/* $CPT Payment Switch */}
              <div className="flex items-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80 w-full sm:w-auto justify-end">
                <div className="flex items-center gap-1 text-xs">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-300 font-semibold">Zahlung mit $CPT:</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPayWithCpt(!payWithCpt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                    payWithCpt
                      ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_10px_rgba(249,191,33,0.3)]'
                      : 'bg-slate-800/90 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{payWithCpt ? 'Aktiv (-30%)' : 'Inaktiv (0%)'}</span>
                </button>
              </div>
            </div>

            {/* Pricing Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* TIER 1: Free Starter */}
              <div className="p-4 rounded-2xl bg-[#030715] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Starter
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Freemium
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black text-white">0 €</div>
                    <span className="text-[11px] text-slate-400">Dauerhaft kostenlos</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 pb-3 border-b border-slate-800">
                    Ideal zum Kennenlernen der Plattform und Beobachten globaler Indizes.
                  </p>

                  <ul className="mt-3 space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>15-Minuten Delayed Kursdaten</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Basis Fear &amp; Greed Index</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Bis zu 3 aktive Preis-Alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>1 Watchlist mit max. 10 Werten</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Aktiver Tarif
                </button>
              </div>

              {/* TIER 2: Pro Investor (Popular) */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#101b44] to-[#080e26] border-2 border-amber-400/80 shadow-[0_0_30px_rgba(249,191,33,0.18)] flex flex-col justify-between relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black px-3 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md">
                  Empfohlen für Privatanleger
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      Pro Investor
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                      Bestseller
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black text-amber-400 flex items-baseline gap-1">
                      {proPrice.toFixed(2).replace('.', ',')} €
                      <span className="text-xs text-slate-400 font-normal">/ Monat</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {billingCycle === 'annual'
                        ? '190 € jährliche Abrechnung'
                        : 'Monatlich kündbar'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 pb-3 border-b border-slate-800">
                    Für ambitionierte Anleger, die datenbasiert und ohne Zeitverzögerung handeln.
                  </p>

                  <ul className="mt-3 space-y-2 text-xs text-slate-200">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <strong className="text-white">Echtzeit-Streaming Marktdaten</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Vollständige KI-Sektor-Rotationsanalyse</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Unbegrenzte Preis- &amp; Sentiment-Alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Buffett Value Check &amp; Enterprise Scorer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-amber-300 font-semibold">Kostenlos ab Tier II Staking (5.000 $CPT)</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-5 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateLogin?.();
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-all shadow-[0_0_15px_rgba(249,191,33,0.35)] cursor-pointer"
                  >
                    Pro 14 Tage kostenlos testen
                  </button>
                  {onNavigateTokenomics && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateTokenomics();
                      }}
                      className="w-full py-1 text-[11px] font-mono text-amber-300/80 hover:text-amber-300 transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Coins className="w-3 h-3 text-amber-400" />
                      <span>Mit 5.000 $CPT staken &amp; freischalten →</span>
                    </button>
                  )}
                </div>
              </div>

              {/* TIER 3: Alpha Elite */}
              <div className="p-4 rounded-2xl bg-[#030715] border border-cyan-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      Alpha Elite
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      Trader &amp; Pro
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black text-cyan-400 flex items-baseline gap-1">
                      {alphaPrice.toFixed(2).replace('.', ',')} €
                      <span className="text-xs text-slate-400 font-normal">/ Monat</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {billingCycle === 'annual'
                        ? '490 € jährliche Abrechnung'
                        : 'Monatlich kündbar'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 pb-3 border-b border-slate-800">
                    Für professionelle Daytrader, Family Offices und quantitative Investoren.
                  </p>

                  <ul className="mt-3 space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <strong className="text-white">Alle Pro-Funktionen inklusive</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Ultra-Low-Latency Webhooks &amp; Telegram Push</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Smart Money Flow &amp; On-Chain Whale Radar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Coins className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-cyan-300 font-semibold">Kostenlos ab Tier III Staking (25.000 $CPT)</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-5 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateLogin?.();
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                  >
                    Alpha Elite wählen
                  </button>
                  {onNavigateTokenomics && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateTokenomics();
                      }}
                      className="w-full py-1 text-[11px] font-mono text-cyan-300/80 hover:text-cyan-300 transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Coins className="w-3 h-3 text-cyan-400" />
                      <span>Mit 25.000 $CPT staken &amp; freischalten →</span>
                    </button>
                  )}
                  {onOpenWhaleRadar && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenWhaleRadar();
                      }}
                      className="w-full py-1 rounded-lg text-[11px] font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Whale Radar &amp; Telegram Live testen →</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: B2B, Broker-Affiliate & Data API */}
        {activeTab === 'b2b' && (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-[#030715] border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Säule 2: B2B Data &amp; Sentiment API Licensing
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Vermarkte die eigenentwickelten Algorithmen (Fear &amp; Greed Echtzeit-Index, KI-Sektor-Rotationsradar, Buffett-Score) an externe Finanzinstitute, Neobroker und Vermögensverwalter.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-amber-300 block font-bold">
                    Fintech Starter Feed
                  </span>
                  <div className="text-lg font-black text-white mt-1">499 € / Mo.</div>
                  <span className="text-[10px] text-slate-400 block mt-1 font-sans">
                    100.000 API-Calls, WebSocket-Stream für Sentiment &amp; Sektoren.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-cyan-300 block font-bold">
                    Institutional Data Feed
                  </span>
                  <div className="text-lg font-black text-white mt-1">1.499 € / Mo.</div>
                  <span className="text-[10px] text-slate-400 block mt-1 font-sans">
                    Unbegrenzte Abfragen, Rohdaten-Exporte &amp; Historische Backtest-Daten.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-emerald-300 block font-bold">
                    White-Label Widgets
                  </span>
                  <div className="text-lg font-black text-white mt-1">2.499 € / Mo.</div>
                  <span className="text-[10px] text-slate-400 block mt-1 font-sans">
                    Einbettbare interaktive Widgets für Kundenportale von Banken &amp; Brokern.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#030715] border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" />
                Säule 3: Affiliate &amp; Order-Routing (CPA / RevShare)
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Beim Klick auf &quot;Bei Broker handeln&quot; in den Asset-Detailansichten erfolgt ein intelligentes Routing zu regulierten Partner-Brokern (Trade Republic, Scalable Capital, Interactive Brokers, Bitvavo, Kraken).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-emerald-400 font-bold block mb-1">
                    CPA Neukunden-Provision
                  </span>
                  <p className="text-slate-300 leading-snug">
                    Vergütung von <strong>35 € bis 85 € pro verifiziertem Depot-Erstkunden</strong>. Bei 50.000 MAU und 1,5% Vermittlungsquote entspricht dies 25.000 € – 60.000 € Zusatzumsatz pro Monat.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                  <span className="text-cyan-400 font-bold block mb-1">
                    Trading-Fee Revenue-Share
                  </span>
                  <p className="text-slate-300 leading-snug">
                    Dauerhafte Beteiligung an generierten Handelsgebühren (10–25% RevShare) bei Krypto-Börsen und CFD-Plattformen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: $CPT Tokenomics & Utilities */}
        {activeTab === 'tokenomics' && (
          <div className="mt-5 space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1638] via-[#070e24] to-[#030612] border border-amber-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold uppercase tracking-wider">
                      Deflationary Token Economy
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      100M Hard Cap Fixed
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-400" />
                    <span>$CPT Rolle im Monetarisierungs-Schwungrad</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    $CPT ist das wirtschaftliche Rückgrat der Capital-AI Plattform. Echte SaaS- und B2B-Umsätze erzeugen kontinuierliche Kaufkraft für das Token-Ökosystem.
                  </p>
                </div>

                {onNavigateTokenomics && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateTokenomics();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-all shadow-[0_0_15px_rgba(249,191,33,0.3)] shrink-0 cursor-pointer"
                  >
                    <span>Vollständiges Whitepaper</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 4 Pillars of Monetization + Tokenomics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#020512] border border-amber-500/25">
                  <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>1. 25% Revenue Buyback &amp; Burn</span>
                  </div>
                  <p className="text-slate-300 leading-snug text-[11.5px]">
                    Ein Viertel aller Brutto-SaaS-Abonnements (19€–49€) und B2B-API-Lizenzen (ab 249€/Mo) wird quartalsweise zum marktüblichen Rückkauf von $CPT an dezentralen Börsen und anschließendem permanenten On-Chain-Burn verwendet.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#020512] border border-cyan-500/25">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>2. Stake-to-Access Modell</span>
                  </div>
                  <p className="text-slate-300 leading-snug text-[11.5px]">
                    Statt monatlicher Fiat-Zahlungen können Nutzer $CPT staken: <strong>5.000 $CPT (Tier II)</strong> schalten das Pro-Abo frei, <strong>25.000 $CPT (Tier III)</strong> schalten Alpha Elite mit Sub-20ms L3-Feeds und Whale Radar frei.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#020512] border border-emerald-500/25">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
                    <Percent className="w-4 h-4 text-emerald-400" />
                    <span>3. 30% Dauerrabatt bei $CPT-Zahlung</span>
                  </div>
                  <p className="text-slate-300 leading-snug text-[11.5px]">
                    Nutzer, die ihre SaaS-Gebühren direkt in $CPT begleichen, erhalten dauerhaft 30% Preisnachlass. Die vereinnahmten Tokens werden zu 50% gelockt und zu 50% verbrannt.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#020512] border border-purple-500/25">
                  <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                    <Building2 className="w-4 h-4 text-purple-400" />
                    <span>4. B2B Micro-Payments &amp; Gas Credits</span>
                  </div>
                  <p className="text-slate-300 leading-snug text-[11.5px]">
                    Entwickler und quantitative Fonds können B2B-API-Aufrufe per Micro-Payment in $CPT ohne Mindestvertragslaufzeit abrechnen lassen (Pay-as-you-Trade).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Interaktiver Ertrags-Simulator */}
        {activeTab === 'calculator' && (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-[#030715] border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-400" />
                    Finanzmodell &amp; MRR/ARR Ertrags-Rechner
                  </h3>
                  <p className="text-xs text-slate-400">
                    Interaktive Simulation auf Basis von Nutzerwachstum und Konversionsraten
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
                  Live-Berechnung
                </span>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
                <div className="space-y-1.5 bg-[#081028] p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Monatlich aktive Nutzer (MAU)</span>
                    <span className="text-amber-400 font-mono">{mau.toLocaleString('de-DE')}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="250000"
                    step="5000"
                    value={mau}
                    onChange={(e) => setMau(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>5k</span>
                    <span>100k</span>
                    <span>250k</span>
                  </div>
                </div>

                <div className="space-y-1.5 bg-[#081028] p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Paid-Konversionsrate</span>
                    <span className="text-amber-400 font-mono">{convRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="8.0"
                    step="0.5"
                    value={convRate}
                    onChange={(e) => setConvRate(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1%</span>
                    <span>3.5% (Benchmark)</span>
                    <span>8%</span>
                  </div>
                </div>

                <div className="space-y-1.5 bg-[#081028] p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Anteil Pro vs. Alpha</span>
                    <span className="text-amber-400 font-mono">
                      {proRatio}% Pro / {100 - proRatio}% Alpha
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="90"
                    step="5"
                    value={proRatio}
                    onChange={(e) => setProRatio(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>50%</span>
                    <span>75%</span>
                    <span>90%</span>
                  </div>
                </div>
              </div>

              {/* KPI Results Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    Zahlende Abonnenten
                  </span>
                  <div className="text-xl font-black font-mono text-white mt-0.5">
                    {payingUsers.toLocaleString('de-DE')}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {proUsers} Pro • {alphaUsers} Alpha
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    Monatlicher SaaS-Umsatz (MRR)
                  </span>
                  <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                    {mrrSub.toLocaleString('de-DE')} €
                  </div>
                  <span className="text-[10px] text-slate-500">Wiederkehrende Abos</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    Jährlicher SaaS-Umsatz (ARR)
                  </span>
                  <div className="text-xl font-black font-mono text-cyan-400 mt-0.5">
                    {arrSub.toLocaleString('de-DE')} €
                  </div>
                  <span className="text-[10px] text-slate-500">Nur Mitgliedschaften</span>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900/90 border border-amber-500/40">
                  <span className="text-[10px] font-mono text-amber-300 uppercase block font-bold">
                    Gesamt-Runrate p.a.
                  </span>
                  <div className="text-xl font-black font-mono text-amber-400 mt-0.5">
                    {totalArr.toLocaleString('de-DE')} €
                  </div>
                  <span className="text-[10px] text-amber-200/70">Inkl. Broker-CPA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Strategie & Compliance */}
        {activeTab === 'strategy' && (
          <div className="mt-5 space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#030715] border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-amber-400" />
                Regulatorischer Rahmen &amp; BaFin Compliance
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Capital-AI agiert rein als <strong>quantitative Analyse- und Informationsplattform</strong>. Alle KI-Scores, Sentiment-Indikatoren und Sektor-Radar-Daten stellen wissenschaftlich-statistische Informationsdienste dar und sind <strong>keine Anlageberatung</strong> im Sinne des § 2 Abs. 22 WpHG bzw. keine erlaubnispflichtige Finanzdienstleistung nach § 32 KWG.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">Keine Verwahrung</span>
                  <p className="text-slate-400 font-sans text-[11px]">
                    Kein direkter Kundengeld- oder Asset-Zugriff. Transaktionen erfolgen ausschließlich bei regulierten Partner-Brokern.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Objektive Algorithmen</span>
                  <p className="text-slate-400 font-sans text-[11px]">
                    Multi-Faktor Scoring basiert auf publizierten Bilanzen, Kursdaten und Natural-Language-Processing von Medienberichten.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">DSGVO &amp; Privacy</span>
                  <p className="text-slate-400 font-sans text-[11px]">
                    Hosting in europäischen Rechenzentren (Frankfurt / Dublin) mit strikter Trennung von Nutzerdaten und quantitativen Modellen.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#030715] border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                Go-To-Market &amp; Churn-Minimierung
              </h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Volatilitäts-Triggered Conversions:</strong> In Marktphasen mit extremem Sentiment (&quot;Extreme Fear&quot; / &quot;Extreme Greed&quot;) steigt das Informationsbedürfnis sprunghaft. Gezielte In-App-Benachrichtigungen konvertieren Free-Nutzer zu Pro.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Gamified Alerts &amp; Watchlist Limits:</strong> Nutzer mit mehr als 3 Watchlist-Werten oder komplexen gekoppelten Sentiment-Alerts werden sanft und mit klarem Mehrwert an das Pro-Abo herangeführt.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>B2B API als Margen-Booster:</strong> B2B-Kunden erzeugen hohe Retention (Churn &lt; 0.5% monatlich) und sichern planbare Deckungsbeiträge für Server- und Datenkosten.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sichere Zahlungsabwicklung via Stripe • Jederzeit kündbar</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Schließen
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateLogin?.();
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-all shadow-[0_0_15px_rgba(249,191,33,0.3)] cursor-pointer"
            >
              Konto anlegen / Upgrade
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
