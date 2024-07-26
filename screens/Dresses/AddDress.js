import React, { useState, useContext } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  Image,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { RadioButton } from "react-native-paper";
import {
  dangerColor,
  primaryColor,
  styles,
  whiteColor,
} from "../../styles/style";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { AuthContext } from "../../middleware/AuthReducer";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const AddDress = () => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState("male");
  const [dressName, setDressName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");

  const { userToken } = useContext(AuthContext);
  const generatedNumbers = new Set();

  const defaultImage = "../../assets/images/NoImage.jpg";
  const defaultName = "NoImage.jpg";

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageName(result.assets[0].fileName);
    }
    if (result.canceled) {
      setImage(result.assets[0].uri);
      setImageName(result.assets[0].fileName);
    }
  };

  const handleSubmit = async () => {
    const formdata = new FormData();

    function generateUnique5DigitNumber() {
      if (dressName == "") {
        alert("Please Insert DressName");
        return;
      }
      if (price == "") {
        alert("Please Insert Price");
        return;
      }
      let number;
      do {
        number = Math.floor(10000 + Math.random() * 90000); // Generates a number between 10000 and 99999
      } while (generatedNumbers.has(number));
      generatedNumbers.add(number);
      return number;
    }

    const uniquenumber = generateUnique5DigitNumber();

   
    let imageobj = null;
    if (image) {
      const fileType = image.substring(image.lastIndexOf(".") + 1);
      imageobj = {
        uri: image,
        name: imageName,
        type: `image/${fileType}`,
      };
      formdata.append("image", imageobj);
    } else {
      formdata.append("image", "NoImage.jpg");
    }

    formdata.append("dressName", dressName);
    formdata.append("price", price);
    formdata.append("gender", checked);
    formdata.append("dress_unique_number", uniquenumber);
    try {
      const response = await axios.post(
        `${PORT}/adddresses/${userToken}`,
        formdata,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

  
      if (response.status === 200) {
        navigation.navigate("addDressBodyParts", {
          dress_unique_number: uniquenumber,
          gender: checked,
          isEdit: false,
          dressId: null,
        });
      } else {
        Alert.alert("Error", "Upload failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: whiteColor, flex: 1 }}>
        <View style={[styles.headerwithline, { flexDirection: "row" }]}>
          <View style={{ width: responsiveWidth(12) }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons
                name="arrow-back"
                size={23}
                color="black"
                style={{
                  alignSelf: "center",
                  marginHorizontal: responsiveWidth(1),
                  marginTop: responsiveHeight(0.4),
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ width: responsiveWidth(80) }}>
            <Text
              style={{
                alignSelf: "center",
                fontSize: responsiveFontSize(2.5),
                fontFamily: "Medium",
              }}
            >
              New Dress
            </Text>
          </View>
        </View>

        <View style={styles.line70}></View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: whiteColor }}
        >
          <View style={[styles.form, { marginTop: responsiveHeight(4) }]}>
            <View style={styles.inputfield}>
              <Text style={styles.label}>
                Dress Name <Text style={{ color: dangerColor }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Dress Name"
                value={dressName}
                onChangeText={(text) => setDressName(text)}
              ></TextInput>
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>
                Price <Text style={{ color: dangerColor }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Dress Price"
                keyboardType="numeric"
                value={price}
                onChangeText={(text) => setPrice(text)}
              ></TextInput>
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Select Gender</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <RadioButton
                  value="male"
                  status={checked === "male" ? "checked" : "unchecked"}
                  onPress={() => setChecked("male")}
                  color={primaryColor}
                  uncheckedColor={primaryColor}
                />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 6,
                    opacity: 0.6,
                    fontSize: responsiveFontSize(2),
                    fontFamily: "Regular",
                  }}
                >
                  Male
                </Text>

                <View style={{ marginLeft: 10 }}>
                  <RadioButton
                    value="female"
                    status={checked === "female" ? "checked" : "unchecked"}
                    onPress={() => setChecked("female")}
                    color={primaryColor}
                    uncheckedColor={primaryColor}
                  />
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 6,
                    opacity: 0.6,
                    fontSize: responsiveFontSize(2),
                    fontFamily: "Regular",
                  }}
                >
                  Female
                </Text>
              </View>
            </View>

            <View style={styles.inputfield}>
              <TouchableOpacity
                style={styles.dressfileSelect}
                onPress={pickImage}
              >
                <Text style={styles.dressfileSelecttext}>
                  <Ionicons name="add-outline" size={16} />
                </Text>
                <Text
                  style={[
                    styles.dressfileSelecttext,
                    { marginTop: responsiveHeight(0.5) },
                  ]}
                >
                  Add Dress Image
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputfield,
                { width: responsiveWidth(24), height: responsiveHeight(10) },
              ]}
            >
              <View
                style={[
                  styles.imageContainer,
                  {
                    width: responsiveWidth(24),
                    height: responsiveHeight(10),
                  },
                ]}
              >
                <Image
                  source={image ? { uri: image } : require(defaultImage)}
                  style={{ width: "90%", height: "90%", borderRadius: 3 }}
                />
              </View>
            </View>
            <View style={{ marginTop: responsiveHeight(12) }}>
              <TouchableOpacity style={styles.onlybtn} onPress={handleSubmit}>
                <Text style={styles.onlybtntext}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AddDress;
