import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Trade} from '../../models/Trade';

interface TradesState {
  items: Trade[];
  loading: boolean;
  error: string | null;
}

const initialState: TradesState = {
  items: [],
  loading: false,
  error: null,
};

const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    addTrade: (state, action: PayloadAction<Trade>) => {
      state.items.push(action.payload);
    },
    updateTrade: (state, action: PayloadAction<Trade>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTrade: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setTrades: (state, action: PayloadAction<Trade[]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {addTrade, updateTrade, deleteTrade, setTrades, setLoading, setError} = tradesSlice.actions;
export default tradesSlice.reducer;
