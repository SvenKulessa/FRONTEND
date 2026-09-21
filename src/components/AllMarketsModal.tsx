import React, { useState } from 'react';
import { X, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { MARKET_ASSETS } from '../data/mockData';
import { MarketAsset, MainCategory } from '../types';

interface AllMarketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
}

type CategoryFilter = 'ALLE' | MainCategory;

const CATEGORIES: { id: CategoryFilter; label: string; color: string }[] = [
  { id: 'ALLE', label: 'Alle', color: '#F9BF21' },
  { id: 'KRYPTO', label: 'Krypto', color: '#F9BF21' },
  { id: 'AKTIEN', label: 'Aktien', color: '#44DE88' },
  { id: 'INDIZIES', label: 'Indizies', color: '#8D26FF' },
  { id: 'FOREX', label: 'Forex', color: '#E879F9' },
  { id: 'ROHSTOFFE', label: 'Rohstoffe', color: '#F9BF21' },
];

export const AllMarketsModal: React.FC<AllMarketsModalProps> = ({ isOpen, onClose, onSelectAsset }) => {
  const [selectedCat, setSelectedCat] = useState<CategoryFilter>('ALLE');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = MARKET_ASSETS.filter((item) => {
    const matchesCat = selectedCat === 'ALLE' || item.mainCategory === selectedCat;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.mainCategory.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryColor = (cat: MainCategory) => {
    switch (cat) {
      case 'KRYPTO':
        return '#F9BF21';
      case 'AKTIEN':
        return '#44DE88';
      case 'INDIZIES':
        return '#8D26FF';
      case 'FOREX':
        return '#E879F9';
      case 'ROHSTOFFE':
        return '#F9BF21';
      default:
        return '#F9BF21';
    }
  };

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
            <h3 className="text-xl font-bold text-white">Komplettes Asset Universum</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              5 Hauptkategorien: Krypto, Aktien, Indizies, Forex & Rohstoffe
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Asset, Ticker oder Kategorie suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#030712] border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-3">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            const count = cat.id === 'ALLE'
              ? MARKET_ASSETS.length
              : MARKET_ASSETS.filter((a) => a.mainCategory === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800'
                }`}
                style={{
                  borderColor: isActive ? `${cat.color}80` : undefined,
                  color: isActive ? '#fff' : undefined,
                }}
              >
                <span>{cat.label}</span>
                <span className="text-[9.5px] font-mono opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Market List */}
        <div className="space-y-2 mt-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Keine Assets für diese Auswahl gefunden.
            </div>
          ) : (
            filtered.map((asset) => {
              const catColor = getCategoryColor(asset.mainCategory);

              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onClose();
                    onSelectAsset(asset);
                  }}
                  className="p-3 rounded-2xl bg-[#091129] border border-slate-800/90 hover:border-amber-500/40 cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 border"
                      style={{
                        backgroundColor: `${catColor}15`,
                        borderColor: `${catColor}40`,
                        color: catColor,
                      }}
                    >
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          {asset.name}
                        </span>
                        <span
                          className="text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded border font-mono"
                          style={{
                            color: catColor,
                            backgroundColor: `${catColor}10`,
                            borderColor: `${catColor}30`,
                          }}
                        >
                          {asset.mainCategory}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{asset.category}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono">{asset.value}</div>
                    <div
                      className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                        asset.isPositive ? 'text-[#44DE88]' : 'text-[#F87171]'
                      }`}
                    >
                      {asset.isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{asset.change}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
        >
          Schließen
        </button>
      </motion.div>
    </div>
  );
};
