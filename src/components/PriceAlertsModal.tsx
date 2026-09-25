/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: MULTI-ASSET & SENTIMENT PRICE ALERTS MANAGER]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Tab 1: Asset-Alarme (Status-Filter, Suchfeld, Triggered Badges, Direction Icons)
 *    - Tab 2: Markt-Sentiment Alarme (Regime-Change, Transition Triggers)
 *    - Tab 3: Neuer Alarm Wizard (Asset-Auswahl, Zielpreis-Prozenttasten)
 *    - Tab 4: Einstellungen & Telegram Integration (Bot-Push, Audio-Chime, Prüfintervall)
 * 2. SCORING-LOGIK        : 
 *    - Automatische Schwellenwert-Validierung gegen Live-Tickerkurse
 *    - Sentiment-Score Schwellenwerte (Score Above / Below / Transition)
 *    - Telegram-Dispatch-Kriterien
 * 3. DATENANBINDUNG       : 
 *    - `usePriceAlerts()`: Globale Alert-Listen, CRUD-Aktionen, Telegram-Push-Methoden
 *    - Web Audio API Chime Synthesizer
 * 4. DATENQUELLEN / FEEDS : 
 *    - Multi-Asset Quotations (`MARKET_ASSETS`)
 *    - Macro Fear & Greed Sentiment Status
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  BellRing,
  BellOff,
  Plus,
  Trash2,
  Sliders,
  Settings,
  Volume2,
  VolumeX,
  Mail,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  RotateCcw,
  Search,
  Activity,
  Flame,
  ArrowRight,
  Layers,
  Sparkles,
  Send,
  Radio,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePriceAlerts } from '../context/PriceAlertsContext';
import { MARKET_ASSETS } from '../data/mockData';
import {
  MarketAsset,
  MainCategory,
  AlertCondition,
  SentimentLevel,
  SentimentConditionType,
  PriceAlertSentimentCoupling,
} from '../types';
import {
  parsePriceToNumber,
  formatCurrencyPrice,
  getSentimentLevelInfo,
} from '../utils/priceAlerts';
import { AssetLogo } from './AssetLogo';

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset?: (asset: MarketAsset) => void;
}

type ModalTab = 'alerts' | 'sentiment' | 'new' | 'settings';
type FilterStatus = 'all' | 'active' | 'triggered';
type NewAlertType = 'asset' | 'sentiment';

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
}) => {
  const {
    alerts,
    sentimentAlerts,
    preferences,
    updatePreferences,
    addAlert,
    deleteAlert,
    toggleAlert,
    testTriggerAlert,
    clearTriggeredAlerts,
    addSentimentAlert,
    deleteSentimentAlert,
    toggleSentimentAlert,
    testTriggerSentimentAlert,
    clearTriggeredSentimentAlerts,
    simulateSentimentShift,
    resetToDefaults,
    activeAlertsCount,
    triggeredAlertsCount,
    activeSentimentAlertsCount,
    triggeredSentimentAlertsCount,
    preselectedAssetForNewAlert,
    setPreselectedAssetForNewAlert,
    preselectedCategoryForSentiment,
    setPreselectedCategoryForSentiment,
    updateTelegramConfig,
    testTelegramPush,
    openWhaleRadar,
  } = usePriceAlerts();

  const [activeTab, setActiveTab] = useState<ModalTab>('alerts');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<string>('ALLE');
  const [searchQuery, setSearchQuery] = useState('');

  // New alert type switcher: Asset Price vs. Pure Sentiment
  const [newAlertType, setNewAlertType] = useState<NewAlertType>('asset');

  // New Asset alert form state
  const [selectedAssetForNew, setSelectedAssetForNew] = useState<MarketAsset | null>(
    preselectedAssetForNewAlert || MARKET_ASSETS[0]
  );
  const [targetPriceStr, setTargetPriceStr] = useState<string>('');
  const [direction, setDirection] = useState<AlertCondition>('ABOVE');
  const [noteStr, setNoteStr] = useState('');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Sentiment Coupling for Asset Alert
  const [isSentimentCoupled, setIsSentimentCoupled] = useState(false);
  const [coupledSentimentLevel, setCoupledSentimentLevel] = useState<SentimentLevel>('EXTREME_GREED');
  const [autoNotifyOnSentimentShift, setAutoNotifyOnSentimentShift] = useState(true);

  // New Sentiment Alert form state
  const [sentimentCategory, setSentimentCategory] = useState<'ALLE' | MainCategory>('ALLE');
  const [sentimentConditionType, setSentimentConditionType] = useState<SentimentConditionType>('TRANSITION_FROM_TO');
  const [sentimentFromLevel, setSentimentFromLevel] = useState<SentimentLevel>('FEAR');
  const [sentimentTargetLevel, setSentimentTargetLevel] = useState<SentimentLevel>('EXTREME_GREED');
  const [sentimentTargetScore, setSentimentTargetScore] = useState<number>(75);
  const [sentimentScoreDirection, setSentimentScoreDirection] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [sentimentCoupledAssetSymbol, setSentimentCoupledAssetSymbol] = useState<string>('');
  const [sentimentNote, setSentimentNote] = useState<string>('');

  // If opened with preselected asset, navigate to new alert tab
  useEffect(() => {
    if (preselectedAssetForNewAlert) {
      setSelectedAssetForNew(preselectedAssetForNewAlert);
      const parsedNum = parsePriceToNumber(preselectedAssetForNewAlert.value);
      const defaultTarget = parsedNum * 1.02;
      setTargetPriceStr(
        defaultTarget >= 10
          ? defaultTarget.toFixed(2)
          : defaultTarget >= 1
          ? defaultTarget.toFixed(4)
          : defaultTarget.toFixed(6)
      );
      setDirection('ABOVE');
      setNewAlertType('asset');
      setActiveTab('new');
    }
  }, [preselectedAssetForNewAlert, isOpen]);

  // If opened with preselected sentiment category
  useEffect(() => {
    if (preselectedCategoryForSentiment) {
      setSentimentCategory(preselectedCategoryForSentiment);
      setNewAlertType('sentiment');
      setActiveTab('sentiment');
      setPreselectedCategoryForSentiment(null);
    }
  }, [preselectedCategoryForSentiment, setPreselectedCategoryForSentiment]);

  // Update target price default when selectedAssetForNew changes
  useEffect(() => {
    if (selectedAssetForNew && !targetPriceStr) {
      const parsedNum = parsePriceToNumber(selectedAssetForNew.value);
      const defaultTarget = parsedNum * 1.02;
      setTargetPriceStr(
        defaultTarget >= 10
          ? defaultTarget.toFixed(2)
          : defaultTarget >= 1
          ? defaultTarget.toFixed(4)
          : defaultTarget.toFixed(6)
      );
    }
  }, [selectedAssetForNew, targetPriceStr]);

  if (!isOpen) return null;

  // Filter asset alerts list
  const filteredAlerts = alerts.filter((alert) => {
    if (filterStatus === 'active' && (!alert.isEnabled || alert.isTriggered)) return false;
    if (filterStatus === 'triggered' && !alert.isTriggered) return false;
    if (filterCategory !== 'ALLE' && alert.assetCategory !== filterCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        alert.assetName.toLowerCase().includes(q) ||
        alert.assetSymbol.toLowerCase().includes(q) ||
        (alert.note && alert.note.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filter sentiment alerts list
  const filteredSentimentAlerts = sentimentAlerts.filter((sa) => {
    if (filterStatus === 'active' && (!sa.isEnabled || sa.isTriggered)) return false;
    if (filterStatus === 'triggered' && !sa.isTriggered) return false;
    if (filterCategory !== 'ALLE' && sa.category !== filterCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        sa.title.toLowerCase().includes(q) ||
        sa.description.toLowerCase().includes(q) ||
        (sa.note && sa.note.toLowerCase().includes(q)) ||
        (sa.coupledAssetSymbol && sa.coupledAssetSymbol.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleApplyPercentage = (pct: number) => {
    if (!selectedAssetForNew) return;
    const baseNum = parsePriceToNumber(selectedAssetForNew.value);
    const newTarget = baseNum * (1 + pct / 100);
    setTargetPriceStr(
      newTarget >= 10
        ? newTarget.toFixed(2)
        : newTarget >= 1
        ? newTarget.toFixed(4)
        : newTarget.toFixed(6)
    );
    setDirection(pct >= 0 ? 'ABOVE' : 'BELOW');
  };

  // Submit handler for Asset Price Alert
  const handleCreateAssetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetForNew) return;

    const num = parseFloat(targetPriceStr.replace(',', '.'));
    if (isNaN(num) || num <= 0) return;

    const currentNum = parsePriceToNumber(selectedAssetForNew.value);
    const formatted = formatCurrencyPrice(num, selectedAssetForNew.value);

    const sentimentCouplingConfig: PriceAlertSentimentCoupling | undefined = isSentimentCoupled
      ? {
          enabled: true,
          requiredSentiment: coupledSentimentLevel,
          triggerOnSentimentShift: autoNotifyOnSentimentShift,
          targetRegime: `Gekoppelt mit ${getSentimentLevelInfo(coupledSentimentLevel).labelDe}`,
          category: selectedAssetForNew.mainCategory,
        }
      : undefined;

    addAlert({
      assetId: selectedAssetForNew.id,
      assetSymbol: selectedAssetForNew.symbol,
      assetName: selectedAssetForNew.name,
      assetCategory: selectedAssetForNew.mainCategory,
      targetPrice: num,
      initialPrice: currentNum,
      direction,
      note: noteStr.trim(),
      formattedTarget: formatted,
      sentimentCoupling: sentimentCouplingConfig,
    });

    setFormSuccessMessage(`Alarm für ${selectedAssetForNew.symbol} erfolgreich eingerichtet!`);
    setNoteStr('');
    setPreselectedAssetForNewAlert(null);

    setTimeout(() => {
      setFormSuccessMessage(null);
      setActiveTab('alerts');
    }, 1100);
  };

  // Submit handler for Pure Sentiment Alert
  const handleCreateSentimentAlert = (e: React.FormEvent) => {
    e.preventDefault();

    const catLabels: Record<string, string> = {
      ALLE: 'Gesamtmarkt',
      KRYPTO: 'Kryptomarkt',
      AKTIEN: 'Aktienmarkt',
      INDIZIES: 'Leitindizes',
      ROHSTOFFE: 'Rohstoffmärkte',
      FOREX: 'Devisenmarkt',
    };

    const coupledAsset = sentimentCoupledAssetSymbol
      ? MARKET_ASSETS.find(
          (a) =>
            a.symbol.toUpperCase() === sentimentCoupledAssetSymbol.toUpperCase().trim()
        )
      : null;

    addSentimentAlert({
      category: sentimentCategory,
      categoryLabel: catLabels[sentimentCategory] || sentimentCategory,
      conditionType: sentimentConditionType,
      fromLevel: sentimentConditionType === 'TRANSITION_FROM_TO' ? sentimentFromLevel : undefined,
      targetLevel: sentimentTargetLevel,
      targetScore: sentimentConditionType === 'SCORE_ABOVE' || sentimentConditionType === 'SCORE_BELOW' ? sentimentTargetScore : undefined,
      scoreDirection: sentimentScoreDirection,
      coupledAssetSymbol: coupledAsset ? coupledAsset.symbol : sentimentCoupledAssetSymbol.trim() || undefined,
      coupledAssetName: coupledAsset ? coupledAsset.name : undefined,
      note: sentimentNote.trim() || 'Sentiment-Regime Überwachung',
    });

    setFormSuccessMessage(`Sentiment-Alarm für ${catLabels[sentimentCategory]} aktiviert!`);
    setSentimentNote('');

    setTimeout(() => {
      setFormSuccessMessage(null);
      setActiveTab('sentiment');
    }, 1100);
  };

  const filteredAssetsForPicker = MARKET_ASSETS.filter((a) => {
    if (!assetSearchQuery.trim()) return true;
    const q = assetSearchQuery.toLowerCase().trim();
    return (
      a.name.toLowerCase().includes(q) ||
      a.symbol.toLowerCase().includes(q) ||
      a.mainCategory.toLowerCase().includes(q)
    );
  }).slice(0, 30);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-2xl bg-[#070e22] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(249,191,33,0.2)]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  PriceAlerts &amp; Sentiment-Kopplung
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Real-Time &amp; Fear/Greed
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-Faktor Alarme für Asset-Zielkurse und signifikante Marktstimmungs-Wechsel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Tab Navigation */}
        <div className="flex items-center justify-between gap-2 mt-4 pb-2 border-b border-slate-800/80 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            {/* Tab 1: Asset Alarme */}
            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Asset-Alarme</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
                {alerts.length}
              </span>
            </button>

            {/* Tab 2: Sentiment-Alarme */}
            <button
              type="button"
              onClick={() => setActiveTab('sentiment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sentiment'
                  ? 'bg-emerald-400 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Markt-Sentiment</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-500/20 text-emerald-300">
                {sentimentAlerts.length}
              </span>
            </button>

            {/* Tab 3: Neuer Alarm */}
            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Neuer Alarm</span>
            </button>

            {/* Tab 4: Einstellungen */}
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Präferenzen</span>
            </button>
          </div>

          {/* Quick Counter Pill */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {activeAlertsCount + activeSentimentAlertsCount} aktiv
            </span>
            {(triggeredAlertsCount > 0 || triggeredSentimentAlertsCount > 0) && (
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                {triggeredAlertsCount + triggeredSentimentAlertsCount} ausgelöst
              </span>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: ASSET ALARME LISTE */}
        {/* ============================================================ */}
        {activeTab === 'alerts' && (
          <div className="flex-1 flex flex-col min-h-0 mt-3">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between pb-3 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === 'all'
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Alle ({alerts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('active')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Aktiv ({activeAlertsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('triggered')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === 'triggered'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Ausgelöst ({triggeredAlertsCount})
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Category filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400"
                >
                  <option value="ALLE">Alle Kategorien</option>
                  <option value="KRYPTO">Krypto</option>
                  <option value="AKTIEN">Aktien</option>
                  <option value="INDIZIES">Indizes</option>
                  <option value="ROHSTOFFE">Rohstoffe</option>
                  <option value="FOREX">Forex</option>
                </select>

                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-28 sm:w-36 bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg pl-7 pr-2 py-1 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <BellOff className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>Keine Asset-Alarme mit den gewählten Filtern gefunden.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewAlertType('asset');
                      setActiveTab('new');
                    }}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Jetzt neuen Alarm anlegen</span>
                  </button>
                </div>
              ) : (
                filteredAlerts.map((alert) => {
                  const isAbove = alert.direction === 'ABOVE';
                  const matchingAsset = MARKET_ASSETS.find(
                    (a) => a.id === alert.assetId || a.symbol === alert.assetSymbol
                  );

                  return (
                    <div
                      key={alert.id}
                      className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                        alert.isTriggered
                          ? 'bg-[#151a2e]/90 border-amber-500/40 shadow-[0_0_15px_rgba(249,191,33,0.1)]'
                          : alert.isEnabled
                          ? 'bg-[#081028]/80 border-slate-800 hover:border-slate-700'
                          : 'bg-[#040817]/60 border-slate-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <AssetLogo
                            symbol={alert.assetSymbol}
                            name={alert.assetName}
                            category={alert.assetCategory}
                            size="md"
                            className="mt-0.5 shadow"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-white truncate">
                                {alert.assetName}
                              </span>
                              <span className="text-[10px] font-mono font-bold bg-amber-400/10 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/20">
                                {alert.assetSymbol}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 uppercase">
                                {alert.assetCategory}
                              </span>
                            </div>

                            {/* Condition line */}
                            <div className="flex items-center gap-2 mt-1 text-xs">
                              <span className="flex items-center gap-1 font-mono font-bold text-slate-200">
                                {isAbove ? (
                                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                                )}
                                {isAbove ? 'Steigt über' : 'Fällt unter'} {alert.formattedTarget}
                              </span>
                              {matchingAsset && (
                                <span className="text-slate-500 font-mono text-[11px]">
                                  (Aktuell: {matchingAsset.value})
                                </span>
                              )}
                            </div>

                            {/* Sentiment Coupling Badge */}
                            {alert.sentimentCoupling?.enabled && (
                              <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono font-bold">
                                <Activity className="w-3 h-3 text-emerald-400" />
                                <span>{alert.sentimentCoupling.targetRegime}</span>
                              </div>
                            )}

                            {alert.note && (
                              <p className="text-[11px] text-slate-400 italic mt-1 truncate">
                                &ldquo;{alert.note}&rdquo;
                              </p>
                            )}

                            {alert.isTriggered && (
                              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-mono text-amber-300 font-bold">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <span>Ausgelöst {alert.triggeredAt || 'vor Kurzem'}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Test Trigger Button */}
                          <button
                            type="button"
                            onClick={() => testTriggerAlert(alert.id)}
                            title="Alarm auslösen (Testlauf)"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle On/Off */}
                          <button
                            type="button"
                            onClick={() => toggleAlert(alert.id)}
                            title={alert.isEnabled ? 'Alarm pausieren' : 'Alarm aktivieren'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              alert.isEnabled
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => deleteAlert(alert.id)}
                            title="Alarm löschen"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {matchingAsset && onSelectAsset && (
                        <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Schnellzugriff:</span>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectAsset(matchingAsset);
                            }}
                            className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                          >
                            Asset Detail &amp; Chart anzeigen →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
              {triggeredAlertsCount > 0 ? (
                <button
                  type="button"
                  onClick={clearTriggeredAlerts}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                >
                  Ausgelöste Alarme löschen ({triggeredAlertsCount})
                </button>
              ) : (
                <span className="text-xs text-slate-500 font-mono">
                  Automatische Schwellenwert-Überwachung aktiv
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setNewAlertType('asset');
                  setActiveTab('new');
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(249,191,33,0.2)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Neuer Alarm</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: MARKT-SENTIMENT & REGIME ALARME */}
        {/* ============================================================ */}
        {activeTab === 'sentiment' && (
          <div className="flex-1 flex flex-col min-h-0 mt-3">
            {/* Live Simulation & Quick Trigger Banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-amber-950/50 border border-emerald-500/30 flex items-center justify-between gap-3 flex-wrap mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Sentiment-Regime Überwachung
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-400/15 text-emerald-300">
                      Multi-Faktor
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Alarme koppeln an signifikante Wechsel zwischen Fear &amp; Greed Zonen
                  </p>
                </div>
              </div>

              {/* Simulation button directly fulfilling user request */}
              <button
                type="button"
                onClick={() => simulateSentimentShift('FEAR', 'EXTREME_GREED', 'ALLE')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:brightness-110 text-black font-black text-xs flex items-center gap-1.5 shadow-[0_0_14px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                title="Simuliert sofort den Wechsel von Fear auf Extreme Greed mit akustischem Signal und Banner"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Simuliere: Fear ➔ Extreme Greed</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between pb-3 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === 'all'
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Alle ({sentimentAlerts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('active')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Aktiv ({activeSentimentAlertsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('triggered')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === 'triggered'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Ausgelöst ({triggeredSentimentAlertsCount})
                </button>
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400"
              >
                <option value="ALLE">Alle Sektoren</option>
                <option value="KRYPTO">Krypto</option>
                <option value="AKTIEN">Aktien</option>
                <option value="INDIZIES">Indizes</option>
                <option value="ROHSTOFFE">Rohstoffe</option>
                <option value="FOREX">Forex</option>
              </select>
            </div>

            {/* Sentiment Alerts List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredSentimentAlerts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>Keine Sentiment-Alarme mit den gewählten Filtern vorhanden.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewAlertType('sentiment');
                      setActiveTab('new');
                    }}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Neuen Sentiment-Alarm erstellen</span>
                  </button>
                </div>
              ) : (
                filteredSentimentAlerts.map((sa) => {
                  const targetInfo = sa.targetLevel ? getSentimentLevelInfo(sa.targetLevel) : null;
                  const fromInfo = sa.fromLevel ? getSentimentLevelInfo(sa.fromLevel) : null;

                  return (
                    <div
                      key={sa.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        sa.isTriggered
                          ? 'bg-[#121c2e]/90 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : sa.isEnabled
                          ? 'bg-[#060e22]/90 border-slate-800 hover:border-slate-700'
                          : 'bg-[#040817]/60 border-slate-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                            <Flame className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-white">
                                {sa.title}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {sa.categoryLabel}
                              </span>
                            </div>

                            {/* Visual From -> To Transition Pill */}
                            <div className="flex items-center gap-2 mt-1.5 text-xs flex-wrap">
                              {fromInfo && (
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
                                  style={{
                                    color: fromInfo.color,
                                    backgroundColor: fromInfo.bgColor,
                                    borderColor: fromInfo.borderColor,
                                  }}
                                >
                                  {fromInfo.labelDe}
                                </span>
                              )}
                              {fromInfo && <ArrowRight className="w-3.5 h-3.5 text-amber-400" />}
                              {targetInfo && (
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 shadow-sm"
                                  style={{
                                    color: targetInfo.color,
                                    backgroundColor: targetInfo.bgColor,
                                    borderColor: targetInfo.borderColor,
                                  }}
                                >
                                  <Flame className="w-3 h-3" />
                                  {targetInfo.labelDe}
                                </span>
                              )}
                              {sa.targetScore !== undefined && (
                                <span className="text-[11px] font-mono text-amber-300 font-semibold">
                                  (Score {sa.scoreDirection === 'ABOVE' ? '>' : '<'} {sa.targetScore})
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-300 mt-1">
                              {sa.description}
                            </p>

                            {/* Optional Coupled Asset */}
                            {sa.coupledAssetSymbol && (
                              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                                <span>Gekoppeltes Asset:</span>
                                <span className="font-mono font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                                  {sa.coupledAssetSymbol}
                                </span>
                              </div>
                            )}

                            {sa.note && (
                              <p className="text-[11px] text-amber-200/80 italic mt-1">
                                &ldquo;{sa.note}&rdquo;
                              </p>
                            )}

                            {sa.isTriggered && (
                              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-emerald-300 font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Ausgelöst {sa.triggeredAt || 'vor Kurzem'}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Test Trigger Button */}
                          <button
                            type="button"
                            onClick={() => testTriggerSentimentAlert(sa.id)}
                            title="Sentiment-Alarm testen"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleSentimentAlert(sa.id)}
                            title={sa.isEnabled ? 'Alarm pausieren' : 'Alarm aktivieren'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              sa.isEnabled
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => deleteSentimentAlert(sa.id)}
                            title="Sentiment-Alarm löschen"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
              {triggeredSentimentAlertsCount > 0 ? (
                <button
                  type="button"
                  onClick={clearTriggeredSentimentAlerts}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                >
                  Ausgelöste löschen ({triggeredSentimentAlertsCount})
                </button>
              ) : (
                <span className="text-xs text-slate-500 font-mono">
                  Multi-Faktor Fear &amp; Greed Monitoring aktiv
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setNewAlertType('sentiment');
                  setActiveTab('new');
                }}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.25)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Neuer Sentiment-Alarm</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: NEUER ALARM (DUAL MODE: ASSET VS. SENTIMENT) */}
        {/* ============================================================ */}
        {activeTab === 'new' && (
          <div className="flex-1 flex flex-col min-h-0 mt-3 overflow-y-auto pr-1">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-4 shrink-0">
              <button
                type="button"
                onClick={() => setNewAlertType('asset')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  newAlertType === 'asset'
                    ? 'bg-amber-400 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Asset-Preisalarm (+ Sentiment-Kopplung)</span>
              </button>

              <button
                type="button"
                onClick={() => setNewAlertType('sentiment')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  newAlertType === 'sentiment'
                    ? 'bg-emerald-400 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Markt-Sentiment &amp; Regime-Alarm</span>
              </button>
            </div>

            {formSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 mb-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccessMessage}</span>
              </motion.div>
            )}

            {/* -------------------------------------------------------- */}
            {/* MODE 1: ASSET PREISALARM FORM (WITH SENTIMENT COUPLING) */}
            {/* -------------------------------------------------------- */}
            {newAlertType === 'asset' && (
              <form onSubmit={handleCreateAssetAlert} className="space-y-4">
                {/* Step 1: Asset Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    1. Asset auswählen
                  </label>

                  <div
                    onClick={() => setIsAssetPickerOpen(!isAssetPickerOpen)}
                    className="p-3 rounded-xl bg-[#091129] border border-slate-800 hover:border-amber-500/40 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    {selectedAssetForNew ? (
                      <div className="flex items-center gap-3">
                        <AssetLogo asset={selectedAssetForNew} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {selectedAssetForNew.name}
                            </span>
                            <span className="text-[10px] font-mono bg-amber-400/10 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/20">
                              {selectedAssetForNew.symbol}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            Aktueller Kurs:{' '}
                            <strong className="text-white font-mono">{selectedAssetForNew.value}</strong>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Asset wählen...</span>
                    )}
                    <span className="text-xs text-amber-400 font-semibold">
                      {isAssetPickerOpen ? 'Schließen' : 'Wechseln ▾'}
                    </span>
                  </div>

                  {isAssetPickerOpen && (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#040919] border border-slate-700 max-h-48 overflow-y-auto space-y-1">
                      <input
                        type="text"
                        placeholder="Asset nach Name oder Symbol filtern..."
                        value={assetSearchQuery}
                        onChange={(e) => setAssetSearchQuery(e.target.value)}
                        className="w-full bg-[#080e22] border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 mb-2 focus:outline-none focus:border-amber-400"
                      />
                      {filteredAssetsForPicker.map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => {
                            setSelectedAssetForNew(asset);
                            setIsAssetPickerOpen(false);
                            const parsedNum = parsePriceToNumber(asset.value);
                            const defaultTarget = parsedNum * 1.02;
                            setTargetPriceStr(
                              defaultTarget >= 10
                                ? defaultTarget.toFixed(2)
                                : defaultTarget >= 1
                                ? defaultTarget.toFixed(4)
                                : defaultTarget.toFixed(6)
                            );
                          }}
                          className="p-2 rounded-lg hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <AssetLogo asset={asset} size="xs" />
                            <span className="font-bold">{asset.name}</span>
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1 py-0.2 rounded">
                              {asset.symbol}
                            </span>
                          </div>
                          <span className="font-mono text-slate-200">{asset.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Step 2: Direction & Price Target */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    2. Bedingung &amp; Kursschwelle
                  </label>

                  <div className="grid grid-cols-2 gap-2 mb-2.5">
                    <button
                      type="button"
                      onClick={() => setDirection('ABOVE')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        direction === 'ABOVE'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(68,222,136,0.15)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      <span>Steigt über (≥ Zielkurs)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDirection('BELOW')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        direction === 'BELOW'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(248,113,113,0.15)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ArrowDownRight className="w-4 h-4 text-rose-400" />
                      <span>Fällt unter (≤ Zielkurs)</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="Zielkurs eingeben (z.B. 68000)"
                    value={targetPriceStr}
                    onChange={(e) => setTargetPriceStr(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-xl py-2.5 px-3.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />

                  {/* Quick percentage offsets */}
                  <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                    {[-10, -5, -2, 2, 5, 10].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleApplyPercentage(pct)}
                        className="flex-1 py-1 px-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/40 text-[11px] font-mono font-bold text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        {pct > 0 ? `+${pct}%` : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Sentiment-Kopplung (Multi-Faktor) */}
                <div className="p-3.5 rounded-2xl bg-[#0a1430] border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">
                        An Markt-Sentiment koppeln (Multi-Faktor)
                      </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSentimentCoupled}
                        onChange={(e) => setIsSentimentCoupled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                    </label>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    Verknüpfe diesen Preisalarm direkt mit der Marktstimmung, um Fehlausbrüche
                    herauszufiltern oder Gewinne bei einsetzender Euphorie/Panik gezielt abzusichern.
                  </p>

                  {isSentimentCoupled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2.5 pt-2 border-t border-slate-800"
                    >
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Erforderliche Sentiment-Bedingung:
                        </label>
                        <select
                          value={coupledSentimentLevel}
                          onChange={(e) => setCoupledSentimentLevel(e.target.value as SentimentLevel)}
                          className="w-full bg-[#030712] border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                        >
                          <option value="EXTREME_GREED">🔥 Extreme Gier (&gt; 75) – Bei maximaler Markteuphorie</option>
                          <option value="GREED">🟢 Gier (&gt; 55) – Bullisches Grundregime</option>
                          <option value="NEUTRAL">🟡 Neutral (45–55) – Ausgeglichene Phase</option>
                          <option value="FEAR">🟠 Angst (&lt; 45) – Bei einsetzender Marktschwäche</option>
                          <option value="EXTREME_FEAR">🔴 Extreme Angst (&lt; 25) – Antizyklischer Panik-Dip</option>
                        </select>
                      </div>

                      <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={autoNotifyOnSentimentShift}
                          onChange={(e) => setAutoNotifyOnSentimentShift(e.target.checked)}
                          className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                        />
                        <span>
                          Auch sofort benachrichtigen, wenn das Markt-Sentiment auf diese Stufe wechselt
                        </span>
                      </label>
                    </motion.div>
                  )}
                </div>

                {/* Step 4: Optional Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Notiz / Trading-Plan (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. Gewinnmitnahme bei Euphorie, Trailing-Stop nachziehen..."
                    value={noteStr}
                    onChange={(e) => setNoteStr(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(249,191,33,0.3)] transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Preis-Alarm aktivieren</span>
                  </button>
                </div>
              </form>
            )}

            {/* -------------------------------------------------------- */}
            {/* MODE 2: REINER MARKT-SENTIMENT-ALARM FORM */}
            {/* -------------------------------------------------------- */}
            {newAlertType === 'sentiment' && (
              <form onSubmit={handleCreateSentimentAlert} className="space-y-4">
                {/* Sector selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    1. Marktsektor für Sentiment-Überwachung
                  </label>
                  <select
                    value={sentimentCategory}
                    onChange={(e) => setSentimentCategory(e.target.value as 'ALLE' | MainCategory)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="ALLE">🌍 Gesamtmarkt (Multi-Asset Fear &amp; Greed)</option>
                    <option value="KRYPTO">⚡ Krypto-Markt (BTC, ETH, Altcoins)</option>
                    <option value="AKTIEN">📈 Aktienmarkt (Tech, Big Caps)</option>
                    <option value="INDIZIES">🏛️ Leitindizes (S&amp;P 500, DAX 40, NASDAQ)</option>
                    <option value="ROHSTOFFE">🪙 Rohstoffe (Gold, Silber, Rohöl)</option>
                    <option value="FOREX">💱 Devisenmarkt (Major Pairs)</option>
                  </select>
                </div>

                {/* Condition Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    2. Art des Sentiment-Auslösers
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setSentimentConditionType('TRANSITION_FROM_TO')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        sentimentConditionType === 'TRANSITION_FROM_TO'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-extrabold flex items-center gap-1 mb-1">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Regime-Wechsel</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        z.B. Wechsel von Fear auf Extreme Greed
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSentimentConditionType('TRANSITION_TO')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        sentimentConditionType === 'TRANSITION_TO'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-extrabold flex items-center gap-1 mb-1">
                        <Flame className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ziel-Stimmung</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Erreichen einer konkreten Zone
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSentimentConditionType('SCORE_ABOVE')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        sentimentConditionType === 'SCORE_ABOVE' || sentimentConditionType === 'SCORE_BELOW'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-extrabold flex items-center gap-1 mb-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Score-Schwelle</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Index über/unter Zahlenwert
                      </span>
                    </button>
                  </div>

                  {/* If transition from -> to */}
                  {sentimentConditionType === 'TRANSITION_FROM_TO' && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Ausgangs-Stimmung (From):
                          </label>
                          <select
                            value={sentimentFromLevel}
                            onChange={(e) => setSentimentFromLevel(e.target.value as SentimentLevel)}
                            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2 text-xs text-white"
                          >
                            <option value="FEAR">Angst (Fear, &lt; 45)</option>
                            <option value="EXTREME_FEAR">Extreme Angst (&lt; 25)</option>
                            <option value="NEUTRAL">Neutral (45–55)</option>
                            <option value="GREED">Gier (Greed, &gt; 55)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Ziel-Stimmung (To):
                          </label>
                          <select
                            value={sentimentTargetLevel}
                            onChange={(e) => setSentimentTargetLevel(e.target.value as SentimentLevel)}
                            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2 text-xs text-white"
                          >
                            <option value="EXTREME_GREED">🔥 Extreme Gier (Extreme Greed, &gt; 75)</option>
                            <option value="GREED">🟢 Gier (Greed, &gt; 55)</option>
                            <option value="EXTREME_FEAR">🔴 Extreme Angst (Panic, &lt; 25)</option>
                            <option value="FEAR">🟠 Angst (Fear, &lt; 45)</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-[11px] text-emerald-300 font-mono flex items-center gap-1.5 pt-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          Auslöser: Alarm wird aktiviert, sobald das Sentiment von {getSentimentLevelInfo(sentimentFromLevel).labelDe} auf {getSentimentLevelInfo(sentimentTargetLevel).labelDe} springt.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* If transition to */}
                  {sentimentConditionType === 'TRANSITION_TO' && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Ziel-Zone für Benachrichtigung:
                      </label>
                      <select
                        value={sentimentTargetLevel}
                        onChange={(e) => setSentimentTargetLevel(e.target.value as SentimentLevel)}
                        className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="EXTREME_GREED">🔥 Extreme Gier (&gt; 75 Score)</option>
                        <option value="GREED">🟢 Gier (&gt; 55 Score)</option>
                        <option value="EXTREME_FEAR">🔴 Extreme Angst (&lt; 25 Score) – Contrarian Einstieg</option>
                        <option value="FEAR">🟠 Angst (&lt; 45 Score)</option>
                      </select>
                    </div>
                  )}

                  {/* If score threshold */}
                  {(sentimentConditionType === 'SCORE_ABOVE' || sentimentConditionType === 'SCORE_BELOW') && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">
                          Richtung:
                        </label>
                        <select
                          value={sentimentScoreDirection}
                          onChange={(e) => {
                            const val = e.target.value as 'ABOVE' | 'BELOW';
                            setSentimentScoreDirection(val);
                            setSentimentConditionType(val === 'ABOVE' ? 'SCORE_ABOVE' : 'SCORE_BELOW');
                          }}
                          className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2 text-xs text-white"
                        >
                          <option value="ABOVE">Steigt über (&gt;)</option>
                          <option value="BELOW">Fällt unter (&lt;)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">
                          Score-Schwellenwert (0–100):
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={sentimentTargetScore}
                          onChange={(e) => setSentimentTargetScore(parseInt(e.target.value, 10) || 50)}
                          className="w-full bg-[#030712] border border-slate-700 rounded-lg p-2 text-xs font-mono text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Coupled Asset Ticker */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    3. Optional: Referenz-Asset koppeln
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. BTC, NVDA, AAPL, XAU/USD..."
                    value={sentimentCoupledAssetSymbol}
                    onChange={(e) => setSentimentCoupledAssetSymbol(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 uppercase font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Verbindet den Sentiment-Trigger mit einem spezifischen Leitwert für gemeinsame Benachrichtigungen.
                  </p>
                </div>

                {/* Strategy Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Notiz / Handlungsanweisung (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. Risikopositionen um 20% reduzieren, Cash-Quote erhöhen..."
                    value={sentimentNote}
                    onChange={(e) => setSentimentNote(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Sentiment-Alarm scharf schalten</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PREFERENCES */}
        {/* ============================================================ */}
        {activeTab === 'settings' && (
          <div className="flex-1 flex flex-col min-h-0 mt-3 overflow-y-auto pr-1 space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Benachrichtigungs-Kanäle</span>
              </h4>

              {/* In-App Toast Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div>
                  <span className="font-bold text-slate-200 block">In-App Banner &amp; Toasts</span>
                  <span className="text-[11px] text-slate-400">
                    Echtzeit-Popup oben rechts bei Kurs- und Sentiment-Auslösern
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.inAppNotifications}
                  onChange={(e) => updatePreferences({ inAppNotifications: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div>
                  <span className="font-bold text-slate-200 block">Akustisches Chime-Signal</span>
                  <span className="text-[11px] text-slate-400">
                    Kristallklares Audiosignal über Web Audio API bei jedem Trigger
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.soundEnabled}
                  onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Sentiment Alerts Enabled */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div>
                  <span className="font-bold text-slate-200 block">Sentiment &amp; Regime Push</span>
                  <span className="text-[11px] text-slate-400">
                    Signifikante Wechsel (z.B. Fear ➔ Extreme Greed) aktiv überwachen
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.sentimentAlertsEnabled ?? true}
                  onChange={(e) => updatePreferences({ sentimentAlertsEnabled: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Push Simulation */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="font-bold text-slate-200 block">Hintergrund-Prüfintervall</span>
                  <span className="text-[11px] text-slate-400">
                    Frequenz der automatischen Schwellenwert-Validierung
                  </span>
                </div>
                <select
                  value={preferences.autoCheckIntervalSec}
                  onChange={(e) =>
                    updatePreferences({ autoCheckIntervalSec: parseInt(e.target.value, 10) })
                  }
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs"
                >
                  <option value="5">Alle 5 Sekunden</option>
                  <option value="10">Alle 10 Sekunden (Empfohlen)</option>
                  <option value="30">Alle 30 Sekunden</option>
                  <option value="60">Jede Minute</option>
                </select>
              </div>
            </div>

            {/* Telegram Bot Integration Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0a1538] to-[#040818] border border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Telegram Push Bot (@CapitalAI_WhaleBot)</h5>
                    <span className="text-[10px] text-slate-400">Direkte Push-Nachrichten für Preisalarme, Wal-Transaktionen &amp; Sentiment</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => updateTelegramConfig({ enabled: !preferences.telegram?.enabled })}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    preferences.telegram?.enabled ? 'bg-blue-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black transition-transform ${
                      preferences.telegram?.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                  <span className={`w-2 h-2 rounded-full ${preferences.telegram?.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{preferences.telegram?.connected ? 'Mit Telegram verbunden' : 'Bereit zur Kopplung'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await testTelegramPush();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Test-Push senden
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openWhaleRadar();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-400 text-black text-[10px] font-black cursor-pointer shadow-sm flex items-center gap-1"
                  >
                    <Radio className="w-3 h-3" />
                    <span>Whale Radar Hub →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Reset Defaults */}
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-300 block">Auf Werkszustand zurücksetzen</span>
                <span className="text-[11px] text-slate-400">
                  Stellt alle Standard-Alarme und Grundeinstellungen wieder her
                </span>
              </div>
              <button
                type="button"
                onClick={resetToDefaults}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Zurücksetzen</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
