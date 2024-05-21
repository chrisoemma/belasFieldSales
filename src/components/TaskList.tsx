import { View, Text,TouchableOpacity,StyleSheet,Dimensions } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'

const width = Dimensions.get('window').width;

const RequestList = ({item,navigation}:any) => {
  return (
    <TouchableOpacity style={styles.touchableOpacityStyles}
     onPress={()=>{navigation.navigate('Single Task',{
      task:item
     })}}
    >
      <View>
        <Text style={{color:colors.primary}}>{item.title}</Text>
        <Text style={{paddingVertical:10,color:colors.black}}>{item.assigned_to.name}</Text>
        <Text>{item.decription}</Text>
      </View>
      <View style={styles.bottomView}>
         <View style={{marginRight:'20%'}}><Text >{item.due_date}</Text></View>
         <TouchableOpacity style={[styles.status,{backgroundColor:colors.warningYellow}]}>
            <Text style={{color:colors.white}}>{item.priority}</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.status}>
            <Text style={{color:colors.white}}>{item.status}</Text>
         </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    touchableOpacityStyles: {
        
       
      //  height: 160,
         borderRadius: 18,
         padding:10,
         width:'100%',
       // marginHorizontal:10,
       // marginVertical: 8,
       backgroundColor:colors.white
    },
    bottomView:{
        flexDirection:'row',
        paddingTop:10
    },
    status:{
        alignItems:'flex-end',
        alignContent:'flex-end',
        justifyContent:'flex-end',
        backgroundColor:colors.secondary,
        marginHorizontal:5,
        padding:7,
        borderRadius:10
    }
})

export default RequestList