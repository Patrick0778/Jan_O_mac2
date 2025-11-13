import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {formatPercentage} from '../../utils/formatting';

interface PnLIndicatorProps {
  pnl: number;
  percentage?: number;
  size?: 'small' | 'medium' | 'large';
  showSign?: boolean;
}

export const PnLIndicator: React.FC<PnLIndicatorProps> = ({
  pnl,
  percentage,
  size = 'medium',
  showSign = true,
}) => {
  const isProfit = pnl >= 0;
  const color = isProfit ? colors.profit : colors.loss;

  const fontSize = {
    small: 14,
    medium: 18,
    large: 24,
  }[size];

  return (
    <View style={styles.container}>
      <Text style={[styles.pnl, {color, fontSize}]}>
        {showSign && (isProfit ? '+' : '')}${Math.abs(pnl).toFixed(2)}
      </Text>
      {percentage !== undefined && (
        <Text style={[styles.percentage, {color, fontSize: fontSize * 0.8}]}>
          ({showSign && (isProfit ? '+' : '')}
          {formatPercentage(percentage)})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pnl: {
    fontWeight: 'bold',
  },
  percentage: {
    fontWeight: '500',
  },
});
