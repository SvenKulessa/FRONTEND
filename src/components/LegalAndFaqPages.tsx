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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';

export type LegalRoute = '/faq' | '/datenschutz' | '/agb' | '/impressum';

interface LegalPagesProps {
  route: LegalRoute;
  onNavigate: (path: string) => void;
}

export const LegalAndFaqPages: React.FC<LegalPagesProps> = ({ route, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

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
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-400 px-3 font-mono">
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
      </div>

      {/* Footer Legal Copyright Banner */}
      <div className="w-full max-w-4xl text-center text-xs text-slate-500 py-6 border-t border-slate-900 mt-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Capital-AI Technologies GmbH. Alle Rechte vorbehalten.</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('/impressum')} className="hover:text-slate-300 cursor-pointer">Impressum</button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('/agb')} className="hover:text-slate-300 cursor-pointer">AGB</button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('/datenschutz')} className="hover:text-slate-300 cursor-pointer">Datenschutz</button>
          <span>•</span>
          <button type="button" onClick={() => onNavigate('/faq')} className="hover:text-amber-400 cursor-pointer text-amber-300 font-semibold">FAQ</button>
        </div>
      </div>
    </div>
  );
};
