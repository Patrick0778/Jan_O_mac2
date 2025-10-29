/**
 * Tax & Region Removed Notice Component
 * 
 * This component displays a notice explaining that tax calculation
 * and region selection features have been intentionally removed
 * as part of the local-only architecture conversion.
 * 
 * Use this component in places where tax/region features would
 * have been displayed in the original app.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { spacing } from '../theme/spacing';

interface TaxRegionRemovedNoticeProps {
  variant?: 'default' | 'compact';
  style?: object;
}

const TaxRegionRemovedNotice: React.FC<TaxRegionRemovedNoticeProps> = ({
  variant = 'default',
  style,
}) => {
  if (variant === 'compact') {
    return (
      <Card style={[styles.compactCard, style]}>
        <Card.Content style={styles.compactContent}>
          <Text variant="bodySmall" style={styles.compactText}>
            ℹ️ Tax and region features have been removed. This app is now fully local-only.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={[styles.card, style]}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          📋 Tax & Region Features Removed
        </Text>
        <Text variant="bodyMedium" style={styles.body}>
          Tax calculation and region selection features have been intentionally
          removed from this version of the app.
        </Text>
        <Text variant="bodyMedium" style={styles.body}>
          This app now operates in a <Text style={styles.bold}>fully local-only mode</Text>,
          with no cloud services, network requests, or tax-related functionality.
        </Text>
        <Text variant="bodySmall" style={styles.footer}>
          All your trading data is stored locally on this device and remains completely private.
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    backgroundColor: '#FFF9C4',
  },
  title: {
    marginBottom: spacing.sm,
    fontWeight: 'bold',
    color: '#F57F17',
  },
  body: {
    marginBottom: spacing.sm,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: spacing.sm,
    color: '#666',
    fontStyle: 'italic',
  },
  compactCard: {
    backgroundColor: '#FFF9C4',
  },
  compactContent: {
    paddingVertical: spacing.sm,
  },
  compactText: {
    color: '#F57F17',
  },
});

export default TaxRegionRemovedNotice;
