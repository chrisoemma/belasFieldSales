import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { TextInputField } from '../../components/TextInputField';
import { colors } from '../../utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { addLead, getLeadStatus } from './LeadSlice';
import { transformDataToDropdownOptions, transformDataToDropdownOptionsLead } from '../../utils/utilts';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../../styles/global';
import { TextAreaInputField } from '../../components/TextAreaInputField';

const AddLead = ({ navigation }:any) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const stylesGlobal = globalStyles();

    const { user } = useSelector((state) => state.user);
    const { loading: positionLoading, positions, industries } = useSelector(state => state.industriesPositions);
    const { leadStatuses, leads: leadsData } = useSelector((state: RootStateOrAny) => state.leads);
    const [leadSourceOpen, setLeadSourceOpen] = useState(false);
    const [leadSourceValue, setLeadSourceValue] = useState(null);
    const [leadSourceItems, setLeadSourceItems] = useState([
        { label: 'Source 1', value: 'source1' },
        { label: 'Source 2', value: 'source2' },
        // Add more lead sources here
    ]);


    const {
        control: control,
        handleSubmit: handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            company_name: '',
            title: '',
            website:'',
            descrption:'',
            phone_number:'',
            email:'',
            lead_status:''

        },
    });

    const [industryOpen, setIndustryOpen] = useState(false);
    const [industryValue, setIndustryValue] = useState(null);
    const [industryItems, setIndustryItems] = useState([]);
    const [leadStatusOpen, setLeadStatusOpen] = useState(false);
    const [leadStatusValue, setLeadStatusValue] = useState(null);
    const [leadStatusItems, setLeadStatusItems] = useState([]);

    useEffect(() => {
  
        setIndustryItems(transformDataToDropdownOptions(industries));
    }, []);

    useEffect(() => {
        dispatch(getLeadStatus({ companyId: user?.company_id }));
    }, [dispatch]);

    useEffect(() => {
        if (leadStatuses) {
            setLeadStatusItems(transformDataToDropdownOptionsLead(leadStatuses));
        }
    }, [leadStatuses]);

    const onSubmit = (data) => {
        dispatch(addLead(data));
        ToastAndroid.show('Lead added successfully', ToastAndroid.SHORT);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>About</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInputField
                            label="First Name"
                            placeholder="Enter First Name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.inputField}
                        />
                    )}
                    name="first_name"
                   
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInputField
                            label="Last Name"
                            placeholder="Enter Last Name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.inputField}
                        />
                    )}
                    name="last_name"
                    rules={{ required: true }}
                />
                   {errors.last_name && (
                                <Text style={stylesGlobal.errorMessage}>
                                    {t('screens:lastNameRequired')}
                                </Text>
                            )}
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInputField
                            label="Company"
                            placeholder="Enter Company Name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.inputField}
                        />
                    )}
                    name="company_name"
                    rules={{ required: true }}
                />
                    {errors.company_name && (
                                <Text style={stylesGlobal.errorMessage}>
                                    {t('screens:companyNameRequired')}
                                </Text>
                            )}

                          <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInputField
                            label={t('screens:title')}
                            placeholder={t('screens:title')}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.inputField}
                        />
                    )}
                    name="title"
                
                />
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
                                render={({ field: { onChange, value } }) => (
                                    <DropDownPicker
                                        open={leadStatusOpen}
                                        value={leadStatusValue}
                                        items={leadStatusItems}
                                        listMode="SCROLLVIEW"
                                        zIndex={7000}
                                        setOpen={setLeadStatusOpen}
                                        setValue={setLeadStatusValue}
                                        setItems={setLeadStatusItems}
                                        placeholder={t('screens:selectStatus')}
                                        onChangeValue={onChange}
                                        style={styles.inputField}
                                    />
                                )}
                                name="lead_status"
                            />
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Get in touch</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInputField
                            label="Phone"
                            placeholder="Enter Phone Number"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType='phone-pad'
                            style={styles.inputField}
                        />
                    )}
                    name="phone_number"
                 
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInputField
                            label="Email"
                            placeholder="Enter Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType='email-address'
                            style={styles.inputField}
                        />
                    )}
                    name="email"
                    rules={{ required: true }}
                />

            <Controller
                control={control}
                rules={{
                    required: 'Website URL is required',
                    pattern: {
                        value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/,
                        message: 'Enter a valid website URL',
                    }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                        <TextInputField
                            placeholder='Website'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType='url'
                            style={[styles.inputField]}
                        />
                        {errors.website && <Text style={stylesGlobal.errorMessage}>{t('screens:enterValidUrlStartHttp')}</Text>}
                    </View>
                )}
                name="website"
            />

                   
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Segment</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <DropDownPicker
                            open={leadSourceOpen}
                            value={leadSourceValue}
                            items={leadSourceItems}
                            listMode="SCROLLVIEW"
                            zIndex={7000}
                            setOpen={setLeadSourceOpen}
                            setValue={setLeadSourceValue}
                            setItems={setLeadSourceItems}
                            placeholder="Select lead source"
                            onChangeValue={onChange}
                            style={styles.inputField}
                        />
                    )}
                    name="lead_source"
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <DropDownPicker
                            open={industryOpen}
                            value={industryValue}
                            items={industryItems}
                            listMode="SCROLLVIEW"
                            zIndex={6000}
                            setOpen={setIndustryOpen}
                            setValue={setIndustryValue}
                            setItems={setIndustryItems}
                            placeholder="Select industry"
                            onChangeValue={onChange}
                            style={styles.inputField}
                        />
                    )}
                    name="industry"
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInputField
                            label="Number of Employees"
                            placeholder="Enter Number of Employees"
                            onBlur={onBlur}
                            listMode="SCROLLVIEW"
                            onChangeText={onChange}
                            value={value}
                            style={styles.inputField}
                        />
                    )}
                    name="number_employees"
                />
                {/* Add similar Controller components for other dropdowns and input fields in the "Segment" section */}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
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
        elevation: 3,
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
});

export default AddLead;
