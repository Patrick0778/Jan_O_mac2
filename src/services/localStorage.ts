/**
 * Local Storage Service
 *
 * This service manages all local data storage using React Native AsyncStorage.
 * All user data (profile, trades, settings) is stored locally on-device.
 *
 * Design Philosophy:
 * - No cloud sync or remote storage
 * - No network requests for data
 * - Complete user privacy and control
 * - Data persists across app restarts
 *
 * Storage Keys:
 * - 'user_profile': User profile data (name, starting capital, etc.)
 * - 'trades_data': Array of all trade records
 *
 * To change storage mechanism in the future:
 * - Replace AsyncStorage imports with new storage library
 * - Ensure all methods remain async
 * - Test data migration carefully
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys - centralized for easy maintenance
const STORAGE_KEYS = {
  PROFILE: 'user_profile',
  TRADES: 'trades_data',
};

/**
 * User Profile stored locally
 * No region or tax-related fields - these features have been removed
 */
export interface Profile {
  id: string;
  name: string;
  email?: string;
  startingCapital: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Trade record stored locally
 * All data is manually entered by user - no automatic price fetching
 */
export interface Trade {
  id: string;
  symbol: string;
  type: 'Long' | 'Short';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  fees: number;
  notes?: string;
  entryDate: string;
  exitDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Save user profile to local storage
 * Creates new profile or updates existing one
 */
export const saveProfile = async (profile: Profile): Promise<void> => {
  try {
    const profileData = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(
      STORAGE_KEYS.PROFILE,
      JSON.stringify(profileData),
    );
  } catch (error) {
    console.error('Error saving profile to local storage:', error);
    throw new Error('Failed to save profile locally');
  }
};

/**
 * Load user profile from local storage
 * Returns null if no profile exists (first-time user)
 */
export const loadProfile = async (): Promise<Profile | null> => {
  try {
    const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!profileJson) {
      return null;
    }
    return JSON.parse(profileJson) as Profile;
  } catch (error) {
    console.error('Error loading profile from local storage:', error);
    throw new Error('Failed to load profile');
  }
};

/**
 * Add a new trade to local storage
 * Trade data is manually entered - no network requests involved
 */
export const addTrade = async (trade: Trade): Promise<void> => {
  try {
    const trades = await loadTrades();
    const newTrade = {
      ...trade,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    trades.push(newTrade);
    await saveTrades(trades);
  } catch (error) {
    console.error('Error adding trade to local storage:', error);
    throw new Error('Failed to save trade locally');
  }
};

/**
 * Update an existing trade in local storage
 */
export const updateTrade = async (
  tradeId: string,
  updates: Partial<Trade>,
): Promise<void> => {
  try {
    const trades = await loadTrades();
    const index = trades.findIndex(t => t.id === tradeId);

    if (index === -1) {
      throw new Error('Trade not found');
    }

    trades[index] = {
      ...trades[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await saveTrades(trades);
  } catch (error) {
    console.error('Error updating trade in local storage:', error);
    throw new Error('Failed to update trade');
  }
};

/**
 * Delete a trade from local storage
 */
export const deleteTrade = async (tradeId: string): Promise<void> => {
  try {
    const trades = await loadTrades();
    const filteredTrades = trades.filter(t => t.id !== tradeId);
    await saveTrades(filteredTrades);
  } catch (error) {
    console.error('Error deleting trade from local storage:', error);
    throw new Error('Failed to delete trade');
  }
};

/**
 * Load all trades from local storage
 * Returns empty array if no trades exist
 */
export const loadTrades = async (): Promise<Trade[]> => {
  try {
    const tradesJson = await AsyncStorage.getItem(STORAGE_KEYS.TRADES);
    if (!tradesJson) {
      return [];
    }
    return JSON.parse(tradesJson) as Trade[];
  } catch (error) {
    console.error('Error loading trades from local storage:', error);
    throw new Error('Failed to load trades');
  }
};

/**
 * Save trades array to local storage
 * Internal method - use addTrade/updateTrade/deleteTrade for modifications
 */
export const saveTrades = async (trades: Trade[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
  } catch (error) {
    console.error('Error saving trades to local storage:', error);
    throw new Error('Failed to save trades');
  }
};

/**
 * Export trades to JSON string for backup
 * File is created locally - no automatic cloud upload
 * User can share via native share dialog if desired
 */
export const exportTradesJson = async (): Promise<string> => {
  try {
    const profile = await loadProfile();
    const trades = await loadTrades();

    const exportData = {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
      profile,
      trades,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting trades to JSON:', error);
    throw new Error('Failed to export trades');
  }
};

/**
 * Import trades from JSON string
 * Validates data before importing
 * Merges with existing trades (no duplicates)
 */
export const importTradesJson = async (jsonString: string): Promise<void> => {
  try {
    const importData = JSON.parse(jsonString);

    // Validate import data structure
    if (!importData.trades || !Array.isArray(importData.trades)) {
      throw new Error('Invalid import data format');
    }

    const existingTrades = await loadTrades();
    const existingIds = new Set(existingTrades.map(t => t.id));

    // Only import trades that don't already exist (avoid duplicates)
    const newTrades = importData.trades.filter(
      (trade: Trade) => !existingIds.has(trade.id),
    );

    const mergedTrades = [...existingTrades, ...newTrades];
    await saveTrades(mergedTrades);

    // Import profile if not exists
    if (importData.profile) {
      const existingProfile = await loadProfile();
      if (!existingProfile) {
        await saveProfile(importData.profile);
      }
    }
  } catch (error) {
    console.error('Error importing trades from JSON:', error);
    throw new Error('Failed to import trades');
  }
};

/**
 * Clear all local data
 * Use with caution - this deletes everything!
 * Useful for testing or reset functionality
 */
export const clearAllLocalData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
    await AsyncStorage.removeItem(STORAGE_KEYS.TRADES);
  } catch (error) {
    console.error('Error clearing local data:', error);
    throw new Error('Failed to clear local data');
  }
};

/**
 * Get storage usage statistics (for debugging/info display)
 */
export const getStorageStats = async (): Promise<{
  profileExists: boolean;
  tradeCount: number;
}> => {
  try {
    const profile = await loadProfile();
    const trades = await loadTrades();

    return {
      profileExists: profile !== null,
      tradeCount: trades.length,
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      profileExists: false,
      tradeCount: 0,
    };
  }
};
