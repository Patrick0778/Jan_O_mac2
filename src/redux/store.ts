import {configureStore} from '@reduxjs/toolkit';
import tradesReducer from './slices/tradesSlice';
import strategiesReducer from './slices/strategiesSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    trades: tradesReducer,
    strategies: strategiesReducer,
    settings: settingsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['trades/addTrade', 'trades/updateTrade'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.entryDate', 'payload.exitDate', 'payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        ignoredPaths: ['trades.items'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
