import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';

const FloatButton = ({ onPress, iconType }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPress}
        style={styles.button}
      >
        <Ionicons name={iconType} color={colors.white} size={25} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50, 
    right: 20,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: colors.secondary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FloatButton;
