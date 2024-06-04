import React, { useState, useEffect,useRef,useMemo,useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { TextInputField } from '../../components/TextInputField';
import { colors } from '../../utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { formatDateToYYYYMMDDHHMM, transformDataToDropdownOptions, transformDataToDropdownOptionsClients } from '../../utils/utilts';
import { globalStyles } from '../../styles/global';
import { getOpportunityStages } from './OppoturnitySlice';
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
          name: '',
          amount: '',
          probability: ''
        },
      });

    const dispatch = useDispatch();
   
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [sheetTitle, setSheetTitle] = useState('');

    const [clientOpen, setClientOpen] = useState(false);
    const [clientValue, setClientValue] = useState(null);
    const { OpportunityStages } = useSelector((state) => state.Opportunities);
    const { forecastCategories } = useSelector((state) => state.forecastCategories);
    const { user } = useSelector((state) => state.user);
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
            setOppoturnityStageItems(transformDataToDropdownOptions(OpportunityStages));
        }
    }, [OpportunityStages]);

    useEffect(() => {
        if (forecastCategories) {
            setForecastCategoryItems(transformDataToDropdownOptions(forecastCategories));
        }
    }, [forecastCategories]);


    useEffect(() => {
        dispatch(getClients({ companyId: user?.company_id }));
    }, [])


    const { t } = useTranslation();

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        // dispatch(updateOpportunityStatus({ opportunityId: opportunity.id, status: newStatus }));
    };

    const onSubmit = (data) => {

          console.log('dataaa test',data)
          return 
        ToastAndroid.show('Opportunity details updated successfully', ToastAndroid.SHORT);
        navigation.goBack();
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



    const [forecastCategoryOpen, setForecastCategoryOpen] = useState(false);
    const [forecastCategoryValue, setForecastCategoryValue] = useState(null);
    const [forecastCategoryItems, setForecastCategoryItems] = useState([]);

    const [oppoturnityStageOpen, setOppoturnityStageOpen] = useState(false);
    const [oppoturnityStageValue, setOppoturnityStageValue] = useState(null);
    const [oppoturnityStageItems, setOppoturnityStageItems] = useState([]);

    const [datePickerOpen, setDatePickerOpen] = useState(false);


    const snapPoints = useMemo(() => ['25%', '70%'], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {

        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, [])

    return (
        <>
            <GestureHandlerRootView>
            <ScrollView
          style={[stylesGlobal.scrollBg,{backgroundColor:colors.white}]}
        >
          <View>
                        <View style={styles.card}>
                            <Text style={styles.sectionHeader}>About</Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInputField
                                        label="name"
                                        placeholder="Enter name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        style={styles.inputField}
                                    />
                                )}
                                name="name"
                                rules={{ required: true }}
                            />
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
                                    style={{ marginLeft: 10, marginBottom:10}}
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
                                                label="Close Date"
                                                placeholder="Close Date"
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



                            <Controller

                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextAreaInputField
                                        placeholder="Description"
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
                                        label="Amount"
                                        placeholder="Enter Amount"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        style={styles.inputField}
                                    />
                                )}
                                name="amount"
                                rules={{ required: false }}
                            />

                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionHeader}>Status</Text>
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
                                        placeholder="Select opportunity stage"
                                        onChangeValue={onChange}
                                        style={styles.inputField}
                                    />
                                )}
                                name="opportunity_stage"
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
                                        placeholder="Select forecast category"
                                        onChangeValue={onChange}
                                        style={styles.inputField}
                                    />
                                )}
                                name="forecast_category"
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInputField
                                        label="Probability"
                                        placeholder="Enter Probability"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType='phone-pad'
                                        style={styles.inputField}
                                    />
                                )}
                                name="probability"
                                rules={{ required: false }}
                            />

                        </View>




                        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>


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
