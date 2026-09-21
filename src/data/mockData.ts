import { MarketAsset, CoreModule, KeyPillar } from '../types';

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
  {
    id: 'sp500',
    name: 'S&P 500',
    symbol: 'SPX',
    value: '5.283,42',
    change: '+1,24%',
    isPositive: true,
    iconType: 'trend',
    sparklinePath: 'M 0,35 Q 20,40 35,28 T 70,32 T 105,15 T 140,25 T 175,10 T 200,8',
    glowColor: 'rgba(34, 197, 94, 0.25)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    waveColor: '#22c55e',
    category: 'Index (USA)',
    high24h: '5.291,10',
    low24h: '5.240,20',
    volume24h: '$4.2B',
    aiScore: 88,
    aiRating: 'Starker Aufwärtstrend',
    description: 'Leitindex der 500 größten börsennotierten US-amerikanischen Unternehmen. Hohe Liquidität und starkes makroökonomisches Momentum.',
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC/USD',
    value: '67.284,31',
    change: '+2,31%',
    isPositive: true,
    iconType: 'bitcoin',
    sparklinePath: 'M 0,38 Q 25,42 45,30 T 80,35 T 115,22 T 150,28 T 175,12 T 200,5',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    waveColor: '#a855f7',
    category: 'Kryptowährung',
    high24h: '$68.120,00',
    low24h: '$65.890,50',
    volume24h: '$28.4B',
    aiScore: 82,
    aiRating: 'Bullische Akkumulation',
    description: 'Führendes dezentrales digitales Asset. On-Chain-Daten und institutionelle Zuflüsse stützen die aktuelle Konsolidierungsphase.',
  },
  {
    id: 'gold',
    name: 'Gold',
    symbol: 'XAU/USD',
    value: '2.348,91',
    change: '+0,52%',
    isPositive: true,
    iconType: 'gold',
    sparklinePath: 'M 0,36 Q 30,38 50,32 T 90,34 T 130,22 T 160,26 T 180,18 T 200,12',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    borderColor: 'rgba(234, 179, 8, 0.4)',
    waveColor: '#eab308',
    category: 'Edelmetall',
    high24h: '$2.355,40',
    low24h: '$2.338,10',
    volume24h: '$16.1B',
    aiScore: 76,
    aiRating: 'Stabiler Wertanker',
    description: 'Klassischer sicherer Hafen gegen Inflation und geopolitische Unsicherheiten mit robuster Zentralbank-Nachfrage.',
  },
  {
    id: 'eurusd',
    name: 'EUR/USD',
    symbol: 'EUR/USD',
    value: '1,0742',
    change: '+0,18%',
    isPositive: true,
    iconType: 'forex',
    sparklinePath: 'M 0,32 Q 25,35 55,30 T 95,32 T 135,24 T 165,22 T 185,15 T 200,8',
    glowColor: 'rgba(14, 165, 233, 0.25)',
    borderColor: 'rgba(14, 165, 233, 0.4)',
    waveColor: '#0ea5e9',
    category: 'Währungspaar',
    high24h: '1,0765',
    low24h: '1,0718',
    volume24h: '$410B',
    aiScore: 68,
    aiRating: 'Neutrale Spanne',
    description: 'Meistgehandeltes Währungspaar weltweit. Zinsentscheide von EZB und US-Notenbank Federal Reserve bestimmen die kurzfristige Volatilität.',
  },
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
