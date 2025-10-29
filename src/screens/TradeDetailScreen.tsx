import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

const TradeDetailScreen = ({route}: any) => {
  const {tradeId} = route.params;

  return (
    <View style={styles.container}>
      <Text>Trade Detail Screen - ID: {tradeId}</Text>
      <Text style={styles.text}>Full trade details will be displayed here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 8,
    color: '#757575',
  },
});

export default TradeDetailScreen;
