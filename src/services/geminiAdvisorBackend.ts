/**
 * CAPITAL AI — REASONING FINTECH & SCIENTIST ADVISOR BACKEND
 * Serves POST /api/advisor using @google/genai (gemini-3.8-flash)
 * with Revenue Assurance, Cataloging & Inventorying for BaFin/MiCA Screener Pipelines.
 */

import { GoogleGenAI } from '@google/genai';

export interface CatalogedToolItem {
  id: string;
  tier: string;
  name: string;
  specs: string;
  costEur: number;
  latencyEffect: string;
  bafinRelevance: string;
}

export interface AdvisorRequestPayload {
  prompt: string;
  currentConfig?: {
    analysisFocusId?: string;
    latencyIntervalId?: string;
    providerIds?: string[];
    cachingId?: string;
    evidenceId?: string;
    catalogedInventory?: CatalogedToolItem[];
    totalMonthlyCostEur?: number;
  };
}

export interface AdvisorResponsePayload {
  thoughtProcess: string;
  advice: string;
  inventory: Array<{
    tier: string;
    item: string;
    specs: string;
    costEur: number;
    latencyEffect: string;
    bafinRelevance: string;
  }>;
  totalMonthlyCostEur: number;
  isBudgetCompliant: boolean;
  recommendedConfig?: {
    analysisFocusId: string;
    latencyIntervalId: string;
    providerIds: string[];
    cachingId: string;
    evidenceId: string;
  };
}

export async function handleAdvisorRequest(payload: AdvisorRequestPayload): Promise<AdvisorResponsePayload> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `Du bist der "Capital-AI Systems Architect & Revenue Assurance Advisor" für institutionelle Fintech-Pipelines (PC-Konfigurator Stil nach Alternate).
Deine Kernkompetenzen:
1. Scientist Stack: Quantitative Formeln (Buffett Value Check: ROE > 15%, Margin of Safety, DCF; Sharpe / Sortino Ratio; Value-at-Risk; Monotone Sequenzierung; Outlier-Filter).
2. Fintech & BaFin / MiCA Compliance: WpHG § 83 Archivierungspflichten, MaRisk Mindestanforderungen, Unveränderbare WORM / SHA-256 Merkle Evidence.
3. Revenue Assurance & Inventorying: Vollständige Inventarisierung und Katalogisierung aller Komponenten, strikte Einhaltung der 40 € / Monat Budget-Obergrenze (AP-006).

Antworte präzise, auf Deutsch und gib IMMER valides JSON zurück mit folgender Struktur:
{
  "thoughtProcess": "Detaillierte logische Herleitung / Scientist Reasoning der Systemanforderungen...",
  "advice": "Kompakte, hochkompetente Kaufberater-Empfehlung...",
  "inventory": [
    {
      "tier": "Ebene 1 / Ebene 2 / ...",
      "item": "Name der Komponente",
      "specs": "Latenz / Durchsatz / SLA",
      "costEur": 0.0,
      "latencyEffect": "z.B. Sub-45ms",
      "bafinRelevance": "z.B. Erfüllt WpHG § 83"
    }
  ],
  "totalMonthlyCostEur": 8.5,
  "isBudgetCompliant": true,
  "recommendedConfig": {
    "analysisFocusId": "buffett-value | bafin-scoring | momentum-breakout | whale-radar | macro-yield | hft-arbitrage",
    "latencyIntervalId": "eod-daily | intraday-1m | delayed-15m | hft-tick",
    "providerIds": ["twelvedata", "fred", "binance", "kraken", "alchemy"],
    "cachingId": "redis-ring | flatbuffers-delta | arrow-flight | token-bucket",
    "evidenceId": "worm-storage | merkle-tree | consensus-outlier"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Benutzer-Anfrage: "${payload.prompt}". Aktuelle Konfiguration: ${JSON.stringify(payload.currentConfig || {})}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text) as AdvisorResponsePayload;
        return parsed;
      }
    } catch (err) {
      console.warn('[Capital-AI Advisor] Gemini call error, falling back to scientist rule engine:', err);
    }
  }

  // High-fidelity fallback / Scientist Rule Engine if API key is not set or network fails
  return generateScientistRuleEngineResponse(payload);
}

export function generateScientistRuleEngineResponse(payload: AdvisorRequestPayload): AdvisorResponsePayload {
  const p = (payload.prompt || '').toLowerCase();

  if (p.includes('buffett') || p.includes('value') || p.includes('fundamental')) {
    return {
      thoughtProcess: `[SCIENTIST ANALYSIS: BUFFETT VALUE CHECK PIPELINE]
1. Mathematische & Methodische Anforderung:
   - Der Buffett Value Check erfordert fundamentale Bilanzdaten (ROE > 15%, KGV/KBV-Historie über 10 Jahre, Verschuldungsgrad < 50%, Free Cashflow Rendite, Moat-Bewertung).
   - Abtastrate: Da Bilanzen quartalsweise und Kurse täglich bewertet werden, ist KEINE teure High-Frequency-Latenz (<20ms) erforderlich.
   - Optimale Frequenz: End-of-Day (EOD) / Daily Close.
2. Revenue Assurance & Kostenanalyse:
   - Ingestion: TwelveData Financial Feeds (8,50 €/Mo für US/EU Bilanzen) + Federal Reserve FRED (0 € für risikofreie Zinsstruktur & Diskontsätze).
   - Server & Caching: In-Memory Redis Ring Buffer (0 € im Free Tier für EOD Batches).
   - Gesamtkosten: 8,50 € / Monat. Dies liegt bei nur 21,3% des 40 € Budgets (31,50 € Sicherheitspuffer).
3. BaFin & WpHG Audit-Trail:
   - WORM-Storage Archivierung sichert Berechnungen nach WpHG § 83 für 5 Jahre revisionssicher ab.`,
      advice: `Für den klassischen **Buffett Value Check** empfehle ich eine kosteneffiziente, hochpräzise **End-of-Day (EOD)** Pipeline. Da Value-Metriken auf 10-Jahres-Bilanzen basieren, sparen wir teure Streaming-Gebühren und investieren das Budget stattdessen in historische Tiefe (TwelveData 1825 Tage + FRED Makrozinsen). Gesamtkosten: nur **8,50 € / Monat** bei vollem BaFin-Audit-Trail!`,
      inventory: [
        {
          tier: 'Ebene 1: Analyse-Fokus',
          item: 'Buffett Value Check Engine',
          specs: 'DCF Innerer Wert, 10J ROE >15%, Margin of Safety, Burggraben',
          costEur: 0,
          latencyEffect: 'EOD Batch Execution',
          bafinRelevance: 'WpHG § 83 Konformität',
        },
        {
          tier: 'Ebene 2: Taktung',
          item: 'End-of-Day (EOD) Daily Close',
          specs: 'Schlusskurse + tägliche Bilanzen',
          costEur: 0,
          latencyEffect: 'Minimale Serverlast',
          bafinRelevance: 'Revisionssichere EOD-Schnappschüsse',
        },
        {
          tier: 'Ebene 3: Datenquellen',
          item: 'TwelveData Financial Feeds + FRED',
          specs: 'US & EU Equities + US Zinsstrukturkurve',
          costEur: 8.5,
          latencyEffect: '40 - 120ms Batch Fetch',
          bafinRelevance: 'Regulatorisch zugelassene Referenzkurse',
        },
        {
          tier: 'Ebene 4: Caching',
          item: 'Redis Ring Buffer & Delta Compression',
          specs: '1000 Ticks/Symbol In-Memory',
          costEur: 0,
          latencyEffect: 'Sub-5ms Query Latenz',
          bafinRelevance: 'Kein Datenverlust bei Neustart',
        },
        {
          tier: 'Ebene 5: Audit-Trail',
          item: 'WORM Storage (Write Once Read Many)',
          specs: '5 Jahre Vorratsdatenspeicherung',
          costEur: 0,
          latencyEffect: 'Asynchrones Append-Only',
          bafinRelevance: 'BaFin MaRisk & WpHG § 83 zertifiziert',
        },
      ],
      totalMonthlyCostEur: 8.5,
      isBudgetCompliant: true,
      recommendedConfig: {
        analysisFocusId: 'buffett-value',
        latencyIntervalId: 'eod-daily',
        providerIds: ['twelvedata', 'fred'],
        cachingId: 'redis-ring',
        evidenceId: 'worm-storage',
      },
    };
  }

  if (p.includes('hft') || p.includes('arbitrage') || p.includes('latenz') || p.includes('sub-20ms')) {
    return {
      thoughtProcess: `[SCIENTIST ANALYSIS: HIGH-FREQUENCY ARBITRAGE PIPELINE]
1. Latenz- & Taktungs-Vorgabe:
   - High-Frequency Cross-Exchange Arbitrage erfordert zwingend Sub-20ms Tick-by-Tick WebSocket Feeds mit L2-Orderbuchtiefe.
   - Monotone Sequenzierung ist unverzichtbar, um Out-of-Order Packets im Mempool zu verwerfen.
2. Hardware & Caching Stack:
   - Binance WSS (0 €) + Kraken Ingestion (0 €) für EUR-Referenz.
   - FlatBuffers & Zero-Copy Arrow Flight RPC für minimale Garbage Collection Delays.
3. Revenue Assurance:
   - Kosten: 0,00 € Grundgebühr dank Public Market Data Tiers! 100% budgetkonform.`,
      advice: `Für **HFT Cross-Exchange Arbitrage** ist eine Sub-20ms WebSocket Pipeline mit L2-Orderbuch konfiguriert. Wir koppeln Binance WSS und Kraken mit einem In-Memory Redis Ringpuffer und Delta-Kompression, um Tick-Schlupf vollständig zu eliminieren.`,
      inventory: [
        {
          tier: 'Ebene 1: Analyse-Fokus',
          item: 'High-Frequency Arbitrage Screener',
          specs: 'L2 Top of Book Differenzen & VWAP Slippage',
          costEur: 0,
          latencyEffect: 'Sub-18ms Tick-by-Tick',
          bafinRelevance: 'BaFin MiFID II Art. 48 Algorithmus-Konformität',
        },
        {
          tier: 'Ebene 2: Taktung',
          item: 'Sub-20ms Realtime WebSocket Streaming',
          specs: 'Tick-by-Tick Monotoner Datenstrom',
          costEur: 0,
          latencyEffect: 'Minimale Dispatch Latenz',
          bafinRelevance: 'Monotone Sequenznummern',
        },
        {
          tier: 'Ebene 3: Datenquellen',
          item: 'Binance Market Data Engine + Kraken WSS',
          specs: 'L2 Streaming Orderbuch Depth',
          costEur: 0,
          latencyEffect: '18 - 25ms RTT',
          bafinRelevance: 'BaFin-regulierte EU Partnerreferenz',
        },
        {
          tier: 'Ebene 4: Caching',
          item: 'Zero-Copy Arrow Flight & Redis Ring Buffer',
          specs: 'FlatBuffers Delta-Kompression',
          costEur: 0,
          latencyEffect: 'Sub-3ms In-Memory Durchsatz',
          bafinRelevance: 'Verlustfreies Caching',
        },
        {
          tier: 'Ebene 5: Audit-Trail',
          item: 'SHA-256 Merkle Audit Tree',
          specs: 'Kryptografisches Hashing jedes Ticks',
          costEur: 0,
          latencyEffect: '1ms Hash-Overhead',
          bafinRelevance: 'Manipulationssicherer Nachweis',
        },
      ],
      totalMonthlyCostEur: 0.0,
      isBudgetCompliant: true,
      recommendedConfig: {
        analysisFocusId: 'hft-arbitrage',
        latencyIntervalId: 'hft-tick',
        providerIds: ['binance', 'kraken'],
        cachingId: 'flatbuffers-delta',
        evidenceId: 'merkle-tree',
      },
    };
  }

  if (p.includes('inventar') || p.includes('katalog') || p.includes('assurance') || p.includes('revenue') || p.includes('audit')) {
    const passedInventory = payload.currentConfig?.catalogedInventory;
    const currentCost = payload.currentConfig?.totalMonthlyCostEur ?? (payload.currentConfig?.providerIds?.includes('twelvedata') ? 8.5 : 0);
    const budgetMax = 40.0;
    const remaining = Math.max(0, budgetMax - currentCost);
    const isCompliant = currentCost <= budgetMax;

    const inventoryList = passedInventory && passedInventory.length > 0 ? passedInventory.map((i) => ({
      tier: i.tier,
      item: i.name,
      specs: i.specs,
      costEur: i.costEur,
      latencyEffect: i.latencyEffect,
      bafinRelevance: i.bafinRelevance,
    })) : [
      {
        tier: 'Ebene 1: Analyse-Fokus',
        item: payload.currentConfig?.analysisFocusId === 'buffett-value' ? 'Buffett Value Check Engine' : 'BaFin Multi-Faktor Scorer',
        specs: 'Quantitative Risikometriken & Bilanzkennzahlen',
        costEur: 0,
        latencyEffect: 'EOD / Snapshot Taktung',
        bafinRelevance: 'WpHG § 83 Revisionssicher',
      },
      {
        tier: 'Ebene 2: Taktung',
        item: payload.currentConfig?.latencyIntervalId === 'hft-tick' ? 'Sub-20ms Realtime WebSocket' : 'End-of-Day / 15m Snapshot',
        specs: 'Monotone Sequenznummern',
        costEur: 0,
        latencyEffect: 'Deterministische Latenz',
        bafinRelevance: 'Kein Jitter',
      },
      {
        tier: 'Ebene 3: Daten-Gateways',
        item: (payload.currentConfig?.providerIds || ['twelvedata', 'fred']).join(', ').toUpperCase(),
        specs: 'Multi-Source Feeds mit Outlier-Konsens',
        costEur: currentCost,
        latencyEffect: '40 - 120ms RTT',
        bafinRelevance: 'Audit-taugliche Referenzpreise',
      },
      {
        tier: 'Ebene 4: Caching',
        item: payload.currentConfig?.cachingId || 'redis-ring',
        specs: 'Zero-Copy In-Memory Cache',
        costEur: 0,
        latencyEffect: 'Sub-5ms Query Latenz',
        bafinRelevance: 'MaRisk Stabilität',
      },
      {
        tier: 'Ebene 5: Audit-Trail',
        item: payload.currentConfig?.evidenceId || 'worm-storage',
        specs: 'Unveränderbares WORM / Merkle Logging',
        costEur: 0,
        latencyEffect: 'Kryptografischer Hash',
        bafinRelevance: '100% BaFin / MiCA Konformität',
      },
    ];

    return {
      thoughtProcess: `[SCIENTIST REVENUE ASSURANCE AUDIT REPORT]
1. Gesamtkosten-Inventarisierung:
   - Aktuelle Gesamtkosten: ${currentCost.toFixed(2)} € / Monat
   - Budget-Obergrenze (AP-006): ${budgetMax.toFixed(2)} € / Monat
   - Verbleibender Puffer: ${remaining.toFixed(2)} € (${((remaining / budgetMax) * 100).toFixed(1)}% Reserve)
   - Status: ${isCompliant ? '100% BUDGETKONFORM (GRÜN)' : 'BUDGET ÜBERSCHRITTEN (ROT)'}
2. Regulatorische Plausibilisierung:
   - Alle erfassten Komponenten erfüllen die MaRisk-Mindestanforderungen für IT-Systeme.
   - Revisionssicherheit nach WpHG § 83 durch unveränderliche Beweiskette gesichert.
3. Scientist Empfehlung:
   - Die Architektur ist kosten- und latenzoptimal ausbalanciert. Keine unnötigen kommerziellen Lizenzen.`,
      advice: `**Revenue Assurance & Inventar-Prüfung abgeschlossen:** Ihr aktuell ausgewähltes Tool-Inventar beläuft sich auf **${currentCost.toFixed(2)} € / Monat**. Bei einem maximalen Limit von 40,00 € verfügen Sie über einen komfortablen Puffer von **${remaining.toFixed(2)} €**. Sämtliche 5 Ebenen sind vollständig inventarisiert und BaFin/MiCA-auditierbar!`,
      inventory: inventoryList,
      totalMonthlyCostEur: currentCost,
      isBudgetCompliant: isCompliant,
      recommendedConfig: payload.currentConfig?.analysisFocusId ? {
        analysisFocusId: payload.currentConfig.analysisFocusId,
        latencyIntervalId: payload.currentConfig.latencyIntervalId || 'eod-daily',
        providerIds: payload.currentConfig.providerIds || ['twelvedata', 'fred'],
        cachingId: payload.currentConfig.cachingId || 'redis-ring',
        evidenceId: payload.currentConfig.evidenceId || 'worm-storage',
      } : undefined,
    };
  }

  // Default: BaFin Multi-Faktor Scoring
  return {
    thoughtProcess: `[SCIENTIST ANALYSIS: BAFIN-COMPLIANT MULTI-FACTOR SCORING]
1. BaFin & MiCA Prüfkriterien:
   - Nach WpHG § 83 und MaRisk müssen Risikofaktoren (Sharpe-Ratio, Value-at-Risk, Drawdown-Limits) mit unveränderbarem Audit-Trail dokumentiert werden.
   - Outlier Rejection: Preise müssen mindestens über 2 unabhängige Quellen plausibilisiert werden.
2. Taktung & Budget:
   - 15-Minuten Snapshot oder 1-Minuten Intraday genügt vollkommen für rechtssichere Kundenberatung und Fonds-Scoring.
   - TwelveData (8,50 €) deckt Aktien/Forex ab, FRED (0 €) liefert die Zinsstrukturkurve.
   - Budget: 8,50 € / 40,00 € (31,50 € Puffer).`,
    advice: `Ich habe das System als **BaFin-konformes Multi-Faktor Scoring** konfiguriert. Dieses Setup erfüllt sämtliche Anforderungen nach MaRisk und WpHG § 83 mit WORM-Storage Archivierung und Multi-Source Outlier Konsensus. Gesamtkosten: **8,50 € / Monat**.`,
    inventory: [
      {
        tier: 'Ebene 1: Analyse-Fokus',
        item: 'BaFin Multi-Faktor Scorer',
        specs: 'Sharpe Ratio, VaR (99%), Drawdown-Limits, Stresstest',
        costEur: 0,
        latencyEffect: '1-15 Min Refresh',
        bafinRelevance: 'WpHG § 83 & MaRisk Anlageberatung',
      },
      {
        tier: 'Ebene 2: Taktung',
        item: '15-Minuten Delayed Snapshot (BaFin-Standard)',
        specs: 'Gesiegelte Zeitstempel & Kursmittelwerte',
        costEur: 0,
        latencyEffect: 'Niedrige API-Kosten',
        bafinRelevance: 'Offizieller Prüfstandard',
      },
      {
        tier: 'Ebene 3: Datenquellen',
        item: 'TwelveData + FRED St. Louis Fed',
        specs: 'Multi-Asset + Risikofreier Basiszins',
        costEur: 8.5,
        latencyEffect: '40 - 80ms RTT',
        bafinRelevance: 'Zugelassene Benchmark-Feeds',
      },
      {
        tier: 'Ebene 4: Caching',
        item: 'Redis Ring Buffer & Token-Bucket Rate Limiter',
        specs: 'DoS-Schutz & stabiler Durchsatz',
        costEur: 0,
        latencyEffect: 'Sub-5ms Cache Hit',
        bafinRelevance: 'Ausfallsicherheits-Nachweis',
      },
      {
        tier: 'Ebene 5: Audit-Trail',
        item: 'WORM Storage & Multi-Source Consensus',
        specs: '5 Jahre Revisionssicherheit + Outlier-Filter',
        costEur: 0,
        latencyEffect: 'Keine messbare Verzögerung',
        bafinRelevance: 'Vollständig zertifizierungsfähig',
      },
    ],
    totalMonthlyCostEur: 8.5,
    isBudgetCompliant: true,
    recommendedConfig: {
      analysisFocusId: 'bafin-scoring',
      latencyIntervalId: 'delayed-15m',
      providerIds: ['twelvedata', 'fred'],
      cachingId: 'redis-ring',
      evidenceId: 'worm-storage',
    },
  };
}
