/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Analytics, Scoring & Indicator Node Contracts
 */

import { z } from 'zod';
import { NodePort } from '../common';

// 1. orderflow_delta
export const OrderflowDeltaConfigSchema = z.object({
  calculationMode: z.enum(['cumulative_volume_delta', 'bar_delta', 'order_book_imbalance']),
  depthLevels: z.number().int().min(1).max(50).default(10),
  imbalanceRatioThreshold: z.number().min(1.5).max(10.0).default(3.0),
  resetSessionDaily: z.boolean().default(true),
});
export type OrderflowDeltaConfig = z.infer<typeof OrderflowDeltaConfigSchema>;

// 2. vwap_bands
export const VwapBandsConfigSchema = z.object({
  anchorPeriod: z.enum(['session', 'week', 'month', 'year', 'rolling_window']),
  standardDeviations: z.array(z.number().positive()).default([1.0, 2.0, 3.0]),
  includeTwap: z.boolean().default(true),
});
export type VwapBandsConfig = z.infer<typeof VwapBandsConfigSchema>;

// 3. volatility_surface
export const VolatilitySurfaceConfigSchema = z.object({
  model: z.enum(['black_scholes', 'sabr', 'svi', 'historical_parkinson']),
  riskFreeRate: z.number().min(0).max(0.2).default(0.045),
  calculateGreeks: z.boolean().default(true),
  minMaturityDays: z.number().int().min(1).default(7),
});
export type VolatilitySurfaceConfig = z.infer<typeof VolatilitySurfaceConfigSchema>;

// 4. macro_credit
export const MacroCreditConfigSchema = z.object({
  metricsToCompute: z.array(z.enum(['altman_zscore', 'piotroski_fscore', 'beneish_mscore', 'yield_spread'])).min(1),
  financialDataCadence: z.enum(['quarterly', 'ttm', 'annual']).default('ttm'),
  distressThresholdZScore: z.number().default(1.81),
});
export type MacroCreditConfig = z.infer<typeof MacroCreditConfigSchema>;

// 5. sentiment_nlp
export const SentimentNlpConfigSchema = z.object({
  modelEngine: z.enum(['finbert_local', 'gemini_flash_sentiment', 'vader_lexicon']),
  confidenceThreshold: z.number().min(0.5).max(1.0).default(0.75),
  aggregateHorizonHours: z.number().int().min(1).max(168).default(24),
  extractEntities: z.boolean().default(true),
});
export type SentimentNlpConfig = z.infer<typeof SentimentNlpConfigSchema>;

// 6. smart_money_tracker
export const SmartMoneyTrackerConfigSchema = z.object({
  minUsdThreshold: z.number().positive().default(250000), // $250k min block
  trackDarkPoolAts: z.boolean().default(true),
  trackOnChainWhales: z.boolean().default(true),
  chainNetworks: z.array(z.string()).default(['ethereum', 'solana']),
});
export type SmartMoneyTrackerConfig = z.infer<typeof SmartMoneyTrackerConfigSchema>;

// 7. multi_factor_score (Produces Explainable Scores AP-002)
export const MultiFactorScoreConfigSchema = z.object({
  weights: z.object({
    technicalWeight: z.number().min(0).max(1).default(0.35),
    fundamentalWeight: z.number().min(0).max(1).default(0.25),
    sentimentWeight: z.number().min(0).max(1).default(0.20),
    onChainSmartMoneyWeight: z.number().min(0).max(1).default(0.20),
  }),
  scale: z.enum(['0_to_100', 'z_score_normalized', 'decile_rank']).default('0_to_100'),
  requireAllFactorsForOutput: z.boolean().default(true),
  explainabilityAuditDrawer: z.boolean().default(true),
});
export type MultiFactorScoreConfig = z.infer<typeof MultiFactorScoreConfigSchema>;

// Analytics Ports Factory
export const ANALYTICS_PORTS: Record<string, NodePort[]> = {
  orderflow_delta: [
    { id: 'in_l2', name: 'L2 Depth', type: 'orderbook_l2', direction: 'in', required: true },
    { id: 'out_cvd', name: 'CVD Metric', type: 'score_metric', direction: 'out', required: true },
  ],
  multi_factor_score: [
    { id: 'in_features', name: 'Feature Stream', type: 'feature_vector', direction: 'in', required: true },
    { id: 'out_score', name: 'Synthesized Score', type: 'score_metric', direction: 'out', required: true },
  ],
};
