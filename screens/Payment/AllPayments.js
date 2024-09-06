import React, { useState, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  styles,
  whiteColor,
  primaryColor,
  secondaryColor,
  dangerColor,
} from "../../styles/style";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Add from "../../components/Add";
import { Feather } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import { AuthContext } from "../../middleware/AuthReducer";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const AllPayments = ({ route }) => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const id = route.params.customId;
  const [filteredPaymentData, setFilteredPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  //get payment data
  const [paymentData, setPaymentData] = useState([]);
  const getPaymentData = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getallpaymentdata/${id}/${userToken}`
      );
      const customerRows = response.data.rows;
      setPaymentData(customerRows);
      setFilteredPaymentData(customerRows);
      setLoading(false);
    } catch (error) {
      console.error(
        error + "error in getting payment data in all payment page"
      );
      setLoading(false);
    }
  };

  //get cusromer name for showing cusromer name
  const [editCustomerData, setEditCustomerData] = useState([]);
  const getCustomerDataWithId = async () => {
    try {
      const response = await axios.get(`${PORT}/getcustomerdatawithid/${id}`);
      const customerRows = response.data.rows[0];
      setEditCustomerData(customerRows);
      setLoading(false);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
      setLoading(false);
    }
  };

  //truncate string for all data
  const truncateString = (text, len) => {
    if (text && text.length > len) {
      return text.substring(0, len) + "...";
    }
    return text || "";
  };
  //get all sum of amount
  const totalUserAmount = paymentData.reduce((sum, pay) => {
    return sum + parseInt(pay.amount) + parseInt(pay.rounded);
  }, 0);
  //get data for total due
  const [totalDueData, setTotalDueData] = useState([]);
  const getDataForTotalDue = async () => {
    try {
      const response = await axios.get(`${PORT}/getdatafortotaldue/${id}`);
      const customerRows = response.data.rows;
      setTotalDueData(customerRows);
      setLoading(false);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
      setLoading(false);
    }
  };
  //get total due of customer
  const customerTotalDue = totalDueData.reduce((total, item) => {
    let multiplication = parseInt(item.price) * parseInt(item.qty);
    return total + multiplication;
  }, 0);

  //date formate
  const formatDate = (date) => {
    let pdate = new Date(date);
    const day = pdate.getDate().toString().padStart(2, "0");
    const month = (pdate.getMonth() + 1).toString().padStart(2, "0");
    const year = pdate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getCustomerDataWithId();
    await getPaymentData();
    await getDataForTotalDue();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getCustomerDataWithId();
      getPaymentData();
      getDataForTotalDue();
    }, [])
  );

  const getPreviousMonthDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  };

  const [startDate, setStartDate] = useState(getPreviousMonthDate());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    hideEndDatePicker();
  };
  //search bar section start
  const [search, setSearch] = useState("");

  // Search handler
  const handleSearch = (text) => {
    const searchTerm = text.toLowerCase().trim();
    setSearch(searchTerm);

    const filteredResults = paymentData.filter((item) => {
      const amount = item.amount || "";
      const remark = item.remark || "";
      const payment_mode = item.payment_mode || "";
      return (
        amount.includes(searchTerm) ||
        remark.toLowerCase().includes(searchTerm) ||
        payment_mode.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredPaymentData(filteredResults);
  };
  //for string truncate

  // Filter payment data based on search and date range
  const filterData = () => {
    const filteredData = paymentData.filter((item) => {
      const paymentDate = new Date(item.payment_date);
      const isWithinDateRange =
        paymentDate >= startDate && paymentDate <= endDate;
      return isWithinDateRange;
    });
    setFilteredPaymentData(filteredData);
  };

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
              <View style={{ width: responsiveWidth(75) }}>
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: responsiveFontSize(2.5),
                    fontFamily: "Medium",
                  }}
                >
                  {truncateString(editCustomerData.customer_name, 7)} Payments
                </Text>
              </View>
              <View style={{ width: responsiveWidth(12) }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("generatePdf", {
                      customId: id,
                      startDate: startDate,
                      endDate: endDate,
                    })
                  }
                >
                  <FontAwesome5 name="file-pdf" size={24} color="#BC1F1F" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.line70}></View>
            <View
              style={[
                styles.flexstart,
                {
                  marginBottom: responsiveHeight(3),
                },
              ]}
            ></View>
            <View style={styles.paymentsContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    width: "100%",
                    borderBottomLeftRadius: 5,
                    borderTopLeftRadius: 5,
                    fontFamily: "Regular",
                    fontSize: responsiveFontSize(1.6),
                    paddingVertical: responsiveHeight(1),
                    paddingHorizontal: responsiveWidth(5),
                  },
                ]}
                placeholder="Search By Amount, Remark Or Payment Type"
                underlineColorAndroid="transparent"
                onChangeText={(e) => handleSearch(e)}
                value={search}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: responsiveHeight(3),
                }}
              >
                <View style={styles.Dateinputfield}>
                  <Text style={styles.label}>Start Date</Text>
                  <TextInput
                    style={[
                      styles.Dateinput,
                      styles.disableInput,
                      { fontSize: responsiveFontSize(1.5) },
                    ]}
                    value={formatDate(startDate)}
                    editable={false}
                  />
                  <TouchableOpacity
                    style={[styles.smalliconContainer]}
                    onPress={showStartDatePicker}
                  >
                    <FontAwesome5
                      name="calendar-alt"
                      size={17}
                      color="black"
                      style={{ marginTop: responsiveHeight(0.7) }}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.Dateinputfield}>
                  <Text style={styles.label}>End Date</Text>
                  <TextInput
                    style={[
                      styles.Dateinput,
                      styles.disableInput,
                      { fontSize: responsiveFontSize(1.5) },
                    ]}
                    value={formatDate(endDate)}
                    editable={false}
                  />
                  <TouchableOpacity
                    style={styles.smalliconContainer}
                    onPress={showEndDatePicker}
                  >
                    <FontAwesome5
                      name="calendar-alt"
                      size={17}
                      color="black"
                      style={{ marginTop: responsiveHeight(0.7) }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ width: responsiveWidth(7) }}>
                  <TouchableOpacity style={styles.searchicon} onPress={filterData}>
                    <Feather name="search" size={24} color={primaryColor} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {filteredPaymentData != "" ? (
              <>
                <View style={styles.paymentsContainer}>
                  <View style={styles.paymentBox}>
                    <View style={styles.totalpayment}>
                      <View style={{ marginHorizontal: responsiveWidth(2) }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingBottom: responsiveHeight(1),
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                fontSize: responsiveFontSize(1.8),
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
                            borderBottomWidth: 1,
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                fontSize: responsiveFontSize(1.8),
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
                                fontSize: responsiveFontSize(1.8),
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

                    <FlatList
                      data={filteredPaymentData}
                      keyExtractor={(item) => item.id}
                      showsVerticalScrollIndicator={false}
                      style={{
                        marginBottom: responsiveHeight(64)
                      }}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.paymentHistory}
                          onPress={() =>
                            navigation.navigate("viewPayment", {
                              id: item.id,
                              cutomeId: id,
                            })
                          }
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View style={{ width: responsiveWidth(73) }}>
                              <View
                                style={{ marginHorizontal: responsiveWidth(2) }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingBottom: responsiveHeight(1),
                                  }}
                                >
                                  <View>
                                    <View style={styles.paymentOption}>
                                      <Text style={styles.paymentOptionText}>
                                        {item.payment_mode}
                                      </Text>
                                    </View>
                                  </View>
                                  <View>
                                    <Text
                                      style={{
                                        fontSize: responsiveFontSize(1.8),
                                        fontFamily: "Medium",
                                      }}
                                    >
                                      <FontAwesome5
                                        name="rupee-sign"
                                        size={12}
                                        color={"black"}
                                      />{" "}
                                      {parseFloat(item.amount).toFixed(2)}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    paddingBottom: responsiveHeight(1),
                                    borderBottomColor: "#0000001A",
                                    paddingTop: responsiveHeight(1),
                                    borderBottomWidth: 1,
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: responsiveFontSize(1.6),
                                      fontFamily: "Regular",
                                      color: secondaryColor,
                                    }}
                                  >
                                    Remark :{" "}
                                    {truncateString(item.remark, 8) ||
                                      "No remark avialable"}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingTop: responsiveHeight(1),
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                      marginRight: responsiveWidth(3),
                                    }}
                                  >
                                    <Ionicons
                                      name="time-outline"
                                      size={11}
                                      color={secondaryColor}
                                      style={{
                                        marginTop: responsiveHeight(0.1),
                                        marginRight: responsiveWidth(0.5),
                                      }}
                                    />
                                    <Text
                                      style={{
                                        fontSize: responsiveFontSize(1.4),
                                        fontFamily: "Medium",
                                        color: secondaryColor,
                                      }}
                                    >
                                      {formatDate(item.payment_date)}
                                    </Text>
                                  </View>
                                  <View>
                                    <Text
                                      style={{
                                        fontSize: responsiveFontSize(1.4),
                                        fontFamily: "Medium",
                                        color: secondaryColor,
                                      }}
                                    >
                                      Round:{" "}
                                      <FontAwesome5
                                        name="rupee-sign"
                                        size={9}
                                        color={secondaryColor}
                                      />{" "}
                                      {parseFloat(item.rounded).toFixed(2)}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                        />
                      }
                    />
                  </View>
                  <DateTimePickerModal
                    isVisible={isStartDatePickerVisible}
                    mode="date"
                    date={startDate}
                    onConfirm={handleStartDateConfirm}
                    onCancel={hideStartDatePicker}
                  />
                  <DateTimePickerModal
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    date={endDate}
                    onConfirm={handleEndDateConfirm}
                    onCancel={hideEndDatePicker}
                  />
                </View>
              </>
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
                  No Payment Found
                </Text>
                <TouchableOpacity
                  style={{ width: responsiveWidth(70) }}
                  onPress={() =>
                    navigation.navigate("addPayment", { customId: id })
                  }
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
                    Add Payment
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        {/* </ScrollView> */}
      </SafeAreaView>
      <Add routeName="addPayment" params={{ customId: id }} />
    </>
  );
};

export default AllPayments;
