/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Pipeline Graph Validation Issues & Remediation Drawer
 */

import React from 'react';
import { X, AlertTriangle, AlertCircle, Info, CheckCircle2, Wrench } from 'lucide-react';
import { PipelineValidationResult, PipelineValidationIssue } from '../../contracts';

interface PipelineIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  validationResult: PipelineValidationResult;
}

export const PipelineIssuesModal: React.FC<PipelineIssuesModalProps> = ({
  isOpen,
  onClose,
  validationResult,
}) => {
  if (!isOpen) return null;

  const errors = validationResult.issues.filter((i) => i.severity === 'error');
  const warnings = validationResult.issues.filter((i) => i.severity === 'warning');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#07111F] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-[#0C1B2A]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                validationResult.isValid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {validationResult.isValid ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Architektur-Audit & Validierung</h3>
              <p className="text-xs text-slate-400">
                Regeln AP-001 (Vertragstreue), AP-002 (Evidence) & AP-006 (Budget &le; 40 €)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {validationResult.isValid && validationResult.issues.length === 0 ? (
            <div className="py-8 text-center text-slate-300">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white">Alle Compliance-Prüfungen Bestanden</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Der Datenfluss ist azyklisch, die Typverträge sind kompatibel und alle Governance-Gates sind erfüllt.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {validationResult.issues.map((issue: PipelineValidationIssue) => (
                <div
                  key={issue.id}
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    issue.severity === 'error'
                      ? 'bg-red-500/10 border-red-500/30 text-red-200'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
                      Regel {issue.ruleId} • {issue.severity.toUpperCase()}
                    </span>
                    {issue.nodeId && <span className="font-mono text-slate-400">Node: {issue.nodeId}</span>}
                  </div>

                  <p className="font-medium text-white">{issue.message}</p>

                  {issue.remediationAdvice && (
                    <div className="flex items-start gap-1.5 pt-1 text-slate-300 border-t border-slate-800/60">
                      <Wrench className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                      <span>{issue.remediationAdvice}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0C1B2A]/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
