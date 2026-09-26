/**
 * CAPITAL AI — PAPER-FIRST EXECUTION & RISK GUARDRAIL ENGINE (AP-004, AP-005)
 * Virtual Execution Adapter, Portfolio State, Guardrails & Merkle Evidence Attachment
 */

import { MerkleTree } from '../utils/merkleTree';

export interface PaperPosition {
  symbol: string;
  quantity: number;
  averageEntryPrice: number;
  currentMarkPrice: number;
  unrealizedPnlEur: number;
  unrealizedReturnPercent: number;
  updatedAt: string;
}

export interface PaperOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  quantity: number;
  price: number;
  executedPrice?: number;
  feeEur: number;
  slippageEur: number;
  status: 'pending_approval' | 'submitted' | 'filled' | 'rejected_risk' | 'cancelled';
  rejectionReason?: string;
  simulatedLatencyMs: number;
  evidenceBundle?: {
    merkleRoot: string;
    merkleLeaf: string;
    auditSignature: string;
  };
  createdAt: string;
  filledAt?: string;
}

export interface PaperPortfolioState {
  initialCapitalEur: number;
  cashBalanceEur: number;
  equityEur: number;
  realizedPnlEur: number;
  unrealizedPnlEur: number;
  maxDrawdownPercent: number;
  peakEquityEur: number;
  positions: PaperPosition[];
  orders: PaperOrder[];
}

export class PaperTradingEngine {
  private state: PaperPortfolioState;
  private listeners: Array<(state: PaperPortfolioState) => void> = [];

  constructor(initialCapital = 50000) {
    this.state = {
      initialCapitalEur: initialCapital,
      cashBalanceEur: initialCapital,
      equityEur: initialCapital,
      realizedPnlEur: 0,
      unrealizedPnlEur: 0,
      maxDrawdownPercent: 0,
      peakEquityEur: initialCapital,
      positions: [
        {
          symbol: 'BTC/USDT',
          quantity: 0.25,
          averageEntryPrice: 62400.0,
          currentMarkPrice: 64250.0,
          unrealizedPnlEur: 462.5,
          unrealizedReturnPercent: 2.96,
          updatedAt: new Date().toISOString(),
        },
        {
          symbol: 'NVDA',
          quantity: 40,
          averageEntryPrice: 122.5,
          currentMarkPrice: 128.4,
          unrealizedPnlEur: 236.0,
          unrealizedReturnPercent: 4.81,
          updatedAt: new Date().toISOString(),
        },
      ],
      orders: [],
    };
    this.recalculateEquity();
  }

  public getState(): PaperPortfolioState {
    return { ...this.state };
  }

  public subscribe(listener: (state: PaperPortfolioState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    const current = this.getState();
    this.listeners.forEach((listener) => listener(current));
  }

  /**
   * Recalculates equity, unrealized PnL and peak drawdown
   */
  public updateMarkPrice(symbol: string, newMarkPrice: number): void {
    let changed = false;
    this.state.positions = this.state.positions.map((pos) => {
      if (pos.symbol.toUpperCase() === symbol.toUpperCase()) {
        const unrealizedPnlEur = (newMarkPrice - pos.averageEntryPrice) * pos.quantity;
        const unrealizedReturnPercent = ((newMarkPrice - pos.averageEntryPrice) / pos.averageEntryPrice) * 100;
        changed = true;
        return {
          ...pos,
          currentMarkPrice: newMarkPrice,
          unrealizedPnlEur,
          unrealizedReturnPercent,
          updatedAt: new Date().toISOString(),
        };
      }
      return pos;
    });

    if (changed) {
      this.recalculateEquity();
      this.notify();
    }
  }

  private recalculateEquity(): void {
    const totalUnrealized = this.state.positions.reduce((sum, p) => sum + p.unrealizedPnlEur, 0);
    const totalPositionValue = this.state.positions.reduce((sum, p) => sum + p.quantity * p.currentMarkPrice, 0);
    this.state.unrealizedPnlEur = totalUnrealized;
    this.state.equityEur = this.state.cashBalanceEur + totalPositionValue;

    if (this.state.equityEur > this.state.peakEquityEur) {
      this.state.peakEquityEur = this.state.equityEur;
    }

    const currentDrawdown =
      ((this.state.peakEquityEur - this.state.equityEur) / this.state.peakEquityEur) * 100;
    this.state.maxDrawdownPercent = Math.max(this.state.maxDrawdownPercent, Math.max(0, currentDrawdown));
  }

  /**
   * Submit Paper Order with Risk Guardrail & Human Approval Verification
   */
  public submitOrder(params: {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    quantity: number;
    price: number;
    requireHumanApproval?: boolean;
    maxDrawdownLimitPercent?: number;
    maxPositionAllocationPercent?: number;
  }): PaperOrder {
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const orderValueEur = params.quantity * params.price;

    // 1. Guardrail Check: Max Drawdown Circuit (AP-004)
    if (params.maxDrawdownLimitPercent && this.state.maxDrawdownPercent >= params.maxDrawdownLimitPercent) {
      const rejectedOrder: PaperOrder = {
        id: orderId,
        symbol: params.symbol,
        side: params.side,
        type: params.type,
        quantity: params.quantity,
        price: params.price,
        feeEur: 0,
        slippageEur: 0,
        status: 'rejected_risk',
        rejectionReason: `Max Drawdown Circuit aktiviert (${this.state.maxDrawdownPercent.toFixed(1)}% >= Limit ${params.maxDrawdownLimitPercent}%).`,
        simulatedLatencyMs: 15,
        createdAt: now,
      };
      this.state.orders.unshift(rejectedOrder);
      this.notify();
      return rejectedOrder;
    }

    // 2. Guardrail Check: Position Limit Allocation (Max 25% by default)
    const maxAllocPercent = params.maxPositionAllocationPercent || 25.0;
    const maxAllowedOrderEur = (this.state.equityEur * maxAllocPercent) / 100;
    if (params.side === 'buy' && orderValueEur > maxAllowedOrderEur) {
      const rejectedOrder: PaperOrder = {
        id: orderId,
        symbol: params.symbol,
        side: params.side,
        type: params.type,
        quantity: params.quantity,
        price: params.price,
        feeEur: 0,
        slippageEur: 0,
        status: 'rejected_risk',
        rejectionReason: `Positions-Limit überschritten (${orderValueEur.toFixed(2)} € > Max ${maxAllowedOrderEur.toFixed(2)} € [${maxAllocPercent}%]).`,
        simulatedLatencyMs: 12,
        createdAt: now,
      };
      this.state.orders.unshift(rejectedOrder);
      this.notify();
      return rejectedOrder;
    }

    // 3. Human Approval Gate (AP-004)
    if (params.requireHumanApproval) {
      const pendingOrder: PaperOrder = {
        id: orderId,
        symbol: params.symbol,
        side: params.side,
        type: params.type,
        quantity: params.quantity,
        price: params.price,
        feeEur: 0,
        slippageEur: 0,
        status: 'pending_approval',
        simulatedLatencyMs: 20,
        createdAt: now,
      };
      this.state.orders.unshift(pendingOrder);
      this.notify();
      return pendingOrder;
    }

    // 4. Instant Simulated Fill
    return this.executeOrderFill(orderId, params);
  }

  /**
   * Human Operator Approval Action (AP-004)
   */
  public approveOrder(orderId: string): boolean {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order || order.status !== 'pending_approval') return false;

    this.executeOrderFill(order.id, {
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      quantity: order.quantity,
      price: order.price,
    });
    return true;
  }

  public rejectOrder(orderId: string, reason = 'Von Operator abgelehnt'): boolean {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order || order.status !== 'pending_approval') return false;

    order.status = 'rejected_risk';
    order.rejectionReason = reason;
    this.notify();
    return true;
  }

  /**
   * Internal execution of fill with slippage, fees, position update and Merkle evidence
   */
  private executeOrderFill(
    orderId: string,
    params: { symbol: string; side: 'buy' | 'sell'; type: 'market' | 'limit'; quantity: number; price: number }
  ): PaperOrder {
    const slippageBps = 3.5;
    const feeBps = 4.0;
    const slippageMultiplier = params.side === 'buy' ? 1 + slippageBps / 10000 : 1 - slippageBps / 10000;
    const executedPrice = params.price * slippageMultiplier;
    const executionValue = executedPrice * params.quantity;
    const feeEur = (executionValue * feeBps) / 10000;
    const slippageEur = Math.abs(executionValue - params.price * params.quantity);

    // Cryptographic Merkle Evidence Creation (AP-002)
    const evidencePayload = {
      orderId,
      symbol: params.symbol,
      side: params.side,
      quantity: params.quantity,
      executedPrice,
      timestamp: Date.now(),
    };
    const merkleTree = new MerkleTree([evidencePayload, 'PREV_BLOCK_HASH', 'OPERATOR_QUORUM_3']);
    const merkleProof = merkleTree.getProof(0);

    const filledOrder: PaperOrder = {
      id: orderId,
      symbol: params.symbol,
      side: params.side,
      type: params.type,
      quantity: params.quantity,
      price: params.price,
      executedPrice,
      feeEur,
      slippageEur,
      status: 'filled',
      simulatedLatencyMs: Math.floor(Math.random() * 20 + 35),
      evidenceBundle: {
        merkleRoot: merkleProof.root,
        merkleLeaf: merkleProof.leaf,
        auditSignature: `SIG_${merkleProof.root.slice(0, 16)}`,
      },
      createdAt: new Date().toISOString(),
      filledAt: new Date().toISOString(),
    };

    // Update Cash Balance & Positions
    if (params.side === 'buy') {
      this.state.cashBalanceEur -= executionValue + feeEur;
      const existingPos = this.state.positions.find((p) => p.symbol.toUpperCase() === params.symbol.toUpperCase());
      if (existingPos) {
        const totalQty = existingPos.quantity + params.quantity;
        const totalCost = existingPos.quantity * existingPos.averageEntryPrice + executionValue;
        existingPos.quantity = totalQty;
        existingPos.averageEntryPrice = totalCost / totalQty;
        existingPos.currentMarkPrice = executedPrice;
        existingPos.updatedAt = new Date().toISOString();
      } else {
        this.state.positions.push({
          symbol: params.symbol,
          quantity: params.quantity,
          averageEntryPrice: executedPrice,
          currentMarkPrice: executedPrice,
          unrealizedPnlEur: 0,
          unrealizedReturnPercent: 0,
          updatedAt: new Date().toISOString(),
        });
      }
    } else {
      // Sell
      this.state.cashBalanceEur += executionValue - feeEur;
      const existingPos = this.state.positions.find((p) => p.symbol.toUpperCase() === params.symbol.toUpperCase());
      if (existingPos) {
        const realized = (executedPrice - existingPos.averageEntryPrice) * params.quantity - feeEur;
        this.state.realizedPnlEur += realized;
        existingPos.quantity -= params.quantity;
        if (existingPos.quantity <= 0.00001) {
          this.state.positions = this.state.positions.filter((p) => p.symbol !== existingPos.symbol);
        }
      }
    }

    // Update orders list
    const existingIndex = this.state.orders.findIndex((o) => o.id === orderId);
    if (existingIndex >= 0) {
      this.state.orders[existingIndex] = filledOrder;
    } else {
      this.state.orders.unshift(filledOrder);
    }

    this.recalculateEquity();
    this.notify();
    return filledOrder;
  }
}

// Global Singleton for the Paper Trading session
export const globalPaperTradingEngine = new PaperTradingEngine(50000);
