import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid, Modal, useWindowDimensions, Alert, Keyboard } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { colors } from '../../utils/colors';
import { TextInputField } from '../../components/TextInputField';
import { globalStyles } from '../../styles/global';
import { formatDateToYYYYMMDD, formatDateToYYYYMMDDHHMM, formatNumber, getStatusColor, transformDataToDropdownOptions, transformDataToDropdownOptionsClients, transformDataToDropdownOptionsLead } from '../../utils/utilts';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { deleteOpportunity, getOpportunityStages, updateOpportunity, updateOpportunityStage } from './OppoturnitySlice';
import { getForecastCategories } from '../forecastCategory/forecastCategorySlice';
import { TextAreaInputField } from '../../components/TextAreaInputField';
import { useTranslation } from 'react-i18next';
import { BasicView } from '../../components/BasicView';
import { createClient, getClients } from '../clients/ClientSlice';
import { ButtonText } from '../../components/ButtonText';

import Button from '../../components/Button';


const OpportunityDetail = ({ route, navigation }) => {
    const { opportunity } = route.params;
    const dispatch = useDispatch();

    const [selectedStages, setSelectedStages] = useState([]);
    const [isModalStageVisible, setModalStageVisible] = useState(false);
    const [outCome,setOutCome]=useState(opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.status);
    const [selectedOutcome, setSelectedOutcome] = useState(null);
    const { OpportunityStages } = useSelector((state) => state.Opportunities);
    const { forecastCategories } = useSelector((state) => state.forecastCategories);
  
    const { user } = useSelector((state) => state.user);
    const { loading: clientLoading, clients } = useSelector(
        (state: RootStateOrAny) => state.clients,
    );



    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            opportunity_name: opportunity?.name || '',
            client: JSON.stringify(opportunity?.client_id) || '',
            description: opportunity.description || '',
            probability: opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.probability || '',
            amount: opportunity?.amount || '',
            close_date: opportunity?.close_date ? new Date(opportunity.close_date) : new Date(),
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
        setForecastCategoryValue(JSON.stringify(opportunity?.forecast.id));
    }, [opportunity?.forecast.id]);

    useEffect(() => {
        setClientValue(JSON.stringify(opportunity?.client_id));
    }, [opportunity?.client_id]);


    useEffect(() => {
        dispatch(getClients({ companyId: user?.company_id }));
    }, []);

    useEffect(() => {
        if (clients) {
            setClientItems(transformDataToDropdownOptionsClients(clients));
        }
    }, [clients]);

    const handleOpportunityOutcome = (outComeData) => {
        setOutCome(outComeData)
        setSelectedOutcome(outComeData);
        setModalStageVisible(false);
    }

    useEffect(() => {
        const currentStageName = opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.stage;

        const currentStageIndex = OpportunityStages.findIndex(stage => stage.name === currentStageName);
        if (currentStageIndex !== -1) {
            const defaultSelectedStages = OpportunityStages.filter(stage => stage.level <= currentStageIndex + 1).map(stage => stage.id);
            setSelectedStages(defaultSelectedStages);
        }
    }, []);


    const [stage, setStage] = useState(opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.stage);
    const [modalVisible, setModalVisible] = useState(false);
    const [secondModalVisible, setSecondModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { height } = useWindowDimensions();
    const { t } = useTranslation();
    const [message, setMessage] = useState('');

    const setDisappearMessage = (message: any) => {
        setMessage(message);

        setTimeout(() => {
            setMessage('');
        }, 5000);
    };
     

    const stylesGlobal = globalStyles();

    const [forecastCategoryOpen, setForecastCategoryOpen] = useState(false);
    const [forecastCategoryValue, setForecastCategoryValue] = useState(opportunity.forecast?.id || null);
    const [foreastCategorySourceItems, setForecastCategoryItems] = useState([]);

    //const [oppoturnityStageOpen, setOppoturnityStageOpen] = useState(false);
    const [oppoturnityStageValue, setOppoturnityStageValue] = useState(opportunity.oppoturnityStage || null);
    const [oppoturnityStageItems, setOppoturnityStageItems] = useState([]);

    const [datePickerOpen, setDatePickerOpen] = useState(false);


    const [clientOpen, setClientOpen] = useState(false);
    const [clientValue, setClientValue] = useState(JSON.stringify(opportunity?.client_id) || null);
    const [clientItems, setClientItems] = useState([]);

    const steps = [
        {
            title: t('screens:about'),
            fields: [
                { name: "opportunity_name", label: t('screens:opportunity_name'), placeholder:t('screens:enterOpportunityName'), required: true },
                { name: "client", label: t('screens:account'), type: "dropdown-client", items: clientItems, open: clientOpen, value: clientValue, setOpen: setClientOpen, setValue: setClientValue, setItems: setClientItems, zIndex: 9000, placeholder: t('screens:selectAccount') },
                { name: "close_date", label: t('screens:close_date'), placeholder: "Close Date", type: "date" },
                { name: "description", label: t('screens:description'), placeholder: t('screens:description') },
                { name: "amount", label: t('screens:amount'), placeholder: t('screens:amount'), keyboardType: 'numeric' },
            ],
        },
        {
            title: t('screens:status'),
            fields: [

                { name: "forecast Category", label: t('screens:forecastCategory'), type: "dropdown", items: foreastCategorySourceItems, open: forecastCategoryOpen, value: forecastCategoryValue, setOpen: setForecastCategoryOpen, setValue: setForecastCategoryValue, setItems: setForecastCategoryItems, zIndex: 9000, placeholder: t('screens:forecastCategory') },
                { name: "probability", label: t('screens:probability'), placeholder: t('screens:probability'), keyboardType: 'numeric' },
            ],
        },
    ];


    const handleStageChange = (value) => {
        // setOutCome('Open');
         const selectedStage = OpportunityStages.find(stage => stage.id === value);
         const maxLevel = Math.max(...OpportunityStages.map(stage => stage.level));
         const isLastStage = selectedStage.level === maxLevel;
     
         setStage(selectedStage?.name);
         const newSelectedStages = OpportunityStages.filter(stage => stage.level <= selectedStage.level).map(stage => stage.id);
     
         setSelectedStages(newSelectedStages);
         if (isLastStage) {
             setModalStageVisible(true);
         }
     };
     
 
     const handleSecondModalOpen = () => {
         setSecondModalVisible(true);
     };
 
     const handleSecondModalClose = () => {
         setSecondModalVisible(false);
     };
 
 
     const onSubmit = (data) => {
         const updatedData = {
             amount: data?.amount,
             client: clientValue,
             company_id: user?.company_id,
             close_date: data.close_date ? data.close_date.toISOString() : '',
             updated_by: user?.id,
             decription: data.description,
             forecast: forecastCategoryValue,
             opportunity_name: data.opportunity_name,
             probability: data.probability,
             stage: opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.stage
 
         }
 
         dispatch(updateOpportunity({ data: updatedData, opportunityId: opportunity?.id }))
             .unwrap()
             .then((result) => {
                 if (result.status) {
                     setModalVisible(false);
                     ToastAndroid.show(t('screens:opportunityUpdatedSucessfully'), ToastAndroid.LONG);
                     navigation.goBack();
                 } else {
                     setDisappearMessage(
                         `${t('screens:requestFail')}`,
                     );
                   
                 }
 
             })
             .catch((error) => {
                 ToastAndroid.show(t('screens:failedToUpdateOpportunity'), ToastAndroid.SHORT);
             });
     };
 
     const handleMarkComplete = () => {
       
         const currentStage = OpportunityStages.find(stageOption => stageOption.name === stage);
         const maxLevel = Math.max(...OpportunityStages.map(stageOption => stageOption.level));
         const isLastStage = currentStage?.level === maxLevel;
         if (isLastStage && outCome=='Open') {
             setModalStageVisible(true);
             ToastAndroid.show(t('pleaseSelectOpportubityWonLost'), ToastAndroid.SHORT);
             return;
         }

         const latestOpportunityStage = opportunity.opportunity_stages.reduce((prev, curr) => {
            return (prev.level > curr.level) ? prev : curr;
        }, {});
         const isStageChanged = latestOpportunityStage.stage !== stage;
         const isStatusChanged = isLastStage ? latestOpportunityStage.status !== outCome : latestOpportunityStage.status !== 'Open';
     
         if (!isStageChanged && !isStatusChanged) {
             ToastAndroid.show(t('screens:noChangesDetected'), ToastAndroid.SHORT);
             return;
         }
     
         const data = {
             stage: stage,
             creator: user?.id,
             amount: opportunity?.amount,
             probability: opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.probability,
             status: isLastStage ? outCome : 'Open'
         };


 
         dispatch(updateOpportunityStage({ data, opportunityId: opportunity?.id }))
             .unwrap()
             .then((result) => {
                 if (result.status) {
                     setModalVisible(false);
                     ToastAndroid.show(t('screens:opportunityStageUpdated'), ToastAndroid.SHORT);
                     navigation.goBack();
                 } else {
                     setDisappearMessage(
                         `${t('screens:requestFail')}`,
                     );
                     console.log('Do not navigate');
                 }
             })
             .catch((error) => {
                 ToastAndroid.show(t('screens:failedUpdateOpportunityStage'), ToastAndroid.SHORT);
             });
     };


    const deleteFunc = (id) =>
        Alert.alert(`${t('screens:deleteOpportunity')}`, `${t('screens:areYouSureDelete')}`, [
            {
                text: `${t('screens:cancel')}`,
                onPress: () => console.log('Cancel client delete'),
                style: 'cancel',
            },
            {
                text: `${t('screens:ok')}`,
                onPress: () => {

                    const data = {
                        deleted_by: user.id
                    }


                    dispatch(deleteOpportunity({ opportunityId: id, data }))
                        .unwrap()
                        .then(result => {
                            if (result.status) {


                                ToastAndroid.show(`${t('screens:deletedSuccessfully')}`, ToastAndroid.SHORT);
                                navigation.navigate('Opportunities', {
                                    screen: 'Opportunities',
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


    const onSubmit2 = (data) => {

        dispatch(createClient({ data: data, companyId: user.company_id }))
            .unwrap()
            .then(result => {
                if (result.status) {
                    bottomSheetModalRef.current?.close();
                    ToastAndroid.show(`${t('screens:createdSuccessfully')}`, ToastAndroid.SHORT);
                    setSecondModalVisible(false);
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

    const renderStepFields = (step) => {
        return step.fields.map((field) => {
            if (field.type === "dropdown") {

                return (
                    <Controller
                        key={field.name}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <DropDownPicker
                                open={field.open}
                                value={value || field.value}
                                listMode="SCROLLVIEW"
                                items={field.items}
                                setOpen={field.setOpen}
                                setValue={(callback) => {
                                    field.setValue(callback);
                                    onChange(callback());
                                }}
                                setItems={field.setItems}
                                placeholder={field.placeholder}
                                defaultValue={forecastCategoryValue}
                                onChangeValue={onChange}
                                zIndex={field.zIndex}
                                containerStyle={{
                                    marginBottom: 15,
                                    zIndex: field.zIndex,
                                    elevation: 10,
                                    height: Math.min(height * 0.3, step.fields.length * 100),
                                }}
                            />
                        )}
                        name={field.name}
                    />
                );
            } else if (field.type === "dropdown-client") {
                return (
                    <>
                        <Controller
                            key={field.name}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <DropDownPicker
                                    open={field.open}
                                    value={value || field.value}
                                    listMode="SCROLLVIEW"
                                    items={field.items}
                                    setOpen={field.setOpen}
                                    searchable={true}

                                    setValue={(callback) => {
                                        field.setValue(callback);
                                        onChange(callback());
                                    }}
                                    setItems={field.setItems}
                                    placeholder={field.placeholder}
                                    defaultValue={clientValue}
                                    onChangeValue={onChange}
                                    zIndex={field.zIndex}
                                    containerStyle={{
                                        marginBottom: 15,
                                        zIndex: field.zIndex,
                                        elevation: 10,
                                    }}
                                />
                            )}
                            name={field.name}
                        />
                        <TouchableOpacity
                            onPress={handleSecondModalOpen}>
                            <Text style={{ color: colors.secondary, fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
                                {t('screens:addNewAccount')}
                            </Text>
                        </TouchableOpacity>
                    </>
                );
            } else if (field.type === "date") {

                return (
                    <Controller
                        key={field.name}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
                                    <TextInputField
                                        label={field.label}
                                        placeholder={field.placeholder}
                                        value={formatDateToYYYYMMDDHHMM(value)}
                                        editable={false}
                                        style={styles.inputField}
                                    />
                                </TouchableOpacity>

                                <DatePicker
                                    modal
                                    open={datePickerOpen}
                                    date={new Date(value) || new Date()}
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
                        name={field.name}
                    />
                );

            } else if (field.name === "description") {
                return (
                    <Controller
                        key={field.name}
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextAreaInputField
                                placeholder={field.placeholder}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                style={styles.inputField}
                            />
                        )}
                        name={field.name}
                        rules={{ required: field.required || false }}
                    />
                );
            } else if (field.name === "probability") {
                return (
                    <Controller
                        key={field.name}
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputField

                                placeholder={field.placeholder}
                                onBlur={onBlur}
                                value={value}
                                onChangeText={(text) => {
                                    const num = parseFloat(text);
                                    if (num >= 0 && num <= 100 || text === '') {
                                        onChange(text);
                                    }
                                }}

                                keyboardType={field.keyboardType || 'default'}
                                style={styles.inputField}

                            />
                        )}
                        name={field.name}
                        rules={{
                            validate: value => !value || (value >= 0 && value <= 100) || t('screens:probabilityRange')
                        }}
                    />
                );
            } else {
                return (
                    <Controller
                        key={field.name}
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputField
                                label={field.label}
                                placeholder={field.placeholder}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType={field.keyboardType || 'default'}
                                style={styles.inputField}

                            />
                        )}
                        name={field.name}
                        rules={
                            { required: field.required || false }}
                    />
                );
            }
        });
    };


          const latestStage = opportunity?.opportunity_stages.reduce((prev, curr) => {
            return (prev.level > curr.level) ? prev : curr;
        }, {});

        const latestStageLevel = OpportunityStages.find(stage => stage.name === latestStage.stage)?.level || 0;
        const maxLevel = Math.max(...OpportunityStages.map(stage => stage.level));
        const isLastStage = latestStageLevel === maxLevel;
        const stageLabel = isLastStage ? `${latestStage.stage} - ${latestStage.status}` : latestStage.stage;
    

    return (
        <ScrollView style={stylesGlobal.scrollBg}>
            <View style={styles.card}>
                <BasicView style={stylesGlobal.centerView}>
                    <Text style={stylesGlobal.errorMessage}>{message}</Text>
                </BasicView>
                <Text style={styles.sectionHeader}>{t('screens:OpportunityDetails')}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editButton}>
                        <Icon name="pencil" color={colors.white} size={22} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { deleteFunc(opportunity?.id) }} style={styles.deleteButton}>
                        <Icon name="trash-outline" color={colors.white} size={22} />
                    </TouchableOpacity>
                </View>
                <View style={styles.categoriesContainer}>
                    <View style={styles.row}>
                        <View style={styles.category}>
                            <Text style={styles.categoryHeader}>{t('screens:about')}</Text>
                            <Text style={styles.categoryDetail}>{t('screens:opportunityName')}: {opportunity.name}</Text>
                            <Text style={styles.categoryDetail}>{t('screens:account')}: {opportunity?.client?.name}</Text>
                            <Text style={styles.categoryDetail}>{t('screens:close_date')}: {formatDateToYYYYMMDD(opportunity.close_date)}</Text>
                            <Text style={styles.categoryDetail}>{t('screens:amount')}: TSH {formatNumber(opportunity?.amount, 2)}</Text>
                            <Text style={styles.categoryDetail}>{t('screens:status')}: {opportunity.description}</Text>
                        </View>

                        <View style={styles.category}>
                            <Text style={styles.categoryHeader}>{t('screens:status')}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text>{t('screens:stage')}:</Text>
                              <View style={{ backgroundColor: getStatusColor(latestStageLevel, latestStage.status, isLastStage) }}>
                              <Text style={[styles.categoryDetail,{color:colors.white,padding:2,borderRadius:5}]}> {stageLabel}</Text>
                              </View>
                            </View>
                            <Text style={styles.categoryDetail}>{t('screens:probability')}: {opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.probability}%</Text>
                            <Text style={styles.categoryDetail}>{t('screens:forecastCategory')}: {opportunity?.forecast?.name}</Text>
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text style={styles.ownerName}> 👤 {opportunity?.owner?.name}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
    <Text style={styles.sectionHeader}>{t('screens:stage')}</Text>
    <View style={styles.statusContainer}>
        {OpportunityStages.map((stage) => (
            <TouchableOpacity
                key={stage.id}
                style={[
                    styles.statusButton,
                    selectedStages.includes(stage.id) && styles.selectedStatusButton,
                    { flexDirection: 'row' }
                ]}
                onPress={() => handleStageChange(stage.id)}
            >
                {selectedStages.includes(stage.id) && (
                    <Text style={styles.checkmark}>✔</Text>
                )}
                <Text
                    style={[
                        styles.statusButtonText,
                        selectedStages.includes(stage.id) && styles.selectedStatusButtonText,
                    ]}
                >
                    {stage.name}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
    <TouchableOpacity style={styles.completeButton} onPress={handleMarkComplete}>
        <Text style={styles.completeButtonText}>{t('screens:markStageAsComplete')}</Text>
    </TouchableOpacity>
</View>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>{t('screens:close')}</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalHeader}>{steps[currentStep].title}</Text>
                        <ScrollView style={styles.modalContent}>
                            {renderStepFields(steps[currentStep])}
                        </ScrollView>
                        <View style={styles.modalButtons}>
                            {currentStep > 0 && (
                                <TouchableOpacity onPress={() => setCurrentStep(currentStep - 1)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>{t('screens:previous')}</Text>
                                </TouchableOpacity>
                            )}
                            {currentStep < steps.length - 1 ? (
                                <TouchableOpacity onPress={() => setCurrentStep(currentStep + 1)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>{t('screens:next')}</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>{t('screens:save')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={secondModalVisible}
                    onRequestClose={handleSecondModalClose}
                >

                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { width: '100%' }]}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setSecondModalVisible(false)}>
                                <Text style={styles.closeButtonText}>{t('screens:close')}</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalHeader}>{t('screens:addAccount')}</Text>
                            <ScrollView style={styles.modalContent}>

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

                            </ScrollView>

                            <BasicView>
                                <Button loading={clientLoading} onPress={handleSubmit2(onSubmit2)}>
                                    <ButtonText>  {t('screens:addAccount')}</ButtonText>
                                </Button>
                            </BasicView>
                        </View>
                    </View>
                </Modal>

                <Modal
            visible={isModalStageVisible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={[styles.closeButton, { marginBottom: 5 }]} onPress={() => setModalStageVisible(false)}>
                        <Text style={styles.closeButtonText}>{t('screens:close')}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.modalHeader, { marginTop: 30 }]}>{t('screens:isClosedAsWonLost')}</Text>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={[
                                styles.outcomeButton,
                                { backgroundColor: colors.successGreen, marginBottom: 50 },
                                selectedOutcome === 'Won' && styles.selectedButton,
                            ]}
                            onPress={() => handleOpportunityOutcome('Won')}
                        >
                            <Text style={styles.textClosed}>
                            {outCome === 'Won' && <Text style={[styles.checkmark,{fontSize:20}]}> ✓</Text>}
                                {t('screens:won')}
                               
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.outcomeButton,
                                { backgroundColor: colors.dangerRed },
                                selectedOutcome === 'Lost' && styles.selectedButton,
                            ]}
                            onPress={() => handleOpportunityOutcome('Lost')}
                        >
                            <Text style={styles.textClosed}>
                            {outCome === 'Lost' && <Text style={[styles.checkmark]}> ✓</Text>}
                                {t('screens:lost')}
                               
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
            </View>

        </ScrollView>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whiteBackground,
    },
    card: {
        backgroundColor: colors.white,
        padding: 20,
        margin: 10,
        borderRadius: 10,
        elevation: 3,
    },
    outcomeButton: {
        borderRadius: 30,
        padding:5,
        alignItems: 'center',
    },
    selectedButton: {
        borderWidth: 2,
        borderColor: 'white',
    },
    textClosed: {
        color: colors.white,
        padding: 15,
        fontSize: 20,
        alignSelf: 'center'
    },
    checkmark: {
        color: colors.white,
        marginRight: 10
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.darkGrey,
    },
    categoriesContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    category: {
        flex: 1,
        marginRight: 10,
    },
    categoryHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.darkGrey,
    },
    categoryDetail: {
        fontSize: 14,
        marginBottom: 5,
        color: colors.darkGrey,
    },
    statusContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    statusButton: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: colors.lightGrey,
    },
    selectedStatusButton: {
        backgroundColor: colors.primary,
    },
    statusButtonText: {
        color: colors.darkGrey,
    },
    selectedStatusButtonText: {
        color: colors.white,
    },
    completeButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    completeButtonText: {
        color: colors.white,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: colors.successGreen,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16,
    },
    editButton: {
        backgroundColor: colors.secondary,
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginHorizontal: 10
    },
    deleteButton: {
        backgroundColor: colors.dangerRed,
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    editButtonText: {
        color: colors.white,
        fontSize: 14,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: colors.whiteBackground,
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        color: colors.dangerRed,
        fontWeight: 'bold'
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.darkGrey,
    },
    modalContent: {
        width: '100%',
        marginBottom: 20,
    },
    modalButtons: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        margin: 5,
    },
    ownerName: {
        fontSize: 14,
        color: colors.darkGrey,
    },
    inputField: {
        marginBottom: 15,
    },
    modalButtonText: {
        color: colors.white,
        fontSize: 16,
    },
    containerBottomSheet: {
        margin: 10
    },
    contentContainer: {
        marginHorizontal: 10
    },
});

export default OpportunityDetail;
