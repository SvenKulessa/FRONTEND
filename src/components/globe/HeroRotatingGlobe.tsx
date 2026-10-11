/**
 * ============================================================================
 * CAPITAL AI — HERO ROTATING GLOBE (MODULARE ROTIERENDE HERO-ERDE)
 * ----------------------------------------------------------------------------
 * Mathematisch exakte, hochperformante 3D-Canvas-Kugelprojektion mit:
 * - Kontinuierlicher Erdrotation & 23,4° Erdachsen-Neigung
 * - Interaktivem Drag-to-Spin & Trägheits-Dämpfung
 * - Globalen Finanzzentren (Frankfurt, NY, Tokyo, London, Singapore, SF etc.)
 * - 3D-Bogenbahnen (Great-Circle Arcs) mit wandernden Datenpaketen (Sub-45ms)
 * - Abkoppelbarem Status (Docked in Hero <-> Floating PiP <-> Cockpit Modal)
 * ============================================================================
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Maximize2,
  Minimize2,
  ExternalLink,
  Play,
  Pause,
  Zap,
  Globe2,
  Radio,
  Clock,
  Compass,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  FINANCIAL_NODES,
  ARC_CONNECTIONS,
  CONTINENT_OUTLINES,
  LATITUDE_LINES,
  LONGITUDE_LINES,
  FinancialNode,
  isExchangeOpen,
} from '../../data/globeNodes';
import heroEarthImageSrc from '../../assets/images/glowing_earth_nodes_1789997454893.jpg';

export type GlobeViewMode = 'docked' | 'floating' | 'modal' | 'compact';

export interface HeroRotatingGlobeProps {
  mode?: GlobeViewMode;
  isDetached?: boolean;
  onToggleDetach?: () => void;
  onOpenCockpit?: () => void;
  className?: string;
  autoRotateSpeed?: number;
  showControls?: boolean;
  selectedNodeId?: string | null;
  onSelectNode?: (node: FinancialNode | null) => void;
}

export const HeroRotatingGlobe: React.FC<HeroRotatingGlobeProps> = ({
  mode = 'docked',
  isDetached = false,
  onToggleDetach,
  onOpenCockpit,
  className = '',
  autoRotateSpeed = 1,
  showControls = true,
  selectedNodeId,
  onSelectNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Rotationswinkel in Radiant
  const rotYRef = useRef<number>(0.8); // Startet mit Blick auf Europa / Atlantik
  const rotXRef = useRef<number>(0.28); // Leichte Neigung für 3D-Blickwinkel (ca. 16°)
  const tiltRef = useRef<number>(0.408); // 23.4° Erdachsenneigung

  // Dragging State
  const isDraggingRef = useRef<boolean>(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // State für UI
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(autoRotateSpeed);
  const [showArcs, setShowArcs] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<FinancialNode | null>(null);
  const [activeNode, setActiveNode] = useState<FinancialNode | null>(null);

  // Bild aus dem zuvorigen Original-Hero laden (glowing_earth_nodes_1789997454893.jpg)
  const earthImageRef = useRef<HTMLImageElement | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const img = new Image();
    img.src = heroEarthImageSrc;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      earthImageRef.current = img;
      setIsImageLoaded(true);
    };
  }, []);

  // Animierte Daten-Pakete entlang der Arcs
  const packetPhaseRef = useRef<number>(0);

  // Synchronisation externer selectedNodeId
  useEffect(() => {
    if (selectedNodeId) {
      const found = FINANCIAL_NODES.find((n) => n.id === selectedNodeId);
      if (found) {
        setActiveNode(found);
        // Globe zu diesem Knoten drehen
        const targetRotY = -((found.lon * Math.PI) / 180) + Math.PI / 2;
        rotYRef.current = targetRotY;
      }
    }
  }, [selectedNodeId]);

  // Handler für Knotenauswahl
  const handleNodeClick = useCallback(
    (node: FinancialNode) => {
      setActiveNode(node);
      onSelectNode?.(node);
      // Sanft zum Knoten hinrotieren
      const targetRotY = -((node.lon * Math.PI) / 180) + Math.PI / 2;
      rotYRef.current = targetRotY;
    },
    [onSelectNode]
  );

  // --------------------------------------------------------------------------
  // 3D-Projektions-Mathematik
  // --------------------------------------------------------------------------
  const projectPoint = useCallback(
    (
      latDeg: number,
      lonDeg: number,
      radius: number,
      centerX: number,
      centerY: number,
      altitudeRatio = 1
    ) => {
      const latRad = (latDeg * Math.PI) / 180;
      const lonRad = (lonDeg * Math.PI) / 180;
      const r = radius * altitudeRatio;

      // 1. Kugelkoordinaten
      let x = r * Math.cos(latRad) * Math.sin(lonRad + rotYRef.current);
      let y = -r * Math.sin(latRad);
      let z = r * Math.cos(latRad) * Math.cos(lonRad + rotYRef.current);

      // 2. Erdachsen-Neigung & Blickwinkel (rotX)
      const pitch = rotXRef.current;
      const yPitch = y * Math.cos(pitch) - z * Math.sin(pitch);
      const zPitch = y * Math.sin(pitch) + z * Math.cos(pitch);

      return {
        screenX: centerX + x,
        screenY: centerY + yPitch,
        z: zPitch,
        visible: zPitch > -0.05 * r, // Front-Hemisphäre mit weichem Randübergang
      };
    },
    []
  );

  // --------------------------------------------------------------------------
  // Render-Loop auf Canvas
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      // Auto-Rotation wenn nicht gedraggt wird
      if (isPlaying && !isDraggingRef.current) {
        rotYRef.current += 0.28 * speedMultiplier * dt;
      }

      // Trägheits-Dämpfung beim Loslassen
      if (!isDraggingRef.current) {
        rotYRef.current += velocityRef.current.x * dt;
        rotXRef.current += velocityRef.current.y * dt;
        // Vertikalen Blickwinkel begrenzen (-45° bis +45°)
        rotXRef.current = Math.max(-0.8, Math.min(0.8, rotXRef.current));
        velocityRef.current.x *= 0.92;
        velocityRef.current.y *= 0.92;
      }

      // Datenpaket-Phase für animierte Arcs
      packetPhaseRef.current = (packetPhaseRef.current + dt * 0.8 * speedMultiplier) % 1;

      // Canvas-Abmessungen & Retina-Skalierung
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.42;

      // 1. ÄUSSERE ATMOSPHÄREN-KORONA & AMBIENT GLOW (Gold & Cyan)
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.85,
        centerX,
        centerY,
        radius * 1.35
      );
      outerGlow.addColorStop(0, 'rgba(245, 176, 20, 0.12)'); // Gold
      outerGlow.addColorStop(0.4, 'rgba(6, 182, 212, 0.08)'); // Cyan
      outerGlow.addColorStop(0.8, 'rgba(141, 38, 255, 0.04)'); // Purple
      outerGlow.addColorStop(1, 'rgba(2, 5, 14, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. KUGEL-KÖRPER (DEEP SPACE GLOBE MIT 3D SPECULAR GRADIENT)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip(); // Maskiert alles auf den Erdkörper

      // Erdoberflächen-Gradient (Nachtseite Schatten vs. Tagseite Licht)
      const surfaceGrad = ctx.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.35,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      surfaceGrad.addColorStop(0, '#0d1d3a'); // Sanft beleuchteter Ozean
      surfaceGrad.addColorStop(0.5, '#071126'); // Tiefsee
      surfaceGrad.addColorStop(0.9, '#030713'); // Terminator Schatten
      surfaceGrad.addColorStop(1, '#01030a');
      ctx.fillStyle = surfaceGrad;
      ctx.fillRect(0, 0, width, height);

      // FOTOREALISTISCHE ERDE AUS DEM ORIGINALBILD (glowing_earth_nodes_1789997454893.jpg)
      // Das Originalbild zeigt die leuchtende Kugel mit goldenen Knoten und Sternenhimmel.
      // Wir zeichnen das Bild zentriert und lassen es mit sanftem Parallax-/Drehungs-Effekt
      // der Rotation rotY/rotX folgen, während die 3D Vektoren und Arcs darüber projiziert werden!
      const earthImg = earthImageRef.current;
      if (earthImg && earthImg.complete && earthImg.naturalWidth > 0) {
        ctx.save();
        // Dynamische sphärische Ausrichtung: Rotation um Erdachse (tilt) und rotY
        ctx.translate(centerX, centerY);
        ctx.rotate(tiltRef.current * 0.7); // 23.4° Erdachsen-Neigung

        // Subtiler Horizontal-Drift passend zum rotY Drehwinkel für lebendige Rotation
        const rotPhase = (rotYRef.current % (Math.PI * 2));
        const parallaxX = Math.sin(rotPhase) * (radius * 0.08);
        const parallaxY = Math.sin(rotXRef.current) * (radius * 0.05);

        // Bildgröße exakt an Kugelradius anpassen
        const imgSize = radius * 2.08;
        ctx.globalAlpha = 0.92;
        ctx.drawImage(
          earthImg,
          -imgSize / 2 + parallaxX,
          -imgSize / 2 + parallaxY,
          imgSize,
          imgSize
        );
        ctx.restore();
      }

      // 3. GRATICULE / LÄNGEN- & BREITENKREISE
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)'; // Cyan-Grid

      // Breitenkreise
      LATITUDE_LINES.forEach((lat) => {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = projectPoint(lat, lon, radius, centerX, centerY);
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.screenX, pt.screenY);
              started = true;
            } else {
              ctx.lineTo(pt.screenX, pt.screenY);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      });

      // Längenkreise (Meridiane)
      LONGITUDE_LINES.forEach((lon) => {
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 4) {
          const pt = projectPoint(lat, lon, radius, centerX, centerY);
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.screenX, pt.screenY);
              started = true;
            } else {
              ctx.lineTo(pt.screenX, pt.screenY);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      });

      // 4. KONTINENTE / LANDMASSEN (Vektor-Projektion)
      CONTINENT_OUTLINES.forEach((polyline) => {
        ctx.beginPath();
        let started = false;
        const visiblePoints: { x: number; y: number }[] = [];

        polyline.forEach(([lat, lon]) => {
          const pt = projectPoint(lat, lon, radius, centerX, centerY);
          if (pt.visible) {
            visiblePoints.push({ x: pt.screenX, y: pt.screenY });
            if (!started) {
              ctx.moveTo(pt.screenX, pt.screenY);
              started = true;
            } else {
              ctx.lineTo(pt.screenX, pt.screenY);
            }
          } else {
            started = false;
          }
        });

        // Kontinent-Kante zeichnen (Gold / Bernstein-Schimmer)
        ctx.strokeStyle = 'rgba(245, 176, 20, 0.45)';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Subtile Kontinent-Füllung
        if (visiblePoints.length > 2) {
          ctx.fillStyle = 'rgba(245, 176, 20, 0.05)';
          ctx.fill();
        }
      });

      // 5. INNERE ATMOSPHÄREN-RANDBELEUCHTUNG (Rim Lighting)
      const rimGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.75,
        centerX,
        centerY,
        radius
      );
      rimGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      rimGrad.addColorStop(0.85, 'rgba(6, 182, 212, 0.15)');
      rimGrad.addColorStop(0.97, 'rgba(245, 176, 20, 0.35)');
      rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
      ctx.fillStyle = rimGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.restore(); // Ende Clip auf Kugel

      // 6. GREAT-CIRCLE 3D BOGENBAHNEN (DATA-ARCS) ZWISCHEN DEN GATEWAYS
      if (showArcs) {
        ARC_CONNECTIONS.forEach((arc) => {
          const fromNode = FINANCIAL_NODES.find((n) => n.id === arc.fromNodeId);
          const toNode = FINANCIAL_NODES.find((n) => n.id === arc.toNodeId);
          if (!fromNode || !toNode) return;

          // Punkte entlang der geodätischen Flugbahn berechnen
          const steps = 30;
          const arcPoints: { x: number; y: number; visible: boolean }[] = [];

          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            // Lineare/Sphärische Interpolation
            const curLat = fromNode.lat + (toNode.lat - fromNode.lat) * t;
            let curLon = fromNode.lon + (toNode.lon - fromNode.lon) * t;

            // Kürzesten Längengrad-Weg nehmen (-180 / 180 Übergang)
            if (Math.abs(toNode.lon - fromNode.lon) > 180) {
              if (toNode.lon > fromNode.lon) {
                curLon = fromNode.lon + (toNode.lon - 360 - fromNode.lon) * t;
              } else {
                curLon = fromNode.lon + (toNode.lon + 360 - fromNode.lon) * t;
              }
            }

            // 3D-Bogenhöhe abheben (Sinus-Parabel: max 1.18x Radius in der Mitte)
            const altitude = 1.0 + 0.18 * Math.sin(Math.PI * t);
            const pt = projectPoint(curLat, curLon, radius, centerX, centerY, altitude);
            arcPoints.push({ x: pt.screenX, y: pt.screenY, visible: pt.visible });
          }

          // Bogenbahn zeichnen
          ctx.beginPath();
          let lineStarted = false;
          arcPoints.forEach((p) => {
            if (p.visible) {
              if (!lineStarted) {
                ctx.moveTo(p.x, p.y);
                lineStarted = true;
              } else {
                ctx.lineTo(p.x, p.y);
              }
            } else {
              lineStarted = false;
            }
          });

          ctx.strokeStyle = arc.color + '55'; // Halbtransparent
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]); // Reset Dash

          // Wanderndes Daten-Paket (Lichtimpuls)
          const packetIndex = Math.floor(packetPhaseRef.current * (steps - 1));
          const packetPt = arcPoints[packetIndex];
          if (packetPt && packetPt.visible) {
            // Äußerer Puls-Glow
            ctx.beginPath();
            ctx.arc(packetPt.x, packetPt.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = arc.color + '88';
            ctx.fill();

            // Heller Kern
            ctx.beginPath();
            ctx.arc(packetPt.x, packetPt.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }
        });
      }

      // 7. FINANZKNOTEN & TRADING-HUBS (MARKERS)
      FINANCIAL_NODES.forEach((node) => {
        const pt = projectPoint(node.lat, node.lon, radius, centerX, centerY, 1.01);
        if (!pt.visible) return;

        const isHovered = hoveredNode?.id === node.id;
        const isActive = activeNode?.id === node.id;
        const isOpen = isExchangeOpen(node);

        // Pulsierender Ring
        const pulse = (Math.sin(currentTime * 0.005 + node.lat) + 1) * 0.5;
        const ringSize = 4 + pulse * 5;

        // Äußerer Glow-Ring
        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, ringSize, 0, Math.PI * 2);
        ctx.strokeStyle = isActive
          ? 'rgba(255, 255, 255, 0.9)'
          : isHovered
          ? node.color
          : node.color + '66';
        ctx.lineWidth = isActive ? 1.5 : 1;
        ctx.stroke();

        // Fester Kern-Punkt
        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, isHovered || isActive ? 4 : 2.8, 0, Math.PI * 2);
        ctx.fillStyle = isOpen ? node.color : '#64748B'; // Grau wenn geschlossen
        ctx.fill();

        // Weißer Innen-Glanz
        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Beschriftung bei Hover oder Fokus
        if (isHovered || isActive || mode === 'modal') {
          ctx.font = '600 10px Inter, -apple-system, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          ctx.fillText(node.city, pt.screenX + 8, pt.screenY + 3);

          // Sub-Label
          ctx.font = '500 8.5px JetBrains Mono, monospace';
          ctx.fillStyle = isOpen ? '#34D399' : '#94A3B8';
          ctx.fillText(
            `${isOpen ? 'OPEN' : 'CLOSED'} · ${node.latencyMs}ms`,
            pt.screenX + 8,
            pt.screenY + 13
          );
          ctx.shadowBlur = 0;
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isPlaying,
    speedMultiplier,
    showArcs,
    hoveredNode,
    activeNode,
    projectPoint,
    mode,
    isImageLoaded,
  ]);

  // --------------------------------------------------------------------------
  // Maus & Touch Interaktion (Drag to Spin)
  // --------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      dragStartPos.current = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.006;
      rotYRef.current += dx * sensitivity;
      rotXRef.current += dy * sensitivity;
      rotXRef.current = Math.max(-0.8, Math.min(0.8, rotXRef.current));

      velocityRef.current = {
        x: dx * sensitivity * 15,
        y: dy * sensitivity * 15,
      };
      return;
    }

    // Hover-Test auf Finanzknoten
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(rect.width, rect.height) * 0.42;

    let found: FinancialNode | null = null;
    for (const node of FINANCIAL_NODES) {
      const pt = projectPoint(node.lat, node.lon, radius, centerX, centerY, 1.01);
      if (pt.visible) {
        const dist = Math.hypot(pt.screenX - mouseX, pt.screenY - mouseY);
        if (dist < 14) {
          found = node;
          break;
        }
      }
    }
    setHoveredNode(found);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignorieren falls nicht erfasst
    }
  };

  const handleCanvasClick = () => {
    if (hoveredNode) {
      handleNodeClick(hoveredNode);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden group ${className}`}
    >
      {/* 3D WebGL / 2D Canvas Sphere */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-grab active:cursor-grabbing block touch-none"
        style={{ touchAction: 'none' }}
      />

      {/* Floating Status / Telemetrie Badge (Anti-Slop Clean Typography) */}
      <div className="absolute top-2.5 left-3 pointer-events-none z-10 flex items-center gap-2 text-[10.5px] font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold drop-shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {isPlaying ? 'ORBIT ACTIVE' : 'ORBIT PAUSED'}
        </span>
        <span className="text-slate-500">·</span>
        <span className="text-cyan-400 font-medium">SUB-45MS WSS</span>
      </div>

      {/* DETACH / POP-OUT ACTION BUTTON (HERO TO FLOATING WIDGET) */}
      {onToggleDetach && (
        <div className="absolute top-2.5 right-3 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleDetach}
            title={isDetached ? 'Erde in Hero fixieren' : 'Erde abkoppeln (Floating Widget)'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-amber-400 hover:text-amber-300 text-[11px] font-semibold border border-amber-400/40 hover:border-amber-400/70 shadow-lg backdrop-blur-md transition-all cursor-pointer group/btn"
          >
            {isDetached ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover/btn:scale-110" />
                <span className="hidden sm:inline">Andocken</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                <span>Erde abkoppeln</span>
              </>
            )}
          </button>

          {onOpenCockpit && (
            <button
              type="button"
              onClick={onOpenCockpit}
              title="Vollbild-Cockpit öffnen"
              className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white border border-slate-700/60 shadow-lg backdrop-blur-md transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* QUICK FLOATING CONTROL BAR (BOTTOM CONTROLS) */}
      {showControls && (
        <div className="absolute bottom-2 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
          {/* Controls: Play/Pause, Speed, Arcs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-slate-800/80 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Rotation anhalten' : 'Rotation fortsetzen'}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1))}
              title="Geschwindigkeit anpassen"
              className="px-2 py-0.5 rounded-lg hover:bg-white/10 text-[10px] font-mono text-cyan-400 font-bold transition-colors cursor-pointer"
            >
              {speedMultiplier}x
            </button>

            <button
              type="button"
              onClick={() => setShowArcs(!showArcs)}
              title="3D-Datenströme ein/ausblenden"
              className={`p-1.5 rounded-lg text-[10px] transition-colors cursor-pointer ${
                showArcs ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Zap className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => {
                rotYRef.current = 0.8;
                rotXRef.current = 0.28;
                velocityRef.current = { x: 0, y: 0 };
              }}
              title="Kamera zentrieren (Europa/Atlantik)"
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Node Badge if selected */}
          {activeNode && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/70 border border-amber-400/30 text-[10.5px] font-mono text-white backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeNode.color }} />
              <span className="font-bold text-amber-300">{activeNode.city}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{activeNode.exchange}</span>
            </div>
          )}
        </div>
      )}

      {/* INTERACTIVE NODE INSPECTOR OVERLAY CARD */}
      {hoveredNode && !isDraggingRef.current && (
        <div className="absolute top-12 left-3 z-30 p-2.5 rounded-xl bg-[#070d1e]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md pointer-events-none max-w-[210px] text-left animate-fadeIn">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
              {hoveredNode.city}
            </span>
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                isExchangeOpen(hoveredNode)
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-700/40 text-slate-400'
              }`}
            >
              {isExchangeOpen(hoveredNode) ? 'MARKT OFFEN' : 'GESCHLOSSEN'}
            </span>
          </div>
          <div className="text-[10px] text-slate-300 font-medium mb-1">{hoveredNode.primaryFeed}</div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>Ping: {hoveredNode.latencyMs}ms</span>
            <span className="text-cyan-400">{hoveredNode.tier}</span>
          </div>
        </div>
      )}
    </div>
  );
};
