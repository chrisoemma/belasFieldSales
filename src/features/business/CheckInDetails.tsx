import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, ToastAndroid, PermissionsAndroid, FlatList } from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../styles/global';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import MapDisplay from '../../components/MapDisplay';
import { formatCheckinTime, getTime, getdate } from '../../utils/utilts';
import { Controller, useForm } from 'react-hook-form';
import { BasicView } from '../../components/BasicView';
import { TextAreaInputField } from '../../components/TextAreaInputField';
import RadioButton from '../../components/RadioButton';
import DocumentPicker, { types } from 'react-native-document-picker';
import { firebase } from '@react-native-firebase/storage'
import RNFS from 'react-native-fs';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { CheckOut } from '../checkInsOut/checkInSlice';
import DatePicker from 'react-native-date-picker';

const CheckInDetails = ({ navigation, route }: any) => {

    const { t } = useTranslation();

    const { checkIn } = route?.params;

    const { user } = useSelector(
        (state: RootStateOrAny) => state.user,
    );

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [radioValue, setRadioValue] = useState(null);
    const [isPressedBtn, setIsPressedBtn] = useState(false);
    const [uploadingPhotos, setUploadingPhotos] = useState(false)
    const [date, setDate] = useState(new Date(0))
    const [open, setOpen] = useState(false);

    const snapPoints = useMemo(() => ['25%', '95%'], []);

    const stylesGlobal = globalStyles();

    const [title, setTitle] = useState(null);

    const dispatch = useAppDispatch();

    const statuses = [
        {
            id: 'Completed',
            name: `${t('screens:Completed')}`
        },
        {
            id: 'Rescheduled',
            name: `${t('screens:Rescheduled')}`
        },
        {
            id: 'Canceled',
            name: `${t('screens:Canceled')}`
        }
    ];


    const [photos, setPhotos] = useState([]);


    const selectPhotos = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
                allowMultiSelection: true
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



    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            comments: '',
        },
    });


    const handlePresentModalPress = useCallback((title) => {

        setTitle(title)
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);



    const onSubmit = async (data) => {

        try {
            if (photos !== null) {
                const photoData = await uploadPhotos();
                data.photos = photoData;
            }
               
            if(radioValue=='Rescheduled')
            {
                if(date.getFullYear() === 1970) {
                     return 
                }else{
                    data.rescheduled_meeting_datetime=date
                   
                } 
            }
            data.user_id=user.id
            data.status=radioValue;
        
            dispatch(CheckOut({ data: data, checkInId: checkIn.id }))
                .unwrap()
                .then((result) => {
                    if (result.status) {
                        ToastAndroid.show('Check-Out successfully', ToastAndroid.SHORT);
                        navigation.navigate('Check-outs');
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

    return (
        <SafeAreaView style={stylesGlobal.scrollBg}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView style={styles.mainContentContainer}>

                    <Image
                        source={require('./../../../assets/images/Cleaning.jpg')}
                        style={{
                            resizeMode: 'cover',
                            width: '100%',
                            height: 150,
                            borderRadius: 10,
                        }}
                    />
                    <Text style={styles.category}>{checkIn?.title}</Text>
                    <Text style={styles.time}>
                        <Icon
                            name="user"
                            size={20} color={colors.black}
                            style={{ marginHorizontal: 10 }}
                        />
                        {checkIn?.user?.name}
                    </Text>
                    <Text style={styles.time}>
                        <Icon
                            name="clockcircleo"
                            size={20} color={colors.black}
                            style={{ marginHorizontal: 10 }}
                        />   {formatCheckinTime(checkIn?.checkin_time)}</Text>
                    <Text style={styles.desc}>
                        <Icon
                            name="enviromento"
                            size={20} color={colors.black}
                            style={{ marginHorizontal: 10 }}
                        /> 23 watsoba street dar es salaam
                    </Text>
                    <Text>
                        {checkIn?.description}
                    </Text>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={stylesGlobal.otherBtn}>
                            <Text style={{ color: colors.white }}>{t('navigate:tasks')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={stylesGlobal.chooseBtn}
                            onPress={() => { handlePresentModalPress(`${t('screens:checkOut')}`) }}
                        >
                            <Text style={{ color: colors.white }}>{t('screens:checkOut')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[stylesGlobal.otherBtn, { backgroundColor: colors.dangerRed }]}>
                            <Text style={{ color: colors.white }}>{t('screens:delete')}</Text>
                        </TouchableOpacity>
                    </View>
                    <MapDisplay />
                </ScrollView>


                <BottomSheetModalProvider>
                    <View style={styles.bottomSheetContainer}>
                        <BottomSheetModal
                            ref={bottomSheetModalRef}
                            index={1}
                            snapPoints={snapPoints}
                            onChange={handleSheetChanges}

                        >
                            <BottomSheetScrollView style={styles.bottomSheetContentContainer}>


                                <Text style={{
                                    alignSelf: 'center', fontSize: 19, color: colors.black, marginBottom: 15
                                }}>{title}</Text>



                                <BasicView>
                                    <RadioButton
                                        radioArray={statuses}
                                        image={false}
                                        title={`${t('screens:checkOutReason')}`}
                                        setRadioValue={setRadioValue}
                                        radioValue={radioValue}
                                    />
                                    {radioValue == null && isPressedBtn ? (<Text style={{ color: 'red' }}> {t('screens:pleaseCheckOutStatus')} </Text>) : <View />}
                                </BasicView>
                                   {radioValue === 'Rescheduled'?(  <BasicView>
          <Text
            style={[
              stylesGlobal.inputFieldTitle,
              stylesGlobal.marginTop20,
            ]}>{t('screens:scheduledDate')}</Text>

          <TouchableOpacity style={styles.btnChange}
            onPress={() => setOpen(true)}
          >
            <Text style={styles.textChange}>{`${t('screens:choose')}` }</Text>
          </TouchableOpacity>
          <DatePicker
            mode={"datetime"}
            minimumDate={new Date()}
            modal
            open={open}
            date={date}
            onConfirm={(date) => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />

{
          date !== null ? (
            <BasicView style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
              <Text style={{ marginRight: 20 }}>{getdate(date)}</Text>
              <Text>{getTime(date)}</Text>
            </BasicView>

          )
            : (<View />)
        }
        </BasicView>):(<></>)}
                                <BasicView>
                                    <Text
                                        style={[
                                            stylesGlobal.inputFieldTitle,
                                            stylesGlobal.marginTop20,
                                        ]}>
                                        {t('screens:comment')}
                                    </Text>

                                    <Controller
                                        control={control}

                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextAreaInputField
                                                placeholder={`${t('screens:enterComments')}`}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: 'gray',
                                                }}
                                            />
                                        )}
                                        name="comments"
                                    />

                                    {errors.comments && (
                                        <Text style={stylesGlobal.errorMessage}>
                                            {t('auth:commentRequired')}
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

                                <BasicView style={{ marginBottom: 150 }}>
                                    <Button loading={uploadingPhotos} onPress={handleSubmit(onSubmit)}>
                                        <ButtonText> {t('screens:checkOut')}</ButtonText>
                                    </Button>
                                </BasicView>

                            </BottomSheetScrollView>

                        </BottomSheetModal>
                    </View>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>


        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    mainContentContainer: {
        margin: 15,
        backgroundColor: 'white',

        padding: 10,
        borderRadius: 10,
    },
    bottomSheetContainer: {
        // flex: 1,
        margin: 10,
        zIndex: 1000
    },
    bottomSheetContentContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    btnContainer: {
        marginTop: 8,
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    time: {
        paddingTop: 5,
        fontWeight: 'bold',
        flexDirection: 'row',
        color: colors.black
    },
    category: {
        textTransform: 'uppercase',
        color: colors.secondary,
        marginTop: 15,
    },
    service: {
        paddingTop: 5,
        fontWeight: 'bold',
        color: colors.black,
    },
    buttonAttach: {
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#5555',
        flexDirection: 'row',
    },
    status: {
        alignSelf: 'flex-end',
        backgroundColor: colors.secondary,
        padding: 10,
        borderRadius: 10,
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

});

export default CheckInDetails;
