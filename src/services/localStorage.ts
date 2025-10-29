import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';

// Local storage keys
const KEYS = {
  PROFILE: '@trading_journal_profile',
  TRADES: '@trading_journal_trades',
};

// Type definitions for local-only data (no region/tax fields)
export interface Profile {
  id: string;
  name: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'other';
  quantity: number;
  price: number;
  fees?: number;
  notes?: string;
  date: string;
  createdAt: string;
}

// Profile operations
export const saveProfile = async (profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> => {
  try {
    const existingProfileStr = await AsyncStorage.getItem(KEYS.PROFILE);
    let savedProfile: Profile;

    if (existingProfileStr) {
      const existingProfile = JSON.parse(existingProfileStr) as Profile;
      savedProfile = {
        ...existingProfile,
        ...profile,
        updatedAt: new Date().toISOString(),
      };
    } else {
      savedProfile = {
        id: uuidv4(),
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(savedProfile));
    return savedProfile;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw new Error('Failed to save profile');
  }
};

export const loadProfile = async (): Promise<Profile | null> => {
  try {
    const profileStr = await AsyncStorage.getItem(KEYS.PROFILE);
    if (!profileStr) {
      return null;
    }
    return JSON.parse(profileStr) as Profile;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
};

// Trade operations
export const addTrade = async (tradeData: Omit<Trade, 'id' | 'createdAt'>): Promise<Trade> => {
  try {
    const newTrade: Trade = {
      id: uuidv4(),
      ...tradeData,
      createdAt: new Date().toISOString(),
    };

    const trades = await loadTrades();
    trades.push(newTrade);
    await saveTrades(trades);

    return newTrade;
  } catch (error) {
    console.error('Error adding trade:', error);
    throw new Error('Failed to add trade');
  }
};

export const loadTrades = async (): Promise<Trade[]> => {
  try {
    const tradesStr = await AsyncStorage.getItem(KEYS.TRADES);
    if (!tradesStr) {
      return [];
    }
    const trades = JSON.parse(tradesStr);
    // Validate it's an array
    if (!Array.isArray(trades)) {
      console.warn('Invalid trades data, returning empty array');
      return [];
    }
    return trades as Trade[];
  } catch (error) {
    console.error('Error loading trades:', error);
    return [];
  }
};

export const saveTrades = async (trades: Trade[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.TRADES, JSON.stringify(trades));
  } catch (error) {
    console.error('Error saving trades:', error);
    throw new Error('Failed to save trades');
  }
};

export const exportTradesJson = async (): Promise<string> => {
  try {
    const trades = await loadTrades();
    return JSON.stringify(trades, null, 2);
  } catch (error) {
    console.error('Error exporting trades:', error);
    throw new Error('Failed to export trades');
  }
};

export const clearAllLocalData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([KEYS.PROFILE, KEYS.TRADES]);
  } catch (error) {
    console.error('Error clearing local data:', error);
    throw new Error('Failed to clear local data');
  }
};
