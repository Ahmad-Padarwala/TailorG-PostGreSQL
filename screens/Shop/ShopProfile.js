import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { styles, whiteColor } from "../../styles/style";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../middleware/AuthReducer";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const ShopProfile = () => {
  const navigation = useNavigation();
  const { signout, userToken } = useContext(AuthContext);
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

  const getFirstCharacter = (str) => {
    if (str && str.length > 0) {
      const [firstCharacter] = str;
      return firstCharacter;
    }
    return "";
  };

  useFocusEffect(
    React.useCallback(() => {
      getShopData();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            signout();
          },
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <>
      <View style={[styles.backPRofileIcon, { flex: 0, flexDirection: "row" }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: "45%" }}
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
        <View style={{ width: "43%" }}>
          <Text style={styles.profileTitle}>Profile</Text>
        </View>
        <View style={{ width: "12%" }}>
          <TouchableOpacity onPress={() => navigation.navigate("helpPage")}>
            <MaterialIcons
              name="question-mark"
              size={20}
              color="black"
              style={{
                marginTop: responsiveHeight(2),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView
          style={{
            backgroundColor: whiteColor,
            flex: 1,
            height: responsiveHeight(105),
          }}
        >
          <View>
            <View style={styles.protop}>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View style={[styles.profilelater]}>
                  <Text
                    style={[
                      {
                        textAlign: "center",
                        fontSize: responsiveFontSize(8),
                        color: whiteColor,
                        fontFamily: "Regular",
                        marginTop: responsiveHeight(1.5),
                      },
                    ]}
                  >
                    {getFirstCharacter(shopData.shop_name)}
                  </Text>
                </View>
                <Text style={styles.titletext}>{shopData.shop_name}</Text>
                <Text
                  style={[styles.desctext, { lineHeight: responsiveHeight(3) }]}
                >
                  +91 {shopData.contact_number}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginHorizontal: responsiveWidth(10),
                marginTop: responsiveHeight(1.3),
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("shopDresses")}
              >
                <View style={styles.spacebetween}>
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <MaterialIcons name="checkroom" size={20} color="black" />
                    </Text>
                    <Text style={styles.prolistfont}>Dresses</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("bodyparts")}
              >
                <View style={styles.spacebetween}>
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <Ionicons name="body" size={20} color="black" />
                    </Text>
                    <Text style={styles.prolistfont}>Body Parts</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: "#d9d9d9",
                  marginVertical: responsiveHeight(2),
                }}
              ></View>

              <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
                <View style={styles.spacebetween}>
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <MaterialCommunityIcons
                        name="clipboard-text"
                        size={20}
                        color="black"
                      />
                    </Text>
                    <Text style={styles.prolistfont}>Orders</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("bankDetails")}
              >
                <View style={styles.spacebetween}>
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <MaterialCommunityIcons
                        name="bank"
                        size={20}
                        color="black"
                      />
                    </Text>
                    <Text style={styles.prolistfont}>Bank Details</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("shopeditprofile")}
              >
                <View style={styles.spacebetween}>
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <MaterialCommunityIcons
                        name="account"
                        size={20}
                        color="black"
                      />
                    </Text>
                    <Text style={styles.prolistfont}>Profile</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("helpPage")}
              >
                <View style={styles.spacebetween}>
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <MaterialIcons
                        name="question-mark"
                        size={20}
                        color="black"
                      />
                    </Text>
                    <Text style={styles.prolistfont}>Help</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <View style={styles.spacebetween}>
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <Entypo name="log-out" size={18} color="black" />
                    </Text>
                    <Text style={styles.prolistfont}>Logout</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default ShopProfile;
