/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: HERO LANDING & BRAND CONSTELLATION]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : 
 *    - Luminous Glowing Earth Node Canvas mit goldenen neuronalen Lichtpfaden
 *    - Primärer Call-to-Action: "Analyse starten" (Goldener Button mit 3-Bar Chart Icon)
 *    - Sekundärer Call-to-Action: "Produkt entdecken" (Glassmorphic Play Button)
 * 2. SCORING-LOGIK        : 
 *    - Einstiegspunkt in die quantitative Analyse-Engine
 * 3. DATENANBINDUNG       : 
 *    - Callbacks `onStartAnalysis()` (öffnet AnalysisModal) und `onExploreProduct()` (ProductTourModal)
 * 4. DATENQUELLEN / FEEDS : 
 *    - Hochauflösende Vektor- und Bild-Assets (`heroEarthImage`)
 * ============================================================================
 */

import React from 'react';
import { ArrowRight, Play, BarChart2, Globe2, ArrowDownLeft, ExternalLink, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroRotatingGlobe } from './globe/HeroRotatingGlobe';

interface HeroProps {
  onStartAnalysis: () => void;
  onExploreProduct: () => void;
  isGlobeDetached?: boolean;
  onToggleGlobeDetach?: () => void;
  onOpenGlobeCockpit?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartAnalysis,
  onExploreProduct,
  isGlobeDetached = false,
  onToggleGlobeDetach,
  onOpenGlobeCockpit,
}) => {
  return (
    <section className="relative px-5 pt-4 pb-7 overflow-hidden">
      {/* Golden neural light trails mirroring the logo's lateral filaments */}
      <div className="absolute top-0 left-0 right-0 h-44 pointer-events-none -z-0 opacity-40 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 160" fill="none" preserveAspectRatio="none">
          <path
            d="M-20,20 C100,50 200,10 320,70 C370,95 410,60 450,40"
            stroke="url(#goldenWaveGrad1)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <path
            d="M-40,60 C80,20 180,80 290,40 C350,20 400,80 440,100"
            stroke="url(#goldenWaveGrad2)"
            strokeWidth="1.2"
            opacity="0.75"
          />
          <path
            d="M-10,95 C120,40 220,110 340,30 C380,10 420,50 460,70"
            stroke="url(#magentaWaveGrad)"
            strokeWidth="1.2"
            opacity="0.65"
          />
          <defs>
            <linearGradient id="goldenWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5B014" stopOpacity="0" />
              <stop offset="30%" stopColor="#F5B014" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#FDE68A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F5B014" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="goldenWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0" />
              <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="magentaWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8D26FF" stopOpacity="0" />
              <stop offset="40%" stopColor="#D946EF" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#8D26FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8D26FF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* MODULARE ROTIERENDE HERO-ERDE (DOCKBAR / ABKOPPELBAR) */}
      <div className="absolute -top-6 -right-12 sm:-right-8 md:right-4 w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[460px] lg:h-[460px] pointer-events-auto z-0">
        {!isGlobeDetached ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            <HeroRotatingGlobe
              mode="docked"
              isDetached={false}
              onToggleDetach={onToggleGlobeDetach}
              onOpenCockpit={onOpenGlobeCockpit}
              className="w-full h-full"
            />
          </motion.div>
        ) : (
          /* DOCKING STATION PLACEHOLDER WENN DIE ERDE ABGEKOPPELT IST */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex items-center justify-center p-6"
          >
            <div className="w-[280px] sm:w-[320px] p-5 rounded-3xl bg-[#070e24]/60 border border-amber-400/30 backdrop-blur-md shadow-2xl flex flex-col items-center text-center space-y-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-radial from-amber-400/5 via-transparent to-transparent pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,176,20,0.2)]">
                <Globe2 className="w-7 h-7 animate-spin-slow" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold block mb-0.5">
                  Docking Station
                </span>
                <h4 className="text-sm font-bold text-white">Hero-Erde im Floating-Modus</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Die rotierende 3D-Erde schwebt nun als interaktives Widget in der rechten Bildschirmecke.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 w-full justify-center">
                {onToggleGlobeDetach && (
                  <button
                    type="button"
                    onClick={onToggleGlobeDetach}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>In Hero andocken</span>
                  </button>
                )}
                {onOpenGlobeCockpit && (
                  <button
                    type="button"
                    onClick={onOpenGlobeCockpit}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                    title="Vollbild Cockpit"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-lg">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 mb-3"
        >
          <span className="text-[10.5px] font-bold tracking-[0.22em] text-[#F5B014] uppercase">
            LIVE MARKETS. REAL INSIGHTS.
          </span>
        </motion.div>

        {/* Main Title matching the exact mockup wording & colors */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[34px] sm:text-[40px] font-extrabold tracking-tight leading-[1.08] mb-4 text-left"
        >
          <span className="text-[#F5B014] block">Marktdaten</span>
          <span className="text-[#F5B014] block">verstehen.</span>
          <span className="text-white block">Chancen besser</span>
          <span className="text-white block">erkennen.</span>
        </motion.h1>

        {/* Body Description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-300 text-[13px] sm:text-[14px] leading-relaxed max-w-[320px] sm:max-w-md mb-6 font-normal"
        >
          <strong className="text-slate-100 font-semibold">CAPITAL-AI</strong> vereint Echtzeit-Marktdaten, KI-gestütztes Scoring und fundierte Analysen – für transparentere Entscheidungen an den globalen Märkten.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col gap-3 w-full max-w-[280px]"
        >
          {/* Primary Button: Yellow/Gold "Analyse starten" */}
          <button
            id="hero-start-analysis-btn"
            type="button"
            onClick={onStartAnalysis}
            className="group relative w-full h-[50px] px-5 bg-[#F5B014] hover:bg-[#ffbe26] active:scale-[0.98] text-black font-bold rounded-2xl flex items-center justify-between shadow-[0_4px_24px_rgba(245,176,20,0.35)] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              {/* Distinct 3-bar chart icon matching mockup */}
              <div className="w-6 h-6 flex items-end justify-center gap-[3px] py-1">
                <span className="w-[3px] h-3 bg-black rounded-full" />
                <span className="w-[3px] h-5 bg-black rounded-full" />
                <span className="w-[3px] h-4 bg-black rounded-full" />
              </div>
              <span className="text-[15.5px] font-bold tracking-tight">Analyse starten</span>
            </div>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 stroke-[2.4]" />
          </button>

          {/* Secondary Button: Dark Glass "Produkt entdecken" */}
          <button
            id="hero-explore-product-btn"
            type="button"
            onClick={onExploreProduct}
            className="w-full h-[48px] px-5 bg-[#0a1128]/80 hover:bg-[#101b3d]/90 active:scale-[0.98] border border-slate-700/70 hover:border-slate-500/80 rounded-2xl text-white flex items-center justify-center gap-3 backdrop-blur-md transition-all duration-200"
          >
            {/* Play Icon in Solid Circle */}
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
              <Play className="w-3 h-3 text-black fill-black ml-0.5" />
            </div>
            <span className="text-[14.5px] font-medium text-slate-100">Produkt entdecken</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
