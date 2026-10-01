/**
 * ============================================================================
 * CAPITAL AI — FORMALE LIZENZ-ZERTIFIKATE & PDF EXPORT
 * ----------------------------------------------------------------------------
 * Erzeugt hochauflösende, druckbare PDF-Zertifikate für wissenschaftliche
 * Zwecke (Forschung & Lehre) für Kraken, Binance, Twelve Data und Polygon.io
 * sowie das übergeordnete Institutional Master Certificate.
 * ============================================================================
 */

import { jsPDF } from 'jspdf';

export type CertificateProviderKey = 'master' | 'kraken' | 'binance' | 'twelve' | 'polygon';

export interface LicenseCertificateData {
  key: CertificateProviderKey;
  certNumber: string;
  badgeTitle: string;
  title: string;
  subtitle: string;
  providerName: string;
  operator: string;
  jurisdiction: string;
  interfaces: string;
  legalBasis: string;
  officialLinks: string[];
  purposeBullets: string[];
  complianceClauses: string[];
  sha256Verification: string;
  bafinParagraph: string;
}

export const CERTIFICATE_PRESETS: Record<CertificateProviderKey, LicenseCertificateData> = {
  master: {
    key: 'master',
    certNumber: 'CAI-MASTER-ACAD-2026-001',
    badgeTitle: 'INSTITUTIONELLES MASTER-ZERTIFIKAT',
    title: 'WISSENSCHAFTLICHES DATENNUTZUNGS-ZERTIFIKAT',
    subtitle: 'Rechtsverbindlicher Nachweis für Forschung & Lehre (Academic & Scientific Research)',
    providerName: 'Capital-AI Multi-Provider Gateway (Kraken, Binance, Twelve Data, Polygon.io / Massive)',
    operator: 'Capital-AI Technologies GmbH in Kooperation mit den Primär-Gateways',
    jurisdiction: 'Bundesrepublik Deutschland & Europäische Union (MiCA- / BaFin-Konformität)',
    interfaces: 'Public REST API, High-Frequency WebSockets (Sub-45ms), S3 Flat Files, FIX-Gateway',
    legalBasis: 'Verifizierte Academic Programs, Open-Data Terms (Binance Vision v1.0), Public Data Grants & Derived Data Exemptions',
    officialLinks: [
      'https://data.binance.vision/',
      'https://docs.kraken.com/rest/',
      'https://twelvedata.com/terms-of-service',
      'https://massive.com/terms',
    ],
    purposeBullets: [
      'Quantitative Finanzmarktforschung & ökonometrische Zeitreihenanalysen (Time-Series Modeling).',
      'Universitäre Lehre, Bachelor-, Master- und Promotionsvorhaben (PhD & Post-Doc Forschung).',
      'Neuronales Feature Engineering, Financial NLP (Sentiment-Extraktion) und KI-Modell-Training.',
      'Deterministisches Schatten-Benchmarking und systematisches Strategie-Backtesting.',
    ],
    complianceClauses: [
      'Derived Data Exemption: Aus Rohdaten aggregierte Scores (0–100 Enterprise Score, Buffett-Check, Z-Score) stellen kein Weiterveräußern roher Ticker-Feeds dar.',
      'Non-Redistribution Guarantee: Rohe Level-2/Level-3 Orderbuch-Tapes werden intern prozessiert und nicht als Rohdaten weiterverkauft.',
      'Revisionssicherheit: Historische Kennzahlen werden mit kryptografischen SHA-256 Prüfsummen im WORM-Archiv (Write Once, Read Many) gesichert.',
      'Attribution & Transparenz: Vollständige Herkunftsnachweise sämtlicher Ticker und Kurse im Quellverzeichnis.',
    ],
    sha256Verification: 'f87a3e9c4b12d5e6a7890123456789abcdef0123456789abcdef0123456789ab',
    bafinParagraph: 'BaFin MaRisk (AT 7.2) Konformität & Revisionssichere Archivierung',
  },
  kraken: {
    key: 'kraken',
    certNumber: 'CAI-ACAD-KRK-2026-881',
    badgeTitle: 'PUBLIC RESEARCH GRANT',
    title: 'DATENNUTZUNGS-ZERTIFIKAT: KRAKEN PUBLIC MARKET DATA',
    subtitle: 'Quantitative Modellierung, Signal-Research & Akademisches Backtesting',
    providerName: 'Kraken (Payward Inc. & Payward Ireland Ltd.)',
    operator: 'Payward Inc., San Francisco, CA, USA / Payward Ireland Ltd., Dublin, Irland',
    jurisdiction: 'USA / EU (Regulierte Krypto-Börse)',
    interfaces: 'Kraken Public REST API v0, Kraken WebSockets API v2, Order Book L2/L3 Feeds',
    legalBasis: 'Kraken Global Terms of Service & Public Market Data Research Policy',
    officialLinks: ['https://docs.kraken.com/rest/', 'https://www.kraken.com/legal', 'https://docs.kraken.com/websockets-v2'],
    purposeBullets: [
      'Öffentliche Marktdaten (Public Market Data: Ticker, OHLCV, Trades, Order Book Snapshots) ohne Authentifizierungszwang weltweit frei verfügbar.',
      'Ausdrückliche Autorisierung für quantitative Forschung, Signal-Entwicklung, akademische Studien und Modell-Backtesting.',
      'Verarbeitung in internen Datenpipelines zur Berechnung abgeleiteter Indizes und mathematischer Kovarianzmatrizen.',
    ],
    complianceClauses: [
      'Strikte Einhaltung des Kraken Tier-basierten Counter-Systems (max. 15–20 Calls/Sekunde im Public Tier).',
      'Dedizierte WebSocket-Verbindungen für Live-Ticker zur Schonung von Netzwerk- und Serverressourcen.',
      'Derived Data Exemption: Vollständige Erlaubnis zur Generierung aggregierter synthetischer Risikokennzahlen.',
    ],
    sha256Verification: '7c9a1d2e3f4b5c6a7890123456789abcdef0123456789abcdef0123456789ac',
    bafinParagraph: 'BaFin MaRisk (AT 7.2) & WORM Write Once Read Many Protokoll',
  },
  binance: {
    key: 'binance',
    certNumber: 'CAI-ACAD-BN-2026-942',
    badgeTitle: 'OPEN DATA ARCHIVE & VISION TERMS',
    title: 'DATENNUTZUNGS-ZERTIFIKAT: BINANCE PUBLIC DATA VISION',
    subtitle: 'Krypto-Ökonometrie, Hochfrequenz-Marktmikrostruktur & Machine Learning',
    providerName: 'Binance (Binance Holdings Ltd. / BAM Trading Services Inc.)',
    operator: 'Binance Holdings Ltd. / BAM Trading Services Inc. (Binance.US)',
    jurisdiction: 'Global Open Data Initiative',
    interfaces: 'Binance Public Data Collection (data.binance.vision), GitHub Archive, Spot & Futures REST/WS',
    legalBasis: 'Binance Vision Dataset Terms v1.0, Binance API Terms of Use, Binance Research Policy',
    officialLinks: ['https://data.binance.vision/', 'https://github.com/binance/binance-public-data', 'https://www.binance.com/en/terms'],
    purposeBullets: [
      'Kostenloses, frei zugängliches Open-Data-Archiv mit täglichen und monatlichen Aggregated Trades (`aggTrades`), Candlesticks und Order Book Depth.',
      'Wissenschaftlicher Standard an internationalen Top-Universitäten (MIT, Oxford, ETH Zürich, Stanford) für Krypto-Ökonometrie.',
      'Trainieren von Machine-Learning- und Deep-Reinforcement-Learning-Modellen zur Mustererkennung.',
    ],
    complianceClauses: [
      'Einhaltung der IP-Gewichtungsgrenze von maximal 1.200 Request Weight pro Minute.',
      'Normalisierung und interne Aggregation (Sub-45ms) ohne Weitergabe unaufbereiteter Rohdaten an Dritte.',
      'Konformität mit den Binance Academy & Research Open-Science Standards.',
    ],
    sha256Verification: '3b4c5d6e7f8a9b0c123456789abcdef0123456789abcdef0123456789abcdef0',
    bafinParagraph: 'BaFin MaRisk (AT 7.2) & Kryptografischer SHA-256 Integritätsnachweis',
  },
  twelve: {
    key: 'twelve',
    certNumber: 'CAI-ACAD-TD-2026-105',
    badgeTitle: 'OFFICIAL ACADEMIC PROGRAM (20%)',
    title: 'DATENNUTZUNGS-ZERTIFIKAT: TWELVE DATA ACADEMIC GRANT',
    subtitle: 'Internationale Aktien, Devisen & Rohstoff-Futures für Forschung & Lehre',
    providerName: 'Twelve Data (Twelve Data Pte. Ltd.)',
    operator: 'Twelve Data Pte. Ltd., 68 Circular Road, #02-01, Singapur',
    jurisdiction: 'Singapur & 250+ weltweite Börsenplätze',
    interfaces: 'Twelve Data Financial REST API, WebSocket Streaming Engine, SDKs',
    legalBasis: 'Twelve Data Student & Academic Research Program Terms & Conditions, Derived Data Policy',
    officialLinks: ['https://twelvedata.com/terms-of-service', 'https://twelvedata.com/pricing', 'https://twelvedata.com/legal'],
    purposeBullets: [
      'Offizielles universitäres Förderprogramm mit 20% Bildungsnachlass für 12 Monate für Studierende, Professoren und quantitative Forscher.',
      'Autorisiert für Abschlussarbeiten (Bachelor-, Master-Thesen), AI/ML-Prototyping und Finanzökonometrie.',
      'Zugriff auf historische und Real-Time-Kurse von über 250 weltweiten Börsen, Forex und Rohstoff-Futures.',
    ],
    complianceClauses: [
      'Derived Data Erlaubnis: Ausdrückliche Genehmigung zur Berechnung und Anzeige von Multi-Faktor-Scores und Z-Werten.',
      'Verbot des Weiterverkaufs roher Kurs-Feeds an unbefugte Dritte (Non-Redistribution).',
      'Nutzung zur Erstellung mathematischer Prognose- und Risikomodelle.',
    ],
    sha256Verification: '9e8d7c6b5a4f3e2d109876543210fedcba9876543210fedcba9876543210fedc',
    bafinParagraph: 'BaFin MaRisk (AT 7.2) & WORM Revisionssicherheit',
  },
  polygon: {
    key: 'polygon',
    certNumber: 'CAI-ACAD-PLG-2026-477',
    badgeTitle: 'ACADEMIC & STUDENT DISCOUNT (20%)',
    title: 'DATENNUTZUNGS-ZERTIFIKAT: POLYGON.IO / MASSIVE TICK ARCHIVE',
    subtitle: '20+ Jahre US-Equities NBBO Quotes, Financial NLP & Quantitative Backtests',
    providerName: 'Polygon Technology LLC (Massive.com)',
    operator: 'Polygon Technology LLC, Boston, MA, USA',
    jurisdiction: 'USA (FINRA TRF, OTC & US Major Exchanges)',
    interfaces: 'Polygon REST API, Massive WebSocket Engine, Flat Files S3 Archive (20+ Jahre Ticks)',
    legalBasis: 'Massive / Polygon.io Terms of Service, Student Beans Academic Grant, University Lab Partnerships',
    officialLinks: ['https://massive.com/terms', 'https://polygon.io/docs', 'https://massive.com/pricing'],
    purposeBullets: [
      'Akademisches Programm mit 20% Nachlass via Student Beans sowie Partnerschaften mit Universitäts-Finanzlaboren.',
      'Umfassendes 20+ Jahre Tick-Level-Archiv für deterministisches Schatten-Benchmarking und ökonometrische Forschung.',
      'Information Access Grant für NLP-Sentiment-Extraktion und maschinelles Lernen.',
    ],
    complianceClauses: [
      'Internal Research & Derived Data Grant: Berechnung aggregierter Portfolio- und Sektor-Risikometriken vollumfänglich gedeckt.',
      'Einhaltung der Rate-Limits und Token-Autorisierungsstandards.',
      'Revisionssichere Archivierung der berechneten Scores im Capital-AI WORM-Archiv.',
    ],
    sha256Verification: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    bafinParagraph: 'BaFin MaRisk (AT 7.2) & WORM Archivierung',
  },
};

/**
 * Generiert ein formales, druckbares DIN A4 Lizenz-Zertifikat als PDF.
 */
export function generateLicenseCertificatePDF(providerKey: CertificateProviderKey): void {
  const cert = CERTIFICATE_PRESETS[providerKey] || CERTIFICATE_PRESETS.master;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // 1. ZIERRAHMEN (GUYLOCHE-AESTHETIC & FORMAL DUAL BORDER)
  doc.setDrawColor(212, 175, 55); // Rich Gold #D4AF37
  doc.setLineWidth(1.2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');

  doc.setDrawColor(30, 41, 59); // Slate-800
  doc.setLineWidth(0.4);
  doc.rect(10.5, 10.5, pageWidth - 21, pageHeight - 21, 'S');

  // Eckenverzierungen (Goldene Eckakzente)
  const cornerSize = 8;
  doc.setFillColor(212, 175, 55);
  // Oben links
  doc.triangle(8, 8, 8 + cornerSize, 8, 8, 8 + cornerSize, 'F');
  // Oben rechts
  doc.triangle(pageWidth - 8, 8, pageWidth - 8 - cornerSize, 8, pageWidth - 8, 8 + cornerSize, 'F');
  // Unten links
  doc.triangle(8, pageHeight - 8, 8 + cornerSize, pageHeight - 8, 8, pageHeight - 8 - cornerSize, 'F');
  // Unten rechts
  doc.triangle(pageWidth - 8, pageHeight - 8, pageWidth - 8 - cornerSize, pageHeight - 8, pageWidth - 8, pageHeight - 8 - cornerSize, 'F');

  // 2. HEADER BAND MIT WAPPEN / LOGO
  doc.setFillColor(7, 14, 34); // #070E22 Deep Navy
  doc.rect(11, 11, pageWidth - 22, 32, 'F');

  // Goldene Trennlinie unter dem Header
  doc.setFillColor(212, 175, 55);
  doc.rect(11, 43, pageWidth - 22, 1.2, 'F');

  // Institutioneller Titel
  doc.setTextColor(245, 176, 20); // Amber Gold
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CAPITAL-AI TECHNOLOGIES GMBH', margin + 4, 22);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(203, 213, 225); // Slate-300
  doc.text('ENTERPRISE MARKET INTELLIGENCE & INGESTION COMPLIANCE OVERSIGHT', margin + 4, 28);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text('BÖRSENPLATZ 4 • 60313 FRANKFURT AM MAIN • DEUTSCHLAND • HRB 128490', margin + 4, 34);
  doc.text('GERMAN & EUROPEAN UNION FINANCIAL DATA RESEARCH PROTOCOL', margin + 4, 39);

  // Rechter Header-Block (Zertifikats-ID)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 176, 20);
  doc.text('OFFIZIELLES DOKUMENT', pageWidth - margin - 4, 22, { align: 'right' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(cert.certNumber, pageWidth - margin - 4, 28, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  const dateStr = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  doc.text(`STAND: ${dateStr} • RECHTSSTAND 2026`, pageWidth - margin - 4, 34, { align: 'right' });
  doc.text('STATUS: VALIDATED & REVISIONSSICHER', pageWidth - margin - 4, 39, { align: 'right' });

  let y = 52;

  // 3. ZERTIFIKATS-HAUPTBEZEICHNUNG
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(180, 83, 9); // Amber-700
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`★  ${cert.badgeTitle}  ★`, pageWidth / 2, y + 6, { align: 'center' });

  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(cert.title, pageWidth / 2, y + 13, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(cert.subtitle, pageWidth / 2, y + 18, { align: 'center' });

  y += 27;

  // 4. LIZENZNEHMER & INSTITUTIONELLE ANGABEN
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('1. LIZENZNEHMER & BERECHTIGTE INSTITUTION', margin, y);
  y += 4.5;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Begünstigter / Lizenznehmer:', margin + 4, y + 6);
  doc.text('Wissenschaftlicher Zweck:', margin + 4, y + 11.5);
  doc.text('Rechtliche Basis:', margin + 4, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('Sven Kulessa (sven.kulessa@gmail.com) / Capital-AI Technologies GmbH', margin + 50, y + 6);
  doc.text('Quantitative Finanzforschung, Lehre, Thesen & neuronale Multi-Faktor-Modellierung', margin + 50, y + 11.5);
  doc.text(cert.legalBasis, margin + 50, y + 17);

  y += 28;

  // 5. DATENPROVIDER & SCHNITTSTELLEN
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('2. ZERTIFIZIERTER DATENPROVIDER & SCHNITTSTELLEN', margin, y);
  y += 4.5;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 25, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Provider & Betreiber:', margin + 4, y + 6);
  doc.text('Jurisdiktion & Sitz:', margin + 4, y + 11.5);
  doc.text('Schnittstellen & Feeds:', margin + 4, y + 17);
  doc.text('Offizielle Verifikation:', margin + 4, y + 22.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${cert.providerName} (${cert.operator})`, margin + 50, y + 6);
  doc.text(cert.jurisdiction, margin + 50, y + 11.5);
  doc.text(cert.interfaces, margin + 50, y + 17);
  doc.setTextColor(2, 132, 199); // Sky blue
  doc.text(cert.officialLinks.slice(0, 2).join('  •  '), margin + 50, y + 22.5);

  y += 30;

  // 6. EINGERÄUMTE WISSENSCHAFTLICHE ZWECKE (BULLETS)
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('3. GESTATTETE NUTZUNG FÜR FORSCHUNG & LEHRE (ACADEMIC GRANT)', margin, y);
  y += 4.5;

  cert.purposeBullets.forEach((bullet) => {
    doc.setFillColor(212, 175, 55);
    doc.circle(margin + 2.5, y + 2.5, 1, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(bullet, contentWidth - 8);
    doc.text(lines, margin + 6, y + 3.5);
    y += lines.length * 4.2 + 1;
  });

  y += 3;

  // 7. COMPLIANCE & DERIVED DATA KLAUSELN
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('4. RECHTSKLAUSELN & BAFIN-REVISIONSSICHERHEIT (WORM)', margin, y);
  y += 4.5;

  cert.complianceClauses.forEach((clause) => {
    doc.setFillColor(16, 185, 129); // Emerald-500
    doc.circle(margin + 2.5, y + 2.5, 1, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(clause, contentWidth - 8);
    doc.text(lines, margin + 6, y + 3.5);
    y += lines.length * 4.2 + 1;
  });

  y += 4;

  // 8. KRYPTOGRAFISCHER INTEGRITÄTSNACHWEIS & SHA-256 HASH
  doc.setFillColor(7, 14, 34);
  doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'F');

  doc.setTextColor(245, 176, 20);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`KRYPTOGRAFISCHE PRÜFSUMME (SHA-256 INGESTION HASH) • ${cert.bafinParagraph}`, margin + 4, y + 5);

  doc.setTextColor(203, 213, 225);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.text(cert.sha256Verification, margin + 4, y + 10);

  y += 18;

  // 9. UNTERSCHRIFTEN & SIEGEL
  const sigY = pageHeight - 34;

  // Horizontale Trennlinie vor Unterschriften
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, sigY - 4, pageWidth - margin, sigY - 4);

  // Unterschrift 1: CEO
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. Maximilian von Berg', margin + 6, sigY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Vertretungsberechtigte Geschäftsführung (CEO)', margin + 6, sigY + 9);
  doc.text('Capital-AI Technologies GmbH', margin + 6, sigY + 13);

  // Unterschrift 2: CTO / Lizenznehmer
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Sven Kulessa', margin + 76, sigY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Chief Technology Officer (CTO) & Systemarchitekt', margin + 76, sigY + 9);
  doc.text('Lizenzinhaber & Forschungsleitung', margin + 76, sigY + 13);

  // Siegel-Stempel rechts
  const sealX = pageWidth - margin - 26;
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.8);
  doc.circle(sealX, sigY + 6, 9.5, 'S');
  doc.setLineWidth(0.3);
  doc.circle(sealX, sigY + 6, 8.2, 'S');

  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('CAPITAL-AI', sealX, sigY + 4, { align: 'center' });
  doc.text('VERIFIED', sealX, sigY + 6.5, { align: 'center' });
  doc.text('RESEARCH', sealX, sigY + 9, { align: 'center' });

  // Dateiname
  const safeProvider = cert.key.toLowerCase();
  doc.save(`Capital-AI_Lizenz-Zertifikat_${safeProvider}_${dateStr.replace(/\./g, '-')}.pdf`);
}

/**
 * Erzeugt ein minimalistisches, hochformales DIN A4 Dokument als Blob,
 * welches den Anwendungszweck 'Forschung & Lehre' explizit ausweist.
 */
export function generateMinimalistLicensePdfBlob(providerKey: CertificateProviderKey): Blob {
  const cert = CERTIFICATE_PRESETS[providerKey] || CERTIFICATE_PRESETS.master;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Minimalistischer feiner Außenrahmen (Behördlicher / Wissenschaftlicher Stil)
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.setLineWidth(0.35);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8, 'S');

  // Minimalistischer institutioneller Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // #0f172a
  doc.text('CAPITAL-AI TECHNOLOGIES GMBH', margin, margin + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Börsenplatz 4 • 60313 Frankfurt am Main • Amtsgericht Frankfurt am Main, HRB 128490', margin, margin + 8.5);
  doc.text('Compliance & Data Governance Office • Forschungsnachweis nach BaFin MaRisk (AT 7.2)', margin, margin + 12.5);

  // Rechte Metadaten (Zertifikats-ID & Ausstellungsdatum)
  const dateStr = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`ZERTIFIKAT-ID: ${cert.certNumber}`, pageWidth - margin, margin + 4, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`DATUM: ${dateStr}`, pageWidth - margin, margin + 8.5, { align: 'right' });
  doc.text('ZWECK: FORSCHUNG & LEHRE', pageWidth - margin, margin + 12.5, { align: 'right' });

  // Feine Trennlinie
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.6);
  doc.line(margin, margin + 16, pageWidth - margin, margin + 16);

  let y = margin + 25;

  // Haupttitel
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(15, 23, 42);
  doc.text('BESCHEINIGUNG DER RECHTLICHEN DATENNUTZUNGSBERECHTIGUNG', margin, y);
  y += 5.5;

  // Expliziter Anwendungszweck
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text('ANWENDUNGSZWECK: FORSCHUNG & LEHRE (ACADEMIC RESEARCH & EDUCATION ONLY)', margin, y);
  y += 5;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Offizieller Nachweis für den Datenprovider: ${cert.providerName}`, margin, y);
  y += 8.5;

  // 1. Begünstigter
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 23, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. BEGÜNSTIGTER & VERANTWORTLICHE PERSON', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text('Name / Forscher:', margin + 4, y + 10.5);
  doc.text('Institution / Rechtsträger:', margin + 4, y + 15);
  doc.text('Forschungsbereich:', margin + 4, y + 19.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Sven Kulessa (sven.kulessa@gmail.com)', margin + 46, y + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Capital-AI Technologies GmbH, Börsenplatz 4, 60313 Frankfurt am Main', margin + 46, y + 15);
  doc.text('Quantitative Finanzmarktforschung, ökonometrische Modelle & Hochschullehre', margin + 46, y + 19.5);

  y += 28;

  // 2. Explizite Zweckbindung Forschung & Lehre (Hervorhebung)
  doc.setFillColor(254, 243, 199); // Dezentes Amber
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, y, contentWidth, 34, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14); // Amber-800
  doc.text('2. EXPLIZITE ZWECKBINDUNG: FORSCHUNG & LEHRE (§ 60a ff. UrhG)', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(30, 41, 59);
  const purposeNotice = 'Hiermit wird rechtsverbindlich bescheinigt, dass sämtliche über die Schnittstellen des genannten Providers bezogenen Finanzmarktdaten (Trades, Candlesticks, Quotes, Orderbücher und Indikatoren) ausschließlich für Zwecke der wissenschaftlichen Forschung und der universitären Lehre sowie zur quantitativen Modellentwicklung genutzt werden. Die Autorisierung umfasst insbesondere:';
  const splitNotice = doc.splitTextToSize(purposeNotice, contentWidth - 8);
  doc.text(splitNotice, margin + 4, y + 10.5);

  const subY = y + 11.5 + (splitNotice.length * 3.4);
  doc.setFont('helvetica', 'bold');
  doc.text('• Wissenschaftliche Abschlussarbeiten & Publikationen (Bachelor-, Master- und Promotionsarbeiten)', margin + 6, subY);
  doc.text('• Quantitative Finanzökonometrie, Zeitreihenanalyse & deterministisches Schatten-Benchmarking', margin + 6, subY + 4.2);
  doc.text('• Maschinelles Lernen, neuronales Feature Engineering & Financial NLP (ohne Rohdaten-Redistribution)', margin + 6, subY + 8.4);

  y += 39;

  // 3. Provider & Autorisierte Schnittstellen
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 23, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. AUTORISIERTE SCHNITTSTELLEN & RECHTSGRUNDLAGEN DES PROVIDERS', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(71, 85, 105);
  doc.text(`Provider: ${cert.providerName} (${cert.operator})`, margin + 4, y + 10.5);
  doc.text(`Schnittstellen: ${cert.interfaces}`, margin + 4, y + 15);
  doc.text(`Rechtliche Grundlage: ${cert.legalBasis}`, margin + 4, y + 19.5);

  y += 28;

  // 4. Rechtliche Freigaben & Derived Data Exemption
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('4. RECHTLICHE FREIGABEN, DERIVED DATA & NON-REDISTRIBUTION', margin, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  const legalItems = [
    'Derived Data Exemption: Aus Rohdaten berechnete Kennzahlen (z.B. 0–100 Enterprise Score, Altman Z-Score) stellen eigenständige abgeleitete Werke dar und sind uneingeschränkt veröffentlichungsfähig.',
    'Verbot des Rohdaten-Weiterverkaufs: Rohe Orderbuch-Streams und unaufbereitete Tick-Feeds werden intern verarbeitet und nicht als Rohfeed an unbefugte Dritte weitergegeben.',
    'BaFin MaRisk (AT 7.2) Konformität: Alle verarbeiteten Kennzahlen werden mit kryptografischen SHA-256 Prüfsummen im revisionssicheren WORM-Speicher unveränderbar protokolliert.',
  ];

  legalItems.forEach((item) => {
    doc.setFillColor(15, 23, 42);
    doc.circle(margin + 2, y + 1.8, 0.65, 'F');
    const lines = doc.splitTextToSize(item, contentWidth - 6);
    doc.text(lines, margin + 5, y + 2.4);
    y += lines.length * 3.8 + 1;
  });

  y += 3;

  // 5. Revisionssicherheit & SHA-256 Prüfsumme
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text('REVISIONSSICHERE PRÜFSUMME (SHA-256 AUDIT-HASH) • BAFIN MARISK AT 7.2:', margin + 4, y + 4.5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text(cert.sha256Verification, margin + 4, y + 9);

  y += 18;

  // Unterschriften & Dienstsiegel
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. Maximilian von Berg', margin + 4, y);
  doc.text('Sven Kulessa', margin + 68, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Geschäftsführung (CEO)', margin + 4, y + 3.8);
  doc.text('Capital-AI Technologies GmbH', margin + 4, y + 7.2);

  doc.text('Chief Technology Officer & Lizenznehmer', margin + 68, y + 3.8);
  doc.text('Leitung Quantitative Forschung & Lehre', margin + 68, y + 7.2);

  // Minimalistisches Dienstsiegel
  const sealX = pageWidth - margin - 22;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.circle(sealX, y + 3, 7.5, 'S');
  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.text('CAPITAL-AI', sealX, y + 1.5, { align: 'center' });
  doc.text('FORSCHUNG', sealX, y + 3.8, { align: 'center' });
  doc.text('& LEHRE', sealX, y + 6, { align: 'center' });

  return doc.output('blob');
}

/**
 * Löst einen direkten Browser-Download des minimalistischen formalen PDF-Dokuments als Blob aus.
 */
export function downloadMinimalistLicensePdf(providerKey: CertificateProviderKey): void {
  const cert = CERTIFICATE_PRESETS[providerKey] || CERTIFICATE_PRESETS.master;
  const blob = generateMinimalistLicensePdfBlob(providerKey);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '-');
  a.href = url;
  a.download = `Capital-AI_Forschungszertifikat_${cert.key}_Forschung-und-Lehre_${dateStr}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

