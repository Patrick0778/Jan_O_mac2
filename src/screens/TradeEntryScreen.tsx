import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {TextInput, Button, Card, SegmentedButtons, Text} from 'react-native-paper';
import {addTrade} from '../services/localStorage';
import {spacing} from '../theme/spacing';

type TradeType = 'buy' | 'sell' | 'other';

const TradeEntryScreen = ({navigation}: any) => {
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState<TradeType>('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [fees, setFees] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!symbol.trim()) {
      Alert.alert('Validation Error', 'Symbol is required');
      return;
    }
    if (!quantity || isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
      Alert.alert('Validation Error', 'Valid quantity is required');
      return;
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Validation Error', 'Valid price is required');
      return;
    }

    setSubmitting(true);
    try {
      await addTrade({
        symbol: symbol.toUpperCase().trim(),
        type,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        fees: fees ? parseFloat(fees) : undefined,
        notes: notes.trim() || undefined,
        date: new Date().toISOString(),
      });

      Alert.alert('Success', 'Trade added successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSymbol('');
            setQuantity('');
            setPrice('');
            setFees('');
            setNotes('');
            setType('buy');
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add trade');
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = symbol.trim() && quantity && price;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.title}>
            Manual Trade Entry
          </Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            All trades are stored locally on this device
          </Text>

          <TextInput
            label="Symbol *"
            value={symbol}
            onChangeText={setSymbol}
            mode="outlined"
            style={styles.input}
            autoCapitalize="characters"
            disabled={submitting}
          />

          <Text variant="labelMedium" style={styles.label}>
            Trade Type *
          </Text>
          <SegmentedButtons
            value={type}
            onValueChange={value => setType(value as TradeType)}
            buttons={[
              {value: 'buy', label: 'Buy'},
              {value: 'sell', label: 'Sell'},
              {value: 'other', label: 'Other'},
            ]}
            style={styles.input}
          />

          <TextInput
            label="Quantity *"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            disabled={submitting}
          />

          <TextInput
            label="Price *"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            disabled={submitting}
          />

          <TextInput
            label="Fees (optional)"
            value={fees}
            onChangeText={setFees}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            disabled={submitting}
          />

          <TextInput
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            disabled={submitting}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!isValid || submitting}
            loading={submitting}
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
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.lg,
    opacity: 0.7,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
});

export default TradeEntryScreen;
