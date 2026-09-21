import React from 'react';

interface BrandLogoProps {
  variant?: 'emblem' | 'inline' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Pure SVG Vector Emblem of Capital-AI
 * Intricate geometric lattice of gold rods and 3D atom spheres
 * Featuring both AIF Gold (#F9BF21) and the requested Magenta (#8D26FF)
 * according to Brand Manifest v6.0.
 */
export const CapitalAIVectorEmblem: React.FC<{
  sizeClass?: string;
  className?: string;
}> = ({ sizeClass = 'w-10 h-10', className = '' }) => {
  return (
    <div className={`relative ${sizeClass} flex items-center justify-center shrink-0 select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(249,191,33,0.35)]"
      >
        <defs>
          {/* Gold Shading for Atoms */}
          <radialGradient id="atomGoldGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="35%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#F9BF21" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          {/* Magenta Shading for Atoms (#8D26FF & Magenta glow as requested) */}
          <radialGradient id="atomMagentaGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#F5D0FE" />
            <stop offset="55%" stopColor="#E879F9" />
            <stop offset="80%" stopColor="#8D26FF" />
            <stop offset="100%" stopColor="#4A044E" />
          </radialGradient>

          {/* Deep Magenta Core Gradient */}
          <radialGradient id="atomDeepMagentaGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FDF4FF" />
            <stop offset="30%" stopColor="#D946EF" />
            <stop offset="75%" stopColor="#8D26FF" />
            <stop offset="100%" stopColor="#3B0764" />
          </radialGradient>

          {/* Rod Metallic Gold Gradients */}
          <linearGradient id="rodGoldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F9BF21" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="rodMagentaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9BF21" />
            <stop offset="50%" stopColor="#E879F9" />
            <stop offset="100%" stopColor="#8D26FF" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="magentaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient magenta/purple radial pulse aura behind the constellation */}
        <circle cx="50" cy="50" r="32" fill="#8D26FF" opacity="0.18" filter="url(#magentaGlow)" />
        <circle cx="50" cy="48" r="18" fill="#F9BF21" opacity="0.15" filter="url(#goldGlow)" />

        {/* CONNECTING LATTICE RODS */}
        <g strokeWidth="2.2" strokeLinecap="round" opacity="0.88">
          {/* Outer perimeter bonds */}
          <line x1="20" y1="26" x2="50" y2="12" stroke="url(#rodGoldGrad1)" />
          <line x1="50" y1="12" x2="80" y2="26" stroke="url(#rodGoldGrad1)" />
          <line x1="80" y1="26" x2="85" y2="60" stroke="url(#rodGoldGrad1)" />
          <line x1="85" y1="60" x2="68" y2="82" stroke="url(#rodMagentaGrad)" />
          <line x1="68" y1="82" x2="32" y2="82" stroke="url(#rodMagentaGrad)" />
          <line x1="32" y1="82" x2="15" y2="60" stroke="url(#rodMagentaGrad)" />
          <line x1="15" y1="60" x2="20" y2="26" stroke="url(#rodGoldGrad1)" />

          {/* Internal diagonal cross rods connecting atoms to central nucleus */}
          <line x1="20" y1="26" x2="50" y2="48" stroke="url(#rodMagentaGrad)" strokeWidth="2" />
          <line x1="80" y1="26" x2="50" y2="48" stroke="url(#rodMagentaGrad)" strokeWidth="2" />
          <line x1="15" y1="60" x2="50" y2="48" stroke="url(#rodGoldGrad1)" strokeWidth="2" />
          <line x1="85" y1="60" x2="50" y2="48" stroke="url(#rodGoldGrad1)" strokeWidth="2" />
          <line x1="32" y1="82" x2="50" y2="48" stroke="url(#rodMagentaGrad)" strokeWidth="2.4" />
          <line x1="68" y1="82" x2="50" y2="48" stroke="url(#rodMagentaGrad)" strokeWidth="2.4" />
          <line x1="50" y1="12" x2="50" y2="48" stroke="url(#rodGoldGrad1)" strokeWidth="2.2" />

          {/* Secondary inter-atom lattice bridges */}
          <line x1="33" y1="36" x2="67" y2="36" stroke="url(#rodMagentaGrad)" strokeWidth="1.6" opacity="0.75" />
          <line x1="33" y1="36" x2="20" y2="26" stroke="url(#rodGoldGrad1)" strokeWidth="1.4" opacity="0.8" />
          <line x1="67" y1="36" x2="80" y2="26" stroke="url(#rodGoldGrad1)" strokeWidth="1.4" opacity="0.8" />
          <line x1="33" y1="36" x2="32" y2="82" stroke="url(#rodMagentaGrad)" strokeWidth="1.5" opacity="0.65" />
          <line x1="67" y1="36" x2="68" y2="82" stroke="url(#rodMagentaGrad)" strokeWidth="1.5" opacity="0.65" />
          <line x1="15" y1="60" x2="85" y2="60" stroke="url(#rodGoldGrad1)" strokeWidth="1.3" opacity="0.45" strokeDasharray="3 2" />
        </g>

        {/* SPHERICAL ATOMS ("Atome" mit Gold und leuchtendem Magenta) */}

        {/* Atom 1: Top Apex (Gold Atom) */}
        <circle cx="50" cy="12" r="6.2" fill="url(#atomGoldGrad)" />
        <circle cx="48.5" cy="10.5" r="1.8" fill="#FFFFFF" opacity="0.8" />

        {/* Atom 2: Top Left (Gold Atom with Magenta energetic aura) */}
        <circle cx="20" cy="26" r="7.5" fill="url(#atomGoldGrad)" />
        <circle cx="18" cy="24" r="2.2" fill="#FFFFFF" opacity="0.85" />

        {/* Atom 3: Top Right (Gold Atom) */}
        <circle cx="80" cy="26" r="7.5" fill="url(#atomGoldGrad)" />
        <circle cx="78" cy="24" r="2.2" fill="#FFFFFF" opacity="0.85" />

        {/* Atom 4: Inner Left Intermediate Atom (MAGENTA ATOM) */}
        <circle cx="33" cy="36" r="5.2" fill="url(#atomMagentaGrad)" filter="url(#magentaGlow)" />
        <circle cx="33" cy="36" r="4.2" fill="url(#atomMagentaGrad)" />
        <circle cx="31.8" cy="34.8" r="1.4" fill="#FFFFFF" opacity="0.9" />

        {/* Atom 5: Inner Right Intermediate Atom (MAGENTA ATOM) */}
        <circle cx="67" cy="36" r="5.2" fill="url(#atomMagentaGrad)" filter="url(#magentaGlow)" />
        <circle cx="67" cy="36" r="4.2" fill="url(#atomMagentaGrad)" />
        <circle cx="65.8" cy="34.8" r="1.4" fill="#FFFFFF" opacity="0.9" />

        {/* Atom 6: Mid Left Lateral Atom (Gold Atom) */}
        <circle cx="15" cy="60" r="6.5" fill="url(#atomGoldGrad)" />
        <circle cx="13.5" cy="58.5" r="1.9" fill="#FFFFFF" opacity="0.8" />

        {/* Atom 7: Mid Right Lateral Atom (Gold Atom) */}
        <circle cx="85" cy="60" r="6.5" fill="url(#atomGoldGrad)" />
        <circle cx="83.5" cy="58.5" r="1.9" fill="#FFFFFF" opacity="0.8" />

        {/* Atom 8: Bottom Left Base (MAGENTA ATOM) */}
        <circle cx="32" cy="82" r="7.8" fill="url(#atomDeepMagentaGrad)" filter="url(#magentaGlow)" />
        <circle cx="32" cy="82" r="6.8" fill="url(#atomDeepMagentaGrad)" />
        <circle cx="30" cy="80" r="2.0" fill="#FFFFFF" opacity="0.9" />

        {/* Atom 9: Bottom Right Base (MAGENTA ATOM) */}
        <circle cx="68" cy="82" r="7.8" fill="url(#atomDeepMagentaGrad)" filter="url(#magentaGlow)" />
        <circle cx="68" cy="82" r="6.8" fill="url(#atomDeepMagentaGrad)" />
        <circle cx="66" cy="80" r="2.0" fill="#FFFFFF" opacity="0.9" />

        {/* Atom 10: CENTRAL NUCLEUS ATOM (Large Core with Magenta Aura and Gold Shimmer) */}
        {/* Outer Magenta Ring / Aura */}
        <circle cx="50" cy="48" r="11" fill="#8D26FF" opacity="0.35" filter="url(#magentaGlow)" />
        <circle cx="50" cy="48" r="9" fill="url(#atomDeepMagentaGrad)" />
        {/* Inner Gold-Magenta Core Fusion */}
        <circle cx="50" cy="48" r="6.5" fill="url(#atomMagentaGrad)" />
        <circle cx="47.5" cy="45.5" r="2.4" fill="#FFFFFF" opacity="0.95" />

        {/* Sparkle Vector Stars (like in the brand manifest & reference image) */}
        <path d="M12 40 L13 36 L14 40 L18 41 L14 42 L13 46 L12 42 L8 41 Z" fill="#F9BF21" opacity="0.8" />
        <path d="M88 42 L89 39 L90 42 L93 43 L90 44 L89 47 L88 44 L85 43 Z" fill="#E879F9" opacity="0.85" />
        <path d="M50 72 L51 70 L52 72 L54 73 L52 74 L51 76 L50 74 L48 73 Z" fill="#8D26FF" opacity="0.9" />
        <path d="M38 18 L39 16 L40 18 L42 19 L40 20 L39 22 L38 20 L36 19 Z" fill="#FDE047" opacity="0.7" />
        <path d="M62 18 L63 16 L64 18 L66 19 L64 20 L63 22 L62 20 L60 19 Z" fill="#FDE047" opacity="0.7" />
      </svg>
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'inline',
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  // Sizing configurations
  const emblemSizeClasses = {
    sm: 'w-8 h-8',
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
    sm: 'text-[7px]',
    md: 'text-[8.5px]',
    lg: 'text-[10px]',
    xl: 'text-xs',
  }[size];

  if (variant === 'emblem') {
    return (
      <CapitalAIVectorEmblem
        sizeClass={emblemSizeClasses}
        className={className}
      />
    );
  }

  if (variant === 'stacked') {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center select-none cursor-pointer group ${className}`}
        onClick={onClick}
      >
        <CapitalAIVectorEmblem sizeClass={emblemSizeClasses} className="group-hover:scale-105 transition-transform duration-300" />
        <span
          className={`${titleSizeClasses} font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 group-hover:from-white group-hover:to-amber-300 transition-colors mt-2`}
        >
          Capital-AI
        </span>
        {showSubtitle && (
          <span
            className={`${subtitleSizeClasses} font-semibold text-[#D4A359] tracking-[0.22em] mt-1 uppercase`}
          >
            AI-DRIVEN MARKET INTELLIGENCE
          </span>
        )}
      </div>
    );
  }

  // Inline header / row variant
  return (
    <div
      className={`flex items-center space-x-3 cursor-pointer select-none group ${className}`}
      onClick={onClick}
    >
      {/* Pure Vector SVG Emblem with Gold & Magenta Atoms */}
      <CapitalAIVectorEmblem
        sizeClass={emblemSizeClasses}
        className="group-hover:scale-105 transition-transform duration-300"
      />

      {/* Brand Wordmark matching exact Brand Architecture */}
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
            AI-DRIVEN MARKET INTELLIGENCE
          </span>
        )}
      </div>
    </div>
  );
};
