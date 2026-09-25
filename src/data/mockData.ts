/**
 * ============================================================================
 * [ARCHITEKTUR-MAPPING: MARKET DATA & CORE MODULE REPOSITORY]
 * ----------------------------------------------------------------------------
 * 1. GRAFISCHE KOMPONENTE : Bereitstellung von Asset-Daten für MarketOverview, AssetDetailModal, AllMarketsModal
 * 2. SCORING-LOGIK        : Enthält die Basis-Scores (`aiScore` 0-100, `aiRating`, Risikokennzahlen)
 * 3. DATENANBINDUNG       : Exportiert als statische In-Memory Stores mit sub-sekündlicher Filterbarkeit
 * 4. DATENQUELLEN / FEEDS : Aggregation aus 5 Sub-Feeds:
 *                           - Indizes (INDEX_ASSETS)
 *                           - Krypto-Börsen (ALL_CRYPTO_ASSETS)
 *                           - Aktien Top 150 (TOP_150_STOCKS)
 *                           - Devisenmärkte (FOREX_ASSETS)
 *                           - Rohstoff-Futures (COMMODITY_ASSETS)
 * ============================================================================
 */

import { MarketAsset, CoreModule, KeyPillar, AssetClassInfo } from '../types';
import { INDEX_ASSETS } from './assets/indexAssets';
import { ALL_CRYPTO_ASSETS } from './assets/cryptoAssets';
import { TOP_150_STOCKS } from './assets/stockAssets';
import { FOREX_ASSETS } from './assets/forexAssets';
import { COMMODITY_ASSETS } from './assets/commodityAssets';

/* === [PLATZHALTER: ARCHITEKTUR - 4 KEY PILLARS METADATEN] === */
export const KEY_PILLARS: KeyPillar[] = [
  {
    id: 'realtime',
    title: 'Echtzeit-Marktdaten',
    iconType: 'coins',
    color: '#F9BF21', // AIF Gold (Primary)
  },
  {
    id: 'transparent-ai',
    title: 'Transparente KI-Modelle',
    iconType: 'ai-brain',
    color: '#8D26FF', // Purple (Accent)
  },
  {
    id: 'audience',
    title: 'Für Privatanleger und Professionals',
    iconType: 'users',
    color: '#44DE88', // Emerald (Success)
  },
  {
    id: 'global-markets',
    title: 'Weltweite Märkte auf einer Plattform',
    iconType: 'globe',
    color: '#F9BF21', // AIF Gold
  },
];

export const MARKET_ASSETS: MarketAsset[] = [
  ...INDEX_ASSETS,
  ...ALL_CRYPTO_ASSETS,
  ...TOP_150_STOCKS,
  ...FOREX_ASSETS,
  ...COMMODITY_ASSETS,
];

export const CORE_MODULES: CoreModule[] = [
  {
    id: 'enterprise-scorer',
    title: 'Enterprise Scorer',
    description: 'KI-gestützte Analyse mit transparenter Methodik.',
    iconType: 'brain',
    tagline: 'Multi-Faktor Scoring in Echtzeit',
    brandColor: '#8D26FF', // Purple (Accent)
    accentColor: '#E879F9',
    details: {
      useCase: 'Bewertet Fundamentaldaten, Sentiment, Cashflows und Risikofaktoren in einer einheitlichen Kennzahl von 0–100.',
      features: [
        'Vollständige Transparenz: Jeder Teilscore ist nachvollziehbar',
        'Automatischer Abgleich von Quartalsberichten & Analystenkonsens',
        'Echtzeit-Alerts bei signifikanten Score-Verschiebungen',
      ],
      sampleMetrics: [
        { label: 'Finanzielle Solidität', value: '92/100', score: 'Ausgezeichnet' },
        { label: 'Wachstumsdynamik', value: '84/100', score: 'Hoch' },
        { label: 'Bewertungsniveau (KGV)', value: '71/100', score: 'Fair' },
        { label: 'KI-Sentiment (Nachrichten)', value: '89/100', score: 'Sehr positiv' },
      ],
    },
  },
  {
    id: 'buffett-value',
    title: 'Buffett Value Check',
    description: 'Bewertet Aktien nach Value-Prinzipien.',
    iconType: 'leaf',
    tagline: 'Diszipliniertes Investieren nach Warren Buffett',
    brandColor: '#44DE88', // Emerald (Success)
    accentColor: '#86EFAC',
    details: {
      useCase: 'Prüft Unternehmen auf nachhaltige Burggräben (Moats), Eigenkapitalrendite und Sicherheitsmarge (Margin of Safety).',
      features: [
        'Burggraben-Kriterien (Markenstärke, Skaleneffekte, Switching Costs)',
        'Historische Eigenkapitalrendite (ROE > 15% über 10 Jahre)',
        'Berechnung des fairen inneren Wertes (DCF-Modell)',
      ],
      sampleMetrics: [
        { label: 'Burggraben (Economic Moat)', value: 'Breit', score: 'Top 5%' },
        { label: '10J Durchschnitts-ROE', value: '18,4%', score: 'Überragend' },
        { label: 'Verschuldungsgrad (Debt/Equity)', value: '0,42', score: 'Konservativ' },
        { label: 'Margin of Safety', value: '+14,8%', score: 'Attraktiv' },
      ],
    },
  },
  {
    id: 'ai-newsfeed',
    title: 'AI Newsfeed',
    description: 'Echtzeit-Sentiment & kuratierte Marktnachrichten.',
    iconType: 'news',
    tagline: 'KI-kuratierte Marktsignale in Millisekunden',
    brandColor: '#F87171', // Rose (Breaking News / Market Pulse)
    accentColor: '#FCA5A5',
    details: {
      useCase: 'Aggregiert weltweite Finanzmedien, Social Sentiment und Unternehmensmitteilungen in Echtzeit durch semantische KI-Filter.',
      features: [
        'Echtzeit-Sentiment-Scoring von globalen Schlagzeilen',
        'Semantische Auswirkungsanalyse auf Indizes, Krypto & Rohstoffe',
        'Faktenprüfung und Rausch-Filterung gegen Fehlinformationen',
        'Personalisierte Alerts für relevante Portfolio-Events',
      ],
      sampleMetrics: [
        { label: 'Analysierte Quellen / min', value: '4.200+', score: 'Echtzeit' },
        { label: 'Markt-Sentiment-Index', value: 'Bullisch (+68)', score: 'Positiv' },
        { label: 'KI-Klassifizierungsgenauigkeit', value: '96,4%', score: 'Top Tier' },
        { label: 'Latenz Sentiment-Engine', value: '18 ms', score: 'Ultra-Fast' },
      ],
      newsItems: [
        {
          headline: 'EZB signalisiert vorsichtige Zinssenkungen im Euroraum',
          source: 'Reuters Financial',
          time: 'vor 4 Min.',
          sentiment: 'bullish',
          impact: 'EUR/USD • DAX 40',
        },
        {
          headline: 'US-Tech-Sektor verzeichnet Rekord-Zuflüsse in KI-Infrastruktur',
          source: 'Bloomberg Terminal',
          time: 'vor 11 Min.',
          sentiment: 'bullish',
          impact: 'S&P 500 • NVDA • MSFT',
        },
        {
          headline: 'Bitcoin hält Unterstützungszone nach institutionellen Käufen',
          source: 'CoinDesk Pro',
          time: 'vor 23 Min.',
          sentiment: 'bullish',
          impact: 'BTC/USD • ETH/USD',
        },
        {
          headline: 'Rohöl-Volatilität steigt nach Nahost-Frachtrouten-Meldungen',
          source: 'Financial Times',
          time: 'vor 38 Min.',
          sentiment: 'neutral',
          impact: 'Brent Crude • Gold',
        },
      ],
    },
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    description: 'Finanzbegriffe einfach erklärt.',
    iconType: 'book',
    tagline: 'Vom Einsteiger zum versierten Marktbeobachter',
    brandColor: '#F9BF21', // AIF Gold (Primary)
    accentColor: '#FDE047',
    details: {
      useCase: 'Interaktives Nachschlagewerk mit über 450 Finanz- und KI-Fachbegriffen, verständlichen Praxisbeispielen und Faustformeln.',
      features: [
        'Prägnante Definitionen ohne unnötiges Fachchinesisch',
        'Visuelle Diagramme für komplexe Zusammenhänge',
        'Direkte Verknüpfung mit den aktuellen Marktdaten',
      ],
      sampleMetrics: [
        { label: 'Eingetragene Fachbegriffe', value: '480+', score: 'Wachsend' },
        { label: 'Kategorien', value: '12 Themen', score: 'Strukturiert' },
        { label: 'Durchschnittliche Lesezeit', value: '90 Sek.', score: 'Kompakt' },
      ],
    },
  },
];

export const ASSET_CLASSES: AssetClassInfo[] = [
  {
    id: 'KRYPTO',
    name: 'Krypto',
    color: '#F9BF21', // AIF Gold
    description: 'Dezentrale Vermögenswerte, Smart Contracts & Web3-Ökosysteme',
    subclasses: [
      {
        id: 'krypto-defi',
        name: 'DeFi (Decentralized Finance)',
        shortDesc: 'Liquiditätsprotokolle, automatisierte Market Maker & dezentrale Kreditmärkte.',
        examples: ['UNI', 'AAVE', 'MKR', 'LDO'],
        trending: '+4,8%',
      },
      {
        id: 'krypto-memecoins',
        name: 'Memecoins & Community Tokens',
        shortDesc: 'Community-getriebene Viralität, Social Sentiment & dynamische Liquiditätswellen.',
        examples: ['DOGE', 'SHIB', 'PEPE', 'BONK'],
        trending: '+12,4%',
      },
      {
        id: 'krypto-privacy',
        name: 'Datenschutz & Privacy Coins',
        shortDesc: 'Kryptografische Anonymität, Zero-Knowledge-Proofs & vertrauliche Transaktionen.',
        examples: ['XMR', 'ZEC', 'ROSE', 'SCRT'],
        trending: '+2,1%',
      },
      {
        id: 'krypto-branch',
        name: 'Branch / Layer-1 & Infra',
        shortDesc: 'Basis-Blockchains, Konsensprotokolle, modulare Datenverfügbarkeit & Skalierung.',
        examples: ['BTC', 'ETH', 'SOL', 'AVAX', 'ATOM'],
        trending: '+3,5%',
      },
      {
        id: 'krypto-gaming',
        name: 'Gaming & Metaverse',
        shortDesc: 'In-Game Ökonomien, NFT-Infrastruktur & virtuelle Entertainment-Welten.',
        examples: ['IMX', 'GALA', 'SAND', 'BEAM'],
        trending: '+6,2%',
      },
      {
        id: 'krypto-ai-depin',
        name: 'KI & DePIN (Hardware-Netze)',
        shortDesc: 'Dezentrale Rechenleistung, GPU-Cluster & künstliche Intelligenz auf der Chain.',
        examples: ['TAO', 'RNDR', 'FET', 'HNT'],
        trending: '+8,9%',
      },
    ],
  },
  {
    id: 'AKTIEN',
    name: 'Aktien',
    color: '#44DE88', // Emerald
    description: 'Globale Unternehmensanteile mit Dividenden, Wachstums- & Value-Profilen',
    subclasses: [
      {
        id: 'aktien-tech-ai',
        name: 'Technologie & KI-Halbleiter',
        shortDesc: 'Hardware-Pioniere, Cloud-Giganten & generative KI-Infrastruktur.',
        examples: ['NVDA', 'AAPL', 'MSFT', 'TSM', 'AMD'],
        trending: '+3,9%',
      },
      {
        id: 'aktien-finance',
        name: 'Finanzwesen & Banking',
        shortDesc: 'Globale Investmentbanken, Zahlungsnetzwerke & Vermögensverwalter.',
        examples: ['JPM', 'V', 'ALV', 'BRK.B'],
        trending: '+1,1%',
      },
      {
        id: 'aktien-health',
        name: 'Gesundheit & Pharma-Biotech',
        shortDesc: 'Megatrend GLP-1, medizinische Innovationen & krisensichere Cashflows.',
        examples: ['NOVO', 'LLY', 'PFE', 'ROG'],
        trending: '+1,8%',
      },
      {
        id: 'aktien-industry',
        name: 'Industrie, Energie & Mobilität',
        shortDesc: 'Automatisierung, E-Mobilität, Infrastruktur & traditionelle Industrie.',
        examples: ['SIE', 'TSLA', 'RHM', 'CAT'],
        trending: '+2,3%',
      },
      {
        id: 'aktien-consumer',
        name: 'Konsumgüter & Luxus',
        shortDesc: 'Starke Preissetzungsmacht, weltweite Markenloyalität & Konsumresilienz.',
        examples: ['MC (LVMH)', 'AMZN', 'KO', 'RMS'],
        trending: '+0,8%',
      },
    ],
  },
  {
    id: 'INDIZIES',
    name: 'Indizies',
    color: '#8D26FF', // Purple
    description: 'Marktbreite Körbe, Benchmark-Indikatoren & Sektor-Barometer',
    subclasses: [
      {
        id: 'indizies-us',
        name: 'US-Leitindizes',
        shortDesc: 'Die weltweiten Benchmark-Schwergewichte für Markttrend & Risikobereitschaft.',
        examples: ['S&P 500', 'Nasdaq 100', 'Dow Jones', 'Russell 2000'],
        trending: '+1,4%',
      },
      {
        id: 'indizies-europe',
        name: 'Europa & DACH-Region',
        shortDesc: 'Führende Börsenbarometer der europäischen Volkswirtschaften.',
        examples: ['DAX 40', 'Euro Stoxx 50', 'SMI', 'CAC 40'],
        trending: '+0,8%',
      },
      {
        id: 'indizies-asia',
        name: 'Asien & Pazifik',
        shortDesc: 'Wirtschaftskraft in Fernost: Hightech, Fertigung & Schwellenland-Dynamik.',
        examples: ['Nikkei 225', 'Hang Seng', 'CSI 300', 'Nifty 50'],
        trending: '+1,2%',
      },
      {
        id: 'indizies-sector',
        name: 'Themen- & Sektorindizes',
        shortDesc: 'Gezielte Branchenindizes für Halbleiter, Clean Energy & Welt-ETFs.',
        examples: ['SOX Halbleiter', 'MSCI World', 'Stoxx 600 Banks'],
        trending: '+2,5%',
      },
    ],
  },
  {
    id: 'FOREX',
    name: 'Forex',
    color: '#E879F9', // Purple-Pink Accent
    description: 'Weltweiter Devisenmarkt mit 24h-Liquidität und Zinsarbitrage',
    subclasses: [
      {
        id: 'forex-majors',
        name: 'Majors (Hauptwährungspaare)',
        shortDesc: 'Höchste Marktliquidität gegen den US-Dollar mit engsten Spreads.',
        examples: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'],
        trending: '+0,2%',
      },
      {
        id: 'forex-crosses',
        name: 'Minors & Währungskreuze',
        shortDesc: 'Liquiditätspaare ohne US-Dollar-Beteiligung für relative Konjunkturwetten.',
        examples: ['EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'EUR/CHF'],
        trending: '+0,4%',
      },
      {
        id: 'forex-commodity',
        name: 'Rohstoffwährungen (Commdollars)',
        shortDesc: 'Währungen von Nationen mit massiven Rohstoffexporten.',
        examples: ['AUD/USD', 'USD/CAD', 'NZD/USD', 'USD/NOK'],
        trending: '+0,6%',
      },
      {
        id: 'forex-em',
        name: 'Emerging Markets FX',
        shortDesc: 'Höhere Zinsdifferenzen bei ausgeprägter Volatilität in Schwellenländern.',
        examples: ['USD/TRY', 'USD/BRL', 'USD/ZAR', 'USD/MXN'],
        trending: '-0,3%',
      },
    ],
  },
  {
    id: 'ROHSTOFFE',
    name: 'Rohstoffe',
    color: '#F9BF21', // AIF Gold
    description: 'Physische Primärgüter: Energie, Metalle & Agrarressourcen',
    subclasses: [
      {
        id: 'rohstoffe-precious',
        name: 'Edelmetalle & Wertspeicher',
        shortDesc: 'Historischer Krisenschutz gegen Währungsabwertung und Inflation.',
        examples: ['Gold (XAU)', 'Silber (XAG)', 'Platin', 'Palladium'],
        trending: '+1,1%',
      },
      {
        id: 'rohstoffe-energy',
        name: 'Energie & Fossile Brennstoffe',
        shortDesc: 'Treibstoff der Weltwirtschaft, bestimmt durch Geopolitik & OPEC+.',
        examples: ['Brent Rohöl', 'WTI Öl', 'Erdgas (Henry Hub)', 'Uran'],
        trending: '+1,6%',
      },
      {
        id: 'rohstoffe-industrial',
        name: 'Industriemetalle & Energiewende',
        shortDesc: 'Unverzichtbare Rohstoffe für E-Mobilität, Stromnetze & Bauwirtschaft.',
        examples: ['Kupfer', 'Lithium', 'Aluminium', 'Nickel'],
        trending: '+2,8%',
      },
      {
        id: 'rohstoffe-agrar',
        name: 'Agrarrohstoffe (Softs & Grains)',
        shortDesc: 'Lebensmittel- und Genussmittel-Futures unter Witterungseinflüssen.',
        examples: ['Kakao', 'Kaffee', 'Weizen', 'Sojabohnen'],
        trending: '+4,2%',
      },
    ],
  },
];

