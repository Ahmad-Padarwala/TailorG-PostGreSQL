import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { primaryColor, styles, whiteColor } from "../../styles/style";
import SelectDropdown from "react-native-select-dropdown";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useFonts } from "expo-font/build/FontHooks";
import { Ionicons } from "@expo/vector-icons";
import Add from "../../components/Add";
import axios from "axios";
import { AuthContext } from "../../middleware/AuthReducer";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const AllDresses = () => {
  const navigation = useNavigation();
  const [Ordertype, setOrdertype] = useState("All");
  const category = ["All", "Male", "Female"];
  const [refreshing, setRefreshing] = useState(false);
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
  const [Dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pathData, setPathData] = useState([]);
  const getPathData = async () => {
    setLoading(true)
    await axios
      .get(`${PORT}/getpathesdata`)
      .then((res) => {
        setPathData(res.data.rows[0].image_path);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  // get body parts
  const getDresses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${PORT}/getalldresses/${userToken}`, {
        params: { gender: Ordertype },
      });
      const bodypartsRows = response.data.rows;
      setDresses(bodypartsRows);
      setLoading(false);
    } catch (error) {
      console.error(
        error + "error in getting bodyparts data in bodyparts page"
      );
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getDresses();
    }, [Ordertype])
  );
  useFocusEffect(
    React.useCallback(() => {
      getPathData();
    }, [])
  );
  //onrefresh
  const onRefresh = async () => {
    setRefreshing(true);
    await getDresses();
    setRefreshing(false);
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
        No Dresses Found
      </Text>
    </View>
  );

  return (
    <>
      <SafeAreaView style={{ backgroundColor: whiteColor, flex: 1 }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator
              size={70}
              color={primaryColor}
              style={{
                flex: 1,
                justifyContent: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 10,
              }}
            />
          </View>
        ) : (
          <>
            <View style={[styles.flatlistheader]}>
              <View style={[styles.headername]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="arrow-back-outline"
                    size={20}
                    color="black"
                    style={{
                      alignSelf: "center",
                      marginRight: responsiveWidth(2)
                    }}
                  />
                </TouchableOpacity>
                <View>
                  <Text style={styles.headernametext}>Dresses</Text>
                </View>
                <View
                  style={{
                    width: responsiveWidth(78),
                    height: responsiveHeight(5),
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <SelectDropdown
                    data={category}
                    onSelect={(selectedItem) => {
                      setOrdertype(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                    defaultButtonText={Ordertype}
                    buttonStyle={{
                      backgroundColor: whiteColor,
                      width: "41%",
                      left: 60,
                    }}
                    buttonTextStyle={{
                      fontSize: 14,
                      color: primaryColor,
                      fontFamily: "Medium",
                      textAlign: "center",
                    }}
                    selectedRowTextStyle={{
                      fontSize: 14,
                      fontFamily: "Medium",
                      color: primaryColor,
                      opacity: 1,
                    }}
                    dropdownStyle={{ marginTop: -10, borderRadius: 5 }}
                    rowTextStyle={{ fontSize: 14, fontFamily: "Regular" }}
                    renderDropdownIcon={() => {
                      return (
                        <Ionicons
                          style={{ marginLeft: responsiveWidth(-6) }}
                          name="chevron-down-outline"
                          size={16}
                        ></Ionicons>
                      );
                    }}
                  />
                </View>
              </View>
              {/* when no data found start */}
            </View>

            {/* when data found start */}

            <FlatList
              data={Dresses}
              keyExtractor={(item) => item.id}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyComponent}
              columnWrapperStyle={styles.dressContainermain}
              style={{
                marginVertical: responsiveHeight(1),
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("viewDress", { id: item.id });
                  }}
                  style={styles.dressContainer}
                >
                  <View style={styles.imageContainer}>
                    {
                      item.dress_image == "NoImage.jpg" ? (
                        <Image
                          source={require('../../assets/images/NoImage.jpg')}
                          style={{
                            width: "100%",
                            height: responsiveHeight(8),
                            borderRadius: 3,
                          }}
                        />
                      ) : (
                        <Image
                          source={{
                            uri: `${pathData}/uploads/dresses/${item.dress_image}`,
                          }}
                          style={{
                            width: "100%",
                            height: responsiveHeight(8),
                            borderRadius: 3,
                          }}
                        />
                      )
                    }
                  </View>
                  <Text style={{ textAlign: "center", fontFamily: "Regular" }}>
                    {item.dress_name}
                  </Text>
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            />

            {/* when data found end */}
            <Add routeName={"addShopDress"} />
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default AllDresses;
