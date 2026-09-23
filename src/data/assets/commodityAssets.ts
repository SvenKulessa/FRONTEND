import { MarketAsset } from '../../types';

interface RawCommodityItem {
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

export const RAW_COMMODITY_ITEMS: RawCommodityItem[] = [
  // ========================================================
  // 1-10: Edelmetalle (Precious Metals)
  // ========================================================
  { id: 'com-gold', name: 'Gold Spot', symbol: 'XAU/USD', val: '$2.342,80', chg: '+0,65%', up: true, category: 'Edelmetalle', high: '$2.355,00', low: '$2.330,20', vol: '$48B', score: 94, rating: 'Zentralbankenkäufe Rekord', desc: 'Krisenwährung Nummer 1, physisch getrieben von weltweiten Zentralbankaufkäufen.' },
  { id: 'com-silver', name: 'Silber Spot', symbol: 'XAG/USD', val: '$29,85', chg: '+1,85%', up: true, category: 'Edelmetalle', high: '$30,20', low: '$29,40', vol: '$18B', score: 91, rating: 'Solar- & Industrie-Rallye', desc: 'Doppelrolle als Wertspeicher und unverzichtbares Industriemetall für Photovoltaik.' },
  { id: 'com-platinum', name: 'Platin Spot', symbol: 'XPT/USD', val: '$995,40', chg: '+0,80%', up: true, category: 'Edelmetalle', high: '$1.008,00', low: '$986,00', vol: '$4.5B', score: 82, rating: 'Wasserstoff Katalysator', desc: 'Autoabgas-Katalysatoren und essenzielle Membranen für Wasserstoff-Elektrolyseure.' },
  { id: 'com-palladium', name: 'Palladium Spot', symbol: 'XPD/USD', val: '$912,20', chg: '-1,15%', up: false, category: 'Edelmetalle', high: '$928,00', low: '$904,00', vol: '$3.2B', score: 68, rating: 'EV-Substitution Druck', desc: 'Primär in Benzin-Katalysatoren genutzt, steht unter Druck durch Elektrofahrzeuge.' },
  { id: 'com-rhodium', name: 'Rhodium Spot', symbol: 'RHOD', val: '$4.750,00', chg: '+0,50%', up: true, category: 'Edelmetalle (PGM)', high: '$4.820,00', low: '$4.700,00', vol: '$950M', score: 79, rating: 'Seltenstes PGM Metall', desc: 'Extrem seltenes Platingruppenmetall für Spezialkatalysatoren und Hochtemperaturanwendungen.' },
  { id: 'com-iridium', name: 'Iridium Spot', symbol: 'IRID', val: '$5.000,00', chg: '+0,20%', up: true, category: 'Edelmetalle (PGM)', high: '$5.050,00', low: '$4.980,00', vol: '$620M', score: 84, rating: 'PEM Elektrolyse Schlüssel', desc: 'Schlüsselkomponente für PEM-Elektrolyseure zur Erzeugung von grünem Wasserstoff.' },
  { id: 'com-ruthenium', name: 'Ruthenium Spot', symbol: 'RUTH', val: '$450,00', chg: '0,00%', up: true, category: 'Edelmetalle (PGM)', high: '$455,00', low: '$448,00', vol: '$380M', score: 76, rating: 'Elektronik & Festplatten', desc: 'Wichtiges Dotierungsmaterial für Festplatten-Speicherschichten und Solarzellen.' },
  { id: 'com-osmium', name: 'Osmium Kristallin', symbol: 'OSM', val: '$1.840,00', chg: '+0,35%', up: true, category: 'Edelmetalle (PGM)', high: '$1.860,00', low: '$1.820,00', vol: '$120M', score: 74, rating: 'Dichtestes Metall der Erde', desc: 'Dichtestes natürliches Element mit extremer Abriebfestigkeit und Wertbeständigkeit.' },
  { id: 'com-goldsilver', name: 'Gold/Silber Ratio', symbol: 'XAU/XAG', val: '78,48', chg: '-1,18%', up: false, category: 'Edelmetall Ratio', high: '79,40', low: '77,90', vol: '$5.2B', score: 87, rating: 'Silber Outperformance', desc: 'Verhältnis des Goldpreises zum Silberpreis – fällt, wenn Silber Gold outperformt.' },
  { id: 'com-platgold', name: 'Platin/Gold Ratio', symbol: 'XPT/XAU', val: '0,425', chg: '+0,15%', up: true, category: 'Edelmetall Ratio', high: '0,432', low: '0,420', vol: '$2.1B', score: 81, rating: 'Historisch günstig', desc: 'Historischer Vergleichswert: Platin notiert mit außergewöhnlichem Abschlag zu Gold.' },

  // ========================================================
  // 11-25: Energie & Kraftstoffe (Energy & Fuels)
  // ========================================================
  { id: 'com-brent', name: 'Brent Rohöl', symbol: 'BRENT', val: '$85,24', chg: '+0,82%', up: true, category: 'Energie (Öl)', high: '$85,90', low: '$84,40', vol: '$34B', score: 79, rating: 'OPEC+ Fördermengenlimit', desc: 'Europäische Leitölsorte aus der Nordsee, maßgeblich gesteuert durch OPEC+ Beschlüsse.' },
  { id: 'com-wti', name: 'WTI Rohöl (Crude)', symbol: 'WTI', val: '$81,60', chg: '+0,94%', up: true, category: 'Energie (Öl)', high: '$82,25', low: '$80,80', vol: '$38B', score: 80, rating: 'US-Lagerbestände Rückgang', desc: 'Amerikanisches Leichtöl, gehandelt an der NYMEX mit Lieferort Cushing, Oklahoma.' },
  { id: 'com-natgas', name: 'Erdgas (Henry Hub)', symbol: 'NG', val: '$2,85', chg: '-1,45%', up: false, category: 'Energie (Gas)', high: '$2,94', low: '$2,80', vol: '$12B', score: 72, rating: 'US LNG Exporte Rekord', desc: 'US-Erdgas-Benchmark, stark beeinflusst von Fracking-Produktion und LNG-Terminals.' },
  { id: 'com-ttf', name: 'TTF Erdgas Europa', symbol: 'TTF', val: '€34,80', chg: '+1,60%', up: true, category: 'Energie (Gas)', high: '€35,60', low: '€33,90', vol: '€14B', score: 83, rating: 'Europäische Speicher 75%', desc: 'Niederländischer Title Transfer Facility Benchmark für europäische Pipeline- & LNG-Preise.' },
  { id: 'com-heatingoil', name: 'Heizöl (Heating Oil)', symbol: 'HO', val: '$2,54/gal', chg: '+0,72%', up: true, category: 'Energie (Raffinerie)', high: '$2,58', low: '$2,51', vol: '$6.8B', score: 76, rating: 'Saisonale Heiznachfrage', desc: 'Destillat-Benchmark für Raumwärme und industriellen Mitteldestillat-Verbrauch.' },
  { id: 'com-rbob', name: 'RBOB Benzin', symbol: 'RB', val: '$2,51/gal', chg: '+1,10%', up: true, category: 'Energie (Kraftstoffe)', high: '$2,55', low: '$2,47', vol: '$8.4B', score: 78, rating: 'US-Fahrsaison Sommer', desc: 'Reformulated Blendstock for Oxygenate Blending – US-Großhandelsbenzin.' },
  { id: 'com-gasoil', name: 'London Gasoil (Diesel)', symbol: 'LGO', val: '$785,00/t', chg: '+0,65%', up: true, category: 'Energie (Kraftstoffe)', high: '$792,00', low: '$778,00', vol: '$7.2B', score: 77, rating: 'Schifffahrt & LKW Diesel', desc: 'Europäischer Standardkontrakt an der ICE für schwefelarmen Dieselkraftstoff.' },
  { id: 'com-dubai', name: 'Dubai Rohöl', symbol: 'DUBAI', val: '$84,80/bbl', chg: '+0,75%', up: true, category: 'Energie (Öl)', high: '$85,30', low: '$84,10', vol: '$9.5B', score: 78, rating: 'Nahost-Asien Benchmark', desc: 'Preismechanismus für Lieferungen aus dem Persischen Golf an asiatische Raffinerien.' },
  { id: 'com-uranium', name: 'Uran (Yellowcake)', symbol: 'U3O8', val: '$85,50/lb', chg: '+1,40%', up: true, category: 'Kernenergie & Nuklear', high: '$86,80', low: '$84,20', vol: '$2.8B', score: 92, rating: 'Nukleare Renaissance', desc: 'Weltweiter Ausbau von AKWs und SMRs treibt das strukturelle Angebotsdefizit.' },
  { id: 'com-coal-rot', name: 'Kohle Rotterdam', symbol: 'API2', val: '$112,50/t', chg: '-0,55%', up: false, category: 'Energie (Kohle)', high: '$114,00', low: '$111,80', vol: '$3.4B', score: 70, rating: 'Kraftwerkseinsatz Europa', desc: 'Thermische Kraftwerkskohle geliefert in die ARA-Häfen (Amsterdam, Rotterdam, Antwerpen).' },
  { id: 'com-coal-newc', name: 'Kohle Newcastle', symbol: 'NEWC', val: '$135,00/t', chg: '+0,40%', up: true, category: 'Energie (Kohle)', high: '$136,50', low: '$133,80', vol: '$4.1B', score: 73, rating: 'Asiatische Stromnachfrage', desc: 'Hochwertige australische Kraftwerkskohle für Abnehmer in Japan, Korea und Taiwan.' },
  { id: 'com-propane', name: 'Propan Mont Belvieu', symbol: 'PROP', val: '$0,78/gal', chg: '-0,25%', up: false, category: 'Flüssiggas (LPG)', high: '$0,80', low: '$0,77', vol: '$1.8B', score: 75, rating: 'Petrochemie-Cracker Feedstock', desc: 'Wichtiges Flüssiggas für Heizung und petrochemische Grundstoffe (Propylen).' },
  { id: 'com-ethanol', name: 'Ethanol Chicago', symbol: 'ETHN', val: '$1,65/gal', chg: '+0,30%', up: true, category: 'Biokraftstoffe', high: '$1,68', low: '$1,63', vol: '$1.2B', score: 74, rating: 'Mais-Mischquote US', desc: 'Biokraftstoff aus US-Mais, gesetzlich beigemischt im E10- und E85-Benzin.' },
  { id: 'com-jetfuel', name: 'Kerosin (Jet Fuel)', symbol: 'JET', val: '$2,48/gal', chg: '+0,85%', up: true, category: 'Energie (Luftfahrt)', high: '$2,52', low: '$2,44', vol: '$3.6B', score: 81, rating: 'Globaler Flugverkehr Hoch', desc: 'Treibstoff für den zivilen Luftverkehr profitiert von Rekordpassagierzahlen.' },
  { id: 'com-naphtha', name: 'Naphtha Cargoes', symbol: 'NAPH', val: '$675,00/t', chg: '+0,45%', up: true, category: 'Petrochemie Rohstoff', high: '$682,00', low: '$669,00', vol: '$2.9B', score: 75, rating: 'Plastik- & Polymerproduktion', desc: 'Leichtbenzin als unverzichtbarer Rohstoff für Steamcracker in der Chemieindustrie.' },

  // ========================================================
  // 26-50: Industriemetalle & Batterierohstoffe
  // ========================================================
  { id: 'com-copper', name: 'Kupfer High Grade', symbol: 'HG', val: '$4,48/lb', chg: '+1,42%', up: true, category: 'Industriemetalle', high: '$4,54', low: '$4,40', vol: '$19B', score: 92, rating: 'Elektrifizierung & Netze', desc: 'Dr. Copper gilt als Barometer der Weltwirtschaft; unverzichtbar für Stromnetze und E-Autos.' },
  { id: 'com-copper-lme', name: 'LME Kupfer', symbol: 'CA', val: '$9.880,00/t', chg: '+1,35%', up: true, category: 'Industriemetalle (LME)', high: '$9.960,00', low: '$9.790,00', vol: '$16B', score: 91, rating: 'LME Lagerbestände niedrig', desc: 'Weltweiter physischer Benchmark-Kontrakt der London Metal Exchange.' },
  { id: 'com-aluminum', name: 'Aluminium LME', symbol: 'AL', val: '$2.520,00/t', chg: '+0,75%', up: true, category: 'Industriemetalle', high: '$2.550,00', low: '$2.495,00', vol: '$11B', score: 83, rating: 'Leichtbau & Luftfahrt', desc: 'Leichtmetall für Automobilkarosserien, Flugzeuge, Dosen und Bauprofile.' },
  { id: 'com-zinc', name: 'Zink LME', symbol: 'ZN', val: '$2.840,00/t', chg: '+0,90%', up: true, category: 'Industriemetalle', high: '$2.880,00', low: '$2.810,00', vol: '$7.5B', score: 80, rating: 'Verzinkung Rostschutz', desc: 'Hauptsächlich genutzt zum Korrosionsschutz durch Verzinken von Baustahl.' },
  { id: 'com-nickel', name: 'Nickel LME', symbol: 'NI', val: '$17.420,00/t', chg: '-0,65%', up: false, category: 'Batteriemetalle & Stahl', high: '$17.650,00', low: '$17.280,00', vol: '$6.8B', score: 74, rating: 'Indonesien Überangebot', desc: 'Edelstahl-Herstellung und energiereiche Lithium-Ionen-Batteriekathoden (NMC).' },
  { id: 'com-lead', name: 'Blei LME', symbol: 'PB', val: '$2.180,00/t', chg: '+0,25%', up: true, category: 'Industriemetalle', high: '$2.205,00', low: '$2.165,00', vol: '$3.8B', score: 76, rating: 'Starterbatterien Zyklus', desc: 'Einsatz in traditionellen Autobatterien, Notstrom-USV-Anlagen und Strahlenschutz.' },
  { id: 'com-tin', name: 'Zinn LME', symbol: 'SN', val: '$32.450,00/t', chg: '+1,80%', up: true, category: 'Elektronikmetalle', high: '$32.900,00', low: '$31.800,00', vol: '$4.2B', score: 89, rating: 'Halbleiter-Lötmittel Knappheit', desc: 'Unverzichtbares Lötmetall für jede bestückte Leiterplatte und jeden KI-Server.' },
  { id: 'com-ironore', name: 'Eisenerz 62% Fe', symbol: 'TIO', val: '$106,80/t', chg: '-0,35%', up: false, category: 'Stahlrohstoffe', high: '$108,50', low: '$105,80', vol: '$14B', score: 75, rating: 'Chinesische Stahlwerke Output', desc: 'Wichtigster Rohstoff zur Erzeugung von Roheisen und Stahl in Hochöfen.' },
  { id: 'com-lithium-carb', name: 'Lithiumcarbonat 99.5%', symbol: 'LI', val: '$13.800,00/t', chg: '+2,10%', up: true, category: 'Batteriemetalle', high: '$14.200,00', low: '$13.400,00', vol: '$5.4B', score: 84, rating: 'Bodenbildung Batteriezellen', desc: 'Lithium-Eisenphosphat-Akkus (LFP) dominieren Elektroautos weltweit.' },
  { id: 'com-lithium-hyd', name: 'Lithiumhydroxid', symbol: 'LIOH', val: '$14.250,00/t', chg: '+1,90%', up: true, category: 'Batteriemetalle', high: '$14.600,00', low: '$13.900,00', vol: '$4.1B', score: 83, rating: 'High-Nickel Batterien', desc: 'Bevorzugtes Lithiumsalz für reichweitenstarke NMC-811 Batteriekathoden.' },
  { id: 'com-cobalt', name: 'Kobalt LME', symbol: 'CO', val: '$27.800,00/t', chg: '0,00%', up: true, category: 'Batteriemetalle & Legierungen', high: '$28.100,00', low: '$27.600,00', vol: '$2.1B', score: 71, rating: 'Kongo Angebot stabil', desc: 'Superlegierungen für Flugzeugturbinen und Kobalt-Lithium-Akkus.' },
  { id: 'com-manganese', name: 'Manganerz 44%', symbol: 'MN', val: '$5,80/dmtu', chg: '+3,40%', up: true, category: 'Stahl- & Batteriezusatz', high: '$6,10', low: '$5,60', vol: '$1.9B', score: 85, rating: 'Australien Minenstopp Impuls', desc: 'Stahlentschwefelung und neue quecksilberfreie LMFP-Batteriezellen.' },
  { id: 'com-molybdenum', name: 'Molybdän Oxide', symbol: 'MO', val: '$21,40/lb', chg: '+0,85%', up: true, category: 'Speziallegierungen', high: '$21,80', low: '$21,10', vol: '$1.4B', score: 82, rating: 'Pipeline- & Rüstungsstahl', desc: 'Verleiht Sonderstählen extreme Härte und Hitzebeständigkeit.' },
  { id: 'com-titanium', name: 'Titanschwamm', symbol: 'TI', val: '$8,20/kg', chg: '+0,40%', up: true, category: 'Luft- & Raumfahrtmetalle', high: '$8,35', low: '$8,10', vol: '$1.8B', score: 86, rating: 'Airbus & Boeing Auftragsbücher', desc: 'Leichtes, korrosionsfestes Hochleistungsmetall für Flugzeugrümpfe und Triebwerke.' },
  { id: 'com-neodymium', name: 'Neodym-Praseodym', symbol: 'NDPR', val: '$54.000,00/t', chg: '+1,50%', up: true, category: 'Seltene Erden', high: '$55.200,00', low: '$53.400,00', vol: '$2.6B', score: 88, rating: 'Dauermagnete für E-Motoren', desc: 'Stärkste Permanentmagnete der Welt für E-Auto-Antriebe und Windkraftgeneratoren.' },
  { id: 'com-bismuth', name: 'Wismut (Bismuth)', symbol: 'BI', val: '$4,80/lb', chg: '+0,25%', up: true, category: 'Sondermetalle', high: '$4,92', low: '$4,74', vol: '$320M', score: 75, rating: 'Bleifreie Lote & Pharma', desc: 'Ungiftiger Bleiersatz für Sanitärarmaturen und pharmazeutische Präparate.' },
  { id: 'com-silicon', name: 'Silizium Metall 553', symbol: 'SI', val: '$1.980,00/t', chg: '+0,60%', up: true, category: 'Halbleiter & Photovoltaik', high: '$2.020,00', low: '$1.950,00', vol: '$3.5B', score: 82, rating: 'Polysilizium für Solar', desc: 'Grundstoff für Reinstsilizium in Computerchips und Solarzellen.' },
  { id: 'com-chromium', name: 'Ferrochrom HC', symbol: 'CR', val: '$1,38/lb', chg: '+0,30%', up: true, category: 'Stahllegierungen', high: '$1,42', low: '$1,35', vol: '$2.1B', score: 77, rating: 'Edelstahl-Rostfreiheit', desc: 'Wichtigstes Legierungselement für rostfreie Stähle (mindestens 10,5% Cr).' },
  { id: 'com-magnesium', name: 'Magnesiumbarren 99.9%', symbol: 'MG', val: '$2.850,00/t', chg: '-0,40%', up: false, category: 'Leichtbaumetalle', high: '$2.900,00', low: '$2.820,00', vol: '$1.6B', score: 76, rating: 'Druckguss für Automotive', desc: '33% leichter als Aluminium, unverzichtbar für ultraleichte Autoteile.' },
  { id: 'com-tungsten', name: 'Wolfram APT', symbol: 'W', val: '$335,00/mtu', chg: '+1,10%', up: true, category: 'Hartmetalle & Rüstung', high: '$340,00', low: '$330,00', vol: '$1.5B', score: 87, rating: 'Höchster Schmelzpunkt', desc: 'Höchster Schmelzpunkt aller Metalle (3.422°C); Schneidwerkzeuge und Panzerbrecher.' },
  { id: 'com-vanadium', name: 'Vanadium Pentoxid', symbol: 'V', val: '$6,40/lb', chg: '+0,50%', up: true, category: 'Redox-Flow & Baustahl', high: '$6,60', low: '$6,25', vol: '$890M', score: 80, rating: 'Großbatteriespeicher Redox', desc: 'Vanadium-Redox-Flow-Batterien für stationäre Netzenergiespeicherung.' },
  { id: 'com-antimony', name: 'Antimon Barren', symbol: 'SB', val: '$22.500,00/t', chg: '+4,80%', up: true, category: 'Kritische Rohstoffe', high: '$23.200,00', low: '$21.500,00', vol: '$1.2B', score: 95, rating: 'Chinesische Exportkontrollen', desc: 'Flammschutzmittel und Nachtsichtgeräte; drastische Angebotsverknappung.' },
  { id: 'com-germanium', name: 'Germanium Metall', symbol: 'GE', val: '$2.150,00/kg', chg: '+2,40%', up: true, category: 'Optoelektronik', high: '$2.200,00', low: '$2.100,00', vol: '$950M', score: 94, rating: 'Glasfaser & Infrarotsensoren', desc: 'Kritisches Hochtechnologiemetall für Glasfaserkabel und Satelliten-Solarzellen.' },
  { id: 'com-gallium', name: 'Gallium 4N', symbol: 'GA', val: '$520,00/kg', chg: '+1,80%', up: true, category: 'Verbindungshalbleiter', high: '$535,00', low: '$510,00', vol: '$780M', score: 93, rating: 'GaN Leistungselektronik', desc: 'Galliumnitrid (GaN) revolutioniert Schnellladegeräte und 5G-Sendestationen.' },
  { id: 'com-tantalum', name: 'Tantalit (Coltan)', symbol: 'TA', val: '$74,00/lb', chg: '+0,70%', up: true, category: 'Kondensatormetalle', high: '$76,00', low: '$72,50', vol: '$650M', score: 85, rating: 'Mikrokondensatoren Smartphones', desc: 'Gewonnen aus Coltan-Erz; extrem hohe Kapazität auf kleinstem Raum in Smartphones.' },

  // ========================================================
  // 51-65: Agrarrohstoffe - Getreide & Ölsaaten
  // ========================================================
  { id: 'com-wheat-cbot', name: 'Weizen CBOT', symbol: 'ZW', val: '$5,82/bu', chg: '+1,12%', up: true, category: 'Agrar (Getreide)', high: '$5,91', low: '$5,74', vol: '$11B', score: 79, rating: 'Schwarzmeer-Erntebericht', desc: 'Weltweiter Benchmark für Brotweizen gehandelt an der Chicago Board of Trade.' },
  { id: 'com-wheat-hrw', name: 'Kansas Weizen HRW', symbol: 'KE', val: '$5,98/bu', chg: '+0,95%', up: true, category: 'Agrar (Getreide)', high: '$6,06', low: '$5,91', vol: '$4.2B', score: 78, rating: 'US Plains Dürremonitor', desc: 'Hard Red Winter Weizen mit hohem Proteingehalt für Mehl und Backwaren.' },
  { id: 'com-wheat-mwe', name: 'Minneapolis Weizen', symbol: 'MW', val: '$6,42/bu', chg: '+0,70%', up: true, category: 'Agrar (Getreide)', high: '$6,49', low: '$6,36', vol: '$2.1B', score: 80, rating: 'Hard Red Spring Weizen', desc: 'Erstklassiger Sommerweizen mit herausragenden Klebereigenschaften.' },
  { id: 'com-wheat-matif', name: 'Euronext Weizen (Milling)', symbol: 'EBM', val: '€224,50/t', chg: '+1,25%', up: true, category: 'Agrar (Europa)', high: '€227,00', low: '€221,50', vol: '€5.8B', score: 81, rating: 'Pariser Mahlweizen Benchmark', desc: 'Führender europäischer Mahlweizen-Terminkontrakt an der Euronext Paris.' },
  { id: 'com-corn', name: 'Mais (Corn)', symbol: 'ZC', val: '$4,45/bu', chg: '+0,55%', up: true, category: 'Agrar (Getreide)', high: '$4,51', low: '$4,41', vol: '$14B', score: 77, rating: 'Futtermittel & Ethanol', desc: 'Weltweit am meisten angebautes Getreide; Hauptbestandteil von Tierfutter und Bioethanol.' },
  { id: 'com-soybeans', name: 'Sojabohnen', symbol: 'ZS', val: '$11,62/bu', chg: '+0,85%', up: true, category: 'Agrar (Ölsaaten)', high: '$11,75', low: '$11,52', vol: '$18B', score: 81, rating: 'China Importbedarf', desc: 'Wichtigste Proteinpflanze weltweit; getrieben von südamerikanischer Ernte und China-Importen.' },
  { id: 'com-soymeal', name: 'Sojamehl (Soybean Meal)', symbol: 'ZM', val: '$352,00/t', chg: '+1,15%', up: true, category: 'Futtermittel', high: '$357,00', low: '$348,00', vol: '$8.5B', score: 82, rating: 'Protein-Tierfutter global', desc: 'Rückstand der Sojaölpressung; weltweit führendes proteinreiches Tierfutter.' },
  { id: 'com-soyoil', name: 'Sojaöl (Soybean Oil)', symbol: 'ZL', val: '$44,20/lb', chg: '+0,45%', up: true, category: 'Pflanzenöle & Biodiesel', high: '$44,80', low: '$43,70', vol: '$7.4B', score: 76, rating: 'Biokraftstoff-Mandate', desc: 'Pflanzenöl für Nahrungsmittel und Rohstoff für erneuerbaren Hydrotreated Diesel (HVO).' },
  { id: 'com-canola', name: 'Raps Euronext Canola', symbol: 'RS', val: '€472,00/t', chg: '+0,80%', up: true, category: 'Agrar (Ölsaaten)', high: '€477,00', low: '€468,00', vol: '€4.1B', score: 79, rating: 'Biodiesel-Produktion EU', desc: 'Europäische Rapssaat an der Euronext; Kernrohstoff für Speiseöl und Biodiesel.' },
  { id: 'com-oats', name: 'Hafer (Oats)', symbol: 'ZO', val: '$3,48/bu', chg: '-0,30%', up: false, category: 'Agrar (Getreide)', high: '$3,54', low: '$3,44', vol: '$850M', score: 73, rating: 'Hafermilch & Frühstück', desc: 'Stetig wachsende Nachfrage durch pflanzliche Milchalternativen und gesunde Ernährung.' },
  { id: 'com-roughrice', name: 'Rauer Reis (Rough Rice)', symbol: 'ZR', val: '$18,20/cwt', chg: '+0,60%', up: true, category: 'Agrar (Grundnahrung)', high: '$18,45', low: '$18,05', vol: '$1.4B', score: 85, rating: 'Indische Exportrestriktionen', desc: 'Grundnahrungsmittel für über die Hälfte der Weltbevölkerung; gehandelt an der CBOT.' },
  { id: 'com-barley', name: 'Futtergerste (Barley)', symbol: 'BARL', val: '€195,00/t', chg: '+0,25%', up: true, category: 'Agrar & Brauerei', high: '€198,00', low: '€193,00', vol: '$920M', score: 74, rating: 'Braugerste & Mastfutter', desc: 'Wichtiges Getreide für die globale Bierbrauerei (Malz) und Rinderfütterung.' },
  { id: 'com-sorghum', name: 'Sorghum Hirse', symbol: 'SORG', val: '$4,65/bu', chg: '+0,40%', up: true, category: 'Agrar (Trockenresistent)', high: '$4,72', low: '$4,60', vol: '$680M', score: 76, rating: 'Klimaresistente Feldfrucht', desc: 'Extrem hitze- und trockenheitsresistentes Getreide für Trockengebiete weltweit.' },
  { id: 'com-sunfloweroil', name: 'Sonnenblumenöl', symbol: 'SUNO', val: '$960,00/t', chg: '+1,20%', up: true, category: 'Pflanzenöle', high: '$975,00', low: '$950,00', vol: '$1.8B', score: 81, rating: 'Ukraine & Balkan Exporte', desc: 'Hochwertiges Speiseöl; Exporte aus dem Schwarzmeerraum bestimmen die Preisbildung.' },
  { id: 'com-palmoil', name: 'Palmöl BMD', symbol: 'CPO', val: '3.920 MYR/t', chg: '+0,90%', up: true, category: 'Pflanzenöle (Leitkontrakt)', high: '3.960', low: '3.880', vol: '$5.6B', score: 83, rating: 'Indonesien B35 Biodiesel', desc: 'Weltweit meistproduziertes Pflanzenöl; Benchmark an der Bursa Malaysia Derivatives.' },

  // ========================================================
  // 66-80: Agrarrohstoffe - Softs (Kolonialwaren)
  // ========================================================
  { id: 'com-cocoa-ny', name: 'Kakao New York', symbol: 'CC', val: '$7.840,00/t', chg: '+2,85%', up: true, category: 'Agrar (Softs)', high: '$8.100,00', low: '$7.620,00', vol: '$8.4B', score: 96, rating: 'Historische Ernteknappheit', desc: 'Westafrikanische Ernteausfälle führten zu einer der spektakulärsten Kakaorallyes der Geschichte.' },
  { id: 'com-cocoa-ldn', name: 'Kakao London ICE', symbol: 'LCC', val: '£6.450,00/t', chg: '+2,40%', up: true, category: 'Agrar (Softs)', high: '£6.620,00', low: '£6.310,00', vol: '$6.2B', score: 95, rating: 'Elfenbeinküste Defizit', desc: 'Physisch belieferbarer Londoner Kakaokontrakt für Schokoladenhersteller weltweit.' },
  { id: 'com-coffee-arabica', name: 'Kaffee Arabica ICE', symbol: 'KC', val: '$2,28/lb', chg: '+1,60%', up: true, category: 'Agrar (Softs)', high: '$2,33', low: '$2,24', vol: '$6.5B', score: 90, rating: 'Brasilien Frost- & Dürrerisiko', desc: 'Hochwertige Hochland-Kaffeebohne; reagiert hochsensibel auf Wetterberichte aus Minas Gerais.' },
  { id: 'com-coffee-robusta', name: 'Kaffee Robusta ICE', symbol: 'RC', val: '$4.120,00/t', chg: '+2,15%', up: true, category: 'Agrar (Softs)', high: '$4.210,00', low: '$4.050,00', vol: '$5.1B', score: 93, rating: 'Vietnam Hitzewelle Rekord', desc: 'Bohne für Espresso und Instantkaffee; Rekordpreise durch Dürre in Vietnam.' },
  { id: 'com-sugar-11', name: 'Zucker Nr. 11 (Rohzucker)', symbol: 'SB', val: '$0,192/lb', chg: '-0,75%', up: false, category: 'Agrar (Softs)', high: '$0,196', low: '$0,190', vol: '$4.9B', score: 74, rating: 'Brasilien Rekordernte Zuckerrohr', desc: 'Weltweiter Rohzucker-Benchmark gehandelt an der ICE Futures US.' },
  { id: 'com-sugar-white', name: 'Weißzucker London', symbol: 'LSUG', val: '$545,00/t', chg: '-0,50%', up: false, category: 'Agrar (Softs)', high: '$552,00', low: '$540,00', vol: '$2.8B', score: 75, rating: 'Raffinerie White Premium', desc: 'Raffinierter weißer Kristallzucker gehandelt in London für Lebensmittelkonzerne.' },
  { id: 'com-cotton', name: 'Baumwolle Cotton #2', symbol: 'CT', val: '$0,72/lb', chg: '+0,45%', up: true, category: 'Agrar (Fasern)', high: '$0,735', low: '$0,712', vol: '$3.2B', score: 75, rating: 'Textilindustrie Auftragslage', desc: 'Wichtigste Naturfaser der globalen Bekleidungs- und Heimtextilindustrie.' },
  { id: 'com-orangejuice', name: 'Orangensaft FCOJ', symbol: 'OJ', val: '$4,68/lb', chg: '+3,10%', up: true, category: 'Agrar (Getränke)', high: '$4,80', low: '$4,55', vol: '$1.4B', score: 94, rating: 'Citrus Greening Seuche Rekord', desc: 'Frozen Concentrated Orange Juice; Citrus-Greening-Krankheit dezimierte Floridas Plantagen.' },
  { id: 'com-tea', name: 'Tee Mombasa Auktion', symbol: 'TEA', val: '$2,35/kg', chg: '+0,15%', up: true, category: 'Agrar (Genussmittel)', high: '$2,42', low: '$2,30', vol: '$450M', score: 78, rating: 'Ostafrika Pflückerträge', desc: 'Größte Schwarztee-Auktion der Welt in Mombasa, Kenia; beliefert globale Teemarken.' },
  { id: 'com-rubber', name: 'Naturkautschuk RSS3', symbol: 'RSS3', val: '$2.150,00/t', chg: '+1,20%', up: true, category: 'Industrierohstoffe (Agrar)', high: '$2.190,00', low: '$2.120,00', vol: '$2.4B', score: 84, rating: 'Reifenherstellung & Latex', desc: 'Geerntet aus Hevea-Bäumen in Thailand und Indonesien; 70% gehen in Autoreifen.' },
  { id: 'com-tobacco', name: 'Rohtabak Virginia', symbol: 'TOB', val: '$4,85/kg', chg: '0,00%', up: true, category: 'Agrar (Spezial)', high: '$4,92', low: '$4,80', vol: '$620M', score: 70, rating: 'Regulierung & Alternativen', desc: 'Getrocknete Tabakblätter für Zigaretten und moderne Heat-not-Burn Sticks.' },
  { id: 'com-wool', name: 'Merinowolle AWEX 19u', symbol: 'WOL', val: '1.240 c/kg', chg: '+0,40%', up: true, category: 'Agrar (Tierfasern)', high: '1.260', low: '1.225', vol: '$410M', score: 73, rating: 'Feine Bekleidungswolle', desc: 'Australischer Standardindex für feine Merinofasern in Luxusanzügen und Funktionskleidung.' },
  { id: 'com-silk', name: 'Rohseide Raw Silk 3A', symbol: 'SILK', val: '$68,50/kg', chg: '+0,60%', up: true, category: 'Agrar (Luxusfasern)', high: '$69,80', low: '$67,90', vol: '$310M', score: 76, rating: 'Chinesische Seidenzucht', desc: 'Traditionelle Naturfaser gewonnen aus den Kokons der Seidenraupe Bombyx mori.' },
  { id: 'com-blackpepper', name: 'Schwarzer Pfeffer Malabar', symbol: 'BLKP', val: '$6.800,00/t', chg: '+1,80%', up: true, category: 'Gewürze', high: '$6.950,00', low: '$6.680,00', vol: '$380M', score: 86, rating: 'König der Gewürze Rallye', desc: 'Weltweit meistgehandeltes Gewürz; schrumpfende Ernten in Vietnam und Indien treiben Preise.' },
  { id: 'com-cardamom', name: 'Grüner Kardamom Extra', symbol: 'CARD', val: '$28,40/kg', chg: '+2,50%', up: true, category: 'Gewürze', high: '$29,20', low: '$27,80', vol: '$220M', score: 88, rating: 'Extremes Hochlandgewürz', desc: 'Eines der teuersten Gewürze der Welt nach Safran und Vanille; starke Nachfrage im Nahen Osten.' },

  // ========================================================
  // 81-90: Viehwirtschaft & Molkerei (Livestock & Dairy)
  // ========================================================
  { id: 'com-livecattle', name: 'Lebendrind (Live Cattle)', symbol: 'LC', val: '$1,84/lb', chg: '+0,65%', up: true, category: 'Viehwirtschaft', high: '$1,86', low: '$1,82', vol: '$4.8B', score: 85, rating: 'Historisch kleiner US-Bestand', desc: 'Schlachtreife Rinder; US-Rinderherde auf dem niedrigsten Stand seit über 70 Jahren.' },
  { id: 'com-feedercattle', name: 'Mastrind (Feeder Cattle)', symbol: 'FC', val: '$2,58/lb', chg: '+0,80%', up: true, category: 'Viehwirtschaft', high: '$2,61', low: '$2,55', vol: '$3.2B', score: 87, rating: 'Kälbermangel treibt Preise', desc: 'Jungrinder zur Mästung in US-Feedlots; gehandelt an der Chicago Mercantile Exchange.' },
  { id: 'com-leanhogs', name: 'Magerschwein (Lean Hogs)', symbol: 'LH', val: '$0,89/lb', chg: '-0,90%', up: false, category: 'Viehwirtschaft', high: '$0,91', low: '$0,88', vol: '$2.9B', score: 73, rating: 'Saisonale Grillsaison', desc: 'Schlachtschweine für Schinken, Koteletts und Würste an der CME.' },
  { id: 'com-porkbellies', name: 'Schweinebäuche (Bacon)', symbol: 'PBEL', val: '$1,62/lb', chg: '+1,20%', up: true, category: 'Viehwirtschaft', high: '$1,66', low: '$1,59', vol: '$1.1B', score: 80, rating: 'Speck & Fast Food Nachfrage', desc: 'Ausgangsprodukt für knusprigen Bacon in der globalen Systemgastronomie.' },
  { id: 'com-class3milk', name: 'Klasse III Milch CME', symbol: 'DC', val: '$19,80/cwt', chg: '+0,75%', up: true, category: 'Molkereiprodukte', high: '$20,10', low: '$19,55', vol: '$1.8B', score: 81, rating: 'Käsemilch Benchmark', desc: 'US-Rohmilch für die Käseproduktion; maßgeblicher Leitpreis für Milchbauern.' },
  { id: 'com-skimmilk', name: 'Magermilchpulver EEX', symbol: 'SMP', val: '€2.480,00/t', chg: '+0,30%', up: true, category: 'Molkereiprodukte (Europa)', high: '€2.510,00', low: '€2.460,00', vol: '$950M', score: 76, rating: 'EEX Leipzig Leitkontrakt', desc: 'Haltbares Milchpulver für Schokolade, Babynahrung und globale Backwaren.' },
  { id: 'com-butter', name: 'Butter CME', symbol: 'CBUT', val: '$3,12/lb', chg: '+1,45%', up: true, category: 'Molkereiprodukte', high: '$3,18', low: '$3,08', vol: '$1.4B', score: 89, rating: 'Fettgehalt-Prämie Rekord', desc: 'Butterfettpreise profitieren von robuster Nachfrage in Bäckereien und Gastronomie.' },
  { id: 'com-cheddar', name: 'Cheddar Käse Blöcke', symbol: 'CHED', val: '$1,95/lb', chg: '+0,50%', up: true, category: 'Molkereiprodukte', high: '$1,98', low: '$1,92', vol: '$1.2B', score: 79, rating: 'CME 40-Pfund-Blöcke', desc: 'Industrielle 40-Pfund-Blöcke Cheddarkäse als Handelsstandard an der CME.' },
  { id: 'com-eggs', name: 'Eier Großhandel Grade A', symbol: 'EGGS', val: '$2,45/dutzend', chg: '+2,10%', up: true, category: 'Geflügel & Eier', high: '$2,55', low: '$2,38', vol: '$820M', score: 86, rating: 'Vogelgrippe H5N1 Risiken', desc: 'Großhandelspreis für Frischeier; getrieben von Geflügelgrippe-Ausbrüchen weltweit.' },
  { id: 'com-broiler', name: 'Hähnchenfleisch (Broiler)', symbol: 'CHIK', val: '$1,28/lb', chg: '+0,35%', up: true, category: 'Viehwirtschaft', high: '$1,31', low: '$1,26', vol: '$1.6B', score: 77, rating: 'Günstigste Proteinquelle', desc: 'Weltweit beliebteste und futtereffizienteste Fleischsorte für Verbraucher.' },

  // ========================================================
  // 91-100: Baustoffe, Forst, Kohlenstoff & Umweltmärkte
  // ========================================================
  { id: 'com-lumber', name: 'Bauholz (Lumber CME)', symbol: 'LB', val: '$512,00/mbf', chg: '+1,80%', up: true, category: 'Forst- & Holzindustrie', high: '$525,00', low: '$504,00', vol: '$2.1B', score: 78, rating: 'US-Wohnungsbau Frühindikator', desc: 'Standardisiertes Nadelholz (2x4s) für den Holzrahmenbau in Nordamerika.' },
  { id: 'com-pulp', name: 'Zellstoff NBSK Pulp', symbol: 'PULP', val: '$880,00/t', chg: '+0,65%', up: true, category: 'Papier & Verpackung', high: '$890,00', low: '$872,00', vol: '$1.7B', score: 81, rating: 'E-Commerce Kartonagenbedarf', desc: 'Nördlicher gebleichter Nadelholzzellstoff für Hygiene- und Verpackungspapiere.' },
  { id: 'com-cement', name: 'Zementklinker (Clinker)', symbol: 'CEM', val: '$52,00/t', chg: '+0,20%', up: true, category: 'Baustoffe', high: '$53,00', low: '$51,50', vol: '$1.4B', score: 74, rating: 'Infrastrukturprogramme global', desc: 'Zwischenprodukt der Zementherstellung; gebrannt in Drehrohröfen für Betonbau.' },
  { id: 'com-hrc-steel', name: 'Warmbandstahl (HRC Steel)', symbol: 'HRC', val: '$785,00/t', chg: '+0,85%', up: true, category: 'Stahlfertigprodukte', high: '$795,00', low: '$778,00', vol: '$4.2B', score: 76, rating: 'Automobil & Haushaltsgeräte', desc: 'Hot-Rolled Coil Stahlbleche als Grundmaterial für Autos, Schiffe und Rohre.' },
  { id: 'com-rebar', name: 'Betonstahl (Rebar)', symbol: 'RBHR', val: '$580,00/t', chg: '-0,25%', up: false, category: 'Baustoffe (Stahl)', high: '$588,00', low: '$575,00', vol: '$3.5B', score: 72, rating: 'Hoch- & Tiefbauaktivität', desc: 'Rippenstahl zur Bewehrung von Stahlbetonbauteilen im Hoch- und Tiefbau.' },
  { id: 'com-bitumen', name: 'Bitumen Asphalt', symbol: 'BIT', val: '$460,00/t', chg: '+0,40%', up: true, category: 'Straßenbau', high: '$468,00', low: '$455,00', vol: '$1.8B', score: 77, rating: 'Autobahn-Sanierungsprogramme', desc: 'Schwerstes Raffinerieprodukt; Bindemittel für Straßenasphalt und Dachbahnen.' },
  { id: 'com-carbon-eua', name: 'EU-Emissionsrechte (EUA)', symbol: 'EUA', val: '€68,40/t', chg: '+1,95%', up: true, category: 'Umweltmärkte & CO2', high: '€70,20', low: '€67,10', vol: '€8.2B', score: 86, rating: 'ETS 1 Reform & Verknappung', desc: 'Recht zur Emission von einer Tonne CO2 im EU-Emissionshandelssystem.' },
  { id: 'com-carbon-uka', name: 'UK-Emissionsrechte (UKA)', symbol: 'UKA', val: '£42,50/t', chg: '+1,10%', up: true, category: 'Umweltmärkte & CO2', high: '£43,40', low: '£41,80', vol: '$1.4B', score: 80, rating: 'Britisches ETS-System', desc: 'CO2-Zertifikate für Industrie und Stromerzeuger im Vereinigten Königreich.' },
  { id: 'com-carbon-cca', name: 'Kalifornien Carbon (CCA)', symbol: 'CCA', val: '$38,20/t', chg: '+0,75%', up: true, category: 'Umweltmärkte & CO2', high: '$38,80', low: '$37,80', vol: '$1.1B', score: 82, rating: 'WCI Cap-and-Trade Programm', desc: 'Zertifikate der Western Climate Initiative (Kalifornien & Quebec) gegen Treibhausgase.' },
  { id: 'com-water-index', name: 'Wasser Index Nasdaq Veles', symbol: 'NQH2O', val: '$748,00/ac-ft', chg: '+0,85%', up: true, category: 'Ressource Wasser', high: '$760,00', low: '$740,00', vol: '$850M', score: 89, rating: 'Dürre & Wasserrechte Handel', desc: 'Erster regulierter Wasser-Terminkontrakt für Wasserrechte im US-Bundesstaat Kalifornien.' },
];

function getCommoditySubclass(item: RawCommodityItem): { id: string; name: string } {
  if (
    item.category.includes('Edelmetall') ||
    ['com-gold', 'com-silver', 'com-platinum', 'com-palladium', 'com-rhodium', 'com-iridium', 'com-ruthenium', 'com-osmium', 'com-goldsilver', 'com-platgold'].includes(item.id)
  ) {
    return { id: 'rohstoffe-precious', name: 'Edelmetalle & Wertspeicher' };
  }

  if (
    item.category.includes('Energie') ||
    item.category.includes('Gas') ||
    item.category.includes('Öl') ||
    item.category.includes('Kohle') ||
    item.category.includes('Kraftstoff') ||
    item.category.includes('Nuklear') ||
    item.category.includes('Petrochemie') ||
    item.category.includes('Biokraftstoffe') ||
    ['com-brent', 'com-wti', 'com-natgas', 'com-ttf', 'com-heatingoil', 'com-rbob', 'com-gasoil', 'com-dubai', 'com-uranium', 'com-coal-rot', 'com-coal-newc', 'com-propane', 'com-ethanol', 'com-jetfuel', 'com-naphtha'].includes(item.id)
  ) {
    return { id: 'rohstoffe-energy', name: 'Energie & Fossile Brennstoffe' };
  }

  if (
    item.category.includes('Industriemetall') ||
    item.category.includes('Batteriemetall') ||
    item.category.includes('Stahl') ||
    item.category.includes('Umwelt') ||
    item.category.includes('Wasser') ||
    item.category.includes('Straßenbau') ||
    item.category.includes('Baustoffe') ||
    item.category.includes('LME') ||
    ['com-copper', 'com-copper-lme', 'com-aluminum', 'com-zinc', 'com-nickel', 'com-lead', 'com-tin', 'com-ironore', 'com-lithium', 'com-cobalt', 'com-neodymium', 'com-titanium', 'com-moly', 'com-tungsten', 'com-magnesium', 'com-silicon', 'com-hrc-steel', 'com-rebar', 'com-bitumen', 'com-carbon-eua', 'com-carbon-uka', 'com-carbon-cca', 'com-water-index'].includes(item.id)
  ) {
    return { id: 'rohstoffe-industrial', name: 'Industriemetalle & Energiewende' };
  }

  // All remaining (Softs, Grains, Livestock, Forestry)
  return { id: 'rohstoffe-agrar', name: 'Agrarrohstoffe (Softs & Grains)' };
}

export const COMMODITY_ASSETS: MarketAsset[] = RAW_COMMODITY_ITEMS.map((item, idx) => {
  const subclassInfo = getCommoditySubclass(item);

  return {
    id: item.id,
    name: item.name,
    symbol: item.symbol,
    value: item.val,
    change: item.chg,
    isPositive: item.up,
    mainCategory: 'ROHSTOFFE',
    subclassId: subclassInfo.id,
    subclassName: subclassInfo.name,
    iconType: 'commodity',
    sparklinePath: item.up
      ? `M 0,${33 + (idx % 6)} Q 28,${36 - (idx % 5)} 55,${24 - (idx % 4)} T 115,${25 - (idx % 3)} T 165,${13 - (idx % 4)} T 200,${5 + (idx % 3)}`
      : `M 0,${15 + (idx % 4)} Q 30,${19 + (idx % 3)} 65,${29 + (idx % 4)} T 120,${28 + (idx % 3)} T 170,${37 + (idx % 4)} T 200,${41 - (idx % 2)}`,
    glowColor: item.up ? 'rgba(249, 191, 33, 0.25)' : 'rgba(244, 63, 94, 0.25)',
    borderColor: item.up ? 'rgba(249, 191, 33, 0.4)' : 'rgba(244, 63, 94, 0.4)',
    waveColor: item.up ? '#F9BF21' : '#F43F5E',
    category: item.category,
    high24h: item.high,
    low24h: item.low,
    volume24h: item.vol,
    aiScore: item.score,
    aiRating: item.rating,
    description: item.desc,
  };
});
