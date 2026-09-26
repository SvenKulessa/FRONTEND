/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Models, Pattern Recognition & Reasoning Node Contracts
 */

import { z } from 'zod';
import { NodePort } from '../common';

// 1. pattern_recognition
export const PatternRecognitionConfigSchema = z.object({
  detectedPatterns: z.array(
    z.enum([
      'head_and_shoulders',
      'double_top_bottom',
      'bull_bear_flag',
      'wyckoff_accumulation',
      'order_block_imbalance',
      'fair_value_gap',
    ])
  ).min(1),
  minConfidencePercent: z.number().min(50).max(100).default(80),
  lookbackBars: z.number().int().min(20).max(500).default(120),
});
export type PatternRecognitionConfig = z.infer<typeof PatternRecognitionConfigSchema>;

// 2. regime_classifier
export const RegimeClassifierConfigSchema = z.object({
  modelType: z.enum(['hidden_markov_model', 'garch_volatility', 'trend_range_filter']),
  numStates: z.number().int().min(2).max(5).default(3), // Bullish Trend, Range Bound, High Vol Panic
  recalculationIntervalBars: z.number().int().min(1).max(50).default(5),
});
export type RegimeClassifierConfig = z.infer<typeof RegimeClassifierConfigSchema>;

// 3. anomaly_detector
export const AnomalyDetectorConfigSchema = z.object({
  algorithm: z.enum(['isolation_forest', 'autoencoder_reconstruction', 'dynamic_zscore']),
  sensitivityStdDevs: z.number().min(2).max(6).default(3.5),
  cooldownPeriodMs: z.number().int().min(1000).max(3600000).default(60000),
});
export type AnomalyDetectorConfig = z.infer<typeof AnomalyDetectorConfigSchema>;

// 4. llm_reasoner (Policy bounded AP-008)
export const LlmReasonerConfigSchema = z.object({
  model: z.enum(['gemini-2.5-flash', 'gemini-1.5-pro', 'claude-3-5-sonnet']),
  structuredOutputSchemaName: z.enum(['MarketHypothesis', 'RiskAuditReport', 'ExecutiveSummary']),
  temperature: z.number().min(0.0).max(1.0).default(0.1),
  strictFactGrounding: z.boolean().default(true),
  maxTokens: z.number().int().min(100).max(4000).default(1000),
});
export type LlmReasonerConfig = z.infer<typeof LlmReasonerConfigSchema>;

export const REASONING_PORTS: Record<string, NodePort[]> = {
  pattern_recognition: [
    { id: 'in_candles', name: 'Candle Input', type: 'ohlcv_candle', direction: 'in', required: true },
    { id: 'out_pattern_signals', name: 'Pattern Signals', type: 'signal_event', direction: 'out', required: true },
  ],
  regime_classifier: [
    { id: 'in_candles', name: 'Candle Input', type: 'ohlcv_candle', direction: 'in', required: true },
    { id: 'out_regime', name: 'Regime State', type: 'score_metric', direction: 'out', required: true },
  ],
};
