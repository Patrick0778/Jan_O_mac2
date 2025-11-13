# Jan_O_mac2

Trading Journal App - A Professional Trading Journal Application

## ⚠️ Local-Only Architecture

**This app operates in a fully local-only mode:**

- ✅ All data stored locally on your device using AsyncStorage
- ✅ Complete privacy - no cloud sync or network requests for user data
- ✅ Manual trade entry only - no automatic price fetching
- ✅ Tax and region features have been removed
- ✅ PDF exports generated locally
- ✅ Works completely offline

See [docs/LOCAL_ONLY_README.md](./docs/LOCAL_ONLY_README.md) for complete documentation.

## Overview

A professional React Native trading journal application that helps traders track, analyze, and improve their trading performance across multiple asset classes including stocks, forex, crypto, options, and futures.

## 📖 Documentation

### Complete Specification

- **[prompt.md](./prompt.md)** - Complete consolidated prompt with all specifications, features, and setup instructions
- **[docs/LOCAL_ONLY_README.md](./docs/LOCAL_ONLY_README.md)** - ⭐ Local-only architecture documentation

### Additional Resources

- **[.github/COPILOT_PROMPT.md](./.github/COPILOT_PROMPT.md)** - Detailed development guidelines for local-only features
- **[COPILOT_PROMPT.md](./COPILOT_PROMPT.md)** - Detailed development specifications (legacy)
- **[FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md)** - Quick feature reference
- **[QUICK_START.md](./QUICK_START.md)** - Step-by-step setup guide

## ✨ Key Features

### Core Functionality

- **Trade Management** - Add, edit, and track trades with detailed information
- **Performance Analytics** - Real-time P&L, win rate, profit factor, and more
- **Journal Entries** - Document pre/post-trade analysis and emotional states
- **Strategy Tracking** - Create and compare trading strategies
- **Calendar View** - Visual overview of daily trading activity
- **Goal Setting** - Set and track trading goals
- **Reports & Export** - Generate reports and export data

### Current Implementation

✅ Project structure initialized  
✅ Redux store with trades, strategies, and settings  
✅ Basic navigation (Tab + Stack navigators)  
✅ Core screens (Dashboard, Trade List, Add Trade, Settings)  
✅ Theme system with light/dark mode support  
✅ Trade calculations and formatting utilities  
✅ TypeScript models and type safety

## 🛠 Technology Stack

- **Framework**: React Native 0.72
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation v6
- **UI Library**: React Native Paper
- **Forms**: React Hook Form + Yup validation
- **Charts**: Victory Native (ready to implement)
- **Icons**: React Native Vector Icons

## 📁 Project Structure

```
trading-journal/
├── src/
│   ├── models/          # TypeScript data models
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation configuration
│   ├── redux/           # Redux store and slices
│   ├── services/        # Business logic (calculations, etc.)
│   ├── theme/           # Colors, typography, spacing
│   ├── utils/           # Helper functions and constants
│   ├── components/      # Reusable UI components (ready for implementation)
│   └── hooks/           # Custom React hooks (ready for implementation)
├── assets/              # Images, icons, fonts
├── __tests__/           # Test files
├── App.tsx             # Root component
└── package.json        # Dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- React Native development environment
- Xcode (for iOS) or Android Studio (for Android)

### Installation

1. **Install dependencies**:

```bash
npm install
# or
yarn install
```

2. **Install iOS dependencies** (Mac only):

```bash
cd ios && pod install && cd ..
```

3. **New dependencies for local-only features**:

   - `@react-native-async-storage/async-storage` - Local data storage
   - `react-native-html-to-pdf` - PDF generation
   - `react-native-share` - Native share dialog
   - `uuid` - Unique ID generation

   These are already included in package.json and will be installed with `npm install`.

4. **Run the app**:

```bash
# iOS
npm run ios

# Android
npm run android
```

### Development Commands

```bash
npm start              # Start Metro bundler
npm run ios           # Run on iOS
npm run android       # Run on Android
npm test              # Run tests
npm run lint          # Run linter
npm run format        # Format code
```

## 📱 Current Features

### Dashboard

- Overview statistics (Total P&L, Win Rate, Total Trades)
- Quick access to recent trades
- Real-time performance metrics

### Trade Management

- Add new trades with symbol, price, quantity, direction
- Support for multiple asset classes
- Long/Short position tracking
- Commission tracking
- View all trades in a list
- Trade detail view (in progress)

### Settings

- Theme toggle (Light/Dark)
- Notification preferences
- Biometric authentication toggle
- Account settings (starting capital, currency, commission)

## 🔮 Next Steps

1. **Enhanced Trade Details** - Complete trade detail screen with full information
2. **Exit Trade** - Implement functionality to close open positions
3. **Journal Notes** - Add note-taking capability for trades ✅ (available in TradeEntryScreen)
4. **Charts & Analytics** - Implement Victory Native charts for visualization
5. **Calendar View** - Build interactive calendar with daily P&L
6. **Strategy Management** - Full CRUD for trading strategies
7. **Reports** - PDF/CSV export functionality ✅ (local PDF export implemented)
8. **Local Storage Integration** - ✅ Implemented with AsyncStorage
9. **~~Cloud Sync~~** - ❌ Removed (local-only by design)
10. **Testing** - Unit and integration tests

## 🧪 Testing

```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # With coverage
```

## 📝 Contributing

This is a personal trading journal project. Feel free to fork and customize for your own needs.

## 📄 License

This project is for personal/educational use.

## 🙏 Acknowledgments

Built with React Native, Redux Toolkit, React Navigation, and React Native Paper.

---

For complete feature specifications and implementation details, see [prompt.md](./prompt.md)
