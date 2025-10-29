/**
 * Trade Entry Screen
 * 
 * Manual trade entry screen for local-only data storage.
 * Users manually enter all trade information - no automatic price fetching.
 * 
 * Features:
 * - Manual entry of all trade details (symbol, prices, quantity, fees)
 * - Support for Long/Short positions
 * - Optional exit data for closed trades
 * - Notes field for trade documentation
 * - All data stored locally using AsyncStorage
 * 
 * No Network Features:
 * - No automatic price fetching from APIs
 * - No market data integration
 * - No cloud sync
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text, SegmentedButtons } from 'react-native-paper';
import { addTrade, Trade } from '../services/localStorage';
import { spacing } from '../theme/spacing';
import { v4 as uuidv4 } from 'uuid';

const TradeEntryScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [tradeType, setTradeType] = useState<'Long' | 'Short'>('Long');
  const [quantity, setQuantity] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [fees, setFees] = useState('0');
  const [notes, setNotes] = useState('');
  const [isOpen, setIsOpen] = useState<string>('open');

  const handleSaveTrade = async () => {
    // Validate inputs
    if (!symbol.trim()) {
      Alert.alert('Validation Error', 'Please enter a symbol');
      return;
    }

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid quantity');
      return;
    }

    const entryNum = parseFloat(entryPrice);
    if (isNaN(entryNum) || entryNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid entry price');
      return;
    }

    const feesNum = parseFloat(fees || '0');
    if (isNaN(feesNum) || feesNum < 0) {
      Alert.alert('Validation Error', 'Please enter a valid fees amount');
      return;
    }

    // Validate exit price if trade is closed
    let exitNum: number | undefined;
    if (isOpen === 'closed') {
      exitNum = parseFloat(exitPrice);
      if (isNaN(exitNum) || exitNum <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid exit price for closed trade');
        return;
      }
    }

    setLoading(true);

    try {
      const now = new Date().toISOString();
      const trade: Trade = {
        id: uuidv4(),
        symbol: symbol.toUpperCase().trim(),
        type: tradeType,
        quantity: qtyNum,
        entryPrice: entryNum,
        exitPrice: exitNum,
        fees: feesNum,
        notes: notes.trim() || undefined,
        entryDate: now,
        exitDate: isOpen === 'closed' ? now : undefined,
        createdAt: now,
        updatedAt: now,
      };

      await addTrade(trade);

      Alert.alert(
        'Success',
        'Trade saved successfully!',
        [
          {
            text: 'Add Another',
            onPress: () => {
              // Reset form
              setSymbol('');
              setQuantity('');
              setEntryPrice('');
              setExitPrice('');
              setFees('0');
              setNotes('');
              setIsOpen('open');
            },
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving trade:', error);
      Alert.alert('Error', 'Failed to save trade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculatePnL = (): string => {
    const qtyNum = parseFloat(quantity);
    const entryNum = parseFloat(entryPrice);
    const exitNum = parseFloat(exitPrice);
    const feesNum = parseFloat(fees || '0');

    if (isNaN(qtyNum) || isNaN(entryNum) || isNaN(exitNum)) {
      return 'Enter all values to calculate';
    }

    let pnl: number;
    if (tradeType === 'Long') {
      pnl = (exitNum - entryNum) * qtyNum - feesNum;
    } else {
      pnl = (entryNum - exitNum) * qtyNum - feesNum;
    }

    const pnlPercent = ((pnl / (entryNum * qtyNum)) * 100).toFixed(2);
    return `P&L: $${pnl.toFixed(2)} (${pnlPercent}%)`;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Manual Trade Entry
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            All prices and data are manually entered.
            Trade is saved locally on this device only.
          </Text>

          <TextInput
            label="Symbol *"
            value={symbol}
            onChangeText={setSymbol}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., AAPL, EURUSD, BTC"
            autoCapitalize="characters"
          />

          <Text variant="labelLarge" style={styles.label}>
            Trade Type *
          </Text>
          <SegmentedButtons
            value={tradeType}
            onValueChange={(value) => setTradeType(value as 'Long' | 'Short')}
            buttons={[
              { value: 'Long', label: 'Long' },
              { value: 'Short', label: 'Short' },
            ]}
            style={styles.input}
          />

          <TextInput
            label="Quantity *"
            value={quantity}
            onChangeText={setQuantity}
            mode="outlined"
            style={styles.input}
            placeholder="Number of shares/units"
            keyboardType="decimal-pad"
          />

          <TextInput
            label="Entry Price *"
            value={entryPrice}
            onChangeText={setEntryPrice}
            mode="outlined"
            style={styles.input}
            placeholder="Price at entry"
            keyboardType="decimal-pad"
          />

          <Text variant="labelLarge" style={styles.label}>
            Trade Status *
          </Text>
          <SegmentedButtons
            value={isOpen}
            onValueChange={setIsOpen}
            buttons={[
              { value: 'open', label: 'Open' },
              { value: 'closed', label: 'Closed' },
            ]}
            style={styles.input}
          />

          {isOpen === 'closed' && (
            <>
              <TextInput
                label="Exit Price *"
                value={exitPrice}
                onChangeText={setExitPrice}
                mode="outlined"
                style={styles.input}
                placeholder="Price at exit"
                keyboardType="decimal-pad"
              />
              {exitPrice && quantity && entryPrice && (
                <Card style={styles.pnlCard}>
                  <Card.Content>
                    <Text variant="bodyMedium">{calculatePnL()}</Text>
                  </Card.Content>
                </Card>
              )}
            </>
          )}

          <TextInput
            label="Fees / Commission"
            value={fees}
            onChangeText={setFees}
            mode="outlined"
            style={styles.input}
            placeholder="Total fees"
            keyboardType="decimal-pad"
          />

          <TextInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            style={styles.input}
            placeholder="Trade notes, strategy, reasons..."
            multiline
            numberOfLines={4}
          />

          <Button
            mode="contained"
            onPress={handleSaveTrade}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Save Trade
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.infoTitle}>
            💡 Manual Entry Only
          </Text>
          <Text variant="bodySmall">
            • Enter all prices manually - no automatic fetching{'\n'}
            • Data is saved locally on this device{'\n'}
            • No network connection required{'\n'}
            • Your trades remain completely private
          </Text>
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
    marginBottom: spacing.sm,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: spacing.lg,
    color: '#666',
  },
  label: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.lg,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
  infoCard: {
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: '#FFF3E0',
  },
  infoTitle: {
    marginBottom: spacing.sm,
    fontWeight: 'bold',
  },
  pnlCard: {
    marginTop: spacing.sm,
    backgroundColor: '#E8F5E9',
  },
});

export default TradeEntryScreen;
