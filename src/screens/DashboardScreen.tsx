import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card, Title, Button} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {loadProfile, loadTrades} from '../services/localStorage';
import TaxRegionRemovedNotice from '../components/TaxRegionRemovedNotice';

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
  
  // Calculate statistics
  const totalTrades = trades.length;
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);
  const winningTrades = closedTrades.filter(t => {
    const pnl = t.direction === 'Long' 
      ? ((t.exitPrice || 0) - t.entryPrice) * t.quantity 
      : (t.entryPrice - (t.exitPrice || 0)) * t.quantity;
    return pnl > 0;
  });
  
  const totalPnl = closedTrades.reduce((sum, t) => {
    const pnl = t.direction === 'Long'
      ? ((t.exitPrice || 0) - t.entryPrice) * t.quantity - t.commission
      : (t.entryPrice - (t.exitPrice || 0)) * t.quantity - t.commission;
    return sum + pnl;
  }, 0);
  
  const winRate = closedTrades.length > 0 
    ? (winningTrades.length / closedTrades.length) * 100 
    : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Trading Dashboard</Title>
      </View>
      
      <TaxRegionRemovedNotice variant="compact" style={styles.notice} />
      
      {!localProfile && (
        <Card style={styles.warningCard}>
          <Card.Content>
            <Text style={styles.warningTitle}>👋 Welcome to Local-Only Mode!</Text>
            <Text style={styles.warningText}>
              Create a profile to get started. All data is stored locally on this device.
            </Text>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Settings')}
              style={styles.warningButton}
            >
              Create Profile
            </Button>
          </Card.Content>
        </Card>
      )}

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Total P&L (Redux)</Text>
            <Text style={[styles.statValue, {color: totalPnl >= 0 ? colors.profit : colors.loss}]}>
              ${totalPnl.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Win Rate</Text>
            <Text style={styles.statValue}>{winRate.toFixed(1)}%</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Total Trades (Redux)</Text>
            <Text style={styles.statValue}>{totalTrades}</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Local Trades</Text>
            <Text style={styles.statValue}>{localTrades.length}</Text>
          </Card.Content>
        </Card>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Storage Info</Title>
          <Text style={styles.infoText}>
            Redux Trades: {totalTrades} (in-memory){'\n'}
            Local Storage Trades: {localTrades.length} (AsyncStorage){'\n'}
            Profile: {localProfile ? '✅ Created' : '❌ Not created'}
          </Text>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Recent Activity</Title>
          {trades.length === 0 && localTrades.length === 0 ? (
            <Text style={styles.emptyText}>No trades yet. Start by adding your first trade!</Text>
          ) : (
            <Text>Recent trades will be displayed here.</Text>
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
  statCard: {
    width: '48%',
    margin: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.light.text,
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
});

export default DashboardScreen;
