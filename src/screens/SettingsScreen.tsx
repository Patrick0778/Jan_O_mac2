import React from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {List, Switch, Divider, Button} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../redux/store';
import {updateSettings} from '../redux/slices/settingsSlice';
import {spacing} from '../theme/spacing';
import {
  clearAllLocalData,
  exportTradesJson,
  getStorageStats,
} from '../services/localStorage';
import TaxRegionRemovedNotice from '../components/TaxRegionRemovedNotice';

const SettingsScreen = ({navigation}: any) => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const [storageStats, setStorageStats] = React.useState({
    profileExists: false,
    tradeCount: 0,
  });

  React.useEffect(() => {
    loadStorageStats();
  }, []);

  const loadStorageStats = async () => {
    const stats = await getStorageStats();
    setStorageStats(stats);
  };

  const handleExportData = async () => {
    try {
      const jsonData = await exportTradesJson();
      // In a real app, you'd use react-native-fs to save this file
      // and react-native-share to share it
      Alert.alert(
        'Export Ready',
        'JSON export data is ready. In production, this would open a share dialog.',
        [
          {text: 'OK'},
          {
            text: 'Copy to Clipboard',
            onPress: () => {
              // In production, use Clipboard API
              console.log('Export data:', jsonData);
              Alert.alert(
                'Success',
                'Data copied to logs (in production, would copy to clipboard)',
              );
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all local data? This cannot be undone!',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllLocalData();
              await loadStorageStats();
              Alert.alert('Success', 'All local data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Profile</List.Subheader>
        <List.Item
          title="Manage Profile"
          description={
            storageStats.profileExists ? 'Profile exists' : 'No profile created'
          }
          left={props => <List.Icon {...props} icon="account" />}
          onPress={() => navigation.navigate('Profile')}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Dark Theme"
          right={() => (
            <Switch
              value={settings.theme === 'dark'}
              onValueChange={value =>
                dispatch(updateSettings({theme: value ? 'dark' : 'light'}))
              }
            />
          )}
        />
        <Divider />
        <List.Item
          title="Notifications"
          right={() => (
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={value =>
                dispatch(updateSettings({notificationsEnabled: value}))
              }
            />
          )}
        />
        <Divider />
        <List.Item
          title="Biometric Authentication"
          right={() => (
            <Switch
              value={settings.biometricEnabled}
              onValueChange={value =>
                dispatch(updateSettings({biometricEnabled: value}))
              }
            />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Starting Capital"
          description={`$${settings.startingCapital.toLocaleString()}`}
        />
        <Divider />
        <List.Item title="Currency" description={settings.currency} />
        <Divider />
        <List.Item
          title="Default Commission"
          description={`$${settings.defaultCommission}`}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Data Management (Local Storage)</List.Subheader>
        <List.Item
          title="Local Storage Status"
          description={`${storageStats.tradeCount} trades stored locally`}
          left={props => <List.Icon {...props} icon="database" />}
        />
        <Divider />
        <List.Item
          title="Export Data (JSON)"
          description="Export all data as JSON backup"
          left={props => <List.Icon {...props} icon="export" />}
          onPress={handleExportData}
        />
        <Divider />
        <List.Item
          title="Clear All Data"
          description="Delete all local data"
          left={props => <List.Icon {...props} icon="delete" />}
          onPress={handleClearData}
        />
      </List.Section>

      <TaxRegionRemovedNotice variant="compact" style={styles.notice} />

      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item title="Version" description="1.0.0 (Local-Only)" />
        <List.Item
          title="Data Storage"
          description="All data stored locally on this device"
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  notice: {
    margin: spacing.md,
  },
});

export default SettingsScreen;
