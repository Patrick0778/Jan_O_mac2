import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {List, Switch, Divider} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../redux/store';
import {updateSettings} from '../redux/slices/settingsSlice';
import {spacing} from '../theme/spacing';
import {exportTradesJson, clearAllLocalData} from '../services/localStorage';
import {generateAndSharePdf} from '../utils/localPdfExport';
import TaxRegionRemovedNotice from '../components/TaxRegionRemovedNotice';

const SettingsScreen = ({navigation}: any) => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await generateAndSharePdf();
      Alert.alert('Success', 'PDF report generated and ready to share');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF report');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJson = async () => {
    try {
      const json = await exportTradesJson();
      // In a real implementation, you would save or share this JSON
      Alert.alert(
        'Export Data',
        'Trade data exported. Use the share functionality to save it.',
        [
          {text: 'OK'},
        ],
      );
      console.log('Exported JSON:', json);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your profile and trade data from this device. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllLocalData();
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
      <TaxRegionRemovedNotice />

      <List.Section>
        <List.Subheader>Profile</List.Subheader>
        <List.Item
          title="Manage Profile"
          description="View and edit your trader profile"
          left={(props) => <List.Icon {...props} icon="account" />}
          onPress={() => navigation.navigate('Profile')}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Data Management (Local Only)</List.Subheader>
        <List.Item
          title="Export PDF Report"
          description="Generate performance report"
          left={(props) => <List.Icon {...props} icon="file-pdf-box" />}
          onPress={handleExportPdf}
          disabled={isExporting}
        />
        <Divider />
        <List.Item
          title="Export JSON Data"
          description="Export all trades as JSON"
          left={(props) => <List.Icon {...props} icon="code-json" />}
          onPress={handleExportJson}
        />
        <Divider />
        <List.Item
          title="Clear All Data"
          description="Delete all local data"
          left={(props) => <List.Icon {...props} icon="delete-forever" />}
          onPress={handleClearData}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Dark Theme"
          right={() => (
            <Switch
              value={settings.theme === 'dark'}
              onValueChange={(value) =>
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
              onValueChange={(value) =>
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
              onValueChange={(value) =>
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
        <List.Subheader>About</List.Subheader>
        <List.Item title="Version" description="1.0.0 (Local-Only)" />
        <List.Item
          title="Documentation"
          description="View local-only architecture guide"
          onPress={() =>
            Alert.alert(
              'Documentation',
              'See docs/LOCAL_ONLY_README.md in the repository for complete documentation on local storage, backups, and data export.',
            )
          }
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
});

export default SettingsScreen;
