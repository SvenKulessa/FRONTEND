export interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconType: 'trend' | 'bitcoin' | 'gold' | 'forex';
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
  iconType: 'brain' | 'leaf' | 'book';
  tagline: string;
  details: {
    features: string[];
    useCase: string;
    sampleMetrics: { label: string; value: string; score?: string }[];
  };
}

export interface KeyPillar {
  id: string;
  title: string;
  iconType: 'coins' | 'ai-brain' | 'users' | 'globe';
  color: string;
}
