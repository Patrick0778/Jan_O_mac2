import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Text, Icon} from 'react-native-paper';
import {spacing} from '../theme/spacing';

/**
 * TaxRegionRemovedNotice
 * 
 * A notice component informing users that tax calculation and region selection
 * features have been removed from the app. Users must handle tax calculations
 * externally.
 */
const TaxRegionRemovedNotice: React.FC = () => {
  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon source="information-outline" size={24} color="#1976D2" />
        </View>
        <View style={styles.textContainer}>
          <Text variant="titleSmall" style={styles.title}>
            Tax & Region Features Removed
          </Text>
          <Text variant="bodySmall" style={styles.description}>
            This app no longer includes tax calculation or region selection features. 
            All tax-related calculations must be performed externally using your 
            preferred tax software or professional tax advisor.
          </Text>
          <Text variant="bodySmall" style={styles.note}>
            Your trading data can be exported for use with external tax tools.
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    backgroundColor: '#E3F2FD',
    borderColor: '#1976D2',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#1565C0',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  description: {
    color: '#424242',
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  note: {
    color: '#616161',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

export default TaxRegionRemovedNotice;
