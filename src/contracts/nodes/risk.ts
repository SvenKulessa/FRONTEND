/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Risk & Guardrail Gates (AP-004, AP-008)
 */

import { z } from 'zod';
import { NodePort } from '../common';

// 1. human_approval_gate (AP-004)
export const HumanApprovalGateConfigSchema = z.object({
  approvalType: z.enum(['paper_order_routing', 'report_publishing', 'strategy_promotion', 'domain_dns']),
  timeoutMinutes: z.number().int().min(1).max(1440).default(60),
  fallbackActionOnTimeout: z.enum(['auto_reject', 'escalate_supervisor', 'freeze_pipeline']).default('auto_reject'),
  requiredRole: z.enum(['owner', 'portfolio_manager', 'compliance_officer']).default('portfolio_manager'),
  multiSigRequiredSignatures: z.number().int().min(1).max(3).default(1),
});
export type HumanApprovalGateConfig = z.infer<typeof HumanApprovalGateConfigSchema>;

// 2. max_drawdown_stop
export const MaxDrawdownStopConfigSchema = z.object({
  maxDrawdownPercent: z.number().min(0.5).max(50.0).default(5.0),
  evaluationWindowDays: z.number().int().min(1).max(365).default(30),
  actionOnBreach: z.enum(['liquidate_paper_positions', 'halt_pipeline', 'emit_critical_alert']).default('halt_pipeline'),
});
export type MaxDrawdownStopConfig = z.infer<typeof MaxDrawdownStopConfigSchema>;

// 3. volatility_circuit
export const VolatilityCircuitConfigSchema = z.object({
  vixThreshold: z.number().positive().default(35.0),
  realizedVolThresholdPercent: z.number().positive().default(45.0),
  cooldownPeriodMinutes: z.number().int().min(5).max(1440).default(60),
});
export type VolatilityCircuitConfig = z.infer<typeof VolatilityCircuitConfigSchema>;

// 4. regulatory_sanction_filter
export const RegulatorySanctionFilterConfigSchema = z.object({
  enforceOfacSdList: z.boolean().default(true),
  enforceEuSanctions: z.boolean().default(true),
  chainalysisRiskScoreMax: z.number().min(0).max(10).default(2.0),
  rejectTornadoCashMixerHops: z.boolean().default(true),
});
export type RegulatorySanctionFilterConfig = z.infer<typeof RegulatorySanctionFilterConfigSchema>;

// 5. position_limit_gate
export const PositionLimitGateConfigSchema = z.object({
  maxCapitalAllocationPerAssetPercent: z.number().min(1.0).max(100.0).default(15.0),
  maxOpenPositions: z.number().int().min(1).max(50).default(10),
  maxGrossLeverage: z.number().min(1.0).max(20.0).default(1.0), // 1.0 = No leverage by default
});
export type PositionLimitGateConfig = z.infer<typeof PositionLimitGateConfigSchema>;

export const RISK_PORTS: Record<string, NodePort[]> = {
  human_approval_gate: [
    { id: 'in_signal', name: 'Candidate Signal', type: 'signal_event', direction: 'in', required: true },
    { id: 'out_approved', name: 'Approved Execution', type: 'paper_order', direction: 'out', required: true },
  ],
  max_drawdown_stop: [
    { id: 'in_reports', name: 'Execution Reports', type: 'execution_report', direction: 'in', required: true },
    { id: 'out_circuit', name: 'Circuit State', type: 'signal_event', direction: 'out', required: true },
  ],
};
