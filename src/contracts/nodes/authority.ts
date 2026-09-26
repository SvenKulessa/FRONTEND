/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Authority & Data Quality Node Contracts (12 Nodes)
 */

import { z } from 'zod';
import { NodePort } from '../common';

// 1. provider_registry
export const ProviderRegistryConfigSchema = z.object({
  registryTier: z.enum(['primary_exchanges', 'tier1_aggregators', 'decentralized_rpcs', 'all']),
  enforceVerifiedCertificate: z.boolean().default(true),
  failoverPriorityList: z.array(z.string().min(1)).min(1),
});
export type ProviderRegistryConfig = z.infer<typeof ProviderRegistryConfigSchema>;

// 2. provider_matrix
export const ProviderMatrixConfigSchema = z.object({
  routingStrategy: z.enum(['lowest_latency', 'cost_optimized', 'highest_reliability', 'round_robin']),
  activeProviders: z.array(z.string()).min(2),
  healthCheckIntervalMs: z.number().int().min(500).max(60000).default(5000),
  switchOverDelayMs: z.number().int().min(0).max(5000).default(50),
});
export type ProviderMatrixConfig = z.infer<typeof ProviderMatrixConfigSchema>;

// 3. rate_limit_budget (Enforces AP-006: Max 40 EUR / Month)
export const RateLimitBudgetConfigSchema = z.object({
  monthlyBudgetCapEur: z.number().max(40).default(35),
  tokensPerMinute: z.number().int().min(1).max(5000).default(120),
  burstBucketCapacity: z.number().int().min(1).max(500).default(30),
  dropStrategy: z.enum(['drop_newest', 'queue_buffered', 'reject_with_backoff']).default('queue_buffered'),
});
export type RateLimitBudgetConfig = z.infer<typeof RateLimitBudgetConfigSchema>;

// 4. circuit_breaker
export const CircuitBreakerConfigSchema = z.object({
  consecutiveErrorThreshold: z.number().int().min(1).max(20).default(5),
  errorRatePercentThreshold: z.number().min(1).max(50).default(10),
  tripCooldownMs: z.number().int().min(1000).max(300000).default(15000),
  halfOpenTrialRequests: z.number().int().min(1).max(10).default(3),
});
export type CircuitBreakerConfig = z.infer<typeof CircuitBreakerConfigSchema>;

// 5. request_coalescer
export const RequestCoalescerConfigSchema = z.object({
  windowDurationMs: z.number().int().min(1).max(1000).default(25),
  maxCoalescedBatchSize: z.number().int().min(2).max(1000).default(100),
  deduplicationKey: z.string().min(1).default('symbol'),
});
export type RequestCoalescerConfig = z.infer<typeof RequestCoalescerConfigSchema>;

// 6. market_data_cache
export const MarketDataCacheConfigSchema = z.object({
  cacheStorageEngine: z.enum(['memory_lru', 'redis_ringbuffer', 'shared_array_buffer']),
  maxItems: z.number().int().min(100).max(1000000).default(50000),
  ttlMilliseconds: z.number().int().min(10).max(86400000).default(60000),
  evictionPolicy: z.enum(['lru', 'lfu', 'fifo']).default('lru'),
});
export type MarketDataCacheConfig = z.infer<typeof MarketDataCacheConfigSchema>;

// 7. schema_validator
export const SchemaValidatorConfigSchema = z.object({
  targetSchemaName: z.enum(['CanonicalTick', 'CanonicalCandle', 'CanonicalOrderbook', 'CanonicalNews']),
  strictMode: z.boolean().default(true),
  quarantineInvalidRecords: z.boolean().default(true),
  alertOnError: z.boolean().default(true),
});
export type SchemaValidatorConfig = z.infer<typeof SchemaValidatorConfigSchema>;

// 8. freshness_validator
export const FreshnessValidatorConfigSchema = z.object({
  maxAllowedStalenessMs: z.number().int().min(10).max(60000).default(250),
  clockSyncToleranceMs: z.number().int().min(1).max(1000).default(50),
  actionOnStale: z.enum(['drop', 'flag_stale', 'fallback_secondary']).default('flag_stale'),
});
export type FreshnessValidatorConfig = z.infer<typeof FreshnessValidatorConfigSchema>;

// 9. sequence_validator
export const SequenceValidatorConfigSchema = z.object({
  requireMonotonicStrict: z.boolean().default(true),
  detectMissingSequenceGap: z.boolean().default(true),
  maxAllowedGapResync: z.number().int().min(0).max(100).default(5),
  onSequenceBreak: z.enum(['request_snapshot', 'drop_session', 'warn_only']).default('request_snapshot'),
});
export type SequenceValidatorConfig = z.infer<typeof SequenceValidatorConfigSchema>;

// 10. provider_consensus (AP-002)
export const ProviderConsensusConfigSchema = z.object({
  minRequiredProviders: z.number().int().min(2).max(10).default(3),
  aggregationMethod: z.enum(['median', 'trimmed_mean', 'volume_weighted_average', 'strictest_quorum']),
  maxAllowedDivergenceBps: z.number().min(1).max(500).default(35), // 35 basis points
  rejectOutlierProviders: z.boolean().default(true),
});
export type ProviderConsensusConfig = z.infer<typeof ProviderConsensusConfigSchema>;

// 11. data_quality_gate
export const DataQualityGateConfigSchema = z.object({
  minPassingDqsScore: z.number().min(50).max(100).default(98.0),
  weightFreshness: z.number().min(0).max(1).default(0.35),
  weightConsensus: z.number().min(0).max(1).default(0.35),
  weightCompleteness: z.number().min(0).max(1).default(0.30),
  rejectBelowPassing: z.boolean().default(true),
});
export type DataQualityGateConfig = z.infer<typeof DataQualityGateConfigSchema>;

// 12. evidence_writer (AP-002)
export const EvidenceWriterConfigSchema = z.object({
  merkleTreeDepth: z.number().int().min(4).max(32).default(16),
  hashAlgorithm: z.enum(['sha256', 'sha3_256', 'keccak256']).default('sha256'),
  writeBatchIntervalMs: z.number().int().min(10).max(10000).default(100),
  persistAuditLogToDisk: z.boolean().default(true),
  zkProofGenerationEligible: z.boolean().default(false),
});
export type EvidenceWriterConfig = z.infer<typeof EvidenceWriterConfigSchema>;

// Authority Ports Factory
export const AUTHORITY_PORTS: Record<string, NodePort[]> = {
  provider_consensus: [
    { id: 'in_raw_ticks', name: 'Raw Inbound Feeds', type: 'tick_stream', direction: 'in', required: true },
    { id: 'out_consensus_ticks', name: 'Consensus Tick', type: 'tick_stream', direction: 'out', required: true },
  ],
  evidence_writer: [
    { id: 'in_ticks', name: 'Verified Data', type: 'tick_stream', direction: 'in', required: true },
    { id: 'out_evidence', name: 'Evidence Packet', type: 'evidence_packet', direction: 'out', required: true },
  ],
  data_quality_gate: [
    { id: 'in_data', name: 'Candidate Stream', type: 'tick_stream', direction: 'in', required: true },
    { id: 'out_passed', name: 'DQS Approved Stream', type: 'tick_stream', direction: 'out', required: true },
  ],
};
