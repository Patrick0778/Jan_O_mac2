# Local-Only Trading Journal - Architecture & Usage Guide

## Overview

This trading journal application has been designed as a **completely local-only** solution. All user data (profile information, trade records) is stored exclusively on your device with no network synchronization, cloud storage, or external API calls.

## Design Philosophy

### Privacy First
- **No data leaves your device**: All information stays on your phone/tablet
- **No cloud dependencies**: Works completely offline
- **User-controlled backups**: You decide when and how to export your data
- **No tracking or analytics**: Your trading activity is private

### Manual Entry
- All trades must be entered manually by you
- No automatic import from exchanges or brokers
- No real-time price fetching
- This gives you full control and awareness of your trading activity

## Architecture

### Data Storage

#### Local Storage Layer (`src/services/localStorage.ts`)
Uses `@react-native-async-storage/async-storage` for persistent local storage:

**Storage Keys:**
- `@trading_journal_profile` - User profile data
- `@trading_journal_trades` - All trade records

**Data Types:**
```typescript
Profile {
  id: string (UUID)
  name: string
  email?: string
  notes?: string
  createdAt: ISO date string
  updatedAt: ISO date string
}

Trade {
  id: string (UUID)
  symbol: string (e.g., "AAPL", "EURUSD")
  type: 'buy' | 'sell' | 'other'
  quantity: number
  price: number
  fees?: number
  notes?: string
  date: ISO date string
  createdAt: ISO date string
}
```

**Note**: Profile and Trade types intentionally **exclude** region, country, and tax-related fields. Tax calculations must be performed externally.

### Key Components

#### 1. Profile Management (`src/screens/ProfileScreen.tsx`)
- Create and edit your trader profile
- Minimal fields: name, email (optional), notes
- Data saved locally only
- No authentication or cloud sync

#### 2. Manual Trade Entry (`src/screens/TradeEntryScreen.tsx`)
- Form-based trade entry
- Required fields: symbol, type, quantity, price
- Optional fields: fees, notes
- Validation ensures data quality
- Each trade gets a unique UUID and timestamp

#### 3. Tax Notice (`src/components/TaxRegionRemovedNotice.tsx`)
- Informs users that tax calculations are not included
- Recommends external tax software or professional advisors
- Can be displayed in settings or export screens

#### 4. PDF Export (`src/utils/localPdfExport.ts`)
- Generates performance reports as PDF files
- Uses `react-native-html-to-pdf` (local-only, no network)
- Creates HTML report with trade summary and history
- Returns local file path for sharing via native share sheet

## Backup & Export Strategy

### Why Manual Backups?
Without cloud sync, YOU are responsible for backing up your data. This gives you complete control over your sensitive financial information.

### Export Options

#### 1. PDF Reports
```typescript
import {generatePerformancePdf, generateAndSharePdf} from './src/utils/localPdfExport';

// Generate PDF and get file path
const filePath = await generatePerformancePdf();

// Or generate and share immediately
await generateAndSharePdf();
```

**Best Practice**: Generate monthly PDF reports and save them to cloud storage of your choice (Dropbox, Google Drive, iCloud, etc.)

#### 2. JSON Data Export
```typescript
import {exportTradesJson, loadProfile} from './src/services/localStorage';

// Export all trades as JSON
const tradesJson = await exportTradesJson();

// Export profile
const profile = await loadProfile();
const profileJson = JSON.stringify(profile);
```

**Best Practice**: Periodically export JSON data and store it securely. This allows you to:
- Restore data if device is lost/damaged
- Import into spreadsheets for advanced analysis
- Use with external tax software

### Recommended Backup Schedule
- **Weekly**: Quick PDF export to cloud storage
- **Monthly**: Full JSON export of all data
- **Before major events**: Device upgrade, OS update, app update

### How to Backup

1. **Generate Export**: Use in-app export features
2. **Share**: Use native share sheet to send to:
   - Email (to yourself)
   - Cloud storage apps (Dropbox, Google Drive, OneDrive)
   - Note-taking apps (Evernote, OneNote)
   - Files app (iOS) or local storage (Android)

## Installation & Setup

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Native Modules Setup

The following native modules require platform-specific setup:

#### iOS Setup
```bash
cd ios
pod install
cd ..
```

#### Android Setup
Most modules auto-link for React Native 0.60+. If issues occur:
```bash
npx react-native link @react-native-async-storage/async-storage
npx react-native link react-native-html-to-pdf
npx react-native link react-native-share
```

### Required Dependencies

- `@react-native-async-storage/async-storage` - Local persistent storage
- `react-native-html-to-pdf` - Local PDF generation
- `react-native-share` - Native sharing functionality
- `uuid` - Unique ID generation

## Developer Notes

### Extending Features

When adding new features:

1. **Keep it local**: No network calls allowed
2. **Use localStorage service**: All data operations through `src/services/localStorage.ts`
3. **Add to backup**: Ensure new data types can be exported
4. **Document**: Update this README with new features
5. **Test offline**: All features must work without network

### Data Migration

If you need to change data structures:

1. Load existing data using current structure
2. Transform to new structure
3. Save with new structure
4. Keep version field to handle future migrations

Example:
```typescript
const STORAGE_VERSION = 2;

const migrateData = async () => {
  const version = await AsyncStorage.getItem('@storage_version');
  if (version !== STORAGE_VERSION.toString()) {
    // Perform migration
    await AsyncStorage.setItem('@storage_version', STORAGE_VERSION.toString());
  }
};
```

### Encrypted Storage (Optional Enhancement)

For extra security, consider using `react-native-encrypted-storage` instead of AsyncStorage:

```bash
npm install react-native-encrypted-storage
```

Update `src/services/localStorage.ts` to use EncryptedStorage instead of AsyncStorage (API is similar).

**Note**: Still local-only, just adds hardware-backed encryption.

## Tax Calculations

**Important**: This app does NOT include tax calculation features.

### Why?
- Tax rules vary by country, state, and individual situation
- Professional tax software is more reliable and legally sound
- Reduces liability and complexity
- Keeps app focused on trade journaling

### Recommended Approach
1. Export your trade data (JSON or PDF)
2. Use professional tax software:
   - TurboTax
   - TaxAct
   - H&R Block
   - Professional tax advisor
3. Import/manually enter trades into tax software
4. Let the tax software handle country-specific tax rules

## Troubleshooting

### Data Not Persisting
- Check AsyncStorage permissions (should be automatic)
- Verify no errors in console logs
- Try clearing and re-entering data

### PDF Generation Fails
- Ensure `react-native-html-to-pdf` is properly linked
- Check file system permissions
- Verify directory exists (defaults to Documents)

### App Crashes on Startup
- Run `cd ios && pod install` (iOS)
- Clear build cache: `npx react-native start --reset-cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Security Considerations

### Data at Rest
- AsyncStorage is unencrypted by default
- Consider `react-native-encrypted-storage` for sensitive data
- Device lock screen provides first line of defense

### Backup Security
- JSON exports contain plain text sensitive data
- Encrypt backups before uploading to cloud
- Use secure cloud storage with strong passwords/2FA

### Device Loss
- No remote wipe capability (no cloud connection)
- Ensure device has lock screen enabled
- Regular backups mean you can restore data on new device

## Future Enhancements (Local-Only)

Potential features that maintain local-only architecture:

1. **Charts & Analytics**: Victory Native for local visualization
2. **Strategy Tracking**: Tag trades with strategies, analyze locally
3. **Goal Setting**: Set targets, track progress locally
4. **Calendar View**: Visual daily P&L display
5. **Image Attachments**: Store trade screenshots locally
6. **Encrypted Storage**: Hardware-backed encryption
7. **Biometric Lock**: App-level authentication
8. **Import from CSV**: Manual bulk import
9. **Advanced Filtering**: Local search and filter

## Support

For issues or questions:
- Check TypeScript errors: `npx tsc --noEmit`
- Review console logs for runtime errors
- Verify native dependencies are linked
- Test on physical device (some features may not work in simulator)

---

**Remember**: You own your data. Back it up regularly. Keep it secure. Never trust the cloud with sensitive financial data unless YOU choose to do so.
