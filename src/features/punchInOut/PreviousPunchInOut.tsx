import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { pickerDuration } from '../../utils/utilts';
import CustomPicker from '../../components/CustomPicker';
import { globalStyles } from '../../styles/global';
import { colors } from '../../utils/colors';
import { getPunchRecordsByDateRange } from './PunchRecordSlice';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { useTranslation } from 'react-i18next';

const PreviousPunchInOut = ({ navigation }) => {
    const [startDate, setStartDate] = useState(pickerDuration(1).formated_start);
    const [endDate, setEndDate] = useState(pickerDuration(1).formated_end);
    const [title, setTitle] = useState('Today');

    const { user } = useSelector((state: RootStateOrAny) => state.user);
    const { punchRecordsByDateRange } = useSelector((state: RootStateOrAny) => state.PunchRecords);

    const getSelectedPicker = (n, duration) => {
        if (n === "custom") {
            const { start, end } = duration;
            const title = `${start} to ${end}`;
            setTitle(title);
            setStartDate(start);
            setEndDate(end);
        } else {
            setTitle(duration);
            setStartDate(pickerDuration(n).formated_start);
            setEndDate(pickerDuration(n).formated_end);
        }
    };

    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        const data = {
            startDate: startDate,
            endDate: endDate
        };
        if (data) {
            dispatch(getPunchRecordsByDateRange({ data: data, userId: user?.id }));
        }
    }, [startDate, endDate, dispatch, user]);

    const calculateTotalHours = (punchIn, punchOut) => {
        const punchInTime = new Date(punchIn);
        const punchOutTime = new Date(punchOut);
        const diff = punchOutTime - punchInTime; // Difference in milliseconds
        return diff;
    };

    const millisecondsToHoursMinutesSeconds = (ms) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours}H ${minutes}M ${seconds}S`;
    };

    const groupPunchRecordsByDate = (records) => {
        const groupedRecords = {};
        let totalMilliseconds = 0;

        if (!records) return { groupedRecords, totalMilliseconds };

        Object.keys(records).forEach(date => {
            const dailyRecords = records[date];
            if (dailyRecords.length > 0) {
                const firstPunchIn = dailyRecords[0].punch_in_time;
                const lastPunchOut = dailyRecords[dailyRecords.length - 1].punch_out_time;
                let dailyTotalMilliseconds = 0;

                dailyRecords.forEach(record => {
                    if (record.punch_out_time) {
                        dailyTotalMilliseconds += calculateTotalHours(record.punch_in_time, record.punch_out_time);
                    }
                });

                groupedRecords[date] = {
                    firstPunchIn,
                    lastPunchOut,
                    totalHours: millisecondsToHoursMinutesSeconds(dailyTotalMilliseconds),
                    records: dailyRecords // Add daily records for detailed view
                };

                totalMilliseconds += dailyTotalMilliseconds;
            }
        });

        return { groupedRecords, totalMilliseconds };
    };

    const { groupedRecords: groupedPunchRecords, totalMilliseconds } = groupPunchRecordsByDate(punchRecordsByDateRange);
    const totalHours = millisecondsToHoursMinutesSeconds(totalMilliseconds);

    const stylesGlobal = globalStyles();

    const renderItem = ({ item }) => {
        const date = item[0];
        const record = item[1];
        const punchInTime = new Date(record.firstPunchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const punchOutTime = record.lastPunchOut ? new Date(record.lastPunchOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '---:---';
        const totalHrs = record.totalHours;
        const day = new Date(record.firstPunchIn).toLocaleDateString('en-US', { weekday: 'short' });

        return (
            <TouchableOpacity
                style={styles.divPunch}
                onPress={() => { navigation.navigate("previousPunchDetails", { record: item }) }}
            >
                <View style={styles.calenderCard}>
                    <View style={styles.textDiv}>
                        <Text style={styles.textNumber}>{new Date(record.firstPunchIn).getDate()}</Text>
                        <Text style={styles.textLetter}>{new Date(record.firstPunchIn).toString().split(' ')[0]}</Text>
                    </View>
                </View>
                <View style={styles.divTextPunch}>
                    <View style={styles.innerTextPunch}>
                        <Text style={{ fontWeight: 'bold' }}>{punchInTime}</Text>
                        <Text>{t('screens:punchIn')}</Text>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.innerTextPunch}>
                        <Text>{punchOutTime}</Text>
                        <Text>{t('screens:punchOut')}</Text>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.innerTextPunch}>
                        <Text>{totalHrs}</Text>
                        <Text>{t('screens:totalHours')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={stylesGlobal.scrollBg}>
            <CustomPicker getSelectedPicker={getSelectedPicker} />
            <View style={styles.title}>
                <Text>Punch records from {startDate} to {endDate}.</Text>
                <Text>Total Hours: {totalHours}</Text>
            </View>
            <FlatList
                data={Object.entries(groupedPunchRecords)}
                renderItem={renderItem}
                keyExtractor={(item) => item[0]}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    divPunch: {
        backgroundColor: colors.white,
        borderRadius: 30,
        flexDirection: 'row',
        elevation: 2,
        margin: 10,
        overflow: 'hidden',
    },
    textNumber: {
        color: colors.white,
        fontSize: 30,
        fontWeight: 'bold',
    },
    textLetter: {
        color: colors.white,
        fontSize: 18,
    },
    textDiv: {
        padding: 20,
    },
    calenderCard: {
        borderRadius: 15,
        backgroundColor: colors.primary,
        margin: 13,
        overflow: 'hidden',
    },
    divTextPunch: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
    },
    innerTextPunch: {
        padding: 10,
        alignItems: 'center',
    },
    verticalLine: {
        width: 1,
        height: '50%',
        backgroundColor: colors.grey,
        marginHorizontal: 2,
    },
    title: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default PreviousPunchInOut;
