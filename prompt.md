# Trading Journal App Development Prompt

## Project Overview
Create a professional trading journal application in React Native that helps traders track, analyze, and improve their trading performance. The app should be cross-platform (iOS and Android), feature-rich, and provide actionable insights.

## Core Features

### 1. Trade Management
- **Add Trade Entry**: Create new trade entries with the following fields:
  - Symbol/Ticker (stock, forex, crypto, etc.)
  - Entry date and time
  - Entry price
  - Exit date and time
  - Exit price
  - Trade direction (Long/Short)
  - Position size (quantity/lots)
  - Asset class (Stocks, Forex, Crypto, Options, Futures)
  - Trading strategy used
  - Stop loss and take profit levels
  
- **Trade List View**: Display all trades in a scrollable list with:
  - Quick filters (All, Winning, Losing, Open positions)
  - Sort options (Date, P&L, Symbol)
  - Visual indicators for profit/loss (green/red)
  - Search functionality by symbol or strategy

- **Trade Detail View**: Show comprehensive trade information including:
  - All trade parameters
  - Calculated P&L (absolute and percentage)
  - Risk/Reward ratio
  - Trade duration
  - Associated journal notes and screenshots
  - Trade tags/labels

### 2. Journal & Notes
- **Trade Journal Entries**: For each trade, allow traders to:
  - Write pre-trade analysis (why entering the trade)
  - Document emotional state and market conditions
  - Add post-trade review and lessons learned
  - Attach screenshots/charts (camera or gallery)
  - Rate trade execution (1-5 stars)
  
- **Rich Text Editor**: Support markdown or rich text formatting for notes
- **Voice Notes**: Optional voice recording for quick trade notes

### 3. Analytics & Statistics
- **Dashboard Overview**:
  - Total P&L (daily, weekly, monthly, all-time)
  - Win rate percentage
  - Total number of trades
  - Average win vs average loss
  - Profit factor
  - Largest win and largest loss
  - Current streak (winning/losing)
  
- **Performance Charts**:
  - Equity curve (cumulative P&L over time)
  - Daily/Weekly/Monthly P&L bar charts
  - Win rate by day of week
  - Win rate by time of day
  - Performance by asset class
  - Performance by strategy
  
- **Advanced Analytics**:
  - Expectancy calculation
  - Risk-adjusted returns (Sharpe ratio)
  - Maximum drawdown
  - Recovery factor
  - Trade distribution analysis
  - Consecutive wins/losses streaks

### 4. Strategy Performance
- **Strategy Tracking**: Create and manage trading strategies:
  - Name and description
  - Rules and entry/exit criteria
  - Associated trades
  - Performance metrics per strategy
  
- **Strategy Comparison**: Compare multiple strategies side-by-side:
  - P&L comparison
  - Win rate comparison
  - Risk metrics comparison
  - Visual charts

### 5. Calendar View
- **Trading Calendar**: Visual calendar showing:
  - Trading days highlighted
  - Daily P&L color-coded (green for profit, red for loss)
  - Number of trades per day
  - Tap on date to see trades for that day
  - Monthly summary statistics

### 6. Goal Setting & Tracking
- **Trading Goals**: Set and track various goals:
  - Monthly profit targets
  - Maximum drawdown limits
  - Daily trade limits
  - Win rate targets
  - Consistency goals
  
- **Progress Tracking**: Visual indicators showing progress toward goals:
  - Progress bars
  - Notifications when goals are met or violated
  - Goal achievement history

### 7. Reports & Export
- **Generate Reports**: Create detailed trading reports:
  - Custom date range selection
  - PDF export with charts and statistics
  - CSV export of trade data
  - Email or share reports
  
- **Tax Documentation**: Prepare tax-related summaries:
  - Realized gains/losses
  - Trade history by year
  - Exportable formats for tax software

### 8. Settings & Customization
- **Account Settings**:
  - User profile (name, photo)
  - Starting capital
  - Currency preference
  - Commission/fee settings
  - Time zone settings
  
- **App Preferences**:
  - Dark/Light theme
  - Notification preferences
  - Default trade values
  - Chart color schemes
  - Data backup and restore

### 9. Data Synchronization
- **Cloud Backup**: Automatic backup of all data to cloud storage
- **Multi-device Sync**: Sync data across multiple devices
- **Offline Mode**: Full functionality offline with sync when online

### 10. Security & Privacy
- **Authentication**: Secure login with:
  - PIN/Password protection
  - Biometric authentication (Face ID/Touch ID)
  - Session timeout
  
- **Data Encryption**: Encrypt sensitive data locally and in transit
- **Privacy**: All data stored locally or in user's private cloud

## Technical Requirements

### Technology Stack
- **Framework**: React Native (latest stable version)
- **Language**: TypeScript for type safety
- **Navigation**: React Navigation (v6+) with stack and tab navigators
- **State Management**: Redux Toolkit or Context API with useReducer
- **Local Storage**: 
  - AsyncStorage for simple data
  - SQLite (via expo-sqlite or react-native-sqlite-storage) for relational data
  - Realm Database as alternative for complex queries
- **UI Components**: 
  - React Native Paper or Native Base for Material Design
  - React Native Elements for customizable components
  - Custom styled components with styled-components
- **Charts**: Victory Native or React Native Chart Kit
- **Forms**: React Hook Form with Yup validation
- **Date/Time**: date-fns or moment.js
- **Camera**: react-native-camera or expo-camera
- **File System**: react-native-fs or expo-file-system
- **Authentication**: expo-local-authentication or react-native-biometrics

### Project Structure
```
trading-journal-app/
├── src/
│   ├── components/
│   │   ├── common/        # Reusable UI components
│   │   ├── trades/        # Trade-related components
│   │   ├── analytics/     # Chart and analytics components
│   │   └── forms/         # Form components
│   ├── screens/
│   │   ├── TradeListScreen.tsx
│   │   ├── TradeDetailScreen.tsx
│   │   ├── AddTradeScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   ├── StrategiesScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── ReportsScreen.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── redux/ (or contexts/)
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── tradesSlice.ts
│   │   │   ├── strategiesSlice.ts
│   │   │   └── settingsSlice.ts
│   ├── services/
│   │   ├── database.ts    # Database operations
│   │   ├── calculations.ts # P&L and statistics
│   │   ├── export.ts      # Report generation
│   │   └── backup.ts      # Cloud sync
│   ├── models/
│   │   ├── Trade.ts
│   │   ├── Strategy.ts
│   │   └── Settings.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useTrades.ts
│   │   ├── useAnalytics.ts
│   │   └── useTheme.ts
│   └── theme/
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── __tests__/
│   ├── components/
│   ├── services/
│   └── utils/
├── App.tsx
├── package.json
└── tsconfig.json
```

### Data Models

#### Trade Model
```typescript
interface Trade {
  id: string;
  symbol: string;
  assetClass: 'Stocks' | 'Forex' | 'Crypto' | 'Options' | 'Futures';
  direction: 'Long' | 'Short';
  entryDate: Date;
  entryPrice: number;
  exitDate?: Date;
  exitPrice?: number;
  quantity: number;
  commission: number;
  stopLoss?: number;
  takeProfit?: number;
  strategyId?: string;
  notes: {
    preTradeAnalysis?: string;
    postTradeReview?: string;
    emotionalState?: string;
    marketConditions?: string;
  };
  screenshots: string[]; // File paths
  tags: string[];
  rating?: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}
```

#### Strategy Model
```typescript
interface Strategy {
  id: string;
  name: string;
  description: string;
  rules: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Goal Model
```typescript
interface Goal {
  id: string;
  type: 'profit' | 'winRate' | 'tradeLimit' | 'drawdown';
  target: number;
  period: 'daily' | 'weekly' | 'monthly';
  current: number;
  createdAt: Date;
}
```

### Calculations

#### P&L Calculation
```typescript
// For Long positions
pnl = (exitPrice - entryPrice) * quantity - commission

// For Short positions
pnl = (entryPrice - exitPrice) * quantity - commission

// Percentage return
returnPercentage = (pnl / (entryPrice * quantity)) * 100
```

#### Statistics Calculations
```typescript
// Win Rate
winRate = (numberOfWinningTrades / totalTrades) * 100

// Profit Factor
profitFactor = totalGrossProfit / totalGrossLoss

// Average Win/Loss
averageWin = totalGrossProfit / numberOfWins
averageLoss = totalGrossLoss / numberOfLosses

// Expectancy
expectancy = (winRate * averageWin) - ((1 - winRate) * averageLoss)

// Maximum Drawdown
maxDrawdown = max(peak - trough) over all periods
```

## UI/UX Design Guidelines

### Design Principles
1. **Professional & Clean**: Use a modern, minimalist design with clear hierarchy
2. **Data-Driven**: Emphasize charts, numbers, and visual indicators
3. **Quick Actions**: Common actions (add trade, view analytics) easily accessible
4. **Visual Feedback**: Clear success/error states, loading indicators
5. **Responsive**: Adapt to different screen sizes and orientations

### Color Scheme
- **Primary**: Professional blue (#2196F3)
- **Success/Profit**: Green (#4CAF50)
- **Loss/Danger**: Red (#F44336)
- **Warning**: Orange (#FF9800)
- **Background (Light)**: #FFFFFF, #F5F5F5
- **Background (Dark)**: #121212, #1E1E1E
- **Text (Light)**: #212121, #757575
- **Text (Dark)**: #FFFFFF, #BDBDBD

### Typography
- **Headings**: Bold, 24-32px
- **Body**: Regular, 16px
- **Captions**: Regular, 12-14px
- **Numbers/Metrics**: Medium, 18-24px

### Key Screens Layout

#### Dashboard Screen
- Top: Summary cards (Total P&L, Win Rate, Total Trades, Today's P&L)
- Middle: Equity curve chart
- Bottom: Recent trades list preview

#### Trade List Screen
- Header: Search bar and filter chips
- Body: Scrollable list of trade cards
- FAB: Floating action button to add new trade

#### Add/Edit Trade Screen
- Form sections: Trade Details, Risk Management, Journal Notes
- Bottom: Save and Cancel buttons
- Validation feedback inline

#### Analytics Screen
- Tab navigation: Overview, Performance, Strategies
- Charts with touch interactions
- Date range selector

## Implementation Steps

### Phase 1: Project Setup (Week 1)
1. Initialize React Native project with TypeScript
2. Install and configure dependencies
3. Set up navigation structure
4. Configure Redux/Context API
5. Set up SQLite database
6. Create basic theme and styling system

### Phase 2: Core Features (Weeks 2-3)
1. Implement Trade Management:
   - Add/Edit trade form with validation
   - Trade list screen with filters
   - Trade detail screen
   - Basic P&L calculations
2. Implement local storage with SQLite
3. Create reusable UI components

### Phase 3: Journal & Analytics (Weeks 4-5)
1. Add journal note functionality
2. Implement camera/gallery image picker
3. Create Dashboard with summary statistics
4. Implement charts (equity curve, P&L bars)
5. Add calendar view

### Phase 4: Advanced Features (Weeks 6-7)
1. Strategy management
2. Advanced analytics and reports
3. Goal setting and tracking
4. Export functionality (PDF, CSV)
5. Settings and preferences

### Phase 5: Polish & Security (Week 8)
1. Add authentication (PIN, biometric)
2. Implement cloud backup and sync
3. Add dark theme support
4. Performance optimization
5. Error handling and edge cases
6. Accessibility improvements

### Phase 6: Testing & Deployment (Week 9)
1. Unit tests for calculations and utilities
2. Integration tests for database operations
3. E2E tests for critical flows
4. Beta testing
5. App store submission preparation

## Best Practices

### Code Quality
- Use TypeScript for type safety
- Follow React Native best practices
- Implement proper error handling
- Use ESLint and Prettier for code formatting
- Write self-documenting code with clear naming

### Performance
- Use FlatList for long lists (virtualization)
- Memoize expensive calculations
- Optimize image loading and caching
- Use React.memo for expensive components
- Implement pagination for large datasets

### Testing
- Unit tests for business logic (calculations, validations)
- Component tests for UI elements
- Integration tests for database operations
- E2E tests with Detox or Appium

### Accessibility
- Proper label support for screen readers
- Sufficient color contrast
- Touch target sizes (minimum 44x44 points)
- Support for dynamic text sizing
- Keyboard navigation support

## Additional Considerations

### Localization
- Support for multiple languages
- Currency formatting based on locale
- Date/time formatting based on locale

### Future Enhancements
- Integration with broker APIs for automatic trade import
- Social features (share trades, compare with others)
- AI-powered trade analysis and suggestions
- Paper trading mode
- Multi-account support
- Advanced charting tools
- Trade replay and backtesting
- Push notifications for trade reminders
- Widget support for quick stats
- Apple Watch/Wear OS companion app

## Success Metrics
- App stability (crash-free rate > 99%)
- Performance (app launch < 2 seconds)
- User retention (30-day retention > 40%)
- User rating (> 4.5 stars)
- Data accuracy (100% accurate calculations)

## Compliance & Legal
- Include proper disclaimers (not financial advice)
- Privacy policy for data handling
- Terms of service
- GDPR compliance if applicable
- App store guidelines compliance

---

## Getting Started

To implement this trading journal app:

1. **Initialize the project**:
```bash
npx react-native init TradingJournal --template react-native-template-typescript
cd TradingJournal
```

2. **Install core dependencies**:
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install @reduxjs/toolkit react-redux
npm install react-native-sqlite-storage
npm install victory-native
npm install react-hook-form yup
npm install date-fns
npm install react-native-paper
npm install react-native-screens react-native-safe-area-context
npm install styled-components
```

3. **Start building**: Follow the implementation phases outlined above, starting with project setup and core features.

4. **Test continuously**: Write tests as you build features, not after.

5. **Iterate**: Get feedback early and iterate on design and functionality.

This prompt provides a comprehensive blueprint for building a professional trading journal app that traders will love to use!
# Trading Journal App - Features Summary

## Quick Reference Guide

This document provides a high-level overview of all features included in the trading journal app specification.

## Core Modules

### 📊 Trade Management
- Add/Edit/Delete trades
- Trade list with filters and search
- Detailed trade view
- Support for multiple asset classes (Stocks, Forex, Crypto, Options, Futures)
- Long and Short positions
- Risk management fields (Stop Loss, Take Profit)

### 📝 Journal & Documentation
- Pre-trade analysis notes
- Post-trade review and lessons
- Emotional state tracking
- Market condition notes
- Screenshot attachments
- Trade rating system (1-5 stars)
- Voice notes support

### 📈 Analytics Dashboard
- Real-time P&L tracking
- Win rate statistics
- Profit factor
- Average win vs loss
- Largest wins/losses
- Equity curve visualization
- Performance charts by time period

### 🎯 Strategy Management
- Create and track trading strategies
- Assign trades to strategies
- Compare strategy performance
- Strategy-specific analytics

### 📅 Calendar View
- Visual trading calendar
- Daily P&L color coding
- Trade count per day
- Monthly summaries

### 🎯 Goal Setting
- Set profit targets
- Track drawdown limits
- Daily trade limits
- Win rate goals
- Progress visualization

### 📑 Reports & Export
- Generate PDF reports
- Export to CSV
- Tax documentation
- Custom date ranges
- Email/Share capabilities

### ⚙️ Settings
- User profile
- Currency preferences
- Commission settings
- Theme (Dark/Light)
- Backup & Restore

### 🔒 Security
- PIN/Password protection
- Biometric authentication
- Data encryption
- Privacy controls

### ☁️ Cloud Features
- Automatic backup
- Multi-device sync
- Offline mode support

## Key Statistics Calculated

- **Win Rate**: Percentage of winning trades
- **Profit Factor**: Ratio of gross profit to gross loss
- **Expectancy**: Expected value per trade
- **Maximum Drawdown**: Largest peak-to-trough decline
- **Sharpe Ratio**: Risk-adjusted return
- **R-Multiple**: Risk-reward ratio
- **Consecutive Streaks**: Winning/losing sequences

## Technology Highlights

- **Cross-Platform**: iOS and Android
- **Offline-First**: Full functionality without internet
- **Fast Performance**: Optimized for large datasets
- **Type-Safe**: Built with TypeScript
- **Modern UI**: Professional design with dark mode
- **Accessible**: Screen reader support and proper contrast

## User Experience Flow

```
Launch App → [Auth] → Dashboard
                         ↓
         ┌───────────────┼───────────────┐
         ↓               ↓               ↓
    Trade List      Analytics        Calendar
         ↓               ↓               ↓
    Add Trade      Charts/Stats    Day Details
         ↓               
   Trade Detail → Journal Notes → Screenshots
```

## Data Architecture

```
User Settings
    ↓
Trades ←→ Strategies
    ↓
Journal Entries
    ↓
Screenshots
    ↓
Analytics (Calculated)
```

## Development Phases

1. **Phase 1**: Project setup and basic structure
2. **Phase 2**: Core trade management features
3. **Phase 3**: Journal and analytics
4. **Phase 4**: Advanced features (strategies, goals, reports)
5. **Phase 5**: Security and polish
6. **Phase 6**: Testing and deployment

## Success Criteria

✅ Accurate P&L calculations  
✅ Fast app performance (<2s launch)  
✅ Intuitive user interface  
✅ Reliable data storage  
✅ Smooth animations and transitions  
✅ Comprehensive analytics  
✅ Secure data handling  
✅ High user satisfaction (>4.5★)  

---

For complete technical specifications, see [COPILOT_PROMPT.md](./COPILOT_PROMPT.md)
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
