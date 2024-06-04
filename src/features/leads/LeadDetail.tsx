import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { updateLeadStatus, updateLeadDetails } from './LeadSlice';
import { colors } from '../../utils/colors';
import { TextInputField } from '../../components/TextInputField';
import { globalStyles } from '../../styles/global';
import { transformDataToDropdownOptions, transformDataToDropdownOptionsLead } from '../../utils/utilts';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { getIndustries } from '../IndustryPositionSlice';

const LeadDetail = ({ route, navigation }) => {
    const { lead } = route.params;
    const dispatch = useDispatch();
    const { leadStatuses } = useSelector(state => state.leads);
    const { loading: positionLoading, positions, industries } = useSelector(state => state.industriesPositions);

    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            first_name: lead.first_name || '',
            last_name: lead.last_name || '',
            client_name: lead.client_name || '',
            title: lead.title || '',
            description: lead.description || '',
            website: lead.website || '',
            phone_number: lead.phone_number || '',
            email: lead.email || '',
            country_id: lead.country_id || '',
            lead_source: lead.lead_source || '',
            industry: lead.industry || '',
            number_employees: lead.number_employees || '',
        },
    });

    useEffect(() => {
        dispatch(getIndustries());
    }, [dispatch]);

    useEffect(() => {
        if (industries) {
            setIndustryItems(transformDataToDropdownOptions(industries));
        }
    }, [industries]);

    useEffect(() => {
        Object.keys(lead).forEach((key) => {
            if (lead[key] !== null) setValue(key, lead[key]);
        });
    }, [lead, setValue]);

    const [status, setStatus] = useState(lead.lead_status.status);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        dispatch(updateLeadStatus({ leadId: lead.id, status: newStatus }));
    };

    const onSubmit = (data) => {
        const updatedLead = { ...lead, ...data };
        dispatch(updateLeadDetails(updatedLead));
        ToastAndroid.show('Lead details updated successfully', ToastAndroid.SHORT);
        setModalVisible(false);
        navigation.goBack();
    };

    const handleMarkComplete = () => {
        handleStatusChange('Complete');
    };

    const stylesGlobal = globalStyles();

    const [leadSourceOpen, setLeadSourceOpen] = useState(false);
    const [leadSourceValue, setLeadSourceValue] = useState(lead.lead_source || null);
    const [leadSourceItems, setLeadSourceItems] = useState([
        { label: 'Source 1', value: 'source1' },
        { label: 'Source 2', value: 'source2' },
        // Add more lead sources here
    ]);

    const [industryOpen, setIndustryOpen] = useState(false);
    const [industryValue, setIndustryValue] = useState(lead.industry || null);
    const [industryItems, setIndustryItems] = useState([]);

    const steps = [
        {
            title: "About",
            fields: [
                { name: "first_name", label: "First Name", placeholder: "Enter First Name", required: true },
                { name: "last_name", label: "Last Name", placeholder: "Enter Last Name", required: true },
                { name: "client_name", label: "Company", placeholder: "Enter Company Name", required: true },
                { name: "title", label: "Title", placeholder: "Enter Title" },
                { name: "description", label: "Description", placeholder: "Enter Description" },
                { name: "website", label: "Website", placeholder: "Enter Website" },
            ]
        },
        {
            title: "Get in touch",
            fields: [
                { name: "phone_number", label: "Phone", placeholder: "Enter Phone Number", required: true, keyboardType: 'phone-pad' },
                { name: "email", label: "Email", placeholder: "Enter Email", required: true, keyboardType: 'email-address' },
                { name: "country_id", label: "Country ID", placeholder: "Enter Country ID" },
            ]
        },
        {
            title: "Segment",
            fields: [
                { name: "lead_source", label: "Lead Source", type: "dropdown", items: leadSourceItems, open: leadSourceOpen, value: leadSourceValue, setOpen: setLeadSourceOpen, setValue: setLeadSourceValue, setItems: setLeadSourceItems, zIndex: 6000, placeholder: "Select lead source" },
                { name: "industry", label: "Industry", type: "dropdown", items: industryItems, open: industryOpen, value: industryValue, setOpen: setIndustryOpen, setValue: setIndustryValue, setItems: setIndustryItems, zIndex: 5000, placeholder: "Select  industry" },
                { name: "number_employees", label: "Number of Employees", placeholder: "Enter Number of Employees" },
            ]
        },
    ];

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
                                onChangeValue={onChange}
                                zIndex={field.zIndex}
                                containerStyle={{
                                    marginBottom: 15,
                                    zIndex: field.zIndex,  
                                }}
                            />
                        )}
                        name={field.name}
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
                <Text style={styles.sectionHeader}>Lead Details</Text>
                  <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                  <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editButton}>
                    <Icon name="pencil" color={colors.white} size={22} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.deleteButton}>
                    <Icon name="trash-outline" color={colors.white} size={22} />
                </TouchableOpacity>
                  </View>
                <View style={styles.categoriesContainer}>
                    <View style={styles.row}>
                        <View style={styles.category}>
                            <Text style={styles.categoryHeader}>About</Text>
                            <Text style={styles.categoryDetail}>First Name: {lead.first_name}</Text>
                            <Text style={styles.categoryDetail}>Last Name: {lead.last_name}</Text>
                            <Text style={styles.categoryDetail}>Company: {lead.client_name}</Text>
                            <Text style={styles.categoryDetail}>Title: {lead.title}</Text>
                            <Text style={styles.categoryDetail}>Description: {lead.description}</Text>
                            <Text style={styles.categoryDetail}>Website: {lead.website}</Text>
                        </View>
                        <View style={styles.category}>
                            <Text style={styles.categoryHeader}>Get in touch</Text>
                            <Text style={styles.categoryDetail}>Phone: {lead.phone_number}</Text>
                            <Text style={styles.categoryDetail}>Email: {lead.email}</Text>
                            <Text style={styles.categoryDetail}>Country: {lead.country_id}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.category}>
                            <Text style={styles.categoryHeader}>Segment</Text>
                            <Text style={styles.categoryDetail}>Lead Source: {lead.lead_source}</Text>
                            <Text style={styles.categoryDetail}>Industry: {lead.industry}</Text>
                            <Text style={styles.categoryDetail}>Number of Employees: {lead.number_employees}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Status</Text>
                <View style={styles.statusContainer}>
                    {transformDataToDropdownOptionsLead(leadStatuses)?.map((statusOption) => (
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
        borderRadius:20,
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginHorizontal:10
    },
    deleteButton:{
        backgroundColor: colors.dangerRed,
        padding: 10,
        borderRadius:20,
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
        color: colors.darkGrey,
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
    inputField: {
        marginBottom: 15,
    },
    modalButtonText: {
        color: colors.white,
        fontSize: 16,
    },
});

export default LeadDetail;
