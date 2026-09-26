/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Provider Registry & Health/Budget Tracking Contracts (WP-004, AP-003, AP-006)
 */

import { z } from 'zod';
import { AssetClassSchema, AssetSubclassSchema, AssetClass, AssetSubclass } from '../../contracts/common';

// =============================================================================
// ENUMS & BASE TYPES
// =============================================================================

export const ProviderTierSchema = z.enum(['tier0', 'tier1', 'tier2', 'tier3', 'tier4']);
export type ProviderTier = z.infer<typeof ProviderTierSchema>;

export const ProviderProtocolSchema = z.enum([
  'websocket',
  'rest',
  'rpc',
  'fix',
  'arrow_flight',
  'grpc',
  'zeromq',
]);
export type ProviderProtocol = z.infer<typeof ProviderProtocolSchema>;

export const ProviderHealthStatusSchema = z.enum([
  'healthy',
  'degraded',
  'unhealthy',
  'maintenance',
  'rate_limited',
]);
export type ProviderHealthStatus = z.infer<typeof ProviderHealthStatusSchema>;

// =============================================================================
// CAPABILITY CONTRACT SCHEMA (AP-001, AP-003)
// =============================================================================

export const ProviderCapabilityContractSchema = z.object({
  supportedAssetClasses: z.array(AssetClassSchema).min(1),
  supportedAssetSubclasses: z.array(AssetSubclassSchema).default([]),
  protocols: z.array(ProviderProtocolSchema).min(1),
  supportsL1TopBook: z.boolean().default(true),
  supportsL2OrderbookDepth: z.boolean().default(false),
  supportsL3MarketByOrder: z.boolean().default(false),
  supportsHistoricalCandles: z.boolean().default(true),
  supportsWebsocketHeartbeat: z.boolean().default(true),
  supportsSequenceValidation: z.boolean().default(false),
  maxRequestRatePerMinute: z.number().int().positive(),
  guaranteedLatencyMs: z.number().positive(),
  typicalLatencyMs: z.number().positive(),
  historicalDepthDays: z.number().int().nonnegative().default(365),
  maxWebsocketConnections: z.number().int().positive().default(5),
});
export type ProviderCapabilityContract = z.infer<typeof ProviderCapabilityContractSchema>;

// =============================================================================
// BUDGET & COST TRACKING CONTRACT SCHEMA (AP-006: Max 40 EUR / Month)
// =============================================================================

export const ProviderCostBudgetContractSchema = z.object({
  monthlyBaseCostEur: z.number().min(0),
  costPerMillionCallsEur: z.number().min(0).default(0),
  currentMonthlySpendEur: z.number().min(0),
  monthlyBudgetCapEur: z.number().max(40.0).default(12.0),
  isFreeTierAvailable: z.boolean().default(true),
  freeTierDailyLimit: z.number().int().nonnegative().default(1000),
  cptStakingDiscountPercent: z.number().min(0).max(100).default(100),
  alertThresholdPercent: z.number().min(50).max(100).default(80),
});
export type ProviderCostBudgetContract = z.infer<typeof ProviderCostBudgetContractSchema>;

// =============================================================================
// HEALTH & LATENCY METRICS CONTRACT SCHEMA (AP-002)
// =============================================================================

export const ProviderHealthMetricsSchema = z.object({
  status: ProviderHealthStatusSchema.default('healthy'),
  currentLatencyMs: z.number().nonnegative(),
  rollingAverageLatencyMs: z.number().nonnegative(),
  jitterMs: z.number().nonnegative().default(2.5),
  uptimePercent30d: z.number().min(0).max(100).default(99.9),
  consecutiveFailures: z.number().int().nonnegative().default(0),
  lastSuccessfulPingAt: z.string().datetime(),
  errorRatePercent1h: z.number().min(0).max(100).default(0.0),
  circuitBreakerTripped: z.boolean().default(false),
  dataQualityScoreContribution: z.number().min(0).max(100).default(99.0),
});
export type ProviderHealthMetrics = z.infer<typeof ProviderHealthMetricsSchema>;

// =============================================================================
// PROVIDER CONTRACT (MASTER CONTRACT WP-004)
// =============================================================================

export const ProviderContractSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  tier: ProviderTierSchema,
  websiteUrl: z.string().url(),
  description: z.string().min(1),
  endpoints: z.object({
    restBaseUrl: z.string().url().optional(),
    websocketUrl: z.string().regex(/^wss?:\/\//i).optional(),
    rpcUrl: z.string().url().optional(),
    documentationUrl: z.string().url().optional(),
  }),
  capabilities: ProviderCapabilityContractSchema,
  budget: ProviderCostBudgetContractSchema,
  health: ProviderHealthMetricsSchema,
  isPrimaryFor: z.array(AssetClassSchema).default([]),
  fallbackProviderIds: z.array(z.string()).default([]),
  complianceVerification: z.object({
    regulatoryApproved: z.boolean().default(true),
    certificateAuthority: z.string().optional(),
    jurisdiction: z.string().default('EU / Global'),
  }),
});
export type ProviderContract = z.infer<typeof ProviderContractSchema>;

// =============================================================================
// PRODUCTION PROVIDER REGISTRY DEFINITIONS (AP-003, AP-006)
// =============================================================================

const now = new Date().toISOString();

export const PROVIDER_REGISTRY: Record<string, ProviderContract> = {
  // 1. Binance Primary WebSocket & REST (Crypto Major)
  binance_market_data: {
    id: 'binance_market_data',
    name: 'Binance Market Data Engine',
    slug: 'binance',
    tier: 'tier1',
    websiteUrl: 'https://binance.com',
    description: 'High-Throughput WebSocket Feed mit L2 Orderbuch-Streaming und Trade-Tick Tickers.',
    endpoints: {
      websocketUrl: 'wss://stream.binance.com:9443/ws/!ticker@arr',
      restBaseUrl: 'https://api.binance.com/api/v3',
      documentationUrl: 'https://binance-docs.github.io/apidocs/spot/en/',
    },
    capabilities: {
      supportedAssetClasses: ['crypto'],
      supportedAssetSubclasses: ['layer1_layer2', 'defi_protocol', 'perpetual_future'],
      protocols: ['websocket', 'rest'],
      supportsL1TopBook: true,
      supportsL2OrderbookDepth: true,
      supportsL3MarketByOrder: false,
      supportsHistoricalCandles: true,
      supportsWebsocketHeartbeat: true,
      supportsSequenceValidation: true,
      maxRequestRatePerMinute: 1200,
      guaranteedLatencyMs: 15.0,
      typicalLatencyMs: 18.5,
      historicalDepthDays: 730,
      maxWebsocketConnections: 10,
    },
    budget: {
      monthlyBaseCostEur: 0.0, // Free public market data tier
      costPerMillionCallsEur: 0.0,
      currentMonthlySpendEur: 0.0,
      monthlyBudgetCapEur: 5.0,
      isFreeTierAvailable: true,
      freeTierDailyLimit: 100000,
      cptStakingDiscountPercent: 100,
      alertThresholdPercent: 80,
    },
    health: {
      status: 'healthy',
      currentLatencyMs: 18,
      rollingAverageLatencyMs: 19.2,
      jitterMs: 2.1,
      uptimePercent30d: 99.98,
      consecutiveFailures: 0,
      lastSuccessfulPingAt: now,
      errorRatePercent1h: 0.01,
      circuitBreakerTripped: false,
      dataQualityScoreContribution: 99.4,
    },
    isPrimaryFor: ['crypto'],
    fallbackProviderIds: ['kraken_websocket', 'coinbase_exchange'],
    complianceVerification: {
      regulatoryApproved: true,
      certificateAuthority: 'Let’s Encrypt / Cloudflare Edge',
      jurisdiction: 'Global',
    },
  },

  // 2. TwelveData Multi-Asset Equities & Forex
  twelve_data_market: {
    id: 'twelve_data_market',
    name: 'TwelveData Financial Feeds',
    slug: 'twelvedata',
    tier: 'tier1',
    websiteUrl: 'https://twelvedata.com',
    description: 'Institutionelle US- & EU-Aktien, Indizes, Forex G10 und ETF-Kurse.',
    endpoints: {
      restBaseUrl: 'https://api.twelvedata.com',
      websocketUrl: 'wss://ws.twelvedata.com/v1/quotes/price',
      documentationUrl: 'https://twelvedata.com/docs',
    },
    capabilities: {
      supportedAssetClasses: ['equity_us', 'equity_eu', 'forex', 'commodities'],
      supportedAssetSubclasses: ['us_megacap_tech', 'sp500_component', 'dax40_bluechip', 'fx_g10_major'],
      protocols: ['rest', 'websocket'],
      supportsL1TopBook: true,
      supportsL2OrderbookDepth: false,
      supportsL3MarketByOrder: false,
      supportsHistoricalCandles: true,
      supportsWebsocketHeartbeat: true,
      supportsSequenceValidation: false,
      maxRequestRatePerMinute: 800,
      guaranteedLatencyMs: 35.0,
      typicalLatencyMs: 42.0,
      historicalDepthDays: 1825,
      maxWebsocketConnections: 3,
    },
    budget: {
      monthlyBaseCostEur: 8.5,
      costPerMillionCallsEur: 2.5,
      currentMonthlySpendEur: 8.5,
      monthlyBudgetCapEur: 14.0, // Sub-budget fits within 40 EUR total
      isFreeTierAvailable: true,
      freeTierDailyLimit: 800,
      cptStakingDiscountPercent: 100,
      alertThresholdPercent: 85,
    },
    health: {
      status: 'healthy',
      currentLatencyMs: 38,
      rollingAverageLatencyMs: 41.5,
      jitterMs: 4.8,
      uptimePercent30d: 99.85,
      consecutiveFailures: 0,
      lastSuccessfulPingAt: now,
      errorRatePercent1h: 0.05,
      circuitBreakerTripped: false,
      dataQualityScoreContribution: 98.2,
    },
    isPrimaryFor: ['equity_us', 'equity_eu', 'forex'],
    fallbackProviderIds: ['binance_market_data'],
    complianceVerification: {
      regulatoryApproved: true,
      certificateAuthority: 'DigiCert Global Root',
      jurisdiction: 'US / EU',
    },
  },

  // 3. Kraken Institutional WebSocket (EU & BaFin Reference)
  kraken_websocket: {
    id: 'kraken_websocket',
    name: 'Kraken Financial Ingestion',
    slug: 'kraken',
    tier: 'tier1',
    websiteUrl: 'https://kraken.com',
    description: 'Regulatorisch konforme europäische Orderbuch-Referenz mit strengem Monotonic Sequencing.',
    endpoints: {
      websocketUrl: 'wss://ws.kraken.com/v2',
      restBaseUrl: 'https://api.kraken.com/0/public',
      documentationUrl: 'https://docs.kraken.com/websockets-v2/',
    },
    capabilities: {
      supportedAssetClasses: ['crypto', 'forex'],
      supportedAssetSubclasses: ['layer1_layer2', 'perpetual_future', 'fx_g10_major'],
      protocols: ['websocket', 'rest'],
      supportsL1TopBook: true,
      supportsL2OrderbookDepth: true,
      supportsL3MarketByOrder: false,
      supportsHistoricalCandles: true,
      supportsWebsocketHeartbeat: true,
      supportsSequenceValidation: true,
      maxRequestRatePerMinute: 600,
      guaranteedLatencyMs: 20.0,
      typicalLatencyMs: 25.0,
      historicalDepthDays: 365,
      maxWebsocketConnections: 5,
    },
    budget: {
      monthlyBaseCostEur: 0.0,
      costPerMillionCallsEur: 0.0,
      currentMonthlySpendEur: 0.0,
      monthlyBudgetCapEur: 5.0,
      isFreeTierAvailable: true,
      freeTierDailyLimit: 50000,
      cptStakingDiscountPercent: 100,
      alertThresholdPercent: 80,
    },
    health: {
      status: 'healthy',
      currentLatencyMs: 24,
      rollingAverageLatencyMs: 25.1,
      jitterMs: 3.0,
      uptimePercent30d: 99.95,
      consecutiveFailures: 0,
      lastSuccessfulPingAt: now,
      errorRatePercent1h: 0.0,
      circuitBreakerTripped: false,
      dataQualityScoreContribution: 99.6,
    },
    isPrimaryFor: [],
    fallbackProviderIds: ['binance_market_data'],
    complianceVerification: {
      regulatoryApproved: true,
      certificateAuthority: 'Cloudflare / BaFin regulated partner',
      jurisdiction: 'EU / DLT',
    },
  },

  // 4. Federal Reserve (FRED) Macroeconomic Authority (Tier 0 - 100% Free)
  fred_stlouis_fed: {
    id: 'fred_stlouis_fed',
    name: 'Federal Reserve Bank of St. Louis (FRED)',
    slug: 'fred',
    tier: 'tier0',
    websiteUrl: 'https://fred.stlouisfed.org',
    description: 'Offizielle US-Zentralbank-Referenz für Zinsstrukturkurven, M2 Geldmenge, CPI und Arbeitsmarktdaten.',
    endpoints: {
      restBaseUrl: 'https://api.stlouisfed.org/fred',
      documentationUrl: 'https://fred.stlouisfed.org/docs/api/fred/',
    },
    capabilities: {
      supportedAssetClasses: ['fixed_income', 'commodities'],
      supportedAssetSubclasses: ['sovereign_yield_10y_2y', 'credit_spread', 'energy_crude_gas'],
      protocols: ['rest'],
      supportsL1TopBook: false,
      supportsL2OrderbookDepth: false,
      supportsL3MarketByOrder: false,
      supportsHistoricalCandles: false,
      supportsWebsocketHeartbeat: false,
      supportsSequenceValidation: true,
      maxRequestRatePerMinute: 120,
      guaranteedLatencyMs: 120.0,
      typicalLatencyMs: 145.0,
      historicalDepthDays: 7300,
      maxWebsocketConnections: 1,
    },
    budget: {
      monthlyBaseCostEur: 0.0, // 100% Free Public Good
      costPerMillionCallsEur: 0.0,
      currentMonthlySpendEur: 0.0,
      monthlyBudgetCapEur: 0.0,
      isFreeTierAvailable: true,
      freeTierDailyLimit: 10000,
      cptStakingDiscountPercent: 100,
      alertThresholdPercent: 90,
    },
    health: {
      status: 'healthy',
      currentLatencyMs: 135,
      rollingAverageLatencyMs: 142.0,
      jitterMs: 12.0,
      uptimePercent30d: 99.99,
      consecutiveFailures: 0,
      lastSuccessfulPingAt: now,
      errorRatePercent1h: 0.0,
      circuitBreakerTripped: false,
      dataQualityScoreContribution: 99.9,
    },
    isPrimaryFor: ['fixed_income'],
    fallbackProviderIds: [],
    complianceVerification: {
      regulatoryApproved: true,
      certificateAuthority: 'U.S. Government Sovereign Key',
      jurisdiction: 'United States',
    },
  },

  // 5. Alchemy Web3 RPC Node Gateway
  alchemy_ethereum_rpc: {
    id: 'alchemy_ethereum_rpc',
    name: 'Alchemy Supernode RPC',
    slug: 'alchemy',
    tier: 'tier1',
    websiteUrl: 'https://alchemy.com',
    description: 'EVM On-Chain Transaction Logs, Smart Contract Events und Mempool Whale Tracking.',
    endpoints: {
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2',
      websocketUrl: 'wss://eth-mainnet.g.alchemy.com/v2',
      documentationUrl: 'https://docs.alchemy.com',
    },
    capabilities: {
      supportedAssetClasses: ['crypto'],
      supportedAssetSubclasses: ['defi_protocol', 'layer1_layer2'],
      protocols: ['rpc', 'websocket'],
      supportsL1TopBook: false,
      supportsL2OrderbookDepth: false,
      supportsL3MarketByOrder: false,
      supportsHistoricalCandles: false,
      supportsWebsocketHeartbeat: true,
      supportsSequenceValidation: true,
      maxRequestRatePerMinute: 300,
      guaranteedLatencyMs: 45.0,
      typicalLatencyMs: 55.0,
      historicalDepthDays: 365,
      maxWebsocketConnections: 3,
    },
    budget: {
      monthlyBaseCostEur: 0.0, // Free developer compute units
      costPerMillionCallsEur: 0.0,
      currentMonthlySpendEur: 0.0,
      monthlyBudgetCapEur: 10.0,
      isFreeTierAvailable: true,
      freeTierDailyLimit: 300000,
      cptStakingDiscountPercent: 100,
      alertThresholdPercent: 80,
    },
    health: {
      status: 'healthy',
      currentLatencyMs: 48,
      rollingAverageLatencyMs: 52.0,
      jitterMs: 6.2,
      uptimePercent30d: 99.92,
      consecutiveFailures: 0,
      lastSuccessfulPingAt: now,
      errorRatePercent1h: 0.02,
      circuitBreakerTripped: false,
      dataQualityScoreContribution: 98.8,
    },
    isPrimaryFor: [],
    fallbackProviderIds: [],
    complianceVerification: {
      regulatoryApproved: true,
      certificateAuthority: 'Amazon Trust Services',
      jurisdiction: 'Global / Decentralized',
    },
  },
};

// =============================================================================
// QUERY & AUDIT UTILITIES (WP-004)
// =============================================================================

export class ProviderRegistryService {
  /**
   * Get single provider by ID
   */
  static getProviderById(id: string): ProviderContract | undefined {
    return PROVIDER_REGISTRY[id];
  }

  /**
   * Get all registered providers as array
   */
  static getAllProviders(): ProviderContract[] {
    return Object.values(PROVIDER_REGISTRY);
  }

  /**
   * Get healthy providers capable of serving a target asset class (AP-003)
   */
  static getHealthyProvidersForAsset(assetClass: AssetClass): ProviderContract[] {
    return this.getAllProviders().filter(
      (p) =>
        p.capabilities.supportedAssetClasses.includes(assetClass) &&
        (p.health.status === 'healthy' || p.health.status === 'degraded') &&
        !p.health.circuitBreakerTripped
    );
  }

  /**
   * Calculate total monthly provider expenditure and verify AP-006 compliance (< 40 EUR)
   */
  static calculateTotalProviderSpendEur(): {
    totalMonthlySpendEur: number;
    budgetCapEur: number;
    remainingBudgetEur: number;
    isWithinBudget: boolean;
  } {
    const totalMonthlySpendEur = this.getAllProviders().reduce(
      (sum, p) => sum + p.budget.currentMonthlySpendEur,
      0
    );
    const budgetCapEur = 40.0;
    const remainingBudgetEur = Math.max(0, budgetCapEur - totalMonthlySpendEur);

    return {
      totalMonthlySpendEur,
      budgetCapEur,
      remainingBudgetEur,
      isWithinBudget: totalMonthlySpendEur <= budgetCapEur,
    };
  }

  /**
   * Comprehensive Health & Budget Audit Report
   */
  static auditProviderHealthAndBudget(): {
    timestamp: string;
    totalProvidersCount: number;
    healthyCount: number;
    degradedCount: number;
    unhealthyCount: number;
    averageLatencyMs: number;
    budgetSummary: ReturnType<typeof ProviderRegistryService.calculateTotalProviderSpendEur>;
    alerts: string[];
  } {
    const providers = this.getAllProviders();
    const budgetSummary = this.calculateTotalProviderSpendEur();
    const alerts: string[] = [];

    let healthyCount = 0;
    let degradedCount = 0;
    let unhealthyCount = 0;
    let latencySum = 0;

    providers.forEach((p) => {
      latencySum += p.health.currentLatencyMs;

      if (p.health.status === 'healthy') healthyCount++;
      else if (p.health.status === 'degraded') {
        degradedCount++;
        alerts.push(`WARNUNG: Provider "${p.name}" ist verlangsamt (${p.health.currentLatencyMs}ms).`);
      } else {
        unhealthyCount++;
        alerts.push(`KRITISCH: Provider "${p.name}" ist offline oder circuit-gebrochen!`);
      }

      // Check budget utilization threshold
      if (p.budget.monthlyBudgetCapEur > 0) {
        const utilPercent = (p.budget.currentMonthlySpendEur / p.budget.monthlyBudgetCapEur) * 100;
        if (utilPercent >= p.budget.alertThresholdPercent) {
          alerts.push(
            `BUDGET ALERT: Provider "${p.name}" hat ${utilPercent.toFixed(1)}% des Monatsbudgets verbraucht.`
          );
        }
      }
    });

    if (!budgetSummary.isWithinBudget) {
      alerts.push(
        `BUDGET BREACH (AP-006): Gesamtausgaben (${budgetSummary.totalMonthlySpendEur.toFixed(2)} €) überschreiten das 40,00 € Cap!`
      );
    }

    return {
      timestamp: new Date().toISOString(),
      totalProvidersCount: providers.length,
      healthyCount,
      degradedCount,
      unhealthyCount,
      averageLatencyMs: Math.round(latencySum / (providers.length || 1)),
      budgetSummary,
      alerts,
    };
  }
}
