import { StyleSheet } from 'react-native';
import { useSelector, RootStateOrAny } from 'react-redux';
import { colors } from '../utils/colors';

const globalStyles = () => {
  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const containerBackgroundColor = isDarkMode ? 'black' : colors.lightGrey;
  const scrollBgBackgroundColor = isDarkMode ? 'black' : colors.whiteBackground;
  const textInputColor = isDarkMode ? 'white' : 'black';
  const buttonText = isDarkMode ? colors.white : colors.primary;
  const borderColor = isDarkMode ? 'gray' : colors.lightGrey;
  const shadowColor = isDarkMode ? '#000' : 'transparent';

  const styles = StyleSheet.create({
    container: {
      backgroundColor: containerBackgroundColor,
      marginHorizontal: 16,
    },
    scrollBg: {
      height: '100%',
      backgroundColor: scrollBgBackgroundColor,
    },
    searchInput: {
      marginLeft: 15,
      padding: 10,
      fontSize: 16,
      color: textInputColor,
    },
    appView: {
      margin: 10,
    },
    dropdownStyles: {
      height: 60,
      borderRadius: 25,
      elevation: 2,
    },
    search: {
      height: 50,
      width: '72%',
      backgroundColor: colors.lightBlue,
      marginLeft: 10,
      borderRadius: 30,
    },
    searchText: {
      color: colors.white,
      fontSize: 17,
      marginLeft: 5,
    },
    searchContent: {
      flexDirection: 'row',
      marginLeft: 10,
      marginVertical: 15,
    },
    verticalLogo: {
      width: '60%',
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    horizontalLogo: {
      width: 150,
      height: 50,
    },
    centerView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    largeHeading: {
      fontFamily: 'Prompt-Black',
      textTransform: 'uppercase',
      fontSize: 60,
      textAlign: 'center',
      color: colors.primary,
    },
    mediumHeading: {
      fontFamily: 'Prompt-Bold',
      textTransform: 'capitalize',
      fontSize: 35,
      textAlign: 'left',
      justifyContent: 'flex-start',
      lineHeight: 40,
      color: colors.primary,
    },
    errorMessage: {
      color: colors.dangerRed,
      fontFamily: 'Prompt-Regular',
      marginBottom: 15,
    },
    separator: {
      borderWidth: 0.4,
      backgroundColor: borderColor,
      marginVertical: 8,
    },
    inputFieldTitle: {
      fontFamily: 'Prompt-Regular',
      color: textInputColor,
      fontSize: 16,
    },
    touchableOpacityPlain: {},
    touchablePlainTextSecondary: {
      fontFamily: 'Prompt-Regular',
      color: colors.secondary,
      fontSize: 16,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      height: 70,
      borderRadius: 6,
      justifyContent: 'center',
    },
    smallTransparentButton: {
      borderRadius: 4,
      justifyContent: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    primaryButtonText: {
      fontFamily: 'Prompt-Regular',
      color: buttonText,
      fontSize: 18,
      textAlign: 'center',
    },
    passwordInputContainer: {
      backgroundColor: 'white',
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 2,
    },
    passwordInputField: {
      fontFamily: 'Prompt-Regular',
      height: 65,
      fontSize: 14,
      width: '90%',
      paddingHorizontal: 10,
    },
    phoneInputContainer: {
      backgroundColor: 'white',
      width: '100%',
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      height: 65,
      marginBottom: 15,
    },
    phoneInputTextContainer: {
      paddingHorizontal: 10,
      marginHorizontal: 10,
      backgroundColor: colors.white,
    },
    phoneInputField: {
      fontFamily: 'Prompt-Regular',
      fontSize: 15,
      padding: 0,
    },
    radioButtonLabel: {
      fontFamily: 'Prompt-Regular',
      fontSize: 9,
      textAlign: 'center',
    },
    pickerInput: {
      backgroundColor: 'white',
      width: '100%',
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    marginTop10: {
      marginTop: 10,
    },
    marginTop20: {
      marginTop: 20,
    },
    marginTop30: {
      marginTop: 30,
    },
    marginTop60: {
      marginTop: 60,
    },
    uploadView: {
      marginTop: 30,
    },
    linkButton: {
      paddingLeft: 17,
      color: colors.primary,
      fontSize: 16,
    },
    uploadBtn: {
      marginVertical: 10,
      backgroundColor: colors.lightBlue,
      height: 40,
      width: '50%',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    attachmentDiv: {
      flexDirection: 'row',
    },
    textChange: {
      fontSize: 17,
      color: colors.lightBlue,
    },
    displayDoc: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      height: 150,
      width: 150,
    },
    pdf: {
      flex: 1,
      width: 200,
      height: 200,
    },
    mainContainer: {
      flexDirection: 'row',
    },
    side: {
      flexDirection: 'column',
      height: '100%',
      width: '25%',
      backgroundColor: colors.lightGrey,
    },
    sub: {
      flex: 1,
      flexDirection: 'column',
      paddingHorizontal: 5,
    },
    floatingButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      padding: 10,
      borderRadius: 5,
    },
    floatingBtnText: {
      color: colors.white,
      fontSize: 16,
    },
    circle: {
      width: 100,
      height: 100,
      borderRadius: 100,
      backgroundColor: '#F7F6FF',
      alignSelf: 'center',
    },
    chooseServiceBtn: {
      marginVertical: 5,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    chooseBtn: {
      marginHorizontal: 3,
      backgroundColor: colors.secondary,
      padding: 5,
      borderRadius: 5,
    },
    otherBtn: {
      marginHorizontal: 3,
      backgroundColor: colors.warningYellow,
      padding: 5,
      borderRadius: 5,
    },
    searchContainer: {
      width: '60%',
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 10,
      borderRadius: 20,
    },
  });

  return styles;
};

export { globalStyles };
