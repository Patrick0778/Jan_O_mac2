# Implementation Guide

## Quick Start: Integrating New Features

This guide shows you how to integrate the newly created components and features into your existing app.

## 1. Update Navigation

### Add Enhanced Trade Entry Screen

Update `src/navigation/AppNavigator.tsx`:

```typescript
import EnhancedTradeEntryScreen from '../screens/EnhancedTradeEntryScreen';

// In your Stack.Navigator:
<Stack.Screen
  name="EnhancedTradeEntry"
  component={EnhancedTradeEntryScreen}
  options={{title: 'Add Trade'}}
/>;
```

### Update Navigation from Dashboard

In any screen where you want to navigate to the enhanced trade entry:

```typescript
navigation.navigate('EnhancedTradeEntry');
```

## 2. Update TradeListScreen with TradeCard Component

Replace the existing trade list items:

```typescript
import {TradeCard} from '../components/trades/TradeCard';

// In your FlatList renderItem:
<FlatList
  data={trades}
  renderItem={({item}) => (
    <TradeCard
      trade={item}
      onPress={() => navigation.navigate('TradeDetail', {tradeId: item.id})}
    />
  )}
  keyExtractor={item => item.id}
/>;
```

## 3. Use StatCard Component Anywhere

Display metrics throughout your app:

```typescript
import {StatCard} from '../components/common/StatCard';
import {formatCurrency, formatPercentage} from '../utils/formatting';

<View style={styles.statsContainer}>
  <StatCard
    label="Total P&L"
    value={formatCurrency(totalPnl)}
    color={totalPnl >= 0 ? colors.profit : colors.loss}
    subtitle="All time"
  />
  <StatCard
    label="Win Rate"
    value={formatPercentage(winRate)}
    color={winRate >= 50 ? colors.profit : colors.loss}
  />
</View>;
```

## 4. Add Equity Curve to Analytics Screen

```typescript
import {EquityCurveChart} from '../components/analytics/EquityCurveChart';
import {calculateEquityCurve} from '../services/calculations';

// In your component:
const equityCurve = calculateEquityCurve(trades);

return (
  <ScrollView>
    <EquityCurveChart data={equityCurve} currency="USD" />
    {/* Other analytics components */}
  </ScrollView>
);
```

## 5. Implement Goal Tracking

Create a new screen or add to existing SettingsScreen:

```typescript
import {calculateGoalProgress, GoalProgress} from '../services/calculations';
import {Goal} from '../models/Settings';

// Example: Track monthly profit goal
const [goals, setGoals] = useState<Goal[]>([
  {
    id: '1',
    type: 'profit',
    target: 5000,
    period: 'monthly',
    current: 0,
    createdAt: new Date(),
  },
]);

// Calculate progress
const goalProgress = calculateGoalProgress('profit', 5000, trades, 'monthly');

// Display progress
<View>
  <Text>Monthly Profit Goal</Text>
  <Text>Progress: {goalProgress.progress.toFixed(1)}%</Text>
  <Text>Current: ${goalProgress.current.toFixed(2)}</Text>
  <Text>Target: ${goalProgress.target.toFixed(2)}</Text>
  <Text>
    Status: {goalProgress.achieved ? '✅ Achieved' : '⏳ In Progress'}
  </Text>
</View>;
```

## 6. Use Advanced Calculations

Import and use any of the new calculation functions:

```typescript
import {
  calculateAverageWin,
  calculateAverageLoss,
  calculateMaximumDrawdown,
  calculateSharpeRatio,
  calculateCurrentStreak,
  calculateLargestWin,
  calculateLargestLoss,
} from '../services/calculations';

// Use in any component
const avgWin = calculateAverageWin(trades);
const avgLoss = calculateAverageLoss(trades);
const maxDrawdown = calculateMaximumDrawdown(trades);
const sharpeRatio = calculateSharpeRatio(trades);
const streak = calculateCurrentStreak(trades);
```

## 7. Display P&L with PnLIndicator

Use instead of plain text for P&L:

```typescript
import {PnLIndicator} from '../components/common/PnLIndicator';
import {calculatePnL, calculatePnLPercentage} from '../services/calculations';

// For a single trade
const pnl = calculatePnL(trade);
const pnlPercent = calculatePnLPercentage(trade);

<PnLIndicator
  pnl={pnl}
  percentage={pnlPercent}
  size="medium"
  showSign={true}
/>;
```

## 8. Enhanced Trade Detail Screen

Update TradeDetailScreen to show all new fields:

```typescript
import {formatDuration} from '../utils/formatting';
import {
  calculateRiskRewardRatio,
  calculateTradeDuration,
} from '../services/calculations';

// Display all trade information
<ScrollView>
  <Card>
    <Card.Content>
      <Title>{trade.symbol}</Title>

      {/* Basic Info */}
      <Text>Asset Class: {trade.assetClass}</Text>
      <Text>Direction: {trade.direction}</Text>
      <Text>Quantity: {trade.quantity}</Text>

      {/* Risk Management */}
      {trade.stopLoss && <Text>Stop Loss: ${trade.stopLoss}</Text>}
      {trade.takeProfit && <Text>Take Profit: ${trade.takeProfit}</Text>}
      {calculateRiskRewardRatio(trade) && (
        <Text>R:R Ratio: 1:{calculateRiskRewardRatio(trade)?.toFixed(2)}</Text>
      )}

      {/* Duration */}
      {trade.exitDate && (
        <Text>Duration: {formatDuration(calculateTradeDuration(trade)!)}</Text>
      )}

      {/* Journal Notes */}
      {trade.notes.preTradeAnalysis && (
        <View>
          <Text style={styles.label}>Pre-Trade Analysis:</Text>
          <Text>{trade.notes.preTradeAnalysis}</Text>
        </View>
      )}

      {trade.notes.emotionalState && (
        <View>
          <Text style={styles.label}>Emotional State:</Text>
          <Text>{trade.notes.emotionalState}</Text>
        </View>
      )}

      {/* Tags */}
      {trade.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {trade.tags.map(tag => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </View>
      )}

      {/* Rating */}
      {trade.rating && <Text>Execution Rating: {trade.rating}/5 ⭐</Text>}
    </Card.Content>
  </Card>
</ScrollView>;
```

## 9. Create Analytics Dashboard

Create a comprehensive analytics view:

```typescript
import {
  calculateTotalPnL,
  calculateWinRate,
  calculateProfitFactor,
  calculateAverageWin,
  calculateAverageLoss,
  calculateExpectancy,
  calculateMaximumDrawdown,
  calculateSharpeRatio,
  calculateConsecutiveWinsLosses,
} from '../services/calculations';

const AnalyticsDashboard = ({trades}: {trades: Trade[]}) => {
  const stats = {
    totalPnl: calculateTotalPnL(trades),
    winRate: calculateWinRate(trades),
    profitFactor: calculateProfitFactor(trades),
    avgWin: calculateAverageWin(trades),
    avgLoss: calculateAverageLoss(trades),
    expectancy: calculateExpectancy(trades),
    maxDrawdown: calculateMaximumDrawdown(trades),
    sharpeRatio: calculateSharpeRatio(trades),
    streaks: calculateConsecutiveWinsLosses(trades),
  };

  return (
    <ScrollView>
      <Text style={styles.title}>Performance Analytics</Text>

      <View style={styles.statsGrid}>
        <StatCard label="Total P&L" value={formatCurrency(stats.totalPnl)} />
        <StatCard label="Win Rate" value={formatPercentage(stats.winRate)} />
        <StatCard label="Profit Factor" value={stats.profitFactor.toFixed(2)} />
        <StatCard label="Expectancy" value={formatCurrency(stats.expectancy)} />
        <StatCard
          label="Max Drawdown"
          value={formatCurrency(stats.maxDrawdown)}
        />
        <StatCard label="Sharpe Ratio" value={stats.sharpeRatio.toFixed(2)} />
        <StatCard label="Max Win Streak" value={stats.streaks.maxWinStreak} />
        <StatCard label="Max Loss Streak" value={stats.streaks.maxLossStreak} />
      </View>

      <EquityCurveChart data={calculateEquityCurve(trades)} />
    </ScrollView>
  );
};
```

## 10. Filter and Sort Trades

Use calculations for filtering:

```typescript
import {calculatePnL} from '../services/calculations';

// Filter winning trades
const winningTrades = trades.filter(t => calculatePnL(t) > 0);

// Filter by asset class
const stockTrades = trades.filter(t => t.assetClass === 'Stocks');

// Filter by strategy
const strategyTrades = trades.filter(t => t.strategyId === selectedStrategyId);

// Filter open positions
const openTrades = trades.filter(t => !t.exitPrice);

// Sort by P&L
const sortedByPnL = [...trades].sort(
  (a, b) => calculatePnL(b) - calculatePnL(a),
);

// Sort by date
const sortedByDate = [...trades].sort(
  (a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime(),
);
```

## 11. Styling Tips

Use consistent styling with theme:

```typescript
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
  },
  profitText: {
    color: colors.profit,
    fontWeight: typography.fontWeights.bold,
  },
  lossText: {
    color: colors.loss,
    fontWeight: typography.fontWeights.bold,
  },
});
```

## 12. Type Safety

Always use the proper TypeScript types:

```typescript
import {Trade, AssetClass, TradeDirection} from '../models/Trade';
import {Strategy} from '../models/Strategy';
import {Goal, GoalType, GoalPeriod} from '../models/Settings';
```

## Common Patterns

### Conditional Rendering

```typescript
{
  trade.exitPrice ? (
    <PnLIndicator pnl={calculatePnL(trade)} />
  ) : (
    <Chip>Open</Chip>
  );
}
```

### Error Handling

```typescript
try {
  const stats = calculateAllStats(trades);
  // Use stats
} catch (error) {
  console.error('Error calculating stats:', error);
  // Show error message to user
}
```

### Loading States

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData().finally(() => setLoading(false));
}, []);

if (loading) return <ActivityIndicator />;
```

## Testing Your Implementation

1. **Test Trade Entry**: Create trades with all fields populated
2. **Test Calculations**: Verify P&L, win rate, and other metrics
3. **Test Components**: Ensure StatCard, TradeCard render correctly
4. **Test Navigation**: Navigate between all screens
5. **Test Edge Cases**: Empty trades list, single trade, many trades

## Troubleshooting

### Component Not Rendering

- Check all imports are correct
- Verify component props are passed correctly
- Check for TypeScript errors

### Calculations Return NaN or Undefined

- Ensure trades array is not empty
- Verify trade data has required fields
- Check for division by zero cases

### Styling Issues

- Import theme correctly
- Use StyleSheet.create for styles
- Check flexbox properties

## Next Steps

After implementing these features:

1. Add unit tests for calculations
2. Implement PDF report generation with new metrics
3. Create strategy comparison views
4. Add data export functionality
5. Implement push notifications for goals
6. Add dark theme support

## Need Help?

Refer to:

- `REPOSITORY_UPDATES.md` for overview of changes
- `COPILOT_PROMPT.md` for full specifications
- Component files for usage examples
- TypeScript definitions for type information
