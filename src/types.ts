export type MainCategory = 'KRYPTO' | 'AKTIEN' | 'INDIZIES' | 'FOREX' | 'ROHSTOFFE';

export interface AssetSubclass {
  id: string;
  name: string;
  shortDesc: string;
  examples: string[];
  trending?: string;
}

export interface AssetClassInfo {
  id: MainCategory;
  name: string;
  color: string;
  description: string;
  subclasses: AssetSubclass[];
}

export interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  value: string;
  change: string;
  isPositive: boolean;
  mainCategory: MainCategory;
  subclassId?: string;
  subclassName?: string;
  iconType: 'trend' | 'bitcoin' | 'gold' | 'forex' | 'stock' | 'crypto' | 'commodity' | 'index';
  sparklinePath: string;
  glowColor: string;
  borderColor: string;
  waveColor: string;
  category: string;
  high24h: string;
  low24h: string;
  volume24h: string;
  aiScore: number;
  aiRating: string;
  description: string;
}

export interface CoreModule {
  id: string;
  title: string;
  description: string;
  iconType: 'brain' | 'leaf' | 'book' | 'news';
  tagline: string;
  brandColor?: string; // Hex color from Brand Manifest v6.0
  accentColor?: string;
  details: {
    features: string[];
    useCase: string;
    sampleMetrics: { label: string; value: string; score?: string }[];
    newsItems?: { headline: string; source: string; time: string; sentiment: 'bullish' | 'bearish' | 'neutral'; impact: string }[];
  };
}

export interface KeyPillar {
  id: string;
  title: string;
  iconType: 'coins' | 'ai-brain' | 'users' | 'globe';
  color: string;
}

export type AlertCondition = 'ABOVE' | 'BELOW';

export type SentimentLevel =
  | 'EXTREME_FEAR'
  | 'FEAR'
  | 'NEUTRAL'
  | 'GREED'
  | 'EXTREME_GREED';

export type SentimentConditionType =
  | 'TRANSITION_TO'     // Triggered when sentiment transitions to a target level
  | 'TRANSITION_FROM_TO' // Triggered on specific transition (e.g., FEAR -> EXTREME_GREED)
  | 'SCORE_ABOVE'       // Triggered when sentiment score rises above threshold
  | 'SCORE_BELOW'       // Triggered when sentiment score falls below threshold
  | 'REGIME_CHANGE';    // Triggered on any regime flip between Fear and Greed

export interface PriceAlertSentimentCoupling {
  enabled: boolean;
  requiredSentiment?: SentimentLevel | 'ANY_GREED' | 'ANY_FEAR';
  triggerOnSentimentShift?: boolean;
  targetRegime?: string;
  category?: 'ALLE' | MainCategory;
}

export interface PriceAlert {
  id: string;
  assetId: string;
  assetSymbol: string;
  assetName: string;
  assetCategory: MainCategory;
  targetPrice: number;
  initialPrice: number;
  currentPrice: number;
  direction: AlertCondition;
  note?: string;
  isEnabled: boolean;
  isTriggered: boolean;
  triggeredAt?: string;
  createdAt: string;
  formattedTarget: string;
  sentimentCoupling?: PriceAlertSentimentCoupling;
}

export interface SentimentAlert {
  id: string;
  type: 'SENTIMENT';
  category: 'ALLE' | MainCategory;
  categoryLabel: string;
  conditionType: SentimentConditionType;
  targetLevel?: SentimentLevel;
  fromLevel?: SentimentLevel;
  targetScore?: number;
  scoreDirection?: 'ABOVE' | 'BELOW';
  coupledAssetSymbol?: string;
  coupledAssetName?: string;
  note?: string;
  isEnabled: boolean;
  isTriggered: boolean;
  triggeredAt?: string;
  createdAt: string;
  title: string;
  description: string;
  triggerDetail?: string;
}

export type AlertToastData =
  | {
      type: 'PRICE';
      alert: PriceAlert;
    }
  | {
      type: 'SENTIMENT';
      sentimentAlert: SentimentAlert;
    };

export interface UserAlertPreferences {
  inAppNotifications: boolean;
  soundEnabled: boolean;
  emailDigest: boolean;
  pushSimulation: boolean;
  autoCheckIntervalSec: number;
  sentimentAlertsEnabled?: boolean;
}

