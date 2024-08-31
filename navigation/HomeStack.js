import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import ShopProfile from "../screens/Shop/ShopProfile";
import Customer from "../screens/Customer/Customer";
import { primaryColor, secondaryColor, whiteColor } from "../styles/style";
import { Text, View, Dimensions } from "react-native";
import AllDresses from "../screens/Dresses/AllDresses";
import Urgent from "../screens/Urgent/Urgent";
import { useFonts } from "expo-font/build/FontHooks";
import Home from "../screens/Home";
const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('screen');

export default function HomeStack() {
  const [Fontloaded] = useFonts({
    Medium: require("../assets/Font/Poppins-Medium.ttf"),
    Bold: require("../assets/Font/Poppins-Bold.ttf"),
    ExtraBold: require("../assets/Font/Poppins-ExtraBold.ttf"),
    Regular: require("../assets/Font/Poppins-Regular.ttf"),
    SemiBold: require("../assets/Font/Poppins-SemiBold.ttf"),
    Light: require("../assets/Font/Poppins-Light.ttf"),
  });
  if (!Fontloaded) {
    return null;
  }
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarActiveTintColor: whiteColor,
        tabBarStyle: {
          height: responsiveHeight(8.3),
          paddingBottom: responsiveHeight(3),
          paddingLeft: responsiveWidth(2),
          paddingRight: responsiveWidth(2),
          shadowOpacity: 1,
          shadowRadius: 3,
          elevation: 15,
          shadowOffset: { height: -400, width: 0 },
        },
        tabBarLabelStyle: {
          display: "none",
        },
        tabBarShowLabel: true,
        tabBarIconStyle: {
          top: 5,
        },
      }}
    >
      <Tab.Screen
        name="Customers"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: responsiveHeight(1.9),
                }}
              >
                <View
                  style={{
                    width: width * 0.20,
                    height: height * 0.06,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="people"
                    size={24}
                    color={focused ? primaryColor : secondaryColor}
                  />
                  <Text
                    style={{
                      color: focused ? primaryColor : secondaryColor,
                      fontFamily: "Regular",
                      fontSize: width * 0.03,
                    }}
                  >
                    Customers
                  </Text>
                </View>
              </View>
            );
          },

          tabBarActiveTintColor: primaryColor,
          tabBarLabel: "",
        }}
        component={Customer}
      />

      <Tab.Screen
        name="shopDresses"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: responsiveHeight(1.9),
                }}
              >
                <View
                  style={{
                    width: width * 0.20,
                    height: height * 0.06,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="checkroom" size={24} color={focused ? primaryColor : secondaryColor} />
                  <Text
                    style={{
                      color: focused ? primaryColor : secondaryColor,
                      fontFamily: "Regular",
                      fontSize: width * 0.03,
                    }}
                  >
                    Dresses
                  </Text>
                </View>
              </View>
            );
          },

          tabBarActiveTintColor: primaryColor,
          tabBarLabel: "",
        }}
        component={AllDresses}
      />

      <Tab.Screen
        name="Homepage"
        options={{
          tabBarIcon: ({ }) => {
            return (
              <View
                style={{
                  marginTop: responsiveHeight(1.9),
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    backgroundColor: primaryColor,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: primaryColor,
                    shadowOffset: {
                      width: 0,
                      height: 18,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 24,
                  }}
                >
                  <Ionicons name="home" size={24} color={whiteColor} />
                </View>
              </View>
            );
          },

          tabBarActiveTintColor: primaryColor,
          tabBarLabel: "",
        }}
        component={Home}
      />

      <Tab.Screen
        name="allPayments"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: responsiveHeight(1.9),
                }}
              >
                <View
                  style={{
                    width: width * 0.20,
                    height: height * 0.06,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name="watch-later"
                    size={24}
                    color={focused ? primaryColor : secondaryColor}
                  />
                  <Text
                    style={{
                      color: focused ? primaryColor : secondaryColor,
                      fontFamily: "Regular",
                      fontSize: width * 0.03,
                    }}
                  >
                    Urgent
                  </Text>
                </View>
              </View>
            );
          },

          tabBarActiveTintColor: primaryColor,
          tabBarLabel: "",
        }}
        component={Urgent}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: responsiveHeight(1.9),
                }}
              >
                <View
                  style={{
                    width: width * 0.20,
                    height: height * 0.06,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="person"
                    size={22}
                    color={focused ? primaryColor : secondaryColor}
                  />
                  <Text
                    style={{
                      color: focused ? primaryColor : secondaryColor,
                      fontFamily: "Regular",
                      fontSize: width * 0.03,
                    }}
                  >
                    Profile
                  </Text>
                </View>
              </View>
            );
          },

          tabBarActiveTintColor: primaryColor,
          tabBarLabel: "",
        }}
        component={ShopProfile}
      />
    </Tab.Navigator>
  );
}
