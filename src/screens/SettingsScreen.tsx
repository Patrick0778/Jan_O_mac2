import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {List, Switch, Divider} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../redux/store';
import {updateSettings} from '../redux/slices/settingsSlice';
import {spacing} from '../theme/spacing';

const SettingsScreen = () => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

  return (
    <ScrollView style={styles.container}>
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
        <List.Item
          title="Currency"
          description={settings.currency}
        />
        <Divider />
        <List.Item
          title="Default Commission"
          description={`$${settings.defaultCommission}`}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item
          title="Version"
          description="1.0.0"
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
