import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Title} from 'react-native-paper';
import {spacing} from '../theme/spacing';

const AnalyticsScreen = () => {
  return (
    <View style={styles.container}>
      <Title>Analytics</Title>
      <Text style={styles.text}>
        Charts and performance metrics will be displayed here
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

export default AnalyticsScreen;
