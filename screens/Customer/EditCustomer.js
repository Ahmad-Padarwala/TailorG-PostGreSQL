import React, { useEffect, useState } from "react";
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
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const EditCustomer = ({ route }) => {
  const navigation = useNavigation();
  const id = route.params.editId;

  const [editCustomerData, setEditCustomerData] = useState({
    customer_name: "",
    mobile_number: "",
    email: "",
    address: "",
    pincode: "",
    gender: "",
    created_date: new Date(),
    shop_id: 1,
  });
  const getCustomerDataWithId = async () => {
    try {
      const response = await axios.get(`${PORT}/getcustomerdatawithid/${id}`);
      setEditCustomerData(response.data.rows[0]);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
  };
  const handleChange = (name, value) => {
    setEditCustomerData((prevProdData) => ({
      ...prevProdData,
      [name]: value,
    }));
  };
  useEffect(() => {
    getCustomerDataWithId();
  }, []);
  const pin = editCustomerData.pincode.toString();

  const updateCustomerData = async () => {
    if (editCustomerData.customer_name == "") {
      alert("Please Insert Customer Name");
      return;
    }
    if (editCustomerData.mobile_number == "") {
      alert("Please Insert Customer Mobile Number");
      return;
    }
    if (editCustomerData.mobile_number.length < 10) {
      alert("Please atleast enter 10 digit");
      return;
    }
   
    try {
      const response = await axios.put(`${PORT}/editcustomerdata/${id}`, editCustomerData)
      if (response.status === 200) {
        navigation.navigate("Customers")
      }
    } catch (error) {
      console.error(error + "error in the editing customer data in edit customer!");
    }
  }


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
              Edit Customer
            </Text>
          </View>
        </View>

        <View style={styles.line70}></View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.form, { marginTop: responsiveHeight(5) }]}>
            <View>
              <View style={styles.inputfield}>
                <Text style={styles.label}>Customer Name <Text style={{ color: dangerColor }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleChange("customer_name", text)}
                  value={editCustomerData.customer_name}
                ></TextInput>
              </View>
              <View style={styles.inputfield}>
                <Text style={styles.label}>Mobile Number <Text style={{ color: dangerColor }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  // maxLength={10}
                  keyboardType="numeric"
                  onChangeText={(text) => handleChange("mobile_number", text)}
                  value={editCustomerData.mobile_number}
                ></TextInput>
              </View>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange("email", text)}
                value={editCustomerData.email}
              ></TextInput>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Select Gender</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <RadioButton
                  value={editCustomerData.gender}
                  status={editCustomerData.gender === "male" ? "checked" : "unchecked"}
                  onPress={() => handleChange("gender", "male")}
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
                  Male
                </Text>

                <View style={{ marginLeft: 10 }}>
                  <RadioButton
                    value={editCustomerData.gender}
                    status={editCustomerData.gender === "female" ? "checked" : "unchecked"}
                    onPress={() => handleChange("gender", "female")}
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
                  Female
                </Text>
              </View>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, { borderRadius: responsiveWidth(2) }]}
                numberOfLines={3}
                textAlignVertical="top"
                multiline={true}
                onChangeText={(text) => handleChange("address", text)}
                value={editCustomerData.address}
              />
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={(text) => handleChange("pincode", text)}
                value={pin}
              ></TextInput>
            </View>

            <View style={{ marginTop: 20 }}>
              <TouchableOpacity style={styles.onlybtn} onPress={updateCustomerData}>
                <Text style={styles.onlybtntext}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditCustomer;
