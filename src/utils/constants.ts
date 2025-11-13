export const ASSET_CLASSES = [
  'Stocks',
  'Forex',
  'Crypto',
  'Options',
  'Futures',
] as const;
export const TRADE_DIRECTIONS = ['Long', 'Short'] as const;

export const COMMISSION_PRESETS = {
  FREE: 0,
  LOW: 0.99,
  STANDARD: 4.99,
  HIGH: 9.99,
};

export const CURRENCY_OPTIONS = [
  {label: 'USD', value: 'USD'},
  {label: 'EUR', value: 'EUR'},
  {label: 'GBP', value: 'GBP'},
  {label: 'JPY', value: 'JPY'},
];

export const TIMEZONE_OPTIONS = [
  {label: 'UTC', value: 'UTC'},
  {label: 'EST', value: 'America/New_York'},
  {label: 'PST', value: 'America/Los_Angeles'},
  {label: 'GMT', value: 'Europe/London'},
];

export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
