import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {TextInput, Button, Card, SegmentedButtons} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {addTrade} from '../redux/slices/tradesSlice';
import {Trade, AssetClass, TradeDirection} from '../models/Trade';
import {spacing} from '../theme/spacing';

const AddTradeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [symbol, setSymbol] = useState('');
  const [assetClass, setAssetClass] = useState<AssetClass>('Stocks');
  const [direction, setDirection] = useState<TradeDirection>('Long');
  const [entryPrice, setEntryPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [commission, setCommission] = useState('0');

  const handleSubmit = () => {
    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      assetClass,
      direction,
      entryDate: new Date(),
      entryPrice: parseFloat(entryPrice),
      quantity: parseFloat(quantity),
      commission: parseFloat(commission),
      notes: {},
      screenshots: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch(addTrade(newTrade));
    navigation.goBack();
  };

  const isValid = symbol && entryPrice && quantity;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Symbol"
            value={symbol}
            onChangeText={setSymbol}
            mode="outlined"
            style={styles.input}
            autoCapitalize="characters"
          />

          <SegmentedButtons
            value={assetClass}
            onValueChange={(value) => setAssetClass(value as AssetClass)}
            buttons={[
              {value: 'Stocks', label: 'Stocks'},
              {value: 'Forex', label: 'Forex'},
              {value: 'Crypto', label: 'Crypto'},
            ]}
            style={styles.input}
          />

          <SegmentedButtons
            value={direction}
            onValueChange={(value) => setDirection(value as TradeDirection)}
            buttons={[
              {value: 'Long', label: 'Long'},
              {value: 'Short', label: 'Short'},
            ]}
            style={styles.input}
          />

          <TextInput
            label="Entry Price"
            value={entryPrice}
            onChangeText={setEntryPrice}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Commission"
            value={commission}
            onChangeText={setCommission}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!isValid}
            style={styles.button}>
            Add Trade
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
});

export default AddTradeScreen;
