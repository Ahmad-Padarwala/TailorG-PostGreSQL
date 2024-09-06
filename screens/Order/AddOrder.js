import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { styles, primaryColor, dangerColor } from "../../styles/style";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from "../../middleware/AuthReducer";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const AddOrder = ({ route }) => {
  const navigation = useNavigation();
  const id = route.params.custId;
  const { userToken } = useContext(AuthContext);
  const [selectedDressType, setSelectedDressType] = useState(null);
  const [selectedMeasType, setSelectedMeasType] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMeasDropdownOpen, setIsMeasDropdownOpen] = useState(false);
  const [defaultPrice, setDefaultPrice] = useState(0);
  const [addOrder, setAddOrder] = useState({
    price: defaultPrice,
    qty: "1",
    order_date: new Date(),
    delivery_date: new Date(),
    special_note: "",
    urgent: "no",
    customer_measurement_id: selectedMeasType,
    customer_id: id,
    shop_id: userToken,
    dress_id: "",
  });

  //getting dress data
  const [dressData, setDressData] = useState([]);
  const getDressData = async () => {
    try {
      const response = await axios.get(`${PORT}/getalldresses/${userToken}`, {
        params: { gender: "All" },
      });
      const customerRows = response.data.rows;
      setDressData(customerRows);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
  };
  //get measurement data
  const [measurementData, setMeasurementData] = useState([]);
  const getMeasurementData = async (dressid) => {
    try {
      const response = await axios.get(
        `${PORT}/getmeasurementdatawithdressId/${dressid}/${id}/${userToken}`
      );
      setMeasurementData(response.data.rows);
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
  //getting body parts
  const [measureBodyData, setMeasureBodyData] = useState([]);
  const getMeasureBodyData = async (id) => {
    try {
      const response = await axios.get(`${PORT}/getbodypartsdata/${id}`);
      setMeasureBodyData(response.data.rows);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
  };
  const handleSelect = (item) => {
    setSelectedDressType(item);
    setAddOrder((prevOrder) => ({ ...prevOrder, dress_id: item.id }));
    setDefaultPrice(item.dress_price);
    setAddOrder((prevOrder) => ({ ...prevOrder, price: item.dress_price }));
    setIsDropdownOpen(false);
    getMeasurementData(item.id);
  };
  const handleMeasSelect = (item) => {
    getMeasureBodyData(item.id);
    setSelectedMeasType(item);
    setAddOrder((prevOrder) => ({
      ...prevOrder,
      customer_measurement_id: item.id,
    }));
    setIsMeasDropdownOpen(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.measuremntcard}>
      <Text style={styles.measerlabel}>{item.bp_part_name}</Text>
      <Text style={styles.measeureinput}>{item.meval_value}</Text>
    </View>
  );

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
  const truncateString = (text, len) => {
    if (text.length > len) {
      return text.substring(0, len) + "...";
    }
    return text;
  };
  const handleOrderDateConfirm = (date) => {
    setAddOrder((prevData) => ({
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
    setAddOrder((prevData) => ({
      ...prevData,
      delivery_date: date,
    }));
    hideDeliveryDatePicker();
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  //change
  const handleChange = (name, value) => {
    setAddOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  //getting total amount from amount and rounded
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    const amount = parseFloat(addOrder.price) || 0;
    const quantity = parseFloat(addOrder.qty) || 0;
    setTotalAmount(amount * quantity);
  }, [addOrder.price, addOrder.qty]);

  //save order data
  const saveOrderData = async () => {
    const cid = addOrder.customer_id;
    if (addOrder.dress_id == "") {
      alert("Please Select Customer Dress");
      return;
    }
    if (addOrder.customer_measurement_id == null) {
      alert("Please Select Customer Measurement");
      return;
    }
    try {
      const response = await axios.post(`${PORT}/addcustomerorder`, addOrder);
      if (response.status === 200) {
        const { orderId } = response.data;
        navigation.navigate("orderconfirmed", { orderId, cid });
      } else {
        console.log("Error in add order");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDressData();
    getPathData();
  }, []);

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
              Add New Order
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
              <Text style={styles.label}>
                Select Dress Type <Text style={{ color: dangerColor }}>*</Text>
              </Text>
              <View>
                <TouchableOpacity
                  style={styles.dressTypeSelectbutton}
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedDressType ? (
                    <View style={styles.selectedItemContainer}>
                      {
                        selectedDressType.dress_image == "NoImage.jpg" ? (
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
                              uri: `${pathData}/uploads/dresses/${selectedDressType.dress_image}`,
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
                        {truncateString(selectedDressType.dress_name, 13)}
                      </Text>
                      <View
                        style={
                          selectedDressType.gender == "male"
                            ? styles.genderMale
                            : styles.genderFeMale
                        }
                      >
                        <Text style={styles.genderDropDownMeaserText}>
                          {selectedDressType.gender}
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
                      Select Dress Type
                    </Text>
                  )}
                  <Ionicons
                    name={
                      isDropdownOpen
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={22}
                    color="black"
                  />
                </TouchableOpacity>
                {isDropdownOpen && (
                  <ScrollView
                    style={[styles.mainMeasermentdropdown]}
                    nestedScrollEnabled={true}
                  >
                    {dressData.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleSelect(item)}
                        style={{
                          flex: 0,
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 10,
                        }}
                      >
                        <View
                          style={{
                            flex: 0,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <View style={styles.mainDropdownMeaserIcon}>
                            {
                              item.dress_image == "NoImage.jpg" ? (
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
                                    uri: `${pathData}/uploads/dresses/${item.dress_image}`,
                                  }}
                                  style={{
                                    width: responsiveWidth(8),
                                    height: responsiveHeight(4),
                                    borderRadius: 3,
                                  }}
                                />
                              )
                            }

                          </View>
                          <View>
                            <Text style={styles.dropdownMeaserText}>
                              {truncateString(item.dress_name, 13)}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={
                            item.gender == "male"
                              ? styles.genderMale
                              : styles.genderFeMale
                          }
                        >
                          <Text style={styles.genderDropDownMeaserText}>
                            {item.gender}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>
            {/* price */}
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
                  <TouchableOpacity>
                    <MaterialIcons
                      name="autorenew"
                      size={23}
                      style={{
                        marginHorizontal: responsiveWidth(3),
                        color: primaryColor,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <TextInput
                    style={[styles.input, { borderRadius: 5 }]}
                    keyboardType="numeric"
                    value={addOrder.price}
                    onChangeText={(value) => handleChange("price", value)}
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
                    value={addOrder.qty}
                    onChangeText={(value) => handleChange("qty", value)}
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
                    {totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.inputfield, { marginTop: responsiveHeight(2.5) }]}
            >
              <Text style={styles.label}>Order Date</Text>
              <TextInput
                style={[styles.adddateinput]}
                editable={false}
                value={
                  addOrder.order_date ? formatDate(addOrder.order_date) : ""
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
            {/* date */}
            <View style={styles.inputfield}>
              <Text style={styles.label}>Delivery Date</Text>
              <TextInput
                style={[styles.adddateinput]}
                editable={false}
                value={
                  addOrder.delivery_date
                    ? formatDate(addOrder.delivery_date)
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
            {/* note */}
            <View
              style={[styles.inputfield, { marginTop: responsiveHeight(2.5) }]}
            >
              <Text style={styles.label}>Special Note</Text>
              <TextInput
                placeholder="Special Note"
                style={[styles.input, { borderRadius: responsiveWidth(2) }]}
                numberOfLines={3}
                textAlignVertical="top"
                multiline={true}
                value={addOrder.special_note}
                onChangeText={(value) => handleChange("special_note", value)}
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
                  status={addOrder.urgent === "yes" ? "checked" : "unchecked"}
                  onPress={(value) => handleChange("urgent", "yes")}
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
                    status={addOrder.urgent === "no" ? "checked" : "unchecked"}
                    // onPress={() => setChecked("no")}
                    onPress={(value) => handleChange("urgent", "no")}
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
              <View
                style={{
                  flex: 0,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.label}>
                  Select Measurement{" "}
                  <Text style={{ color: dangerColor }}>*</Text>
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate("addMeasurement", id)} style={{ flex: 0, flexDirection: "row" }}>
                  <View>
                    <Ionicons
                      name="add"
                      style={{
                        fontFamily: "Regular",
                        marginTop: responsiveHeight(0.2),
                      }}
                      size={17}
                    />
                  </View>
                  <View>
                    <Text
                      style={{ fontFamily: "Regular", color: primaryColor }}
                    >
                      Add New
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  style={styles.dressTypeSelectbutton}
                  onPress={() => setIsMeasDropdownOpen(!isMeasDropdownOpen)}
                  disabled={!selectedDressType}
                >
                  {selectedMeasType ? (
                    <View style={styles.selectedItemContainer}>
                      <Text style={styles.dropdownMeaserText}>
                        {selectedMeasType.name}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2),
                        fontFamily: "Regular",
                      }}
                    >
                      Select Measurement
                    </Text>
                  )}
                  <Ionicons
                    name={
                      isMeasDropdownOpen
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={22}
                    color="black"
                  />
                </TouchableOpacity>
                {isMeasDropdownOpen && (
                  <ScrollView
                    style={[styles.mainMeasermentdropdown]}
                    nestedScrollEnabled={true}
                  >
                    {
                      measurementData.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleMeasSelect(item)}
                          style={{
                            flex: 0,
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <View
                            style={{
                              flex: 0,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View>
                              <Text style={styles.dropdownMeaserText}>
                                {item.name}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))
                    }
                  </ScrollView>
                )}
              </View>
            </View>

            <View
              style={[
                styles.mainMeaserContainer,
                { marginBottom: responsiveHeight(3) },
              ]}
            >
              {measureBodyData == "" ? (
                ""
              ) : (
                <Text style={styles.label}>Body Parts</Text>
              )}
              <View style={styles.addMeasurementgrid}>
                <FlatList
                  data={measureBodyData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  numColumns={3}
                  columnWrapperStyle={styles.addMeasurementgrid}
                  scrollEnabled={false}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              marginHorizontal: responsiveWidth(8),
              marginTop: responsiveHeight(1),
            }}
          >
            <TouchableOpacity style={styles.onlybtn} onPress={saveOrderData}>
              <Text style={styles.onlybtntext}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* //date picker */}
        <DateTimePickerModal
          isVisible={isOrderDatePickerVisible}
          mode="date"
          date={new Date(addOrder.order_date)}
          onConfirm={handleOrderDateConfirm}
          onCancel={hideOrderDatePicker}
        />
        <DateTimePickerModal
          isVisible={isdeliveryDatePickerVisible}
          mode="date"
          date={new Date(addOrder.delivery_date)}
          onConfirm={handleDeliveryDateConfirm}
          onCancel={hideDeliveryDatePicker}
        />
      </SafeAreaView>
    </>
  );
};

export default AddOrder;
