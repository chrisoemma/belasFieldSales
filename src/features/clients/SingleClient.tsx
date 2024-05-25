import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Alert, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../styles/global'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/colors';
import { getLocationName, makePhoneCall } from '../../utils/utilts';
import { useTranslation } from 'react-i18next';
import { deleteClient } from './ClientSlice';
import { useAppDispatch } from '../../app/store';
import { useSelector, RootStateOrAny } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import { BasicView } from '../../components/BasicView';

const SingleClient = ({ navigation, route }: any) => {

  const { client } = route?.params;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const phoneNumber = `${client?.phone_number}`;
  const [locationName, setLocationName] = useState('');
  const [message, setMessage] = useState('')

  useEffect(() => {
    getLocationName(client?.latitude, client?.longitude)
      .then((locationName) => {
        setLocationName(locationName);

      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [locationName]);

  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };


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
  
          dispatch(deleteClient({ clientId: id }))
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

              console.log('resultsss', result)
            })
            .catch(rejectedValueOrSerializedError => {
              // handle error here
              console.log('error');
              console.log(rejectedValueOrSerializedError);
            });
        },
      },
    ]);

  const stylesGlobal = globalStyles();
  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );



  return (

    <ScrollView style={stylesGlobal.scrollBg}>
      <View style={stylesGlobal.appView}>

        {message ? (<BasicView style={stylesGlobal.centerView}>
          <Text style={stylesGlobal.errorMessage}>{message}</Text>
        </BasicView>) : (<View />)}

        <View
          style={styles.bgColor}
        >
        </View>
        <View style={[stylesGlobal.circle, { backgroundColor: colors.white, marginTop: 15, position: 'absolute', left: 30, top: 40 }]}>
          <Image
            source={require('../../../assets/images/profile.png')}
            style={{
              resizeMode: 'cover',
              width: 100,
              height: 100,
              borderRadius: 100,
              alignSelf: 'center',
            }}

          />
        </View>
        <View style={styles.clientContent}>
          <Text style={{
            color: isDarkMode ? colors.white : colors.black,
            marginLeft: 10, fontWeight: 'bold', fontSize: 18
          }}>{client.name}</Text>

          <Text style={{
            marginTop: 20, fontSize: 16,
            color: isDarkMode ? colors.white : colors.alsoGrey,
          }}>{t('screens:email')}: {client?.email}</Text>
          <TouchableOpacity style={styles.itemIconStyle}
            onPress={() => makePhoneCall(phoneNumber)}
          >
            <Text style={{
              marginTop: 5, fontSize: 16,

              color: isDarkMode ? colors.white : colors.alsoGrey,
            }}>{t('screens:phone')}:</Text>
            <Text style={{
              paddingVertical: 5, marginLeft: 10, fontSize: 16,
              color: isDarkMode ? colors.white : colors.alsoGrey,
              textDecorationLine: 'underline'
            }}> {client?.phone_number}</Text>
          </TouchableOpacity>
          <View style={styles.buttonDiv}>
            <TouchableOpacity
              style={{ flexDirection: 'row', backgroundColor: colors.primary, padding: 10, borderRadius: 10 }}
            >
              <Icon
                name='chat'
                color={colors.white}
                size={25}
              />
              <Text style={{ color: colors.white, marginLeft: 5 }}>{t('screens:sendMessage')}</Text>

            </TouchableOpacity>
            <TouchableOpacity style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDarkMode ? colors.white : colors.alsoGrey,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center'
            }}
              onPress={() => navigation.navigate('Add Client', {
                client: client
              })}
            >
              <Icon
                name='edit'
                color={isDarkMode ? colors.white : colors.alsoGrey}
                size={25}
              />
            </TouchableOpacity>

            <TouchableOpacity style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDarkMode ? colors.white : colors.alsoGrey,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center'
            }}
              onPress={() => { deleteFunc(client?.id) }}
            >
              <Icon
                name='delete'
                color={colors.dangerRed}
                size={25}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <View style={styles.divNotes}>
            {client?.latitude && client?.longitude ? (
              <>
                <Text style={[styles.addressText, { color: isDarkMode ? colors.white : colors.black, fontSize: 18 }]}>
                  {t('screens:address')}
                </Text>
                <View style={styles.locationData}>
                  <Text style={[styles.locationText, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>
                    Kijitonyama Sinza, Tanzania
                  </Text>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: parseFloat(client?.latitude),
                      longitude: parseFloat(client?.longitude),
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{ latitude: parseFloat(client.latitude), longitude: parseFloat(client.longitude) }}
                      title="Client Location"
                    />
                  </MapView>
                </View>
              </>
            ) : (
              <View>
                <Text style={{ color: isDarkMode ? colors.white : colors.alsoGrey }}>{t('screens:noLocationFound')}</Text>
              </View>
            )}
          </View>

        </View>
      </View>
    </ScrollView>
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
  },
  bgColor: {
    height: 120,
    width: '100%',
    backgroundColor: colors.primary
  },
  clientContent: {
    marginBottom: 20,
    marginTop: 50,

  },
  buttonDiv: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  divider: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: colors.alsoGrey
  },
  divNotes: {
    marginVertical: 10,
  },
  locationData: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2
  },
  map: {
    height: 300,
    marginTop: 10,
    borderRadius: 10
  },

});

export default SingleClient