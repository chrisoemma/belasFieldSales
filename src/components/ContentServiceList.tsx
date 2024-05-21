import React from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../utils/colors';

const ContentServiceList = ({  data, toggleSubService, selectedSubServices,navigation }: any) => {


  const RenderItem = ({ item }: any) => (
    <TouchableOpacity 
    style={styles.contentItem}
    onPress={()=>{}}
    >
      <View style={{flexDirection:'row'}}>
      <Image
        source={require('./../../assets/images/banner-3.jpg')}
        style={{
          resizeMode: 'cover',
          width: 90,
          height:90,
          borderRadius: 10,
        }}
        
      />
      <View style={styles.textContainer}>
      <Text style={styles.categoryService}>Category-Service</Text>
      <Text style={styles.subservice}>{item.name}</Text>
      <Text style={styles.desc}>This shows how the description can be presented in this code</Text>
      </View>
      </View>
      <TouchableOpacity   style={[
          styles.addBtn,
          {
            backgroundColor: selectedSubServices.includes(item.name)
              ? colors.dangerRed
              : colors.secondary,
          },
        ]} 
      onPress={() => toggleSubService(item.name)}>
  <Text style={{ color: colors.white }}>
    {selectedSubServices.includes(item.name) ? 'Remove' : 'Add'}
  </Text>
</TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
     {data.map((item)=>(
      <RenderItem  
      item={item} 
      key={item.name.toString()}/>
     ))

     }
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
       flex: 1,
        paddingTop: 20,
        paddingVertical: 20,
      },
      contentContainer: {
       marginHorizontal:5
      },
      contentItem: {
        flex:1,
       padding: 10,
       margin:2,
       borderTopWidth:0.5,
      },
      textContainer:{
        margin:5
      },
      categoryService:{
        textTransform: 'uppercase',
        color:colors.secondary
      },
      service:{
        paddingTop:5
      },
      subservice:{
        paddingTop:5,
        fontWeight:'bold',
        color:colors.black
      },
      desc:{
       
      },
      addBtn:{
      alignSelf:'flex-end',
      padding:8,
      borderRadius:8,
      backgroundColor:colors.secondary
      },
      removeBtn: {
        alignSelf: 'flex-end',
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.dangerRed,
        marginTop: 5,
      },
      
});

export default ContentServiceList;
