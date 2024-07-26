import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { styles } from "../../styles/style";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import GestureRecognizer from "react-native-swipe-gestures";

const Onbording3 = () => {
  const navigation = useNavigation();
  const GetStarted = () => {
    // AsyncStorage.setItem("hasLaunched", "true")
    navigation.navigate("authroute");
  };
  const onSwipeRight = () => {
    navigation.navigate("Onbording2");
  };
  return (
    <>
      <GestureRecognizer
        onSwipeRight={onSwipeRight}
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { height: responsiveHeight(100) }]}>
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle}></View>
            <Image
              style={styles.image}
              source={require("../../assets/images/onbord3.png")}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.headingtext}>We Crafting Dreams</Text>
            <Text style={styles.paratext}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
              itaque.
            </Text>
          </View>

          <View style={styles.dotcontainer}>
            <View style={styles.dot}></View>
            <View style={styles.dot}></View>
            <View style={[styles.dot, styles.active]}></View>
          </View>

          <View style={styles.btngroup}>
            <TouchableOpacity
              style={[styles.btnactive, styles.active]}
              onPress={GetStarted}
            >
              <Text style={[styles.fullbtn, styles.active]}>
                Get Started <Ionicons name="arrow-forward-outline"></Ionicons>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureRecognizer>
    </>
  );
};

export default Onbording3;
