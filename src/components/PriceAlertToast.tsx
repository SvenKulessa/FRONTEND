import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BellRing,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Flame,
  Activity,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { usePriceAlerts } from '../context/PriceAlertsContext';
import { MARKET_ASSETS } from '../data/mockData';
import { MarketAsset } from '../types';
import { AssetLogo } from './AssetLogo';
import { getSentimentLevelInfo } from '../utils/priceAlerts';

interface PriceAlertToastProps {
  onSelectAsset?: (asset: MarketAsset) => void;
  onOpenSentiment?: () => void;
}

export const PriceAlertToast: React.FC<PriceAlertToastProps> = ({
  onSelectAsset,
  onOpenSentiment,
}) => {
  const { activeToast, dismissToast, preferences, setIsAlertModalOpen } = usePriceAlerts();

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 10000);
    return () => clearTimeout(timer);
  }, [activeToast, dismissToast]);

  if (!activeToast || !preferences.inAppNotifications) return null;

  // -----------------------------------------------------------------
  // 1. SENTIMENT ALERT TOAST
  // -----------------------------------------------------------------
  if (activeToast.type === 'SENTIMENT') {
    const sAlert = activeToast.sentimentAlert;
    const targetInfo = sAlert.targetLevel
      ? getSentimentLevelInfo(sAlert.targetLevel)
      : { labelDe: 'Signifikanter Wechsel', color: '#10B981', bgColor: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.4)' };
    const fromInfo = sAlert.fromLevel ? getSentimentLevelInfo(sAlert.fromLevel) : null;

    const coupledAsset = sAlert.coupledAssetSymbol
      ? MARKET_ASSETS.find(
          (a) =>
            a.symbol.toUpperCase() === sAlert.coupledAssetSymbol?.toUpperCase()
        )
      : null;

    return (
      <AnimatePresence>
        <div className="fixed top-4 sm:top-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-[420px] z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="pointer-events-auto rounded-2xl bg-[#091129]/95 border-2 border-emerald-400 shadow-[0_12px_45px_rgba(16,185,129,0.35),0_0_20px_rgba(0,0,0,0.9)] backdrop-blur-xl p-4 text-white overflow-hidden relative"
          >
            {/* Top gradient stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 animate-pulse" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-bounce">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-mono">
                      Sentiment-Alarm
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700">
                      {sAlert.categoryLabel}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate mt-1">
                    {sAlert.title}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={dismissToast}
                className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Benachrichtigung schließen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sentiment Transition Banner */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  Regime-Wechsel
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {sAlert.triggeredAt || 'Gerade eben'}
                </span>
              </div>

              {/* Visual Shift: From -> To */}
              <div className="flex items-center justify-center gap-2 mt-2 py-1.5 px-2 bg-slate-950/70 rounded-lg border border-slate-800/80">
                {fromInfo ? (
                  <span
                    className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase font-mono"
                    style={{
                      color: fromInfo.color,
                      backgroundColor: fromInfo.bgColor,
                      borderColor: fromInfo.borderColor,
                    }}
                  >
                    {fromInfo.labelDe}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Markt-Regime</span>
                )}

                <ArrowRight className="w-4 h-4 text-amber-400 animate-pulse" />

                <span
                  className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase font-mono flex items-center gap-1 shadow-sm"
                  style={{
                    color: targetInfo.color,
                    backgroundColor: targetInfo.bgColor,
                    borderColor: targetInfo.borderColor,
                  }}
                >
                  <Flame className="w-3 h-3" />
                  {targetInfo.labelDe}
                </span>
              </div>

              {/* Coupled asset note */}
              {coupledAsset && (
                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Gekoppeltes Asset:</span>
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <AssetLogo asset={coupledAsset} size="xs" />
                    <span>{coupledAsset.name} ({coupledAsset.symbol})</span>
                  </div>
                </div>
              )}

              {/* Note / Guidance */}
              {sAlert.note && (
                <p className="mt-1.5 text-[11px] text-amber-200/90 italic border-t border-slate-800/60 pt-1 leading-snug">
                  💡 &ldquo;{sAlert.note}&rdquo;
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  dismissToast();
                  setIsAlertModalOpen(true);
                }}
                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.35)]"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Alarme verwalten</span>
              </button>
              {onOpenSentiment && (
                <button
                  type="button"
                  onClick={() => {
                    dismissToast();
                    onOpenSentiment();
                  }}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Sentiment-Radar
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // -----------------------------------------------------------------
  // 2. ASSET PRICE ALERT TOAST
  // -----------------------------------------------------------------
  const alert = activeToast.alert;
  const isAbove = alert.direction === 'ABOVE';
  const matchingAsset = MARKET_ASSETS.find(
    (a) => a.id === alert.assetId || a.symbol === alert.assetSymbol
  );

  return (
    <AnimatePresence>
      <div className="fixed top-4 sm:top-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="pointer-events-auto rounded-2xl bg-[#091129]/95 border-2 border-amber-400 shadow-[0_10px_35px_rgba(249,191,33,0.35),0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-xl p-4 text-white overflow-hidden relative"
        >
          {/* Top subtle highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-[#FF2E93] to-amber-400 animate-pulse" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <AssetLogo
                symbol={alert.assetSymbol}
                name={alert.assetName}
                category={alert.assetCategory}
                size="md"
                className="mt-0.5 shadow-md"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-400 text-black font-mono">
                    Alarm ausgelöst
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {alert.assetSymbol}
                  </span>
                  {alert.sentimentCoupling?.enabled && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      🧠 Sentiment-gekoppelt
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">
                  {alert.assetName}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={dismissToast}
              className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Benachrichtigung schließen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Trigger Details */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                {isAbove ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                )}
                Bedingung: {isAbove ? 'Steigt über' : 'Fällt unter'}
              </span>
              <span className="font-bold text-amber-300">{alert.formattedTarget}</span>
            </div>

            {alert.sentimentCoupling?.enabled && (
              <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 text-[11px] flex items-center justify-between text-emerald-300">
                <span>Sentiment-Filter:</span>
                <span className="font-semibold">{alert.sentimentCoupling.targetRegime || 'Aktiv'}</span>
              </div>
            )}

            {alert.note && (
              <p className="mt-1 text-[11px] text-slate-300 italic truncate border-t border-slate-800/60 pt-1">
                &ldquo;{alert.note}&rdquo;
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex items-center gap-2">
            {matchingAsset && onSelectAsset && (
              <button
                type="button"
                onClick={() => {
                  dismissToast();
                  onSelectAsset(matchingAsset);
                }}
                className="flex-1 py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(249,191,33,0.3)]"
              >
                <span>Asset analysieren</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={dismissToast}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Schließen
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
