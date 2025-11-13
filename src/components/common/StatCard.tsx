import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color,
  subtitle,
  icon,
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          {icon && <View style={styles.icon}>{icon}</View>}
        </View>
        <Text style={[styles.value, color ? {color} : null]}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    margin: spacing.xs,
    elevation: 2,
  },
  content: {
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  icon: {
    marginLeft: spacing.xs,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
});
