import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/global';
import CustomDrawerContent from './CustomDrawerContent';
import Home from '../features/home/Home';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import CheckBottomNav from './CheckBottomNav';



function CustomHeaderToggle() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(DrawerActions.toggleDrawer());
      }}
    >
      <Icon
        name="bars-staggered"
        size={24} color={colors.white}
        style={{ marginLeft: 10 }}
      />
    </TouchableOpacity>
  );
}

const drawerNavOptions: any = {
  

  headerTitle: () => (
    <Image
      source={require('./../../assets/images/logo.png')}
      style={globalStyles().horizontalLogo}
    />
  ),
  headerLeft: () => <CustomHeaderToggle />,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: colors.primary,
  },
  drawerStyle: {
    backgroundColor:colors.whiteBackground,
    width:'60%',
  },
};

const stackNavOptions: any = {

  headerShown: false,
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



function DrawerNavigator() {

  return (

    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={drawerNavOptions}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Check-in/out" component={CheckBottomNav} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
