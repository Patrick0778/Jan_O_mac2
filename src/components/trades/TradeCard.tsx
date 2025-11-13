import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Chip} from 'react-native-paper';
import {Trade} from '../../models/Trade';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {formatDate} from '../../utils/formatting';
import {
  calculatePnL,
  calculatePnLPercentage,
} from '../../services/calculations';
import {PnLIndicator} from '../common/PnLIndicator';

interface TradeCardProps {
  trade: Trade;
  onPress?: () => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({trade, onPress}) => {
  const pnl = calculatePnL(trade);
  const pnlPercentage = calculatePnLPercentage(trade);
  const isOpen = !trade.exitPrice;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.symbolContainer}>
              <Text style={styles.symbol}>{trade.symbol}</Text>
              <Chip
                mode="outlined"
                compact
                style={[
                  styles.directionChip,
                  trade.direction === 'Long'
                    ? styles.longChip
                    : styles.shortChip,
                ]}>
                {trade.direction}
              </Chip>
            </View>
            {!isOpen && (
              <PnLIndicator pnl={pnl} percentage={pnlPercentage} size="small" />
            )}
          </View>

          <View style={styles.details}>
            <Text style={styles.detailText}>
              Entry: ${trade.entryPrice.toFixed(2)} × {trade.quantity}
            </Text>
            {trade.exitPrice && (
              <Text style={styles.detailText}>
                Exit: ${trade.exitPrice.toFixed(2)}
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.date}>{formatDate(trade.entryDate)}</Text>
            <View style={styles.tags}>
              <Chip compact mode="outlined" style={styles.assetChip}>
                {trade.assetClass}
              </Chip>
              {isOpen && (
                <Chip compact style={styles.openChip}>
                  Open
                </Chip>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  directionChip: {
    height: 24,
  },
  longChip: {
    borderColor: colors.profit,
  },
  shortChip: {
    borderColor: colors.loss,
  },
  details: {
    marginBottom: spacing.sm,
  },
  detailText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  assetChip: {
    height: 24,
  },
  openChip: {
    height: 24,
    backgroundColor: colors.warning,
  },
});
