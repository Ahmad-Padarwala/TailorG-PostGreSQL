import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { RadioButton } from "react-native-paper";
import {
  styles,
  primaryColor,
  secondaryColor,
  whiteColor,
  dangerColor,
} from "../../styles/style";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const ViewOrder = ({ route }) => {
  const orderId = route.params.orderid;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  // State to store the order data
  const [viewOrder, setViewOrder] = useState([]);
  const getCustomerOrder = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getviewcustomerorder/${orderId}`
      );
      setViewOrder(response.data.rows);
      setEditSelectedStatus(response.data.rows[0].status);
      setLoading(false);
    } catch (error) {
      console.error(error + " error in getting order data in order page");
      setLoading(false);
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
    }, [orderId])
  );
  useFocusEffect(
    React.useCallback(() => {
      getPathData();
    }, [])
  );

  //delete
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const deleteOrder = async () => {
    try {
      await axios.delete(`${PORT}/deleteorder/${orderId}`);
      navigation.goBack();
    } catch (error) {
      console.error(error + "error in deleting order");
    }
  };

  //status edit
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [editSelectedStatus, setEditSelectedStatus] = useState("");
  const updateOrderStatus = async () => {
    if (editSelectedStatus == "") {
      alert("Please Select Order Status");
      return;
    }
    try {
      const response = await axios.put(
        `${PORT}/editcustomerorderstatus/${orderId}`,
        {
          status: editSelectedStatus,
        }
      );
      if (response.status === 200) {
        getCustomerOrder();
        setIsStatusModalVisible(false);
      }
    } catch (error) {
      console.error(
        error + "error in the editing customer data in edit customer!"
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size={70} color={primaryColor} />
      </SafeAreaView>
    );
  }

  // Ensure the viewOrder array has at least one element before accessing its properties
  if (viewOrder.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
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
            No Order Found
          </Text>
        </View>
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
              Order - {viewOrder[0].id}
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
          <View style={{ marginHorizontal: responsiveWidth(9) }}>
            <View style={styles.orderViewMain}>
              <View style={{ width: responsiveWidth(20) }}>
                <View
                  style={[
                    styles.imageContainer,
                    {
                      width: responsiveWidth(20),
                      height: responsiveHeight(10.8),
                    },
                  ]}
                >

                  {
                    viewOrder[0].dress_image == "NoImage.jpg" ? (
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
                          uri: `${pathData}/uploads/dresses/${viewOrder[0].dress_image}`,
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
                <View>
                  <Text style={{ textAlign: "center", fontFamily: "Regular" }}>
                    {viewOrder[0].dress_name}
                  </Text>
                </View>
              </View>
              <View style={{ marginHorizontal: responsiveWidth(2), maxWidth: responsiveWidth(64), flexWrap: "nowrap" }}>
                <Text
                  style={{
                    fontFamily: "SemiBold",
                    fontSize: responsiveFontSize(1.8),
                  }}
                >
                  {viewOrder[0].customer_name}
                </Text>
                <View style={{ flex: 0, flexDirection: "row" }}>
                  <Text
                    style={{
                      fontFamily: "Regular",
                      fontSize: responsiveFontSize(1.7),
                    }}
                  >
                    Order Date : {" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Regular",
                      color: secondaryColor,
                      fontSize: responsiveFontSize(1.7),
                    }}
                  >
                    {formatDate(viewOrder[0].order_date)}
                  </Text>
                </View>
                <View style={{ flex: 0, flexDirection: "row" }}>
                  <Text
                    style={{
                      fontFamily: "Regular",
                      fontSize: responsiveFontSize(1.7),
                    }}
                  >
                    Delivery Date :{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Regular",
                      color: dangerColor,
                      fontSize: responsiveFontSize(1.7),
                    }}
                  >
                    {formatDate(viewOrder[0].delivery_date)}
                  </Text>
                </View>
                <View style={{ flex: 0, flexDirection: "row" }}>
                  <Text
                    style={{
                      fontFamily: "Regular",
                      fontSize: responsiveFontSize(1.7),
                    }}
                  >
                    Urgent :{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Regular",
                      color: secondaryColor,
                      fontSize: responsiveFontSize(1.7),
                      textTransform: "capitalize",
                    }}
                  >
                    {viewOrder[0].urgent}
                  </Text>
                </View>
                <View
                  style={[
                    viewOrder.length > 0 && viewOrder[0].gender == "male"
                      ? styles.genderMale
                      : styles.genderFeMale,
                    { marginLeft: responsiveWidth(0) },
                  ]}
                >
                  {viewOrder.length > 0 && (
                    <Text
                      style={[
                        styles.genderDropDownMeaserText,
                        { textTransform: "capitalize" },
                      ]}
                    >
                      {viewOrder[0].gender}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.orderViewTotalAmount}>
              <View
                style={{
                  flex: 0,
                  flexDirection: "row",
                  borderBottomColor: secondaryColor,
                  borderBottomWidth: responsiveWidth(0.5),
                  borderStyle: "dashed",
                }}
              >
                <View
                  style={{
                    width: responsiveWidth(18),
                    marginRight: responsiveWidth(5),
                  }}
                >
                  <Text style={{ fontFamily: "Regular" }}>Price</Text>
                </View>
                <View
                  style={{
                    width: responsiveWidth(15),
                    marginRight: responsiveWidth(5),
                  }}
                >
                  <Text style={{ fontFamily: "Regular" }}>Qty</Text>
                </View>
                <View>
                  <Text style={{ fontFamily: "Regular" }}>Total Amount</Text>
                </View>
              </View>
              <View style={{ flex: 0, flexDirection: "row" }}>
                <View
                  style={{
                    width: responsiveWidth(18),
                    marginRight: responsiveWidth(5),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Regular",
                      marginTop: responsiveHeight(1),
                    }}
                  >
                    {viewOrder[0].price}
                  </Text>
                </View>
                <View
                  style={{
                    width: responsiveWidth(15),
                    marginRight: responsiveWidth(5),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Regular",
                      marginTop: responsiveHeight(1),
                    }}
                  >
                    {viewOrder[0].qty}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "Regular",
                      marginTop: responsiveHeight(1),
                    }}
                  >
                    {viewOrder[0].price * viewOrder[0].qty}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={[styles.label, { marginTop: responsiveHeight(3), }]}>Measurement Name</Text>
            <View style={styles.orderViewDetails}>
              <Text style={styles.dropdownMeaserText}>{viewOrder[0].name}</Text>
            </View>

            <View
              style={[
                styles.mainMeaserContainer,
                { marginTop: responsiveHeight(4) },
              ]}
            >
              <Text style={styles.label}>Measurement</Text>
              <View style={styles.addMeasurementgrid}>
                {viewOrder.map((measurement, index) => (
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

            <View style={[styles.inputfield]}>
              <Text style={styles.label}>Special Note</Text>
              <TextInput
                style={[
                  styles.input,
                  { borderRadius: responsiveWidth(2), color: "black" },
                ]}
                numberOfLines={3}
                textAlignVertical="top"
                multiline={true}
                value={viewOrder[0].special_note || ""}
                editable={false}
              />
            </View>

            <Text style={styles.label}>Status :</Text>
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "85%" }}>
                <Text
                  style={[
                    styles.input,
                    {
                      borderRadius: responsiveWidth(2),
                      paddingVertical: responsiveHeight(1),
                      fontFamily: "Regular",
                      textTransform: "capitalize",
                    },
                  ]}
                  textAlignVertical="top"
                >
                  {viewOrder[0].status}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setIsStatusModalVisible(true);
                }}
                style={{
                  width: "12%",
                }}
              >
                <View
                  style={{
                    backgroundColor: primaryColor,
                    flex: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 39,
                    width: 39,
                    borderRadius: 100,
                  }}
                >
                  <MaterialIcons name="edit" size={18} color={whiteColor} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.btngroup,
            {
              marginHorizontal: responsiveWidth(8),
              marginTop: responsiveHeight(2),
              paddingBottom: responsiveHeight(1.5),
              justifyContent: "space-between",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setIsDeleteModalVisible(true);
            }}
            style={[
              styles.btnactive,
              {
                backgroundColor: dangerColor,
                shadowColor: dangerColor,
                shadowOffset: {
                  width: 5,
                  height: 7,
                },
                shadowOpacity: 5,
                shadowRadius: 7.68,
                elevation: 15,
              },
            ]}
          >
            <Text
              style={[
                styles.btntext,
                {
                  color: whiteColor,
                  paddingHorizontal: responsiveWidth(10),
                  fontSize: responsiveFontSize(2),
                },
              ]}
            >
              <Ionicons name="trash" size={14}></Ionicons> Delete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnactive,
              styles.active,
              {
                shadowColor: primaryColor,
                shadowOffset: {
                  width: 5,
                  height: 7,
                },
                shadowOpacity: 5,
                shadowRadius: 7.68,
                elevation: 15,
              },
            ]}
            onPress={() => {
              navigation.navigate("editOrder", { orderId: orderId });
            }}
          >
            <Text
              style={[
                styles.btntext,
                styles.active,
                {
                  fontSize: responsiveFontSize(2),
                  paddingHorizontal: responsiveWidth(13),
                },
              ]}
            >
              <Ionicons name="pencil" size={14}></Ionicons> Edit
            </Text>
          </TouchableOpacity>
        </View>
        {/* delete modal */}
        <Modal
          animationType="slide"
          transparent
          visible={isDeleteModalVisible}
          presentationStyle="overFullScreen"
          onDismiss={() => {
            setIsDeleteModalVisible(false);
          }}
        >
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    marginBottom: responsiveHeight(2),
                  }}
                >
                  <Ionicons
                    name="trash"
                    size={35}
                    color={dangerColor}
                  ></Ionicons>
                </Text>
                <Text
                  style={{
                    fontFamily: "Regular",
                    fontSize: responsiveFontSize(2),
                  }}
                >
                  Are You Sure You Want To Delete Order ?
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: responsiveHeight(2),
                  marginBottom: responsiveHeight(0),
                }}
              >
                <View
                  style={[
                    styles.modelAlertbtn,
                    {
                      backgroundColor: "white",
                      borderColor: dangerColor,
                      borderWidth: 2,
                      marginRight: responsiveWidth(3.4),
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setIsDeleteModalVisible(false);
                    }}
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.3),
                        fontFamily: "Regular",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.modelAlertbtn,
                    {
                      marginLeft: responsiveWidth(3.4),
                      paddingVertical: responsiveWidth(2),
                      backgroundColor: dangerColor,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={deleteOrder}
                  >
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.3),
                        color: whiteColor,
                        fontFamily: "Regular",
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/* staus modal */}
        <Modal
          animationType="slide"
          transparent
          visible={isStatusModalVisible}
          presentationStyle="overFullScreen"
          onDismiss={() => {
            setIsStatusModalVisible(false);
          }}
        >
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: responsiveFontSize(2),
                }}
              >
                Change Order {viewOrder[0].id} Status
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <RadioButton
                  value="active"
                  status={
                    editSelectedStatus === "active" ? "checked" : "unchecked"
                  }
                  onPress={() => setEditSelectedStatus("active")}
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
                  Active
                </Text>

                <View style={{ marginLeft: 10 }}>
                  <RadioButton
                    value="progress"
                    status={
                      editSelectedStatus === "progress"
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => setEditSelectedStatus("progress")}
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
                  Progress
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <RadioButton
                  value="ready"
                  status={
                    editSelectedStatus === "ready" ? "checked" : "unchecked"
                  }
                  onPress={() => setEditSelectedStatus("ready")}
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
                  Ready
                </Text>

                <View style={{ marginLeft: 10 }}>
                  <RadioButton
                    value="delivered"
                    status={
                      editSelectedStatus === "delivered"
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => setEditSelectedStatus("delivered")}
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
                  Delivered
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: responsiveHeight(2),
                  marginBottom: responsiveHeight(0),
                }}
              >
                <View
                  style={[
                    styles.modelAlertbtn,
                    {
                      backgroundColor: "white",
                      borderColor: dangerColor,
                      borderWidth: 2,
                      marginRight: responsiveWidth(3.4),
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setIsStatusModalVisible(false);
                    }}
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.3),
                        fontFamily: "Regular",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.modelAlertbtn,
                    {
                      marginLeft: responsiveWidth(3.4),
                      paddingVertical: responsiveWidth(2),
                      backgroundColor: primaryColor,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      updateOrderStatus();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.3),
                        color: whiteColor,
                        fontFamily: "Regular",
                      }}
                    >
                      Update
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default ViewOrder;
