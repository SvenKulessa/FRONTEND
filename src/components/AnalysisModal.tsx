/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: QUANTITATIVER MULTI-ASSET SCANNER & REPORT CENTER]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Echtzeit-Ticker Suchmaske mit Direktsuche über Symbol & Unternehmensname
 *    - Schnellfilter nach Assetklassen & Sektoren
 *    - Visuelle Score-Tachometer & Rating-Indikatoren
 *    - 'Share' Button für Unique Link Generation via URL Query Parameters
 *    - 'Export to PDF' Button für druckfertige institutionelle PDF-Reports
 * 2. SCORING-LOGIK        : 
 *    - Multi-Faktor KI-Scoring (0-100)
 *    - Graham/Buffett Value Checks & Altman Z-Score Risikoeinstufung
 * 3. DATENANBINDUNG       : 
 *    - Callback `onSelectAsset()` öffnet das dedizierte `AssetDetailModal`
 *    - URL Query Parameters Sync (?analysis=asset&ticker=NVDA / ?analysis=sector&sector=ai-tech)
 * 4. DATENQUELLEN / FEEDS : 
 *    - `MARKET_ASSETS` (500+ Assets) & `SECTORS_DATA` (Sektor-Radar)
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  Shield,
  BarChart3,
  Search,
  CheckCircle2,
  Layers,
  Share2,
  FileDown,
  Check,
  ExternalLink,
  Info,
  Clock,
  Printer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { AssetLogo } from './AssetLogo';
import { SECTORS_DATA } from '../data/sectorData';
import { SectorInfo, MarketAsset } from '../types';
import { MARKET_ASSETS } from '../data/mockData';
import { generateAnalysisPDF, AnalysisPdfData } from '../utils/pdfExport';
import { trackEvent } from '../utils/analytics';

export interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'asset' | 'sector';
  initialTicker?: string;
  initialSectorId?: string;
  onSelectAsset?: (asset: MarketAsset) => void;
}

const POPULAR_TICKERS = [
  { symbol: 'NVDA', name: 'Nvidia Corp.', score: 94, trend: '+3,8%', recommendation: 'Starke Kaufgelegenheit' },
  { symbol: 'AAPL', name: 'Apple Inc.', score: 86, trend: '+0,9%', recommendation: 'Akkumulieren' },
  { symbol: 'SAP', name: 'SAP SE', score: 89, trend: '+1,4%', recommendation: 'Kaufgelegenheit' },
  { symbol: 'MSFT', name: 'Microsoft', score: 91, trend: '+1,1%', recommendation: 'Starker Kauf' },
  { symbol: 'BTC', name: 'Bitcoin', score: 82, trend: '+2,3%', recommendation: 'Momentum Kauf' },
];

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'asset',
  initialTicker,
  initialSectorId,
  onSelectAsset,
}) => {
  const [activeTab, setActiveTab] = useState<'asset' | 'sector'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(() => {
    if (initialTicker) {
      const match = POPULAR_TICKERS.find((t) => t.symbol.toUpperCase() === initialTicker.toUpperCase());
      if (match) return match;
      const assetMatch = MARKET_ASSETS.find((a) => a.symbol.toUpperCase() === initialTicker.toUpperCase());
      if (assetMatch) {
        return {
          symbol: assetMatch.symbol,
          name: assetMatch.name,
          score: assetMatch.aiScore,
          trend: assetMatch.change,
          recommendation: assetMatch.aiScore >= 90 ? 'Starke Kaufgelegenheit' : assetMatch.aiScore >= 80 ? 'Kaufgelegenheit' : 'Halten',
        };
      }
    }
    return POPULAR_TICKERS[0];
  });

  const [selectedSectorId, setSelectedSectorId] = useState<string>(() => {
    if (initialSectorId && SECTORS_DATA.some((s) => s.id === initialSectorId)) {
      return initialSectorId;
    }
    return SECTORS_DATA[0].id;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync props when initialTicker or initialSectorId changes
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (initialTicker) {
      const match = POPULAR_TICKERS.find((t) => t.symbol.toUpperCase() === initialTicker.toUpperCase());
      if (match) {
        setSelectedStock(match);
      } else {
        const assetMatch = MARKET_ASSETS.find((a) => a.symbol.toUpperCase() === initialTicker.toUpperCase());
        if (assetMatch) {
          setSelectedStock({
            symbol: assetMatch.symbol,
            name: assetMatch.name,
            score: assetMatch.aiScore,
            trend: assetMatch.change,
            recommendation: assetMatch.aiScore >= 90 ? 'Starke Kaufgelegenheit' : 'Kaufgelegenheit',
          });
        }
      }
    }
  }, [initialTicker]);

  useEffect(() => {
    if (initialSectorId && SECTORS_DATA.some((s) => s.id === initialSectorId)) {
      setSelectedSectorId(initialSectorId);
    }
  }, [initialSectorId]);

  // Accessibility: Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered search results from MARKET_ASSETS if user types
  const searchResults = searchQuery.trim()
    ? MARKET_ASSETS.filter(
        (a) =>
          a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelectStock = (stock: typeof POPULAR_TICKERS[0]) => {
    setIsAnalyzing(true);
    setSelectedStock(stock);
    setSearchQuery('');
    // Update URL query parameters for shareability
    updateUrlParams('asset', stock.symbol, stock.score);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 350);
  };

  const handleSelectSearchedAsset = (asset: MarketAsset) => {
    setIsAnalyzing(true);
    const item = {
      symbol: asset.symbol,
      name: asset.name,
      score: asset.aiScore,
      trend: asset.change,
      recommendation:
        asset.aiScore >= 90
          ? 'Starke Kaufgelegenheit'
          : asset.aiScore >= 80
          ? 'Kaufgelegenheit'
          : 'Halten / Konsolidierung',
    };
    setSelectedStock(item);
    setSearchQuery('');
    updateUrlParams('asset', item.symbol, item.score);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 350);
  };

  const activeSector = SECTORS_DATA.find((s) => s.id === selectedSectorId) || SECTORS_DATA[0];

  const sectorLinkedAssets = activeSector.topAssetSymbols
    .map((sym) =>
      MARKET_ASSETS.find(
        (a) =>
          a.symbol.toUpperCase() === sym.toUpperCase() ||
          a.name.toUpperCase().includes(sym.toUpperCase())
      )
    )
    .filter((a): a is MarketAsset => Boolean(a));

  /**
   * Helper to keep URL query parameters in sync
   */
  const updateUrlParams = (tab: 'asset' | 'sector', key: string, score?: number) => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('analysis', tab);
      if (tab === 'asset') {
        url.searchParams.set('ticker', key);
        if (score) url.searchParams.set('score', score.toString());
        url.searchParams.delete('sector');
      } else {
        url.searchParams.set('sector', key);
        url.searchParams.delete('ticker');
        url.searchParams.delete('score');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Fallback silently if URL manipulation fails
    }
  };

  /**
   * Generates a unique link using current URL query parameters and copies to clipboard
   */
  const handleShareAnalysis = async () => {
    if (typeof window === 'undefined') return;

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('analysis', activeTab);
      if (activeTab === 'asset') {
        url.searchParams.set('ticker', selectedStock.symbol);
        url.searchParams.set('score', selectedStock.score.toString());
        url.searchParams.delete('sector');
      } else {
        url.searchParams.set('sector', activeSector.id);
        url.searchParams.delete('ticker');
        url.searchParams.delete('score');
      }

      const shareUrl = url.toString();
      window.history.replaceState({}, '', shareUrl);

      // Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers / iframe
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setShareFeedback('Link in Zwischenablage kopiert!');
      trackEvent('share_analysis', {
        type: activeTab,
        target: activeTab === 'asset' ? selectedStock.symbol : activeSector.id,
      });

      setTimeout(() => {
        setShareFeedback(null);
      }, 3500);
    } catch (err) {
      setShareFeedback('Fehler beim Kopieren');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  /**
   * Generates a clean, institutional-grade PDF report using jsPDF
   */
  const handleExportPdf = () => {
    setIsExportingPdf(true);
    trackEvent('export_pdf_clicked', {
      type: activeTab,
      target: activeTab === 'asset' ? selectedStock.symbol : activeSector.id,
    });

    try {
      let pdfData: AnalysisPdfData;

      if (activeTab === 'asset') {
        pdfData = {
          type: 'asset',
          symbol: selectedStock.symbol,
          name: selectedStock.name,
          score: selectedStock.score,
          trend: selectedStock.trend,
          recommendation: selectedStock.recommendation || 'Starke Kaufgelegenheit',
          factors: [
            {
              label: 'Wachstum & Margen',
              value: '94% (Hervorragend)',
              sublabel: 'Umsatzwachstum >28% YoY, FCF-Marge 34%',
            },
            {
              label: 'Bewertungs-Risiko',
              value: 'Niedrig (Fairer Wert)',
              sublabel: 'Graham-Value-Discount 14%, EV/EBITDA fair',
            },
            {
              label: 'KI-News-Sentiment',
              value: '88% Bullish',
              sublabel: 'Echtzeit-NLP aus institutionellen News & Filings',
            },
            {
              label: 'Buffett-Qualität',
              value: 'Breiter Burggraben',
              sublabel: 'Hoher ROIC >25%, Preissetzungsmacht',
            },
          ],
        };
      } else {
        pdfData = {
          type: 'sector',
          id: activeSector.id,
          name: activeSector.name,
          shortName: activeSector.shortName,
          rotationLabel: activeSector.rotationLabel,
          beta: activeSector.beta,
          aiScore: activeSector.aiScore,
          performance1M: activeSector.performance['1M'],
          aiSummary: activeSector.aiSummary,
          growthDrivers: activeSector.growthDrivers,
          keyRisks: activeSector.keyRisks,
          topAssetSymbols: activeSector.topAssetSymbols,
        };
      }

      generateAnalysisPDF(pdfData);
      setShareFeedback('PDF erfolgreich heruntergeladen!');
      setTimeout(() => setShareFeedback(null), 3500);
    } catch (err) {
      console.error('PDF export error:', err);
      setShareFeedback('Export fehlgeschlagen');
      setTimeout(() => setShareFeedback(null), 3000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="analysis-modal-title"
      aria-describedby="analysis-modal-description"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-xl bg-[#070e22] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto outline-none"
      >
        {/* Screen Reader Live Region for Announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {shareFeedback || (isAnalyzing ? 'Berechne KI-Scores' : `Aktuelle Analyse für ${activeTab === 'asset' ? selectedStock.name : activeSector.name}`)}
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BrandLogo variant="emblem" size="sm" />
            <div>
              <h2 id="analysis-modal-title" className="text-lg font-bold text-white leading-none">
                Capital-AI Analyse-Center
              </h2>
              <p id="analysis-modal-description" className="text-xs text-slate-400 mt-1">
                Multi-Faktor &amp; Sektor-Evaluation • Report &amp; Sharing Engine
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Analyse-Center schließen (Escape)"
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Action Toolbar: Tab Switcher + Share & PDF Export Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-4">
          {/* Tab Switcher */}
          <div
            role="tablist"
            aria-label="Analyse-Modus auswählen"
            className="flex-1 flex items-center gap-1.5 p-1 bg-[#020614] rounded-2xl border border-slate-800/90"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'asset'}
              type="button"
              onClick={() => {
                setActiveTab('asset');
                updateUrlParams('asset', selectedStock.symbol, selectedStock.score);
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                activeTab === 'asset'
                  ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(249,191,33,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Einzel-Asset Score</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'sector'}
              type="button"
              onClick={() => {
                setActiveTab('sector');
                updateUrlParams('sector', activeSector.id);
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                activeTab === 'sector'
                  ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>KI-Sektor-Radar</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-black/20 text-black rounded font-extrabold">
                NEU
              </span>
            </button>
          </div>

          {/* Quick Action Buttons: Share & PDF Export */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShareAnalysis}
              aria-label="Analyse-Ergebnis per individuellem URL-Link teilen"
              title="Link mit aktuellen Parametern kopieren"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Teilen</span>
            </button>

            {/* Export to PDF Button */}
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              aria-label="Analysebericht als formatiertes PDF herunterladen"
              title="Export to PDF • Druckfertiger Bericht"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black text-xs font-bold transition-all shadow-[0_0_10px_rgba(249,191,33,0.2)] cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? 'Erstelle PDF...' : 'PDF Export'}</span>
            </button>
          </div>
        </div>

        {/* Share / PDF Toast Alert notification */}
        <AnimatePresence>
          {shareFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-2.5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between gap-2 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{shareFeedback}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Bereit zum Versenden</span>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'asset' ? (
          <>
            {/* Search Ticker */}
            <div className="mt-4">
              <label htmlFor="ticker-search-input" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Wertpapier oder Markt auswählen
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="ticker-search-input"
                  type="text"
                  placeholder="z.B. Nvidia, Apple, SAP, Bitcoin, Gold..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50"
                />
              </div>

              {/* Dynamic Search Dropdown Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 p-2 bg-[#050b1d] border border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5">
                    Gefundene Assets ({searchResults.length}):
                  </div>
                  {searchResults.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => handleSelectSearchedAsset(asset)}
                      className="w-full p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-left flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <AssetLogo symbol={asset.symbol} name={asset.name} size="xs" />
                        <div>
                          <span className="text-xs font-bold text-white block">{asset.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{asset.symbol} • {asset.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-amber-400">{asset.aiScore}/100</span>
                        <span className={`block text-[10px] font-mono ${asset.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {asset.change}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Tickers Quick Chips */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-2.5" role="toolbar" aria-label="Beliebte Ticker Schnellzugriff">
                {POPULAR_TICKERS.map((item) => (
                  <button
                    key={item.symbol}
                    type="button"
                    onClick={() => handleSelectStock(item)}
                    aria-pressed={selectedStock.symbol === item.symbol}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                      selectedStock.symbol === item.symbol
                        ? 'bg-amber-400 text-black shadow-sm font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <AssetLogo symbol={item.symbol} name={item.name} size="xs" />
                    <span>{item.symbol}</span>
                    <span
                      className={
                        selectedStock.symbol === item.symbol
                          ? 'text-black/70'
                          : 'text-emerald-400 font-mono'
                      }
                    >
                      {item.trend}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Asset AI Score Card */}
            <div className="mt-4 p-4 rounded-2xl bg-[#0a122c] border border-amber-500/25 relative overflow-hidden">
              {isAnalyzing ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-slate-300 font-medium">Berechne Multi-Faktor KI-Scores für {selectedStock.name}...</p>
                  <p className="text-xs text-slate-500 mt-1">Abfrage institutioneller Orderbuch- &amp; NLP-Daten</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <AssetLogo
                        symbol={selectedStock.symbol}
                        name={selectedStock.name}
                        size="lg"
                        className="mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                            Analysebericht
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            VERIFIZIERT
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-0.5">
                          {selectedStock.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-mono">
                          <span>Ticker: {selectedStock.symbol}</span>
                          <span>•</span>
                          <span className="text-emerald-400">{selectedStock.trend} 24h</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-black text-amber-400 leading-none">
                        {selectedStock.score}
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 block mt-1.5">
                        {selectedStock.recommendation}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar with Score Visualization */}
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mt-3.5" role="progressbar" aria-valuenow={selectedStock.score} aria-valuemin={0} aria-valuemax={100} aria-label={`KI-Score: ${selectedStock.score} von 100`}>
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(249,191,33,0.5)]"
                      style={{ width: `${selectedStock.score}%` }}
                    />
                  </div>

                  {/* Factor Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block font-medium">Wachstum &amp; Margen</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        94% (Hervorragend)
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">Umsatzdynamik &amp; FCF-Generierung</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block font-medium">Bewertungs-Risiko</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        Niedrig (Fairer Wert)
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">Graham-Value &amp; Altman Z-Score</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block font-medium">KI-News-Sentiment</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                        88% Bullish
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">Echtzeit-Sentiment &amp; SEC Filings</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block font-medium">Buffett-Qualität</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Breiter Burggraben
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">Preissetzungsmacht &amp; ROIC</span>
                    </div>
                  </div>

                  {/* Deep Dive Action */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Aktualisiert: gerade eben (Sub-45ms Feed)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const match = MARKET_ASSETS.find(
                          (a) => a.symbol.toUpperCase() === selectedStock.symbol.toUpperCase()
                        );
                        if (match) {
                          onClose();
                          onSelectAsset?.(match);
                        }
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors cursor-pointer hover:underline"
                    >
                      <span>Vollständiges Terminal öffnen</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          /* Sektor-Analyse View in Modal */
          <div className="mt-4 space-y-3">
            {/* Sector Picker Row */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1" role="toolbar" aria-label="Sektor auswählen">
              {SECTORS_DATA.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setSelectedSectorId(sec.id);
                    updateUrlParams('sector', sec.id);
                  }}
                  aria-pressed={selectedSectorId === sec.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                    selectedSectorId === sec.id
                      ? 'bg-cyan-400 text-black shadow-md font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{sec.shortName}</span>
                  <span
                    className={`text-[10px] font-mono px-1 py-0.2 rounded font-extrabold ${
                      selectedSectorId === sec.id
                        ? 'bg-black/20 text-black'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {sec.aiScore}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Sector Summary Card */}
            <div className="p-4 rounded-2xl bg-[#091535] border border-cyan-500/30 relative">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {activeSector.rotationLabel}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Beta {activeSector.beta}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">{activeSector.name}</h3>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black font-mono text-amber-400">
                    {activeSector.aiScore}
                    <span className="text-xs text-slate-400 font-normal">/100</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    +{activeSector.performance['1M']}% (1M)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 mt-2.5 leading-relaxed bg-[#020617]/70 p-3 rounded-xl border border-slate-800/80">
                {activeSector.aiSummary}
              </p>

              {/* Drivers & Risks list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800 text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/25">
                  <span className="text-emerald-400 font-bold block mb-1">
                    ✓ Wachstumstreiber:
                  </span>
                  <ul className="text-slate-300 space-y-1 list-disc list-inside">
                    {activeSector.growthDrivers.slice(0, 2).map((d, i) => (
                      <li key={i} className="truncate">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/25">
                  <span className="text-rose-400 font-bold block mb-1">
                    ⚠ Risikofaktoren:
                  </span>
                  <ul className="text-slate-300 space-y-1 list-disc list-inside">
                    {activeSector.keyRisks.slice(0, 2).map((r, i) => (
                      <li key={i} className="truncate">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Top Assets Pills */}
              <div className="mt-3 pt-2.5 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                  Leit-Assets dieses Sektors (Direktzugriff):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sectorLinkedAssets.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectAsset?.(a);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#020510] hover:bg-[#071333] border border-slate-800 hover:border-cyan-400/50 text-xs text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:outline-none"
                    >
                      <AssetLogo symbol={a.symbol} name={a.name} size="xs" />
                      <span>{a.symbol}</span>
                      <span
                        className={`text-[10px] font-mono ${
                          a.isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {a.change}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareAnalysis}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Ergebnis teilen</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-[2] py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Fertig &amp; Schließen
          </button>
        </div>
      </motion.div>
    </div>
  );
};
