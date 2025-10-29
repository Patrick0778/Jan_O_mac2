import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import TradeListScreen from '../screens/TradeListScreen';
import TradeDetailScreen from '../screens/TradeDetailScreen';
import AddTradeScreen from '../screens/AddTradeScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TradesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TradeList" 
        component={TradeListScreen}
        options={{title: 'Trades'}}
      />
      <Stack.Screen 
        name="TradeDetail" 
        component={TradeDetailScreen}
        options={{title: 'Trade Details'}}
      />
      <Stack.Screen 
        name="AddTrade" 
        component={AddTradeScreen}
        options={{title: 'Add Trade'}}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = 'home';
          
          switch (route.name) {
            case 'Dashboard':
              iconName = 'view-dashboard';
              break;
            case 'Trades':
              iconName = 'chart-line';
              break;
            case 'Analytics':
              iconName = 'chart-bar';
              break;
            case 'Calendar':
              iconName = 'calendar';
              break;
            case 'Settings':
              iconName = 'cog';
              break;
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Trades" component={TradesStack} options={{headerShown: false}} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
