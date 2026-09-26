/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Ingestion Node Contracts (14 Nodes)
 */

import { z } from 'zod';
import { AssetClassSchema, NodePort } from '../common';

// 1. provider_rest
export const ProviderRestConfigSchema = z.object({
  endpointUrl: z.string().url(),
  method: z.enum(['GET', 'POST']),
  pollIntervalMs: z.number().int().min(100).max(60000).default(1000),
  authType: z.enum(['none', 'bearer', 'api_key_header', 'basic']).default('api_key_header'),
  apiKeySecretRef: z.string().optional(),
  timeoutMs: z.number().int().min(50).max(10000).default(2500),
  maxRetries: z.number().int().min(0).max(5).default(3),
  targetAssetClass: AssetClassSchema,
  symbols: z.array(z.string().min(1)).min(1),
});
export type ProviderRestConfig = z.infer<typeof ProviderRestConfigSchema>;

// 2. provider_websocket
export const ProviderWebsocketConfigSchema = z.object({
  endpointUrl: z.string().regex(/^wss?:\/\//i),
  subscriptionPayload: z.record(z.string(), z.any()),
  reconnectIntervalMs: z.number().int().min(500).max(30000).default(2000),
  heartbeatIntervalMs: z.number().int().min(1000).max(60000).default(15000),
  sequenceValidation: z.boolean().default(true),
  targetAssetClass: AssetClassSchema,
  symbols: z.array(z.string().min(1)).min(1),
  channelType: z.enum(['trades', 'depth_l2', 'depth_l3_mbo', 'ticker', 'all']).default('trades'),
});
export type ProviderWebsocketConfig = z.infer<typeof ProviderWebsocketConfigSchema>;

// 3. rss_feed
export const RssFeedConfigSchema = z.object({
  feedUrls: z.array(z.string().url()).min(1),
  pollIntervalMinutes: z.number().int().min(1).max(1440).default(10),
  contentFilteringRegex: z.string().optional(),
  stripHtml: z.boolean().default(true),
  maxItemsPerBatch: z.number().int().min(1).max(100).default(20),
});
export type RssFeedConfig = z.infer<typeof RssFeedConfigSchema>;

// 4. file_upload
export const FileUploadConfigSchema = z.object({
  acceptedMimeTypes: z.array(z.string()).default(['application/json', 'text/csv', 'application/parquet']),
  maxFileSizeMb: z.number().min(0.1).max(50).default(10),
  schemaMapping: z.record(z.string(), z.string()).optional(),
});
export type FileUploadConfig = z.infer<typeof FileUploadConfigSchema>;

// 5. csv_import
export const CsvImportConfigSchema = z.object({
  delimiter: z.enum([',', ';', '\t', '|']).default(','),
  hasHeader: z.boolean().default(true),
  timestampColumn: z.string().min(1).default('timestamp'),
  timestampFormat: z.enum(['iso8601', 'unix_ms', 'unix_s', 'rfc2822']).default('iso8601'),
  symbolColumn: z.string().optional(),
  priceColumn: z.string().min(1).default('close'),
  volumeColumn: z.string().optional().default('volume'),
});
export type CsvImportConfig = z.infer<typeof CsvImportConfigSchema>;

// 6. manual_input
export const ManualInputConfigSchema = z.object({
  testPayloadJson: z.string().min(2),
  repeatIntervalMs: z.number().int().min(0).default(0),
  injectJitter: z.boolean().default(false),
});
export type ManualInputConfig = z.infer<typeof ManualInputConfigSchema>;

// 7. blockchain_rpc
export const BlockchainRpcConfigSchema = z.object({
  network: z.enum(['ethereum', 'arbitrum', 'optimism', 'base', 'solana', 'polygon']),
  rpcUrl: z.string().url(),
  eventSignatures: z.array(z.string()).min(1),
  targetContractAddresses: z.array(z.string().min(10)).min(1),
  confirmationsRequired: z.number().int().min(0).max(64).default(1),
});
export type BlockchainRpcConfig = z.infer<typeof BlockchainRpcConfigSchema>;

// 8. graphql_subgraph
export const GraphqlSubgraphConfigSchema = z.object({
  subgraphEndpointUrl: z.string().url(),
  queryTemplate: z.string().min(10),
  pollIntervalSeconds: z.number().int().min(5).max(3600).default(15),
  variablesJson: z.string().default('{}'),
});
export type GraphqlSubgraphConfig = z.infer<typeof GraphqlSubgraphConfigSchema>;

// 9. social_api
export const SocialApiConfigSchema = z.object({
  platform: z.enum(['x_twitter', 'reddit', 'farcaster', 'telegram_channel']),
  searchKeywords: z.array(z.string().min(1)).min(1),
  sentimentFilter: z.enum(['all', 'bullish_only', 'bearish_only']).default('all'),
  rateLimitPerMinute: z.number().int().min(1).max(60).default(10),
});
export type SocialApiConfig = z.infer<typeof SocialApiConfigSchema>;

// 10. news_api
export const NewsApiConfigSchema = z.object({
  provider: z.enum(['benzinga', 'reuters_wire', 'polygon_news', 'financial_modeling_prep', 'alpha_vantage']),
  tickers: z.array(z.string().min(1)).min(1),
  includePressReleases: z.boolean().default(false),
  fetchFullContent: z.boolean().default(false),
});
export type NewsApiConfig = z.infer<typeof NewsApiConfigSchema>;

// 11. macro_api
export const MacroApiConfigSchema = z.object({
  seriesId: z.enum([
    'FEDFUNDS',
    'T10Y2Y',
    'CPIAUCSL',
    'UNRATE',
    'M2SL',
    'BAMLH0A0HYM2',
    'VIXCLS',
  ]),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  fillForwardMissing: z.boolean().default(true),
});
export type MacroApiConfig = z.infer<typeof MacroApiConfigSchema>;

// 12. github_api
export const GithubApiConfigSchema = z.object({
  repositories: z.array(z.string().regex(/^[\w.-]+\/[\w.-]+$/)).min(1),
  trackCommits: z.boolean().default(true),
  trackReleases: z.boolean().default(true),
  pollIntervalHours: z.number().int().min(1).max(72).default(6),
});
export type GithubApiConfig = z.infer<typeof GithubApiConfigSchema>;

// 13. ga4_mcp
export const Ga4McpConfigSchema = z.object({
  propertyId: z.string().min(1),
  metrics: z.array(z.string()).min(1).default(['activeUsers', 'screenPageViews']),
  dimensions: z.array(z.string()).default(['pagePath', 'country']),
  dateRangeDays: z.number().int().min(1).max(90).default(7),
});
export type Ga4McpConfig = z.infer<typeof Ga4McpConfigSchema>;

// 14. search_console_api
export const SearchConsoleApiConfigSchema = z.object({
  siteUrl: z.string().url(),
  searchType: z.enum(['web', 'image', 'news']).default('web'),
  queryFilters: z.array(z.string()).optional(),
  aggregationType: z.enum(['auto', 'byPage', 'byProperty']).default('auto'),
});
export type SearchConsoleApiConfig = z.infer<typeof SearchConsoleApiConfigSchema>;

// Node Ports Factory for Ingestion Nodes
export const INGESTION_PORTS: Record<string, NodePort[]> = {
  provider_websocket: [
    { id: 'ticks_out', name: 'Raw Ticks', type: 'tick_stream', direction: 'out', required: true },
    { id: 'depth_out', name: 'L2 Orderbook', type: 'orderbook_l2', direction: 'out', required: false },
  ],
  provider_rest: [
    { id: 'quotes_out', name: 'Price Quotes', type: 'tick_stream', direction: 'out', required: true },
  ],
  rss_feed: [
    { id: 'news_out', name: 'News Stream', type: 'news_event', direction: 'out', required: true },
  ],
  blockchain_rpc: [
    { id: 'events_out', name: 'On-Chain Events', type: 'onchain_tx', direction: 'out', required: true },
  ],
  macro_api: [
    { id: 'macro_out', name: 'Macro Time Series', type: 'macro_series', direction: 'out', required: true },
  ],
};
