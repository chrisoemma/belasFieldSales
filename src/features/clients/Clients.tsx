import { View, ScrollView, StyleSheet, TouchableOpacity, Text, FlatList,TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { globalStyles } from '../../styles/global';
import FloatButton from '../../components/FloatBtn';
import { colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getClients } from './ClientSlice';
import Search from '../../components/Search';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getLocationName } from '../../utils/utilts';

const Clients = ({ navigation }: any) => {



    const [locationName, setLocationName] = useState('');
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { user } = useSelector(
        (state: RootStateOrAny) => state.user,
    );
    useEffect(() => {
        dispatch(getClients({ companyId: user?.company_id }));
    }, [])
    const { loading, clients } = useSelector(
        (state: RootStateOrAny) => state.clients,
    );


    const [searchQuery, setSearchQuery] = useState('');
    const [filteredClients, setFilteredClients] = useState(clients);

    const filterClients = (query) => {
        if (query) {
            const filtered = clients.filter((client) => {
                const clientName = client.name.toLowerCase();
                const clientPhoneNumber = client.phone_number.toLowerCase();
                return clientName.includes(query.toLowerCase()) || clientPhoneNumber.includes(query.toLowerCase());
            });
            setFilteredClients(filtered);
        } else {
            // If the search query is empty, show all clients
            setFilteredClients(clients);
        }
    };

    const stylesGlobal=globalStyles();

    const renderItem = ({ item }: any) => {
        return (

            <TouchableOpacity style={styles.touchableOpacityStyles}
                onPress={() => {
                    navigation.navigate('Single Client', {
                        client: item
                    })
                }}
            >
                <View>
                    <View style={styles.itemIconStyle}>
                        <Icon
                            name='assignment-ind'
                            color={colors.black}
                            size={20}
                        />

                        <Text style={{ color: colors.primary, marginLeft: 10 }}>{item.name}</Text>
                    </View>
                    <View style={styles.itemIconStyle}>
                        <Icon
                            name='phone'
                            color={colors.black}
                            size={20}
                        />
                        <Text style={{ paddingVertical: 5, marginLeft: 10 }}> {item.phone_number}</Text>
                    </View>
                    <View style={styles.itemIconStyle}>
                        <Icon
                            name='email'
                            color={colors.black}
                            size={20}
                        />
                        <Text style={{ paddingVertical: 5, marginLeft: 10 }}> {item.email}</Text>
                    </View>
                    <View style={styles.itemIconStyle}>
                        <Icon
                            name='room'
                            color={colors.black}
                            size={20}
                        />
                        <Text style={{ paddingVertical: 5, marginLeft: 10 }}>NULL</Text>
                    </View>
                </View>
                {/* <View style={styles.bottomView}>
                    <View style={{}}><Text ></Text></View>
                    <TouchableOpacity style={styles.status}>
                        <Text style={{ color: colors.white }}>Active</Text>
                    </TouchableOpacity>
                </View> */}
            </TouchableOpacity>
        )
    }

    return (
        <View style={[stylesGlobal.scrollBg, { flex: 1 }]}>
            <View style={[stylesGlobal.appView, { flex: 1 }]}>
                <View style={{ marginVertical: 10 }}>
                <View style={stylesGlobal.searchContainer}>
                    <TextInput
                        placeholder="Search clients"
                        style={stylesGlobal.input}
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
            </View>

            <FloatButton
                onPress={() => {
                    navigation.navigate('Add Client');
                }}
                iconType="add"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    touchableOpacityStyles: {

        //  height: 160,
        borderRadius: 18,
        padding: 10,
        width: '100%',
        // marginHorizontal:10,
        marginVertical: 8,
        backgroundColor: colors.white
    },
    bottomView: {
        flexDirection: 'row',
        paddingTop: 10,
        justifyContent: 'flex-end'
    },
    status: {
        backgroundColor: colors.secondary,
        marginHorizontal: 5,
        padding: 7,
        borderRadius: 10
    },
    itemIconStyle: {
        flexDirection: 'row'
    }
});

export default Clients;
