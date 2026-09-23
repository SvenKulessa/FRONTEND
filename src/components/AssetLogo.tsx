import React from 'react';
import { MarketAsset, MainCategory } from '../types';

interface AssetLogoProps {
  asset?: {
    id?: string;
    symbol: string;
    name?: string;
    mainCategory?: MainCategory;
    iconType?: string;
  };
  symbol?: string;
  name?: string;
  category?: MainCategory;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AssetLogo: React.FC<AssetLogoProps> = ({
  asset,
  symbol: propSymbol,
  name: propName,
  category: propCategory,
  size = 'md',
  className = '',
}) => {
  const symbolRaw = (asset?.symbol || propSymbol || '').toUpperCase();
  const cleanSymbol = symbolRaw.split('/')[0].trim();
  const name = asset?.name || propName || '';
  const category: string = asset?.mainCategory || propCategory || 'KRYPTO';

  const sizeStyles = {
    xs: 'w-5 h-5 text-[9px] rounded-md',
    sm: 'w-7 h-7 text-[10px] rounded-lg',
    md: 'w-9 h-9 text-[11px] rounded-xl',
    lg: 'w-12 h-12 text-[13px] rounded-2xl',
    xl: 'w-14 h-14 text-[15px] rounded-2xl',
  };

  const currentSizeStyle = sizeStyles[size] || sizeStyles.md;

  // Render specific recognizable SVG logos based on ticker / cleanSymbol / asset.id
  const renderLogoContent = () => {
    // -------------------------------------------------------------
    // 1. CRYPTO ASSETS
    // -------------------------------------------------------------
    if (cleanSymbol === 'BTC') {
      return (
        <div className="w-full h-full bg-[#F7931A] text-white flex items-center justify-center font-bold shadow-[0_0_10px_rgba(247,147,26,0.4)]">
          <span className="font-serif text-[1.25em] leading-none select-none">₿</span>
        </div>
      );
    }

    if (cleanSymbol === 'ETH') {
      return (
        <div className="w-full h-full bg-[#627EEA] text-white flex items-center justify-center p-1.5 shadow-[0_0_10px_rgba(98,126,234,0.4)]">
          <svg viewBox="0 0 784.37 1277.39" className="w-full h-full" fill="none">
            <polygon fill="#fff" fillOpacity="0.8" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54" />
            <polygon fill="#fff" points="392.07,0 0,650.54 392.07,882.29 392.07,472.33" />
            <polygon fill="#fff" fillOpacity="0.8" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89" />
            <polygon fill="#fff" points="392.07,1277.38 392.07,956.52 0,724.89" />
            <polygon fill="#fff" fillOpacity="0.4" points="392.07,882.29 784.13,650.54 392.07,472.33" />
            <polygon fill="#fff" fillOpacity="0.6" points="0,650.54 392.07,882.29 392.07,472.33" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'SOL') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#9945FF] via-[#14F195] to-[#00C2FF] p-1.5 flex items-center justify-center shadow-[0_0_10px_rgba(20,241,149,0.4)]">
          <div className="w-full flex flex-col justify-center gap-0.5">
            <div className="h-1 bg-black rounded-full w-full transform skew-x-[-20deg]" />
            <div className="h-1 bg-black rounded-full w-4/5 ml-auto transform skew-x-[-20deg]" />
            <div className="h-1 bg-black rounded-full w-full transform skew-x-[-20deg]" />
          </div>
        </div>
      );
    }

    if (cleanSymbol === 'BNB') {
      return (
        <div className="w-full h-full bg-[#181A20] text-[#F3BA2F] p-1.5 flex items-center justify-center border border-[#F3BA2F]/40 shadow-[0_0_10px_rgba(243,186,47,0.3)]">
          <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
            <path d="M16 2l4.8 4.8-4.8 4.8-4.8-4.8L16 2zm-8.8 8.8l4.8 4.8-4.8 4.8-4.8-4.8 4.8-4.8zm17.6 0l4.8 4.8-4.8 4.8-4.8-4.8 4.8-4.8zM16 11.6l4.4 4.4-4.4 4.4-4.4-4.4 4.4-4.4zM7.2 20.4l4.8 4.8-4.8 4.8-4.8-4.8 4.8-4.8zm17.6 0l4.8 4.8-4.8 4.8-4.8-4.8 4.8-4.8zM16 20.4l4.8 4.8-4.8 4.8-4.8-4.8 4.8-4.8z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'XRP') {
      return (
        <div className="w-full h-full bg-[#23292F] text-white p-1.5 flex items-center justify-center font-black">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M83.5 18.2H71.2L50 39.4 28.8 18.2H16.5l27.9 27.9L16.5 74h12.3l21.2-21.2 21.2 21.2h12.3L55.6 46.1 83.5 18.2z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'ADA') {
      return (
        <div className="w-full h-full bg-[#0033AD] text-white p-1 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <circle cx="50" cy="50" r="14" />
            <circle cx="50" cy="20" r="6" />
            <circle cx="50" cy="80" r="6" />
            <circle cx="20" cy="50" r="6" />
            <circle cx="80" cy="50" r="6" />
            <circle cx="29" cy="29" r="4.5" />
            <circle cx="71" cy="29" r="4.5" />
            <circle cx="29" cy="71" r="4.5" />
            <circle cx="71" cy="71" r="4.5" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'DOGE') {
      return (
        <div className="w-full h-full bg-[#C2A633] text-white font-extrabold flex items-center justify-center font-serif text-[1.2em] shadow-[0_0_8px_rgba(194,166,51,0.4)]">
          Ð
        </div>
      );
    }

    if (cleanSymbol === 'AVAX') {
      return (
        <div className="w-full h-full bg-[#E84142] text-white p-1.5 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M50 15L15 75h20l15-28 15 28h20L50 15z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'DOT') {
      return (
        <div className="w-full h-full bg-[#E6007A] text-white flex items-center justify-center font-black">
          <div className="w-3 h-3 rounded-full bg-white ring-4 ring-white/30" />
        </div>
      );
    }

    if (cleanSymbol === 'LINK') {
      return (
        <div className="w-full h-full bg-[#375BD2] text-white p-1.5 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <polygon points="50,12 83,31 83,69 50,88 17,69 17,31" />
            <polygon fill="#375BD2" points="50,26 71,38 71,62 50,74 29,62 29,38" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'XMR') {
      return (
        <div className="w-full h-full bg-[#FF6600] text-white p-1 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
            <path d="M50,4A46,46,0,1,0,96,50,46,46,0,0,0,50,4ZM50,68L26,44V26L50,50,74,26V44Z" />
            <polygon points="50,58 70,38 70,44 50,64 30,44 30,38" fill="#fff" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'UNI') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#FF007A] to-[#FF80B5] text-white flex items-center justify-center font-extrabold text-[1.1em]">
          🦄
        </div>
      );
    }

    if (cleanSymbol === 'SHIB') {
      return (
        <div className="w-full h-full bg-[#FFA409] text-black font-extrabold flex items-center justify-center text-[1.1em]">
          🐕
        </div>
      );
    }

    if (cleanSymbol === 'PEPE') {
      return (
        <div className="w-full h-full bg-[#00A859] text-white flex items-center justify-center font-bold text-[1.1em]">
          🐸
        </div>
      );
    }

    if (cleanSymbol === 'NEAR') {
      return (
        <div className="w-full h-full bg-black text-[#00EC97] p-1.5 flex items-center justify-center border border-[#00EC97]/30">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M22,78V22l40,42V22h16v56L38,36v42H22z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'SUI') {
      return (
        <div className="w-full h-full bg-[#4CA2FE] text-white flex items-center justify-center font-bold">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'APT') {
      return (
        <div className="w-full h-full bg-[#1A1A1A] text-[#00D4B2] flex flex-col justify-center items-center gap-0.5 p-1 border border-[#00D4B2]/40">
          <div className="w-4 h-0.5 bg-[#00D4B2] rounded-full" />
          <div className="w-5 h-0.5 bg-[#00D4B2] rounded-full" />
          <div className="w-4 h-0.5 bg-[#00D4B2] rounded-full" />
        </div>
      );
    }

    if (cleanSymbol === 'TON') {
      return (
        <div className="w-full h-full bg-[#0088CC] text-white p-1.5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
            <path d="M12 2L3 8l9 14 9-14-9-6zm0 3.2L17.5 8 12 18 6.5 8 12 5.2z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'ATOM') {
      return (
        <div className="w-full h-full bg-[#2E3148] text-[#5064FB] p-1 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" stroke="currentColor" fill="none" strokeWidth="6">
            <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(30 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(90 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(150 50 50)" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'FIL') {
      return (
        <div className="w-full h-full bg-[#0090FF] text-white flex items-center justify-center font-mono font-black text-[1.1em]">
          ⨎
        </div>
      );
    }

    if (cleanSymbol === 'KAS') {
      return (
        <div className="w-full h-full bg-[#70C7BA] text-black font-extrabold flex items-center justify-center text-[10px] tracking-tighter">
          KAS
        </div>
      );
    }

    if (cleanSymbol === 'TAO') {
      return (
        <div className="w-full h-full bg-[#111] text-white border border-slate-700 flex items-center justify-center font-bold">
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="3" x2="12" y2="8" />
            <line x1="12" y1="16" x2="12" y2="21" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'RENDER') {
      return (
        <div className="w-full h-full bg-[#E53935] text-white flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="3" fill="#fff" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'POL' || cleanSymbol === 'MATIC') {
      return (
        <div className="w-full h-full bg-[#8247E5] text-white p-1.5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
            <path d="M16.5 8L12 5.5 7.5 8v5l4.5 2.5 4.5-2.5V8z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'USDT') {
      return (
        <div className="w-full h-full bg-[#26A17B] text-white font-extrabold flex items-center justify-center text-[1.2em]">
          ₮
        </div>
      );
    }

    if (cleanSymbol === 'USDC') {
      return (
        <div className="w-full h-full bg-[#2775CA] text-white font-extrabold flex items-center justify-center text-[1.1em]">
          $
        </div>
      );
    }

    // -------------------------------------------------------------
    // 2. STOCKS (Equities)
    // -------------------------------------------------------------
    if (cleanSymbol === 'AAPL') {
      return (
        <div className="w-full h-full bg-[#1E293B] text-slate-100 flex items-center justify-center p-1 border border-slate-700">
          <svg viewBox="0 0 170 170" className="w-full h-full fill-current">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.98-12.23-14.7-6.03-9.11-10.79-19.46-14.28-31.06-3.48-11.59-5.23-22.77-5.23-33.53 0-14.73 3.78-26.65 11.35-35.76 7.56-9.11 17.07-13.79 28.52-14.04 4.58 0 9.77 1.21 15.58 3.63 5.81 2.42 9.53 3.69 11.16 3.82 2.01-.26 5.89-1.57 11.64-3.95 5.76-2.37 10.82-3.48 15.19-3.32 11.25.63 20.37 4.85 27.35 12.65-9.84 5.92-14.65 14.24-14.42 24.97.24 8.7 3.63 15.93 10.18 21.68 6.55 5.75 14.19 9.07 22.92 9.96-2.02 5.93-4.39 12.06-7.11 18.39zM119.22 33.15c0-6.27 2.27-12.23 6.81-17.88 4.54-5.65 10.37-9.35 17.48-11.1-1.01 5.91-3.23 11.52-6.66 16.83-3.43 5.31-8.1 9.38-14.01 12.21-.49-.06-1.78-.06-3.62-.06z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'MSFT') {
      return (
        <div className="w-full h-full bg-[#0F172A] p-2 flex items-center justify-center border border-slate-800">
          <div className="grid grid-cols-2 gap-0.5 w-full h-full">
            <div className="bg-[#F25022] rounded-xs" />
            <div className="bg-[#7FBA00] rounded-xs" />
            <div className="bg-[#00A4EF] rounded-xs" />
            <div className="bg-[#FFB900] rounded-xs" />
          </div>
        </div>
      );
    }

    if (cleanSymbol === 'NVDA') {
      return (
        <div className="w-full h-full bg-[#000000] p-1.5 flex items-center justify-center border border-[#76B900]/40">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-[#76B900]">
            <path d="M8.7 4.5c2.4-.4 5.2.2 7.1 1.6 1.8 1.4 2.8 3.5 2.8 5.8 0 2.8-1.5 5.4-3.9 6.8-2.4 1.4-5.4 1.5-7.9.3-1.6-.7-2.9-2-3.7-3.5-.2-.4-.4-.8-.5-1.3-.3-1.4 0-2.8.9-3.9.7-.9 1.8-1.5 3-1.6 1.4-.2 2.8.3 3.8 1.3.8.8 1.3 1.9 1.2 3.1 0 .8-.3 1.6-.9 2.2-.6.5-1.4.8-2.2.8-.7 0-1.4-.3-1.9-.8-.4-.4-.6-1-.6-1.6 0-.8.5-1.5 1.2-1.8.6-.3 1.4-.2 1.9.3.2.2.4.5.4.8 0 .4-.3.8-.7.9-.3 0-.6-.1-.7-.4" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'AMZN') {
      return (
        <div className="w-full h-full bg-[#131921] text-[#FF9900] flex flex-col items-center justify-center font-bold p-1">
          <span className="text-[0.9em] text-white font-sans tracking-tighter">a</span>
          <svg viewBox="0 0 50 15" className="w-4/5 fill-[#FF9900]">
            <path d="M2,4 Q25,18 48,4 Q25,12 2,4 Z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'GOOGL' || cleanSymbol === 'GOOG') {
      return (
        <div className="w-full h-full bg-white text-slate-900 flex items-center justify-center font-black font-sans text-[1.1em] border border-slate-300">
          <span className="text-[#4285F4]">G</span>
        </div>
      );
    }

    if (cleanSymbol === 'META') {
      return (
        <div className="w-full h-full bg-[#0B132B] text-[#0081FB] p-1.5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
            <path d="M16.5 6c-2.3 0-4.3 1.6-5 3.9-.7-2.3-2.7-3.9-5-3.9C3.6 6 1.5 8.1 1.5 11.2c0 4.1 4.5 7.6 10 7.6s10-3.5 10-7.6c0-3.1-2.1-5.2-5-5.2zm-10 8.8c-1.8 0-3.2-1.6-3.2-3.6s1.4-3.6 3.2-3.6c1.6 0 3 1.4 3.4 3.2-.4 2.1-1.8 4-3.4 4zm10 0c-1.6 0-3-1.9-3.4-4 .4-1.8 1.8-3.2 3.4-3.2 1.8 0 3.2 1.6 3.2 3.6s-1.4 3.6-3.2 3.6z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'TSLA') {
      return (
        <div className="w-full h-full bg-[#111] text-[#E82127] p-1.5 flex items-center justify-center border border-[#E82127]/30">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M50 25c12 0 24 3 32 8l-6 10c-7-4-16-6-26-6s-19 2-26 6l-6-10c8-5 20-8 32-8zm0 18l12 42h-8L50 56l-4 29h-8l12-42z" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'JPM') {
      return (
        <div className="w-full h-full bg-[#0A2540] text-white flex items-center justify-center font-serif font-black text-[11px] tracking-tighter border border-blue-900">
          JPM
        </div>
      );
    }

    if (cleanSymbol === 'V') {
      return (
        <div className="w-full h-full bg-[#1A1F71] text-white flex items-center justify-center font-sans font-black italic text-[1.1em]">
          <span className="text-[#F7B600] mr-0.5">/</span>V
        </div>
      );
    }

    if (cleanSymbol === 'MA') {
      return (
        <div className="w-full h-full bg-[#0F172A] p-1 flex items-center justify-center">
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="w-4 h-4 rounded-full bg-[#EB001B] opacity-95 -mr-2" />
            <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-90" />
          </div>
        </div>
      );
    }

    if (cleanSymbol === 'SAP') {
      return (
        <div className="w-full h-full bg-[#008FD3] text-white flex items-center justify-center font-black text-[10px] tracking-tighter">
          SAP
        </div>
      );
    }

    if (cleanSymbol === 'SIE') {
      return (
        <div className="w-full h-full bg-[#00646E] text-white flex items-center justify-center font-bold text-[9px] tracking-wider">
          SIE
        </div>
      );
    }

    if (cleanSymbol === 'BMW') {
      return (
        <div className="w-full h-full bg-black rounded-full border border-slate-600 p-0.5 flex items-center justify-center">
          <div className="w-full h-full rounded-full grid grid-cols-2 overflow-hidden border border-white/40">
            <div className="bg-white" />
            <div className="bg-[#0066B1]" />
            <div className="bg-[#0066B1]" />
            <div className="bg-white" />
          </div>
        </div>
      );
    }

    if (cleanSymbol === 'MBG') {
      return (
        <div className="w-full h-full bg-slate-900 text-slate-200 border border-slate-600 p-1 flex items-center justify-center rounded-full">
          <svg viewBox="0 0 100 100" className="w-full h-full" stroke="currentColor" fill="none" strokeWidth="6">
            <circle cx="50" cy="50" r="44" />
            <line x1="50" y1="50" x2="50" y2="10" />
            <line x1="50" y1="50" x2="15" y2="75" />
            <line x1="50" y1="50" x2="85" y2="75" />
          </svg>
        </div>
      );
    }

    if (cleanSymbol === 'MC') {
      return (
        <div className="w-full h-full bg-black text-[#D4AF37] font-serif font-black flex items-center justify-center text-[10px] tracking-wider border border-[#D4AF37]/30">
          LVMH
        </div>
      );
    }

    // -------------------------------------------------------------
    // 3. FOREX PAIRS
    // -------------------------------------------------------------
    if (category === 'FOREX' || symbolRaw.includes('/')) {
      const parts = symbolRaw.split('/');
      const base = parts[0] || 'EUR';
      const quote = parts[1] || 'USD';

      const getFlagEmoji = (cur: string) => {
        switch (cur) {
          case 'EUR': return '🇪🇺';
          case 'USD': return '🇺🇸';
          case 'GBP': return '🇬🇧';
          case 'JPY': return '🇯🇵';
          case 'CHF': return '🇨🇭';
          case 'AUD': return '🇦🇺';
          case 'CAD': return '🇨🇦';
          case 'NZD': return '🇳🇿';
          case 'CNH':
          case 'CNY': return '🇨🇳';
          case 'TRY': return '🇹🇷';
          case 'BRL': return '🇧🇷';
          case 'INR': return '🇮🇳';
          case 'MXN': return '🇲🇽';
          case 'ZAR': return '🇿🇦';
          case 'SGD': return '🇸🇬';
          case 'HKD': return '🇭🇰';
          case 'NOK': return '🇳🇴';
          case 'SEK': return '🇸🇪';
          case 'PLN': return '🇵🇱';
          default: return '🌐';
        }
      };

      return (
        <div className="w-full h-full bg-[#0e1630] border border-purple-500/30 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="flex items-center -space-x-1 text-[11px] select-none">
            <span>{getFlagEmoji(base)}</span>
            <span>{getFlagEmoji(quote)}</span>
          </div>
          <span className="text-[8.5px] font-mono font-bold text-purple-300 leading-none mt-0.5">
            {base.slice(0, 3)}
          </span>
        </div>
      );
    }

    // -------------------------------------------------------------
    // 4. COMMODITIES
    // -------------------------------------------------------------
    if (cleanSymbol === 'XAU' || cleanSymbol === 'GOLD') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#FFE57F] via-[#FFD700] to-[#B8860B] text-black font-extrabold flex flex-col items-center justify-center p-0.5 shadow-[0_0_10px_rgba(255,215,0,0.4)]">
          <span className="text-[9px] font-mono leading-none tracking-tighter opacity-80">79</span>
          <span className="text-[12px] font-serif font-black leading-none">Au</span>
        </div>
      );
    }

    if (cleanSymbol === 'XAG' || cleanSymbol === 'SILVER') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] text-slate-900 font-extrabold flex flex-col items-center justify-center p-0.5 shadow-[0_0_8px_rgba(226,232,240,0.4)]">
          <span className="text-[9px] font-mono leading-none tracking-tighter opacity-80">47</span>
          <span className="text-[12px] font-serif font-black leading-none">Ag</span>
        </div>
      );
    }

    if (cleanSymbol === 'BRENT' || cleanSymbol === 'WTI') {
      return (
        <div className="w-full h-full bg-[#1E293B] text-amber-400 border border-amber-500/40 flex flex-col items-center justify-center p-1">
          <span className="text-[11px] leading-none">🛢️</span>
          <span className="text-[8px] font-mono font-black text-white leading-none mt-0.5">
            {cleanSymbol}
          </span>
        </div>
      );
    }

    if (cleanSymbol === 'NG' || cleanSymbol === 'NATGAS' || cleanSymbol === 'TTF') {
      return (
        <div className="w-full h-full bg-[#082F49] text-[#38BDF8] border border-[#38BDF8]/40 flex flex-col items-center justify-center p-0.5">
          <span className="text-[11px] leading-none">🔥</span>
          <span className="text-[8px] font-mono font-bold text-white leading-none mt-0.5">GAS</span>
        </div>
      );
    }

    if (cleanSymbol === 'HG' || cleanSymbol === 'COPPER') {
      return (
        <div className="w-full h-full bg-[#9A3412] text-amber-200 border border-amber-600/50 flex flex-col items-center justify-center p-0.5">
          <span className="text-[9px] font-mono leading-none tracking-tighter opacity-80">29</span>
          <span className="text-[12px] font-serif font-black leading-none">Cu</span>
        </div>
      );
    }

    if (cleanSymbol === 'URANIUM' || cleanSymbol === 'U3O8') {
      return (
        <div className="w-full h-full bg-[#1C1917] text-[#FACC15] border border-[#FACC15]/40 flex flex-col items-center justify-center p-0.5">
          <span className="text-[12px] leading-none">☢️</span>
          <span className="text-[8px] font-mono font-black leading-none mt-0.5">U</span>
        </div>
      );
    }

    if (cleanSymbol === 'LITHIUM' || cleanSymbol === 'LIT') {
      return (
        <div className="w-full h-full bg-[#083344] text-[#22D3EE] border border-[#22D3EE]/40 flex flex-col items-center justify-center p-0.5">
          <span className="text-[9px] font-mono leading-none tracking-tighter opacity-80">3</span>
          <span className="text-[12px] font-serif font-black leading-none">Li</span>
        </div>
      );
    }

    if (name.toLowerCase().includes('kaffee') || cleanSymbol === 'COFFEE') {
      return (
        <div className="w-full h-full bg-[#451A03] text-amber-300 border border-amber-700/40 flex items-center justify-center text-[13px]">
          ☕
        </div>
      );
    }

    if (name.toLowerCase().includes('kakao') || cleanSymbol === 'COCOA') {
      return (
        <div className="w-full h-full bg-[#3E2723] text-amber-300 border border-amber-800/40 flex items-center justify-center text-[13px]">
          🍫
        </div>
      );
    }

    if (name.toLowerCase().includes('weizen') || cleanSymbol === 'WHEAT') {
      return (
        <div className="w-full h-full bg-[#78350F] text-amber-300 border border-amber-600/40 flex items-center justify-center text-[13px]">
          🌾
        </div>
      );
    }

    // -------------------------------------------------------------
    // 5. INDICES
    // -------------------------------------------------------------
    if (cleanSymbol === 'SPX' || cleanSymbol === 'S&P 500') {
      return (
        <div className="w-full h-full bg-[#1E3A8A] text-white flex flex-col items-center justify-center p-0.5 border border-blue-400/40">
          <span className="text-[8px] font-mono font-bold text-blue-200 leading-none">S&P</span>
          <span className="text-[12px] font-black leading-none">500</span>
        </div>
      );
    }

    if (cleanSymbol === 'NDX' || cleanSymbol === 'QQQ') {
      return (
        <div className="w-full h-full bg-[#064E3B] text-[#34D399] flex flex-col items-center justify-center p-0.5 border border-[#34D399]/40">
          <span className="text-[8px] font-mono font-bold leading-none">NAS</span>
          <span className="text-[12px] font-black leading-none text-white">100</span>
        </div>
      );
    }

    if (cleanSymbol === 'DAX' || cleanSymbol === 'GDAXI') {
      return (
        <div className="w-full h-full bg-[#1C1917] text-[#F59E0B] flex flex-col items-center justify-center p-0.5 border border-[#F59E0B]/40">
          <span className="text-[8px] font-mono font-bold text-amber-400 leading-none">DE</span>
          <span className="text-[12px] font-black leading-none text-white">DAX</span>
        </div>
      );
    }

    if (cleanSymbol === 'DJI') {
      return (
        <div className="w-full h-full bg-[#0F172A] text-white flex flex-col items-center justify-center p-0.5 border border-slate-700">
          <span className="text-[8px] font-mono font-bold text-slate-400 leading-none">DOW</span>
          <span className="text-[12px] font-black leading-none text-amber-400">30</span>
        </div>
      );
    }

    if (cleanSymbol === 'SX5E') {
      return (
        <div className="w-full h-full bg-[#1E40AF] text-white flex flex-col items-center justify-center p-0.5 border border-blue-400/40">
          <span className="text-[8px] font-mono font-bold text-blue-200 leading-none">STX</span>
          <span className="text-[12px] font-black leading-none">50</span>
        </div>
      );
    }

    if (cleanSymbol === 'VIX') {
      return (
        <div className="w-full h-full bg-[#581C87] text-[#C084FC] flex flex-col items-center justify-center p-0.5 border border-purple-400/40">
          <span className="text-[11px] leading-none">⚡</span>
          <span className="text-[8px] font-mono font-black text-white leading-none mt-0.5">VIX</span>
        </div>
      );
    }

    // -------------------------------------------------------------
    // 6. GENERAL RECOGNIZABLE MONOGRAM BADGE (Fallback)
    // -------------------------------------------------------------
    const getCategoryColors = () => {
      switch (category) {
        case 'KRYPTO':
          return {
            bg: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
            border: 'border-amber-500/40',
            text: 'text-amber-300',
          };
        case 'AKTIEN':
          return {
            bg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
            border: 'border-emerald-500/40',
            text: 'text-emerald-300',
          };
        case 'INDIZIES':
          return {
            bg: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
            border: 'border-purple-500/40',
            text: 'text-purple-300',
          };
        case 'FOREX':
          return {
            bg: 'bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-600/10',
            border: 'border-fuchsia-500/40',
            text: 'text-fuchsia-300',
          };
        case 'ROHSTOFFE':
          return {
            bg: 'bg-gradient-to-br from-yellow-500/20 to-amber-600/10',
            border: 'border-yellow-500/40',
            text: 'text-yellow-300',
          };
        default:
          return {
            bg: 'bg-slate-800',
            border: 'border-slate-700',
            text: 'text-white',
          };
      }
    };

    const colors = getCategoryColors();
    // Display clean full ticker up to 4 chars without truncating below 3
    const displayLabel = cleanSymbol.length <= 4 ? cleanSymbol : cleanSymbol.slice(0, 4);

    return (
      <div
        className={`w-full h-full ${colors.bg} ${colors.border} ${colors.text} border flex items-center justify-center font-mono font-bold tracking-tight text-center`}
      >
        <span className="truncate px-0.5">{displayLabel}</span>
      </div>
    );
  };

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden font-mono shadow-sm select-none ${currentSizeStyle} ${className}`}
    >
      {renderLogoContent()}
    </div>
  );
};
