import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../../styles/global';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from '../../utils/colors';
import FloatButton from '../../components/FloatBtn';
import { useAppDispatch } from '../../app/store';
import { useSelector, RootStateOrAny } from 'react-redux';
import { formatDateToYYYYMMDD, getStatusColor, transformDataToDropdownOptionsLead } from '../../utils/utilts';
import { getOpportunities, getOpportunityStages } from './OppoturnitySlice';

const Opportunities = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootStateOrAny) => state.user);
    const { OpportunityStages, Opportunities } = useSelector((state: RootStateOrAny) => state.Opportunities);

    useEffect(() => {
        dispatch(getOpportunityStages({ companyId: user?.company_id }));
        dispatch(getOpportunities({ companyId: user?.company_id }));
    }, [dispatch, user?.company_id]);

    const { t } = useTranslation();
    const stylesGlobal = globalStyles();

    const transformedOpportunityStages = transformDataToDropdownOptionsLead(OpportunityStages);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('all');
    const [items, setItems] = useState([{ value: 'all', label: 'All' }, ...transformedOpportunityStages]);

    useEffect(() => {
        filterOpportunities(searchQuery, value);
    }, [searchQuery, value, Opportunities]);

    const filterOpportunities = (searchText, stage) => {
        let filteredData = Opportunities;
    
        if (searchText) {
            filteredData = filteredData.filter(item =>
                item?.client?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                item?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                item?.created_at?.includes(searchText) ||
                item?.opportunity_stages?.stage?.toLowerCase().includes(searchText.toLowerCase())
            );
        }
    
        if (stage && stage !== 'all') {
            filteredData = filteredData.filter(item => 
                item.opportunity_stages.some(stageItem => stageItem.stage === stage)
            );
        }
    
        setFilteredOpportunities(filteredData);
    };



    const renderOpportunityItem = ({ item }) => {
      
        const latestStage = item.opportunity_stages.reduce((prev, curr) => {
            return (prev.level > curr.level) ? prev : curr;
        }, {});

        const latestStageLevel = OpportunityStages.find(stage => stage.name === latestStage.stage)?.level || 0;

        const maxLevel = Math.max(...OpportunityStages.map(stage => stage.level));
        const isLastStage = latestStageLevel === maxLevel;
        const stageLabel = isLastStage ? `${latestStage.stage} - ${latestStage.status}` : latestStage.stage;
    
        return (
            <TouchableOpacity style={styles.leadCard} onPress={() => navigation.navigate('OpportunityDetail', { opportunity: item })}>
                <View style={styles.leadHeader}>
                    <View>
                        <Text style={[styles.company, { color: colors.justGrey }]}>{item.name}</Text>
                        <Text style={styles.company}>{item.client.name}</Text>
                    </View>
                    <Text style={styles.createdAt}>{formatDateToYYYYMMDD(item.created_at)}</Text>
                </View>
                <Text style={styles.detail}>📅 {t('screens:close_date')}: {formatDateToYYYYMMDD(item.close_date)}</Text>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(latestStageLevel, latestStage.status, isLastStage) }]}>
                            <Text style={styles.statusText}>{stageLabel}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.ownerName}>👤 {item?.owner?.name}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    
    


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
                            placeholder={t('screens:selectStage')}
                            containerStyle={{
                                marginLeft: 15,
                            }}
                        />
                    </View>
                    <View style={[stylesGlobal.searchContainer, { width: '53%' }]}>
                        <TextInput
                            placeholder={t('screens:searchOpportunities')}
                            style={[stylesGlobal.input, { height: 50, marginVertical: 0 }]}
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                            }}
                        />
                    </View>
                </View>
                <FlatList
                    data={filteredOpportunities}
                    renderItem={renderOpportunityItem}
                    keyExtractor={item => item?.id?.toString()}
                    contentContainerStyle={styles.leadList}
                />
            </View>
            <FloatButton
                onPress={() => navigation.navigate('AddOpportunity')}
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
        color: colors.darkGrey,
    },
    detail: {
        fontSize: 14,
        color: colors.darkGrey,
        marginBottom: 5,
    },
    statusContainer: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    statusText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    ownerName: {
        fontSize: 14,
        color: colors.darkGrey,
    },
});

export default Opportunities;
