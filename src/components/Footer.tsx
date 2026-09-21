import React from 'react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 px-5 pb-8 pt-4 text-center">
      {/* Thin elegant separator with golden center glow */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-6" />

      {/* Pure Vector Brand Logo */}
      <div className="flex justify-center mb-4">
        <BrandLogo variant="inline" size="sm" />
      </div>

      {/* Slogan from brand architecture */}
      <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.24em] text-slate-400 uppercase select-none">
        GLOBALE INTELLIGENZ. EINE BESSERE ZUKUNFT.
      </p>

      {/* Small copyright / brand info */}
      <div className="mt-3 text-[10px] text-slate-500 flex items-center justify-center gap-3">
        <span>© {new Date().getFullYear()} Capital-AI</span>
        <span>•</span>
        <span className="hover:text-slate-300 transition-colors cursor-pointer">Impressum</span>
        <span>•</span>
        <span className="hover:text-slate-300 transition-colors cursor-pointer">Datenschutz</span>
        <span>•</span>
        <span className="hover:text-slate-300 transition-colors cursor-pointer">Manifest v6.0</span>
      </div>

      {/* Mobile iOS Home Indicator Bar */}
      <div className="w-28 h-1 bg-white/40 rounded-full mx-auto mt-6" />
    </footer>
  );
};
