import { jsPDF } from 'jspdf';

export interface AssetAnalysisPdfData {
  type: 'asset';
  symbol: string;
  name: string;
  score: number;
  trend: string;
  recommendation: string;
  factors: {
    label: string;
    value: string;
    sublabel: string;
  }[];
  overviewText?: string;
}

export interface SectorAnalysisPdfData {
  type: 'sector';
  id: string;
  name: string;
  shortName: string;
  rotationLabel: string;
  beta: number;
  aiScore: number;
  performance1M: number;
  aiSummary: string;
  growthDrivers: string[];
  keyRisks: string[];
  topAssetSymbols: string[];
}

export type AnalysisPdfData = AssetAnalysisPdfData | SectorAnalysisPdfData;

export function generateAnalysisPDF(data: AnalysisPdfData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Background Header Band (Dark Theme aesthetic in printable PDF)
  doc.setFillColor(7, 14, 34); // #070e22
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Golden accent line
  doc.setFillColor(245, 176, 20); // #f5b014
  doc.rect(0, 41, pageWidth, 1.5, 'F');

  // Capital-AI Logo / Title
  doc.setTextColor(245, 176, 20);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CAPITAL-AI', margin, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 190, 210);
  doc.text('NEXT-GEN QUANT TERMINAL • INSTITUTIONAL MARKET INTELLIGENCE', margin, 24);

  // Metadata right aligned
  const currentDate = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  doc.setFontSize(8);
  doc.setTextColor(200, 210, 230);
  doc.text(`DATUM: ${currentDate} | ${currentTime} CET`, pageWidth - margin, 18, { align: 'right' });
  doc.text('SYSTEM: AI-SCORING ENGINE v4.2', pageWidth - margin, 24, { align: 'right' });
  doc.text('REPORT STATUS: VERIFIED', pageWidth - margin, 30, { align: 'right' });

  let yPos = 52;

  if (data.type === 'asset') {
    // ASSET REPORT
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EINZEL-ASSET BEWERTUNG & QUANTITATIVE ANALYSE', margin, yPos);
    yPos += 7;

    // Asset Hero Card
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos, contentWidth, 34, 3, 3, 'FD');

    // Asset Name & Symbol
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.name, margin + 6, yPos + 12);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(`TICKER: ${data.symbol}   |   TREND 24H: ${data.trend}`, margin + 6, yPos + 19);

    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105);
    doc.text(`EINSTUFUNG: ${data.recommendation.toUpperCase()}`, margin + 6, yPos + 26);

    // Score Badge Box
    const scoreBoxX = pageWidth - margin - 45;
    doc.setFillColor(7, 14, 34);
    doc.roundedRect(scoreBoxX, yPos + 4, 39, 26, 2, 2, 'F');

    doc.setTextColor(245, 176, 20);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.score}`, scoreBoxX + 19.5, yPos + 18, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('KI-SCORE / 100', scoreBoxX + 19.5, yPos + 24, { align: 'center' });

    yPos += 44;

    // Multi-factor breakdown section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('FAKTOREN-ANALYSE & RISIKO-METRIKEN', margin, yPos);
    yPos += 6;

    // Grid of 4 factors
    const cardW = (contentWidth - 6) / 2;
    const cardH = 24;

    data.factors.forEach((f, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cardX = margin + col * (cardW + 6);
      const cardY = yPos + row * (cardH + 4);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(cardX, cardY, cardW, cardH, 2, 2, 'FD');

      // Accent pill
      doc.setFillColor(245, 176, 20);
      doc.rect(cardX, cardY, 2.5, cardH, 'F');

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(f.label.toUpperCase(), cardX + 6, cardY + 7);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(f.value, cardX + 6, cardY + 14);

      doc.setTextColor(71, 85, 105);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(f.sublabel, cardX + 6, cardY + 20);
    });

    yPos += Math.ceil(data.factors.length / 2) * (cardH + 4) + 8;

    // Quantitative Scoring Methodology Note
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, yPos, contentWidth, 38, 2, 2, 'FD');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('METHODIK DES CAPITAL-AI MULTI-FAKTOR-SCORING', margin + 6, yPos + 8);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const methodDesc = [
      `1. Fundamentalanalyse: Graham/Buffett Value-Matrix, Free-Cashflow-Rendite und ROIC.`,
      `2. Risiko-Indikatoren: Altman Z-Score zur Insolvenzwahrscheinlichkeit & Piotroski F-Score.`,
      `3. NLP Sentiment: Echtzeit-Analyse aus 25.000+ News-Feeds und institutionellen SEC-Filings.`,
      `4. Technischer Momentum-Filter: Sub-Tages Trendbestätigung und Smart-Money Orderbuch-Flows.`,
    ];
    methodDesc.forEach((line, i) => {
      doc.text(line, margin + 6, yPos + 15 + i * 5);
    });

    yPos += 48;
  } else {
    // SECTOR REPORT
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SEKTOR-ROTATIONS-ANALYSE & INSTITUTIONELLER KAPITALFLUSS', margin, yPos);
    yPos += 7;

    // Sector Hero Card
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos, contentWidth, 34, 3, 3, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.name, margin + 6, yPos + 12);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 116, 144);
    doc.text(`ROTATION: ${data.rotationLabel}   |   BETA: ${data.beta}`, margin + 6, yPos + 19);

    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105);
    doc.text(`1-MONATS PERFORMANCE: +${data.performance1M}%`, margin + 6, yPos + 26);

    // Score Box
    const scoreBoxX = pageWidth - margin - 45;
    doc.setFillColor(7, 14, 34);
    doc.roundedRect(scoreBoxX, yPos + 4, 39, 26, 2, 2, 'F');

    doc.setTextColor(6, 182, 212);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.aiScore}`, scoreBoxX + 19.5, yPos + 18, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('SEKTOR SCORE', scoreBoxX + 19.5, yPos + 24, { align: 'center' });

    yPos += 42;

    // Summary Card
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('KI-SEKTOR-EINSCHÄTZUNG:', margin + 5, yPos + 7);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(data.aiSummary, contentWidth - 10);
    doc.text(splitSummary, margin + 5, yPos + 13);

    yPos += 30;

    // Drivers & Risks Columns
    const colW = (contentWidth - 6) / 2;
    // Growth Drivers Box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, yPos, colW, 36, 2, 2, 'FD');

    doc.setTextColor(22, 101, 52);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ WACHSTUMSTREIBER', margin + 4, yPos + 7);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    data.growthDrivers.slice(0, 3).forEach((d, i) => {
      const splitD = doc.splitTextToSize(`• ${d}`, colW - 8);
      doc.text(splitD, margin + 4, yPos + 14 + i * 7);
    });

    // Risks Box
    const riskX = margin + colW + 6;
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(riskX, yPos, colW, 36, 2, 2, 'FD');

    doc.setTextColor(153, 27, 27);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠ RISIKOFAKTOREN', riskX + 4, yPos + 7);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    data.keyRisks.slice(0, 3).forEach((r, i) => {
      const splitR = doc.splitTextToSize(`• ${r}`, colW - 8);
      doc.text(splitR, riskX + 4, yPos + 14 + i * 7);
    });

    yPos += 42;

    // Leading Assets
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('LEIT-ASSETS DIESES SEKTORES:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(data.topAssetSymbols.join('   •   '), margin + 60, yPos);
    yPos += 14;
  }

  // Footer / Compliance Note
  const footerY = pageHeight - 26;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('CAPITAL-AI COMPLIANCE & DISCLAIMER:', margin, footerY + 5);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  const disclaimerText =
    'Dieser automatisiert generierte Analysebericht dient ausschließlich zu Informations- und Research-Zwecken und stellt keine Anlageberatung, Kaufempfehlung oder Aufforderung zum Handel mit Wertpapieren dar. Historische Renditen und KI-Scores sind keine Garantie für zukünftige Wertentwicklungen. Capital-AI Technologies.';
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, contentWidth);
  doc.text(splitDisclaimer, margin, footerY + 10);

  // Trigger download
  const filename =
    data.type === 'asset'
      ? `CapitalAI_Analyse_${data.symbol}_${currentDate.replace(/\./g, '-')}.pdf`
      : `CapitalAI_Sektor_${data.shortName}_${currentDate.replace(/\./g, '-')}.pdf`;

  doc.save(filename);
}
