import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert, ActivityIndicator, ToastAndroid } from 'react-native';
import { globalStyles } from '../../styles/global';
import { colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import { getCurrentLocation } from '../../costants/currentLocation';
import { getTodayPunchRecords, punchIn, punchOut, setIsPunchedIn } from './PunchRecordSlice';
import { useAppDispatch } from '../../app/store';
import { useSelector, RootStateOrAny } from 'react-redux';
import { BasicView } from '../../components/BasicView';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconDisplay from 'react-native-vector-icons/MaterialCommunityIcons';

const PunchInOut = ({navigation}:any) => {
    const stylesGlobal = globalStyles();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [totalHours, setTotalHours] = useState('0H 0min 0s');
    const dispatch = useAppDispatch();
    const [message, setMessage] = useState('');
    const { user } = useSelector((state: RootStateOrAny) => state.user);
    const { todayPunchRecords, isPunchedIn } = useSelector((state: RootStateOrAny) => state.PunchRecords);

    const timerRef = useRef(null);
    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
    );

    useEffect(() => {
        if (user?.id) {
            dispatch(getTodayPunchRecords(user.id));
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (todayPunchRecords) {
            calculateTotalHours(todayPunchRecords);
        }
    }, [todayPunchRecords]);

    useEffect(() => {
        if (isPunchedIn) {
            startCountdown();
        } else {
            stopCountdown();
        }
    }, [isPunchedIn]);

    const calculateTotalHours = (punchRecords) => {
        let totalSeconds = 0;

        punchRecords.forEach(record => {
            if (record.punch_in_time && record.punch_out_time) {
                const punchInTime = new Date(record.punch_in_time);
                const punchOutTime = new Date(record.punch_out_time);
                const seconds = (punchOutTime - punchInTime) / 1000;
                totalSeconds += seconds;
            } else if (record.punch_in_time && isPunchedIn) {
                const punchInTime = new Date(record.punch_in_time);
                const now = new Date();
                const seconds = (now - punchInTime) / 1000;
                totalSeconds += seconds;
            }
        });

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        setTotalHours(`${hours}H ${minutes}min ${seconds}s`);
    };

    const startCountdown = () => {
        if (timerRef.current) return;

        timerRef.current = setInterval(() => {
            calculateTotalHours(todayPunchRecords);
        }, 1000);
    };

    const stopCountdown = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const setDisappearMessage = (message) => {
        setMessage(message);

        setTimeout(() => {
            setMessage('');
        }, 10000);
    };

   

    const handlePunchInOut = () => {
        Alert.alert(
            t('screens:confirmation'),
            isPunchedIn ? t('screens:confirmPunchOut') : t('screens:confirmPunchIn'),
            [
                {
                    text: t('cancel'),
                    style: 'cancel',
                },
                {
                    text: t('confirm'),
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            const location = await getCurrentLocation();
                            const data = {
                                latitude: location?.latitude,
                                longitude: location?.longitude
                            };

                            if (isPunchedIn) {
                                dispatch(punchOut({ data, userId: user.id }))
                                    .unwrap()
                                    .then(result => {
                                        if (result.status) {
                                            dispatch(setIsPunchedIn(false));
                                            dispatch(getTodayPunchRecords(user.id))
                                                .then(() => {
                                                    setIsLoading(false);
                                                    stopCountdown(); // Stop countdown on punch out
                                                });
                                            ToastAndroid.show(`${t('screens:punchOutSuccessfully')}`, ToastAndroid.SHORT)
                                        } else {
                                           //  dispatch(setIsPunchedIn(false));
                                            setIsLoading(false);
                                            setDisappearMessage(`${t('screens:requestFail')}`);
                                        }
                                    })
                                    .catch(error => {
                                        setIsLoading(false);
                                        console.log('error', error);
                                    });
                            } else {
                                dispatch(punchIn({ data, userId: user.id }))
                                    .unwrap()
                                    .then(result => {
                                        if (result.status) {
                                            dispatch(setIsPunchedIn(true));
                                            dispatch(getTodayPunchRecords(user.id))
                                                .then(() => {
                                                    setIsLoading(false);
                                                    startCountdown(); // Start countdown on punch in
                                                });
                                            ToastAndroid.show(`${t('screens:punchInSuccessfully')}`, ToastAndroid.SHORT)
                                        } else {
                                            
                                            setIsLoading(false);
                                            setDisappearMessage(`${t('screens:requestFail')}`);
                                        }
                                    })
                                    .catch(error => {
                                        setIsLoading(false);
                                        console.log('error', error);
                                    });
                            }

                        } catch (error) {
                            setIsLoading(false);
                            Alert.alert('Error', 'Failed to get current location');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ScrollView style={stylesGlobal.scrollBg}>
            <View style={stylesGlobal.appView}>
                {message ? (
                    <BasicView style={stylesGlobal.centerView}>
                        <Text style={stylesGlobal.errorMessage}>{message}</Text>
                    </BasicView>
                ) : null}
                <TouchableOpacity
                    style={[
                        styles.outerCircle,

                        { backgroundColor: '#edebfc' }
                    ]}
                    onPress={handlePunchInOut}
                    disabled={isLoading}
                >
                    <View
                        style={[
                            styles.innerCircle,
                            { backgroundColor: '#f3f2f5' }
                        ]}
                    >
                        <View style={styles.innerMostCircle}>
                            {isLoading ? (
                                <ActivityIndicator size="large" color={colors.white} />
                            ) : (
                                <>
                                    <Icon name="touch-app" size={50} color={isPunchedIn ? colors.dangerRed : colors.successGreen} />
                                    <Text style={[styles.punchButtonText, { color: isPunchedIn ? colors.dangerRed : colors.successGreen }]}>
                                        {isPunchedIn ? t('screens:punchOut') : t('screens:punchIn')}
                                    </Text>
                                </>
                            )}
                        </View>

                    </View>
                </TouchableOpacity>

                <View style={styles.displayIcons}>
                    <View>
                        <IconDisplay name="clock-in" size={50} color={isDarkMode ? colors.white : colors.alsoGrey} />
                        <Text style={[styles.timerText, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>
                            {todayPunchRecords?.length > 0 && todayPunchRecords[0].punch_in_time ?
                                new Date(todayPunchRecords[0].punch_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) :
                                '---:---'
                            }
                        </Text>
                        <Text style={[styles.textSize, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>{t('screens:punchIn')}</Text>

                    </View>
                    <View>
                        <IconDisplay name="clock-out" size={50} color={isDarkMode ? colors.white : colors.alsoGrey} />
                        <Text style={[styles.timerText, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>
                            {todayPunchRecords?.length > 0 && todayPunchRecords.some(record => record.punch_out_time) ?
                                new Date([...todayPunchRecords].reverse().find(record => record.punch_out_time).punch_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) :
                                '---:---'
                            }
                        </Text>
                        <Text style={[styles.textSize, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>{t('screens:punchOut')}</Text>

                    </View>
                    <View>
                        <IconDisplay name="clock-check-outline" size={50} color={isDarkMode ? colors.white : colors.alsoGrey} />
                        <Text style={[styles.timerText, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>
                            {totalHours}
                        </Text>
                        <Text style={[styles.textSize, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>{t('screens:totalHours')}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.previous}
                 onPress={()=>{navigation.navigate('previousPunchInOut')}}
                >
                    <Text style={[styles.touchableText,{color:colors.white}]}>{t('screens:previousRecords')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    outerCircle: {

        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 120,
        elevation: 2
    },
    innerCircle: {
        margin: 20,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    innerMostCircle: {
        margin: 10,
        width: 180,
        height: 180,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        backgroundColor: '#f3f2f5'

    },
    punchButtonText: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
      
    },
    displayIcons: {
        marginTop: 50,
        marginBottom: 20,
        marginHorizontal:5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    previous:{
     backgroundColor:colors.primary,
     borderRadius:30,
     marginVertical:50
    },
    displayRecords: {
        marginHorizontal:5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    timerDisplay: {
        marginVertical: 10,
        height: 65,
        backgroundColor: '#527da3',
        justifyContent: 'center',
        elevation: 10,
    },
    textSize: {
        fontSize: 20
    },
    timerText: {
        fontSize: 16,
        marginTop: 20,
        marginBottom: 3,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    touchableText:{
     padding:15,
     textAlign:'center',
     fontSize:20
    }
});

export default PunchInOut;
