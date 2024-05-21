import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity,ScrollView, FlatList, StyleSheet,SafeAreaView, TextInput } from 'react-native';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../styles/global';
import { useTranslation } from 'react-i18next';
import { useSelector,RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getMyPastAssignedTasks, getMyCurrentAssignedTasks } from './TaskSlice';
import TaskList from '../../components/TaskList';
import FloatBtn from '../../components/FloatBtn';
import Search from '../../components/Search';



const Tasks = ({navigation}:any) => {

  const dispatch = useAppDispatch();
  const [filteredData, setFilterdData] = useState([]);
  const [search, setSearch] = useState("");
  const [masterData, setMasterData] = useState([]);


const {user } = useSelector(
  (state: RootStateOrAny) => state.user,
);

  const { loading, myAssignedCurrentTasks,myAssignedPastTasks } = useSelector(
    (state: RootStateOrAny) => state.tasks,
);

useEffect(() => {
  dispatch(getMyCurrentAssignedTasks({ userId: user.id, status: 'current' }));
  dispatch(getMyPastAssignedTasks({ userId: user.id, status: 'Past' }));
}, [])


    const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('current');
  // const searchMedicine = (text) => {
  //   if (text) {
  //     const newData = masterData.filter((item) => {
  //       const itemData = item.medicine
  //         ? item.medicine.toUpperCase()
  //         : "".toUpperCase();
  //       const textData = text.toUpperCase();
  //       return itemData.indexOf(textData) > -1;
  //     });
  //     setFilterdData(newData);
  //     setSearch(text);
  //   } else {
  //     setFilterdData(masterData);
  //     setSearch(text);
  //   }
  // };

  const toggleTab = () => {
    setActiveTab(activeTab === 'current' ? 'previous' : 'current');
  };

  const renderProviderItem = ({ item }:any) => (
    <View style={styles.itemlistContainer}>
      <TaskList navigation={navigation} item={item}/> 
    </View>
  );

  const stylesGlobal=globalStyles();

  return (
    
    <View
    style={[stylesGlobal.scrollBg,{flex:1}]}
    >
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleTab}
      >
        <Text style={[styles.buttonText, activeTab === 'current' ? styles.activeToggleText : null]}>
          {t('screens:current')}
        </Text>
        <Text style={[styles.buttonText, activeTab === 'previous' ? styles.activeToggleText : null]}>
         {t('sceens:previous')}
        </Text>
        
      </TouchableOpacity>
    
    <View style={styles.listContainer}>

      <>
        <Search placeholder="Search tasks"/>
        <FlatList
          data={activeTab === 'current'?myAssignedCurrentTasks:myAssignedPastTasks}
          renderItem={renderProviderItem}
          keyExtractor={(item) => item.id.toString()}
        />
       
        </>
      </View>
      </View>
       <FloatBtn
          onPress={() => { navigation.navigate('Add Task')}
           }
          iconType='add'
          />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {

    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 0,
    alignItems: 'center',
    marginBottom:60
    
  },
  toggleButton: {
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:colors.white,
  },
  activeToggleText: {
    color:colors.white,
    backgroundColor:colors.primary,
    borderRadius:20
     // Active text color
  },
  buttonText: {
    color:colors.primary,
    padding:10,
     marginRight:5
     // Default text color
  },
  listContainer: {
  },
  itemlistContainer:{ 
    flexDirection:'row',
    padding: 10,
    justifyContent:'center'
  },
});
export default Tasks;
