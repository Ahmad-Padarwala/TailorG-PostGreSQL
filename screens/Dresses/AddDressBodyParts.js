import React, { useContext, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { primaryColor, styles, whiteColor } from "../../styles/style";
import { MaterialIcons } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useFonts } from "expo-font/build/FontHooks";
import Toast from 'react-native-toast-message';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../middleware/AuthReducer";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const AddDressBodyParts = ({ route }) => {
  const dress_unique_number = route.params.dress_unique_number;
  const gender = route.params.gender;
  const isEdit = route.params.isEdit;
  const dressId = route.params.dressId;


  const [selectedParts, setSelectedParts] = useState([]);
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

  const { userToken } = useContext(AuthContext);

  const [bodyParts, setBodyParts] = useState([]);
  const [currDressBodyParts, setCurrDressBodyParts] = useState([])
  // get body parts
  const getbodyparts = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getallbodyparts/${userToken}/${gender}`
      );
      const bodypartsRows = response.data.rows;
      setBodyParts(bodypartsRows);
    } catch (error) {
      console.error(
        error + "error in getting bodyparts data in bodyparts page"
      );
    }
  };


  // get Current Dress body parts
  const getCurrDressParts = async (uniqueNumber) => {
    try {
      const response = await axios.get(
        `${PORT}/getcurrdressbodyparts/${userToken}/${uniqueNumber}/${dressId}/${gender}`
      );
      const bodypartsRows = response.data.rows;
      setCurrDressBodyParts(bodypartsRows);
      setSelectedParts(bodypartsRows.map(part => ({ id: part.body_part_id, part_name: part.part_name })));
    } catch (error) {
      console.log(error);
      console.error(
        error + "error in getting bodyparts data in bodyparts page"
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getbodyparts();
      if (isEdit == true) {
        getCurrDressParts(dress_unique_number);
      }
    }, [])
  );

  // Body Parts selection

  const handleSelect = (item) => {
    setSelectedParts((prevSelectedParts) => {
      if (prevSelectedParts.find((part) => part.id === item.id)) {
        return prevSelectedParts.filter((part) => part.id !== item.id);
      } else {
        return [
          ...prevSelectedParts,
          { id: item.id, part_name: item.part_name },
        ];
      }
    });
  };

  const isSelected = (item) => {
    return selectedParts.some((part) => part.id === item.id);
  };

  //Save Data

  const handleSubmit = async () => {
    const data = {
      dress_unique_number,
      selectedParts,
    };
    if (isEdit) {

      try {
        const response = await axios.patch(
          `${PORT}/editdressesbodyparts/${userToken}/${dressId}`,
          data
        );
        if (response.status === 200) {
          navigation.navigate("shopDresses");
        } else {
          console.log("Error", "Upload failed");
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: "This Dress and its parts is used in other places. Please delete it from there first.",
          visibilityTime: 5000, // Display the toast for 5 seconds
          autoHide: true,
          position: "bottom"
        });
      }
    } else {

      try {
        const response = await axios.post(
          `${PORT}/adddressesbodyparts/${userToken}`,
          data
        );
        if (response.status === 200) {
          navigation.navigate("shopDresses");
        } else {
          console.log("Error", "Upload failed");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //when Flatlist Empty then showing this content
  const renderEmptyComponent = () => (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: responsiveHeight(80),
      }}
    >
      <Text
        style={{
          fontSize: responsiveFontSize(3),
          opacity: 0.4,
          fontFamily: "Regular",
        }}
      >
        No Body Parts Found
      </Text>
    </View>
  );

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
              Select Dress Parts
            </Text>
          </View>
        </View>
        <View style={styles.line70}></View>
        <FlatList
          data={bodyParts}
          keyExtractor={(item) => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          columnWrapperStyle={styles.dressFlatListContainermain}
          style={{
            backgroundColor: whiteColor,
            marginTop: responsiveHeight(4),
          }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <View
                style={[
                  styles.dressContainer,
                  {
                    paddingTop: responsiveWidth(1.3),
                    paddingBottom: responsiveWidth(0.4),
                    paddingHorizontal: responsiveHeight(0.7),
                    marginRight: responsiveWidth(3),
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
                    {item.part_name}
                  </Text>
                </View>
                {isSelected(item) && (
                  <View style={styles.dressbodypartsselected}>
                    <MaterialIcons name="done" size={16} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
        <View
          style={{
            paddingHorizontal: responsiveWidth(8),
            paddingBottom: responsiveHeight(2),
          }}
        >
          <TouchableOpacity style={styles.onlybtn} onPress={handleSubmit}>
            <Text style={styles.onlybtntext}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddDressBodyParts;