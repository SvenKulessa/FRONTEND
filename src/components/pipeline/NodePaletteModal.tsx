/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Searchable Node Catalog Palette Modal for Pipeline Composer
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Plus,
  Radio,
  Server,
  Rss,
  Link as LinkIcon,
  Globe,
  ShieldCheck,
  Lock,
  CheckCircle,
  Coins,
  Layers,
  BarChart2,
  Sliders,
  Activity,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  DollarSign,
  ExternalLink,
  Terminal,
  FileText,
  Filter,
} from 'lucide-react';
import { NODE_CATALOG, NodeCatalogDescriptor } from '../../contracts/registry';
import { NodeCategory } from '../../contracts';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Radio,
  Server,
  Rss,
  Link: LinkIcon,
  Globe,
  ShieldCheck,
  Lock,
  CheckCircle,
  Coins,
  Layers,
  BarChart2,
  Sliders,
  Activity,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  DollarSign,
  ExternalLink,
  Terminal,
  FileText,
};

const CATEGORIES: { id: 'all' | NodeCategory; label: string; count: number }[] = [
  { id: 'all', label: 'Alle Knoten', count: Object.keys(NODE_CATALOG).length },
  { id: 'ingestion', label: '1. Ingestion', count: 5 },
  { id: 'authority', label: '2. Authority & DQS', count: 4 },
  { id: 'transformation', label: '3. Transformation', count: 3 },
  { id: 'analytics', label: '4. Analytics & Score', count: 2 },
  { id: 'reasoning', label: '5. Reasoning', count: 1 },
  { id: 'risk', label: '6. Risk Gates', count: 2 },
  { id: 'backtest', label: '7. Backtest & Paper', count: 1 },
  { id: 'egress', label: '8. Egress Adapter', count: 3 },
];

interface NodePaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (type: string) => void;
}

export const NodePaletteModal: React.FC<NodePaletteModalProps> = ({
  isOpen,
  onClose,
  onAddNode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | NodeCategory>('all');

  const filteredNodes = useMemo(() => {
    return Object.values(NODE_CATALOG).filter((node: NodeCatalogDescriptor) => {
      const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
      const matchesSearch =
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.badge.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#07111F] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-[#0C1B2A]/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/10 text-amber-300 border border-amber-400/20">
                CAPITAL AI Node Catalog
              </span>
              <span className="text-xs text-slate-400">AP-001 Contract-First</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Knoten zur Pipeline hinzufügen</h3>
            <p className="text-xs text-slate-400">
              Wähle aus 21 verifizierten Knoten für Ingestion, Merkle Evidence, Feature-Engineering und Egress.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Knoten suchen (z.B. WebSocket, Merkle, Arrow, Orderflow, Paper Broker)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#050D1A] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Node Grid Content */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => {
            const IconComp = node.iconName && ICON_MAP[node.iconName] ? ICON_MAP[node.iconName] : Sparkles;
            return (
              <div
                key={node.type}
                className="group relative p-4 rounded-2xl border border-slate-800 bg-[#0C1B2A]/60 hover:bg-[#0C1B2A] hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
                      style={{
                        backgroundColor: `${node.color}20`,
                        color: node.color,
                      }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
                      {node.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {node.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 font-mono">
                    Ports: In ({node.defaultInputs.length}) / Out ({node.defaultOutputs.length})
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onAddNode(node.type);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-lg shadow-sm transition-transform active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Hinzufügen</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredNodes.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              <Filter className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold">Keine Knoten für diesen Filter gefunden.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs text-amber-400 hover:underline"
              >
                Suchfilter zurücksetzen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
