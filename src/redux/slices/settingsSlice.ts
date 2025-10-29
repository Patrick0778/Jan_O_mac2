import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Settings} from '../../models/Settings';

const initialState: Settings = {
  startingCapital: 10000,
  currency: 'USD',
  defaultCommission: 0,
  timezone: 'UTC',
  theme: 'light',
  notificationsEnabled: true,
  biometricEnabled: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      return {...state, ...action.payload};
    },
    resetSettings: () => initialState,
  },
});

export const {updateSettings, resetSettings} = settingsSlice.actions;
export default settingsSlice.reducer;
