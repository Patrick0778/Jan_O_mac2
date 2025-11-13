/**
 * Enhanced Trade Entry Screen
 *
 * Comprehensive trade entry with all fields from the specification:
 * - Asset class selection
 * - Stop loss and take profit
 * - Strategy selection
 * - Trade journal notes (pre-trade analysis, emotional state, market conditions)
 * - Tags
 * - Rating
 * - Screenshots (placeholder for future implementation)
 */

import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  SegmentedButtons,
  Chip,
  Divider,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {addTrade as addTradeRedux} from '../redux/slices/tradesSlice';
import {RootState} from '../redux/store';
import {Trade, AssetClass, TradeDirection} from '../models/Trade';
import {spacing} from '../theme/spacing';
import {colors} from '../theme/colors';
import {v4 as uuidv4} from 'uuid';
import {
  calculatePnL,
  calculatePnLPercentage,
  calculateRiskRewardRatio,
} from '../services/calculations';

const EnhancedTradeEntryScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const strategies = useSelector((state: RootState) => state.strategies.items);
  const editTrade = route?.params?.trade;

  // Basic Trade Fields
  const [symbol, setSymbol] = useState(editTrade?.symbol || '');
  const [assetClass, setAssetClass] = useState<AssetClass>(
    editTrade?.assetClass || 'Stocks',
  );
  const [direction, setDirection] = useState<TradeDirection>(
    editTrade?.direction || 'Long',
  );
  const [quantity, setQuantity] = useState(
    editTrade?.quantity?.toString() || '',
  );
  const [entryPrice, setEntryPrice] = useState(
    editTrade?.entryPrice?.toString() || '',
  );
  const [exitPrice, setExitPrice] = useState(
    editTrade?.exitPrice?.toString() || '',
  );
  const [commission, setCommission] = useState(
    editTrade?.commission?.toString() || '0',
  );

  // Risk Management
  const [stopLoss, setStopLoss] = useState(
    editTrade?.stopLoss?.toString() || '',
  );
  const [takeProfit, setTakeProfit] = useState(
    editTrade?.takeProfit?.toString() || '',
  );

  // Strategy & Status
  const [selectedStrategyId, setSelectedStrategyId] = useState(
    editTrade?.strategyId || '',
  );
  const [isOpen, setIsOpen] = useState<string>(
    editTrade?.exitPrice ? 'closed' : 'open',
  );

  // Journal Notes
  const [preTradeAnalysis, setPreTradeAnalysis] = useState(
    editTrade?.notes?.preTradeAnalysis || '',
  );
  const [emotionalState, setEmotionalState] = useState(
    editTrade?.notes?.emotionalState || '',
  );
  const [marketConditions, setMarketConditions] = useState(
    editTrade?.notes?.marketConditions || '',
  );
  const [postTradeReview, setPostTradeReview] = useState(
    editTrade?.notes?.postTradeReview || '',
  );

  // Tags
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(editTrade?.tags || []);

  // Rating
  const [rating, setRating] = useState<number | undefined>(editTrade?.rating);

  const [loading, setLoading] = useState(false);

  const assetClassOptions: AssetClass[] = [
    'Stocks',
    'Forex',
    'Crypto',
    'Options',
    'Futures',
  ];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSaveTrade = async () => {
    // Validation
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

    const commissionNum = parseFloat(commission || '0');
    if (isNaN(commissionNum) || commissionNum < 0) {
      Alert.alert('Validation Error', 'Please enter a valid commission amount');
      return;
    }

    let exitNum: number | undefined;
    if (isOpen === 'closed') {
      exitNum = parseFloat(exitPrice);
      if (isNaN(exitNum) || exitNum <= 0) {
        Alert.alert(
          'Validation Error',
          'Please enter a valid exit price for closed trade',
        );
        return;
      }
    }

    setLoading(true);

    try {
      const now = new Date();
      const trade: Trade = {
        id: editTrade?.id || uuidv4(),
        symbol: symbol.toUpperCase().trim(),
        assetClass,
        direction,
        entryDate: editTrade?.entryDate || now,
        entryPrice: entryNum,
        exitDate: isOpen === 'closed' ? now : undefined,
        exitPrice: exitNum,
        quantity: qtyNum,
        commission: commissionNum,
        stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
        takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
        strategyId: selectedStrategyId || undefined,
        notes: {
          preTradeAnalysis: preTradeAnalysis.trim() || undefined,
          postTradeReview: postTradeReview.trim() || undefined,
          emotionalState: emotionalState.trim() || undefined,
          marketConditions: marketConditions.trim() || undefined,
        },
        screenshots: editTrade?.screenshots || [],
        tags,
        rating,
        createdAt: editTrade?.createdAt || now,
        updatedAt: now,
      };

      dispatch(addTradeRedux(trade));

      Alert.alert(
        'Success',
        `Trade ${editTrade ? 'updated' : 'added'} successfully!`,
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error('Error saving trade:', error);
      Alert.alert('Error', 'Failed to save trade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculatePreviewPnL = (): string => {
    if (isOpen === 'open') return 'Open position - no P&L yet';

    const qtyNum = parseFloat(quantity);
    const entryNum = parseFloat(entryPrice);
    const exitNum = parseFloat(exitPrice);
    const commissionNum = parseFloat(commission || '0');

    if (isNaN(qtyNum) || isNaN(entryNum) || isNaN(exitNum)) {
      return 'Enter all values to calculate';
    }

    const tempTrade: Trade = {
      id: '',
      symbol,
      assetClass,
      direction,
      entryDate: new Date(),
      entryPrice: entryNum,
      exitPrice: exitNum,
      quantity: qtyNum,
      commission: commissionNum,
      notes: {},
      screenshots: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pnl = calculatePnL(tempTrade);
    const pnlPercent = calculatePnLPercentage(tempTrade);

    return `P&L: $${pnl.toFixed(2)} (${
      pnlPercent >= 0 ? '+' : ''
    }${pnlPercent.toFixed(2)}%)`;
  };

  const calculateRRRatio = (): string => {
    const slNum = parseFloat(stopLoss);
    const tpNum = parseFloat(takeProfit);
    const entryNum = parseFloat(entryPrice);

    if (isNaN(slNum) || isNaN(tpNum) || isNaN(entryNum)) {
      return 'Enter SL and TP to calculate';
    }

    const tempTrade: Trade = {
      id: '',
      symbol,
      assetClass,
      direction,
      entryDate: new Date(),
      entryPrice: entryNum,
      quantity: 1,
      commission: 0,
      stopLoss: slNum,
      takeProfit: tpNum,
      notes: {},
      screenshots: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ratio = calculateRiskRewardRatio(tempTrade);
    return ratio !== undefined ? `R:R = 1:${ratio.toFixed(2)}` : 'Invalid R:R';
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {editTrade ? 'Edit Trade' : 'Add New Trade'}
          </Text>

          {/* Basic Trade Details */}
          <Text variant="titleMedium" style={styles.subsectionTitle}>
            Trade Details
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
            Asset Class *
          </Text>
          <View style={styles.chipContainer}>
            {assetClassOptions.map(asset => (
              <Chip
                key={asset}
                selected={assetClass === asset}
                onPress={() => setAssetClass(asset)}
                style={styles.chip}>
                {asset}
              </Chip>
            ))}
          </View>

          <Text variant="labelLarge" style={styles.label}>
            Direction *
          </Text>
          <SegmentedButtons
            value={direction}
            onValueChange={value => setDirection(value as TradeDirection)}
            buttons={[
              {value: 'Long', label: 'Long'},
              {value: 'Short', label: 'Short'},
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

          <TextInput
            label="Commission/Fees"
            value={commission}
            onChangeText={setCommission}
            mode="outlined"
            style={styles.input}
            placeholder="Total fees"
            keyboardType="decimal-pad"
          />

          <Divider style={styles.divider} />

          {/* Risk Management */}
          <Text variant="titleMedium" style={styles.subsectionTitle}>
            Risk Management
          </Text>

          <TextInput
            label="Stop Loss"
            value={stopLoss}
            onChangeText={setStopLoss}
            mode="outlined"
            style={styles.input}
            placeholder="Stop loss price"
            keyboardType="decimal-pad"
          />

          <TextInput
            label="Take Profit"
            value={takeProfit}
            onChangeText={setTakeProfit}
            mode="outlined"
            style={styles.input}
            placeholder="Take profit price"
            keyboardType="decimal-pad"
          />

          {stopLoss && takeProfit && entryPrice && (
            <Card style={styles.infoCard}>
              <Card.Content>
                <Text>{calculateRRRatio()}</Text>
              </Card.Content>
            </Card>
          )}

          <Divider style={styles.divider} />

          {/* Exit Details */}
          <Text variant="titleMedium" style={styles.subsectionTitle}>
            Trade Status
          </Text>

          <SegmentedButtons
            value={isOpen}
            onValueChange={setIsOpen}
            buttons={[
              {value: 'open', label: 'Open'},
              {value: 'closed', label: 'Closed'},
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
              <Card style={styles.pnlCard}>
                <Card.Content>
                  <Text variant="bodyMedium">{calculatePreviewPnL()}</Text>
                </Card.Content>
              </Card>
            </>
          )}

          <Divider style={styles.divider} />

          {/* Strategy Selection */}
          {strategies.length > 0 && (
            <>
              <Text variant="titleMedium" style={styles.subsectionTitle}>
                Strategy
              </Text>
              <View style={styles.chipContainer}>
                <Chip
                  selected={!selectedStrategyId}
                  onPress={() => setSelectedStrategyId('')}
                  style={styles.chip}>
                  None
                </Chip>
                {strategies.map(strategy => (
                  <Chip
                    key={strategy.id}
                    selected={selectedStrategyId === strategy.id}
                    onPress={() => setSelectedStrategyId(strategy.id)}
                    style={styles.chip}>
                    {strategy.name}
                  </Chip>
                ))}
              </View>
              <Divider style={styles.divider} />
            </>
          )}

          {/* Journal Notes */}
          <Text variant="titleMedium" style={styles.subsectionTitle}>
            Trade Journal
          </Text>

          <TextInput
            label="Pre-Trade Analysis"
            value={preTradeAnalysis}
            onChangeText={setPreTradeAnalysis}
            mode="outlined"
            style={styles.input}
            placeholder="Why are you entering this trade?"
            multiline
            numberOfLines={3}
          />

          <TextInput
            label="Emotional State"
            value={emotionalState}
            onChangeText={setEmotionalState}
            mode="outlined"
            style={styles.input}
            placeholder="How are you feeling about this trade?"
            multiline
            numberOfLines={2}
          />

          <TextInput
            label="Market Conditions"
            value={marketConditions}
            onChangeText={setMarketConditions}
            mode="outlined"
            style={styles.input}
            placeholder="Current market conditions..."
            multiline
            numberOfLines={2}
          />

          {isOpen === 'closed' && (
            <TextInput
              label="Post-Trade Review"
              value={postTradeReview}
              onChangeText={setPostTradeReview}
              mode="outlined"
              style={styles.input}
              placeholder="What did you learn from this trade?"
              multiline
              numberOfLines={3}
            />
          )}

          <Divider style={styles.divider} />

          {/* Tags */}
          <Text variant="titleMedium" style={styles.subsectionTitle}>
            Tags
          </Text>

          <View style={styles.tagInputContainer}>
            <TextInput
              label="Add Tag"
              value={tagInput}
              onChangeText={setTagInput}
              mode="outlined"
              style={styles.tagInput}
              placeholder="e.g., breakout, earnings"
            />
            <Button
              mode="contained"
              onPress={addTag}
              style={styles.addTagButton}>
              Add
            </Button>
          </View>

          {tags.length > 0 && (
            <View style={styles.chipContainer}>
              {tags.map(tag => (
                <Chip
                  key={tag}
                  onClose={() => removeTag(tag)}
                  style={styles.chip}>
                  {tag}
                </Chip>
              ))}
            </View>
          )}

          <Divider style={styles.divider} />

          {/* Rating */}
          <Text variant="titleMedium" style={styles.subsectionTitle}>
            Execution Rating
          </Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <Button
                key={star}
                mode={rating === star ? 'contained' : 'outlined'}
                onPress={() => setRating(star)}
                style={styles.ratingButton}>
                {star}★
              </Button>
            ))}
            {rating && (
              <Button mode="text" onPress={() => setRating(undefined)}>
                Clear
              </Button>
            )}
          </View>

          {/* Action Buttons */}
          <Button
            mode="contained"
            onPress={handleSaveTrade}
            loading={loading}
            disabled={loading}
            style={styles.button}>
            {editTrade ? 'Update Trade' : 'Save Trade'}
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}>
            Cancel
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  card: {
    margin: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  subsectionTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  label: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    marginTop: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  chip: {
    margin: spacing.xs,
  },
  divider: {
    marginVertical: spacing.lg,
  },
  infoCard: {
    marginTop: spacing.sm,
    backgroundColor: '#E3F2FD',
  },
  pnlCard: {
    marginTop: spacing.sm,
    backgroundColor: '#E8F5E9',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
  },
  addTagButton: {
    marginLeft: spacing.sm,
    marginTop: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  ratingButton: {
    marginRight: spacing.xs,
  },
  button: {
    marginTop: spacing.xl,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
});

export default EnhancedTradeEntryScreen;
