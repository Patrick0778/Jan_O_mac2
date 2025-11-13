# Migration Guide: Cloud-Synced to Local-Only

This guide helps existing users migrate from the previous cloud-synced version to the new local-only architecture.

## Overview of Changes

The app has been converted to a **fully local-only architecture**:

### ✅ What's New

- All data stored locally using AsyncStorage
- Manual trade entry (no automatic price fetching)
- Local PDF report generation
- JSON backup/restore functionality
- Complete privacy - no cloud sync

### ❌ What's Been Removed

- Cloud synchronization
- Tax calculation features
- Region selection
- Automatic price fetching
- Multi-device sync
- Server-side storage

## Before You Migrate

### Backup Your Current Data

If you're using the cloud-synced version:

1. **Export your trades** to CSV/JSON before upgrading
2. **Save the export file** to a secure location
3. **Document your settings** (starting capital, currency, etc.)

**Important**: Once you upgrade, you cannot revert to the cloud-synced version without losing local-only data.

## Migration Process

### Step 1: Export Existing Data (If Available)

If the previous version had an export feature:

```
1. Open Settings
2. Find "Export Data" or "Backup"
3. Export to JSON format
4. Save file to a secure location (cloud storage, email to yourself, etc.)
```

### Step 2: Update the App

```bash
# Pull latest changes
git pull origin copilot/convert-to-local-only-app

# Install new dependencies
npm install

# For iOS
cd ios && pod install && cd ..
```

### Step 3: Clear Previous Data (Optional)

If you want a fresh start:

```
1. Uninstall the old app version
2. Reinstall the new version
```

Or programmatically:

```typescript
import {clearAllLocalData} from './src/services/localStorage';
await clearAllLocalData();
```

### Step 4: Create Your Profile

First time opening the new version:

```
1. Open the app
2. Go to Settings → Manage Profile
3. Fill in your details:
   - Name
   - Email (optional)
   - Starting Capital
   - Currency
4. Save Profile
```

### Step 5: Import Your Trades (If Available)

If you exported trades from the previous version:

```
1. Go to Settings
2. Select "Import Data (JSON)"
3. Choose your backup file
4. Verify trades imported correctly
```

**Note**: The import feature expects JSON in this format:

```json
{
  "exportDate": "2025-10-29T12:00:00.000Z",
  "appVersion": "1.0.0",
  "profile": {
    "id": "...",
    "name": "Your Name",
    "startingCapital": 10000,
    "currency": "USD"
  },
  "trades": [
    {
      "id": "...",
      "symbol": "AAPL",
      "type": "Long",
      "quantity": 100,
      "entryPrice": 150.0,
      "fees": 5.0,
      "entryDate": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

### Step 6: Manual Trade Re-entry (If No Export)

If you don't have an export file, you'll need to manually re-enter your trades:

```
1. Go to Trades tab
2. Tap + button
3. Select "Local Storage"
4. Enter trade details manually
5. Repeat for each trade
```

## Data Mapping

### Profile Fields

| Old Field       | New Field       | Notes          |
| --------------- | --------------- | -------------- |
| name            | name            | Same           |
| email           | email           | Optional       |
| startingCapital | startingCapital | Same           |
| currency        | currency        | Same           |
| region          | ❌ Removed      | No longer used |
| taxStatus       | ❌ Removed      | No longer used |

### Trade Fields

| Old Field       | New Field  | Notes                      |
| --------------- | ---------- | -------------------------- |
| id              | id         | Auto-generated             |
| symbol          | symbol     | Same                       |
| direction/type  | type       | Now "Long" or "Short"      |
| entryPrice      | entryPrice | Manually entered           |
| exitPrice       | exitPrice  | Optional, manually entered |
| quantity        | quantity   | Same                       |
| commission/fees | fees       | Same                       |
| notes           | notes      | Optional                   |
| entryDate       | entryDate  | ISO string                 |
| exitDate        | exitDate   | Optional, ISO string       |

## Post-Migration Checklist

After migration, verify:

- [ ] Profile is created and displays correctly
- [ ] All trades are present (or re-entered)
- [ ] Dashboard shows correct statistics
- [ ] Settings are configured properly
- [ ] Can add new trades via "Local Storage" option
- [ ] Can export data to JSON
- [ ] Data persists after closing and reopening app

## Differences to Note

### Trade Entry

- **Old**: Prices fetched automatically from APIs
- **New**: All prices manually entered by user

### Data Storage

- **Old**: Synced to cloud, available on all devices
- **New**: Stored locally, one device only

### Backups

- **Old**: Automatic cloud backups
- **New**: Manual JSON exports (user's responsibility)

### Tax Features

- **Old**: Tax calculations available
- **New**: No tax features (removed intentionally)

## Frequently Asked Questions

### Can I sync between devices?

No, the local-only version does not support multi-device sync. Each device stores its own data independently.

### How do I backup my data?

Export to JSON regularly from Settings → Export Data (JSON). Save the file to cloud storage (Google Drive, iCloud, etc.) or email it to yourself.

### Can I use both versions?

Not recommended. Choose either cloud-synced (old) or local-only (new). Running both may cause confusion about which data is current.

### What if I lose my device?

Without cloud sync, data is lost if the device is lost. **Regular JSON exports are critical** for backup purposes.

### Can I go back to the cloud version?

You can revert to an older git commit, but you'll lose any local-only data unless you export it first.

### Will tax features be added back?

No, tax features were intentionally removed as part of the local-only conversion. This simplifies the app and eliminates compliance concerns.

### How often should I export my data?

Recommended: **Weekly** or after significant trading activity. Store exports in multiple secure locations.

## Rollback Instructions

If you need to roll back to the cloud-synced version:

```bash
# Export your data first!
# Then rollback
git checkout <previous-commit-hash>
npm install
cd ios && pod install && cd ..
```

⚠️ **Warning**: You will lose all local-only data unless you export it first.

## Support

If you encounter issues during migration:

1. Check [docs/INSTALLATION.md](./INSTALLATION.md) for setup help
2. Review [docs/LOCAL_ONLY_README.md](./LOCAL_ONLY_README.md) for architecture details
3. Check console logs for error messages
4. Create an issue with details about your problem

## Summary

The local-only architecture provides:

- ✅ Complete data privacy
- ✅ No internet dependency
- ✅ Simple, focused feature set
- ❌ No automatic backups
- ❌ No multi-device sync
- ❌ No tax calculations

Make regular JSON exports and enjoy your private, local trading journal!
