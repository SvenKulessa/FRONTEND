/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Pipeline Graph, Nodes, Edges, Topological Validation & State Contracts
 */

import { z } from 'zod';
import {
  WorkflowLifecycleSchema,
  ExecutionModeSchema,
  AssetClassSchema,
  PortDataTypeSchema,
  NodePortSchema,
} from './common';

export const NodeCategorySchema = z.enum([
  'ingestion',
  'authority',
  'transformation',
  'analytics',
  'reasoning',
  'risk',
  'backtest',
  'egress',
]);
export type NodeCategory = z.infer<typeof NodeCategorySchema>;

export const PipelineNodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  category: NodeCategorySchema,
  label: z.string().min(1),
  description: z.string().optional(),
  config: z.record(z.string(), z.any()),
  inputs: z.array(NodePortSchema).default([]),
  outputs: z.array(NodePortSchema).default([]),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  status: z.enum(['idle', 'configuring', 'valid', 'error']).default('valid'),
});
export type PipelineNode = z.infer<typeof PipelineNodeSchema>;

export const PipelineEdgeSchema = z.object({
  id: z.string().min(1),
  sourceNodeId: z.string().min(1),
  sourcePortId: z.string().min(1),
  targetNodeId: z.string().min(1),
  targetPortId: z.string().min(1),
  dataType: PortDataTypeSchema,
});
export type PipelineEdge = z.infer<typeof PipelineEdgeSchema>;

export const PipelineValidationIssueSchema = z.object({
  id: z.string(),
  severity: z.enum(['error', 'warning', 'info']),
  ruleId: z.string(), // e.g. AP-001, AP-002, AP-006
  nodeId: z.string().optional(),
  edgeId: z.string().optional(),
  message: z.string().min(1),
  remediationAdvice: z.string().optional(),
});
export type PipelineValidationIssue = z.infer<typeof PipelineValidationIssueSchema>;

export const PipelineValidationResultSchema = z.object({
  isValid: z.boolean(),
  issues: z.array(PipelineValidationIssueSchema),
  dataQualityScore: z.number().min(0).max(100),
  estimatedLatencyMs: z.number().positive(),
  estimatedMonthlyCostEur: z.number().min(0),
  budgetCompliant: z.boolean(),
  evidenceVerified: z.boolean(),
});
export type PipelineValidationResult = z.infer<typeof PipelineValidationResultSchema>;

export const PipelineDefinitionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(''),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).default('1.0.0'),
  lifecycle: WorkflowLifecycleSchema.default('draft'),
  executionMode: ExecutionModeSchema.default('research'),
  targetAssetClasses: z.array(AssetClassSchema).min(1),
  nodes: z.array(PipelineNodeSchema),
  edges: z.array(PipelineEdgeSchema),
  metadata: z.record(z.string(), z.any()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type PipelineDefinition = z.infer<typeof PipelineDefinitionSchema>;

// =============================================================================
// GRAPH VALIDATION & COMPLIANCE ENGINE (AP-001, AP-002, AP-006)
// =============================================================================

export function validatePipelineGraph(pipeline: PipelineDefinition): PipelineValidationResult {
  const issues: PipelineValidationIssue[] = [];

  // 1. Minimum Nodes Check
  if (pipeline.nodes.length === 0) {
    issues.push({
      id: 'ERR_EMPTY_PIPELINE',
      severity: 'error',
      ruleId: 'AP-001',
      message: 'Die Pipeline enthält keine Knoten. Füge mindestens eine Ingestion- und Egress-Quelle hinzu.',
    });
  }

  // 2. Ingestion & Egress presence check
  const hasIngestion = pipeline.nodes.some((n) => n.category === 'ingestion');
  const hasEgress = pipeline.nodes.some((n) => n.category === 'egress');

  if (!hasIngestion) {
    issues.push({
      id: 'ERR_MISSING_INGESTION',
      severity: 'error',
      ruleId: 'AP-001',
      message: 'Mindestens ein Datenquellen-Knoten (Ingestion) wird benötigt.',
      remediationAdvice: 'Füge einen provider_websocket oder provider_rest Knoten hinzu.',
    });
  }

  if (!hasEgress) {
    issues.push({
      id: 'ERR_MISSING_EGRESS',
      severity: 'error',
      ruleId: 'AP-001',
      message: 'Mindestens ein Ziel-Adapter (Egress) wird benötigt.',
      remediationAdvice: 'Füge einen TradingView, Python-Arrow oder Alert-Dispatcher Knoten hinzu.',
    });
  }

  // 3. AP-002: Evidence Before Decision Gate Check
  // In production or paper mode, at least one authority/evidence node must be present
  const hasEvidenceGate = pipeline.nodes.some(
    (n) => n.type === 'evidence_writer' || n.type === 'data_quality_gate' || n.type === 'provider_consensus'
  );

  if ((pipeline.executionMode === 'production' || pipeline.executionMode === 'paper') && !hasEvidenceGate) {
    issues.push({
      id: 'ERR_AP002_EVIDENCE_GATE_REQUIRED',
      severity: 'error',
      ruleId: 'AP-002',
      message: 'Evidence Before Decision (AP-002): Im Produktions- und Paper-Modus ist ein Evidence- oder Quorum-Gate zwingend erforderlich.',
      remediationAdvice: 'Schalte einen evidence_writer oder provider_consensus Knoten vor die Egress-Stufe.',
    });
  }

  // 4. Cycle Detection in Directed Graph
  const adjacency = new Map<string, string[]>();
  pipeline.nodes.forEach((n) => adjacency.set(n.id, []));
  pipeline.edges.forEach((e) => {
    adjacency.get(e.sourceNodeId)?.push(e.targetNodeId);
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();
  let hasCycle = false;

  function checkCycle(nodeId: string): boolean {
    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjacency.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (checkCycle(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const node of pipeline.nodes) {
    if (!visited.has(node.id)) {
      if (checkCycle(node.id)) {
        hasCycle = true;
        issues.push({
          id: 'ERR_GRAPH_CYCLE_DETECTED',
          severity: 'error',
          ruleId: 'AP-001',
          nodeId: node.id,
          message: `Zyklischer Datenfluss bei Knoten ${node.label} (${node.id}) erkannt. Pipelines müssen azyklisch (DAG) sein.`,
        });
        break;
      }
    }
  }

  // 5. AP-006: Budget Constraint Calculation (< 40 EUR / Month)
  // Baseline infrastructure: 14 EUR
  let estimatedMonthlyCostEur = 14.0;
  pipeline.nodes.forEach((n) => {
    if (n.type === 'market_data_cache') estimatedMonthlyCostEur += 4.5;
    if (n.type === 'llm_reasoner') estimatedMonthlyCostEur += 5.0;
    if (n.type === 'sentiment_nlp') estimatedMonthlyCostEur += 3.5;
    if (n.type === 'provider_websocket') estimatedMonthlyCostEur += 2.0;
  });

  const budgetCompliant = estimatedMonthlyCostEur <= 40.0;
  if (!budgetCompliant) {
    issues.push({
      id: 'ERR_AP006_BUDGET_EXCEEDED',
      severity: 'error',
      ruleId: 'AP-006',
      message: `Monatliche Betriebskosten (${estimatedMonthlyCostEur.toFixed(2)} €) überschreiten das 40,00 € Budget-Limit.`,
      remediationAdvice: 'Reduziere GPU-intensive NLP-Knoten oder wechsle zu speichereffizientem Ring-Buffer Caching.',
    });
  }

  // Compute Latency & Data Quality Score
  let estimatedLatencyMs = 12;
  pipeline.nodes.forEach((n) => {
    if (n.category === 'ingestion') estimatedLatencyMs += 8;
    if (n.category === 'authority') estimatedLatencyMs += 5;
    if (n.category === 'transformation') estimatedLatencyMs += 3;
    if (n.category === 'analytics') estimatedLatencyMs += 6;
    if (n.category === 'reasoning') estimatedLatencyMs += 15;
    if (n.category === 'egress') estimatedLatencyMs += 4;
  });

  let dataQualityScore = 95.0;
  if (hasEvidenceGate) dataQualityScore += 3.5;
  if (pipeline.nodes.some((n) => n.type === 'schema_validator')) dataQualityScore += 0.8;
  if (pipeline.nodes.some((n) => n.type === 'freshness_validator')) dataQualityScore += 0.5;
  dataQualityScore = Math.min(99.9, dataQualityScore);

  const isValid = issues.filter((i) => i.severity === 'error').length === 0;

  return {
    isValid,
    issues,
    dataQualityScore,
    estimatedLatencyMs,
    estimatedMonthlyCostEur,
    budgetCompliant,
    evidenceVerified: hasEvidenceGate,
  };
}
