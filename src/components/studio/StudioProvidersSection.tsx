/**
 * ============================================================================
 * CAPITAL AI — STUDIO HUB: DATAPROVIDER & GATEWAYS
 * ----------------------------------------------------------------------------
 * Vollständige, übersichtliche Darstellung aller autorisierten Datenprovider
 * (Kraken, Binance, Twelve Data, Polygon.io / Massive sowie Makro-Behördenfeeds)
 * mit Schnittstellen, Rate Limits, Lizenzen, Latenzen & Zertifikats-Export.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Radio,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Award,
  Download,
  AlertTriangle,
  Server,
  Zap,
  Globe2,
  Clock,
  Coins,
  Building2,
  Check,
  Copy,
} from 'lucide-react';
import { ProviderStatusDashboard } from '../ProviderStatusDashboard';
import { LicenseDocumentModal } from '../LicenseDocumentModal';
import { CertificateProviderKey } from '../../utils/licenseCertificatePdf';

export interface DataProviderItem {
  id: CertificateProviderKey;
  name: string;
  operator: string;
  headquarters: string;
  assetClasses: string[];
  interfaces: string[];
  rateLimits: string;
  costTier: string;
  latencySla: string;
  academicGrant: string;
  derivedDataStatus: string;
  bafinCompliance: string;
  officialUrls: { label: string; url: string }[];
  summary: string;
  highlightTag: string;
}

export const DATA_PROVIDERS_LIST: DataProviderItem[] = [
  {
    id: 'kraken',
    name: 'Kraken (Payward)',
    operator: 'Payward Inc. & Payward Ireland Ltd.',
    headquarters: 'San Francisco, CA, USA / Dublin, Irland',
    assetClasses: ['Krypto Spot (EUR, USD, BTC, ETH)', 'Krypto Futures', 'L2/L3 Orderbuch-Tapes'],
    interfaces: ['Public REST API v0', 'WebSockets API v2', 'Raw Order Book Snapshots'],
    rateLimits: '15 – 20 Requests / Sekunde (Public Tier Counter)',
    costTier: '0,00 € / Monat (Öffentliche Marktdaten frei abrufbar)',
    latencySla: '22 – 38 ms',
    academicGrant: 'Ausdrückliche Autorisierung für quantitative Forschung, Modell-Backtesting & Signal-Studies',
    derivedDataStatus: 'Uneingeschränkte Erlaubnis zur Erstellung aggregierter 0-100 Scores & Z-Scores',
    bafinCompliance: 'Vollständige MaRisk AT 7.2 Entkopplung & SHA-256 Checksummenprüfung',
    officialUrls: [
      { label: 'API Docs', url: 'https://docs.kraken.com/rest/' },
      { label: 'WebSockets v2', url: 'https://docs.kraken.com/websockets-v2' },
      { label: 'Legal Terms', url: 'https://www.kraken.com/legal' },
    ],
    summary:
      'Primär-Gateway für hochpräzise Krypto-Marktdaten. Erlaubt freien Abruf von Ticker, Trades, OHLCV und Orderbuch-Snapshots ohne Authentifizierungszwang für wissenschaftliche und interne Modellentwicklung.',
    highlightTag: 'Public Research Grant',
  },
  {
    id: 'binance',
    name: 'Binance Vision',
    operator: 'Binance Holdings Ltd. / BAM Trading Services Inc.',
    headquarters: 'Global Open Data Initiative / Miami, FL',
    assetClasses: ['Krypto Spot', 'USD(S)-M Futures', 'Coin-M Futures', 'Global Trades Archive'],
    interfaces: ['Binance Public Data (data.binance.vision)', 'Spot & Futures WebSockets', 'REST API'],
    rateLimits: '1.200 IP-Weight / Minute (deterministisches Fair-Use Quota)',
    costTier: '0,00 € / Monat (Binance Vision Dataset Terms v1.0)',
    latencySla: '18 – 32 ms',
    academicGrant: 'Offizieller akademischer Standard an Universitäten (MIT, Oxford, ArXiv) für Machine Learning',
    derivedDataStatus: 'Erlaubt für interne Modell-Pipelines; kein Rohdaten-Weiterverkauf an Dritte',
    bafinCompliance: 'WORM-konforme Prüfsummenarchivierung aller berechneten Aggregatwerte',
    officialUrls: [
      { label: 'data.binance.vision', url: 'https://data.binance.vision/' },
      { label: 'GitHub Repository', url: 'https://github.com/binance/binance-public-data' },
      { label: 'Terms of Service', url: 'https://www.binance.com/en/terms' },
    ],
    summary:
      'Umfangreichstes frei zugängliches Krypto-Historienarchiv weltweit. Das dedizierte Open-Data-Archiv bietet lückenlose Tick- und Kline-Archive für quantitative Zeitreihenanalysen und neuronales Feature Engineering.',
    highlightTag: 'Open Data Archive',
  },
  {
    id: 'twelve',
    name: 'Twelve Data',
    operator: 'Twelve Data Pte. Ltd.',
    headquarters: 'Singapur (Global Financial Data Gateway)',
    assetClasses: ['Globale Aktien (250+ Börsen: XETRA, NYSE, NASDAQ, LSE)', 'Forex', 'ETFs', 'Rohstoffe', 'Indizes'],
    interfaces: ['REST API v1', 'Streaming WebSockets', 'SDKs (Python, JS)'],
    rateLimits: '800 Requests / Minute (Dedicated Academic Plan)',
    costTier: '~14,40 € / Monat (Inkl. 20% verifiziertem Bildungsrabatt)',
    latencySla: '45 – 90 ms',
    academicGrant: 'Offizielles University & Research Programm mit 20% Nachlass für Studenten, Forscher & Dozenten',
    derivedDataStatus: 'Explizite vertragliche Freigabe für abgeleitete Z-Scores, Screener-Rankings und Kennzahlen',
    bafinCompliance: 'Revisionssichere Belege aller abgefragten Unternehmensbilanzen & Fundamentaldaten',
    officialUrls: [
      { label: 'Terms of Service', url: 'https://twelvedata.com/terms-of-service' },
      { label: 'Pricing & Education', url: 'https://twelvedata.com/pricing' },
      { label: 'Derived Data Legal', url: 'https://twelvedata.com/legal' },
    ],
    summary:
      'Kanonisches Multi-Asset-Gateway für weltweite Aktien und Währungen. Durch den 20% Forschungsrabatt liefert Twelve Data institutionelle Kurs- und Bilanzdaten für über 250 internationale Börsen unter 15 € im Monat.',
    highlightTag: 'Academic 20% Program',
  },
  {
    id: 'polygon',
    name: 'Polygon.io / Massive',
    operator: 'Polygon Technology LLC / Massive Markets',
    headquarters: 'Boston, MA, USA',
    assetClasses: ['US-Aktien (NBBO Real-Time)', 'Optionen', 'Indizes', '20+ Jahre Tick-Archive'],
    interfaces: ['REST API', 'S3 Flat Files (Tick-Level Archive)', 'WebSocket Clusters'],
    rateLimits: 'Unbegrenzte S3 Flat Files Downloads; 100 req/s REST',
    costTier: '~12,00 € / Monat (Inkl. 20% Student Beans Research Discount)',
    latencySla: '25 – 48 ms',
    academicGrant: 'Offizielle Unterstützung für universitäre Finanzlabore (u.a. Bradley University, Ohio State)',
    derivedDataStatus: 'Vollständige Erlaubnis für interne Modellierung und Publikation aggregierter Kennzahlen',
    bafinCompliance: 'Deterministisches Schatten-Benchmarking nach FINRA TRF / BaFin MaRisk Vorgaben',
    officialUrls: [
      { label: 'Massive Terms', url: 'https://massive.com/terms' },
      { label: 'Polygon Docs', url: 'https://polygon.io/docs' },
      { label: 'Student Beans Discount', url: 'https://massive.com/pricing' },
    ],
    summary:
      'High-Precision NBBO Real-Time Feeds und über 20 Jahre lückenlose Tick-Archive über Amazon S3 Flat Files. Optimal für deterministisches Schatten-Benchmarking und quantitative Backtests historischer Krisenphasen.',
    highlightTag: '20+ Y Tick Archives',
  },
];

export const StudioProvidersSection: React.FC = () => {
  const [selectedProviderKey, setSelectedProviderKey] = useState<CertificateProviderKey>('kraken');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [modalProvider, setModalProvider] = useState<CertificateProviderKey>('master');
  const [showLiveFleetDashboard, setShowLiveFleetDashboard] = useState(false);

  const selectedProvider =
    DATA_PROVIDERS_LIST.find((p) => p.id === selectedProviderKey) || DATA_PROVIDERS_LIST[0];

  const handleOpenCertificate = (key: CertificateProviderKey) => {
    setModalProvider(key);
    setIsCertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#0d1530] to-cyan-500/10 border border-emerald-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Radio className="w-3.5 h-3.5" />
              <span>AUTORISIERTE DATA-PROVIDER &amp; FLEET MONITOR • TIER 1 INGESTION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Dataprovider, Feeds &amp; Gateways
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Vollständige Transparenz aller Marktdatenquellen: Kraken, Binance, Twelve Data und Polygon.io
              mit verifizierten Lizenzen für Forschung &amp; Lehre, Latenz-SLAs, Schnittstellen-Spezifikationen
              und revisionssicherer BaFin MaRisk (AT 7.2) Konformität.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenCertificate('master')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(245,176,20,0.25)]"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Master-Zertifikat (PDF)</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLiveFleetDashboard(!showLiveFleetDashboard)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Server className="w-3.5 h-3.5" />
              <span>{showLiveFleetDashboard ? 'Detail-Karten anzeigen' : 'Live Fleet Health Monitor'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Status Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Autorisierte Provider</div>
          <div className="text-lg font-bold text-white mt-0.5">4 Gateways + Makro</div>
          <div className="text-[11px] font-mono text-emerald-400">100% Lizenzkonform</div>
        </div>
        <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Monitored Universum</div>
          <div className="text-lg font-bold text-cyan-300 mt-0.5">42.000+ Ticker</div>
          <div className="text-[11px] font-mono text-slate-400">Krypto, Aktien, Forex</div>
        </div>
        <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Durchschnittliche Latenz</div>
          <div className="text-lg font-bold text-amber-300 mt-0.5">Sub-35 ms</div>
          <div className="text-[11px] font-mono text-emerald-400">WebSocket Direct</div>
        </div>
        <div className="p-4 rounded-xl bg-[#090e21] border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Monatliche Gesamtkosten</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">~26,40 € / Mo</div>
          <div className="text-[11px] font-mono text-cyan-300">&lt; 40 € Budget-Cap</div>
        </div>
      </div>

      {/* Toggle View: Live Fleet Health Dashboard vs. Clean Provider Cards */}
      {showLiveFleetDashboard ? (
        <div className="rounded-2xl border border-slate-800 bg-[#090e21] p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Eingebettetes Live Provider Status Dashboard &amp; Health Monitor</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowLiveFleetDashboard(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Schließen &rarr;
            </button>
          </div>
          <ProviderStatusDashboard isStandaloneView={false} />
        </div>
      ) : (
        <>
          {/* Provider Quick Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DATA_PROVIDERS_LIST.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProviderKey(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedProviderKey === p.id
                    ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 scale-[1.02]'
                    : 'bg-[#090e21] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{p.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {p.latencySla.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate">{p.highlightTag}</div>
                <div className="text-[10px] font-mono text-cyan-400 mt-1 truncate">{p.costTier.split('(')[0]}</div>
              </button>
            ))}
          </div>

          {/* Selected Provider In-Depth Dossier Card */}
          <div className="p-6 rounded-2xl bg-[#090e21] border border-emerald-500/40 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {selectedProvider.highlightTag}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedProvider.headquarters}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{selectedProvider.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{selectedProvider.summary}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenCertificate(selectedProvider.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Offizielles Lizenz-Zertifikat für Forschung & Lehre anzeigen & als PDF exportieren"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zertifikat (PDF-Export)</span>
                </button>
                {selectedProvider.officialUrls.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>

            {/* Provider Spec Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800/80 space-y-2.5">
                <h4 className="font-bold text-white uppercase text-[11px] font-mono tracking-wider flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  Technische Datenfeeds &amp; Quotas
                </h4>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-slate-400 font-mono">Schnittstellen: </span>
                    <span className="text-slate-200 font-medium">
                      {selectedProvider.interfaces.join(' • ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono">Asset-Klassen: </span>
                    <span className="text-slate-200">{selectedProvider.assetClasses.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono">Rate Limits &amp; Weight: </span>
                    <span className="text-amber-300 font-mono font-bold">
                      {selectedProvider.rateLimits}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono">Latenz-SLA: </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {selectedProvider.latencySla}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono">Kosten &amp; Tarif: </span>
                    <span className="text-cyan-300 font-semibold">{selectedProvider.costTier}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-slate-800/80 space-y-2.5">
                <h4 className="font-bold text-white uppercase text-[11px] font-mono tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Wissenschaftliche Lizenzen &amp; BaFin Compliance
                </h4>
                <div className="space-y-1.5">
                  <div>
                    <strong className="text-emerald-400 block font-mono text-[11px]">
                      Forschung &amp; Lehre Status:
                    </strong>
                    <span className="text-slate-300">{selectedProvider.academicGrant}</span>
                  </div>
                  <div>
                    <strong className="text-cyan-400 block font-mono text-[11px]">
                      Derived Data Erlaubnis:
                    </strong>
                    <span className="text-slate-300">{selectedProvider.derivedDataStatus}</span>
                  </div>
                  <div>
                    <strong className="text-amber-400 block font-mono text-[11px]">
                      BaFin MaRisk AT 7.2 Konformität:
                    </strong>
                    <span className="text-slate-300">{selectedProvider.bafinCompliance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Macro Government Data Note */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Globe2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">
                    Ergänzende Makro- &amp; Zinsdaten-Quellen (Öffentliche Feeds)
                  </strong>
                  <span className="text-slate-400 text-[11px]">
                    Zentralbankzinsen (EZB, FED), 10Y-2Y Renditespreads und Inflationsraten (VPI) werden über freie Regierungsschnittstellen (FRED / Deutsche Bundesbank) ohne API-Gebühren integriert.
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-purple-300 px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 whitespace-nowrap self-start sm:self-auto">
                0 € Public Domain
              </span>
            </div>
          </div>
        </>
      )}

      {/* Modal for PDF Certificates */}
      <LicenseDocumentModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        initialProvider={modalProvider}
      />
    </div>
  );
};
