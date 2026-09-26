/**
 * CAPITAL AI — ADVISOR CHATBOT (AI PURCHASE ADVISOR / KAUFBERATER)
 *
 * An institutional AI purchase advisor for the Pipeline Builder (Alternate PC-Konfigurator Style).
 * - Powered by existing Gemini integration (gemini-3.8-flash) with Scientist Reasoning.
 * - Guides users step-by-step through the Fintech / Scientist stack configuration.
 * - Live Inventory & Cataloging system for user-selected tools referenced for Revenue Assurance.
 * - Enforces the 40.00 € / month budget ceiling (AP-006) and BaFin WpHG § 83 compliance.
 */

import React, { useState, useMemo } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Send,
  CheckCircle2,
  DollarSign,
  Layers,
  ShieldCheck,
  Zap,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  FileCheck,
  Sliders,
  Download,
  Copy,
  Check,
  Cpu,
  Coins,
  Compass,
  AlertTriangle,
  Flame,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  AdvisorResponsePayload,
  handleAdvisorRequest,
} from '../services/geminiAdvisorBackend';
import {
  PipelineConfigState,
  catalogUserSelectedTools,
  exportInventoryAsJson,
  exportInventoryAsText,
  InventoryBOMSummary,
  CatalogToolEntry,
} from '../utils/pipelineToolCatalog';

export interface AdvisorChatbotProps {
  currentConfig: PipelineConfigState;
  onApplyConfig: (newConfig: PipelineConfigState) => void;
  onStepChange?: (step: number) => void;
  isOpen: boolean;
  onClose?: () => void;
  isFloating?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  timestamp: string;
  text: string;
  thoughtProcess?: string;
  inventory?: AdvisorResponsePayload['inventory'];
  totalMonthlyCostEur?: number;
  recommendedConfig?: AdvisorResponsePayload['recommendedConfig'];
  isAuditReport?: boolean;
}

export const AdvisorChatbot: React.FC<AdvisorChatbotProps> = ({
  currentConfig,
  onApplyConfig,
  onStepChange,
  isOpen,
  onClose,
  isFloating = false,
}) => {
  // Navigation tabs inside the advisor
  const [activeTab, setActiveTab] = useState<'chat' | 'inventory' | 'guide'>('chat');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedBOM, setCopiedBOM] = useState(false);

  // Live Inventory & Cataloging of user-selected tools
  const userInventory: InventoryBOMSummary = useMemo(() => {
    return catalogUserSelectedTools(currentConfig);
  }, [currentConfig]);

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'advisor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: 'Willkommen beim **Capital-AI Systems Architect & Kaufberater**! Ich unterstütze Sie bei der Konfiguration Ihrer BaFin-konformen Datenpipeline (Alternate PC-Konfigurator-Stil). Welches Screener-Tool oder welches Latenzbudget möchten Sie konfigurieren?',
      thoughtProcess: `[SCIENTIST PURCHASE ADVISOR INITIALIZATION]
- Live-Inventar erkannt: ${catalogUserSelectedTools(currentConfig).items.map((i) => i.name).join(' | ')}
- Kostenkontrolle: Strikte Revenue Assurance Obergrenze von 40,00 € / Monat (AP-006).
- Audit-Trail: Revisionssicherheit nach BaFin MaRisk und WpHG § 83 WORM Archivierung.`,
      inventory: catalogUserSelectedTools(currentConfig).items.map((i) => ({
        tier: i.layerName,
        item: i.name,
        specs: i.specs,
        costEur: i.monthlyCostEur,
        latencyEffect: i.latencyContribution,
        bafinRelevance: i.bafinStandard,
      })),
      totalMonthlyCostEur: catalogUserSelectedTools(currentConfig).totalMonthlyCostEur,
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({
    welcome: false,
  });

  const toggleThought = (msgId: string) => {
    setExpandedThoughts((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  // Dispatch prompt to Gemini API
  const handleSendPrompt = async (promptText: string, isAudit: boolean = false) => {
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: promptText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);
    setActiveTab('chat');

    try {
      // Prepare rich payload containing user's cataloged inventory for Revenue Assurance
      const catalogedForBackend = userInventory.items.map((i) => ({
        id: i.id,
        tier: i.layerName,
        name: i.name,
        specs: i.specs,
        costEur: i.monthlyCostEur,
        latencyEffect: i.latencyContribution,
        bafinRelevance: i.bafinStandard,
      }));

      const requestPayload = {
        prompt: promptText,
        currentConfig: {
          analysisFocusId: currentConfig.analysisFocusId,
          latencyIntervalId: currentConfig.latencyIntervalId,
          providerIds: currentConfig.providerIds,
          cachingId: currentConfig.cachingId,
          evidenceId: currentConfig.evidenceId,
          catalogedInventory: catalogedForBackend,
          totalMonthlyCostEur: userInventory.totalMonthlyCostEur,
        },
      };

      let responseData: AdvisorResponsePayload;
      try {
        const res = await fetch('/api/advisor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
        });

        if (res.ok) {
          responseData = await res.json();
        } else {
          responseData = await handleAdvisorRequest(requestPayload);
        }
      } catch {
        responseData = await handleAdvisorRequest(requestPayload);
      }

      const advisorMsg: ChatMessage = {
        id: `adv-${Date.now()}`,
        sender: 'advisor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseData.advice,
        thoughtProcess: responseData.thoughtProcess,
        inventory: responseData.inventory,
        totalMonthlyCostEur: responseData.totalMonthlyCostEur,
        recommendedConfig: responseData.recommendedConfig,
        isAuditReport: isAudit,
      };

      setMessages((prev) => [...prev, advisorMsg]);
      setExpandedThoughts((prev) => ({
        ...prev,
        [advisorMsg.id]: true, // Auto-expand for scientist reasoning clarity
      }));
    } catch {
      const errorMsg: ChatMessage = {
        id: `adv-err-${Date.now()}`,
        sender: 'advisor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'Entschuldigung, bei der Analyse des Tool-Stacks ist eine kurze Unterbrechung aufgetreten. Bitte erneut anfragen oder eine der Schnell-Optionen nutzen.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (rec?: AdvisorResponsePayload['recommendedConfig']) => {
    if (!rec) return;
    onApplyConfig({
      analysisFocusId: rec.analysisFocusId,
      latencyIntervalId: rec.latencyIntervalId,
      providerIds: rec.providerIds,
      cachingId: rec.cachingId,
      evidenceId: rec.evidenceId,
    });
  };

  const handleCopyBOM = () => {
    const text = exportInventoryAsText(userInventory);
    navigator.clipboard.writeText(text);
    setCopiedBOM(true);
    setTimeout(() => setCopiedBOM(false), 2500);
  };

  const handleDownloadBOMJson = () => {
    const jsonStr = exportInventoryAsJson(userInventory);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capital-ai-inventory-${userInventory.items[0]?.id || 'pipeline'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`flex flex-col bg-[#090e21] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all ${
        isFloating
          ? `fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 ${
              isExpanded
                ? 'w-[96vw] sm:w-[680px] h-[90vh] max-h-[850px]'
                : 'w-[96vw] sm:w-[480px] h-[640px] max-h-[85vh]'
            }`
          : 'w-full h-full min-h-[550px]'
      }`}
    >
      {/* 1. TOP HEADER & BRANDING */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-cyan-500/15 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                AdvisorChatbot · Kaufberater
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                SCIENTIST AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Fintech Stack Guide &amp; Revenue Assurance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isFloating && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isExpanded ? 'Verkleinern' : 'Vergrößern'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Schließen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. REVENUE ASSURANCE STATUS STRIP */}
      <div className="px-3 py-2 bg-black/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Budget:</span>
            <span className={`font-bold ${userInventory.isBudgetCompliant ? 'text-cyan-400' : 'text-red-400'}`}>
              {userInventory.totalMonthlyCostEur.toFixed(2)} €
            </span>
            <span className="text-slate-500 text-[10px]">/ 40 €</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-400">Latenz:</span>
            <span className="text-amber-400 font-bold">{userInventory.calculatedLatencyMs}ms</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">BaFin:</span>
            <span className="text-emerald-400 font-bold">{userInventory.bafinComplianceScore}%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const prompt = `Führe eine vollständige Revenue Assurance und BaFin MaRisk Prüfung für mein aktuell ausgewähltes Tool-Inventar durch: ${userInventory.items
              .map((i) => `[${i.layerName}: ${i.name}, ${i.monthlyCostEur}€]`)
              .join('; ')}. Gesamtkosten: ${userInventory.totalMonthlyCostEur.toFixed(2)}€/Mo.`;
            handleSendPrompt(prompt, true);
          }}
          className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
          title="Live-Inventar durch Kaufberater auditieren lassen"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Inventar prüfen</span>
        </button>
      </div>

      {/* 3. TABS: CHAT vs INVENTORY CATALOG vs STACK GUIDE */}
      <div className="flex items-center border-b border-slate-800 bg-[#060a17] shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'chat'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kaufberater Chat</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'inventory'
              ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Live-Inventar ({userInventory.items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'guide'
              ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-400/5'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Stack Guide</span>
        </button>
      </div>

      {/* 4. MAIN BODY CONTAINER BASED ON ACTIVE TAB */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Quick Prompts Bar */}
          <div className="p-2 bg-black/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold shrink-0 ml-1">
              Fokus:
            </span>
            <button
              type="button"
              onClick={() =>
                handleSendPrompt('Konfiguriere das optimale Setup für den disziplinierten Buffett Value Check (ROE > 15%, DCF Margin of Safety).')
              }
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/20 hover:text-amber-300 border border-white/10 text-[11px] font-medium text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
            >
              💡 Buffett Value Check
            </button>
            <button
              type="button"
              onClick={() =>
                handleSendPrompt('Welches Setup erfüllt 100% BaFin MaRisk und WpHG § 83 mit WORM Storage?')
              }
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-400/20 hover:text-cyan-300 border border-white/10 text-[11px] font-medium text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
            >
              🛡️ BaFin MaRisk Audit
            </button>
            <button
              type="button"
              onClick={() =>
                handleSendPrompt('Wie konfiguriere ich eine Sub-20ms High-Frequency Arbitrage Pipeline unter 0€ Monatskosten?')
              }
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-400/20 hover:text-emerald-300 border border-white/10 text-[11px] font-medium text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
            >
              ⚡ Sub-20ms HFT Setup
            </button>
            <button
              type="button"
              onClick={() =>
                handleSendPrompt('Prüfe mein ausgewähltes Tool-Inventar gegen das 40€ Monatsbudget und validiere die Latenzkette.')
              }
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-400/20 hover:text-purple-300 border border-white/10 text-[11px] font-medium text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
            >
              📋 Revenue Assurance Check
            </button>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Label */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1 px-1 font-mono">
                  <span>{msg.sender === 'user' ? 'Ihre Anfrage' : 'Fintech & Scientist Kaufberater'}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3 sm:p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-400 text-black font-semibold shadow-md'
                      : 'bg-black/60 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>
                        {paragraph.split('**').map((chunk, cIdx) =>
                          cIdx % 2 === 1 ? (
                            <strong
                              key={cIdx}
                              className={msg.sender === 'user' ? 'font-black' : 'text-amber-400 font-bold'}
                            >
                              {chunk}
                            </strong>
                          ) : (
                            chunk
                          )
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Collapsible Scientist Reasoning */}
                  {msg.thoughtProcess && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => toggleThought(msg.id)}
                        className="w-full flex items-center justify-between text-[11px] font-mono text-cyan-300 hover:text-cyan-200 py-1 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          Scientist-Gedankengang (Reasoning)
                        </span>
                        {expandedThoughts[msg.id] ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {expandedThoughts[msg.id] && (
                        <div className="mt-2 p-2.5 rounded-xl bg-black/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-100 whitespace-pre-wrap leading-relaxed">
                          {msg.thoughtProcess}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Referenced Tool Inventory Table */}
                  {msg.inventory && msg.inventory.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-bold text-white mb-2">
                        <span className="flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Katalogisierte Komponenten-Spezifikation
                        </span>
                        <span className="font-mono text-amber-400">
                          Gesamt: {msg.totalMonthlyCostEur?.toFixed(2)} € / Mo
                        </span>
                      </div>

                      <div className="space-y-1.5 overflow-x-auto max-h-48 scrollbar-thin">
                        {msg.inventory.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-black/40 border border-slate-800 text-[10px] space-y-0.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-mono">{item.tier}</span>
                              <span className="text-white font-bold font-mono">
                                {item.costEur === 0 ? '0,00 € (Free)' : `${item.costEur.toFixed(2)} €/Mo`}
                              </span>
                            </div>
                            <div className="text-white font-semibold">{item.item}</div>
                            <div className="text-slate-400">{item.specs}</div>
                            <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5 font-mono">
                              <span>{item.latencyEffect}</span>
                              <span className="text-emerald-400">{item.bafinRelevance}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 1-Click Action: Apply Configuration Preset */}
                  {msg.recommendedConfig && (
                    <div className="mt-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleApplyPreset(msg.recommendedConfig)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Empfohlenes Setup in den Pipeline Builder übernehmen</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Scientist Reasoning Engine analysiert Marktdaten-Anforderungen...</span>
              </div>
            )}
          </div>

          {/* Form input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputQuery);
            }}
            className="p-3 bg-black/50 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Frage an Kaufberater stellen (z.B. Buffett Check, BaFin Latenz, 40€ Budget)..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 rounded-xl bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 shadow-md shadow-amber-500/20"
              title="Nachricht senden"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 5. TAB: INVENTORY & CATALOGING SYSTEM (REVENUE ASSURANCE) */}
      {activeTab === 'inventory' && (
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 scrollbar-thin">
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Katalogisiertes Benutzer-Inventar (Stückliste / BOM)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Alle von Ihnen im Pipeline Builder gewählten Module sind hier lückenlos erfasst, 
                nach Latenz bewertet und für Revenue Assurance auditiert.
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyBOM}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                title="Stückliste in die Zwischenablage kopieren"
              >
                {copiedBOM ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Kopieren</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadBOMJson}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                title="BOM als JSON exportieren"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>
          </div>

          {/* Revenue Assurance Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800">
              <div className="text-[10px] text-slate-500 font-mono uppercase">Monatskosten</div>
              <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">
                {userInventory.totalMonthlyCostEur.toFixed(2)} €
              </div>
              <div className="text-[10px] text-slate-400">Limit: 40,00 €</div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800">
              <div className="text-[10px] text-slate-500 font-mono uppercase">Budget-Puffer</div>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                {userInventory.remainingBudgetEur.toFixed(2)} €
              </div>
              <div className="text-[10px] text-emerald-500/80">
                {(100 - userInventory.budgetUtilizationPercent).toFixed(1)}% frei
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800">
              <div className="text-[10px] text-slate-500 font-mono uppercase">End-to-End Latenz</div>
              <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                {userInventory.calculatedLatencyMs} ms
              </div>
              <div className="text-[10px] text-slate-400">Inkl. Cache &amp; Evidence</div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800">
              <div className="text-[10px] text-slate-500 font-mono uppercase">BaFin Score</div>
              <div className="text-base font-bold text-purple-400 font-mono mt-0.5">
                {userInventory.bafinComplianceScore}%
              </div>
              <div className="text-[10px] text-purple-300/80 truncate">WpHG § 83 &amp; MaRisk</div>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Budget-Auslastung (AP-006):</span>
              <span className="font-mono text-cyan-300 font-bold">
                {userInventory.budgetUtilizationPercent.toFixed(1)} %
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  userInventory.isBudgetCompliant ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, userInventory.budgetUtilizationPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
              <span>0,00 €</span>
              <span>20,00 € (50%)</span>
              <span className="text-amber-400 font-bold">40,00 € (Max Limit)</span>
            </div>
          </div>

          {/* Cataloged Items List */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Inventarisierte Stack-Komponenten ({userInventory.items.length})</span>
            </div>

            {userInventory.items.map((item: CatalogToolEntry) => (
              <div
                key={item.sku}
                className="p-3 rounded-xl bg-black/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-bold">
                      {item.sku}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {item.layerName}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-white">
                    {item.monthlyCostEur === 0 ? '0,00 € (Free / Sovereign)' : `${item.monthlyCostEur.toFixed(2)} € / Mo`}
                  </span>
                </div>

                <div className="text-sm font-bold text-white">{item.name}</div>
                <div className="text-xs text-slate-300">{item.specs}</div>

                {item.keyFormulas && item.keyFormulas.length > 0 && (
                  <div className="p-1.5 rounded-lg bg-black/70 border border-slate-800 text-[10px] font-mono text-cyan-200">
                    {item.keyFormulas.join(' · ')}
                  </div>
                )}

                <div className="pt-1.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-mono gap-1">
                  <span>Latenz: <strong className="text-slate-200">{item.latencyContribution}</strong></span>
                  <span className="text-emerald-400 font-medium">{item.bafinStandard}</span>
                  <span className="text-purple-300">Grade: {item.revenueAssuranceGrade}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trigger Audit Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                const prompt = `Führe eine mathematische und aufsichtsrechtliche Revenue Assurance Prüfung für das aktuelle Inventar durch: ${userInventory.items
                  .map((i) => i.name)
                  .join(', ')}. Prüfe Kosten (${userInventory.totalMonthlyCostEur.toFixed(2)} €), Latenz (${userInventory.calculatedLatencyMs}ms) und BaFin Revisionssicherheit.`;
                handleSendPrompt(prompt, true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 fill-black text-black" />
              <span>Inventar durch KI Kaufberater zertifizieren &amp; auditieren</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. TAB: INTERACTIVE STACK CONFIGURATION GUIDE */}
      {activeTab === 'guide' && (
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 scrollbar-thin">
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Schritt-für-Schritt Konfigurations-Leitfaden</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Verstehen Sie wie beim PC-Kauf auf Alternate, wie die 5 Ebenen ineinandergreifen, 
              um maximale Signalqualität bei minimalen Lizenzkosten zu erzielen.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                step: 1,
                title: 'Ebene 1: Analyse-Tool & Screener-Ausgangspunkt',
                desc: 'Hier wählen Sie die Berechnungslogik. Der Buffett Value Check fokussiert sich auf fundamentale 10-Jahres Bilanzen (ROE > 15%, DCF Margin of Safety). Der BaFin Multi-Faktor Scorer liefert Risiko-Scoring nach MaRisk.',
                advisorTip: 'Tipp: Für Value Checks ist keine teure Streaming-Latenz nötig. Sparen Sie das Budget für Daten-Tiefe.',
                actionPrompt: 'Erkläre mir den Buffett Value Check im Detail.',
              },
              {
                step: 2,
                title: 'Ebene 2: Taktung & Latenz-Budget',
                desc: 'End-of-Day (EOD) für Bilanzen, 15-Minuten Delayed Snapshot für BaFin-Prüfstandards, 1-Minuten Intraday für Momentum oder Sub-20ms WebSocket für High-Frequency Arbitrage.',
                advisorTip: 'Tipp: 15-Minuten Snapshot entlastet das Monatsbudget vollständig von teuren Börsen-Abonnements.',
                actionPrompt: 'Welche Latenz empfiehlst du für mein Trading?',
              },
              {
                step: 3,
                title: 'Ebene 3: Data Ingestion Gateways',
                desc: 'TwelveData für US & EU Aktien, FRED für die US-Zinsstrukturkurve, Binance/Kraken für Krypto L2 Orderbücher und Alchemy für On-Chain DEX Swaps.',
                advisorTip: 'Tipp: Die Kombination TwelveData (8,50 €) + FRED (0,00 €) ist der Königsweg für Fundamental-Scoring.',
                actionPrompt: 'Wie kombiniere ich TwelveData und FRED optimal?',
              },
              {
                step: 4,
                title: 'Ebene 4: In-Memory Caching & Normalisierung',
                desc: 'Redis Ring Buffer entkoppelt Screener-Abfragen verlustfrei. FlatBuffers komprimiert binäre Ticks um 70%. Apache Arrow Flight streamt direkt in Python DataFrames.',
                advisorTip: 'Tipp: Redis Ringpuffer garantiert Sub-5ms Query Latenz ohne Belastung der externen Schnittstellen.',
                actionPrompt: 'Was bringt Apache Arrow Flight für Python Quants?',
              },
              {
                step: 5,
                title: 'Ebene 5: BaFin / MiCA Audit-Evidence',
                desc: 'WORM Storage (5 Jahre unveränderliche Vorratsdatenspeicherung nach WpHG § 83) oder SHA-256 Merkle Audit Tree für kryptografische Kurs-Beweise.',
                advisorTip: 'Tipp: Ohne WORM Storage ist ein automatisierter Screener für BaFin-regulierte Fonds unzulässig.',
                actionPrompt: 'Warum verlangt die BaFin WORM Storage nach WpHG § 83?',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-amber-400 text-black font-black text-[10px] flex items-center justify-center font-mono">
                      {s.step}
                    </span>
                    <span>{s.title}</span>
                  </span>
                  {onStepChange && (
                    <button
                      type="button"
                      onClick={() => onStepChange(s.step)}
                      className="text-[10px] font-mono text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
                    >
                      Im Konfigurator öffnen →
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>

                <div className="p-2 rounded-lg bg-amber-400/5 border border-amber-400/20 text-[11px] text-amber-200">
                  {s.advisorTip}
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSendPrompt(s.actionPrompt)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Kaufberater dazu befragen</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
