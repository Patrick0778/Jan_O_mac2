# Local-Only Architecture - Installation Guide

This guide covers the installation and setup of the new local-only features for Jan_O_mac2.

## New Dependencies

The following dependencies have been added to support local-only architecture:

```json
{
  "@react-native-async-storage/async-storage": "^1.19.0",
  "react-native-html-to-pdf": "^0.12.0",
  "react-native-share": "^10.0.0",
  "uuid": "^9.0.0",
  "@types/uuid": "^9.0.0"
}
```

## Installation Steps

### 1. Install JavaScript Dependencies

```bash
npm install
# or
yarn install
```

This will install all dependencies including the new local-only packages.

### 2. iOS Setup (Mac only)

The new native modules require additional setup for iOS:

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

For Android, the dependencies should auto-link with React Native 0.60+. If you encounter issues:

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
```

### 4. Verify Installation

After installation, verify that the new dependencies are available:

```bash
npm list @react-native-async-storage/async-storage
npm list react-native-html-to-pdf
npm list react-native-share
npm list uuid
```

## Native Module Configuration

### AsyncStorage

AsyncStorage is used for local data persistence. No additional configuration required.

**Storage Location:**
- iOS: Documents directory
- Android: AsyncStorage database

### react-native-html-to-pdf

Used for generating PDF reports locally.

**Permissions Required:**
- iOS: No special permissions needed
- Android: WRITE_EXTERNAL_STORAGE (for saving PDFs)

Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### react-native-share

Enables native share dialog for exporting files.

**No additional configuration required** - uses native share APIs.

## Testing the Installation

### 1. Start the Metro Bundler

```bash
npm start
```

### 2. Run on iOS (Mac only)

```bash
npm run ios
```

### 3. Run on Android

```bash
npm run android
```

## Troubleshooting

### AsyncStorage Issues

If AsyncStorage isn't working:

1. Clear Metro cache:
```bash
npm start -- --reset-cache
```

2. Reinstall pods (iOS):
```bash
cd ios && pod install && cd ..
```

### PDF Generation Issues

If PDF generation fails:

1. Check storage permissions (Android)
2. Verify `react-native-html-to-pdf` is linked:
```bash
npm list react-native-html-to-pdf
```

3. On iOS, ensure pods are up to date:
```bash
cd ios && pod install && cd ..
```

### Build Errors

If you encounter build errors after installation:

1. Clean the build:
```bash
# iOS
cd ios && xcodebuild clean && cd ..

# Android
cd android && ./gradlew clean && cd ..
```

2. Reinstall dependencies:
```bash
rm -rf node_modules
npm install
cd ios && pod install && cd ..
```

## Verifying Local-Only Features

After installation, verify the features work:

1. **Profile Creation**: Navigate to Settings → Manage Profile
2. **Trade Entry**: Add a trade using the "Local Storage" option
3. **Data Persistence**: Close app completely, reopen, verify data persists
4. **Export**: Try exporting data to JSON from Settings

## Security Notes

- All data is stored locally using AsyncStorage
- AsyncStorage data is encrypted at the OS level
- No network permissions required for core functionality
- Users are responsible for their own backups

## Next Steps

After successful installation:

1. Read [docs/LOCAL_ONLY_README.md](./LOCAL_ONLY_README.md) for architecture details
2. Read [.github/COPILOT_PROMPT.md](./.github/COPILOT_PROMPT.md) for development guidelines
3. Create your profile via Settings → Manage Profile
4. Start adding trades using the local storage option

## Support

For issues related to:
- **AsyncStorage**: Check [official docs](https://react-native-async-storage.github.io/async-storage/)
- **PDF Generation**: Check [react-native-html-to-pdf docs](https://github.com/christopherdro/react-native-html-to-pdf)
- **Share Dialog**: Check [react-native-share docs](https://react-native-share.github.io/react-native-share/)

For app-specific issues, check the main README.md or create an issue.
