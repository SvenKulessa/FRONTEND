import React from 'react';
import { X, Check, ArrowRight, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { CoreModule } from '../types';

interface ModuleDetailModalProps {
  module: CoreModule | null;
  onClose: () => void;
  onOpenAnalysis: () => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({ module, onClose, onOpenAnalysis }) => {
  if (!module) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-lg bg-[#070e22] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              Modul-Details
            </span>
            <h3 className="text-2xl font-bold text-white mt-0.5">{module.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{module.tagline}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Use Case Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#0a132d] border border-slate-700/80">
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {module.details.useCase}
          </p>
        </div>

        {/* Key Features List */}
        <div className="mt-5">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5">
            Funktionsmerkmale & Vorteile
          </h4>
          <div className="space-y-2">
            {module.details.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-xs text-slate-300 leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Metrics */}
        <div className="mt-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Exemplarische Bewertungsmetriken
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {module.details.sampleMetrics.map((metric, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#040816] border border-slate-800">
                <div className="text-[11px] text-slate-400 truncate">{metric.label}</div>
                <div className="text-base font-bold text-white mt-0.5">{metric.value}</div>
                {metric.score && (
                  <div className="text-[10.5px] font-semibold text-emerald-400 mt-0.5">
                    {metric.score}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAnalysis();
            }}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>Dieses Modul jetzt testen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
          >
            Schließen
          </button>
        </div>
      </motion.div>
    </div>
  );
};
