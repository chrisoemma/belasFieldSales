import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../../styles/global';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from '../../utils/colors';
import FloatButton from '../../components/FloatBtn';
import { useAppDispatch } from '../../app/store';
import { useSelector, RootStateOrAny } from 'react-redux';
import { getLeadStatus, getLeads } from './LeadSlice';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { formatDateToYYYYMMDD, transformDataToDropdownOptionsLead } from '../../utils/utilts';

const Leads = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootStateOrAny) => state.user);
    const { leadStatuses, leads: leadsData } = useSelector((state: RootStateOrAny) => state.leads);

    useEffect(() => {
        dispatch(getLeadStatus({ companyId: user?.company_id }));
        dispatch(getLeads({ companyId: user?.company_id }));
    }, [dispatch, user?.company_id]);

    const { t } = useTranslation();
    const stylesGlobal = globalStyles();

    const transformedLeadStatuses = transformDataToDropdownOptionsLead(leadStatuses);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('all');
    const [items, setItems] = useState([{ value: 'all', label: 'All' }, ...transformedLeadStatuses]);

   

    useEffect(() => {
        filterLeads(searchQuery, value);
    }, [searchQuery, value, leadsData]);

    const filterLeads = (searchText, status) => {
        let filteredData = leadsData;
    
        if (searchText) {
            filteredData = filteredData.filter(item =>
                item?.client_name?.toLowerCase().includes(searchText.toLowerCase()) ||
                item?.phone?.includes(searchText) ||
                item?.created_at?.includes(searchText) ||
                item?.lead_status?.status?.toLowerCase().includes(searchText.toLowerCase())
            );
        }
    
        if (status && status !== 'all') {
            filteredData = filteredData.filter(item => item.lead_status.status === status);
        }
    
        setFilteredLeads(filteredData);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New':
                return colors.successGreen;
            case 'Contacted':
                return colors.dangerRed;
            case 'Nurturing':
                return colors.warningYellow;
            case 'Qualified':
                return colors.infoBlue;
            case 'Unqualified':
                return colors.grey;
            default:
                return colors.darkGrey;
        }
    };

    const renderLeadItem = ({ item }) => (
        <TouchableOpacity style={styles.leadCard} onPress={() => navigation.navigate('LeadDetail', { lead: item })}>
            <View style={styles.leadHeader}>
                <Text style={styles.company}>{item.client_name}</Text>
                <Text style={styles.createdAt}>{formatDateToYYYYMMDD(item.created_at)}</Text>
            </View>
            <Text style={styles.detail}>📞 {item?.phone_number}</Text>
            <Text style={styles.detail}>📇 {item?.first_name} {item?.last_name}</Text>
            <View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.lead_status.status) }]}>
                <Text style={styles.statusText}>{item.lead_status.status}</Text>
               </View>
                <View style={{flexDirection:'row'}}>
               
                    <Text style={styles.ownerName}> 👤 {item.owner.name}</Text>
                </View>
                </View>
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
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.leadList}
                />
            </View>
            <FloatButton
                onPress={() => navigation.navigate('AddLead')}
                iconType="add"
            />
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
    ownerName: {
        fontSize: 14,
        color: colors.darkGrey,
    },
});

export default Leads;
