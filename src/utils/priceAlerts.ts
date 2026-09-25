import {
  PriceAlert,
  UserAlertPreferences,
  MainCategory,
  SentimentLevel,
  SentimentAlert,
  TelegramConfig,
} from '../types';
import { DEFAULT_TELEGRAM_CONFIG } from './telegramService';

/**
 * Maps a numeric sentiment score (0-100) to a SentimentLevel.
 */
export function getSentimentLevelFromScore(score: number): SentimentLevel {
  if (score < 25) return 'EXTREME_FEAR';
  if (score < 45) return 'FEAR';
  if (score < 55) return 'NEUTRAL';
  if (score < 75) return 'GREED';
  return 'EXTREME_GREED';
}

export function getSentimentLevelInfo(level: SentimentLevel): {
  labelDe: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  switch (level) {
    case 'EXTREME_FEAR':
      return {
        labelDe: 'Extreme Angst',
        color: '#EF4444',
        bgColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: 'rgba(239, 68, 68, 0.4)',
      };
    case 'FEAR':
      return {
        labelDe: 'Angst',
        color: '#F97316',
        bgColor: 'rgba(249, 115, 22, 0.15)',
        borderColor: 'rgba(249, 115, 22, 0.4)',
      };
    case 'NEUTRAL':
      return {
        labelDe: 'Neutral',
        color: '#EAB308',
        bgColor: 'rgba(234, 179, 8, 0.15)',
        borderColor: 'rgba(234, 179, 8, 0.4)',
      };
    case 'GREED':
      return {
        labelDe: 'Gier',
        color: '#84CC16',
        bgColor: 'rgba(132, 204, 22, 0.15)',
        borderColor: 'rgba(132, 204, 22, 0.4)',
      };
    case 'EXTREME_GREED':
      return {
        labelDe: 'Extreme Gier',
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: 'rgba(16, 185, 129, 0.4)',
      };
  }
}

/**
 * Parses numeric price value from market asset strings such as:
 * '$64.280,00', '€18.420,50', '$2.342,80', '1,0892', '155,40', '$4,48/lb', '€224,50/t'
 */
export function parsePriceToNumber(valStr: string): number {
  if (!valStr) return 0;
  let clean = valStr.trim();
  // Strip units after slash (e.g. /lb, /t, /bu, /gal, /cwt, MYR/t)
  clean = clean.split('/')[0].trim();
  // Strip currency prefixes and suffixes
  clean = clean.replace(/[$€£¥]/g, '').trim();
  clean = clean.replace(/[a-zA-Z]/g, '').trim();

  // Handle German number formatting: dot as thousand separator, comma as decimal separator
  if (clean.includes(',') && clean.includes('.')) {
    // Standard German: 64.280,00
    clean = clean.replace(/\./g, '').replace(',', '.');
  } else if (clean.includes(',')) {
    // Only comma used as decimal separator: 1,0892 or 155,40
    clean = clean.replace(',', '.');
  } else if (clean.includes('.')) {
    // US formatted or dot without comma
    const parts = clean.split('.');
    if (parts.length > 2) {
      clean = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
    }
  }

  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

/**
 * Formats a numeric price using the asset currency prefix ($ or € or £ or plain).
 */
export function formatCurrencyPrice(val: number, originalSample: string = '$'): string {
  const isEuro = originalSample.includes('€');
  const isPound = originalSample.includes('£');
  const hasDollar = originalSample.includes('$');
  const prefix = isEuro ? '€' : isPound ? '£' : hasDollar ? '$' : '';

  let formattedNumber: string;
  if (val >= 1000) {
    formattedNumber = val.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else if (val >= 1) {
    formattedNumber = val.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  } else {
    formattedNumber = val.toLocaleString('de-DE', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  }

  return prefix ? `${prefix}${formattedNumber}` : formattedNumber;
}

/**
 * Plays a pleasant, two-tone crystal chime using the Web Audio API.
 * Does not depend on any external audio files.
 */
export function playAlertChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Tone 1: High crisp frequency (E5: ~659 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: Ascending harmonic (B5: ~987 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // Ignore audio context errors in restricted iframe environments
  }
}

export const DEFAULT_ALERT_PREFERENCES: UserAlertPreferences = {
  inAppNotifications: true,
  soundEnabled: true,
  emailDigest: true,
  pushSimulation: true,
  autoCheckIntervalSec: 10,
  telegram: DEFAULT_TELEGRAM_CONFIG,
};

export const INITIAL_PRICE_ALERTS: PriceAlert[] = [
  {
    id: 'alert-btc-68k',
    assetId: 'btc',
    assetSymbol: 'BTC',
    assetName: 'Bitcoin',
    assetCategory: 'KRYPTO',
    targetPrice: 68000,
    initialPrice: 64280,
    currentPrice: 64280,
    direction: 'ABOVE',
    note: 'Ausbruch über Allzeit-Widerstandszone',
    isEnabled: true,
    isTriggered: false,
    createdAt: '2026-09-20T10:00:00.000Z',
    formattedTarget: '$68.000,00',
    sentimentCoupling: {
      enabled: true,
      requiredSentiment: 'EXTREME_GREED',
      targetRegime: 'Gekoppelt mit Sentiment: Extreme Gier (> 75)',
      triggerOnSentimentShift: true,
      category: 'KRYPTO',
    },
  },
  {
    id: 'alert-nvda-135',
    assetId: 'stock-nvda',
    assetSymbol: 'NVDA',
    assetName: 'NVIDIA Corp.',
    assetCategory: 'AKTIEN',
    targetPrice: 135,
    initialPrice: 128.4,
    currentPrice: 128.4,
    direction: 'ABOVE',
    note: 'KI-Blackwell Nachfragezyklus & Re-Test',
    isEnabled: true,
    isTriggered: false,
    createdAt: '2026-09-21T14:30:00.000Z',
    formattedTarget: '$135,00',
    sentimentCoupling: {
      enabled: true,
      requiredSentiment: 'ANY_GREED',
      targetRegime: 'Nur in bullischer Marktphase (Gier)',
      triggerOnSentimentShift: false,
      category: 'AKTIEN',
    },
  },
  {
    id: 'alert-gold-2400',
    assetId: 'com-gold',
    assetSymbol: 'XAU/USD',
    assetName: 'Gold Spot',
    assetCategory: 'ROHSTOFFE',
    targetPrice: 2400,
    initialPrice: 2342.8,
    currentPrice: 2342.8,
    direction: 'ABOVE',
    note: 'Zentralbankenkäufe & Safe-Haven Rallye',
    isEnabled: true,
    isTriggered: false,
    createdAt: '2026-09-22T08:15:00.000Z',
    formattedTarget: '$2.400,00',
    sentimentCoupling: {
      enabled: true,
      requiredSentiment: 'ANY_FEAR',
      targetRegime: 'Safe-Haven Einstieg bei Angst am Gesamtmarkt',
      triggerOnSentimentShift: true,
      category: 'ALLE',
    },
  },
  {
    id: 'alert-eurusd-10800',
    assetId: 'fx-eurusd',
    assetSymbol: 'EUR/USD',
    assetName: 'Euro / US-Dollar',
    assetCategory: 'FOREX',
    targetPrice: 1.08,
    initialPrice: 1.0892,
    currentPrice: 1.0892,
    direction: 'BELOW',
    note: 'EZB Zinsentscheid Untergrenze',
    isEnabled: true,
    isTriggered: false,
    createdAt: '2026-09-22T11:45:00.000Z',
    formattedTarget: '1,0800',
  },
  {
    id: 'alert-eth-3400',
    assetId: 'eth',
    assetSymbol: 'ETH',
    assetName: 'Ethereum',
    assetCategory: 'KRYPTO',
    targetPrice: 3400,
    initialPrice: 3350,
    currentPrice: 3512,
    direction: 'ABOVE',
    note: 'ETF Zuflüsse Auslöser',
    isEnabled: false,
    isTriggered: true,
    triggeredAt: 'Vor 15 Min',
    createdAt: '2026-09-19T09:00:00.000Z',
    formattedTarget: '$3.400,00',
  },
];

export const INITIAL_SENTIMENT_ALERTS: SentimentAlert[] = [
  {
    id: 'sent-alert-market-greed',
    type: 'SENTIMENT',
    category: 'ALLE',
    categoryLabel: 'Gesamtmarkt',
    conditionType: 'TRANSITION_FROM_TO',
    fromLevel: 'FEAR',
    targetLevel: 'EXTREME_GREED',
    note: 'Wechsel von Fear auf Extreme Greed – Signal für Risikobewusstsein & Gewinnmitnahmen',
    isEnabled: true,
    isTriggered: false,
    createdAt: '2026-09-21T09:00:00.000Z',
    title: 'Gesamtmarkt: Fear ➔ Extreme Greed',
    description: 'Benachrichtigung bei Übergang aus der Angstzone direkt in extreme Euphorie (> 75 Score).',
  },
  {
    id: 'sent-alert-crypto-extreme-greed',
    type: 'SENTIMENT',
    category: 'KRYPTO',
    categoryLabel: 'Kryptomarkt',
    conditionType: 'TRANSITION_TO',
    targetLevel: 'EXTREME_GREED',
    coupledAssetSymbol: 'BTC',
    coupledAssetName: 'Bitcoin',
    note: 'Krypto-Sentiment übersteigt 75 (Extreme Gier) – Rebalancing für Bitcoin & Altcoins',
    isEnabled: true,
    isTriggered: false,
    createdAt: '2026-09-22T12:00:00.000Z',
    title: 'Krypto: Erreichen von "Extreme Greed"',
    description: 'Löst aus, wenn der Krypto Fear & Greed Index in den überkauften Bereich vordringt.',
  },
  {
    id: 'sent-alert-panic-dip',
    type: 'SENTIMENT',
    category: 'ALLE',
    categoryLabel: 'Gesamtmarkt',
    conditionType: 'TRANSITION_TO',
    targetLevel: 'EXTREME_FEAR',
    targetScore: 25,
    scoreDirection: 'BELOW',
    note: 'Panikphase im Markt (Score < 25) – Antizyklische DCA Einstiegsgelegenheit',
    isEnabled: true,
    isTriggered: false,
    createdAt: '2026-09-20T16:00:00.000Z',
    title: 'Contrarian Dip-Alert: Extreme Angst (< 25)',
    description: 'Automatische Alarmierung, wenn Marktteilnehmer in Panik geraten für strategische Nachkäufe.',
  },
];
