import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
} from 'victory-native';
import {Card, Title} from 'react-native-paper';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {formatCurrency, formatDate} from '../../utils/formatting';

interface EquityCurveChartProps {
  data: Array<{date: Date; equity: number}>;
  currency?: string;
}

export const EquityCurveChart: React.FC<EquityCurveChartProps> = ({
  data,
  currency = 'USD',
}) => {
  if (data.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title>Equity Curve</Title>
          <Text style={styles.emptyText}>
            No closed trades yet. Start trading to see your equity curve!
          </Text>
        </Card.Content>
      </Card>
    );
  }

  const chartData = data.map((point, index) => ({
    x: index,
    y: point.equity,
    date: point.date,
  }));

  const minEquity = Math.min(...data.map(d => d.equity));
  const maxEquity = Math.max(...data.map(d => d.equity));
  const range = maxEquity - minEquity;
  const padding = range * 0.1;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Equity Curve</Title>
        <VictoryChart
          theme={VictoryTheme.material}
          width={Dimensions.get('window').width - 60}
          height={250}
          padding={{top: 20, bottom: 40, left: 60, right: 20}}
          domain={{
            y: [minEquity - padding, maxEquity + padding],
          }}>
          <VictoryAxis
            dependentAxis
            tickFormat={tick => `$${tick.toFixed(0)}`}
            style={{
              grid: {stroke: colors.light.textSecondary, strokeWidth: 0.5},
              tickLabels: {fontSize: 10, fill: colors.light.textSecondary},
            }}
          />
          <VictoryAxis
            tickFormat={(t, index) =>
              index % Math.ceil(data.length / 5) === 0
                ? formatDate(data[t]?.date || new Date()).split(',')[0]
                : ''
            }
            style={{
              tickLabels: {fontSize: 9, fill: colors.light.textSecondary},
            }}
          />
          <VictoryLine
            data={chartData}
            style={{
              data: {
                stroke: colors.primary,
                strokeWidth: 2,
              },
            }}
            interpolation="monotoneX"
          />
        </VictoryChart>
        <View style={styles.legend}>
          <Text style={styles.legendText}>
            Total P&L: {formatCurrency(data[data.length - 1].equity, currency)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.light.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  legend: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
});
