import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {TextInput, Button, Card, Text, ActivityIndicator} from 'react-native-paper';
import {saveProfile, loadProfile, Profile} from '../services/localStorage';
import {spacing} from '../theme/spacing';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profile = await loadProfile();
      if (profile) {
        setName(profile.name);
        setEmail(profile.email || '');
        setNotes(profile.notes || '');
        setProfileId(profile.id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }

    setSaving(true);
    try {
      const savedProfile = await saveProfile({
        name: name.trim(),
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setProfileId(savedProfile.id);
      Alert.alert('Success', 'Profile saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.title}>
            Local Profile
          </Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            Your profile is stored only on this device
          </Text>

          <TextInput
            label="Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            disabled={saving}
          />

          <TextInput
            label="Email (optional)"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            disabled={saving}
          />

          <TextInput
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            disabled={saving}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            disabled={!name.trim() || saving}
            loading={saving}
            style={styles.button}>
            {profileId ? 'Update Profile' : 'Create Profile'}
          </Button>

          {profileId && (
            <Text variant="bodySmall" style={styles.info}>
              Profile ID: {profileId.slice(0, 8)}...
            </Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
  info: {
    marginTop: spacing.md,
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default ProfileScreen;
