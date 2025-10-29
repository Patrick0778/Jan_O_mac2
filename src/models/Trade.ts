export type AssetClass = 'Stocks' | 'Forex' | 'Crypto' | 'Options' | 'Futures';
export type TradeDirection = 'Long' | 'Short';

export interface Trade {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  direction: TradeDirection;
  entryDate: Date;
  entryPrice: number;
  exitDate?: Date;
  exitPrice?: number;
  quantity: number;
  commission: number;
  stopLoss?: number;
  takeProfit?: number;
  strategyId?: string;
  notes: {
    preTradeAnalysis?: string;
    postTradeReview?: string;
    emotionalState?: string;
    marketConditions?: string;
  };
  screenshots: string[];
  tags: string[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeCalculations {
  pnl: number;
  pnlPercentage: number;
  riskRewardRatio?: number;
  duration?: number;
}
