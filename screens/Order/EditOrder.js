import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { styles, primaryColor } from "../../styles/style";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const EditOrder = ({ route }) => {
  const navigation = useNavigation();
  const orderId = route.params.orderId;
  const [loading, setLoading] = useState(true);
  const [newEditedOrder, setNewEditedOrder] = useState({});
  //get order
  const [editOrder, setEditOrder] = useState([]);
  const getCustomerOrder = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getviewcustomerorder/${orderId}`
      );
      setEditOrder(response.data.rows);
      setLoading(false);
    } catch (error) {
      console.error(error + "error in getting order data in order page");
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    let pdate = new Date(date);
    const day = pdate.getDate().toString().padStart(2, "0");
    const month = (pdate.getMonth() + 1).toString().padStart(2, "0");
    const year = pdate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  useFocusEffect(
    React.useCallback(() => {
      getCustomerOrder();
      // getDressData();
    }, [orderId])
  );

  useEffect(() => {
    if (editOrder.length > 0) {
      setNewEditedOrder({
        price: editOrder[0].price || "0",
        qty: editOrder[0].qty || "1",
        order_date: editOrder[0].order_date || new Date(),
        delivery_date: editOrder[0].delivery_date || new Date(),
        special_note: editOrder[0].special_note || "",
        urgent: editOrder[0].urgent || "no",
        customer_measurement_id: editOrder[0].customer_measurement_id || "",
        customer_id: editOrder[0].customer_id || "",
        dress_id: editOrder[0].dress_id || "",
      });
    }
  }, [editOrder]);

  const handleChange = (field, value) => {
    setNewEditedOrder((prevOrder) => ({
      ...prevOrder,
      [field]: value,
    }));
  };

  //for date managing code.
  const [isOrderDatePickerVisible, setOrderDatePickerVisibility] =
    useState(false);
  const [isdeliveryDatePickerVisible, setdeliveryDatePickerVisibility] =
    useState(false);

  const showOrderDatePicker = () => {
    setOrderDatePickerVisibility(true);
  };
  const hideOrderDatePicker = () => {
    setOrderDatePickerVisibility(false);
  };
  const handleOrderDateConfirm = (date) => {
    setNewEditedOrder((prevData) => ({
      ...prevData,
      order_date: date,
    }));
    hideOrderDatePicker();
  };

  //delevery date
  const showDeliveryDatePicker = () => {
    setdeliveryDatePickerVisibility(true);
  };
  const hideDeliveryDatePicker = () => {
    setdeliveryDatePickerVisibility(false);
  };
  const handleDeliveryDateConfirm = (date) => {
    setNewEditedOrder((prevData) => ({
      ...prevData,
      delivery_date: date,
    }));
    hideDeliveryDatePicker();
  };

  const truncateString = (text, len) => {
    if (text.length > len) {
      return text.substring(0, len) + "...";
    }
    return text;
  };
  //update order
  const updateOrderData = async () => {
    try {
      const response = await axios.put(
        `${PORT}/updatecustomerorderdata/${orderId}`,
        newEditedOrder
      );
      if (response.status === 200) {
        navigation.goBack();
      } else {
        console.log("Error in add order");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={primaryColor} />
      </SafeAreaView>
    );
  }
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
              Edit Order - {editOrder[0].id}
            </Text>
          </View>
        </View>

        <View style={styles.line70}></View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginBottom: responsiveHeight(1),
          }}
        >
          <View style={[styles.form, { marginTop: responsiveHeight(5) }]}>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Dress Type</Text>
              <View style={styles.dressTypeSelectbutton}>
                {editOrder ? (
                  <View style={styles.selectedItemContainer}>
                    {
                      editOrder[0].dress_image == "NoImage.jpg" ? (
                        <Image
                          source={require('../../assets/images/NoImage.jpg')}
                          style={{
                            width: responsiveWidth(8),
                            height: responsiveHeight(4),
                            borderRadius: 3,
                          }}
                        />
                      ) : (
                        <Image
                          source={{
                            uri: `${PORT}/uploads/dresses/${editOrder[0].dress_image}`,
                          }}
                          style={{
                            width: responsiveWidth(8),
                            height: responsiveHeight(4),
                            borderRadius: 3,
                          }}
                        />
                      )
                    }
                    <Text style={styles.dropdownMeaserText}>
                      {truncateString(editOrder[0].dress_name, 13)}
                    </Text>
                    <View
                      style={
                        editOrder[0].gender == "male"
                          ? styles.genderMale
                          : styles.genderFeMale
                      }
                    >
                      <Text style={styles.genderDropDownMeaserText}>
                        {editOrder[0].gender}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2),
                      fontFamily: "Regular",
                    }}
                  >
                    No Dress Type Selected
                  </Text>
                )}
              </View>
            </View>

            <View style={{ flex: 0, flexDirection: "row" }}>
              <View
                style={{
                  width: responsiveWidth(25),
                  marginRight: responsiveWidth(5),
                }}
              >
                <View style={{ flex: 0, flexDirection: "row" }}>
                  <View>
                    <Text style={styles.label}>Price</Text>
                  </View>
                  <View>
                    <MaterialIcons
                      name="autorenew"
                      size={23}
                      style={{
                        marginHorizontal: responsiveWidth(3),
                        color: primaryColor,
                      }}
                    />
                  </View>
                </View>
                <View>
                  <TextInput
                    style={[styles.input, { borderRadius: 5 }]}
                    keyboardType="numeric"
                    value={newEditedOrder.price}
                    onChangeText={(text) => handleChange("price", text)}
                  ></TextInput>
                </View>
              </View>

              <View
                style={{
                  width: responsiveWidth(18),
                  marginRight: responsiveWidth(5),
                }}
              >
                <View>
                  <Text style={styles.label}>Qty</Text>
                </View>
                <View>
                  <TextInput
                    style={[styles.input, { borderRadius: 5 }]}
                    keyboardType="numeric"
                    value={newEditedOrder.qty}
                    onChangeText={(text) => handleChange("qty", text)}
                  ></TextInput>
                </View>
              </View>

              <View
                style={{
                  width: responsiveWidth(30),
                  marginRight: responsiveWidth(5),
                }}
              >
                <View style={styles.orderTotalAmount}>
                  <Text style={{ fontFamily: "Regular" }}>Total Amount</Text>
                </View>
                <View style={{ marginTop: responsiveHeight(2) }}>
                  <Text style={{ fontFamily: "SemiBold" }}>
                    {newEditedOrder.price * newEditedOrder.qty}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ marginTop: responsiveHeight(2) }}>
              <Text style={styles.label}>Order Date</Text>
              <TextInput
                style={[styles.adddateinput]}
                editable={false}
                value={
                  newEditedOrder.order_date
                    ? formatDate(newEditedOrder.order_date)
                    : ""
                }
                onChangeText={(text) =>
                  handleOrderDateConfirm("order_date", text)
                }
              ></TextInput>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={showOrderDatePicker}
              >
                <FontAwesome5 name="calendar-alt" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: responsiveHeight(2) }}>
              <Text style={styles.label}>Delivery Date</Text>
              <TextInput
                style={[styles.adddateinput]}
                editable={false}
                value={
                  newEditedOrder.delivery_date
                    ? formatDate(newEditedOrder.delivery_date)
                    : ""
                }
                onChangeText={(text) =>
                  handleOrderDateConfirm("delivery_date", text)
                }
              ></TextInput>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={showDeliveryDatePicker}
              >
                <FontAwesome5 name="calendar-alt" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View
              style={[styles.inputfield, { marginTop: responsiveHeight(2.5) }]}
            >
              <Text style={styles.label}>Special Note</Text>
              <TextInput
                placeholder="Special Note"
                style={[styles.input, { borderRadius: responsiveWidth(2) }]}
                numberOfLines={3}
                textAlignVertical="top"
                value={newEditedOrder.special_note}
                multiline={true}
                onChangeText={(text) => handleChange("special_note", text)}
              />
            </View>

            <View>
              <Text style={styles.label}>Is It Urgent?</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <RadioButton
                  value="yes"
                  status={
                    newEditedOrder.urgent === "yes" ? "checked" : "unchecked"
                  }
                  onPress={() => handleChange("urgent", "yes")}
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
                  Yes
                </Text>

                <View style={{ marginLeft: 10 }}>
                  <RadioButton
                    value="no"
                    status={
                      newEditedOrder.urgent === "no" ? "checked" : "unchecked"
                    }
                    onPress={() => handleChange("urgent", "no")}
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
                  No
                </Text>
              </View>
            </View>

            <View
              style={[styles.inputfield, { marginTop: responsiveHeight(1.5) }]}
            >
              <View>
                <Text style={styles.label}>Measurement Type</Text>
              </View>

              <View
                style={[
                  styles.orderViewDetails,
                  { marginTop: responsiveHeight(0) },
                ]}
              >
                <Text style={styles.dropdownMeaserText}>
                  {editOrder[0].name}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.mainMeaserContainer,
                { marginBottom: responsiveHeight(3) },
              ]}
            >
              <Text style={styles.label}>Measurement</Text>
              <View style={styles.addMeasurementgrid}>
                {editOrder.map((measurement, index) => (
                  <View key={index} style={styles.measuremntcard}>
                    <Text style={styles.measerlabel}>
                      {measurement.part_name.charAt(0).toUpperCase() +
                        measurement.part_name.slice(1)}
                    </Text>
                    <Text style={styles.measeureinput}>
                      {measurement.mea_value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View
            style={{
              marginHorizontal: responsiveWidth(8),
              marginTop: responsiveHeight(1),
            }}
          >
            <TouchableOpacity
              style={styles.onlybtn}
              onPress={() => {
                updateOrderData();
              }}
            >
              <Text style={styles.onlybtntext}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* //date picker */}
        <DateTimePickerModal
          isVisible={isOrderDatePickerVisible}
          mode="date"
          date={new Date(newEditedOrder.order_date)}
          onConfirm={handleOrderDateConfirm}
          onCancel={hideOrderDatePicker}
        />
        <DateTimePickerModal
          isVisible={isdeliveryDatePickerVisible}
          mode="date"
          date={new Date(newEditedOrder.delivery_date)}
          onConfirm={handleDeliveryDateConfirm}
          onCancel={hideDeliveryDatePicker}
        />
      </SafeAreaView>
    </>
  );
};

export default EditOrder;