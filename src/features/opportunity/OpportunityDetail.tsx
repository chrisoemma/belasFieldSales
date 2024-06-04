import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid, Modal, useWindowDimensions, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { colors } from '../../utils/colors';
import { TextInputField } from '../../components/TextInputField';
import { globalStyles } from '../../styles/global';
import { formatDateToYYYYMMDD, formatDateToYYYYMMDDHHMM, formatNumber, transformDataToDropdownOptions, transformDataToDropdownOptionsLead } from '../../utils/utilts';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { getIndustries } from '../IndustryPositionSlice';
import { getOpportunityStages } from './OppoturnitySlice';
import { getForecastCategories } from '../forecastCategory/forecastCategorySlice';
import { TextAreaInputField } from '../../components/TextAreaInputField';
import { useTranslation } from 'react-i18next';

const OpportunityDetail = ({ route, navigation }) => {
    const { opportunity } = route.params;
    const dispatch = useDispatch();

    const { OpportunityStages } = useSelector((state) => state.Opportunities);
    const { forecastCategories } = useSelector((state) => state.forecastCategories);
    const { user } = useSelector((state) => state.user);
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: opportunity?.name || '',
            client_name: opportunity?.client?.name || '',
            description: opportunity.description || '',
            probability: opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.probability || '',
            amount: opportunity?.amount || '',
            close_date: opportunity?.close_date ? new Date(opportunity.close_date) : new Date(),
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
        Object.keys(opportunity).forEach((key) => {
            if (opportunity[key] !== null) setValue(key, opportunity[key]);
        });
    }, [opportunity, setValue]);

    const [status, setStatus] = useState(opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.stage);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { height } = useWindowDimensions();
    const { t } = useTranslation();

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        // dispatch(updateOpportunityStatus({ opportunityId: opportunity.id, status: newStatus }));
    };

    const onSubmit = (data) => {
        const updatedOpportunity = { ...opportunity, ...data };
        // dispatch(updateOpportunityDetails(updatedOpportunity));
        ToastAndroid.show('Opportunity details updated successfully', ToastAndroid.SHORT);
        setModalVisible(false);
        navigation.goBack();
    };

    const handleMarkComplete = () => {
        handleStatusChange('Complete');
    };

    const stylesGlobal = globalStyles();

    const [forecastCategoryOpen, setForecastCategoryOpen] = useState(false);
    const [forecastCategoryValue, setForecastCategoryValue] = useState(opportunity.forecast?.id || null);
    const [foreastCategorySourceItems, setForecastCategoryItems] = useState([]);

    const [oppoturnityStageOpen, setOppoturnityStageOpen] = useState(false);
    const [oppoturnityStageValue, setOppoturnityStageValue] = useState(opportunity.oppoturnityStage || null);
    const [oppoturnityStageItems, setOppoturnityStageItems] = useState([]);

    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const steps = [
        {
            title: "About",
            fields: [
                { name: "name", label: "Opportunity name", placeholder: "Enter Opportunity name", required: true },
                { name: "client_name", label: "Account", placeholder: "Enter Account Name", required: true },
                { name: "close_date", label: "Close Date", placeholder: "Close Date", type: "date" },
                { name: "description", label: "Description", placeholder: "Enter Description" },
                { name: "amount", label: "Amount", placeholder: "Enter Amount" },
            ],
        },
        {
            title: "Status",
            fields: [
                // { name: "Stage", label: "Select Stage", type: "dropdown", items: oppoturnityStageItems, open: oppoturnityStageOpen, value: oppoturnityStageValue, setOpen: setOppoturnityStageOpen, setValue: setOppoturnityStageValue, setItems: setOppoturnityStageItems, zIndex: 10000, placeholder: "Opportunity stage" },
                { name: "forecast Category", label: "Forecast Category", type: "dropdown", items: foreastCategorySourceItems, open: forecastCategoryOpen, value: forecastCategoryValue, setOpen: setForecastCategoryOpen, setValue: setForecastCategoryValue, setItems: setForecastCategoryItems, zIndex: 9000, placeholder: "Forecast Category" },
                { name: "probability", label: "Probability", placeholder: "Enter Probability %" },
            ],
        },
    ];




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
      
            //   dispatch(deleteOpportunity({ opportunityId: id }))
            //     .unwrap()
            //     .then(result => {
            //       if (result.status) {
            //         ToastAndroid.show(`${t('screens:deletedSuccessfully')}`, ToastAndroid.SHORT);
            //         navigation.navigate('Clients', {
            //           screen: 'Clients',
            //         });
            //       } else {
            //         setDisappearMessage(
            //           `${t('screens:requestFail')}`,
            //         );
            //         console.log('dont navigate');
            //       }
    
            //       console.log('resultsss', result)
            //     })
            //     .catch(rejectedValueOrSerializedError => {
            //       // handle error here
            //       console.log('error');
            //       console.log(rejectedValueOrSerializedError);
            //     });
            },
          },
        ]);

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
                                        console.log('Selected Date:', date); // Debugging log
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
                        rules={{ required: field.required || false }}
                    />
                );
            }
        });
    };

    return (
        <ScrollView style={stylesGlobal.scrollBg}>
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Opportunity Details</Text>
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
                            <Text style={styles.categoryHeader}>About</Text>
                            <Text style={styles.categoryDetail}>Opportunity Name: {opportunity.name}</Text>
                            <Text style={styles.categoryDetail}>Account: {opportunity?.client?.name}</Text>
                            <Text style={styles.categoryDetail}>Close Date: {formatDateToYYYYMMDD(opportunity.close_date)}</Text>
                            <Text style={styles.categoryDetail}>Amount: TSH {formatNumber(opportunity.amount, 2)}</Text>
                            <Text style={styles.categoryDetail}>Description: {opportunity.description}</Text>
                        </View>
                        
                        <View style={styles.category}>
                            <Text style={styles.categoryHeader}>Status</Text>
                            <Text style={styles.categoryDetail}>Stage: {opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.stage}</Text>
                            <Text style={styles.categoryDetail}>Probability: {opportunity?.opportunity_stages[opportunity?.opportunity_stages?.length - 1]?.probability}%</Text>
                            <Text style={styles.categoryDetail}>Forecast: {opportunity?.forecast?.name}</Text>
                        </View>
                    
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={styles.ownerName}> 👤 {opportunity?.owner?.name}</Text>
                            </View>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Status</Text>
                <View style={styles.statusContainer}>
                    {transformDataToDropdownOptionsLead(OpportunityStages)?.map((statusOption) => (
                        <TouchableOpacity
                            key={statusOption.value}
                            style={[
                                styles.statusButton,
                                status === statusOption.value && styles.selectedStatusButton,
                            ]}
                            onPress={() => handleStatusChange(statusOption.value)}
                        >
                            <Text
                                style={[
                                    styles.statusButtonText,
                                    status === statusOption.value && styles.selectedStatusButtonText,
                                ]}
                            >
                                {statusOption.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={styles.completeButton} onPress={handleMarkComplete}>
                    <Text style={styles.completeButtonText}>Mark Status as Complete</Text>
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
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalHeader}>{steps[currentStep].title}</Text>
                        <ScrollView style={styles.modalContent}>
                            {renderStepFields(steps[currentStep])}
                        </ScrollView>
                        <View style={styles.modalButtons}>
                            {currentStep > 0 && (
                                <TouchableOpacity onPress={() => setCurrentStep(currentStep - 1)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Previous</Text>
                                </TouchableOpacity>
                            )}
                            {currentStep < steps.length - 1 ? (
                                <TouchableOpacity onPress={() => setCurrentStep(currentStep + 1)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Next</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Save</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
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
});

export default OpportunityDetail;
