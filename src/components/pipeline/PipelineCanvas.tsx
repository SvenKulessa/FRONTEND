/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Interactive Visual Graph Canvas with SVG Bézier Edges & Wire Connector
 */

import React, { useState, useRef, useCallback } from 'react';
import { Plus, ZoomIn, ZoomOut, Maximize2, Trash2, Zap } from 'lucide-react';
import { PipelineNode, PipelineEdge } from '../../contracts';
import { PipelineNodeComponent } from './PipelineNodeComponent';

interface PipelineCanvasProps {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  onDeleteNode: (nodeId: string) => void;
  onOpenNodeSettings: (node: PipelineNode) => void;
  onConnectPorts: (sourceNodeId: string, sourcePortId: string, targetNodeId: string, targetPortId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onOpenAddNodeModal: () => void;
}

export const PipelineCanvas: React.FC<PipelineCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onUpdateNodePosition,
  onDeleteNode,
  onOpenNodeSettings,
  onConnectPorts,
  onDeleteEdge,
  onOpenAddNodeModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Port connection draft state
  const [connectingState, setConnectingState] = useState<{
    sourceNodeId: string;
    sourcePortId: string;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Dragging Nodes
  const handleMouseDownNode = (nodeId: string, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Primary button only
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setDraggedNodeId(nodeId);
    setDragOffset({
      x: e.clientX / zoom - node.position.x,
      y: e.clientY / zoom - node.position.y,
    });
    onSelectNode(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      const newX = Math.max(20, Math.round((e.clientX / zoom - dragOffset.x) / 10) * 10);
      const newY = Math.max(20, Math.round((e.clientY / zoom - dragOffset.y) / 10) * 10);
      onUpdateNodePosition(draggedNodeId, { x: newX, y: newY });
    }

    if (connectingState && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setConnectingState((prev) =>
        prev
          ? {
              ...prev,
              currentX: (e.clientX - rect.left) / zoom,
              currentY: (e.clientY - rect.top) / zoom,
            }
          : null
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
    if (connectingState) {
      setConnectingState(null);
    }
  };

  // Start connection wire
  const handleStartConnection = (nodeId: string, portId: string, portType: any, e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / zoom;
    const startY = (e.clientY - rect.top) / zoom;

    setConnectingState({
      sourceNodeId: nodeId,
      sourcePortId: portId,
      startX,
      startY,
      currentX: startX,
      currentY: startY,
    });
  };

  // End connection wire on target input port
  const handleEndConnection = (targetNodeId: string, targetPortId: string) => {
    if (connectingState && connectingState.sourceNodeId !== targetNodeId) {
      onConnectPorts(
        connectingState.sourceNodeId,
        connectingState.sourcePortId,
        targetNodeId,
        targetPortId
      );
    }
    setConnectingState(null);
  };

  // Calculate curve endpoints
  const getNodePortCoordinates = (nodeId: string, portId: string, isOutput: boolean) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    // Node width is 288px (w-72), header ~48px
    const x = isOutput ? node.position.x + 288 : node.position.x;
    const y = node.position.y + 130;
    return { x, y };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => onSelectNode(null)}
      className="relative w-full h-[650px] bg-[#030914] overflow-hidden select-none border border-slate-800 rounded-3xl"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.1) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Zoom & Canvas Tool Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#0C1B2A]/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Vergrößern"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-slate-400 px-1">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Verkleinern"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom(1.0)}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Ansicht zurücksetzen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-5 bg-slate-800 mx-1" />
        <button
          type="button"
          onClick={onOpenAddNodeModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-xl shadow-md shadow-amber-400/20 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Knoten</span>
        </button>
      </div>

      {/* Scaled Canvas Container */}
      <div
        className="w-full h-full absolute inset-0 origin-top-left"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* SVG Edge Curves Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: 2500, minHeight: 2000 }}>
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFB020" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Persistent Edges */}
          {edges.map((edge) => {
            const start = getNodePortCoordinates(edge.sourceNodeId, edge.sourcePortId, true);
            const end = getNodePortCoordinates(edge.targetNodeId, edge.targetPortId, false);
            const dx = Math.abs(end.x - start.x) * 0.5;
            const pathData = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`;

            return (
              <g key={edge.id} className="group pointer-events-auto cursor-pointer">
                {/* Invisible wide hit area for easy click to delete */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="24"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Möchtest du diese Verbindung trennen?')) {
                      onDeleteEdge(edge.id);
                    }
                  }}
                />
                {/* Visual Glow Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="url(#edgeGradient)"
                  strokeWidth="2.5"
                  className="opacity-70 group-hover:opacity-100 group-hover:stroke-amber-400 transition-all"
                  filter="url(#glow)"
                />
                {/* Animated Flow Pulse */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="6 14"
                  className="opacity-40 animate-[dash_1.5s_linear_infinite]"
                />
              </g>
            );
          })}

          {/* Active Wire being dragged */}
          {connectingState && (
            <path
              d={`M ${connectingState.startX} ${connectingState.startY} C ${
                connectingState.startX + 60
              } ${connectingState.startY}, ${connectingState.currentX - 60} ${
                connectingState.currentY
              }, ${connectingState.currentX} ${connectingState.currentY}`}
              fill="none"
              stroke="#00E5FF"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
              cursor: draggedNodeId === node.id ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDownNode(node.id, e)}
          >
            <PipelineNodeComponent
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={onSelectNode}
              onDelete={onDeleteNode}
              onOpenSettings={onOpenNodeSettings}
              onStartConnection={handleStartConnection}
              onEndConnection={handleEndConnection}
              isConnecting={connectingState !== null}
            />
          </div>
        ))}
      </div>

      {/* Empty State Overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <Zap className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">Leere Pipeline</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Füge Knoten über den Button oben rechts hinzu oder wähle eines der vorgefertigten Templates aus.
          </p>
        </div>
      )}
    </div>
  );
};
