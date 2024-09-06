import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font/build/FontHooks";
import { dangerColor, styles } from "../../styles/style";
import { MaterialIcons } from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { AuthContext } from "../../middleware/AuthReducer";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;
const { width, height } = Dimensions.get('screen');

const Login = () => {
  const navigation = useNavigation();
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });
  const [Fontloaded] = useFonts({
    Medium: require("../../assets/Font/Poppins-Medium.ttf"),
    Bold: require("../../assets/Font/Poppins-Bold.ttf"),
    ExtraBold: require("../../assets/Font/Poppins-ExtraBold.ttf"),
    Regular: require("../../assets/Font/Poppins-Regular.ttf"),
    SemiBold: require("../../assets/Font/Poppins-SemiBold.ttf"),
    Light: require("../../assets/Font/Poppins-Light.ttf"),
  });
  const [showPassword, setShowPassword] = useState(false);

  const { signin } = useContext(AuthContext);

  //handle change
  const handleChange = (name, value) => {
    setLoginData((prevRegData) => ({
      ...prevRegData,
      [name]: value,
    }));
  };

  //login data
  const loginShopMaster = async () => {
    const { identifier, password } = loginData;

    if (!identifier) {
      alert("Insert contact or email");
      return;
    }
    if (!password) {
      alert("Insert Password");
      return;
    }
    try {
      const res = await axios.post(`${PORT}/shoplogin`, loginData);
      const { success, msg } = res.data;
      if (success) {
        signin(res.data.user.id);
      } else {
        alert(msg);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("In Catch");
    }
  };
  if (!Fontloaded) {
    return null;
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.container, { height: responsiveHeight(100) }]}>
        <View style={styles.loginHead}>
          <View style={[styles.loginHeadText, { paddingLeft: width * 0.18 }]}>
            <Text style={styles.headingtext}>Welcome Back</Text>
            <Text style={styles.desctext}>Login To Continue</Text>
          </View>
          <Image
            style={styles.loginimag2}
            source={require("../../assets/images/scissor1.png")}
          />
        </View>
        <View style={styles.form}>
          <View style={styles.inputfield}>
            <Text style={styles.label}>Email / Contact <Text style={{ color: dangerColor }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email Or Contact"
              onChangeText={(text) => handleChange("identifier", text)}
              value={loginData.identifier}
            ></TextInput>
          </View>

          <View style={styles.inputfield}>
            <Text style={styles.label}>Password <Text style={{ color: dangerColor }}>*</Text></Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[
                  styles.input,
                  {
                    width: responsiveScreenWidth(76),
                  },
                ]}
                placeholder="Enter Your Password"
                secureTextEntry={!showPassword}
                onChangeText={(text) => handleChange("password", text)}
                value={loginData.password}
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

          <View style={{ marginTop: responsiveHeight(3) }}>
            <TouchableOpacity style={styles.onlybtn} onPress={loginShopMaster}>
              <Text style={styles.onlybtntext}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("forgotPassword")}
            >
              <Text
                style={[
                  styles.link,
                  { textAlign: "center", marginTop: responsiveHeight(2) },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.bottom, { marginTop: responsiveHeight(15) }]}>
            <Text style={{ fontFamily: "Regular", textAlign: "center" }}>
              Don't have an Account ?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Registration")}
            >
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;