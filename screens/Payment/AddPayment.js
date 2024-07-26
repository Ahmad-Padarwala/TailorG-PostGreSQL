import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import {
  styles,
  whiteColor,
  primaryColor,
  dangerColor,
} from "../../styles/style";
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
import { AuthContext } from "../../middleware/AuthReducer";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const AddPayment = ({ route }) => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const id = route.params.customId;
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
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

  //get cusromer name for showing cusromer name
  const [editCustomerData, setEditCustomerData] = useState([]);
  const getCustomerDataWithId = async () => {
    try {
      const response = await axios.get(`${PORT}/getcustomerdatawithid/${id}`);
      const customerRows = response.data.rows[0];
      setEditCustomerData(customerRows);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
  };

  //add payment code section start
  const [addPayment, setAddPayment] = useState({
    amount: "",
    rounded: "0",
    payment_mode: "Cash",
    remark: "",
    payment_date: new Date(),
    recieved_by: "",
    customer_id: id,
    shop_id: userToken,
  });

  const handleChange = (name, value) => {
    setAddPayment((prevProdData) => ({
      ...prevProdData,
      [name]: value,
    }));
  };
  const saveAddData = () => {
    if (addPayment.amount == "") {
      alert("Please Insert amount");
      return;
    }

    axios
      .post(`${PORT}/addpaymentData`, addPayment)
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => {
        console.error(err + "error in adding customer data");
      });
  };

  useEffect(() => {
    if (shopData.first_name) {
      setAddPayment((prevPayment) => ({
        ...prevPayment,
        recieved_by: shopData.first_name,
      }));
    }
  }, [shopData]);

  useEffect(() => {
    getCustomerDataWithId();
    getShopData();
  }, []);

  //for date managing code
  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setAddPayment((prevData) => ({
      ...prevData,
      payment_date: date,
    }));
    hideStartDatePicker();
  };
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  //getting total amount from amount and rounded
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    const amount = parseFloat(addPayment.amount) || 0;
    const rounded = parseFloat(addPayment.rounded) || 0;
    setTotalAmount(amount + rounded);
  }, [addPayment.amount, addPayment.rounded]);

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
              Add Payment
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
                <Text style={[styles.label]}>
                  Received Amount <Text style={{ color: dangerColor }}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Received Amount"
                  keyboardType="numeric"
                  onChangeText={(text) => handleChange("amount", text)}
                  value={addPayment.amount}
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
                    placeholder="Rounded"
                    keyboardType="numeric"
                    onChangeText={(text) => handleChange("rounded", text)}
                    value={addPayment.rounded || 0}
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
                  <Text style={{ fontWeight: "bold" }}>
                    {totalAmount.toFixed(2)}
                  </Text>
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
                  status={
                    addPayment.payment_mode === "Cash" ? "checked" : "unchecked"
                  }
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
                    status={
                      addPayment.payment_mode === "Bank"
                        ? "checked"
                        : "unchecked"
                    }
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
                placeholder="Remarks"
                style={[styles.input, { borderRadius: responsiveWidth(2) }]}
                numberOfLines={3}
                textAlignVertical="top"
                multiline={true}
                onChangeText={(text) => handleChange("remark", text)}
                value={addPayment.remark}
              />
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Payment Date</Text>
              <TextInput
                style={[styles.adddateinput]}
                value={
                  addPayment.payment_date
                    ? formatDate(addPayment.payment_date)
                    : ""
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
              <TouchableOpacity style={styles.onlybtn} onPress={saveAddData}>
                <Text style={styles.onlybtntext}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            date={new Date(addPayment.payment_date)}
            onConfirm={handleConfirm}
            onCancel={hideStartDatePicker}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AddPayment;
