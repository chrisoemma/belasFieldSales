import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Alert, Image, Text, View } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import { userLogout } from './../features/auth/userSlice';

import { colors } from '../utils/colors';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';

const DrawerHeader = styled.View`
  height: 150px;
  align-items: flex-start;
  justify-content: center;
  padding-left: 5px;
  margin-bottom:40px;
  background-color:${colors.primary};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius:10px;

`;

const DrawerRow = styled.TouchableOpacity`
  flex-direction: row;
  padding-vertical: 2px;
  align-items: center;
`;

const DrawerIconContainer = styled.View`
  padding: 15px;
  padding-right: 20px;
  width: 75px;
`;

const DrawerRowsContainer = styled.View`
  margin-top: 10px;
 
`;

const CustomDrawerContent = (props: any) => {

  const { t } = useTranslation();

  const { user, loading } = useSelector((state: RootStateOrAny) => state.user);

  React.useEffect(() => {
  }, [user]);

  let  drawerItems = [
 
      {
        name: 'Dashboard',
        icon: 'home',
        language:'dashboard',
        screen: 'Home',
        options: {
          screen: 'BottomHomeTabNavigator',
        },
      },
      {
        name: 'LiveLocation',
        icon: 'map-pin',
        language:'liveLocation',
        screen: 'Live Location',
      },
      {
        name: 'punchInOut',
        icon: 'hand-point-up',
        language:'punchInOut',
        screen: 'punchInOut',
      },
      {
        name: 'Check-Ins/Check-outs',
        icon: 'phone',
        language:'checkIns',
        screen: 'Check-in/out',
      },
      {
        name: 'Live Tracking',
        icon: 'whatsapp',
        language:'liveTracking',
      },
      {
        name: 'Tasks',
        icon: 'assistive-listening-systems',
        language:'tasks',
        screen: 'Tasks',
      },
      {
        name: 'Leads',
        icon: 'newspaper',
        language:'leads',
        screen: 'Leads',
      },
      {
        name: 'Opportunities',
        icon: 'clipboard-check',
        language:'opportunities',
        screen: 'Opportunities',
      },
      {
        name: 'Clients',
        icon: 'id-card',
        language:'clients',
        screen: 'Clients',
      },
  

      {
        name: 'Settings',
        icon: 'cogs',
        language:'settings',
        screen: 'Settings',
        options: {
          screen: 'Settings',
        },
      },
      {
        name: 'Reports',
        icon: 'phone',
        language:'reports',
        screen: 'Support',
        options: {
          screen: 'Suport',
        },
      },
      
    ]
//}
  const dispatch = useDispatch();


  const confirmLogout = () =>
    Alert.alert(`${t('screens:logout')}`, `${t('screens:areYouSureLogout')}`, [
      {
        text: `${t('screens:cancel')}`,
        onPress: () => console.log('Cancel Logout'),
        style: 'cancel',
      },
      {
        text: `${t('screens:ok')}`,
        onPress: () => {
          dispatch(userLogout());
        },
      },
    ]);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader>
        <Image
          source={require('./../../assets/images/logo.png')}
          style={{
            width: '60%',
            height: 60,
          }}
        />

        <View>
          <Text style={{
            marginTop:10,
            color:colors.white,
            fontWeight:'bold'
          }}>
            BELASFS
          </Text>
        </View>
      </DrawerHeader>

      <DrawerRowsContainer>
        {drawerItems.map(item => {
          return (
            <DrawerRow
              onPress={() => {
                props.navigation.navigate(item.screen, item.options);
              }}>
              <DrawerIconContainer>
                <FontAwesome5
                  name={item.icon}
                  color={colors.alsoGrey}
                  size={25}
                />
              </DrawerIconContainer>
              <Text
              >
                
                {t(`navigate:${item.language}`)}
              </Text>
            </DrawerRow>
          );
        })}
        <DrawerRow
          onPress={() => {
            confirmLogout();
          }}>
          <DrawerIconContainer>
            <FontAwesome5
              name="sign-out-alt"
              color={colors.alsoGrey}
              size={25}
            />
          </DrawerIconContainer>
          <Text
        >
            {t('navigate:logout')}
          </Text>
        </DrawerRow>
      </DrawerRowsContainer>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
