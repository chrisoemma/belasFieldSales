import { View, Text, SafeAreaView, TouchableOpacity, ToastAndroid, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../styles/global';
import { colors } from '../../utils/colors';
import { BasicView } from '../../components/BasicView';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useForm, Controller } from 'react-hook-form';
import { TextInputField } from '../../components/TextInputField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import { extractIdAndName, getTime, getdate, transformDataToDropdownOptions } from '../../utils/utilts';
import { useSelector,RootStateOrAny } from 'react-redux';
import { getSalesPeople } from '../SalesPeopleSlice';
import { useAppDispatch } from '../../app/store';
import GooglePlacesInput from '../../components/GooglePlacesInput';
import { createClient, updateClient } from './ClientSlice';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { PLACES_API_KEY } from '../../utils/config';


const AddClient = ({navigation,route}:any) => {

 const [client,setClient]=useState(null);
 const [location, setLocation] = useState({} as any);

 const { loading } = useSelector(
  (state: RootStateOrAny) => state.clients,
);

const {
  control,
  setValue,
  handleSubmit,
  formState: { errors },
} = useForm({
  defaultValues: {
    name: '',
    email: '',
    phone_number:'',
  },
});

  useEffect(() => {
    const existingClient = route.params?.client;
    if (existingClient) {
      setIsEditMode(true);
      setValue('name',existingClient.name)
      setValue('email',existingClient.email)
      setValue('phone_number',existingClient.phone_number)
      setClient(existingClient)
      navigation.setOptions({
        title:t('screens:editClient'),
      });
    }else{
        navigation.setOptions({
            title: t('screens:addClient') ,
          }); 
    }
  }, [route.params]);


  const dispatch = useAppDispatch();

  const {user } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  useEffect(() => {
    dispatch(getSalesPeople({ companyId:user?.company_id,userId: user?.id}));
  }, [])


  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage]=useState('')


  const { t } = useTranslation();


  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const onSubmit = (data) => { 
    data.latitude=location.lat
    data.longitude=location.lng
    data.company_id=user.company_id;
    
    if (isEditMode) {
      dispatch(updateClient({data:data,clientId:client?.id}))
      .unwrap()
      .then(result => {
        if (result.status) {
    
          ToastAndroid.show(`${t('screens:updatedSuccessfully')}`, ToastAndroid.SHORT);
          navigation.navigate('Clients', {
            screen: 'Clients',
          });
        } else {
          setDisappearMessage(
            `${t('screens:requestFail')}`,
          );
          console.log('dont navigate');
        }
      })
      .catch(rejectedValueOrSerializedError => {
        // handle error here
        console.log('error');
        console.log(rejectedValueOrSerializedError);
      });
    } else {
        dispatch(createClient({data:data}))
        .unwrap()
        .then(result => {
          if (result.status) {
      
            ToastAndroid.show(`${t('screens:createdSuccessfully')}`, ToastAndroid.SHORT);
            navigation.navigate('Clients', {
              screen: 'Clients',
            });
          } else {
            setDisappearMessage(
              `${t('screens:requestFail')}`,
            );
            console.log('dont navigate');
          }
        })
        .catch(rejectedValueOrSerializedError => {
          // handle error here
          console.log('error');
          console.log(rejectedValueOrSerializedError);
        });
    }
  };
  
  const stylesGlobal=globalStyles();

  return (
    <ScrollView
      style={stylesGlobal.scrollBg}
    >
      <View style={styles.container}>

       {message ? (<BasicView style={stylesGlobal.centerView}>
          <Text style={stylesGlobal.errorMessage}>{message}</Text>
        </BasicView>) : (<View />)}

        <View>
          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:name')}
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={`${t('auth:enterName')}`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="name"
            />

            {errors.name && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:nameRequired')}
              </Text>
            )}
          </BasicView>
          


          <BasicView>
              <Text
                style={[
                  stylesGlobal.inputFieldTitle,
                  stylesGlobal.marginTop20,
                ]}>
                  {t('auth:phone')}
              </Text>

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                   // placeholder= {t('auth:enterName')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType='numeric'
                  />
                )}
                name="phone_number"
              />
              {errors.phone_number && (
                <Text style={stylesGlobal.errorMessage}>
                  {t('auth:phoneRequired')}
                </Text>
              )}
            </BasicView>
          

          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:email')}
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={`${t('auth:enterEmail')}`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
            />

            {errors.email && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:emailRequired')}
              </Text>
            )}
          </BasicView>

        </View>
        <BasicView style={stylesGlobal.marginTop20}>
        <GooglePlacesAutocomplete
      placeholder='Search for places'
      keepResultsAfterBlur={true}
      fetchDetails = {true}
      defaultValue={`${user.provider?.latitude}, ${user.provider?.longitude}`}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
       setLocation(details?.geometry.location);
     // console.log('dataaaaa',data);
     // console.log('detailsss',details?.geometry);
        
      }}
      query={{
        key: PLACES_API_KEY,
        language: 'en',
        components: 'country:tz',
      }}
    
    />
          </BasicView>

        <BasicView>
          <Button  loading={loading} onPress={handleSubmit(onSubmit)}>
            <ButtonText>  {isEditMode ?`${t('screens:updateClient')}`:`${t('screens:addClient')}`}</ButtonText>
          </Button>
        </BasicView>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  marginDropdown: { marginVertical: 20 },
  container: {
    // flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',

  },
  toggleButton: {
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  activeToggleText: {
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: 20
    // Active text color
  },
  buttonText: {
    color: colors.primary,
    padding: 10,
    marginRight: 5
    // Default text color
  },
  checkBoxContainer: {
    marginVertical: 30
  },
  textStyle: {
    color: colors.black,
    marginBottom: 10,
    fontSize: 17,
  },
  btnChange: {
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 20,
    marginTop: 15,
    width: '35%',
    alignItems: 'center',
  },
  textChange: {
    color: colors.white,
    fontSize: 14
  },

})

export default AddClient