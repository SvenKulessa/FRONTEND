/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Verification & Contract Test Suite
 */

import {
  NODE_CATALOG,
  createPipelineNode,
  validatePipelineGraph,
  PipelineDefinition,
  PipelineDefinitionSchema,
} from '../index';

export function runContractValidationSuite(): { passed: boolean; results: string[] } {
  const results: string[] = [];
  let allPassed = true;

  // Test 1: Verify all catalog entries can be instantiated and validated by Zod
  const catalogKeys = Object.keys(NODE_CATALOG);
  results.push(`[TEST 1] Auditing ${catalogKeys.length} catalog nodes for schema compliance...`);

  for (const key of catalogKeys) {
    try {
      const node = createPipelineNode(key, { x: 100, y: 100 });
      if (!node.id || !node.config) {
        throw new Error(`Node ${key} generated invalid structure`);
      }
      results.push(`  ✓ Node [${node.category.toUpperCase()}] ${key}: Zod validation passed.`);
    } catch (err: any) {
      allPassed = false;
      results.push(`  ✗ Node ${key} failed validation: ${err.message}`);
    }
  }

  // Test 2: Verify Graph Validator with an invalid empty pipeline
  results.push('[TEST 2] Verifying empty pipeline rejection...');
  const emptyPipeline: PipelineDefinition = {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Empty Pipeline',
    description: 'Testing validation',
    version: '1.0.0',
    lifecycle: 'draft',
    executionMode: 'research',
    targetAssetClasses: ['crypto'],
    nodes: [],
    edges: [],
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const emptyValidation = validatePipelineGraph(emptyPipeline);
  if (!emptyValidation.isValid && emptyValidation.issues.some((i) => i.id === 'ERR_EMPTY_PIPELINE')) {
    results.push('  ✓ Empty pipeline correctly rejected with ERR_EMPTY_PIPELINE.');
  } else {
    allPassed = false;
    results.push('  ✗ Empty pipeline validation failed to catch empty graph.');
  }

  // Test 3: Verify AP-002 Evidence Before Decision Rule in Production Mode
  results.push('[TEST 3] Verifying AP-002 Evidence Gate Enforcement in Production Mode...');
  const unverifiedProdPipeline: PipelineDefinition = {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Unverified Production Pipeline',
    description: 'Missing evidence gate',
    version: '1.0.0',
    lifecycle: 'production',
    executionMode: 'production',
    targetAssetClasses: ['crypto', 'equity_us'],
    nodes: [
      createPipelineNode('provider_websocket', { x: 0, y: 0 }),
      createPipelineNode('target_adapter_tradingview', { x: 400, y: 0 }),
    ],
    edges: [],
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const unverifiedValidation = validatePipelineGraph(unverifiedProdPipeline);
  if (
    !unverifiedValidation.isValid &&
    unverifiedValidation.issues.some((i) => i.id === 'ERR_AP002_EVIDENCE_GATE_REQUIRED')
  ) {
    results.push('  ✓ AP-002 rule enforced: Production pipeline without evidence gate rejected.');
  } else {
    allPassed = false;
    results.push('  ✗ AP-002 check failed to reject unverified production pipeline.');
  }

  // Test 4: Verify Valid End-to-End Pipeline
  results.push('[TEST 4] Verifying fully compliant end-to-end Pipeline with Evidence & Budget Compliance...');
  const nodeIngest = createPipelineNode('provider_websocket', { x: 0, y: 0 });
  const nodeEvidence = createPipelineNode('evidence_writer', { x: 250, y: 0 });
  const nodeConsensus = createPipelineNode('provider_consensus', { x: 500, y: 0 });
  const nodeEgress = createPipelineNode('target_adapter_python_arrow', { x: 750, y: 0 });

  const validPipeline: PipelineDefinition = {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Institutional Low-Latency Ingestion Pipeline',
    description: 'Validated institutional setup',
    version: '1.0.0',
    lifecycle: 'validated',
    executionMode: 'production',
    targetAssetClasses: ['crypto', 'equity_us'],
    nodes: [nodeIngest, nodeEvidence, nodeConsensus, nodeEgress],
    edges: [
      {
        id: 'edge_1',
        sourceNodeId: nodeIngest.id,
        sourcePortId: 'ticks_out',
        targetNodeId: nodeEvidence.id,
        targetPortId: 'in_ticks',
        dataType: 'tick_stream',
      },
      {
        id: 'edge_2',
        sourceNodeId: nodeEvidence.id,
        sourcePortId: 'out_evidence',
        targetNodeId: nodeConsensus.id,
        targetPortId: 'in_raw_ticks',
        dataType: 'tick_stream',
      },
      {
        id: 'edge_3',
        sourceNodeId: nodeConsensus.id,
        sourcePortId: 'out_consensus_ticks',
        targetNodeId: nodeEgress.id,
        targetPortId: 'in_ticks',
        dataType: 'tick_stream',
      },
    ],
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Validate entire structure against Zod Schema
  PipelineDefinitionSchema.parse(validPipeline);
  const validResult = validatePipelineGraph(validPipeline);

  if (validResult.isValid && validResult.budgetCompliant && validResult.evidenceVerified) {
    results.push(
      `  ✓ Valid Pipeline passed all checks! DQS: ${validResult.dataQualityScore}%, Latency: ${validResult.estimatedLatencyMs}ms, Monthly Budget: ${validResult.estimatedMonthlyCostEur} € (Compliant <= 40 €)`
    );
  } else {
    allPassed = false;
    results.push(
      `  ✗ Valid pipeline unexpectedly failed validation: ${JSON.stringify(validResult.issues)}`
    );
  }

  return { passed: allPassed, results };
}
