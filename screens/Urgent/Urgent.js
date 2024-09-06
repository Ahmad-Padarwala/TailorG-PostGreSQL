import React, { useContext, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from "react-native";
import {
  primaryColor,
  secondaryColor,
  styles,
  whiteColor,
} from "../../styles/style";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../middleware/AuthReducer";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import axios from "axios";
const { width, height } = Dimensions.get('screen');
const PORT = process.env.EXPO_PUBLIC_API_URL;

const Urgent = () => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  //get order
  const [order, setOrder] = useState([]);
  const getCustomerOrder = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${PORT}/getAllUrgentOrder/${userToken}`
      );
      setOrder(response.data.rows);
      setLoading(false);
    } catch (error) {
      console.error(error + "error in getting order data in order page");
      setLoading(false);
    }
  };
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

  //refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await getCustomerOrder();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getCustomerOrder();
      getPathData();
    }, [])
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
          <View style={[styles.flatlistheader]}>
            <View style={[styles.headername]}>
              <View>
                <Text style={styles.headernametext}>Urgent Order</Text>
              </View>
            </View>
            {order != "" ? (
              <FlatList
                data={order}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                style={{ marginBottom: responsiveHeight(5) }}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate("viewOrder", { orderid: item.id })
                    }
                    style={styles.orderMain}
                  >
                    <View style={styles.orderRow}>
                      <View style={styles.orderImageContainer}>
                        {
                          item.dress_image == "NoImage.jpg" ? (
                            <Image
                              source={require('../../assets/images/NoImage.jpg')}
                              style={{
                                width: "70%",
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
                                width: "70%",
                                height: responsiveHeight(8),
                                borderRadius: 3,
                              }}
                            />
                          )
                        }
                      </View>
                      <View
                        style={{
                          paddingLeft: responsiveWidth(1.7),
                          width: responsiveWidth(54),
                        }}
                      >
                        <View style={styles.orderTitleContainer}>
                          <View>
                            <Text
                              style={{
                                fontFamily: "SemiBold",
                                fontSize: responsiveFontSize(2),
                              }}
                            >
                              {truncateString(item.dress_name, 8)}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 0,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View>
                              <Ionicons
                                name="time-outline"
                                style={{
                                  fontFamily: "Regular",
                                  fontSize: responsiveFontSize(1.4),
                                }}
                              />
                            </View>
                            <View>
                              <Text
                                style={{
                                  fontFamily: "Regular",
                                  fontSize: responsiveFontSize(1.4),
                                }}
                              >
                                {formatDate(item.order_date)}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            borderBottomColor: secondaryColor,
                            borderBottomWidth: 1.4,
                            borderStyle: "dashed",
                            paddingBottom: responsiveHeight(2),
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Light",
                              fontSize: responsiveFontSize(1.4),
                            }}
                          >
                            {truncateString(item.special_note, 30) || "Special note not avialable"}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.orderTitleContainer,
                            { position: "relative", top: responsiveHeight(0.6) },
                          ]}
                        >
                          <View>
                            <Text
                              style={{
                                fontFamily: "Regular",
                                fontSize: responsiveFontSize(1.7),
                              }}
                            >
                              {item.order_price} x {item.qty}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                fontFamily: "SemiBold",
                                fontSize: responsiveFontSize(1.7),
                              }}
                            >
                              {item.order_price * item.qty}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              />
            ) : (
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
                  No Urgent Order Found
                </Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default Urgent;
