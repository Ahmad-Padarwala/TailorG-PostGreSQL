import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { dangerColor, secondaryColor, styles, whiteColor } from "../../styles/style";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../middleware/AuthReducer";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font/build/FontHooks";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const ShopEditProfile = () => {
  const navigation = useNavigation();
  const [Fontloaded] = useFonts({
    Medium: require("../../assets/Font/Poppins-Medium.ttf"),
    Bold: require("../../assets/Font/Poppins-Bold.ttf"),
    ExtraBold: require("../../assets/Font/Poppins-ExtraBold.ttf"),
    Regular: require("../../assets/Font/Poppins-Regular.ttf"),
  });

  const { userToken } = useContext(AuthContext);
  const [shopData, setShopData] = useState([]);
  const getShopData = async () => {
    await axios
      .get(`${PORT}/getshopdata/${userToken}`)
      .then((res) => {
        setShopData(res.data.rows[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (name, value) => {
    setShopData((prevProdData) => ({
      ...prevProdData,
      [name]: value,
    }));
  };

  //image picker
  const pickImage = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 5],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    //   setImageName(result.assets[0].fileName);
    // }
    alert("This feature is Coming Soon");
  };

  useFocusEffect(
    React.useCallback(() => {
      getShopData();
    }, [])
  );

  if (!Fontloaded) {
    return null;
  }

  //validation
  const validateContact = (contact) => {
    const contactPattern = /^[0-9]{10}$/;
    return contactPattern.test(contact);
  };

  // Validation function for email
  const validateEmail = (email) => {
    // Check if email is provided, if not return true
    if (!email.trim()) {
      return true;
    }
    // Check email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const EditShopData = async () => {
    const { first_name, last_name, shop_name, contact_number, email } =
      shopData;
    if (!first_name.trim()) {
      Alert.alert("Error", "Please enter First Name");
      return;
    }
    if (!last_name.trim()) {
      Alert.alert("Error", "Please enter Last Name");
      return;
    }
    if (!shop_name.trim()) {
      Alert.alert("Error", "Please enter Shop Name");
      return;
    }
    if (!validateContact(contact_number)) {
      Alert.alert("Error", "Please enter a valid Contact Number");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid Email Address");
      return;
    }
    try {
      const response = await axios.put(
        `${PORT}/editshopdata/${userToken}`,
        shopData
      );
      if (response.status === 200) {
        navigation.navigate("Profile");
      }
    } catch (error) {
      console.error(error + "error in the editing shop data!");
    }
  };

  return (
    <>
      <View
        style={{ flex: 0, flexDirection: "row", backgroundColor: whiteColor }}
      >
        <TouchableOpacity
          style={{ width: "39%" }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back-outline"
            size={20}
            style={{
              marginHorizontal: responsiveWidth(3),
              marginTop: responsiveHeight(2.3),
            }}
          />
        </TouchableOpacity>
        <View style={{ width: "50%" }}>
          <Text style={styles.profileTitle}>Edit Profile</Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: whiteColor }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={pickImage}>
            <View
              style={[
                styles.profilelEditAvtar,
                { marginTop: responsiveHeight(5) },
              ]}
            >
              <Ionicons
                name="person"
                style={[
                  {
                    textAlign: "center",
                    fontSize: responsiveFontSize(6),
                    color: secondaryColor,
                    marginTop: responsiveHeight(4),
                  },
                ]}
              />
              <Ionicons name="camera" style={styles.profilecameraicon} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.form, { marginTop: responsiveHeight(5) }]}>
          <View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>First Name <Text style={{ color: dangerColor }}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                onChangeText={(text) => handleChange("first_name", text)}
                value={shopData.first_name}
              ></TextInput>
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Last Name <Text style={{ color: dangerColor }}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={(text) => handleChange("last_name", text)}
                value={shopData.last_name}
              ></TextInput>
            </View>
          </View>

          <View style={styles.inputfield}>
            <Text style={styles.label}>Shop Name <Text style={{ color: dangerColor }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Shop Name"
              onChangeText={(text) => handleChange("shop_name", text)}
              value={shopData.shop_name}
            ></TextInput>
          </View>

          <View style={styles.inputfield}>
            <Text style={styles.label}>Contact Number <Text style={{ color: dangerColor }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Contact Number"
              maxLength={10}
              keyboardType="numeric"
              onChangeText={(text) => handleChange("contact_number", text)}
              value={shopData.contact_number}
            ></TextInput>
          </View>

          <View style={styles.inputfield}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email"
              onChangeText={(text) => handleChange("email", text)}
              value={shopData.email}
            ></TextInput>
          </View>

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity style={styles.onlybtn} onPress={EditShopData}>
              <Text style={styles.onlybtntext}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ShopEditProfile;
