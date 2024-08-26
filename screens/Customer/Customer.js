import React, { useContext, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { dangerColor, primaryColor, styles, whiteColor } from "../../styles/style";
import SelectDropdown from "react-native-select-dropdown";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import Add from "../../components/Add";
import axios from "axios";
import { AuthContext } from "../../middleware/AuthReducer";
const PORT = process.env.EXPO_PUBLIC_API_URL;
const { width, height } = Dimensions.get('screen');
const Customer = () => {
  const navigation = useNavigation();
  const [Ordertype, setOrdertype] = useState("All");
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);
  const { userToken } = useContext(AuthContext);
  const category = ["All", "Credit", "Debit"];
  const [customerData, setCustomerData] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  //get cumstomer
  const getCustomerData = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getallcustomerdata/${userToken}`
      );
      let customerRows = response.data;
      customerRows = customerRows.sort((a, b) =>
        a.customer_name.localeCompare(b.customer_name)
      );
      setCustomerData(customerRows);
      setLoading(false);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
      setLoading(false);
    }
  };


  const getFirstCharacter = (str) => {
    if (str && str.length > 0) {
      const [firstCharacter] = str;
      return firstCharacter;
    }
    return "";
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getCustomerData();
    setRefreshing(false);
  };
  const Whatsapp = (e) => {
    Linking.openURL(`whatsapp://send?text=Hello&phone=+91${e}`);
  };

  const Phone = (e) => {
    Linking.openURL(`tel:${e}`);
  };

  const truncateString = (text, len) => {
    if (text.length > len) {
      return text.substring(0, len) + "...";
    }
    return text;
  };

  const handleSearch = (text) => {
    setSearch(text.toLowerCase());
  };

  const filterData = customerData.filter((item) => {
    const totalOrderValue = parseFloat(item.total_order_value) || 0;
    const totalAmount = parseFloat(item.total_amount) + parseFloat(item.rounded) || 0;
    const result = totalAmount - totalOrderValue;
    if (Ordertype === "Credit" && result < 0) {
      return false;
    }
    if (Ordertype === "Debit" && result >= 0) {
      return false;
    }

    return item.customer_name.toLowerCase().includes(search.trim());
  });

  useFocusEffect(
    React.useCallback(() => {
      getCustomerData();
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
              <View style={{
                width: width * 0.50,
                height: responsiveHeight(5),
                flexDirection: "row",
                alignItems: "center",
              }}>
                <Text style={styles.headernametext}>Customers</Text>
              </View>
              <View
                style={{
                  height: width * 0.09,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <SelectDropdown
                  data={category}
                  onSelect={(selectedItem) => {
                    setOrdertype(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item) => {
                    return item;
                  }}
                  defaultButtonText={"All"}
                  buttonStyle={{
                    backgroundColor: whiteColor,
                    width: width * 0.34,
                  }}
                  buttonTextStyle={{
                    fontSize: width * 0.035,
                    color: primaryColor,
                    fontFamily: "Medium",
                  }}
                  selectedRowTextStyle={{
                    fontSize: width * 0.035,
                    fontFamily: "Medium",
                    color: primaryColor,
                    opacity: 1,
                  }}
                  dropdownStyle={{ marginTop: -10, borderRadius: 5 }}
                  rowTextStyle={{ fontSize: width * 0.035, fontFamily: "Regular" }}
                  renderDropdownIcon={() => {
                    return (
                      <Ionicons
                        style={{ marginLeft: width * -0.09 }}
                        name="chevron-down-outline"
                        size={16}
                      ></Ionicons>
                    );
                  }}
                />
              </View>
            </View>

            <View
              style={[
                styles.flexstart,
                {
                  marginTop: responsiveHeight(2.5),
                  marginBottom: responsiveHeight(2),
                },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  {
                    width: "100%",
                  },
                ]}
                placeholder="Search Customer"
                underlineColorAndroid="transparent"
                onChangeText={(e) => handleSearch(e)}
                value={search}
              />
            </View>

            {filterData != "" ? (
              <FlatList
                data={filterData}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={{ marginBottom: responsiveHeight(17) }}
                onScroll={(e) => {
                  const currentOffset = e.nativeEvent.contentOffset.y;
                  const direction =
                    currentOffset > scrollOffset ? "down" : "up";
                  setIsButtonVisible(direction === "up");
                  setScrollOffset(currentOffset);
                }}
                renderItem={({ item }) => {

                  const totalOrderValue = parseFloat(item.total_order_value) || 0;
                  const totalAmount = parseFloat(item.total_amount) + parseFloat(item.rounded) || 0;

                  const result = totalAmount - totalOrderValue;
                  return (
                    <TouchableOpacity
                      style={styles.customerMain}
                      onPress={() =>
                        navigation.navigate("viewcustomer", { id: item.id })
                      }
                    >
                      <View style={{ flex: 0, flexDirection: "row" }}>
                        <View
                          style={[
                            styles.customerProfileImage,
                            {
                              backgroundColor: item.bg_color ? item.bg_color : primaryColor,
                              display: "flex",
                              justifyContent: "center",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              {
                                textAlign: "center",
                                fontSize: responsiveFontSize(3),
                                color: whiteColor,
                                fontFamily: "Regular",
                                marginTop: 3,
                              },
                            ]}
                          >
                            {getFirstCharacter(item.customer_name)}
                          </Text>
                        </View>
                        <View
                          style={{
                            marginHorizontal: responsiveWidth(3),
                            flex: 0,
                            justifyContent: "center",
                          }}
                        >
                          <View>
                            <Text style={styles.customerName}>
                              {truncateString(item.customer_name, 10)}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 0,
                              flexDirection: "row",
                              marginTop: responsiveHeight(-0.5),
                            }}
                          >
                            <View style={{ flex: 0, flexDirection: "row" }}>
                              <View
                                style={{
                                  marginTop: responsiveHeight(0.3),
                                  marginRight: responsiveWidth(1),
                                }}
                              >
                                <Ionicons name="location" size={10} />
                              </View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: responsiveFontSize(1.5),
                                    fontFamily: "Regular",
                                    width: "100%",
                                  }}
                                >
                                  {truncateString(item.address, 10) || "No Address"}
                                </Text>
                              </View>
                            </View>
                            <View>
                              <Text
                                style={{
                                  marginHorizontal: responsiveWidth(3),
                                  color: result < 0 ? dangerColor : primaryColor,
                                  fontSize: responsiveFontSize(1.6),
                                  fontFamily: "Regular",
                                }}
                              >
                                {result ? result.toFixed(2) : '0.00'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          flex: 0,
                          flexDirection: "row",
                          marginTop: responsiveHeight(1),
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            Phone(item.mobile_number);
                          }}
                        >
                          <Ionicons
                            name="call"
                            size={20}
                            style={{ marginHorizontal: responsiveWidth(3) }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            Whatsapp(item.mobile_number);
                          }}
                        >
                          <Ionicons
                            name="logo-whatsapp"
                            size={20}
                            color={primaryColor}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  )
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
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
                  No Customer Found
                </Text>
                <TouchableOpacity
                  style={{ width: responsiveWidth(70) }}
                  onPress={() => navigation.navigate("addCustomer")}
                >
                  <Text
                    style={[
                      {
                        textAlign: "center",
                        marginTop: responsiveHeight(3),
                        fontSize: responsiveFontSize(2),
                        borderRadius: 10,
                        padding: responsiveHeight(1),
                        color: whiteColor,
                        fontFamily: "Regular",
                        backgroundColor: primaryColor,
                      },
                    ]}
                  >
                    Add Customer
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
      {isButtonVisible && <Add routeName={"addCustomer"} />}
    </>
  );
};

export default Customer;
