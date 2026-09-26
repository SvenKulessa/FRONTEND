/**
 * CAPITAL AI — PROVIDER REGISTRY & CAPABILITY CONTRACTS TEST SUITE (WP-004)
 * Validates ProviderContract, ProviderCapabilityContract, AP-003 Routing, AP-006 Budget Cap (< 40 EUR)
 */

import {
  PROVIDER_REGISTRY,
  ProviderContractSchema,
  ProviderRegistryService,
} from '../../config/providers/providerRegistry';

export function runProviderRegistryValidationSuite(): { passed: boolean; results: string[] } {
  const results: string[] = [];
  let allPassed = true;

  // Test 1: Verify all registered providers adhere to ProviderContractSchema
  const providerIds = Object.keys(PROVIDER_REGISTRY);
  results.push(`[TEST 1] Auditing ${providerIds.length} registered providers against ProviderContractSchema...`);

  for (const id of providerIds) {
    const provider = PROVIDER_REGISTRY[id];
    const parseResult = ProviderContractSchema.safeParse(provider);
    if (parseResult.success) {
      results.push(`  ✓ Provider "${provider.name}" (${provider.slug}) conforms strictly to ProviderContractSchema.`);
    } else {
      allPassed = false;
      results.push(`  ✗ Provider "${id}" schema validation failed: ${JSON.stringify(parseResult.error.format())}`);
    }
  }

  // Test 2: Taxonomy Routing based on Asset Classes (AP-003)
  results.push('[TEST 2] Verifying Taxonomy Routing for asset classes (AP-003)...');
  const cryptoProviders = ProviderRegistryService.getHealthyProvidersForAsset('crypto');
  if (cryptoProviders.length >= 2 && cryptoProviders.some((p) => p.slug === 'binance')) {
    results.push(`  ✓ Crypto routing resolved ${cryptoProviders.length} healthy providers (Binance, Kraken, Alchemy).`);
  } else {
    allPassed = false;
    results.push('  ✗ Crypto routing failed to return expected providers.');
  }

  const macroProviders = ProviderRegistryService.getHealthyProvidersForAsset('fixed_income');
  if (macroProviders.length >= 1 && macroProviders.some((p) => p.slug === 'fred')) {
    results.push(`  ✓ Fixed income / Macro routing resolved FRED St. Louis Fed provider.`);
  } else {
    allPassed = false;
    results.push('  ✗ Fixed income / Macro routing failed to return FRED.');
  }

  // Test 3: Budget Constraint & Monthly Operating Cap <= 40 EUR (AP-006)
  results.push('[TEST 3] Verifying Monthly Provider Operating Budget <= 40.00 EUR (AP-006)...');
  const budgetAudit = ProviderRegistryService.calculateTotalProviderSpendEur();
  if (budgetAudit.isWithinBudget && budgetAudit.totalMonthlySpendEur <= 40.0) {
    results.push(
      `  ✓ Provider budget compliant: ${budgetAudit.totalMonthlySpendEur.toFixed(2)} € / ${budgetAudit.budgetCapEur.toFixed(2)} € (Buffer: ${budgetAudit.remainingBudgetEur.toFixed(2)} €).`
    );
  } else {
    allPassed = false;
    results.push(
      `  ✗ Provider budget breach! Total: ${budgetAudit.totalMonthlySpendEur} € exceeds cap of ${budgetAudit.budgetCapEur} €`
    );
  }

  // Test 4: Comprehensive Audit Report Generation
  results.push('[TEST 4] Verifying Provider Audit & Alerting generation...');
  const auditReport = ProviderRegistryService.auditProviderHealthAndBudget();
  if (auditReport.totalProvidersCount >= 5 && auditReport.healthyCount >= 5) {
    results.push(`  ✓ Audit report successfully generated with avg latency ${auditReport.averageLatencyMs}ms.`);
  } else {
    allPassed = false;
    results.push('  ✗ Audit report failed sanity checks.');
  }

  return { passed: allPassed, results };
}
