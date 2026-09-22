import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Gift, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface KrakenReferralBannerProps {
  variant?: 'full' | 'compact' | 'drawer';
  className?: string;
}

export const KrakenReferralBanner: React.FC<KrakenReferralBannerProps> = ({
  variant = 'full',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'yc4ggk3f';
  const referralUrl = 'https://proinvite.kraken.com/9f1e/8nfzp3u7';

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  };

  if (variant === 'drawer') {
    return (
      <div className={`mt-4 p-3.5 rounded-2xl bg-gradient-to-b from-[#5841D8]/20 via-[#181135]/80 to-[#070b19] border border-[#5841D8]/40 shadow-[0_0_20px_rgba(88,65,216,0.18)] text-slate-100 ${className}`}>
        <div className="flex items-center justify-between pb-2 border-b border-[#5841D8]/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#5841D8] flex items-center justify-center text-white font-extrabold text-xs shadow-md">
              K
            </div>
            <div>
              <div className="text-xs font-extrabold text-white flex items-center gap-1">
                <span>Kraken Pro</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Prämien-Link
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed mt-2.5">
          Tritt Kraken Pro bei, und wir können beide Prämien erhalten. Verwende meinen Link unten, oder meinen Referral-Code <strong className="text-amber-300 font-mono">{referralCode}</strong>, um dich zu registrieren.
        </p>

        {/* Code Box & Copy */}
        <div className="mt-2.5 flex items-center justify-between gap-2 p-2 rounded-xl bg-black/60 border border-slate-700/80">
          <div className="flex items-center gap-1.5 pl-1 font-mono text-xs font-bold text-amber-300">
            <span className="text-[10px] text-slate-400 font-sans">Code:</span>
            <span>{referralCode}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20 text-[11px] font-semibold text-white transition-all cursor-pointer"
            title="Referral-Code kopieren"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-300" />
                <span>Kopieren</span>
              </>
            )}
          </button>
        </div>

        {/* CTA Button */}
        <a
          href={referralUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#5841D8] to-[#7B61FF] hover:from-[#664CEB] hover:to-[#8C75FF] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(88,65,216,0.35)] transition-all cursor-pointer"
        >
          <span>Zu Kraken Pro wechseln</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // Full variant (ideal for HomePage and Modals)
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#170e33]/90 via-[#0d1329]/95 to-[#071927]/90 border border-[#5841D8]/40 shadow-[0_0_35px_rgba(88,65,216,0.18)] ${className}`}
    >
      {/* Background Glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#5841D8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left Side: Brand Logo & Referral Message */}
        <div className="space-y-2.5 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5841D8] flex items-center justify-center text-white font-black text-sm shadow-[0_0_12px_rgba(88,65,216,0.5)]">
              K
            </div>
            <div className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
              <span>Kraken Pro Partner-Empfehlung</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Gift className="w-3 h-3 text-amber-400" />
                <span>Prämien-Bonus</span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Tritt Kraken Pro bei, und wir können beide Prämien erhalten. Verwende meinen Link unten, oder meinen Referral-Code{' '}
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono font-bold hover:bg-amber-400/25 transition-all cursor-pointer"
              title="Klick zum Kopieren"
            >
              <span>{referralCode}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-300" />}
            </button>
            , um dich zu registrieren.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5 font-mono">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Regulierte Börse
            </span>
            <span>•</span>
            <span>Sub-5ms Order-Matching</span>
            <span>•</span>
            <span className="text-amber-300/90">400+ Märkte</span>
          </div>
        </div>

        {/* Right Side: Direct Action Button & Code Copy */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          {/* Referral Code Box */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-black/60 border border-slate-700/80">
            <div className="text-left font-mono">
              <div className="text-[9px] text-slate-400 uppercase">Referral-Code</div>
              <div className="text-xs font-bold text-amber-300">{referralCode}</div>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Kopieren</span>
                </>
              )}
            </button>
          </div>

          {/* Primary CTA Link */}
          <a
            href={referralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#5841D8] via-[#7054F5] to-[#8D26FF] hover:from-[#664CEB] hover:to-[#9B42FF] text-white font-extrabold text-xs shadow-[0_0_20px_rgba(88,65,216,0.45)] hover:shadow-[0_0_28px_rgba(141,38,255,0.6)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 text-center whitespace-nowrap"
          >
            <span>Jetzt Prämie sichern</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
