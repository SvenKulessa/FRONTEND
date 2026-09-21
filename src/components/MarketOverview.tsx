import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { MARKET_ASSETS } from '../data/mockData';
import { MarketAsset } from '../types';

interface MarketOverviewProps {
  onSelectAsset: (asset: MarketAsset) => void;
  onViewAllMarkets: () => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ onSelectAsset, onViewAllMarkets }) => {
  const renderAssetIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return (
          <div className="w-6 h-6 rounded-md bg-cyan-500/15 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        );
      case 'bitcoin':
        return (
          <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center font-bold text-[12px] text-white shadow-sm">
            ₿
          </div>
        );
      case 'gold':
        return (
          <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center">
            {/* Gold bar ingot icon */}
            <svg className="w-4 h-4 text-[#F5B014]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 16l3-6h10l3 6H4z" />
              <path d="M6 18h12l-1 2H7l-1-2z" opacity="0.7" />
            </svg>
          </div>
        );
      case 'forex':
        return (
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-bold text-[11px] text-cyan-300">
            €
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="px-5 py-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[17.5px] font-bold text-white tracking-tight">
          Globale Märkte im Überblick
        </h2>
        <button
          type="button"
          onClick={onViewAllMarkets}
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#F5B014] hover:text-amber-300 transition-colors"
        >
          <span>Alle Märkte</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Market Cards Container (Horizontal scrolling with touch snap) */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 pt-1 -mx-5 px-5 snap-x snap-mandatory">
        {MARKET_ASSETS.map((asset) => (
          <motion.div
            key={asset.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectAsset(asset)}
            className="snap-start shrink-0 w-[140px] sm:w-[155px] rounded-2xl bg-[#060c1d] border border-slate-800/90 relative overflow-hidden p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:border-slate-700 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            style={{
              boxShadow: `0 8px 20px -8px ${asset.glowColor}`,
            }}
          >
            {/* Top row: Icon & Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {renderAssetIcon(asset.iconType)}
                <span className="text-[12.5px] font-medium text-slate-300 truncate">
                  {asset.name}
                </span>
              </div>

              {/* Value & Percentage */}
              <div className="text-[15px] font-bold text-white tracking-tight leading-snug">
                {asset.value}
              </div>
              <div className="text-[11.5px] font-semibold text-emerald-400 leading-tight mt-0.5">
                {asset.change}
              </div>
            </div>

            {/* Sparkline Neon Graph & Subtle bottom neon border */}
            <div className="relative h-9 w-full mt-2 overflow-hidden flex items-end">
              <svg
                viewBox="0 0 200 45"
                className="w-full h-8 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id={`glow-${asset.id}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id={`grad-${asset.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={asset.waveColor} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={asset.waveColor} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Area Fill */}
                <path
                  d={`${asset.sparklinePath} L 200,45 L 0,45 Z`}
                  fill={`url(#grad-${asset.id})`}
                />

                {/* Neon Stroke */}
                <path
                  d={asset.sparklinePath}
                  fill="none"
                  stroke={asset.waveColor}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  filter={`url(#glow-${asset.id})`}
                />
              </svg>
            </div>

            {/* Bottom glowing accent edge */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] opacity-70"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${asset.waveColor} 50%, transparent 100%)`,
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
