/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Egress, Target Tool Adapters, Alerts & Presentation Contracts
 */

import { z } from 'zod';
import { NodePort } from '../common';

// 1. target_adapter_tradingview
export const TargetAdapterTradingViewConfigSchema = z.object({
  protocol: z.literal('WebSocket (WSS) & PineScript Webhook Relay'),
  format: z.literal('UDF / Lightweight OHLCV + Ticks'),
  webhookUrl: z.string().url().optional(),
  enableCustomPinePlots: z.boolean().default(true),
});
export type TargetAdapterTradingViewConfig = z.infer<typeof TargetAdapterTradingViewConfigSchema>;

// 2. target_adapter_bloomberg
export const TargetAdapterBloombergConfigSchema = z.object({
  protocol: z.literal('BLPAPI Bridge via gRPC / ZeroMQ'),
  format: z.literal('B-PIPE Compatible Normalized FIX 4.4'),
  fixSenderCompId: z.string().min(1).default('CAPITAL_AI_ROUTER'),
  fixTargetCompId: z.string().min(1).default('BLOOMBERG_BPIPE'),
  grpcPort: z.number().int().min(1024).max(65535).default(8815),
});
export type TargetAdapterBloombergConfig = z.infer<typeof TargetAdapterBloombergConfigSchema>;

// 3. target_adapter_python_arrow
export const TargetAdapterPythonArrowConfigSchema = z.object({
  protocol: z.literal('Apache Arrow Flight & ZeroMQ PUB/SUB'),
  format: z.literal('Zero-Copy PyArrow RecordBatches'),
  flightLocationUri: z.string().default('grpc://127.0.0.1:8815'),
  zeroCopySharedMemory: z.boolean().default(true),
});
export type TargetAdapterPythonArrowConfig = z.infer<typeof TargetAdapterPythonArrowConfigSchema>;

// 4. target_adapter_metatrader
export const TargetAdapterMetaTraderConfigSchema = z.object({
  protocol: z.literal('ZeroMQ DLL Wrapper / Windows Named Pipes'),
  format: z.literal('Binary Tick Struct (Ask, Bid, Volume, Seq)'),
  namedPipeIdentifier: z.string().default('\\\\.\\pipe\\CapitalAiMt5'),
  mqhBridgeIncludePath: z.string().default('Include/CapitalAiBridge.mqh'),
});
export type TargetAdapterMetaTraderConfig = z.infer<typeof TargetAdapterMetaTraderConfigSchema>;

// 5. target_adapter_bookmap
export const TargetAdapterBookmapConfigSchema = z.object({
  protocol: z.literal('Direct TCP Socket / C++ Shared Memory'),
  format: z.literal('Raw Level-3 Market By Order (MBO) Events'),
  tcpPort: z.number().int().min(1024).max(65535).default(9999),
  sharedMemoryKey: z.string().default('/capitalai_mbo_shm'),
});
export type TargetAdapterBookmapConfig = z.infer<typeof TargetAdapterBookmapConfigSchema>;

// 6. alert_dispatcher
export const AlertDispatcherConfigSchema = z.object({
  channels: z.array(z.enum(['telegram_bot', 'email_ses', 'webhook_post', 'in_app_toast'])).min(1),
  telegramChatId: z.string().optional(),
  webhookTargetUrl: z.string().url().optional(),
  rateLimitAlertsPerHour: z.number().int().min(1).max(100).default(12),
  alertSeverityFilter: z.enum(['all', 'medium_high', 'critical_only']).default('medium_high'),
});
export type AlertDispatcherConfig = z.infer<typeof AlertDispatcherConfigSchema>;

// 7. report_pdf_generator (AP-002)
export const ReportPdfGeneratorConfigSchema = z.object({
  templateStyle: z.enum(['institutional_dark', 'regulatory_clean', 'quant_technical']).default('institutional_dark'),
  includeEvidenceMerkleProofs: z.boolean().default(true),
  includeExplainabilityDrawer: z.boolean().default(true),
  includeDisclaimersAndWphg: z.boolean().default(true),
  paperTradingAuditTrail: z.boolean().default(true),
});
export type ReportPdfGeneratorConfig = z.infer<typeof ReportPdfGeneratorConfigSchema>;

export const EGRESS_PORTS: Record<string, NodePort[]> = {
  alert_dispatcher: [
    { id: 'in_signal', name: 'Trigger Signal', type: 'signal_event', direction: 'in', required: true },
  ],
  report_pdf_generator: [
    { id: 'in_scores', name: 'Verified Scores', type: 'score_metric', direction: 'in', required: true },
    { id: 'in_evidence', name: 'Merkle Audit Log', type: 'evidence_packet', direction: 'in', required: true },
  ],
};
