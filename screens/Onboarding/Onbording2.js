import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { styles } from "../../styles/style";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import GestureRecognizer from "react-native-swipe-gestures";

const Onbording2 = () => {
  const navigation = useNavigation();
  const onSwipeLeft = () => {
    navigation.navigate("Onbording3");
  };
  const onSwipeRight = () => {
    navigation.navigate("Onbording1");
  };
  return (
    <>
      <GestureRecognizer
        onSwipeLeft={onSwipeLeft}
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
              source={require("../../assets/images/onbord2.png")}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.headingtext}>We Make, You Wear</Text>
            <Text style={styles.paratext}>
              TailorG crafts your perfect fit. Customize with ease and enjoy tailored style.

            </Text>
          </View>

          <View style={styles.dotcontainer}>
            <View style={styles.dot}></View>
            <View style={[styles.dot, styles.active]}></View>
            <View style={styles.dot}></View>
          </View>

          <View style={styles.btngroup}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Onbording3");
              }}
            >
              <Text style={styles.btntext}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnactive, styles.active]}
              onPress={() => {
                navigation.navigate("Onbording3");
              }}
            >
              <Text style={[styles.btntext, styles.active]}>
                Next <Ionicons name="arrow-forward-outline"></Ionicons>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureRecognizer>
    </>
  );
};

export default Onbording2;
