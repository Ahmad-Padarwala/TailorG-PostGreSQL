import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../styles/style";
import { MaterialIcons } from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.container, { height: responsiveHeight(100) }]}>
          <View style={styles.loginHead}>
            <View style={[styles.loginHeadText, { paddingLeft: responsiveWidth(18) }]}>
              <Text style={styles.headingtext}>Forgot Password</Text>
              <Text style={styles.desctext}>Forgot To Continue</Text>
            </View>
            <Image
              style={styles.loginimag2}
              source={require("../../assets/images/scissor1.png")}
            />
          </View>
          <View style={styles.form}>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Email / Contact</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Email Or Contact"
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

            <View style={{ marginTop: responsiveHeight(3) }}>
              <TouchableOpacity style={styles.onlybtn}>
                <Text style={styles.onlybtntext}>Login</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.bottom, { marginTop: responsiveHeight(20) }]}>
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
    </>
  );
};

export default ForgotPassword;
