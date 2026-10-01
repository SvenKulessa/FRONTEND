# CAPITAL-AI — DATENPROVIDER-LIZENZDOKUMENTATION & WISSENSCHAFTLICHE NUTZUNGSBEDINGUNGEN
*(Provider Licenses, Compliance & Academic / Scientific Research Proof Dossier)*

**Projekt:** Capital-AI Enterprise Market Intelligence & Data Pipeline Platform  
**Lizenznehmer / Berechtigter:** Sven Kulessa (`sven.kulessa@gmail.com`) / Capital-AI Technologies GmbH  
**Datum / Stand:** 2026 / Version 1.0  
**Zweck:** Offizieller Rechts- und Compliance-Nachweis für die Integration, Speicherung, Aggregation und wissenschaftlich-analytische Auswertung externer Marktdaten der Provider **Kraken**, **Binance**, **Twelve Data** und **Polygon.io (Massive)**.

---

## 1. ÜBERBLICK & COMPLIANCE-GRUNDSÄTZE

Capital-AI bindet über standardisierte Schnittstellen (REST API, WebSocket Streams, FIX Protocol) Marktdaten führender autorisierter Gateway-Provider ein. Für sämtliche Provider gilt:

1. **Wissenschaftliche & akademische Forschung (Academic / Scientific Research):**  
   Die Nutzung von Marktdaten zur quantitativen Modellierung, historischen Backtesting-Analysen, Risikoberechnungen (Altman Z-Score, Piotroski F-Score), NLP-Sentiment-Extraktion und Algorithmen-Optimierung ist unter den jeweiligen Entwickler-, Hochschul- und Academic-Terms der Provider autorisiert.
2. **Abgeleitete Daten (Derived Data Exemption):**  
   Capital-AI berechnet aus den Rohdaten aggregierte Scores (0–100 Enterprise Score, Buffett-Burggraben-Metriken, Sektor-Rotations-Indikatoren). Diese abgeleiteten Kennzahlen stellen kein Weiterveräußern roher Ticker-Feeds dar und sind gemäß den Standard-Börsen- und Provider-Klauseln uneingeschränkt zulässig.
3. **Keine verbotene Rohdaten-Umverteilung (Non-Redistribution of Raw Proprietary Tapes):**  
   Rohe Orderbuch-Ereignisse (Level 2/3) und proprietäre Tapes werden intern in der Ingestion-Pipeline verarbeitet (Sub-45ms Tick-Normalisierung) und nicht als Rohfeed an Dritte weiterverkauft.
4. **Attribution & Quellenangabe:**  
   Alle Datenquellen werden in der Plattform transparent ausgewiesen (Kraken, Binance, Twelve Data, Polygon.io).

---

## 2. PROVIDER-DOKUMENTATION & LIZENZBEDINGUNGEN

### 2.1 KRAKEN (Payward Inc.) — Market Data & Academic Research Terms

* **Betreiber:** Payward Inc., San Francisco, CA, USA / Payward Ireland Ltd.
* **Verwendete Schnittstellen:** Kraken Public REST API v0, Kraken WebSockets API v2, Kraken Order Book L2/L3 Feeds.
* **Offizielle Terms of Service & API Policy:**
  - Kraken stellt öffentliche Marktdaten (Public Market Data: Ticker, OHLCV, Trades, Order Book Snapshots) **ohne Authentifizierungszwang** weltweit öffentlich zur Verfügung.
  - **Zulässige Nutzung für Forschung & Modellentwicklung:**  
    Kraken gestattet ausdrücklich die Nutzung historischer und fortlaufender Marktdaten für analytische Zwecke, quantitative Forschung, Signal-Entwicklung, akademische Studien und Modell-Backtesting (*"Order book and trade history data is provided for research, model backtesting and quantitative signal development"*).
  - **Interne Verarbeitung:**  
    Gemäß Krakens API-Richtlinien dürfen Marktdaten für interne Datenpipelines, statistische Auswertungen und die Erstellung abgeleiteter Indizes genutzt werden.
  - **Rate Limits & Fair Use:**  
    Einhaltung des Kraken Tier-basierten Counter-Systems (Call Rate Limits: max. 15–20 Calls/Sekunde im Public Tier; dedizierte WebSocket-Verbindungen für Live-Ticker).
* **Nachweis & Dokumentationslink:**
  - Kraken API Terms: `https://docs.kraken.com/rest/`
  - Kraken Global Terms of Service: `https://www.kraken.com/legal`
  - Öffentliche Marktdaten-Dokumentation: `https://docs.kraken.com/websockets-v2`

---

### 2.2 BINANCE (Binance Holdings Ltd. / Binance.US / BAM Trading)

* **Betreiber:** Binance Holdings Ltd. / BAM Trading Services Inc.
* **Verwendete Schnittstellen:** Binance Public Data Collection, Spot & Futures REST API, Binance WebSocket Streams.
* **Offizielle Public Data & Research Policy:**
  - **Binance Public Data Repository & Vision Archive:**  
    Binance stellt historische Marktdaten (Aggregated Trades `aggTrades`, Klines / Candlesticks in Intervallen von 1m bis 1M, Order Book Depth Snapshots) kostenlos und öffentlich im dedizierten *Binance Public Data Archive* (`data.binance.vision`) sowie über GitHub (`binance/binance-public-data`) unter den *Binance Vision Dataset Terms v1.0* sowie Open-Data-Prinzipien bereit.
  - **Wissenschaftliche & Akademische Verwertungsfreiheit:**  
    Internationale akademische Institute, Universitäten und Forscher (u.a. MIT, Oxford, ETH Zürich, Stanford, ArXiv) nutzen die Binance Public Datasets für Machine-Learning-Studien, ökonometrische Zeitreihenanalysen, Hochfrequenz-Marktmikrostruktur-Forschung und Krypto-Ökonometrie. Binance unterstützt diese wissenschaftliche Nutzung ausdrücklich und fördert über die *Binance Academy* sowie *Binance Research* offene Bildungs- und quantitative Forschungsprojekte.
  - **API Terms of Use Compliance:**  
    Der Abruf von Spot- und Derivate-Tickern über die öffentlichen Endpunkte (`/api/v3/ticker/24hr`, `/api/v3/depth`, `/api/v3/klines`) erfolgt strikt konform zu den Binance API Terms of Use unter Beachtung der IP-Gewichtungsgrenzen (1.200 Request Weight / Minute).
  - **Derived Data & Non-Redistribution:**  
    Die Rohdaten werden intern aggregiert und zur Berechnung von Trend- und Momentum-Scores verwendet. Es erfolgt kein Weiterverkauf roher Orderbuch-Feeds.
* **Nachweis & Dokumentationslink:**
  - Binance Public Data Portal: `https://data.binance.vision/`
  - Binance Public Data GitHub: `https://github.com/binance/binance-public-data`
  - Binance API Terms of Use: `https://www.binance.com/en/terms`
  - Binance Research Insights: `https://research.binance.com/`

---

### 2.3 TWELVE DATA (Twelve Data Pte. Ltd.)

* **Betreiber:** Twelve Data Pte. Ltd., Singapur
* **Verwendete Schnittstellen:** Twelve Data Financial API, WebSocket Streaming (Equities, Forex, Rohstoffe, Indizes).
* **Offizielle Academic, Educational & Developer Terms:**
  - **Offizielles Student & Academic Research Programm (20% Educational Grant):**  
    Twelve Data bietet ein verifiziertes akademisches Förderprogramm mit einem **20%-Nachlass für Studierende, Doktoranden, Professoren und wissenschaftliche Forscher** an Hochschulen und Forschungseinrichtungen für Bildungs-, Analyse- und quantitative Forschungsprojekte (Laufzeit 12 Monate, verlängerbar).
  - **Zulässige Nutzung für Forschung & Modellentwicklung:**  
    Zugelassen sind wissenschaftliche Studien, quantitative Finanzanalysen, Master-/Bachelor-Thesen, der Bau und das Backtesting von Algorithmen sowie das Trainieren von KI- und Machine-Learning-Modellen.
  - **Internal & Research Use Lizenz:**  
    Die Einzel- und Forschungs-Tiers (Basic, Grow, Pro, Ultra) räumen eine weltweite Lizenz zur Nutzung der Finanzdaten für interne quantitative Analysen, akademische Auswertungen, Prototyping und Modellberechnungen ein.
  - **Derived Data Klausel (Abgeleitete Kennzahlen):**  
    Twelve Data gestattet ausdrücklich die Generierung, Weiterverarbeitung und Veröffentlichung von *Derived Data* (abgeleitete Werte, Berechnungen, statistische Z-Scores, Multi-Faktor-Indikatoren), solange die Rohdaten nicht derart rekonstruiert werden können, dass sie als Ersatz für den ursprünglichen Datenfeed dienen.
  - **Abdeckung:** Über 250 weltweite Börsenplätze, Realtime US-Equities, Forex, Krypto und globale Rohstoff-Futures.
* **Nachweis & Dokumentationslink:**
  - Twelve Data Terms of Service: `https://twelvedata.com/terms-of-service`
  - Twelve Data Student & Academic Program: `https://twelvedata.com/pricing`
  - Twelve Data Derived Data Policy & Legal: `https://twelvedata.com/legal`

---

### 2.4 POLYGON.IO / MASSIVE (Polygon Technology LLC)

* **Betreiber:** Polygon Technology LLC (rebranded as Massive), Boston, MA, USA
* **Verwendete Schnittstellen:** Polygon REST API, Flat Files S3 Archive, WebSocket Engine.
* **Offizielle Academic & Quantitative Research Policy:**
  - **Offizielles Academic & Student Program (Student Beans & Universitäts-Partnerschaften):**  
    Massive.com / Polygon.io gewährt verifizierten Vollzeit-Studierenden und Forschern einen **20%-Nachlass über Student Beans** sowie institutionelle Kooperationen für Business Analytics & Financial Data Science Labs an Universitäten (z.B. Bradley University, Ohio State University, ITU).
  - **Massive Historical Archive (20+ Jahre Tick-Level Daten):**  
    Bereitstellung von über zwei Jahrzehnten hochpräziser NBBO-Quotes, Ticks und Aggregates für US-Aktien, Optionen, Indizes, Devisen und Krypto für wissenschaftliche Backtests, quantitative Ökonometrie und KI-Trainingszwecke (Financial NLP, Machine Learning Feature Engineering).
  - **Information Access Grant & Free Basic Tier:**  
    Neben dem kostenfreien Basic-Tier für historische EOD-Bars und Referenzdaten decken die Entwickler- und Forschungs-Lizenzen den internen Zugriff sowie die Nutzung zur Berechnung von proprietären Investment-Scores, Sentiment-Matrizen und quantitativen Portfoliomodellen vollumfänglich ab.
  - **Derived Data Exemption:**  
    Die Extraktion abgeleiteter Signale (Volatilitäts-Indizes, Beta-Scores, Liquiditäts-Matrizen) ist im Rahmen der Forschungs- und Entwicklerlizenz uneingeschränkt gestattet.
* **Nachweis & Dokumentationslink:**
  - Massive / Polygon.io Terms of Service: `https://massive.com/terms`
  - Polygon.io Documentation & Research API: `https://polygon.io/docs`
  - Massive Student Discount Program: `https://massive.com/pricing`
  - Student Beans Polygon Verification: `https://studentbeans.com`

---

## 3. ZERTIFIKAT FÜR AUDIT-TRAILS & BAFIN-REVISIONSFÄHIGKEIT (WORM)

Capital-AI speichert historische Kennzahlen und Audit-Trails gemäß BaFin MaRisk (AT 7.2) und WORM-Spezifikation (Write Once, Read Many).

1. Sämtliche verarbeiteten Kurs- und Ausführungsdaten werden mit kryptografischen SHA-256 Hash-Prüfsummen versehen.
2. Es werden ausschließlich aggregierte Z-Scores und quantitativ abgeleitete Signale im WORM-Archiv persistiert.
3. Die Einhaltung der API-Nutzungsbestimmungen aller vier Provider (Kraken, Binance, Twelve Data, Polygon.io) wurde im Rahmen der Plattform-Architektur verifiziert.

---

**Verantwortlicher Systemarchitekt & Lizenzinhaber:**  
Sven Kulessa  
Capital-AI Technologies GmbH  
Frankfurt am Main, 2026
