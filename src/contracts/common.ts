/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Common Domain Definitions, Lifecycles, Taxonomy & Evidence Types
 */

import { z } from 'zod';

// =============================================================================
// WORKFLOW LIFECYCLE & EXECUTION MODES
// =============================================================================

export const WorkflowLifecycleSchema = z.enum([
  'draft',
  'validated',
  'benchmarked',
  'shadow',
  'canary',
  'production',
  'deprecated',
  'archived',
]);
export type WorkflowLifecycle = z.infer<typeof WorkflowLifecycleSchema>;

export const ExecutionModeSchema = z.enum([
  'research',
  'shadow',
  'paper',
  'production',
  'execution_eligible',
]);
export type ExecutionMode = z.infer<typeof ExecutionModeSchema>;

// =============================================================================
// ASSET TAXONOMY & SUBCLASSES (AP-003)
// =============================================================================

export const AssetClassSchema = z.enum([
  'crypto',
  'equity_us',
  'equity_eu',
  'commodities',
  'forex',
  'fixed_income',
]);
export type AssetClass = z.infer<typeof AssetClassSchema>;

export const AssetSubclassSchema = z.enum([
  // Crypto
  'defi_protocol',
  'layer1_layer2',
  'perpetual_future',
  'meme_ai_token',
  // US Equities
  'us_megacap_tech',
  'sp500_component',
  'us_growth_smallcap',
  'semiconductor_ai',
  // EU Equities
  'dax40_bluechip',
  'eurostoxx50',
  'dividend_aristocrat',
  'green_energy_industrial',
  // Commodities
  'precious_metal',
  'energy_crude_gas',
  'industrial_metal',
  // Forex
  'fx_g10_major',
  'fx_minor',
  'fx_exotic_carry',
  // Fixed Income
  'sovereign_yield_10y_2y',
  'german_bund',
  'credit_spread',
]);
export type AssetSubclass = z.infer<typeof AssetSubclassSchema>;

// =============================================================================
// DATA TIERS & LATENCY GUARANTEES
// =============================================================================

export const DataTierSchema = z.enum(['tier0', 'tier1', 'tier2', 'tier3', 'tier4']);
export type DataTier = z.infer<typeof DataTierSchema>;

export const LatencyProfileSchema = z.object({
  maxLatencyMs: z.number().positive(),
  typicalLatencyMs: z.number().positive(),
  guaranteedSlaPercent: z.number().min(90).max(100),
  dataQualityScoreMin: z.number().min(0).max(100),
});
export type LatencyProfile = z.infer<typeof LatencyProfileSchema>;

// =============================================================================
// EVIDENCE BEFORE DECISION (AP-002)
// =============================================================================

export const EvidenceRecordSchema = z.object({
  evidenceId: z.string().uuid(),
  timestampNs: z.number().int().positive(),
  sourceProvider: z.string().min(1),
  feedType: z.enum(['websocket', 'rest', 'rpc', 'mempool', 'fix', 'arrow']),
  sha256MerkleRoot: z.string().regex(/^[a-f0-9]{64}$/i),
  merkleLeafHash: z.string().regex(/^[a-f0-9]{64}$/i),
  merklePath: z.array(z.string().regex(/^[a-f0-9]{64}$/i)),
  consensusQuorumNodes: z.number().int().min(1),
  consensusMedianPrice: z.number().positive().optional(),
  sequenceId: z.number().int().nonnegative(),
  auditLineageSignature: z.string().min(16),
  validated: z.boolean(),
});
export type EvidenceRecord = z.infer<typeof EvidenceRecordSchema>;

// =============================================================================
// BUDGET-AWARE CONSTRAINTS (AP-006: Max 40 EUR / Month)
// =============================================================================

export const BudgetMetadataSchema = z.object({
  estimatedMonthlyCostEur: z.number().min(0).max(40),
  enterpriseBenchmarkCostEur: z.number().positive(),
  cptStakingTier: z.enum(['Tier I (1.000 $CPT)', 'Tier II (5.000 $CPT)', 'Tier III (25.000 $CPT)']),
  freeTierEligible: z.boolean(),
  rateLimitPerMinute: z.number().int().positive(),
});
export type BudgetMetadata = z.infer<typeof BudgetMetadataSchema>;

// =============================================================================
// NODE PORT TYPES & DATA TYPES
// =============================================================================

export const PortDataTypeSchema = z.enum([
  'tick_stream',
  'orderbook_l2',
  'orderbook_l3_mbo',
  'ohlcv_candle',
  'feature_vector',
  'score_metric',
  'evidence_packet',
  'news_event',
  'onchain_tx',
  'macro_series',
  'signal_event',
  'paper_order',
  'execution_report',
]);
export type PortDataType = z.infer<typeof PortDataTypeSchema>;

export const NodePortSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: PortDataTypeSchema,
  direction: z.enum(['in', 'out']),
  required: z.boolean().default(true),
  description: z.string().optional(),
});
export type NodePort = z.infer<typeof NodePortSchema>;
