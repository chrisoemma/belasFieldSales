import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { userLogin } from './userSlice';
import { globalStyles } from '../../styles/global';
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility';
import PhoneInput from 'react-native-phone-number-input';
import { colors } from '../../utils/colors';
import { Container } from '../../components/Container';
import { BasicView } from '../../components/BasicView';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ route, navigation }: any) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { user, loading, status } = useSelector(
    (state: RootStateOrAny) => state.user,
  );
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const phoneInput = useRef<PhoneInput>(null);

  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    if (status !== null) {
      setMessage(status);
    }
  }, [status]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone_number: '',
      password: '',
    },
  });
  const onSubmit = (data: any) => {
    console.log(data);
    // navigation.navigate('Register');
    dispatch(userLogin(data));
  };

  const stylesGlobal=globalStyles();

  return (
    <SafeAreaView style={stylesGlobal.scrollBg}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" 
        showsVerticalScrollIndicator={false}
      >
       
          <View style={stylesGlobal.centerView}>
            <Image
              source={require('./../../../assets/images/logo.png')}
              style={[stylesGlobal.verticalLogo,{height:100,marginTop:20}]}
            />
          </View>
          
          <View>
            <BasicView style={stylesGlobal.centerView}>
              <Text style={stylesGlobal.errorMessage}>{message}</Text>
            </BasicView>

            <BasicView>
              <Text
                style={[
                  stylesGlobal.inputFieldTitle,
                  stylesGlobal.marginTop10,
                ]}>
                 {t('auth:phone')}
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PhoneInput
                    ref={phoneInput}
                    placeholder="672 137 313"
                    defaultValue={value}
                    defaultCode="TZ"
                    countryPickerProps={{
                      countryCodes: ['TZ', 'KE', 'UG', 'RW', 'BI'],
                    }}
                    layout="first"
                    // onChangeText={}
                    onChangeFormattedText={text => {
                      onChange(text);
                    }}
                    withDarkTheme
                    withShadow
                    autoFocus
                    containerStyle={stylesGlobal.phoneInputContainer}
                    textContainerStyle={stylesGlobal.phoneInputTextContainer}
                    textInputStyle={stylesGlobal.phoneInputField}
                    textInputProps={{
                      maxLength: 9,
                    }}
                  />
                )}
                name="phone_number"
              />
              {errors.phone && (
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
              {t('auth:password')}
              </Text>

              <View style={stylesGlobal.passwordInputContainer}>
                <Controller
                  control={control}
                  rules={{
              
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={stylesGlobal.passwordInputField}
                      secureTextEntry={passwordVisibility}
                      placeholder={t('auth:enterPassword')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="password"
                />
                <TouchableOpacity onPress={handlePasswordVisibility}>
                  <Icon name={rightIcon} size={20} color={colors.grey} />
                </TouchableOpacity>
              </View>
              {errors.phone_number && (
                <Text style={stylesGlobal.errorMessage}>
                  {t('auth:passwordRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ForgotPassword');
                }}
                style={[
                  stylesGlobal.touchableOpacityPlain,
                  stylesGlobal.marginTop10,
                ]}>
                <Text style={stylesGlobal.touchablePlainTextSecondary}>
                 {t('auth:forgotPassword')}
                </Text>
              </TouchableOpacity>

              <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>{t('auth:login')}</ButtonText>
              </Button>
            </BasicView>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}
              style={[stylesGlobal.marginTop20, stylesGlobal.centerView]}>
              <Text style={stylesGlobal.touchablePlainTextSecondary}>
              {t('auth:dontHaveAccount')}
              </Text>
            </TouchableOpacity>
          </View>
      
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
