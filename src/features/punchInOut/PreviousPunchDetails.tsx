import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/global';
import { colors } from '../../utils/colors';
import MapView, { Marker } from 'react-native-maps';
import { useTranslation } from 'react-i18next';

const PreviousPunchDetails = ({ route }) => {
    const { record } = route.params;
    const date = record[0];
    const details = record[1];
    const records = details.records; // Extracting the records array from the details

    const stylesGlobal = globalStyles();

    const calculateTotalDuration = (punchRecords) => {
        let totalSeconds = 0;

        punchRecords.forEach(record => {
            const inTime = new Date(record.punch_in_time);
            const outTime = new Date(record.punch_out_time);
            totalSeconds += (outTime - inTime) / 1000; // Convert milliseconds to seconds
        });

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        return `${hours}H ${minutes}M ${seconds}S`;
    };

    const { t } = useTranslation();

    return (
        <FlatList
            data={records}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.dayRecord}>
                    <Text style={styles.dateText}>{new Date(item.punch_in_time).toDateString()}</Text>
                    <View style={styles.divPunch}>
                        <View style={styles.punchTimes}>
                            <View style={styles.innerTextPunch}>
                                <Text style={styles.timeText}>{t('screens:punchIn')}: {new Date(item.punch_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
                                <Text>{t('screens:punchIn')}</Text>
                            </View>
                            <View style={styles.verticalLine} />
                            <View style={styles.innerTextPunch}>
                                <Text style={styles.timeText}>{t('screens:punchOut')}: {new Date(item.punch_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
                                <Text>{t('screens:punchOut')}</Text>
                            </View>
                        </View>
                        <View style={styles.totalDuration}>
                            <Text>{t('screens:totalDuraion')}</Text>
                            <Text style={styles.boldText}>{calculateTotalDuration([item])}</Text>
                        </View>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: parseFloat(item.punch_in_location?.latitude),
                                longitude: parseFloat(item.punch_in_location?.longitude),
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker coordinate={{ latitude: parseFloat(item.punch_in_location?.latitude), longitude: parseFloat(item.punch_in_location?.longitude) }} title={t('screens:punchInLocation')} />
                            {item.punch_out_location?.latitude && item.punch_out_location?.longitude &&
                                <Marker coordinate={{ latitude: parseFloat(item.punch_out_location?.latitude), longitude: parseFloat(item.punch_out_location?.longitude) }} title={t('screens:punchOutLocation')} />
                            }
                        </MapView>
                    </View>
                </View>
            )}
            ListFooterComponent={() => (
                <View style={styles.totalDayDuration}>
                    <Text>{t('totalDurationAllPunches')}:</Text>
                    <Text style={styles.boldText}>{calculateTotalDuration(records)}</Text>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    dayRecord: {
        marginBottom: 20,
        backgroundColor: colors.lightGrey,
        padding: 10,
        borderRadius: 10,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.darkGrey
    },
    divPunch: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        elevation: 2
    },
    punchTimes: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    innerTextPunch: {
        alignItems: 'center',
        padding: 10
    },
    boldText: {
        fontWeight: 'bold'
    },
    verticalLine: {
        width: 1,
        height: '100%',
        backgroundColor: colors.grey
    },
    totalDuration: {
        marginTop: 10,
        alignItems: 'center'
    },
    totalDayDuration: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 10
    },
    map: {
        height: 200,
        marginTop: 10,
        borderRadius: 10
    },
    timeText: {
        fontSize: 16,
        color: colors.darkGrey,
        marginBottom: 5
    }
});

export default PreviousPunchDetails;
