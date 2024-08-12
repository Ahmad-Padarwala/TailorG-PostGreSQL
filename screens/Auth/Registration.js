import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import axios from "axios";
import { AuthContext } from "../../middleware/AuthReducer";
import { dangerColor, primaryColor, styles } from "../../styles/style";

const PORT = process.env.EXPO_PUBLIC_API_URL;

const Registration = () => {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    fname: "",
    lname: "",
    shop_name: "",
    contact: "",
    email: "",
    password: "",
    otp: "",
  });
  const [isOTPMode, setIsOTPMode] = useState(false);
  const { signin } = useContext(AuthContext);
  const navigation = useNavigation();
  const [shopData, setShopData] = useState([]);
  const getShopData = async () => {
    await axios
      .get(`${PORT}/getshopalldata`)
      .then((res) => {
        setShopData(res.data.rows[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    getShopData();
  }, [])
  // Handle input change
  const handleChange = (name, value) => {
    setRegistrationData((prevRegData) => ({
      ...prevRegData,
      [name]: value,
    }));
  };

  // Validate contact number
  const validateContact = (contact) => {
    const contactPattern = /^[0-9]{10}$/;
    return contactPattern.test(contact);
  };

  // Validate email
  const validateEmail = (email) => {
    if (!email.trim()) {
      return true;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Validate password
  const validatePassword = (password) => {
    const minLength = 8;
    const upperCasePattern = /[A-Z]/;
    const lowerCasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password.length >= minLength &&
      upperCasePattern.test(password) &&
      lowerCasePattern.test(password) &&
      numberPattern.test(password) &&
      specialCharPattern.test(password)
    );
  };

  // Request OTP
  const requestOTP = async () => {
    const { contact } = registrationData;
    if (!validateContact(contact)) {
      Alert.alert("Error", "Please enter a valid Contact Number");
      return;
    }

    try {
      const res = await axios.post(`${PORT}/requestOTP`, { contact });
      if (res.data.success) {
        setIsOTPMode(true);
        Alert.alert("OTP Sent", "OTP sent to your contact number");
      } else {
        Alert.alert("Error", res.data.msg);
      }
    } catch (error) {
      console.error("OTP request error:", error);
      Alert.alert("Error", "Failed to request OTP. Please try again later.");
    }
  };

  // Verify OTP
  const [vop, setVop] = useState(false)
  const verifyOTP = async () => {
    const { contact, otp } = registrationData;
    if (!otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }

    try {
      const res = await axios.post(`${PORT}/verifyOTP`, { contact, otp });
      if (res.data.success) {
        // navigation.navigate("home");
        Alert.alert("Success", "OTP verified successfully");
        setIsOTPMode(false);
        setVop(true)
      } else {
        Alert.alert("Error", res.data.msg);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      Alert.alert("Error", "Failed to verify OTP. Please try again later.");
    }
  };

  // Handle registration submission
  const addRegistrationData = async () => {
    const { fname, lname, shop_name, contact, email, password } = registrationData;

    // If in OTP mode, verify OTP
    if (isOTPMode) {
      verifyOTP();
      return;
    }

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
      Alert.alert("Error", "Password should be at least 8 characters long and contain uppercase, lowercase, number, and special character");
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

  // Get current registered shop data
  const getCurrentRegisteredShopData = async (contact) => {
    try {
      const res = await axios.get(`${PORT}/getCurrectRegisteredShopData`, {
        params: { contact: parseInt(contact) },
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

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.loginHead}>
          <View style={styles.loginHeadText}>
            <Text style={styles.headingtext}>Getting Started</Text>
            <Text style={styles.desctext}>Create an Account To Continue</Text>
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
            <Text style={styles.label}>First Name<Text style={{ color: dangerColor }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              onChangeText={(text) => handleChange("fname", text)}
              value={registrationData.fname}
            />
          </View>
          <View style={styles.inputfield}>
            <Text style={styles.label}>Last Name<Text style={{ color: dangerColor }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              onChangeText={(text) => handleChange("lname", text)}
              value={registrationData.lname}
            />
          </View>
          <View style={styles.inputfield}>
            <Text style={styles.label}>Shop Name<Text style={{ color: dangerColor }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Shop Name"
              onChangeText={(text) => handleChange("shop_name", text)}
              value={registrationData.shop_name}
            />
          </View>

          <View style={styles.inputfield}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email"
              onChangeText={(text) => handleChange("email", text)}
              value={registrationData.email}
            />
          </View>
          <View style={styles.inputfield}>
            <Text style={styles.label}>Password</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[
                  styles.input,
                  { width: responsiveScreenWidth(76) },
                ]}
                placeholder="Enter Your Password"
                secureTextEntry={!showPassword}
                onChangeText={(text) => handleChange("password", text)}
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
          <View style={styles.inputfield}>
            <Text style={styles.label}>Contact Number<Text style={{ color: dangerColor }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Contact Number"

              keyboardType="numeric"
              maxLength={10}
              onChangeText={(text) => handleChange("contact", text)}
              value={registrationData.contact}
            />
          </View>
          {!isOTPMode ? (
            <View style={[styles.inputfield]}>
              {
                !vop ? (
                  <TouchableOpacity
                    style={styles.onlybtn}
                    onPress={requestOTP}
                    disabled={!validateContact(registrationData.contact)}
                  >
                    <Text style={styles.onlybtntext}>Send OTP</Text>
                  </TouchableOpacity>
                ) : (
                  ""
                )
              }

            </View>
          ) : (
            <View style={styles.inputfield}>
              <Text style={styles.label}>OTP<Text style={{ color: dangerColor }}>*</Text></Text>
              <TextInput
                style={[styles.input, { marginBottom: responsiveHeight(2) }]}
                placeholder="Enter OTP"
                keyboardType="numeric"
                onChangeText={(text) => handleChange("otp", text)}
                value={registrationData.otp}
              />
              <TouchableOpacity
                style={styles.onlybtn}
                onPress={verifyOTP}
                disabled={!registrationData.otp}
              >
                <Text style={styles.onlybtntext}>Verify OTP</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.agreegroup}>
            <Checkbox
              color={primaryColor}
              status={checked ? "checked" : "unchecked"}
              onPress={() => setChecked(!checked)}
            />
            <Text style={{ paddingRight: 40, fontFamily: "Regular" }}>
              I agree to the{" "}
              <Text style={{ color: primaryColor }}>Terms of Service</Text>{" "}
              and <Text style={{ color: primaryColor }}>Privacy policy</Text>
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={[
                styles.onlybtn,
                { opacity: checked && vop ? 1 : 0.3 },
              ]}
              disabled={!checked && vop}
              onPress={addRegistrationData}
            >
              <Text style={styles.onlybtntext}>Create Account</Text>
            </TouchableOpacity>
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
  );
};

export default Registration;
