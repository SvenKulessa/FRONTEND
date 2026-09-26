/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Data Transformation Node Contracts (9 Nodes)
 */

import { z } from 'zod';
import { AssetClassSchema, NodePort } from '../common';

// 1. canonical_normalizer
export const CanonicalNormalizerConfigSchema = z.object({
  targetFormat: z.enum(['standard_l1_tick', 'standard_l2_depth', 'standard_ohlcv_candle']),
  enforceNanNullCheck: z.boolean().default(true),
  timestampNormalization: z.enum(['nanoseconds', 'milliseconds', 'microseconds']).default('nanoseconds'),
});
export type CanonicalNormalizerConfig = z.infer<typeof CanonicalNormalizerConfigSchema>;

// 2. asset_resolver (AP-003)
export const AssetResolverConfigSchema = z.object({
  primaryIdentifier: z.enum(['ticker', 'isin', 'figi', 'coingecko_id', 'ccxt_symbol']),
  caseInsensitive: z.boolean().default(true),
  stripExchangePrefix: z.boolean().default(false),
  fallbackAliasMap: z.record(z.string(), z.string()).optional(),
});
export type AssetResolverConfig = z.infer<typeof AssetResolverConfigSchema>;

// 3. taxonomy_router (AP-003)
export const TaxonomyRouterConfigSchema = z.object({
  routingRules: z.array(
    z.object({
      targetAssetClass: AssetClassSchema,
      downstreamPortId: z.string().min(1),
    })
  ),
  defaultRoutePortId: z.string().min(1).default('default_unclassified'),
});
export type TaxonomyRouterConfig = z.infer<typeof TaxonomyRouterConfigSchema>;

// 4. timeframe_resampler
export const TimeframeResamplerConfigSchema = z.object({
  targetTimeframe: z.enum(['1s', '5s', '15s', '1m', '5m', '15m', '1h', '4h', '1d']),
  aggregationStyle: z.enum(['time_bucketed', 'tick_volume_bucketed', 'dollar_volume_bucketed']),
  volumeBarSize: z.number().positive().optional(),
  emitPartialCandleOnUpdate: z.boolean().default(false),
});
export type TimeframeResamplerConfig = z.infer<typeof TimeframeResamplerConfigSchema>;

// 5. currency_converter
export const CurrencyConverterConfigSchema = z.object({
  baseCurrency: z.string().min(3).max(5).default('USD'),
  targetQuoteCurrency: z.enum(['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'BTC', 'ETH']).default('EUR'),
  fxUpdateFrequencySeconds: z.number().int().min(1).max(3600).default(60),
});
export type CurrencyConverterConfig = z.infer<typeof CurrencyConverterConfigSchema>;

// 6. unit_converter
export const UnitConverterConfigSchema = z.object({
  volumeUnit: z.enum(['base_shares', 'lots', 'satoshis', 'wei', 'fractional_coin']),
  decimalPlaces: z.number().int().min(0).max(18).default(8),
  roundPolicy: z.enum(['half_up', 'floor', 'ceil', 'truncate']).default('half_up'),
});
export type UnitConverterConfig = z.infer<typeof UnitConverterConfigSchema>;

// 7. outlier_winsorizer
export const OutlierWinsorizerConfigSchema = z.object({
  winsorizeLowerPercentile: z.number().min(0).max(10).default(0.5),
  winsorizeUpperPercentile: z.number().min(90).max(100).default(99.5),
  maxAllowedZScore: z.number().min(2).max(10).default(4.0),
  flashCrashJitterDropPercent: z.number().min(1).max(30).default(5.0),
});
export type OutlierWinsorizerConfig = z.infer<typeof OutlierWinsorizerConfigSchema>;

// 8. feature_builder
export const FeatureBuilderConfigSchema = z.object({
  slidingWindowSize: z.number().int().min(5).max(1000).default(50),
  enabledFeatures: z.array(
    z.enum([
      'log_returns',
      'rolling_volatility',
      'skewness_kurtosis',
      'volume_imbalance',
      'bid_ask_spread_bps',
      'trade_intensity',
    ])
  ).min(1),
});
export type FeatureBuilderConfig = z.infer<typeof FeatureBuilderConfigSchema>;

// 9. enrichment_join
export const EnrichmentJoinConfigSchema = z.object({
  joinType: z.enum(['asof_left', 'exact_timestamp', 'windowed_outer']),
  maxToleranceMs: z.number().int().min(10).max(300000).default(5000),
  secondaryFeedId: z.string().min(1),
  fieldsToMerge: z.array(z.string()).min(1),
});
export type EnrichmentJoinConfig = z.infer<typeof EnrichmentJoinConfigSchema>;

// Transformation Ports Factory
export const TRANSFORMATION_PORTS: Record<string, NodePort[]> = {
  canonical_normalizer: [
    { id: 'in_raw', name: 'Raw Inbound', type: 'tick_stream', direction: 'in', required: true },
    { id: 'out_normalized', name: 'Normalized Stream', type: 'tick_stream', direction: 'out', required: true },
  ],
  timeframe_resampler: [
    { id: 'in_ticks', name: 'Tick Stream', type: 'tick_stream', direction: 'in', required: true },
    { id: 'out_candles', name: 'OHLCV Candles', type: 'ohlcv_candle', direction: 'out', required: true },
  ],
  feature_builder: [
    { id: 'in_candles', name: 'OHLCV Stream', type: 'ohlcv_candle', direction: 'in', required: true },
    { id: 'out_features', name: 'Feature Vector', type: 'feature_vector', direction: 'out', required: true },
  ],
};
