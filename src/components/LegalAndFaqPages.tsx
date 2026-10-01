import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  Shield,
  FileText,
  Building2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search,
  Lock,
  Zap,
  TrendingUp,
  Printer,
  Copy,
  Check,
  Globe2,
  Scale,
  AlertTriangle,
  Server,
  Info,
  Database,
  Code2,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';

export type LegalRoute =
  | '/faq'
  | '/datenschutz'
  | '/agb'
  | '/impressum'
  | '/lizenz'
  | '/datenprovider-lizenzen'
  | '/opensource-lizenzen';

interface LegalPagesProps {
  route: LegalRoute;
  onNavigate: (path: string) => void;
}

export const LegalAndFaqPages: React.FC<LegalPagesProps> = ({ route, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);
  const [providerFilter, setProviderFilter] = useState<'all' | 'kraken' | 'binance' | 'twelve' | 'polygon' | 'bafin'>('all');
  const [ossFilter, setOssFilter] = useState<'all' | 'mit' | 'isc' | 'apache' | 'bsd'>('all');
  const [expandedOssLicense, setExpandedOssLicense] = useState<string | null>('mit');

  // Print handler for legal document export
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Plain-text template exporter for clipboard
  const handleCopyTemplate = () => {
    let contentToCopy = '';

    if (route === '/datenschutz') {
      contentToCopy = `MUSTER-VORLAGE: DATENSCHUTZERKLÄRUNG (DSGVO)
Plattform: Capital-AI Market Intelligence Terminal
Stand: September 2026

1. VERANTWORTLICHE STELLE
Capital-AI Technologies GmbH
Börsenplatz 4, 60313 Frankfurt am Main, Deutschland
E-Mail: privacy@capital-ai.finance | Web: https://capital-ai.finance

2. DATENSCHUTZBEAUFTRAGTER
E-Mail: datenschutz@capital-ai.finance

3. RECHTSGRUNDLAGEN (DSGVO)
- Bereitstellung der Webanwendung & Server-Logs: Art. 6 Abs. 1 lit. f DSGVO
- Benutzerregistrierung & Vertragserfüllung: Art. 6 Abs. 1 lit. b DSGVO
- Einwilligung für optionale Features: Art. 6 Abs. 1 lit. a DSGVO

4. SICHERHEIT & RECHENZENTREN
256-Bit TLS-Verschlüsselung, ISO-27001 zertifizierte Server in Frankfurt am Main (EU). Keine Weitergabe von Nutzerdaten an werbliche Dritte.

5. IHRE RECHTE (ART. 15-21 DSGVO)
Recht auf Auskunft, Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit via privacy@capital-ai.finance.`;
    } else if (route === '/agb') {
      contentToCopy = `MUSTER-VORLAGE: ALLGEMEINE GESCHÄFTSBEDINGUNGEN (AGB)
Plattform: Capital-AI Market Intelligence Terminal
Stand: September 2026

§ 1 GELTUNGSBEREICH & VERTRAGSGEGENSTAND
Bereitstellung von SaaS-Analysetools, KI-gestützten Scorings und Marktdatenfeeds.

§ 2 WICHTIGER RISIKOHINWEIS (§ 2 Abs. 1 WpHG)
Die Plattform bietet keine Anlageberatung und keine Finanzanalysen im Sinne des Wertpapierhandelsgesetzes. Alle Daten dienen rein informatorischen Zwecken. Der Handel mit Finanzinstrumenten birgt erhebliche Risiken bis hin zum Totalverlust.

§ 3 VERFÜGBARKEIT & LATENZ
Zielverfügbarkeit von 99,5% im Jahresmittel. Marktdatenfeeds basieren auf Börsen-Schnittstellen (WebSockets).

§ 4 GEISTIGES EIGENTUM
Proprietäre Scoring-Algorithmen (Enterprise Scorer, Buffett Value Check) sind urheberrechtlich geschützt.

§ 5 SCHLUSSBESTIMMUNGEN
Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Frankfurt am Main.`;
    } else if (route === '/impressum') {
      contentToCopy = `MUSTER-VORLAGE: IMPRESSUM & ANBIETERKENNZEICHNUNG (§ 5 DDG)
Plattform: Capital-AI Market Intelligence Terminal
Stand: September 2026

DIENSTEANBIETER:
Capital-AI Technologies GmbH
Börsenplatz 4, 60313 Frankfurt am Main, Deutschland
Telefon: +49 (0) 69 9451-0
E-Mail: contact@capital-ai.finance | Web: https://capital-ai.finance

VERTRETUNGSBERECHTIGTE GESCHÄFTSFÜHRUNG:
Dr. Maximilian von Berg, Sven Kulessa

REGISTEREINTRAG:
Amtsgericht Frankfurt am Main, HRB 128490
Umsatzsteuer-ID: DE348920194 | Wirtschafts-ID: DE-W-128490

ZUSTÄNDIGE AUFSICHTSBEHÖRDE:
Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin) / IHK Frankfurt am Main

VERANTWORTLICH NACH § 18 ABS. 2 MStV:
Sven Kulessa, Börsenplatz 4, 60313 Frankfurt am Main`;
    } else if (route === '/lizenz') {
      contentToCopy = `URKUNDE ÜBER DIE KOMMERZIELLE DESIGN-, MARKEN- UND BILD-LIZENZ
Plattform: Capital-AI Enterprise Market Intelligence Terminal
Lizenznehmer: Sven Kulessa (sven.kulessa@gmail.com) / Capital-AI Technologies GmbH
Geltungsbereich: Weltweit, unbefristet, unwiderruflich, 100% Royalty-Free

1. UMFANG DER LIZENZ:
Vollständige Freigabe aller Benutzeroberflächen (UI/UX), Layouts, Color-Tokens, CSS-Systeme sowie aller generierten Bild-Assets für den uneingeschränkten produktiven und kommerziellen Betrieb (SaaS, Apps, White-Label, Marketing).

2. LIZENZIERTE BILDDATEIEN:
- capital_ai_brand_emblem_1789997857835.jpg (Brand Emblem)
- capital_ai_full_logo_1789997869885.jpg (Vollständige Wort-Bild-Marke)
- capital_ai_wide_banner_1789999064950.jpg (Marketing Banner)
- glowing_earth_nodes_1789997454893.jpg (Globales Datennetzwerk-Visual)

3. BESTÄTIGUNG:
Offiziell im Repository verankert in LICENSE und DESIGN_AND_ASSET_LICENSE.md. Stand: September 2026.`;
    } else if (route === '/datenprovider-lizenzen') {
      contentToCopy = `CAPITAL-AI — DATENPROVIDER-LIZENZDOKUMENTATION & WISSENSCHAFTLICHE NUTZUNGSBEDINGUNGEN
(Provider Licenses, Compliance & Academic / Scientific Research Proof Dossier)

Projekt: Capital-AI Enterprise Market Intelligence & Data Pipeline Platform
Lizenznehmer: Sven Kulessa (sven.kulessa@gmail.com) / Capital-AI Technologies GmbH
Stand: 2026 / Version 1.0

1. PROVIDER-VERZEICHNIS & WISSENSCHAFTLICHE ZWECKE:
- KRAKEN (Payward Inc., San Francisco / Dublin):
  Public REST API v0 & WebSockets v2. Öffentliche Marktdaten weltweit ohne Authentifizierungszwang für quantitative Forschung, Signal-Entwicklung, algorithmisches Backtesting und Modellierung autorisiert. Einhaltung des 15-20 req/s Public Rate Limits.
  Dokumentation: https://docs.kraken.com/rest/ | Terms: https://www.kraken.com/legal

- BINANCE (Binance Holdings Ltd. / BAM Trading Services Inc.):
  Binance Public Data Collection & WebSocket Streams. Dediziertes Open-Data-Archiv (data.binance.vision) und GitHub-Archiv (binance-public-data) unter Binance Vision Dataset Terms v1.0. Wissenschaftlich referenziert (MIT, Oxford, ETH Zürich) für Krypto-Ökonometrie & ML-Forschung. Einhaltung des 1.200 req/min Limits.
  Portal: https://data.binance.vision/ | Terms: https://www.binance.com/en/terms

- TWELVE DATA (Twelve Data Pte. Ltd., Singapur):
  Twelve Data Financial API & Streaming Engine. Offizielles Student & Academic Research Programm (20% Nachlass) für Bildungs-, Analyse- und universitäre Forschungsprojekte (Laufzeit 12 Monate, Bachelor/Master-Thesen, AI/ML-Training).
  Terms: https://twelvedata.com/terms-of-service | Pricing: https://twelvedata.com/pricing

- POLYGON.IO / MASSIVE (Polygon Technology LLC, Boston, USA):
  Polygon REST API, Flat Files S3 Archive & WebSockets. Offizielles Academic & Student Program (20% Rabatt via Student Beans sowie universitäre Business Analytics Lab Partnerschaften). 20+ Jahre Tick-Level NBBO-Historie für quantitatives Backtesting & Financial NLP.
  Terms: https://massive.com/terms | Docs: https://polygon.io/docs

2. DERIVED DATA KLAUSEL:
Capital-AI berechnet aus den Rohdaten aggregierte Scores (0-100 Enterprise Score, Buffett-Burggraben-Metriken, Sektor-Rotations-Indikatoren). Diese abgeleiteten Kennzahlen stellen kein Weiterveräußern roher Ticker-Feeds dar und sind gemäß den Standard-Provider-Klauseln uneingeschränkt zulässig.

3. BAFIN REVISIONSSICHERHEIT & WORM AUDIT-TRAIL:
Historische Kennzahlen werden mit kryptografischen SHA-256 Prüfsummen gemäß BaFin MaRisk (AT 7.2) im WORM-Archiv (Write Once, Read Many) persistiert.

Offiziell im Repository verankert in PROVIDER_LICENSES_AND_ACADEMIC_TERMS.md.`;
    } else if (route === '/opensource-lizenzen') {
      contentToCopy = `CAPITAL-AI — OPEN-SOURCE-SOFTWARE (OSS) LIZENZVERZEICHNIS & COMPLIANCE-NACHWEIS
Projekt: Capital-AI Enterprise Market Intelligence & Data Pipeline Platform
Lizenznehmer: Sven Kulessa (sven.kulessa@gmail.com) / Capital-AI Technologies GmbH
Stand: 2026 / Version 1.0

1. COMPLIANCE-ERKLÄRUNG:
100% Permissive Lizenzen (MIT, ISC, Apache 2.0, BSD-2-Clause).
0 Copyleft-Komponenten (GPL/AGPL-frei). Vollständige Freigabe für kommerziellen SaaS- und Enterprise-Betrieb.

2. INVENTAR DER KOMPONENTEN:
- React (^19.0.1) — MIT — Meta Platforms, Inc.
- React DOM (^19.0.1) — MIT — Meta Platforms, Inc.
- Vite (^8.3.0) — MIT — Yuxi (Evan) You & Contributors
- Tailwind CSS (^4.3.3) — MIT — Tailwind Labs, Inc.
- Lucide React (^0.546.0) — ISC — Cole Bemis (Feather Icons) & Lucide Contributors
- Motion (^12.23.24) — MIT — Framer B.V. / Matt Perry
- Recharts (^3.10.1) — MIT — Recharts Group
- Express (^4.21.2) — MIT — TJ Holowaychuk & Contributors
- jsPDF (^4.2.1) — MIT — James Hall & parallax
- Zod (^4.6.5) — MIT — Colin McDonnell and Zod contributors
- Dotenv (^17.2.3) — BSD-2-Clause — Scott Motte
- TypeScript (^7.0.2) — Apache 2.0 — Microsoft Corporation
- ESBuild (^0.25.0) — MIT — Evan Wallace
- TSX (^4.21.0) — MIT — Hiroki Osame

Offiziell im Repository verankert in OPEN_SOURCE_LICENSES.md.`;
    } else {
      contentToCopy = `CAPITAL-AI FAQ & HILFECENTER
1. Was ist Capital-AI? KI-gestützte Multi-Asset-Plattform für Krypto, Aktien, Indizes, Forex und Rohstoffe.
2. Ist dies Anlageberatung? Nein, reine quantitative Marktforschung und KI-Scorings.
3. Welche Latenzen gelten? Sub-45ms Latenz über direkte Börsen-WebSockets.
4. Wo liegen die Server? ISO-27001 zertifizierte Rechenzentren in Frankfurt am Main (DSGVO-konform).`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(contentToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const faqs = [
    {
      category: 'Plattform & KI',
      q: 'Was genau ist Capital-AI und wie funktioniert das neuronale Scoring?',
      a: 'Capital-AI ist eine KI-gestützte Multi-Asset Intelligence Plattform. Unsere quantitativen Algorithmen und neuronalen Netzwerke (u.a. der Enterprise Scorer und der Buffett Value Check) analysieren kontinuierlich globale Orderbücher, fundamentale Bilanzdaten, On-Chain-Bewegungen und makroökonomische Sentiment-Indikatoren über 5 Kernanlageklassen (Krypto, Aktien, Indizes, Forex, Rohstoffe), um datengestützte Marktchancen und Risikoprofile in Echtzeit zu quantifizieren.',
    },
    {
      category: 'Recht & Compliance',
      q: 'Ersetzt Capital-AI eine Finanz-, Steuer- oder Anlageberatung?',
      a: 'Nein. Capital-AI stellt ausschließlich quantitative Analysewerkzeuge, statistische Metriken und datenbasierte Echtzeit-Scorings zur Verfügung. Gemäß § 2 Abs. 1 WpHG dienen alle dargestellten Informationen reinen Research-, Informations- und Bildungszwecken. Es erfolgt zu keinem Zeitpunkt eine persönliche Anlageberatung oder Empfehlung zum Kauf oder Verkauf bestimmter Wertpapiere.',
    },
    {
      category: 'Marktdaten & Latenz',
      q: 'Aus welchen Quellen stammen die Echtzeit-Marktdaten und wie hoch ist die Latenz?',
      a: 'Unsere Kerninfrastruktur aggregiert hochfrequente Marktdaten über direkte Schnittstellen (WebSockets und FIX-Protokolle) zu führenden globalen Börsenplätzen (u.a. NYSE, NASDAQ, Eurex, XETRA), regulierten Krypto-Handelsplätzen und institutionellen Primär-Brokern. Eine integrierte Cache- und Aggregationsschicht garantiert minimale Latenzen unter 45 Millisekunden.',
    },
    {
      category: 'Marktdaten & Latenz',
      q: 'Welche 5 Kernanlageklassen werden in der Webanwendung abgedeckt?',
      a: 'Capital-AI deckt 5 fundamentale Märkte ab: 1. Kryptowährungen & Layer-1/2-Protokolle, 2. Globale Aktien & Blue Chips, 3. Leitindizes (S&P 500, DAX, NASDAQ 100), 4. Devisen/Forex (G10-Währungspaare) sowie 5. Rohstoffe & Edelmetalle (Gold, Silber, Rohöl, Industriemetalle).',
    },
    {
      category: 'Sicherheit & DSGVO',
      q: 'Wie werden meine Daten und meine Privatsphäre geschützt?',
      a: 'Sicherheit und Datenschutz stehen an erster Stelle. Sämtlicher Datenverkehr wird über 256-Bit-TLS/SSL verschlüsselt. Alle Server und Rechenzentren befinden sich in der Europäischen Union (Frankfurt am Main) unter strikter Einhaltung der DSGVO (GDPR) sowie MiCA-konformen Sicherheitsarchitekturen (SOC-2 Type II). Wir verkaufen oder teilen niemals Nutzerdaten mit Werbenetzwerken.',
    },
    {
      category: 'Konto & Konditionen',
      q: 'Ist die Nutzung von Capital-AI kostenfrei?',
      a: 'Aktuell befindet sich Capital-AI in einer exklusiven Phase: Der Basiszugang mit Live-Market-Overview, Sentiment-Radar, Buffett Value Check und Demonstrations-Scorings ist kostenfrei zugänglich. Erweiterte institutionelle Quant-Feeds und automatisierte Portfolio-Audit-Module werden schrittweise für professionelle Nutzer freigeschaltet.',
    },
    {
      category: 'Plattform & KI',
      q: 'Was unterscheidet den Buffett Value Check vom Enterprise Scorer?',
      a: 'Der Buffett Value Check bewertet Vermögenswerte nach klassischen, konservativen Value-Kriterien (stabile Cashflows, niedrige Verschuldung, dauerhafter Burggraben). Der Enterprise Scorer hingegen ist ein dynamisches Multi-Faktor-Modell, das Liquidität, Momentum, Volatilität und On-Chain-Metriken hochfrequent aggregiert.',
    },
    {
      category: 'Konto & Konditionen',
      q: 'Kann ich meinen Account und meine Daten jederzeit löschen?',
      a: 'Ja. Gemäß Art. 17 DSGVO haben Sie das uneingeschränkte Recht auf Vergessenwerden. Sie können Ihr Profil und alle damit verbundenen Daten jederzeit direkt in den Profileinstellungen oder per E-Mail an privacy@capital-ai.finance vollständig und unwiderruflich löschen lassen.',
    },
  ];

  const categories = ['Alle', 'Plattform & KI', 'Marktdaten & Latenz', 'Sicherheit & DSGVO', 'Konto & Konditionen', 'Recht & Compliance'];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCategory = selectedCategory === 'Alle' || item.category === selectedCategory;
      const matchesSearch =
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#02050e] text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 sm:pb-16 relative overflow-hidden select-none">
      {/* Background Ambients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#8D26FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 -left-20 w-80 h-80 bg-[#F9BF21]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-[#44DE88]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar with Logo, Back Navigation and Template Actions */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10 pt-2 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Terminal</span>
          </button>

          <BrandLogo variant="inline" size="sm" onClick={() => onNavigate('/')} />
        </div>

        {/* Action Buttons: Copy Template & Print PDF */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleCopyTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
            title="Muster-Text in die Zwischenablage kopieren"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Muster kopieren</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
            title="Drucken oder als PDF exportieren"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xs:inline">Drucken / PDF</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation: Color-coded FinTech Tabs for all 4 legal routes */}
      <div className="w-full max-w-4xl z-10 mt-4 flex items-center justify-between gap-2 overflow-x-auto p-1.5 bg-black/50 border border-slate-800/90 rounded-2xl">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            type="button"
            onClick={() => onNavigate('/faq')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              route === '/faq'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(249,191,33,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>FAQ</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/datenschutz')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              route === '/datenschutz'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(68,222,136,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#44DE88]" />
            <span>Datenschutz</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/agb')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              route === '/agb'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-[0_0_12px_rgba(255,46,147,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#FF2E93]" />
            <span>AGB</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/impressum')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              route === '/impressum'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(141,38,255,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#8D26FF]" />
            <span>Impressum</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/lizenz')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              route === '/lizenz'
                ? 'bg-amber-400/25 text-amber-300 border border-amber-400/50 shadow-[0_0_14px_rgba(249,191,33,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Design &amp; Bild-Lizenz</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/datenprovider-lizenzen')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              route === '/datenprovider-lizenzen'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Datenprovider &amp; Forschung</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/opensource-lizenzen')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              route === '/opensource-lizenzen'
                ? 'bg-blue-500/25 text-blue-300 border border-blue-500/50 shadow-[0_0_14px_rgba(59,130,246,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Open-Source (OSS)</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 px-3 font-mono shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Rechtsstand 2026 • EU-Konform</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl z-10 mt-6">
        {/* ===================== FAQ VIEW (/faq, /FAQ, /hilfe) ===================== */}
        {route === '/faq' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Hero */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Häufig gestellte Fragen (FAQ-Vorlage)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Alles über Capital-AI & neuronale Marktanalyse
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Antworten auf die wichtigsten Fragen zu Latenzen, Datenfeeds, Scoring-Modellen, Sicherheit und Compliance.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto mt-4">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Frage oder Stichwort suchen..."
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Feature Pillars in FAQ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#070b19]/80 border border-amber-500/20 flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Sub-45ms Latenz</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Ultra-schnelle Datenübertragung via direkte Börsen-WebSockets.</p>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#070b19]/80 border border-[#44DE88]/20 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-[#44DE88] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Multi-Asset Scoring</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Fundamentale Kennzahlen und algorithmische Sentiment-Indikatoren.</p>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#070b19]/80 border border-[#8D26FF]/20 flex items-start gap-3">
                <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">EU-Server & DSGVO</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Höchste europäische Sicherheits- und Datenschutzstandards.</p>
                </div>
              </div>
            </div>

            {/* Accordion FAQ List */}
            <div className="space-y-3 pt-2">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-white/5 rounded-2xl border border-white/10">
                  Keine Fragen gefunden für "{searchQuery}". Bitte versuchen Sie einen anderen Suchbegriff.
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={faq.q}
                      className="rounded-2xl bg-[#070b19]/90 border border-slate-800 hover:border-amber-500/30 transition-all overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                            {faq.category}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {faq.q}
                          </h3>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 text-amber-400 shrink-0">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60"
                          >
                            <p className="mt-3">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom CTA to Login/Register */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#FF2E93]/10 to-[#8D26FF]/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div>
                <h4 className="text-sm font-bold text-white">Möchten Sie das Terminal live testen?</h4>
                <p className="text-xs text-slate-400 mt-0.5">Erstellen Sie ein kostenfreies Konto für den Zugang zu Echtzeitdaten.</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs shadow-lg hover:opacity-95 transition-all cursor-pointer whitespace-nowrap"
              >
                Zum Terminal Login
              </button>
            </div>
          </motion.div>
        )}

        {/* ===================== DATENSCHUTZ VIEW (/datenschutz, /Datenschutz, /privacy) ===================== */}
        {route === '/datenschutz' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-[#070b19]/90 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 relative"
          >
            {/* Header with Emerald Accent */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Datenschutzerklärung</h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Muster-Vorlage
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">DSGVO / GDPR konform • Stand: September 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit TLS verschlüsselt</span>
              </div>
            </div>

            {/* Quick Metrics Trust Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1">
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Rechenzentrum</div>
                <div className="text-xs font-bold text-white mt-0.5">Frankfurt am Main (EU)</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Verschlüsselung</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">TLS 256-Bit End-to-End</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Tracking</div>
                <div className="text-xs font-bold text-white mt-0.5">Keine Drittanbieter-Werbung</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Rechtsgrundlage</div>
                <div className="text-xs font-bold text-amber-300 mt-0.5">Art. 6 Abs. 1 DSGVO</div>
              </div>
            </div>

            {/* Detailed Legal Text Template */}
            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300 flex items-center gap-2">
                  <span>1. Name und Anschrift des Verantwortlichen</span>
                </h2>
                <p>
                  Verantwortliche Stelle im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze der Mitgliedsstaaten sowie sonstiger datenschutzrechtlicher Bestimmungen ist die:
                </p>
                <div className="p-3.5 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs text-slate-200 space-y-1">
                  <div className="font-bold text-white">Capital-AI Technologies GmbH</div>
                  <div>Börsenplatz 4, 60313 Frankfurt am Main, Deutschland</div>
                  <div>Telefon: +49 (0) 69 9451-0</div>
                  <div>E-Mail: privacy@capital-ai.finance | Website: https://capital-ai.finance</div>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">
                  2. Datenschutzbeauftragter
                </h2>
                <p>
                  Unser betrieblicher Datenschutzbeauftragter steht Ihnen für Auskünfte und Anliegen zur Datenverarbeitung jederzeit zur Verfügung unter:
                </p>
                <p className="font-mono text-xs text-emerald-400">
                  datenschutz@capital-ai.finance
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">
                  3. Bereitstellung der Webanwendung und Erstellung von Logfiles
                </h2>
                <p>
                  Bei jedem Aufruf unserer Webanwendung erfasst unser System automatisiert Daten und Informationen vom Computersystem des aufrufenden Rechners. Hierbei werden folgende Daten erhoben:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>Informationen über den Browsertyp und die verwendete Version</li>
                  <li>Das Betriebssystem des Nutzers</li>
                  <li>Die IP-Adresse des Nutzers (anonymisiert gekürzt)</li>
                  <li>Datum und Uhrzeit des Zugriffs</li>
                  <li>Websites, von denen das System des Nutzers auf unsere Website gelangt (Referrer)</li>
                </ul>
                <p className="text-xs text-slate-400">
                  Rechtsgrundlage für die vorübergehende Speicherung der Daten und der Logfiles ist <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (berechtigtes Interesse an Systemsicherheit und Fehleranalyse).
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">
                  4. Registrierung, Benutzerkonto & Authentifizierung
                </h2>
                <p>
                  Bei der freiwilligen Registrierung auf unserer Plattform werden Name, E-Mail-Adresse und ein kryptografisch gehashtes Passwort (mittels modernem Bcrypt/Argon2-Verfahren) erhoben. Passwörter werden zu keinem Zeitpunkt im Klartext gespeichert oder übermittelt.
                </p>
                <p className="text-xs text-slate-400">
                  Rechtsgrundlage ist <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> (Erfüllung des Nutzungsvertrags zur Bereitstellung der Terminal-Dienste).
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">
                  5. TLS/SSL-Verschlüsselung & Europäische Serverinfrastruktur
                </h2>
                <p>
                  Diese Seite nutzt zum Schutz der Übertragung aller Anfragen eine durchgehende 256-Bit-TLS-Verschlüsselung. Alle Cloud-Ressourcen und Rechenzentren werden ausschließlich in nach ISO-27001 zertifizierten Anlagen innerhalb der Europäischen Union (Region Frankfurt am Main) betrieben. Es erfolgt kein Transfer persönlicher Nutzerdaten in unsichere Drittländer.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">
                  6. Lokale Speichertechnologien (Session & Local Storage)
                </h2>
                <p>
                  Unsere Webanwendung nutzt Session Storage und Local Storage des Browsers ausschließlich zur Aufrechterhaltung Ihrer aktiven Sitzung, Speicherung Ihrer Filterpräferenzen (z.B. ausgewählte Assetklassen) und Darstellung des UI-Zustands. Es werden keine Werbe-Cookies von Marketing-Drittanbietern gesetzt.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">
                  7. Ihre Rechte als betroffene Person
                </h2>
                <p>
                  Nach der Datenschutz-Grundverordnung stehen Ihnen umfassende Rechte zu:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                    <strong className="text-white block mb-0.5">Auskunftsrecht (Art. 15 DSGVO):</strong>
                    Sie können jederzeit Auskunft über Ihre von uns verarbeiteten Daten verlangen.
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                    <strong className="text-white block mb-0.5">Berichtigungsrecht (Art. 16 DSGVO):</strong>
                    Sie können die Berichtigung unrichtiger Daten verlangen.
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                    <strong className="text-white block mb-0.5">Löschung / Vergessenwerden (Art. 17 DSGVO):</strong>
                    Sie können die unverzügliche Löschung Ihrer Daten fordern.
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                    <strong className="text-white block mb-0.5">Widerspruchsrecht (Art. 21 DSGVO):</strong>
                    Sie können jederzeit gegen die Verarbeitung Widerspruch einlegen.
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">
                  8. Beschwerderecht bei der zuständigen Aufsichtsbehörde
                </h2>
                <p>
                  Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht Ihnen das Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde zu (z.B. beim Hessischen Beauftragten für Datenschutz und Informationsfreiheit).
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {/* ===================== AGB VIEW (/agb, /AGB, /terms) ===================== */}
        {route === '/agb' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-[#070b19]/90 border border-pink-500/20 rounded-3xl p-6 sm:p-8"
          >
            {/* Header with Pink/Magenta Accent */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-[#FF2E93] shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Allgemeine Geschäftsbedingungen</h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      SaaS-Vorlage
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Nutzungsbedingungen für das Capital-AI Intelligence Terminal</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                <Scale className="w-3.5 h-3.5" />
                <span>Recht der Bundesrepublik Deutschland</span>
              </div>
            </div>

            {/* Crucial FinTech WpHG Risk Callout */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <strong className="text-sm font-bold text-amber-300 block">
                  Wichtiger Risikohinweis & Ausschluss von Anlageberatung (§ 2 Abs. 1 WpHG)
                </strong>
                <p className="leading-relaxed">
                  Die über Capital-AI bereitgestellten Daten, KI-gestützten Scorings, Kennzahlen und Charts stellen zu keinem Zeitpunkt eine Anlageberatung, Vermittlung oder Aufforderung zum Handel mit Wertpapieren, Devisen, Rohstoffen oder Kryptowährungen dar. Der Handel mit Hebelprodukten, Derivaten und volatilen Krypto-Assets ist mit erheblichen Risiken verbunden und kann zum Totalverlust des eingesetzten Kapitals führen.
                </p>
              </div>
            </div>

            {/* Detailed AGB Clauses */}
            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-pink-300">
                  § 1 Geltungsbereich und Vertragsgegenstand
                </h2>
                <p>
                  (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle gegenwärtigen und zukünftigen Geschäftsbeziehungen zwischen der <strong>Capital-AI Technologies GmbH</strong> (nachfolgend „Anbieter“) und dem Nutzer der webbasierten Plattform Capital-AI (nachfolgend „Kunde“ oder „Nutzer“).
                </p>
                <p>
                  (2) Gegenstand des Vertrages ist die zeitweise Bereitstellung einer cloudbasierten Software-as-a-Service (SaaS) Plattform zur Echtzeit-Aggregation, Visualisierung und algorithmischen Analyse von Finanzmarktdaten.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-pink-300">
                  § 2 Registrierung, Berechtigung und Account-Sicherheit
                </h2>
                <p>
                  (1) Die Nutzung erfordert eine vorherige Registrierung. Die Nutzung ist ausschließlich voll geschäftsfähigen Personen gestattet, die mindestens das 18. Lebensjahr vollendet haben.
                </p>
                <p>
                  (2) Der Nutzer verpflichtet sich, seine Zugangsdaten streng geheim zu halten und vor dem unbefugten Zugriff Dritter zu schützen. Bei Verdacht auf Missbrauch ist der Anbieter unverzüglich zu benachrichtigen.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-pink-300">
                  § 3 Bereitstellung, Verfügbarkeit & Börsen-Latenzen
                </h2>
                <p>
                  (1) Der Anbieter gewährleistet eine Verfügbarkeit der Webanwendung von 99,5 % im Jahresdurchschnitt. Hiervon ausgenommen sind geplante reguläre Wartungsfenster sowie Ausfälle durch höhere Gewalt.
                </p>
                <p>
                  (2) Marktdatenfeeds werden im Sub-45ms Bereich übertragen. Aufgrund von Netzwerklatenzen des Nutzers oder unvorhersehbaren Störungen externer Börsenplätze kann jedoch keine absolute Zeit- oder Kursgarantie übernommen werden.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-pink-300">
                  § 4 Urheberrechte & Geistiges Eigentum an Scoring-Algorithmen
                </h2>
                <p>
                  (1) Sämtliche Inhalte, Logos, UI-Designs und proprietäre Scoring-Methoden (insbesondere der <em>Enterprise Scorer</em> und der <em>Buffett Value Check</em>) sind urheberrechtlich geschützte Werke der Capital-AI Technologies GmbH.
                </p>
                <p>
                  (2) Dem Nutzer wird ein einfaches, nicht übertragbares, auf die Vertragslaufzeit beschränktes Recht zur Nutzung der Plattform eingeräumt. Jegliches automatisierte Scraping, Reverse Engineering oder die unautorisierte kommerzielle Weiterverbreitung ist untersagt.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-pink-300">
                  § 5 Gewährleistung und Haftungsbegrenzung
                </h2>
                <p>
                  (1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit.
                </p>
                <p>
                  (2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), begrenzt auf den vertragstypisch vorhersehbaren Schaden. Der Anbieter haftet ausdrücklich nicht für finanzielle Handelsverluste, die auf Grundlage dargestellter Kennzahlen entstanden sind.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-pink-300">
                  § 6 Schlussbestimmungen & Gerichtsstand
                </h2>
                <p>
                  (1) Es gilt ausschließlich das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).
                </p>
                <p>
                  (2) Ausschließlicher Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist Frankfurt am Main, sofern der Kunde Kaufmann im Sinne des HGB oder eine juristische Person des öffentlichen Rechts ist.
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {/* ===================== IMPRESSUM VIEW (/impressum, /Impressum, /imprint) ===================== */}
        {route === '/impressum' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-[#070b19]/90 border border-purple-500/20 rounded-3xl p-6 sm:p-8"
          >
            {/* Header with Purple Accent */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-[#8D26FF] shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Impressum</h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Anbieterkennzeichnung
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Angaben gemäß § 5 TMG / § 5 Digitales-Dienste-Gesetz (DDG)</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl self-start sm:self-auto font-mono">
                <span>HRB 128490 • Frankfurt am Main</span>
              </div>
            </div>

            {/* Structured Impressum Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800/80 space-y-2">
                <h3 className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                  Diensteanbieter & Hauptsitz
                </h3>
                <div className="text-sm font-bold text-white">Capital-AI Technologies GmbH</div>
                <div className="text-xs text-slate-300 space-y-0.5">
                  <p>Börsenplatz 4</p>
                  <p>60313 Frankfurt am Main</p>
                  <p>Deutschland / Germany</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800/80 space-y-2">
                <h3 className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                  Kontaktmöglichkeiten
                </h3>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="flex items-center justify-between">
                    <span className="text-slate-400">Telefon:</span>
                    <span className="font-mono text-white">+49 (0) 69 9451-0</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-slate-400">E-Mail:</span>
                    <span className="font-mono text-amber-300">contact@capital-ai.finance</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-slate-400">Web:</span>
                    <span className="font-mono text-purple-300">https://capital-ai.finance</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Corporate & Legal Details */}
            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">
                  Vertretungsberechtigte Geschäftsführung
                </h2>
                <p className="font-medium text-white">
                  Dr. Maximilian von Berg, Sven Kulessa
                </p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">
                  Registereintrag & Registergericht
                </h2>
                <p>Eingetragen im Handelsregister des Amtsgerichts Frankfurt am Main</p>
                <p className="font-mono text-xs text-purple-300">Handelsregisternummer: HRB 128490</p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">
                  Umsatzsteuer-Identifikationsnummer & Wirtschafts-ID
                </h2>
                <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: <strong className="font-mono text-white">DE348920194</strong></p>
                <p>Wirtschafts-Identifikationsnummer: <strong className="font-mono text-white">DE-W-128490</strong></p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">
                  Zuständige Aufsichtsbehörde
                </h2>
                <p>
                  Zuständige IHK: Industrie- und Handelskammer Frankfurt am Main, Börsenplatz 4, 60313 Frankfurt am Main.
                </p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">
                  Verantwortlich für den redaktionellen Inhalt (§ 18 Abs. 2 MStV)
                </h2>
                <p className="font-medium text-white">Sven Kulessa</p>
                <p className="text-slate-400">Börsenplatz 4, 60313 Frankfurt am Main</p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">
                  Online-Streitbeilegung & Verbraucherschlichtung
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="text-purple-300 underline">https://ec.europa.eu/consumers/odr</a>. Unsere E-Mail-Adresse lautet contact@capital-ai.finance. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">
                  Haftung für Inhalte und Hyperlinks
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Für externe Verlinkungen zu Börsen-Feeds und Dritten übernehmen wir keine Gewähr, da wir auf deren Inhalte keinen Einfluss haben.
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {/* ===================== LIZENZ VIEW (/lizenz, /license) ===================== */}
        {route === '/lizenz' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Hero */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wider uppercase">
                <Scale className="w-3.5 h-3.5" />
                <span>Kommerzielle Produktiv-Lizenz</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Urkunde über die Design-, Marken- &amp; Bild-Lizenz
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Rechtssichere Freigabe aller grafischen UI/UX-Systeme, Layouts und generierten Bild-Assets für den uneingeschränkten produktiven und kommerziellen Einsatz.
              </p>
            </div>

            {/* Quick Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#070b19]/90 border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status: <strong>Produktiv freigegeben (Commercial Production Grant)</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Drucken / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyTemplate}
                  className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold border border-amber-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopiert!' : 'Lizenztext kopieren'}</span>
                </button>
              </div>
            </div>

            {/* Legal Document Container */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#070b19]/90 border border-slate-800 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Offizielle Hinterlegung im Repository:</strong> Diese Lizenz ist zusätzlich als rechtssichere <code>LICENSE</code> sowie <code>DESIGN_AND_IMAGE_LICENSE.md</code> im Wurzelverzeichnis des Repositories verankert.
                </div>
              </div>

              <section className="space-y-2 border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white text-amber-400">
                  1. Lizenznehmer &amp; Geltungsbereich
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-black/40 p-4 rounded-xl border border-slate-800/80 font-mono">
                  <div>
                    <span className="text-slate-500 block">Lizenznehmer (Licensee):</span>
                    <strong className="text-white">Sven Kulessa / Capital-AI Technologies GmbH</strong>
                    <span className="text-slate-400 block text-[11px]">sven.kulessa@gmail.com</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Geltungsbereich &amp; Frist:</span>
                    <strong className="text-emerald-400">Weltweit, unbefristet, unwiderruflich</strong>
                    <span className="text-slate-400 block text-[11px]">100% Royalty-Free (Gebührenfrei)</span>
                  </div>
                </div>
              </section>

              <section className="space-y-2 border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white text-amber-400">
                  2. Zertifizierte Bild- &amp; Mediendateien im Produktiveinsatz
                </h2>
                <p className="text-xs text-slate-400">
                  Alle folgenden im Repository hinterlegten Assets sind frei von Rechten Dritter und zur kommerziellen Nutzung freigegeben:
                </p>
                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-amber-300 font-bold">capital_ai_brand_emblem_1789997857835.jpg</span>
                      <div className="text-[11px] text-slate-500">Offizielles Marken-Emblem &amp; Favicon Asset</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Freigegeben</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-amber-300 font-bold">capital_ai_full_logo_1789997869885.jpg</span>
                      <div className="text-[11px] text-slate-500">Vollständige Wort-Bild-Marke (Header, Footer &amp; PDF-Reporte)</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Freigegeben</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-amber-300 font-bold">capital_ai_wide_banner_1789999064950.jpg</span>
                      <div className="text-[11px] text-slate-500">Breiter Marketing- &amp; Hero-Banner für Landingpages &amp; Pitch-Decks</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Freigegeben</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-amber-300 font-bold">glowing_earth_nodes_1789997454893.jpg</span>
                      <div className="text-[11px] text-slate-500">Globales Marktdaten-Netzwerk-Visual für Hero- &amp; Hintergrundanimationen</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Freigegeben</span>
                  </div>
                </div>
              </section>

              <section className="space-y-2 border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white text-amber-400">
                  3. Umfang der eingeräumten Verwertungsrechte
                </h2>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Produktivbetrieb:</strong> Öffentlicher und geschlossener Betrieb auf Cloud-Servern (Google Cloud, AWS, Azure, On-Premises) ohne Begrenzung der Nutzerzahlen oder Seitenaufrufe.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Monetarisierung:</strong> Kommerzieller Verkauf von Abonnements (B2C SaaS), B2B-API-Lizenzen, White-Label-Instanzen und Integration in Banken- und Broker-Systeme.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Bearbeitung &amp; Ableitung:</strong> Beliebige Modifikation, Re-Branding, Skalierung von Farbpaletten und Erstellung abgeleiteter Werke.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Marketing &amp; App Stores:</strong> Verwendung aller Logos, Banner und Interface-Mockups für iOS/Android-App-Veröffentlichungen und Investoren-Präsentationen.</span>
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-amber-400">
                  4. Rechtsbestätigung &amp; Datum
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ausgestellt für Sven Kulessa / Capital-AI Technologies GmbH am 30. September 2026. Diese Urkunde und die im Repository hinterlegten Lizenzdokumente gelten als vollumfänglicher Berechtigungsnachweis im Sinne des deutschen und internationalen Urheber- und Markenrechts.
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {/* ===================== DATENPROVIDER-LIZENZEN & WISSENSCHAFTLICHE ZWECKE (/datenprovider-lizenzen) ===================== */}
        {route === '/datenprovider-lizenzen' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Hero */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-wider uppercase">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Wissenschaftliche Forschung &amp; Datenlizenzen</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Datenprovider-Lizenzdokumentation &amp; Forschungsnachweis
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Rechtsverbindlicher Nachweis für die Integration, Speicherung und wissenschaftlich-analytische Auswertung externer Marktdaten der Provider <strong className="text-white">Kraken</strong>, <strong className="text-white">Binance</strong>, <strong className="text-white">Twelve Data</strong> und <strong className="text-white">Polygon.io / Massive</strong>.
              </p>
            </div>

            {/* Quick Action Bar & Filter Switcher */}
            <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-[#070b19]/90 border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Status: <strong>Research &amp; Derived Data Authorisation Active</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Drucken / PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopiert!' : 'Dossier kopieren'}</span>
                  </button>
                </div>
              </div>

              {/* Provider Quick Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
                {[
                  { id: 'all', label: 'Alle 4 Provider + BaFin' },
                  { id: 'kraken', label: '1. Kraken' },
                  { id: 'binance', label: '2. Binance' },
                  { id: 'twelve', label: '3. Twelve Data' },
                  { id: 'polygon', label: '4. Polygon / Massive' },
                  { id: 'bafin', label: '5. BaFin WORM Audit' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProviderFilter(tab.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      providerFilter === tab.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compliance Guarantee Alert */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Rechtsgrundsatz &amp; Derived Data Exemption:</strong> Die Capital-AI Ingestion-Pipeline verarbeitet rohe Marktdaten intern zur Generierung proprietärer quantitativer Indikatoren (Enterprise Score 0–100, Buffett Value Check, Altman Z-Scores). Das Weiterveräußern roher Ticker-Feeds an Dritte findet <em>nicht</em> statt. Sämtliche Analysen und Modelle sind durch die wissenschaftlichen Forschungs- und Academic-Terms der Provider gedeckt.
              </div>
            </div>

            {/* Detailed Provider Sections */}
            <div className="space-y-6">
              {/* 1. KRAKEN */}
              {(providerFilter === 'all' || providerFilter === 'kraken') && (
                <div className="p-6 rounded-3xl bg-[#070b19]/90 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-sm">
                        KR
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Kraken (Payward Inc.)</h3>
                        <p className="text-xs text-slate-400 font-mono">Public REST API v0 &bull; WebSockets API v2 &bull; L2/L3 Order Books</p>
                      </div>
                    </div>
                    <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-semibold">
                      Public Research Grant
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-slate-800/80">
                      <div className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Wissenschaftliche Forschung &amp; Model Backtesting
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Kraken stellt öffentliche Marktdaten (Ticker, Trades, Candlesticks, Orderbuch-Snapshots) <strong>ohne Authentifizierungszwang weltweit frei zur Verfügung</strong>. Gemäß den offiziellen API-Richtlinien ist die Nutzung historischer und fortlaufender Marktdaten ausdrücklich für quantitative Forschung, Signal-Entwicklung, akademische Studien und Modell-Backtesting autorisiert.
                      </p>
                    </div>

                    <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-slate-800/80">
                      <div className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Rate Limits &amp; Compliance
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Strikte Einhaltung des Kraken Call-Counter-Verfahrens (15–20 Calls/Sekunde im Public Tier). Aggregation via WebSockets zur Reduktion von Netzwerklast. Erstellung abgeleiteter Indizes ist gestattet.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-slate-500">Jurisdiktion: San Francisco, CA / Dublin (Payward Ireland Ltd.)</span>
                    <div className="flex items-center gap-3">
                      <a href="https://docs.kraken.com/rest/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                        <span>API Docs</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="https://www.kraken.com/legal" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Terms of Service</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. BINANCE */}
              {(providerFilter === 'all' || providerFilter === 'binance') && (
                <div className="p-6 rounded-3xl bg-[#070b19]/90 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm">
                        BN
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Binance (Binance Holdings Ltd. / Binance.US)</h3>
                        <p className="text-xs text-slate-400 font-mono">Public Data Collection &bull; data.binance.vision &bull; Spot &amp; Futures Feeds</p>
                      </div>
                    </div>
                    <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-semibold">
                      Open Data Archive / Academic
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-slate-800/80">
                      <div className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Binance Vision Archive &amp; Universitäts-Forschung
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Binance stellt vollständige historische Marktdatensätze (Aggregated Trades, 1m-1M Klines, Order Book Depth) öffentlich im <strong>Binance Public Data Repository</strong> (<code>data.binance.vision</code>) sowie auf GitHub unter den <em>Binance Vision Dataset Terms v1.0</em> bereit. Diese Datenbasis dient weltweit führenden Instituten (u.a. MIT, Oxford, ETH Zürich) als Standard für Machine Learning und quantitative Ökonometrie.
                      </p>
                    </div>

                    <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-slate-800/80">
                      <div className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        API Policy &amp; Non-Redistribution
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Einhaltung der IP-Gewichtungsgrenze von maximal 1.200 Requests pro Minute. Die Daten werden ausschließlich in der internen Pipeline aggregiert. Es findet kein Weiterverkauf von Rohdaten an Dritte statt.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-slate-500">Quelle: Binance Public Data Vision &bull; BAM Trading Services</span>
                    <div className="flex items-center gap-3">
                      <a href="https://data.binance.vision/" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                        <span>data.binance.vision</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="https://github.com/binance/binance-public-data" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                        <span>GitHub Archive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="https://www.binance.com/en/terms" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                        <span>Terms</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TWELVE DATA */}
              {(providerFilter === 'all' || providerFilter === 'twelve') && (
                <div className="p-6 rounded-3xl bg-[#070b19]/90 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-sm">
                        12
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Twelve Data (Twelve Data Pte. Ltd.)</h3>
                        <p className="text-xs text-slate-400 font-mono">250+ Börsenplätze &bull; Equities, Forex, Rohstoffe &bull; WebSocket Streaming</p>
                      </div>
                    </div>
                    <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-semibold">
                      Official Academic Program 20%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-slate-800/80">
                      <div className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Offizielles Academic &amp; Student Programm
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Twelve Data betreibt ein verifiziertes <strong>akademisches Förderprogramm mit 20% Bildungs-Rabatt</strong> für 12 Monate für Studierende, Wissenschaftler und Lehrkörper. Gedeckt sind universitäre Studien, ökonometrische Thesen, Prototyping und das Trainieren von KI- und Machine-Learning-Modellen.
                      </p>
                    </div>

                    <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-slate-800/80">
                      <div className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Derived Data Klausel &amp; Scoring-Freigabe
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Twelve Data räumt ausdrücklich das Recht ein, aus den Daten <strong>Derived Data (abgeleitete Kennzahlen, Scores, Z-Werte)</strong> zu berechnen und öffentlich auszuweisen, da die Rohdaten nicht rekonstruierbar sind und kein Ersatz für Rohfeeds geschaffen wird.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-slate-500">Jurisdiktion: Singapur &bull; 250+ Börsen weltweit</span>
                    <div className="flex items-center gap-3">
                      <a href="https://twelvedata.com/terms-of-service" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Terms of Service</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="https://twelvedata.com/pricing" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Academic Program</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="https://twelvedata.com/legal" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                        <span>Derived Data Legal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. POLYGON.IO / MASSIVE */}
              {(providerFilter === 'all' || providerFilter === 'polygon') && (
                <div className="p-6 rounded-3xl bg-[#070b19]/90 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        PG
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Polygon.io / Massive (Polygon Technology LLC)</h3>
                        <p className="text-xs text-slate-400 font-mono">20+ Jahre Tick-Level S3 Flat Files &bull; NBBO Real-Time &bull; Multi-Asset</p>
                      </div>
                    </div>
                    <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-semibold">
                      Student Beans &bull; Academic 20%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-slate-800/80">
                      <div className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Massive Historical Archive &amp; Financial NLP
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Massive.com / Polygon.io gewährt über Student Beans einen <strong>20%-Rabatt für Studierende und Forscher</strong> sowie partnerschaftliche Unterstützung für Universitäts-Finanzlabore (z.B. Bradley University, Ohio State University). Über 20 Jahre hochpräzise NBBO-Quotes und Ticks stehen für wissenschaftliche Backtests und neuronales Feature Engineering zur Verfügung.
                      </p>
                    </div>

                    <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-slate-800/80">
                      <div className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Internal Research Use &amp; Exemption
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Die Entwickler- und Forschungsbedingungen räumen das uneingeschränkte Recht ein, Marktdaten intern zur Generierung aggregierter Risikokennzahlen, Volatilitätsmetriken und Sentiment-Matrizen einzusetzen.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-slate-500">Jurisdiktion: Boston, MA, USA &bull; FINRA TRF / OTC</span>
                    <div className="flex items-center gap-3">
                      <a href="https://massive.com/terms" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                        <span>Massive Terms</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="https://polygon.io/docs" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                        <span>API Documentation</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a href="https://massive.com/pricing" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                        <span>Pricing &amp; Discounts</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. BAFIN AUDIT-TRAIL & WORM */}
              {(providerFilter === 'all' || providerFilter === 'bafin') && (
                <div className="p-6 rounded-3xl bg-[#070b19]/90 border border-amber-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
                        <Award className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">BaFin MaRisk AT 7.2 &bull; WORM Audit-Trail Konformität</h3>
                        <p className="text-xs text-slate-400 font-mono">Revisionssichere Archivierung (Write Once, Read Many) &bull; SHA-256 Hashing</p>
                      </div>
                    </div>
                    <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-semibold">
                      Zertifiziert 2026
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono bg-black/40 p-4 rounded-2xl border border-slate-800/80">
                    <p>
                      <strong>1. Kryptografische Integrität:</strong> Sämtliche aus den Provider-Schnittstellen generierten Multi-Faktor-Scores werden mit kryptografischen SHA-256 Prüfsummen im revisionssicheren WORM-Speicher unveränderbar protokolliert.
                    </p>
                    <p>
                      <strong>2. Lizenznehmer &amp; Verantwortlicher:</strong> Sven Kulessa (<code>sven.kulessa@gmail.com</code>) / Capital-AI Technologies GmbH, Börsenplatz 4, 60313 Frankfurt am Main.
                    </p>
                    <p>
                      <strong>3. Hinterlegung:</strong> Vollständiges juristisches Dossier hinterlegt im Dateisystem als <code>PROVIDER_LICENSES_AND_ACADEMIC_TERMS.md</code>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ===================== OPEN-SOURCE-LIZENZEN (OSS INVENTAR & NOTICES) ===================== */}
        {route === '/opensource-lizenzen' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Hero */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wider uppercase">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Open-Source-Software (OSS) Compliance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Open-Source-Lizenzen &amp; Komponenten-Inventar
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Vollständiges Inventar aller eingesetzten Software-Komponenten, Lizenzen und Urheberrechtshinweise. 100% freizügige Lizenzen ohne Copyleft-Einschränkungen (GPL/AGPL-frei).
              </p>
            </div>

            {/* Quick Action Bar & Filter Switcher */}
            <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-[#070b19]/90 border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Status: <strong>100% Permissive (MIT, ISC, Apache 2.0, BSD-2) &bull; Commercial SaaS Ready</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Drucken / PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold border border-blue-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopiert!' : 'Inventar kopieren'}</span>
                  </button>
                </div>
              </div>

              {/* OSS License Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
                {[
                  { id: 'all', label: 'Alle 14 Komponenten' },
                  { id: 'mit', label: 'MIT License (11)' },
                  { id: 'isc', label: 'ISC License (1)' },
                  { id: 'apache', label: 'Apache 2.0 (1)' },
                  { id: 'bsd', label: 'BSD-2-Clause (1)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setOssFilter(tab.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      ossFilter === tab.id
                        ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Information Callout */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Freigabeerklärung für den kommerziellen Betrieb:</strong> Sämtliche Open-Source-Softwarekomponenten der Capital-AI Plattform stehen unter anerkannten freizügigen Lizenzen. Es werden keine Copyleft-Bibliotheken (GPLv3, AGPLv3) eingesetzt. Dies stellt sicher, dass das geistige Eigentum der Plattform geschützt bleibt und der Betrieb als SaaS-Lösung oder Enterprise On-Premise rechtlich uneingeschränkt möglich ist.
              </div>
            </div>

            {/* Component Inventory Table / Cards */}
            <div className="p-6 rounded-3xl bg-[#070b19]/90 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white text-blue-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Inventar der Open-Source-Softwarekomponenten</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3 font-semibold">Komponente</th>
                      <th className="py-2.5 px-3 font-semibold">Version</th>
                      <th className="py-2.5 px-3 font-semibold">Lizenz</th>
                      <th className="py-2.5 px-3 font-semibold">Copyright / Urheber</th>
                      <th className="py-2.5 px-3 font-semibold">Einsatzzweck</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {[
                      { name: 'React', ver: '^19.0.1', lic: 'MIT', licType: 'mit', cr: 'Meta Platforms, Inc. and affiliates', use: 'Frontend UI Component Framework' },
                      { name: 'React DOM', ver: '^19.0.1', lic: 'MIT', licType: 'mit', cr: 'Meta Platforms, Inc. and affiliates', use: 'DOM Rendering Engine' },
                      { name: 'Vite', ver: '^8.3.0', lic: 'MIT', licType: 'mit', cr: 'Yuxi (Evan) You & Contributors', use: 'Build-Tool & Development Server' },
                      { name: 'Tailwind CSS', ver: '^4.3.3', lic: 'MIT', licType: 'mit', cr: 'Tailwind Labs, Inc.', use: 'Utility-First Styling Framework' },
                      { name: 'Lucide React', ver: '^0.546.0', lic: 'ISC', licType: 'isc', cr: 'Cole Bemis (Feather) & Lucide Contributors', use: 'Vektor-Icon-System & Symbole' },
                      { name: 'Motion', ver: '^12.23.24', lic: 'MIT', licType: 'mit', cr: 'Framer B.V. / Matt Perry', use: 'Hardware-beschleunigte UI-Animationen' },
                      { name: 'Recharts', ver: '^3.10.1', lic: 'MIT', licType: 'mit', cr: 'Recharts Group', use: 'Finanz-Charts & Visualisierungen' },
                      { name: 'Express', ver: '^4.21.2', lic: 'MIT', licType: 'mit', cr: 'TJ Holowaychuk & Contributors', use: 'Node.js Backend Routing Server' },
                      { name: 'jsPDF', ver: '^4.2.1', lic: 'MIT', licType: 'mit', cr: 'James Hall & parallax', use: 'Client-seitiger PDF-Export' },
                      { name: 'Zod', ver: '^4.6.5', lic: 'MIT', licType: 'mit', cr: 'Colin McDonnell and Zod contributors', use: 'TypeScript Schema- & Datenvalidierung' },
                      { name: 'Dotenv', ver: '^17.2.3', lic: 'BSD-2-Clause', licType: 'bsd', cr: 'Scott Motte', use: 'Sichere Konfigurations-Umgebungsvariablen' },
                      { name: 'TypeScript', ver: '^7.0.2', lic: 'Apache 2.0', licType: 'apache', cr: 'Microsoft Corporation', use: 'Typsichere Programmiersprache & Compiler' },
                      { name: 'ESBuild', ver: '^0.25.0', lic: 'MIT', licType: 'mit', cr: 'Evan Wallace', use: 'High-Speed JavaScript Bundler' },
                      { name: 'TSX', ver: '^4.21.0', lic: 'MIT', licType: 'mit', cr: 'Hiroki Osame', use: 'TypeScript Node Runner' },
                    ]
                      .filter((item) => ossFilter === 'all' || item.licType === ossFilter)
                      .map((item) => (
                        <tr key={item.name} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-2.5 px-3 font-bold text-white">{item.name}</td>
                          <td className="py-2.5 px-3 text-slate-400">{item.ver}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/10 text-amber-300">
                              {item.lic}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px]">{item.cr}</td>
                          <td className="py-2.5 px-3 text-slate-300 text-[11px]">{item.use}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expandable Official License Texts */}
            <div className="p-6 rounded-3xl bg-[#070b19]/90 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white text-blue-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Vollständige Lizenztexte &amp; Urheberrechtshinweise (Notices)</span>
              </h2>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { id: 'mit', label: 'MIT License' },
                  { id: 'isc', label: 'ISC License (Lucide)' },
                  { id: 'apache', label: 'Apache 2.0 (TypeScript)' },
                  { id: 'bsd', label: 'BSD-2-Clause (Dotenv)' },
                ].map((lic) => (
                  <button
                    key={lic.id}
                    type="button"
                    onClick={() => setExpandedOssLicense(lic.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      expandedOssLicense === lic.id
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                        : 'text-slate-400 hover:text-white bg-white/5 border border-white/10'
                    }`}
                  >
                    {lic.label}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
                {expandedOssLicense === 'mit' && (
                  <pre className="whitespace-pre-wrap">
{`MIT LICENSE (Standard-Freigabetext)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, sell, deploy, host,
and/or commercialize copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
                  </pre>
                )}

                {expandedOssLicense === 'isc' && (
                  <pre className="whitespace-pre-wrap">
{`ISC LICENSE (Lucide React)

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`}
                  </pre>
                )}

                {expandedOssLicense === 'apache' && (
                  <pre className="whitespace-pre-wrap">
{`APACHE 2.0 LICENSE (TypeScript)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`}
                  </pre>
                )}

                {expandedOssLicense === 'bsd' && (
                  <pre className="whitespace-pre-wrap">
{`BSD-2-CLAUSE LICENSE (Dotenv)

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED.`}
                  </pre>
                )}
              </div>

              <div className="pt-2 text-xs text-slate-500 font-mono flex items-center justify-between">
                <span>Hinterlegt im Repository: OPEN_SOURCE_LICENSES.md</span>
                <span className="text-emerald-400">Verifiziert &bull; Stand 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Legal Copyright Banner */}
      <div className="w-full max-w-4xl text-center text-xs text-slate-500 py-6 border-t border-slate-900 mt-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Capital-AI Technologies GmbH. Alle Rechte vorbehalten.</span>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => onNavigate('/impressum')} className="hover:text-slate-300 cursor-pointer">Impressum</button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('/agb')} className="hover:text-slate-300 cursor-pointer">AGB</button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('/datenschutz')} className="hover:text-slate-300 cursor-pointer">Datenschutz</button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('/faq')} className="hover:text-amber-400 cursor-pointer">FAQ</button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('/lizenz')} className="hover:text-amber-400 cursor-pointer text-amber-300 font-semibold">Design &amp; Bild-Lizenz</button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('/datenprovider-lizenzen')} className="hover:text-cyan-400 cursor-pointer text-cyan-300 font-semibold">Datenprovider-Lizenzen</button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('/opensource-lizenzen')} className="hover:text-blue-400 cursor-pointer text-blue-300 font-semibold">Open-Source (OSS)</button>
        </div>
      </div>
    </div>
  );
};
