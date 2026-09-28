/**
 * CAPITAL AI — DATA PLAUSIBILITY & AUDIT VALIDATOR (PART 2)
 * Automated rule checker enforcing all 11 non-negotiable enterprise constraints.
 */

import { FinalRankResult, FeatureValue, DataProvenance } from './canonicalContracts';

export interface PlausibilityViolation {
  ruleId: string;
  ruleDescription: string;
  severity: 'CRITICAL_BLOCKER' | 'COMPLIANCE_WARNING';
  entityId: string;
  details: string;
}

export class DataPlausibilityValidator {
  /**
   * Validates a FinalRankResult against all 11 enterprise plausibility rules.
   */
  public static validateFinalRankResult(result: FinalRankResult): PlausibilityViolation[] {
    const violations: PlausibilityViolation[] = [];
    const now = Date.now();

    // 1. NO FUTURE TIMESTAMPS (allowing max 3000ms clock skew)
    if (result.computedAt > now + 3000) {
      violations.push({
        ruleId: 'PLAU-001-FUTURE-TIMESTAMP',
        ruleDescription: 'Berechnungs-Zeitstempel liegt unzulässig in der Zukunft',
        severity: 'CRITICAL_BLOCKER',
        entityId: result.assetId,
        details: `computedAt (${result.computedAt}) > now (${now})`,
      });
    }

    // 2. NO FINAL RANK WHEN ELIGIBILITY IS FALSE OR CONFIDENCE BELOW THRESHOLD
    if (!result.eligibility && result.rank !== null) {
      violations.push({
        ruleId: 'PLAU-002-INELIGIBLE-RANK-PUBLISHED',
        ruleDescription: 'Asset ohne bestandenes Eligibility-Gate darf keine Rangnummer führen',
        severity: 'CRITICAL_BLOCKER',
        entityId: result.assetId,
        details: `eligibility = false, but rank = ${result.rank}`,
      });
    }

    if (result.confidence < 0.5 && result.rank !== null) {
      violations.push({
        ruleId: 'PLAU-003-LOW-CONFIDENCE-RANK-PUBLISHED',
        ruleDescription: 'Asset mit unzureichender Konfidenz (<0.50) darf nicht gerankt werden',
        severity: 'CRITICAL_BLOCKER',
        entityId: result.assetId,
        details: `confidence = ${result.confidence}, but rank = ${result.rank}`,
      });
    }

    // 3. PERCENTAGE AND SCORE BOUNDS CHECKING (0-100)
    if (result.finalScore < 0 || result.finalScore > 100) {
      violations.push({
        ruleId: 'PLAU-004-SCORE-OUT-OF-BOUNDS',
        ruleDescription: 'Finaler Score liegt außerhalb des Wertebereichs [0, 100]',
        severity: 'CRITICAL_BLOCKER',
        entityId: result.assetId,
        details: `finalScore = ${result.finalScore}`,
      });
    }

    // 4. SUB-SCORES BOUNDS CHECKING
    for (const [key, value] of Object.entries(result.subScores)) {
      if (value < 0 || value > 100) {
        violations.push({
          ruleId: 'PLAU-005-SUB-SCORE-BOUNDS',
          ruleDescription: `Teil-Score ${key} liegt außerhalb von [0, 100]`,
          severity: 'CRITICAL_BLOCKER',
          entityId: result.assetId,
          details: `${key} = ${value}`,
        });
      }
    }

    // 5. NO UNSUPPORTED CAUSAL OR CERTAINTY WORDING
    const forbiddenPhrases = [
      'verursacht durch',
      'führt zwangsläufig zu',
      'garantierter gewinn',
      'sichere rendite',
      '100% sicher',
      'kaufempfehlung',
    ];

    const driverTexts = [
      ...result.topPositiveDrivers.map((d) => d.evidenceSummary.toLowerCase()),
      ...result.topNegativeDrivers.map((d) => d.evidenceSummary.toLowerCase()),
    ].join(' ');

    for (const phrase of forbiddenPhrases) {
      if (driverTexts.includes(phrase)) {
        violations.push({
          ruleId: 'PLAU-006-UNSUPPORTED-CAUSAL-WORDING',
          ruleDescription: 'Unzulässige Kausalitäts- oder Renditeversprechens-Aussage detektiert',
          severity: 'CRITICAL_BLOCKER',
          entityId: result.assetId,
          details: `Unzulässiger Textbaustein gefunden: "${phrase}"`,
        });
      }
    }

    // 6. MANDATORY EVIDENCE AND MODEL VERSION
    if (!result.evidenceId || !result.evidenceId.startsWith('EVD-')) {
      violations.push({
        ruleId: 'PLAU-007-MISSING-EVIDENCE-ID',
        ruleDescription: 'Keine gültige SHA-256 Audit-Evidence-ID zugewiesen',
        severity: 'CRITICAL_BLOCKER',
        entityId: result.assetId,
        details: `evidenceId: ${result.evidenceId}`,
      });
    }

    return violations;
  }

  /**
   * Validates DataProvenance records to prevent unverified dark-pool or pseudo-live claims.
   */
  public static validateProvenance(provenance: DataProvenance): PlausibilityViolation[] {
    const violations: PlausibilityViolation[] = [];

    // Telemetry latency must be non-negative
    if (provenance.latencyMs < 0) {
      violations.push({
        ruleId: 'PLAU-008-NEGATIVE-LATENCY',
        ruleDescription: 'Gemessene Latenz kann nicht negativ sein',
        severity: 'CRITICAL_BLOCKER',
        entityId: provenance.providerId,
        details: `latencyMs = ${provenance.latencyMs}`,
      });
    }

    // Demo data must never masquerade as public_realtime
    if (provenance.isDemo && provenance.licenseScope === 'public_realtime') {
      violations.push({
        ruleId: 'PLAU-009-DEMO-MASQUERADING-AS-LIVE',
        ruleDescription: 'Demo-Daten dürfen nicht als verifizierter Echtzeit-Stream deklariert werden',
        severity: 'CRITICAL_BLOCKER',
        entityId: provenance.providerId,
        details: 'isDemo=true with licenseScope=public_realtime',
      });
    }

    return violations;
  }
}
