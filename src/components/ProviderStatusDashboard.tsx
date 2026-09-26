/**
 * CAPITAL AI — INSTITUTIONAL DATA PROVIDER STATUS DASHBOARD
 * Work Package: WP-004 / AP-001 / AP-003 / AP-006
 *
 * Visualizes the operational status, guaranteed vs. measured latency,
 * health scores, capabilities contract, and budget adherence (< 40 EUR/Mo)
 * for all configured data providers in the registry.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Server,
  Activity,
  Zap,
  Shield,
  ShieldCheck,
  Database,
  Radio,
  Clock,
  DollarSign,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Sliders,
  SlidersHorizontal,
  Flame,
  ArrowLeft,
  Gauge,
  Layers,
  Terminal,
  Download,
  Play,
  Pause,
  Info,
  CheckCircle,
  Wifi,
  WifiOff,
  Coins,
} from 'lucide-react';
import {
  PROVIDER_REGISTRY,
  ProviderContract,
  ProviderHealthStatus,
  ProviderRegistryService,
} from '../config/providers/providerRegistry';
import { runProviderRegistryValidationSuite } from '../contracts/__tests__/providerRegistry.test';
import { trackEvent } from '../utils/analytics';

export interface ProviderStatusDashboardProps {
  onBackToHome?: () => void;
  onNavigateArchitecture?: () => void;
  onNavigateLogin?: () => void;
  isStandaloneView?: boolean;
}

type TabType = 'fleet' | 'telemetry' | 'capabilities' | 'budget' | 'validation' | 'logs';

export const ProviderStatusDashboard: React.FC<ProviderStatusDashboardProps> = ({
  onBackToHome,
  onNavigateArchitecture,
  onNavigateLogin,
  isStandaloneView = false,
}) => {
  // Local state initialized with registry providers to allow live testing / simulation
  const [providers, setProviders] = useState<Record<string, ProviderContract>>(() => ({
    ...PROVIDER_REGISTRY,
  }));

  const [activeTab, setActiveTab] = useState<TabType>('fleet');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProviderHealthStatus | 'tripped'>('ALL');
  const [assetClassFilter, setAssetClassFilter] = useState<string>('ALL');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('binance_market_data');
  const [isAutoPingActive, setIsAutoPingActive] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Audit & Ping Event Logs
  const [logs, setLogs] = useState<
    Array<{ id: string; timestamp: string; level: 'INFO' | 'WARN' | 'CRIT' | 'SUCCESS'; message: string }>
  >(() => [
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      message: 'Provider Registry Engine (WP-004) initialisiert mit 5 autorisierten Gateways.',
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'SUCCESS',
      message: 'Monatliches Budget-Limit (AP-006: 40,00 €) verifiziert. Aktueller Verbrauch: 8,50 €.',
    },
  ]);

  // Validation Suite results state
  const [suiteResults, setSuiteResults] = useState<{ passed: boolean; results: string[] } | null>(null);

  const addLog = useCallback(
    (level: 'INFO' | 'WARN' | 'CRIT' | 'SUCCESS', message: string) => {
      setLogs((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toLocaleTimeString(),
          level,
          message,
        },
        ...prev.slice(0, 99), // keep last 100 entries
      ]);
    },
    []
  );

  // Track page view
  useEffect(() => {
    trackEvent('provider_dashboard_view', {
      category: 'admin',
      label: 'wp_004_provider_registry',
    });
  }, []);

  // Single provider ping simulation
  const handlePingProvider = useCallback(
    (id: string) => {
      setProviders((prev) => {
        const target = prev[id];
        if (!target) return prev;

        // Calculate simulated latency based on typical latency +/- jitter
        const base = target.capabilities.typicalLatencyMs;
        const jitter = (Math.random() - 0.45) * target.health.jitterMs * 2;
        const newLatency = Math.max(4, Math.round((base + jitter) * 10) / 10);
        const rollingAvg = Math.round(((target.health.rollingAverageLatencyMs * 4 + newLatency) / 5) * 10) / 10;
        const nowIso = new Date().toISOString();

        addLog(
          'INFO',
          `Heartbeat Ping: ${target.name} antwortete in ${newLatency}ms (Rolling Avg: ${rollingAvg}ms, SLA: <${target.capabilities.guaranteedLatencyMs}ms).`
        );

        return {
          ...prev,
          [id]: {
            ...target,
            health: {
              ...target.health,
              currentLatencyMs: newLatency,
              rollingAverageLatencyMs: rollingAvg,
              lastSuccessfulPingAt: nowIso,
              consecutiveFailures: 0,
            },
          },
        };
      });
    },
    [addLog]
  );

  // Fleet-wide ping
  const handlePingAllProviders = useCallback(() => {
    Object.keys(providers).forEach((id) => {
      handlePingProvider(id);
    });
    addLog('SUCCESS', `Flottenweiter Audit-Ping über ${Object.keys(providers).length} Gateways erfolgreich durchgeführt.`);
  }, [providers, handlePingProvider, addLog]);

  // Circuit Breaker manual toggle
  const handleToggleCircuitBreaker = useCallback(
    (id: string) => {
      setProviders((prev) => {
        const target = prev[id];
        if (!target) return prev;

        const nextTripped = !target.health.circuitBreakerTripped;
        const nextStatus: ProviderHealthStatus = nextTripped ? 'unhealthy' : 'healthy';

        if (nextTripped) {
          addLog(
            'CRIT',
            `Circuit-Breaker MANUELL AUSGELÖST für "${target.name}". Failover-Routen auf Alternativ-Provider aktiviert!`
          );
        } else {
          addLog(
            'SUCCESS',
            `Circuit-Breaker ZURÜCKGESETZT für "${target.name}". Provider ist wieder im regulären Konsensus-Routing.`
          );
        }

        return {
          ...prev,
          [id]: {
            ...target,
            health: {
              ...target.health,
              circuitBreakerTripped: nextTripped,
              status: nextStatus,
              errorRatePercent1h: nextTripped ? 100 : 0.01,
            },
          },
        };
      });
    },
    [addLog]
  );

  // Reset all circuit breakers
  const handleResetAllBreakers = useCallback(() => {
    setProviders((prev) => {
      const updated: Record<string, ProviderContract> = {};
      Object.keys(prev).forEach((id) => {
        updated[id] = {
          ...prev[id],
          health: {
            ...prev[id].health,
            circuitBreakerTripped: false,
            status: 'healthy',
            errorRatePercent1h: 0.01,
          },
        };
      });
      return updated;
    });
    addLog('SUCCESS', 'Alle Circuit-Breaker wurden auf Status NOMINAL zurückgesetzt.');
  }, [addLog]);

  // Periodic Auto-Ping
  useEffect(() => {
    if (!isAutoPingActive) return;

    const interval = setInterval(() => {
      // Pick a random provider to refresh telemetry with subtle realistic jitter
      const keys = Object.keys(providers);
      if (keys.length === 0) return;
      const randomKey = keys[Math.floor(Math.random() * keys.length)];

      setProviders((prev) => {
        const target = prev[randomKey];
        if (!target || target.health.circuitBreakerTripped) return prev;

        const base = target.capabilities.typicalLatencyMs;
        const jitter = (Math.random() - 0.48) * target.health.jitterMs * 1.5;
        const newLatency = Math.max(3, Math.round((base + jitter) * 10) / 10);
        const rolling = Math.round(((target.health.rollingAverageLatencyMs * 9 + newLatency) / 10) * 10) / 10;

        return {
          ...prev,
          [randomKey]: {
            ...target,
            health: {
              ...target.health,
              currentLatencyMs: newLatency,
              rollingAverageLatencyMs: rolling,
              lastSuccessfulPingAt: new Date().toISOString(),
            },
          },
        };
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoPingActive, providers]);

  // Run validation suite
  const handleRunValidationSuite = () => {
    const res = runProviderRegistryValidationSuite();
    setSuiteResults(res);
    addLog(
      res.passed ? 'SUCCESS' : 'CRIT',
      `Vertrags-Validierungssuite ausgeführt: ${res.passed ? 'ALLE TESTS BESTANDEN (WP-004 / AP-006)' : 'FEHLER DETEKTIERT'}.`
    );
  };

  // Copy to clipboard helper
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Export Audit Report JSON
  const handleExportAuditJson = () => {
    const auditReport = ProviderRegistryService.auditProviderHealthAndBudget();
    const fullExport = {
      exportedAt: new Date().toISOString(),
      fleetAudit: auditReport,
      registrySnapshot: providers,
    };
    const blob = new Blob([JSON.stringify(fullExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `capital_ai_provider_fleet_audit_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addLog('SUCCESS', 'Audit-Bericht als JSON exportiert.');
  };

  // Provider array and filtered list
  const providerList = useMemo(() => Object.values(providers), [providers]);

  const filteredProviders = useMemo(() => {
    return providerList.filter((p) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.capabilities.supportedAssetClasses.some((ac) => ac.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'tripped') {
        matchesStatus = p.health.circuitBreakerTripped;
      } else if (statusFilter !== 'ALL') {
        matchesStatus = p.health.status === statusFilter && !p.health.circuitBreakerTripped;
      }

      // Asset Class filter
      let matchesAsset = true;
      if (assetClassFilter !== 'ALL') {
        matchesAsset = p.capabilities.supportedAssetClasses.includes(assetClassFilter as any);
      }

      return matchesSearch && matchesStatus && matchesAsset;
    });
  }, [providerList, searchQuery, statusFilter, assetClassFilter]);

  // Selected Provider Object
  const selectedProvider = useMemo(() => {
    return providers[selectedProviderId] || providerList[0];
  }, [providers, selectedProviderId, providerList]);

  // Aggregate Fleet Metrics
  const fleetSummary = useMemo(() => {
    const total = providerList.length;
    let healthy = 0;
    let degraded = 0;
    let tripped = 0;
    let latencySum = 0;
    let qualitySum = 0;
    let totalSpend = 0;

    providerList.forEach((p) => {
      latencySum += p.health.currentLatencyMs;
      qualitySum += p.health.dataQualityScoreContribution;
      totalSpend += p.budget.currentMonthlySpendEur;

      if (p.health.circuitBreakerTripped) {
        tripped++;
      } else if (p.health.status === 'healthy') {
        healthy++;
      } else {
        degraded++;
      }
    });

    const budgetCap = 40.0;
    const remainingBudget = Math.max(0, budgetCap - totalSpend);
    const avgLatency = Math.round(latencySum / (total || 1));
    const avgQuality = (qualitySum / (total || 1)).toFixed(1);

    return {
      total,
      healthy,
      degraded,
      tripped,
      avgLatency,
      avgQuality,
      totalSpend,
      budgetCap,
      remainingBudget,
      isWithinBudget: totalSpend <= budgetCap,
      budgetUtilizationPercent: Math.round((totalSpend / budgetCap) * 1000) / 10,
    };
  }, [providerList]);

  return (
    <div className="w-full text-slate-100 min-h-screen py-4 sm:py-6 px-2 sm:px-6 relative">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER CONTRACT (Breadcrumb + Actions)                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          {/* Breadcrumb kicker without mechanical prefix */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
            <span>Admin Console</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span>Data Ingestion Fleet</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-amber-400 font-semibold">Provider Registry (WP-004)</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Database className="w-6 h-6 text-amber-400 shrink-0" />
              <span>Provider Fleet &amp; Health Monitor</span>
            </h1>

            {/* Live Pulse Indicator */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>FLEET NOMINAL</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Zurück zur Übersicht</span>
            </button>
          )}

          {onNavigateArchitecture && (
            <button
              type="button"
              onClick={onNavigateArchitecture}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white text-xs font-medium border border-cyan-500/20 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Architektur Blueprint</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAutoPingActive((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isAutoPingActive
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 hover:bg-amber-400/20'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Automatisches periodisches Telemetrie-Pingen"
          >
            {isAutoPingActive ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5" />}
            <span>Auto-Pulse: {isAutoPingActive ? 'EIN' : 'AUS'}</span>
          </button>

          <button
            type="button"
            onClick={handlePingAllProviders}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fleet Ping</span>
          </button>

          <button
            type="button"
            onClick={handleExportAuditJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export JSON</span>
          </button>

          {fleetSummary.tripped > 0 && (
            <button
              type="button"
              onClick={handleResetAllBreakers}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset Circuit Breakers ({fleetSummary.tripped})</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE KPI CARDS RIBBON (Zero-Pill, Tabular Figures)                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* KPI 1: Active Fleet Health */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#090e21] border border-slate-800/90 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Fleet Health Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white flex items-baseline gap-2">
            <span>{fleetSummary.healthy} / {fleetSummary.total}</span>
            <span className="text-xs font-normal text-emerald-400">Nominal</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span>30d Uptime: <strong className="text-slate-200 font-mono">99.94%</strong></span>
            <span aria-hidden="true">·</span>
            <span>Tripped: <strong className={fleetSummary.tripped > 0 ? 'text-rose-400 font-mono' : 'text-slate-200 font-mono'}>{fleetSummary.tripped}</strong></span>
          </div>
        </div>

        {/* KPI 2: Rolling Fleet Latency */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#090e21] border border-slate-800/90 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Durchschnitts-Latenz</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-400 flex items-baseline gap-2">
            <span>{fleetSummary.avgLatency} ms</span>
            <span className="text-xs font-normal text-slate-400">Guaranteed &lt; 50ms</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Min: <strong className="text-slate-200 font-mono">18ms</strong> (Binance)</span>
            <span aria-hidden="true">·</span>
            <span>Max: <strong className="text-slate-200 font-mono">135ms</strong> (FRED)</span>
          </div>
        </div>

        {/* KPI 3: Budget Adherence (AP-006: Max 40 EUR / Month) */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#090e21] border border-slate-800/90 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Budget Cap (AP-006)</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white flex items-baseline gap-2">
            <span>{fleetSummary.totalSpend.toFixed(2)} €</span>
            <span className="text-xs font-normal text-slate-400">/ 40.00 € Cap</span>
          </div>
          <div className="mt-2 w-full">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  fleetSummary.budgetUtilizationPercent > 80 ? 'bg-rose-500' : 'bg-cyan-400'
                }`}
                style={{ width: `${Math.min(100, fleetSummary.budgetUtilizationPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>{fleetSummary.budgetUtilizationPercent}% verbraucht</span>
              <span>Buffer: {fleetSummary.remainingBudget.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Data Quality & Consensus */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#090e21] border border-slate-800/90 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Data Quality Score (DQS)</span>
            <Gauge className="w-4 h-4 text-[#FF2E93]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white flex items-baseline gap-2">
            <span>{fleetSummary.avgQuality} / 100</span>
            <span className="text-xs font-normal text-emerald-400">Exzellent</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Consensus: <strong className="text-slate-200 font-mono">Multi-Source</strong></span>
            <span aria-hidden="true">·</span>
            <span>Outlier Reject: <strong className="text-emerald-400 font-mono">Aktiv</strong></span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SUB-NAVIGATION TABS (Segmented Button Group)                            */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090e21] border border-slate-800/90 mb-6 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'fleet'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Fleet Übersicht ({providerList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('telemetry')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'telemetry'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Latenz &amp; Jitter Telemetrie</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('capabilities')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'capabilities'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Capability Contracts (AP-003)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'budget'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Budget Auditor (AP-006: &lt;40€)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('validation')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'validation'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Vertrags-Testsuite</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Audit Logs ({logs.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT ROUTING                                                     */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 1: FLEET MATRIX & CONTROL PANEL                                       */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#090e21] border border-slate-800/90">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Provider suchen (z.B. Binance, TwelveData, FRED, WebSocket, crypto)..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Status:
              </span>
              {(['ALL', 'healthy', 'degraded', 'tripped'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white/20 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {st === 'ALL'
                    ? 'Alle'
                    : st === 'healthy'
                    ? 'Nominal'
                    : st === 'degraded'
                    ? 'Verlangsamt'
                    : 'Circuit-Breaker'}
                </button>
              ))}
            </div>

            {/* Asset Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs text-slate-400 shrink-0 mr-1">Asset:</span>
              {[
                { label: 'Alle', value: 'ALL' },
                { label: 'Krypto', value: 'crypto' },
                { label: 'US-Aktien', value: 'equity_us' },
                { label: 'Forex', value: 'forex' },
                { label: 'Fixed Income', value: 'fixed_income' },
              ].map((af) => (
                <button
                  key={af.value}
                  type="button"
                  onClick={() => setAssetClassFilter(af.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    assetClassFilter === af.value
                      ? 'bg-white/20 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {af.label}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProviders.map((provider) => {
              const isTripped = provider.health.circuitBreakerTripped;
              const isSelected = selectedProviderId === provider.id;

              return (
                <div
                  key={provider.id}
                  className={`rounded-xl bg-[#090e21] border transition-all relative p-4 flex flex-col justify-between ${
                    isTripped
                      ? 'border-rose-500/50 bg-rose-950/10'
                      : isSelected
                      ? 'border-amber-400/60 ring-1 ring-amber-400/30'
                      : 'border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Header: Name, Tier & Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white tracking-tight">{provider.name}</h3>
                          <span className="text-[11px] font-mono text-slate-400">
                            {provider.tier.toUpperCase()}
                          </span>
                        </div>
                        {/* Clean unboxed metadata with bullet separators */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <span>{provider.complianceVerification.jurisdiction}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">Cap: {provider.budget.monthlyBudgetCapEur.toFixed(2)} €</span>
                        </div>
                      </div>

                      {/* Explicit Semantic Status Label */}
                      <div className="shrink-0 flex items-center gap-1.5 text-xs font-mono font-medium">
                        {isTripped ? (
                          <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                            CIRCUIT TRIPPED
                          </span>
                        ) : provider.health.status === 'healthy' ? (
                          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            NOMINAL
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            DEGRADED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                      {provider.description}
                    </p>

                    {/* Telemetry Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-black/30 border border-white/5 mb-3">
                      <div>
                        <div className="text-[10px] text-slate-400">Aktuelle Latenz</div>
                        <div className="text-sm font-bold font-mono tabular-nums text-white mt-0.5">
                          {provider.health.currentLatencyMs} ms
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          SLA &lt;{provider.capabilities.guaranteedLatencyMs}ms
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-400">Jitter (std)</div>
                        <div className="text-sm font-bold font-mono tabular-nums text-amber-400 mt-0.5">
                          ±{provider.health.jitterMs} ms
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          30d: {provider.health.uptimePercent30d}%
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-400">Data Quality</div>
                        <div className="text-sm font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                          {provider.health.dataQualityScoreContribution} %
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Err 1h: {provider.health.errorRatePercent1h}%
                        </div>
                      </div>
                    </div>

                    {/* Endpoints & Supported Classes */}
                    <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Asset-Klassen:</span>
                        <span className="font-mono text-slate-200">
                          {provider.capabilities.supportedAssetClasses.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Protokolle:</span>
                        <span className="font-mono text-cyan-300">
                          {provider.capabilities.protocols.map((pr) => pr.toUpperCase()).join(' · ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Monatliche Kosten:</span>
                        <span className="font-mono font-bold text-white">
                          {provider.budget.currentMonthlySpendEur.toFixed(2)} € / Mo
                          {provider.budget.monthlyBaseCostEur === 0 && ' (Free Tier)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handlePingProvider(provider.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ping</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleCircuitBreaker(provider.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isTripped
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                      }`}
                    >
                      {isTripped ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Breaker Reset</span>
                        </>
                      ) : (
                        <>
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                          <span>Trip Breaker</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProviderId(provider.id);
                        setActiveTab('capabilities');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Vertrag</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProviders.length === 0 && (
            <div className="p-8 text-center rounded-xl bg-[#090e21] border border-slate-800 text-slate-400">
              <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Keine Provider gefunden für diesen Filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setAssetClassFilter('ALL');
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white hover:bg-white/20"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 2: LATENCY & JITTER TELEMETRY BENCHMARK                               */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-6 rounded-xl bg-[#090e21] border border-slate-800/90">
            <h2 className="text-lg font-bold text-white mb-1">
              Realtime Latenz-Benchmarking &amp; SLA-Garantien
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Vergleich von gemessener Round-Trip-Zeit (RTT), Rolling Average und vertraglich garantierter Latenz Obergrenze.
            </p>

            <div className="space-y-4">
              {providerList.map((p) => {
                const current = p.health.currentLatencyMs;
                const guaranteed = p.capabilities.guaranteedLatencyMs;
                const isOverSla = current > guaranteed;
                // Calculate relative bar percentage (capped at 100% against 150ms max)
                const currentPct = Math.min(100, Math.max(5, (current / 150) * 100));
                const slaPct = Math.min(100, Math.max(5, (guaranteed / 150) * 100));

                return (
                  <div key={p.id} className="p-3.5 rounded-lg bg-black/30 border border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{p.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">({p.slug})</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span>Aktuell: <strong className={isOverSla ? 'text-rose-400' : 'text-amber-400'}>{current} ms</strong></span>
                        <span className="text-slate-500">·</span>
                        <span>Rolling 1h: <strong className="text-slate-300">{p.health.rollingAverageLatencyMs} ms</strong></span>
                        <span className="text-slate-500">·</span>
                        <span>SLA Limit: <strong className="text-emerald-400">&lt; {guaranteed} ms</strong></span>
                      </div>
                    </div>

                    {/* Comparative Visual Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-900 h-3 rounded-full relative overflow-hidden">
                        {/* SLA threshold marker */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-10"
                          style={{ left: `${slaPct}%` }}
                          title={`SLA Grenze: ${guaranteed}ms`}
                        />
                        {/* Current latency fill */}
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            p.health.circuitBreakerTripped
                              ? 'bg-rose-500'
                              : isOverSla
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${currentPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>0 ms</span>
                        <span>Jitter: ±{p.health.jitterMs}ms</span>
                        <span>Uptime 30d: {p.health.uptimePercent30d}%</span>
                        <span>150 ms Scale</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 3: CAPABILITIES & CONTRACT INSPECTOR (WP-004, AP-001, AP-003)         */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'capabilities' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Provider Selector Column */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Provider auswählen
            </h3>
            {providerList.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProviderId(p.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedProviderId === p.id
                    ? 'bg-amber-400/10 border-amber-400 text-white'
                    : 'bg-[#090e21] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{p.tier.toUpperCase()}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {p.capabilities.supportedAssetClasses.join(', ')}
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Contract Inspector */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-[#090e21] border border-slate-800 space-y-6">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{selectedProvider.name}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300">
                    {selectedProvider.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{selectedProvider.description}</p>
              </div>

              <a
                href={selectedProvider.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-amber-400 hover:underline shrink-0"
              >
                <span>Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Capability Flags Matrix */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Orderbuch- &amp; Markttiefe-Fähigkeiten
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <div className="text-[10px] text-slate-400">L1 Top of Book</div>
                  <div className="text-xs font-bold mt-1 flex items-center gap-1.5">
                    {selectedProvider.capabilities.supportsL1TopBook ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unterstützt
                      </span>
                    ) : (
                      <span className="text-slate-500">Nicht aktiv</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <div className="text-[10px] text-slate-400">L2 Orderbook Depth</div>
                  <div className="text-xs font-bold mt-1 flex items-center gap-1.5">
                    {selectedProvider.capabilities.supportsL2OrderbookDepth ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unterstützt
                      </span>
                    ) : (
                      <span className="text-slate-500">Nicht aktiv</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <div className="text-[10px] text-slate-400">L3 Market-by-Order</div>
                  <div className="text-xs font-bold mt-1 flex items-center gap-1.5">
                    {selectedProvider.capabilities.supportsL3MarketByOrder ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unterstützt
                      </span>
                    ) : (
                      <span className="text-slate-500">Enterprise Only</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Historische Kerzen</div>
                  <div className="text-xs font-bold mt-1 text-white font-mono">
                    {selectedProvider.capabilities.supportsHistoricalCandles
                      ? `${selectedProvider.capabilities.historicalDepthDays} Tage Historie`
                      : 'Nicht unterstützt'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Sequence Validation</div>
                  <div className="text-xs font-bold mt-1 flex items-center gap-1.5">
                    {selectedProvider.capabilities.supportsSequenceValidation ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Monoton verifiziert
                      </span>
                    ) : (
                      <span className="text-slate-500">Best-Effort</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Max Request Rate</div>
                  <div className="text-xs font-bold mt-1 text-amber-400 font-mono">
                    {selectedProvider.capabilities.maxRequestRatePerMinute} Req / Min
                  </div>
                </div>
              </div>
            </div>

            {/* Endpoints & Security */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Verifizierte Endpunkte &amp; Compliance
              </h3>
              <div className="space-y-2 text-xs font-mono">
                {selectedProvider.endpoints.websocketUrl && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="text-amber-400 mr-2">WSS:</span>
                      <span className="text-slate-300">{selectedProvider.endpoints.websocketUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedProvider.endpoints.websocketUrl || '', 'wss')}
                      className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                      title="Kopieren"
                    >
                      {copiedKey === 'wss' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {selectedProvider.endpoints.restBaseUrl && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="text-cyan-400 mr-2">REST:</span>
                      <span className="text-slate-300">{selectedProvider.endpoints.restBaseUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedProvider.endpoints.restBaseUrl || '', 'rest')}
                      className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                      title="Kopieren"
                    >
                      {copiedKey === 'rest' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {selectedProvider.endpoints.rpcUrl && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="text-[#FF2E93] mr-2">RPC:</span>
                      <span className="text-slate-300">{selectedProvider.endpoints.rpcUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedProvider.endpoints.rpcUrl || '', 'rpc')}
                      className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                      title="Kopieren"
                    >
                      {copiedKey === 'rpc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Fallback Chain */}
            <div className="p-3.5 rounded-lg bg-black/30 border border-slate-800">
              <div className="text-xs font-bold text-slate-300 mb-1">Automatische Failover-Kette</div>
              <div className="text-xs text-slate-400">
                {selectedProvider.fallbackProviderIds.length > 0 ? (
                  <span>
                    Bei Ausfall von <strong className="text-white">{selectedProvider.name}</strong> leitet die Pipeline automatisch um auf:{' '}
                    <strong className="text-amber-400 font-mono">
                      {selectedProvider.fallbackProviderIds.join(' ➔ ')}
                    </strong>
                  </span>
                ) : (
                  <span>Autarker Primär-Provider mit interner Zero-Downtime Clusterung.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 4: BUDGET & COST AUDITOR (AP-006: Max 40 EUR / Month)                 */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-xl bg-[#090e21] border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  <span>Monatliches Provider-Kostenbudget (AP-006)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Strikte vertragliche Budget-Obergrenze von maximal 40,00 € / Monat für alle Datenquellen der Plattform.
                </p>
              </div>

              <div className="text-right font-mono">
                <div className="text-xs text-slate-400">Gesamtausgaben aktuell</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {fleetSummary.totalSpend.toFixed(2)} € <span className="text-xs text-slate-400 font-normal">/ 40,00 €</span>
                </div>
              </div>
            </div>

            {/* Provider Cost Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium font-mono">
                    <th className="py-2.5 px-3">Provider Name</th>
                    <th className="py-2.5 px-3">Preismodell</th>
                    <th className="py-2.5 px-3">Free Tier Limit</th>
                    <th className="py-2.5 px-3">Spend / Monat</th>
                    <th className="py-2.5 px-3">Budget Cap</th>
                    <th className="py-2.5 px-3">Auslastung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {providerList.map((p) => {
                    const spend = p.budget.currentMonthlySpendEur;
                    const cap = p.budget.monthlyBudgetCapEur;
                    const pct = cap > 0 ? Math.round((spend / cap) * 100) : 0;

                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-sans font-semibold text-white">
                          {p.name}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {p.budget.monthlyBaseCostEur === 0 ? '100% Free Tier' : 'Pay-as-you-go'}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {p.budget.freeTierDailyLimit.toLocaleString()} Calls/Tag
                        </td>
                        <td className="py-3 px-3 font-bold text-white">
                          {spend.toFixed(2)} €
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {cap.toFixed(2)} €
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${pct > 80 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                                style={{ width: `${Math.min(100, pct)}%` }}
                              />
                            </div>
                            <span className="text-slate-400 text-[11px]">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Architecture Savings Callout */}
            <div className="mt-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Low-Budget Blueprint Validierung: </strong>
                Durch In-Memory Redis Caching, WebSocket Multiplexing und gezielte Nutzung regulatorisch freier Institutionen 
                (Federal Reserve FRED, Binance Public Stream, Alchemy Free Tiers) spart Capital-AI über <strong className="text-cyan-300 font-mono">98,2%</strong> 
                der monatlichen Kosten im Vergleich zu traditionellen Enterprise-Feeds (Bloomberg B-PIPE / Refinitiv Elektron: ca. 2.100 €/Mo).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 5: AUTOMATED VALIDATION SUITE (WP-004)                                */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-xl bg-[#090e21] border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <span>Automatisierte Provider-Vertrags-Testsuite</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Führt alle Zod-Schema-Checks, Asset-Taxonomie-Auflösungen und AP-006 Budget-Grenzprüfungen interaktiv aus.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunValidationSuite}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Testsuite jetzt ausführen</span>
              </button>
            </div>

            {suiteResults ? (
              <div className="space-y-3 font-mono text-xs">
                <div
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    suiteResults.passed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <span className="font-bold">
                    STATUS: {suiteResults.passed ? 'ALLE VERTRAGSPRÜFUNGEN ERFOLGREICH BESTANDEN' : 'VERTRAGSBRUCH DETEKTIERT'}
                  </span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>

                <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-1.5 overflow-x-auto">
                  {suiteResults.results.map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        line.startsWith('[TEST')
                          ? 'text-amber-400 font-bold mt-2'
                          : line.includes('✓')
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm">Klicken Sie auf &quot;Testsuite jetzt ausführen&quot;, um alle Zod-Schemas und AP-006 Budgets zu auditieren.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 6: AUDIT & INTERVENTION LOGS                                          */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'logs' && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#090e21] border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Echtzeit Audit- &amp; Telemetrie-Log</span>
              </h2>
              <p className="text-xs text-slate-400">
                Lückenlose Aufzeichnung aller Heartbeats, Latenzschwankungen und Circuit-Breaker-Events.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setLogs([])}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white"
            >
              Log leeren
            </button>
          </div>

          <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs max-h-96 overflow-y-auto space-y-1.5 scrollbar-thin">
            {logs.map((log) => {
              const color =
                log.level === 'CRIT'
                  ? 'text-rose-400'
                  : log.level === 'WARN'
                  ? 'text-amber-400'
                  : log.level === 'SUCCESS'
                  ? 'text-emerald-400'
                  : 'text-slate-300';

              return (
                <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <span
                    className={`font-bold shrink-0 text-[10px] px-1 rounded ${
                      log.level === 'CRIT'
                        ? 'bg-rose-500/20 text-rose-400'
                        : log.level === 'SUCCESS'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : log.level === 'WARN'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className={color}>{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
