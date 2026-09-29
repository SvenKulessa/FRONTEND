/**
 * CAPITAL AI — LEARNING PORTAL & FINANZ-VOKABULAR TERMINAL
 * 
 * Zentrales Learning Portal der Anwendung.
 * Beinhaltet:
 * 1. Vollständiges Market Vocabulary & Glossar (Filterbar nach Kategorien & Skill-Levels)
 * 2. Interaktive Cheat-Sheets & Guides (Fintech Pipeline, BaFin MaRisk, Buffett DCF)
 * 3. Quant- & Trader Skill-Check (Interaktives Quiz)
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Calculator,
  ShieldCheck,
  Zap,
  TrendingUp,
  HelpCircle,
  Award,
  Layers,
  FileText,
  ChevronDown,
  ExternalLink,
  Code2,
} from 'lucide-react';
import {
  VOCABULARY_CATEGORIES,
  VOCABULARY_TERMS,
  VocabularyCategory,
  VocabularyLevel,
  VocabularyTerm,
} from '../data/vocabularyData';
import { SubpageSidebarNav, SubpageNavItem } from './SubpageSidebarNav';

export type LearningPortalTab = 'glossar' | 'guides' | 'quiz';

interface LearningPortalPageProps {
  onBackToHome?: () => void;
  onNavigateLogin?: () => void;
  onNavigateTab?: (path: string) => void;
  initialTab?: LearningPortalTab;
}

export const LearningPortalPage: React.FC<LearningPortalPageProps> = ({
  onBackToHome,
  onNavigateLogin,
  onNavigateTab,
  initialTab = 'glossar',
}) => {
  const [activeTab, setActiveTab] = useState<LearningPortalTab>(initialTab);

  // Sync tab with URL search parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'glossar' || tabParam === 'guides' || tabParam === 'quiz') {
        setActiveTab(tabParam as LearningPortalTab);
      }
    }
  }, []);

  const subpageItems: SubpageNavItem[] = [
    {
      id: 'glossar',
      label: 'Market Vocabulary & Glossar',
      icon: <BookOpen className="w-4 h-4 text-amber-400" />,
      badge: `${VOCABULARY_TERMS.length}`,
      desc: 'Finanzbegriffe & Formeln',
    },
    {
      id: 'guides',
      label: 'Cheat-Sheets & Guides',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      badge: '4 Guides',
      desc: 'DCF, MaRisk & Latenzen',
    },
    {
      id: 'quiz',
      label: 'Quant & Trader Skill-Check',
      icon: <Award className="w-4 h-4 text-purple-400" />,
      badge: 'Skill-Quiz',
      desc: 'Interaktiver Wissenstest',
    },
  ];

  // Vocabulary Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<VocabularyCategory>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);
  const [copiedTermId, setCopiedTermId] = useState<string | null>(null);

  // Quiz States
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Filtered Vocabulary Terms
  const filteredTerms = useMemo(() => {
    return VOCABULARY_TERMS.filter((term) => {
      // Category filter
      if (selectedCategory !== 'ALL' && term.category !== selectedCategory) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'ALL' && term.level !== selectedLevel) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTerm = term.term.toLowerCase().includes(query);
        const matchesAbbr = term.abbreviation?.toLowerCase().includes(query);
        const matchesShort = term.shortDefinition.toLowerCase().includes(query);
        const matchesDetail = term.detailedExplanation.toLowerCase().includes(query);
        const matchesFormula = term.formulaOrRule?.toLowerCase().includes(query);
        const matchesCat = term.categoryLabel.toLowerCase().includes(query);
        if (!matchesTerm && !matchesAbbr && !matchesShort && !matchesDetail && !matchesFormula && !matchesCat) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  const handleCopyDefinition = (term: VocabularyTerm, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${term.term} (${term.abbreviation || term.categoryLabel})\n\nDefinition:\n${term.shortDefinition}\n\nErklärung:\n${term.detailedExplanation}\n\nFaustformel / Regel:\n${term.formulaOrRule || 'N/A'}\n\nPraxisbeispiel:\n${term.practicalExample}\n\nQuelle: Capital-AI Learning Portal`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedTermId(term.id);
      setTimeout(() => setCopiedTermId(null), 2200);
    }
  };

  const getLevelBadge = (level: VocabularyLevel) => {
    switch (level) {
      case 'Einsteiger':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Einsteiger
          </span>
        );
      case 'Fortgeschritten':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Fortgeschritten
          </span>
        );
      case 'Quant / Pro':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
            Quant / Pro
          </span>
        );
    }
  };

  // Interactive Quiz Questions
  const QUIZ_QUESTIONS = [
    {
      question: 'Welche Bedingung muss für den Warren Buffett Value Check primär erfüllt sein?',
      options: [
        'Kurs liegt unter dem 200-Tage-Durchschnitt',
        'Eigenkapitalrendite (ROE) dauerhaft > 15% mit intaktem Moat und Sicherheitsmarge',
        'Latenz des Datenfeeds liegt unter 10ms',
        'Handelsvolumen übersteigt 100 Mio. $ täglich',
      ],
      correct: 1,
      explanation:
        'Warren Buffett investiert nur in Unternehmen mit dauerhaft hoher Kapitalrendite (ROE > 15%), verständlichem Burggraben (Economic Moat) und einer Sicherheitsmarge (Margin of Safety) zum fairen inneren Wert.',
    },
    {
      question: 'Wozu dient die WORM-Archivierung nach BaFin WpHG § 83 im Capital-AI System?',
      options: [
        'Zur Beschleunigung von WebSocket-Datenströmen',
        'Zur unveränderbaren und revisionssicheren 5-Jahres-Aufbewahrung aller Scores und Algorithmen-Signale',
        'Zum automatischen Ankauf von $CPT Token',
        'Zur Komprimierung von Grafikdateien',
      ],
      correct: 1,
      explanation:
        'Write-Once-Read-Many (WORM) stellt sicher, dass generierte Finanzempfehlungen und Marktdatenschnitte nach WpHG § 83 nachträglich nicht manipuliert werden können.',
    },
    {
      question: 'Was ist der Hauptvorteil eines In-Memory Ringpuffers gegenüber direkten Provider-API Abfragen?',
      options: [
        'Er eliminiert externe Lizenzgebühren vollständig',
        'Er entkoppelt Tausende Frontend-Nutzer von externen Rate-Limits und garantiert Sub-45ms Latenz',
        'Er ersetzt die Notwendigkeit einer Datenbank',
        'Er berechnet automatisch Steuern für Kryptowährungen',
      ],
      correct: 1,
      explanation:
        'Der Ringpuffer hält die neuesten Ticks im Arbeitsspeicher. Anstatt jede Nutzeranfrage an TwelveData oder Binance weiterzuleiten, liefert der Cache Daten in Mikrosekunden und schützt vor dem 40 € Monatsbudget-Deckel (AP-006).',
    },
    {
      question: 'Wie definiert sich das Sortino Ratio im Vergleich zum traditionellen Sharpe Ratio?',
      options: [
        'Es berücksichtigt nur die Abwärtsvolatilität (Downside Deviation) statt der Gesamtvolatilität',
        'Es wird ausschließlich in der Chartanalyse verwendet',
        'Es multipliziert den Gewinn mit der Dividendenrendite',
        'Es misst nur den Bitcoin-Preis im Verhältnis zu Gold',
      ],
      correct: 0,
      explanation:
        'Das Sortino Ratio bestraft nur die nach unten gerichtete Volatilität, da Kursschwankungen nach oben für den Anleger positiv sind.',
    },
    {
      question: 'Welche europäische Verordnung regelt ab 2024/2025 die Standards für Krypto-Assets und Stablecoins?',
      options: ['GDPR', 'MiCA (Markets in Crypto-Assets)', 'MiFID II', 'PSD2'],
      correct: 1,
      explanation:
        'Die EU MiCA-Verordnung 2023/1114 vereinheitlicht den Rechtsrahmen für Krypto-Vermögenswerte, Whitepaper-Pflichten und Reserveanforderungen in der gesamten Europäischen Union.',
    },
  ];

  return (
    <div className="w-full text-slate-100 min-h-screen py-4 sm:py-6 px-2 sm:px-6 relative">
      {/* 1. TOP HEADER CONTRACT (Breadcrumb + Controls) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
            <span>Capital-AI Enterprise</span>
            <span aria-hidden="true" className="text-slate-600">
              /
            </span>
            <span className="text-amber-400 font-semibold">Learning Portal</span>
            <span aria-hidden="true" className="text-slate-600">
              /
            </span>
            <span className="text-cyan-300 font-medium">
              {activeTab === 'glossar' && 'Finanz-Vocabulary & Glossar'}
              {activeTab === 'guides' && 'Cheat-Sheets & Pipeline Guides'}
              {activeTab === 'quiz' && 'Quant & Trader Skill-Check'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-amber-400 shrink-0" />
              <span>Capital-AI Learning Portal</span>
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
              WISSENS-TERMINAL
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
              {VOCABULARY_TERMS.length} Fachbegriffe &amp; Formeln
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Zurück zur Übersicht</span>
            </button>
          )}

          {onNavigateLogin && (
            <button
              type="button"
              onClick={onNavigateLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Terminal Login</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SUBPAGE SIDEBAR (NACH RECHTS AUFKLAPPBAR) */}
      <SubpageSidebarNav
        hubTitle="Learning Portal"
        items={subpageItems}
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id as LearningPortalTab)}
        accentColor="amber"
      />

      {/* 3. LEARNING PORTAL TABS */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090e21] border border-slate-800/90 mb-6 overflow-x-auto scrollbar-none">
        {/* TAB 1: GLOSSAR / VOCABULARY */}
        <button
          type="button"
          onClick={() => setActiveTab('glossar')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'glossar'
              ? 'bg-amber-400 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Market Vocabulary &amp; Glossar</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">
            {VOCABULARY_TERMS.length}
          </span>
        </button>

        {/* TAB 2: CHEAT-SHEETS & GUIDES */}
        <button
          type="button"
          onClick={() => setActiveTab('guides')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'guides'
              ? 'bg-cyan-500 text-black font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Cheat-Sheets &amp; Guides</span>
        </button>

        {/* TAB 3: QUIZ & SKILL-CHECK */}
        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-purple-500 text-white font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Quant &amp; Trader Skill-Check</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT 1: MARKET VOCABULARY & GLOSSAR                                */}
      {/* ========================================================================= */}
      {activeTab === 'glossar' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-400/15 via-[#0d1530] to-cyan-500/15 border border-amber-400/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>INTERAKTIVES FINANZ- &amp; QUANT-LEXIKON</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Markt-Vocabulary &amp; Formel-Glossar
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Lernen Sie die mathematischen, fundamentalen und regulatorischen Begriffe unserer Berechnungs-Engines
                  verstehen. Von ROE und DCF über Sharpe Ratio bis hin zu BaFin WORM und MaRisk.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-black/40 border border-amber-400/30 text-amber-300">
                  {filteredTerms.length} von {VOCABULARY_TERMS.length} Begriffen
                </span>
              </div>
            </div>
          </div>

          {/* Filter Bar: Search + Category Buttons + Level Buttons */}
          <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800/90 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Begriff, Abkürzung oder Formel suchen (z.B. DCF, ROE, WORM, Sortino, MiCA)..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Buttons */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 mb-1.5">Kategorie:</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {VOCABULARY_CATEGORIES.map((cat) => {
                  const count =
                    cat.id === 'ALL'
                      ? VOCABULARY_TERMS.length
                      : VOCABULARY_TERMS.filter((t) => t.category === cat.id).length;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-black font-bold shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                      }`}
                    >
                      {cat.label}
                      <span className="ml-1 text-[10px] opacity-70 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skill Level Filter Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Level:</span>
              {['ALL', 'Einsteiger', 'Fortgeschritten', 'Quant / Pro'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-0.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                    selectedLevel === lvl
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl === 'ALL' ? 'Alle Level' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Vocabulary Terms Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTerms.length === 0 ? (
              <div className="col-span-2 p-8 rounded-xl bg-black/20 border border-slate-800 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm text-slate-400 font-medium">Keine passenden Begriffe gefunden.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                    setSelectedLevel('ALL');
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-400/10 text-amber-300 text-xs font-bold hover:bg-amber-400/20 cursor-pointer"
                >
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              filteredTerms.map((term) => {
                const isExpanded = expandedTermId === term.id;
                const isCopied = copiedTermId === term.id;

                return (
                  <div
                    key={term.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isExpanded
                        ? 'bg-[#0b122b] border-amber-400/50 shadow-[0_0_15px_rgba(245,176,20,0.12)]'
                        : 'bg-[#090e21] border-slate-800/90 hover:border-slate-700'
                    }`}
                    onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                            {term.categoryLabel}
                          </span>
                          {getLevelBadge(term.level)}
                          {term.abbreviation && (
                            <span className="text-xs font-mono font-bold text-amber-400">
                              [{term.abbreviation}]
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                          <span>{term.term}</span>
                        </h3>
                      </div>

                      {/* Copy Action */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyDefinition(term, e)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                          isCopied
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title="Definition kopieren"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Short Definition */}
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {term.shortDefinition}
                    </p>

                    {/* Formula or Rule of Thumb Preview */}
                    {term.formulaOrRule && (
                      <div className="mt-2.5 p-2 rounded-lg bg-black/40 border border-slate-800 text-[11px] font-mono text-amber-300/90 flex items-center gap-2">
                        <Calculator className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{term.formulaOrRule}</span>
                      </div>
                    )}

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 text-xs animate-in fade-in">
                        <div>
                          <div className="text-[10px] font-mono uppercase text-slate-400">Ausführliche Erklärung:</div>
                          <p className="text-slate-300 mt-0.5 leading-relaxed">{term.detailedExplanation}</p>
                        </div>

                        <div>
                          <div className="text-[10px] font-mono uppercase text-slate-400">Praxisbeispiel:</div>
                          <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-200 leading-relaxed mt-0.5">
                            {term.practicalExample}
                          </div>
                        </div>

                        {term.keyTakeaway && (
                          <div className="flex items-center gap-1.5 text-[10.5px] text-purple-300 font-mono">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span>Fazit &amp; Praxistipp: {term.keyTakeaway}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Accordion indicator */}
                    <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                      <span>{isExpanded ? 'Details einklappen' : 'Klicken für Details & Praxisbeispiel'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 2: CHEAT-SHEETS & PIPELINE GUIDES                             */}
      {/* ========================================================================= */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-[#0d1530] to-purple-500/15 border border-cyan-500/40">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Kompakte Cheat-Sheets &amp; Spickzettel
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Zusammenfassende Leitfäden für Quant-Methoden, BaFin MaRisk Vorgaben und die Funktionsweise moderner
              Fintech-Pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Guide 1: Buffett DCF Formeln */}
            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Calculator className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">1. Buffett Value Check &amp; DCF Formel-Spickzettel</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Warren Buffetts Kernphilosophie verlangt ein planbares Geschäftsmodell mit dauerhaft hoher Rendite auf
                das eingesetzte Kapital.
              </p>
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 font-mono text-xs text-amber-300 space-y-1.5">
                <div>• ROE = Net Income / Shareholder Equity &gt; 15%</div>
                <div>• Fair Value = Σ (FCF_t / (1 + WACC)^t) + Terminal Value</div>
                <div>• Margin of Safety = (Fair Value - Marktpreis) / Fair Value &gt; 25%</div>
              </div>
            </div>

            {/* Guide 2: BaFin MaRisk & WpHG 83 */}
            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">2. BaFin MaRisk &amp; WpHG § 83 Leitfaden</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Finanzsoftware und algorithmische Screener müssen im BaFin-Raum strenge Kriterien an die Nachvollziehbarkeit
                erfüllen.
              </p>
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 font-mono text-xs text-purple-300 space-y-1.5">
                <div>• WORM-Speicherung: Signale 5 Jahre unveränderbar archivieren</div>
                <div>• SHA-256 Merkle Root: Jede Datenzeile manipulationssicher hashen</div>
                <div>• Notfallkonzept: Automatisches Failover bei Provider-Ausfällen</div>
              </div>
            </div>

            {/* Guide 3: Sub-45ms Latenz & In-Memory Pipeline */}
            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Zap className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">3. Zero-Copy &amp; Latenz-Architektur</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                High-Frequency Datenströme dürfen nicht durch JSON-Serialisierung ausgebremst werden.
              </p>
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 font-mono text-xs text-cyan-300 space-y-1.5">
                <div>• Ringpuffer: O(1) Zeitkomplexität für das Einfügen neuer Ticks</div>
                <div>• FlatBuffers: Binäre Deserialisierung direkt im Speicher</div>
                <div>• Outlier-Filter: 3-Sigma Consensus filtert fehlerhafte Ticks</div>
              </div>
            </div>

            {/* Guide 4: Whale Radar & On-Chain Daten */}
            <div className="p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">4. Smart Money &amp; Whale Radar Verstehen</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Große Marktteilnehmer hinterlassen Spuren im Mempool und auf der Blockchain vor signifikanten Kursbewegungen.
              </p>
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 font-mono text-xs text-emerald-300 space-y-1.5">
                <div>• Wallet-Akkumulation: Abflüsse von Börsen deuten auf HODL-Druck</div>
                <div>• Exchange Inflows: Zuflüsse kündigen oft Verkaufsdruck an</div>
                <div>• Cluster-Analyse: Zusammenhängende Wal-Netzwerke identifizieren</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 3: INTERACTIVE QUIZ & SKILL-CHECK                             */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/15 via-[#0d1530] to-emerald-500/15 border border-purple-500/40">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-400" />
              <span>Quant &amp; Trader Skill-Check</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Testen Sie Ihr Wissen über fundamentale Finanzkennzahlen, Latenzarchitektur und BaFin-Regularien.
            </p>
          </div>

          {!quizFinished ? (
            <div className="p-6 rounded-xl bg-[#090e21] border border-slate-800 space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Frage {currentQuizIndex + 1} von {QUIZ_QUESTIONS.length}</span>
                <span className="text-amber-400 font-bold">Punkte: {quizScore}</span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${((currentQuizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white pt-2">
                {QUIZ_QUESTIONS[currentQuizIndex].question}
              </h3>

              <div className="space-y-2 pt-2">
                {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                  const isSelected = selectedQuizAnswer === idx;
                  const isAnswered = selectedQuizAnswer !== null;
                  const isCorrect = idx === QUIZ_QUESTIONS[currentQuizIndex].correct;

                  let btnStyle = 'bg-black/40 border-slate-800 hover:border-slate-700 text-slate-300';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => {
                        setSelectedQuizAnswer(idx);
                        if (idx === QUIZ_QUESTIONS[currentQuizIndex].correct) {
                          setQuizScore((prev) => prev + 1);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-slate-700 text-[10px] font-mono flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedQuizAnswer !== null && (
                <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-xs space-y-2 animate-in fade-in">
                  <div className="font-mono text-[11px] text-amber-400 font-bold">Erklärung:</div>
                  <p className="text-slate-300 leading-relaxed">
                    {QUIZ_QUESTIONS[currentQuizIndex].explanation}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedQuizAnswer(null);
                        if (currentQuizIndex + 1 < QUIZ_QUESTIONS.length) {
                          setCurrentQuizIndex((prev) => prev + 1);
                        } else {
                          setQuizFinished(true);
                        }
                      }}
                      className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs cursor-pointer"
                    >
                      {currentQuizIndex + 1 < QUIZ_QUESTIONS.length ? 'Nächste Frage →' : 'Ergebnis anzeigen'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#090e21] border border-slate-800 text-center space-y-4 max-w-md mx-auto">
              <Award className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Skill-Check abgeschlossen!</h3>
              <p className="text-xs text-slate-300">
                Sie haben <strong className="text-amber-400 text-base">{quizScore}</strong> von{' '}
                <strong className="text-white">{QUIZ_QUESTIONS.length}</strong> Fragen richtig beantwortet.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurrentQuizIndex(0);
                  setSelectedQuizAnswer(null);
                  setQuizScore(0);
                  setQuizFinished(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 cursor-pointer"
              >
                Quiz wiederholen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
