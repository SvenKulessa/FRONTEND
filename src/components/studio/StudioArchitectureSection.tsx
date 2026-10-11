/**
 * ============================================================================
 * CAPITAL AI — STUDIO HUB: PIPELINE ARCHITEKTUR & DATENKONZEPTE
 * ----------------------------------------------------------------------------
 * Aufgeräumte 5-Ebenen Ingestion-Architektur, BaFin MaRisk (AT 7.2) WORM Spezifikation
 * und interaktiver Explorer für alle 16 kanonischen Marktdaten-Konzepte.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Layers,
  Shield,
  Search,
  Filter,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Server,
  Database,
  Cpu,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { DATA_CONCEPTS, DataConcept } from '../../data/studioData';

export const StudioArchitectureSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedConceptId, setExpandedConceptId] = useState<number | null>(1);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const categories = [
    'all',
    'Echtzeit & Streaming',
    'Konsistenz & Compliance',
    'Storage & Caching',
    'Redundanz & High-Availability',
    'Multi-Modal Intelligence',
    'Screener Contracts',
    'Audit & Event Sourcing',
    'Zeitmodell & Historisierung',
    'KI & Scoring',
    'Architektur & Skalierung',
    'Testing & Validierung',
    'Stammdaten & Symbologie',
    'Governance & Modularität',
  ];

  const filteredConcepts = DATA_CONCEPTS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.example.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = (snippet: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
      setCopiedSnippet(id);
      setTimeout(() => setCopiedSnippet(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0d1530] to-cyan-500/10 border border-amber-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>VOLLSTÄNDIGE ARCHITEKTUR-SPEZIFIKATION • 5 PIPELINE-EBENEN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              System- &amp; Pipeline-Architektur
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Die kanonische Marktdaten-Architektur von Capital-AI: Vom rohen Börsen-Ingress (Tier 1)
              über das 250ms Conflation-Gate (Tier 2) bis zum revisionssicheren BaFin MaRisk (AT 7.2)
              WORM-Speicher und allen 16 standardisierten Datenarchitektur-Mustern.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
              16 Datenkonzepte
            </span>
            <div className="flex items-center p-1 rounded-lg bg-black/40 border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-amber-400 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Karten
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  viewMode === 'table'
                    ? 'bg-amber-400 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tabelle
              </button>
            </div>
          </div>
        </div>

        {/* 5-Layer Visual Pipeline Architecture Ribbon */}
        <div className="mt-5 pt-5 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kanonischer 5-Ebenen Verarbeitungsfluss (End-to-End Sub-45ms):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <div className="text-[10px] text-cyan-400 font-bold">TIER 1: RAW INGRESS</div>
              <div className="text-white font-semibold">Börsen-WebSockets</div>
              <div className="text-[11px] text-slate-400">Kraken, Binance, Polygon, Twelve Data (&lt; 15 ms)</div>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30 space-y-1">
              <div className="text-[10px] text-amber-400 font-bold">TIER 2: TICK GATE</div>
              <div className="text-white font-semibold">250ms Conflation</div>
              <div className="text-[11px] text-slate-400">Outlier Detection &amp; 88,4% Bandbreitenfilter</div>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <div className="text-[10px] text-emerald-400 font-bold">TIER 3: FAN-OUT BUS</div>
              <div className="text-white font-semibold">Redis In-Memory</div>
              <div className="text-[11px] text-slate-400">Ringpuffer (3.600 Ticks) &amp; Pub/Sub Channels</div>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-purple-500/30 space-y-1">
              <div className="text-[10px] text-purple-400 font-bold">TIER 4: CONSUMER &amp; AI</div>
              <div className="text-white font-semibold">React 19 &amp; Gemini</div>
              <div className="text-[11px] text-slate-400">Virtualisierte UI-Tapes &amp; NLP Inferenz</div>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 space-y-1">
              <div className="text-[10px] text-emerald-300 font-bold">TIER 5: BAFIN WORM</div>
              <div className="text-white font-semibold">TimescaleDB &amp; S3</div>
              <div className="text-[11px] text-slate-400">SHA-256 Merkle Hashes &amp; 10 Jahre Revisionssicherheit</div>
            </div>
          </div>
        </div>

        {/* Search and Category Filter */}
        <div className="mt-5 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Datenkonzept, Zweck oder CAPITAL-AI Beispiel suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat === 'all' ? 'Alle Kategorien (16)' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="rounded-xl border border-slate-800 bg-[#090e21] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-mono uppercase text-slate-400">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Datenkonzept</th>
                  <th className="py-3.5 px-4 min-w-[260px]">Zweck</th>
                  <th className="py-3.5 px-4 min-w-[300px]">Typisches CAPITAL-AI-Beispiel</th>
                  <th className="py-3.5 px-4 min-w-[120px]">Latenz</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredConcepts.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr
                      onClick={() =>
                        setExpandedConceptId(
                          expandedConceptId === item.id ? null : item.id
                        )
                      }
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${
                        expandedConceptId === item.id ? 'bg-amber-400/5' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-bold">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{item.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {item.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">{item.purpose}</td>
                      <td className="py-3.5 px-4 font-mono text-amber-300 font-semibold">{item.example}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400">{item.latencyTarget}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-cyan-400 hover:text-cyan-300 font-mono text-xs inline-flex items-center gap-1">
                          {expandedConceptId === item.id ? 'Schließen' : 'Öffnen'}
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              expandedConceptId === item.id ? 'rotate-90' : ''
                            }`}
                          />
                        </span>
                      </td>
                    </tr>

                    {expandedConceptId === item.id && (
                      <tr className="bg-[#0c122a] border-b border-amber-500/20">
                        <td colSpan={6} className="p-5">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                Technische Erläuterung &amp; Funktionsweise
                              </h4>
                              <p className="text-xs text-slate-200 leading-relaxed">{item.details}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                                <div className="text-[11px] font-mono text-slate-400 mb-1">
                                  BaFin / Compliance
                                </div>
                                <div className="text-xs text-emerald-300 font-medium">
                                  {item.bafinCompliance}
                                </div>
                              </div>
                              <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                                <div className="text-[11px] font-mono text-slate-400 mb-1">
                                  Kosten- &amp; Bandbreiteneffekt
                                </div>
                                <div className="text-xs text-cyan-300 font-medium">
                                  {item.costImpact}
                                </div>
                              </div>
                              <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                                <div className="text-[11px] font-mono text-slate-400 mb-1">
                                  Latenz-SLA
                                </div>
                                <div className="text-xs text-amber-300 font-mono font-bold">
                                  {item.latencyTarget}
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                                <span>Code Contract (AP-001 Spezifikation)</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(item.contractCodeSnippet, `tbl-${item.id}`);
                                  }}
                                  className="text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedSnippet === `tbl-${item.id}` ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-emerald-400">Kopiert!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Snippet kopieren</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="p-3 rounded-lg bg-black/70 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                                {item.contractCodeSnippet}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConcepts.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl border transition-all ${
                expandedConceptId === item.id
                  ? 'bg-gradient-to-b from-[#0f1738] to-[#090e21] border-amber-400/50 shadow-lg shadow-amber-500/5'
                  : 'bg-[#090e21] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {item.id}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <span className="text-[10px] font-mono text-cyan-400">{item.category}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {item.latencyTarget}
                </span>
              </div>

              <div className="mb-2">
                <div className="text-[10px] font-mono uppercase text-slate-400">Zweck:</div>
                <div className="text-xs text-slate-200 font-medium">{item.purpose}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800/80 mb-3">
                <div className="text-[10px] font-mono uppercase text-amber-400/90 mb-0.5">
                  Typisches CAPITAL-AI-Beispiel:
                </div>
                <div className="text-xs font-mono font-bold text-amber-300 break-words">{item.example}</div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px] font-mono text-slate-400">
                {item.visualFlow.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      {step}
                    </span>
                    {idx < item.visualFlow.length - 1 && <span className="text-cyan-400">→</span>}
                  </React.Fragment>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setExpandedConceptId(expandedConceptId === item.id ? null : item.id)
                }
                className="w-full flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer"
              >
                <span>
                  {expandedConceptId === item.id
                    ? 'Technische Details verbergen'
                    : 'Architektur-Details & Code'}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    expandedConceptId === item.id ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {expandedConceptId === item.id && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">{item.details}</p>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-[11px] space-y-1">
                    <div>
                      <strong className="text-slate-400">BaFin Compliance: </strong>
                      <span className="text-emerald-300">{item.bafinCompliance}</span>
                    </div>
                    <div>
                      <strong className="text-slate-400">Budget-Wirkung: </strong>
                      <span className="text-cyan-300">{item.costImpact}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Schnittstellen-Vertrag</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.contractCodeSnippet, `card-${item.id}`)}
                        className="text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSnippet === `card-${item.id}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Kopieren</span>
                      </button>
                    </div>
                    <pre className="p-2.5 rounded-lg bg-black/80 border border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                      {item.contractCodeSnippet}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
