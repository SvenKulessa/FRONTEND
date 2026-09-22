export type VocabularyCategory =
  | 'ALL'
  | 'TRADING_QUANT'
  | 'AI_MODELS'
  | 'CRYPTO_WEB3'
  | 'FUNDAMENTAL'
  | 'MACRO_FOREX';

export type VocabularyLevel = 'Einsteiger' | 'Fortgeschritten' | 'Quant / Pro';

export interface VocabularyTerm {
  id: string;
  term: string;
  abbreviation?: string;
  category: VocabularyCategory;
  categoryLabel: string;
  level: VocabularyLevel;
  shortDefinition: string;
  detailedExplanation: string;
  formulaOrRule?: string;
  practicalExample: string;
  relatedAssets?: string[];
  keyTakeaway: string;
  searchTags: string[];
}

export const VOCABULARY_CATEGORIES: { id: VocabularyCategory; label: string; count?: number }[] = [
  { id: 'ALL', label: 'Alle Fachbegriffe' },
  { id: 'TRADING_QUANT', label: 'Trading & Quant' },
  { id: 'AI_MODELS', label: 'KI & Scoring-Modelle' },
  { id: 'CRYPTO_WEB3', label: 'Krypto & Web3' },
  { id: 'FUNDAMENTAL', label: 'Fundamentalanalyse' },
  { id: 'MACRO_FOREX', label: 'Makro & Devisen' },
];

export const VOCABULARY_TERMS: VocabularyTerm[] = [
  // TRADING & QUANT
  {
    id: 'orderbuch',
    term: 'Orderbuch',
    abbreviation: 'Order Book / L2 Depth',
    category: 'TRADING_QUANT',
    categoryLabel: 'Trading & Quant',
    level: 'Einsteiger',
    shortDefinition: 'Echtzeit-Verzeichnis aller offenen Kauf- (Bids) und Verkaufsaufträge (Asks) eines Marktes mit Preis und Volumen.',
    detailedExplanation:
      'Das Orderbuch offenbart das unmittelbare Zusammenspiel von Angebot und Nachfrage. Die linke bzw. grüne Seite zeigt die Kaufbereitschaft (Bids), die rechte bzw. rote Seite die Verkaufsbereitschaft (Asks). Große Order-Cluster (sog. Buy- oder Sell-Walls) signalisieren signifikante Unterstützungs- oder Widerstandszonen.',
    formulaOrRule: 'Markttiefe = Summe aller Bids vs. Summe aller Asks innerhalb von X% Bandbreite',
    practicalExample:
      'Im Bitcoin-Orderbuch stehen bei 64.000 $ Kaufaufträge über 350 BTC, während bei 65.000 $ Verkaufsaufträge über 120 BTC liegen. Das Übergewicht an Bids stützt kurzfristig den Kurs.',
    relatedAssets: ['BTC/USD', 'ETH/USD', 'SPX'],
    keyTakeaway: 'Das Orderbuch zeigt reale Liquidität und offenbart, wo institutionelle Marktteilnehmer ihre Limit-Orders platzieren.',
    searchTags: ['orderbuch', 'orderbook', 'market depth', 'bids', 'asks', 'tiefe', 'liquidität'],
  },
  {
    id: 'bid-ask-spread',
    term: 'Bid-Ask Spread',
    abbreviation: 'Spread',
    category: 'TRADING_QUANT',
    categoryLabel: 'Trading & Quant',
    level: 'Einsteiger',
    shortDefinition: 'Differenz zwischen dem höchsten aktuellen Kaufgebot (Bid) und dem niedrigsten Verkaufspreis (Ask).',
    detailedExplanation:
      'Der Spread ist der direkteste Indikator für Marktliquidität und Handelskosten. In hochliquiden Märkten wie EUR/USD oder S&P 500 beträgt der Spread oft nur Bruchteile eines Pips oder Cents. In illiquiden Nebenwerten oder volatilen Krypto-Märkten weitet sich der Spread aus, was zu höheren Ausführungskosten führt.',
    formulaOrRule: 'Spread = Ask-Preis - Bid-Preis (in Basispunkten: Spread / Mid-Price × 10.000)',
    practicalExample:
      'Bid für Apple liegt bei 224,10 $, Ask bei 224,12 $. Der Spread beträgt 0,02 $ (~0,9 Basispunkte) – extrem eng und günstig für Händler.',
    relatedAssets: ['AAPL', 'EUR/USD', 'DAX'],
    keyTakeaway: 'Je enger der Spread, desto liquider der Markt und desto geringer die impliziten Transaktionskosten.',
    searchTags: ['spread', 'bid', 'ask', 'geldkurs', 'briefkurs', 'liquidität', 'kosten'],
  },
  {
    id: 'slippage',
    term: 'Slippage',
    abbreviation: 'Execution Drift',
    category: 'TRADING_QUANT',
    categoryLabel: 'Trading & Quant',
    level: 'Fortgeschritten',
    shortDefinition: 'Differenz zwischen dem erwarteten Preis einer Marktorder und dem tatsächlich abgerechneten Ausführungspreis.',
    detailedExplanation:
      'Slippage tritt auf, wenn zwischen der Orderaufgabe und der Börsenausführung entweder der Markt schnell wegläuft (Latenz-Slippage) oder das Volumen der Marktorder die oberste Liquiditätsstufe im Orderbuch übersteigt (Depth-Slippage). Limit-Orders schützen vor negativer Slippage.',
    formulaOrRule: 'Slippage = |Ausführungspreis - Erwarteter Preis| / Erwarteter Preis × 100%',
    practicalExample:
      'Sie möchten 10 BTC per Market-Order zu 65.000 $ kaufen. Da im Orderbuch zu diesem Preis nur 4 BTC liegen, werden die restlichen 6 BTC zu 65.120 $ ausgeführt. Durchschnittspreis: 65.072 $ (Slippage: +0,11%).',
    relatedAssets: ['SOL/USD', 'BTC/USD', 'Brent Crude'],
    keyTakeaway: 'Hohe Latenz und geringe Markttiefe erhöhen die Slippage; deshalb überwacht Capital-AI die Orderbuchdichte in Sub-45ms.',
    searchTags: ['slippage', 'ausführung', 'abgleiten', 'market order', 'latenz'],
  },
  {
    id: 'vwap',
    term: 'VWAP',
    abbreviation: 'Volume-Weighted Average Price',
    category: 'TRADING_QUANT',
    categoryLabel: 'Trading & Quant',
    level: 'Quant / Pro',
    shortDefinition: 'Volumen-gewichteter Durchschnittspreis eines Handelsinstruments über einen definierten Zeitabschnitt (oft 1 Tag).',
    detailedExplanation:
      'Der VWAP ist der Goldstandard-Benchmark für institutionelle Händler und Pensionsfonds. Ein Kurs oberhalb des VWAP gilt als bullisch (Käufer dominieren mit hohem Volumen); Kurse unterhalb des VWAP signalisieren Bärenmarkt-Druck. Große Fonds streben an, Orders unterhalb des VWAP zu akkumulieren.',
    formulaOrRule: 'VWAP = ∑ (Preis × gehandeltes Volumen) / ∑ gehandeltes Gesamtvolumen',
    practicalExample:
      'Eine Aktie schließt bei 150 $, ihr Tages-VWAP liegt bei 147 $. Händler, die unter 147 $ gekauft haben, erzielten eine Outperformance gegenüber dem Gesamtmarkt.',
    relatedAssets: ['NVDA', 'SPX', 'BTC/USD'],
    keyTakeaway: 'VWAP filtert Kursspitzen mit geringem Volumen heraus und zeigt das echte institutionelle Preisniveau.',
    searchTags: ['vwap', 'volumen', 'durchschnitt', 'benchmark', 'quant', 'institutionell'],
  },
  {
    id: 'arbitrage',
    term: 'Arbitrage',
    abbreviation: 'Cross-Venue Arbitrage',
    category: 'TRADING_QUANT',
    categoryLabel: 'Trading & Quant',
    level: 'Fortgeschritten',
    shortDefinition: 'Gleichzeitiger Kauf und Verkauf desselben Vermögenswerts an unterschiedlichen Handelsplätzen zur risikofreien Ausnutzung von Kursdifferenzen.',
    detailedExplanation:
      'Da Märkte dezentral organisiert sind, können Kurse an Börse A (z.B. Binance) kurzfristig von Börse B (z.B. Kraken) abweichen. Arbitrage-Bots kaufen auf der günstigeren Börse und verkaufen zeitgleich auf der teureren. Dadurch schließen sich Preisspannen innerhalb von Millisekunden wieder.',
    formulaOrRule: 'Brutto-Arbitrage = Verkaufspreis (Börse B) - Kaufpreis (Börse A) > Transaktions- & Transfergebühren',
    practicalExample:
      'Bitcoin notiert auf Börse A bei 64.980 $ und auf Börse B bei 65.040 $. Ein Quant-Algorithmus schöpft den Spread von 60 $ pro BTC vor Gebühren ab.',
    relatedAssets: ['BTC/USD', 'ETH/USD', 'EUR/USD'],
    keyTakeaway: 'Arbitrageure sorgen für globale Markteffizienz und gleichen Preisunterschiede zwischen weltweiten Börsenplätzen aus.',
    searchTags: ['arbitrage', 'spread', 'börsen', 'kraken', 'binance', 'preisunterschied'],
  },
  {
    id: 'latenz',
    term: 'Latenz & FIX-Protokoll',
    abbreviation: 'Latency (Sub-45ms)',
    category: 'TRADING_QUANT',
    categoryLabel: 'Trading & Quant',
    level: 'Quant / Pro',
    shortDefinition: 'Verzögerungszeit zwischen der Entstehung eines Börsenkurses und dessen Empfang im Terminal bzw. der Orderausführung.',
    detailedExplanation:
      'Im Hochfrequenz- und Quant-Trading entscheiden Millisekunden über Rendite oder Slippage. Standard-Broker weisen oft Verzögerungen von 200–800 ms auf. Institutionelle Terminals wie Capital-AI nutzen direkte WebSocket-Streams und FIX-Protokolle, um Latenzen auf unter 45 ms zu drücken.',
    formulaOrRule: 'Gesamtlatenz = Börsenserver-Verarbeitung + Netzwerklaufzeit (Ping) + Client-Rendering',
    practicalExample:
      'Bei Veröffentlichung der US-Arbeitsmarktdaten reagiert der S&P 500 in 15 ms. Mit Sub-45ms Latenz sieht der Händler die Kursbewegung nahezu in Echtzeit.',
    relatedAssets: ['SPX', 'NDX', 'EUR/USD'],
    keyTakeaway: 'Niedrige Latenz verhindert das Handeln zu veralteten Kursen („Stale Quotes“) und schützt vor Ausführungsverlusten.',
    searchTags: ['latenz', 'latency', 'ping', 'echtzeit', 'sub-45ms', 'websocket'],
  },

  // KI & SCORING MODELLE
  {
    id: 'enterprise-scorer',
    term: 'Enterprise Scorer',
    abbreviation: 'Capital-AI Scorer (0–100)',
    category: 'AI_MODELS',
    categoryLabel: 'KI & Scoring-Modelle',
    level: 'Quant / Pro',
    shortDefinition: 'Proprietäres Multi-Faktor-KI-Bewertungsmodell von Capital-AI, das Momentum, Liquidität, Volatilität und Orderbuch-Metriken bündelt.',
    detailedExplanation:
      'Der Enterprise Scorer berechnet täglich aus 30 verifizierten 1D-Balken sowie Intraday-Orderbuchdaten einen objektiven Gesamtscore zwischen 0 und 100. Werte ab 70 gelten als stark bullisch mit solider Markttiefe, Werte unter 40 signalisieren erhöhtes Abwärtsrisiko oder mangelnde Liquidität.',
    formulaOrRule: 'Score = w₁·Trend + w₂·Momentum + w₃·Orderbuch-Tiefe + w₄·Volatilitäts-Qualität - w₅·Datenrisiko',
    practicalExample:
      'Bitcoin erreicht einen Enterprise Score von 94/100 durch anhaltendes Momentum, rekordhohe ETF-Nettozuflüsse und starke Bid-Wand-Unterstützung.',
    relatedAssets: ['BTC/USD', 'NVDA', 'SPX', 'Gold'],
    keyTakeaway: 'Ersetzt subjektives Bauchgefühl durch ein transparentes, datenbasiertes Multi-Faktor-Scoring.',
    searchTags: ['enterprise scorer', 'ki score', 'scoring', 'rating', 'multi-faktor', 'algorithmus'],
  },
  {
    id: 'buffett-value-check',
    term: 'Buffett Value Check',
    abbreviation: 'Moat & Value Engine',
    category: 'AI_MODELS',
    categoryLabel: 'KI & Scoring-Modelle',
    level: 'Einsteiger',
    shortDefinition: 'Konservatives KI-Bewertungssystem nach den Kriterien von Warren Buffett (hoher Burggraben, stabiler Cashflow, faire Bewertung).',
    detailedExplanation:
      'Analysiert Bilanzen, Verschuldung, Kapitalrendite (ROIC) und historische Preissetzungsmacht über 10 Jahre. Ziel ist die Identifikation von Spitzenunternehmen mit einer breiten Sicherheitsmarge (Margin of Safety), die auch in schweren Rezessionen Gewinne erwirtschaften.',
    formulaOrRule: 'Value Check = FCF-Wachstum > 8% & ROE > 15% & Verschuldung/EBITDA < 2,5 & Starker Burggraben',
    practicalExample:
      'Apple und Microsoft erreichen Bestnoten im Buffett Value Check dank unübertroffener Markentreue, gigantischem freiem Cashflow und hoher Eigenkapitalrendite.',
    relatedAssets: ['AAPL', 'MSFT', 'KO', 'BRK.B'],
    keyTakeaway: 'Fokussiert auf langfristige Substanz, unerschütterliche Wettbewerbsvorteile und faire Einstiegskurse.',
    searchTags: ['buffett', 'value', 'burggraben', 'moat', 'bilanz', 'cashflow', 'investieren'],
  },
  {
    id: 'sentiment-analyse',
    term: 'KI-Sentiment-Analyse',
    abbreviation: 'NLP Market Sentiment',
    category: 'AI_MODELS',
    categoryLabel: 'KI & Scoring-Modelle',
    level: 'Fortgeschritten',
    shortDefinition: 'Algorithmische Erfassung und semantische Bewertung der Marktstimmung aus Finanznachrichten, Social Feeds und SEC-Filings.',
    detailedExplanation:
      'Mithilfe natürlicher Sprachverarbeitung (Natural Language Processing / Transformers) werden täglich zehntausende Meldungen in Millisekunden gescannt. Tonalität, Dringlichkeit und thematische Relevanz fließen in einen aggregierten Stimmungsindex von -100 (panisch) bis +100 (euphorisch) ein.',
    formulaOrRule: 'Sentiment-Index = (Bullische Erwähnungen - Bärische Erwähnungen) / Gesamtvolumen gewichtet nach Relevanz',
    practicalExample:
      'Nach einer Rede der US-Notenbank Fed dreht der Sentiment-Score von neutral auf stark bullisch (+78), da Hinweise auf Zinsstopps semantisch identifiziert wurden.',
    relatedAssets: ['NDX', 'BTC/USD', 'EUR/USD'],
    keyTakeaway: 'Erkennt Stimmungsumschwünge lange bevor sie sich vollständig im Kurschart manifestieren.',
    searchTags: ['sentiment', 'stimmung', 'nlp', 'nachrichten', 'news', 'ki sentiment'],
  },
  {
    id: 'backtesting',
    term: 'Backtesting',
    abbreviation: 'Historical Simulation',
    category: 'AI_MODELS',
    categoryLabel: 'KI & Scoring-Modelle',
    level: 'Fortgeschritten',
    shortDefinition: 'Historische Simulation einer Handels- oder Anlagestrategie auf realen Kursdaten vergangener Jahre.',
    detailedExplanation:
      'Ermittelt, wie sich ein Regelwerk oder Algorithmus in der Vergangenheit bezüglich Rendite, maximalem Drawdown, Sharpe Ratio und Trefferquote verhalten hätte. Unverzichtbar vor dem Einsatz von echtem Kapital, um statistische Validität zu überprüfen.',
    formulaOrRule: 'Sharpe Ratio im Backtest = (Durchschnittsrendite - Risikofreier Zins) / Volatilität der Strategie',
    practicalExample:
      'Eine Momentum-Strategie auf den Nasdaq 100 erzielte im Backtest über 15 Jahre eine jährliche Rendite von 18,4% bei einem maximalen Drawdown von -22%.',
    relatedAssets: ['NDX', 'SPX', 'BTC/USD'],
    keyTakeaway: 'Ein sauberer Backtest deckt Schwächen auf, darf aber nicht durch Overfitting verzerrt werden.',
    searchTags: ['backtest', 'backtesting', 'historie', 'simulation', 'sharpe ratio', 'drawdown'],
  },

  // KRYPTO & WEB3
  {
    id: 'layer-1',
    term: 'Layer-1 & Layer-2',
    abbreviation: 'L1 / L2 Blockchains',
    category: 'CRYPTO_WEB3',
    categoryLabel: 'Krypto & Web3',
    level: 'Einsteiger',
    shortDefinition: 'Layer-1 ist das Basis-Blockchain-Netzwerk (z.B. Bitcoin, Ethereum); Layer-2 sind darauf aufbauende Skalierungslösungen.',
    detailedExplanation:
      'Layer-1 gewährleistet Dezentralisierung und Sicherheit (Konsens), stößt aber bei hohem Transaktionsaufkommen an Kapazitätsgrenzen. Layer-2-Netzwerke (Rollups wie Arbitrum oder Optimism) bündeln hunderte Transaktionen off-chain und schreiben nur das komprimierte Ergebnis auf die L1 zurück.',
    formulaOrRule: 'Durchsatz: L1 (~15–30 TPS bei Ethereum) vs. L2 (>2.000–10.000 TPS bei Bruchteil der Kosten)',
    practicalExample:
      'Eine Transaktion auf Ethereum Layer-1 kostet 8,50 $ Gasgebühr; dieselbe Operation auf einem Arbitrum Layer-2 kostet lediglich 0,04 $ bei identischer Sicherheit.',
    relatedAssets: ['ETH/USD', 'BTC/USD', 'SOL/USD'],
    keyTakeaway: 'Layer-2 macht dezentrale Anwendungen alltagstauglich, während Layer-1 als unveränderlicher Sicherheitsanker dient.',
    searchTags: ['layer-1', 'layer-2', 'l1', 'l2', 'blockchain', 'rollups', 'ethereum', 'skalierung'],
  },
  {
    id: 'tokenomics',
    term: 'Tokenomics',
    abbreviation: 'Token Economics',
    category: 'CRYPTO_WEB3',
    categoryLabel: 'Krypto & Web3',
    level: 'Fortgeschritten',
    shortDefinition: 'Mathematisches und ökonomisches Regelwerk, das Angebot, Emission, Nutzen und Verteilung eines Krypto-Tokens steuert.',
    detailedExplanation:
      'Entscheidet maßgeblich über das langfristige Wertsteigerungspotenzial. Zu den Kernmetriken gehören maximale Umlaufmenge (Max Supply), zirkulierende Menge (Circulating Supply), Sperrfristen für Gründer (Vesting) und Verbrennungsmechanismen (Burn Rate).',
    formulaOrRule: 'Verwässerungsrisiko = (Max Supply - Circulating Supply) / Circulating Supply × 100%',
    practicalExample:
      'Bitcoin hat ein hartes Limit von 21 Millionen Einheiten (definitiatorisch deflationär), während inflationäre Tokens mit hohen jährlichen Freischaltungen Verkaufsdruck erzeugen.',
    relatedAssets: ['BTC/USD', 'SOL/USD', 'UNI'],
    keyTakeaway: 'Ein herausragendes Technologieprojekt scheitert ohne durchdachte, anreizkompatible Tokenomics.',
    searchTags: ['tokenomics', 'supply', 'umlaufmenge', 'inflation', 'vesting', 'burn'],
  },
  {
    id: 'defi',
    term: 'DeFi (Decentralized Finance)',
    abbreviation: 'DeFi / TVL',
    category: 'CRYPTO_WEB3',
    categoryLabel: 'Krypto & Web3',
    level: 'Einsteiger',
    shortDefinition: 'Dezentrales Finanzökosystem auf Basis von Smart Contracts für Kreditvergabe, Handel und Zinserträge ohne Intermediäre.',
    detailedExplanation:
      'In DeFi ersetzen Open-Source-Protokolle traditionelle Banken und Broker. Nutzer können über Automated Market Maker (AMM wie Uniswap) tokengetauscht handeln oder über Lending-Protokolle (wie Aave) Zinsen verdienen. Zentraler Bewertungsmaßstab ist der Total Value Locked (TVL).',
    formulaOrRule: 'TVL = Gesamtwert aller in den Smart Contracts des Protokolls hinterlegten Vermögenswerte',
    practicalExample:
      'Ein Sparer hinterlegt Stablecoins in einem dezentralen Kreditprotokoll und erhält automatisch 5,2% p.a. Zinsen, finanziert durch Kreditnehmer, die Überbesicherungen hinterlegt haben.',
    relatedAssets: ['ETH/USD', 'UNI', 'AAVE'],
    keyTakeaway: 'Ermöglicht grenzenlosen, 24/7 verfügbaren Zugang zu Finanzdienstleistungen bei voller Transparenz auf der Blockchain.',
    searchTags: ['defi', 'decentralized finance', 'tvl', 'smart contracts', 'zinsen', 'lending'],
  },
  {
    id: 'on-chain-metriken',
    term: 'On-Chain-Metriken',
    abbreviation: 'Blockchain Analytics',
    category: 'CRYPTO_WEB3',
    categoryLabel: 'Krypto & Web3',
    level: 'Quant / Pro',
    shortDefinition: 'Quantitative Daten, die direkt aus der Blockchain ausgelesen werden (Wal-Bewegungen, Börsenzuflüsse, HODL-Wellen).',
    detailedExplanation:
      'Da alle Transaktionen öffentlich einsehbar sind, lassen sich Akkumulationsphasen institutioneller Großinvestoren („Whales“) in Echtzeit tracken. Hohe Zuflüsse auf Börsen deuten auf bevorstehenden Verkaufsdruck hin; Abflüsse in Cold-Storage-Wallets signalisieren langfristiges Vertrauen.',
    formulaOrRule: 'Exchange Netflow = Zuflüsse auf Börsen - Abflüsse in private Wallets (negativ = bullisch)',
    practicalExample:
      'Innerhalb von 24 Stunden verlassen 28.000 BTC die Börsenreserven in Richtung privater Verwahrung. Das verknappt das liquide Angebot an den Handelsplätzen.',
    relatedAssets: ['BTC/USD', 'ETH/USD'],
    keyTakeaway: 'On-Chain-Daten zeigen tatsächliche Kapitalströme ohne zeitliche Verzögerung von Zwischenberichten.',
    searchTags: ['on-chain', 'whales', 'netflow', 'blockchain daten', 'hodl', 'adressen'],
  },

  // FUNDAMENTALANALYSE
  {
    id: 'margin-of-safety',
    term: 'Margin of Safety',
    abbreviation: 'Sicherheitsmarge',
    category: 'FUNDAMENTAL',
    categoryLabel: 'Fundamentalanalyse',
    level: 'Einsteiger',
    shortDefinition: 'Sicherheitsabstand zwischen dem aktuellen Börsenkurs und dem geschätzten inneren (fairen) Wert einer Aktie.',
    detailedExplanation:
      'Geprägt von Benjamin Graham und Warren Buffett. Da jede Bewertung auf Zukunftsschätzungen beruht, schützt ein Kauf mit z.B. 25–35% Rabatt zum fairen Wert vor Fehlprognosen, unerwarteten Wirtschaftskrisen und Fehleinschätzungen des Managements.',
    formulaOrRule: 'Margin of Safety (%) = (Fairer Wert - Aktueller Aktienkurs) / Fairer Wert × 100%',
    practicalExample:
      'Ein Unternehmen wird fair auf 100 $ je Aktie taxiert. Wenn der Marktpreis infolge einer Panik auf 70 $ fällt, beträgt die Margin of Safety 30%.',
    relatedAssets: ['AAPL', 'BRK.B', 'DAX'],
    keyTakeaway: 'Wer mit breiter Sicherheitsmarge kauft, minimiert das Verlustrisiko und maximiert die langfristige Renditechance.',
    searchTags: ['margin of safety', 'sicherheitsmarge', 'graham', 'buffett', 'fairer wert', 'rabatt'],
  },
  {
    id: 'kgv-pe-ratio',
    term: 'Kurs-Gewinn-Verhältnis (KGV)',
    abbreviation: 'P/E Ratio',
    category: 'FUNDAMENTAL',
    categoryLabel: 'Fundamentalanalyse',
    level: 'Einsteiger',
    shortDefinition: 'Verhältnis zwischen dem aktuellen Aktienkurs und dem jährlichen Gewinn je Aktie (EPS).',
    detailedExplanation:
      'Gibt an, wie viele Jahre es bei gleichbleibendem Gewinn dauern würde, bis das Unternehmen den aktuellen Kaufpreis erwirtschaftet hat. Ein niedriges KGV kann auf eine Unterbewertung hindeuten; ein hohes KGV spiegelt meist hohe Wachstumserwartungen wider.',
    formulaOrRule: 'KGV = Aktienkurs / Gewinn pro Aktie (EPS)  [Gewinnrendite = 1 / KGV]',
    practicalExample:
      'Eine Aktie kostet 60 $ und erwirtschaftet 4 $ Gewinn je Aktie. Das KGV beträgt 15. Bei 20% jährlichem Gewinnwachstum relativiert sich dieses KGV jedoch schnell (PEG Ratio).',
    relatedAssets: ['MSFT', 'NVDA', 'ALV'],
    keyTakeaway: 'KGV immer im historischen Kontext und im Vergleich zur jeweiligen Branche (Peers) betrachten.',
    searchTags: ['kgv', 'pe', 'pe ratio', 'gewinn', 'aktienkurs', 'bewertung'],
  },
  {
    id: 'free-cash-flow',
    term: 'Free Cash Flow (FCF)',
    abbreviation: 'Freier Cashflow',
    category: 'FUNDAMENTAL',
    categoryLabel: 'Fundamentalanalyse',
    level: 'Fortgeschritten',
    shortDefinition: 'Barvermögen, das einem Unternehmen nach Abzug aller operativen Ausgaben und Investitionen (CapEx) real zur freien Verfügung steht.',
    detailedExplanation:
      'Buchhalterische Gewinne können durch bilanzielle Gestaltungsspielräume verzerrt werden („Earnings are an opinion, cash is a fact“). Der FCF zeigt, wie viel echtes Geld für Dividenden, Aktienrückkäufe, Schuldenabbau oder zukunftsweisende Zukäufe übrig bleibt.',
    formulaOrRule: 'Free Cash Flow = Operativer Cashflow - Investitionsausgaben (CapEx)',
    practicalExample:
      'Microsoft generiert jährlich über 70 Milliarden Dollar an Free Cash Flow – Treibstoff für milliardenschwere KI-Investitionen und kontinuierliche Dividenden.',
    relatedAssets: ['MSFT', 'AAPL', 'GOOGL'],
    keyTakeaway: 'Solider, wachsender Free Cash Flow ist das verlässlichste Schutzschild gegen Insolvenz und Liquiditätskrisen.',
    searchTags: ['free cash flow', 'fcf', 'cashflow', 'liquidität', 'investitionen', 'capex'],
  },
  {
    id: 'burggraben-moat',
    term: 'Wirtschaftlicher Burggraben',
    abbreviation: 'Economic Moat',
    category: 'FUNDAMENTAL',
    categoryLabel: 'Fundamentalanalyse',
    level: 'Einsteiger',
    shortDefinition: 'Struktureller, dauerhafter Wettbewerbsvorteil, der ein Unternehmen vor Konkurrenz und Margenerosion schützt.',
    detailedExplanation:
      'Typische Burggräben sind: 1. Netzwerkeffekte (z.B. Visa, Mastercard), 2. Hohe Wechselkosten (z.B. Enterprise-Software), 3. Kostenvorteile (Skaleneffekte), 4. Immaterielle Vermögenswerte (starke Marken wie Coca-Cola oder exklusive Patente).',
    formulaOrRule: 'Indikator: Konstant hohe Gesamtkapitalrendite (ROIC > 15%) über mindestens 10 aufeinanderfolgende Jahre.',
    practicalExample:
      'Nvidia besitzt durch die Software-Plattform CUDA einen gewaltigen Burggraben: KI-Entwickler weltweit sind auf Nvidias Programmierumgebung geschult.',
    relatedAssets: ['NVDA', 'V', 'KO'],
    keyTakeaway: 'Ein tiefer Burggraben sichert überdurchschnittliche Gewinne auch in wirtschaftlich stürmischen Phasen.',
    searchTags: ['burggraben', 'moat', 'wettbewerbsvorteil', 'markenmacht', 'monopol'],
  },

  // MAKROÖKONOMIE & DEVISEN (FOREX)
  {
    id: 'leitzins',
    term: 'Leitzins & Fed Funds Rate',
    abbreviation: 'Central Bank Rate',
    category: 'MACRO_FOREX',
    categoryLabel: 'Makro & Devisen',
    level: 'Einsteiger',
    shortDefinition: 'Von den Notenbanken (z.B. US-Fed, EZB) festgelegter Zinssatz, zu dem sich Geschäftsbanken Zentralbankgeld leihen können.',
    detailedExplanation:
      'Der Leitzins ist das schärfste Schwert der Geldpolitik. Steigen die Zinsen, verteuern sich Kredite, die Wirtschaft kühlt ab und Anleihen bieten attraktivere risikofreie Renditen – was Druck auf Aktien- und Kryptomärkte ausübt. Sinkende Zinsen wirken stimulierend.',
    formulaOrRule: 'Zinsentscheid wirkt invers auf Barwert zukünftiger Cashflows: Höhere Zinsen = Niedrigere Kursbewertungen',
    practicalExample:
      'Wenn die Fed den Leitzins um 50 Basispunkte senkt, reagieren Wachstums- und Tech-Aktien häufig mit kräftigen Kursgewinnen.',
    relatedAssets: ['SPX', 'NDX', 'EUR/USD', 'Gold'],
    keyTakeaway: '„Don’t fight the Fed“: Der globale Zinszyklus ist der stärkste makroökonomische Treiber für alle Anlageklassen.',
    searchTags: ['leitzins', 'fed', 'ezb', 'zinsen', 'geldpolitik', 'rate cut'],
  },
  {
    id: 'pip',
    term: 'PIP (Percentage in Point)',
    abbreviation: 'Pip / Tick',
    category: 'MACRO_FOREX',
    categoryLabel: 'Makro & Devisen',
    level: 'Einsteiger',
    shortDefinition: 'Standardisierte Maßeinheit für Kursveränderungen im Devisenmarkt (meist die 4. Dezimalstelle: 0,0001).',
    detailedExplanation:
      'Da sich Devisenkurse im Tagesverlauf oft nur um Bruchteile eines Cents bewegen, werden Kursschwankungen in Pips gemessen. Bei Devisenpaaren mit Japanischem Yen (JPY) ist die 2. Dezimalstelle (0,01) 1 Pip.',
    formulaOrRule: '1 Pip bei EUR/USD (z.B. 1,0850 auf 1,0851) = 0,0001 Währungseinheiten',
    practicalExample:
      'EUR/USD steigt von 1,0820 auf 1,0865. Das entspricht einem Kursgewinn von 45 Pips. Bei einem Standard-Lot (100.000 €) entspricht 1 Pip ca. 10 $.',
    relatedAssets: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
    keyTakeaway: 'Die universelle Einheit zur Berechnung von Renditen, Spreads und Stop-Loss-Distanzen im Forex-Trading.',
    searchTags: ['pip', 'forex', 'devisen', 'punktwert', 'eurusd', 'lot'],
  },
  {
    id: 'vix',
    term: 'VIX (Volatilitätsindex)',
    abbreviation: 'CBOE Volatility Index',
    category: 'MACRO_FOREX',
    categoryLabel: 'Makro & Devisen',
    level: 'Fortgeschritten',
    shortDefinition: 'Das sogenannte „Angstbarometer“ der Finanzmärkte; spiegelt die erwartete 30-Tage-Kursschwankung des S&P 500 wider.',
    detailedExplanation:
      'Wird mathematisch aus den Optionspreisen des S&P 500 abgeleitet. Ein VIX unter 15 signalisiert Marktruhe und geringe Sorge; Werte über 30 deuten auf akute Panik und Turbulenzen hin. Häufig markieren VIX-Spitzen lukrative antizyklische Kaufgelegenheiten.',
    formulaOrRule: 'Historische Faustregel: „When the VIX is high, it’s time to buy. When the VIX is low, look out below.“',
    practicalExample:
      'Während einer plötzlichen Geopolitik-Krise springt der VIX von 14 auf 38 Punkte an; der S&P 500 korrigiert parallel um 4% an einem Tag.',
    relatedAssets: ['SPX', 'Gold', 'NDX'],
    keyTakeaway: 'Misst nicht die tatsächliche Richtung, sondern die Intensität der erwarteten Kursschwankungen und Absicherungskosten.',
    searchTags: ['vix', 'volatilität', 'angstbarometer', 'schwankung', 'absicherung', 'optionen'],
  },
];
