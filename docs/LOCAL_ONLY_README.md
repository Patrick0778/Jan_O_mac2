# Local-Only Architecture Documentation

## Overview

Jan_O_mac2 is a **fully local-only** React Native trading journal application. All user data is stored locally on the device using AsyncStorage, with no cloud synchronization, network requests for trade data, or external dependencies for core functionality.

## Design Philosophy

### Core Principles

1. **Complete Privacy**: All user data remains on the device. No telemetry, analytics, or data transmission to external servers.

2. **Manual Entry**: Users manually enter all trade information. No automatic price fetching, broker API integration, or market data feeds.

3. **No Tax Features**: Tax calculation and region selection features have been intentionally removed. This simplifies the app and eliminates compliance concerns.

4. **Local Export Only**: PDF and JSON exports are generated locally and stored on device. Users control when and how to share their data.

5. **Offline-First**: The app works completely offline. No internet connection required for any core functionality.

## Architecture

### Data Storage Layer

**Technology**: React Native AsyncStorage

**Storage Keys**:
- `user_profile` - User profile data (name, starting capital, currency)
- `trades_data` - Array of all trade records

**Service**: `src/services/localStorage.ts`

This service provides all CRUD operations for profile and trade data:
- `saveProfile(profile)` - Save/update user profile
- `loadProfile()` - Load user profile
- `addTrade(trade)` - Add new trade
- `updateTrade(id, updates)` - Update existing trade
- `deleteTrade(id)` - Delete a trade
- `loadTrades()` - Load all trades
- `exportTradesJson()` - Export data as JSON
- `importTradesJson(json)` - Import data from JSON
- `clearAllLocalData()` - Clear all stored data

### Data Models

#### Profile
```typescript
interface Profile {
  id: string;
  name: string;
  email?: string;
  startingCapital: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
```

**Note**: No `region` or `taxStatus` fields - these have been removed.

#### Trade
```typescript
interface Trade {
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
```

**Note**: All prices are manually entered by the user. No automatic price updates.

## User Interface

### New Screens

1. **ProfileScreen** (`src/screens/ProfileScreen.tsx`)
   - Create/edit user profile
   - Stored locally only
   - No region or tax fields

2. **TradeEntryScreen** (`src/screens/TradeEntryScreen.tsx`)
   - Manual trade entry
   - Long/Short position support
   - Open/Closed trade status
   - P&L calculator (for closed trades)
   - No price fetching APIs

### Components

**TaxRegionRemovedNotice** (`src/components/TaxRegionRemovedNotice.tsx`)
- Displays information about removed features
- Two variants: `default` and `compact`
- Use in settings or help screens

## Export & Backup

### PDF Export

**Location**: `src/utils/localPdfExport.ts`

**Function**: `generateTradePdf(profile, trades)`

Generates a professional PDF report with:
- Summary statistics (total P&L, win rate, etc.)
- Trade history table
- All generated locally using `react-native-html-to-pdf`

**Sharing**: Use `react-native-share` to open native share dialog

```typescript
import { generateTradePdf } from '../utils/localPdfExport';
import Share from 'react-native-share';

// Generate PDF
const filePath = await generateTradePdf(profile, trades);

// Share via native dialog
await Share.open({
  url: `file://${filePath}`,
  type: 'application/pdf',
});
```

### JSON Backup

**Export**: `exportTradesJson()` from localStorage service

Creates JSON backup containing:
- User profile
- All trades
- Export metadata (date, app version)

**Import**: `importTradesJson(jsonString)`

Validates and imports data:
- Merges with existing trades (no duplicates)
- Preserves existing profile if present
- Validates data structure

**Storage**: File system access via `react-native-fs`

## Dependencies

### Required for Local-Only Features

```json
{
  "@react-native-async-storage/async-storage": "^1.19.0",
  "react-native-html-to-pdf": "^0.12.0",
  "react-native-share": "^10.0.0",
  "uuid": "^9.0.0"
}
```

### Installation

```bash
npm install @react-native-async-storage/async-storage
npm install react-native-html-to-pdf
npm install react-native-share
npm install uuid
```

For iOS (native modules):
```bash
cd ios && pod install && cd ..
```

## Testing

### Manual Testing Checklist

1. **Profile Persistence**
   - [ ] Create a profile
   - [ ] Close app completely
   - [ ] Reopen app
   - [ ] Verify profile data persists

2. **Trade Storage**
   - [ ] Add multiple trades
   - [ ] Close app
   - [ ] Reopen app
   - [ ] Verify all trades are loaded

3. **PDF Export**
   - [ ] Generate PDF report
   - [ ] Verify PDF is created locally
   - [ ] Verify file path is accessible
   - [ ] Open PDF to check content

4. **JSON Backup**
   - [ ] Export trades to JSON
   - [ ] Clear all data
   - [ ] Import from JSON
   - [ ] Verify data is restored

### Unit Test Coverage

Create tests for:
- `localStorage.ts` service methods
- P&L calculations in `localPdfExport.ts`
- JSON export/import validation
- Trade data validation

## Migration from Cloud Version

If migrating from a cloud-synced version:

1. **Export existing data** from cloud version
2. **Clear AsyncStorage** to remove cloud references
3. **Import data** using JSON import feature
4. **Verify** all trades and profile data

## Security Considerations

### Data Privacy
- All data stored in AsyncStorage (encrypted at OS level)
- No transmission of user data
- No third-party analytics or tracking

### Backup Responsibility
- Users responsible for their own backups
- Recommend periodic JSON exports
- Store backups securely (encrypted cloud storage, external drive)

### App Permissions
Required permissions:
- **Storage** (read/write for PDF/JSON export)
- **No network permissions** needed for core functionality

## Limitations

### By Design
1. No automatic price updates
2. No cloud backup/sync
3. No multi-device synchronization
4. No tax calculations
5. No broker API integration

### Technical
1. AsyncStorage limits (~6MB on Android, more on iOS)
2. Large trade histories may impact performance
3. No automatic data migration between devices

## Future Considerations

### Possible Enhancements (while maintaining local-only)
- Import trades from CSV files
- More detailed PDF reports with charts
- Data compression for large trade histories
- Local database (SQLite) for better performance
- Encrypted local backups

### Will NOT Be Added
- Cloud sync
- Network-based price fetching
- Tax calculation features
- Region-specific functionality
- User authentication/accounts
- Server-side features

## Troubleshooting

### Data Not Persisting
1. Check AsyncStorage permissions
2. Verify app isn't in "Private Mode" (iOS)
3. Check device storage space
4. Review console logs for errors

### PDF Generation Fails
1. Check storage permissions
2. Verify `react-native-html-to-pdf` is linked correctly
3. Check available disk space
4. Review error messages in logs

### Import Fails
1. Verify JSON file format is correct
2. Check file is accessible to app
3. Ensure JSON contains required fields
4. Review validation error messages

## Support & Contribution

This is a local-only app by design. Feature requests involving:
- Cloud sync
- Network requests
- Tax calculations
- Region-specific features

...will not be implemented as they violate the core design principles.

## Version History

### v1.0.0 - Local-Only Architecture
- Converted to fully local storage
- Removed tax and region features
- Added AsyncStorage-based data layer
- Added local PDF export
- Added JSON backup/restore
- No network dependencies

---

**Remember**: This app is designed for complete privacy and user control. All data stays on the device unless the user explicitly chooses to export and share it.
