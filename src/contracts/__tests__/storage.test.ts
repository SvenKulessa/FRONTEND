/**
 * CAPITAL AI — PERSISTENCE & STORAGE TESTS (WP-2)
 */

import { PipelineStorageService, getPresetPipelines } from '../../services/pipelineStorage';
import { validatePipelineGraph } from '../pipeline';

export function runStorageValidationSuite(): { passed: boolean; results: string[] } {
  const results: string[] = [];
  let allPassed = true;

  results.push('[STORAGE TEST 1] Verifying preset pipeline templates...');
  const presets = getPresetPipelines();
  if (presets.length >= 3) {
    results.push(`  ✓ ${presets.length} Presets generated successfully.`);
  } else {
    allPassed = false;
    results.push('  ✗ Failed to generate all presets.');
  }

  for (const preset of presets) {
    const val = validatePipelineGraph(preset);
    if (val.isValid) {
      results.push(`  ✓ Preset "${preset.name}" (${preset.executionMode}): Valid graph! DQS: ${val.dataQualityScore}%`);
    } else {
      allPassed = false;
      results.push(`  ✗ Preset "${preset.name}" validation issues: ${JSON.stringify(val.issues)}`);
    }
  }

  results.push('[STORAGE TEST 2] Verifying URL serialization & deserialization...');
  const sample = presets[0];
  const encoded = PipelineStorageService.encodePipelineToUrlHash(sample);
  const decoded = PipelineStorageService.decodePipelineFromUrl(encoded);

  if (decoded && decoded.id === sample.id && decoded.nodes.length === sample.nodes.length) {
    results.push('  ✓ URL Hash base64 serialization & round-trip decoding verified.');
  } else {
    allPassed = false;
    results.push('  ✗ URL round-trip serialization failed.');
  }

  return { passed: allPassed, results };
}
