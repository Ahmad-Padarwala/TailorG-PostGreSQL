import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  Dimensions,
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
import { dangerColor, primaryColor, styles } from "../../styles/style";
const { width, height } = Dimensions.get('screen');
const PORT = process.env.EXPO_PUBLIC_API_URL;

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState({
    contact_number: "",
    password: "",
    otp: "",
  })
  const [isOTPMode, setIsOTPMode] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const handleChange = (name, value) => {
    setForgotPassword((prevRegData) => ({
      ...prevRegData,
      [name]: value,
    }));
  };
  const validateContact = (contact) => {
    const contactPattern = /^[0-9]{10}$/;
    return contactPattern.test(contact);
  };
  // Request OTP
  const requestOTP = async () => {
    const { contact_number } = forgotPassword;
    if (!validateContact(contact_number)) {
      Alert.alert("Error", "Please enter a valid Contact Number");
      return;
    }

    try {
      const res = await axios.post(`${PORT}/requestOTPForgotPass`, { contact_number });
      if (res.data.success) {
        setIsOTPMode(true);
        Alert.alert("OTP Sent", "OTP sent to your contact number");
        setIsResendDisabled(true);
        setCountdown(30); // Reset countdown
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
    const { contact_number, otp } = forgotPassword;
    if (!otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }

    try {
      const res = await axios.post(`${PORT}/verifyOTPForgotPass`, { contact_number, otp });
      if (res.data.success) {
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


  const updateForgotPassword = async () => {
    const { contact_number, password } = forgotPassword;
    try {
      const res = await axios.put(`${PORT}/updatePassword`, { contact_number, password });
      if (res.status === 200) {
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", res.data.msg);
      }
    } catch (error) {
      console.error("Update password error:", error);
      Alert.alert("Error", "Failed to update password. Please try again later.");
    }
  }

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timerId); // Cleanup timer on component unmount
    } else {
      setIsResendDisabled(false); // Enable the Resend OTP button when countdown reaches 0
    }
  }, [countdown]);
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.container, { height: responsiveHeight(100) }]}>
          <View style={styles.loginHead}>
            <View style={[styles.loginHeadText, { paddingLeft: width * 0.18 }]}>
              <Text style={styles.headingtext}>Forgot Password</Text>
              <Text style={styles.desctext}>Forgot To Continue</Text>
            </View>
            <View>
              <Image
                style={styles.loginimag2}
                source={require("../../assets/images/scissor1.png")}
              />
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.inputfield}>
              <Text style={styles.label}>New Password</Text>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: responsiveScreenWidth(76),
                    },
                  ]}
                  placeholder="Enter New Password"
                  value={forgotPassword.password}
                  onChangeText={(text) => handleChange("password", text)}
                  secureTextEntry={!showPassword}
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
              <Text style={styles.label}>Contact</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Contact"
                value={forgotPassword.contact_number}
                onChangeText={(text) => handleChange("contact_number", text)}
              ></TextInput>
            </View>



            {!isOTPMode ? (
              <View style={[styles.inputfield]}>
                {!vop && (
                  <TouchableOpacity
                    style={styles.onlybtn}
                    onPress={requestOTP}
                    disabled={!validateContact(forgotPassword.contact_number)}
                  >
                    <Text style={styles.onlybtntext}>Send OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.inputfield}>
                <Text style={styles.label}>OTP<Text style={{ color: dangerColor }}>*</Text></Text>
                <TextInput
                  style={[styles.input, { marginBottom: responsiveHeight(2) }]}
                  placeholder="Enter OTP"
                  keyboardType="numeric"
                  onChangeText={(text) => handleChange("otp", text)}
                  value={forgotPassword.otp}
                />
                <TouchableOpacity
                  style={styles.onlybtn}
                  onPress={verifyOTP}
                  disabled={!forgotPassword.otp}
                >
                  <Text style={styles.onlybtntext}>Verify OTP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.resendBtn, isResendDisabled && { opacity: 0.5 }]}
                  onPress={requestOTP}
                  disabled={isResendDisabled}
                >
                  <Text style={styles.resendbtntext}>{isResendDisabled
                    ? `Resend OTP in ${countdown} seconds`
                    : "Resend OTP"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ marginTop: responsiveHeight(3) }}>
              <TouchableOpacity style={styles.onlybtn} onPress={updateForgotPassword}>
                <Text style={styles.onlybtntext}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* <View style={[styles.bottom, { marginTop: responsiveHeight(15) }]}>
              <Text style={{ fontFamily: "Regular", textAlign: "center" }}>
                Don't have an Account ?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Registration")}
              >
                <Text style={styles.link}>Sign Up</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ForgotPassword;
