import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../utils/colors';
import { useTranslation } from 'react-i18next';
import SingleClient from '../features/clients/SingleClient';
import ContactList from '../features/contacts/ContactList';

const Tab = createBottomTabNavigator();

const tabNavScreenOptions = ({ route }) => ({
  headerShown: false,
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === 'ClientProfile') {
      iconName = 'user';
      return <Icon name={iconName} size={size} color={color} />;
    } else if (route.name === 'Contacts') {
      iconName = 'contacts';
    }
    return <FontAwesome5 name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: colors.secondary,
  tabBarInactiveTintColor: 'gray',
});

export default function UserClientBottomNavigator({ route }) {
  const { t } = useTranslation();
  const client = route.params?.client;

  return (
    <Tab.Navigator screenOptions={tabNavScreenOptions}>
      <Tab.Screen 
        name="ClientProfile" 
        component={SingleClient} 
        initialParams={{ client }}
        options={{ tabBarLabel: t('screens:profile') }} 
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactList}
        initialParams={{ client }}
        options={{ tabBarLabel: t('screens:contacts') }} 
      />
    </Tab.Navigator>
  );
}
