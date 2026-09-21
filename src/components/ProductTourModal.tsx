import React, { useState } from 'react';
import { X, Play, CheckCircle2, ChevronRight, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';

interface ProductTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAnalysis: () => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Multi-Börsen Datenfeed',
    desc: 'Live-Aggregation von über 50 Börsen, Krypto-Exchanges und Devisenmärkten in sub-sekündlicher Präzision.',
    icon: Globe,
    color: 'text-amber-400',
    highlight: '50+ Börsen vernetzt',
  },
  {
    step: 2,
    title: 'Transparente KI-Scoring Engine',
    desc: 'Kombiniert Graham/Buffett-Value-Faktoren mit moderner Sentiment- und Momentum-Analyse.',
    icon: Zap,
    color: 'text-purple-400',
    highlight: 'Keine Blackbox',
  },
  {
    step: 3,
    title: 'Risiko- & Portfolioabsicherung',
    desc: 'Automatisierte Warnsignale bei überbewerteten Assets oder abrupten Trendwechseln.',
    icon: Shield,
    color: 'text-emerald-400',
    highlight: 'Frühzeitige Schutzsignale',
  },
];

export const ProductTourModal: React.FC<ProductTourModalProps> = ({ isOpen, onClose, onStartAnalysis }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[activeTab];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-lg bg-[#070e22] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BrandLogo variant="emblem" size="sm" />
            <div>
              <h3 className="text-lg font-bold text-white leading-none">Capital-AI Tour</h3>
              <p className="text-xs text-slate-400 mt-1">Interaktive Feature-Tour</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeTab === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Interactive Feature Display */}
        <div className="mt-5 p-5 rounded-2xl bg-[#0a122e] border border-slate-700/70 text-center relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-3">
            <StepIcon className={`w-7 h-7 ${currentStep.color}`} />
          </div>

          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 text-[11px] font-bold mb-2">
            {currentStep.highlight}
          </span>

          <h4 className="text-xl font-bold text-white mb-2">{currentStep.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
            {currentStep.desc}
          </p>

          <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <button
              type="button"
              disabled={activeTab === 0}
              onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
              className={`px-3 py-1.5 rounded-lg ${activeTab === 0 ? 'opacity-30 cursor-not-allowed' : 'text-slate-300 hover:text-white'}`}
            >
              Zurück
            </button>
            <span className="text-slate-400 font-mono">
              Schritt {activeTab + 1} von {TOUR_STEPS.length}
            </span>
            <button
              type="button"
              onClick={() => {
                if (activeTab < TOUR_STEPS.length - 1) {
                  setActiveTab((prev) => prev + 1);
                } else {
                  onClose();
                  onStartAnalysis();
                }
              }}
              className="px-3 py-1.5 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-300"
            >
              {activeTab === TOUR_STEPS.length - 1 ? 'Starten' : 'Weiter'}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onStartAnalysis();
          }}
          className="mt-5 w-full py-3 bg-[#F5B014] hover:bg-amber-300 text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <span>Jetzt Analyse kostenlos starten</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
