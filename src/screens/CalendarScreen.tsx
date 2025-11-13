import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Title} from 'react-native-paper';
import {spacing} from '../theme/spacing';

const CalendarScreen = () => {
  return (
    <View style={styles.container}>
      <Title>Trading Calendar</Title>
      <Text style={styles.text}>
        Calendar view with daily P&L will be displayed here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  text: {
    marginTop: spacing.md,
    color: '#757575',
  },
});

export default CalendarScreen;
