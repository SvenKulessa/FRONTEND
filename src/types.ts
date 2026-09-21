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
