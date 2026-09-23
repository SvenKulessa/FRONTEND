import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  Sparkles,
  Bell,
  BellRing,
  Check,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketAsset, AlertCondition } from '../types';
import { usePriceAlerts } from '../context/PriceAlertsContext';
import { parsePriceToNumber, formatCurrencyPrice } from '../utils/priceAlerts';
import { AssetLogo } from './AssetLogo';

interface AssetDetailModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  onOpenAllAlerts?: () => void;
}

const TIMEFRAMES = ['1T', '1W', '1M', '3M', '1J', 'MAX'];

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onOpenAllAlerts,
}) => {
  const [activeTf, setActiveTf] = useState('1T');
  const [isAlertFormOpen, setIsAlertFormOpen] = useState(false);

  const {
    getAlertsForAsset,
    addAlert,
    deleteAlert,
    toggleAlert,
    preferences,
    updatePreferences,
    testTriggerAlert,
  } = usePriceAlerts();

  // Form state
  const [direction, setDirection] = useState<AlertCondition>('ABOVE');
  const [targetPriceStr, setTargetPriceStr] = useState<string>('');
  const [alertNote, setAlertNote] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  if (!asset) return null;

  const currentPriceNum = parsePriceToNumber(asset.value);
  const existingAlerts = getAlertsForAsset(asset.symbol);
  const hasActiveAlert = existingAlerts.some((a) => a.isEnabled && !a.isTriggered);

  // Initialize target price if empty
  const handleOpenAlertForm = () => {
    if (!isAlertFormOpen) {
      const defaultTarget = currentPriceNum * (direction === 'ABOVE' ? 1.02 : 0.98);
      setTargetPriceStr(
        defaultTarget >= 10
          ? defaultTarget.toFixed(2)
          : defaultTarget >= 1
          ? defaultTarget.toFixed(4)
          : defaultTarget.toFixed(6)
      );
    }
    setIsAlertFormOpen(!isAlertFormOpen);
  };

  const handleApplyPct = (pct: number) => {
    const newTarget = currentPriceNum * (1 + pct / 100);
    setTargetPriceStr(
      newTarget >= 10
        ? newTarget.toFixed(2)
        : newTarget >= 1
        ? newTarget.toFixed(4)
        : newTarget.toFixed(6)
    );
    setDirection(pct >= 0 ? 'ABOVE' : 'BELOW');
  };

  const handleSubmitAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(targetPriceStr.replace(',', '.'));
    if (isNaN(num) || num <= 0) return;

    const formattedTarget = formatCurrencyPrice(num, asset.value);

    addAlert({
      assetId: asset.id,
      assetSymbol: asset.symbol,
      assetName: asset.name,
      assetCategory: asset.mainCategory,
      targetPrice: num,
      initialPrice: currentPriceNum,
      direction,
      note: alertNote.trim(),
      formattedTarget,
    });

    setSuccessBanner(`Alarm bei ${formattedTarget} aktiviert!`);
    setAlertNote('');

    setTimeout(() => {
      setSuccessBanner(null);
      setIsAlertFormOpen(false);
    }, 1500);
  };

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
          <div className="flex items-start gap-3.5 min-w-0">
            <AssetLogo asset={asset} size="lg" className="mt-1 shadow-lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F9BF21]/15 text-[#F9BF21] border border-[#F9BF21]/30 font-mono">
                  {asset.mainCategory}
                </span>
                <span className="text-xs text-slate-400">{asset.category}</span>
                <span className="text-xs text-amber-400 font-mono font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">{asset.symbol}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1 truncate">{asset.name}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{asset.value}</span>
                <span className={`text-sm font-semibold ${asset.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {asset.change} (Heute)
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Row: SET ALERT BUTTON & Existing Alert Indicator */}
        <div className="mt-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/30">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  hasActiveAlert
                    ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_12px_rgba(249,191,33,0.35)]'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}
              >
                <BellRing className={`w-4 h-4 ${hasActiveAlert ? 'animate-bounce' : ''}`} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>PriceAlert Schwellenwert</span>
                  {hasActiveAlert && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                      {existingAlerts.filter((a) => a.isEnabled).length} aktiv
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {existingAlerts.length > 0
                    ? `${existingAlerts[0].direction === 'ABOVE' ? '≥' : '≤'} ${existingAlerts[0].formattedTarget}`
                    : 'Automatische Benachrichtigung bei Kursausbruch'}
                </div>
              </div>
            </div>

            {/* PROMINENT 'SET ALERT' BUTTON */}
            <button
              type="button"
              id="asset-detail-set-alert-btn"
              onClick={handleOpenAlertForm}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_14px_rgba(249,191,33,0.25)] hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              data-analytics="set-alert-click"
              data-asset-symbol={asset.symbol}
            >
              <Bell className="w-3.5 h-3.5 fill-current" />
              <span>{isAlertFormOpen ? 'Einklappen' : 'Set Alert'}</span>
              {isAlertFormOpen ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Existing alerts pill list if any */}
          {existingAlerts.length > 0 && !isAlertFormOpen && (
            <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] text-slate-400 font-mono">Bestehende Alarme:</span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {existingAlerts.map((al) => (
                  <span
                    key={al.id}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${
                      al.isTriggered
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : al.isEnabled
                        ? 'bg-slate-800 border-amber-400/30 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-500 line-through'
                    }`}
                  >
                    <span>{al.direction === 'ABOVE' ? '↑' : '↓'}</span>
                    <span>{al.formattedTarget}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Collapsible 'Set Alert' Form Panel */}
        <AnimatePresence>
          {isAlertFormOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmitAlert}
              className="mt-3 p-4 rounded-2xl bg-[#030713] border border-amber-500/40 shadow-inner overflow-hidden"
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Neuen Schwellenwert-Alarm für {asset.symbol} konfigurieren</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Basis: {asset.value}
                </span>
              </div>

              {successBanner && (
                <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{successBanner}</span>
                </div>
              )}

              {/* Threshold Direction */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setDirection('ABOVE');
                    handleApplyPct(2);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    direction === 'ABOVE'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(68,222,136,0.15)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  <span>Steigt über (≥)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDirection('BELOW');
                    handleApplyPct(-2);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    direction === 'BELOW'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(248,113,113,0.15)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4 text-rose-400" />
                  <span>Fällt unter (≤)</span>
                </button>
              </div>

              {/* Numerical Input & Quick Buttons */}
              <div className="mb-3">
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Zielkurs-Schwelle:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    required
                    value={targetPriceStr}
                    onChange={(e) => setTargetPriceStr(e.target.value)}
                    placeholder="Zielkurs eingeben"
                    className="w-full bg-[#080e22] border border-slate-700 focus:border-amber-400 rounded-xl py-2 px-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Percentage Offset Quick Buttons */}
                <div className="flex gap-1 mt-2">
                  {[-10, -5, -2, 2, 5, 10].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleApplyPct(pct)}
                      className="flex-1 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/40 text-[10.5px] font-mono font-bold text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="mb-3">
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Notiz (z.B. Take-Profit, Kauforder):
                </label>
                <input
                  type="text"
                  placeholder="z.B. Widerstand durchbrochen, Kauf bei Retest"
                  value={alertNote}
                  onChange={(e) => setAlertNote(e.target.value)}
                  className="w-full bg-[#080e22] border border-slate-700 rounded-xl py-1.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Quick Preferences Toggles */}
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] mb-3">
                <div className="text-slate-400 font-semibold mb-1.5">
                  Benachrichtigungs-Präferenzen:
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updatePreferences({ inAppNotifications: !preferences.inAppNotifications })
                    }
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                      preferences.inAppNotifications
                        ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Bell className="w-3 h-3" />
                    <span>In-App Banner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updatePreferences({ soundEnabled: !preferences.soundEnabled })
                    }
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                      preferences.soundEnabled
                        ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    {preferences.soundEnabled ? (
                      <Volume2 className="w-3 h-3 text-amber-400" />
                    ) : (
                      <VolumeX className="w-3 h-3" />
                    )}
                    <span>Sound</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updatePreferences({ emailDigest: !preferences.emailDigest })
                    }
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                      preferences.emailDigest
                        ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Mail className="w-3 h-3" />
                    <span>E-Mail</span>
                  </button>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAlertFormOpen(false)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(249,191,33,0.3)] cursor-pointer"
                >
                  <BellRing className="w-3.5 h-3.5 fill-current" />
                  <span>Alarm jetzt scharfstellen</span>
                </button>
              </div>

              {/* Existing Alerts List within dropdown */}
              {existingAlerts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-slate-300 mb-1.5">
                    Aktive Alarme für {asset.symbol}:
                  </div>
                  <div className="space-y-1.5">
                    {existingAlerts.map((al) => (
                      <div
                        key={al.id}
                        className="p-2 rounded-xl bg-[#080e22] border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold ${
                              al.direction === 'ABOVE' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {al.direction === 'ABOVE' ? '≥' : '≤'} {al.formattedTarget}
                          </span>
                          {al.note && (
                            <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                              ({al.note})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => testTriggerAlert(al.id)}
                            className="text-[10px] text-amber-400 hover:text-amber-300 cursor-pointer font-bold px-1.5 py-0.5 rounded bg-amber-400/10"
                          >
                            Test
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleAlert(al.id)}
                            className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${
                              al.isEnabled ? 'bg-amber-400' : 'bg-slate-800'
                            }`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full bg-black transition-transform ${
                                al.isEnabled ? 'translate-x-3' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAlert(al.id)}
                            className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.form>
          )}
        </AnimatePresence>

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
            Marktkommentar &amp; Methodik
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            {asset.description}
          </p>
        </div>

        {/* Modal Footer with Close & Manage All Alerts Link */}
        <div className="mt-5 flex items-center gap-2">
          {onOpenAllAlerts && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAllAlerts();
              }}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Alle Alarme ({existingAlerts.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </motion.div>
    </div>
  );
};

