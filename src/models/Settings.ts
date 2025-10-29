export type GoalType = 'profit' | 'winRate' | 'tradeLimit' | 'drawdown';
export type GoalPeriod = 'daily' | 'weekly' | 'monthly';

export interface Goal {
  id: string;
  type: GoalType;
  target: number;
  period: GoalPeriod;
  current: number;
  createdAt: Date;
}

export interface Settings {
  userId?: string;
  userName?: string;
  startingCapital: number;
  currency: string;
  defaultCommission: number;
  timezone: string;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
}
