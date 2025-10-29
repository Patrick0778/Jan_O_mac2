# Copilot Development Constraints for Jan_O_mac2 Trading Journal

## Local-Only Architecture

This application is designed to be **completely local-only**. All user data must remain on the device with NO network or cloud synchronization.

## Core Constraints

### 1. Data Storage
- **ALWAYS** use `@react-native-async-storage/async-storage` for data persistence
- **NEVER** add network calls, API endpoints, or cloud services
- All data (profile, trades) must be stored locally using the `src/services/localStorage.ts` module
- Consider encrypted storage options for sensitive data, but keep it local

### 2. Trade Management
- Trades are entered **manually only** by the user
- **DO NOT** add features that fetch trade data from exchanges or brokers
- **DO NOT** add features that fetch real-time or historical prices from APIs
- Users manually enter: symbol, type (buy/sell/other), quantity, price, fees, notes

### 3. Tax & Region Features
- **REMOVED**: All tax calculation features
- **REMOVED**: All region/country selection features  
- Tax calculations must be done externally by the user
- If asked to add tax features, politely decline and reference the TaxRegionRemovedNotice component

### 4. PDF Export
- PDF generation must be **local only** using `react-native-html-to-pdf`
- Build HTML reports from local data only
- **NO** external resources, images, or API calls in PDFs
- Use `src/utils/localPdfExport.ts` for all PDF functionality
- PDFs can be shared via `react-native-share` but remain local files

### 5. Profile Management
- Use `src/screens/ProfileScreen.tsx` for profile CRUD
- Profile fields: name, email (optional), notes
- **NO** region, country, or tax-related fields

### 6. Code Changes
- Keep changes minimal and surgical
- Maintain TypeScript type safety
- Add defensive coding (try/catch, JSON parse guards)
- Document any native module dependencies clearly

### 7. Native Dependencies
When adding features that require native modules:
- Clearly document iOS setup: `cd ios && pod install`
- Note Android auto-linking behavior
- Add comments about platform-specific linking requirements

## Current Architecture

### Key Files
- `src/services/localStorage.ts` - All local storage operations
- `src/screens/ProfileScreen.tsx` - Local profile management
- `src/screens/TradeEntryScreen.tsx` - Manual trade entry
- `src/utils/localPdfExport.ts` - Local PDF generation
- `src/components/TaxRegionRemovedNotice.tsx` - Tax removal notice

### Dependencies
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-html-to-pdf` - PDF generation
- `react-native-share` - Native sharing
- `uuid` - Unique ID generation

## What to Avoid

❌ **DO NOT** add:
- Network requests (fetch, axios, etc.)
- Cloud storage or sync (Firebase, AWS, etc.)
- API integrations (exchanges, market data, etc.)
- Tax calculation logic
- Region/country selection
- Authentication with external services
- Analytics or tracking services

✅ **DO** maintain:
- Local-only data storage
- Manual data entry
- On-device PDF generation
- Clear documentation
- Type safety
- Defensive error handling

## Future Development

When extending features:
1. Check if it requires network → If yes, decline or make it local-only
2. Document native dependencies clearly
3. Update docs/LOCAL_ONLY_README.md with new features
4. Keep backups/exports in user's control (no auto-sync)
5. Consider encrypted storage for sensitive data (still local)

## Testing

- Test without network connectivity
- Verify data persistence across app restarts
- Ensure PDFs generate without network
- Test on both iOS and Android platforms

---

**Remember**: This app is a privacy-focused, local-only trading journal. All features must work completely offline.
