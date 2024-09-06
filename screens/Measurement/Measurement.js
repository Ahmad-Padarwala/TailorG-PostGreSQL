import React, { useContext, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  SectionList,
  RefreshControl,
} from "react-native";
import { secondaryColor, styles } from "../../styles/style";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import Add from "../../components/Add";
import { AuthContext } from "../../middleware/AuthReducer";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const Measurement = ({ route }) => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const id = route.params.custId;
  const customerName = route.params.cust_name;

  const [measurementData, setMeasurementData] = useState([]);
  const getMeasurementData = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getallmeasurementdata/${id}/${userToken}`
      );
      const customerRows = response.data.rows;
      const groupedData = groupDataByDressName(customerRows);
      setMeasurementData(groupedData);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
  };
  const [pathData, setPathData] = useState([]);
  const getPathData = async () => {
    await axios
      .get(`${PORT}/getpathesdata`)
      .then((res) => {
        setPathData(res.data.rows[0].image_path);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const groupDataByDressName = (data) => {
    const grouped = data.reduce((acc, item) => {
      const dressName = item.dress_name;
      if (!acc[dressName]) {
        acc[dressName] = [];
      }
      acc[dressName].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map((key) => ({
      title: key,
      data: grouped[key],
    }));
  };

  //refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await getMeasurementData();
    setRefreshing(false);
  };
  const formatDate = (date) => {
    let pdate = new Date(date);
    const day = pdate.getDate().toString().padStart(2, "0");
    const month = (pdate.getMonth() + 1).toString().padStart(2, "0");
    const year = pdate.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const truncateString = (text, len) => {
    if (text.length > len) {
      return text.substring(0, len) + "...";
    }
    return text;
  };

  useFocusEffect(
    React.useCallback(() => {
      getMeasurementData();
      getPathData()
    }, [])
  );

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
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
              {truncateString(customerName, 6)} Measurement
            </Text>
          </View>
        </View>

        <View
          style={[styles.line70, { marginBottom: responsiveHeight(2) }]}
        ></View>

        {measurementData.length == 0 ? (
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
              No Measurement Data
            </Text>
          </View>
        ) : (
          <SectionList
            sections={measurementData}
            keyExtractor={(item) => `${item.id}-${item.cm_id}`}
            showsVerticalScrollIndicator={false}
            style={styles.measurementSmallTitleMain}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("viewmeasurement", {
                    id: item.cm_id,
                    cust_name: customerName,
                    cust_id: id,
                  })
                }
                style={styles.mainMeasurmentSection}
              >
                <View
                  style={{
                    flex: 0,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.measurementKurtaImageMain}>

                    {
                      item.dress_image == "NoImage.jpg" ? (
                        <Image
                          source={require('../../assets/images/NoImage.jpg')}
                          style={{
                            width: responsiveWidth(8),
                            height: responsiveHeight(3.5),
                            borderRadius: 3,
                          }}
                        />
                      ) : (
                        <Image
                          source={{
                            uri: `${pathData}/uploads/dresses/${item.dress_image}`,
                          }}
                          style={{
                            width: responsiveWidth(8),
                            height: responsiveHeight(3.5),
                            borderRadius: 3,
                          }}
                        />
                      )
                    }

                  </View>
                  <View style={{ marginHorizontal: responsiveWidth(2) }}>
                    <View>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "Regular",
                        }}
                      >
                        {item.cm_name}
                      </Text>
                    </View>
                    <View style={{ flex: 0, flexDirection: "row" }}>
                      <View>
                        <Ionicons
                          name="time-outline"
                          style={{
                            marginTop: responsiveHeight(0.2),
                            color: secondaryColor,
                          }}
                          size={10}
                        />
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: responsiveFontSize(1.2),
                            marginTop: responsiveHeight(0),
                            color: secondaryColor,
                          }}
                        >
                          {formatDate(item.cm_date)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={{ marginTop: responsiveHeight(1) }}>
                <View
                  style={{
                    flex: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={styles.measurementSmallTitle}>{title}</Text>
                  </View>
                  <View
                    style={
                      measurementData.find((item) => item.title === title)
                        ?.data[0]?.gender == "male"
                        ? styles.genderMale
                        : styles.genderFeMale
                    }
                  >
                    <Text style={styles.genderDropDownMeaserText}>
                      {
                        measurementData.find((item) => item.title === title)
                          ?.data[0]?.gender
                      }
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.measurementcateLine,
                    { marginBottom: responsiveHeight(2) },
                  ]}
                ></View>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </SafeAreaView>
      <Add routeName={"addMeasurement"} params={{ cutomerId: id }} />
    </>
  );
};

export default Measurement;
