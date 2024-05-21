import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useSelector } from 'react-redux';
import { userRegiter } from './userSlice';
import { globalStyles } from '../../styles/global';
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility';
import PhoneInput from 'react-native-phone-number-input';
import { colors } from '../../utils/colors';
import { Container } from '../../components/Container';
import { BasicView } from '../../components/BasicView';
import { TextInputField } from '../../components/TextInputField';
import { useAppDispatch } from '../../app/store';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import Pdf from 'react-native-pdf';
import DocumentPicker, { types } from 'react-native-document-picker';
import { firebase } from '@react-native-firebase/storage';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import { getIndustries, getPositions } from '../IndustryPositionSlice';
import { transformDataToDropdownOptions } from '../../utils/utilts';

const RegisterScreen = ({ route, navigation }: any) => {

  const { loading:positionLoading, positions,industries } = useSelector(
    (state: RootStateOrAny) => state.industriesPositions,
  );

  const [items, setItems] = useState(transformDataToDropdownOptions(positions));
  const [indusryItems, setIndustryItems] = useState(transformDataToDropdownOptions(industries));

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [position_id,setPosition]=useState(null);

  const [openIndustry, setOpenIndustry] = useState(false);
  const [IndustryValue, setIndustryValue] = useState(null);
  const [industry_id,setIndustry]=useState(null)
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);


  const onChangeIndustry=(industry_id:any)=>{
   setIndustry(industry_id);
  }

  const onChangePosition = (position_id:any)=>{
    setPosition(position_id)
  }

  useEffect(() => {
    callGetPositions();
    callGetIndustries();
  }, []);


  const callGetPositions = () => {
    dispatch(getPositions());
  };
  const callGetIndustries = () => {
    dispatch(getIndustries());
  };

 

  DropDownPicker.setListMode("SCROLLVIEW");

  const dispatch = useAppDispatch();
  const { user, loading, status } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const phoneInput = useRef<PhoneInput>(null);
  const [message, setMessage] = useState('');
   const [fileDoc, setFileDoc] = useState<string | null>(null);


   const { t } = useTranslation();

  const makeid = (length: any) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  useEffect(() => {
    if (status !== '') {
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
      first_name:'',
      last_name: '',
      company_name:'',
      email:'',
      nida: '',
    },
  });


  const removeAttachment = () => {
    setFileDoc(null)
  }

  const selectFileDoc = async () => {

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      })
      setFileDoc(res);
    } catch (error) {

      if (DocumentPicker.isCancel(error)) {
        setFileDoc(null)
      } else {
        alert('Unknown Error: ' + JSON.stringify(error));
        throw error
      }
    }
  }


  

  const getPathForFirebaseStorage = async (uri: any) => {
    const destPath = `${RNFS.TemporaryDirectoryPath}/text`;
    await RNFS.copyFile(uri, destPath);

    return (await RNFS.stat(destPath)).path;
  };


  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };



  const onSubmit = async (data: any) => {
  
    data.position_id = position_id;
    data.industry_id=industry_id;


    if (fileDoc !== null) {
      data.doc_type = fileDoc[0].type;
      console.log('file document', fileDoc);
      const fileExtension = fileDoc[0].type.split("/").pop();
      var uuid = makeid(10)
      const fileName = `${uuid}.${fileExtension}`;
      var storageRef = firebase.storage().ref(`businesses/docs/${fileName}`);

      console.log('file docs', fileDoc[0].uri);
      const fileUri = await getPathForFirebaseStorage(fileDoc[0].uri);
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Read Permission",
            message: "Your app needs permission.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setUploadingDoc(true);
          storageRef.putFile(fileUri).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: any) => {
              console.log("snapshost: " + snapshot.state);
              if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
              }
            },
            (error) => {
              unsubscribe();
            },
            () => {
              storageRef.getDownloadURL().then((downloadUrl: any) => {
                data.doc_url = downloadUrl;
                setUploadingDoc(false);
                //    console.log('on submit data', data);
                dispatch(userRegiter(data))
                  .unwrap()
                  .then(result => {
                    console.log('resultsss', result);
                    if (result.status) {
                      console.log('excuted this true block')
                      ToastAndroid.show(`${t('screens:userSuccessfully')}`, ToastAndroid.SHORT);

                      navigation.navigate('Login', {
                        screen: 'Login',
                        message: message
                      });
                    } else {
                      setDisappearMessage(
                        'Unable to process request. Please try again later.',
                      );
                      console.log('dont navigate');
                    }

                    console.log('result');
                    console.log(result);
                  })
                  .catch(rejectedValueOrSerializedError => {
                    // handle error here
                    console.log('error');
                    console.log(rejectedValueOrSerializedError);
                  });
              });
            }
          );
        } else {
          return false;
        }
      } catch (error) {
        console.warn(error);
        return false;
      }


    }
  }

  const stylesGlobal=globalStyles();

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
);

  return (

    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
     
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
                  stylesGlobal.marginTop20,
                ]}>
               {t('auth:firstName')}
              </Text>

              <Controller
                control={control}
                rules={{
                  maxLength: 12,
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder= {t('auth:enterFirstName')}
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
              <Text
                style={[
                  stylesGlobal.inputFieldTitle,
                  stylesGlobal.marginTop20,
                ]}>
               {t('auth:lastName')}
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder= {t('auth:lastName')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="last_name"
              />

              {errors.last_name && (
                <Text style={stylesGlobal.errorMessage}>
                  {t('auth:lastNameRequired')}
                </Text>
              )}
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
                    placeholder="672 127 313"
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
                    //autoFocus
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
              {errors.phone_number && (
                <Text style={stylesGlobal.errorMessage}>
                  {t('auth:phoneRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
              <View style={{
                marginVertical: 20
              }}>
                <DropDownPicker
                  open={open}
                  zIndex={6000}
                  placeholder={t('screens:companyPosition')}
                  listMode='SCROLLVIEW'
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  onChangeValue={onChangePosition}
                  setItems={setItems}
                  style={stylesGlobal.dropdownStyles}
                />
                </View>
              </BasicView>

              <BasicView>
              <View style={{
                marginVertical: 20
              }}>
                <DropDownPicker
                  open={openIndustry}
                  placeholder={t('screens:companyIndustry')}
                  listMode='SCROLLVIEW'
                  value={IndustryValue}
                  items={indusryItems}
                  setOpen={setOpenIndustry}
                  setValue={setIndustryValue}
                  onChangeValue={onChangeIndustry}
                  setItems={setIndustryItems}
                  style={stylesGlobal.dropdownStyles}
                />

              </View>


            </BasicView>
            <BasicView>
              <Text
                style={[
                  stylesGlobal.inputFieldTitle,
                  stylesGlobal.marginTop20,
                ]}>
               {t('auth:companyName')}
              </Text>

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder= {t('auth:companyName')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="company_name"
              />

              {errors.company_name && (
                <Text style={stylesGlobal.errorMessage}>
                  {t('auth:companyNameRequired')}
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
                    placeholder= {t('auth:email')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />

              {errors.company_name && (
                <Text style={stylesGlobal.errorMessage}>
                  {t('auth:emailRequired')}
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
              {errors.password && (
                <Text style={stylesGlobal.errorMessage}>
                  {t('auth:passwordRequired')}
                </Text>
              )}
            </BasicView>


         

            <BasicView>
                <View style={stylesGlobal.uploadView} >
                  <Text style={{ fontSize: 12,color:isDarkMode?colors.white:colors.black }}>
                    {fileDoc == null ? `${t('screens:attachBusiness')}` : `${t('screens:fileAttach')}`}
                  </Text>
                  <View style={stylesGlobal.attachmentDiv}>
                    <TouchableOpacity
                      style={stylesGlobal.uploadBtn}
                      onPress={selectFileDoc}
                      disabled={fileDoc == null ? false : true}
                    >
                      {
                        fileDoc == null ? (<View />) : (
                          <Icon name={rightIcon} size={20} color={colors.successGreen} />
                        )
                      }

                      <Text style={{
                        color: colors.white,
                        fontSize: 12
                      }}>
                        {fileDoc == null ? `${t('screens:attach')}` : `${t('screens:attached')}`}
                      </Text>
                    </TouchableOpacity>
                    {fileDoc == null ? (<View />) : (
                      <TouchableOpacity style={{
                        alignSelf: 'center',
                        marginLeft: 30
                      }}
                        onPress={() => removeAttachment()}
                      >
                        <Text style={stylesGlobal.textChange}>{t('screens:change')}</Text>
                      </TouchableOpacity>)}
                  </View>
                  {fileDoc == null ? (<View>
                    <Text style={{ color: '#f25d52' }}>

                    </Text>
                  </View>) : (<View />)}
                </View>
                {fileDoc == null ? (<View />) : (
                  <View style={stylesGlobal.displayDoc}>
                    {
                      fileDoc[0].type == 'application/pdf' ? (
                        <Pdf source={{ uri: fileDoc[0].uri }} style={stylesGlobal.pdf}
                          maxScale={3}
                        />
                      ) : (
                        <Image source={{ uri: fileDoc[0].uri }}
                          style={stylesGlobal.pdf}
                        />
                      )
                    }
                  </View>)}
              </BasicView>


              <BasicView>
              <Button loading={loading || uploadingDoc} onPress={handleSubmit(onSubmit)}>
                <ButtonText>{t('auth:register')}</ButtonText>
              </Button>
            </BasicView>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              style={[stylesGlobal.marginTop20, stylesGlobal.centerView]}>
              <Text style={stylesGlobal.touchablePlainTextSecondary}>
                {t('auth:alreadyHaveAccount')}
              </Text>
            </TouchableOpacity>
          </View>
     
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
