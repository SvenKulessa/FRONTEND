import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Activity, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { MarketAsset } from '../types';

interface AssetDetailModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
}

const TIMEFRAMES = ['1T', '1W', '1M', '3M', '1J', 'MAX'];

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  const [activeTf, setActiveTf] = useState('1T');

  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-lg bg-[#070e22] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F9BF21]/15 text-[#F9BF21] border border-[#F9BF21]/30 font-mono">
                {asset.mainCategory}
              </span>
              <span className="text-xs text-slate-400">{asset.category}</span>
              <span className="text-xs text-slate-400 font-mono">{asset.symbol}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">{asset.name}</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white tracking-tight">{asset.value}</span>
              <span className={`text-sm font-semibold ${asset.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {asset.change} (Heute)
              </span>
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

        {/* Timeframe selector */}
        <div className="flex gap-1.5 mt-4 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setActiveTf(tf)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTf === tf
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Interactive Chart Visualizer */}
        <div className="mt-4 p-4 rounded-2xl bg-[#030713] border border-slate-800/80 relative overflow-hidden">
          <div className="h-36 w-full flex items-end">
            <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="detailModalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={asset.waveColor} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={asset.waveColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,90 Q 50,110 90,80 T 170,85 T 240,45 T 310,60 T 360,25 T 400,20 L 400,120 L 0,120 Z"
                fill="url(#detailModalGrad)"
              />
              <path
                d="M 0,90 Q 50,110 90,80 T 170,85 T 240,45 T 310,60 T 360,25 T 400,20"
                fill="none"
                stroke={asset.waveColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="400" cy="20" r="4" fill="#ffffff" stroke={asset.waveColor} strokeWidth="2" />
            </svg>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <span>09:00</span>
            <span>12:00</span>
            <span>15:00</span>
            <span>17:30 (Live)</span>
          </div>
        </div>

        {/* Capital-AI Scoring Insight */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-medium">Capital-AI Signal</div>
              <div className="text-sm font-bold text-white">{asset.aiRating}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-amber-400">{asset.aiScore}/100</div>
            <div className="text-[10px] text-slate-300">Hohe Konfidenz</div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10.5px] text-slate-400 block">24h Hoch</span>
            <span className="text-xs font-bold text-white font-mono mt-0.5 block">{asset.high24h}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10.5px] text-slate-400 block">24h Tief</span>
            <span className="text-xs font-bold text-white font-mono mt-0.5 block">{asset.low24h}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10.5px] text-slate-400 block">Volumen (24h)</span>
            <span className="text-xs font-bold text-white font-mono mt-0.5 block">{asset.volume24h}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Marktkommentar & Methodik
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            {asset.description}
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
        >
          Schließen
        </button>
      </motion.div>
    </div>
  );
};
