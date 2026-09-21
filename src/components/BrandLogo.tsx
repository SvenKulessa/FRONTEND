import React from 'react';
import brandEmblemImg from '../assets/images/capital_ai_brand_emblem_1789997857835.jpg';
import fullLogoImg from '../assets/images/capital_ai_full_logo_1789997869885.jpg';

interface BrandLogoProps {
  variant?: 'emblem' | 'full' | 'inline' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'inline',
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  // Sizing configurations
  const emblemSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  const titleSizeClasses = {
    sm: 'text-base',
    md: 'text-[21px]',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const subtitleSizeClasses = {
    sm: 'text-[7.5px]',
    md: 'text-[8.5px]',
    lg: 'text-[10px]',
    xl: 'text-xs',
  }[size];

  if (variant === 'full') {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center select-none ${className}`}
        onClick={onClick}
      >
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 -my-4 overflow-hidden pointer-events-none">
          <img
            src={fullLogoImg}
            alt="Capital-AI - Intelligence for Modern Markets"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-screen filter drop-shadow-[0_0_20px_rgba(245,176,20,0.3)]"
          />
        </div>
      </div>
    );
  }

  if (variant === 'emblem') {
    return (
      <div
        className={`relative ${emblemSizeClasses} flex items-center justify-center shrink-0 select-none ${className}`}
        onClick={onClick}
      >
        <img
          src={brandEmblemImg}
          alt="Capital-AI Emblem"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full mix-blend-screen filter drop-shadow-[0_0_12px_rgba(245,176,20,0.45)] scale-110"
        />
        <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-sm pointer-events-none -z-10" />
      </div>
    );
  }

  // Inline header / row variant
  return (
    <div
      className={`flex items-center space-x-3 cursor-pointer select-none group ${className}`}
      onClick={onClick}
    >
      {/* 3D Golden Network Node Emblem */}
      <div className={`relative ${emblemSizeClasses} flex items-center justify-center shrink-0`}>
        <img
          src={brandEmblemImg}
          alt="Capital-AI Emblem"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full mix-blend-screen filter drop-shadow-[0_0_10px_rgba(245,176,20,0.45)] group-hover:scale-105 transition-transform duration-300 scale-110"
        />
        {/* Ambient subtle glow ring */}
        <div className="absolute inset-0 rounded-full bg-amber-400/15 blur-sm pointer-events-none -z-10" />
      </div>

      {/* Brand Wordmark matching exact logo style */}
      <div className="flex flex-col">
        <span
          className={`${titleSizeClasses} font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 group-hover:from-white group-hover:to-amber-300 transition-colors`}
        >
          Capital-AI
        </span>
        {showSubtitle && (
          <span
            className={`${subtitleSizeClasses} font-semibold text-[#D4A359] tracking-[0.22em] mt-1 uppercase`}
          >
            INTELLIGENCE FOR MODERN MARKETS
          </span>
        )}
      </div>
    </div>
  );
};
