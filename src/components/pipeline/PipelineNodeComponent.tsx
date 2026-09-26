/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Visual Node Component for Pipeline Graph Canvas
 */

import React from 'react';
import {
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
  Trash2,
  Settings,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { PipelineNode, NodePort } from '../../contracts';
import { NODE_CATALOG } from '../../contracts/registry';

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

const CATEGORY_STYLES: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  ingestion: {
    bg: 'bg-cyan-950/40',
    border: 'border-cyan-500/40 hover:border-cyan-400',
    text: 'text-cyan-400',
    dot: 'bg-cyan-400',
  },
  authority: {
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/40 hover:border-emerald-400',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  transformation: {
    bg: 'bg-sky-950/40',
    border: 'border-sky-500/40 hover:border-sky-400',
    text: 'text-sky-400',
    dot: 'bg-sky-400',
  },
  analytics: {
    bg: 'bg-rose-950/40',
    border: 'border-rose-500/40 hover:border-rose-400',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
  },
  reasoning: {
    bg: 'bg-purple-950/40',
    border: 'border-purple-500/40 hover:border-purple-400',
    text: 'text-purple-400',
    dot: 'bg-purple-400',
  },
  risk: {
    bg: 'bg-red-950/40',
    border: 'border-red-500/40 hover:border-red-400',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
  backtest: {
    bg: 'bg-teal-950/40',
    border: 'border-teal-500/40 hover:border-teal-400',
    text: 'text-teal-400',
    dot: 'bg-teal-400',
  },
  egress: {
    bg: 'bg-indigo-950/40',
    border: 'border-indigo-500/40 hover:border-indigo-400',
    text: 'text-indigo-400',
    dot: 'bg-indigo-400',
  },
};

interface PipelineNodeComponentProps {
  node: PipelineNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onOpenSettings: (node: PipelineNode) => void;
  onStartConnection: (nodeId: string, portId: string, portType: any, e: React.MouseEvent) => void;
  onEndConnection: (nodeId: string, portId: string) => void;
  isConnecting: boolean;
}

export const PipelineNodeComponent: React.FC<PipelineNodeComponentProps> = ({
  node,
  isSelected,
  onSelect,
  onDelete,
  onOpenSettings,
  onStartConnection,
  onEndConnection,
  isConnecting,
}) => {
  const descriptor = NODE_CATALOG[node.type];
  const IconComponent = descriptor?.iconName && ICON_MAP[descriptor.iconName] ? ICON_MAP[descriptor.iconName] : Zap;
  const style = CATEGORY_STYLES[node.category] || CATEGORY_STYLES.ingestion;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      className={`relative w-72 rounded-2xl border backdrop-blur-xl transition-all select-none shadow-2xl ${style.bg} ${
        isSelected
          ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_30px_rgba(245,176,20,0.25)]'
          : `${style.border} hover:shadow-[0_0_20px_rgba(0,0,0,0.6)]`
      }`}
    >
      {/* Node Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 ${style.text}`}
            style={{ backgroundColor: `${descriptor?.color || '#00E5FF'}15` }}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {node.category}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white truncate max-w-[140px]" title={node.label}>
              {node.label}
            </h4>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSettings(node);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Konfiguration anpassen"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Knoten löschen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Node Body Details */}
      <div className="p-3 space-y-2">
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
          {descriptor?.description || node.description || 'Keine Beschreibung.'}
        </p>

        {/* Badge & Key Config parameter preview */}
        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/50">
          <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            {descriptor?.badge || node.type}
          </span>
          {node.config?.symbols ? (
            <span className="text-slate-400 font-mono truncate max-w-[100px]">
              {Array.isArray(node.config.symbols) ? node.config.symbols.join(', ') : ''}
            </span>
          ) : node.config?.maxLatencyMs ? (
            <span className="text-amber-400 font-mono">
              &le; {node.config.maxLatencyMs}ms
            </span>
          ) : (
            <span className="text-emerald-400 font-mono">Ready</span>
          )}
        </div>
      </div>

      {/* Ports: Left (Inputs) and Right (Outputs) */}
      <div className="relative px-3 pb-2 pt-1 flex justify-between items-center text-[10px] text-slate-400">
        {/* Inbound Ports (Left) */}
        <div className="space-y-1.5">
          {node.inputs.map((port: NodePort) => (
            <div key={port.id} className="relative flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEndConnection(node.id, port.id);
                }}
                className={`w-3.5 h-3.5 rounded-full border-2 border-slate-900 bg-cyan-400 transition-transform hover:scale-125 focus:scale-125 shadow-sm -ml-5 ${
                  isConnecting ? 'animate-pulse ring-2 ring-cyan-400/50' : ''
                }`}
                title={`Input: ${port.name} (${port.type})`}
              />
              <span className="text-[10px] text-slate-400 font-medium">
                {port.name}
              </span>
            </div>
          ))}
        </div>

        {/* Outbound Ports (Right) */}
        <div className="space-y-1.5 ml-auto text-right">
          {node.outputs.map((port: NodePort) => (
            <div key={port.id} className="relative flex items-center justify-end gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium">
                {port.name}
              </span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onStartConnection(node.id, port.id, port.type, e);
                }}
                className="w-3.5 h-3.5 rounded-full border-2 border-slate-900 bg-amber-400 transition-transform hover:scale-125 focus:scale-125 shadow-sm -mr-5 cursor-crosshair hover:bg-amber-300"
                title={`Output: ${port.name} (${port.type}) - Klicke und ziehe zum Verbinden`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
