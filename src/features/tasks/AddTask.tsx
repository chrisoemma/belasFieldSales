import { View, Text, SafeAreaView, TouchableOpacity, ToastAndroid, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../styles/global';
import { colors } from '../../utils/colors';
import { BasicView } from '../../components/BasicView';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useForm, Controller } from 'react-hook-form';
import { TextInputField } from '../../components/TextInputField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import RadioButton from '../../components/RadioButton';
import DatePicker from 'react-native-date-picker'
import { extractIdAndName, getTime, getdate, transformDataToDropdownOptions } from '../../utils/utilts';
import { useSelector,RootStateOrAny } from 'react-redux';
import { getSalesPeople } from '../SalesPeopleSlice';
import { useAppDispatch } from '../../app/store';
import { createTask, updateTask } from './TaskSlice';

const AddTask = ({navigation,route}:any) => {

 const [task,setTask]=useState(null);

 const { loading } = useSelector(
  (state: RootStateOrAny) => state.tasks,
);

  useEffect(() => {
    const existingtask = route.params?.task;
    if (existingtask) {
      setIsEditMode(true);
      setValue(existingtask?.assigned_to?.id)
      setRadioValue(existingtask?.priority)
      setDate(new Date(existingtask?.due_date))
      setTask(existingtask)
      navigation.setOptions({
        title:t('screens:editTask'),
      });
    }else{
        navigation.setOptions({
            title: t('screens:addTask') ,
          }); 
    }
  }, [route.params]);


  const dispatch = useAppDispatch();

  const {user } = useSelector(
    (state: RootStateOrAny) => state.user,
  );
    const { salesPeople } = useSelector(
      (state: RootStateOrAny) => state.salesPeople,
  );

  useEffect(() => {
    dispatch(getSalesPeople({ companyId:user?.company_id,userId: user?.id}));
  }, [])

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false);

  const [openDropDown, setDropdropDown] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(extractIdAndName(salesPeople));

  const [radioValue, setRadioValue] = useState(null);
  const [isPressedBtn, setIsPressedBtn] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage]=useState('')


  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: ''
    },
  });

  const priorities = [
    {
      id: 'Low',
      name: `${t('screens:low')}`
    },
    {
      id: 'Medium',
      name: `${t('screens:medium')}`
    },
    {
      id: 'High',
      name: `${t('screens:high')}`
    }
  ];

  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  

  const onSubmit = (data) => {
    setIsPressedBtn(true);
    data.due_date=date;
    data.priority=radioValue;
    data.assigned_to=value;
    data.assigned_by=user?.id
    data.company_id=user.company_id;
    data.created_by=user?.id;
    data.status='Pending';
    if (isEditMode) {
      // Handle update logic
      // You can use data to update the existing employee
      // For example: updateEmployee(existingEmployee.id, data);

      dispatch(updateTask({data:data,taskId:task?.id}))
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
    } else {
        dispatch(createTask(data))
        .unwrap()
        .then(result => {
          if (result.status) {
      
            ToastAndroid.show(`${t('screens:taskSuccessfully')}`, ToastAndroid.SHORT);
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
    }
  };

  const stylesGlobal=globalStyles();

  return (
    <ScrollView
      style={stylesGlobal.scrollBg}
    >
      <View style={styles.container}>

      <BasicView style={stylesGlobal.centerView}>
              <Text style={stylesGlobal.errorMessage}>{message}</Text>
      </BasicView>

        <View>
          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('screens:title')}
            </Text>

            <Controller
              control={control}
              rules={{
             
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={`${t('screens:enterTitle')}`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || task?.title}
                />
              )}
              name="title"
            />

            {errors.title && (
              <Text style={stylesGlobal.errorMessage}>
                {t('screens:titleRequired')}
              </Text>
            )}
          </BasicView>

          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('screens:description')}
            </Text>

            <Controller
              control={control}
              rules={{
              
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={`${t('screens:enterDescription')}`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || task?.decription}
                />
              )}
              name="description"
            />

            {errors.description && (
              <Text style={stylesGlobal.errorMessage}>
                {t('screens:descriptionRequired')}
              </Text>
            )}
          </BasicView>

          <BasicView>
            <View style={styles.marginDropdown}>
              <DropDownPicker
                searchable={true}
                zIndex={6000}
                placeholder={`${t('screens:assignTaskTo')}`}
                listMode="SCROLLVIEW"
                open={openDropDown}
                value={value}
                items={items}
                setOpen={setDropdropDown}
                setValue={setValue}
                setItems={setItems}

              />
            </View>
            {value == null && isPressedBtn ? (<Text style={{ color: 'red' }}> {t('screens:choosePriority')} </Text>) : <View />}
          </BasicView>

          <BasicView>
            <RadioButton
              radioArray={priorities}
              image={false}
              title={`${t('screens:selectPriority')}`}
              setRadioValue={setRadioValue}
              radioValue={radioValue}
            />
            {radioValue == null && isPressedBtn ? (<Text style={{ color: 'red' }}> {t('screens:pleaseAssignTask')} </Text>) : <View />}
          </BasicView>

        </View>

        <BasicView>
          <Text
            style={[
              stylesGlobal.inputFieldTitle,
              stylesGlobal.marginTop20,
            ]}>{t('screens:taskDueDate')}</Text>

          <TouchableOpacity style={styles.btnChange}
            onPress={() => setOpen(true)}
          >
            <Text style={styles.textChange}>{date == new Date() ? `${t('screens:choose')}` :`${t('screens:change')}` }</Text>
          </TouchableOpacity>
          <DatePicker
            minimumDate={new Date()}
            modal
            open={open}
            date={date}
            onConfirm={(date) => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </BasicView>
        {
          date !== null ? (
            <BasicView style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
              <Text style={{ marginRight: 20 }}>{getdate(date)}</Text>
              <Text>{getTime(date)}</Text>
            </BasicView>

          )
            : (<View />)
        }


        <BasicView>
          <Button loading={loading} onPress={handleSubmit(onSubmit)}>
            <ButtonText>  {isEditMode ?`${t('screens:updateTask')}`:`${t('screens:addTask')}`}</ButtonText>
          </Button>
        </BasicView>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  marginDropdown: { marginVertical: 20 },
  container: {
    // flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',

  },
  toggleButton: {
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  activeToggleText: {
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: 20
    // Active text color
  },
  buttonText: {
    color: colors.primary,
    padding: 10,
    marginRight: 5
    // Default text color
  },
  checkBoxContainer: {
    marginVertical: 30
  },
  textStyle: {
    color: colors.black,
    marginBottom: 10,
    fontSize: 17,
  },
  btnChange: {
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 20,
    marginTop: 15,
    width: '35%',
    alignItems: 'center',
  },
  textChange: {
    color: colors.white,
    fontSize: 14
  },

})

export default AddTask