/**
 * CAPITAL AI — ROADMAP & WORK PACKAGES DATA REPOSITORY
 * 
 * Filterbar nach:
 * 1. Projektowner: Governance, Operation, Frontend, Dokumente, SEO, SOCIAL, Security,
 *    Compliance, Fintech, Agent-Client, Qualitätmanagement
 * 2. Status: aktiv, pending, planning
 * 3. Phase / Stage: 5 geplante Phasen bis zum Version 1.0 Production Go-Live
 */

export type ProjectOwner =
  | 'Governance'
  | 'Operation'
  | 'Frontend'
  | 'Dokumente'
  | 'SEO'
  | 'SOCIAL'
  | 'Security'
  | 'Compliance'
  | 'Fintech'
  | 'Agent-Client'
  | 'Qualitätmanagement';

export type WorkPackageStatus = 'aktiv' | 'pending' | 'planning';

export interface StagePhaseInfo {
  phase: number;
  id: string;
  name: string;
  shortTitle: string;
  description: string;
  targetRelease: string;
  completionPercent: number;
  status: 'completed' | 'in_progress' | 'upcoming';
}

export interface WorkPackage {
  id: string;
  title: string;
  owner: ProjectOwner;
  status: WorkPackageStatus;
  phase: number;
  phaseName: string;
  progressPercent: number;
  priority: 'Kritisch' | 'Hoch' | 'Mittel';
  leadName: string;
  targetSprint: string;
  description: string;
  deliverables: string[];
  bafinStandard?: string;
  costImpactEur?: number;
  dependencies?: string[];
}

export const ROADMAP_STAGES: StagePhaseInfo[] = [
  {
    phase: 1,
    id: 'phase-1',
    name: 'Phase 1: Foundation, Core Engine & Ingestion Pipeline',
    shortTitle: '1. Foundation',
    description: 'Architektur-Fundament mit Ringpuffer, Provider Gateways (TwelveData, FRED) und Sub-45ms Tick-Normalisierung.',
    targetRelease: 'v0.8-alpha',
    completionPercent: 100,
    status: 'completed',
  },
  {
    phase: 2,
    id: 'phase-2',
    name: 'Phase 2: Multi-Asset Screener & BaFin Compliance Hardening',
    shortTitle: '2. Screener & Compliance',
    description: '16 kanonische Datenkonzepte, 50-Faktoren Multi-Asset Scorer, WORM Audit Logs nach WpHG § 83 & MaRisk.',
    targetRelease: 'v0.9-beta',
    completionPercent: 100,
    status: 'completed',
  },
  {
    phase: 3,
    id: 'phase-3',
    name: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    shortTitle: '3. AI Agent & Studio Hub',
    description: 'Gemini-gestützter Kaufberater mit Scientist Reasoning, 7 Blueprints, modularer Pipeline Builder und AP-006 Budget Cap.',
    targetRelease: 'v0.9.5-rc1',
    completionPercent: 92,
    status: 'in_progress',
  },
  {
    phase: 4,
    id: 'phase-4',
    name: 'Phase 4: Security, Evidence Merkle Trees, SEO & Social',
    shortTitle: '4. Security & Ecosystem',
    description: 'SHA-256 Merkle Proofs, On-Chain Whale Radar, Schema.org SEO Structured Data, Telegram Whale Alert Bot Integration.',
    targetRelease: 'v0.9.9-rc2',
    completionPercent: 75,
    status: 'in_progress',
  },
  {
    phase: 5,
    id: 'phase-5',
    name: 'Phase 5: Release Candidate & Production Go-Live v1.0',
    shortTitle: '5. v1.0 Production Launch',
    description: 'End-to-End Penetration Testing, BaFin Testat-Freigabe durch den GF, Final Cloud Run Auto-Scaling & Public Launch.',
    targetRelease: 'v1.0.0-final',
    completionPercent: 40,
    status: 'upcoming',
  },
];

export const PROJECT_OWNERS: {
  id: ProjectOwner;
  label: string;
  lead: string;
  badgeColor: string;
  description: string;
}[] = [
  {
    id: 'Governance',
    label: 'Governance',
    lead: 'Dr. Sven Kulessa (GF & Founder)',
    badgeColor: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
    description: 'Geschäftsführung, Unternehmensstrategie, Gesellschafterbeschlüsse & regulatorische Gesamtverantwortung.',
  },
  {
    id: 'Operation',
    label: 'Operation',
    lead: 'DevOps & Site Reliability Team',
    badgeColor: 'border-blue-400/40 bg-blue-400/10 text-blue-300',
    description: 'Cloud Run Container Infrastructure, Auto-Healing, Latenzüberwachung, CDN & Hochverfügbarkeit.',
  },
  {
    id: 'Frontend',
    label: 'Frontend',
    lead: 'Lead UI/UX Engineer',
    badgeColor: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300',
    description: 'Dark-Terminal UI, Tailwind CSS, Responsive Viewports, Micro-Interactions & Screener Visuals.',
  },
  {
    id: 'Dokumente',
    label: 'Dokumente',
    lead: 'Technical Documentation & Legal Docs',
    badgeColor: 'border-indigo-400/40 bg-indigo-400/10 text-indigo-300',
    description: 'Architektur-Blueprints, BaFin Prüfhandbuch, API-Referenzen, PDF Evidence & WORM Dokumentation.',
  },
  {
    id: 'SEO',
    label: 'SEO',
    lead: 'Search Growth & Crawlability Lead',
    badgeColor: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
    description: 'Schema.org JSON-LD Structured Data, OpenGraph Share Cards, Canonical URLs & Keyword-Indexierung.',
  },
  {
    id: 'SOCIAL',
    label: 'SOCIAL',
    lead: 'Community & Ecosystem Relations',
    badgeColor: 'border-pink-400/40 bg-pink-400/10 text-pink-300',
    description: 'Telegram Whale Radar Alerts Bot, Twitter/X Card Sharing, Community Feed & On-Chain Broadcasts.',
  },
  {
    id: 'Security',
    label: 'Security',
    lead: 'Chief Information Security Officer (CISO)',
    badgeColor: 'border-rose-400/40 bg-rose-400/10 text-rose-300',
    description: 'SHA-256 Merkle-Chain Proofs, Zero-Trust RBAC, TLS 1.3 Strict, API Masking & OWASP Hardening.',
  },
  {
    id: 'Compliance',
    label: 'Compliance',
    lead: 'Chief Compliance Officer (CCO)',
    badgeColor: 'border-purple-400/40 bg-purple-400/10 text-purple-300',
    description: 'BaFin MaRisk Mindestanforderungen, WpHG § 83 Aufzeichnungspflichten & MiCA Krypto-Regulierung.',
  },
  {
    id: 'Fintech',
    label: 'Fintech',
    lead: 'Quantitative Financial Engineer',
    badgeColor: 'border-yellow-400/40 bg-yellow-400/10 text-yellow-300',
    description: 'Echtzeit-Scoring, Buffett DCF Algorithmen, Volatilitäts-Filter, Outlier-Erkennung & Provider-Fleet.',
  },
  {
    id: 'Agent-Client',
    label: 'Agent-Client',
    lead: 'AI Systems Architect',
    badgeColor: 'border-violet-400/40 bg-violet-400/10 text-violet-300',
    description: 'Gemini-3.8-Flash Kaufberater, Scientist Reasoning Engine, BOM Tool Catalog & Revenue Assurance.',
  },
  {
    id: 'Qualitätmanagement',
    label: 'Qualitätmanagement',
    lead: 'Quality Assurance & Audit Team',
    badgeColor: 'border-teal-400/40 bg-teal-400/10 text-teal-300',
    description: 'End-to-End Testautomatisierung, Schema Validation Suites, Contract Verifikation & Stresstests.',
  },
];

export const WORK_PACKAGES: WorkPackage[] = [
  // =========================================================================
  // 1. GOVERNANCE (GF & Founder)
  // =========================================================================
  {
    id: 'AP-GOV-01',
    title: 'BaFin MaRisk Governance & GF Freigabe-Matrix',
    owner: 'Governance',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 90,
    priority: 'Kritisch',
    leadName: 'Dr. Sven Kulessa (GF)',
    targetSprint: 'Sprint 2026-Q3.4',
    description: 'Festlegung der rechtsverbindlichen Freigabeprozesse für automatisierte Signale und Algorithmen-Einsatz durch die Geschäftsführung.',
    deliverables: [
      'Geschäftsführer-Prüfmatrix für Multi-Asset Signale',
      'Dokumentierte Eskalationsstufen bei Anomalien',
      'Formelle Zeichnung der Risikostrategie nach MaRisk AT 4.2',
    ],
    bafinStandard: 'BaFin MaRisk AT 4.2 / WpHG § 83',
    costImpactEur: 0,
    dependencies: ['AP-CMP-01'],
  },
  {
    id: 'AP-GOV-02',
    title: 'Revenue Assurance & Budget-Obergrenze (AP-006 Durchsetzung)',
    owner: 'Governance',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 95,
    priority: 'Kritisch',
    leadName: 'Dr. Sven Kulessa (GF)',
    targetSprint: 'Sprint 2026-Q3.4',
    description: 'Strikte Durchsetzung des monatlichen 40,00 € Budget-Deckels für externe Datenprovider & AI-Tokens zur Sicherung der Profitabilität.',
    deliverables: [
      'Automatisches Hard-Limit bei 40,00 € Provider-Kosten',
      'GF-Alert bei Erreichen von 80% Budgetausschöpfung',
      'TCO-Controlling Dashboard im Control Center',
    ],
    bafinStandard: 'Finanzielle Resilienz & Kostenkontrolle AP-006',
    costImpactEur: 40.0,
  },
  {
    id: 'AP-GOV-03',
    title: 'v1.0 Production Launch Readiness & Notar-Audit Vorbereitung',
    owner: 'Governance',
    status: 'planning',
    phase: 5,
    phaseName: 'Phase 5: Release Candidate & Production Go-Live v1.0',
    progressPercent: 30,
    priority: 'Hoch',
    leadName: 'Dr. Sven Kulessa (GF)',
    targetSprint: 'Sprint 2026-Q4.2',
    description: 'Vorbereitung der finalen Freigabe für den kommerziellen Echtbetrieb der Webanwendung v1.0 inklusive Notariatstestate der Tokenomics.',
    deliverables: [
      'Finales Management Sign-Off Dokument v1.0',
      'Go-Live Kommunikationsplan für B2B & institutionelle Partner',
      'Freigabe der SLA-Garantien für 99.9% Uptime',
    ],
    bafinStandard: 'MaRisk AT 7.3 Notfallkonzept',
    dependencies: ['AP-GOV-01', 'AP-QA-03'],
  },

  // =========================================================================
  // 2. OPERATION (DevOps & SRE)
  // =========================================================================
  {
    id: 'AP-OPS-01',
    title: 'Cloud Run Auto-Healing & Container Zero-Scale Optimization',
    owner: 'Operation',
    status: 'aktiv',
    phase: 2,
    phaseName: 'Phase 2: Multi-Asset Screener & BaFin Compliance Hardening',
    progressPercent: 100,
    priority: 'Kritisch',
    leadName: 'DevOps Lead',
    targetSprint: 'Sprint 2026-Q3.1',
    description: 'Betrieb der Next-Gen Containerlandschaft auf Cloud Run (Region europe-west2) mit automatischem Health-Check und Sub-Second Kaltstart.',
    deliverables: [
      'Docker Multi-Stage Build (<120MB Image)',
      'Automatisches Rollback bei ungesunden Pods',
      'Sub-45ms Latenz-Proxy Routen zu Gemini & Ingestion-Feeds',
    ],
    bafinStandard: 'BaFin BAIT Auslagerungsmanagement',
    costImpactEur: 15.0,
  },
  {
    id: 'AP-OPS-02',
    title: 'Echtzeit-Fleet Monitoring & Latenz-Telemetrie Dashboard',
    owner: 'Operation',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 88,
    priority: 'Hoch',
    leadName: 'SRE Team',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Live-Überwachung der 6 Gateway-Provider (TwelveData, FRED, Binance, Kraken, Alchemy, CCXT) mit Health-Alerting.',
    deliverables: [
      'Provider Fleet Health Terminal (/provider-status)',
      'Latenz-Histogramme mit 95th Percentile Warnschwellen',
      'Fallback-Routing bei Provider-Downtime in <200ms',
    ],
    bafinStandard: 'BaFin BAIT 8 IT-Betrieb',
    costImpactEur: 5.0,
  },
  {
    id: 'AP-OPS-03',
    title: 'Multi-Region Failover & Disaster Recovery Plan für v1.0',
    owner: 'Operation',
    status: 'planning',
    phase: 5,
    phaseName: 'Phase 5: Release Candidate & Production Go-Live v1.0',
    progressPercent: 45,
    priority: 'Hoch',
    leadName: 'DevOps Lead',
    targetSprint: 'Sprint 2026-Q4.1',
    description: 'Automatisierte Umschaltung auf Standby-Knoten in Frankfurt (europe-west3) bei Rechenzentrumsausfall in London.',
    deliverables: [
      'RTO < 30 Sekunden / RPO = 0 Sekunden Spezifikation',
      'Simulierter Ausfalltest im Benchmark Lab',
      'Disaster Recovery Protokoll für den BaFin Prüfer',
    ],
    bafinStandard: 'MaRisk AT 7.3 Notfallkonzept',
    dependencies: ['AP-OPS-01'],
  },

  // =========================================================================
  // 3. FRONTEND (UI & Responsive Terminal)
  // =========================================================================
  {
    id: 'AP-FE-01',
    title: '4-Reiter Architektur & Globaler Hub Header Navigation',
    owner: 'Frontend',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 95,
    priority: 'Kritisch',
    leadName: 'Lead Frontend Architect',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Implementierung der vier Hauptreiter: Marketscreener, Studio Hub, Learning Portal und Control Center mit konsistenter State-Verwaltung.',
    deliverables: [
      'Zentraler Desktop- und Mobile-Reiter Tabbar im Header',
      'Entfernung redundanter Sub-Tabs im Footer (Clean Footer)',
      'URL-Synchronisation über getNormalizedPath & resolveAppRoute',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-FE-02',
    title: 'Learning Portal UI mit interaktivem Glossar & Such-Terminal',
    owner: 'Frontend',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 90,
    priority: 'Hoch',
    leadName: 'Senior UI Engineer',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Dediziertes Learning Portal für Fachtermini, Quant-Formeln, Faustformeln und interaktive Definitionen mit Copy-to-Clipboard.',
    deliverables: [
      'Vollständiges Glossar Terminal nach Kategorien & Skill-Level',
      'Suchfunktion mit Instant-Highlighting',
      'Spickzettel-Karten (Cheat-Sheets) für Trader & Institutionelle',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-FE-03',
    title: 'Control Center Cockpit & Interactive Roadmap Component',
    owner: 'Frontend',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 85,
    priority: 'Kritisch',
    leadName: 'Lead Frontend Architect',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Entwicklung der Management-Konsole mit filterbarer Roadmap nach 11 Projektownern, 3 Status und 5 Phasen bis v1.0.',
    deliverables: [
      'Filter-Matrix nach Owner, Status und Phase',
      'Executive Cockpit für Geschäftsführer und Team',
      'Visuelle Phasen-Pipeline mit Fortschrittsanzeige',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-FE-04',
    title: 'PWA Offline Caching & Mobile Touch Gestures für v1.0',
    owner: 'Frontend',
    status: 'planning',
    phase: 4,
    phaseName: 'Phase 4: Security, Evidence Merkle Trees, SEO & Social',
    progressPercent: 50,
    priority: 'Mittel',
    leadName: 'Mobile Frontend Engineer',
    targetSprint: 'Sprint 2026-Q3.6',
    description: 'Installation als Progressive Web App auf iOS/Android mit Offline-Zugriff auf das Learning Portal & letzte Cache-Stände.',
    deliverables: [
      'Service Worker Cache-First Strategie für statische Assets',
      'App Manifest mit High-DPI Icons',
      'In-App Install Prompt Banner',
    ],
    costImpactEur: 0,
  },

  // =========================================================================
  // 4. DOKUMENTE (Docs & Technical Whitepapers)
  // =========================================================================
  {
    id: 'AP-DOC-01',
    title: 'Fintech Pipeline & Screener Architektur-Whitepaper (16 Konzepte)',
    owner: 'Dokumente',
    status: 'aktiv',
    phase: 2,
    phaseName: 'Phase 2: Multi-Asset Screener & BaFin Compliance Hardening',
    progressPercent: 100,
    priority: 'Hoch',
    leadName: 'Technical Writer',
    targetSprint: 'Sprint 2026-Q3.2',
    description: 'Vollständige mathematische und technische Dokumentation der 16 Datenkonzepte von Ringpuffer bis Zero-Copy Arrow Flight.',
    deliverables: [
      'Interaktive Architektur-Seite (/architecture)',
      'PDF-Download für institutionelle Audits',
      'Code-Beispiele in TypeScript, Python und Rust',
    ],
    bafinStandard: 'BaFin BAIT Dokumentationspflicht',
    costImpactEur: 0,
  },
  {
    id: 'AP-DOC-02',
    title: 'BaFin MaRisk & WpHG § 83 Konformitäts-Handbuch',
    owner: 'Dokumente',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 85,
    priority: 'Kritisch',
    leadName: 'Legal & Tech Docs Lead',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Prüffähiges Handbuch für externe Wirtschaftsprüfer zur Darlegung der unveränderbaren WORM-Archivierung und Signal-Historie.',
    deliverables: [
      'Kapitel: Datenintegrität & Hashing-Verfahren',
      'Kapitel: Algorithmische Entscheidungswege (Buffett DCF)',
      'Prüfprotokoll-Vorlage für Jahresabschlussprüfungen',
    ],
    bafinStandard: 'WpHG § 83 Abs. 1 / MaRisk AT 4.3.2',
    costImpactEur: 0,
  },
  {
    id: 'AP-DOC-03',
    title: 'REST / WebSocket API Dokumentation & OpenAPI 3.1 Spec',
    owner: 'Dokumente',
    status: 'pending',
    phase: 4,
    phaseName: 'Phase 4: Security, Evidence Merkle Trees, SEO & Social',
    progressPercent: 60,
    priority: 'Mittel',
    leadName: 'API Docs Specialist',
    targetSprint: 'Sprint 2026-Q4.1',
    description: 'Bereitstellung maschinenlesbarer Swagger / OpenAPI Spezifikationen für B2B-Kunden und Broker-Schnittstellen.',
    deliverables: [
      'OpenAPI 3.1 JSON / YAML Endpunkt-Katalog',
      'Interaktive Try-it-Out Sandbox im Studio Hub',
      'SDK Quickstarts für JavaScript und Python',
    ],
    costImpactEur: 0,
  },

  // =========================================================================
  // 5. SEO (Search Engine Optimization & Structured Data)
  // =========================================================================
  {
    id: 'AP-SEO-01',
    title: 'Schema.org JSON-LD Structured Data für FinancialService & SoftwareApplication',
    owner: 'SEO',
    status: 'aktiv',
    phase: 2,
    phaseName: 'Phase 2: Multi-Asset Screener & BaFin Compliance Hardening',
    progressPercent: 100,
    priority: 'Hoch',
    leadName: 'Technical SEO Specialist',
    targetSprint: 'Sprint 2026-Q3.3',
    description: 'Strukturierte Daten nach Google Rich Snippet Richtlinien zur Auszeichnung von Finanzanalysen, Screener und Glossar-Definitionen.',
    deliverables: [
      'SoftwareApplication Schema in index.html',
      'FinancialService Entity Markup mit BAFIN MaRisk Verweisen',
      'DefinedTerm Schema für das Learning Portal Vocabulary',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-SEO-02',
    title: 'Dynamische OpenGraph & Twitter Card Social Share Generator',
    owner: 'SEO',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 80,
    priority: 'Mittel',
    leadName: 'SEO & Growth Engineer',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Generierung hochauflösender Vorschaubilder (1200x630) bei Teilung von Screener-Analysen, Pipeline-Blueprints oder Glossar-Einträgen.',
    deliverables: [
      'OG:Title und OG:Description Sync in metadata.json & HTML',
      'Klickbare Social Previews für WhatsApp, LinkedIn, X',
      'Twitter Large Image Card Metatags',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-SEO-03',
    title: 'XML Sitemap & Google Search Console Indexierungs-Strategie',
    owner: 'SEO',
    status: 'planning',
    phase: 4,
    phaseName: 'Phase 4: Security, Evidence Merkle Trees, SEO & Social',
    progressPercent: 40,
    priority: 'Mittel',
    leadName: 'SEO Specialist',
    targetSprint: 'Sprint 2026-Q3.6',
    description: 'Bereitstellung einer automatisierten Sitemap für alle Glossarbegriffe, Markt-Asset-Profile und öffentliche Studio-Blueprints.',
    deliverables: [
      'Dynamische sitemap.xml Route mit wöchentlicher Priorität',
      'Robots.txt mit gezielter Freigabe für Googlebot und Perplexity AI',
      'Lighthouse SEO Score 100/100 Audit',
    ],
    costImpactEur: 0,
  },

  // =========================================================================
  // 6. SOCIAL (Community, Telegram Bot & Social Signals)
  // =========================================================================
  {
    id: 'AP-SOC-01',
    title: 'Telegram Whale Radar Alerts & Smart Money Broadcast Engine',
    owner: 'SOCIAL',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 85,
    priority: 'Hoch',
    leadName: 'Bot & Community Engineer',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Automatisierte Telegram-Benachrichtigungen bei großen Transaktionen (>1.000.000 $) auf Ethereum, Bitcoin und Solana.',
    deliverables: [
      'Telegram Bot Webhook Schnittstelle (/whale-radar)',
      'Sofortiger Alert bei On-Chain Whale Transaktionen',
      'Ein-Klick Beitritts-Link für die VIP Signal-Gruppe',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-SOC-02',
    title: 'One-Click Social Share & Pipeline Blueprint Link-Sharing',
    owner: 'SOCIAL',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 90,
    priority: 'Mittel',
    leadName: 'Frontend & Social Dev',
    targetSprint: 'Sprint 2026-Q3.4',
    description: 'Direktes Teilen von konfigurierten Pipelines und Screener-Ergebnissen über native Web Share API & Twitter/X Intent Links.',
    deliverables: [
      'Kompakter Share-Link mit Hash-Parametern (#share=...)',
      'Vorgefertigte Tweets mit $CPT Tokenomics und Performance-Metriken',
      'LinkedIn Post Vorlage für B2B CTOs & FinTech Entscheider',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-SOC-03',
    title: 'Discord Community Bot & Alpha Caller Integration für v1.0',
    owner: 'SOCIAL',
    status: 'planning',
    phase: 5,
    phaseName: 'Phase 5: Release Candidate & Production Go-Live v1.0',
    progressPercent: 20,
    priority: 'Mittel',
    leadName: 'Community Lead',
    targetSprint: 'Sprint 2026-Q4.2',
    description: 'Verbindung der Trading Community über einen interaktiven Discord Bot mit /score und /buffett Slash-Commands.',
    deliverables: [
      'Discord Bot Token Setup mit Role-Gating ($CPT Staker)',
      'Live-Feed der Top 5 Tagesgewinner und Whale Akkumulationen',
      'Automatischer Willkommens-Guide mit Verweis aufs Learning Portal',
    ],
    costImpactEur: 0,
  },

  // =========================================================================
  // 7. SECURITY (CISO, Cryptography & Hardening)
  // =========================================================================
  {
    id: 'AP-SEC-01',
    title: 'SHA-256 Merkle-Tree Hashketten für Signal-Integrität',
    owner: 'Security',
    status: 'aktiv',
    phase: 2,
    phaseName: 'Phase 2: Multi-Asset Screener & BaFin Compliance Hardening',
    progressPercent: 95,
    priority: 'Kritisch',
    leadName: 'CISO / Security Engineer',
    targetSprint: 'Sprint 2026-Q3.3',
    description: 'Kryptografische Signierung jedes generierten Scores in einer unveränderbaren Merkle-Baum-Struktur zur Beweissicherung.',
    deliverables: [
      'Client- und Server-seitige SHA-256 Hashing-Routine',
      'Merkle Root Export im PDF Evidence Report',
      'Unveränderbare WORM-Verifikation im Benchmark Lab',
    ],
    bafinStandard: 'WpHG § 83 / NIST FIPS 180-4',
    costImpactEur: 0,
  },
  {
    id: 'AP-SEC-02',
    title: 'Zero-Trust RBAC & Session Security im Control Center',
    owner: 'Security',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 85,
    priority: 'Kritisch',
    leadName: 'Security Lead',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Rollenbasierte Zugriffskontrolle (GF, Founder, Tech Lead, Compliance Officer) mit Audit Logging aller Admin-Aktionen.',
    deliverables: [
      'Granulare Rollenmatrix im Control Center',
      'Maskierung aller sensiblen Provider-API Keys',
      'Automatische Session-Invalidierung bei Inaktivität',
    ],
    bafinStandard: 'BaFin BAIT 4 Berechtigungsmanagement',
    costImpactEur: 0,
  },
  {
    id: 'AP-SEC-03',
    title: 'OWASP Top 10 Audit & Penetration Testing vor v1.0 Go-Live',
    owner: 'Security',
    status: 'planning',
    phase: 5,
    phaseName: 'Phase 5: Release Candidate & Production Go-Live v1.0',
    progressPercent: 35,
    priority: 'Kritisch',
    leadName: 'External Pentest Partner & CISO',
    targetSprint: 'Sprint 2026-Q4.1',
    description: 'Umfassende Sicherheitsüberprüfung gegen XSS, CSRF, Injection, Prototype Pollution und API-Key Exfiltration vor dem v1.0 Start.',
    deliverables: [
      'Offizieller Penetration Test Report ohne kritische Befunde',
      'Content Security Policy (CSP) Level 3 Konfiguration',
      'Automatische GitHub Dependabot & CodeQL Scans',
    ],
    bafinStandard: 'BSI IT-Grundschutz / ISO 27001',
    costImpactEur: 0,
    dependencies: ['AP-SEC-01', 'AP-SEC-02'],
  },

  // =========================================================================
  // 8. COMPLIANCE (Regulatory, BaFin & MiCA)
  // =========================================================================
  {
    id: 'AP-CMP-01',
    title: 'BaFin MaRisk Mindestanforderungen an das Risikomanagement',
    owner: 'Compliance',
    status: 'aktiv',
    phase: 2,
    phaseName: 'Phase 2: Multi-Asset Screener & BaFin Compliance Hardening',
    progressPercent: 95,
    priority: 'Kritisch',
    leadName: 'Chief Compliance Officer',
    targetSprint: 'Sprint 2026-Q3.2',
    description: 'Verankerung der qualitativen und quantitativen MaRisk-Anforderungen an Finanzsoftware mit Auslagerungsprüfung.',
    deliverables: [
      'MaRisk AT 4.3.1 Datenmanagement-Validierung',
      'Dokumentierte Schnittstellen-SLA aller Fremddatenanbieter',
      'Audit-Trail Viewer im Control Center',
    ],
    bafinStandard: 'BaFin Rundschreiben 10/2021 (BA) - MaRisk',
    costImpactEur: 0,
  },
  {
    id: 'AP-CMP-02',
    title: 'MiCA Kryptowerte-Verordnung & Whitepaper Revisionssicherheit',
    owner: 'Compliance',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 90,
    priority: 'Hoch',
    leadName: 'Crypto Legal Counsel',
    targetSprint: 'Sprint 2026-Q3.4',
    description: 'Prüfung der $CPT Tokenomics und Staking-Mechaniken nach der EU-Verordnung über Märkte für Kryptowerte (MiCA).',
    deliverables: [
      'MiCA Art. 6 Krypto-Asset Whitepaper Konformität',
      'Risikohinweise für Utility Token Staking und Buyback-Burn',
      'Ausschluss unzulässiger Einlagengeschäfte nach KWG',
    ],
    bafinStandard: 'EU MiCA Verordnung 2023/1114',
    costImpactEur: 0,
  },
  {
    id: 'AP-CMP-03',
    title: 'WpHG § 83 Aufzeichnungs- und Aufbewahrungspflichten Audit',
    owner: 'Compliance',
    status: 'pending',
    phase: 4,
    phaseName: 'Phase 4: Security, Evidence Merkle Trees, SEO & Social',
    progressPercent: 70,
    priority: 'Kritisch',
    leadName: 'Chief Compliance Officer',
    targetSprint: 'Sprint 2026-Q3.6',
    description: 'Sicherstellung der 5-jährigen lückenlosen und manipulationssicheren Aufbewahrung aller berechneten Scores und Signale.',
    deliverables: [
      'WORM (Write Once Read Many) Cloud Storage Bucket Regelwerk',
      'Exportfunktion für BaFin Sonderprüfer in CSV/JSON/PDF',
      'Revisionsprotokoll aller manuellen Override-Versuche',
    ],
    bafinStandard: 'WpHG § 83 Abs. 1 & 2 / Delegierte VO (EU) 2017/565',
    costImpactEur: 0,
    dependencies: ['AP-CMP-01', 'AP-SEC-01'],
  },

  // =========================================================================
  // 9. FINTECH (Quantitative Finance & Scoring Engine)
  // =========================================================================
  {
    id: 'AP-FIN-01',
    title: 'Multi-Asset Screener & 50-Faktoren Quantitative Ranking Engine',
    owner: 'Fintech',
    status: 'aktiv',
    phase: 2,
    phaseName: 'Phase 2: Multi-Asset Screener & BaFin Compliance Hardening',
    progressPercent: 100,
    priority: 'Kritisch',
    leadName: 'Head of Quant Research',
    targetSprint: 'Sprint 2026-Q3.2',
    description: 'Vollständige Berechnung von fundamentalen, technischen und Sentiment-Scores über Aktien, Krypto, Forex und Rohstoffe.',
    deliverables: [
      'Berechnung von PE, PB, ROE, FCF-Yield, Debt/Equity',
      'Z-Score Normalisierung & Outlier-Winsorizing',
      'Sektor-Aggregations-Matrix mit 11 Kernsektoren',
    ],
    bafinStandard: 'Quantitative Methodik & Backtesting Standards',
    costImpactEur: 0,
  },
  {
    id: 'AP-FIN-02',
    title: 'Buffett Value Check & Margin of Safety DCF Algorithmus',
    owner: 'Fintech',
    status: 'aktiv',
    phase: 2,
    phaseName: 'Phase 2: Multi-Asset Screener & BaFin Compliance Hardening',
    progressPercent: 100,
    priority: 'Hoch',
    leadName: 'Senior Quant Engineer',
    targetSprint: 'Sprint 2026-Q3.3',
    description: 'Rechnerische Ermittlung des intrinsischen Werts mit 10-Jahres FCF-Projektion, WACC-Diskontierung und Sicherheitsmarge.',
    deliverables: [
      'Discounted Cash Flow (DCF) Modell mit 3 Szenarien (Bear, Base, Bull)',
      'Eigenkapitalrendite (ROE) > 15% Konsistenzfilter',
      'Interaktiver Buffett Score in Asset-Detailkarten',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-FIN-03',
    title: 'High-Frequency Slippage Model & Order Execution Simulator',
    owner: 'Fintech',
    status: 'pending',
    phase: 4,
    phaseName: 'Phase 4: Security, Evidence Merkle Trees, SEO & Social',
    progressPercent: 65,
    priority: 'Mittel',
    leadName: 'Quant Engineer',
    targetSprint: 'Sprint 2026-Q4.1',
    description: 'Simulation von Ausführungskosten und Slippage bei institutionellen Ordervolumina über aggregierte Orderbücher.',
    deliverables: [
      'Almgren-Chriss Slippage Impact Funktion',
      'Orderbuch-Tiefe Indikator im Benchmark Lab',
      'TCO-Kostenrechner für Arbitrage & Market Making',
    ],
    costImpactEur: 0,
  },

  // =========================================================================
  // 10. AGENT-CLIENT (Gemini-3.8-Flash & Reasoning Architecture)
  // =========================================================================
  {
    id: 'AP-AGT-01',
    title: 'Gemini-3.8-Flash Kaufberater & Dual Scientist Reasoning Mode',
    owner: 'Agent-Client',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 95,
    priority: 'Kritisch',
    leadName: 'AI Systems Architect',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Kopplung des Gemini Reasoning Modells mit Scientist Thought Process für Latenz, Monotone Sequenzierung und BaFin MaRisk.',
    deliverables: [
      'Streaming & Fallback Engine mit User-Agent Header',
      'Dual-Pane UI: Scientist Thought Process vs. Kaufberater Output',
      'Live-Bestandsabgleich mit der ausgewählten Pipeline',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-AGT-02',
    title: 'Pipeline Tool Inventory & Revenue Assurance Catalog (AP-006)',
    owner: 'Agent-Client',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 95,
    priority: 'Kritisch',
    leadName: 'AI Systems Architect',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Vollständiger Katalog aller Werkzeuge, Indikatoren, Chartmuster und News-APIs mit SKU-Vergabe und Budget-Zählung.',
    deliverables: [
      'Katalog mit über 50 quantitativen Indikatoren & Pattern SKUs',
      'Automatische Preisberechnung mit Restbudget-Anzeige',
      'Echtzeit-Validierung vor Blueprint-Export',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-AGT-03',
    title: 'Autonome Multi-Agent Feedback-Loop für Portfolio-Rebalancing',
    owner: 'Agent-Client',
    status: 'planning',
    phase: 5,
    phaseName: 'Phase 5: Release Candidate & Production Go-Live v1.0',
    progressPercent: 25,
    priority: 'Hoch',
    leadName: 'AI Systems Architect',
    targetSprint: 'Sprint 2026-Q4.2',
    description: 'Erweiterung des Agenten zur kontinuierlichen Überwachung von Marktregimen und automatischen Rebalancing-Empfehlungen.',
    deliverables: [
      'Marktregime-Erkennung (Bull, Bear, Choppy, Liquidity Crisis)',
      'Generierung von vorschlagsbasierten Portfolio-Umschichtungen',
      'Human-in-the-Loop Bestätigungsdialog für den Nutzer',
    ],
    costImpactEur: 0,
    dependencies: ['AP-AGT-01', 'AP-FIN-01'],
  },

  // =========================================================================
  // 11. QUALITÄTMANAGEMENT (QA, Testing & Verification)
  // =========================================================================
  {
    id: 'AP-QA-01',
    title: 'Automatisierte Contract & Provider Validation Test Suite',
    owner: 'Qualitätmanagement',
    status: 'aktiv',
    phase: 2,
    phaseName: 'Phase 2: Multi-Asset Screener & BaFin Compliance Hardening',
    progressPercent: 100,
    priority: 'Kritisch',
    leadName: 'QA Lead Engineer',
    targetSprint: 'Sprint 2026-Q3.1',
    description: 'Validierung aller Datenverträge, Enterprise Scorer Berechnungen und Provider Registry Schemata via npm test.',
    deliverables: [
      'Provider Registry Validierungssuite (100% Pass)',
      'Enterprise Scoring Konsistenztests',
      'Typensicherheit mit tsc --noEmit ohne Warnungen',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-QA-02',
    title: 'Cross-Browser & Responsive Breakpoint Validation (Mobile, Tablet, 4K)',
    owner: 'Qualitätmanagement',
    status: 'aktiv',
    phase: 3,
    phaseName: 'Phase 3: AI Agent-Client & Studio Hub Synthesizer',
    progressPercent: 85,
    priority: 'Hoch',
    leadName: 'QA Test Engineer',
    targetSprint: 'Sprint 2026-Q3.5',
    description: 'Verifikation des fehlerfreien Renderings auf Chrome, Safari iOS, Firefox und Edge auf Mobilgeräten bis zu Ultrawide Monitoren.',
    deliverables: [
      'Testmatrix für iOS Safari, Android Chrome und Desktop',
      'Keine Layout-Shifts (CLS < 0.05)',
      'Barrierefreie Bedienbarkeit mit Tastatur (Tab-Navigation & WAI-ARIA)',
    ],
    costImpactEur: 0,
  },
  {
    id: 'AP-QA-03',
    title: 'v1.0 Production Stresstest & Notfall-Szenario Simulation',
    owner: 'Qualitätmanagement',
    status: 'planning',
    phase: 5,
    phaseName: 'Phase 5: Release Candidate & Production Go-Live v1.0',
    progressPercent: 30,
    priority: 'Kritisch',
    leadName: 'QA Lead & External Auditor',
    targetSprint: 'Sprint 2026-Q4.2',
    description: 'Lasttests mit 10.000 simulierten gleichzeitigen Websocket-Verbindungen und Flash-Crash Marktdatenszenarien.',
    deliverables: [
      'Lasttest-Zertifikat mit 99.95% erfolgreichen Requests',
      'Erholungszeit nach Netzwerktrennung < 2 Sekunden',
      'Freigabezertifikat für den v1.0 Live-Launch',
    ],
    costImpactEur: 0,
    dependencies: ['AP-QA-01', 'AP-QA-02', 'AP-OPS-03'],
  },
];
