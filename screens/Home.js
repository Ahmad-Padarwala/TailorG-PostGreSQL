import React, { useState, useContext, useEffect } from "react";
import { Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView } from "react-native";
import {
  whiteColor,
  styles,
  primaryColor,
  dangerColor,
  secondaryColor,
} from "../styles/style";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../middleware/AuthReducer";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const Home = () => {
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();
  //get shop data for shop name
  const [shopData, setShopData] = useState([]);
  const getShopData = async () => {
    await axios
      .get(`${PORT}/getshopdata/${userToken}`)
      .then((res) => {
        setShopData(res.data.rows[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //get customer data for length
  const [customerData, setCustomerData] = useState([]);
  const getCustomerData = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getallcustomerdata/${userToken}`
      );
      let customerRows = response.data;
      setCustomerData(customerRows);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
  };
  //get dress data for length
  const [Dresses, setDresses] = useState([]);
  const getDresses = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getalldresseslength/${userToken}`
      );
      const bodypartsRows = response.data.rows;
      setDresses(bodypartsRows);
    } catch (error) {
      console.error(
        error + "error in getting bodyparts data in bodyparts page"
      );
    }
  };
  //get bank detail data 
  const [bankDetail, setBankDetail] = useState([]);
  const getBankDetail = async () => {
    try {
      const response = await axios.get(`${PORT}/getallbankdata/${userToken}`);
      const bankdata = response.data.rows;
      setBankDetail(bankdata);
    } catch (error) {
      console.error(error + "error in getting bank data");
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
  //get payment data
  const [paymentData, setPaymentData] = useState([]);
  const getPaymentData = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getallpaymentdataForShop/${userToken}`
      );
      const customerRows = response.data.rows;
      setPaymentData(customerRows);
    } catch (error) {
      console.error(
        error + "error in getting payment data in all payment page"
      );
    }
  };
  //get all sum of amount
  const totalUserAmount = paymentData.reduce((sum, pay) => {
    return sum + parseInt(pay.amount) + parseInt(pay.rounded);
  }, 0);
  //get data for total due
  const [totalDueData, setTotalDueData] = useState([]);
  const getDataForTotalDue = async () => {
    try {
      const response = await axios.get(`${PORT}/getdatafortotaldueshop/${userToken}`);
      const customerRows = response.data.rows;
      setTotalDueData(customerRows);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
  };

  const getFirstCharacter = (str) => {
    if (str && str.length > 0) {
      const [firstCharacter] = str;
      return firstCharacter;
    }
    return "";
  };
  //get total due of customer
  const customerTotalDue = totalDueData.reduce((total, item) => {
    let multiplication = parseInt(item.price) * parseInt(item.qty);
    return total + multiplication;
  }, 0);

  //get all urgent order length
  const [urgentsdata, setUrgentsdata] = useState(0)
  const [activeData, setActiveData] = useState(0)
  const [deliverddata, setDelivereddata] = useState(0)

  useEffect(() => {
    const getShopSomeDetail = () => {
      let urgents = 0;
      let activeOrder = 0;
      let dileverdOrder = 0;
      for (let i = 0; i < totalDueData.length; i++) {
        if (totalDueData[i].urgent === "yes") {
          urgents++;
        }
        if (totalDueData[i].status === "active") {
          activeOrder++;
        }
        if (totalDueData[i].status === "delivered") {
          dileverdOrder++;
        }
      }

      setUrgentsdata(urgents)
      setActiveData(activeOrder)
      setDelivereddata(dileverdOrder)
    }
    getShopSomeDetail();
  }, [totalDueData])


  useFocusEffect(
    React.useCallback(() => {
      getShopData();
      getCustomerData();
      getDresses();
      getPaymentData();
      getDataForTotalDue();
      getBankDetail();
      getPathData();
      // getShopSomeDetail();
    }, [])
  );
  return (
    <>
      <SafeAreaView style={{ backgroundColor: whiteColor, flex: 1 }}>
        <ScrollView>
          <View style={[styles.flatlistheader]}>
            <View style={[styles.headername]}>
              <View>
                <Text style={styles.headernametext}>Dashboard</Text>
              </View>
            </View>

            <View
              style={{
                flex: 0,
                flexDirection: "row",
                backgroundColor: primaryColor,
                padding: 7,
                alignItems: "center",
                marginTop: responsiveHeight(1.5),
                borderRadius: responsiveWidth(1),
              }}
            >
              <View
                style={{
                  backgroundColor: whiteColor,
                  borderRadius: 100,
                  width: responsiveWidth(9),
                  height: responsiveHeight(4.2),
                  marginHorizontal: responsiveWidth(3),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: responsiveFontSize(10),
                  fontFamily: "Regular",
                }}
              >
                <Text>
                  {getFirstCharacter(shopData.shop_name)}
                </Text>
              </View>
              <View>
                <Text style={{ color: whiteColor, fontFamily: "SemiBold" }}>
                  {shopData.shop_name}
                </Text>
              </View>
            </View>

            <View style={{ flex: 0, flexDirection: "row" }}>
              <View
                style={[
                  styles.dressContainer,
                  {
                    paddingTop: 5,
                    marginTop: responsiveHeight(3),
                    width: "auto",
                  },
                ]}
              >
                <View
                  style={{
                    backgroundColor: primaryColor,
                    width: responsiveWidth(6),
                    borderRadius: 100,
                    height: responsiveHeight(3),
                  }}
                >
                  <Ionicons
                    name="person"
                    size={13}
                    color={whiteColor}
                    style={{ marginHorizontal: "auto", marginVertical: "auto" }}
                  ></Ionicons>
                </View>
                <Text
                  style={{
                    fontFamily: "SemiBold",
                    marginTop: responsiveHeight(0.5),
                    fontSize: responsiveFontSize(2.3),
                  }}
                >
                  {customerData.length || 0}
                </Text>
                <Text
                  style={{
                    fontFamily: "Regular",
                    marginTop: responsiveHeight(-0.5),
                    fontSize: responsiveFontSize(1.5),
                  }}
                >
                  Total customer
                </Text>
              </View>
              <View
                style={[
                  styles.dressContainer,
                  {
                    paddingTop: 5,
                    marginTop: responsiveHeight(3),
                    marginHorizontal: responsiveWidth(4),
                    width: "auto",
                  },
                ]}
              >
                <View
                  style={{
                    width: responsiveWidth(6),
                    borderRadius: 100,
                    height: responsiveHeight(3),
                  }}
                >
                  <Ionicons
                    name="cut"
                    size={20}
                    color={primaryColor}
                    style={{ marginHorizontal: "auto", marginVertical: "auto" }}
                  ></Ionicons>
                </View>
                <Text
                  style={{
                    fontFamily: "SemiBold",
                    marginTop: responsiveHeight(0.5),
                    fontSize: responsiveFontSize(2.3),
                  }}
                >
                  {Dresses.length || 0}
                </Text>
                <Text
                  style={{
                    fontFamily: "Regular",
                    marginTop: responsiveHeight(-0.5),
                    fontSize: responsiveFontSize(1.5),
                  }}
                >
                  Dress Types
                </Text>
              </View>
            </View>

            <View style={{ marginTop: responsiveHeight(2) }}>
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: responsiveFontSize(1.5),
                }}
              >
                Order Details:
              </Text>
            </View>

            <View style={{ flex: 0, flexDirection: "row" }}>
              <View
                style={[
                  styles.totalpayment,
                  {
                    marginTop: responsiveHeight(1),
                    height: responsiveHeight(8.5),
                    paddingTop: responsiveHeight(1.6),
                    marginBottom: 0,
                    flex: 0,
                    flexDirection: "row",
                  },
                ]}
              >
                <View
                  style={{
                    borderRightColor: secondaryColor,
                    borderRightWidth: 1,
                    paddingRight: responsiveWidth(3),
                  }}
                >
                  <View style={{ flex: 0, flexDirection: "row" }}>
                    <View>
                      <Text
                        style={{
                          fontFamily: "Regular",
                          fontSize: responsiveFontSize(1.5),
                        }}
                      >
                        Active
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#FFA500",
                        width: responsiveWidth(2),
                        height: responsiveHeight(1),
                        borderRadius: 100,
                        marginTop: responsiveHeight(0.7),
                        marginHorizontal: responsiveWidth(1),
                      }}
                    >
                      <Text></Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{ fontFamily: "SemiBold" }}>{activeData}</Text>
                  </View>
                </View>
                <View style={{ paddingLeft: responsiveWidth(3) }}>
                  <View style={{ flex: 0, flexDirection: "row" }}>
                    <View>
                      <Text
                        style={{
                          fontFamily: "Regular",
                          fontSize: responsiveFontSize(1.5),
                        }}
                      >
                        Delievered
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: primaryColor,
                        width: responsiveWidth(2),
                        height: responsiveHeight(1),
                        borderRadius: 100,
                        marginTop: responsiveHeight(0.7),
                        marginHorizontal: responsiveWidth(1),
                      }}
                    >
                      <Text></Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{ fontFamily: "SemiBold" }}>{deliverddata}</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: dangerColor,
                  marginTop: responsiveHeight(1),
                  height: responsiveHeight(8.5),
                  paddingHorizontal: responsiveWidth(4),
                  marginLeft: responsiveWidth(3),
                  paddingVertical: responsiveHeight(1.5),
                  borderRadius: 7,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "Regular",
                      fontSize: responsiveFontSize(1.5),
                      paddingTop: responsiveHeight(0),
                      color: whiteColor,
                    }}
                  >
                    Urgent Order
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "SemiBold",
                      paddingTop: responsiveHeight(0),
                      color: whiteColor,
                    }}
                  >
                    {urgentsdata}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: responsiveHeight(2) }}>
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: responsiveFontSize(1.5),
                }}
              >
                Payment Detail:
              </Text>
            </View>

            <View
              style={[styles.totalpayment, { marginTop: responsiveHeight(1) }]}
            >
              <View style={{ marginHorizontal: responsiveWidth(1) }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: responsiveHeight(0.5),
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.6),
                        fontFamily: "Regular",
                      }}
                    >
                      Total Paid :
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.8),
                        fontFamily: "Regular",
                        color: primaryColor,
                      }}
                    >
                      {totalUserAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: responsiveHeight(1),
                    borderBottomColor: "#0000001A",
                    paddingBottom: responsiveHeight(1),
                    borderBottomWidth: 1,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.6),
                        fontFamily: "Regular",
                      }}
                    >
                      Total Due :
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.8),
                        fontFamily: "Regular",
                        color: dangerColor,
                      }}
                    >
                      {parseFloat(customerTotalDue).toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: responsiveHeight(1.5),
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.6),
                        fontFamily: "Medium",
                        fontWeight: "bold",
                      }}
                    >
                      Net Balance :
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.8),
                        fontFamily: "Regular",
                        color:
                          totalUserAmount - customerTotalDue >= 0
                            ? primaryColor
                            : dangerColor,
                      }}
                    >
                      {parseFloat(
                        totalUserAmount - customerTotalDue
                      ).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {
              bankDetail.length > 0 ? (
                <View
                  style={[styles.totalpayment, { marginTop: responsiveHeight(1) }]}
                >
                  <View
                    style={{ flex: 0, flexDirection: "row", alignItems: "center" }}
                  >
                    <View
                      style={{
                        width: responsiveWidth(25),
                        height: responsiveHeight(12),
                      }}
                    >
                      <Image
                        source={{ uri: `${pathData}/uploads/bank/${bankDetail[0].image}` }}
                        style={{ width: "100%", height: responsiveHeight(12) }}
                      />
                    </View>
                    <View style={{ marginHorizontal: responsiveWidth(3) }}>
                      <Text
                        style={{
                          fontFamily: "SemiBold",
                          fontSize: responsiveFontSize(1.6),
                        }}
                      >
                        {shopData.last_name} {shopData.first_name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "SemiBold",
                          fontSize: responsiveFontSize(1.6),
                          maxWidth: responsiveWidth(47),
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Bank:{""}{" "}
                        <Text style={{ fontFamily: "Regular" }}>
                          {bankDetail[0].bank_name}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontFamily: "SemiBold",
                          fontSize: responsiveFontSize(1.6),
                          maxWidth: responsiveWidth(50),
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        AC No:{""}{" "}
                        <Text style={{ fontFamily: "Regular" }}>{bankDetail[0].ac_no}</Text>
                      </Text>
                      <Text
                        style={{
                          fontFamily: "SemiBold",
                          fontSize: responsiveFontSize(1.6),
                        }}
                      >
                        IFSC:{""}{" "}
                        <Text
                          style={{
                            fontFamily: "Regular",
                            fontSize: responsiveFontSize(1.6),
                          }}
                        >
                          {bankDetail[0].ifsc_code}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={[styles.totalpayment, {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: responsiveHeight(13),
                    marginTop: responsiveHeight(1),
                    marginBottom: responsiveHeight(2)
                  }]}
                >
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2),
                      opacity: 0.4,
                      fontFamily: "Regular",
                    }}
                  >
                    No Bank Detail Found
                  </Text>
                  <TouchableOpacity
                    style={{ width: responsiveWidth(60), marginTop: responsiveHeight(1) }}
                    onPress={() => navigation.navigate("bankDetails")}
                  >
                    <Text
                      style={[
                        {
                          textAlign: "center",
                          fontSize: responsiveFontSize(2),
                          borderRadius: 10,
                          padding: responsiveHeight(1),
                          color: whiteColor,
                          fontFamily: "Regular",
                          backgroundColor: primaryColor,
                        },
                      ]}
                    >
                      Add Bank Detail
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <View>
              <Text style={{ fontFamily: "Regular" }}>Developed By :</Text>
            </View>
            <View style={{ paddingLeft: responsiveWidth(2) }}>
              <Image
                source={require("../assets/images/valudalogo.png")}
                style={{
                  width: responsiveWidth(30),
                  height: responsiveHeight(6),
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;
