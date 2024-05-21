import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../styles/global'
import { colors } from '../../utils/colors'
import FloatBtn from '../../components/FloatBtn';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import { useSelector,RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getUserCheckIns } from './checkInSlice';
import { formatCheckinTime } from '../../utils/utilts';


const ActiveCheckIns = ({ navigation }: any) => {

    const { t } = useTranslation();
    const [refreshing, setRefreshing] = useState(false);

    const { user, loading: loadingUser } = useSelector((state: RootStateOrAny) => state.user);
    const { checkIns } = useSelector(
        (state: RootStateOrAny) => state.checkIns,
    );



    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getUserCheckIns({requestType: 'check_in', userId: user.id }));
    }, [])


    const callGetDashboard = React.useCallback(() => {

        setRefreshing(true);
        dispatch(getUserCheckIns({requestType: 'check_in', userId: user.id  })).unwrap()
        .then(result => {
            setRefreshing(false);
        })
   
    }, []);

    const stylesGlobal=globalStyles();



    const renderItem = ({ item }: any) => (

        <View style={styles.businessContainer}
          
        >
            <TouchableOpacity
                style={styles.business}
                onPress={() => navigation.navigate('Details',{
                    checkIn:item
                })}
            >
                <Image
                    source={item?.assets.length<1? require('./../../../assets/images/location.jpg'):{uri:item?.assets[0]?.url}}
                    style={{
                        resizeMode: 'cover',
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                    }}
                />
                <View style={styles.textContainer}>
                     <Text>{item?.client?.name}</Text>
                    <Text style={styles.categoryService}>{item?.title}</Text>
                    <Text style={styles.time}> 
                     <Icon
                name="clockcircleo"
                size={20} color={colors.black}
                style={{ marginHorizontal: 10 }}
                />  {formatCheckinTime(item?.checkin_time)}</Text>
                    <Text style={styles.desc}>
                    <Icon
                name="enviromento"
                size={20} color={colors.black}
                style={{ marginHorizontal: 10 }}
                /> 23 watsoba street dar es salaam
                </Text>
                
                </View>
            </TouchableOpacity>
            <View style={styles.btnContainer}>
            {/* <TouchableOpacity style={stylesGlobal.otherBtn}>
                        <Text style={{ color: colors.white }}>{t('navigate:tasks')}</Text>
                 </TouchableOpacity>
                <TouchableOpacity style={stylesGlobal.chooseBtn}>
                        <Text style={{ color: colors.white }}>{t('screens:logout')}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[stylesGlobal.otherBtn,{backgroundColor:colors.dangerRed}]}>
                        <Text style={{ color: colors.white }}>{t('screens:delete')}</Text>
                 </TouchableOpacity> */}
            </View>
        </View>

    )

    return (
        <View style={stylesGlobal.scrollBg}>
            <View style={[stylesGlobal.appView,{flex:1}]}>
                <View>
                <FlatList
                    data={checkIns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={callGetDashboard} />
                    }
                />
                </View>

                <FloatBtn
                    onPress={() => { navigation.navigate('Add CheckIn') }
                    }
                    iconType='add'
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    businessContainer: {
        backgroundColor: colors.white,
        justifyContent: 'center',
        marginVertical: 8,
        borderRadius: 10,
        paddingVertical:15,
        flex:1

    },
    btnContainer:{
     justifyContent:'flex-end',
     flexDirection:'row'
    },

    business: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
    
    },
    textContainer: {
        margin: 5
    },
    categoryService: {
        textTransform: 'uppercase',
        color: colors.secondary
    },
    service: {
        paddingTop: 5
    },
    time: {
        paddingTop: 5,
        fontWeight: 'bold',
        flexDirection:'row',
        color: colors.black
    },
    desc: {
        paddingRight: '15%',
    }

})

export default ActiveCheckIns