import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, TrendingUp, TrendingDown, Layers, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { MARKET_ASSETS, ASSET_CLASSES } from '../data/mockData';
import { MarketAsset, MainCategory } from '../types';
import { AssetLogo } from './AssetLogo';

interface AllMarketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
  initialCategory?: 'ALLE' | MainCategory;
  initialSubclassId?: string;
}

type CategoryFilter = 'ALLE' | MainCategory;

const CATEGORIES: { id: CategoryFilter; label: string; color: string }[] = [
  { id: 'ALLE', label: 'Alle Märkte', color: '#F9BF21' },
  { id: 'KRYPTO', label: 'Krypto', color: '#F9BF21' },
  { id: 'AKTIEN', label: 'Aktien', color: '#44DE88' },
  { id: 'INDIZIES', label: 'Indizies', color: '#8D26FF' },
  { id: 'FOREX', label: 'Forex', color: '#E879F9' },
  { id: 'ROHSTOFFE', label: 'Rohstoffe', color: '#F9BF21' },
];

const ITEMS_PER_PAGE = 50;

export const AllMarketsModal: React.FC<AllMarketsModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
  initialCategory,
  initialSubclassId,
}) => {
  const [selectedCat, setSelectedCat] = useState<CategoryFilter>(initialCategory || 'ALLE');
  const [selectedSubclassId, setSelectedSubclassId] = useState<string>('ALLE');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCat(initialCategory);
    }
  }, [initialCategory, isOpen]);

  useEffect(() => {
    if (initialSubclassId) {
      setSelectedSubclassId(initialSubclassId);
    } else {
      setSelectedSubclassId('ALLE');
    }
  }, [initialSubclassId, initialCategory, isOpen]);

  // When category changes, reset subclass if it doesn't belong
  const currentSubclasses = useMemo(() => {
    if (selectedCat === 'ALLE') return [];
    const foundClass = ASSET_CLASSES.find((c) => c.id === selectedCat);
    return foundClass ? foundClass.subclasses : [];
  }, [selectedCat]);

  useEffect(() => {
    if (selectedSubclassId !== 'ALLE' && currentSubclasses.length > 0) {
      const exists = currentSubclasses.some((s) => s.id === selectedSubclassId);
      if (!exists) {
        setSelectedSubclassId('ALLE');
      }
    }
  }, [selectedCat, currentSubclasses, selectedSubclassId]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCat, selectedSubclassId, search]);

  if (!isOpen) return null;

  const filtered = MARKET_ASSETS.filter((item) => {
    const matchesCat = selectedCat === 'ALLE' || item.mainCategory === selectedCat;
    if (!matchesCat) return false;

    const matchesSubclass =
      selectedSubclassId === 'ALLE' ||
      item.subclassId === selectedSubclassId ||
      (item.category && currentSubclasses.find((s) => s.id === selectedSubclassId)?.name.toLowerCase() === item.category.toLowerCase());

    if (!matchesSubclass) return false;

    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.symbol.toLowerCase().includes(q) ||
      item.mainCategory.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.aiRating && item.aiRating.toLowerCase().includes(q))
    );
  });

  const displayed = filtered.slice(0, visibleCount);

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
        className="w-full max-w-2xl bg-[#070e22] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Globales Asset Universum
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {MARKET_ASSETS.length} Real-Time Assets über 5 Assetklassen mit institutionellen Symbolen
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-3.5 relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Asset-Name, Reales Symbol (z.B. BTC, NVDA, SPX, EUR/USD, XAU) suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#030712] border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-mono"
            >
              Leeren
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-2.5 shrink-0">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            const count = cat.id === 'ALLE'
              ? MARKET_ASSETS.length
              : MARKET_ASSETS.filter((a) => a.mainCategory === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCat(cat.id);
                  setSelectedSubclassId('ALLE');
                }}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800/40'
                }`}
                style={{
                  borderColor: isActive ? `${cat.color}80` : undefined,
                  color: isActive ? '#fff' : undefined,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.label}</span>
                <span className="text-[10px] font-mono opacity-80 bg-white/10 px-1 py-0.2 rounded">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subclass Pills (when a specific category is chosen) */}
        {selectedCat !== 'ALLE' && currentSubclasses.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 pt-0.5 shrink-0">
            <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0 flex items-center gap-1 pl-1">
              <Filter className="w-3 h-3" />
              Sektor:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSubclassId('ALLE')}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer ${
                selectedSubclassId === 'ALLE'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Alle Unterklassen
            </button>
            {currentSubclasses.map((sub) => {
              const isSubActive = selectedSubclassId === sub.id;
              const subCount = MARKET_ASSETS.filter(
                (a) => a.mainCategory === selectedCat && (a.subclassId === sub.id || a.category === sub.name)
              ).length;

              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubclassId(sub.id)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    isSubActive
                      ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>{sub.name}</span>
                  <span className="text-[9px] font-mono opacity-75 bg-black/30 px-1 py-0.2 rounded">
                    {subCount}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 px-1 shrink-0 font-mono">
          <span>
            Gefunden: <strong className="text-white">{filtered.length}</strong> Assets
          </span>
          <span>
            Angezeigt: {Math.min(displayed.length, filtered.length)} von {filtered.length}
          </span>
        </div>

        {/* Market List */}
        <div className="space-y-2 mt-1 overflow-y-auto flex-1 pr-1">
          {displayed.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500 bg-[#091129]/40 rounded-2xl border border-slate-800/60">
              Keine Assets für &ldquo;{search}&rdquo; in dieser Kategorie gefunden.
            </div>
          ) : (
            displayed.map((asset) => {
              const catColor = getCategoryColor(asset.mainCategory);

              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onClose();
                    onSelectAsset(asset);
                  }}
                  className="p-3 rounded-2xl bg-[#091129] border border-slate-800/90 hover:border-amber-500/50 cursor-pointer flex items-center justify-between transition-all group hover:bg-[#0c1636]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AssetLogo asset={asset} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {asset.name}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 font-semibold bg-amber-400/10 px-1 py-0.2 rounded border border-amber-400/20 shrink-0">
                          {asset.symbol}
                        </span>
                        <span
                          className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border font-mono shrink-0"
                          style={{
                            color: catColor,
                            backgroundColor: `${catColor}10`,
                            borderColor: `${catColor}30`,
                          }}
                        >
                          {asset.mainCategory}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400 truncate">
                          {asset.category}
                        </span>
                        {asset.aiScore && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            • KI Score: <span className="text-white font-semibold">{asset.aiScore}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <div className="text-xs sm:text-sm font-bold text-white font-mono">
                      {asset.value}
                    </div>
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

          {/* Load More Button */}
          {visibleCount < filtered.length && (
            <div className="pt-2 pb-1 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-amber-500/20"
              >
                Weitere 50 Assets laden ({filtered.length - visibleCount} verbleibend)
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 mt-2 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Klicke auf ein Asset für die detaillierte Enterprise-Scorer-Analyse.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </motion.div>
    </div>
  );
};
