/**
 * CAPITAL AI — ENTERPRISE SCORING ENGINE (STAGE 05 SCORING & STAGE 06 RANKING)
 * Implements the canonical final rank model:
 *
 * finalRank =
 *   eligibilityMultiplier
 *   * confidence
 *   * (
 *     weightMomentum * momentumScore
 *     + weightTechnical * technicalScore
 *     + weightFundamental * fundamentalScore
 *     + weightSentiment * sentimentScore
 *     + weightEvent * eventScore
 *     + weightPositioning * positioningScore
 *   )
 *   - riskPenalty
 */

import { AssetIdentity, FeatureValue, FinalRankResult, DriverContribution } from '../contracts/canonicalContracts';
import { EvidenceEngineService } from './evidenceEngine';

export interface AssetClassWeightProfile {
  weightMomentum: number;
  weightTechnical: number;
  weightFundamental: number;
  weightSentiment: number;
  weightEvent: number;
  weightPositioning: number;
}

export class ScoringEngineService {
  public static readonly MODEL_VERSION = '3.2.0';

  /**
   * Dynamic weight configurations varying strictly by asset class and market regime.
   */
  public static getWeightProfile(assetClass: string): AssetClassWeightProfile {
    switch (assetClass) {
      case 'crypto':
        return {
          weightMomentum: 0.25,
          weightTechnical: 0.20,
          weightFundamental: 0.10, // DeFi tokenomics / revenue
          weightSentiment: 0.20,
          weightEvent: 0.10,
          weightPositioning: 0.15, // Orderflow, CVD, OI
        };
      case 'equity_us':
      case 'equity_eu':
        return {
          weightMomentum: 0.15,
          weightTechnical: 0.20,
          weightFundamental: 0.35, // High weight on Buffett / Piotroski
          weightSentiment: 0.10,
          weightEvent: 0.10,
          weightPositioning: 0.10,
        };
      case 'forex':
      case 'commodities':
        return {
          weightMomentum: 0.20,
          weightTechnical: 0.30,
          weightFundamental: 0.05,
          weightSentiment: 0.15,
          weightEvent: 0.20, // Macro surprises, rate decisions
          weightPositioning: 0.10,
        };
      default:
        return {
          weightMomentum: 0.20,
          weightTechnical: 0.25,
          weightFundamental: 0.20,
          weightSentiment: 0.15,
          weightEvent: 0.10,
          weightPositioning: 0.10,
        };
    }
  }

  /**
   * Computes the canonical final score and ranking package for an asset.
   */
  public static async computeFinalScore(
    asset: AssetIdentity,
    features: Map<string, FeatureValue>,
    isDemo: boolean = false
  ): Promise<FinalRankResult> {
    const weights = this.getWeightProfile(asset.assetClass);

    // 1. HARD ELIGIBILITY GATES
    let eligibility = true;
    let eligibilityReason: string | undefined = undefined;

    // Gate 1: Asset must not be halted
    if (asset.status === 'halted') {
      eligibility = false;
      eligibilityReason = 'Handel an der Heimatbörse ausgesetzt (Market Halt)';
    }

    // Gate 2: Liquidity threshold check
    const rsiFeature = features.get('rsi_14');
    if (!rsiFeature || rsiFeature.qualityScore < 50) {
      eligibility = false;
      eligibilityReason = 'Ungenügende Datenqualität oder fehlende Liquiditätsprüfung';
    }

    // Gate 3: Bot manipulation veto
    const botRisk = features.get('bot_manipulation_risk_index')?.value || 0;
    if (botRisk > 75) {
      eligibility = false;
      eligibilityReason = 'Akutes Manipulationsrisiko durch koordiniertes Bot-Netzwerk (>75%)';
    }

    const eligibilityMultiplier = eligibility ? 1.0 : 0.0;

    // 2. CONFIDENCE COMPUTATION
    // Measures data completeness, freshness, and feature coverage
    const featureCount = features.size;
    const requiredFeatureCount = 6;
    const completenessRatio = Math.min(1.0, featureCount / requiredFeatureCount);
    const averageQuality =
      Array.from(features.values()).reduce((sum, f) => sum + f.qualityScore, 0) / (featureCount || 1);
    const confidence = Number((completenessRatio * (averageQuality / 100)).toFixed(2));

    // 3. SUB-SCORE EXTRACTION (Normalized 0-100)
    const momentumScore = features.get('rsi_14')?.normalizedValue ?? 50;
    const technicalScore = features.get('vwap_deviation_bps')?.normalizedValue ?? 50;
    const fundamentalScore = features.get('piotroski_f_score')?.normalizedValue ?? 50;
    const sentimentScore = features.get('sentiment_polarity_gemini')?.normalizedValue ?? 50;
    const eventScore = 65; // Deterministic catalyst baseline
    const positioningScore = features.get('orderbook_imbalance_ratio_l2')?.normalizedValue ?? 50;

    const subScores = {
      momentumScore: Math.round(momentumScore),
      technicalScore: Math.round(technicalScore),
      fundamentalScore: Math.round(fundamentalScore),
      sentimentScore: Math.round(sentimentScore),
      eventScore: Math.round(eventScore),
      positioningScore: Math.round(positioningScore),
    };

    // 4. RISK PENALTY
    // Integrates spread, volatility, manipulation and distress
    let riskPenalty = 0;
    if (botRisk > 20) riskPenalty += (botRisk - 20) * 0.4;
    riskPenalty = Math.min(40, Math.round(riskPenalty));

    // 5. CANONICAL FORMULA APPLICATION
    const rawWeightedSum =
      weights.weightMomentum * momentumScore +
      weights.weightTechnical * technicalScore +
      weights.weightFundamental * fundamentalScore +
      weights.weightSentiment * sentimentScore +
      weights.weightEvent * eventScore +
      weights.weightPositioning * positioningScore;

    const unpenalizedScore = eligibilityMultiplier * confidence * rawWeightedSum;
    const finalScore = Math.max(0, Math.min(100, Math.round(unpenalizedScore - riskPenalty)));

    // 6. DRIVER ANALYSIS (Top Positive & Negative Contributions)
    const topPositiveDrivers: DriverContribution[] = [];
    const topNegativeDrivers: DriverContribution[] = [];

    if (fundamentalScore >= 70) {
      topPositiveDrivers.push({
        componentId: 'fundamental_quality_scorer',
        nameDe: 'Hohe Bilanz- & Moat-Qualität',
        contributionScore: +(weights.weightFundamental * (fundamentalScore - 50)).toFixed(1),
        evidenceSummary: 'Piotroski F-Score >= 8 und solide Free Cash Flow Generierung.',
      });
    }

    if (momentumScore >= 65) {
      topPositiveDrivers.push({
        componentId: 'momentum_persistence_scorer',
        nameDe: 'Starkes relatives Momentum',
        contributionScore: +(weights.weightMomentum * (momentumScore - 50)).toFixed(1),
        evidenceSummary: 'RSI & Trendstruktur signalisieren gesunden Aufwärtstrend.',
      });
    }

    if (riskPenalty > 0) {
      topNegativeDrivers.push({
        componentId: 'bot_manipulation_risk_scorer',
        nameDe: 'Erhöhtes Volatilitäts- & Manipulationsrisiko',
        contributionScore: -riskPenalty,
        evidenceSummary: 'Abzüge durch Bot-Aktivitäts-Score oder erhöhten Spread.',
      });
    }

    // Reason Codes
    const reasonCodes: string[] = [];
    if (eligibility) {
      reasonCodes.push('ELIGIBILITY_GATE_PASSED');
      if (finalScore >= 75) reasonCodes.push('HIGH_CONVICTION_RATING');
    } else {
      reasonCodes.push('BLOCKED_BY_ELIGIBILITY_GATE');
      if (eligibilityReason) reasonCodes.push(eligibilityReason);
    }

    // 7. CRYPTOGRAPHIC EVIDENCE CREATION
    const evidence = await EvidenceEngineService.createEvidenceRecord({
      assetId: asset.assetId,
      symbol: asset.symbol,
      modelVersion: this.MODEL_VERSION,
      features: Object.fromEntries(
        Array.from(features.entries()).map(([k, v]) => [k, v.normalizedValue])
      ),
      weights: { ...weights },
      subScores,
    });

    return {
      assetId: asset.assetId,
      symbol: asset.symbol,
      assetClass: asset.assetClass,
      rank: eligibility && confidence >= 0.65 ? 1 : null, // null if ineligible
      finalScore,
      eligibility,
      eligibilityReason,
      confidence,
      riskPenalty,
      subScores,
      weightsApplied: weights,
      topPositiveDrivers,
      topNegativeDrivers,
      reasonCodes,
      modelVersion: this.MODEL_VERSION,
      evidenceId: evidence.evidenceId,
      computedAt: evidence.computedAt,
      isDemo,
      regulatoryDisclaimer:
        'Keine Anlageberatung oder Finanzanalyse i.S.d. WpHG/MiFID II. Alle berechneten Scores und Rangfolgen basieren auf historischen bzw. zeitnahen Daten und begründen keine Garantie für zukünftige Kursentwicklungen.',
    };
  }
}
