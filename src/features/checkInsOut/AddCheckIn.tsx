import { View, Text, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, PermissionsAndroid, Image } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { globalStyles } from '../../styles/global'
import { BasicView } from '../../components/BasicView'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../app/store'
import { useSelector, RootStateOrAny } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { TextInputField } from '../../components/TextInputField'
import Button from '../../components/Button'
import { ButtonText } from '../../components/ButtonText'
import Icon from 'react-native-vector-icons/AntDesign';
import DropDownPicker from 'react-native-dropdown-picker'
import { transformDataToDropdownOptions, transformDataToDropdownOptionsClients } from '../../utils/utilts'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import { createClient, getClients } from '../clients/ClientSlice'
import { colors } from '../../utils/colors'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import DocumentPicker, { types } from 'react-native-document-picker';
import { firebase } from '@react-native-firebase/storage'
import { createCheckIn } from './checkInSlice'
import { getMyCurrentAssignedTasks } from '../tasks/TaskSlice'
import RNFS from 'react-native-fs';
import { TextAreaInputField } from '../../components/TextAreaInputField'

const AddCheckIn = ({ navigation, route }: any) => {

  const [checkIn, setCheckIn] = useState(null);
  const [items, setItems] = useState([
    { label: "Client visit", value: "Client visit" },
    { label: "Prospecting", value: "Prospecting" },
    { label: "Meeting", value: "Meeting" }
  ]);


  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [sheetTitle, setSheetTitle] = useState('');
  const [itemValueError, setItemValueError] = useState(null);
  const [purposeValueError, setPurposeValueError] = useState(null);
  const [taskValueError, setTaskValueError] = useState(null);
  const [uploadingPhotos,setUploadingPhotos]=useState(false)

  // variables
  const snapPoints = useMemo(() => ['25%', '70%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {

    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, [])


  const [purposeOpen, setPurposeOpen] = useState(false);
  const [purposeValue, setPurposeValue] = useState(null);
  const [clientOpen, setClientOpen] = useState(false);
  const [clientValue, setClientValue] = useState(null);
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskValue, setTaskValue] = useState(null);


  const { myAssignedCurrentTasks } = useSelector(
    (state: RootStateOrAny) => state.tasks,
);


const { currentLocation,previousLocation,isTracking } = useSelector(
  (state: RootStateOrAny) => state.tracking,
);


// console.log('currentLocation1234',currentLocation);
// console.log('previouLcation',previousLocation);
// console.log('istracking',isTracking);


  const {
    control: control1,
    setValue: setValue1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      latitude: '',
      longitude: ''
    },
  });

  const {
    control: control2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm({
    defaultValues: {
      name: '',
      phone_number: '',
      email: ''
    },
  });


  useEffect(() => {
    const existingCheckIn = route.params?.checkIn;
    if (existingCheckIn) {
      setIsEditMode(true);
      setValue1('title', existingCheckIn.title)
      setValue1('description', existingCheckIn.description)
      setValue1('img_url', existingCheckIn.img_url)
      setCheckIn(existingCheckIn)
      navigation.setOptions({
        title: t('screens:editCheckIn'),
      });
    } else {
      navigation.setOptions({
        title: t('screens:addCheckIn'),
      });
    }
  }, [route.params]);



useEffect(() => {
  dispatch(getMyCurrentAssignedTasks({ userId: user.id, status: 'current' }));
}, [])

  const dispatch = useAppDispatch();

  const { user } = useSelector(
    (state: RootStateOrAny) => state.user,
  );


  useEffect(() => {
    dispatch(getClients({ companyId: user?.company_id }));
  }, [])
  const { loading: clientLoading, clients } = useSelector(
    (state: RootStateOrAny) => state.clients,
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState('')


  const { t } = useTranslation();

  const [photos, setPhotos] = useState([]);


  const selectPhotos = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images,DocumentPicker.types.pdf],
        allowMultiSelection:true
      });

      // Check image sizes
      const validPhotos = res.filter((photo) => photo.size <= 10 * 1024 * 1024);
      const invalidPhotos = res.filter((photo) => photo.size > 10 * 1024 * 1024);

      if (invalidPhotos.length > 0) {
        ToastAndroid.show('Some images are larger than 10 MB and cannot be uploaded', ToastAndroid.SHORT);
      }

      setPhotos([...photos, ...validPhotos]); 
    } catch (error) {
      console.log(error);
      alert("Unknown Error: " + JSON.stringify(error));
      throw error;
    }
  };


  const getPathForFirebaseStorage = async (uri: any) => {

    const destPath = `${RNFS.TemporaryDirectoryPath}/text`;
    await RNFS.copyFile(uri, destPath);

    return (await RNFS.stat(destPath)).path;
  };


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


  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1); 
    setPhotos(newPhotos); 
  };


  const uploadPhotos = async () => {
    try {
   
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission to access photos',
          message: 'We need your permission to access photos',
          buttonPositive: 'OK',
        }
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setUploadingPhotos(true);
        const promises = photos.map(async (photo) => {
          // i want to get photo type photo.type
          const fileExtension = photo.type.split('/').pop();
          const uuid = makeid(10);
          const fileName = `${uuid}.${fileExtension}`;
          const storageRef = firebase.storage().ref(`businesses/docs/${fileName}`);
          const fileUri = await getPathForFirebaseStorage(photo.uri);
          
  
          try {
            const snapshot = await storageRef.putFile(fileUri);
            const downloadUrl = await storageRef.getDownloadURL();
            return { url: downloadUrl, type: photo.type };
          } catch (error) {
            console.error('Error uploading photo:', error);
            return null;
          }
        });
  
        try {
          const downloadUrls = await Promise.all(promises);
          const filteredUrls = downloadUrls.filter((url) => url !== null);
    
          return filteredUrls;
        } catch (error) {
          console.error('Error uploading photos:', error);
          return [];
        } finally {
          setUploadingPhotos(false);
        }
      } else {
        console.log('Permission denied');
        return [];
      }
    } catch (error) {
      console.error('Permission request error:', error);
      return [];
    }
  };
  

  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };


  const onSubmit2 = (data) => {

    dispatch(createClient({ data: data, companyId: user.company_id }))
      .unwrap()
      .then(result => {
        if (result.status) {
          bottomSheetModalRef.current?.close();
          ToastAndroid.show(`${t('screens:createdSuccessfully')}`, ToastAndroid.SHORT);
        } else {
          setDisappearMessage(
            `${t('screens:requestFail')}`,
          );
          console.log('dont navigate');
        }
      })
      .catch(rejectedValueOrSerializedError => {
        console.log('error');
        console.log(rejectedValueOrSerializedError);
      });
  }

    const onSubmit1 = async (data) => {

      if (isEditMode) {

      }else{
   
        try {   
    if (clientValue == null) {
      setItemValueError("Please choose client");

    }

    if (purposeValue == null) {
      setPurposeValueError("Please choose purpose");
      return
    }

          data.client=clientValue;
          data.purpose=purposeValue;
          data.task=taskValue;
          if (photos !== null){
            const photoData = await uploadPhotos();
            data.photos = photoData;
          }

      
          dispatch(createCheckIn({ data: data, userId: user.id }))
            .unwrap()
            .then((result) => {
              if (result.status) {
                ToastAndroid.show('Check-in added successfully', ToastAndroid.SHORT);
                navigation.navigate('Active Check-Ins');
              } else {
                console.log('Unable to process request');
              }
            })
            .catch((error) => {
              console.error('Error creating check-in:', error);
            });
        } catch (error) {
          console.error('Error uploading photos:', error);
        }
    
      }

    };
  


  const stylesGlobal = globalStyles();
  return (
    <>
      <GestureHandlerRootView>
        <ScrollView
          style={stylesGlobal.scrollBg}
        >
          <View style={stylesGlobal.container}>
            <BasicView style={stylesGlobal.centerView}>
              <Text style={stylesGlobal.errorMessage}>{message}</Text>
            </BasicView>
            <BasicView>
              <Text
                style={[
                  stylesGlobal.inputFieldTitle,
                  stylesGlobal.marginTop20,
                ]}>
                {t('screens:title')}
              </Text>

              <Controller
                control={control1}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder={`${t('screens:enterTitle')}`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="title"
              />

              {errors1.title && (
                <Text style={stylesGlobal.errorMessage}>
                  {t('screens:titleRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
              <View style={{
                marginVertical: 20
              }}>
                <Text>Purpose</Text>
                <DropDownPicker
                  open={purposeOpen}
                  zIndex={8000}
                  placeholder={t('screens:purpose')}
                  listMode='SCROLLVIEW'
                  value={purposeValue}
                  items={items}
                  setOpen={setPurposeOpen}
                  setValue={setPurposeValue}

                  setItems={setItems}
                  style={stylesGlobal.dropdownStyles}
                />
              </View>

              {purposeValueError && purposeValue == null ? (<Text style={{
                color: colors.dangerRed
              }}>{purposeValueError}</Text>) : (<></>)}

            </BasicView>

            <BasicView>
              <View style={{
                marginVertical: 20
              }}>
                <Text>Client</Text>
                <DropDownPicker
                  open={clientOpen}
                  zIndex={6000}
                  searchable={true}
                  placeholder={t('screens:selectClients')}
                  listMode='SCROLLVIEW'
                  value={clientValue}
                  items={transformDataToDropdownOptionsClients(clients)}
                  setOpen={setClientOpen}
                  setValue={setClientValue}
                  style={stylesGlobal.dropdownStyles}
                />
                {itemValueError && clientValue == null ? (<Text style={{
                  color: colors.dangerRed
                }}>{itemValueError}</Text>) : (<></>)}
              </View>
              <TouchableOpacity
                onPress={handlePresentModalPress}
                style={{ marginLeft: 10 }}
              >
                <Text style={{
                  color: colors.secondary,
                  fontWeight: 'bold',
                  fontSize: 16
                }}>{t('screens:addClient')}</Text>
              </TouchableOpacity>

            </BasicView>

            <BasicView>
              <View style={{
                marginVertical: 20
              }}>
                <Text>Choose Task</Text>
                <DropDownPicker
                  open={taskOpen}
                  zIndex={5000}
                  placeholder={t('screens:pleaseChooseTask')}
                  listMode='SCROLLVIEW'
                  value={taskValue}
                  items={transformDataToDropdownOptions(myAssignedCurrentTasks)}
                  setOpen={setTaskOpen}
                  setValue={setTaskValue}
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
                {t('screens:description')}
              </Text>

              <Controller
                control={control1}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextAreaInputField
                    placeholder={`${t('screens:enterDescription')}`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="description"
              />

              {errors1.description && (
                <Text style={stylesGlobal.errorMessage}>
                  {t('auth:descriptionRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView style={{
              marginVertical: 40
            }}>
              <Text style={{
                marginBottom: 10
              }}>Attach photos:</Text>
              <TouchableOpacity style={styles.buttonAttach} onPress={selectPhotos}>
                <Text>{t('screens:photo')}</Text>
                <Icon name="camera" size={30} />
              </TouchableOpacity>
         
              <FlatList
                data={photos}
                horizontal
                renderItem={({ item, index }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: item.uri }} style={{ width: 100, height: 100, margin: 5 }} />
                    <TouchableOpacity onPress={() => removePhoto(index)}>
                      <Icon name="close" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </BasicView>

            <BasicView style={{marginBottom:150}}>
              <Button loading={uploadingPhotos} onPress={handleSubmit1(onSubmit1)}>
                <ButtonText> {t('screens:addCheckIn')}</ButtonText>
              </Button>
            </BasicView>

          </View>
        </ScrollView>

        <BottomSheetModalProvider>
          <View style={styles.container}>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              backgroundStyle={{
                backgroundColor: colors.whiteBackground
              }}
            >
              <BottomSheetScrollView
                contentContainerStyle={styles.contentContainer}
              >
                <Text style={styles.title}>{t('screens:addClient')}</Text>

                <BasicView>
                  <Text
                    style={[
                      stylesGlobal.inputFieldTitle,
                      stylesGlobal.marginTop20,
                    ]}>
                    {t('auth:name')}
                  </Text>

                  <Controller
                    control={control2}
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

                  {errors2.name && (
                    <Text style={stylesGlobal.errorMessage}>
                      {t('auth:nameRequired')}
                    </Text>
                  )}
                  <BasicView>
                    <Text
                      style={[
                        stylesGlobal.inputFieldTitle,
                        stylesGlobal.marginTop20,
                      ]}>
                      {t('auth:phone')}
                    </Text>

                    <Controller
                      control={control2}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInputField
                          placeholder={t('auth:enterPhone')}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          keyboardType='numeric'
                        />
                      )}
                      name="phone_number"
                    />
                    {errors2.phone_number && (
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
                      control={control2}

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

                    {errors2.email && (
                      <Text style={stylesGlobal.errorMessage}>
                        {t('auth:emailRequired')}
                      </Text>
                    )}
                  </BasicView>


                </BasicView>

                <BasicView>
                  <Button loading={clientLoading} onPress={handleSubmit2(onSubmit2)}>
                    <ButtonText>  {t('screens:addClient')}</ButtonText>
                  </Button>
                </BasicView>

              </BottomSheetScrollView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  )
}

const styles = StyleSheet.create({


  buttonAttach: {
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5555',
    flexDirection: 'row',
  },
  container: {
    margin: 10
  },
  contentContainer: {
    marginHorizontal: 10
  },
  title: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold'
  },

})

export default AddCheckIn