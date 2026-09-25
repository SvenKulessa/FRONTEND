/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: MARKET SENTIMENT & FEAR & GREED RADAR]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Halbkreis-Tachometer Gauge (Arc-Visualizer) für Fear & Greed (0-100)
 *    - Recharts 30-Tage Sparkline Time-Series Verlauf
 *    - Makro-Trend-Radar mit 4 Multi-Faktor Indikatoren
 * 2. SCORING-LOGIK        : 
 *    - Fear & Greed Index Score (0-100): Extreme Fear (<25), Fear, Neutral, Greed, Extreme Greed (>75)
 *    - Multi-Faktor Gewichtung: Volatilität (VIX/IV), Momentum (RSI), On-Chain/Orderbuch-Ratio, Safe-Haven-Demand
 * 3. DATENANBINDUNG       : 
 *    - `usePriceAlerts()`: Ermöglicht das Setzen von Sentiment-Kopplungs-Alarmen direkt aus dem Chart
 *    - Lokale reaktive State-Filter nach Hauptkategorie (Alle, Krypto, Aktien, etc.)
 * 4. DATENQUELLEN / FEEDS : 
 *    - Aggregierte Sentiment-Feeds aus News-NLP & Social-Media-Semantik
 *    - CBOE VIX Volatilitäts-Indizes & Put/Call-Verhältnisse
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  RefreshCw,
  Zap,
  ShieldCheck,
  ChevronRight,
  Flame,
  Layers,
  Bell,
  BellRing,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, YAxis, Tooltip } from 'recharts';
import { MainCategory } from '../types';
import { MARKET_ASSETS } from '../data/mockData';
import { usePriceAlerts } from '../context/PriceAlertsContext';
import { getSentimentLevelFromScore, getSentimentLevelInfo } from '../utils/priceAlerts';

export type SentimentViewCategory = 'ALLE' | MainCategory;

export type SentimentLevel =
  | 'EXTREME_FEAR'
  | 'FEAR'
  | 'NEUTRAL'
  | 'GREED'
  | 'EXTREME_GREED';

interface HistoryDataPoint {
  dayIndex: number;
  dateStr: string;
  score: number;
}

/**
 * Generates an authentic 30-day historical time-series for the Fear & Greed index
 * anchoring accurately on lastMonth, lastWeek, yesterday, and today's score.
 */
function generate30DaySentimentHistory(
  category: SentimentViewCategory,
  currentScore: number,
  yesterdayScore: number,
  lastWeekScore: number,
  lastMonthScore: number
): HistoryDataPoint[] {
  const points: HistoryDataPoint[] = [];
  const now = new Date(2026, 8, 23); // 23. September 2026
  const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - (29 - i));
    const dayStr = `${d.getDate()}. ${monthNames[d.getMonth()]}`;

    let base: number;
    if (i <= 22) {
      // Interpolate between day 0 (lastMonth) and day 22 (lastWeek)
      const t = i / 22;
      const linear = lastMonthScore + (lastWeekScore - lastMonthScore) * t;
      const wave = Math.sin(i * 0.65 + (category.charCodeAt(0) % 7)) * 3.2;
      base = linear + wave;
    } else if (i <= 28) {
      // Interpolate between day 22 (lastWeek) and day 28 (yesterday)
      const t = (i - 22) / 6;
      const linear = lastWeekScore + (yesterdayScore - lastWeekScore) * t;
      const wave = Math.cos(i * 0.8) * 1.8;
      base = linear + wave;
    } else {
      base = currentScore;
    }

    const rounded = Math.max(5, Math.min(98, Math.round(base)));
    points.push({
      dayIndex: i,
      dateStr: dayStr,
      score: rounded,
    });
  }

  // Exact anchor points alignment
  points[0].score = lastMonthScore;
  points[22].score = lastWeekScore;
  points[28].score = yesterdayScore;
  points[29].score = currentScore;

  return points;
}

// Custom interactive Tooltip for the Recharts Sparkline
interface SparklineTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: HistoryDataPoint }>;
}

const CustomSparklineTooltip: React.FC<SparklineTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const score = item.score;
    const level = getSentimentLevelFromScore(score);
    const info = getSentimentLevelInfo(level);

    return (
      <div className="bg-[#091129]/95 border border-slate-700/90 rounded-xl px-2.5 py-1.5 shadow-2xl backdrop-blur-md pointer-events-none text-xs font-mono">
        <div className="text-[10px] text-slate-400 font-sans">{item.dateStr}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="font-extrabold text-sm" style={{ color: info.color }}>
            {score}
          </span>
          <span
            className="text-[10px] px-1.5 py-0.2 rounded font-extrabold"
            style={{
              color: info.color,
              backgroundColor: info.bgColor,
            }}
          >
            {info.labelDe}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface SentimentData {
  score: number;
  level: SentimentLevel;
  labelDe: string;
  color: string;
  bgColor: string;
  borderColor: string;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  summary: string;
  keyDrivers: {
    title: string;
    score: number;
    description: string;
    trend: 'up' | 'down' | 'neutral';
  }[];
}

const CATEGORY_SENTIMENTS: Record<SentimentViewCategory, SentimentData> = {
  ALLE: {
    score: 68,
    level: 'GREED',
    labelDe: 'Gier',
    color: '#84CC16',
    bgColor: 'rgba(132, 204, 22, 0.12)',
    borderColor: 'rgba(132, 204, 22, 0.35)',
    yesterday: 63,
    lastWeek: 55,
    lastMonth: 44,
    summary:
      'Breiter Risikoappetit über alle Hauptmärkte. Starke Zuflüsse in Tech-Aktien und Krypto-Assets bei gleichzeitig moderater Volatilität im VIX.',
    keyDrivers: [
      {
        title: 'Marktbreite & Momentum',
        score: 75,
        description: '79% der beobachteten Assets notieren über ihrem 50-Tage-Durchschnitt.',
        trend: 'up',
      },
      {
        title: 'Volatilitäts-Regime (VIX/CVIX)',
        score: 66,
        description: 'VIX bei 13,8 Punkten signalisiert Entspannung im Optionsmarkt.',
        trend: 'up',
      },
      {
        title: 'KI News & Social NLP',
        score: 81,
        description: 'Über 100.000 Finanzquellen zeigen überwiegend optimistische Tonalität.',
        trend: 'up',
      },
      {
        title: 'Safe-Haven Allokation',
        score: 52,
        description: 'Gold konsolidiert auf Allzeithoch, Staatsanleihen-Nachfrage stabil.',
        trend: 'neutral',
      },
      {
        title: 'Derivate & Put/Call Ratio',
        score: 70,
        description: 'Call-Optionen überwiegen mit 1,38x deutlich gegenüber Absicherungen.',
        trend: 'up',
      },
    ],
  },
  KRYPTO: {
    score: 76,
    level: 'EXTREME_GREED',
    labelDe: 'Extreme Gier',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    yesterday: 71,
    lastWeek: 64,
    lastMonth: 52,
    summary:
      'Aggressive Akkumulation durch institutionelle ETFs und bullischer Derivate-Open-Interest treiben Bitcoin und Layer-1-Netzwerke an.',
    keyDrivers: [
      {
        title: 'BTC Dominanz & ETF-Zuflüsse',
        score: 84,
        description: 'Nettozuflüsse von über 420 Mio. $ in den letzten Handelstagen.',
        trend: 'up',
      },
      {
        title: 'Krypto-Volatilität (CVIX)',
        score: 72,
        description: 'Gesunde Volatilitätsausbrüche bei ansteigendem Handelsvolumen.',
        trend: 'up',
      },
      {
        title: 'Funding Rates (Perpetuals)',
        score: 78,
        description: 'Positive Funding Rates signalisieren dominante Long-Positionierung.',
        trend: 'up',
      },
      {
        title: 'Social Media Buzz & Sentiment',
        score: 83,
        description: 'Höchster Diskussionsumfang zu AI-Coins und DeFi seit 14 Monaten.',
        trend: 'up',
      },
      {
        title: 'Whale-Wallets Aktivität',
        score: 69,
        description: 'Netto-Abflüsse von zentralen Börsen auf Cold-Storage-Wallets.',
        trend: 'up',
      },
    ],
  },
  AKTIEN: {
    score: 65,
    level: 'GREED',
    labelDe: 'Gier',
    color: '#84CC16',
    bgColor: 'rgba(132, 204, 22, 0.12)',
    borderColor: 'rgba(132, 204, 22, 0.35)',
    yesterday: 62,
    lastWeek: 58,
    lastMonth: 48,
    summary:
      'Solide Unternehmensgewinne und anhaltende Nachfrage nach KI-Infrastruktur (Nvidia, Microsoft, SAP) stützen den Aktienmarkt.',
    keyDrivers: [
      {
        title: 'S&P 500 / NASDAQ Momentum',
        score: 73,
        description: 'Tech-Schwergewichte markieren neue Jahreshöchststände.',
        trend: 'up',
      },
      {
        title: 'CBOE Volatilitätsindex (VIX)',
        score: 64,
        description: 'VIX im Bereich von 13–14 signalisiert geringe Panik.',
        trend: 'neutral',
      },
      {
        title: 'Gewinnrevisionen & EPS',
        score: 68,
        description: '68% der Q3-Berichte übertreffen die Analystenprognosen.',
        trend: 'up',
      },
      {
        title: 'Retail vs Institutional Flow',
        score: 61,
        description: 'Stetige Sparplan-Zuflüsse und Buybacks der Unternehmen.',
        trend: 'neutral',
      },
      {
        title: 'High-Yield Credit Spreads',
        score: 65,
        description: 'Sehr enge Risikoaufschläge auf Unternehmensanleihen.',
        trend: 'up',
      },
    ],
  },
  INDIZIES: {
    score: 69,
    level: 'GREED',
    labelDe: 'Gier',
    color: '#84CC16',
    bgColor: 'rgba(132, 204, 22, 0.12)',
    borderColor: 'rgba(132, 204, 22, 0.35)',
    yesterday: 66,
    lastWeek: 59,
    lastMonth: 50,
    summary:
      'Leitindizes wie DAX 40 und S&P 500 zeigen kontinuierliche Trendfortsetzung mit breiter Beteiligung europäischer und US-Titel.',
    keyDrivers: [
      {
        title: 'Advance-Decline Linie',
        score: 72,
        description: 'Mehrheit der Indexmitglieder schließt im Plus.',
        trend: 'up',
      },
      {
        title: '52-Wochen-Hochs vs. Tiefs',
        score: 77,
        description: 'Deutlicher Überhang neuer Jahreshöchstkurse (4,2 : 1).',
        trend: 'up',
      },
      {
        title: 'Zins- und Notenbankerwartung',
        score: 62,
        description: 'Märkte preisen stabile bis leicht expansive Geldpolitik ein.',
        trend: 'neutral',
      },
      {
        title: 'Globaler Risikoindex',
        score: 67,
        description: 'Geringe geopolitische Risikoprämie in Leitindizes.',
        trend: 'neutral',
      },
      {
        title: 'Futures & Overnight-Volumen',
        score: 68,
        description: 'Stabile Liquidität im europäischen und US-Futures-Handel.',
        trend: 'up',
      },
    ],
  },
  ROHSTOFFE: {
    score: 52,
    level: 'NEUTRAL',
    labelDe: 'Neutral',
    color: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.35)',
    yesterday: 51,
    lastWeek: 49,
    lastMonth: 46,
    summary:
      'Ausgeglichene Marktlage. Rekordhohe Goldnachfrage balanciert eine verhaltene Industrienachfrage bei Rohöl und Kupfer aus.',
    keyDrivers: [
      {
        title: 'Gold & Edelmetalle Safe-Haven',
        score: 68,
        description: 'Zentralbankkäufe und ETF-Bestände bleiben auf Rekordniveau.',
        trend: 'up',
      },
      {
        title: 'Rohöl-Angebot (OPEC+ Quote)',
        score: 46,
        description: 'Disziplinierte Förderquoten halten Brent stabil zwischen 78-84 $.',
        trend: 'neutral',
      },
      {
        title: 'Kupfer & Industrie-Metalle',
        score: 50,
        description: 'Ausgeglichenes Verhältnis zwischen Angebot und Fertigungsnachfrage.',
        trend: 'neutral',
      },
      {
        title: 'Erdgas & saisonale Speicher',
        score: 48,
        description: 'Europäische Gasspeicher zu über 92% gefüllt.',
        trend: 'neutral',
      },
      {
        title: 'Agrarrohstoffe Ernteprognosen',
        score: 51,
        description: 'Solide Weizen- und Maisernten dämpfen Preisdruck.',
        trend: 'neutral',
      },
    ],
  },
  FOREX: {
    score: 58,
    level: 'NEUTRAL',
    labelDe: 'Leichte Gier',
    color: '#84CC16',
    bgColor: 'rgba(132, 204, 22, 0.12)',
    borderColor: 'rgba(132, 204, 22, 0.35)',
    yesterday: 57,
    lastWeek: 54,
    lastMonth: 50,
    summary:
      'Gefragte Risk-On Währungspaare (AUD, NZD, EUR) im Aufwind gegen den US-Dollar, gestützt durch nachlassende US-Renditeanstiege.',
    keyDrivers: [
      {
        title: 'US-Dollar Index (DXY)',
        score: 56,
        description: 'DXY konsolidiert unter 104 Punkten, erleichtert Carry-Trades.',
        trend: 'neutral',
      },
      {
        title: 'Zinsdifferenzen (G10 FX)',
        score: 62,
        description: 'Attraktive Renditespreads stützen EUR/USD und GBP/USD.',
        trend: 'up',
      },
      {
        title: 'Carry-Trade Sentiment',
        score: 60,
        description: 'Japanischer Yen (JPY) verbleibt in enger Spanne bei Niedrigzinsen.',
        trend: 'up',
      },
      {
        title: 'FX-Volatilität (CVIX FX)',
        score: 55,
        description: 'Historisch niedrige implizite Volatilität im Devisenmarkt.',
        trend: 'neutral',
      },
      {
        title: 'Liquiditätsindex Cross-Border',
        score: 59,
        description: 'Stabiler internationaler Zahlungs- und Handelsfluss.',
        trend: 'neutral',
      },
    ],
  },
};

const CATEGORIES_CONFIG: { id: SentimentViewCategory; label: string }[] = [
  { id: 'ALLE', label: 'Gesamtmarkt' },
  { id: 'KRYPTO', label: 'Krypto' },
  { id: 'AKTIEN', label: 'Aktien' },
  { id: 'INDIZIES', label: 'Indizes' },
  { id: 'ROHSTOFFE', label: 'Rohstoffe' },
  { id: 'FOREX', label: 'Forex' },
];

export const MarketSentiment: React.FC<{
  onStartAnalysis?: () => void;
  onExploreMarkets?: () => void;
}> = ({ onStartAnalysis, onExploreMarkets }) => {
  const { openAlertModalWithSentiment, simulateSentimentShift, sentimentAlerts } = usePriceAlerts();
  const [selectedCategory, setSelectedCategory] = useState<SentimentViewCategory>('ALLE');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [activeDriverIndex, setActiveDriverIndex] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentData = CATEGORY_SENTIMENTS[selectedCategory];

  // 30-Day Fear & Greed Time-Series Data using Recharts
  const thirtyDayHistory = useMemo(() => {
    return generate30DaySentimentHistory(
      selectedCategory,
      currentData.score,
      currentData.yesterday,
      currentData.lastWeek,
      currentData.lastMonth
    );
  }, [selectedCategory, currentData]);

  const { minScore, maxScore, thirtyDayDelta } = useMemo(() => {
    const scores = thirtyDayHistory.map((d) => d.score);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const delta = currentData.score - currentData.lastMonth;
    return {
      minScore: min,
      maxScore: max,
      thirtyDayDelta: delta,
    };
  }, [thirtyDayHistory, currentData]);

  // Live calculation from MARKET_ASSETS to augment display
  const liveStats = useMemo(() => {
    const assets =
      selectedCategory === 'ALLE'
        ? MARKET_ASSETS
        : MARKET_ASSETS.filter((a) => a.mainCategory === selectedCategory);
    const positiveCount = assets.filter((a) => a.isPositive).length;
    const positiveRatio = Math.round((positiveCount / (assets.length || 1)) * 100);
    const avgScore = Math.round(
      assets.reduce((sum, a) => sum + (a.aiScore || 70), 0) / (assets.length || 1)
    );
    return {
      total: assets.length,
      positiveRatio,
      avgScore,
    };
  }, [selectedCategory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Calculate rotation angle for gauge needle: 0 => -90 deg, 100 => +90 deg
  const needleRotation = -90 + (currentData.score / 100) * 180;

  // Level classification helpers
  const getLevelLabel = (score: number) => {
    if (score < 25) return { label: 'Extreme Angst', color: '#EF4444' };
    if (score < 45) return { label: 'Angst', color: '#F97316' };
    if (score < 55) return { label: 'Neutral', color: '#EAB308' };
    if (score < 75) return { label: 'Gier', color: '#84CC16' };
    return { label: 'Extreme Gier', color: '#10B981' };
  };

  const levelInfo = getLevelLabel(currentData.score);

  return (
    <section id="market-sentiment-section" className="px-5 py-6">
      <div className="rounded-3xl bg-[#091129]/95 border border-slate-800/90 shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-5 sm:p-6 backdrop-blur-md relative overflow-hidden">
        {/* Subtle background ambient radial light */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-20 transition-all duration-700"
          style={{ backgroundColor: currentData.color }}
        />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 font-mono">
                Marktstimmung &amp; Trendradar
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight flex items-center gap-2">
              Market Sentiment Index
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                Fear &amp; Greed
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openAlertModalWithSentiment(selectedCategory)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              title="Preis-Alerts und Benachrichtigungen an Markt-Sentiment koppeln"
            >
              <BellRing className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Sentiment-Alarm</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMethodologyOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Informationen zur Berechnung des Index"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Berechnung</span>
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              className={`p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Daten aktualisieren"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-3 border-b border-slate-800/60 relative z-10">
          {CATEGORIES_CONFIG.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const catScore = CATEGORY_SENTIMENTS[cat.id].score;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(249,191,33,0.35)] scale-[1.02]'
                    : 'bg-[#040919] text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-extrabold ${
                    isSelected
                      ? 'bg-black/20 text-black'
                      : 'bg-slate-800/90 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {catScore}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Indicator Body: Gauge + Sentiment Analytics Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center relative z-10">
          {/* Left: Semi-Circular Gauge Meter */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#030712]/80 border border-slate-800/90 relative">
            {/* SVG Arc Gauge */}
            <div className="relative w-64 h-36 sm:w-72 sm:h-40 flex items-end justify-center overflow-visible">
              <svg
                className="w-64 h-32 sm:w-72 sm:h-36 overflow-visible"
                viewBox="0 0 240 130"
              >
                <defs>
                  {/* Multi-stop Fear & Greed Arc Gradient */}
                  <linearGradient id="fearGreedArcGrad" x1="0%" y1="100%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="25%" stopColor="#F97316" />
                    <stop offset="50%" stopColor="#EAB308" />
                    <stop offset="75%" stopColor="#84CC16" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>

                  <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background Track Arc */}
                <path
                  d="M 20 120 A 100 100 0 0 1 220 120"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="16"
                  strokeLinecap="round"
                />

                {/* Colored Gradient Value Arc */}
                <path
                  d="M 20 120 A 100 100 0 0 1 220 120"
                  fill="none"
                  stroke="url(#fearGreedArcGrad)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  filter="url(#gaugeGlow)"
                  opacity="0.95"
                />

                {/* Scale Tick Marks */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const angle = (-180 + (val / 100) * 180) * (Math.PI / 180);
                  const x1 = 120 + 88 * Math.cos(angle);
                  const y1 = 120 + 88 * Math.sin(angle);
                  const x2 = 120 + 104 * Math.cos(angle);
                  const y2 = 120 + 104 * Math.sin(angle);
                  return (
                    <line
                      key={val}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#0F172A"
                      strokeWidth="2.5"
                    />
                  );
                })}

                {/* Needle / Pointer Group */}
                <g
                  transform={`rotate(${needleRotation}, 120, 120)`}
                  className="transition-transform duration-700 ease-out"
                >
                  {/* Needle Path */}
                  <polygon
                    points="120,38 123.5,116 116.5,116"
                    fill="#F8FAFC"
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.8))"
                  />
                  {/* Pivot center cap */}
                  <circle cx="120" cy="120" r="9" fill="#091129" stroke="#F8FAFC" strokeWidth="3" />
                  <circle cx="120" cy="120" r="4" fill={currentData.color} />
                </g>
              </svg>
            </div>

            {/* Score & Sentiment Classification Banner */}
            <div className="text-center mt-2">
              <div className="flex items-baseline justify-center gap-1.5">
                <span
                  className="text-4xl sm:text-5xl font-black font-mono tracking-tight"
                  style={{ color: levelInfo.color }}
                >
                  {currentData.score}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-400 font-mono">/100</span>
              </div>

              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mt-1 border"
                style={{
                  color: levelInfo.color,
                  backgroundColor: currentData.bgColor,
                  borderColor: currentData.borderColor,
                }}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{levelInfo.label}</span>
              </div>
            </div>

            {/* Scale Endpoints Labels */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-500 font-bold px-4 mt-2">
              <span className="text-rose-400">0 Angst</span>
              <span className="text-amber-400">50 Neutral</span>
              <span className="text-emerald-400">100 Gier</span>
            </div>

            {/* Historical Compare Footprint */}
            <div className="w-full grid grid-cols-3 gap-1.5 pt-3 mt-3 border-t border-slate-800 text-center text-xs">
              <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Gestern</span>
                <span className="font-mono font-bold text-slate-200">{currentData.yesterday}</span>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Vor 7 Tagen</span>
                <span className="font-mono font-bold text-slate-200">{currentData.lastWeek}</span>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Vor 30 Tagen</span>
                <span className="font-mono font-bold text-slate-200">{currentData.lastMonth}</span>
              </div>
            </div>

            {/* 30-Day Fear & Greed Sparkline Chart (Recharts) */}
            <div className="w-full mt-3.5 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] mb-2 px-1">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  30-Tage Verlauf
                </span>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-slate-400">
                    Delta:{' '}
                    <strong className={thirtyDayDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {thirtyDayDelta >= 0 ? `+${thirtyDayDelta}` : thirtyDayDelta} Pkt.
                    </strong>
                  </span>
                </div>
              </div>

              {/* Sparkline Canvas via Recharts */}
              <div className="h-20 w-full rounded-2xl bg-[#020510] p-2 border border-slate-800/80 relative overflow-hidden shadow-inner">
                {/* Subtle 50 Neutral Reference Guideline */}
                <div className="absolute left-0 right-0 top-1/2 border-b border-dashed border-slate-800/70 pointer-events-none z-0" />

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={thirtyDayHistory} margin={{ top: 4, right: 3, left: 3, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`fearGreedSparkGrad-${selectedCategory}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={currentData.color} stopOpacity={0.55} />
                        <stop offset="95%" stopColor={currentData.color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip content={<CustomSparklineTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke={currentData.color}
                      strokeWidth={2.2}
                      fillOpacity={1}
                      fill={`url(#fearGreedSparkGrad-${selectedCategory})`}
                      isAnimationActive={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Sparkline Baseline & Range Labels */}
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 px-1 mt-1.5">
                <span>{thirtyDayHistory[0]?.dateStr} ({thirtyDayHistory[0]?.score})</span>
                <span className="text-slate-400">
                  Min: <strong className="text-slate-300">{minScore}</strong> | Max: <strong className="text-slate-300">{maxScore}</strong>
                </span>
                <span className="font-bold" style={{ color: levelInfo.color }}>
                  Heute ({currentData.score})
                </span>
              </div>
            </div>
          </div>

          {/* Right: AI Synthesis Commentary & Live Metrics */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* AI Macro Synthesis Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c173b] to-[#080e24] border border-amber-500/30 relative">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    KI-Marktanalyse &amp; Regime
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded-full font-bold">
                  Risk-On Phase
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentData.summary}
              </p>

              {/* Real-time stats row from dataset */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Gewinner-Quote</span>
                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {liveStats.positiveRatio}% im Plus
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Ø KI-Scorer</span>
                  <span className="font-mono font-bold text-amber-300">
                    {liveStats.avgScore}/100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Live Assets</span>
                  <span className="font-mono font-bold text-white">
                    {liveStats.total} Werte
                  </span>
                </div>
              </div>
            </div>

            {/* Sentiment Coupling & Simulation Action Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-amber-950/30 border border-emerald-500/30 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <BellRing className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">
                        Preis-Alerts an Markt-Sentiment koppeln
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded">
                        Multi-Faktor
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Benachrichtigung bei signifikantem Stimmungswechsel (z.B. von &apos;Fear&apos; auf &apos;Extreme Greed&apos;)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {/* Immediate Simulation Button as requested */}
                  <button
                    type="button"
                    onClick={() => simulateSentimentShift('FEAR', 'EXTREME_GREED', selectedCategory)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    title="Simuliert sofort einen Wechsel von Fear auf Extreme Greed mit akustischem Signal und Banner"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Test: Fear ➔ Extreme Greed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openAlertModalWithSentiment(selectedCategory)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Alarm koppeln</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 5 Core Sentiment Drivers List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
                <span>Wesentliche Sentiment-Faktoren</span>
                <span className="text-[11px] font-mono text-slate-500">Einfluss &amp; Wert</span>
              </div>

              <div className="space-y-1.5">
                {currentData.keyDrivers.map((driver, idx) => {
                  const isExpanded = activeDriverIndex === idx;
                  const driverLevel = getLevelLabel(driver.score);

                  return (
                    <div
                      key={driver.title}
                      onClick={() => setActiveDriverIndex(isExpanded ? null : idx)}
                      className="p-2.5 rounded-xl bg-[#040a1c] hover:bg-[#07112e] border border-slate-800/90 hover:border-slate-700 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: driverLevel.color }}
                          />
                          <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                            {driver.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {/* Mini Progress Bar */}
                          <div className="hidden xs:block w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${driver.score}%`,
                                backgroundColor: driverLevel.color,
                              }}
                            />
                          </div>

                          <span
                            className="text-xs font-mono font-bold px-1.5 py-0.2 rounded"
                            style={{
                              color: driverLevel.color,
                              backgroundColor: `${driverLevel.color}15`,
                            }}
                          >
                            {driver.score}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                              isExpanded ? 'rotate-90 text-amber-400' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* Expandable Explanation */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300"
                          >
                            <p>{driver.description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-Faktor Validierung aktiv</span>
              </div>

              <div className="flex items-center gap-2">
                {onExploreMarkets && (
                  <button
                    type="button"
                    onClick={onExploreMarkets}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-all cursor-pointer"
                  >
                    Märkte durchsuchen
                  </button>
                )}
                {onStartAnalysis && (
                  <button
                    type="button"
                    onClick={onStartAnalysis}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(249,191,33,0.25)] transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>KI-Analyse starten</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Modal */}
      <AnimatePresence>
        {isMethodologyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#091129] border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Methodik &amp; Berechnung</h3>
                    <p className="text-xs text-slate-400">AIF Market Sentiment Index (0-100)</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMethodologyOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
                <p>
                  Der <strong>AIF Market Sentiment Index</strong> misst die kollektive Emotion
                  und das Risikoverhalten der Marktteilnehmer auf einer Skala von 0 (Extreme Panik/Angst)
                  bis 100 (Extreme Euphorie/Gier).
                </p>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-300 text-xs">5 Gewichtete Kernquellen:</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li><strong>Kursmomentum &amp; MA 50/200 (25%):</strong> Abweichung der Leitkurse von ihren historischen Durchschnittslinien.</li>
                    <li><strong>Volatilitäts-Regime (20%):</strong> CBOE VIX und Crypto VIX im Verhältnis zum 30-Tage-Mittel.</li>
                    <li><strong>Derivate-Positionierung &amp; Put/Call (20%):</strong> Verhältnis von Call- zu Put-Optionen und Perpetual Funding Rates.</li>
                    <li><strong>KI NLP News Sentiment (20%):</strong> Sprachmodell-Analyse von über 100.000 Echtzeit-Newsfeeds und Foren.</li>
                    <li><strong>Safe-Haven vs Risk-Assets (15%):</strong> Kapitalströme in Gold &amp; Anleihen versus Tech &amp; Krypto.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-200">
                  <p className="font-bold mb-1">💡 Contrarian Trading Leitfaden:</p>
                  <p className="text-[11px] leading-normal">
                    Historisch betrachtet bieten Phasen <em>extremer Angst (&lt; 25)</em> oft attraktive antizyklische
                    Einstiegsgelegenheiten, während <em>extreme Gier (&gt; 75)</em> zu erhöhtem Risikobewusstsein und
                    Gewinnmitnahmen mahnt.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsMethodologyOpen(false)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs cursor-pointer"
                >
                  Verstanden
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
