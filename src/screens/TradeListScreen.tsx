import React from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, FAB, Card} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

const TradeListScreen = ({navigation}: any) => {
  const trades = useSelector((state: RootState) => state.trades.items);

  const renderTrade = ({item}: any) => {
    const pnl = item.exitPrice 
      ? item.direction === 'Long'
        ? (item.exitPrice - item.entryPrice) * item.quantity - item.commission
        : (item.entryPrice - item.exitPrice) * item.quantity - item.commission
      : null;

    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate('TradeDetail', {tradeId: item.id})}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text style={[styles.direction, {color: item.direction === 'Long' ? colors.profit : colors.loss}]}>
                {item.direction}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Entry: ${item.entryPrice}</Text>
              {item.exitPrice && (
                <Text style={styles.label}>Exit: ${item.exitPrice}</Text>
              )}
            </View>
            {pnl !== null && (
              <Text style={[styles.pnl, {color: pnl >= 0 ? colors.profit : colors.loss}]}>
                P&L: ${pnl.toFixed(2)}
              </Text>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {trades.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No trades yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to add your first trade</Text>
        </View>
      ) : (
        <FlatList
          data={trades}
          renderItem={renderTrade}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTrade')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  list: {
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  direction: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  pnl: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
  },
});

export default TradeListScreen;
