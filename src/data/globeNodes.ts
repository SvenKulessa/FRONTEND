/**
 * ============================================================================
 * CAPITAL AI — GLOBE NODES & CONTINENTS DATASET
 * ----------------------------------------------------------------------------
 * Globale Finanzzentren, Daten-Gateways, Koordinaten und Kontur-Punkte
 * für die modulare, abkoppelbare rotierende Hero-Erde.
 * ============================================================================
 */

export interface FinancialNode {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  role: 'gateway' | 'exchange' | 'macro';
  primaryFeed: string;
  exchange: string;
  timezone: string;
  utcOffset: number; // in hours
  openUtcHour: number; // e.g. 7 for 07:00 UTC
  closeUtcHour: number; // e.g. 16 for 16:00 UTC
  latencyMs: number;
  tier: 'Tier-1' | 'Tier-2';
  color: string;
  description: string;
  assets: string[];
}

export interface ArcConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label: string;
  latencyMs: number;
  protocol: string;
  color: string;
}

/**
 * Kern-Finanzzentren & Gateway-Knotenpunkte von Capital-AI
 */
export const FINANCIAL_NODES: FinancialNode[] = [
  {
    id: 'frankfurt',
    name: 'Frankfurt Gateway',
    city: 'Frankfurt am Main',
    country: 'Deutschland',
    lat: 50.1109,
    lon: 8.6821,
    role: 'exchange',
    primaryFeed: 'XETRA & Deutsche Börse Ingress',
    exchange: 'XETRA / FWB',
    timezone: 'Europe/Berlin',
    utcOffset: 2,
    openUtcHour: 7,
    closeUtcHour: 15.5,
    latencyMs: 12,
    tier: 'Tier-1',
    color: '#F5B014', // Brand Gold
    description: 'Europäisches Kern-Finanzzentrum, BaFin MaRisk Audit-Knoten und XETRA Realtime-Ingress.',
    assets: ['DAX 40', 'MDAX', 'Bund Futures', 'EUR/USD Spot'],
  },
  {
    id: 'london',
    name: 'London Gateway',
    city: 'London',
    country: 'UK',
    lat: 51.5074,
    lon: -0.1278,
    role: 'gateway',
    primaryFeed: 'Twelve Data EU & LSE Low-Latency Pipe',
    exchange: 'LSE / ICE Europe',
    timezone: 'Europe/London',
    utcOffset: 1,
    openUtcHour: 8,
    closeUtcHour: 16.5,
    latencyMs: 14,
    tier: 'Tier-1',
    color: '#38BDF8', // Sky Cyan
    description: 'Globales FX- und Derivate-Drehkreuz. Primärer Twelve Data API-Spiegel für Europa.',
    assets: ['FTSE 100', 'Brent Oil', 'GBP/USD', 'Gold Spot'],
  },
  {
    id: 'new_york',
    name: 'New York Gateway',
    city: 'New York',
    country: 'USA',
    lat: 40.7128,
    lon: -74.006,
    role: 'exchange',
    primaryFeed: 'Polygon.io & Massive Equities Feed',
    exchange: 'NYSE / NASDAQ',
    timezone: 'America/New_York',
    utcOffset: -4,
    openUtcHour: 13.5,
    closeUtcHour: 20,
    latencyMs: 28,
    tier: 'Tier-1',
    color: '#10B981', // Emerald
    description: 'Weltgrößter Aktien- und ETF-Handelsplatz. Sub-20ms Polygon.io SIP-Tape Erfassung.',
    assets: ['S&P 500', 'NASDAQ 100', 'Dow Jones', 'US 10Y Yield'],
  },
  {
    id: 'san_francisco',
    name: 'San Francisco Gateway',
    city: 'San Francisco',
    country: 'USA',
    lat: 37.7749,
    lon: -122.4194,
    role: 'gateway',
    primaryFeed: 'Kraken (Payward) Native WSS Hub',
    exchange: 'Kraken Core / CME Krypto',
    timezone: 'America/Los_Angeles',
    utcOffset: -7,
    openUtcHour: 0,
    closeUtcHour: 24, // 24/7
    latencyMs: 38,
    tier: 'Tier-1',
    color: '#8D26FF', // Purple
    description: 'Payward Kraken Hauptquartier. 24/7 Krypto Spot- und Futures Orderbuch-Pipeline.',
    assets: ['BTC/USD', 'ETH/EUR', 'SOL/USD', 'Kraken Depth Tape'],
  },
  {
    id: 'tokyo',
    name: 'Tokyo Gateway',
    city: 'Tokio',
    country: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    role: 'exchange',
    primaryFeed: 'TSE Apex & Binance Asia Edge',
    exchange: 'TSE (JPX)',
    timezone: 'Asia/Tokyo',
    utcOffset: 9,
    openUtcHour: 0,
    closeUtcHour: 6,
    latencyMs: 44,
    tier: 'Tier-1',
    color: '#F43F5E', // Rose
    description: 'Asiatisches Leitmarkt-Zentrum. Hochfrequenz-Erfassung des Nikkei 225 und JPY-Crosses.',
    assets: ['Nikkei 225', 'TOPIX', 'USD/JPY', 'JGB 10Y'],
  },
  {
    id: 'singapore',
    name: 'Singapore Gateway',
    city: 'Singapur',
    country: 'Singapur',
    lat: 1.3521,
    lon: 103.8198,
    role: 'gateway',
    primaryFeed: 'Binance WSS Cluster & SGX Direct',
    exchange: 'SGX / Binance Asia',
    timezone: 'Asia/Singapore',
    utcOffset: 8,
    openUtcHour: 1,
    closeUtcHour: 9,
    latencyMs: 42,
    tier: 'Tier-1',
    color: '#06B6D4', // Cyan
    description: 'Südostasiatischer Hub für Rohstoff-Futures, FX-Swaps und Binance Orderflow.',
    assets: ['SGX Iron Ore', 'Binance BTC Tape', 'USD/SGD', 'Straits Times'],
  },
  {
    id: 'hong_kong',
    name: 'Hong Kong Gateway',
    city: 'Hongkong',
    country: 'Hongkong SAR',
    lat: 22.3193,
    lon: 114.1694,
    role: 'exchange',
    primaryFeed: 'HKEX Direct & CNH Clearing',
    exchange: 'HKEX',
    timezone: 'Asia/Hong_Kong',
    utcOffset: 8,
    openUtcHour: 1.5,
    closeUtcHour: 8,
    latencyMs: 46,
    tier: 'Tier-2',
    color: '#EAB308', // Amber
    description: 'Gateway zu den chinesischen Festlandsmärkten über Stock Connect und Offshore-Yuan.',
    assets: ['Hang Seng', 'Tencent', 'Alibaba HK', 'USD/CNH'],
  },
  {
    id: 'zurich',
    name: 'Zurich Gateway',
    city: 'Zürich',
    country: 'Schweiz',
    lat: 47.3769,
    lon: 8.5417,
    role: 'exchange',
    primaryFeed: 'SIX Swiss Exchange & Krypto ETP Hub',
    exchange: 'SIX',
    timezone: 'Europe/Zurich',
    utcOffset: 2,
    openUtcHour: 7,
    closeUtcHour: 15.5,
    latencyMs: 14,
    tier: 'Tier-2',
    color: '#14B8A6', // Teal
    description: 'Privatbanken- und Krypto-ETP-Zentrum mit höchster regulatorischer Präzision.',
    assets: ['SMI 20', 'Nestlé', 'Novartis', 'EUR/CHF'],
  },
  {
    id: 'sydney',
    name: 'Sydney Gateway',
    city: 'Sydney',
    country: 'Australien',
    lat: -33.8688,
    lon: 151.2093,
    role: 'exchange',
    primaryFeed: 'ASX TradeMatch & Commodities',
    exchange: 'ASX',
    timezone: 'Australia/Sydney',
    utcOffset: 10,
    openUtcHour: 23,
    closeUtcHour: 6,
    latencyMs: 58,
    tier: 'Tier-2',
    color: '#F97316', // Orange
    description: 'Pazifisches Rohstoff- und Minen-Zentrum. Erste globale Markteröffnung der Handelswoche.',
    assets: ['ASX 200', 'BHP Billiton', 'AUD/USD', 'Iron Ore'],
  },
];

/**
 * Primäre Datenströme zwischen den Gateways (High-Speed Arcs)
 */
export const ARC_CONNECTIONS: ArcConnection[] = [
  {
    id: 'arc-sf-ny',
    fromNodeId: 'san_francisco',
    toNodeId: 'new_york',
    label: 'US Trans-Continental Pipe',
    latencyMs: 18,
    protocol: 'WSS / QUIC',
    color: '#8D26FF',
  },
  {
    id: 'arc-ny-london',
    fromNodeId: 'new_york',
    toNodeId: 'london',
    label: 'Trans-Atlantic Fiber (Hibernia)',
    latencyMs: 29,
    protocol: 'Subsea Dark Fiber',
    color: '#38BDF8',
  },
  {
    id: 'arc-london-frankfurt',
    fromNodeId: 'london',
    toNodeId: 'frankfurt',
    label: 'EU Core Financial Backbone',
    latencyMs: 8,
    protocol: 'Direct Cross-Connect',
    color: '#F5B014',
  },
  {
    id: 'arc-frankfurt-zurich',
    fromNodeId: 'frankfurt',
    toNodeId: 'zurich',
    label: 'Alpine High-Speed Link',
    latencyMs: 4,
    protocol: 'Laser DCI Link',
    color: '#14B8A6',
  },
  {
    id: 'arc-frankfurt-singapore',
    fromNodeId: 'frankfurt',
    toNodeId: 'singapore',
    label: 'Eurasia Gateway Route',
    latencyMs: 48,
    protocol: 'Encrypted MP-BGP',
    color: '#06B6D4',
  },
  {
    id: 'arc-singapore-tokyo',
    fromNodeId: 'singapore',
    toNodeId: 'tokyo',
    label: 'Asia-Pacific Financial Ring',
    latencyMs: 22,
    protocol: 'ASE Subsea Cable',
    color: '#F43F5E',
  },
  {
    id: 'arc-tokyo-sf',
    fromNodeId: 'tokyo',
    toNodeId: 'san_francisco',
    label: 'Trans-Pacific High-Speed Beam',
    latencyMs: 52,
    protocol: 'FASTER Subsea System',
    color: '#FBBF24',
  },
  {
    id: 'arc-singapore-sydney',
    fromNodeId: 'singapore',
    toNodeId: 'sydney',
    label: 'Indo-Pacific Route',
    latencyMs: 36,
    protocol: 'Indigo-West Cable',
    color: '#F97316',
  },
];

/**
 * Vektor-Polylinien zur Repräsentation der Erd-Kontinente auf der 3D-Kugel
 * (Breitengrad / Längengrad Koordinatenpaare [lat, lon])
 */
export const CONTINENT_OUTLINES: [number, number][][] = [
  // Europa & Skandinavien
  [
    [71, 28], [70, 20], [62, 5], [58, 6], [54, 9], [53, 5], [51, 2], [48, -5],
    [43, -9], [37, -9], [36, -5], [36, -2], [39, 0], [43, 3], [44, 8], [40, 18],
    [38, 24], [41, 29], [46, 31], [46, 38], [55, 38], [60, 30], [65, 30], [70, 32],
    [71, 28]
  ],
  // Britische Inseln
  [
    [58, -5], [55, -2], [50, 1], [50, -5], [54, -6], [58, -5]
  ],
  // Nordamerika
  [
    [70, -160], [72, -128], [68, -100], [60, -75], [55, -55], [47, -53], [43, -66],
    [32, -80], [25, -80], [20, -87], [16, -95], [23, -106], [32, -117], [38, -123],
    [48, -125], [58, -137], [60, -148], [65, -168], [70, -160]
  ],
  // Mittelamerika
  [
    [20, -87], [15, -83], [9, -78], [8, -82], [14, -92], [20, -87]
  ],
  // Südamerika
  [
    [12, -72], [10, -62], [5, -52], [-2, -44], [-8, -35], [-23, -42], [-35, -55],
    [-53, -68], [-55, -67], [-45, -75], [-30, -72], [-18, -71], [-5, -81], [3, -77],
    [12, -72]
  ],
  // Afrika
  [
    [37, 10], [32, 32], [28, 34], [12, 44], [12, 51], [5, 48], [-11, 40], [-26, 33],
    [-34, 18], [-33, 27], [-23, 14], [-12, 13], [4, 9], [5, 1], [5, -4], [15, -17],
    [22, -17], [35, -6], [36, 1], [37, 10]
  ],
  // Asien
  [
    [75, 100], [77, 140], [70, 178], [60, 163], [53, 141], [43, 132], [38, 120],
    [30, 122], [22, 114], [21, 107], [10, 104], [2, 104], [16, 97], [22, 90],
    [20, 85], [8, 77], [22, 70], [25, 62], [25, 57], [13, 44], [30, 32], [41, 29],
    [46, 38], [55, 60], [60, 75], [70, 75], [75, 100]
  ],
  // Japan
  [
    [44, 145], [42, 141], [35, 136], [31, 130], [34, 133], [38, 141], [44, 145]
  ],
  // Australien
  [
    [-12, 131], [-12, 136], [-17, 140], [-23, 151], [-33, 152], [-38, 147], [-38, 140],
    [-35, 118], [-26, 113], [-20, 119], [-15, 124], [-12, 131]
  ],
  // Neuseeland
  [
    [-35, 174], [-41, 175], [-46, 169], [-46, 167], [-41, 172], [-35, 174]
  ],
  // Grönland
  [
    [83, -30], [76, -18], [65, -38], [60, -44], [70, -54], [78, -69], [83, -30]
  ]
];

/**
 * Sphärischer Graticule-Gitter (Breitenkreise & Längenkreise)
 */
export const LATITUDE_LINES = [-60, -40, -20, 0, 20, 40, 60];
export const LONGITUDE_LINES = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];

/**
 * Prüft, ob ein Börsenplatz aktuell (bezogen auf UTC-Zeit) geöffnet ist
 */
export function isExchangeOpen(node: FinancialNode, testDate?: Date): boolean {
  const d = testDate || new Date();
  const utcHours = d.getUTCHours() + d.getUTCMinutes() / 60;
  const utcDay = d.getUTCDay(); // 0 = So, 6 = Sa

  // Krypto ist 24/7
  if (node.openUtcHour === 0 && node.closeUtcHour === 24) {
    return true;
  }

  // Wochenende: Sa (6) & So (0) geschlossen
  if (utcDay === 0 || utcDay === 6) {
    return false;
  }

  if (node.openUtcHour > node.closeUtcHour) {
    // Über Mitternacht (z.B. Sydney)
    return utcHours >= node.openUtcHour || utcHours <= node.closeUtcHour;
  }

  return utcHours >= node.openUtcHour && utcHours <= node.closeUtcHour;
}
