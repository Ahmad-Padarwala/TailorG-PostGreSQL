import React, { useState, useContext } from "react";
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
import { AuthContext } from "../../middleware/AuthReducer";
import { RadioButton } from "react-native-paper";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const AddCustomer = () => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const colors = [
    "#56BC1F",
    "#BC1F1F",
    "gray",
    "#124E78",
    "#6FDCE3",
    "#615EFC",
    "#5AB2FF",
    "#77B0AA",
    "#E9C874",
    "#bb9457",
    "#0e9594",
  ];
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  const [addCustomer, setAddCustomer] = useState({
    customer_name: "",
    mobile_number: "",
    email: "",
    address: "",
    pincode: "",
    gender: "male",
    created_date: new Date(),
    bg_color: getRandomColor(),
    shop_id: userToken,
  });

  const handleChange = (name, value) => {
    setAddCustomer((prevProdData) => ({
      ...prevProdData,
      [name]: value,
    }));
  };

  const saveAddData = () => {
    if (addCustomer.customer_name == "") {
      alert("Please Insert Customer Name");
      return;
    }
    if (addCustomer.mobile_number == "") {
      alert("Please Insert Customer Mobile Number");
      return;
    }
    if (addCustomer.mobile_number.length < 10) {
      alert("Please atleast enter 10 digit");
      return;
    }
    axios
      .post(`${PORT}/addCuatomerData`, addCustomer)
      .then((res) => {
        navigation.navigate("Customers");
      })
      .catch((err) => {
        console.error(err + "error in adding customer data");
      });
  };

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
              Add New Customer
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
                  placeholder="Customer Name"
                  onChangeText={(text) => handleChange("customer_name", text)}
                  value={addCustomer.customer_name}
                ></TextInput>
              </View>
              <View style={styles.inputfield}>
                <Text style={styles.label}>Mobile Number <Text style={{ color: dangerColor }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Mobile Number"
                  maxLength={10}
                  keyboardType="numeric"
                  onChangeText={(text) => handleChange("mobile_number", text)}
                  value={addCustomer.mobile_number}
                ></TextInput>
              </View>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Email"
                onChangeText={(text) => handleChange("email", text)}
                value={addCustomer.email}
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
                  status={
                    addCustomer.gender === "male" ? "checked" : "unchecked"
                  }
                  onPress={() => handleChange("gender", "male")}
                  color={primaryColor}
                  uncheckedColor={primaryColor}
                  value="male"
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
                    status={
                      addCustomer.gender === "female" ? "checked" : "unchecked"
                    }
                    onPress={() => handleChange("gender", "female")}
                    color={primaryColor}
                    uncheckedColor={primaryColor}
                    value="female"
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
                placeholder="Address"
                style={[styles.input, { borderRadius: responsiveWidth(2) }]}
                numberOfLines={3}
                textAlignVertical="top"
                multiline={true}
                onChangeText={(text) => handleChange("address", text)}
                value={addCustomer.address}
              />
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Pincode"
                keyboardType="numeric"
                onChangeText={(text) => handleChange("pincode", text)}
                value={addCustomer.pincode}
              ></TextInput>
            </View>

            <View style={{ marginTop: 20 }}>
              <TouchableOpacity style={styles.onlybtn} onPress={saveAddData}>
                <Text style={styles.onlybtntext}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AddCustomer;
