import { View, Text, SafeAreaView, Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/global'
import { colors } from '../../utils/colors'
import Icon from 'react-native-vector-icons/AntDesign';
import Divider from '../../components/Divider';
import { makePhoneCall } from '../../utils/utilts';
import { useTranslation } from 'react-i18next';

const Account = () => {


  const { t } = useTranslation();
  const stylesGlobal=globalStyles();


  const phoneNumber = '0672137313';
    return (
        <SafeAreaView
            style={stylesGlobal.scrollBg}
        >
            <View style={stylesGlobal.appView}>
                <View style={[stylesGlobal.circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>
                    <Image
                        source={require('../../../assets/images/profile.png')}
                        style={{
                            resizeMode: "cover",
                            width: 90,
                            height: 95,
                            borderRadius: 90,
                            alignSelf: 'center'
                        }}
                    />
                </View>
                <Text style={{color:colors.secondary,fontWeight:'bold',alignSelf:'center'}}>Frank John</Text>
               <View>
                <TouchableOpacity style={{flexDirection:'row',margin:10}}
                 onPress={() => makePhoneCall(phoneNumber)}
                >
                <Icon    
                  name="phone"
                  color={colors.black}
                  size={25}
                  />
                    <Text style={{paddingHorizontal:10}}>+255 672137313</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',marginHorizontal:10}}>
                <Icon    
                  name="mail"
                  color={colors.black}
                  size={25}
                  />
                    <Text style={{paddingLeft:10}}>Frank@gmail.com</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',marginHorizontal:10,marginTop:5}}>
                <Icon    
                  name="enviroment"
                  color={colors.black}
                  size={25}
                  />
                    <Text style={{paddingLeft:10}}>Mwenge,kijitonyama</Text>
                </TouchableOpacity>
               </View>
              <View style={{marginVertical:20}}>
              <Divider />
              </View>
              <TouchableOpacity style={{flexDirection:'row',marginHorizontal:10,marginTop:5}}>
                <Icon    
                  name="lock1"
                  color={colors.secondary}
                  size={25}
                  />
                    <Text style={{paddingLeft:10,fontWeight:'bold'}}>{t('screens:changePassword')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{flexDirection:'row',marginHorizontal:10,marginTop:10}}>
                <Icon    
                  name="logout"
                  color={colors.dangerRed}
                  size={25}
                  />
                    <Text style={{paddingLeft:10,fontWeight:'bold'}}>{t('navigate:logout')}</Text>
                </TouchableOpacity>
              
            </View>
        </SafeAreaView>
    )
}

export default Account