import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const RadioButton = ({ radioArray, image, title, setRadioValue, radioValue }) => {
    
    return (
        <View style={styles.outerContainer}>
            <Text style={styles.chooseText}>{title}</Text>
            {radioArray.map((res) => (
                <View key={res.id} style={styles.container}>
                    <TouchableOpacity
                        style={styles.radioCircle}
                        onPress={() => {
                            setRadioValue(res.id)
                        }}
                    >
                        {radioValue === res.id && <View style={styles.selectedRb} />}
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.radioText}>{res.name}</Text>
                    </View>
                    <View style={{ flex: 1, alignContent: 'flex-end', marginLeft: 50 }}>
                        {image &&
                            (<Image
                                source={{ uri: res.img_url }}
                                resizeMode="contain"
                                style={{
                                    width: 35,
                                    height: 40,

                                }}
                            />)
                        }
                    </View>
                </View>
            ))}
        </View>
    );
};


const styles = StyleSheet.create({


    outerContainer: {
        marginHorizontal: 5
    },
    container: {
        flexDirection: 'row',
        marginBottom: 15,


    },
    chooseText: {
        fontSize: 17,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    radioText: {
        fontSize: 16,
        color: '#000',

    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#616161',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12

    },
    selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 50,
        backgroundColor: '#616161',
    }
});

export default RadioButton;
