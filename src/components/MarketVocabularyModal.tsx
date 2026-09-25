/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: MARKET VOCABULARY & FINANZ-GLOSSAR MODAL]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Durchsuchbares Glossar mit mathematischen Berechnungsformeln
 *    - Kategorie-Filterung (Quant & KI, Makro & Geldpolitik, Krypto & On-Chain, Value Investing)
 *    - Interaktive Formelkarten mit Praxisbeispielen
 * 2. SCORING-LOGIK        : 
 *    - Mathematische Definitionen aller im Terminal verwendeten Scores (SMFI, Sharpe Ratio, Altman Z)
 * 3. DATENANBINDUNG       : 
 *    - Callback `onSelectAssetSymbol()` öffnet Detail-Modal für referenzierte Beispiel-Assets
 * 4. DATENQUELLEN / FEEDS : 
 *    - `VOCABULARY_TERMS` & `VOCABULARY_CATEGORIES` aus `src/data/vocabularyData.ts`
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  TrendingUp,
  Brain,
  Coins,
  ShieldCheck,
  Globe2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  VOCABULARY_TERMS,
  VOCABULARY_CATEGORIES,
  VocabularyCategory,
  VocabularyTerm,
} from '../data/vocabularyData';

interface MarketVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAnalysis?: () => void;
  onSelectAssetSymbol?: (symbol: string) => void;
}

export const MarketVocabularyModal: React.FC<MarketVocabularyModalProps> = ({
  isOpen,
  onClose,
  onOpenAnalysis,
  onSelectAssetSymbol,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VocabularyCategory>('ALL');
  const [expandedTermId, setExpandedTermId] = useState<string | null>('enterprise-scorer');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Category Icon helper
  const getCategoryIcon = (cat: VocabularyCategory) => {
    switch (cat) {
      case 'TRADING_QUANT':
        return <TrendingUp className="w-3.5 h-3.5 text-amber-400" />;
      case 'AI_MODELS':
        return <Brain className="w-3.5 h-3.5 text-[#8D26FF]" />;
      case 'CRYPTO_WEB3':
        return <Coins className="w-3.5 h-3.5 text-emerald-400" />;
      case 'FUNDAMENTAL':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />;
      case 'MACRO_FOREX':
        return <Globe2 className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Einsteiger':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Fortgeschritten':
        return 'bg-amber-400/15 text-amber-300 border-amber-400/30';
      case 'Quant / Pro':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/30';
    }
  };

  // Filtered terms
  const filteredTerms = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return VOCABULARY_TERMS.filter((item) => {
      // Category match
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // Search query match
      if (!query) return true;
      const matchesTerm = item.term.toLowerCase().includes(query);
      const matchesAbbr = item.abbreviation?.toLowerCase().includes(query);
      const matchesDef = item.shortDefinition.toLowerCase().includes(query);
      const matchesDetailed = item.detailedExplanation.toLowerCase().includes(query);
      const matchesTags = item.searchTags.some((tag) => tag.toLowerCase().includes(query));
      return matchesTerm || matchesAbbr || matchesDef || matchesDetailed || matchesTags;
    });
  }, [searchTerm, selectedCategory]);

  const handleCopyDefinition = (term: VocabularyTerm, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${term.term} (${term.abbreviation || term.categoryLabel})\n\nDefinition:\n${term.shortDefinition}\n\nErklärung:\n${term.detailedExplanation}\n\nFaustformel / Regel:\n${term.formulaOrRule || 'N/A'}\n\nPraxisbeispiel:\n${term.practicalExample}\n\nQuelle: Capital-AI Market Vocabulary Terminal`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(term.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl bg-[#070d1e] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(249,191,33,0.15)] max-h-[92vh] flex flex-col overflow-hidden text-slate-100"
      >
        {/* MODAL HEADER */}
        <div className="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-[#8D26FF]/10 to-transparent flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-[0_0_15px_rgba(249,191,33,0.25)] shrink-0">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">
                  Market Vocabulary Module
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#8D26FF]/20 border border-[#8D26FF]/40 text-purple-300">
                  {VOCABULARY_TERMS.length} Referenzbegriffe
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>Finanz- & Quant-Glossar</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer shrink-0"
              aria-label="Glossar schließen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SEARCH & CATEGORY FILTER BAR */}
        <div className="p-4 sm:px-6 bg-[#040816]/90 border-b border-slate-800/80 shrink-0 space-y-3">
          {/* Real-time Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Begriff, Abkürzung oder Thema suchen (z.B. VWAP, Spread, Moat, L1, Scorer)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#091124] border border-slate-700/80 hover:border-amber-400/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {VOCABULARY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === 'ALL'
                  ? VOCABULARY_TERMS.length
                  : VOCABULARY_TERMS.filter((t) => t.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-amber-400 text-black border-amber-300 font-bold shadow-[0_0_12px_rgba(249,191,33,0.3)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border-white/5'
                  }`}
                >
                  {cat.id !== 'ALL' && getCategoryIcon(cat.id)}
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* GLOSSARY LIST CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 divide-y divide-slate-800/40">
          {filteredTerms.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <div className="text-sm font-bold text-slate-300">Keine passenden Fachbegriffe gefunden</div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Versuchen Sie einen anderen Suchbegriff wie „Orderbuch“, „Spread“, „Buffett“ oder „Latenz“.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                }}
                className="mt-3.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30 cursor-pointer"
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            filteredTerms.map((item) => {
              const isExpanded = expandedTermId === item.id;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`pt-3 rounded-2xl transition-all ${
                    isExpanded
                      ? 'bg-gradient-to-b from-[#091228] to-[#060c1d] border border-amber-500/30 p-4 shadow-[0_0_20px_rgba(249,191,33,0.08)]'
                      : 'hover:bg-white/[0.02] p-3 border border-transparent'
                  }`}
                >
                  {/* Collapsible Header */}
                  <div
                    onClick={() => setExpandedTermId(isExpanded ? null : item.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 bg-white/5 border-white/10 text-slate-300">
                          {getCategoryIcon(item.category)}
                          <span>{item.categoryLabel}</span>
                        </span>
                        <span
                          className={`text-[9.5px] font-bold font-mono px-2 py-0.5 rounded-full border ${getLevelBadgeClass(
                            item.level
                          )}`}
                        >
                          {item.level}
                        </span>
                        {item.abbreviation && (
                          <span className="text-[10px] font-mono text-amber-400/90 font-semibold">
                            • {item.abbreviation}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                        <span>{item.term}</span>
                      </h3>

                      <p className="text-xs sm:text-[13px] text-slate-300 mt-1 leading-relaxed">
                        {item.shortDefinition}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <button
                        type="button"
                        onClick={(e) => handleCopyDefinition(item, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-300 transition-all cursor-pointer"
                        title="Definition kopieren"
                        aria-label="Definition kopieren"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-amber-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Detailed Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mt-3 pt-3 border-t border-slate-800/80 space-y-3"
                      >
                        {/* Detailed Explanation */}
                        <div>
                          <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Detaillierte Funktionsweise</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-normal bg-[#040815]/60 p-3 rounded-xl border border-slate-800/90">
                            {item.detailedExplanation}
                          </p>
                        </div>

                        {/* Formula or Practical Rule */}
                        {item.formulaOrRule && (
                          <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 mb-1 font-mono">
                              Berechnung / Faustregel:
                            </div>
                            <div className="text-xs font-mono font-semibold text-amber-200">
                              {item.formulaOrRule}
                            </div>
                          </div>
                        )}

                        {/* Practical Market Example */}
                        <div className="p-3 rounded-xl bg-[#091224] border border-slate-700/60">
                          <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#44DE88] mb-1">
                            Praxisbeispiel am Markt:
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {item.practicalExample}
                          </p>
                        </div>

                        {/* Key Takeaway & Related Assets */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
                          <div className="text-slate-400">
                            <span className="font-semibold text-slate-200">Kern-Erkenntnis: </span>
                            <span>{item.keyTakeaway}</span>
                          </div>

                          {item.relatedAssets && item.relatedAssets.length > 0 && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-mono text-slate-500 uppercase">
                                Relevante Assets:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {item.relatedAssets.map((asset) => (
                                  <button
                                    key={asset}
                                    type="button"
                                    onClick={() => {
                                      onSelectAssetSymbol?.(asset);
                                    }}
                                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-amber-400/20 text-amber-300 text-[10.5px] font-mono font-semibold border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer"
                                  >
                                    {asset}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:px-6 bg-[#040816] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kontinuierlich erweiterte Capital-AI Wissensdatenbank</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenAnalysis && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAnalysis();
                }}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-[#FF2E93] to-[#8D26FF] text-black font-extrabold text-xs transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Live-Analyse testen</span>
                <ExternalLink className="w-3 h-3 text-black" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Schließen
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
