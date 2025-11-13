# Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- React Native development environment:
  - For iOS: Xcode (Mac only)
  - For Android: Android Studio and Android SDK
- Git

## Project Initialization

### Step 1: Create React Native Project

```bash
# Using React Native CLI with TypeScript template
npx react-native init TradingJournal --template react-native-template-typescript

# Navigate to project directory
cd TradingJournal
```

### Step 2: Install Core Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

# State Management
npm install @reduxjs/toolkit react-redux

# Database
npm install react-native-sqlite-storage

# Charts
npm install victory-native react-native-svg

# Forms
npm install react-hook-form yup @hookform/resolvers

# UI Components
npm install react-native-paper react-native-vector-icons

# Utilities
npm install date-fns
npm install styled-components
npm install @types/styled-components @types/styled-components-react-native --save-dev

# Camera and Files
npm install react-native-image-picker
npm install react-native-fs

# Security
npm install react-native-keychain
npm install react-native-biometrics
```

### Step 3: iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
```

### Step 4: Configure Dependencies

#### React Native Reanimated

Add to `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

#### Vector Icons

Link the fonts in `android/app/build.gradle`:

```gradle
project.ext.vectoricons = [
    iconFontNames: ['MaterialIcons.ttf', 'MaterialCommunityIcons.ttf']
]
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### Step 5: Project Structure Setup

Create the following folder structure:

```bash
mkdir -p src/{components,screens,navigation,redux,services,models,utils,hooks,theme}
mkdir -p src/components/{common,trades,analytics,forms}
mkdir -p src/redux/slices
mkdir -p assets/{images,icons,fonts}
```

### Step 6: Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2017"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@screens/*": ["screens/*"],
      "@navigation/*": ["navigation/*"],
      "@redux/*": ["redux/*"],
      "@services/*": ["services/*"],
      "@models/*": ["models/*"],
      "@utils/*": ["utils/*"],
      "@hooks/*": ["hooks/*"],
      "@theme/*": ["theme/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

### Step 7: Run the App

```bash
# For iOS
npm run ios
# or
npx react-native run-ios

# For Android
npm run android
# or
npx react-native run-android
```

## Development Workflow

### 1. Start Metro Bundler

```bash
npm start
```

### 2. Run on Device/Emulator

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Physical iOS device
npm run ios -- --device "Device Name"

# Physical Android device (via USB debugging)
npm run android
```

### 3. Debug

- Press `Cmd + D` (iOS) or `Cmd + M` (Android) to open developer menu
- Enable Hot Reloading for faster development
- Use React Native Debugger or Flipper for advanced debugging

## Next Steps

1. **Create Theme System**: Set up colors, typography, and spacing constants
2. **Setup Navigation**: Implement tab and stack navigators
3. **Configure Redux Store**: Set up slices for trades, strategies, and settings
4. **Database Setup**: Initialize SQLite with schema
5. **Build Core Components**: Create reusable UI components
6. **Implement Screens**: Start with TradeListScreen and AddTradeScreen

## Useful Commands

```bash
# Clear cache
npm start -- --reset-cache

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format

# Build for production (iOS)
cd ios && xcodebuild -workspace TradingJournal.xcworkspace -scheme TradingJournal -configuration Release

# Build for production (Android)
cd android && ./gradlew assembleRelease
```

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Victory Native Charts](https://formidable.com/open-source/victory/docs/native)

## Troubleshooting

### Common Issues

1. **Metro Bundler Issues**: Clear cache with `npm start -- --reset-cache`
2. **iOS Build Fails**: Clean build folder: `cd ios && xcodebuild clean`
3. **Android Build Fails**: Clean Gradle: `cd android && ./gradlew clean`
4. **Dependencies Not Found**: Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Getting Help

- Check [COPILOT_PROMPT.md](./COPILOT_PROMPT.md) for detailed specifications
- Review [FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md) for feature overview
- Consult React Native documentation
- Search Stack Overflow for specific errors

---

Happy Coding! 🚀
