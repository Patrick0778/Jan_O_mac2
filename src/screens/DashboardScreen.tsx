import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card, Title, Button} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {loadProfile, loadTrades} from '../services/localStorage';
import TaxRegionRemovedNotice from '../components/TaxRegionRemovedNotice';
import {StatCard} from '../components/common/StatCard';
import {EquityCurveChart} from '../components/analytics/EquityCurveChart';
import {
  calculateTotalPnL,
  calculateWinRate,
  calculateProfitFactor,
  calculateAverageWin,
  calculateAverageLoss,
  calculateLargestWin,
  calculateLargestLoss,
  calculateCurrentStreak,
  calculateMaximumDrawdown,
  calculateExpectancy,
  calculateEquityCurve,
} from '../services/calculations';
import {formatCurrency, formatPercentage} from '../utils/formatting';

const DashboardScreen = ({navigation}: any) => {
  const trades = useSelector((state: RootState) => state.trades.items);
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [localTrades, setLocalTrades] = useState<any[]>([]);

  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    try {
      const profile = await loadProfile();
      const tradesData = await loadTrades();
      setLocalProfile(profile);
      setLocalTrades(tradesData);
    } catch (error) {
      console.error('Error loading local data:', error);
    }
  };

  // Calculate comprehensive statistics
  const totalPnl = calculateTotalPnL(trades);
  const winRate = calculateWinRate(trades);
  const profitFactor = calculateProfitFactor(trades);
  const averageWin = calculateAverageWin(trades);
  const averageLoss = calculateAverageLoss(trades);
  const largestWin = calculateLargestWin(trades);
  const largestLoss = calculateLargestLoss(trades);
  const currentStreak = calculateCurrentStreak(trades);
  const maxDrawdown = calculateMaximumDrawdown(trades);
  const expectancy = calculateExpectancy(trades);
  const equityCurve = calculateEquityCurve(trades);

  const totalTrades = trades.length;
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);
  const openTrades = trades.filter(t => !t.exitPrice);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Trading Dashboard</Title>
      </View>

      <TaxRegionRemovedNotice variant="compact" style={styles.notice} />

      {!localProfile && (
        <Card style={styles.warningCard}>
          <Card.Content>
            <Text style={styles.warningTitle}>
              👋 Welcome to Local-Only Mode!
            </Text>
            <Text style={styles.warningText}>
              Create a profile to get started. All data is stored locally on
              this device.
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Settings')}
              style={styles.warningButton}>
              Create Profile
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Primary Statistics */}
      <View style={styles.statsContainer}>
        <StatCard
          label="Total P&L"
          value={formatCurrency(totalPnl)}
          color={totalPnl >= 0 ? colors.profit : colors.loss}
        />
        <StatCard
          label="Win Rate"
          value={formatPercentage(winRate)}
          color={winRate >= 50 ? colors.profit : colors.loss}
        />
        <StatCard
          label="Total Trades"
          value={totalTrades}
          subtitle={`${closedTrades.length} closed, ${openTrades.length} open`}
        />
        <StatCard
          label="Profit Factor"
          value={profitFactor.toFixed(2)}
          color={profitFactor >= 1.5 ? colors.profit : colors.warning}
        />
      </View>

      {/* Secondary Statistics */}
      <View style={styles.statsContainer}>
        <StatCard
          label="Average Win"
          value={formatCurrency(averageWin)}
          color={colors.profit}
        />
        <StatCard
          label="Average Loss"
          value={formatCurrency(Math.abs(averageLoss))}
          color={colors.loss}
        />
        <StatCard
          label="Largest Win"
          value={formatCurrency(largestWin)}
          color={colors.profit}
        />
        <StatCard
          label="Largest Loss"
          value={formatCurrency(Math.abs(largestLoss))}
          color={colors.loss}
        />
      </View>

      {/* Risk Metrics */}
      <View style={styles.statsContainer}>
        <StatCard
          label="Max Drawdown"
          value={formatCurrency(maxDrawdown)}
          color={colors.loss}
        />
        <StatCard
          label="Expectancy"
          value={formatCurrency(expectancy)}
          color={expectancy >= 0 ? colors.profit : colors.loss}
        />
        <StatCard
          label="Current Streak"
          value={`${currentStreak.count} ${currentStreak.type}`}
          color={currentStreak.type === 'winning' ? colors.profit : colors.loss}
        />
        <StatCard
          label="Local Trades"
          value={localTrades.length}
          subtitle="AsyncStorage"
        />
      </View>

      {/* Equity Curve Chart */}
      <EquityCurveChart data={equityCurve} />

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recent Activity</Title>
          {trades.length === 0 && localTrades.length === 0 ? (
            <Text style={styles.emptyText}>
              No trades yet. Start by adding your first trade!
            </Text>
          ) : (
            <>
              <Text style={styles.infoText}>
                Redux Trades: {totalTrades} (in-memory){'\n'}
                Closed Trades: {closedTrades.length}
                {'\n'}
                Open Positions: {openTrades.length}
                {'\n'}
                Local Storage: {localTrades.length} trades{'\n'}
                Profile: {localProfile ? '✅ Created' : '❌ Not created'}
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('TradeList')}
                style={styles.viewAllButton}>
                View All Trades
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
  },
  card: {
    margin: spacing.md,
  },
  emptyText: {
    color: colors.light.textSecondary,
    marginTop: spacing.md,
  },
  notice: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  warningCard: {
    margin: spacing.md,
    backgroundColor: '#E3F2FD',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  warningText: {
    marginBottom: spacing.md,
  },
  warningButton: {
    marginTop: spacing.sm,
  },
  infoText: {
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  viewAllButton: {
    marginTop: spacing.md,
  },
});

export default DashboardScreen;
