import React, { useState } from 'react';
import { X, Search, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { MARKET_ASSETS } from '../data/mockData';
import { MarketAsset } from '../types';

interface AllMarketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
}

const EXTENDED_MARKETS: MarketAsset[] = [
  ...MARKET_ASSETS,
  {
    id: 'dax',
    name: 'DAX 40',
    symbol: 'DAX',
    value: '18.492,15',
    change: '+0,74%',
    isPositive: true,
    iconType: 'trend',
    sparklinePath: 'M 0,30 Q 30,35 60,25 T 120,28 T 170,14 T 200,10',
    glowColor: 'rgba(34, 197, 94, 0.25)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    waveColor: '#22c55e',
    category: 'Index (Deutschland)',
    high24h: '18.520,30',
    low24h: '18.390,10',
    volume24h: '€3.8B',
    aiScore: 81,
    aiRating: 'Solider Aufwärtstrend',
    description: 'Deutscher Leitindex mit starker Industrie- und Exportgewichtung.',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH/USD',
    value: '3.520,80',
    change: '+3,45%',
    isPositive: true,
    iconType: 'bitcoin',
    sparklinePath: 'M 0,35 Q 25,40 55,25 T 115,28 T 160,12 T 200,6',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    waveColor: '#a855f7',
    category: 'Kryptowährung',
    high24h: '$3.580,00',
    low24h: '$3.390,20',
    volume24h: '$14.2B',
    aiScore: 84,
    aiRating: 'Starke Netzwerk-Aktivität',
    description: 'Smart-Contract-Plattform mit kontinuierlich steigender Layer-2 Nutzung.',
  },
];

export const AllMarketsModal: React.FC<AllMarketsModalProps> = ({ isOpen, onClose, onSelectAsset }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = EXTENDED_MARKETS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-lg bg-[#070e22] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Alle globalen Märkte</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live-Kurse, Indizes, Krypto & Rohstoffe</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Markt oder Ticker suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#030712] border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Market List */}
        <div className="mt-4 space-y-2">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              onClick={() => {
                onClose();
                onSelectAsset(asset);
              }}
              className="p-3 rounded-2xl bg-[#091129] border border-slate-800 hover:border-amber-500/40 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{asset.name}</span>
                  <span className="text-[10.5px] text-slate-400 font-mono">{asset.symbol}</span>
                </div>
                <span className="text-[11px] text-slate-400">{asset.category}</span>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-white font-mono">{asset.value}</div>
                <div className="text-[11px] font-semibold text-emerald-400">{asset.change}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-800 text-white font-semibold rounded-xl text-xs"
        >
          Schließen
        </button>
      </motion.div>
    </div>
  );
};
