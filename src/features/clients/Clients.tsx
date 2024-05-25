import { View, ScrollView, StyleSheet, TouchableOpacity, Text, FlatList, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { globalStyles } from '../../styles/global';
import FloatButton from '../../components/FloatBtn';
import { colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getClients } from './ClientSlice';

import Icon from 'react-native-vector-icons/MaterialIcons';

const Clients = ({ navigation }) => {
    const [locationName, setLocationName] = useState('');
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { user } = useSelector((state: RootStateOrAny) => state.user);
    const { loading, clients } = useSelector((state: RootStateOrAny) => state.clients);

    useEffect(() => {
        dispatch(getClients({ companyId: user?.company_id }));
    }, [dispatch, user]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredClients, setFilteredClients] = useState(clients);

    useEffect(() => {
        setFilteredClients(clients);
    }, [clients]);

    const filterClients = (query) => {
        if (query) {
            const filtered = clients.filter((client) => {
                const clientName = client.name.toLowerCase();
                const clientPhoneNumber = client.phone_number.toLowerCase();
                return clientName.includes(query.toLowerCase()) || clientPhoneNumber.includes(query.toLowerCase());
            });
            setFilteredClients(filtered);
        } else {
            setFilteredClients(clients);
        }
    };

    const stylesGlobal = globalStyles();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.clientCard}
            onPress={() => {
                navigation.navigate('Single Client', {
                    client: item,
                });
            }}
        >
            <View style={styles.clientCardContent}>
                <View style={styles.iconRow}>
                    <Icon name='assignment-ind' color={colors.black} size={24} />
                    <Text style={styles.clientName}>{item.name}</Text>
                </View>
                <View style={styles.iconRow}>
                    <Icon name='phone' color={colors.black} size={24} />
                    <Text style={styles.clientDetail}>{item.phone_number}</Text>
                </View>
                <View style={styles.iconRow}>
                    <Icon name='email' color={colors.black} size={24} />
                    <Text style={styles.clientDetail}>{item.email}</Text>
                </View>
                <View style={styles.iconRow}>
                    <Icon name='room' color={colors.black} size={24} />
                    <Text style={styles.clientDetail}>Location: {item.location || 'Unknown'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[stylesGlobal.scrollBg, { flex: 1 }]}>
            <View style={[stylesGlobal.appView, { flex: 1 }]}>
                <View style={stylesGlobal.searchContainer}>
                    <TextInput
                        placeholder="Search clients"
                        style={stylesGlobal.input}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            filterClients(text);
                        }}
                    />
                </View>
                <FlatList
                    data={filteredClients}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?.id?.toString()}
                />
            </View>
            <FloatButton
                onPress={() => navigation.navigate('Add Client')}
                iconType="add"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    clientCard: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 3,
    },
    clientCardContent: {
        flexDirection: 'column',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    clientName: {
        color: colors.primary,
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    clientDetail: {
        fontSize: 16,
        marginLeft: 10,
    },
});

export default Clients;
