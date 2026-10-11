/**
 * ============================================================================
 * CAPITAL AI — STUDIO HUB: SCORING-KOMPONENTEN & ANALYSETOOLS
 * ----------------------------------------------------------------------------
 * Aufgeräumte, interaktive Präsentation der quantitativen Bewertungsmodelle:
 * Master Enterprise Score (0–100), Altman Z-Score, Buffett Moat Check,
 * Piotroski F-Score, Technische Indikatoren, Financial NLP & VaR Tail-Risk.
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Award,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Brain,
  Sliders,
  Activity,
  Zap,
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const StudioScoringSection: React.FC = () => {
  const [activeModel, setActiveModel] = useState<
    'enterprise' | 'altman' | 'buffett' | 'piotroski' | 'technicals' | 'nlp' | 'risk'
  >('enterprise');

  // Interactive Live Scoring Sandbox State
  const [fundamentalVal, setFundamentalVal] = useState<number>(82);
  const [moatVal, setMoatVal] = useState<number>(78);
  const [momentumVal, setMomentumVal] = useState<number>(65);
  const [riskPenaltyVal, setRiskPenaltyVal] = useState<number>(18);
  const [sentimentVal, setSentimentVal] = useState<number>(74);

  // Live Composite Score Calculation (0 - 100)
  const computedScore = useMemo(() => {
    // 30% Fundamental + 25% Moat + 20% Momentum + 15% Risk (invertiert) + 10% Sentiment
    const raw =
      fundamentalVal * 0.3 +
      moatVal * 0.25 +
      momentumVal * 0.2 +
      (100 - riskPenaltyVal) * 0.15 +
      sentimentVal * 0.1;
    return Math.round(Math.min(100, Math.max(0, raw)) * 10) / 10;
  }, [fundamentalVal, moatVal, momentumVal, riskPenaltyVal, sentimentVal]);

  const scoreRating = useMemo(() => {
    if (computedScore >= 80) return { label: 'Top Tier / Strong Buy', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (computedScore >= 65) return { label: 'Solid Investment', color: 'text-cyan-300', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
    if (computedScore >= 50) return { label: 'Neutral / Hold', color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { label: 'High Risk / Distress', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
  }, [computedScore]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0d1530] to-purple-500/10 border border-amber-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>QUANTITATIVE SCORING ENGINE &amp; MULTI-FAKTOR MODELLE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Scoring-Komponenten &amp; Analysetools
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Vollständige Übersicht aller mathematischen Bewertungsmodelle: Vom 0–100 Master Enterprise Score
              über den Altman Z-Score, Buffett Moat Check und Piotroski F-Score bis hin zu technischem Momentum,
              Gemini NLP Financial Sentiment und Tail-Risk-Kovarianzen.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
              50 Faktoren Active
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
              BaFin WORM Verified
            </span>
          </div>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { id: 'enterprise', name: 'Enterprise Score', badge: '0-100 Rating', icon: Award },
          { id: 'altman', name: 'Altman Z-Score', badge: 'Insolvenz-Check', icon: ShieldAlert },
          { id: 'buffett', name: 'Buffett Moat', badge: 'Burggraben & ROCE', icon: ShieldCheck },
          { id: 'piotroski', name: 'Piotroski F', badge: '9-Punkte Bilanz', icon: CheckCircle2 },
          { id: 'technicals', name: 'Technicals', badge: 'RSI / MACD / ATR', icon: TrendingUp },
          { id: 'nlp', name: 'Financial NLP', badge: 'Gemini News', icon: Brain },
          { id: 'risk', name: 'Tail-Risk & VaR', badge: '99% Konfidenz', icon: Activity },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveModel(m.id as any)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeModel === m.id
                  ? 'bg-amber-400/15 border-amber-400 text-white shadow-lg shadow-amber-500/10 scale-[1.02]'
                  : 'bg-[#090e21] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-3.5 h-3.5 ${activeModel === m.id ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-[10px] font-mono text-cyan-400">{m.badge.split(' ')[0]}</span>
              </div>
              <div className="text-xs font-bold truncate text-white">{m.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">{m.badge}</div>
            </button>
          );
        })}
      </div>

      {/* Active Model Content Card */}
      <div className="p-6 rounded-2xl bg-[#090e21] border border-amber-500/40 space-y-6">
        {activeModel === 'enterprise' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  MASTER SCORING SPEZIFIKATION
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Capital-AI Enterprise Master Score (0–100)</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Ganzheitliche, gewichtete Bewertung jedes Titels aus 5 komplementären Analyse-Säulen.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-slate-800 text-right shrink-0">
                <div className="text-[10px] font-mono text-slate-400">Skalierung</div>
                <div className="text-sm font-bold font-mono text-amber-300">0.0 bis 100.0 Punkte</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400 font-mono text-[11px]">1. Fundamental (30%)</div>
                <p className="text-slate-300 text-[11px]">
                  Piotroski F-Score, Eigenkapitalquote, Zinsdeckungsgrad, Verschuldungsgrad (Net Debt / EBITDA).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-amber-400 font-mono text-[11px]">2. Value &amp; Moat (25%)</div>
                <p className="text-slate-300 text-[11px]">
                  ROCE (&gt;15%), Free Cash Flow Yield, Stetigkeit der Bruttomarge, Preissetzungsmacht (Buffett Check).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400 font-mono text-[11px]">3. Momentum (20%)</div>
                <p className="text-slate-300 text-[11px]">
                  RSI 14, MACD 12/26/9 Histogramm-Divergenz, Relative Stärke (RS) zum Gesamtmarkt, 200-Tage-Linie.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-rose-400 font-mono text-[11px]">4. Risiko &amp; VaR (15%)</div>
                <p className="text-slate-300 text-[11px]">
                  Value at Risk 99%, Maximum Drawdown der letzten 52 Wochen, Beta-Sensitivität, Altman Z-Score Abschlag.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-purple-400 font-mono text-[11px]">5. KI-Sentiment (10%)</div>
                <p className="text-slate-300 text-[11px]">
                  Gemini 2.5 Flash Sentiment-Extraktion aus SEC-10-K Filings, Quartalsberichten und Finanznachrichten.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeModel === 'altman' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  INSOLVENZFRÜHWARNSYSTEM
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Altman Z-Score (Modell nach Edward Altman)</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Mathematischer Nachweis der finanziellen Stabilität und Insolvenzwahrscheinlichkeit innerhalb von 2 Jahren.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs text-right">
                <span className="text-slate-400 block text-[10px]">Formel</span>
                <span className="text-amber-300 font-bold">Z = 1.2·X1 + 1.4·X2 + 3.3·X3 + 0.6·X4 + 1.0·X5</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <div className="font-bold text-emerald-400 font-mono">Safe Zone (Z &gt; 2.99)</div>
                <p className="text-slate-300">
                  Ausgezeichnete Solvenz. Extrem geringe Ausfallwahrscheinlichkeit (&lt; 1%). Volle Freigabe für Enterprise Screener.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <div className="font-bold text-amber-400 font-mono">Grey Zone (1.81 ≤ Z ≤ 2.99)</div>
                <p className="text-slate-300">
                  Erhöhte Wachsamkeit geboten. Das Unternehmen weist moderate Liquiditätsrisiken auf. Strengere Stop-Loss Pflicht.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                <div className="font-bold text-rose-400 font-mono">Distress Zone (Z &lt; 1.81)</div>
                <p className="text-slate-300">
                  Akute Insolvenzgefahr innerhalb von 24 Monaten. Automatischer Punkteabzug im Capital-AI Gesamtscore (-25 Punkte).
                </p>
              </div>
            </div>
          </div>
        )}

        {activeModel === 'buffett' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  QUALITÄTS- &amp; VALUE-ANALYSE
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Warren Buffett Moat &amp; Economic Value Check</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Dauerhafter Wettbewerbsvorteil (Economic Moat), Kapitalrenditen und Free Cash Flow Generierung.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400 font-mono">1. ROCE &gt; 15%</div>
                <p className="text-slate-300 text-[11px]">
                  Return on Capital Employed über 5 aufeinanderfolgende Jahre belegt echte Kapitaleffizienz ohne fremdfinanzierte Hebelung.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400 font-mono">2. Preissetzungsmacht</div>
                <p className="text-slate-300 text-[11px]">
                  Bruttomarge (Gross Margin) stetig &gt; 40%. Unternehmen kann Inflation an Endkunden weitergeben, ohne Absatz zu verlieren.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-amber-400 font-mono">3. FCF Yield &gt; 5%</div>
                <p className="text-slate-300 text-[11px]">
                  Echte Eigentümerrendite (Owner Earnings). Reingewinn wird nicht in exzessivem CapEx gebunden, sondern fließt als Cash zu.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-purple-400 font-mono">4. Debt &lt; 3x EBITDA</div>
                <p className="text-slate-300 text-[11px]">
                  Nettoverschuldung kann in unter 3 Jahren aus dem operativen Cashflow vollständig getilgt werden.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeModel === 'piotroski' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  FUNDAMENTAL-AUDIT
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Piotroski F-Score (0 bis 9 Punkte)</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  9 strikte Rechnungslegungskriterien zur Identifikation fundamental überlegener Value-Aktien.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs text-right">
                <span className="text-emerald-400 font-bold">F-Score 8-9: Top Tier</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1.5">
                <strong className="text-cyan-400 block font-mono">Rentabilität (4 Punkte):</strong>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div>• ROA &gt; 0 (Positive Gesamtkapitalrentabilität)</div>
                  <div>• Operativer Cashflow &gt; 0</div>
                  <div>• Δ ROA &gt; 0 (Steigende Kapitalrentabilität)</div>
                  <div>• Accrual: CFO &gt; Reingewinn (Echte Cash-Generierung)</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1.5">
                <strong className="text-amber-400 block font-mono">Verschuldung &amp; Liquidität (3 Punkte):</strong>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div>• Δ Leverage &lt; 0 (Sinkende langfristige Schuldenquote)</div>
                  <div>• Δ Current Ratio &gt; 0 (Steigende Liquidität 3. Grades)</div>
                  <div>• Keine neuen Aktien ausgegeben (Keine Verwässerung)</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1.5">
                <strong className="text-emerald-400 block font-mono">Operative Effizienz (2 Punkte):</strong>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div>• Δ Bruttomarge &gt; 0 (Verbesserte operative Profitabilität)</div>
                  <div>• Δ Asset Turnover &gt; 0 (Höherer Kapitalumschlag)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModel === 'technicals' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  HIGH-PRECISION CHARTING
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Technische Momentum- &amp; Volatilitäts-Indikatoren</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Echtzeit-Berechnung mathematischer Trend-, Überkauft-/Überverkauft- und Volatilitätsmaße.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400 font-mono">RSI (14)</div>
                <p className="text-slate-300 text-[11px]">
                  Relative Strength Index zur Erkennung von Extremzonen (&lt;30 überverkauft, &gt;70 überkauft).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400 font-mono">MACD (12, 26, 9)</div>
                <p className="text-slate-300 text-[11px]">
                  Moving Average Convergence Divergence zur frühzeitigen Identifikation von Trendwenden.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-amber-400 font-mono">Bollinger Bands (20, 2σ)</div>
                <p className="text-slate-300 text-[11px]">
                  Statistische 2-Sigma-Standardabweichung zur Identifikation von Ausbruchs-Squeezes.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-purple-400 font-mono">ATR (14) Volatilität</div>
                <p className="text-slate-300 text-[11px]">
                  Average True Range für dynamische, volatilitätsadaptive Stop-Loss- und Trailing-Platzierung.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeModel === 'nlp' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  NEURONALE TEXTANALYSE
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Financial NLP &amp; Gemini 2.5 Flash Inferenz</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Automatisierte Ingestion unstrukturierter Berichte (SEC 10-K, 10-Q, Ad-Hoc-Meldungen).
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs text-right">
                <span className="text-purple-300 font-bold">Sub-800ms Token-Pipeline</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-purple-400 font-mono">SEC Filing Anomaly Detector</div>
                <p className="text-slate-300 text-[11px]">
                  Erkennt subtile Änderungen im Risikokapitel (Item 1A) gegenüber Vorjahres-10-K Berichten.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400 font-mono">Earnings Call Sentiment (-1 to +1)</div>
                <p className="text-slate-300 text-[11px]">
                  Filtert Management-Tonfall, Ausweichantworten in Q&amp;A-Runden und verdeckte Margenwarnungen.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400 font-mono">News Velocity Spikes</div>
                <p className="text-slate-300 text-[11px]">
                  Korreliert plötzliche News-Meldungsfrequenzen mit Auftragsbuch-Ungleichgewichten.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeModel === 'risk' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  STATISTISCHES RISIKOMANAGEMENT
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Tail-Risk &amp; Value at Risk (VaR 99%)</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Ökonometrische Risikomodellierung zur Vermeidung asymmetrischer Verlustrisiken.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs text-right">
                <span className="text-rose-400 font-bold">Parametrisch &amp; Historisch</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-rose-400 font-mono">Value at Risk (99% / 10 Tage)</div>
                <p className="text-slate-300 text-[11px]">
                  Maximaler statistischer Verlust mit 99% Konfidenz über einen rollierenden 10-Tages-Horizont.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-amber-400 font-mono">Maximum Drawdown (MDD)</div>
                <p className="text-slate-300 text-[11px]">
                  Historischer Höchstverlust vom Allzeithoch zur Beurteilung der Erholungsdauer (Recovery Period).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400 font-mono">Sortino Ratio</div>
                <p className="text-slate-300 text-[11px]">
                  Bestraft im Gegensatz zum Sharpe Ratio ausschließlich negative Volatilität (Downside Deviation).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE SCORING SANDBOX (HANDS-ON SIMULATOR) */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0e1635] to-[#090e21] border border-cyan-500/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Interaktiver Scoring Sandbox Rechner</h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Verändern Sie die quantitativen Säulen, um die Live-Berechnung des Master Enterprise Scores zu testen.
            </p>
          </div>

          {/* Result Score Pill */}
          <div className={`p-3 rounded-2xl border text-center ${scoreRating.bg} ${scoreRating.border} shrink-0 min-w-[160px]`}>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Berechneter Gesamt-Score</div>
            <div className={`text-2xl font-black font-mono ${scoreRating.color}`}>{computedScore} / 100</div>
            <div className={`text-[11px] font-bold ${scoreRating.color}`}>{scoreRating.label}</div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
          <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span>Fundamentale Solidität</span>
              <strong className="text-cyan-300">{fundamentalVal}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={fundamentalVal}
              onChange={(e) => setFundamentalVal(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Gewichtung: 30%</span>
          </div>

          <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span>Buffett Moat (ROCE)</span>
              <strong className="text-amber-300">{moatVal}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={moatVal}
              onChange={(e) => setMoatVal(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Gewichtung: 25%</span>
          </div>

          <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span>Technisches Momentum</span>
              <strong className="text-emerald-300">{momentumVal}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={momentumVal}
              onChange={(e) => setMomentumVal(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Gewichtung: 20%</span>
          </div>

          <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span>Risiko / Insolvenz-Penalty</span>
              <strong className="text-rose-400">{riskPenaltyVal}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={riskPenaltyVal}
              onChange={(e) => setRiskPenaltyVal(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Gewichtung: 15%</span>
          </div>

          <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span>KI-News Sentiment</span>
              <strong className="text-purple-300">{sentimentVal}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sentimentVal}
              onChange={(e) => setSentimentVal(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Gewichtung: 10%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
