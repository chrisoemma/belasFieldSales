import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Pressable, Linking, ToastAndroid, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../../styles/global';
import { colors } from '../../utils/colors';
import FloatButton from '../../components/FloatBtn';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch } from '../../app/store';
import { deleteContactPerson, getContactPeople } from './ContactPeopleSlice';
import { BasicView } from '../../components/BasicView';

const ContactList = ({ navigation, route }:any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage]=useState('')
  const stylesGlobal = globalStyles();
  const { isDarkMode } = useSelector((state) => state.theme);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { loading, contactPeople } = useSelector((state) => state.contactPeople);

  const { client } = route?.params;

  useEffect(() => {
    dispatch(getContactPeople({ clientId: client?.id }));
  }, [dispatch, client]);

  const openModal = (contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedContact(null);
    setModalVisible(false);
  };

  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };


  useEffect(() => {
    return () => {
      setModalVisible(false);
    };
  }, []);

  const deleteFunc = () =>
    Alert.alert(`${t('screens:deleteContactPerson')}`, `${t('screens:areYouSureDelete')}`, [
      {
        text: `${t('screens:cancel')}`,
        onPress: () => console.log('Cancel contact person delete'),
        style: 'cancel',
      },
      {
        text: `${t('screens:ok')}`,
        onPress: () => {
         
          dispatch(deleteContactPerson({ clientId: client?.id,contactPersonId:selectedContact?.id }))
            .unwrap()
            .then(result => {
              if (result.status) {
                ToastAndroid.show(`${t('screens:deletedSuccessfully')}`, ToastAndroid.SHORT);
                setModalVisible(false);
              } else {
                setDisappearMessage(
                  `${t('screens:requestFail')}`,
                );
                setModalVisible(false);
                console.log('dont navigate');
              }

              console.log('resultsss', result)
            })
            .catch(rejectedValueOrSerializedError => {
              // handle error here
              console.log('error');
              console.log(rejectedValueOrSerializedError);
            });
        },
      },
    ]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.contactCard} onPress={() => openModal(item)}>
      <Text style={[styles.name, { color: isDarkMode ? colors.white : colors.black }]}>
        {item.fist_name} {item.last_name}
      </Text>
      <Text style={[styles.detail, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>
        📞 {item.phone_number}
      </Text>
      <Text style={[styles.detail, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>
        ✉️ {item.email}
      </Text>
      <Text style={[styles.detail, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>
        🏢 {item.positions?.[0]?.name || t('screens:unknownPosition')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[stylesGlobal.scrollBg, { flex: 1 }]}>
      {message?(   <BasicView style={stylesGlobal.centerView}>
              <Text style={stylesGlobal.errorMessage}>{message}</Text>
           </BasicView>):(<View />)}
        
      <View style={[stylesGlobal.appView, { flex: 1 }]}>
        <FlatList
          data={contactPeople}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <FloatButton
          onPress={() => {
            navigation.navigate('AddContactPerson',{
              client:client
            });
          }}
          iconType="add"
        />
        {selectedContact && (
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {selectedContact?.fist_name} {selectedContact?.last_name}
                </Text>
                <Text style={styles.modalDetail}>📞 {selectedContact?.phone_number}</Text>
                <Text style={styles.modalDetail}>✉️ {selectedContact?.email}</Text>
                {selectedContact?.positions && (
                  <View>
                    <Text style={styles.subTitle}>Positions:</Text>
                    {selectedContact.positions.map((position, index) => (
                      <View key={index} style={styles.bulletItem}>
                        <Text style={styles.bulletText}>•</Text>
                        <Text style={styles.bulletText}>{position.name}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.iconRow}>
                  <Pressable style={styles.iconButton} onPress={() => Linking.openURL(`tel:${selectedContact.phone_number}`)}>
                    <Icon name="call" size={24} color={colors.white} />
                  </Pressable>
                  <Pressable style={styles.iconButton} onPress={() => {/* Send message action */}}>
                    <Icon name="message" size={24} color={colors.white} />
                  </Pressable>
                  <Pressable style={styles.iconButton} onPress={() => {navigation.navigate('AddContactPerson',{
                    contactPerson:selectedContact
                  })}}>
                    <Icon name="edit" size={24} color={colors.white} />
                  </Pressable>
                  <Pressable style={styles.iconButton} onPress={() => {deleteFunc()}}>
                    <Icon name="delete" size={24} color={colors.white} />
                  </Pressable>
                </View>
                <Pressable style={[styles.button, styles.buttonClose, { marginTop: 20 }]} onPress={closeModal}>
                  <Text style={styles.textStyle}>{t('screens:close')}</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contactCard: {
    backgroundColor: colors.white,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGrey,
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: colors.darkGrey,
    marginBottom: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bulletText: {
    fontSize: 16,
    marginLeft: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 15,
  },
  iconButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: colors.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ContactList;
