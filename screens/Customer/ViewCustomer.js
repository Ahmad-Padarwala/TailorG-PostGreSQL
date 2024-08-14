import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Linking,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  dangerColor,
  lightGray,
  primaryColor,
  styles,
  whiteColor,
} from "../../styles/style";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import axios from "axios";
import { Checkbox } from "react-native-paper";
const PORT = process.env.EXPO_PUBLIC_API_URL;
const { width, height } = Dimensions.get('screen');
const ViewCustomer = ({ route }) => {
  const navigation = useNavigation();
  const id = route.params.id;

  const [customerData, setCustomerData] = useState(null);
  const getCustomerDataWithId = async () => {
    try {
      const response = await axios.get(`${PORT}/getcustomerdatawithid/${id}`);
      const customerRows = response.data.rows[0];
      setCustomerData(customerRows);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
  };
  const Phone = (e) => {
    Linking.openURL(`tel:${e}`);
  };
  const getFirstCharacter = (str) => {
    if (str && str.length > 0) {
      const [firstCharacter] = str;
      return firstCharacter;
    }
    return "";
  };

  //delete
  const [deleteButtonDisable, setDeleteButtonDisable] = useState(true);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const deleteCustomer = async () => {
    try {
      await axios.delete(`${PORT}/deleteCustomerData/${customerData.id}`);
      navigation.navigate("Customers")
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
  };
  useEffect(() => {
    getCustomerDataWithId();
  }, []);
  // useEffect(() => {
  //   setDeleteButtonDisable(!isCheckboxSelected);
  // }, [isCheckboxSelected]);
  useEffect(() => {
    setDeleteButtonDisable(
      !(isCheckboxSelected && confirmationName === customerData?.customer_name)
    );
  }, [isCheckboxSelected, confirmationName, customerData]);

  if (!customerData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
    );
  }
  return (
    <>
      <View
        style={[
          styles.headerwithline,
          { flexDirection: "row", backgroundColor: lightGray },
        ]}
      >
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
              fontSize: width * 0.053,
              fontFamily: "Medium",
            }}
          >
            Profile
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView
          style={{
            backgroundColor: whiteColor,
            flex: 1,
          }}
        >
          <View>
            <View style={styles.protop}>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View
                  style={[
                    styles.profilelater,
                    {
                      backgroundColor: customerData.bg_color
                        ? customerData.bg_color
                        : primaryColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        textAlign: "center",
                        fontSize: width * 0.16,
                        color: whiteColor,
                        fontFamily: "Regular",
                        marginTop: height * 0.015,
                      },
                    ]}
                  >
                    {getFirstCharacter(customerData.customer_name)}
                  </Text>
                </View>
                <Text style={[styles.titletext, { textAlign: "center", paddingHorizontal: responsiveWidth(1) }]}>
                  {customerData.customer_name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Phone(customerData.mobile_number);
                  }}
                >
                  <Text
                    style={[
                      styles.desctext,
                      { lineHeight: responsiveHeight(3) },
                    ]}
                  >
                    +91 {customerData.mobile_number}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                marginHorizontal: responsiveWidth(10),
                marginTop: responsiveHeight(1.3),
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("customerOrder", { custId: id })
                }
              >
                <View style={styles.spacebetween}>
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <MaterialCommunityIcons
                        name="clipboard-text"
                        size={20}
                        color="black"
                      />
                    </Text>
                    <Text style={styles.prolistfont}>Orders</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("measurement", {
                    custId: id,
                    cust_name: customerData.customer_name,
                  })
                }
              >
                <View
                  style={[
                    styles.spacebetween,
                    { marginVertical: responsiveHeight(2) },
                  ]}
                >
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <MaterialIcons
                        name="straighten"
                        size={20}
                        color="black"
                      />
                    </Text>
                    <Text style={styles.prolistfont}>Meassurement</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("allPayments", { customId: id })
                }
              >
                <View
                  style={[
                    styles.spacebetween,
                    { marginVertical: responsiveHeight(2) },
                  ]}
                >
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <MaterialIcons name="payments" size={20} color="black" />
                    </Text>
                    <Text style={styles.prolistfont}>Payments</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: "#d9d9d9",
                  marginVertical: responsiveHeight(2),
                }}
              ></View>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("editcustomerprofile", { editId: id })
                }
              >
                <View
                  style={[
                    styles.spacebetween,
                    { marginVertical: responsiveHeight(2) },
                  ]}
                >
                  <View style={styles.flexstart}>
                    <Text style={styles.proicon}>
                      <MaterialCommunityIcons
                        name="account"
                        size={20}
                        color="black"
                      />
                    </Text>
                    <Text style={styles.prolistfont}>Profile</Text>
                  </View>
                  <Text>
                    <AntDesign name="right" size={16} color="black" />
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ marginTop: responsiveHeight(7) }}>
                <TouchableOpacity
                  onPress={() => {
                    setIsDeleteModalVisible(true);
                  }}
                  style={[styles.onlybtn, { backgroundColor: dangerColor }]}
                >
                  <Text style={styles.onlybtntext}>
                    <Ionicons name="trash" size={14}></Ionicons> Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
                    Are you sure you want to delete{" "}
                    <Text style={{ fontWeight: "700" }}>
                      {customerData.customer_name}{" "}
                    </Text>
                    and all their associated data including orders,
                    measurements, and payments ?
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "90%",
                  }}
                >
                  <Checkbox
                    status={isCheckboxSelected ? "checked" : "unchecked"}
                    onPress={() => setIsCheckboxSelected(!isCheckboxSelected)}
                    color={dangerColor}
                  />
                  <Text
                    style={{
                      fontFamily: "Regular",
                      fontSize: responsiveFontSize(2),
                      marginTop: responsiveHeight(1),
                    }}
                  >
                    Yes, Delete
                  </Text>
                </View>
                <View style={{ marginTop: responsiveHeight(1), width: "100%" }}>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: lightGray,
                      borderRadius: 5,
                      paddingVertical: responsiveHeight(1.5),
                      paddingHorizontal: responsiveWidth(5),
                      fontFamily: "Regular",
                      fontSize: responsiveFontSize(2),
                    }}
                    placeholder={`Type ${customerData.customer_name} to confirm`}
                    value={confirmationName}
                    onChangeText={setConfirmationName}
                  />
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
                        opacity: deleteButtonDisable ? 0.4 : 1,
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
                      onPress={deleteCustomer}
                      disabled={deleteButtonDisable}
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
        </SafeAreaView>
      </ScrollView >
    </>
  );
};

export default ViewCustomer;
