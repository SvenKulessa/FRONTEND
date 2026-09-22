import React from 'react';
import { X, Check, ArrowRight, Newspaper, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { CoreModule } from '../types';

interface ModuleDetailModalProps {
  module: CoreModule | null;
  onClose: () => void;
  onOpenAnalysis: () => void;
  onOpenVocabulary?: () => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
  module,
  onClose,
  onOpenAnalysis,
  onOpenVocabulary,
}) => {
  if (!module) return null;

  const brandColor = module.brandColor || '#F9BF21';
  const isVocabulary = module.id === 'vocabulary';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-lg bg-[#070e22] border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ borderColor: `${brandColor}40` }}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${brandColor}20`,
                borderColor: `${brandColor}50`,
                color: brandColor,
                boxShadow: `0 0 16px ${brandColor}30`,
              }}
            >
              {module.iconType === 'news' ? (
                <Newspaper className="w-5 h-5" />
              ) : module.iconType === 'brain' ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <TrendingUp className="w-5 h-5" />
              )}
            </div>
            <div>
              <span
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: brandColor }}
              >
                Kernmodul
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{module.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{module.tagline}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center shrink-0"
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

        {/* AI Newsfeed Live Feed (if available) */}
        {module.details.newsItems && module.details.newsItems.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: brandColor }}>
                <span className="w-2 h-2 rounded-full bg-[#44DE88] animate-ping" />
                Live News-Stream & Sentiment
              </h4>
              <span className="text-[10.5px] font-mono text-slate-400">Aktualisiert: gerade eben</span>
            </div>
            <div className="space-y-2">
              {module.details.newsItems.map((news, idx) => {
                const isBullish = news.sentiment === 'bullish';
                const isBearish = news.sentiment === 'bearish';
                const sentimentColor = isBullish ? '#44DE88' : isBearish ? '#F87171' : '#8D26FF';
                const sentimentLabel = isBullish ? 'Bullisch' : isBearish ? 'Bärisch' : 'Neutral';

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#050b1d] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {news.source} • <span className="text-slate-500">{news.time}</span>
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                        style={{
                          color: sentimentColor,
                          backgroundColor: `${sentimentColor}15`,
                          borderColor: `${sentimentColor}40`,
                        }}
                      >
                        {sentimentLabel}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-white leading-snug">
                      {news.headline}
                    </div>
                    <div className="text-[10.5px] font-mono text-slate-400 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                      <span>Fokus: {news.impact}</span>
                      <span className="text-amber-400/90">KI-Score: 94%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Key Features List */}
        <div className="mt-5">
          <h4
            className="text-xs font-bold uppercase tracking-wider mb-2.5"
            style={{ color: brandColor }}
          >
            Funktionsmerkmale & Vorteile
          </h4>
          <div className="space-y-2">
            {module.details.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${brandColor}20`, color: brandColor }}
                >
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
                  <div className="text-[10.5px] font-semibold text-[#44DE88] mt-0.5">
                    {metric.score}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex flex-col gap-2">
          {isVocabulary ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenVocabulary) {
                  onOpenVocabulary();
                } else {
                  onOpenAnalysis();
                }
              }}
              className="w-full py-3 text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg cursor-pointer"
              style={{ backgroundColor: brandColor }}
            >
              <span>Vollständiges Glossar öffnen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAnalysis();
              }}
              className="w-full py-3 text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg cursor-pointer"
              style={{ backgroundColor: brandColor }}
            >
              <span>Dieses Modul jetzt testen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </motion.div>
    </div>
  );
};
