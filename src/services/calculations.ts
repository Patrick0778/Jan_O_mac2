import {Trade} from '../models/Trade';

export const calculatePnL = (trade: Trade): number => {
  if (!trade.exitPrice) return 0;
  
  const pnl = trade.direction === 'Long'
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
  
  const averageWin = wins.length > 0
    ? wins.reduce((sum, t) => sum + calculatePnL(t), 0) / wins.length
    : 0;
  
  const averageLoss = losses.length > 0
    ? Math.abs(losses.reduce((sum, t) => sum + calculatePnL(t), 0) / losses.length)
    : 0;
  
  return (winRate * averageWin) - ((1 - winRate) * averageLoss);
};
