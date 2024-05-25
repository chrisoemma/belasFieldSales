import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../features/home/Home';
import { colors } from '../utils/colors';
import { useTranslation } from 'react-i18next';
import Account from '../features/account/Account';
import ActiveCheckIns from '../features/checkInsOut/ActiveCheckIns';
import checkOuts from '../features/checkInsOut/CheckOuts';



const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
};

const Stack = createNativeStackNavigator();


const tabNavScreenOptions = ({ route }: any) => ({
  headerShown: false,
  tabBarIcon: ({ focused, color, size }: any) => {
    let iconName;

    if (route.name === 'Active Check-Ins') {
      iconName = 'target';
      return <Icon name={iconName as string} size={size} color={color} />;
    } else if (route.name === 'Check-outs') {
      iconName = 'rotate-3d-variant';
    }
    // You can return any component that you like here!
    return <FontAwesome5 name={iconName as string} size={size} color={color} />;
  },
  tabBarActiveTintColor: colors.secondary,
  tabBarInactiveTintColor: 'gray',
});

export default function CheckBottomNav() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator screenOptions={tabNavScreenOptions}>
      <Tab.Screen name="Active Check-Ins" 
      component={ActiveCheckIns}
      options={{ tabBarLabel: t('navigate:checkIn') }}
       />
      <Tab.Screen 
      name="Check-outs" 
      component={checkOuts}
      options={{ tabBarLabel: t('navigate:past') }}
      />
    
    </Tab.Navigator>
  );
}
