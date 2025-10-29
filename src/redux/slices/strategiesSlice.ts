import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Strategy} from '../../models/Strategy';

interface StrategiesState {
  items: Strategy[];
  loading: boolean;
  error: string | null;
}

const initialState: StrategiesState = {
  items: [],
  loading: false,
  error: null,
};

const strategiesSlice = createSlice({
  name: 'strategies',
  initialState,
  reducers: {
    addStrategy: (state, action: PayloadAction<Strategy>) => {
      state.items.push(action.payload);
    },
    updateStrategy: (state, action: PayloadAction<Strategy>) => {
      const index = state.items.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteStrategy: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(s => s.id !== action.payload);
    },
    setStrategies: (state, action: PayloadAction<Strategy[]>) => {
      state.items = action.payload;
    },
  },
});

export const {addStrategy, updateStrategy, deleteStrategy, setStrategies} = strategiesSlice.actions;
export default strategiesSlice.reducer;
