import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../styles/global'
import DropDownPicker from "react-native-dropdown-picker";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { colors } from '../../utils/colors';
import DocumentPicker from 'react-native-document-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import { BasicView } from '../../components/BasicView';
import { ButtonText } from '../../components/ButtonText';



const AddBusiness = () => {

  const [imageFile, setImageFile] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<string | null>(null);

  const removeImage = () => {
    setImageFile(null)
  }
  const removeVideo = () => {
    setVideoFile(null)
  }


  const [checkedSubServices, setCheckedSubServices] = useState([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Urembo', value: 'urembo' },
    { label: 'Upambaji', value: 'upambaji' },
    { label: 'Fundi nguo', value: 'fundi_nguo' },
    { label: 'Fundi ramani', value: 'kuchora_ramani' }
  ]);


  const [ServiceOpen, setServiceOpen] = useState(false);
  const [ServiceValue, setServiceValue] = useState(null);
  const [ServiceItems, setServiceItems] = useState([
    { label: 'Kupaka rangi kucha', value: 'rangi_kucha' },
    { label: 'Dread Lock', value: 'dread_lock' },
    { label: 'Sister Lock', value: 'sister_lock' },
  ]);


  const uploadFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.video],
      });

      if (result.type === 'image' || result.type === 'video') {
        // Here, you can send the selected file (image or video) to your server or perform any desired action.
        // You can use the file's URI, name, and other details from the 'result' object.
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        throw error;
      }
    }
  };



  const subServices = [
    {
      id: 1,
      name: 'Kupaka Rangi kucha kawaida'
    },
    {
      id: 2,
      name: 'Kubandika kucha'
    },
    {
      id: 3,
      name: 'Kushonea wigi'
    }
  ];

  const stylesGlobal=globalStyles();

  console.log('cheked subservice', checkedSubServices);
  return (
    <SafeAreaView style={stylesGlobal.scrollBg}>
      <ScrollView style={stylesGlobal.appView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.marginDropdown}>
          <DropDownPicker
            searchable={true}
            zIndex={6000}
            placeholder="Select Category"
            listMode="SCROLLVIEW"
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}

          />
        </View>
        <View style={styles.marginDropdown}>
          <DropDownPicker
            searchable={true}
            placeholder="Select Service"
            listMode="SCROLLVIEW"
            open={ServiceOpen}
            value={ServiceValue}
            items={ServiceItems}
            setOpen={setServiceOpen}
            setValue={setServiceValue}
            setItems={setServiceItems}
          />
        </View>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.textStyle}>Please choose the sub services you offer</Text>
          {
            subServices.map(subservice => (
              <BouncyCheckbox
                size={25}
                fillColor={colors.secondary}
                style={{ marginTop: 5 }}
                unfillColor="#FFFFFF"
                text={subservice.name}
                iconStyle={{ borderColor: "red" }}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{ fontFamily: "JosefinSans-Regular" }}
                onPress={(isChecked: boolean) => {
                  // Update the checked sub-services state
                  if (isChecked) {
                    setCheckedSubServices(prevChecked => [...prevChecked, subservice.id]);
                  } else {
                    setCheckedSubServices(prevChecked =>
                      prevChecked.filter(id => id !== subservice.id)
                    );
                  }
                }}
              />
            ))
          }
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.textStyle}>Upload Video or image of the service you offer</Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity>
              <Text>Upload image</Text>
              <Ionicons name="image"
                color={colors.black}
                size={100}
                style={{ alignSelf: 'center' }}
              />

            </TouchableOpacity>

            <TouchableOpacity>
              <Text>Upload Video</Text>
              <Ionicons name="videocam-outline"
                color={colors.black}
                size={100}
                style={{ alignSelf: 'center' }}
              />

            </TouchableOpacity>

          </View>
          <BasicView>
            <Button onPress={() => { }}>
              <ButtonText>Add Business</ButtonText>
            </Button>
          </BasicView>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  marginDropdown: { marginBottom: 20 },
  checkBoxContainer: {
    marginVertical: 10
  },
  textStyle: {
    color: colors.black,
    marginBottom: 10,
    fontSize: 17,

  }
});

export default AddBusiness