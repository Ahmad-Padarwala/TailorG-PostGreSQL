import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useFonts } from "expo-font/build/FontHooks";
import { styles } from "../../styles/style";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import GestureRecognizer from "react-native-swipe-gestures";

const Onbording1 = () => {
  const navigation = useNavigation();
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height
  });
  const [Fontloaded] = useFonts({
    Medium: require("../../assets/Font/Poppins-Medium.ttf"),
    Bold: require("../../assets/Font/Poppins-Bold.ttf"),
    ExtraBold: require("../../assets/Font/Poppins-ExtraBold.ttf"),
    Regular: require("../../assets/Font/Poppins-Regular.ttf"),
    SemiBold: require("../../assets/Font/Poppins-SemiBold.ttf"),
    Light: require("../../assets/Font/Poppins-Light.ttf"),
  });

  const onSwipeLeft = () => {
    navigation.navigate("Onbording2");
  };

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions({ width: window.width, height: window.height * 0.09 });
    };

    const subscription = Dimensions.addEventListener('change', onChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  if (!Fontloaded) {
    return null;
  }
  return (
    <>
      <GestureRecognizer
        onSwipeLeft={onSwipeLeft}
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, { height: dimensions.height }]}>
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle}></View>
            <Image
              style={styles.image}
              source={require("../../assets/images/onbord1.png")}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.headingtext}>Welcome To TailorG</Text>
            <Text style={styles.paratext}>
              TailorG simplifies clothing customization and ordering. Choose your style and fit with ease.
            </Text>
          </View>

          <View style={styles.dotcontainer}>
            <View style={[styles.dot, styles.active]}></View>
            <View style={styles.dot}></View>
            <View style={styles.dot}></View>
          </View>

          <View style={styles.btngroup}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Onbording2");
              }}
            >
              <Text style={styles.btntext}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnactive, styles.active]}
              onPress={() => {
                navigation.navigate("Onbording2");
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

export default Onbording1;
