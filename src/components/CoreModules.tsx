import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CORE_MODULES } from '../data/mockData';
import { CoreModule } from '../types';

interface CoreModulesProps {
  onSelectModule: (module: CoreModule) => void;
  onViewAllModules: () => void;
}

export const CoreModules: React.FC<CoreModulesProps> = ({ onSelectModule, onViewAllModules }) => {
  const renderModuleIcon = (module: CoreModule) => {
    switch (module.iconType) {
      case 'brain':
        // Enterprise Scorer - Purple / Magenta (#8D26FF)
        return (
          <div className="w-10 h-10 rounded-full border border-[#8D26FF]/40 bg-[#8D26FF]/15 flex items-center justify-center text-[#8D26FF] mb-3 shrink-0 shadow-[0_0_14px_rgba(141,38,255,0.3)]">
            <svg className="w-5 h-5 drop-shadow-[0_0_6px_rgba(141,38,255,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .7.2 1.4.6 2A3.5 3.5 0 0 0 5 13a3.5 3.5 0 0 0 2 3.1 3.5 3.5 0 0 0 3.5 3.9h1" />
              <path d="M14.5 4a3.5 3.5 0 0 1 3.5 3.5c0 .7-.2 1.4-.6 2A3.5 3.5 0 0 1 19 13a3.5 3.5 0 0 1-2 3.1 3.5 3.5 0 0 1-3.5 3.9h-1" />
              <path d="M12 4v16" strokeDasharray="1 1" />
              <path d="M9 9a3 3 0 0 1 6 0" />
              <path d="M9 15a3 3 0 0 0 6 0" />
            </svg>
          </div>
        );
      case 'leaf':
        // Buffett Value Check - Emerald (#44DE88)
        return (
          <div className="w-10 h-10 rounded-full border border-[#44DE88]/40 bg-[#44DE88]/15 flex items-center justify-center text-[#44DE88] mb-3 shrink-0 shadow-[0_0_14px_rgba(68,222,136,0.3)]">
            <svg className="w-5 h-5 drop-shadow-[0_0_6px_rgba(68,222,136,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
        );
      case 'news':
        // AI Newsfeed - Rose (#F87171)
        return (
          <div className="w-10 h-10 rounded-full border border-[#F87171]/40 bg-[#F87171]/15 flex items-center justify-center text-[#F87171] mb-3 shrink-0 shadow-[0_0_14px_rgba(248,113,113,0.3)]">
            <svg className="w-5 h-5 drop-shadow-[0_0_6px_rgba(248,113,113,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8v4h-8V6Z" />
            </svg>
          </div>
        );
      case 'book':
        // Vocabulary - AIF Gold (#F9BF21)
        return (
          <div className="w-10 h-10 rounded-full border border-[#F9BF21]/40 bg-[#F9BF21]/15 flex items-center justify-center text-[#F9BF21] mb-3 shrink-0 shadow-[0_0_14px_rgba(249,191,33,0.3)]">
            <svg className="w-5 h-5 drop-shadow-[0_0_6px_rgba(249,191,33,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="px-5 py-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[17.5px] font-bold text-white tracking-tight">
          Unsere Kernmodule
        </h2>
        <button
          type="button"
          onClick={onViewAllModules}
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#F5B014] hover:text-amber-300 transition-colors"
        >
          <span>Alle Module ansehen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Module Cards Grid / Carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 pt-1 -mx-5 px-5 snap-x snap-mandatory">
        {CORE_MODULES.map((module) => (
          <motion.div
            key={module.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectModule(module)}
            className="snap-start shrink-0 w-[185px] sm:w-[210px] rounded-2xl bg-[#060c1d] border border-slate-800/80 hover:border-amber-500/30 p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.3)] group"
          >
            <div>
              {/* Circular Icon */}
              {renderModuleIcon(module)}

              {/* Title */}
              <h3 className="text-[14.5px] font-bold text-white tracking-tight mb-1.5 group-hover:text-amber-300 transition-colors">
                {module.title}
              </h3>

              {/* Description */}
              <p className="text-[12px] text-slate-300 leading-relaxed line-clamp-2 mb-3">
                {module.description}
              </p>
            </div>

            {/* "Mehr erfahren ->" Link */}
            <div
              className="inline-flex items-center gap-1 text-[12px] font-semibold group-hover:translate-x-0.5 transition-transform pt-2 border-t border-slate-800/60"
              style={{ color: module.brandColor || '#F9BF21' }}
            >
              <span>Mehr erfahren</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
