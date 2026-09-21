import React, { useState } from 'react';
import { Smartphone, Monitor, Sparkles, RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { KeyPillars } from './components/KeyPillars';
import { MarketOverview } from './components/MarketOverview';
import { CoreModules } from './components/CoreModules';
import { Footer } from './components/Footer';
import { StatusBar } from './components/StatusBar';
import { AnalysisModal } from './components/AnalysisModal';
import { ProductTourModal } from './components/ProductTourModal';
import { AssetDetailModal } from './components/AssetDetailModal';
import { ModuleDetailModal } from './components/ModuleDetailModal';
import { AllMarketsModal } from './components/AllMarketsModal';
import { MarketAsset, CoreModule } from './types';
import { CORE_MODULES } from './data/mockData';

export default function App() {
  const [viewMode, setViewMode] = useState<'mockup' | 'fullscreen'>('mockup');
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isProductTourOpen, setIsProductTourOpen] = useState(false);
  const [isAllMarketsOpen, setIsAllMarketsOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [selectedModule, setSelectedModule] = useState<CoreModule | null>(null);

  const handleOpenModuleById = (moduleId: string) => {
    const found = CORE_MODULES.find((m) => m.id === moduleId);
    if (found) {
      setSelectedModule(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#02050e] text-slate-100 flex flex-col items-center justify-start relative overflow-x-hidden">
      {/* Background ambient gold light rays & cosmic particles (matching mockup outer environment) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Diagonal Golden Ray 1 */}
        <div
          className="absolute -top-40 -left-40 w-[650px] h-[650px] opacity-25"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245, 176, 20, 0.18) 0%, rgba(245, 176, 20, 0.04) 45%, transparent 70%)',
            transform: 'rotate(-25deg)',
          }}
        />
        {/* Diagonal Golden Ray 2 */}
        <div
          className="absolute top-1/3 -right-60 w-[750px] h-[750px] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245, 176, 20, 0.15) 0%, transparent 65%)',
            transform: 'rotate(35deg)',
          }}
        />
        {/* Bottom subtle gold glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Top Floating Control Bar for Screen Toggle on Desktop */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-xl px-4 py-3 z-30 select-none">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Capital-AI • Mobile Landing Page Preview</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode('mockup')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              viewMode === 'mockup' ? 'bg-amber-400 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone Frame</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('fullscreen')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              viewMode === 'fullscreen' ? 'bg-amber-400 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Vollbreite</span>
          </button>
        </div>
      </div>

      {/* Main Landing Page Container */}
      <main
        className={`w-full relative z-10 transition-all duration-300 ${
          viewMode === 'mockup'
            ? 'sm:my-6 sm:max-w-[412px] sm:rounded-[52px] sm:border-[8px] sm:border-[#2a2f3e] sm:ring-1 sm:ring-amber-500/20 sm:shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(245,176,20,0.15)] bg-[#02050e] overflow-hidden'
            : 'max-w-md bg-[#02050e]'
        }`}
      >
        {/* Smartphone Hardware Elements (Only visible in mockup mode on larger screens) */}
        {viewMode === 'mockup' && (
          <div className="hidden sm:block">
            <StatusBar />
          </div>
        )}

        {/* Header */}
        <Header
          onOpenAnalysis={() => setIsAnalysisOpen(true)}
          onOpenModule={handleOpenModuleById}
        />

        {/* Hero Section */}
        <Hero
          onStartAnalysis={() => setIsAnalysisOpen(true)}
          onExploreProduct={() => setIsProductTourOpen(true)}
        />

        {/* 4 Feature Key Pillars */}
        <KeyPillars />

        {/* Global Markets Overview */}
        <MarketOverview
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onViewAllMarkets={() => setIsAllMarketsOpen(true)}
        />

        {/* Core Modules ("Unsere Kernmodule") */}
        <CoreModules
          onSelectModule={(module) => setSelectedModule(module)}
          onViewAllModules={() => handleOpenModuleById('enterprise-scorer')}
        />

        {/* Footer with Slogan & Home Indicator */}
        <Footer />
      </main>

      {/* Interactive Modals */}
      <AnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
      />

      <ProductTourModal
        isOpen={isProductTourOpen}
        onClose={() => setIsProductTourOpen(false)}
        onStartAnalysis={() => {
          setIsProductTourOpen(false);
          setIsAnalysisOpen(true);
        }}
      />

      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />

      <ModuleDetailModal
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
        onOpenAnalysis={() => {
          setSelectedModule(null);
          setIsAnalysisOpen(true);
        }}
      />

      <AllMarketsModal
        isOpen={isAllMarketsOpen}
        onClose={() => setIsAllMarketsOpen(false)}
        onSelectAsset={(asset) => {
          setIsAllMarketsOpen(false);
          setSelectedAsset(asset);
        }}
      />
    </div>
  );
}
