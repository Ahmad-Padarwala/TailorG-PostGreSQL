import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  styles,
  whiteColor,
  primaryColor,
  secondaryColor,
  dangerColor,
} from "../../styles/style";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Ionicons } from "@expo/vector-icons";

const CancelOrder = () => {
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        {
          height: responsiveHeight(100),
        },
      ]}
    >
      {/* <View> */}
      <Image
        source={require("../../assets/images/scissor3.png")}
        style={{
          position: "absolute",
          width: responsiveWidth(40),
          height: responsiveHeight(40),
          resizeMode: "contain",
          top: 0,
          left: 0,
        }}
      />
      <Image
        source={require("../../assets/images/scissor4.png")}
        style={{
          position: "absolute",
          width: responsiveWidth(40),
          height: responsiveHeight(40),
          resizeMode: "contain",
          right: 0,
          bottom: responsiveHeight(-10),
        }}
      />
      {/* </View> */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: responsiveWidth(10),
        }}
      >
        <View
          style={[
            styles.confirmPageIconContainer,
            { backgroundColor: dangerColor },
          ]}
        >
          <Ionicons name="close-outline" size={35} color={whiteColor} />
        </View>
        <View style={{ marginTop: responsiveHeight(2) }}>
          <Text style={{ fontFamily: "Regular" }}>
            Order id : 5444945454864
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontFamily: "SemiBold",
              fontSize: responsiveFontSize(3.5),
            }}
          >
            Order Canceled
          </Text>
        </View>
        <View>
          <Text style={{ fontFamily: "Regular", textAlign: "center" }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Text>
        </View>
        <View style={{ marginTop: responsiveHeight(2) }}>
          <TouchableOpacity
            style={{
              borderRadius: 25, // Adjust to match the rounded corners
              backgroundColor: dangerColor,
              elevation: 10, // Elevation for Android
              shadowOffset: { width: 0, height: 10 }, // Offset for shadow
              shadowOpacity: 0.3, // Shadow opacity
              shadowRadius: 10, // Shadow blur
              shadowColor: dangerColor, // Shadow color
              paddingVertical: responsiveHeight(1.7),
              paddingHorizontal: responsiveWidth(12),
            }}
            onPress={() => {
              navigation.navigate("Orders");
            }}
          >
            <Text
              style={{
                color: whiteColor,
                fontFamily: "Regular",
                fontSize: responsiveFontSize(2),
                textAlign: "center",
              }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CancelOrder;
