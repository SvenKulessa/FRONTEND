import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KEY_PILLARS } from '../data/mockData';

export const KeyPillars: React.FC = () => {
  const [activePillar, setActivePillar] = useState<string | null>(null);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'coins':
        // AIF Gold (#F9BF21) stacked coins with golden glow
        return (
          <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(249,191,33,0.35)]" viewBox="0 0 32 32" fill="none">
            <ellipse cx="16" cy="9" rx="11" ry="4.2" fill="none" stroke="#F9BF21" strokeWidth="2" />
            <path d="M5 9v5c0 2.3 4.9 4.2 11 4.2s11-1.9 11-4.2V9" stroke="#F9BF21" strokeWidth="2" />
            <path d="M5 14v5c0 2.3 4.9 4.2 11 4.2s11-1.9 11-4.2v-5" stroke="#F9BF21" strokeWidth="2" />
            <path d="M5 19v5c0 2.3 4.9 4.2 11 4.2s11-1.9 11-4.2v-5" stroke="#F9BF21" strokeWidth="2" />
          </svg>
        );
      case 'ai-brain':
        // Purple Accent (#8D26FF) glowing brain icon
        return (
          <svg className="w-8 h-8 drop-shadow-[0_0_10px_rgba(141,38,255,0.45)]" viewBox="0 0 32 32" fill="none">
            <path
              d="M12 7c-2 0-3.5 1.5-3.5 3.5 0 .8.2 1.5.7 2C7.5 13 6.5 14.5 6.5 16.5c0 1.2.6 2.3 1.5 3-.4.6-.5 1.4-.5 2 0 2 1.5 3.5 3.5 3.5h1"
              stroke="#8D26FF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M20 7c2 0 3.5 1.5 3.5 3.5 0 .8-.2 1.5-.7 2 1.7.5 2.7 2 2.7 4 0 1.2-.6 2.3-1.5 3 .4.6.5 1.4.5 2 0 2-1.5 3.5-3.5 3.5h-1"
              stroke="#8D26FF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M16 6v20M12 11c1.5 1 2.5 2.5 2.5 5s-1 4-2.5 5M20 11c-1.5 1-2.5 2.5-2.5 5s1 4 2.5 5" stroke="#E879F9" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );
      case 'users':
        // Emerald (#44DE88 - Brand Success/Trust) user silhouettes
        return (
          <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(68,222,136,0.35)]" viewBox="0 0 32 32" fill="none">
            {/* Primary User */}
            <circle cx="12" cy="11" r="4.5" stroke="#44DE88" strokeWidth="2" />
            <path d="M4.5 25c0-4 3.4-7 7.5-7s7.5 3 7.5 7" stroke="#44DE88" strokeWidth="2" strokeLinecap="round" />
            {/* Secondary User Behind */}
            <circle cx="21.5" cy="11" r="3.8" stroke="#22C55E" strokeWidth="1.8" />
            <path d="M19 18.5c1.1-.3 2.3-.5 3.5-.5 3.5 0 6 2.4 6 5.8" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );
      case 'globe':
        // AIF Gold (#F9BF21) globe
        return (
          <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(249,191,33,0.35)]" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="11" stroke="#F9BF21" strokeWidth="2" />
            <ellipse cx="16" cy="16" rx="5" ry="11" stroke="#F9BF21" strokeWidth="1.8" />
            <line x1="5" y1="16" x2="27" y2="16" stroke="#F9BF21" strokeWidth="1.8" />
            <line x1="7.5" y1="10.5" x2="24.5" y2="10.5" stroke="#F9BF21" strokeWidth="1.4" strokeOpacity="0.85" />
            <line x1="7.5" y1="21.5" x2="24.5" y2="21.5" stroke="#F9BF21" strokeWidth="1.4" strokeOpacity="0.85" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="px-3 sm:px-5 py-3 select-none">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {KEY_PILLARS.map((pillar) => {
          const isSelected = activePillar === pillar.id;
          return (
            <motion.div
              key={pillar.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActivePillar(isSelected ? null : pillar.id)}
              className={`flex flex-col items-center text-center cursor-pointer transition-all duration-200 p-2 rounded-xl ${
                isSelected ? 'bg-white/5 ring-1 ring-amber-400/30' : 'hover:bg-white/[0.02]'
              }`}
            >
              {/* Icon container */}
              <div className="w-12 h-12 flex items-center justify-center mb-1.5 transition-transform hover:scale-105">
                {renderIcon(pillar.iconType)}
              </div>

              {/* Label */}
              <span className="text-[11.5px] sm:text-xs text-slate-200 font-medium leading-[1.25] line-clamp-2 max-w-[85px]">
                {pillar.title}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Optional Interactive Detail Pill if user taps one */}
      <AnimatePresence>
        {activePillar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
              <span>
                {activePillar === 'realtime' && '⚡ Millisekundengenaue Tick-Daten aus über 50 Börsen weltweit.'}
                {activePillar === 'transparent-ai' && '🔍 Keine Blackbox: Alle Parameter & Gewichtungen sind einsehbar.'}
                {activePillar === 'audience' && '🤝 Intuitive Dashboards für Einsteiger, mächtige Kennzahlen für Profis.'}
                {activePillar === 'global-markets' && '🌐 Aktien, Krypto, Rohstoffe und Devisen harmonisiert an einem Ort.'}
              </span>
              <button
                type="button"
                onClick={() => setActivePillar(null)}
                className="text-slate-400 hover:text-white ml-2 text-xs font-semibold underline shrink-0"
              >
                Schließen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
