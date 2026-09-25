import React from 'react';
import { BrandLogo } from './BrandLogo';
import { trackEvent } from '../utils/analytics';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent, path: string, label: string) => {
    e.preventDefault();
    trackEvent('footer_nav_click', {
      category: 'navigation',
      label,
      destination: path,
    });
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <footer className="mt-8 px-5 pb-8 pt-4 text-center">
      {/* Thin elegant separator with golden center glow */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-6" />

      {/* Pure Vector Brand Logo */}
      <div className="flex justify-center mb-4">
        <BrandLogo variant="inline" size="sm" />
      </div>

      {/* Professional FinTech Slogan */}
      <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase select-none">
        MARKET INTELLIGENCE • NEXT-GEN QUANT TERMINAL
      </p>

      {/* Small copyright & legal navigation with dedicated routing paths */}
      <div className="mt-3 text-[11px] text-slate-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        <span>© {new Date().getFullYear()} Capital-AI</span>
        <span className="text-slate-600">•</span>
        <a
          id="footer-nav-impressum"
          href="/impressum"
          onClick={(e) => handleNavClick(e, '/impressum', 'impressum')}
          className="hover:text-amber-400 transition-colors cursor-pointer text-slate-400 font-medium hover:underline underline-offset-4"
          data-analytics="footer-impressum"
        >
          Impressum
        </a>
        <span className="text-slate-600">•</span>
        <a
          id="footer-nav-agb"
          href="/agb"
          onClick={(e) => handleNavClick(e, '/agb', 'agb')}
          className="hover:text-pink-400 transition-colors cursor-pointer text-slate-400 font-medium hover:underline underline-offset-4"
          data-analytics="footer-agb"
        >
          AGB
        </a>
        <span className="text-slate-600">•</span>
        <a
          id="footer-nav-datenschutz"
          href="/datenschutz"
          onClick={(e) => handleNavClick(e, '/datenschutz', 'datenschutz')}
          className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 font-medium hover:underline underline-offset-4"
          data-analytics="footer-datenschutz"
        >
          Datenschutz
        </a>
        <span className="text-slate-600">•</span>
        <a
          id="footer-nav-faq"
          href="/faq"
          onClick={(e) => handleNavClick(e, '/faq', 'faq')}
          className="hover:text-amber-400 transition-colors cursor-pointer text-slate-400 font-medium hover:underline underline-offset-4 flex items-center gap-1"
          data-analytics="footer-faq"
        >
          FAQ
        </a>
        <span className="text-slate-600">•</span>
        <a
          id="footer-nav-pricing"
          href="/pricing"
          onClick={(e) => handleNavClick(e, '/pricing', 'pricing')}
          className="hover:text-amber-300 transition-colors cursor-pointer text-amber-300 font-bold hover:underline underline-offset-4 flex items-center gap-1"
          data-analytics="footer-pricing"
        >
          Preise &amp; Tarife
        </a>
        <span className="text-slate-600">•</span>
        <a
          id="footer-nav-architecture"
          href="/architecture"
          onClick={(e) => handleNavClick(e, '/architecture', 'architecture')}
          className="hover:text-cyan-300 transition-colors cursor-pointer text-cyan-400 font-bold hover:underline underline-offset-4 flex items-center gap-1"
          data-analytics="footer-architecture"
        >
          Architektur &amp; Kursdaten
        </a>
      </div>


      {/* Mobile iOS Home Indicator Bar */}
      <div className="w-28 h-1 bg-white/40 rounded-full mx-auto mt-6" />
    </footer>
  );
};

