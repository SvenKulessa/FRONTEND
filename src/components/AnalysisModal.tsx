import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, Shield, BarChart3, Search, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { AssetLogo } from './AssetLogo';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_TICKERS = [
  { symbol: 'NVDA', name: 'Nvidia Corp.', score: 94, trend: '+3,8%' },
  { symbol: 'AAPL', name: 'Apple Inc.', score: 86, trend: '+0,9%' },
  { symbol: 'SAP', name: 'SAP SE', score: 89, trend: '+1,4%' },
  { symbol: 'MSFT', name: 'Microsoft', score: 91, trend: '+1,1%' },
  { symbol: 'BTC', name: 'Bitcoin', score: 82, trend: '+2,3%' },
];

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(POPULAR_TICKERS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSelectStock = (stock: typeof POPULAR_TICKERS[0]) => {
    setIsAnalyzing(true);
    setSelectedStock(stock);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 400);
  };

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
              <h3 className="text-lg font-bold text-white leading-none">Capital-AI Marktanalyse</h3>
              <p className="text-xs text-slate-400 mt-1">Echtzeit Multi-Faktor Evaluation</p>
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

        {/* Search Ticker */}
        <div className="mt-5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Wertpapier oder Markt auswählen
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="z.B. Nvidia, Apple, DAX, Bitcoin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#030712] border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
            />
          </div>

          {/* Quick chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-2.5">
            {POPULAR_TICKERS.map((item) => (
              <button
                key={item.symbol}
                type="button"
                onClick={() => handleSelectStock(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedStock.symbol === item.symbol
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <AssetLogo symbol={item.symbol} name={item.name} size="xs" />
                <span>{item.symbol}</span>
                <span className={selectedStock.symbol === item.symbol ? 'text-black/70' : 'text-emerald-400 font-mono'}>
                  {item.trend}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Asset AI Score Card */}
        <div className="mt-5 p-4 rounded-2xl bg-[#0a122c] border border-amber-500/25 relative overflow-hidden">
          {isAnalyzing ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-slate-300">Berechne KI-Scores für {selectedStock.name}...</p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AssetLogo symbol={selectedStock.symbol} name={selectedStock.name} size="lg" className="mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Analysebericht
                    </span>
                    <h4 className="text-xl font-bold text-white mt-0.5">{selectedStock.name}</h4>
                    <span className="text-xs text-slate-400 font-mono">Ticker: {selectedStock.symbol}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-amber-400 leading-none">
                    {selectedStock.score}
                    <span className="text-xs text-slate-400 font-normal">/100</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 block mt-1">
                    Starke Kaufgelegenheit
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-3.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${selectedStock.score}%` }}
                />
              </div>

              {/* Factor Breakdown */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Wachstum & Margen</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    94% (Hervorragend)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Bewertungs-Risiko</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    Niedrig (Fairer Wert)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">KI-News-Sentiment</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                    <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                    88% Bullish
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Buffett-Qualität</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Breiter Burggraben
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Action */}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-sm transition-colors"
        >
          Fertig & Zurück zum Überblick
        </button>
      </motion.div>
    </div>
  );
};
