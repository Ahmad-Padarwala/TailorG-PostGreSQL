import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { primaryColor, styles, whiteColor } from "../../styles/style";
import { MaterialIcons } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useFonts } from "expo-font/build/FontHooks";
import { useNavigation } from "@react-navigation/native";

const EditDressBodyParts = () => {
  const navigation = useNavigation();
  const [Fontloaded] = useFonts({
    Medium: require("../../assets/Font/Poppins-Medium.ttf"),
    Bold: require("../../assets/Font/Poppins-Bold.ttf"),
    ExtraBold: require("../../assets/Font/Poppins-ExtraBold.ttf"),
    Regular: require("../../assets/Font/Poppins-Regular.ttf"),
  });
  if (!Fontloaded) {
    return null;
  }
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
              Update Dress Parts
            </Text>
          </View>
        </View>
        <View style={styles.line70}></View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: whiteColor,
            marginTop: responsiveHeight(4),
          }}
        >
          <View style={styles.dressContainermain}>
            <View
              style={[
                styles.dressContainer,
                {
                  paddingTop: responsiveWidth(1.3),
                  paddingBottom: responsiveWidth(0.4),
                  paddingHorizontal: responsiveHeight(0.7),
                  position: "relative",
                },
              ]}
            >
              <View
                style={[
                  styles.imageContainer,
                  { height: responsiveHeight(10) },
                ]}
              >
                <Text style={{ textAlign: "center", fontFamily: "Regular" }}>
                  Kurta
                </Text>
              </View>
              <View style={styles.dressbodypartsselected}>
                <MaterialIcons name="done" size={16} color="white" />
              </View>
            </View>
            <View
              style={[
                styles.dressContainer,
                {
                  paddingTop: responsiveWidth(1.3),
                  paddingBottom: responsiveWidth(0.4),
                  paddingHorizontal: responsiveHeight(0.7),
                  position: "relative",
                },
              ]}
            >
              <View
                style={[
                  styles.imageContainer,
                  { height: responsiveHeight(10) },
                ]}
              >
                <Text style={{ textAlign: "center", fontFamily: "Regular" }}>
                  Kurta
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.dressContainer,
                {
                  paddingTop: responsiveWidth(1.3),
                  paddingBottom: responsiveWidth(0.4),
                  paddingHorizontal: responsiveHeight(0.7),
                  position: "relative",
                },
              ]}
            >
              <View
                style={[
                  styles.imageContainer,
                  { height: responsiveHeight(10) },
                ]}
              >
                <Text style={{ textAlign: "center", fontFamily: "Regular" }}>
                  Kurta
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.dressContainer,
                {
                  paddingTop: responsiveWidth(1.3),
                  paddingBottom: responsiveWidth(0.4),
                  paddingHorizontal: responsiveHeight(0.7),
                  position: "relative",
                },
              ]}
            >
              <View
                style={[
                  styles.imageContainer,
                  { height: responsiveHeight(10) },
                ]}
              >
                <Text style={{ textAlign: "center", fontFamily: "Regular" }}>
                  Kurta
                </Text>
              </View>
              <View style={styles.dressbodypartsselected}>
                <MaterialIcons name="done" size={16} color="white" />
              </View>
            </View>
            <View
              style={[
                styles.dressContainer,
                {
                  paddingTop: responsiveWidth(1.3),
                  paddingBottom: responsiveWidth(0.4),
                  paddingHorizontal: responsiveHeight(0.7),
                  position: "relative",
                },
              ]}
            >
              <View
                style={[
                  styles.imageContainer,
                  { height: responsiveHeight(10) },
                ]}
              >
                <Text style={{ textAlign: "center", fontFamily: "Regular" }}>
                  Kurta
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.dressContainer,
                {
                  paddingTop: responsiveWidth(1.3),
                  paddingBottom: responsiveWidth(0.4),
                  paddingHorizontal: responsiveHeight(0.7),
                  position: "relative",
                },
              ]}
            >
              <View
                style={[
                  styles.imageContainer,
                  { height: responsiveHeight(10) },
                ]}
              >
                <Text style={{ textAlign: "center", fontFamily: "Regular" }}>
                  Kurta
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            paddingHorizontal: responsiveWidth(8),
            paddingBottom: responsiveHeight(2),
          }}
        >
          <TouchableOpacity style={styles.onlybtn}>
            <Text style={styles.onlybtntext}>Update</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default EditDressBodyParts;
