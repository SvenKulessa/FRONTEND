/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: QUANT WHALE RADAR & TELEGRAM PUSH HUB TERMINAL]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Tab 1: Live On-Chain Feed (Suchfilter, Explorer-Links, Wal-Transaktions-Karten)
 *    - Tab 2: Smart Money Flow Index & Matrix (Divergenz-Radar & Bestandsveränderungen)
 *    - Tab 3: Telegram Push Hub (Bot-Kopplung, Test-Push-Engine, Delivery Audit Logs)
 * 2. SCORING-LOGIK        : 
 *    - Transaktions-Impact-Score (1-100)
 *    - Net Institutional Inventory Flow (24h)
 *    - Filterung nach konfigurierbarem Schwellenwert (`minWhaleVolumeFilter`)
 * 3. DATENANBINDUNG       : 
 *    - `usePriceAlerts()`: `pushWhaleToTelegram()`, `testTelegramPush()`, `updateTelegramConfig()`
 *    - Telegram Bot API Token & Chat ID Synchronisation
 * 4. DATENQUELLEN / FEEDS : 
 *    - Live On-Chain Transaktionen (INITIAL_WHALE_TRANSACTIONS + Live Generator)
 *    - Lokales Telegram-Nachrichten-Log (`getTelegramLogs()`)
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  X,
  Radio,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  SlidersHorizontal,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Bell,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePriceAlerts } from '../context/PriceAlertsContext';
import { SMART_MONEY_METRICS, generateRandomWhaleTx } from '../data/whaleRadarData';
import { WhaleTransaction, MainCategory } from '../types';
import { getTelegramLogs } from '../utils/telegramService';
import { BrandLogo } from './BrandLogo';

interface WhaleRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset?: (symbol: string) => void;
}

type TabType = 'feed' | 'analytics' | 'telegram';

export const WhaleRadarModal: React.FC<WhaleRadarModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
}) => {
  const {
    whaleTransactions,
    addWhaleTransaction,
    pushWhaleToTelegram,
    preferences,
    updatePreferences,
    updateTelegramConfig,
    testTelegramPush,
    preselectedWhaleAsset,
    setPreselectedWhaleAsset,
  } = usePriceAlerts();

  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [minVolumeFilter, setMinVolumeFilter] = useState<number>(1); // Millions USD
  const [selectedCategory, setSelectedCategory] = useState<'ALLE' | MainCategory>('ALLE');
  const [searchQuery, setSearchQuery] = useState(preselectedWhaleAsset || '');
  const [pushStatusMap, setPushStatusMap] = useState<Record<string, 'sending' | 'sent'>>({});
  const [copiedCode, setCopiedCode] = useState(false);
  const [testResult, setTestResult] = useState<{ status: string; message: string } | null>(null);

  // Bot Token / Chat ID form state
  const [customBotToken, setCustomBotToken] = useState(preferences.telegram?.botToken || '');
  const [customChatId, setCustomChatId] = useState(preferences.telegram?.chatId || '');
  const [savedConfigBanner, setSavedConfigBanner] = useState(false);

  if (!isOpen) return null;

  // Filtered transactions
  const filteredTxs = whaleTransactions.filter((tx) => {
    const volMln = tx.amountUsd / 1_000_000;
    if (volMln < minVolumeFilter) return false;
    if (selectedCategory !== 'ALLE' && tx.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        tx.assetSymbol.toLowerCase().includes(q) ||
        tx.assetName.toLowerCase().includes(q) ||
        tx.fromWallet.label.toLowerCase().includes(q) ||
        tx.toWallet.label.toLowerCase().includes(q) ||
        tx.actionLabel.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handlePushClick = async (tx: WhaleTransaction) => {
    setPushStatusMap((prev) => ({ ...prev, [tx.id]: 'sending' }));
    const res = await pushWhaleToTelegram(tx.id);
    setPushStatusMap((prev) => ({ ...prev, [tx.id]: 'sent' }));
    setTimeout(() => {
      setPushStatusMap((prev) => {
        const next = { ...prev };
        delete next[tx.id];
        return next;
      });
    }, 3000);
  };

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    updateTelegramConfig({
      botToken: customBotToken.trim(),
      chatId: customChatId.trim(),
      connected: true,
      enabled: true,
    });
    setSavedConfigBanner(true);
    setTimeout(() => setSavedConfigBanner(false), 3000);
  };

  const handleSendTestPush = async () => {
    setTestResult({ status: 'sending', message: 'Telegram-Signal wird übermittelt...' });
    const res = await testTelegramPush();
    if (res.success) {
      setTestResult({
        status: 'success',
        message: `Signal erfolgreich ${res.status === 'DELIVERED' ? 'an Bot zugestellt (200 OK)' : 'im Testkanal simuliert'}!`,
      });
    } else {
      setTestResult({ status: 'error', message: `Fehler: ${res.error || 'Verbindung fehlgeschlagen'}` });
    }
    setTimeout(() => setTestResult(null), 5000);
  };

  const telegramLogs = getTelegramLogs();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-4xl bg-[#060c22] border border-cyan-500/40 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85)] my-auto max-h-[92vh] overflow-y-auto flex flex-col justify-between"
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    Quant Terminal
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Sub-45ms Latenz
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                  <span>Smart Money &amp; Whale Radar</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  updatePreferences({ soundEnabled: !preferences.soundEnabled })
                }
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title={preferences.soundEnabled ? 'Audio Chime stumm' : 'Audio Chime aktivieren'}
              >
                {preferences.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#030716] rounded-2xl border border-slate-800/90 mt-4 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Live On-Chain Feed ({filteredTxs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Smart Money Flow Index &amp; Matrix</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('telegram')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'telegram'
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Push Hub</span>
              {preferences.telegram?.connected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* TAB 1: Live On-Chain Feed */}
          {activeTab === 'feed' && (
            <div className="mt-4 space-y-3.5">
              {/* Controls bar: Volume, Search & Simulate */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#030716] border border-slate-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Asset, Wallet oder Börse suchen..."
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-56"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 5, 25, 100].map((vol) => (
                      <button
                        key={vol}
                        type="button"
                        onClick={() => setMinVolumeFilter(vol)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          minVolumeFilter === vol
                            ? 'bg-cyan-400 text-black font-bold shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        &gt; {vol}M $
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulate Whale Event button */}
                <button
                  type="button"
                  onClick={() => {
                    const newTx = generateRandomWhaleTx();
                    addWhaleTransaction(newTx);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)] shrink-0"
                  title="Simuliert eine neue Wal-Transaktion"
                >
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>Simuliere Wal-Signal</span>
                </button>
              </div>

              {/* Feed List */}
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {filteredTxs.length === 0 ? (
                  <div className="p-8 text-center bg-[#030716] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                    Keine Wal-Transaktionen für diesen Filter gefunden. Setzen Sie den Mindest-Volumen-Filter zurück.
                  </div>
                ) : (
                  filteredTxs.map((tx) => {
                    const isOutflow = tx.actionType === 'EXCHANGE_OUTFLOW';
                    const isInflow = tx.actionType === 'EXCHANGE_INFLOW';
                    const isDarkPool =
                      tx.actionType === 'DARK_POOL_BUY' || tx.actionType === 'DARK_POOL_SELL';
                    const formattedUsd = (tx.amountUsd / 1_000_000).toFixed(1) + ' Mio. $';
                    const isPushing = pushStatusMap[tx.id] === 'sending';
                    const isPushed = pushStatusMap[tx.id] === 'sent' || tx.telegramPushed;

                    return (
                      <div
                        key={tx.id}
                        className="p-3.5 rounded-2xl bg-[#030716] border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${
                              isOutflow
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : isInflow
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                                : isDarkPool
                                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                                : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                            }`}
                          >
                            {isOutflow ? (
                              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                            ) : isInflow ? (
                              <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
                            ) : isDarkPool ? (
                              <Layers className="w-5 h-5" />
                            ) : (
                              <Zap className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onSelectAsset?.(tx.assetSymbol);
                                }}
                                className="text-sm font-black text-white hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <span>{tx.assetSymbol}</span>
                                <ExternalLink className="w-3 h-3 text-slate-500" />
                              </button>
                              <span className="text-sm font-black font-mono text-cyan-300">
                                {formattedUsd}
                              </span>
                              <span className="text-xs font-mono text-slate-400">
                                ({tx.amountNative.toLocaleString('de-DE')} {tx.assetSymbol})
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                · {tx.timestamp}
                              </span>
                            </div>

                            <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-slate-200">
                                {tx.actionLabel}:
                              </span>
                              <span className="text-slate-400 font-mono text-[11px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {tx.fromWallet.label}
                              </span>
                              <span className="text-slate-600">→</span>
                              <span className="text-cyan-300 font-mono text-[11px] bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                                {tx.toWallet.label}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 mt-1.5 leading-snug">
                              {tx.aiInterpretation}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] font-mono text-slate-500">
                                Tx: {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                              </span>
                              {tx.explorerUrl && (
                                <a
                                  href={tx.explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-0.5"
                                >
                                  Explorer <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Score Gauge & Push Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] font-mono text-slate-400 uppercase block">
                              Smart Impact
                            </span>
                            <div className="text-base font-black font-mono text-white flex items-center sm:justify-end gap-1">
                              <span
                                className={
                                  tx.impactScore >= 90 ? 'text-emerald-400' : 'text-cyan-300'
                                }
                              >
                                {tx.impactScore}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">/100</span>
                            </div>
                            <span className="text-[10px] font-mono text-cyan-400/80">
                              {tx.smartMoneyBias}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handlePushClick(tx)}
                            disabled={isPushing}
                            className={`px-3 py-2 rounded-xl border text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                              isPushed
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(68,222,136,0.25)]'
                                : 'bg-blue-500/15 hover:bg-blue-500/25 border-blue-400/35 text-blue-300 hover:text-white'
                            }`}
                          >
                            <Send className={`w-3.5 h-3.5 ${isPushing ? 'animate-spin' : ''}`} />
                            <span>{isPushing ? 'Sendet...' : isPushed ? 'Gepusht ✓' : 'Telegram Push'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Smart Money Flow Index & Matrix */}
          {activeTab === 'analytics' && (
            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Flow Index Summary Card */}
                <div className="p-4 rounded-2xl bg-[#030716] border border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Smart Money Flow Index (SMFI)
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-3">
                    Der <strong>Smart Money Flow Index</strong> misst die Divergenz zwischen frühen institutionellen Blöcken (erste und letzte Handelsstunde, On-Chain Cold Storage Outflows, ATS Dark Pools) und Privatanleger-Orders.
                  </p>

                  <div className="space-y-3 font-mono">
                    {SMART_MONEY_METRICS.map((metric) => (
                      <div key={metric.assetSymbol} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-white">{metric.assetSymbol} ({metric.assetName})</span>
                          <span className={metric.score >= 80 ? 'text-emerald-400' : 'text-cyan-300'}>
                            {metric.score}/100 • {metric.smartMoneyBias}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              metric.score >= 80
                                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                            }`}
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                          <span>24h Netto: +{(metric.netInflow24hUsd / 1_000_000).toFixed(0)}M $</span>
                          <span>Divergenz: {metric.retailVsWhaleDivergence}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Institutional Net Inventory Shifts */}
                <div className="p-4 rounded-2xl bg-[#030716] border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4 text-amber-400" />
                      Institutionelle Bestandsveränderungen (24h)
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-3">
                      Überwachung der Netto-Bestände auf Prime Brokerage Plattformen und zentralen Krypto-Exchanges.
                    </p>

                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="flex items-center justify-between font-bold text-white mb-1">
                          <span>Coinbase Prime Custody</span>
                          <span className="text-emerald-400 font-mono">+12.450 BTC</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Institutionelle Akkumulation durch US-Spot-ETFs &amp; Stiftungsvermögen.
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="flex items-center justify-between font-bold text-white mb-1">
                          <span>Goldman Sachs Sigma X ATS</span>
                          <span className="text-emerald-400 font-mono">+$290M Block Vol.</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Dark Pool Kaufüberhang bei NVIDIA, Microsoft und Halbleiter-Sektor.
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="flex items-center justify-between font-bold text-white mb-1">
                          <span>Binance &amp; Bybit Liquiditäts-Reserven</span>
                          <span className="text-rose-400 font-mono">-18.200 ETH</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Kontinuierlicher Abzug in Cold Storage reduziert sofort verfügbares Marktangebot.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Aktuelles Marktumfeld: Starkes Smart-Money-Akkumulationsregime (Bullish Bias)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Telegram Push Hub */}
          {activeTab === 'telegram' && (
            <div className="mt-4 space-y-4 text-xs">
              {/* Connection Status Box */}
              <div className="p-4 rounded-2xl bg-[#030716] border border-cyan-500/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          Capital-AI Telegram Alert Bot
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                          {preferences.telegram?.connected ? 'Online & Verbunden' : 'Bereit zur Kopplung'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Offizieller Alert-Kanal: <strong>@CapitalAI_WhaleBot</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendTestPush}
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.35)] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Test-Push sofort senden</span>
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`mt-3 p-2.5 rounded-xl border flex items-center gap-2 font-mono text-xs ${
                      testResult.status === 'success'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : testResult.status === 'error'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{testResult.message}</span>
                  </div>
                )}

                {/* 1-Click Telegram Kopplung Quick-Step */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3.5">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[11px] font-bold text-cyan-300 uppercase block mb-1">
                      Option A: 1-Klick Instant Kopplung
                    </span>
                    <p className="text-slate-400 text-[11px] mb-2 leading-relaxed">
                      Öffnen Sie Telegram und senden Sie den Befehl <code>/start</code> an den Capital-AI Bot mit Ihrem persönlichen Synchronisations-Code:
                    </p>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-amber-300">
                      <span>/start CAP-8849-LIVE</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('/start CAP-8849-LIVE');
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                        className="ml-auto text-slate-400 hover:text-white p-1 cursor-pointer"
                        title="In die Zwischenablage kopieren"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <a
                      href="https://t.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold text-[11px]"
                    >
                      <span>In Telegram öffnen</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Option B: Custom Bot Token & Chat ID */}
                  <form onSubmit={handleSaveTelegram} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[11px] font-bold text-cyan-300 uppercase block mb-1">
                      Option B: Eigener Telegram Bot (Enterprise / Private)
                    </span>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5 font-mono">
                          Telegram Bot Token:
                        </label>
                        <input
                          type="password"
                          value={customBotToken}
                          onChange={(e) => setCustomBotToken(e.target.value)}
                          placeholder="z.B. 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5 font-mono">
                          Chat ID / Kanal ID:
                        </label>
                        <input
                          type="text"
                          value={customChatId}
                          onChange={(e) => setCustomChatId(e.target.value)}
                          placeholder="z.B. 987654321 oder @mein_trading_kanal"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer border border-slate-700"
                      >
                        Speichern &amp; Testen
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Alert Triggers & Toggles */}
              <div className="p-4 rounded-2xl bg-[#030716] border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Automatische Push-Kriterien konfigurieren
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">🐋 On-Chain Whale Radar</span>
                      <span className="text-[11px] text-slate-400">
                        Warnung bei Großtransaktionen &gt; {preferences.telegram?.minWhaleVolumeMln || 5}M $
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateTelegramConfig({
                          notifyWhaleRadar: !preferences.telegram?.notifyWhaleRadar,
                        })
                      }
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        preferences.telegram?.notifyWhaleRadar ? 'bg-cyan-400' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-black transition-transform ${
                          preferences.telegram?.notifyWhaleRadar ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">🌊 Smart Money Flow Anomalien</span>
                      <span className="text-[11px] text-slate-400">
                        Bei Score &gt; 85 oder plötzlicher Bullish Divergenz
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateTelegramConfig({
                          notifySmartMoney: !preferences.telegram?.notifySmartMoney,
                        })
                      }
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        preferences.telegram?.notifySmartMoney ? 'bg-cyan-400' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-black transition-transform ${
                          preferences.telegram?.notifySmartMoney ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">🔔 Persönliche Preisalarme</span>
                      <span className="text-[11px] text-slate-400">
                        Sofort-Push bei Über-/Unterschreiten Ihrer Kursziele
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateTelegramConfig({
                          notifyPriceAlerts: !preferences.telegram?.notifyPriceAlerts,
                        })
                      }
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        preferences.telegram?.notifyPriceAlerts ? 'bg-cyan-400' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-black transition-transform ${
                          preferences.telegram?.notifyPriceAlerts ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">⚡ Sentiment-Regime Flips</span>
                      <span className="text-[11px] text-slate-400">
                        Wechsel in Extreme Angst oder Extreme Gier
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateTelegramConfig({
                          notifySentimentFlips: !preferences.telegram?.notifySentimentFlips,
                        })
                      }
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        preferences.telegram?.notifySentimentFlips ? 'bg-cyan-400' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-black transition-transform ${
                          preferences.telegram?.notifySentimentFlips ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Telegram Log */}
              {telegramLogs.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#030716] border border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Zuletzt versendete Telegram-Signale</span>
                    <span className="text-[10px] font-mono text-slate-500 font-normal">
                      {telegramLogs.length} protokolliert
                    </span>
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px]">
                    {telegramLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <div className="truncate text-slate-300">
                          <span className="text-cyan-400 font-bold mr-1.5">{log.title}</span>
                          <span className="text-slate-500 text-[10px]">
                            {new Date(log.sentAt).toLocaleTimeString('de-DE')}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                            log.status === 'DELIVERED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}
                        >
                          {log.status === 'DELIVERED' ? 'Zugestellt' : 'Simuliert'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Mempool, ATS &amp; OTC Node Connections • 256-Bit TLS</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </motion.div>
    </div>
  );
};
