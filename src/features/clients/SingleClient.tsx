import { View, Text, StyleSheet, TouchableOpacity,ToastAndroid,Alert } from 'react-native'
import React,{useEffect,useState} from 'react'
import { globalStyles } from '../../styles/global'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';
import { getLocationName, makePhoneCall,breakTextIntoLines } from '../../utils/utilts';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import { useTranslation } from 'react-i18next';
import { deleteClient } from './ClientSlice';
import { useAppDispatch } from '../../app/store';

const SingleClient = ({ navigation, route }: any) => {

    const { client } = route.params;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const phoneNumber = `${client.phone_number}`;
    const [locationName, setLocationName] = useState('');

    useEffect(() => {
      getLocationName(client?.latitude, client?.longitude)
        .then((locationName) => {
          setLocationName(locationName);
          console.log('Location Name:', locationName);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }, [locationName]);


    const deleteFunc = (id) =>
Alert.alert(`${t('screens:deleteClient')}`, `${t('screens:areYouSureDelete')}`, [
  {
    text: `${t('screens:cancel')}`,
    onPress: () => console.log('Cancel client delete'),
    style: 'cancel',
  },
  {
    text: `${t('screens:ok')}`,
    onPress: () => {
        console.log('idddd',id);
      dispatch(deleteClient({clientId:id}))
      .unwrap()
      .then(result => {
        if (result.status) {
          ToastAndroid.show(`${t('screens:deletedSuccessfully')}`, ToastAndroid.SHORT);
          navigation.navigate('Clients', {
            screen: 'Clients',
          });
        } else {
          setDisappearMessage(
            `${t('screens:requestFail')}`,
          );
          console.log('dont navigate');
        }

        console.log('resultsss',result)
      })
      .catch(rejectedValueOrSerializedError => {
        // handle error here
        console.log('error');
        console.log(rejectedValueOrSerializedError);
      });
    },
  },
]);

const stylesGlobal=globalStyles();

    return (
        <View style={stylesGlobal.scrollBg}>
            <View style={stylesGlobal.appView}>
                <View style={styles.itemView}>
                    
            <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'flex-end' }}>        
          
            <TouchableOpacity>
              <Menu>
                <MenuTrigger style={{ backgroundColor: colors.alsoLightGrey }}>
                  <Text style={{ padding: 5, fontWeight: 'bold' }}>{t('screens:resources')}</Text>
                </MenuTrigger>
                <MenuOptions>

                    <MenuOption onSelect={() => {navigation.navigate('Contact People',{
                        clientId:client.id
                    })}} >
                      <Text style={{ color: colors.warningYellow }}>{t('screens:contactPeople')}</Text>
                    </MenuOption>
            
                    <MenuOption onSelect={() => {}} >
                      <Text style={{ color: colors.successGreen }}>{t('screens:tasks')}</Text>
                    </MenuOption>
                
                    <MenuOption onSelect={() => {}} >
                      <Text style={{ color: colors.successGreen }}>{t('screens:checkIns')}</Text>
                    </MenuOption>
                </MenuOptions>
              </Menu>
            </TouchableOpacity>
    
            <TouchableOpacity style={{ marginLeft: '25%', marginRight: '10%' }}>
              <Menu>
                <MenuTrigger style={{ backgroundColor: colors.alsoLightGrey }}>
                  <Text style={{ padding: 5, fontWeight: 'bold' }} >{t('screens:action')}</Text>
                </MenuTrigger>
                
                <MenuOptions>
                  <MenuOption onSelect={() => navigation.navigate('Add Client',{
                    client:client
                  })} >
                    <Text style={{ color: colors.warningYellow }}>{t('screens:edit')}</Text>
                  </MenuOption>
                  <MenuOption  onSelect={() => {deleteFunc(client.id)}} >
                    <Text style={{ color: colors.dangerRed }}>{t('screens:delete')}</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </TouchableOpacity>
        
        </View>
                    <View style={styles.itemIconStyle}>
                        <Icon
                            name='assignment-ind'
                            color={colors.black}
                            size={20}
                        />
                        <Text style={{ color: colors.primary, marginLeft: 10 }}>{client.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.itemIconStyle}
                        onPress={() => makePhoneCall(phoneNumber)}
                    >
                        <Icon
                            name='phone'
                            color={colors.black}
                            size={20}
                        />
                        <Text style={{ paddingVertical: 5, marginLeft: 10 }}> {client.phone_number}</Text>
                    </TouchableOpacity>
                    <View style={styles.itemIconStyle}>
                        <Icon
                            name='email'
                            color={colors.black}
                            size={20}
                        />
                        <Text style={{ paddingVertical: 5, marginLeft: 10 }}> {client.email}</Text>
                    </View>
                    <View style={styles.itemIconStyle}>
                        <Icon
                            name='room'
                            color={colors.black}
                            size={20}
                        />
                        <Text style={{ paddingVertical: 5, marginLeft: 10 }}>{breakTextIntoLines(locationName, 20)}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomView: {
        flexDirection: 'row',
        paddingTop: 10,
        justifyContent: 'flex-end'
    },
    itemIconStyle: {
        flexDirection: 'row'
    },
    itemView: {
        backgroundColor: colors.white,
        height: '80%',
        padding: 10
    }
});

export default SingleClient