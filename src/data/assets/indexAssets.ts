import { MarketAsset } from '../../types';

interface RawIndexItem {
  id: string;
  name: string;
  symbol: string;
  val: string;
  chg: string;
  up: boolean;
  category: string;
  high: string;
  low: string;
  vol: string;
  score: number;
  rating: string;
  desc: string;
}

export const RAW_INDEX_ASSETS: RawIndexItem[] = [
  // ========================================================
  // 1-15: US Leitindizes & Benchmarks
  // ========================================================
  { id: 'sp500', name: 'S&P 500', symbol: 'SPX', val: '5.283,42', chg: '+1,24%', up: true, category: 'US Leitindex', high: '5.291,10', low: '5.240,20', vol: '$4.2B', score: 88, rating: 'Starker Aufwärtstrend', desc: 'Leitindex der 500 größten börsennotierten US-amerikanischen Unternehmen.' },
  { id: 'nasdaq100', name: 'Nasdaq 100', symbol: 'NDX', val: '18.640,50', chg: '+1,65%', up: true, category: 'US Tech Index', high: '18.690,00', low: '18.480,20', vol: '$6.5B', score: 92, rating: 'KI-Sektor Rallye', desc: 'Index der führenden globalen Tech-Schwergewichte an der Nasdaq.' },
  { id: 'nasdaqcomp', name: 'Nasdaq Composite', symbol: 'COMP', val: '17.720,80', chg: '+1,52%', up: true, category: 'US Tech Index', high: '17.770,00', low: '17.580,00', vol: '$7.8B', score: 90, rating: 'Breite Tech-Dynamik', desc: 'Über 3.000 an der Technologiebörse Nasdaq gelistete Titel.' },
  { id: 'dowjones', name: 'Dow Jones Industrial', symbol: 'DJI', val: '39.842,10', chg: '+0,48%', up: true, category: 'US Bluechips', high: '39.920,00', low: '39.750,00', vol: '$3.1B', score: 83, rating: 'Solide Dividendenbasis', desc: 'Die 30 traditionsreichsten Industrie- und Standardwerte der USA.' },
  { id: 'russell2000', name: 'Russell 2000', symbol: 'RUT', val: '2.085,30', chg: '+1,82%', up: true, category: 'US Small Caps', high: '2.095,00', low: '2.062,00', vol: '$2.4B', score: 84, rating: 'Zinssenkungs-Hebel', desc: 'US-Small-Cap-Leitindex mit hohem Zins- und Binnenkonjunkturhebel.' },
  { id: 'russell1000', name: 'Russell 1000', symbol: 'RUI', val: '2.840,15', chg: '+1,18%', up: true, category: 'US Large Caps', high: '2.852,00', low: '2.822,00', vol: '$3.8B', score: 87, rating: 'Breite Marktabdeckung', desc: 'Repräsentiert die 1.000 höchstkapitalisierten Unternehmen der USA.' },
  { id: 'spmidcap', name: 'S&P MidCap 400', symbol: 'MID', val: '2.945,80', chg: '+1,35%', up: true, category: 'US Mid Caps', high: '2.960,00', low: '2.920,00', vol: '$1.8B', score: 82, rating: 'Wachstumssegmente', desc: 'US-Mittelstandsaktien mit solider operativer Profitabilität.' },
  { id: 'spsmallcap', name: 'S&P SmallCap 600', symbol: 'SML', val: '1.312,40', chg: '+1,60%', up: true, score: 81, rating: 'Nebenwerte Dynamik', category: 'US Small Caps', high: '1.320,00', low: '1.298,00', vol: '$1.2B', desc: 'Streng profitable US-Kleinunternehmen mit klaren Bilanzanforderungen.' },
  { id: 'nysecomp', name: 'NYSE Composite', symbol: 'NYA', val: '18.150,20', chg: '+0,65%', up: true, category: 'US All Share', high: '18.210,00', low: '18.080,00', vol: '$4.5B', score: 80, rating: 'Klassische Substanz', desc: 'Alle an der traditionsreichen New York Stock Exchange gehandelten Aktien.' },
  { id: 'wilshire5000', name: 'Wilshire 5000 Total Market', symbol: 'W5000', val: '53.120,00', chg: '+1,22%', up: true, category: 'US Gesamtmarkt', high: '53.250,00', low: '52.700,00', vol: '$8.2B', score: 86, rating: 'Volkswirtschaftliches Barometer', desc: 'Umfassendstes Barometer für den gesamten US-amerikanischen Aktienmarkt.' },
  { id: 'vix', name: 'CBOE Volatilitätsindex', symbol: 'VIX', val: '12,85', chg: '-3,40%', up: false, category: 'Volatilität (Angstbarometer)', high: '13,50', low: '12,70', vol: '$1.5B', score: 85, rating: 'Geringe Marktunruhe', desc: 'Misst die implizite 30-Tage-Volatilität der Optionen auf den S&P 500.' },
  { id: 'dxy', name: 'US Dollar Index', symbol: 'DXY', val: '104,85', chg: '+0,15%', up: true, category: 'Währungsindex', high: '105,10', low: '104,60', vol: '$18.0B', score: 79, rating: 'Dollar-Stärke', desc: 'Wert des US-Dollars gegenüber einem Korb aus sechs führenden Weltwährungen.' },
  { id: 'sox', name: 'PHLX Semiconductor Index', symbol: 'SOX', val: '5.480,20', chg: '+2,45%', up: true, category: 'Halbleiter & KI Hardware', high: '5.520,00', low: '5.390,00', vol: '$8.4B', score: 96, rating: 'Globales KI-Herzstück', desc: 'Der weltweite Leitindex für Chiphersteller und Halbleiter-Ausrüster.' },
  { id: 'djtransport', name: 'Dow Jones Transportation', symbol: 'DJT', val: '15.420,60', chg: '+0,85%', up: true, category: 'US Transport & Logistik', high: '15.490,00', low: '15.310,00', vol: '$1.1B', score: 78, rating: 'Dow-Theorie Konjunkturtest', desc: 'Fracht-, Eisenbahn- und Fluggesellschaften als Frühindikator der Konjunktur.' },
  { id: 'djutility', name: 'Dow Jones Utilities', symbol: 'DJU', val: '945,80', chg: '+0,40%', up: true, category: 'US Versorger & Energie', high: '952,00', low: '940,00', vol: '$950M', score: 76, rating: 'Defensive Dividenden', desc: 'Amerikanische Strom-, Gas- und Wasserversorger mit regulierten Erträgen.' },

  // ========================================================
  // 16-30: US Sektor- & Themenindizes (Select Sector SPDRs)
  // ========================================================
  { id: 'xlk', name: 'Technology Select Sector', symbol: 'XLK', val: '228,50', chg: '+2,10%', up: true, category: 'Sektorindex Tech', high: '230,10', low: '225,80', vol: '$3.2B', score: 94, rating: 'Software & Chips Lead', desc: 'S&P 500 Technologietitel inklusive Apple, Microsoft und Nvidia.' },
  { id: 'xlf', name: 'Financial Select Sector', symbol: 'XLF', val: '41,80', chg: '+0,95%', up: true, category: 'Sektorindex Finanzen', high: '42,10', low: '41,40', vol: '$2.1B', score: 85, rating: 'Robuste Kreditqualität', desc: 'US-Großbanken, Versicherer und Investmentgesellschaften.' },
  { id: 'xlv', name: 'Health Care Select Sector', symbol: 'XLV', val: '146,20', chg: '+0,70%', up: true, category: 'Sektorindex Gesundheit', high: '147,30', low: '145,10', vol: '$1.9B', score: 86, rating: 'Defensives Pharmawachstum', desc: 'Pharmaunternehmen, Medizintechnik und Krankenversicherer.' },
  { id: 'xle', name: 'Energy Select Sector', symbol: 'XLE', val: '89,40', chg: '+1,15%', up: true, category: 'Sektorindex Energie', high: '90,20', low: '88,60', vol: '$2.4B', score: 81, rating: 'Freie Cashflows & Dividenden', desc: 'Integrierte Ölkonzerne und Raffinerien wie ExxonMobil und Chevron.' },
  { id: 'xli', name: 'Industrial Select Sector', symbol: 'XLI', val: '124,60', chg: '+1,05%', up: true, category: 'Sektorindex Industrie', high: '125,50', low: '123,80', vol: '$1.6B', score: 84, rating: 'US-Infrastrukturboom', desc: 'Maschinenbau, Rüstung und Luftfahrtkonzerne wie Caterpillar und GE.' },
  { id: 'xly', name: 'Consumer Discretionary', symbol: 'XLY', val: '182,50', chg: '+1,40%', up: true, category: 'Sektorindex Nicht-Basiskonsum', high: '184,00', low: '180,50', vol: '$2.2B', score: 83, rating: 'Konsumausgaben stabil', desc: 'Zyklische Konsumgüter, E-Commerce und Automotive (Amazon, Tesla).' },
  { id: 'xlp', name: 'Consumer Staples Select', symbol: 'XLP', val: '78,40', chg: '+0,30%', up: true, category: 'Sektorindex Basiskonsum', high: '78,90', low: '78,10', vol: '$1.4B', score: 80, rating: 'Kaufkraft-Resilienz', desc: 'Nahrungsmittel, Haushaltswaren und Supermärkte (Procter & Gamble, Walmart).' },
  { id: 'xlu', name: 'Utilities Select Sector', symbol: 'XLU', val: '69,80', chg: '+0,55%', up: true, category: 'Sektorindex Versorger', high: '70,30', low: '69,20', vol: '$1.1B', score: 82, rating: 'KI-Rechenzentren Stromhunger', desc: 'Stromversorger profitieren von explodierendem Energiebedarf für KI-Zentren.' },
  { id: 'xlre', name: 'Real Estate Select Sector', symbol: 'XLRE', val: '39,20', chg: '+1,25%', up: true, category: 'Sektorindex Immobilien', high: '39,60', low: '38,80', vol: '$980M', score: 79, rating: 'Zinssensitivität positiv', desc: 'REITs, Funkmasten und Rechenzentrumsbetreiber (Prologis, Equinix).' },
  { id: 'xlb', name: 'Materials Select Sector', symbol: 'XLB', val: '89,60', chg: '+0,85%', up: true, category: 'Sektorindex Grundstoffe', high: '90,40', low: '88,90', vol: '$850M', score: 77, rating: 'Chemie & Minen Erholung', desc: 'Gase, Chemie- und Minenunternehmen (Linde, Sherwin-Williams).' },
  { id: 'xlc', name: 'Communication Services', symbol: 'XLC', val: '84,50', chg: '+1,80%', up: true, category: 'Sektorindex Kommunikation', high: '85,20', low: '83,40', vol: '$1.8B', score: 91, rating: 'Digitale Werbung & Social', desc: 'Medien- und Digitalkonzerne (Alphabet, Meta Platforms, Netflix).' },
  { id: 'xbi', name: 'S&P Biotech Index', symbol: 'XBI', val: '94,80', chg: '+2,60%', up: true, category: 'Biotech Index', high: '96,20', low: '92,90', vol: '$1.5B', score: 88, rating: 'M&A Übernahmewelle', desc: 'Gleichgewichteter US-Biotechnologie-Index mit hohem Innovationsgrad.' },
  { id: 'igv', name: 'Expanded Tech-Software', symbol: 'IGV', val: '435,20', chg: '+1,90%', up: true, category: 'Software & Cloud SaaS', high: '439,00', low: '428,50', vol: '$1.7B', score: 89, rating: 'Enterprise KI-Assistenten', desc: 'Enterprise-Software und Cloud-Giganten wie Microsoft, Salesforce, Adobe.' },
  { id: 'hack', name: 'Cybersecurity Index', symbol: 'HACK', val: '64,20', chg: '+1,75%', up: true, category: 'Cybersecurity', high: '65,00', low: '63,40', vol: '$820M', score: 90, rating: 'Strukturelle Sicherheitsausgaben', desc: 'Globale IT-Sicherheitsanbieter im Kampf gegen digitale Bedrohungen.' },
  { id: 'smh', name: 'VanEck Semiconductor Index', symbol: 'SMH', val: '264,80', chg: '+2,80%', up: true, category: 'Halbleiter Schwergewichte', high: '267,50', low: '259,00', vol: '$4.1B', score: 95, rating: 'Top 25 Chip-Giganten', desc: 'Führende globale Halbleiterunternehmen mit hoher Konzentration auf TSMC und Nvidia.' },

  // ========================================================
  // 31-45: Deutschland & DACH-Region
  // ========================================================
  { id: 'dax40', name: 'DAX 40', symbol: 'DAX', val: '18.492,15', chg: '+0,74%', up: true, category: 'Index (Deutschland)', high: '18.520,30', low: '18.390,10', vol: '€3.8B', score: 81, rating: 'Solider Aufwärtstrend', desc: 'Deutscher Leitindex mit starker Industrie-, Export- und Softwaregewichtung.' },
  { id: 'mdax', name: 'MDAX', symbol: 'MDAX', val: '25.840,50', chg: '+0,92%', up: true, category: 'Index (Deutschland Mid Caps)', high: '25.960,00', low: '25.680,00', vol: '€920M', score: 79, rating: 'Mittelstands-Erholung', desc: 'Die 50 mittelgroßen deutschen Unternehmen hinter dem DAX.' },
  { id: 'sdax', name: 'SDAX', symbol: 'SDAX', val: '14.520,30', chg: '+1,10%', up: true, category: 'Index (Deutschland Small Caps)', high: '14.590,00', low: '14.410,00', vol: '€480M', score: 78, rating: 'Nebenwerte Bewertungschance', desc: '70 deutsche Small Caps mit starker Spezialisierung und Hidden Champions.' },
  { id: 'tecdax', name: 'TecDAX', symbol: 'TECDAX', val: '3.410,80', chg: '+1,35%', up: true, category: 'Index (Deutschland Tech)', high: '3.435,00', low: '3.380,00', vol: '€750M', score: 83, rating: 'Tech & Erneuerbare Energien', desc: 'Die 30 führenden Technologiewerte des deutschen Aktienmarktes.' },
  { id: 'cdax', name: 'CDAX Total Return', symbol: 'CDAX', val: '1.580,20', chg: '+0,78%', up: true, category: 'Index (Deutschland Gesamt)', high: '1.588,00', low: '1.572,00', vol: '€4.5B', score: 80, rating: 'Breiter deutscher Markt', desc: 'Spiegelt den gesamten Prime- und General-Standard der Frankfurter Börse wider.' },
  { id: 'divdax', name: 'DivDAX', symbol: 'DIVDAX', val: '412,50', chg: '+0,45%', up: true, category: 'Index (Dividenden Deutschland)', high: '414,20', low: '410,80', vol: '€890M', score: 82, rating: 'Hohe Ausschüttungsrenditen', desc: 'Die 15 DAX-Unternehmen mit den höchsten Dividendenrenditen.' },
  { id: 'smi', name: 'Swiss Market Index (SMI)', symbol: 'SMI', val: '12.180,20', chg: '+0,42%', up: true, category: 'Index (Schweiz Leitindex)', high: '12.220,00', low: '12.140,00', vol: 'CHF 1.8B', score: 82, rating: 'Defensiver Qualitätsanker', desc: 'Zürichs Leitindex mit globalen Ikonen wie Nestlé, Novartis und Roche.' },
  { id: 'smim', name: 'SMI Mid (SMIM)', symbol: 'SMIM', val: '3.120,40', chg: '+0,65%', up: true, category: 'Index (Schweiz Mid Caps)', high: '3.140,00', low: '3.105,00', vol: 'CHF 420M', score: 81, rating: 'Schweizer Präzisionsfirmen', desc: 'Die 30 kapitalstärksten Mid-Cap-Titel des Schweizer Aktienmarktes.' },
  { id: 'spi', name: 'Swiss Performance Index (SPI)', symbol: 'SPI', val: '16.140,00', chg: '+0,44%', up: true, category: 'Index (Schweiz Gesamtmarkt)', high: '16.180,00', low: '16.090,00', vol: 'CHF 2.2B', score: 83, rating: 'Gesamte Schweizer Wirtschaft', desc: 'Nahezu alle an der SIX Swiss Exchange kotierten Aktiengesellschaften.' },
  { id: 'atx', name: 'Austrian Traded Index (ATX)', symbol: 'ATX', val: '3.640,50', chg: '+0,55%', up: true, category: 'Index (Österreich Leitindex)', high: '3.660,00', low: '3.625,00', vol: '€280M', score: 77, rating: 'Banken & CEE Engagement', desc: 'Wiener Leitindex geprägt von Erste Group, OMV und Verbund.' },
  { id: 'atxprime', name: 'ATX Prime', symbol: 'ATXPR', val: '1.820,10', chg: '+0,58%', up: true, category: 'Index (Österreich Gesamt)', high: '1.830,00', low: '1.812,00', vol: '€340M', score: 76, rating: 'Breiter Wiener Markt', desc: 'Enthält alle Titel des Prime-Market-Segments der Wiener Börse.' },
  { id: 'daxsubchemicals', name: 'DAX Sektor Chemie', symbol: 'CXPB', val: '485,20', chg: '+0,60%', up: true, category: 'Sektor Deutschland', high: '489,00', low: '482,00', vol: '€610M', score: 74, rating: 'Zyklische Talsohle durchschritten', desc: 'Deutsche Chemieunternehmen wie BASF, Covestro, Evonik und Wacker.' },
  { id: 'daxsubauto', name: 'DAX Sektor Automobile', symbol: 'CXPA', val: '248,50', chg: '+0,35%', up: true, category: 'Sektor Deutschland', high: '251,00', low: '246,80', vol: '€820M', score: 72, rating: 'Starke Free Cash Flows', desc: 'Premiumhersteller BMW, Mercedes-Benz, Porsche und Volkswagen.' },
  { id: 'daxsubpharma', name: 'DAX Sektor Pharma & Health', symbol: 'CXPH', val: '612,40', chg: '+0,80%', up: true, category: 'Sektor Deutschland', high: '618,00', low: '608,00', vol: '€540M', score: 80, rating: 'Gesundheits-Innovation', desc: 'Bayer, Fresenius, Qiagen, Sartorius und Merck KGaA.' },
  { id: 'daxsubbanken', name: 'DAX Sektor Banken', symbol: 'CXPBK', val: '142,60', chg: '+1,15%', up: true, category: 'Sektor Deutschland', high: '144,20', low: '141,10', vol: '€490M', score: 81, rating: 'Zinsmargen profitabel', desc: 'Deutsche Bank und Commerzbank im Zinsumfeld der EZB.' },

  // ========================================================
  // 46-65: Europa Benchmarks & Länder
  // ========================================================
  { id: 'eurostoxx50', name: 'Euro Stoxx 50', symbol: 'SX5E', val: '5.035,80', chg: '+0,62%', up: true, category: 'Index (Eurozone)', high: '5.050,00', low: '5.010,00', vol: '€4.1B', score: 80, rating: 'Europäische Champions', desc: 'Die 50 kapitalstärksten multinationalen Konzerne der Eurozone.' },
  { id: 'stoxx600', name: 'Stoxx Europe 600', symbol: 'SXXP', val: '522,40', chg: '+0,55%', up: true, category: 'Index (Gesamteuropa)', high: '524,10', low: '520,20', vol: '€7.5B', score: 81, rating: 'Breite Diversifikation', desc: 'Das maßgebliche Benchmark für 600 europäische Unternehmen aus 17 Ländern.' },
  { id: 'cac40', name: 'CAC 40', symbol: 'PX1', val: '7.620,40', chg: '+0,55%', up: true, category: 'Index (Frankreich)', high: '7.655,00', low: '7.590,00', vol: '€2.9B', score: 78, rating: 'Luxus & Energie Dynamik', desc: 'Pariser Leitindex geprägt von LVMH, Hermès, Schneider Electric und TotalEnergies.' },
  { id: 'ftse100', name: 'FTSE 100', symbol: 'UKX', val: '8.245,60', chg: '+0,38%', up: true, category: 'Index (UK Leitindex)', high: '8.270,00', low: '8.210,00', vol: '£2.4B', score: 77, rating: 'Rohstoff- und Bankenstärke', desc: 'Londoner Leitindex mit hoher Rohstoff-, Pharma- und Finanzgewichtung.' },
  { id: 'ftse250', name: 'FTSE 250', symbol: 'MCX', val: '20.640,20', chg: '+0,82%', up: true, category: 'Index (UK Mid Caps)', high: '20.750,00', low: '20.510,00', vol: '£950M', score: 79, rating: 'UK Binnenwirtschaft', desc: 'Spiegelt die britische Binnenkonjunktur deutlicher wider als der FTSE 100.' },
  { id: 'ibex35', name: 'IBEX 35', symbol: 'IBEX', val: '11.140,80', chg: '+0,85%', up: true, category: 'Index (Spanien)', high: '11.190,00', low: '11.080,00', vol: '€1.4B', score: 82, rating: 'Spanischer Bankenboom', desc: 'Madrider Leitindex getragen von Santander, BBVA und Iberdrola.' },
  { id: 'ftsemib', name: 'FTSE MIB', symbol: 'FTSEMIB', val: '34.520,00', chg: '+0,95%', up: true, category: 'Index (Italien)', high: '34.680,00', low: '34.310,00', vol: '€1.9B', score: 83, rating: 'Italienische Rekordrallye', desc: 'Mailand Leitindex mit UniCredit, Intesa Sanpaolo, Ferrari und Enel.' },
  { id: 'aex', name: 'AEX Index', symbol: 'AEX', val: '924,60', chg: '+1,15%', up: true, category: 'Index (Niederlande)', high: '928,50', low: '918,20', vol: '€2.1B', score: 89, rating: 'Halbleiter-Dominanz ASML', desc: 'Amsterdamer Leitindex mit hohem Tech-Gewicht durch ASML, ASM und Adyen.' },
  { id: 'bel20', name: 'BEL 20', symbol: 'BEL20', val: '3.890,40', chg: '+0,40%', up: true, category: 'Index (Belgien)', high: '3.910,00', low: '3.875,00', vol: '€380M', score: 76, rating: 'Brauereien & Pharma', desc: 'Brüsseler Leitindex angeführt von AB InBev, KBC Group und UCB.' },
  { id: 'omxs30', name: 'OMX Stockholm 30', symbol: 'OMXS30', val: '2.580,30', chg: '+0,72%', up: true, category: 'Index (Schweden)', high: '2.595,00', low: '2.568,00', vol: 'SEK 14B', score: 81, rating: 'Skandinavische Industrie', desc: 'Die 30 liquidesten Aktien Stockholms: Atlas Copco, Volvo, Investor AB.' },
  { id: 'omxh25', name: 'OMX Helsinki 25', symbol: 'OMXH25', val: '4.510,80', chg: '+0,50%', up: true, category: 'Index (Finnland)', high: '4.535,00', low: '4.490,00', vol: '€290M', score: 75, rating: 'Maschinenbau & Telco', desc: 'Helsinkis führende Werte wie Nokia, Sampo, Neste und Kone.' },
  { id: 'omxc25', name: 'OMX Kopenhagen 25', symbol: 'OMXC25', val: '1.985,40', chg: '+1,45%', up: true, category: 'Index (Dänemark)', high: '1.998,00', low: '1.960,00', vol: 'DKK 8.5B', score: 92, rating: 'Novo Nordisk Megatrend', desc: 'Stark getrieben vom weltweiten Erfolg des Adipositas-Giganten Novo Nordisk.' },
  { id: 'obx', name: 'OBX Total Return', symbol: 'OBX', val: '1.340,60', chg: '+0,65%', up: true, category: 'Index (Norwegen)', high: '1.348,00', low: '1.332,00', vol: 'NOK 6.2B', score: 80, rating: 'Energie & Lachsindustrie', desc: 'Osloer Leitindex geprägt von Equinor, DNB Bank und Mowi.' },
  { id: 'psi20', name: 'PSI 20', symbol: 'PSI20', val: '6.580,20', chg: '+0,30%', up: true, category: 'Index (Portugal)', high: '6.610,00', low: '6.550,00', vol: '€180M', score: 75, rating: 'Erneuerbare Energien & Handel', desc: 'Lissabons Leitindex angeführt von EDP Renováveis und Jerónimo Martins.' },
  { id: 'wig20', name: 'WIG 20', symbol: 'WIG20', val: '2.450,80', chg: '+0,88%', up: true, category: 'Index (Polen)', high: '2.475,00', low: '2.430,00', vol: 'PLN 1.4B', score: 82, rating: 'Osteuropas Wachstumsmotor', desc: 'Warschauer Leitindex mit PKO Bank Polski, Orlen und Dino Polska.' },
  { id: 'bux', name: 'BUX Index', symbol: 'BUX', val: '68.450,00', chg: '+0,45%', up: true, category: 'Index (Ungarn)', high: '68.800,00', low: '68.100,00', vol: 'HUF 12B', score: 76, rating: 'OTP Bank & Richter Gedeon', desc: 'Budapester Börsenbarometer der wichtigsten ungarischen Bluechips.' },
  { id: 'px', name: 'PX Index', symbol: 'PX', val: '1.540,20', chg: '+0,35%', up: true, category: 'Index (Tschechien)', high: '1.548,00', low: '1.534,00', vol: 'CZK 450M', score: 75, rating: 'Energieversorger CEZ Fokus', desc: 'Prager Leitindex mit starker Gewichtung des Energiekonzerns CEZ.' },
  { id: 'iseq20', name: 'ISEQ 20', symbol: 'ISEQ', val: '9.420,00', chg: '+0,70%', up: true, category: 'Index (Irland)', high: '9.480,00', low: '9.370,00', vol: '€320M', score: 80, rating: 'Baustoffe & Luftfahrt', desc: 'Dubliner Leitindex mit CRH, Ryanair und Bank of Ireland.' },
  { id: 'stoxxbanks', name: 'Stoxx Europe 600 Banks', symbol: 'SX7P', val: '198,40', chg: '+1,20%', up: true, category: 'Sektorindex Europa', high: '200,10', low: '196,50', vol: '€2.8B', score: 86, rating: 'Bankensektor Outperformance', desc: 'Europäische Großbanken profitieren von strukturell höheren Zinsen.' },
  { id: 'stoxxtech', name: 'Stoxx Europe 600 Technology', symbol: 'SX8P', val: '840,50', chg: '+1,80%', up: true, category: 'Sektorindex Europa', high: '848,00', low: '828,00', vol: '€2.2B', score: 89, rating: 'ASML & SAP Treiber', desc: 'Europas Software-, Halbleiter- und IT-Elite.' },

  // ========================================================
  // 66-80: Asien & Pazifik
  // ========================================================
  { id: 'nikkei225', name: 'Nikkei 225', symbol: 'N225', val: '38.720,50', chg: '+1,15%', up: true, category: 'Index (Japan Leitindex)', high: '38.900,00', low: '38.450,00', vol: '¥3.2T', score: 87, rating: 'Tokioter Rekordtrend', desc: 'Japanischer Leitindex getrieben von Chipausrüstern, Exportfirmen und BoJ-Politik.' },
  { id: 'topix', name: 'TOPIX Index', symbol: 'TPX', val: '2.740,80', chg: '+0,90%', up: true, category: 'Index (Japan Breit)', high: '2.755,00', low: '2.725,00', vol: '¥3.8T', score: 86, rating: 'Corporate Governance Reform', desc: 'Gewichtet nach Marktkapitalisierung, umfasst alle Titel des Tokyo Prime Market.' },
  { id: 'hangseng', name: 'Hang Seng Index', symbol: 'HSI', val: '18.120,80', chg: '-0,45%', up: false, category: 'Index (Hongkong)', high: '18.350,00', low: '18.050,00', vol: 'HK$98B', score: 71, rating: 'China Tech Erholung', desc: 'Hongkongs traditionsreicher Leitindex mit Tencent, Alibaba, AIA und Meituan.' },
  { id: 'hscei', name: 'Hang Seng China Enterprises', symbol: 'HSCEI', val: '6.450,20', chg: '-0,30%', up: false, category: 'Index (Hongkong H-Shares)', high: '6.520,00', low: '6.410,00', vol: 'HK$52B', score: 72, rating: 'Festlandchinesische Staatsriesen', desc: 'Chinesische Staatskonzerne und Finanzriesen gelistet an der Börse Hongkong.' },
  { id: 'hstech', name: 'Hang Seng TECH Index', symbol: 'HSTECH', val: '3.780,50', chg: '+0,85%', up: true, category: 'Index (China Tech)', high: '3.820,00', low: '3.740,00', vol: 'HK$44B', score: 78, rating: 'KI & Cloud Rebound', desc: 'Die 30 führenden Tech-Giganten Chinas an der Börse Hongkong.' },
  { id: 'csi300', name: 'CSI 300', symbol: '000300', val: '3.540,20', chg: '+0,28%', up: true, category: 'Index (China Festland)', high: '3.560,00', low: '3.525,00', vol: '¥240B', score: 73, rating: 'Fiskalstimulus Stütze', desc: 'Die 300 größten Festlandaktien an den Börsen Shanghai und Shenzhen.' },
  { id: 'shanghaicomp', name: 'Shanghai Composite', symbol: 'SSEC', val: '3.020,40', chg: '+0,15%', up: true, category: 'Index (China Festland)', high: '3.035,00', low: '3.010,00', vol: '¥310B', score: 72, rating: 'Staatliche Stützungskäufe', desc: 'Spiegelt die Gesamtheit aller A- und B-Aktien der Börse Shanghai wider.' },
  { id: 'shenzhencomp', name: 'Shenzhen Component', symbol: 'SZI', val: '9.310,60', chg: '+0,40%', up: true, category: 'Index (China Tech & Private)', high: '9.360,00', low: '9.270,00', vol: '¥380B', score: 74, rating: 'Private Wachstumsfirmen', desc: 'Schwerpunkt auf innovativen Privatunternehmen, Clean Tech und Batterien.' },
  { id: 'kospi', name: 'KOSPI 200', symbol: 'KPI200', val: '385,20', chg: '+1,25%', up: true, category: 'Index (Südkorea)', high: '388,00', low: '382,10', vol: '₩9.2T', score: 85, rating: 'Halbleiter & HBM Boom', desc: 'Die 200 führenden südkoreanischen Werte um Samsung Electronics und SK Hynix.' },
  { id: 'kosdaq', name: 'KOSDAQ Composite', symbol: 'KOSDAQ', val: '855,40', chg: '+0,95%', up: true, category: 'Index (Südkorea Tech)', high: '861,00', low: '849,00', vol: '₩6.4T', score: 80, rating: 'Sekundärbatterien & Biotech', desc: 'Wachstumsbörse Südkoreas für Batteriechemie, Gaming und K-Pop.' },
  { id: 'taiex', name: 'Taiwan TAIEX', symbol: 'TWSE', val: '23.210,00', chg: '+1,75%', up: true, category: 'Index (Taiwan)', high: '23.300,00', low: '22.980,00', vol: 'NT$ 480B', score: 94, rating: 'TSMC Allzeithoch-Rallye', desc: 'Taiwanischer Leitindex, maßgeblich dominiert vom Weltmarktführer TSMC.' },
  { id: 'nifty50', name: 'Nifty 50', symbol: 'NIFTY', val: '23.510,40', chg: '+1,02%', up: true, category: 'Index (Indien Leitindex)', high: '23.580,00', low: '23.390,00', vol: '₹310B', score: 91, rating: 'Indischer Megazyklus', desc: 'Indischer Leitindex an der NSE, getrieben von starkem Wirtschaftswachstum.' },
  { id: 'sensex', name: 'BSE Sensex 30', symbol: 'SENSEX', val: '77.340,00', chg: '+0,98%', up: true, category: 'Index (Indien Bombay)', high: '77.520,00', low: '76.980,00', vol: '₹220B', score: 90, rating: 'Historische Höchststände', desc: 'Ältester Aktienindex Indiens an der Bombay Stock Exchange.' },
  { id: 'asx200', name: 'S&P/ASX 200', symbol: 'AS51', val: '7.820,50', chg: '+0,60%', up: true, category: 'Index (Australien)', high: '7.850,00', low: '7.790,00', vol: 'A$ 5.8B', score: 81, rating: 'Rohstoffgiganten & Banken', desc: 'Australiens Leitindex geprägt von BHP Group, Rio Tinto und Commonwealth Bank.' },
  { id: 'nz50', name: 'S&P/NZX 50', symbol: 'NZ50', val: '11.840,00', chg: '+0,45%', up: true, category: 'Index (Neuseeland)', high: '11.890,00', low: '11.800,00', vol: 'NZ$ 210M', score: 77, rating: 'Stabile Dividendentitel', desc: 'Die 50 größten börsennotierten Unternehmen Neuseelands.' },

  // ========================================================
  // 81-90: Südamerika & Weitere Schwellenländer
  // ========================================================
  { id: 'tsx', name: 'S&P/TSX Composite', symbol: 'TSX', val: '21.840,20', chg: '+0,72%', up: true, category: 'Index (Kanada Leitindex)', high: '21.910,00', low: '21.750,00', vol: 'C$ 4.2B', score: 83, rating: 'Goldminen & Ölkonzerne', desc: 'Kanadas Leitindex an der Börse Toronto mit hoher Rohstoffgewichtung.' },
  { id: 'tsx60', name: 'S&P/TSX 60', symbol: 'TX60', val: '1.310,50', chg: '+0,68%', up: true, category: 'Index (Kanada Large Caps)', high: '1.316,00', low: '1.305,00', vol: 'C$ 3.1B', score: 82, rating: 'Kanadische Bluechips', desc: 'Die 60 führenden Konzerne Kanadas (RBC, Enbridge, Shopify).' },
  { id: 'ibovespa', name: 'Ibovespa', symbol: 'IBOV', val: '122.450,00', chg: '+0,85%', up: true, category: 'Index (Brasilien)', high: '123.100,00', low: '121.800,00', vol: 'R$ 18B', score: 79, rating: 'Vale & Petrobras Bewertung', desc: 'Brasilianischer Leitindex mit weltweiter Führung bei Eisenerz und Agrar.' },
  { id: 'bmvipc', name: 'S&P/BMV IPC', symbol: 'IPC', val: '53.120,00', chg: '+0,45%', up: true, category: 'Index (Mexiko)', high: '53.400,00', low: '52.900,00', vol: 'MX$ 12B', score: 78, rating: 'Nearshoring-Nutzen', desc: 'Mexikos Leitindex profitiert von US-Fertigungsverlagerungen.' },
  { id: 'merval', name: 'S&P Merval', symbol: 'MERVAL', val: '1.580.000', chg: '+3,40%', up: true, category: 'Index (Argentinien)', high: '1.610.000', low: '1.540.000', vol: 'ARS 35B', score: 74, rating: 'Milei Reformoptimismus', desc: 'Buenos Aires Leitindex reagiert dynamisch auf Deregulierungsmaßnahmen.' },
  { id: 'ipsa', name: 'S&P IPSA', symbol: 'IPSA', val: '6.620,00', chg: '+0,50%', up: true, category: 'Index (Chile)', high: '6.650,00', low: '6.590,00', vol: 'CLP 85B', score: 77, rating: 'Kupfer & Lithium Exporte', desc: 'Chilenischer Leitindex mit starker Verknüpfung zur Energiewende.' },
  { id: 'bist100', name: 'BIST 100', symbol: 'XU100', val: '10.420,00', chg: '+1,15%', up: true, category: 'Index (Türkei)', high: '10.510,00', low: '10.320,00', vol: '₺ 85B', score: 76, rating: 'Orthodoxe Zinspolitik', desc: 'Istanbuler Leitindex im Umfeld von Leitzinsanpassungen der Zentralbank.' },
  { id: 'tasi', name: 'Tadawul All Share (TASI)', symbol: 'TASI', val: '11.820,00', chg: '+0,40%', up: true, category: 'Index (Saudi-Arabien)', high: '11.890,00', low: '11.780,00', vol: 'SAR 6.5B', score: 81, rating: 'Vision 2030 Diversifikation', desc: 'Größter arabischer Aktienmarkt angeführt von Saudi Aramco und Al Rajhi Bank.' },
  { id: 'jsetop40', name: 'JSE Top 40', symbol: 'JTOPI', val: '72.150,00', chg: '+0,65%', up: true, category: 'Index (Südafrika)', high: '72.600,00', low: '71.800,00', vol: 'ZAR 16B', score: 76, rating: 'Naspers & Platinminen', desc: 'Südafrikanischer Leitindex in Johannesburg mit starkem Bergbauanteil.' },
  { id: 'ta125', name: 'Tel Aviv 125', symbol: 'TA125', val: '2.010,40', chg: '+0,55%', up: true, category: 'Index (Israel)', high: '2.025,00', low: '1.995,00', vol: '₪ 1.2B', score: 78, rating: 'Hightech & Cybersecurity', desc: 'Die 125 größten börsennotierten Unternehmen an der Börse Tel Aviv.' },

  // ========================================================
  // 91-100: Globale Welt- & Multi-Asset / Anleihenindizes
  // ========================================================
  { id: 'msciworld', name: 'MSCI World Index', symbol: 'URTH', val: '3.520,10', chg: '+0,85%', up: true, category: 'Weltaktienindex', high: '3.535,00', low: '3.495,00', vol: '$12.1B', score: 85, rating: 'Globale Diversifikation', desc: 'Breites globales Aktienbarometer für über 1.500 Unternehmen aus 23 Industrieländern.' },
  { id: 'msciacwi', name: 'MSCI ACWI (All Country)', symbol: 'ACWI', val: '108,50', chg: '+0,80%', up: true, category: 'Weltaktienindex Industrie + EM', high: '109,10', low: '107,80', vol: '$8.5B', score: 86, rating: 'Gesamte globale Marktwelt', desc: 'Kombiniert Industrie- und Schwellenländer für weltweite Aktienabdeckung.' },
  { id: 'msciem', name: 'MSCI Emerging Markets', symbol: 'EEM', val: '1.085,20', chg: '+0,60%', up: true, category: 'Schwellenländerindex', high: '1.092,00', low: '1.078,00', vol: '$5.4B', score: 79, rating: 'Aufstrebende Märkte', desc: 'Aktien aus 24 Schwellenländern wie Indien, Taiwan, Südkorea und Brasilien.' },
  { id: 'mscieafe', name: 'MSCI EAFE Index', symbol: 'EFA', val: '2.340,60', chg: '+0,65%', up: true, category: 'Industrieländer ex-USA', high: '2.352,00', low: '2.328,00', vol: '$4.2B', score: 80, rating: 'Europa, Australasien & Fernost', desc: 'Führendes Barometer für entwickelte Märkte außerhalb der USA und Kanadas.' },
  { id: 'bcom', name: 'Bloomberg Commodity Index', symbol: 'BCOM', val: '102,40', chg: '+0,92%', up: true, category: 'Rohstoffgesamtindex', high: '103,10', low: '101,60', vol: '$6.1B', score: 84, rating: 'Breite Rohstoff-Futures', desc: 'Diversifizierter Benchmark für 24 physische Rohstoffe aus Energie, Metallen und Agrar.' },
  { id: 'usaggbond', name: 'Bloomberg US Aggregate Bond', symbol: 'AGG', val: '98,40', chg: '+0,18%', up: true, category: 'US Anleihen Gesamtindex', high: '98,60', low: '98,20', vol: '$3.5B', score: 81, rating: 'Attraktive Renditeniveaus', desc: 'Leitindex für US-Staatsanleihen und Unternehmensanleihen hoher Bonität.' },
  { id: 'globalaggbond', name: 'Bloomberg Global Aggregate', symbol: 'BNDX', val: '49,80', chg: '+0,12%', up: true, category: 'Globaler Anleihenindex', high: '49,95', low: '49,65', vol: '$2.8B', score: 80, rating: 'Weltweite Festverzinsung', desc: 'Globale Staats- und Unternehmensanleihen in Hartwährungen.' },
  { id: 'highyield', name: 'iBoxx Liquid High Yield Bond', symbol: 'HYG', val: '77,20', chg: '+0,32%', up: true, category: 'Hochzinsanleihen (Junk Bonds)', high: '77,45', low: '76,95', vol: '$2.1B', score: 82, rating: 'Solide Spreads & Cashflow', desc: 'Hochverzinsliche US-Unternehmensanleihen mit attraktiver Risikoprämie.' },
  { id: 'invgrade', name: 'iBoxx Liquid Investment Grade', symbol: 'LQD', val: '109,50', chg: '+0,25%', up: true, category: 'Corporate Bonds (Prime)', high: '109,90', low: '109,10', vol: '$2.6B', score: 83, rating: 'Unternehmens-Bonität Top', desc: 'Hochwertige US-Unternehmensanleihen mit Investment-Grade-Rating.' },
  { id: 'tipinflation', name: 'Bloomberg US TIPS Index', symbol: 'TIP', val: '107,20', chg: '+0,15%', up: true, category: 'Inflationsgeschützte Anleihen', high: '107,45', low: '106,95', vol: '$1.4B', score: 80, rating: 'Realer Kaufkraftschutz', desc: 'US-Treasury Inflation-Protected Securities zum Schutz gegen Preissteigerungen.' },
];

function getIndexSubclass(item: RawIndexItem): { id: string; name: string } {
  // 1. Asien & Pazifik
  if (
    item.category.includes('Asien') ||
    item.category.includes('Japan') ||
    item.category.includes('China') ||
    item.category.includes('Hongkong') ||
    item.category.includes('Indien') ||
    item.category.includes('Südkorea') ||
    item.category.includes('Australien') ||
    item.category.includes('Singapur') ||
    ['nikkei225', 'hangseng', 'hstech', 'csi300', 'shanghai', 'nifty50', 'sensex', 'kospi', 'taiex', 'straitstimes', 'asx200'].includes(item.id)
  ) {
    return { id: 'indizies-asia', name: 'Asien & Pazifik' };
  }

  // 2. Europa & DACH
  if (
    item.category.includes('Europa') ||
    item.category.includes('DACH') ||
    item.category.includes('Deutschland') ||
    item.category.includes('Schweiz') ||
    item.category.includes('Frankreich') ||
    item.category.includes('Großbritannien') ||
    item.category.includes('Spanien') ||
    item.category.includes('Italien') ||
    item.category.includes('Niederlande') ||
    item.category.includes('Österreich') ||
    item.category.includes('Nordic') ||
    ['dax40', 'eurostoxx50', 'smi', 'cac40', 'ftse100', 'ibex35', 'ftsemib', 'aex', 'mdax', 'sdax', 'tecdax', 'atx', 'omx30', 'stoxx600'].includes(item.id)
  ) {
    return { id: 'indizies-europe', name: 'Europa & DACH-Region' };
  }

  // 3. US Leitindizes
  if (
    item.category.includes('US Leitindex') ||
    item.category.includes('US Bluechips') ||
    item.category.includes('US Small Caps') ||
    item.category.includes('US Mid Caps') ||
    item.category.includes('US Large Caps') ||
    item.category.includes('US All Share') ||
    item.category.includes('US Gesamtmarkt') ||
    ['sp500', 'nasdaq100', 'nasdaqcomp', 'dowjones', 'russell2000', 'russell1000', 'spmidcap', 'spsmallcap', 'nysecomp', 'wilshire5000', 'vix', 'dxy', 'djtransport', 'djutility'].includes(item.id)
  ) {
    return { id: 'indizies-us', name: 'US-Leitindizes' };
  }

  // 4. Default: Sektor- & Themenindizes (Chips, Sektoren, Global, Rohstoff- & Anleihenindizes)
  return { id: 'indizies-sector', name: 'Themen- & Sektorindizes' };
}

export const INDEX_ASSETS: MarketAsset[] = RAW_INDEX_ASSETS.map((item, idx) => {
  const subclassInfo = getIndexSubclass(item);

  return {
    id: item.id,
    name: item.name,
    symbol: item.symbol,
    value: item.val,
    change: item.chg,
    isPositive: item.up,
    mainCategory: 'INDIZIES',
    subclassId: subclassInfo.id,
    subclassName: subclassInfo.name,
    iconType: 'index',
    sparklinePath: item.up
      ? `M 0,${34 + (idx % 6)} Q 25,${38 - (idx % 5)} 50,${25 - (idx % 4)} T 100,${27 - (idx % 3)} T 150,${14 - (idx % 4)} T 200,${6 + (idx % 3)}`
      : `M 0,${16 + (idx % 5)} Q 30,${18 + (idx % 4)} 65,${28 + (idx % 5)} T 120,${26 + (idx % 3)} T 170,${36 + (idx % 4)} T 200,${42 - (idx % 2)}`,
    glowColor: item.up ? 'rgba(141, 38, 255, 0.25)' : 'rgba(244, 63, 94, 0.25)',
    borderColor: item.up ? 'rgba(141, 38, 255, 0.4)' : 'rgba(244, 63, 94, 0.4)',
    waveColor: item.up ? '#8D26FF' : '#F43F5E',
    category: item.category,
    high24h: item.high,
    low24h: item.low,
    volume24h: item.vol,
    aiScore: item.score,
    aiRating: item.rating,
    description: item.desc,
  };
});
