import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { TextInputField } from '../../components/TextInputField';
import { colors } from '../../utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { addLead } from './LeadSlice';
import { transformDataToDropdownOptions } from '../../utils/utilts';

const AddLead = ({ navigation }) => {
    const dispatch = useDispatch();
    const { control, handleSubmit } = useForm();
    const { loading: positionLoading, positions, industries } = useSelector(state => state.industriesPositions);
    
    const [leadSourceOpen, setLeadSourceOpen] = useState(false);
    const [leadSourceValue, setLeadSourceValue] = useState(null);
    const [leadSourceItems, setLeadSourceItems] = useState([
        { label: 'Source 1', value: 'source1' },
        { label: 'Source 2', value: 'source2' },
        // Add more lead sources here
    ]);

    const [industryOpen, setIndustryOpen] = useState(false);
    const [industryValue, setIndustryValue] = useState(null);
    const [industryItems, setIndustryItems] = useState([]);

    useEffect(() => {
  
        setIndustryItems(transformDataToDropdownOptions(industries));
    }, []);

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
                    rules={{ required: true }}
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
                    name="client_name"
                    rules={{ required: true }}
                />
                {/* Add similar Controller components for other fields in the "About" section */}
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
                    rules={{ required: true }}
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
                {/* Add similar Controller components for other fields in the "Get in touch" section */}
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
