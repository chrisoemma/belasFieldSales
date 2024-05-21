import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../styles/global'
import FloatButton from '../../components/FloatBtn'
import { colors } from '../../utils/colors'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { deleteTask, updateTaskStatus } from './TaskSlice'
import { BasicView } from '../../components/BasicView'

const SingleTask = ({ navigation, route }: any) => {

  const { task } = route.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const[message,setMessage]=useState('');

  useEffect(() => {

    if (task.title) {
      navigation.setOptions({
        title: `${task.title}`,
      });
    }
  }, [route.params]);

  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const removeTask = (id) =>
    Alert.alert(`${t('screens:deleteTask')}`, `${t('screens:areYouWantToDelete')}`, [
      {
        text: `${t('screens:cancel')}`,
        onPress: () => console.log('Cancel task delete'),
        style: 'cancel',
      },
      {
        text: `${t('screens:ok')}`,
        onPress: () => {
          dispatch(deleteTask({taskId:id}))
          .unwrap()
          .then(result => {
            if (result.status) {
        
              ToastAndroid.show(`${t('screens:taskDeletedSuccessfully')}`, ToastAndroid.SHORT);
              navigation.navigate('Tasks', {
                screen: 'Tasks',
              });
            } else {
              setDisappearMessage(
                `${t('screens:requestFail')}`,
              );
              console.log('dont navigate');
            }
          })
          .catch(rejectedValueOrSerializedError => {
            // handle error here
            console.log('error');
            console.log(rejectedValueOrSerializedError);
          });
        },
      },
    ]);



  const data ={};
    const changeTaskStatus = (status) =>
    Alert.alert(`${t('screens:changeTask')}`, `${t('screens:areYouWantChangeStatusTo')} ${status}`, [
      {
        text: `${t('screens:cancel')}`,
        onPress: () => console.log('Status changes'),
        style: 'cancel',
      },
      {
        text: `${t('screens:ok')}`,
        onPress: () => {
            data.status=status
          dispatch(updateTaskStatus({data:data,taskId:task.id}))
          .unwrap()
          .then(result => {
            if (result.status) {
        
              ToastAndroid.show(`${t('screens:taskUpdatedSuccessfully')}`, ToastAndroid.SHORT);
              navigation.navigate('Tasks', {
                screen: 'Tasks',
              });
            } else {
              setDisappearMessage(
                `${t('screens:requestFail')}`,
              );
              console.log('dont navigate');
            }
          })
          .catch(rejectedValueOrSerializedError => {
            // handle error here
            console.log('error');
            console.log(rejectedValueOrSerializedError);
          });
        },
      },
    ]);

    const stylesGlobal=globalStyles();

  return (
    <ScrollView
      style={stylesGlobal.scrollBg}
    >
      <View style={stylesGlobal.appView}>
      <BasicView style={stylesGlobal.centerView}>
              <Text style={stylesGlobal.errorMessage}>{message}</Text>
      </BasicView>
        <View>
          <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'flex-end' }}>
            {task.status !== 'Completed' ? (
              <TouchableOpacity>
                <Menu>
                  <MenuTrigger style={{ backgroundColor: colors.alsoLightGrey }}>
                    <Text style={{ padding: 5, fontWeight: 'bold' }}>{t('screens:markTask')}</Text>
                  </MenuTrigger>
                  <MenuOptions>
                    {task.status == 'Pending' ? (
                      <MenuOption onSelect={() => changeTaskStatus(`${t('screens:inProgress')}`)} >
                        <Text style={{ color: colors.warningYellow }}>{t('screens:inProgress')}</Text>
                      </MenuOption>
                    ) : <></>}
                    {task.status == 'Pending' || task.status == 'In Progress' ? (
                      <MenuOption onSelect={() => changeTaskStatus(`${t('screens:completed')}`)} >
                        <Text style={{ color: colors.successGreen }}>{t('screens:completed')}</Text>
                      </MenuOption>
                    ) : <></>}
                  </MenuOptions>
                </Menu>
              </TouchableOpacity>
            ) : <></>}
            {task.status !== 'Completed' || task.status !== 'In Progress' ? (
              <TouchableOpacity style={{ marginLeft: '25%', marginRight: '10%' }}>
                <Menu>
                  <MenuTrigger style={{ backgroundColor: colors.alsoLightGrey }}>
                    <Text style={{ padding: 5, fontWeight: 'bold' }} >{t('screens:action')}</Text>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption onSelect={() => navigation.navigate('Add Task',{
                      task:task
                    })} >
                      <Text style={{ color: colors.warningYellow }}>{t('screens:edit')}</Text>
                    </MenuOption>
                    <MenuOption onSelect={() =>removeTask(task.id)} >
                      <Text style={{ color: colors.dangerRed }}>{t('screens:delete')}</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </TouchableOpacity>
            ) : <></>}
          </View>

          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Title:</Text>
          <Text style={{ fontSize: 15 }}>{task.title}</Text>

          <Text style={{ paddingVertical: 10, color: colors.black }}>{t('screens:assingedTo')}: {task.assigned_to.name}</Text>

          <Text style={{ color: colors.black }}>{t('screens:assingedBy')}: {task.assigned_by.name}</Text>
          <Text style={{ paddingVertical: 10 }}>{t('screens:description')}: {task.decription}</Text>
        </View>
        <View style={styles.bottomView}>
          <View style={{ marginRight: '20%' }}><Text >{t('screens:dueDate')}: </Text></View>
          <View style={{ marginRight: '20%' }}><Text style={{ fontWeight: 'bold' }} >{task.due_date}</Text></View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity style={[styles.status, { backgroundColor: colors.warningYellow }]}>
            <Text style={{ color: colors.white }}>{task.priority}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.status}>
            <Text style={{ color: colors.white }}>{task.status}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bottomView: {
    //  flexDirection:'row',
    paddingTop: 10
  },
  status: {
    aligntasks: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: colors.secondary,
    marginHorizontal: 5,
    padding: 7,
    borderRadius: 10
  }
})

export default SingleTask