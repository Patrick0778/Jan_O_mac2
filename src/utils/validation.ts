import * as yup from 'yup';

export const tradeValidationSchema = yup.object().shape({
  symbol: yup
    .string()
    .required('Symbol is required')
    .min(1, 'Symbol must be at least 1 character')
    .max(10, 'Symbol must be at most 10 characters'),
  entryPrice: yup
    .number()
    .required('Entry price is required')
    .positive('Entry price must be positive'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .positive('Quantity must be positive'),
  commission: yup
    .number()
    .min(0, 'Commission cannot be negative')
    .default(0),
  exitPrice: yup
    .number()
    .positive('Exit price must be positive')
    .optional(),
  stopLoss: yup
    .number()
    .positive('Stop loss must be positive')
    .optional(),
  takeProfit: yup
    .number()
    .positive('Take profit must be positive')
    .optional(),
});

export const strategyValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Strategy name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  description: yup
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  rules: yup
    .string()
    .max(1000, 'Rules must be at most 1000 characters')
    .optional(),
});
