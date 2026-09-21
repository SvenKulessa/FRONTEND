import React, { useState } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  Shield,
  FileText,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Search,
  Lock,
  Zap,
  Globe2,
  TrendingUp,
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Plattform & KI-Funktionsweise',
      q: 'Was genau ist Capital-AI und wie funktioniert das KI-Scoring?',
      a: 'Capital-AI ist eine KI-gestützte Multi-Asset Intelligence Plattform. Unsere neuronalen Modelle und quantitativen Algorithmen (u.a. Enterprise Scorer und Buffett Value Check) scannen kontinuierlich globale Orderbücher, fundamentale Bilanzdaten, On-Chain-Bewegungen und makroökonomische Sentiment-Indikatoren über 5 Kernanlageklassen (Krypto, Aktien, Indizes, Forex, Rohstoffe), um datengestützte Marktchancen und Risikoprofile zu identifizieren.',
    },
    {
      category: 'Plattform & KI-Funktionsweise',
      q: 'Ersetzt Capital-AI eine Finanz- oder Anlageberatung?',
      a: 'Nein. Capital-AI stellt fortschrittliche Analysewerkzeuge, quantitative Metriken und datenbasierte Echtzeit-Scorings zur Verfügung. Alle dargestellten Informationen dienen ausschließlich Informations-, Research- und Bildungszwecken und stellen keine individuelle Anlageberatung, Vermittlung oder Aufforderung zum Kauf oder Verkauf von Finanzinstrumenten dar.',
    },
    {
      category: 'Marktdaten & Performance',
      q: 'Aus welchen Quellen stammen die Echtzeit-Marktdaten?',
      a: 'Unsere Infrastruktur aggregiert hochfrequente Marktdaten über direkte Schnittstellen (WebSockets und FIX-Protokolle) zu globalen Börsenplätzen (u.a. NYSE, NASDAQ, Eurex, XETRA), regulierten Krypto-Handelsplätzen und institutionellen Primär-Brokern. Eine integrierte Cache- und Aggregationsschicht garantiert minimale Latenzen unter 45 Millisekunden.',
    },
    {
      category: 'Marktdaten & Performance',
      q: 'Welche Anlageklassen werden unterstützt?',
      a: 'Capital-AI deckt 5 fundamentale Märkte ab: 1. Kryptowährungen & Layer-1/2-Protokolle, 2. Globale Aktien & Blue Chips, 3. Leitindizes (S&P 500, DAX, NASDAQ 100), 4. Devisen/Forex (G10-Währungspaare) sowie 5. Rohstoffe & Edelmetalle (Gold, Silber, Rohöl, Industriemetalle).',
    },
    {
      category: 'Sicherheit & Datenschutz',
      q: 'Wie werden meine Daten und meine Privatsphäre geschützt?',
      a: 'Sicherheit und Datenschutz stehen im Mittelpunkt. Die Verbindung erfolgt ausschließlich über 256-Bit-TLS-Verschlüsselung. Alle Server und Rechenzentren befinden sich in der Europäischen Union (Frankfurt/Main) unter strikter Einhaltung der DSGVO (GDPR) sowie MiCA-konformen Sicherheitsarchitekturen (SOC-2 Type II).',
    },
    {
      category: 'Registrierung & Kosten',
      q: 'Ist die Nutzung von Capital-AI kostenfrei?',
      a: 'Derzeit befindet sich Capital-AI in einer exklusiven Phase: Der Basiszugang mit Live-Market-Overview, Sentiment-Radar und Demonstrations-Scorings ist kostenfrei zugänglich. Erweiterte institutionelle Quant-Feeds und automatisierte Portfolio-Audit-Module werden schrittweise freigeschaltet.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#02050e] text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 sm:pb-16 relative overflow-hidden select-none">
      {/* Background Ambients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#8D26FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 -left-20 w-80 h-80 bg-[#F9BF21]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-[#44DE88]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header with Back Button and Quick Legal Nav */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10 pt-2 pb-6 border-b border-slate-800/80">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Zurück zur Übersicht</span>
        </button>

        {/* Tab pills between all 4 routes */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => onNavigate('/faq')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              route === '/faq'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/datenschutz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              route === '/datenschutz'
                ? 'bg-gradient-to-r from-[#44DE88] to-emerald-500 text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Datenschutz</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/agb')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              route === '/agb'
                ? 'bg-gradient-to-r from-[#FF2E93] to-pink-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AGB</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/impressum')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              route === '/impressum'
                ? 'bg-gradient-to-r from-[#8D26FF] to-purple-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Impressum</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl z-10 mt-6">
        {/* ===================== FAQ VIEW ===================== */}
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
                Häufig gestellte Fragen (FAQ)
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Alles über Capital-AI & KI-Marktanalyse
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Erfahren Sie mehr über unsere Analysemethoden, Datenfeeds, Sicherheitsarchitektur und Möglichkeiten der Webanwendung.
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
                <h4 className="text-sm font-bold text-white">Haben Sie noch weitere Fragen?</h4>
                <p className="text-xs text-slate-400 mt-0.5">Erstellen Sie ein kostenfreies Konto und testen Sie das Terminal direkt live.</p>
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

        {/* ===================== DATENSCHUTZ VIEW ===================== */}
        {route === '/datenschutz' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-[#070b19]/90 border border-emerald-500/20 rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Datenschutzerklärung (Privacy Policy)</h1>
                <p className="text-xs text-slate-400">Stand: September 2026 • DSGVO / GDPR-konform</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">1. Grundsatz und Verantwortlicher</h2>
                <p>
                  Wir bei <strong>Capital-AI</strong> nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften der Europäischen Datenschutz-Grundverordnung (DSGVO) sowie dieser Datenschutzerklärung.
                </p>
                <p className="text-xs text-slate-400">
                  Verantwortliche Stelle im Sinne der DSGVO: Capital-AI Technologies GmbH, Börsenplatz 4, 60313 Frankfurt am Main, E-Mail: privacy@capital-ai.finance.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">2. Datenerfassung auf dieser Webanwendung</h2>
                <p>
                  <strong>Server-Log-Dateien:</strong> Beim Aufruf unserer Webanwendung erfasst der Host-Server automatisch technische Informationen (Browsertyp, Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage). Diese Daten sind nicht bestimmten Personen zuordenbar und dienen ausschließlich dem stabilen Betrieb und der IT-Sicherheit.
                </p>
                <p>
                  <strong>Registrierungsdaten:</strong> Bei der freiwilligen Erstellung eines Accounts erfassen wir Ihren Namen, Ihre E-Mail-Adresse sowie ein kryptografisch gehashtes Passwort (mittels bcrypt/Argon2). Diese Daten werden ausschließlich zur Authentifizierung und Bereitstellung personalisierter Analysen genutzt.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">3. Verschlüsselung & Rechenzentren (SSL 256-Bit)</h2>
                <p>
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung aller vertraulichen Inhalte eine 256-Bit-TLS/SSL-Verschlüsselung. Alle Verarbeitungsinstanzen und Serverknoten werden in ISO-27001-zertifizierten Rechenzentren innerhalb der Europäischen Union betrieben.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-emerald-300">4. Ihre Rechte nach der DSGVO</h2>
                <p>
                  Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Wenden Sie sich hierzu jederzeit an unseren Datenschutzbeauftragten unter privacy@capital-ai.finance.
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {/* ===================== AGB VIEW ===================== */}
        {route === '/agb' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-[#070b19]/90 border border-pink-500/20 rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-[#FF2E93]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Allgemeine Geschäftsbedingungen (AGB)</h1>
                <p className="text-xs text-slate-400">Nutzungsbedingungen für das Capital-AI Intelligence Terminal</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-pink-300">§ 1 Geltungsbereich & Vertragsgegenstand</h2>
                <p>
                  Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Software-as-a-Service-Plattform <strong>Capital-AI</strong>. Gegenstand ist die Bereitstellung von quantitativen Analysealgorithmen, Marktdatenvisualisierungen und KI-generierten Kennzahlen für Finanzmärkte.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-pink-300">§ 2 Wichtiger Risikohinweis & Keine Anlageberatung</h2>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                  <strong>Hinweis gemäß § 2 Abs. 1 WpHG:</strong> Capital-AI bietet keine Finanzanalysen im Sinne des Wertpapierhandelsgesetzes und keine Anlageberatung an. Der Handel mit Kryptowährungen, Aktien, Devisen und Rohstoffen birgt erhebliche Risiken und kann zum Totalverlust des eingesetzten Kapitals führen.
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-pink-300">§ 3 Verfügbarkeit der Marktdaten</h2>
                <p>
                  Capital-AI bemüht sich um eine kontinuierliche Verfügbarkeit von mindestens 99,5% im Jahresmittel. Vorübergehende Ausfälle durch Wartungsarbeiten oder Störungen externer Börsen-Feeds können jedoch nicht vollständig ausgeschlossen werden.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white text-pink-300">§ 4 Geistiges Eigentum & Urheberrecht</h2>
                <p>
                  Sämtliche proprietäre Algorithmen, UI-Komponenten, Scoring-Modelle (Enterprise Scorer, Buffett Value Check) und Vektorgrafiken sind urheberrechtlich geschützt. Eine Vervielfältigung oder Weiterverbreitung ohne schriftliche Genehmigung ist untersagt.
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {/* ===================== IMPRESSUM VIEW ===================== */}
        {route === '/impressum' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-[#070b19]/90 border border-purple-500/20 rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-[#8D26FF]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Impressum</h1>
                <p className="text-xs text-slate-400">Angaben gemäß § 5 TMG / § 5 DDG</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">Diensteanbieter</h2>
                <p className="font-semibold text-white">Capital-AI Technologies GmbH</p>
                <p>Börsenplatz 4</p>
                <p>60313 Frankfurt am Main</p>
                <p>Deutschland</p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">Kontakt</h2>
                <p>Telefon: +49 (0) 69 9451-0</p>
                <p>E-Mail: contact@capital-ai.finance</p>
                <p>Website: https://capital-ai.finance</p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">Vertretungsberechtigte Geschäftsführung</h2>
                <p>Dr. Maximilian von Berg, Sven Kulessa</p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">Registereintrag & Umsatzsteuer-ID</h2>
                <p>Eingetragen im Handelsregister des Amtsgerichts Frankfurt am Main</p>
                <p>Handelsregisternummer: HRB 128490</p>
                <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE348920194</p>
              </section>

              <section className="space-y-1.5">
                <h2 className="text-base font-bold text-white text-purple-300">Haftung für Inhalte und Links</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Börsen- und Kursdaten übernehmen wir keine Gewähr.
                </p>
              </section>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer link back to other legal items */}
      <div className="w-full max-w-4xl text-center text-xs text-slate-500 py-6 border-t border-slate-900 mt-10">
        <span>© {new Date().getFullYear()} Capital-AI Technologies GmbH. Alle Rechte vorbehalten.</span>
      </div>
    </div>
  );
};
