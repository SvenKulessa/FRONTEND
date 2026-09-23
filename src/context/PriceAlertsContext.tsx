import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  PriceAlert,
  UserAlertPreferences,
  MainCategory,
  MarketAsset,
  SentimentAlert,
  SentimentLevel,
  SentimentConditionType,
  PriceAlertSentimentCoupling,
  AlertToastData,
} from '../types';
import {
  DEFAULT_ALERT_PREFERENCES,
  INITIAL_PRICE_ALERTS,
  INITIAL_SENTIMENT_ALERTS,
  parsePriceToNumber,
  formatCurrencyPrice,
  playAlertChime,
  getSentimentLevelInfo,
} from '../utils/priceAlerts';
import { MARKET_ASSETS } from '../data/mockData';

export interface AddAlertPayload {
  assetId: string;
  assetSymbol: string;
  assetName: string;
  assetCategory: MainCategory;
  targetPrice: number;
  initialPrice: number;
  direction: 'ABOVE' | 'BELOW';
  note?: string;
  formattedTarget?: string;
  sentimentCoupling?: PriceAlertSentimentCoupling;
}

export interface AddSentimentAlertPayload {
  category: 'ALLE' | MainCategory;
  categoryLabel: string;
  conditionType: SentimentConditionType;
  targetLevel?: SentimentLevel;
  fromLevel?: SentimentLevel;
  targetScore?: number;
  scoreDirection?: 'ABOVE' | 'BELOW';
  coupledAssetSymbol?: string;
  coupledAssetName?: string;
  note?: string;
  title?: string;
  description?: string;
}

interface PriceAlertsContextType {
  // Asset alerts
  alerts: PriceAlert[];
  addAlert: (payload: AddAlertPayload) => PriceAlert;
  updateAlert: (id: string, updates: Partial<PriceAlert>) => void;
  deleteAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  testTriggerAlert: (id: string) => void;
  clearTriggeredAlerts: () => void;
  activeAlertsCount: number;
  triggeredAlertsCount: number;

  // Sentiment alerts & coupling
  sentimentAlerts: SentimentAlert[];
  addSentimentAlert: (payload: AddSentimentAlertPayload) => SentimentAlert;
  updateSentimentAlert: (id: string, updates: Partial<SentimentAlert>) => void;
  deleteSentimentAlert: (id: string) => void;
  toggleSentimentAlert: (id: string) => void;
  testTriggerSentimentAlert: (id: string) => void;
  clearTriggeredSentimentAlerts: () => void;
  simulateSentimentShift: (
    from: SentimentLevel,
    to: SentimentLevel,
    category?: 'ALLE' | MainCategory
  ) => void;
  activeSentimentAlertsCount: number;
  triggeredSentimentAlertsCount: number;

  // User preferences
  preferences: UserAlertPreferences;
  updatePreferences: (updates: Partial<UserAlertPreferences>) => void;
  resetToDefaults: () => void;

  // Toast
  activeToast: AlertToastData | null;
  dismissToast: () => void;

  // Modals & Navigation
  isAlertModalOpen: boolean;
  setIsAlertModalOpen: (open: boolean) => void;
  openAlertModalWithAsset: (asset: MarketAsset) => void;
  openAlertModalWithSentiment: (category?: 'ALLE' | MainCategory) => void;
  preselectedAssetForNewAlert: MarketAsset | null;
  setPreselectedAssetForNewAlert: (asset: MarketAsset | null) => void;
  preselectedCategoryForSentiment: ('ALLE' | MainCategory) | null;
  setPreselectedCategoryForSentiment: (cat: ('ALLE' | MainCategory) | null) => void;
  getAlertsForAsset: (symbol: string) => PriceAlert[];
}

const PriceAlertsContext = createContext<PriceAlertsContextType | undefined>(undefined);

const STORAGE_ALERTS_KEY = 'capital_ai_price_alerts_v2';
const STORAGE_SENTIMENT_ALERTS_KEY = 'capital_ai_sentiment_alerts_v2';
const STORAGE_PREFS_KEY = 'capital_ai_alert_prefs_v2';

export const PriceAlertsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load asset price alerts
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALERTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRICE_ALERTS;
  });

  // Load market sentiment alerts
  const [sentimentAlerts, setSentimentAlerts] = useState<SentimentAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SENTIMENT_ALERTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_SENTIMENT_ALERTS;
  });

  // Load preferences
  const [preferences, setPreferences] = useState<UserAlertPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFS_KEY);
      if (saved) {
        return { ...DEFAULT_ALERT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return { ...DEFAULT_ALERT_PREFERENCES, sentimentAlertsEnabled: true };
  });

  const [activeToast, setActiveToast] = useState<AlertToastData | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [preselectedAssetForNewAlert, setPreselectedAssetForNewAlert] = useState<MarketAsset | null>(null);
  const [preselectedCategoryForSentiment, setPreselectedCategoryForSentiment] = useState<('ALLE' | MainCategory) | null>(null);

  // Sync alerts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ALERTS_KEY, JSON.stringify(alerts));
    } catch {
      // Ignore
    }
  }, [alerts]);

  // Sync sentiment alerts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SENTIMENT_ALERTS_KEY, JSON.stringify(sentimentAlerts));
    } catch {
      // Ignore
    }
  }, [sentimentAlerts]);

  // Sync preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(preferences));
    } catch {
      // Ignore
    }
  }, [preferences]);

  // Dismiss toast handler
  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<UserAlertPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  // Trigger asset alert notification
  const triggerNotification = useCallback(
    (alert: PriceAlert) => {
      if (preferences.soundEnabled) {
        playAlertChime();
      }
      if (preferences.inAppNotifications) {
        setActiveToast({
          type: 'PRICE',
          alert,
        });
      }
    },
    [preferences.soundEnabled, preferences.inAppNotifications]
  );

  // Trigger sentiment alert notification
  const triggerSentimentNotification = useCallback(
    (sentimentAlert: SentimentAlert) => {
      if (preferences.soundEnabled) {
        playAlertChime();
      }
      if (preferences.inAppNotifications) {
        setActiveToast({
          type: 'SENTIMENT',
          sentimentAlert,
        });
      }
    },
    [preferences.soundEnabled, preferences.inAppNotifications]
  );

  // Add new asset price alert
  const addAlert = useCallback(
    (payload: AddAlertPayload): PriceAlert => {
      const assetFound = MARKET_ASSETS.find(
        (a) => a.id === payload.assetId || a.symbol === payload.assetSymbol
      );
      const rawVal = assetFound ? assetFound.value : '$';
      const formattedTarget = payload.formattedTarget || formatCurrencyPrice(payload.targetPrice, rawVal);

      const newAlert: PriceAlert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        assetId: payload.assetId,
        assetSymbol: payload.assetSymbol,
        assetName: payload.assetName,
        assetCategory: payload.assetCategory,
        targetPrice: payload.targetPrice,
        initialPrice: payload.initialPrice,
        currentPrice: payload.initialPrice,
        direction: payload.direction,
        note: payload.note || '',
        isEnabled: true,
        isTriggered: false,
        createdAt: new Date().toISOString(),
        formattedTarget,
        sentimentCoupling: payload.sentimentCoupling,
      };

      setAlerts((prev) => [newAlert, ...prev]);

      if (preferences.soundEnabled) {
        playAlertChime();
      }

      return newAlert;
    },
    [preferences.soundEnabled]
  );

  // Update asset alert
  const updateAlert = useCallback((id: string, updates: Partial<PriceAlert>) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, ...updates } : alert))
    );
  }, []);

  // Delete asset alert
  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    setActiveToast((current) =>
      current && current.type === 'PRICE' && current.alert.id === id ? null : current
    );
  }, []);

  // Toggle asset alert on/off
  const toggleAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          const nextState = !alert.isEnabled;
          return {
            ...alert,
            isEnabled: nextState,
            isTriggered: nextState ? false : alert.isTriggered,
          };
        }
        return alert;
      })
    );
  }, []);

  // Test trigger asset alert
  const testTriggerAlert = useCallback(
    (id: string) => {
      setAlerts((prev) =>
        prev.map((alert) => {
          if (alert.id === id) {
            const triggered: PriceAlert = {
              ...alert,
              isTriggered: true,
              isEnabled: false,
              triggeredAt: 'Gerade eben',
            };
            triggerNotification(triggered);
            return triggered;
          }
          return alert;
        })
      );
    },
    [triggerNotification]
  );

  // Clear all triggered asset alerts
  const clearTriggeredAlerts = useCallback(() => {
    setAlerts((prev) => prev.filter((a) => !a.isTriggered));
  }, []);

  // -------------------------------------------------------------
  // SENTIMENT ALERTS METHODS
  // -------------------------------------------------------------

  // Add new sentiment alert
  const addSentimentAlert = useCallback(
    (payload: AddSentimentAlertPayload): SentimentAlert => {
      const fromInfo = payload.fromLevel ? getSentimentLevelInfo(payload.fromLevel).labelDe : '';
      const targetInfo = payload.targetLevel ? getSentimentLevelInfo(payload.targetLevel).labelDe : '';

      let defaultTitle = payload.title;
      let defaultDesc = payload.description;

      if (!defaultTitle) {
        if (payload.conditionType === 'TRANSITION_FROM_TO') {
          defaultTitle = `${payload.categoryLabel}: Wechsel von ${fromInfo} auf ${targetInfo}`;
        } else if (payload.conditionType === 'TRANSITION_TO') {
          defaultTitle = `${payload.categoryLabel}: Erreichen von "${targetInfo}"`;
        } else if (payload.conditionType === 'REGIME_CHANGE') {
          defaultTitle = `${payload.categoryLabel}: Stimmungs- & Regimewechsel`;
        } else {
          defaultTitle = `${payload.categoryLabel}: Sentiment Score ${payload.scoreDirection === 'ABOVE' ? '>' : '<'} ${payload.targetScore}`;
        }
      }

      if (!defaultDesc) {
        if (payload.conditionType === 'TRANSITION_FROM_TO') {
          defaultDesc = `Alarmierung beim signifikanten Wechsel von ${fromInfo} direkt auf ${targetInfo}.`;
        } else {
          defaultDesc = `Multi-Faktor Überwachung für ${payload.categoryLabel}.`;
        }
      }

      const newSentimentAlert: SentimentAlert = {
        id: `sent-alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'SENTIMENT',
        category: payload.category,
        categoryLabel: payload.categoryLabel,
        conditionType: payload.conditionType,
        targetLevel: payload.targetLevel,
        fromLevel: payload.fromLevel,
        targetScore: payload.targetScore,
        scoreDirection: payload.scoreDirection,
        coupledAssetSymbol: payload.coupledAssetSymbol,
        coupledAssetName: payload.coupledAssetName,
        note: payload.note || '',
        isEnabled: true,
        isTriggered: false,
        createdAt: new Date().toISOString(),
        title: defaultTitle,
        description: defaultDesc,
      };

      setSentimentAlerts((prev) => [newSentimentAlert, ...prev]);

      if (preferences.soundEnabled) {
        playAlertChime();
      }

      return newSentimentAlert;
    },
    [preferences.soundEnabled]
  );

  // Update sentiment alert
  const updateSentimentAlert = useCallback((id: string, updates: Partial<SentimentAlert>) => {
    setSentimentAlerts((prev) =>
      prev.map((sa) => (sa.id === id ? { ...sa, ...updates } : sa))
    );
  }, []);

  // Delete sentiment alert
  const deleteSentimentAlert = useCallback((id: string) => {
    setSentimentAlerts((prev) => prev.filter((sa) => sa.id !== id));
    setActiveToast((current) =>
      current && current.type === 'SENTIMENT' && current.sentimentAlert.id === id ? null : current
    );
  }, []);

  // Toggle sentiment alert
  const toggleSentimentAlert = useCallback((id: string) => {
    setSentimentAlerts((prev) =>
      prev.map((sa) => {
        if (sa.id === id) {
          const nextState = !sa.isEnabled;
          return {
            ...sa,
            isEnabled: nextState,
            isTriggered: nextState ? false : sa.isTriggered,
          };
        }
        return sa;
      })
    );
  }, []);

  // Test trigger sentiment alert
  const testTriggerSentimentAlert = useCallback(
    (id: string) => {
      setSentimentAlerts((prev) =>
        prev.map((sa) => {
          if (sa.id === id) {
            const triggered: SentimentAlert = {
              ...sa,
              isTriggered: true,
              isEnabled: false,
              triggeredAt: 'Gerade eben',
              triggerDetail: 'Simulierter Übergang von FEAR (38) auf EXTREME GREED (78) ausgeführt',
            };
            triggerSentimentNotification(triggered);
            return triggered;
          }
          return sa;
        })
      );
    },
    [triggerSentimentNotification]
  );

  // Simulate Sentiment Shift (e.g., Fear -> Extreme Greed)
  const simulateSentimentShift = useCallback(
    (from: SentimentLevel, to: SentimentLevel, category: 'ALLE' | MainCategory = 'ALLE') => {
      const fromLabel = getSentimentLevelInfo(from).labelDe;
      const toLabel = getSentimentLevelInfo(to).labelDe;
      const catLabel =
        category === 'ALLE'
          ? 'Gesamtmarkt'
          : category === 'KRYPTO'
          ? 'Kryptomarkt'
          : category === 'AKTIEN'
          ? 'Aktienmarkt'
          : category === 'INDIZIES'
          ? 'Leitindizes'
          : category === 'ROHSTOFFE'
          ? 'Rohstoffmärkte'
          : 'Devisenmarkt';

      // Find matching alert or create triggered alert instance
      const matchedAlert = sentimentAlerts.find(
        (sa) =>
          sa.isEnabled &&
          (sa.category === category || sa.category === 'ALLE') &&
          ((sa.conditionType === 'TRANSITION_FROM_TO' && sa.targetLevel === to) ||
            (sa.conditionType === 'TRANSITION_TO' && sa.targetLevel === to) ||
            sa.conditionType === 'REGIME_CHANGE')
      );

      const triggeredAlert: SentimentAlert = matchedAlert
        ? {
            ...matchedAlert,
            isTriggered: true,
            isEnabled: false,
            triggeredAt: 'Gerade eben',
            triggerDetail: `Stimmungswechsel erkannt: ${catLabel} wechselte von "${fromLabel}" auf "${toLabel}".`,
          }
        : {
            id: `sim-sentiment-${Date.now()}`,
            type: 'SENTIMENT',
            category,
            categoryLabel: catLabel,
            conditionType: 'TRANSITION_FROM_TO',
            fromLevel: from,
            targetLevel: to,
            isEnabled: false,
            isTriggered: true,
            triggeredAt: 'Gerade eben',
            createdAt: new Date().toISOString(),
            title: `${catLabel}: Wechsel von ${fromLabel} auf ${toLabel}`,
            description: `Signifikanter Stimmungs- und Regimesprung registriert (Score-Sprung in die ${toLabel}-Zone).`,
            triggerDetail: `Stimmungswechsel erkannt: ${catLabel} wechselte von "${fromLabel}" (Score ~38) auf "${toLabel}" (Score ~78).`,
            note: 'Antizyklisches Rebalancing & Gewinnmitnahmen prüfen',
          };

      // Also trigger any coupled asset price alerts if relevant
      setAlerts((prev) =>
        prev.map((pa) => {
          if (
            pa.isEnabled &&
            !pa.isTriggered &&
            pa.sentimentCoupling?.enabled &&
            pa.sentimentCoupling.triggerOnSentimentShift &&
            (pa.sentimentCoupling.requiredSentiment === to ||
              (to === 'EXTREME_GREED' && pa.sentimentCoupling.requiredSentiment === 'ANY_GREED') ||
              (to === 'EXTREME_FEAR' && pa.sentimentCoupling.requiredSentiment === 'ANY_FEAR'))
          ) {
            return {
              ...pa,
              isTriggered: true,
              isEnabled: false,
              triggeredAt: 'Gerade eben (via Sentiment)',
            };
          }
          return pa;
        })
      );

      if (matchedAlert) {
        setSentimentAlerts((prev) =>
          prev.map((sa) => (sa.id === matchedAlert.id ? triggeredAlert : sa))
        );
      } else {
        setSentimentAlerts((prev) => [triggeredAlert, ...prev]);
      }

      triggerSentimentNotification(triggeredAlert);
    },
    [sentimentAlerts, triggerSentimentNotification]
  );

  // Clear triggered sentiment alerts
  const clearTriggeredSentimentAlerts = useCallback(() => {
    setSentimentAlerts((prev) => prev.filter((sa) => !sa.isTriggered));
  }, []);

  // Reset all to defaults
  const resetToDefaults = useCallback(() => {
    setAlerts(INITIAL_PRICE_ALERTS);
    setSentimentAlerts(INITIAL_SENTIMENT_ALERTS);
    setPreferences(DEFAULT_ALERT_PREFERENCES);
  }, []);

  // Get alerts for asset
  const getAlertsForAsset = useCallback(
    (symbol: string) => {
      const s = symbol.toLowerCase().trim();
      return alerts.filter((a) => a.assetSymbol.toLowerCase().trim() === s);
    },
    [alerts]
  );

  // Navigation helpers
  const openAlertModalWithAsset = useCallback((asset: MarketAsset) => {
    setPreselectedAssetForNewAlert(asset);
    setIsAlertModalOpen(true);
  }, []);

  const openAlertModalWithSentiment = useCallback((category: ('ALLE' | MainCategory) = 'ALLE') => {
    setPreselectedCategoryForSentiment(category);
    setIsAlertModalOpen(true);
  }, []);

  // Counts
  const activeAlertsCount = alerts.filter((a) => a.isEnabled && !a.isTriggered).length;
  const triggeredAlertsCount = alerts.filter((a) => a.isTriggered).length;

  const activeSentimentAlertsCount = sentimentAlerts.filter(
    (sa) => sa.isEnabled && !sa.isTriggered
  ).length;
  const triggeredSentimentAlertsCount = sentimentAlerts.filter((sa) => sa.isTriggered).length;

  // Background price check engine simulating live market checks against thresholds
  useEffect(() => {
    const intervalSec = Math.max(preferences.autoCheckIntervalSec || 10, 5);
    const timer = setInterval(() => {
      setAlerts((prevAlerts) => {
        let hasChanges = false;
        const updated = prevAlerts.map((alert) => {
          if (!alert.isEnabled || alert.isTriggered) return alert;

          const asset = MARKET_ASSETS.find(
            (a) =>
              a.id === alert.assetId ||
              a.symbol.toUpperCase() === alert.assetSymbol.toUpperCase()
          );

          if (!asset) return alert;

          const currentNum = parsePriceToNumber(asset.value);
          const thresholdNum = alert.targetPrice;

          const isConditionMet =
            (alert.direction === 'ABOVE' && currentNum >= thresholdNum) ||
            (alert.direction === 'BELOW' && currentNum <= thresholdNum);

          if (isConditionMet) {
            hasChanges = true;
            const triggered: PriceAlert = {
              ...alert,
              currentPrice: currentNum,
              isTriggered: true,
              isEnabled: false,
              triggeredAt: 'Gerade eben',
            };
            triggerNotification(triggered);
            return triggered;
          }

          if (currentNum !== alert.currentPrice) {
            return { ...alert, currentPrice: currentNum };
          }

          return alert;
        });

        return hasChanges ? updated : prevAlerts;
      });
    }, intervalSec * 1000);

    return () => clearInterval(timer);
  }, [preferences.autoCheckIntervalSec, triggerNotification]);

  return (
    <PriceAlertsContext.Provider
      value={{
        alerts,
        addAlert,
        updateAlert,
        deleteAlert,
        toggleAlert,
        testTriggerAlert,
        clearTriggeredAlerts,
        activeAlertsCount,
        triggeredAlertsCount,

        sentimentAlerts,
        addSentimentAlert,
        updateSentimentAlert,
        deleteSentimentAlert,
        toggleSentimentAlert,
        testTriggerSentimentAlert,
        clearTriggeredSentimentAlerts,
        simulateSentimentShift,
        activeSentimentAlertsCount,
        triggeredSentimentAlertsCount,

        preferences,
        updatePreferences,
        resetToDefaults,

        activeToast,
        dismissToast,

        isAlertModalOpen,
        setIsAlertModalOpen,
        openAlertModalWithAsset,
        openAlertModalWithSentiment,
        preselectedAssetForNewAlert,
        setPreselectedAssetForNewAlert,
        preselectedCategoryForSentiment,
        setPreselectedCategoryForSentiment,
        getAlertsForAsset,
      }}
    >
      {children}
    </PriceAlertsContext.Provider>
  );
};

export const usePriceAlerts = (): PriceAlertsContextType => {
  const context = useContext(PriceAlertsContext);
  if (!context) {
    throw new Error('usePriceAlerts must be used within a PriceAlertsProvider');
  }
  return context;
};
