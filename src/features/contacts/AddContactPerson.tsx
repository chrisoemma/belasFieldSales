import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ToastAndroid, ScrollView, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/global';
import { colors } from '../../utils/colors';
import { BasicView } from '../../components/BasicView';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useForm, Controller } from 'react-hook-form';
import { TextInputField } from '../../components/TextInputField';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { transformDataToDropdownOptions } from '../../utils/utilts';
import { getPositions } from '../IndustryPositionSlice';
import { createContactPerson, updateContactPerson } from './ContactPeopleSlice';

const AddContactPerson = ({ navigation, route }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [contactPerson, setContactPerson] = useState(null);
  const [message, setMessage] = useState('');
  const [positionsOpen, setPositionsOpen] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState([]);
 
  
  const { t } = useTranslation();
  const dispatch = useAppDispatch();


  const { user } = useSelector(
    (state: RootStateOrAny) => state.user
  );

  const { loading, contactPeople } = useSelector((state) => state.contactPeople);

  const { positions } = useSelector(
    (state: RootStateOrAny) => state.industriesPositions
  );

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
    },
  });

  useEffect(() => {
    dispatch(getPositions());
  }, []);


  const { client } = route?.params;

  useEffect(() => {
    const existingContactPerson = route.params?.contactPerson;
    if (existingContactPerson) {
      setIsEditMode(true);
      setValue('first_name', existingContactPerson.fist_name);
      setValue('last_name', existingContactPerson.last_name);
      setValue('phone_number', existingContactPerson.phone_number);
      setValue('email', existingContactPerson.email);
      if(existingContactPerson?.positions){
      
        setSelectedPositions(existingContactPerson.positions.map(pos => pos.id.toString()))
      }else{
        setSelectedPositions([]);
      }
 
      setContactPerson(existingContactPerson);
      navigation.setOptions({
        title: t('screens:editContactPerson'),
      });
    } else {
      navigation.setOptions({
        title: t('screens:addContactPerson'),
      });
    }
    
    return () => {
      setIsEditMode(false);
      setContactPerson(null);
      setSelectedPositions([]);
    };
  }, [route.params]);

  const setDisappearMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const onSubmit = (data) => {
    data.positions = selectedPositions;

    if (isEditMode) {
      dispatch(updateContactPerson({ data, contactPersonId: contactPerson?.id,clientId: contactPerson?.client_id}))
        .unwrap()
        .then(result => {
          if (result.status) {
            ToastAndroid.show(`${t('screens:updatedSuccessfully')}`, ToastAndroid.SHORT);
            navigation.navigate('Contacts');
          } else {
            setDisappearMessage(`${t('screens:requestFail')}`);
          }
        })
        .catch(error => {
          setDisappearMessage(`${t('screens:requestFail')}`);
        });
    } else {
      dispatch(createContactPerson({ data, clientId: client?.id }))
        .unwrap()
        .then(result => {
          if (result.status) {
            ToastAndroid.show(`${t('screens:createdSuccessfully')}`, ToastAndroid.SHORT);
            navigation.navigate('Contacts');
          } else {
            setDisappearMessage(`${t('screens:requestFail')}`);
          }
        })
        .catch(error => {
          setDisappearMessage(`${t('screens:requestFail')}`);
        });
    }

  };

  const stylesGlobal = globalStyles();

  return (
    <ScrollView style={stylesGlobal.scrollBg}>
      <View style={styles.container}>
        <BasicView style={stylesGlobal.centerView}>
          <Text style={stylesGlobal.errorMessage}>{message}</Text>
        </BasicView>

        <BasicView>
          <Text style={[stylesGlobal.inputFieldTitle, stylesGlobal.marginTop20]}>
            {t('auth:firstName')}
          </Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputField
                placeholder={`${t('auth:enterFirstName')}`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="first_name"
          />
          {errors.first_name && (
            <Text style={stylesGlobal.errorMessage}>
              {t('auth:firstNameRequired')}
            </Text>
          )}
        </BasicView>

        <BasicView>
          <Text style={[stylesGlobal.inputFieldTitle, stylesGlobal.marginTop20]}>
            {t('auth:lastName')}
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputField
                placeholder={`${t('auth:enterLastName')}`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="last_name"
          />
  
        </BasicView>

        <BasicView>
          <Text style={[stylesGlobal.inputFieldTitle, stylesGlobal.marginTop20]}>
            {t('auth:phone')}
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputField
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
          <Text style={[stylesGlobal.inputFieldTitle, stylesGlobal.marginTop20]}>
            {t('auth:email')}
          </Text>
          <Controller
            control={control}
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
        </BasicView>

        <BasicView>
          <Text style={[stylesGlobal.inputFieldTitle, stylesGlobal.marginTop20]}>
            {t('auth:positions')}
          </Text>
          <DropDownPicker
            open={positionsOpen}
            listMode="SCROLLVIEW"
            multiple={true}
            value={selectedPositions}
            items={transformDataToDropdownOptions(positions)}
            setOpen={setPositionsOpen}
            setValue={setSelectedPositions}
            placeholder={t('screens:selectPositions')}
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdown}
          />
        </BasicView>

        <BasicView>
          <Button loading={loading} onPress={handleSubmit(onSubmit)}>
            <ButtonText>{isEditMode ? `${t('screens:updateContactPerson')}` : `${t('screens:addContactPerson')}`}</ButtonText>
          </Button>
        </BasicView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  marginDropdown: { marginVertical: 20 },
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dropdownContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
  },
  dropdown: {
    backgroundColor: colors.white,
  },
});

export default AddContactPerson;
