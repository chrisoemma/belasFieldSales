import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/global'
import { colors } from '../../utils/colors'
import FloatBtn from '../../components/FloatBtn';

const MyBusiness = ({ navigation }: any) => {


    const data = [
        {
            id: 1,
            name: "Kusuka",
        },
        {
            id: 2,
            name: "Dread Lock",
        },
        {
            id: "1",
            name: "Sister Lock",
        }
    ]
    const stylesGlobal=globalStyles();

    const renderItem = ({ item }: any) => (

        <View style={styles.businessContainer}>
            <TouchableOpacity
                style={styles.business}
                onPress={() => navigation.navigate('Business Details')}
            >
                <Image
                    source={require('./../../../assets/images/Cleaning.jpg')}
                    style={{
                        resizeMode: 'cover',
                        width: 90,
                        height: 90,
                        borderRadius: 10,
                    }}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.categoryService}>Category</Text>
                    <Text style={styles.subservice}>Service</Text>
                    <Text style={styles.desc}>This shows how the description can be presented in this code</Text>
                </View>

            </TouchableOpacity>
        </View>

    )

    return (
        <View style={stylesGlobal.scrollBg}>
            <View style={stylesGlobal.appView}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />

                <FloatBtn
                    onPress={() => { navigation.navigate('Add Business') }
                    }
                    iconType='add'
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    businessContainer: {
        justifyContent: 'center'
    },

    business: {
        marginVertical: 8,
        alignItems: 'center',
        flexDirection: 'row',
        height: 150,
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 10
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
    subservice: {
        paddingTop: 5,
        fontWeight: 'bold',
        color: colors.black
    },
    desc: {
        paddingRight: '15%',
    }

})

export default MyBusiness