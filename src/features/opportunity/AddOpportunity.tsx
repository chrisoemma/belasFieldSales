import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { TextInputField } from '../../components/TextInputField';
import { colors } from '../../utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { formatDateToYYYYMMDDHHMM, transformDataToDropdownOptions, transformDataToDropdownOptionsClients, transformDataToDropdownOptionsLead } from '../../utils/utilts';
import { globalStyles } from '../../styles/global';
import { addOpportunity, getOpportunityStages } from './OppoturnitySlice';
import { getForecastCategories } from '../forecastCategory/forecastCategorySlice';
import { useTranslation } from 'react-i18next';
import { TextAreaInputField } from '../../components/TextAreaInputField';
import DatePicker from 'react-native-date-picker';
import { BasicView } from '../../components/BasicView';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { createClient, getClients } from '../clients/ClientSlice';

const AddOpportunity = ({ navigation }: any) => {

    const stylesGlobal = globalStyles();
    const { t } = useTranslation();

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

    const {
        control: control,
        handleSubmit: handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            opportunity_name: '',
            amount: '',
            probability: '',
            forecast: ''
        },
    });

    const dispatch = useDispatch();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [sheetTitle, setSheetTitle] = useState('');

    const [clientOpen, setClientOpen] = useState(false);
    const [clientValue, setClientValue] = useState(null);
    const { OpportunityStages, loading } = useSelector((state) => state.Opportunities);
    const { forecastCategories } = useSelector((state) => state.forecastCategories);
    const { user } = useSelector((state) => state.user);
    const [forecastCategoryOpen, setForecastCategoryOpen] = useState(false);
    const [forecastCategoryValue, setForecastCategoryValue] = useState(null);
    const [forecastCategoryItems, setForecastCategoryItems] = useState([]);

    const [oppoturnityStageOpen, setOppoturnityStageOpen] = useState(false);
    const [oppoturnityStageValue, setOppoturnityStageValue] = useState(null);
    const [oppoturnityStageItems, setOppoturnityStageItems] = useState([]);
    const [message, setMessage] = useState('');

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [closeDateError, setCloseDateError] = useState('')

    const snapPoints = useMemo(() => ['25%', '70%'], []);

    const setDisappearMessage = (message: any) => {
        setMessage(message);

        setTimeout(() => {
            setMessage('');
        }, 5000);
    };


    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);
    const { loading: clientLoading, clients } = useSelector(
        (state: RootStateOrAny) => state.clients,
    );
    const [itemValueError, setItemValueError] = useState(null);

    useEffect(() => {
        dispatch(getOpportunityStages({ companyId: user?.company_id }));
    }, [dispatch]);

    useEffect(() => {
        dispatch(getForecastCategories());
    }, [dispatch]);

    useEffect(() => {
        if (OpportunityStages) {
            setOppoturnityStageItems(transformDataToDropdownOptionsLead(OpportunityStages));
        }
    }, [OpportunityStages]);

    useEffect(() => {
        if (forecastCategories) {
            setForecastCategoryItems(transformDataToDropdownOptions(forecastCategories));
        }
    }, [forecastCategories]);

    useEffect(() => {
        dispatch(getClients({ companyId: user?.company_id }));
    }, []);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
    };

    const onSubmit = (data) => {

        data.creator = user?.id;
        data.company_id = user?.company_id;
        data.client = clientValue;

        if (clientValue == null) {
            setItemValueError(t('screens:pleaseChooseAccount'));
        } else {
            if (itemValueError) {
                setItemValueError('');
            }
        }

        if (data?.close_date == null) {
            setCloseDateError(t('screens:pleaseChooseCloseDate'));
        } else {
            if (closeDateError) {
                setCloseDateError('');
            }
        }


        dispatch(addOpportunity({ data: data }))
            .unwrap()
            .then(result => {
                if (result.status) {

                    ToastAndroid.show(`${t('screens:createdSuccessfully')}`, ToastAndroid.SHORT);
                    navigation.navigate('Opportunities', {
                        screen: 'Opportunities',
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

    const handleMarkComplete = () => {
        handleStatusChange('Complete');
    };

    return (
        <>
            <GestureHandlerRootView>
                <ScrollView
                    style={[stylesGlobal.scrollBg, { backgroundColor: colors.white }]}
                >
                    <View>
                        <View style={styles.card}>
                            <BasicView style={stylesGlobal.centerView}>
                                <Text style={stylesGlobal.errorMessage}>{message}</Text>
                            </BasicView>
                            <Text style={styles.sectionHeader}>{t('screens:about')}</Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInputField
                                        label={t('screens:opportunityName')}
                                        placeholder={t('screens:opportunityName')}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        style={styles.inputField}
                                    />
                                )}
                                name="opportunity_name"
                                rules={{ required: true }}
                            />
                            {errors.name && (
                                <Text style={stylesGlobal.errorMessage}>
                                    {t('screens:oppoturnityNameRequired')}
                                </Text>
                            )}
                            <BasicView>
                                <View style={{
                                    marginVertical: 20
                                }}>
                                    <Text>{t('screens:account')}</Text>
                                    <DropDownPicker
                                        open={clientOpen}
                                        zIndex={6000}
                                        searchable={true}
                                        placeholder={t('screens:selectAccount')}
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
                                    style={{ marginLeft: 10, marginBottom: 10 }}
                                >
                                    <Text style={{
                                        color: colors.secondary,
                                        fontWeight: 'bold',
                                        fontSize: 16,

                                    }}>{t('screens:addAccount')}</Text>
                                </TouchableOpacity>
                            </BasicView>

                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <View>
                                        <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
                                            <TextInputField
                                                label={t('screens:close_date')}
                                                placeholder={t('screens:close_date')}
                                                value={formatDateToYYYYMMDDHHMM(value)}
                                                editable={false}
                                                style={styles.inputField}
                                            />
                                        </TouchableOpacity>

                                        <DatePicker
                                            modal
                                            open={datePickerOpen}
                                            date={new Date()}
                                            mode={"datetime"}
                                            minimumDate={new Date()}
                                            onConfirm={(date) => {
                                                setDatePickerOpen(false);
                                                console.log('Selected Date:', date);
                                                onChange(date);
                                            }}
                                            onCancel={() => {
                                                setDatePickerOpen(false);
                                            }}
                                        />
                                    </View>
                                )}
                                name="close_date"
                            />

                            {closeDateError ? (<Text style={{
                                color: colors.dangerRed
                            }}>{closeDateError}</Text>) : (<></>)}

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextAreaInputField
                                        placeholder={t('screens:description')}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        style={styles.inputField}
                                    />
                                )}
                                name="decription"
                                rules={{ required: false }}
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInputField
                                        label={t('screens:amount')}
                                        placeholder={t('screens:amount')}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType='numeric'
                                        style={styles.inputField}
                                    />
                                )}
                                name="amount"
                                rules={{ required: false }}
                            />
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionHeader}>{t('screens:status')}</Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <DropDownPicker
                                        open={oppoturnityStageOpen}
                                        value={oppoturnityStageValue}
                                        items={oppoturnityStageItems}
                                        listMode="SCROLLVIEW"
                                        zIndex={7000}
                                        setOpen={setOppoturnityStageOpen}
                                        setValue={setOppoturnityStageValue}
                                        setItems={setOppoturnityStageItems}
                                        placeholder={t('screens:selectStage')}
                                        onChangeValue={onChange}
                                        style={styles.inputField}
                                    />
                                )}
                                name="stage"
                            />
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <DropDownPicker
                                        open={forecastCategoryOpen}
                                        value={forecastCategoryValue}
                                        items={forecastCategoryItems}
                                        listMode="SCROLLVIEW"
                                        zIndex={6000}
                                        setOpen={setForecastCategoryOpen}
                                        setValue={setForecastCategoryValue}
                                        setItems={setForecastCategoryItems}
                                        placeholder={t('screens:selectForecastCategory')}
                                        onChangeValue={onChange}
                                        style={styles.inputField}
                                    />
                                )}
                                name="forecast"
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View>
                                        <TextInputField
                                            label={t('screens:probability')}
                                            placeholder={t('screens:probability')}
                                            onBlur={onBlur}
                                            onChangeText={(text) => {
                                                const num = parseFloat(text);
                                                if (num >= 0 && num <= 100 || text === '') {
                                                    onChange(text);
                                                }
                                            }}
                                            value={value}
                                            keyboardType='numeric'
                                            style={styles.inputField}
                                        />
                                        {errors.probability && (
                                            <Text style={stylesGlobal.errorMessage}>
                                                {t('screens:probabilityRange')}
                                            </Text>
                                        )}
                                    </View>
                                )}
                                name="probability"
                                rules={{
                                    validate: value => !value || (value >= 0 && value <= 100) || t('screens:probabilityRange')
                                }}
                            />
                        </View>

                        <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                            <ButtonText>  {t('screens:save')}</ButtonText>
                        </Button>


                    </View>
                </ScrollView>

                <BottomSheetModalProvider>
                    <View style={styles.containerBottomSheet}>
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
                                <Text style={styles.title}>{t('screens:addAccount')}</Text>

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
                                        <ButtonText>  {t('screens:addAccount')}</ButtonText>
                                    </Button>
                                </BasicView>
                            </BottomSheetScrollView>
                        </BottomSheetModal>
                    </View>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    card: {
        backgroundColor: colors.whiteBackground,
        padding: 20,
        margin: 10,
        borderRadius: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.darkGrey,
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16,
    },
    inputField: {
        marginBottom: 15,
        fontWeight: 'bold'
    },
    buttonAttach: {
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#5555',
        flexDirection: 'row',
    },
    containerBottomSheet: {
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
});

export default AddOpportunity;
