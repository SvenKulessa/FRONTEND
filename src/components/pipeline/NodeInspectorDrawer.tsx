/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Node Configuration Inspector Drawer
 */

import React, { useState } from 'react';
import { X, Check, Save, RotateCcw, AlertTriangle, Info, Sliders, Code } from 'lucide-react';
import { PipelineNode } from '../../contracts';
import { NODE_CATALOG } from '../../contracts/registry';

interface NodeInspectorDrawerProps {
  node: PipelineNode | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateConfig: (nodeId: string, updatedConfig: Record<string, any>) => void;
}

export const NodeInspectorDrawer: React.FC<NodeInspectorDrawerProps> = ({
  node,
  isOpen,
  onClose,
  onUpdateConfig,
}) => {
  if (!isOpen || !node) return null;

  const descriptor = NODE_CATALOG[node.type];
  const [configValues, setConfigValues] = useState<Record<string, any>>(() => ({
    ...(descriptor?.defaultConfig || {}),
    ...(node.config || {}),
  }));
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [jsonText, setJsonText] = useState(() => JSON.stringify(configValues, null, 2));
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFieldChange = (key: string, value: any) => {
    const updated = { ...configValues, [key]: value };
    setConfigValues(updated);
    setJsonText(JSON.stringify(updated, null, 2));
    setValidationError(null);
  };

  const handleSave = () => {
    try {
      let finalConfig = configValues;
      if (activeTab === 'json') {
        finalConfig = JSON.parse(jsonText);
      }

      // Validate through Zod schema if available
      if (descriptor?.configSchema) {
        finalConfig = descriptor.configSchema.parse(finalConfig);
      }

      onUpdateConfig(node.id, finalConfig);
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'Validierungsfehler bei der Konfiguration.');
    }
  };

  const handleResetDefaults = () => {
    if (descriptor?.defaultConfig) {
      setConfigValues(descriptor.defaultConfig);
      setJsonText(JSON.stringify(descriptor.defaultConfig, null, 2));
      setValidationError(null);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#07111F] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 bg-[#0C1B2A]/90 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              {node.category}
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {node.id.slice(0, 14)}...</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">{node.label}</h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-3 border-b border-slate-800 bg-slate-900/50 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'form'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Parameter Formular</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'json'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>JSON Schema Editor</span>
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {validationError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {activeTab === 'form' ? (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#0C1B2A] border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-white block mb-1">Über diesen Knoten:</span>
              {descriptor?.description || node.description}
            </div>

            {/* Dynamic Form Generation from Config Object */}
            {Object.entries(configValues).map(([key, val]) => {
              const label = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());

              if (typeof val === 'boolean') {
                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div>
                      <label className="text-xs font-semibold text-slate-200 block">{label}</label>
                      <span className="text-[10px] text-slate-500 font-mono">{key}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFieldChange(key, !val)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                        val ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                          val ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              }

              if (typeof val === 'number') {
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-300">{label}</label>
                      <span className="text-[10px] text-slate-500 font-mono">{key}</span>
                    </div>
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => handleFieldChange(key, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                );
              }

              if (Array.isArray(val)) {
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-300">{label}</label>
                      <span className="text-[10px] text-slate-500 font-mono">Array ({val.length})</span>
                    </div>
                    <input
                      type="text"
                      value={val.join(', ')}
                      onChange={(e) =>
                        handleFieldChange(
                          key,
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      placeholder="Komma-getrennte Werte..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                );
              }

              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300">{label}</label>
                    <span className="text-[10px] text-slate-500 font-mono">{key}</span>
                  </div>
                  <input
                    type="text"
                    value={String(val)}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2 h-full flex flex-col">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Direkte JSON-Bearbeitung:</span>
              <span className="font-mono text-[10px] text-amber-400">Zod Schema Validated</span>
            </div>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={16}
              className="w-full flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-400 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-slate-800 bg-[#0C1B2A]/90 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Defaults</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 transition-transform active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Übernehmen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
