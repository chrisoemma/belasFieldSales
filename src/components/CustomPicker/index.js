import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import Icon from 'react-native-vector-icons/Feather';
import {
  MenuOption,
  MenuOptions,
  MenuTrigger,
  Menu,
} from "react-native-popup-menu";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AppModal from "../AppModal";
import { dbDateFormat, formatDate,formatDateToYYYYMMDD } from "../../utils/utilts";
import { colors } from "../../utils/colors";
import { useTranslation } from "react-i18next";

const CustomPicker = ({ getSelectedPicker }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [startVisible, setStartVisibility] = useState(false);
  const [endVisible, setEndVisibility] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  const { t } = useTranslation();

  const showDatePicker = () => {
    setStartVisibility(true);
  };

  const hideDatePicker = () => {
    setStartVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log('confirm date',date)
    console.log('formated date',formatDateToYYYYMMDD(date));
    setStartDate(formatDateToYYYYMMDD(date));
    hideDatePicker();
  }


  const showDatePicker2 = () => {
    setEndVisibility(true);
  };

  const hideDatePicker2 = () => {
    setEndVisibility(false);
  };

  const handleConfirm2 = (date) => {
    setEndDate(formatDateToYYYYMMDD(date));
    hideDatePicker2();
  };

  const checkResults = () => {
    if (startDate && endDate) {
      const date = {
        start: startDate,
        end: endDate,
      };
      getSelectedPicker("custom", date);
      setEndDate(null);
      setStartDate(null);
      setModalVisible(false);
    } else {
      ToastAndroid.show("Please choose start date and end date!", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <AppModal
        modalVisible={modalVisible}
        modalFooter={<></>}
        closeOnTouchOutside={false}
        modalBody={
          <View>
            <View style={styles.calenderBtns}>
              <TouchableOpacity
                style={styles.calenderButton}
                onPress={showDatePicker}
              >
                <Icon
                  name="calendar"
                  size={25}
                  color={colors.white}
                />
                <Text style={styles.calenderText}>
                  {startDate == null ? "Start Date" : startDate}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.calenderButton}
                onPress={showDatePicker2}
              >
                <Icon
                  name="calendar"
                  size={25}
                  color={colors.white}
                />
                <Text style={styles.calenderText}>
                  {endDate == null ? "End Date" : endDate}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={checkResults}
              style={styles.resultBtn}
            >
              <Text style={styles.calenderText}>{t('screens:checkResults')}</Text>
            </TouchableOpacity>
          </View>
        }
        title={t('screens:chooseDuration')}
        setModalVisible={setModalVisible}
      />
      <View style={styles.datePicker}>
        <Menu>
          <MenuTrigger>
            <Text style={{ color: colors.white, padding: 10 }}>
              {t('screens:chooseDuration')}
            </Text>
          </MenuTrigger>

          <MenuOptions>
            <MenuOption
              onSelect={() => getSelectedPicker(1, "Today")}
              text={t('screens:today')}
            />
            <MenuOption onSelect={() => getSelectedPicker(-7, "Week")}>
              <Text>{t('screens:week')}</Text>
            </MenuOption>
            <MenuOption
              onSelect={() => getSelectedPicker(-30, "Month")}
              text={t('screens:month')}
            />
            <MenuOption
              onSelect={() => setModalVisible(true)}
              text={t('screens:custom')}
            />
          </MenuOptions>
        </Menu>
      </View>

      <DateTimePickerModal
        isVisible={startVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={endVisible}
        mode="date"
        onConfirm={handleConfirm2}
        onCancel={hideDatePicker2}
      />
    </View>
  );
};

export default CustomPicker;
