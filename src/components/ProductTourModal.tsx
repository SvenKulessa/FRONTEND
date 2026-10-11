/**
 * ============================================================================
 * CAPITAL AI — PRODUKT VORSTELLUNGSVIDEO & INTERAKTIVER RUNDGANG
 * ----------------------------------------------------------------------------
 * Vollständiges, hochauflösendes Vorstellungsvideo der Website bezogen auf:
 * 1. Website & Terminal Ansicht (Live-Marktdaten, 50+ Börsen, Modulare rotierende Hero-Erde)
 * 2. Learning Portal (Quant-Glossar, Faustformeln, Praxis-Guides & Rechner)
 * 3. Blueprints für Scoring & Pipeline (Master Enterprise Score 0–100, 7 kanonische Blueprints)
 * 4. Umschaltbar zwischen 'video' (animiertes Zeitachsen-Video mit Voice/Audio-Chime)
 *    und 'interactive' (interaktiver geführter Schritt-für-Schritt Rundgang)
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  Zap,
  Globe2,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Brain,
  Sliders,
  Compass,
  Cpu,
  MonitorPlay,
  ListFilter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';

export interface ProductTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAnalysis: () => void;
  onNavigateToRoute?: (route: string) => void;
}

export interface VideoScene {
  id: string;
  number: number;
  durationSeconds: number;
  chapter: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  routeTarget?: string;
  routeLabel?: string;
  primaryKeypoints: { icon: string; title: string; desc: string }[];
  visualType: 'terminal' | 'learning' | 'blueprints' | 'ecosystem';
  telemetryMetrics: { label: string; value: string; delta?: string; color?: string }[];
}

export const VIDEO_SCENES: VideoScene[] = [
  {
    id: 'website-terminal',
    number: 1,
    durationSeconds: 14,
    chapter: '01 · Website & Terminal Ansicht',
    badge: 'LIVE TERMINAL ARCHITEKTUR',
    badgeColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    title: 'Echtzeit-Terminal & Modulare Hero-Erde',
    subtitle: 'Ultra-Low Latency Marktdaten & 50+ vernetzte Börsenplätze',
    description:
      'Capital-AI verbindet weltweite Handelsplätze, Krypto-Exchanges und Devisenmärkte mit einer 4-Schichten Ingestion-Engine (<35ms E2E). Die modulare rotierende 3D Hero-Erde visualisiert weltweite Datenströme, lässt sich als Floating-Widget abkoppeln und begleitet Sie über die gesamte Website.',
    routeTarget: '/',
    routeLabel: 'Zur Terminal-Startseite',
    visualType: 'terminal',
    primaryKeypoints: [
      {
        icon: 'Globe2',
        title: '50+ Börsen & Gateways',
        desc: 'Frankfurt, London, New York, Tokio, Singapore & Krypto-Exchanges im kontinuierlichen T2 Ringpuffer.',
      },
      {
        icon: 'Zap',
        title: 'Modulare abkoppelbare Hero-Erde',
        desc: 'Fotorealistisches Original-Mesh mit Great-Circle Geodäten-Arcs, Drag-to-Spin & Telemetrie-Cockpit.',
      },
      {
        icon: 'BarChart3',
        title: 'Multi-Asset Screener',
        desc: 'Aktien, Rohstoffe, Krypto & Devisen mit Live-Preisen, Volatilitätsbändern und Sektoren-Radar.',
      },
    ],
    telemetryMetrics: [
      { label: 'Ingestion Latency', value: '18.4 ms', delta: '-12%', color: 'text-emerald-400' },
      { label: 'Active Gateways', value: '54 Exchanges', delta: '100% SLA', color: 'text-cyan-400' },
      { label: 'Data Conflation', value: '4 Ticks/s Gate', delta: '88% Bandbreite gespart', color: 'text-amber-400' },
    ],
  },
  {
    id: 'learning-portal',
    number: 2,
    durationSeconds: 16,
    chapter: '02 · Learning Portal & Quant-Wissen',
    badge: 'LEARNING PORTAL & AKADEMISCHE STANDARDS',
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    title: 'Interaktives Glossar, Faustformeln & Praxis-Guides',
    subtitle: 'Vom Einsteiger-Wissen bis zu institutionellen Quant-Formeln',
    description:
      'Das Learning Portal macht komplexe Finanzmathematik transparent: Über 50 kuratierte Fachtermini mit mathematischen Formeln, praxiserprobten Faustformeln, realen Fallstudien und interaktiven Quiz-Modulen für verlässliche Anlageentscheidungen.',
    routeTarget: '/learning',
    routeLabel: 'Learning Portal öffnen',
    visualType: 'learning',
    primaryKeypoints: [
      {
        icon: 'BookOpen',
        title: 'Quant-Glossar & Formel-Terminal',
        desc: 'Altman Z-Score, Sharpe Ratio, WACC, DCF und VaR mit Copy-to-Clipboard und mathematischer Herleitung.',
      },
      {
        icon: 'Compass',
        title: 'Praxisnahe Faustformeln',
        desc: 'Sofort anwendbare Daumenregeln für Bewertung, Hebelbegrenzung und Portfoliodiversifikation.',
      },
      {
        icon: 'Brain',
        title: 'Interaktiver Wissens-Check',
        desc: 'Testen Sie Ihr Wissen über Marktmechanismen, BaFin-Compliance und institutionelle Risikomodelle.',
      },
    ],
    telemetryMetrics: [
      { label: 'Kuratierte Termini', value: '52 Definitionen', delta: 'Mit Formeln', color: 'text-amber-400' },
      { label: 'Wissens-Module', value: 'Glossar · Guides · Quiz', delta: '3 Bereiche', color: 'text-cyan-400' },
      { label: 'Verständlichkeit', value: '100% Open Access', delta: 'Keine Paywall', color: 'text-emerald-400' },
    ],
  },
  {
    id: 'blueprints-scoring',
    number: 3,
    durationSeconds: 18,
    chapter: '03 · Blueprints für Scoring & Pipelines',
    badge: 'SCORING BLUEPRINTS & ARCHITEKTUR',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    title: 'Master Enterprise Score (0–100) & 7 Produktions-Blueprints',
    subtitle: 'Audit-sichere Bewertungsmodelle ohne intransparente Blackbox',
    description:
      'Entdecken Sie die 7 kanonischen Architektur-Blueprints für robuste Datenverarbeitung sowie die 6 Säulen unseres quantitativen Master-Scores: Fundamentale Bilanzgesundheit, Warren-Buffett Burggraben, Altman Z Insolvenzfrüherkennung, Piotroski F-Score und Financial NLP Sentiment.',
    routeTarget: '/studio/blueprints',
    routeLabel: 'Zu den 7 Blueprints im Studio',
    visualType: 'blueprints',
    primaryKeypoints: [
      {
        icon: 'Sliders',
        title: 'Master Enterprise Score (0–100)',
        desc: 'Gewichtete Synthese aus Bilanzstärke (30%), Moat (25%), Momentum (20%), Risiko (15%) und NLP (10%).',
      },
      {
        icon: 'Cpu',
        title: '7 Kanonische Blueprints',
        desc: 'Schlüsselfertige Architekturen: Tiered Live Data, Consensus Evidence Snapshot, Budget Caps und Redis Ringpuffer.',
      },
      {
        icon: 'ShieldCheck',
        title: 'BaFin MaRisk & Audit-Sicherheit',
        desc: 'Jede Score-Empfehlung wird durch einen kryptographischen SHA-256 Evidence-Fingerprint lückenlos historisiert.',
      },
    ],
    telemetryMetrics: [
      { label: 'Composite Score', value: '0 – 100 Skala', delta: 'Multi-Pillar', color: 'text-purple-400' },
      { label: 'Offizielle Blueprints', value: '7 Architekturen', delta: 'TypeScript & Redis', color: 'text-cyan-400' },
      { label: 'Monatliche API-Kosten', value: '< 35,00 € / Mo', delta: 'AP-006 Cap', color: 'text-emerald-400' },
    ],
  },
  {
    id: 'ecosystem-workflow',
    number: 4,
    durationSeconds: 14,
    chapter: '04 · Nahtloser Arbeitsablauf',
    badge: 'ALL-IN-ONE ANLAGEN-INTELLIGENZ',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    title: 'Ganzheitlicher Workflow: Screening, Lernen & Entscheiden',
    subtitle: 'Alles an einem Ort vereint für Privatanleger & professionelle Analysten',
    description:
      'Vom schnellen Marktüberblick im Terminal über das Nachschlagen quantitativer Formeln im Learning Portal bis zur technischen Konfiguration eigener Scoring-Pipelines im Studio Hub: Capital-AI vereint Transparenz, Tiefe und Geschwindigkeit.',
    routeTarget: '/',
    routeLabel: 'Kostenlose Analyse starten',
    visualType: 'ecosystem',
    primaryKeypoints: [
      {
        icon: 'Sparkles',
        title: 'Keine Blackbox',
        desc: 'Volle Transparenz aller Faktoren, Rechenwege und Datenprovider ohne versteckte Kennzahlen.',
      },
      {
        icon: 'Layers',
        title: 'Studio Hub Integration',
        desc: 'Interaktiver Pipeline Builder, AI Kaufberater, Benchmark Lab und 16 kanonische Datenkonzepte.',
      },
      {
        icon: 'CheckCircle2',
        title: 'Sofort einsatzbereit',
        desc: 'Direkter Start im Browser auf Desktop, Tablet und Smartphone als installierbare Progressive Web App (PWA).',
      },
    ],
    telemetryMetrics: [
      { label: 'Plattform-Status', value: '100% Operational', delta: 'Sub-45ms', color: 'text-emerald-400' },
      { label: 'Verfügbarkeit', value: 'Web & PWA Ready', delta: 'Cross-Device', color: 'text-cyan-400' },
      { label: 'Einstieg', value: 'Kostenlos starten', delta: 'Sofort-Analyse', color: 'text-amber-400' },
    ],
  },
];

export const ProductTourModal: React.FC<ProductTourModalProps> = ({
  isOpen,
  onClose,
  onStartAnalysis,
  onNavigateToRoute,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [elapsedSceneTime, setElapsedSceneTime] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(performance.now());

  const currentScene = VIDEO_SCENES[currentSceneIndex];

  // Gesamtlänge & Gesamtfortschritt berechnen
  const totalDuration = useMemo(
    () => VIDEO_SCENES.reduce((acc, s) => acc + s.durationSeconds, 0),
    []
  );

  const overallElapsedSeconds = useMemo(() => {
    let priorSeconds = 0;
    for (let i = 0; i < currentSceneIndex; i++) {
      priorSeconds += VIDEO_SCENES[i].durationSeconds;
    }
    return priorSeconds + elapsedSceneTime;
  }, [currentSceneIndex, elapsedSceneTime]);

  const overallProgressPercent = Math.min(
    100,
    (overallElapsedSeconds / totalDuration) * 100
  );

  // Audio-Synthesizer: Dezentes kurzes akustisches Feedback bei Szenenwechsel (Web Audio API)
  const playChime = (frequency: number, durationMs: number = 180) => {
    if (isMuted) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Szenenwechsel Handler mit Audio-Gong
  const goToScene = (index: number) => {
    const safeIdx = Math.max(0, Math.min(VIDEO_SCENES.length - 1, index));
    setCurrentSceneIndex(safeIdx);
    setElapsedSceneTime(0);
    playChime(520 + safeIdx * 80, 200);
    setAudioFeedback(`Kapitel ${safeIdx + 1}: ${VIDEO_SCENES[safeIdx].title}`);
    setTimeout(() => setAudioFeedback(null), 2500);
  };

  // Video Playback Loop (Tick per requestAnimationFrame mit Zeitstempel)
  useEffect(() => {
    if (!isOpen) return;

    lastTickTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTickTimeRef.current) / 1000;
      lastTickTimeRef.current = currentTime;

      if (isPlaying) {
        setElapsedSceneTime((prev) => {
          const next = prev + dt * playbackSpeed;
          const max = currentScene.durationSeconds;
          if (next >= max) {
            // Nächste Szene ansteuern
            if (currentSceneIndex < VIDEO_SCENES.length - 1) {
              setCurrentSceneIndex((idx) => idx + 1);
              playChime(660, 250);
              return 0;
            } else {
              // Am Ende anhalten
              setIsPlaying(false);
              return max;
            }
          }
          return next;
        });
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, isPlaying, playbackSpeed, currentSceneIndex, currentScene.durationSeconds]);

  // Tastatursteuerung: Space (Play/Pause), Pfeile (vor/zurück), M (Stumm), Esc (Schließen)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentSceneIndex < VIDEO_SCENES.length - 1) {
          goToScene(currentSceneIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentSceneIndex > 0) {
          goToScene(currentSceneIndex - 1);
        }
      } else if (e.key.toLowerCase() === 'm') {
        setIsMuted((m) => !m);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSceneIndex, onClose]);

  if (!isOpen) return null;

  const currentProgressPercent = Math.min(
    100,
    (elapsedSceneTime / currentScene.durationSeconds) * 100
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Website Vorstellungsvideo: Terminal, Learning Portal & Blueprints"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto"
    >
      <div
        ref={containerRef}
        className={`relative w-full ${
          isFullscreen ? 'max-w-none h-full' : 'max-w-5xl max-h-[94vh]'
        } rounded-3xl bg-[#040816] border border-amber-500/40 shadow-[0_0_90px_rgba(245,176,20,0.18)] overflow-hidden flex flex-col my-auto transition-all duration-300`}
      >
        {/* ==================================================================== */}
        {/* TOP BAR / CINEMATIC HEADER */}
        {/* ==================================================================== */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-amber-400/10 via-[#081232] to-cyan-500/10 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo variant="emblem" size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  Capital-AI · Offizielle Website- &amp; Produkt-Präsentation
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  4K INTERACTIVE TOUR
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden md:block">
                Fokus: Live Terminal Ansicht · Learning Portal &amp; Quant-Glossar · 7 Blueprints &amp; Scoring Engine
              </p>
            </div>
          </div>

          {/* Quick Actions: Audio, Fullscreen, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Audio-Signale aktivieren' : 'Stummschalten (M)'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-white/5 border-slate-800 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Fenstermodus' : 'Vollbildmodus'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              title="Präsentation schließen (Esc)"
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* CHAPTER NAVIGATION BAR (TAB MARKERS) */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-4 bg-[#030612] border-b border-slate-800/80 px-2 sm:px-6 py-2 gap-1 sm:gap-2 text-left">
          {VIDEO_SCENES.map((scene, idx) => {
            const isActive = currentSceneIndex === idx;
            const isCompleted = currentSceneIndex > idx;

            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => goToScene(idx)}
                className={`flex flex-col p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer text-left relative overflow-hidden group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400/15 via-amber-400/5 to-transparent border border-amber-400/50 shadow-md'
                    : isCompleted
                    ? 'bg-slate-900/40 border border-slate-800 hover:border-slate-700'
                    : 'bg-transparent border border-transparent hover:border-slate-800/80 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                  <span
                    className={`font-bold ${
                      isActive ? 'text-amber-300' : isCompleted ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="text-[9px] text-slate-400 hidden md:inline">
                    {scene.durationSeconds}s
                  </span>
                </div>
                <div
                  className={`text-[11px] sm:text-xs font-bold truncate ${
                    isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {scene.chapter.split('· ')[1] || scene.chapter}
                </div>

                {/* Mini Progress Bar inside Tab */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isActive
                        ? 'bg-amber-400'
                        : isCompleted
                        ? 'bg-emerald-400 w-full'
                        : 'bg-transparent w-0'
                    }`}
                    style={{
                      width: isActive ? `${currentProgressPercent}%` : undefined,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* ==================================================================== */}
        {/* MAIN VIDEO STAGE / CINEMATIC SCREEN */}
        {/* ==================================================================== */}
        <div className="relative flex-1 overflow-y-auto min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-4 sm:p-7 bg-radial from-[#071333] via-[#030818] to-[#01040d]">
          {/* Ambient Cosmic Grid & Glow */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-full bg-[linear-gradient(to_right,#f5b01408_1px,transparent_1px),linear-gradient(to_bottom,#f5b01408_1px,transparent_1px)] bg-[size:32px_32px]" />
          </div>

          {/* Audio Chime Notification Toast */}
          <AnimatePresence>
            {audioFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 text-xs font-mono font-bold backdrop-blur-md shadow-xl flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>{audioFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIVE SCENE CONTENT ANIMATION */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative z-10 flex flex-col h-full justify-between"
            >
              {/* Scene Eyebrow & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono font-bold border tracking-wider uppercase ${currentScene.badgeColor}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    {currentScene.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    Szene {currentScene.number} von {VIDEO_SCENES.length}
                  </span>
                </div>

                {/* Direct Action Jump Button to Website Section */}
                {currentScene.routeTarget && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onNavigateToRoute && currentScene.routeTarget) {
                        onNavigateToRoute(currentScene.routeTarget);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/35 hover:border-amber-400/70 text-amber-300 font-mono text-xs font-bold transition-all cursor-pointer group shadow-lg"
                  >
                    <span>{currentScene.routeLabel || 'Im Produkt ansehen'}</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                )}
              </div>

              {/* Scene Heading */}
              <div className="max-w-3xl mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {currentScene.title}
                </h3>
                <div className="text-sm sm:text-base font-semibold text-amber-300/90 mt-1">
                  {currentScene.subtitle}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed max-w-2xl">
                  {currentScene.description}
                </p>
              </div>

              {/* Interactive Keypoint Cards (3 Säulen pro Szene) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-2 sm:my-3">
                {currentScene.primaryKeypoints.map((point, i) => (
                  <div
                    key={i}
                    className="p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-slate-800/80 hover:border-amber-400/30 transition-all backdrop-blur-md flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                        {point.icon === 'Globe2' && <Globe2 className="w-4 h-4 text-cyan-400" />}
                        {point.icon === 'Zap' && <Zap className="w-4 h-4 text-amber-400" />}
                        {point.icon === 'BarChart3' && <BarChart3 className="w-4 h-4 text-emerald-400" />}
                        {point.icon === 'BookOpen' && <BookOpen className="w-4 h-4 text-amber-400" />}
                        {point.icon === 'Compass' && <Compass className="w-4 h-4 text-cyan-400" />}
                        {point.icon === 'Brain' && <Brain className="w-4 h-4 text-purple-400" />}
                        {point.icon === 'Sliders' && <Sliders className="w-4 h-4 text-purple-400" />}
                        {point.icon === 'Cpu' && <Cpu className="w-4 h-4 text-cyan-400" />}
                        {point.icon === 'ShieldCheck' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                        {point.icon === 'Sparkles' && <Sparkles className="w-4 h-4 text-amber-400" />}
                        {point.icon === 'Layers' && <Layers className="w-4 h-4 text-cyan-400" />}
                        {point.icon === 'CheckCircle2' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                        {point.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Telemetry Metric Strip */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {currentScene.telemetryMetrics.map((metric, mi) => (
                    <div key={mi} className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{metric.label}:</span>
                      <span className={`font-bold ${metric.color || 'text-white'}`}>
                        {metric.value}
                      </span>
                      {metric.delta && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                          {metric.delta}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>Zeit:</span>
                  <span className="text-amber-400 font-bold">
                    {Math.floor(elapsedSceneTime)}s / {currentScene.durationSeconds}s
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ==================================================================== */}
        {/* INTERACTIVE VIDEO PLAYER CONTROLS (BOTTOM BAR) */}
        {/* ==================================================================== */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#030612] border-t border-slate-800 flex flex-col gap-2.5 shrink-0">
          {/* Master Video Timeline Scrubber */}
          <div
            role="progressbar"
            aria-valuenow={Math.round(overallProgressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Video-Fortschritt"
            className="w-full h-2 bg-slate-800/80 rounded-full cursor-pointer relative overflow-hidden group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickFraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const targetSeconds = clickFraction * totalDuration;

              // Ziel-Szene errechnen
              let accumulated = 0;
              for (let i = 0; i < VIDEO_SCENES.length; i++) {
                const sDur = VIDEO_SCENES[i].durationSeconds;
                if (targetSeconds <= accumulated + sDur || i === VIDEO_SCENES.length - 1) {
                  setCurrentSceneIndex(i);
                  setElapsedSceneTime(targetSeconds - accumulated);
                  break;
                }
                accumulated += sDur;
              }
            }}
          >
            {/* Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 rounded-full relative transition-all duration-100"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>

          {/* Control Buttons & Playback Options */}
          <div className="flex items-center justify-between gap-2">
            {/* Left: Play/Pause, Rewind, Scene Skips */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? 'Pausieren (Leertaste)' : 'Abspielen (Leertaste)'}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span className="hidden sm:inline">Abspielen</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentSceneIndex(0);
                  setElapsedSceneTime(0);
                  setIsPlaying(true);
                  playChime(440, 150);
                }}
                title="Von Anfang an abspielen"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Prev Scene */}
              <button
                type="button"
                disabled={currentSceneIndex === 0}
                onClick={() => goToScene(currentSceneIndex - 1)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                  currentSceneIndex === 0
                    ? 'opacity-30 border-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-white/5 border-slate-800 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Zurück
              </button>

              {/* Next Scene */}
              <button
                type="button"
                disabled={currentSceneIndex === VIDEO_SCENES.length - 1}
                onClick={() => goToScene(currentSceneIndex + 1)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                  currentSceneIndex === VIDEO_SCENES.length - 1
                    ? 'opacity-30 border-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-white/5 border-slate-800 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Vor
              </button>

              {/* Speed Multiplier Button */}
              <button
                type="button"
                onClick={() =>
                  setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))
                }
                title="Wiedergabegeschwindigkeit umschalten"
                className="px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-mono text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
              >
                {playbackSpeed}x Tempo
              </button>
            </div>

            {/* Right: Primary Call to Action */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartAnalysis();
                }}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/20 transition-all cursor-pointer group"
              >
                <span>Jetzt Analyse starten</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
