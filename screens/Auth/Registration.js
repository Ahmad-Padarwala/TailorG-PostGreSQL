import React, { useState, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { dangerColor, primaryColor, styles } from "../../styles/style";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { AuthContext } from "../../middleware/AuthReducer";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const Registeration = () => {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    fname: "",
    lname: "",
    shop_name: "",
    contact: "",
    email: "",
    password: "",
  });
  const { signin } = useContext(AuthContext);
  //handle change
  const handleChange = (name, value) => {
    setRegistrationData((prevRegData) => ({
      ...prevRegData,
      [name]: value,
    }));
  };
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

  // Validation function for password
  const validatePassword = (password) => {
    const minLength = 8;

    const upperCasePattern = /[A-Z]/;
    const lowerCasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (
      password.length >= minLength &&
      upperCasePattern.test(password) &&
      lowerCasePattern.test(password) &&
      numberPattern.test(password) &&
      specialCharPattern.test(password)
    ) {
      return true;
    }

    return false;
  };

  // Add registration data
  const addRegistrationData = async () => {
    const { fname, lname, shop_name, contact, email, password } =
      registrationData;

    // Validate fields
    if (!fname.trim()) {
      Alert.alert("Error", "Please enter First Name");
      return;
    }
    if (!lname.trim()) {
      Alert.alert("Error", "Please enter Last Name");
      return;
    }
    if (!shop_name.trim()) {
      Alert.alert("Error", "Please enter Shop Name");
      return;
    }
    if (!validateContact(contact)) {
      Alert.alert("Error", "Please enter a valid Contact Number");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid Email Address");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert("Error", "Password should be must hard");
      return;
    }
    try {
      const res = await axios.post(`${PORT}/addregistration`, registrationData);
      if (res.data.exists) {
        Alert.alert("Info", res.data.msg);
      } else {
        await getCurrentRegisteredShopData(res.data.contact);
      }
    } catch (error) {
      console.error("Error in registration:", error);
      Alert.alert("Error", "Failed to register. Please try again later.");
    }
  };

  const getCurrentRegisteredShopData = async (contact) => {
    const newContact = parseInt(contact);
    try {
      const res = await axios.get(`${PORT}/getCurrectRegisteredShopData`, {
        params: { contact: newContact },
      });
      const shopData = res.data[0];
      if (shopData && shopData.id) {
        signin(shopData.id);
      } else {
        Alert.alert("Error", "Failed to retrieve shop data.");
      }
    } catch (error) {
      console.error("Error in registration:", error);
      Alert.alert("Error", "Failed to register. Please try again later.");
    }
  };

  const navigation = useNavigation();
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.loginHead}>
            <View style={styles.loginHeadText}>
              <Text style={styles.headingtext}>Getting Started</Text>
              <Text style={styles.desctext}>Create a Account To Continue</Text>
            </View>
            <View>
              <Image
                style={styles.loginimag}
                source={require("../../assets/images/scissor2.png")}
              />
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.inputfield}>
              <Text style={styles.label}>First Name <Text style={{ color: dangerColor }}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                onChangeText={(text) => handleChange("fname", text)}
                value={registrationData.fname}
              ></TextInput>
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Last Name <Text style={{ color: dangerColor }}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={(text) => {
                  handleChange("lname", text);
                }}
                value={registrationData.lname}
              ></TextInput>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Shop Name <Text style={{ color: dangerColor }}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Shop Name"
                onChangeText={(text) => {
                  handleChange("shop_name", text);
                }}
                value={registrationData.shop_name}
              ></TextInput>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Contact Number <Text style={{ color: dangerColor }}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Contact Number"
                maxLength={10}
                keyboardType="numeric"
                onChangeText={(text) => {
                  handleChange("contact", text);
                }}
                value={registrationData.contact}
              ></TextInput>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Email"
                onChangeText={(text) => {
                  handleChange("email", text);
                }}
                value={registrationData.email}
              ></TextInput>
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Password</Text>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: responsiveScreenWidth(76),
                    },
                  ]}
                  placeholder="Enter Your Password"
                  secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
                  onChangeText={(text) => {
                    handleChange("password", text);
                  }}
                  value={registrationData.password}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ justifyContent: "center", marginLeft: 5 }}
                >
                  {showPassword ? (
                    <Text>
                      <MaterialIcons
                        name="visibility-off"
                        size={23}
                        color="black"
                        style={{
                          alignSelf: "center",
                          marginHorizontal: responsiveWidth(1),
                          marginTop: responsiveHeight(0.4),
                        }}
                      />
                    </Text>
                  ) : (
                    <Text>
                      <MaterialIcons
                        name="visibility"
                        size={23}
                        color="black"
                        style={{
                          alignSelf: "center",
                          marginHorizontal: responsiveWidth(1),
                          marginTop: responsiveHeight(0.4),
                        }}
                      />
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.agreegroup}>
              <Checkbox
                color={primaryColor}
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked(!checked);
                }}
              />
              <Text style={{ paddingRight: 40, fontFamily: "Regular" }}>
                I agree to the{" "}
                <Text style={{ color: primaryColor }}>Terms of Service</Text>{" "}
                and <Text style={{ color: primaryColor }}>Privacy policy</Text>
              </Text>
            </View>

            <View style={{ marginTop: 20 }}>
              {checked == false ? (
                <TouchableOpacity
                  style={[styles.onlybtn, { opacity: 0.3 }]}
                  disabled
                >
                  <Text style={styles.onlybtntext}>Create Account</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.onlybtn}
                  onPress={addRegistrationData}
                >
                  <Text style={styles.onlybtntext}>Create Account</Text>
                </TouchableOpacity>
              )}
            </View>

            <View
              style={[
                styles.bottom,
                {
                  marginBottom: responsiveHeight(1),
                  marginTop: responsiveHeight(4),
                },
              ]}
            >
              <Text style={{ fontFamily: "Regular", textAlign: "center" }}>
                Already have an Account ?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Registeration;
