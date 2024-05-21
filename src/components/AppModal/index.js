import React from 'react';
import {View, Text, Modal, TouchableOpacity, ScrollView} from 'react-native';
import styles from './styles';
import proptypes from 'prop-types'
import { colors } from '../../utils/colors';
import Icon from 'react-native-vector-icons/AntDesign';


const AppModal = ({
  modalVisible,
  title,
  modalFooter,
  modalBody,
  setModalVisible,
  closeOnTouchOutSide
}) => {
  return (
    <Modal visible={modalVisible} transparent>
      <TouchableOpacity
        style={styles.wrapper}
        onPress={() =>{
          
           if(closeOnTouchOutSide){

          setModalVisible(false)
           }
          }
        }>
        <View style={styles.modalView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity onPress={()=>setModalVisible(false)}>
              <Icon name="close"  size={27} color={colors.dangerRed} />
              </TouchableOpacity>
              
              <Text style={styles.title}>{title || 'Modal Title'}</Text>
              <View />
              <View />
              <View />
            </View>

            <View style={styles.footerSeparator} />
              <View style={styles.body}>{modalBody}</View>
              {modalFooter}
              {!modalFooter && (
                <View>
                  <>
                    <View style={styles.footerSeparator} />
                    <View style={styles.footerItems}>
                      <View style={styles.footer}>
                        <Text style={styles.footerText}>Privacy Policy</Text>
                        <View style={styles.termsView} />
                        <Text style={styles.footerText}>Terms of Services</Text>
                      </View>
                    </View>
                  </>
                </View>
              )}
          
              
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};


AppModal.proptypes={
  closeOnTouchOutSide:proptypes.bool
}


AppModal.default={
  closeOnTouchOutSide:true
}
export default AppModal;
