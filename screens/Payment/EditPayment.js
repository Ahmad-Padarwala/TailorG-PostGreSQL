import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { styles, whiteColor, primaryColor, dangerColor } from "../../styles/style";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { RadioButton } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import { AuthContext } from "../../middleware/AuthReducer";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const EditPayment = ({ route }) => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const id = route.params.id;
  const customerId = route.params.cid;
  const [editPaymentData, setEditPaymentData] = useState({
    amount: "",
    rounded: "",
    payment_mode: "Cash",
    remark: "",
    payment_date: "",
    updated_by: "",
  });
  const getPaymentData = async () => {
    try {
      const response = await axios.get(`${PORT}/getpaymentdatawithid/${id}`);
      const customerRows = response.data.rows[0];
      setEditPaymentData(customerRows);
      setEditPaymentData((prevData) => ({
        ...prevData,
        payment_date: addOneDay(customerRows.payment_date),
      }));
    } catch (error) {
      console.error(error + "error in getting payment data in all payment page");
    }
  };
  const handleChange = (name, value) => {
    setEditPaymentData((prevProdData) => ({
      ...prevProdData,
      [name]: value,
    }));

  };
  //get cusromer name for showing cusromer name
  const [editCustomerData, setEditCustomerData] = useState([]);
  const getCustomerDataWithId = async () => {
    try {
      const response = await axios.get(`${PORT}/getcustomerdatawithid/${customerId}`);
      const customerRows = response.data.rows[0];
      setEditCustomerData(customerRows);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
  };
  //get shop data for recieved by column in payment table
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

  //edit data section start
  const updatePayment = (id) => {
    if (editPaymentData.amount == "") {
      alert("Please Insert Amount");
      return;
    }
    axios
      .put(`${PORT}/updatepaymentdata/${id}`, editPaymentData)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //for date managing code
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setEditPaymentData((prevData) => ({
      ...prevData,
      payment_date: addOneDay(date),
    }));
    hideStartDatePicker();
  };
  const formatDate = (date) => {
    let pdate = new Date(date);
    const day = pdate.getDate().toString().padStart(2, "0");
    const month = (pdate.getMonth() + 1).toString().padStart(2, "0");
    const year = pdate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const addOneDay = (date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);

    // Convert the date to UTC format to prevent time zone shifts
    const utcDate = new Date(
      Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
    );
    return utcDate;
  };



  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    const amount = parseFloat(editPaymentData.amount) || 0;
    const rounded = parseFloat(editPaymentData.rounded) || 0;
    setTotalAmount(amount + rounded);
  }, [editPaymentData.amount, editPaymentData.rounded]);

  useEffect(() => {
    if (shopData.first_name) {
      setEditPaymentData((prevPayment) => ({
        ...prevPayment,
        updated_by: shopData.first_name,
      }));
    }
  }, [shopData]);
  useEffect(() => {
    getPaymentData();
    getShopData();
    getCustomerDataWithId();
  }, [])

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
              Edit Payment
            </Text>
          </View>
        </View>

        <View style={styles.line70}></View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.form, { marginTop: responsiveHeight(5) }]}>
            <View style={{ marginBottom: responsiveHeight(2) }}>
              <Text style={styles.label}>
                <Text style={{ fontWeight: "900" }}>Customer Name : </Text>
                <Text>{editCustomerData.customer_name}</Text>
              </Text>
            </View>
            <View>
              <View style={styles.inputfield}>
                <Text style={[styles.label]}>Received Amount <Text style={{ color: dangerColor }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={(text) => handleChange("amount", text)}
                  value={editPaymentData.amount}
                ></TextInput>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginBottom: responsiveHeight(2.2),
                }}
              >
                <View
                  style={{
                    width: responsiveWidth(35),
                    paddingRight: responsiveWidth(4),
                  }}
                >
                  <Text style={{ marginBottom: responsiveHeight(1.5) }}>
                    Round Amt
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleChange("rounded", text)}
                    value={editPaymentData.rounded}
                    keyboardType="numeric"
                  ></TextInput>
                </View>
                <View style={{ width: responsiveWidth(40) }}>
                  <Text
                    style={[
                      styles.dashedBorder,
                      { marginBottom: responsiveHeight(1.5) },
                    ]}
                  >
                    Total Amount
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>{totalAmount.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Payment Mode</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <RadioButton
                  value="Cash"
                  status={editPaymentData.payment_mode === "Cash" ? "checked" : "unchecked"}
                  onPress={(text) => handleChange("payment_mode", "Cash")}
                  color={primaryColor}
                  uncheckedColor={primaryColor}
                />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 6,
                    opacity: 0.6,
                    fontSize: responsiveFontSize(2),
                    fontFamily: "Regular",
                  }}
                >
                  Cash
                </Text>

                <View style={{ marginLeft: 10 }}>
                  <RadioButton
                    value="Bank"
                    status={editPaymentData.payment_mode === "Bank" ? "checked" : "unchecked"}
                    onPress={(text) => handleChange("payment_mode", "Bank")}
                    color={primaryColor}
                    uncheckedColor={primaryColor}
                  />
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 6,
                    opacity: 0.6,
                    fontSize: responsiveFontSize(2),
                    fontFamily: "Regular",
                  }}
                >
                  Bank
                </Text>
              </View>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Remarks</Text>
              <TextInput
                style={[styles.input, { borderRadius: responsiveWidth(2) }]}
                numberOfLines={3}
                textAlignVertical="top"
                multiline={true}
                onChangeText={(text) => handleChange("remark", text)}
                value={editPaymentData.remark}
              />
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Payment Date</Text>
              <TextInput
                style={[styles.adddateinput]}
                value={
                  editPaymentData.payment_date ? formatDate(editPaymentData.payment_date) : ""
                }
                editable={false}
                onChangeText={(text) => handleConfirm("payment_date", text)}
              />
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={showStartDatePicker}
              >
                <FontAwesome5 name="calendar-alt" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              <TouchableOpacity style={styles.onlybtn} onPress={() => updatePayment(editPaymentData.id)}>
                <Text style={styles.onlybtntext}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            date={editPaymentData.payment_date ? new Date(editPaymentData.payment_date) : new Date()}
            onConfirm={handleConfirm}
            onCancel={hideStartDatePicker}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditPayment;
