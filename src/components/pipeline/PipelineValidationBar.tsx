/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Real-Time Pipeline Metrics & Compliance Validation Header
 */

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Coins,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { PipelineValidationResult, ExecutionMode } from '../../contracts';

interface PipelineValidationBarProps {
  validationResult: PipelineValidationResult;
  executionMode: ExecutionMode;
  onChangeExecutionMode: (mode: ExecutionMode) => void;
  onOpenIssuesModal: () => void;
  nodeCount: number;
  edgeCount: number;
}

export const PipelineValidationBar: React.FC<PipelineValidationBarProps> = ({
  validationResult,
  executionMode,
  onChangeExecutionMode,
  onOpenIssuesModal,
  nodeCount,
  edgeCount,
}) => {
  const errorCount = validationResult.issues.filter((i) => i.severity === 'error').length;
  const warningCount = validationResult.issues.filter((i) => i.severity === 'warning').length;

  return (
    <div className="w-full bg-[#0C1B2A]/90 border-b border-slate-800 backdrop-blur-md px-4 py-3 flex flex-wrap items-center justify-between gap-4 select-none">
      {/* Left: Validation Status & Execution Mode */}
      <div className="flex items-center gap-3">
        {/* Status Pill */}
        <button
          type="button"
          onClick={onOpenIssuesModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-transform active:scale-95 ${
            validationResult.isValid
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 animate-pulse'
          }`}
        >
          {validationResult.isValid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-red-400" />
          )}
          <span>
            {validationResult.isValid ? 'Graph Valide & Lauffähig' : `${errorCount} Fehler im Graph`}
          </span>
          {(errorCount > 0 || warningCount > 0) && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 border border-slate-700">
              {errorCount + warningCount}
            </span>
          )}
        </button>

        {/* Execution Mode Dropdown */}
        <div className="flex items-center gap-1.5 bg-[#07111F] px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Modus:</span>
          <select
            value={executionMode}
            onChange={(e) => onChangeExecutionMode(e.target.value as ExecutionMode)}
            className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
          >
            <option value="research" className="bg-[#07111F] text-slate-200">Research (Lokal)</option>
            <option value="shadow" className="bg-[#07111F] text-slate-200">Shadow (Silent Live)</option>
            <option value="paper" className="bg-[#07111F] text-slate-200">Paper (Virtuelle Orders)</option>
            <option value="production" className="bg-[#07111F] text-slate-200">Production (Live Scores)</option>
            <option value="execution_eligible" className="bg-[#07111F] text-slate-200">Execution Eligible (Compliance Gate)</option>
          </select>
        </div>
      </div>

      {/* Center: Live Architecture Metrics */}
      <div className="flex items-center gap-5 text-xs">
        {/* DQS Score */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Data Quality Score:</span>
          <span className="font-bold font-mono text-emerald-400">
            {validationResult.dataQualityScore.toFixed(1)}%
          </span>
        </div>

        {/* Latency */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">E2E-Latenz:</span>
          <span className="font-bold font-mono text-cyan-400">
            &le; {validationResult.estimatedLatencyMs}ms
          </span>
        </div>

        {/* Monthly Cost (AP-006) */}
        <div className="flex items-center gap-1.5">
          <Coins className={`w-4 h-4 ${validationResult.budgetCompliant ? 'text-amber-400' : 'text-red-400'}`} />
          <span className="text-slate-400">Kosten / Monat:</span>
          <span
            className={`font-bold font-mono ${
              validationResult.budgetCompliant ? 'text-amber-400' : 'text-red-400'
            }`}
          >
            {validationResult.estimatedMonthlyCostEur.toFixed(2)} €
          </span>
          <span className="text-[10px] text-slate-500 font-mono">(Budget: 40 €)</span>
        </div>

        {/* AP-002 Evidence Verified Status */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-[11px] text-purple-300 font-medium">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>AP-002: {validationResult.evidenceVerified ? 'Merkle Gate Aktiv' : 'Kein Evidence-Gate'}</span>
        </div>
      </div>

      {/* Right: Graph Node & Wire Count */}
      <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
        <span>{nodeCount} Knoten</span>
        <span>•</span>
        <span>{edgeCount} Verbindungen</span>
      </div>
    </div>
  );
};
