/**
 * Profile Screen
 * 
 * Allows users to create and edit their trading profile.
 * All data is stored locally using AsyncStorage - no cloud sync.
 * 
 * Features:
 * - Create new profile (first-time users)
 * - Edit existing profile
 * - Set starting capital and currency
 * - Local storage only - no region or tax fields
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text, HelperText } from 'react-native-paper';
import { saveProfile, loadProfile, Profile } from '../services/localStorage';
import { spacing } from '../theme/spacing';
import { v4 as uuidv4 } from 'uuid';

const ProfileScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [startingCapital, setStartingCapital] = useState('10000');
  const [currency, setCurrency] = useState('USD');
  const [profileExists, setProfileExists] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Load existing profile on mount
  useEffect(() => {
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    try {
      const profile = await loadProfile();
      if (profile) {
        setProfileExists(true);
        setProfileId(profile.id);
        setName(profile.name);
        setEmail(profile.email || '');
        setStartingCapital(profile.startingCapital.toString());
        setCurrency(profile.currency);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const handleSaveProfile = async () => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return;
    }

    const capitalNum = parseFloat(startingCapital);
    if (isNaN(capitalNum) || capitalNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid starting capital');
      return;
    }

    setLoading(true);

    try {
      const profile: Profile = {
        id: profileId || uuidv4(),
        name: name.trim(),
        email: email.trim() || undefined,
        startingCapital: capitalNum,
        currency: currency.toUpperCase(),
        createdAt: profileId ? '' : new Date().toISOString(), // Keep existing createdAt if updating
        updatedAt: new Date().toISOString(),
      };

      // If profile exists and has createdAt, load and preserve it
      if (profileId) {
        const existing = await loadProfile();
        if (existing) {
          profile.createdAt = existing.createdAt;
        }
      }

      await saveProfile(profile);
      
      Alert.alert(
        'Success',
        profileExists ? 'Profile updated successfully!' : 'Profile created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            {profileExists ? 'Edit Profile' : 'Create Your Profile'}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Your profile is stored locally on this device only.
            No data is sent to the cloud.
          </Text>

          <TextInput
            label="Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            placeholder="Enter your name"
            autoCapitalize="words"
          />
          <HelperText type="info">Required</HelperText>

          <TextInput
            label="Email (Optional)"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <HelperText type="info">Optional - for your reference only</HelperText>

          <TextInput
            label="Starting Capital *"
            value={startingCapital}
            onChangeText={setStartingCapital}
            mode="outlined"
            style={styles.input}
            placeholder="10000"
            keyboardType="decimal-pad"
          />
          <HelperText type="info">Your initial trading capital</HelperText>

          <TextInput
            label="Currency *"
            value={currency}
            onChangeText={setCurrency}
            mode="outlined"
            style={styles.input}
            placeholder="USD"
            autoCapitalize="characters"
            maxLength={3}
          />
          <HelperText type="info">
            3-letter currency code (e.g., USD, EUR, GBP)
          </HelperText>

          <Button
            mode="contained"
            onPress={handleSaveProfile}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            {profileExists ? 'Update Profile' : 'Create Profile'}
          </Button>

          {profileExists && (
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.infoTitle}>
            📱 Local Storage Only
          </Text>
          <Text variant="bodySmall">
            • All your data is stored locally on this device{'\n'}
            • No cloud sync or remote backup{'\n'}
            • You can export your data as JSON backup{'\n'}
            • Complete privacy - your data never leaves this device
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
    backgroundColor: '#E3F2FD',
  },
  infoTitle: {
    marginBottom: spacing.sm,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
