import { MarketAsset } from '../../types';

interface RawForexItem {
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

export const RAW_FOREX_ITEMS: RawForexItem[] = [
  // ========================================================
  // 1-30: Majors & US-Dollar Währungspaare
  // ========================================================
  { id: 'fx-eurusd', name: 'Euro / US-Dollar', symbol: 'EUR/USD', val: '1,0892', chg: '+0,18%', up: true, category: 'Major FX', high: '1,0920', low: '1,0865', vol: '$520B', score: 78, rating: 'Neutraler Trend', desc: 'Weltweit liquidestes Währungspaar, getrieben durch EZB- und Fed-Zinspolitik.' },
  { id: 'fx-gbpusd', name: 'Britisches Pfund / US-Dollar', symbol: 'GBP/USD', val: '1,2745', chg: '+0,32%', up: true, category: 'Major FX', high: '1,2780', low: '1,2690', vol: '$310B', score: 81, rating: 'Leichte Bullishness', desc: 'Cable: Hohe Sensitivität gegenüber Bank of England Zinsentscheiden.' },
  { id: 'fx-usdjpy', name: 'US-Dollar / Japanischer Yen', symbol: 'USD/JPY', val: '155,40', chg: '-0,45%', up: false, category: 'Major FX', high: '156,20', low: '154,80', vol: '$420B', score: 68, rating: 'BoJ Intervention Risiko', desc: 'Zinsdifferenztrade unter genauer Beobachtung der Bank of Japan Geldpolitik.' },
  { id: 'fx-usdchf', name: 'US-Dollar / Schweizer Franken', symbol: 'USD/CHF', val: '0,8985', chg: '-0,12%', up: false, category: 'Major FX', high: '0,9020', low: '0,8960', vol: '$160B', score: 74, rating: 'Sicherer Hafen', desc: 'Klassischer Zufluchtsort in Phasen makroökonomischer Unsicherheit.' },
  { id: 'fx-audusd', name: 'Australischer Dollar / US-Dollar', symbol: 'AUD/USD', val: '0,6680', chg: '+0,55%', up: true, category: 'Commodity FX', high: '0,6710', low: '0,6630', vol: '$190B', score: 82, rating: 'China-Konjunktur Hebel', desc: 'Aussie: Stark korreliert mit asiatischer Nachfrage und Industriemetallen.' },
  { id: 'fx-usdcad', name: 'US-Dollar / Kanadischer Dollar', symbol: 'USD/CAD', val: '1,3640', chg: '-0,22%', up: false, category: 'Commodity FX', high: '1,3685', low: '1,3610', vol: '$175B', score: 75, rating: 'Ölpreis-Sensitiv', desc: 'Loonie: Enge Bindung an Rohölpreise und nordamerikanische Handelsströme.' },
  { id: 'fx-nzdusd', name: 'Neuseeland-Dollar / US-Dollar', symbol: 'NZD/USD', val: '0,6120', chg: '+0,41%', up: true, category: 'Commodity FX', high: '0,6150', low: '0,6085', vol: '$95B', score: 79, rating: 'RBNZ Zinsstütze', desc: 'Kiwi: Agrar- und Milchexport-getriebene Währung mit solidem Renditeniveau.' },
  { id: 'fx-usdcnh', name: 'US-Dollar / Offshore Yuan', symbol: 'USD/CNH', val: '7,2640', chg: '+0,08%', up: true, category: 'Asian FX', high: '7,2720', low: '7,2580', vol: '$140B', score: 76, rating: 'PBoC Kursfixierung', desc: 'Chinas Offshore-Renminbi, maßgeblich beeinflusst durch die PBOC-Zentralbankpolitik.' },
  { id: 'fx-usdhkd', name: 'US-Dollar / Hongkong-Dollar', symbol: 'USD/HKD', val: '7,8085', chg: '+0,01%', up: true, category: 'Pegged FX', high: '7,8120', low: '7,8050', vol: '$110B', score: 88, rating: 'Fester Währungskorridor', desc: 'Gebunden an den US-Dollar im definierten Interventionsband von 7,75 bis 7,85 HKD.' },
  { id: 'fx-usdsgd', name: 'US-Dollar / Singapur-Dollar', symbol: 'USD/SGD', val: '1,3480', chg: '-0,08%', up: false, category: 'Asian Hub FX', high: '1,3510', low: '1,3460', vol: '$80B', score: 84, rating: 'MAS Bandkorridor', desc: 'Von der Währungsbehörde Singapurs über einen nominalen Wechselkurskorridor gesteuert.' },
  { id: 'fx-usdkrw', name: 'US-Dollar / Südkoreanischer Won', symbol: 'USD/KRW', val: '1.382,50', chg: '-0,35%', up: false, category: 'Asian FX', high: '1.389,00', low: '1.378,00', vol: '$75B', score: 77, rating: 'Halbleiterexporte Indikator', desc: 'Sehr sensibel gegenüber Technologiezyklen und Speicherchifrachterlösen.' },
  { id: 'fx-usdtwd', name: 'US-Dollar / Taiwan-Dollar', symbol: 'USD/TWD', val: '32,38', chg: '-0,15%', up: false, category: 'Asian FX', high: '32,48', low: '32,30', vol: '$45B', score: 79, rating: 'Tech-Kapitalzuflüsse', desc: 'Getrieben von internationalen Portfoliozuflüssen in den Halbleiter-Sektor.' },
  { id: 'fx-usdinr', name: 'US-Dollar / Indische Rupie', symbol: 'USD/INR', val: '83,52', chg: '+0,04%', up: true, category: 'Asian EM', high: '83,60', low: '83,45', vol: '$85B', score: 82, rating: 'Starkes BIP-Wachstum', desc: 'Indiens Wachstumsmotor stützt die Rupie, RBI glättet Volatilitätsspitzen.' },
  { id: 'fx-usdmxn', name: 'US-Dollar / Mexikanischer Peso', symbol: 'USD/MXN', val: '18,15', chg: '+0,48%', up: true, category: 'LatAm EM', high: '18,30', low: '18,05', vol: '$95B', score: 77, rating: 'Nearshoring & Zinsen', desc: 'Sehr liquide Schwellenländerwährung mit attraktivem Carry-Potenzial.' },
  { id: 'fx-usdbrl', name: 'US-Dollar / Brasilianischer Real', symbol: 'USD/BRL', val: '5,42', chg: '+0,38%', up: true, category: 'LatAm EM', high: '5,48', low: '5,38', vol: '$70B', score: 72, rating: 'Agrar & Rohstoffe', desc: 'Real getrieben durch Soja-, Eisenerzexporte und Selic-Leitzinsniveau.' },
  { id: 'fx-usdzar', name: 'US-Dollar / Südafrikanischer Rand', symbol: 'USD/ZAR', val: '18,25', chg: '-0,62%', up: false, category: 'Africa EM', high: '18,45', low: '18,15', vol: '$60B', score: 71, rating: 'Rohstoffexporteur', desc: 'Rand profitiert von Edelmetallpreisen, reagiert jedoch sensibel auf lokale Politik.' },
  { id: 'fx-usdtry', name: 'US-Dollar / Türkische Lira', symbol: 'USD/TRY', val: '32,85', chg: '+0,25%', up: true, category: 'EM High Yield', high: '33,00', low: '32,70', vol: '$50B', score: 60, rating: 'Inflation & Zinspolitik', desc: 'Hohe Nominalzinsen der CBRT bei anhaltendem strukturellem Abwertungsdruck.' },
  { id: 'fx-usdpln', name: 'US-Dollar / Polnischer Zloty', symbol: 'USD/PLN', val: '3,98', chg: '-0,30%', up: false, category: 'CEE FX', high: '4,01', low: '3,96', vol: '$40B', score: 78, rating: 'Solides CEE Profil', desc: 'Führende osteuropäische Währung, eng an europäische Lieferketten gekoppelt.' },
  { id: 'fx-usdsek', name: 'US-Dollar / Schwedische Krone', symbol: 'USD/SEK', val: '10,52', chg: '-0,38%', up: false, category: 'Nordic FX', high: '10,60', low: '10,48', vol: '$65B', score: 74, rating: 'Riksbank Zinswende', desc: 'Skandinavische Krone mit hoher Sensitivität gegenüber dem europäischen Wachstumszyklus.' },
  { id: 'fx-usdnok', name: 'US-Dollar / Norwegische Krone', symbol: 'USD/NOK', val: '10,68', chg: '-0,15%', up: false, category: 'Nordic FX', high: '10,75', low: '10,62', vol: '$55B', score: 76, rating: 'Nordsee Energie FX', desc: 'Öl- und gasgetriebene Leitwährung mit robustem Staatsfonds-Hintergrund.' },
  { id: 'fx-usddkk', name: 'US-Dollar / Dänische Krone', symbol: 'USD/DKK', val: '6,92', chg: '-0,12%', up: false, category: 'Pegged FX', high: '6,95', low: '6,90', vol: '$35B', score: 82, rating: 'ERM II Anbindung', desc: 'Über den europäischen Wechselkursmechanismus ERM II eng an den Euro gebunden.' },
  { id: 'fx-usdczk', name: 'US-Dollar / Tschechische Krone', symbol: 'USD/CZK', val: '23,12', chg: '-0,20%', up: false, category: 'CEE FX', high: '23,25', low: '23,05', vol: '$30B', score: 77, rating: 'Industrieorientiert', desc: 'Tschechische Krone gestützt durch starke Automobil- und Maschinenbauexporte.' },
  { id: 'fx-usdhuf', name: 'US-Dollar / Ungarischer Forint', symbol: 'USD/HUF', val: '368,40', chg: '-0,42%', up: false, category: 'CEE High Yield', high: '371,00', low: '366,50', vol: '$28B', score: 71, rating: 'MNB Zinskorridor', desc: 'Attraktive Renditen bei ausgeprägter Volatilität im osteuropäischen Raum.' },
  { id: 'fx-usdils', name: 'US-Dollar / Israelischer Schekel', symbol: 'USD/ILS', val: '3,72', chg: '-0,25%', up: false, category: 'Middle East FX', high: '3,75', low: '3,70', vol: '$25B', score: 75, rating: 'Tech & Devisenreserven', desc: 'Gestützt durch Israels Hightech-Sektor und erhebliche Devisenreserven der Zentralbank.' },
  { id: 'fx-usdthb', name: 'US-Dollar / Thailändischer Baht', symbol: 'USD/THB', val: '36,65', chg: '-0,18%', up: false, category: 'Asian FX', high: '36,80', low: '36,55', vol: '$32B', score: 76, rating: 'Tourismus & Exporte', desc: 'Währung Thailands profitiert von anziehenden Touristenströmen und Elektronikexporten.' },
  { id: 'fx-usdidr', name: 'US-Dollar / Indonesische Rupiah', symbol: 'USD/IDR', val: '16.380,00', chg: '+0,12%', up: true, category: 'Asian EM', high: '16.420,00', low: '16.340,00', vol: '$26B', score: 73, rating: 'Nickel & Rohstoffboom', desc: 'Indonesiens Währung im Fokus globaler Batterie- und Rohstoffinvestitionen.' },
  { id: 'fx-usdmyr', name: 'US-Dollar / Malaysischer Ringgit', symbol: 'USD/MYR', val: '4,71', chg: '-0,10%', up: false, category: 'Asian FX', high: '4,73', low: '4,69', vol: '$22B', score: 75, rating: 'Chip Packaging Hub', desc: 'Malaysia profitiert von Investitionen in Halbleiter-Packaging und Testzentren.' },
  { id: 'fx-usdphp', name: 'US-Dollar / Philippinischer Peso', symbol: 'USD/PHP', val: '58,65', chg: '+0,08%', up: true, category: 'Asian EM', high: '58,85', low: '58,50', vol: '$18B', score: 72, rating: 'Rücküberweisungen stark', desc: 'Wichtige Stütze durch Devisenüberweisungen von Auslandskräften weltweit.' },
  { id: 'fx-usdaed', name: 'US-Dollar / VAE-Dirham', symbol: 'USD/AED', val: '3,6725', chg: '0,00%', up: true, category: 'Pegged FX', high: '3,6730', low: '3,6720', vol: '$45B', score: 90, rating: 'Feste VAE-Dollar-Bindung', desc: 'Stabile feste Währungsanbindung der Vereinigten Arabischen Emirate an den US-Dollar.' },
  { id: 'fx-usdsar', name: 'US-Dollar / Saudi-Riyal', symbol: 'USD/SAR', val: '3,7505', chg: '0,00%', up: true, category: 'Pegged FX', high: '3,7510', low: '3,7500', vol: '$50B', score: 91, rating: 'Feste Saudi-Dollar-Bindung', desc: 'Fester Peg der saudischen Währung an den US-Dollar mit gewaltigen Währungsreserven.' },

  // ========================================================
  // 31-50: Euro Währungskreuze (EUR Crosses)
  // ========================================================
  { id: 'fx-eurgbp', name: 'Euro / Britisches Pfund', symbol: 'EUR/GBP', val: '0,8545', chg: '-0,14%', up: false, category: 'Euro Cross', high: '0,8570', low: '0,8525', vol: '$140B', score: 73, rating: 'Rangebound Handel', desc: 'Direktes Barometer für die relative europäische und britische Wirtschaftsentwicklung.' },
  { id: 'fx-eurjpy', name: 'Euro / Japanischer Yen', symbol: 'EUR/JPY', val: '169,25', chg: '-0,28%', up: false, category: 'Euro Cross', high: '170,10', low: '168,70', vol: '$180B', score: 72, rating: 'Volatiler Carry-Cross', desc: 'Beliebtes Carry-Trade-Paar mit hoher Intraday-Schwankungsbreite.' },
  { id: 'fx-eurchf', name: 'Euro / Schweizer Franken', symbol: 'EUR/CHF', val: '0,9785', chg: '+0,06%', up: true, category: 'Euro Cross', high: '0,9815', low: '0,9760', vol: '$85B', score: 75, rating: 'SNB Interventionszone', desc: 'Eng von der Schweizerischen Nationalbank überwachte Paritätszone.' },
  { id: 'fx-euraud', name: 'Euro / Australischer Dollar', symbol: 'EUR/AUD', val: '1,6305', chg: '-0,35%', up: false, category: 'Euro Cross', high: '1,6380', low: '1,6260', vol: '$75B', score: 74, rating: 'Aussie Stärke', desc: 'Wird oft für Sektorrotationen zwischen Industrie- und Rohstoffländern genutzt.' },
  { id: 'fx-eurcad', name: 'Euro / Kanadischer Dollar', symbol: 'EUR/CAD', val: '1,4855', chg: '-0,05%', up: false, category: 'Euro Cross', high: '1,4910', low: '1,4820', vol: '$60B', score: 72, rating: 'Transatlantischer Cross', desc: 'Handelspaar zwischen transatlantischen Handelspartnern mit geringer Basislatenz.' },
  { id: 'fx-eurnzd', name: 'Euro / Neuseeland-Dollar', symbol: 'EUR/NZD', val: '1,7795', chg: '-0,22%', up: false, category: 'Euro Cross', high: '1,7860', low: '1,7740', vol: '$42B', score: 73, rating: 'Carry & Divergenz', desc: 'Spiegelt Zinsunterschiede zwischen Frankfurt und Wellington wider.' },
  { id: 'fx-eursek', name: 'Euro / Schwedische Krone', symbol: 'EUR/SEK', val: '11,46', chg: '-0,20%', up: false, category: 'Nordic Cross', high: '11,52', low: '11,42', vol: '$50B', score: 75, rating: 'Skandinavien Zyklus', desc: 'Wichtiger Wechselkurs für schwedische Exporte in den EU-Binnenmarkt.' },
  { id: 'fx-eurnok', name: 'Euro / Norwegische Krone', symbol: 'EUR/NOK', val: '11,62', chg: '+0,05%', up: true, category: 'Nordic Cross', high: '11,68', low: '11,58', vol: '$45B', score: 76, rating: 'Energiehandel Eurozone', desc: 'Bedeutendes Devisenpaar für europäische Erdgas- und Stromimporte.' },
  { id: 'fx-eurpln', name: 'Euro / Polnischer Zloty', symbol: 'EUR/PLN', val: '4,33', chg: '-0,15%', up: false, category: 'CEE Cross', high: '4,36', low: '4,31', vol: '$55B', score: 81, rating: 'Zentraler CEE Leitkurs', desc: 'Deutsch-polnische Industrieströme und EU-Fördermittelzuflüsse prägen den Zloty.' },
  { id: 'fx-eurhuf', name: 'Euro / Ungarischer Forint', symbol: 'EUR/HUF', val: '401,20', chg: '-0,25%', up: false, category: 'CEE Cross', high: '403,50', low: '399,80', vol: '$38B', score: 72, rating: 'Zinsdifferenzhandel', desc: 'Hohe Zinsaufschläge in Budapest sorgen für reges Carry-Trade-Interesse.' },
  { id: 'fx-eurczk', name: 'Euro / Tschechische Krone', symbol: 'EUR/CZK', val: '25,18', chg: '-0,08%', up: false, category: 'CEE Cross', high: '25,26', low: '25,12', vol: '$35B', score: 78, rating: 'Eng verzahnte Industrie', desc: 'Stabile Währungsbeziehung mit minimalen Abweichungen zum Fertigungskern.' },
  { id: 'fx-eurtry', name: 'Euro / Türkische Lira', symbol: 'EUR/TRY', val: '35,78', chg: '+0,45%', up: true, category: 'EM Cross', high: '36,00', low: '35,60', vol: '$32B', score: 62, rating: 'Hoher Carry Spread', desc: 'Wechselkurs geprägt von der hohen Inflationsdifferenz zur Eurozone.' },
  { id: 'fx-eurzar', name: 'Euro / Südafrikanischer Rand', symbol: 'EUR/ZAR', val: '19,88', chg: '-0,45%', up: false, category: 'EM Cross', high: '20,05', low: '19,75', vol: '$28B', score: 71, rating: 'Rohstoffexport Rand', desc: 'Kombiniert südafrikanische Minenexporte mit europäischer Nachfrage.' },
  { id: 'fx-eurmxn', name: 'Euro / Mexikanischer Peso', symbol: 'EUR/MXN', val: '19,76', chg: '+0,65%', up: true, category: 'LatAm Cross', high: '19,95', low: '19,60', vol: '$30B', score: 76, rating: 'Banxico Renditeattraktivität', desc: 'Attraktive Kupons mexikanischer Staatsanleihen für europäische Investoren.' },
  { id: 'fx-eursgd', name: 'Euro / Singapur-Dollar', symbol: 'EUR/SGD', val: '1,4680', chg: '+0,10%', up: true, category: 'Asian Cross', high: '1,4720', low: '1,4650', vol: '$32B', score: 83, rating: 'Finanzplatz-Drehkreuz', desc: 'Austausch zwischen europäischen Banken und asiatischen Wealth Hubs.' },
  { id: 'fx-eurhkd', name: 'Euro / Hongkong-Dollar', symbol: 'EUR/HKD', val: '8,5050', chg: '+0,18%', up: true, category: 'Asian Cross', high: '8,5300', low: '8,4850', vol: '$26B', score: 78, rating: 'Handelsfinanzierung Asien', desc: 'Direkter Eurokurs gegen das an den Dollar gebundene Finanzzentrum Hongkong.' },
  { id: 'fx-eurcnh', name: 'Euro / Offshore Yuan', symbol: 'EUR/CNH', val: '7,9120', chg: '+0,25%', up: true, category: 'Asian Cross', high: '7,9400', low: '7,8900', vol: '$36B', score: 77, rating: 'Bilaterale Handelsströme', desc: 'Spiegelt die massiven Güterexporte und Importe zwischen der EU und China wider.' },
  { id: 'fx-eurdkk', name: 'Euro / Dänische Krone', symbol: 'EUR/DKK', val: '7,4605', chg: '0,00%', up: true, category: 'Pegged Cross', high: '7,4615', low: '7,4595', vol: '$20B', score: 95, rating: 'ERM II Festkurs', desc: 'Offizielle Leitkursbindung im Wechselkursmechanismus II der Europäischen Union.' },
  { id: 'fx-eurils', name: 'Euro / Israelischer Schekel', symbol: 'EUR/ILS', val: '4,05', chg: '-0,08%', up: false, category: 'Middle East Cross', high: '4,08', low: '4,03', vol: '$18B', score: 76, rating: 'Innovations- & Tech-Handel', desc: 'Bedeutend für europäische R&D-Kooperationen und Direktinvestitionen.' },
  { id: 'fx-eurbrl', name: 'Euro / Brasilianischer Real', symbol: 'EUR/BRL', val: '5,90', chg: '+0,55%', up: true, category: 'LatAm Cross', high: '5,96', low: '5,85', vol: '$24B', score: 73, rating: 'Agrar- & Rohstoffströme', desc: 'Devisenpaar für europäische Agrarimporte und Industrieexporte nach Südamerika.' },

  // ========================================================
  // 51-65: Britisches Pfund Währungskreuze (GBP Crosses)
  // ========================================================
  { id: 'fx-gbpjpy', name: 'Britisches Pfund / Yen', symbol: 'GBP/JPY', val: '198,10', chg: '-0,15%', up: false, category: 'Pound Cross', high: '199,20', low: '197,40', vol: '$150B', score: 76, rating: 'Der Drache (High Volatility)', desc: 'Hohes Momentum-Trading-Paar mit traditionell starken Trendbewegungen.' },
  { id: 'fx-gbpchf', name: 'Britisches Pfund / Franken', symbol: 'GBP/CHF', val: '1,1450', chg: '+0,20%', up: true, category: 'Pound Cross', high: '1,1490', low: '1,1410', vol: '$55B', score: 76, rating: 'Stabile Zinsdifferenz', desc: 'Spiegelt Renditeunterschiede zwischen UK-Gilts und Eidgenossenanleihen.' },
  { id: 'fx-gbpaud', name: 'Britisches Pfund / Aussie', symbol: 'GBP/AUD', val: '1,9080', chg: '-0,22%', up: false, category: 'Pound Cross', high: '1,9160', low: '1,9020', vol: '$70B', score: 73, rating: 'High Beta Devisenpaar', desc: 'Sehr dynamisches Cross-Paar mit weiten Handelsspannen im asiatischen Handel.' },
  { id: 'fx-gbpcad', name: 'Britisches Pfund / Loonie', symbol: 'GBP/CAD', val: '1,7385', chg: '+0,10%', up: true, category: 'Pound Cross', high: '1,7440', low: '1,7330', vol: '$45B', score: 75, rating: 'Commonwealth Handel', desc: 'Stabile Wirtschaftsbeziehungen zwischen London und Ottawa.' },
  { id: 'fx-gbpnzd', name: 'Britisches Pfund / Kiwi', symbol: 'GBP/NZD', val: '2,0825', chg: '-0,08%', up: false, category: 'Pound Cross', high: '2,0920', low: '2,0750', vol: '$32B', score: 74, rating: 'Trans-ozeanischer Cross', desc: 'Hohe Zinsvolatilität getrieben durch BoE- und RBNZ-Verlautbarungen.' },
  { id: 'fx-gbpsek', name: 'Britisches Pfund / Schwedenkrone', symbol: 'GBP/SEK', val: '13,41', chg: '-0,05%', up: false, category: 'Pound Cross', high: '13,48', low: '13,35', vol: '$22B', score: 75, rating: 'Nordsee Handelsstrom', desc: 'Bedeutendes Devisenpaar für den Warenaustausch rund um die Nordsee.' },
  { id: 'fx-gbpnok', name: 'Britisches Pfund / Norwegerkrone', symbol: 'GBP/NOK', val: '13,61', chg: '+0,18%', up: true, category: 'Pound Cross', high: '13,69', low: '13,55', vol: '$25B', score: 77, rating: 'Energie & Gas Trading', desc: 'Verknüpft britische Energiebedarfe mit norwegischen Gaslieferungen.' },
  { id: 'fx-gbppln', name: 'Britisches Pfund / Zloty', symbol: 'GBP/PLN', val: '5,07', chg: '+0,02%', up: true, category: 'Pound Cross', high: '5,10', low: '5,04', vol: '$28B', score: 79, rating: 'Handel & Remittances', desc: 'Bedeutend für grenzüberschreitende Arbeits- und Überweisungsströme.' },
  { id: 'fx-gbpzar', name: 'Britisches Pfund / Rand', symbol: 'GBP/ZAR', val: '23,26', chg: '-0,30%', up: false, category: 'Pound Cross', high: '23,45', low: '23,10', vol: '$22B', score: 72, rating: 'Historische Verknüpfung', desc: 'Londoner Finanzmarktverbindungen mit dem Minensektor Südafrikas.' },
  { id: 'fx-gbpsgd', name: 'Britisches Pfund / Singapur-Dollar', symbol: 'GBP/SGD', val: '1,7180', chg: '+0,24%', up: true, category: 'Pound Cross', high: '1,7230', low: '1,7120', vol: '$26B', score: 81, rating: 'Globale Bankenachsen', desc: 'Finanzdrehscheibe zwischen der City of London und Südostasien.' },
  { id: 'fx-gbptry', name: 'Britisches Pfund / Lira', symbol: 'GBP/TRY', val: '41,88', chg: '+0,55%', up: true, category: 'Pound Cross', high: '42,20', low: '41,60', vol: '$20B', score: 63, rating: 'Extrem-Carry Paar', desc: 'Sehr weite Renditespannen zwischen UK Gilts und türkischen Staatsanleihen.' },
  { id: 'fx-gbpmxn', name: 'Britisches Pfund / Mex. Peso', symbol: 'GBP/MXN', val: '23,12', chg: '+0,78%', up: true, category: 'Pound Cross', high: '23,35', low: '22,95', vol: '$18B', score: 75, rating: 'LatAm Renditehebel', desc: 'Pfund gegen den mexikanischen Peso als liquide Carry-Option.' },
  { id: 'fx-gbpinr', name: 'Britisches Pfund / Indische Rupie', symbol: 'GBP/INR', val: '106,45', chg: '+0,35%', up: true, category: 'Pound Cross', high: '106,90', low: '106,10', vol: '$35B', score: 83, rating: 'Enger bilateraler Handel', desc: 'Wachsender bilateraler Handel und Technologieabkommen UK-Indien.' },
  { id: 'fx-gbpaed', name: 'Britisches Pfund / VAE-Dirham', symbol: 'GBP/AED', val: '4,68', chg: '+0,31%', up: true, category: 'Pound Cross', high: '4,70', low: '4,66', vol: '$24B', score: 84, rating: 'Investitionsströme Golf', desc: 'Bedeutend für Kapitaltransfers zwischen London und Dubai/Abu Dhabi.' },
  { id: 'fx-gbphkd', name: 'Britisches Pfund / Hongkong-Dollar', symbol: 'GBP/HKD', val: '9,9520', chg: '+0,33%', up: true, category: 'Pound Cross', high: '9,9850', low: '9,9200', vol: '$20B', score: 80, rating: 'Traditionelle Finanzroute', desc: 'Direkter Devisenkurs zwischen den beiden historischen Finanzmetropolen.' },

  // ========================================================
  // 66-80: Japanischer Yen Währungskreuze (JPY Crosses)
  // ========================================================
  { id: 'fx-audjpy', name: 'Australischer Dollar / Yen', symbol: 'AUD/JPY', val: '103,80', chg: '+0,11%', up: true, category: 'Yen Cross', high: '104,30', low: '103,10', vol: '$90B', score: 79, rating: 'Risikobarometer global', desc: 'Gilt bei Devisenhändlern als primärer Frühindikator für globale Risikoneigung.' },
  { id: 'fx-cadjpy', name: 'Kanadischer Dollar / Yen', symbol: 'CAD/JPY', val: '113,90', chg: '-0,24%', up: false, category: 'Yen Cross', high: '114,60', low: '113,40', vol: '$65B', score: 71, rating: 'Öl & Zinsen', desc: 'Kombiniert nordamerikanische Rohstoffdynamik mit Niedrigzinsen in Fernost.' },
  { id: 'fx-chfjpy', name: 'Schweizer Franken / Yen', symbol: 'CHF/JPY', val: '172,95', chg: '-0,31%', up: false, category: 'Yen Cross', high: '173,80', low: '172,20', vol: '$60B', score: 75, rating: 'Safe Haven Duell', desc: 'Zwei traditionelle Fluchtwährungen im direkten relativen Kräftemessen.' },
  { id: 'fx-nzdjpy', name: 'Neuseeland-Dollar / Yen', symbol: 'NZD/JPY', val: '95,10', chg: '-0,05%', up: false, category: 'Yen Cross', high: '95,60', low: '94,80', vol: '$45B', score: 73, rating: 'Pazifik Carry Profil', desc: 'Pazifisches Renditepaar mit solider Zinsdifferenz zum Yen.' },
  { id: 'fx-sgdjpy', name: 'Singapur-Dollar / Yen', symbol: 'SGD/JPY', val: '115,25', chg: '-0,36%', up: false, category: 'Yen Cross', high: '115,80', low: '114,90', vol: '$38B', score: 81, rating: 'Asiatische Währungsstärke', desc: 'Zwei Schwergewichte des asiatischen Finanz- und Bankensektors.' },
  { id: 'fx-zarjpy', name: 'Südafrikanischer Rand / Yen', symbol: 'ZAR/JPY', val: '8,52', chg: '+0,18%', up: true, category: 'Yen Cross', high: '8,60', low: '8,45', vol: '$35B', score: 70, rating: 'Retail Carry Favorit', desc: 'Traditionell sehr beliebter Zinstrade unter japanischen Kleinanlegern.' },
  { id: 'fx-mxnjpy', name: 'Mexikanischer Peso / Yen', symbol: 'MXN/JPY', val: '8,56', chg: '-0,92%', up: false, category: 'Yen Cross', high: '8,68', low: '8,50', vol: '$42B', score: 74, rating: 'Hochzins Carry Trade', desc: 'Führender globaler Carry-Trade zwischen Mexikos Banxico und Japans BoJ.' },
  { id: 'fx-cnhjpy', name: 'Offshore Yuan / Yen', symbol: 'CNH/JPY', val: '21,40', chg: '-0,52%', up: false, category: 'Yen Cross', high: '21,55', low: '21,30', vol: '$30B', score: 75, rating: 'Ostasien Handelsstrom', desc: 'Direktes Währungsbarometer für die Wirtschaftsbeziehungen China-Japan.' },
  { id: 'fx-nokjpy', name: 'Norwegische Krone / Yen', symbol: 'NOK/JPY', val: '14,55', chg: '-0,30%', up: false, category: 'Yen Cross', high: '14,68', low: '14,48', vol: '$24B', score: 73, rating: 'Energie versus Konsum', desc: 'Europäische Energiewährung gegen den rohstoffarmen Industriestaat Japan.' },
  { id: 'fx-sekjpy', name: 'Schwedische Krone / Yen', symbol: 'SEK/JPY', val: '14,77', chg: '-0,08%', up: false, category: 'Yen Cross', high: '14,88', low: '14,68', vol: '$20B', score: 74, rating: 'Industrienationen Cross', desc: 'Vergleicht zwei exportstarke Volkswirtschaften mit moderaten Zinsregimen.' },
  { id: 'fx-plnjpy', name: 'Polnischer Zloty / Yen', symbol: 'PLN/JPY', val: '39,05', chg: '-0,15%', up: false, category: 'Yen Cross', high: '39,30', low: '38,80', vol: '$18B', score: 77, rating: 'CEE Rendite-Arbitrage', desc: 'Polens Renditeniveau gegenüber den Negativ- bzw. Niedrigzinsen in Tokio.' },
  { id: 'fx-tryjpy', name: 'Türkische Lira / Yen', symbol: 'TRY/JPY', val: '4,73', chg: '-0,68%', up: false, category: 'Yen Cross', high: '4,79', low: '4,69', vol: '$22B', score: 58, rating: 'Extrem-Volatilität', desc: 'Historisch notorischer Carry-Trade mit extremer Währungssensitivität.' },
  { id: 'fx-inrjpy', name: 'Indische Rupie / Yen', symbol: 'INR/JPY', val: '1,86', chg: '-0,48%', up: false, category: 'Yen Cross', high: '1,88', low: '1,85', vol: '$25B', score: 80, rating: 'Indo-Japanische Projekte', desc: 'Begleitet milliardenschwere japanische Infrastruktur- und Shinkansen-Investitionen in Indien.' },
  { id: 'fx-hkdjpy', name: 'Hongkong-Dollar / Yen', symbol: 'HKD/JPY', val: '19,90', chg: '-0,45%', up: false, category: 'Yen Cross', high: '20,02', low: '19,82', vol: '$28B', score: 79, rating: 'Asiatische Arbitrage', desc: 'Eng an USD/JPY gekoppelt durch den Währungskorridor Hongkongs.' },
  { id: 'fx-krwjpy', name: 'Südkoreanischer Won / Yen', symbol: 'KRW/JPY', val: '0,1124', chg: '-0,10%', up: false, category: 'Yen Cross', high: '0,1132', low: '0,1118', vol: '$20B', score: 75, rating: 'Exportwettbewerb Asien', desc: 'Vergleicht die relative Wettbewerbsfähigkeit koreanischer und japanischer Exporteure.' },

  // ========================================================
  // 81-90: Commodity & Antipodean Währungskreuze
  // ========================================================
  { id: 'fx-audcad', name: 'Australischer / Kanadischer Dollar', symbol: 'AUD/CAD', val: '0,9110', chg: '+0,32%', up: true, category: 'Commodity Cross', high: '0,9150', low: '0,9075', vol: '$45B', score: 79, rating: 'Minen versus Öl', desc: 'Duell der Rohstoffgiganten: Australiens Erz-Exporte gegen Kanadas Ölsande.' },
  { id: 'fx-audnzd', name: 'Australischer / Neuseeland-Dollar', symbol: 'AUD/NZD', val: '1,0915', chg: '+0,14%', up: true, category: 'Commodity Cross', high: '1,0945', low: '1,0880', vol: '$50B', score: 80, rating: 'Australasien Zinsspiel', desc: 'Trans-Tasman-Verhältnis zweier eng verknüpfter Ökonomien.' },
  { id: 'fx-audchf', name: 'Australischer Dollar / Franken', symbol: 'AUD/CHF', val: '0,6002', chg: '+0,42%', up: true, category: 'Risk Cross', high: '0,6035', low: '0,5970', vol: '$35B', score: 77, rating: 'Risikobereitschaft Barometer', desc: 'Kombiniert globale Wachstumsfantasie (AUD) mit monetärer Sicherheit (CHF).' },
  { id: 'fx-audsgd', name: 'Australischer / Singapur-Dollar', symbol: 'AUD/SGD', val: '0,9005', chg: '+0,48%', up: true, category: 'Asia-Pacific Cross', high: '0,9040', low: '0,8960', vol: '$25B', score: 81, rating: 'Pazifischer Handel', desc: 'Direkter Austausch zwischen Rohstofflieferant Australien und dem Handels-Hub Singapur.' },
  { id: 'fx-cadchf', name: 'Kanadischer Dollar / Franken', symbol: 'CAD/CHF', val: '0,6585', chg: '+0,10%', up: true, category: 'Risk Cross', high: '0,6620', low: '0,6560', vol: '$28B', score: 75, rating: 'Ölrente versus Fluchtwährung', desc: 'Kanadas Erdölerlöse im Kontrast zur Zürcher Safe-Haven-Nachfrage.' },
  { id: 'fx-nzdcad', name: 'Neuseeland-Dollar / Loonie', symbol: 'NZD/CAD', val: '0,8348', chg: '+0,18%', up: true, category: 'Commodity Cross', high: '0,8390', low: '0,8315', vol: '$22B', score: 76, rating: 'Agrar versus Energie', desc: 'Milchpulver- und Agrarpreise im Verhältnis zum kanadischen WTI-Öl.' },
  { id: 'fx-nzdchf', name: 'Neuseeland-Dollar / Franken', symbol: 'NZD/CHF', val: '0,5498', chg: '+0,28%', up: true, category: 'Risk Cross', high: '0,5530', low: '0,5465', vol: '$18B', score: 76, rating: 'Yield versus Stabilität', desc: 'Neuseeländische Zinsrenditen gegenüber dem Schweizer Franken.' },
  { id: 'fx-nzdsgd', name: 'Neuseeland / Singapur-Dollar', symbol: 'NZD/SGD', val: '0,8250', chg: '+0,32%', up: true, category: 'Asia-Pacific Cross', high: '0,8290', low: '0,8215', vol: '$16B', score: 78, rating: 'Pazifische Handelsrouten', desc: 'Agrar-Exportstrom Neuseelands in asiatische Märkte.' },
  { id: 'fx-cadsgd', name: 'Kanadischer / Singapur-Dollar', symbol: 'CAD/SGD', val: '0,9885', chg: '+0,14%', up: true, category: 'Asia-Pacific Cross', high: '0,9920', low: '0,9850', vol: '$18B', score: 80, rating: 'Pazifik-Energiehandel', desc: 'LNG-Exporte von Kanadas Westküste Richtung südostasiatische Abnehmer.' },
  { id: 'fx-audsek', name: 'Australischer Dollar / Krone', symbol: 'AUD/SEK', val: '7,02', chg: '+0,16%', up: true, category: 'Global Commodity Cross', high: '7,08', low: '6,98', vol: '$15B', score: 75, rating: 'Globale Rohstoffnachfrage', desc: 'Spiegelt weltweite Investitionsgüternachfrage und Metallmärkte wider.' },

  // ========================================================
  // 91-100: Skandinavische, Emerging & Exotische Währungskreuze
  // ========================================================
  { id: 'fx-chfpln', name: 'Schweizer Franken / Zloty', symbol: 'CHF/PLN', val: '4,43', chg: '-0,18%', up: false, category: 'Hypotheken Cross', high: '4,46', low: '4,41', vol: '$22B', score: 76, rating: 'Franken-Kredite Historie', desc: 'In Polen aufmerksam beobachtet aufgrund historischer CHF-Wohnungsbaukredite.' },
  { id: 'fx-chfsek', name: 'Schweizer Franken / Schwedenkrone', symbol: 'CHF/SEK', val: '11,71', chg: '-0,25%', up: false, category: 'European Cross', high: '11,78', low: '11,66', vol: '$18B', score: 77, rating: 'Zinsdifferenz Norden-Alpen', desc: 'Bewegungen gesteuert durch geldpolitische Divergenzen zwischen SNB und Riksbank.' },
  { id: 'fx-chfnok', name: 'Schweizer Franken / Norwegerkrone', symbol: 'CHF/NOK', val: '11,88', chg: '-0,04%', up: false, category: 'European Cross', high: '11,95', low: '11,82', vol: '$16B', score: 78, rating: 'Finanzresilienz Vergleich', desc: 'Stellt zwei der bonitätsstärksten Staaten Europas direkt gegenüber.' },
  { id: 'fx-noksek', name: 'Norwegische / Schwedische Krone', symbol: 'NOK/SEK', val: '0,9850', chg: '-0,22%', up: false, category: 'Nordic Cross', high: '0,9910', low: '0,9810', vol: '$32B', score: 79, rating: 'Skandinavischer Leitkurs', desc: 'Eng verfolgter Wechselkurs zwischen den beiden größten nordischen Nachbarn.' },
  { id: 'fx-seknok', name: 'Schwedische / Norwegische Krone', symbol: 'SEK/NOK', val: '1,0150', chg: '+0,22%', up: true, category: 'Nordic Cross', high: '1,0190', low: '1,0090', vol: '$30B', score: 79, rating: 'Nordischer Binnenhandel', desc: 'Invertierte Parität für schwedische Unternehmen im norwegischen Markt.' },
  { id: 'fx-dkknok', name: 'Dänische / Norwegische Krone', symbol: 'DKK/NOK', val: '1,5430', chg: '-0,08%', up: false, category: 'Nordic Cross', high: '1,5490', low: '1,5380', vol: '$14B', score: 76, rating: 'Skandinavischer Handel', desc: 'Bedeutend für logistische Transport- und Seeverkehre in Nordeuropa.' },
  { id: 'fx-sgdmyr', name: 'Singapur-Dollar / Ringgit', symbol: 'SGD/MYR', val: '3,49', chg: '-0,02%', up: false, category: 'ASEAN Cross', high: '3,51', low: '3,48', vol: '$28B', score: 86, rating: 'Massa-Pendlerstrom', desc: 'Sehr wichtiger Wechselkurs für den massiven Pendler- und Warenverkehr am Johor Causeway.' },
  { id: 'fx-cnhhkd', name: 'Offshore Yuan / Hongkong-Dollar', symbol: 'CNH/HKD', val: '1,0750', chg: '-0,06%', up: false, category: 'Greater Bay Cross', high: '1,0780', low: '1,0720', vol: '$35B', score: 82, rating: 'Greater Bay Area Integration', desc: 'Zentral für Südchinas Mega-Wirtschaftsraum Guangdong-Hongkong-Macau.' },
  { id: 'fx-usdclp', name: 'US-Dollar / Chilenischer Peso', symbol: 'USD/CLP', val: '935,40', chg: '-0,42%', up: false, category: 'LatAm Commodity FX', high: '942,00', low: '929,00', vol: '$20B', score: 78, rating: 'Kupferpreis-Barometer', desc: 'Chiles Währung reagiert hochsensibel auf Kupferpreisbewegungen an der LME.' },
  { id: 'fx-usdcop', name: 'US-Dollar / Kolumbianischer Peso', symbol: 'USD/COP', val: '4.140,00', chg: '+0,28%', up: true, category: 'LatAm EM', high: '4.170,00', low: '4.115,00', vol: '$15B', score: 71, rating: 'Öl & Kaffee Exporte', desc: 'Kolumbiens Währung getrieben von Rohölerlösen und Kaffeeexporten.' },
];

function getForexSubclass(item: RawForexItem): { id: string; name: string } {
  // 1. Commodity FX
  if (
    ['fx-audusd', 'fx-usdcad', 'fx-nzdusd', 'fx-usdnok', 'fx-audcad', 'fx-audnzd', 'fx-nzdcad', 'fx-usdclp', 'fx-noksek', 'fx-seknok', 'fx-dkknok'].includes(item.id) ||
    item.category.includes('Commodity')
  ) {
    return { id: 'forex-commodity', name: 'Rohstoffwährungen (Commdollars)' };
  }

  // 2. Emerging Markets
  if (
    item.category.includes('EM') ||
    item.category.includes('Yield') ||
    item.category.includes('Asian') ||
    item.category.includes('CEE') ||
    item.category.includes('Middle East') ||
    ['fx-usdtry', 'fx-usdbrl', 'fx-usdzar', 'fx-usdmxn', 'fx-usdinr', 'fx-usdidr', 'fx-usdkrw', 'fx-usdthb', 'fx-usdmyr', 'fx-usdphp', 'fx-usdpln', 'fx-usdczk', 'fx-usdhuf', 'fx-usdtwd', 'fx-usdcnh', 'fx-usdaed', 'fx-usdsar', 'fx-usdils', 'fx-usdcop', 'fx-sgdmyr', 'fx-cnhhkd', 'fx-chfpln'].includes(item.id)
  ) {
    return { id: 'forex-em', name: 'Emerging Markets FX' };
  }

  // 3. Minors & Crosses
  if (
    item.category.includes('Cross') ||
    (item.symbol.includes('EUR/') && !item.symbol.includes('USD')) ||
    (item.symbol.includes('GBP/') && !item.symbol.includes('USD')) ||
    (item.symbol.includes('/JPY') && !item.symbol.includes('USD')) ||
    (item.symbol.includes('/CHF') && !item.symbol.includes('USD')) ||
    item.category.includes('Nordic')
  ) {
    return { id: 'forex-crosses', name: 'Minors & Währungskreuze' };
  }

  // 4. Majors
  return { id: 'forex-majors', name: 'Majors (Hauptwährungspaare)' };
}

export const FOREX_ASSETS: MarketAsset[] = RAW_FOREX_ITEMS.map((item, idx) => {
  const subclassInfo = getForexSubclass(item);

  return {
    id: item.id,
    name: item.name,
    symbol: item.symbol,
    value: item.val,
    change: item.chg,
    isPositive: item.up,
    mainCategory: 'FOREX',
    subclassId: subclassInfo.id,
    subclassName: subclassInfo.name,
    iconType: 'forex',
    sparklinePath: item.up
      ? `M 0,${34 + (idx % 5)} Q 25,${37 - (idx % 4)} 55,${26 - (idx % 3)} T 110,${27 - (idx % 3)} T 160,${15 - (idx % 4)} T 200,${8 + (idx % 2)}`
      : `M 0,${18 + (idx % 4)} Q 30,${20 + (idx % 3)} 65,${29 + (idx % 4)} T 120,${27 + (idx % 3)} T 170,${35 + (idx % 4)} T 200,${39 - (idx % 2)}`,
    glowColor: item.up ? 'rgba(232, 121, 249, 0.25)' : 'rgba(244, 63, 94, 0.25)',
    borderColor: item.up ? 'rgba(232, 121, 249, 0.4)' : 'rgba(244, 63, 94, 0.4)',
    waveColor: item.up ? '#E879F9' : '#F43F5E',
    category: item.category,
    high24h: item.high,
    low24h: item.low,
    volume24h: item.vol,
    aiScore: item.score,
    aiRating: item.rating,
    description: item.desc,
  };
});

export const FOREX_PAIRS: MarketAsset[] = FOREX_ASSETS;
