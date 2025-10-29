# GitHub Copilot Development Guidelines for Jan_O_mac2

## Project Philosophy: Local-Only Architecture

This trading journal app is **100% local-only**. All data must be stored on-device, and no network requests should be made for user data, trades, or prices.

## Core Principles

### 1. Local-Only Data Storage
- **ALL user data** (profile, trades, settings) must be stored locally using AsyncStorage
- **NO cloud sync** or remote database connections
- **NO network requests** for fetching trade data, market prices, or user profiles
- Data persistence must use React Native's AsyncStorage API only

### 2. Manual Trade Entry Only
- Users manually enter all trade information (symbol, price, quantity, fees)
- **NO automatic price fetching** from market APIs
- **NO integration** with broker APIs or external data sources
- All trade data is user-provided and stored locally

### 3. Tax and Region Features Removed
- **NO tax calculation features** - these have been intentionally removed
- **NO region/country selection** for tax purposes
- If you encounter references to tax or region features, replace them with the `TaxRegionRemovedNotice` component
- Do not add new tax or region-related functionality

### 4. Export and Sharing
- PDF export must be generated **locally** using react-native-html-to-pdf
- JSON backup files must be created and stored **locally**
- Use native share APIs (react-native-share) only when user explicitly requests sharing
- **NO automatic uploads** to cloud storage
- **NO telemetry** that transmits user data

## Technical Implementation Guidelines

### Data Layer
```typescript
// Use localStorage.ts service for all data operations
import { saveProfile, loadProfile, addTrade, loadTrades } from '../services/localStorage';

// DO NOT use fetch, axios, or any network libraries for user data
// DO NOT implement cloud sync features
```

### Profile Management
- Profile stored in AsyncStorage with key 'user_profile'
- Fields: name, email (optional), startingCapital, currency, createdAt
- **NO region or tax-related fields**

### Trade Management
- Trades stored in AsyncStorage with key 'trades_data'
- Each trade: id, symbol, type, quantity, entryPrice, exitPrice, fees, notes, date
- **NO automatic price updates** or live market data
- **NO cloud backup** of trades

### PDF Export
```typescript
// Use localPdfExport.ts helper
import { generateTradePdf } from '../utils/localPdfExport';

// Generates PDF locally, returns file path
// Use react-native-share to let user share the PDF
```

### Components to Use
- `TaxRegionRemovedNotice` - Display when tax/region features would have been shown
- Standard React Native components (no web-only dependencies)
- React Native Paper for UI components

## What NOT to Do

❌ Do not add network requests for trade data  
❌ Do not implement cloud storage or sync  
❌ Do not add tax calculation features  
❌ Do not add region/country selection  
❌ Do not use web-only APIs or libraries  
❌ Do not add analytics that transmit user data  
❌ Do not fetch live market prices  
❌ Do not integrate with broker APIs  

## What TO Do

✅ Use AsyncStorage for all data persistence  
✅ Provide manual entry forms for all trade data  
✅ Generate PDFs locally using react-native-html-to-pdf  
✅ Use native share dialog when user wants to share  
✅ Keep all user data on-device  
✅ Add clear comments explaining local-only behavior  
✅ Test data persistence across app restarts  
✅ Validate user input thoroughly  

## Dependencies Approved for Use

- `@react-native-async-storage/async-storage` - Local data storage
- `react-native-html-to-pdf` - Local PDF generation
- `react-native-share` - Native share dialog
- `uuid` - Generate unique IDs locally
- React Native core and existing UI libraries

## Code Review Checklist

Before committing code, verify:

1. [ ] No network requests for user data, trades, or prices
2. [ ] All data operations use localStorage.ts service
3. [ ] No references to cloud sync or remote storage
4. [ ] No tax or region features added
5. [ ] PDF generation is local-only
6. [ ] Comments explain local-only design decisions
7. [ ] Data persists correctly across app restarts

## Example: Adding a New Feature

**Good Example - Local Trade Entry:**
```typescript
// TradeEntryScreen.tsx
const handleSaveTrade = async () => {
  const trade = {
    id: uuid.v4(),
    symbol: symbol.toUpperCase(),
    quantity: parseFloat(quantity),
    price: parseFloat(price), // User manually enters price
    date: new Date().toISOString(),
  };
  
  await addTrade(trade); // Saves to AsyncStorage
  navigation.goBack();
};
```

**Bad Example - Fetching Price Data:**
```typescript
// ❌ DO NOT DO THIS
const fetchLivePrice = async (symbol: string) => {
  const response = await fetch(`https://api.example.com/price/${symbol}`);
  return response.json();
};
```

## Questions?

If you're unsure whether a feature fits the local-only architecture, ask yourself:
- Does this require network access? ❌ Don't implement it
- Does this store data remotely? ❌ Don't implement it  
- Does this involve tax calculations? ❌ Don't implement it
- Can this be done entirely on-device? ✅ Proceed with implementation

---

**Remember:** This app is designed to be completely private and local. Users have full control of their data, and nothing leaves their device unless they explicitly choose to export/share it.
