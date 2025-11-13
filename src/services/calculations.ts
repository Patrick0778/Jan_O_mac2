import {Trade} from '../models/Trade';

export const calculatePnL = (trade: Trade): number => {
  if (!trade.exitPrice) return 0;

  const pnl =
    trade.direction === 'Long'
      ? (trade.exitPrice - trade.entryPrice) * trade.quantity
      : (trade.entryPrice - trade.exitPrice) * trade.quantity;

  return pnl - trade.commission;
};

export const calculatePnLPercentage = (trade: Trade): number => {
  if (!trade.exitPrice) return 0;

  const pnl = calculatePnL(trade);
  const costBasis = trade.entryPrice * trade.quantity;

  return (pnl / costBasis) * 100;
};

export const calculateWinRate = (trades: Trade[]): number => {
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);
  if (closedTrades.length === 0) return 0;

  const winningTrades = closedTrades.filter(t => calculatePnL(t) > 0);
  return (winningTrades.length / closedTrades.length) * 100;
};

export const calculateTotalPnL = (trades: Trade[]): number => {
  return trades
    .filter(t => t.exitPrice !== undefined)
    .reduce((sum, trade) => sum + calculatePnL(trade), 0);
};

export const calculateProfitFactor = (trades: Trade[]): number => {
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);

  let totalProfit = 0;
  let totalLoss = 0;

  closedTrades.forEach(trade => {
    const pnl = calculatePnL(trade);
    if (pnl > 0) {
      totalProfit += pnl;
    } else {
      totalLoss += Math.abs(pnl);
    }
  });

  return totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
};

export const calculateExpectancy = (trades: Trade[]): number => {
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);
  if (closedTrades.length === 0) return 0;

  const winRate = calculateWinRate(closedTrades) / 100;
  const wins = closedTrades.filter(t => calculatePnL(t) > 0);
  const losses = closedTrades.filter(t => calculatePnL(t) < 0);

  const averageWin =
    wins.length > 0
      ? wins.reduce((sum, t) => sum + calculatePnL(t), 0) / wins.length
      : 0;

  const averageLoss =
    losses.length > 0
      ? Math.abs(
          losses.reduce((sum, t) => sum + calculatePnL(t), 0) / losses.length,
        )
      : 0;

  return winRate * averageWin - (1 - winRate) * averageLoss;
};

export const calculateAverageWin = (trades: Trade[]): number => {
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);
  const wins = closedTrades.filter(t => calculatePnL(t) > 0);

  if (wins.length === 0) return 0;

  return wins.reduce((sum, t) => sum + calculatePnL(t), 0) / wins.length;
};

export const calculateAverageLoss = (trades: Trade[]): number => {
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);
  const losses = closedTrades.filter(t => calculatePnL(t) < 0);

  if (losses.length === 0) return 0;

  return Math.abs(
    losses.reduce((sum, t) => sum + calculatePnL(t), 0) / losses.length,
  );
};

export const calculateRiskRewardRatio = (trade: Trade): number | undefined => {
  if (!trade.stopLoss || !trade.takeProfit) return undefined;

  const risk = Math.abs(trade.entryPrice - trade.stopLoss);
  const reward = Math.abs(trade.takeProfit - trade.entryPrice);

  return risk === 0 ? 0 : reward / risk;
};

export const calculateTradeDuration = (trade: Trade): number | undefined => {
  if (!trade.exitDate) return undefined;

  const entryTime = new Date(trade.entryDate).getTime();
  const exitTime = new Date(trade.exitDate).getTime();

  // Return duration in hours
  return (exitTime - entryTime) / (1000 * 60 * 60);
};

export const calculateMaximumDrawdown = (trades: Trade[]): number => {
  const closedTrades = trades
    .filter(t => t.exitPrice !== undefined)
    .sort(
      (a, b) =>
        new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime(),
    );

  if (closedTrades.length === 0) return 0;

  let peak = 0;
  let maxDrawdown = 0;
  let equity = 0;

  closedTrades.forEach(trade => {
    equity += calculatePnL(trade);

    if (equity > peak) {
      peak = equity;
    }

    const drawdown = peak - equity;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return maxDrawdown;
};

export const calculateRecoveryFactor = (trades: Trade[]): number => {
  const totalPnL = calculateTotalPnL(trades);
  const maxDrawdown = calculateMaximumDrawdown(trades);

  if (maxDrawdown === 0) return totalPnL > 0 ? Infinity : 0;

  return totalPnL / maxDrawdown;
};

export const calculateSharpeRatio = (trades: Trade[]): number => {
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);

  if (closedTrades.length < 2) return 0;

  const returns = closedTrades.map(t => calculatePnLPercentage(t));
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // Calculate standard deviation
  const squaredDiffs = returns.map(r => Math.pow(r - avgReturn, 2));
  const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  // Assuming risk-free rate is 0 for simplicity
  return avgReturn / stdDev;
};

export const calculateLargestWin = (trades: Trade[]): number => {
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);

  if (closedTrades.length === 0) return 0;

  return Math.max(...closedTrades.map(t => calculatePnL(t)));
};

export const calculateLargestLoss = (trades: Trade[]): number => {
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);

  if (closedTrades.length === 0) return 0;

  return Math.min(...closedTrades.map(t => calculatePnL(t)));
};

export const calculateCurrentStreak = (
  trades: Trade[],
): {type: 'winning' | 'losing' | 'none'; count: number} => {
  const closedTrades = trades
    .filter(t => t.exitPrice !== undefined)
    .sort(
      (a, b) =>
        new Date(b.exitDate!).getTime() - new Date(a.exitDate!).getTime(),
    );

  if (closedTrades.length === 0) return {type: 'none', count: 0};

  const lastTradePnL = calculatePnL(closedTrades[0]);
  const streakType: 'winning' | 'losing' =
    lastTradePnL > 0 ? 'winning' : 'losing';
  let count = 0;

  for (const trade of closedTrades) {
    const pnl = calculatePnL(trade);
    const isWin = pnl > 0;

    if (
      (streakType === 'winning' && isWin) ||
      (streakType === 'losing' && !isWin)
    ) {
      count++;
    } else {
      break;
    }
  }

  return {type: streakType, count};
};

export const calculateConsecutiveWinsLosses = (
  trades: Trade[],
): {maxWinStreak: number; maxLossStreak: number} => {
  const closedTrades = trades
    .filter(t => t.exitPrice !== undefined)
    .sort(
      (a, b) =>
        new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime(),
    );

  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  closedTrades.forEach(trade => {
    const pnl = calculatePnL(trade);

    if (pnl > 0) {
      currentWinStreak++;
      currentLossStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    } else {
      currentLossStreak++;
      currentWinStreak = 0;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
    }
  });

  return {maxWinStreak, maxLossStreak};
};

export const calculateEquityCurve = (
  trades: Trade[],
): Array<{date: Date; equity: number}> => {
  const closedTrades = trades
    .filter(t => t.exitPrice !== undefined)
    .sort(
      (a, b) =>
        new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime(),
    );

  let equity = 0;
  const curve: Array<{date: Date; equity: number}> = [];

  closedTrades.forEach(trade => {
    equity += calculatePnL(trade);
    curve.push({
      date: new Date(trade.exitDate!),
      equity,
    });
  });

  return curve;
};

// Goal Tracking Functions
export interface GoalProgress {
  goalId: string;
  current: number;
  target: number;
  progress: number; // percentage
  achieved: boolean;
  remaining: number;
}

export const calculateGoalProgress = (
  goalType: 'profit' | 'winRate' | 'tradeLimit' | 'drawdown',
  target: number,
  trades: Trade[],
  period: 'daily' | 'weekly' | 'monthly',
): GoalProgress => {
  const now = new Date();
  let periodTrades = trades;

  // Filter trades by period
  switch (period) {
    case 'daily':
      periodTrades = trades.filter(t => {
        const tradeDate = new Date(t.createdAt);
        return tradeDate.toDateString() === now.toDateString();
      });
      break;
    case 'weekly':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      periodTrades = trades.filter(t => new Date(t.createdAt) >= weekAgo);
      break;
    case 'monthly':
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodTrades = trades.filter(t => new Date(t.createdAt) >= monthStart);
      break;
  }

  let current = 0;
  let achieved = false;

  switch (goalType) {
    case 'profit':
      current = calculateTotalPnL(periodTrades);
      achieved = current >= target;
      break;
    case 'winRate':
      current = calculateWinRate(periodTrades);
      achieved = current >= target;
      break;
    case 'tradeLimit':
      current = periodTrades.length;
      achieved = current <= target; // For limits, achieved means not exceeded
      break;
    case 'drawdown':
      current = calculateMaximumDrawdown(periodTrades);
      achieved = current <= target; // For drawdown, achieved means staying under limit
      break;
  }

  const progress =
    goalType === 'tradeLimit' || goalType === 'drawdown'
      ? (current / target) * 100 // For limits, show how close to limit
      : (current / target) * 100; // For targets, show progress toward goal

  return {
    goalId: '',
    current,
    target,
    progress: Math.min(progress, 100),
    achieved,
    remaining: target - current,
  };
};
