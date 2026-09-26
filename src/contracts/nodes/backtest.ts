/**
 * CAPITAL AI — CONTRACT-FIRST ARCHITECTURE (AP-001)
 * Benchmarking, Backtest & Paper Execution Contracts (AP-005)
 */

import { z } from 'zod';
import { NodePort } from '../common';

// 1. historical_backtest_runner (AP-005)
export const HistoricalBacktestRunnerConfigSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  initialCapitalEur: z.number().positive().default(100000),
  slippageModel: z.enum(['fixed_basis_points', 'volume_share_impact', 'zero_slippage']).default('fixed_basis_points'),
  slippageBps: z.number().min(0).max(100).default(5),
  makerFeeBps: z.number().default(2),
  takerFeeBps: z.number().default(5),
  warmupBars: z.number().int().min(0).max(500).default(50),
});
export type HistoricalBacktestRunnerConfig = z.infer<typeof HistoricalBacktestRunnerConfigSchema>;

// 2. benchmark_comparator
export const BenchmarkComparatorConfigSchema = z.object({
  benchmarkSymbols: z.array(z.enum(['SPY', 'QQQ', 'BTC-USD', 'DAX', 'URTH'])).min(1).default(['SPY', 'BTC-USD']),
  metricsToCompute: z.array(
    z.enum([
      'sharpe_ratio',
      'sortino_ratio',
      'calmar_ratio',
      'max_drawdown',
      'alpha_beta',
      'information_ratio',
      'win_rate',
    ])
  ).min(1),
  riskFreeRate: z.number().min(0).max(0.15).default(0.04),
});
export type BenchmarkComparatorConfig = z.infer<typeof BenchmarkComparatorConfigSchema>;

// 3. monte_carlo_simulator
export const MonteCarloSimulatorConfigSchema = z.object({
  numberOfSimulations: z.number().int().min(100).max(10000).default(1000),
  resamplingMethod: z.enum(['bootstrap_with_replacement', 'block_bootstrap', 't_distribution_fit']).default('block_bootstrap'),
  blockSizeDays: z.number().int().min(1).max(30).default(5),
  confidenceIntervals: z.array(z.number()).default([0.90, 0.95, 0.99]),
});
export type MonteCarloSimulatorConfig = z.infer<typeof MonteCarloSimulatorConfigSchema>;

// 4. paper_broker_adapter (Paper-first execution AP-005)
export const PaperBrokerAdapterConfigSchema = z.object({
  virtualAccountId: z.string().uuid(),
  initialBalanceEur: z.number().positive().default(50000),
  allowFractionalShares: z.boolean().default(true),
  fillLatencySimulatedMs: z.number().int().min(0).max(2000).default(45),
  persistOrderBookAudit: z.boolean().default(true),
});
export type PaperBrokerAdapterConfig = z.infer<typeof PaperBrokerAdapterConfigSchema>;

export const BACKTEST_PORTS: Record<string, NodePort[]> = {
  historical_backtest_runner: [
    { id: 'in_candles', name: 'Historical OHLCV', type: 'ohlcv_candle', direction: 'in', required: true },
    { id: 'out_backtest_metrics', name: 'Backtest Result', type: 'score_metric', direction: 'out', required: true },
  ],
  paper_broker_adapter: [
    { id: 'in_orders', name: 'Paper Orders', type: 'paper_order', direction: 'in', required: true },
    { id: 'out_reports', name: 'Execution Reports', type: 'execution_report', direction: 'out', required: true },
  ],
};
