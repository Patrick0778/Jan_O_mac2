export interface Strategy {
  id: string;
  name: string;
  description: string;
  rules: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyPerformance {
  strategyId: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalPnl: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
}
