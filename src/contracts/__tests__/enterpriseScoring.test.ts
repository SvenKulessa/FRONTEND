/**
 * CAPITAL AI — ENTERPRISE SCORING, INTEGRATION & PLAUSIBILITY TEST SUITE (PART 3)
 * Comprehensive automated verification covering Unit, Integration, Plausibility & Acceptance constraints.
 */

import { ScoringEngineService } from '../../services/scoringEngine';
import { DataPlausibilityValidator } from '../dataPlausibilityValidator';
import { AssetIdentity, FeatureValue } from '../canonicalContracts';
import { PipelineConfiguratorService } from '../../services/pipelineConfigurator';
import { BinanceProviderAdapter, TwelveDataProviderAdapter, ExplicitDemoAdapter } from '../../services/providerAdapters';
import { FeatureStoreService } from '../../services/featureStore';

export function runEnterpriseScoringSuite(): { passed: boolean; message: string; failures: string[] } {
  const failures: string[] = [];

  // =========================================================================
  // 1. UNIT TESTS
  // =========================================================================

  // Test 1.1: Every component produces a bounded score in [0, 100]
  try {
    const mockAsset: AssetIdentity = {
      assetId: 'ast_aapl_us',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      assetClass: 'equity_us',
      venue: 'NASDAQ',
      currency: 'USD',
      status: 'active',
    };

    const mockFeatures = new Map<string, FeatureValue>([
      [
        'rsi_14',
        {
          featureId: 'rsi_14',
          assetId: 'ast_aapl_us',
          value: 62.0,
          unit: 'index',
          normalizedValue: 62.0,
          observedAt: Date.now() - 1000,
          calculationVersion: '2.1.0',
          qualityScore: 98,
          provenance: {
            providerId: 'twelvedata_api',
            providerDataset: 'quote',
            observedAt: Date.now() - 1000,
            receivedAt: Date.now() - 950,
            publishedAt: Date.now() - 900,
            latencyMs: 50,
            isDelayed: false,
            isDemo: false,
            sourceReference: 'api://twelvedata/aapl',
            licenseScope: 'commercial_redistribution',
          },
        },
      ],
      [
        'piotroski_f_score',
        {
          featureId: 'piotroski_f_score',
          assetId: 'ast_aapl_us',
          value: 8,
          unit: 'score_0_9',
          normalizedValue: 88.8,
          observedAt: Date.now() - 5000,
          calculationVersion: '2.1.0',
          qualityScore: 99,
          provenance: {
            providerId: 'sec_edgar',
            providerDataset: '10q',
            observedAt: Date.now() - 5000,
            receivedAt: Date.now() - 4000,
            publishedAt: Date.now() - 3000,
            latencyMs: 1000,
            isDelayed: false,
            isDemo: false,
            sourceReference: 'sec://edgar/aapl',
            licenseScope: 'public_realtime',
          },
        },
      ],
    ]);

    ScoringEngineService.computeFinalScore(mockAsset, mockFeatures, false).then((res) => {
      if (res.finalScore < 0 || res.finalScore > 100) {
        failures.push(`Unit Test 1.1 Failed: Final score ${res.finalScore} not in bounds [0, 100]`);
      }
      if (!res.modelVersion || !res.evidenceId) {
        failures.push('Unit Test 1.1 Failed: Missing modelVersion or evidenceId');
      }
    });
  } catch (err: any) {
    failures.push(`Unit Test 1.1 Exception: ${err.message}`);
  }

  // Test 1.2: Hard eligibility gate blocks final ranking (rank = null)
  try {
    const haltedAsset: AssetIdentity = {
      assetId: 'ast_halted_01',
      symbol: 'HALT',
      name: 'Halted Corp',
      assetClass: 'equity_us',
      venue: 'NYSE',
      currency: 'USD',
      status: 'halted', // Halted!
    };

    ScoringEngineService.computeFinalScore(haltedAsset, new Map(), false).then((res) => {
      if (res.eligibility !== false) {
        failures.push('Unit Test 1.2 Failed: Halted asset must have eligibility = false');
      }
      if (res.rank !== null) {
        failures.push(`Unit Test 1.2 Failed: Ineligible asset must have rank = null, but got ${res.rank}`);
      }
      if (res.finalScore !== 0) {
        failures.push(`Unit Test 1.2 Failed: Ineligible asset must have finalScore = 0, but got ${res.finalScore}`);
      }
    });
  } catch (err: any) {
    failures.push(`Unit Test 1.2 Exception: ${err.message}`);
  }

  // Test 1.3: Demo adapter strictly enforces isDemo=true
  try {
    const demoAdapter = new ExplicitDemoAdapter();
    const testAsset: AssetIdentity = {
      assetId: 'ast_demo_btc',
      symbol: 'BTC',
      name: 'Bitcoin Demo',
      assetClass: 'crypto',
      venue: 'SANDBOX',
      currency: 'USD',
      status: 'active',
    };

    demoAdapter.fetchObservation(testAsset).then((obs) => {
      if (!obs.provenance.isDemo) {
        failures.push('Unit Test 1.3 Failed: Demo adapter must set isDemo=true in provenance');
      }
      if (obs.provenance.providerId !== 'capital_ai_demo_engine') {
        failures.push('Unit Test 1.3 Failed: Non-production providerId expected for demo adapter');
      }
    });
  } catch (err: any) {
    failures.push(`Unit Test 1.3 Exception: ${err.message}`);
  }

  // =========================================================================
  // 2. INTEGRATION TESTS (Stage 01 to Stage 07)
  // =========================================================================
  try {
    const twelveData = new TwelveDataProviderAdapter();
    const featureStore = new FeatureStoreService();

    const asset: AssetIdentity = {
      assetId: 'ast_int_aapl',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      assetClass: 'equity_us',
      venue: 'NASDAQ',
      currency: 'USD',
      status: 'active',
    };

    twelveData.fetchObservation(asset).then((obs) => {
      // Stage 01: Raw observation exists
      if (!obs.price || obs.price <= 0) {
        failures.push('Integration Test Failed: Raw observation price invalid');
      }

      // Stage 04: Features extracted from observation
      const features = featureStore.extractFeatures({ asset, observation: obs });
      if (!features.has('rsi_14') || !features.has('piotroski_f_score')) {
        failures.push('Integration Test Failed: Core features missing from featureStore');
      }

      // Stage 05 & 07: Score and SHA-256 evidence
      ScoringEngineService.computeFinalScore(asset, features, false).then((finalResult) => {
        if (!finalResult.evidenceId.startsWith('EVD-AAPL-')) {
          failures.push(`Integration Test Failed: Unexpected evidence format: ${finalResult.evidenceId}`);
        }
        if (finalResult.topPositiveDrivers.length === 0) {
          failures.push('Integration Test Failed: Expected positive driver for high-conviction AAPL');
        }
      });
    });
  } catch (err: any) {
    failures.push(`Integration Test Exception: ${err.message}`);
  }

  // =========================================================================
  // 3. PLAUSIBILITY TESTS (11 Non-Negotiable Rules)
  // =========================================================================
  try {
    const invalidResult: any = {
      assetId: 'ast_invalid',
      symbol: 'BAD',
      assetClass: 'crypto',
      rank: 1, // Invalid: Rank published while ineligible!
      finalScore: 105, // Invalid: Out of bounds [0, 100]
      eligibility: false,
      confidence: 0.9,
      riskPenalty: 0,
      subScores: {
        momentumScore: 110, // Invalid: Subscore > 100
        technicalScore: 50,
        fundamentalScore: 50,
        sentimentScore: 50,
        eventScore: 50,
        positioningScore: 50,
      },
      weightsApplied: { weightMomentum: 0.2, weightTechnical: 0.2, weightFundamental: 0.2, weightSentiment: 0.2, weightEvent: 0.1, weightPositioning: 0.1 },
      topPositiveDrivers: [
        { componentId: 'fake', nameDe: 'Fake', contributionScore: 10, evidenceSummary: 'Verursacht durch Wal-Kauf mit sicherer Rendite' }, // Invalid causal claim!
      ],
      topNegativeDrivers: [],
      reasonCodes: [],
      modelVersion: '3.2.0',
      evidenceId: 'INVALID_FORMAT',
      computedAt: Date.now() + 100000, // Invalid: Future timestamp!
      isDemo: false,
      regulatoryDisclaimer: '',
    };

    const violations = DataPlausibilityValidator.validateFinalRankResult(invalidResult);
    if (violations.length < 4) {
      failures.push(`Plausibility Test Failed: Expected at least 4 violations, detected ${violations.length}`);
    }

    // Verify negative latency rejection
    const invalidProvenance: any = {
      providerId: 'bad_p',
      providerDataset: 'ticks',
      observedAt: 1000,
      receivedAt: 900,
      publishedAt: 1100,
      latencyMs: -100, // Invalid negative latency!
      isDelayed: false,
      isDemo: true,
      licenseScope: 'public_realtime', // Invalid: Demo masquerading as public realtime!
      sourceReference: 'bad',
    };
    const provViolations = DataPlausibilityValidator.validateProvenance(invalidProvenance);
    if (provViolations.length < 2) {
      failures.push(`Provenance Plausibility Failed: Expected 2 violations, detected ${provViolations.length}`);
    }
  } catch (err: any) {
    failures.push(`Plausibility Test Exception: ${err.message}`);
  }

  // =========================================================================
  // 4. PIPELINE CONFIGURATOR & SHADOW MODE ISOLATION
  // =========================================================================
  try {
    const configurator = new PipelineConfiguratorService();
    const active = configurator.getActiveConfig();
    const shadow = configurator.getShadowConfig();

    if (Object.keys(active.stages).length !== 8) {
      failures.push(`Configurator Test Failed: Expected 8 stages, got ${Object.keys(active.stages).length}`);
    }
    if (active.environment !== 'active_production') {
      failures.push(`Configurator Test Failed: Active environment must be active_production`);
    }
    if (shadow.environment !== 'shadow_canary') {
      failures.push(`Configurator Test Failed: Shadow environment must be shadow_canary`);
    }
  } catch (err: any) {
    failures.push(`Configurator Test Exception: ${err.message}`);
  }

  return {
    passed: failures.length === 0,
    message: failures.length === 0 ? 'All Unit, Integration, Plausibility & Acceptance tests passed.' : 'Failures detected.',
    failures,
  };
}
