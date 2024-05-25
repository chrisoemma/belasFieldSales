import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../../styles/global';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from '../../utils/colors';

const Leads = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const leads = [
        { id: '1', company: 'Company A', phone: '123-456-7890', status: 'status 1', created_at: '2023-05-01' },
        { id: '2', company: 'Company B', phone: '987-654-3210', status: 'status 2', created_at: '2023-05-02' },
        // Add more leads as needed
    ];
    const { t } = useTranslation();
    const stylesGlobal = globalStyles();

    const [filteredLeads, setFilteredLeads] = useState(leads);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { value: 'all', label: 'All' },
        { value: 'status 1', label: 'status 1' },
        { value: 'status 2', label: 'status 2' }
    ]);

    useEffect(() => {
        filterLeads(searchQuery, value);
    }, [searchQuery, value]);

    const filterLeads = (searchText, status) => {
        let filteredData = leads;

        if (searchText) {
            filteredData = filteredData.filter(item =>
                item.company.toLowerCase().includes(searchText.toLowerCase()) ||
                item.phone.includes(searchText) ||
                item.created_at.includes(searchText)
            );
        }

        if (status && status !== 'all') {
            filteredData = filteredData.filter(item => item.status === status);
        }

        setFilteredLeads(filteredData);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'status 1':
                return colors.successGreen;
            case 'status 2':
                return colors.dangerRed;
            default:
                return colors.darkGrey;
        }
    };

    const renderLeadItem = ({ item }) => (
        <TouchableOpacity style={styles.leadCard} onPress={() => navigation.navigate('LeadDetail', { lead: item })}>
            <View style={styles.leadHeader}>
                <Text style={styles.company}>{item.company}</Text>
                <Text style={styles.createdAt}>{item.created_at}</Text>
            </View>
            <Text style={styles.detail}>📞 {item.phone}</Text>
            <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[stylesGlobal.scrollBg, { flex: 1 }]}>
            <View style={[stylesGlobal.appView, { flex: 1 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ width: '40%' }}>
                        <DropDownPicker
                            open={open}
                            zIndex={6000}
                            value={value}
                            listMode="SCROLLVIEW"
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder="Select status"
                            containerStyle={{
                                marginLeft: 15,
                            }}
                        />
                    </View>
                    <View style={[stylesGlobal.searchContainer, { width: '53%' }]}>
                        <TextInput
                            placeholder="Search leads"
                            style={[stylesGlobal.input, { height: 50, marginVertical: 0 }]}
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                            }}
                        />
                    </View>
                </View>
                <FlatList
                    data={filteredLeads}
                    renderItem={renderLeadItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.leadList}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    leadCard: {
        backgroundColor: colors.white,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 3,
    },
    leadHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    company: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.darkGrey,
    },
    createdAt: {
        fontSize: 14,
        color: colors.grey,
    },
    detail: {
        fontSize: 16,
        color: colors.darkGrey,
        marginBottom: 3,
    },
    statusContainer: {
        alignSelf: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    statusText: {
        fontSize: 14,
        color: colors.white,
    },
    leadList: {
        paddingBottom: 20,
    },
});

export default Leads;
