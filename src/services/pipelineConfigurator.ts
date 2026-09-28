/**
 * CAPITAL AI — ENTERPRISE PIPELINE CONFIGURATOR (PART 2)
 * Manages the 8 pipeline stages, dynamic provider routing, shadow mode benchmarks,
 * feature family assignments, and version-controlled configuration changes.
 */

export type ExecutionEnvironment = 'active_production' | 'shadow_canary' | 'sandbox_demo';

export interface StageConfig {
  stageId: string;
  stageName: string;
  isEnabled: boolean;
  timeoutMs: number;
  retryCount: number;
  circuitBreakerThresholdPct: number;
}

export interface PipelineConfigModel {
  configId: string;
  version: string;
  environment: ExecutionEnvironment;
  lastModifiedAt: number;
  modifiedBy: string;
  isApprovedForProduction: boolean;

  // 1. Stage Configurations (All 8 Stages)
  stages: Record<string, StageConfig>;

  // 2. Provider Routing & Feature Family Assignments
  activeProviders: string[];
  providerFeatureAssignments: Record<string, string[]>; // featureFamily -> providerIds

  // 3. Asset Class Route Settings
  assetClassRoutes: Record<
    string,
    {
      primaryProvider: string;
      fallbackProvider: string;
      maxStalenessSeconds: number;
      minQualityScore: number;
    }
  >;

  // 4. Shadow Mode Benchmarking Settings
  shadowSettings: {
    runShadowInParallel: boolean;
    sampleRatePercent: number;
    benchmarkLatencyComparison: boolean;
  };
}

export class PipelineConfiguratorService {
  private currentConfig: PipelineConfigModel;
  private shadowConfig: PipelineConfigModel;
  private revisionHistory: PipelineConfigModel[] = [];

  constructor() {
    this.currentConfig = this.buildDefaultProductionConfig();
    this.shadowConfig = this.buildDefaultShadowConfig();
    this.revisionHistory.push({ ...this.currentConfig });
  }

  public getActiveConfig(): PipelineConfigModel {
    return this.currentConfig;
  }

  public getShadowConfig(): PipelineConfigModel {
    return this.shadowConfig;
  }

  public getRevisionHistory(): PipelineConfigModel[] {
    return this.revisionHistory;
  }

  public updateActiveConfig(updated: Partial<PipelineConfigModel>, user: string): PipelineConfigModel {
    const nextConfig: PipelineConfigModel = {
      ...this.currentConfig,
      ...updated,
      version: this.incrementPatchVersion(this.currentConfig.version),
      lastModifiedAt: Date.now(),
      modifiedBy: user,
      isApprovedForProduction: true,
    };
    this.revisionHistory.push({ ...nextConfig });
    this.currentConfig = nextConfig;
    return this.currentConfig;
  }

  public toggleProvider(providerId: string, enabled: boolean): boolean {
    if (enabled) {
      if (!this.currentConfig.activeProviders.includes(providerId)) {
        this.currentConfig.activeProviders.push(providerId);
      }
    } else {
      this.currentConfig.activeProviders = this.currentConfig.activeProviders.filter((p) => p !== providerId);
    }
    return true;
  }

  private buildDefaultProductionConfig(): PipelineConfigModel {
    return {
      configId: 'cfg_prod_canonical_v2',
      version: '2.5.0',
      environment: 'active_production',
      lastModifiedAt: Date.now() - 86400000,
      modifiedBy: 'Enterprise Architecture Lead',
      isApprovedForProduction: true,
      stages: {
        stage_01_ingestion: {
          stageId: 'stage_01_ingestion',
          stageName: '1. Ingestion & Raw Capture',
          isEnabled: true,
          timeoutMs: 1500,
          retryCount: 3,
          circuitBreakerThresholdPct: 5,
        },
        stage_02_normalization: {
          stageId: 'stage_02_normalization',
          stageName: '2. Normalization & Identity Mapping',
          isEnabled: true,
          timeoutMs: 800,
          retryCount: 2,
          circuitBreakerThresholdPct: 2,
        },
        stage_03_validation: {
          stageId: 'stage_03_validation',
          stageName: '3. Data Quality & Plausibility Validation',
          isEnabled: true,
          timeoutMs: 1000,
          retryCount: 1,
          circuitBreakerThresholdPct: 3,
        },
        stage_04_feature_engineering: {
          stageId: 'stage_04_feature_engineering',
          stageName: '4. Feature Engineering (7 Families)',
          isEnabled: true,
          timeoutMs: 2500,
          retryCount: 2,
          circuitBreakerThresholdPct: 4,
        },
        stage_05_scoring: {
          stageId: 'stage_05_scoring',
          stageName: '5. Scoring & Gate Evaluation (50 Components)',
          isEnabled: true,
          timeoutMs: 1800,
          retryCount: 1,
          circuitBreakerThresholdPct: 2,
        },
        stage_06_ranking: {
          stageId: 'stage_06_ranking',
          stageName: '6. Cross-Sectional Ranking & Diffusion',
          isEnabled: true,
          timeoutMs: 1200,
          retryCount: 1,
          circuitBreakerThresholdPct: 2,
        },
        stage_07_evidence: {
          stageId: 'stage_07_evidence',
          stageName: '7. SHA-256 Evidence & Audit Stamping',
          isEnabled: true,
          timeoutMs: 800,
          retryCount: 2,
          circuitBreakerThresholdPct: 1,
        },
        stage_08_delivery: {
          stageId: 'stage_08_delivery',
          stageName: '8. UI Delivery, Screeners & Alert Dispatch',
          isEnabled: true,
          timeoutMs: 600,
          retryCount: 1,
          circuitBreakerThresholdPct: 2,
        },
      },
      activeProviders: ['binance_public', 'kraken_public', 'twelvedata_api', 'sec_edgar_filings'],
      providerFeatureAssignments: {
        technical: ['binance_public', 'twelvedata_api'],
        fundamental: ['sec_edgar_filings'],
        sentiment: ['gemini_nlp'],
        macro: ['fred_api', 'twelvedata_api'],
        orderflow: ['binance_public', 'kraken_public'],
      },
      assetClassRoutes: {
        crypto: {
          primaryProvider: 'binance_public',
          fallbackProvider: 'kraken_public',
          maxStalenessSeconds: 15,
          minQualityScore: 85,
        },
        equity_us: {
          primaryProvider: 'twelvedata_api',
          fallbackProvider: 'sec_edgar_filings',
          maxStalenessSeconds: 60,
          minQualityScore: 90,
        },
      },
      shadowSettings: {
        runShadowInParallel: true,
        sampleRatePercent: 10,
        benchmarkLatencyComparison: true,
      },
    };
  }

  private buildDefaultShadowConfig(): PipelineConfigModel {
    const prod = this.buildDefaultProductionConfig();
    return {
      ...prod,
      configId: 'cfg_shadow_experimental_v3',
      version: '2.6.0-shadow',
      environment: 'shadow_canary',
      isApprovedForProduction: false,
      modifiedBy: 'Experimental ML Quant Lab',
    };
  }

  private incrementPatchVersion(version: string): string {
    const parts = version.split('.');
    if (parts.length === 3) {
      const patch = parseInt(parts[2], 10) + 1;
      return `${parts[0]}.${parts[1]}.${patch}`;
    }
    return `${version}-rev`;
  }
}
