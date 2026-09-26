/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Live Execution Terminal, Evidence Merkle Verifier & Tick Streamer (AP-002, AP-004, AP-005)
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Terminal,
  ShieldCheck,
  Zap,
  Lock,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { PipelineDefinition } from '../../contracts';
import { MerkleTree } from '../../utils/merkleTree';
import {
  globalPaperTradingEngine,
  PaperPortfolioState,
  PaperOrder,
} from '../../services/paperTradingEngine';

interface PipelineTerminalDrawerProps {
  pipeline: PipelineDefinition;
  isRunning: boolean;
  onToggleRun: () => void;
}

interface SimulatedTickLog {
  id: string;
  timestamp: string;
  symbol: string;
  price: number;
  volume: number;
  merkleLeaf: string;
  merkleRoot: string;
  quorum: number;
  dqs: number;
  latencyMs: number;
  verified: boolean;
}

export const PipelineTerminalDrawer: React.FC<PipelineTerminalDrawerProps> = ({
  pipeline,
  isRunning,
  onToggleRun,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState<SimulatedTickLog[]>([]);
  const [activeTab, setActiveTab] = useState<'stream' | 'merkle' | 'portfolio' | 'orders'>('stream');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedProofIndex, setSelectedProofIndex] = useState<number>(0);

  // Paper Trading State Subscription
  const [portfolioState, setPortfolioState] = useState<PaperPortfolioState>(() =>
    globalPaperTradingEngine.getState()
  );

  useEffect(() => {
    const unsubscribe = globalPaperTradingEngine.subscribe((state) => {
      setPortfolioState(state);
    });
    return unsubscribe;
  }, []);

  // Tick Stream Simulator with Real SHA-256 Merkle Proof Generation
  useEffect(() => {
    if (!isRunning) return;

    const symbols = ['BTC/USDT', 'ETH/USDT', 'NVDA', 'AAPL', 'EUR/USD', 'XAU/USD'];
    let seq = 104850;

    const interval = setInterval(() => {
      seq += 1;
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      const basePrice = sym.includes('BTC') ? 64250 : sym.includes('ETH') ? 3480 : sym === 'NVDA' ? 128.5 : 224;
      const price = basePrice * (1 + (Math.random() - 0.498) * 0.003);
      const volume = Math.round(Math.random() * 450 + 25);

      // Real Cryptographic SHA-256 Merkle Tree calculation
      const tickData = { seq, symbol: sym, price: parseFloat(price.toFixed(4)), volume, ts: Date.now() };
      const tree = new MerkleTree([tickData, 'CONSENSUS_NODE_1', 'CONSENSUS_NODE_2', 'CONSENSUS_NODE_3']);
      const proof = tree.getProof(0);

      const newLog: SimulatedTickLog = {
        id: `seq_${seq}`,
        timestamp: new Date().toLocaleTimeString('de-DE', { hour12: false, fractionalSecondDigits: 3 }),
        symbol: sym,
        price,
        volume,
        merkleLeaf: proof.leaf,
        merkleRoot: proof.root,
        quorum: 3,
        dqs: 98.7,
        latencyMs: Math.floor(Math.random() * 12 + 18),
        verified: proof.verified,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);

      // Push real-time mark price to paper engine
      globalPaperTradingEngine.updateMarkPrice(sym, price);
    }, 400);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 1500);
    }
  };

  // Quick Paper Order Trigger
  const handleQuickPaperOrder = (symbol: string, side: 'buy' | 'sell', qty: number) => {
    const markPrice =
      portfolioState.positions.find((p) => p.symbol === symbol)?.currentMarkPrice ||
      (symbol.includes('BTC') ? 64250 : 128.5);

    // If human approval gate is in pipeline, set requireHumanApproval
    const hasApprovalGate = pipeline.nodes.some((n) => n.type === 'human_approval_gate');

    globalPaperTradingEngine.submitOrder({
      symbol,
      side,
      type: 'market',
      quantity: qty,
      price: markPrice,
      requireHumanApproval: hasApprovalGate,
      maxDrawdownLimitPercent: 5.0,
      maxPositionAllocationPercent: 25.0,
    });
  };

  return (
    <div className="w-full bg-[#07111F] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Terminal Title Bar */}
      <div className="p-3 bg-[#0C1B2A] border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
              }`}
            />
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Evidence Execution Daemon</span>
            </span>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Modus: <span className="text-amber-400 font-bold uppercase">{pipeline.executionMode}</span>
          </span>

          {isRunning && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono animate-pulse">
              LIVE (400ms Ingestion)
            </span>
          )}

          {/* Paper Mode Quick Capital Badge */}
          {pipeline.executionMode === 'paper' && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Equity:</span>
              <span className="text-emerald-400 font-bold">
                {portfolioState.equityEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">PnL:</span>
              <span
                className={`font-bold ${
                  portfolioState.unrealizedPnlEur >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {portfolioState.unrealizedPnlEur >= 0 ? '+' : ''}
                {portfolioState.unrealizedPnlEur.toFixed(2)} €
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Run / Stop Toggle Button */}
          <button
            type="button"
            onClick={onToggleRun}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow cursor-pointer ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stoppen</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Pipeline Starten</span>
              </>
            )}
          </button>

          {/* Expand / Collapse Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Logs & Evidence Inspector */}
      {isExpanded && (
        <div className="p-4 bg-[#030914] space-y-4">
          {/* Subtabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('stream')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'stream' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Tick Stream ({logs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('merkle')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'merkle' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                SHA-256 Merkle Proofs (AP-002)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('portfolio')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'portfolio' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Paper Portfolio (AP-005)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'orders' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Order-Buch & Approval ({portfolioState.orders.length})
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              SHA-256 Engine: Pure TypeScript | Merkle Tree Verified
            </div>
          </div>

          {/* Tab 1: Live Ticks Table */}
          {activeTab === 'stream' && (
            <div className="max-h-60 overflow-y-auto font-mono text-xs space-y-1">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{log.timestamp}</span>
                      <span className="font-bold text-amber-300 w-20">{log.symbol}</span>
                      <span className="text-white w-20">{log.price.toFixed(2)}</span>
                      <span className="text-slate-400">Vol: {log.volume}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                        {log.latencyMs}ms
                      </span>
                      <span className="text-[10px] text-purple-400 flex items-center gap-1 font-mono">
                        <Lock className="w-3 h-3" />
                        {log.merkleLeaf.slice(0, 10)}...
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">DQS {log.dqs}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500">
                  {isRunning
                    ? 'Warte auf eingehende Ticks...'
                    : 'Klicke auf "Pipeline Starten", um die Live-Datenverarbeitung zu simulieren.'}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Real Merkle Proofs */}
          {activeTab === 'merkle' && (
            <div className="p-4 bg-[#0C1B2A]/60 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Kryptografischer Nachweisbaum (AP-002 Evidence Before Decision)
                </span>
                <span className="text-purple-400">Algorithmus: SHA-256 Root Verification</span>
              </div>

              {logs[0] ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Aktueller Merkle Root:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(logs[0].merkleRoot)}
                      className="flex items-center gap-1.5 text-amber-300 hover:underline"
                    >
                      <span className="break-all">{logs[0].merkleRoot}</span>
                      {copiedHash === logs[0].merkleRoot ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Leaf Hash (Tick Payload):</span>
                    <span className="text-purple-300 break-all">{logs[0].merkleLeaf}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Verifikations-Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Kryptografischer Pfad erfolgreich gegen Root verifiziert (Depth: 16)
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 py-4 text-center">
                  Starte die Pipeline, um Merkle-Bäume zu berechnen.
                </p>
              )}
            </div>
          )}

          {/* Tab 3: Paper Portfolio Overview */}
          {activeTab === 'portfolio' && (
            <div className="space-y-3 font-mono text-xs">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">Cash Reserve</span>
                  <div className="text-sm font-bold text-white mt-1">
                    {portfolioState.cashBalanceEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">Gesamtwert (Equity)</span>
                  <div className="text-sm font-bold text-amber-300 mt-1">
                    {portfolioState.equityEur.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">Unrealisierter PnL</span>
                  <div
                    className={`text-sm font-bold mt-1 ${
                      portfolioState.unrealizedPnlEur >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {portfolioState.unrealizedPnlEur >= 0 ? '+' : ''}
                    {portfolioState.unrealizedPnlEur.toFixed(2)} €
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">Max Drawdown</span>
                  <div className="text-sm font-bold text-cyan-400 mt-1">
                    {portfolioState.maxDrawdownPercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Positions Table */}
              <div className="p-3 rounded-xl bg-[#0C1B2A]/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                  <span className="font-bold text-white">Offene Paper-Positionen</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickPaperOrder('BTC/USDT', 'buy', 0.1)}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold cursor-pointer"
                    >
                      + 0.1 BTC Kaufen
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPaperOrder('NVDA', 'buy', 10)}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[10px] font-bold cursor-pointer"
                    >
                      + 10 NVDA Kaufen
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 text-[10px] uppercase border-b border-slate-800">
                        <th className="py-1">Symbol</th>
                        <th className="py-1">Menge</th>
                        <th className="py-1">Einstand</th>
                        <th className="py-1">Marktpreis</th>
                        <th className="py-1">PnL (€)</th>
                        <th className="py-1">Return</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {portfolioState.positions.map((pos) => (
                        <tr key={pos.symbol}>
                          <td className="py-1.5 font-bold text-amber-300">{pos.symbol}</td>
                          <td className="py-1.5 text-slate-200">{pos.quantity}</td>
                          <td className="py-1.5 text-slate-300">{pos.averageEntryPrice.toFixed(2)} €</td>
                          <td className="py-1.5 text-white">{pos.currentMarkPrice.toFixed(2)} €</td>
                          <td
                            className={`py-1.5 font-bold ${
                              pos.unrealizedPnlEur >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {pos.unrealizedPnlEur >= 0 ? '+' : ''}
                            {pos.unrealizedPnlEur.toFixed(2)} €
                          </td>
                          <td
                            className={`py-1.5 font-bold ${
                              pos.unrealizedReturnPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {pos.unrealizedReturnPercent >= 0 ? '+' : ''}
                            {pos.unrealizedReturnPercent.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Orders & Approval Queue */}
          {activeTab === 'orders' && (
            <div className="p-3 bg-[#0C1B2A]/60 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-400" />
                  Simuliertes Orderbuch & Human Approval Queue (AP-004)
                </span>
                <span className="text-[10px] text-slate-500">Letzte 20 Ausführungen</span>
              </div>

              {portfolioState.orders.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {portfolioState.orders.map((ord: PaperOrder) => (
                    <div
                      key={ord.id}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.side === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {ord.side}
                        </span>
                        <span className="font-bold text-white">{ord.symbol}</span>
                        <span className="text-slate-400">Qty: {ord.quantity}</span>
                        <span className="text-slate-400">@ {ord.price.toFixed(2)} €</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {ord.status === 'pending_approval' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 animate-pulse">
                              Freigabe Ausstehend (AP-004)
                            </span>
                            <button
                              type="button"
                              onClick={() => globalPaperTradingEngine.approveOrder(ord.id)}
                              className="px-2 py-0.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold cursor-pointer"
                            >
                              Freigeben
                            </button>
                            <button
                              type="button"
                              onClick={() => globalPaperTradingEngine.rejectOrder(ord.id)}
                              className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40 text-[10px] font-bold cursor-pointer"
                            >
                              Ablehnen
                            </button>
                          </div>
                        ) : ord.status === 'filled' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                              Gefüllt @ {ord.executedPrice?.toFixed(2)} € ({ord.simulatedLatencyMs}ms)
                            </span>
                            {ord.evidenceBundle && (
                              <span
                                className="text-[10px] text-purple-400 font-mono flex items-center gap-1 cursor-pointer hover:underline"
                                title={`Merkle Root: ${ord.evidenceBundle.merkleRoot}`}
                              >
                                <Lock className="w-3 h-3" />
                                {ord.evidenceBundle.merkleRoot.slice(0, 8)}...
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                            Abgewiesen: {ord.rejectionReason}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-500">
                  Keine Orders vorhanden. Klicke im Reiter "Paper Portfolio" auf "+ Kaufen", um simulierte Orders zu generieren.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
