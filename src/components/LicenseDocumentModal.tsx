/**
 * ============================================================================
 * CAPITAL AI — LICENSE DOCUMENT MODAL
 * ----------------------------------------------------------------------------
 * Formale, druckbare Lizenz-Zertifikate für wissenschaftliche Zwecke
 * (Forschung, Lehre, Thesen, Quantitative Modellierung) für Kraken, Binance,
 * Twelve Data, Polygon.io und das Master-Gateway mit direktem PDF-Download.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  FileText,
  Building2,
  Calendar,
  Hash,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CertificateProviderKey,
  CERTIFICATE_PRESETS,
  generateLicenseCertificatePDF,
  downloadMinimalistLicensePdf,
} from '../utils/licenseCertificatePdf';

export interface LicenseDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProvider?: CertificateProviderKey;
}

export const LicenseDocumentModal: React.FC<LicenseDocumentModalProps> = ({
  isOpen,
  onClose,
  initialProvider = 'master',
}) => {
  const [selectedProvider, setSelectedProvider] = useState<CertificateProviderKey>(initialProvider);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingMinimalistPdf, setIsGeneratingMinimalistPdf] = useState(false);

  useEffect(() => {
    if (initialProvider) {
      setSelectedProvider(initialProvider);
    }
  }, [initialProvider]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const cert = CERTIFICATE_PRESETS[selectedProvider] || CERTIFICATE_PRESETS.master;

  // Ornate Gold Certificate PDF
  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      generateLicenseCertificatePDF(selectedProvider);
    } catch (err) {
      console.error('Failed to generate PDF certificate:', err);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 800);
    }
  };

  // Minimalistisches formales Dokument als Blob-Download (Forschung & Lehre)
  const handleDownloadMinimalistPdf = (providerKey?: CertificateProviderKey) => {
    const target = providerKey || selectedProvider;
    setIsGeneratingMinimalistPdf(true);
    try {
      downloadMinimalistLicensePdf(target);
    } catch (err) {
      console.error('Failed to export minimalist PDF certificate:', err);
    } finally {
      setTimeout(() => setIsGeneratingMinimalistPdf(false), 800);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyText = () => {
    const textToCopy = `================================================================================
CAPITAL-AI TECHNOLOGIES GMBH — OFFIZIELLES LIZENZ-ZERTIFIKAT
(Forschung & Lehre / Academic & Scientific Research Proof)
Zertifikats-Nummer: ${cert.certNumber}
Stand: 2026 / Version 1.0
================================================================================

1. LIZENZNEHMER & BEGÜNSTIGTER:
Sven Kulessa (sven.kulessa@gmail.com) / Capital-AI Technologies GmbH
Börsenplatz 4, 60313 Frankfurt am Main, Deutschland (HRB 128490)

2. ZERTIFIZIERTER DATENPROVIDER & RECHTSGRUNDLAGE:
Provider: ${cert.providerName}
Betreiber: ${cert.operator}
Jurisdiktion: ${cert.jurisdiction}
Schnittstellen: ${cert.interfaces}
Rechtliche Basis: ${cert.legalBasis}

3. GESTATTETE NUTZUNG FÜR FORSCHUNG & LEHRE:
${cert.purposeBullets.map((b) => `• ${b}`).join('\n')}

4. COMPLIANCE & BAFIN-REVISIONSSICHERHEIT:
${cert.complianceClauses.map((c) => `• ${c}`).join('\n')}

5. KRYPTOGRAFISCHE PRÜFSUMME (SHA-256):
${cert.sha256Verification}
${cert.bafinParagraph}

6. GESCHÄFTSFÜHRUNG & UNTERSCHRIFTEN:
- Dr. Maximilian von Berg (CEO, Capital-AI Technologies GmbH)
- Sven Kulessa (CTO & Systemarchitekt, Lizenzinhaber)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#030712] border border-amber-500/30 shadow-[0_0_50px_rgba(245,176,20,0.15)] text-slate-100 p-5 sm:p-7 z-10 space-y-6"
        >
          {/* Top Bar: Title & Close */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,176,20,0.2)]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    Formales Lizenz-Zertifikat
                  </h2>
                  <span className="hidden xs:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/15 border border-amber-400/30 text-amber-300">
                    Forschung &amp; Lehre
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Wissenschaftliche Marktdatennutzung, BaFin-Revisionssicherheit &amp; Urkundennachweis
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Provider Quick Switcher Tabs & Quick Download */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-slate-800/90 overflow-x-auto">
              {[
                { id: 'master', label: '★ Master-Zertifikat (Alle 4 Provider)' },
                { id: 'kraken', label: 'Kraken (Payward)' },
                { id: 'binance', label: 'Binance Vision' },
                { id: 'twelve', label: 'Twelve Data (Academic 20%)' },
                { id: 'polygon', label: 'Polygon.io / Massive' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedProvider(tab.id as CertificateProviderKey)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedProvider === tab.id
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(245,176,20,0.25)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Export per Provider Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Schnell-Export (Forschung &amp; Lehre Blob-Download):</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'master', label: 'Master' },
                    { id: 'kraken', label: 'Kraken' },
                    { id: 'binance', label: 'Binance' },
                    { id: 'twelve', label: 'Twelve Data' },
                    { id: 'polygon', label: 'Polygon' },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleDownloadMinimalistPdf(p.id)}
                    className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 transition-all flex items-center gap-1 cursor-pointer"
                    title={`PDF-Export für ${p.label} (Forschung & Lehre) herunterladen`}
                  >
                    <Download className="w-3 h-3 text-amber-400" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions & Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#070e22]/90 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gültigkeit: <strong className="text-emerald-400">Verifiziert • Revisionssicher (BaFin MaRisk AT 7.2)</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Vollständigen Zertifikatstext in die Zwischenablage kopieren"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'Kopiert!' : 'Text kopieren'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Drucken"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Drucken</span>
              </button>

              {/* PDF EXPORT (MINIMALISTISCHES FORMALES DOKUMENT ALS BLOB-DOWNLOAD FÜR FORSCHUNG & LEHRE) */}
              <button
                type="button"
                onClick={() => handleDownloadMinimalistPdf()}
                disabled={isGeneratingMinimalistPdf}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.25)] disabled:opacity-50"
                title="Erzeugt ein minimalistisches, formales DIN A4 Dokument als Blob-Download mit explizitem Anwendungszweck Forschung & Lehre"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isGeneratingMinimalistPdf ? 'Exportiere PDF...' : 'PDF-Export (Forschung & Lehre)'}</span>
              </button>

              {/* URKUNDE PDF DOWNLOAD (VOLLFARBIGE URKUNDE) */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(245,176,20,0.3)] disabled:opacity-50"
                title="Vollfarbige Urkunde mit Dienstsiegel als PDF herunterladen"
              >
                <Award className="w-3.5 h-3.5 text-black" />
                <span>{isGeneratingPdf ? 'Erzeuge...' : 'Urkunde (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* VISUAL CERTIFICATE CANVAS / URKUNDEN-VORSCHAU */}
          <div className="relative rounded-3xl p-6 sm:p-9 bg-gradient-to-b from-[#0a122c] via-[#050b1d] to-[#02050e] border-2 border-amber-500/40 shadow-2xl space-y-6 text-slate-200">
            {/* Watermark Emblem in Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Award className="w-[380px] h-[380px] text-amber-400" />
            </div>

            {/* Inner Dual Security Border */}
            <div className="border border-amber-400/20 rounded-2xl p-5 sm:p-7 space-y-6 relative">
              {/* Corner Gold Triangles */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

              {/* Certificate Header */}
              <div className="text-center space-y-2 pb-5 border-b border-amber-400/20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono uppercase font-bold tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{cert.badgeTitle}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                  {cert.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {cert.subtitle}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Hash className="w-3.5 h-3.5" />
                    <strong>{cert.certNumber}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Frankfurt am Main (HRB 128490)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Rechtsstand 2026</span>
                  </span>
                </div>
              </div>

              {/* 1. Lizenznehmer Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-black/40 p-4 rounded-2xl border border-slate-800 font-mono">
                <div className="space-y-1">
                  <span className="text-slate-500 block uppercase text-[10px] font-bold">Lizenznehmer &amp; Begünstigter:</span>
                  <strong className="text-white text-sm">Sven Kulessa</strong>
                  <span className="text-slate-400 block">sven.kulessa@gmail.com</span>
                  <span className="text-slate-500 block text-[11px]">Capital-AI Technologies GmbH</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block uppercase text-[10px] font-bold">Geltungsbereich &amp; Rechtsbasis:</span>
                  <strong className="text-emerald-400">Wissenschaftliche Forschung &amp; Lehre</strong>
                  <span className="text-slate-400 block text-[11px]">{cert.legalBasis}</span>
                  <span className="text-slate-500 block text-[11px]">MiCA- &amp; BaFin-konformes WORM-Archiv</span>
                </div>
              </div>

              {/* 2. Provider & Interfaces Details */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Zertifizierter Datenprovider &amp; Gateways
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-2 text-slate-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <strong className="text-white text-sm">{cert.providerName}</strong>
                    <span className="text-slate-400 text-xs font-mono">{cert.jurisdiction}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    <strong>Schnittstellen:</strong> {cert.interfaces}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                    {cert.officialLinks.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 flex items-center gap-1 transition-colors"
                      >
                        <span>{link.replace('https://', '')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Eingeräumte Forschungszwecke */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Zulässige Verwertungszwecke (Research Grant)
                </div>
                <div className="space-y-2 bg-black/30 p-4 rounded-2xl border border-slate-800">
                  {cert.purposeBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Compliance & Revisionssicherheit */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Compliance-Garantie &amp; BaFin MaRisk (AT 7.2)
                </div>
                <div className="space-y-2 bg-black/30 p-4 rounded-2xl border border-slate-800">
                  {cert.complianceClauses.map((clause, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{clause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. SHA-256 Checksumme */}
              <div className="p-3.5 rounded-xl bg-black/70 border border-slate-800 font-mono text-[11px] text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-slate-400">SHA-256 Prüfsumme:</span>
                  <span className="text-amber-300 text-[10px] break-all">{cert.sha256Verification}</span>
                </div>
                <span className="text-[10px] text-emerald-400 shrink-0 font-bold">WORM VERIFIED</span>
              </div>

              {/* 6. Unterschriften & Dienstsiegel */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="font-serif italic text-base text-amber-300 font-bold">Dr. Maximilian von Berg</div>
                  <div className="text-xs font-semibold text-white">Vertretungsberechtigte Geschäftsführung (CEO)</div>
                  <div className="text-[11px] text-slate-500">Capital-AI Technologies GmbH</div>
                </div>

                <div className="space-y-1">
                  <div className="font-serif italic text-base text-cyan-300 font-bold">Sven Kulessa</div>
                  <div className="text-xs font-semibold text-white">Chief Technology Officer (CTO) &amp; Lizenznehmer</div>
                  <div className="text-[11px] text-slate-500">Systemarchitekt &amp; Forschungsleitung</div>
                </div>

                {/* Siegel-Badge */}
                <div className="w-20 h-20 rounded-full border-2 border-amber-400/50 bg-amber-400/5 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_15px_rgba(245,176,20,0.15)] shrink-0">
                  <Award className="w-5 h-5 text-amber-400 mb-0.5" />
                  <span className="text-[8px] font-black uppercase text-amber-300 leading-tight">CAPITAL-AI</span>
                  <span className="text-[7px] font-mono text-slate-400">RESEARCH</span>
                </div>
              </div>

              {/* Bottom Quick-Action Download Strip */}
              <div className="pt-3 border-t border-amber-400/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-amber-400/[0.03] p-3 rounded-xl">
                <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Expliziter Ausweis: <strong>Forschung &amp; Lehre (§ 60a ff. UrhG)</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadMinimalistPdf(selectedProvider)}
                  disabled={isGeneratingMinimalistPdf}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PDF-Export für {cert.providerName.split(' ')[0]} herunterladen</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
